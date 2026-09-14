"use server"

import { revalidatePath } from "next/cache"

import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import { createClient } from "@/lib/supabase/server"

export type InstantIncomeSavedPost = {
  id: string
  body: string
  /** ISO timestamp when the member marked this draft as posted. */
  usedAt?: string
}

export type InstantIncomePostSet = {
  id: string
  name: string
  affiliateUrl: string
  niche: string
  posts: InstantIncomeSavedPost[]
  createdAt: string
  updatedAt: string
}

type ActionOk<T> = { success: true } & T
type ActionFail = { success: false; error: string }
type ActionResult<T extends object = object> = ActionOk<T> | ActionFail

function missingTableError(message: string) {
  return /instant_income_post_sets|schema cache|does not exist|42P01/i.test(message)
}

const MISSING_TABLE_MESSAGE =
  "Posts library isn’t set up on this database yet. Run scripts/012_create_instant_income_post_sets.sql in the Supabase SQL editor."

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

function parsePosts(raw: unknown): InstantIncomeSavedPost[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null
      const row = item as { id?: unknown; body?: unknown; usedAt?: unknown }
      if (typeof row.id !== "string" || typeof row.body !== "string") return null
      const body = row.body.trim()
      if (!body) return null
      const usedAt = typeof row.usedAt === "string" && row.usedAt.trim() ? row.usedAt.trim() : undefined
      return usedAt ? { id: row.id, body, usedAt } : { id: row.id, body }
    })
    .filter((p): p is InstantIncomeSavedPost => p != null)
}

function mapRow(row: {
  id: string
  name: string
  affiliate_url: string
  niche: string
  posts: unknown
  created_at: string
  updated_at: string
}): InstantIncomePostSet {
  return {
    id: row.id,
    name: row.name,
    affiliateUrl: row.affiliate_url,
    niche: row.niche,
    posts: parsePosts(row.posts),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listInstantIncomePostSets(): Promise<
  ActionResult<{ sets: InstantIncomePostSet[] }>
> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const { data, error: queryError } = await supabase
      .from("instant_income_post_sets")
      .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (queryError) {
      if (missingTableError(queryError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[instant-income-sets] list failed:", queryError.message)
      return { success: false, error: "Couldn’t load your posts library. Please try again." }
    }

    return { success: true, sets: (data ?? []).map(mapRow) }
  } catch (error) {
    console.error("[instant-income-sets] list error:", error)
    return { success: false, error: "Couldn’t load your posts library. Please try again." }
  }
}

export async function upsertInstantIncomePostSet(input: {
  name: string
  affiliateUrl: string
  niche: string
  posts: InstantIncomeSavedPost[]
}): Promise<ActionResult<{ set: InstantIncomePostSet }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const name = input.name.trim()
    const affiliateUrl = input.affiliateUrl.trim()
    const niche = input.niche.trim()
    const posts = input.posts
      .map((p) => {
        const id = p.id.trim()
        const body = p.body.trim()
        const usedAt = p.usedAt?.trim()
        if (!id || !body) return null
        return usedAt ? { id, body, usedAt } : { id, body }
      })
      .filter((p): p is InstantIncomeSavedPost => p != null)

    if (!name) return { success: false, error: "Add a name for this link / generation." }
    if (!isValidAffiliateUrl(affiliateUrl)) {
      return { success: false, error: "Use a full link that starts with https://" }
    }
    if (!niche) return { success: false, error: "Pick a niche first." }
    if (posts.length === 0) return { success: false, error: "No posts to save." }

    const nameKey = name.toLowerCase()

    const { data: existingRows, error: listError } = await supabase
      .from("instant_income_post_sets")
      .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
      .eq("user_id", user.id)

    if (listError) {
      if (missingTableError(listError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[instant-income-sets] lookup failed:", listError.message)
      return { success: false, error: "Couldn’t save this set. Please try again." }
    }

    const matched =
      (existingRows ?? []).find((row) => row.name.trim().toLowerCase() === nameKey) ?? null

    const now = new Date().toISOString()

    if (matched) {
      const { data, error: updateError } = await supabase
        .from("instant_income_post_sets")
        .update({
          name,
          affiliate_url: affiliateUrl,
          niche,
          posts,
          updated_at: now,
        })
        .eq("id", matched.id)
        .eq("user_id", user.id)
        .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
        .single()

      if (updateError || !data) {
        console.error("[instant-income-sets] update failed:", updateError?.message)
        return { success: false, error: "Couldn’t update this set. Please try again." }
      }

      revalidatePath("/upgrades/instant-income")
      return { success: true, set: mapRow(data) }
    }

    const { data, error: insertError } = await supabase
      .from("instant_income_post_sets")
      .insert({
        user_id: user.id,
        name,
        affiliate_url: affiliateUrl,
        niche,
        posts,
      })
      .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
      .single()

    if (insertError || !data) {
      if (missingTableError(insertError?.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[instant-income-sets] insert failed:", insertError?.message)
      return { success: false, error: "Couldn’t save this set. Please try again." }
    }

    revalidatePath("/upgrades/instant-income")
    return { success: true, set: mapRow(data) }
  } catch (error) {
    console.error("[instant-income-sets] upsert error:", error)
    return { success: false, error: "Couldn’t save this set. Please try again." }
  }
}

export async function markInstantIncomePostUsed(
  setId: string,
  postId: string,
): Promise<ActionResult<{ set: InstantIncomePostSet }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const id = setId.trim()
    const pid = postId.trim()
    if (!id || !pid) return { success: false, error: "Invalid post." }

    const { data: row, error: fetchError } = await supabase
      .from("instant_income_post_sets")
      .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle()

    if (fetchError) {
      if (missingTableError(fetchError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[instant-income-sets] mark-used fetch failed:", fetchError.message)
      return { success: false, error: "Couldn’t update this post. Please try again." }
    }

    if (!row) return { success: false, error: "Set not found." }

    const posts = parsePosts(row.posts)
    const index = posts.findIndex((p) => p.id === pid)
    if (index === -1) return { success: false, error: "Post not found." }
    if (posts[index].usedAt) {
      return { success: true, set: mapRow(row) }
    }

    const now = new Date().toISOString()
    const nextPosts = posts.map((p, i) => (i === index ? { ...p, usedAt: now } : p))

    const { data, error: updateError } = await supabase
      .from("instant_income_post_sets")
      .update({ posts: nextPosts, updated_at: now })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("id, name, affiliate_url, niche, posts, created_at, updated_at")
      .single()

    if (updateError || !data) {
      console.error("[instant-income-sets] mark-used update failed:", updateError?.message)
      return { success: false, error: "Couldn’t mark this post as used. Please try again." }
    }

    revalidatePath("/upgrades/instant-income")
    return { success: true, set: mapRow(data) }
  } catch (error) {
    console.error("[instant-income-sets] mark-used error:", error)
    return { success: false, error: "Couldn’t mark this post as used. Please try again." }
  }
}

export async function deleteInstantIncomePostSet(
  setId: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const { supabase, user, error } = await requireUser()
    if (!user) return { success: false, error }

    const id = setId.trim()
    if (!id) return { success: false, error: "Invalid set." }

    const { error: deleteError } = await supabase
      .from("instant_income_post_sets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (deleteError) {
      if (missingTableError(deleteError.message ?? "")) {
        return { success: false, error: MISSING_TABLE_MESSAGE }
      }
      console.error("[instant-income-sets] delete failed:", deleteError.message)
      return { success: false, error: "Couldn’t delete this set. Please try again." }
    }

    revalidatePath("/upgrades/instant-income")
    return { success: true, id }
  } catch (error) {
    console.error("[instant-income-sets] delete error:", error)
    return { success: false, error: "Couldn’t delete this set. Please try again." }
  }
}
