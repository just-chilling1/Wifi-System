import { INSTANT_INCOME_NICHES, INSTANT_INCOME_POST_COUNT, type InstantIncomeNiche } from "./niches"
import { resolveOfferLabel } from "./offer-label"

const GENERIC_POSTS = [
  `I spent months jumping between advice that was not even for my situation. What finally helped was {PRODUCT} — it is actually built for this, not a recycled pep talk.

I followed it for a few weeks without overhauling my whole life. The difference was having steps that matched the problem I actually had.

If you are tired of generic tips, this is what I used:

{LINK}

Not magic. Just the first thing that felt specific.`,
  `The mistake I made was treating every "this worked for me" post like it was written for my niche. Most of them were not.

{PRODUCT} is the first thing I tried that spoke to the same problem I was posting about. I was skeptical. I bookmarked it and ignored it. Then I actually started.

If that sounds familiar:

{LINK}

Take what helps. Ignore the rest.`,
  `Someone in another group asked what I changed, and I got tired of typing the same paragraph.

I used {PRODUCT}. Honest version, including the slow first week, is here:

{LINK}

Happy to answer questions if you are in the same boat.`,
  `I almost scrolled past this because I have been burned by vague promises.

What sold me was that {PRODUCT} was aimed at the exact thing I was stuck on, not "mindset" in general. A few weeks in, the day-to-day feels different.

If you want the resource I used:

{LINK}

No pressure. I just wish I had stopped guessing sooner.`,
  `I wish I had found {PRODUCT} before I wasted another month on advice that was not even for my problem.

It is not a personality transplant. It is a plan I could keep doing on a normal week. That is all I needed.

Start here if you are in the same place I was:

{LINK}

Do not wait for a Monday. I did that for a long time.`,
]

const NICHE_POSTS: Record<InstantIncomeNiche, string[]> = {
  "Weight Loss": [
    `I need to get this off my chest because six months ago I would have scrolled right past a post like this.

I was stuck at the same weight for almost two years. New diet every Monday, done by Thursday. I was not lazy. I was exhausted.

A friend sent me {PRODUCT}. I almost did not open it. Six weeks later I was down 12 pounds without starving myself or living at the gym. My jeans button without that awful inhale.

If you are tired of starting over every week, this is what finally clicked:

{LINK}

Not saying it is magic. Just saying it is the first thing that did not make me hate the process.`,
    `Okay I have to share this because I have been the queen of yo-yo dieting for most of my adult life.

Lose 8 pounds. Gain 12. Repeat. Every program promised I would be a new person in 30 days. I always quit by day 12 because I was hungry and still cooking two dinners for the house.

I stopped looking for a punishment plan and tried {PRODUCT}. Started slow. Did not announce it to anyone.

I am down 18 pounds. I sleep better. I am not thinking about food every hour.

If you have been on that same ride:

{LINK}

Take what helps. I am just putting it here in case someone else needed to hear that it does not have to be miserable.`,
    `Who else is tired of diets that do not work?

I used to collect meal plans like souvenirs. Keto. Juice. Fasting until I passed out at 11am. Real life kept wrecking the rules — birthdays, travel, late nights.

Last month I needed something simple that would not fall apart after a slice of cake. {PRODUCT} was that. I lost 15 pounds in the first month. Still going, because the plan did not punish me for being human.

If you are in that "I have tried everything" headspace:

{LINK}

Drop a comment if you are in the same boat. You are not broken. The plans probably were.`,
    `This is going to sound small, but it meant everything to me.

I pulled a shirt out of the dryer last week and it actually fit. Not "fits if I do not sit down." Fit.

I did not overhaul my entire life. I followed {PRODUCT} without a personal chef or a 5am gym membership. Down 20 pounds. More energy in the afternoon. Not skipping photos.

If you want to see what I used:

{LINK}

No pressure. I just wish someone had posted something like this when I was still buying bigger jeans and calling it a style choice.`,
    `I was extremely skeptical. Every "this changed my life" post looked like an ad.

I bookmarked {PRODUCT} on a Sunday night when I was frustrated enough to try one more thing. Eight weeks later I am down 22 pounds. No gimmick shakes. No wrapping myself in plastic. Just a process I could repeat on a normal week.

If you are the skeptical one in the group (I usually am):

{LINK}

I am not here to argue. I am here because someone else's honest post is what made me click.`,
  ],
  "Make Money Online": [
    `I have to say this out loud because last year I would have rolled my eyes at my own post.

I was collecting courses like they were going to expire. Funnel hacks. Secret groups. I would implement 10% and jump to the next shiny thing.

{PRODUCT} was the first thing I actually finished. Not because it was magic — because it was one path instead of twelve. A few weeks of boring repetition later, I had something working.

If you are drowning in tabs:

{LINK}

I am not promising a number. I am saying this is what stopped the hopping.`,
    `The part nobody told me is that most "make money online" advice is written to sell the next lesson, not to get you paid.

I wasted months on that. {PRODUCT} was the opposite — fewer modules, clearer next step, no income screenshots screaming at me.

If you want the version I wish I had found first:

{LINK}

No guru voice. Just what I followed.`,
    `I kept starting "offers" I did not even understand. That was my whole strategy.

What changed was picking one thing in this niche and giving it more than two weeks. {PRODUCT} laid the steps out in order so I stopped guessing.

Wrote it here so I do not have to re-explain it in five groups:

{LINK}

If you have been restarting every Monday, this might sound familiar.`,
    `I was skeptical because every post promised a new life by Friday.

{PRODUCT} did not. It asked me to do unglamorous work and check results after a stretch of consistency. That is the first time anything in this space felt honest.

If you are tired of hype:

{LINK}

Take it or leave it. I just needed one thing that did not insult my intelligence.`,
    `I wish I had found {PRODUCT} before I bought three more "done for you" kits I never opened.

The turning point was not a mindset shift. It was a sequence I could actually complete on nights after work.

If you are late to this like I was:

{LINK}

Start with one thing you will finish. That is the advice I needed last year.`,
  ],
  "Health & Fitness": [
    `I kept starting over every few weeks and wondering why nothing stuck. My plan only worked on perfect weeks.

{PRODUCT} met me on the messy weeks. Shorter sessions. Clearer recovery. I finally stopped treating fitness like an on/off switch.

Six weeks in, I feel like a person who works out, not a person who is "getting back into it."

If that cycle is you:

{LINK}`,
    `The advice that helped most was the least exciting: do less, more often.

I used to punish myself with workouts I could not repeat. {PRODUCT} flipped that. I actually look forward to the check-ins instead of dreading them.

If you have only ever experienced fitness as misery:

{LINK}

You do not have to love day one. I just needed it to stop feeling like a fight.`,
    `I almost skipped my last checkup because I already knew the lecture. Move more. I had heard it for years.

This visit was different. I had been following {PRODUCT} long enough that I had something real to report — energy, sleep, showing up.

If you have been avoiding the "you should exercise" talk:

{LINK}

I am not a coach. I am someone who finally had a better week and wanted to pass along what I used.`,
    `Who else is tired of programs built for people with a spare two hours and a private gym?

I needed something that survived kids, work, and a living room floor. {PRODUCT} was the first plan that respected that.

If your schedule is the problem, not your willpower:

{LINK}`,
    `I was skeptical of another fitness "system." Most of them assume you already have the habit.

{PRODUCT} started where I actually was. A few weeks later I am consistent for the first time in years — not because I became disciplined overnight, because the plan did not collapse on a busy Tuesday.

Here is what I used:

{LINK}`,
  ],
  "Beauty & Skincare": [
    `My bathroom shelf was a graveyard of products I used twice.

I was layering things that fought each other and wondering why my skin was angry. {PRODUCT} simplified it. Fewer steps, actually meant for the issue I had, not a 12-step routine from someone with different skin.

A few weeks in, I stopped camouflaging and started noticing.

If your cabinet looks like mine:

{LINK}`,
    `I spent years chasing "glow" and ending up dry, shiny, or both.

What finally helped was stopping the random hauls and following {PRODUCT} like a process instead of a shopping list.

If you are tired of buying hope in a bottle:

{LINK}

Not a miracle. Just the first routine I stuck with.`,
    `I almost did not post this because skincare posts get roasted.

Fine. I was skeptical too. {PRODUCT} is what I used after my usual "this will be the one" products sat unopened. My skin looks calmer. Makeup sits better. That is the update.

If you want the thing I actually finished:

{LINK}`,
    `The small win: I left the house without concealer and did not think about it until lunch.

That has not been me in a long time. {PRODUCT} did not turn me into a different person. It just stopped the cycle of stripping and overcorrecting.

Here is what I followed:

{LINK}`,
    `I wish I had found {PRODUCT} before I wasted another paycheck on a trend that was not for my skin.

Simple. Repeatable. Aimed at the problem I kept describing in groups like this.

If that is you:

{LINK}`,
  ],
  Relationships: [
    `I kept reading relationship advice that sounded like it was written for someone in a totally different situation.

{PRODUCT} was the first thing that talked about the pattern I was actually stuck in — not generic "communicate more."

A few weeks of doing the exercises, things at home feel less like walking on eggshells.

If you are tired of vague quotes:

{LINK}`,
    `I was the person who screenshotted advice and never used it.

What changed was {PRODUCT} giving me something to try in one conversation, not a personality transplant. Still messy. Better than silent resentment.

If you want the resource I used:

{LINK}`,
    `I almost did not share this because it feels private.

We were looping the same argument. {PRODUCT} helped me see the loop instead of winning the round. Not perfect. Progress.

If you are in that loop:

{LINK}`,
    `Skeptical does not cover it. Most relationship content is either toxic or a TED talk.

{PRODUCT} was practical. Short. Aimed at the same niche of problems people post about here.

Here is what I used:

{LINK}`,
    `I wish I had found {PRODUCT} before we wasted another year assuming the other person could read our mind.

It is not magic. It is a way of talking we could actually practice on a weeknight.

If that sounds familiar:

{LINK}`,
  ],
  "Tech & Gadgets": [
    `I kept buying gadgets I used twice because I never had a clear setup.

{PRODUCT} was the first guide that matched the exact thing I was trying to make work — not a 40-minute review that never answers the "is this for me" question.

If you are drowning in tabs and returns:

{LINK}`,
    `I was skeptical because tech posts are usually affiliate spam.

Fair. {PRODUCT} still saved me from buying the wrong thing. I followed the checklist, skipped the upsells that were not for my use case, and actually use what I got.

If you want what I used:

{LINK}`,
    `The mistake was chasing specs instead of the job I needed done.

{PRODUCT} flipped that. I stopped comparing 14 models and picked the one that fit how I actually work.

Breakdown here:

{LINK}`,
    `Small win: I finally stopped fighting my setup every morning.

{PRODUCT} walked through the boring configuration steps nobody puts in the ads. Took an evening. Worth it.

If your "smart" stuff feels dumb:

{LINK}`,
    `I wish I had found {PRODUCT} before I returned the last two things that were almost right.

Same niche, actual use cases, no hype spec sheet.

Start here:

{LINK}`,
  ],
  Pets: [
    `I have to share this because I was one more failed "tip" away from thinking my dog was just like this forever.

We were stuck on the same problem for months. Random YouTube clips made it worse. {PRODUCT} was the first thing that spoke to that specific issue instead of generic "be the pack leader" talk.

A few weeks of the actual steps, we are both calmer.

If you are tired of advice that does not match your animal:

{LINK}`,
    `I kept collecting pet advice like it was going to expire. None of it fit our situation.

{PRODUCT} did. Clearer why, fewer tricks, something I could do after work without a professional on speed dial.

If that is your household:

{LINK}`,
    `Skeptical pet parent here. Most of these posts are selling something that has nothing to do with the animal you actually have.

{PRODUCT} was aimed at the same niche of problem I keep seeing in this group. I tried it. We are not perfect. We are better.

Here is what I used:

{LINK}`,
    `Small win this week: a walk that did not feel like a battle.

That used to be rare. {PRODUCT} gave me a sequence instead of "try harder."

If you want the resource:

{LINK}`,
    `I wish I had found {PRODUCT} before I wasted another month on generic pet hacks.

It is not a personality transplant for your animal. It is a plan for the problem we were actually dealing with.

Start here:

{LINK}`,
  ],
  "Home & Garden": [
    `I kept pinning home projects I never finished because the advice assumed I already knew the basics.

{PRODUCT} started where I actually was. One project. Clear materials. No "simply renovate the kitchen" energy.

The first thing I finished in months is done. That feeling is addictive.

If your saved folder is a graveyard:

{LINK}`,
    `I was skeptical of another home "system." Most of them are shopping lists.

{PRODUCT} told me what to skip. That saved more money than any haul.

If you want what I followed:

{LINK}`,
    `The mistake was buying tools for a job I had not defined.

{PRODUCT} flipped that. I picked one corner of the house, followed the steps, and stopped turning weekends into hardware-store therapy.

If that is you:

{LINK}`,
    `Small win: I walked into the room and did not immediately want to close the door.

{PRODUCT} was the plan. Not a full makeover. Just the thing that made the space usable.

Here:

{LINK}`,
    `I wish I had found {PRODUCT} before I started three projects and finished none.

Same niche, actual sequence, something a tired person can do after work.

Start here:

{LINK}`,
  ],
}

function fillTemplate(template: string, productLabel: string, promoLink: string): string {
  return template.split("{PRODUCT}").join(productLabel).split("{LINK}").join(promoLink)
}

/**
 * Niche-keyed Facebook drafts for when AI is unavailable.
 * Each template names the offer so fallback copy is still about this product.
 */
export function buildInstantIncomeFallbackPosts(input: {
  niche: string
  productName: string
  promoLink: string
  count?: number
}): string[] {
  const count = input.count ?? INSTANT_INCOME_POST_COUNT
  const productLabel = resolveOfferLabel(input.productName, input.niche)
  const nicheKey = INSTANT_INCOME_NICHES.find((item) => item.toLowerCase() === input.niche.trim().toLowerCase())
  const pool = nicheKey ? NICHE_POSTS[nicheKey] : GENERIC_POSTS
  const selected: string[] = []

  for (let index = 0; index < count; index += 1) {
    selected.push(fillTemplate(pool[index % pool.length], productLabel, input.promoLink))
  }

  return selected
}
