"use server"

import { revalidatePath } from "next/cache"

import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { createClient } from "@/lib/supabase/server"

export type PremiumGenerationFeature = "dfy_profit" | "dfy_vault"

export type PremiumGenerationSet = {
  id: string
  feature: PremiumGenerationFeature
  name: string
  affiliateUrl: string
  niche: string
  payload: Record<string, unknown>
  usedKeys: Record<string, string>
  createdAt: string
  updatedAt: string
}

type ActionOk<T> = { success: true } & T
type ActionFail = { success: false; error: string }
type ActionResult<T extends object = object> = ActionOk<T> | ActionFail

function missingTableError(message: string) {
  return /premium_generation_sets|schema cache|does not exist|42P01/i.test(message)
}

const MISSING_TABLE_MESSAGE =
  "Generations library isn’t set up on this database yet. Run scripts/013_create_premium_generation_sets.sql in the Supabase SQL editor."

const FEATURE_PATH: Record<PremiumGenerationFeature, string> = {
  dfy_profit: "/upgrades/dfy-profit",
  dfy_vault: "/upgrades/dfy-vault",
}

async function requireUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null as null, error: "Not authenticated" }
  }

  return { supabase, user, error: null as null }
}

function parseUsedKeys(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!key.trim() || typeof value !== "string" || !value.trim()) continue
    out[key] = value.trim()
  }
  return out
}

function parsePayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return raw as Record<string, unknown>
}

function mapRow(row: {
  id: string
  feature: string
  name: string
  affiliate_url: string
  niche: string
  payload: unknown
  used_keys: unknown
  created_at: string
  updated_at: string
}): PremiumGenerationSet {
  return {
    id: row.id,
    feature: row.feature as PremiumGenerationFeature,
    name: row.name,
    affiliateUrl: row.affiliate_url,
    niche: row.niche,
    payload: parsePayload(row.payload),
    usedKeys: parseUsedKeys(row.used_keys),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const SELECT_COLUMNS =
  "id, feature, name, affiliate_url, niche, payload, used_keys, created_at, updated_at"

export async function listPremiumGenerationSets(
  feature: PremiumGenerationFeature,
): Promise<ActionResult<{ sets: PremiumGenerationSet[] }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { data, error: queryError } = await supabase
      .from("premium_generation_sets")
      .select(SELECT_COLUMNS)
      .eq("user_id", user.id)
      .eq("feature", feature)
      .order("updated_at", { ascending: false })

    if (queryError) {
      if (missingTableError(queryError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[premium-generation-sets] list failed:", queryError.message)
      return { success: false, error: "Couldn’t load your generations library. Please try again." }
    }

    return { success: true, sets: (data ?? []).map(mapRow) }
  } catch (error) {
    console.error("[premium-generation-sets] list error:", error)
    return { success: false, error: "Couldn’t load your generations library. Please try again." }
  }
}

export async function upsertPremiumGenerationSet(input: {
  feature: PremiumGenerationFeature
  name: string
  affiliateUrl: string
  niche?: string
  payload: Record<string, unknown>
  mergeUsedKeys?: boolean
}): Promise<ActionResult<{ set: PremiumGenerationSet }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const name = input.name.trim()
    const affiliateUrl = input.affiliateUrl.trim()
    const niche = (input.niche ?? "").trim()
    const payload = parsePayload(input.payload)

    if (!name) return { success: false, error: "Add a name for this generation." }
    if (!isValidAffiliateUrl(affiliateUrl)) {
      return { success: false, error: "Use a full link that starts with https://" }
    }

    const nameKey = name.toLowerCase()

    const { data: existingRows, error: listError } = await supabase
      .from("premium_generation_sets")
      .select(SELECT_COLUMNS)
      .eq("user_id", user.id)
      .eq("feature", input.feature)

    if (listError) {
      if (missingTableError(listError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[premium-generation-sets] lookup failed:", listError.message)
      return { success: false, error: "Couldn’t save this generation. Please try again." }
    }

    const matched =
      (existingRows ?? []).find((row) => row.name.trim().toLowerCase() === nameKey) ?? null

    const now = new Date().toISOString()
    const usedKeys =
      input.mergeUsedKeys !== false && matched ? parseUsedKeys(matched.used_keys) : {}

    if (matched) {
      const { data, error: updateError } = await supabase
        .from("premium_generation_sets")
        .update({
          name,
          affiliate_url: affiliateUrl,
          niche,
          payload,
          used_keys: usedKeys,
          updated_at: now,
        })
        .eq("id", matched.id)
        .eq("user_id", user.id)
        .select(SELECT_COLUMNS)
        .single()

      if (updateError || !data) {
        console.error("[premium-generation-sets] update failed:", updateError?.message)
        return { success: false, error: "Couldn’t update this generation. Please try again." }
      }

      revalidatePath(FEATURE_PATH[input.feature])
      return { success: true, set: mapRow(data) }
    }

    const { data, error: insertError } = await supabase
      .from("premium_generation_sets")
      .insert({
        user_id: user.id,
        feature: input.feature,
        name,
        affiliate_url: affiliateUrl,
        niche,
        payload,
        used_keys: {},
      })
      .select(SELECT_COLUMNS)
      .single()

    if (insertError || !data) {
      if (missingTableError(insertError?.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[premium-generation-sets] insert failed:", insertError?.message)
      return { success: false, error: "Couldn’t save this generation. Please try again." }
    }

    revalidatePath(FEATURE_PATH[input.feature])
    return { success: true, set: mapRow(data) }
  } catch (error) {
    console.error("[premium-generation-sets] upsert error:", error)
    return { success: false, error: "Couldn’t save this generation. Please try again." }
  }
}

export async function markPremiumGenerationItemUsed(
  setId: string,
  itemKey: string,
): Promise<ActionResult<{ set: PremiumGenerationSet }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const id = setId.trim()
    const key = itemKey.trim()
    if (!id || !key) return { success: false, error: "Invalid item." }

    const { data: row, error: fetchError } = await supabase
      .from("premium_generation_sets")
      .select(SELECT_COLUMNS)
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) {
      if (missingTableError(fetchError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[premium-generation-sets] mark-used fetch failed:", fetchError.message)
      return { success: false, error: "Couldn’t update this item. Please try again." }
    }

    if (!row) return { success: false, error: "Generation not found." }

    const usedKeys = parseUsedKeys(row.used_keys)
    if (usedKeys[key]) {
      return { success: true, set: mapRow(row) }
    }

    const now = new Date().toISOString()
    const { data, error: updateError } = await supabase
      .from("premium_generation_sets")
      .update({
        used_keys: { ...usedKeys, [key]: now },
        updated_at: now,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select(SELECT_COLUMNS)
      .single()

    if (updateError || !data) {
      console.error("[premium-generation-sets] mark-used update failed:", updateError?.message)
      return { success: false, error: "Couldn’t mark this item as used. Please try again." }
    }

    const feature = data.feature as PremiumGenerationFeature
    revalidatePath(FEATURE_PATH[feature])
    return { success: true, set: mapRow(data) }
  } catch (error) {
    console.error("[premium-generation-sets] mark-used error:", error)
    return { success: false, error: "Couldn’t mark this item as used. Please try again." }
  }
}

export async function deletePremiumGenerationSet(
  setId: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const id = setId.trim()
    if (!id) return { success: false, error: "Invalid generation." }

    const { data: existing, error: fetchError } = await supabase
      .from("premium_generation_sets")
      .select("id, feature")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) {
      if (missingTableError(fetchError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      return { success: false, error: "Couldn’t delete this generation. Please try again." }
    }

    const { error: deleteError } = await supabase
      .from("premium_generation_sets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (deleteError) {
      if (missingTableError(deleteError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[premium-generation-sets] delete failed:", deleteError.message)
      return { success: false, error: "Couldn’t delete this generation. Please try again." }
    }

    if (existing?.feature) {
      revalidatePath(FEATURE_PATH[existing.feature as PremiumGenerationFeature])
    }
    return { success: true, id }
  } catch (error) {
    console.error("[premium-generation-sets] delete error:", error)
    return { success: false, error: "Couldn’t delete this generation. Please try again." }
  }
}
