"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Copy,
  CheckCircle2,
  Facebook,
  Search,
  BookOpen,
  PenLine,
  Link2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  FolderOpen,
  Loader2,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GenerationProgress } from "@/components/generation-progress"
import { WelcomeOfferBanner } from "@/components/welcome-offer-banner"
import {
  PremiumControlCard,
  PremiumFeatureBanner,
  PremiumSteps,
} from "@/components/premium-feature-chrome"
import { PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { useScrollToResults } from "@/lib/use-scroll-to-results"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import { isValidAffiliateUrl } from "@/lib/affiliate-url"
import {
  deleteInstantIncomePostSet,
  markInstantIncomePostUsed,
  upsertInstantIncomePostSet,
  type InstantIncomePostSet,
} from "@/app/actions/instant-income-post-sets"

const INSTANT_STEPS = [
  {
    num: "1",
    title: "Pick your niche",
    desc: "Choose the niche that matches your affiliate offer — weight loss, make money online, health, beauty, and more.",
  },
  {
    num: "2",
    title: "Name your link",
    desc: "Paste your affiliate link and give it a name. We save each generation under that name in your posts library.",
  },
  {
    num: "3",
    title: "Copy and post",
    desc: "Copy a post, personalize it, and share it in groups that allow that kind of message. Reopen saved sets anytime.",
  },
] as const

const primaryCtaClass =
  "rounded-xl bg-grad-sapphire font-medium text-white shadow-sapphire transition-[background-color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:shadow-sapphire"

const outlineCtaClass =
  "rounded-xl border border-[var(--ds-line-strong)] bg-card font-medium text-ink transition-[background-color,border-color,color,box-shadow,transform] duration-[160ms] hover:-translate-y-px hover:border-primary hover:bg-primary-light hover:text-sapphire-700 hover:shadow-hover"

const GUIDE_STEPS = [
  {
    num: "1",
    icon: Search,
    title: "Find Facebook groups",
    items: [
      "Search keywords like “weight loss support”, “make money online”, or “fitness motivation”, then filter to Groups.",
      "Join 10–15 groups with 5,000+ members. Bigger rooms mean more people seeing a personal story.",
      "Wait for admin approval — usually 1–24 hours. Post only after you’re in.",
    ],
  },
  {
    num: "2",
    icon: BookOpen,
    title: "Read the group rules",
    items: [
      "Open About and check whether personal stories are allowed. Most groups ban hard selling, not honest updates.",
      "These drafts are written as personal stories so they usually fit — still read the rules first.",
      "If a group says no links, post the story and send the link in DMs to people who ask.",
    ],
  },
  {
    num: "3",
    icon: PenLine,
    title: "Post your message",
    items: [
      "Click Write something, paste your copied draft, then Post. Change the first line so it sounds like you.",
      "Best windows: 7–9 AM, 12–1 PM, and 7–9 PM. Post in 3–5 different groups per day — never blast every group at once.",
      "Reply to comments within an hour. Friendly replies keep the thread visible.",
    ],
  },
] as const

interface FacebookPost {
  id: string
  niche: string
  post: string
  earningsMin: number
  earningsMax: number
}

const facebookPosts: FacebookPost[] = [
  // Weight Loss
  {
    id: "wl-1",
    niche: "Weight Loss",
    post: `I need to get this off my chest because six months ago I would have scrolled right past a post like this.

I was stuck at the same weight for almost two years. I'd start a new diet every Monday, last until Thursday, then order takeout and tell myself I'd "be better next week." I wasn't lazy. I was exhausted. Counting every calorie made me miserable, and two-hour gym sessions after work were never going to happen with kids at home.

A friend in another group sent me this after I ranted about another failed plan. I almost didn't open it. I'm glad I did.

I followed it for six weeks without starving myself and without living at the gym. Down 23 pounds. My jeans button without that awful inhale. I have energy after dinner instead of collapsing on the couch.

If you're tired of starting over every week, this is what finally clicked for me:

[LINK]

Not saying it's magic. Just saying it's the first thing that didn't make me hate the process. Happy to answer questions in the comments.`,
    earningsMin: 75,
    earningsMax: 200,
  },
  {
    id: "wl-2",
    niche: "Weight Loss",
    post: `Okay I have to share this because I have been the queen of yo-yo dieting for most of my adult life.

Lose 8 pounds. Gain 12. Repeat. I had a closet of "someday" clothes and a very loud inner critic. Every program promised I'd be a new person in 30 days. I always quit by day 12 because I was hungry, cranky, and still cooking two dinners for the house.

This time I stopped looking for a punishment plan and looked for something I could actually live with. I found this, started slow, and didn't announce it to anyone so I wouldn't jinx it.

I'm down 18 pounds. I feel like myself again — not a smaller, sadder version of myself. I sleep better. I'm not thinking about food every hour.

If you've been on that same up-and-down ride, this is the resource I used:

[LINK]

Take what helps. Ignore the rest. I'm just putting it here in case someone else needed to hear that it doesn't have to be miserable.`,
    earningsMin: 60,
    earningsMax: 180,
  },
  {
    id: "wl-3",
    niche: "Weight Loss",
    post: `Who else is tired of diets that don't work? 🙋‍♀️

I used to collect meal plans like souvenirs. Keto. Juice. Intermittent fasting until I passed out at 11am. I knew the rules. I just couldn't stay on them because real life kept happening — birthdays, travel, late nights at work.

Last month I decided I was done with "perfect." I needed something simple that wouldn't fall apart the second I ate a slice of cake at a party.

I found this and actually stuck with it. Lost 15 pounds in the first month. Still going. Not because I became a different person overnight — because the plan didn't punish me for being human.

If you're in that "I've tried everything" headspace, this is what I used:

[LINK]

Drop a comment if you're in the same boat. You're not broken. The plans probably were.`,
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "wl-4",
    niche: "Weight Loss",
    post: `This is going to sound small, but it meant everything to me.

I pulled a shirt out of the dryer last week and it actually fit. Not "fits if I don't sit down." Fit. I've been buying a size up for years and pretending I liked oversized everything.

The scale moving is nice. Feeling my clothes change is what made it real. I'm down 20 pounds. I have more energy in the afternoon. I'm not skipping photos anymore.

I didn't overhaul my entire life. I followed a simple method that didn't require a personal chef or a 5am gym membership. Easiest thing I've tried, and I've tried a lot.

If you want to see what I used:

[LINK]

No pressure. I just wish someone had posted something like this when I was still buying bigger jeans and calling it a "style choice."`,
    earningsMin: 70,
    earningsMax: 190,
  },
  {
    id: "wl-5",
    niche: "Weight Loss",
    post: `I can't believe I'm saying this out loud, but losing weight is actually… kind of fun now?

That sentence would have made old me roll my eyes so hard. I used to treat weight loss like a second job I was failing at. Weigh-ins ruined my mornings. I associated "healthy" with restriction and guilt.

Then I found an approach that didn't feel like punishment. I started looking forward to the little check-ins instead of dreading them. Down 12 pounds so far and I don't feel deprived. I'm still eating food I like. I'm just not white-knuckling through every day.

If you've only ever experienced weight loss as misery, this is the thing that flipped it for me:

[LINK]

You don't have to love the process on day one. I didn't. I just needed it to stop feeling like a fight.`,
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "wl-6",
    niche: "Weight Loss",
    post: `I used to have a calorie-tracking app that knew more about me than my own family.

I'd log breakfast, then lunch, then spiral at 9pm because I "blew it." Hunger made me irritable. Weekends were a mess because I couldn't log restaurant food without guessing and then feeling like a liar.

I quit the tracking. I followed something simpler instead. No more living inside a numbers app. No more walking around hungry just to hit a target.

I'm down 25 pounds and I'm not going back to that lifestyle. I have a life. I want to eat dinner with people without doing math under the table.

If calorie counting has made you crazy too, this is what I switched to:

[LINK]

Real results. Real food. A lot less obsession. That's all I wanted.`,
    earningsMin: 80,
    earningsMax: 210,
  },
  {
    id: "wl-7",
    niche: "Weight Loss",
    post: `I almost didn't go to my last checkup because I was embarrassed about the number on the chart.

I'd been putting it off. I knew what they'd say. Move more. Eat less. I'd heard it for years and it never stuck for more than a few weeks.

This visit was different. I'm down 30 pounds. My numbers looked better than they have in a long time. The person in the room actually asked what I changed, which has never happened.

It wasn't a crash diet. I followed a simple system I could keep doing after the appointment, not just for two weeks before it.

If you've been avoiding the scale or the doctor's office because you already know the lecture, this is what helped me show up differently:

[LINK]

I'm not a medical expert. I'm just someone who finally had a better visit and wanted to pass along what I used.`,
    earningsMin: 90,
    earningsMax: 250,
  },
  {
    id: "wl-8",
    niche: "Weight Loss",
    post: `I wish I had found this three years ago. I really do.

I spent so much money on programs I quit. Shakes. Points. Meal kits that sat in the fridge until they went bad. Every time I failed I told myself I just didn't want it badly enough.

Three months in on this and I'm down 35 pounds. The confidence piece is what surprised me. I speak up more. I don't hide in the back of group photos. I bought a jacket in my actual size instead of "just in case."

The method is straightforward. I didn't need a new personality. I needed a plan that didn't collapse the first time life got busy.

If you're late to the party like me, start here:

[LINK]

Don't wait for a New Year or a Monday. I did that for a decade. This was the first time I didn't.`,
    earningsMin: 85,
    earningsMax: 230,
  },
  {
    id: "wl-9",
    niche: "Weight Loss",
    post: `I got my favorite jeans on this morning.

They've been in a tote on the top shelf since before the last holiday season. I kept them as a "goal" which really meant I was punishing myself every time I opened the closet.

I pulled them down on a whim. They zipped. I sat on the bed and laughed like an idiot.

I'm down 16 pounds and still losing. Not as fast as the infomercials promise. Fast enough that my clothes are catching up to me instead of the other way around.

If you've got a pair of "someday" jeans in a closet, this is what got me back into mine:

[LINK]

💃 Sharing because I know how specific and silly that goal sounds until it happens to you.`,
    earningsMin: 65,
    earningsMax: 175,
  },
  {
    id: "wl-10",
    niche: "Weight Loss",
    post: `I was extremely skeptical. I'll just say that up front.

Every "this changed my life" post looked like an ad. I assumed this would be the same — big claims, tiny print, me feeling dumb two weeks later.

I bookmarked it anyway and forgot about it. Opened it on a Sunday night when I was frustrated enough to try one more thing. Eight weeks later I'm down 22 pounds. No gimmick shakes. No wrapping myself in plastic. Just a process I could repeat on a normal week.

If you're the skeptical one in the group (I usually am), at least look at it before you write it off:

[LINK]

I'm not here to argue with anyone. I'm here because someone else's honest post is what made me click, and I wanted to pay that forward.`,
    earningsMin: 75,
    earningsMax: 195,
  },

  // Make Money Online
  {
    id: "mmo-1",
    niche: "Make Money Online",
    post: `I used to "work on my online business" the way people say they're going to start journaling.

I'd open five tabs. Watch two videos. Tweak a landing page that nobody was going to visit. Then I'd close the laptop and feel busy. Zero proof. Zero rhythm.

What changed was embarrassingly simple: I built a weekly routine for testing one offer at a time and writing down what actually got clicks. Not what looked smart. What people actually responded to.

I finally have a checklist I reuse every week instead of reinventing Monday from scratch. It's not glamorous. It is the first time this hasn't felt like chaos.

If you want the same kind of structure I used:

[LINK]

If you're drowning in tactics, start with one offer and a boring weekly review. That's what got me moving.`,
    earningsMin: 100,
    earningsMax: 300,
  },
  {
    id: "mmo-2",
    niche: "Make Money Online",
    post: `Is anyone else completely overloaded by "new" tactics?

Last year I was collecting courses like they were going to expire. Funnel hacks. AI prompts. Secret groups. I'd implement 10% of each and then jump to the next shiny thing because I was scared of missing out.

I stripped it back. One audience. One offer. One funnel. I stopped trying to look like I knew everything and started finishing things.

That single-lane focus is the first time I could actually tell what was working. I'm sharing the walkthrough that helped me stay in my lane:

[LINK]

If you're drowning in information and starving for results, this might be the permission slip you needed. You don't need twenty strategies. You need one you finish.`,
    earningsMin: 120,
    earningsMax: 350,
  },
  {
    id: "mmo-3",
    niche: "Make Money Online",
    post: `I quit chasing viral hacks.

That was hard to admit because the internet makes it look like everyone else is one Reel away from a paid-off car. I wasted months trying to copy whatever was popping that week. I'd get a spike, then nothing, then panic.

I went back to boring basics: clearer pages, faster follow-ups, and actually answering questions in the comments like a human. Not as exciting as "one trick." A lot more durable.

If you want the resource that helped me rebuild around those basics:

[LINK]

Viral is a lottery ticket. Clear and consistent is a job. I finally picked the job.`,
    earningsMin: 150,
    earningsMax: 400,
  },
  {
    id: "mmo-4",
    niche: "Make Money Online",
    post: `I used to roll my eyes at anything labeled "online business."

It all sounded like screenshots and rented Lambos. I'm not that person. I wanted something I could measure without lying to myself.

What helped was picking one metric at a time. Not ten dashboards. One number for the week. Clicks. Replies. Sales. Then I reviewed it on Sunday and adjusted one thing.

This is the resource that kept me consistent when I wanted to quit and go back to "research mode":

[LINK]

If you're skeptical, good. Stay skeptical. Just measure something real instead of collecting more opinions.`,
    earningsMin: 130,
    earningsMax: 380,
  },
  {
    id: "mmo-5",
    niche: "Make Money Online",
    post: `Small win that felt huge: I actually shipped a campaign from start to finish.

I have a graveyard of half-built pages and "I'll launch next week" notes. The unfinished pile was heavier than any failed launch, because at least a failed launch exists.

This time I followed a walkthrough instead of improvising. I didn't skip the ugly middle. I hit publish. I tracked what happened. I didn't ghost my own project on day four.

If you've got a folder of almost-done ideas, this is what I used to get one of them out the door:

[LINK]

Done beats perfect. I had to learn that the expensive way.`,
    earningsMin: 110,
    earningsMax: 320,
  },
  {
    id: "mmo-6",
    niche: "Make Money Online",
    post: `Working from home got a lot easier when I stopped improvising my day.

I used to sit down "to work" and immediately check messages, then YouTube, then rearrange my desktop. By 2pm I felt guilty and tired and had nothing to show for it.

A simple daily checklist changed that. Not a 4am guru routine. A short list I could finish even on a messy day: one outreach block, one content block, one review block.

If you want the checklist I still use:

[LINK]

Home isn't the problem. No plan is the problem. Once I had a default day, the guilt got quieter.`,
    earningsMin: 95,
    earningsMax: 280,
  },
  {
    id: "mmo-7",
    niche: "Make Money Online",
    post: `I used to bounce between tools like that was a personality.

New planner app. New CRM. New AI writer. I'd spend the week migrating instead of talking to actual people. It felt productive. It was stalling.

Now I keep one lightweight workflow and review it once a week. If a tool doesn't earn its tab, it's gone. The business got calmer immediately.

Here's what that setup looks like:

[LINK]

Fewer tools. More reps. I wish someone had said that louder when I was still "optimizing my stack."`,
    earningsMin: 140,
    earningsMax: 390,
  },
  {
    id: "mmo-8",
    niche: "Make Money Online",
    post: `I used to panic-post.

If a day was slow I'd blast five groups, rewrite my bio, and change my offer headline at midnight. It was anxiety dressed up as hustle.

I finally built a calm system for outreach and follow-ups. Same windows each week. Same message variants. I follow up like a professional instead of disappearing for ten days and then dumping a novel in someone's inbox.

This is what changed for me:

[LINK]

If your "strategy" is whatever mood you're in that afternoon, I get it. I was there. A system is kinder than a panic.`,
    earningsMin: 125,
    earningsMax: 360,
  },
  {
    id: "mmo-9",
    niche: "Make Money Online",
    post: `You don't need fancy skills to start. I didn't have them.

I can't code. I'm not a designer. I don't have a big audience. What I did have was a decent page, clearer messages, and a willingness to do the same boring outreach more than twice.

That's the part nobody wants to hear because it isn't a shortcut. It's also the part that actually moved.

This is what I used to get started without pretending I was already an expert:

[LINK]

If you've been waiting until you "know enough," you might already know enough. You just haven't given a simple process enough weeks.`,
    earningsMin: 105,
    earningsMax: 310,
  },
  {
    id: "mmo-10",
    niche: "Make Money Online",
    post: `I work in focused blocks now instead of all-day chaos.

I used to keep the laptop open from morning until I felt I'd "put in the hours." Half of that time was wandering. I'd end the day fried and still behind.

Time-blocking sounds corporate until you try it with a real life. I give myself short windows with one job inside each window. When the timer ends, I stop. Weirdly, I get more done.

If you want the template that helped me:

[LINK]

Protecting your attention is a business skill. I treated it like optional for too long.`,
    earningsMin: 135,
    earningsMax: 370,
  },

  // Health & Fitness
  {
    id: "hf-1",
    niche: "Health & Fitness",
    post: `I forgot what "normal energy" felt like.

I'd wake up tired, push through with coffee, crash around 3, then tell myself I was just getting older. I was going to bed at a reasonable time and still waking up like I'd run a marathon in my sleep.

I didn't need another 90-day challenge I wouldn't finish. I needed something I could keep doing on a regular week. This is what I started using, and a few weeks in my energy is in a completely different place. I feel like myself again — not a younger version of someone else, just less drained.

If you're tired of feeling tired, this is what I used:

[LINK]

Not medical advice. Just my experience. I was shocked how much of my "personality" was actually exhaustion.`,
    earningsMin: 60,
    earningsMax: 170,
  },
  {
    id: "hf-2",
    niche: "Health & Fitness",
    post: `The 3pm crash used to own my afternoons.

I'd be fine until lunch, then the fog would roll in. I'd snack, scroll, and write off the rest of the day. I blamed my job. I blamed the weather. I blamed getting older.

I changed one routine instead of overhauling my entire life. Steady energy through the afternoon is a wild feeling when you've lived on a crash cycle for years. I'm not bouncing off the walls. I'm just… present. I can finish a workday without fantasizing about a nap in my car.

This is what made the difference for me:

[LINK]

If your afternoons disappear, you're not imagining it. I lived there. This helped me get out.`,
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "hf-3",
    niche: "Health & Fitness",
    post: `I used to treat sleep, strength, and mood like three separate problems with three separate solutions.

I'd buy a sleep gummy, skip workouts for two weeks, then wonder why I still felt awful. Everything was connected and I was pretending it wasn't.

A simple change — one program I could actually follow — tightened all of it up. I'm sleeping more through the night. I feel stronger carrying groceries. I don't snap at people as much by Thursday.

If you want the thing I started with:

[LINK]

I was looking for a miracle. I found a routine I didn't hate. That was enough.`,
    earningsMin: 65,
    earningsMax: 180,
  },
  {
    id: "hf-4",
    niche: "Health & Fitness",
    post: `I used to dread bloodwork week.

I'd go in knowing I hadn't been consistent, then spend the next appointment nodding while someone listed things I already knew. Move more. Eat better. Reduce stress. Cool. How.

This last round was the first time in years the conversation felt different. I'm not claiming I became a doctor. I'm saying the habits I stuck with showed up in the numbers, and that felt like proof I wasn't wasting my time.

Here's what I've been doing:

[LINK]

Talk to your own doctor about your own situation. I'm just sharing the routine that helped me walk into that appointment less embarrassed.`,
    earningsMin: 70,
    earningsMax: 190,
  },
  {
    id: "hf-5",
    niche: "Health & Fitness",
    post: `I used to catch every cold that walked through the office.

One coworker would sniffle on Monday and I'd be down by Wednesday. I thought that was just "my immune system." I also wasn't sleeping, was running on snacks, and was stressed in a way I called being a high performer.

I started taking my health more seriously in a boring, repeatable way. I'm not invincible. I just don't fall apart at the first sneeze anymore. That alone changed how I plan my weeks.

This is what I added:

[LINK]

If you feel like you live at the pharmacy every winter, I get it. Start with something you can keep doing when life is loud.`,
    earningsMin: 60,
    earningsMax: 175,
  },

  // Beauty & Skincare
  {
    id: "bs-1",
    niche: "Beauty & Skincare",
    post: `People keep asking what I'm using on my skin and I finally have an answer that isn't "expensive facials I can't afford."

I had that dull, tired look that makeup just sits on top of. I tried a new product every time I walked through a store. My bathroom looked like a beauty aisle and my face still looked tired.

I simplified. One routine I actually finish in the morning. A few weeks in, my skin looks clearer and more even than it has in a long time. The compliments started before I even noticed in the mirror, which is how you know it's not just lighting.

Here's what I switched to:

[LINK]

If your cabinet is full and your skin is still unhappy, you might not need more products. You might need one that you'll use.`,
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "bs-2",
    niche: "Beauty & Skincare",
    post: `I don't have the budget or the recovery time for fancy treatments.

Every time I saw a "I look five years younger" post I assumed it involved a clinic and a credit card. That's not my life. I needed something I could do at the sink before work.

I found a simple routine and stuck with it longer than two weeks, which is usually where I quit. My skin looks fresher. Makeup takes less work. I'm not hiding in certain lighting anymore.

This is the one thing I actually kept using:

[LINK]

No clinic. No drama. Just consistency, which I know is the least exciting sentence on the internet and also the one that worked.`,
    earningsMin: 55,
    earningsMax: 160,
  },
  {
    id: "bs-3",
    niche: "Beauty & Skincare",
    post: `I caught myself in a photo last month and didn't immediately want to untag it.

That hasn't been true in a while. Fine lines were getting louder. My skin looked tired even after I slept. I was layering concealer like it was a personality.

I started something simple and gave it more than a long weekend. The difference is in the glow more than anything — less dull, less makeup needed to look awake.

If you want to see what I used:

[LINK]

I'm not promising anyone's face but my own. I just know I was skeptical, and I'm glad I didn't scroll past the last time someone posted honestly about this.`,
    earningsMin: 60,
    earningsMax: 170,
  },
  {
    id: "bs-4",
    niche: "Beauty & Skincare",
    post: `I have tried so many "this will clear your skin" products that I was ready to give up and live in hats.

Breakouts, then dryness, then breakouts from the thing that was supposed to fix the dryness. My skin barrier was a group chat with too many opinions.

I stripped it back and used one approach consistently. Fewer breakouts. Less redness. I can leave the house without a full face on a Saturday, which I have not been able to say in a long time.

Here's what finally didn't make it worse:

[LINK]

If your bathroom looks like a pharmacy, maybe start by removing half of it. That's what I had to do before anything new had a chance.`,
    earningsMin: 50,
    earningsMax: 155,
  },
  {
    id: "bs-5",
    niche: "Beauty & Skincare",
    post: `My friends asked if I got Botox. 😂

I did not. I also don't have a twelve-step Korean-inspired morning I filmed for content. I have a short routine I don't skip, and that's apparently enough to make people nosy in a group photo.

I'm posting this because I used to assume "good skin" was genetics or money. For me it was consistency plus something that didn't wreck my face.

This is what I'm using:

[LINK]

Take the compliment, then share the link. That's the whole post. Happy to answer what my morning actually looks like if anyone's curious.`,
    earningsMin: 65,
    earningsMax: 180,
  },

  // Relationships
  {
    id: "rel-1",
    niche: "Relationships",
    post: `I'm posting this carefully because I know how personal this stuff is.

A year ago my marriage felt like two roommates sharing a calendar. We weren't yelling every night. We were just… quiet in the wrong way. I'd replay conversations in my head and wonder when we started talking like coworkers.

I didn't want a dramatic "fix your marriage in 24 hours" pitch. I wanted something practical we could actually try without feeling like we were in therapy homework we didn't sign up for.

We used this. We're not perfect. We are talking again. Date night doesn't feel like a meeting. If you're in that roommate season, this is what helped us:

[LINK]

I'm not a counselor. I'm a person who got tired of the silence and finally tried something instead of hoping it would magically improve.`,
    earningsMin: 70,
    earningsMax: 200,
  },
  {
    id: "rel-2",
    niche: "Relationships",
    post: `There was a stretch where I honestly didn't know if we were going to make it.

I don't need to put the details on the internet. If you've been there, you already know the feeling — walking on eggshells, sleeping back-to-back, googling things at 1am you hope your partner never sees in your history.

We got help in the form of a simple program we could do at home, not a three-hour fight about whose fault the last three years were. It wasn't instant. It was better than doing nothing.

We're in a completely different place now. Still us. Less sharp. More on the same team.

If you're in a hard season and you want to see what we used:

[LINK]

Only you know if it's the right time. I just wish we'd started sooner instead of waiting for a breaking point.`,
    earningsMin: 80,
    earningsMax: 220,
  },
  {
    id: "rel-3",
    niche: "Relationships",
    post: `I spent a lot of years attracting the same kind of person and calling it bad luck.

Same spark. Same crash. Same "why do I always end up here" text to a friend. I thought I needed better dating apps. I needed better patterns.

This helped me get honest about what I was choosing and how I was showing up. I'm not going to pretend it was a fairy tale overnight. I will say I finally stopped repeating the same story.

If you're single and tired of the loop, this is what I used:

[LINK]

You can want love and still need a better map. That was me.`,
    earningsMin: 60,
    earningsMax: 180,
  },
  {
    id: "rel-4",
    niche: "Relationships",
    post: `We were talking a lot and understanding almost nothing.

Every conversation turned into a debate. I'd say one thing, they'd hear another, and we'd both go to bed frustrated. I thought we needed more time together. We needed a better way to hear each other.

We started using a simple approach for communication instead of waiting until we were both already mad. It's not therapy-speak. It's more like "can we not do the thing we always do."

It changed the temperature of the house. We're not perfect. We interrupt less. We repair faster.

This is what we used:

[LINK]

If you love each other and still feel unseen, it might not be a love problem. It might be a skills problem. That was a relief to find out.`,
    earningsMin: 65,
    earningsMax: 185,
  },
  {
    id: "rel-5",
    niche: "Relationships",
    post: `We've been together 15 years. That's long enough for the spark to turn into logistics.

Kids, bills, whose turn it is to deal with the leaky faucet. We were a good team on paper and a tired couple in real life. I missed us. I didn't know how to say that without starting a fight.

We tried this instead of another weekend trip we couldn't afford that wouldn't have fixed the Tuesday nights anyway. The little stuff came back — teasing, sitting closer on the couch, actually looking up when the other person walks in.

If you want to see what we used:

[LINK]

Long marriages don't die in one blowout. They fade in the calendar. We just needed a way back.`,
    earningsMin: 75,
    earningsMax: 210,
  },

  // Tech & Gadgets
  {
    id: "tech-1",
    niche: "Tech & Gadgets",
    post: `I am not a "new gadget every month" person. I usually wait until something is falling apart.

This one earned its spot on my desk. It saves me a couple of hours a day on stuff I used to do by hand — the boring admin that used to leak into my evenings. I got the time back in little chunks: a faster morning, fewer "wait let me redo that" moments, leaving the laptop closed after dinner.

Best purchase I've made this year, and I say that as someone who returns half of what I buy.

If you want to see what I got:

[LINK]

If you work from home or juggle a lot of small tasks, this is the kind of tool that doesn't look exciting in a photo and then quietly gives you your nights back.`,
    earningsMin: 45,
    earningsMax: 140,
  },
  {
    id: "tech-2",
    niche: "Tech & Gadgets",
    post: `I can't believe I lived without this, and I hate sentences that start that way, so I'll be specific.

There's a part of my day that used to take forever and make me irritable — setup, switching between things, losing my place. This removed that friction. I didn't become a productivity influencer. I just stopped leaking time on the same annoying step.

If you've been doing something the hard way because "that's how I've always done it," look at this:

[LINK]

I waited too long because I assumed it was hype. Don't do that if the daily friction is already driving you nuts.`,
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "tech-3",
    niche: "Tech & Gadgets",
    post: `Working from home sounds nice until you realize your kitchen table is your office, your office is your kitchen, and your brain never clocks out.

I needed something that made the work part of the day cleaner — less tab chaos, less "where did that file go," more actual finishing. This did that for me. I get more done in a shorter window, which means I can be a person again after 5.

If you work from home and your days blur together:

[LINK]

You don't need a fancy studio. You need fewer leaks. This plugged a big one for me.`,
    earningsMin: 55,
    earningsMax: 155,
  },
  {
    id: "tech-4",
    niche: "Tech & Gadgets",
    post: `Everyone who comes over asks about this thing sitting on my desk, which is a sentence I never thought I'd write.

It's useful, it's not ugly, and it actually does what the listing said — rare combo. I've recommended it in person three times this month, so I'm posting it here too.

Get a look at it here:

[LINK]

If you like tools that earn their space instead of becoming clutter, this one's been worth it.`,
    earningsMin: 50,
    earningsMax: 150,
  },
  {
    id: "tech-5",
    niche: "Tech & Gadgets",
    post: `I usually regret tech purchases after the unboxing high wears off.

This one is still earning its keep months later. It works the way they said it would. When something breaks in my day, this is often the thing that keeps the rest of the day from sliding.

If you're shopping and tired of stuff that looks clever and then sits in a drawer:

[LINK]

That's the whole review. Useful. Still using it. That's my bar now.`,
    earningsMin: 60,
    earningsMax: 165,
  },

  // Pets
  {
    id: "pet-1",
    niche: "Pets",
    post: `I love my dog. I did not love our training "routine," which was mostly me repeating the same command in a nicer voice and then giving up.

Walks were chaotic. Guests were stressful. I thought I had a stubborn dog. I had no system.

This made training so much clearer — short sessions, consistent cues, actual progress I could see in a week. He's happier because he knows what I want. I'm happier because I'm not yelling in the park.

If you want what we used:

[LINK]

Every dog is different. This is just the first thing that didn't feel like we were both failing.`,
    earningsMin: 40,
    earningsMax: 130,
  },
  {
    id: "pet-2",
    niche: "Pets",
    post: `The night barking was going to get us evicted from our neighbors' good graces.

Every sound outside turned into a full concert. I tried extra walks, white noise, guilt-treats. He'd settle for ten minutes and then start again at 1am.

We finally used something that addressed the anxiety behind the barking instead of just saying "quiet" louder. Nights are calmer. I can have a conversation with the people next door without apologizing first.

If your dog owns the night shift too:

[LINK]

I'm not a trainer. I'm a tired person who needed sleep and a happier dog. This helped both.`,
    earningsMin: 45,
    earningsMax: 135,
  },
  {
    id: "pet-3",
    niche: "Pets",
    post: `I thought my cat just had "that kind of coat."

Dull, shedding everywhere, little bald-looking patches I kept pretending were lighting. I changed food once, got overwhelmed by ingredients, and went back to whatever was on sale.

I started using this and actually stuck with it. Her coat is softer and shinier. The couch is still furry — she's a cat — but she looks healthier and she's more playful.

Here's what I'm using:

[LINK]

If you've been blaming the breed for a coat that looks tired, it might be worth one consistent change. That's all I did.`,
    earningsMin: 35,
    earningsMax: 120,
  },
  {
    id: "pet-4",
    niche: "Pets",
    post: `My dog's anxiety was running the house.

Thunder. The doorbell. Me putting on shoes. He'd shake, pace, and hide, and I'd feel helpless because "he's fine, he's just dramatic" wasn't true and wasn't kind.

We tried a calmer approach instead of more crates and more "he'll get over it." He's not a different dog. He's a dog who can exist in the room when something noisy happens.

If you want to see what we used:

[LINK]

If your pet's fear is running your schedule, you're not spoiling them by trying something. You're being a decent human.`,
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "pet-5",
    niche: "Pets",
    post: `The vet mentioned this and I almost didn't follow up because I assume everything is an upsell.

I looked it up anyway, started it, and I've been glad I did. My pet has more energy, better appetite, and the follow-up visit was a much nicer conversation than the last few.

I'm sharing because "your vet recommended it" posts always made me suspicious, and then I became one of those people.

See what we used:

[LINK]

Ask your own vet about your own animal. This is just what worked in our house after we finally tried it.`,
    earningsMin: 55,
    earningsMax: 155,
  },

  // Home & Garden
  {
    id: "hg-1",
    niche: "Home & Garden",
    post: `I do not have a green thumb. I have a history of buying plants and throwing a little funeral for them two months later.

This year I wanted a garden that didn't require me to become a different person. I used something simple, followed it without overthinking, and I actually have things growing. Herbs. Tomatoes that look like tomatoes. The backyard doesn't look abandoned.

If you want what I used:

[LINK]

If you've killed a succulent and felt personally attacked, start small. That's what I did. It's working.`,
    earningsMin: 40,
    earningsMax: 130,
  },
  {
    id: "hg-2",
    niche: "Home & Garden",
    post: `My house wasn't dirty. It was just… full of stuff with no home.

Mail on the counter. Bags on the chair. A closet I opened with my eyes half closed. I kept buying cute bins and then filling them with more chaos.

This storage approach actually stuck because it wasn't "spend a weekend becoming organized." It was a system I could keep up on a Tuesday. Counters stay clearer. I can find the tape. I don't start my morning already annoyed.

If you want to see it:

[LINK]

Organization isn't a personality. It's a default. I needed a default that didn't require a reality show.`,
    earningsMin: 45,
    earningsMax: 135,
  },
  {
    id: "hg-3",
    niche: "Home & Garden",
    post: `Cleaning used to take my entire Saturday and still not feel finished.

I'd start in the kitchen, get derailed by a closet, and end the day tired with a house that looked 20% better. I needed tools and a method that made the regular reset faster, not a Pinterest deep-clean I do twice a year.

This cut my time down a lot. Same house. Less martyrdom.

If you want the thing that changed it for me:

[LINK]

You shouldn't have to choose between a decent home and a weekend. I was doing that for years.`,
    earningsMin: 50,
    earningsMax: 145,
  },
  {
    id: "hg-4",
    niche: "Home & Garden",
    post: `The neighbors asked what I did to the lawn.

I used to mow and hope. Patchy, tired, that one corner that never cooperated. I wasn't looking to win a block award. I just didn't want to feel embarrassed when someone pulled in the driveway.

I followed a simple plan instead of buying random bags at the hardware store every spring. It looks better. I water on a schedule. I don't obsess. That's the win.

Here's what I used:

[LINK]

If your yard has been "good enough" for five years and you're tired of good enough, this is a reasonable place to start.`,
    earningsMin: 55,
    earningsMax: 155,
  },
  {
    id: "hg-5",
    niche: "Home & Garden",
    post: `I finally did a home project that didn't turn into a half-finished pile in the garage.

We've all been there — enthusiasm on Saturday, regret on Sunday, tarp still down in November. This time I picked something with a clear finish line and a result I can see every day. It looks better. It was worth the weekend.

If you're picking a project and you want something that actually pays off:

[LINK]

Start with one thing you'll finish. That's the advice I needed last year and ignored.`,
    earningsMin: 60,
    earningsMax: 165,
  },
]

function defaultLabelFromUrl(url: string): string {
  const trimmed = url.trim()
  if (!trimmed) return ""
  try {
    const host = new URL(trimmed).hostname.replace(/^www\./i, "")
    return host || "My offer"
  } catch {
    return "My offer"
  }
}

export function InstantIncomeContent({
  userId: _userId,
  initialSets = [],
}: {
  userId: string
  initialSets?: InstantIncomePostSet[]
}) {
  const [selectedNiche, setSelectedNiche] = useState<string>("Weight Loss")
  const [affiliateLink, setAffiliateLink] = useState("")
  const [setName, setSetName] = useState("")
  const [nameTouched, setNameTouched] = useState(false)
  const [showPosts, setShowPosts] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [guideOpen, setGuideOpen] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(initialSets.length > 0)
  const [librarySets, setLibrarySets] = useState<InstantIncomePostSet[]>(initialSets)
  const [openLibraryId, setOpenLibraryId] = useState<string | null>(null)
  const [formError, setFormError] = useState("")
  const [libraryError, setLibraryError] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [markingPostKey, setMarkingPostKey] = useState<string | null>(null)

  const postsResultsRef = useScrollToResults(showPosts && !!affiliateLink.trim())

  const savedSetForResults = librarySets.find(
    (set) => set.name.trim().toLowerCase() === setName.trim().toLowerCase(),
  )

  const niches = Array.from(new Set(facebookPosts.map((p) => p.niche)))

  const filteredPosts = facebookPosts.filter((p) => p.niche === selectedNiche)

  useEffect(() => {
    if (nameTouched) return
    setSetName(defaultLabelFromUrl(affiliateLink))
  }, [affiliateLink, nameTouched])

  const handleCopy = (postId: string, body: string) => {
    navigator.clipboard.writeText(body)
    setCopiedId(postId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleGeneratePosts = async () => {
    const link = affiliateLink.trim()
    const name = setName.trim()

    if (!isValidAffiliateUrl(link)) {
      setFormError("Use a full link that starts with https://")
      return
    }
    if (!name) {
      setFormError("Add a name for this link so we can save the set in your library.")
      return
    }

    setFormError("")
    setLibraryError("")
    setShowPosts(false)
    setGenerating(true)

    const personalized = filteredPosts.map((post) => ({
      id: post.id,
      body: post.post.replace("[LINK]", link),
    }))

    await new Promise((resolve) => setTimeout(resolve, 4500))

    const result = await upsertInstantIncomePostSet({
      name,
      affiliateUrl: link,
      niche: selectedNiche,
      posts: personalized,
    })

    setGenerating(false)

    if (!result.success) {
      setFormError(result.error)
      return
    }

    setLibrarySets((prev) => {
      const without = prev.filter(
        (s) => s.id !== result.set.id && s.name.trim().toLowerCase() !== name.toLowerCase(),
      )
      return [result.set, ...without]
    })
    setLibraryOpen(true)
    setOpenLibraryId(result.set.id)
    setShowPosts(true)
  }

  const handleMarkPostUsed = async (setId: string, postId: string) => {
    const key = `${setId}-${postId}`
    setMarkingPostKey(key)
    setLibraryError("")
    const result = await markInstantIncomePostUsed(setId, postId)
    setMarkingPostKey(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.map((set) => (set.id === result.set.id ? result.set : set)))
  }

  const handleDeleteSet = async (setId: string) => {
    setDeletingId(setId)
    setLibraryError("")
    const result = await deleteInstantIncomePostSet(setId)
    setDeletingId(null)
    if (!result.success) {
      setLibraryError(result.error)
      return
    }
    setLibrarySets((prev) => prev.filter((s) => s.id !== setId))
    if (openLibraryId === setId) setOpenLibraryId(null)
  }

  return (
    <PremiumPageLayout
      title={`${PREMIUM_FEATURE_LABELS.instantIncome}`}
      subtitle="Ready-to-post Facebook messages. Add your affiliate link once, copy a draft, and share it where the group rules allow."
    >
      <PremiumVideoTutorial
        premiumKey="recurringStreams"
        vimeoId={getPremiumTrainingVimeoId("recurringStreams")}
        title={`${PREMIUM_FEATURE_LABELS.instantIncome} Training`}
        description="Watch this quick tutorial to learn how to copy these Facebook posts and start making money instantly. Simple and easy!"
        iframeTitle={`${PREMIUM_FEATURE_LABELS.instantIncome} training video`}
      />

      <PremiumFeatureBanner
        icon={Facebook}
        kicker="Facebook posts"
        title="200+ ready drafts"
        description="Pick a niche, drop in your link, and copy posts written as personal stories — then edit them so they sound like you."
        chip="Copy and personalize"
      />

      <PremiumSteps title="Three steps to post" steps={INSTANT_STEPS} />

      <section className="glass-card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setGuideOpen((open) => !open)}
          aria-expanded={guideOpen}
          className="flex w-full items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 p-5 text-left transition-colors hover:bg-sapphire-100/80 md:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sapphire-100 text-sapphire-700">
            <Facebook size={24} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium text-ink">How to find and post in Facebook groups</span>
            <span className="mt-0.5 block text-sm text-ink-3">
              Groups reward members who sound human. Read this once, then generate drafts and edit the first line
              before you paste.
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
              guideOpen && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {guideOpen ? (
          <div className="space-y-3 p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {GUIDE_STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <div
                    key={step.num}
                    className="rounded-2xl border border-[var(--ds-line-sapphire)] bg-sapphire-100/50 p-4 sm:p-5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-grad-sapphire text-sm font-medium text-white">
                        {step.num}
                      </span>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sapphire-700 shadow-sm">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <h3 className="text-base font-medium text-ink">{step.title}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {step.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sapphire-700" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="rounded-2xl border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] p-5">
              <h3 className="text-base font-medium text-ink">What to expect</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                Outcomes depend on your niche, offer, group rules, and consistency. Treat these as starting drafts —
                edit them so they sound like you and match each community&apos;s guidelines.
              </p>
              <ul className="mt-3 space-y-2">
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Post in a handful of relevant groups per day, spaced out — never dump the same text everywhere at
                  once.
                </li>
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Reply quickly and helpfully so the thread stays visible without sounding salesy.
                </li>
                <li className="flex items-start gap-2 text-sm leading-relaxed text-ink">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sapphire-700" aria-hidden />
                  Track hook, group, and time of day so you improve the message — not just the volume.
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </section>

      <section className="glass-card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setLibraryOpen((open) => !open)}
          aria-expanded={libraryOpen}
          className="flex w-full flex-wrap items-center gap-3 border-b border-[var(--ds-line)] bg-sapphire-100 p-5 text-left transition-colors hover:bg-sapphire-100/80 md:p-6"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-sapphire-700 shadow-sm">
            <FolderOpen size={24} strokeWidth={1.75} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="page-eyebrow mb-1 block">Library</span>
            <span className="block text-xl font-semibold text-ink sm:text-2xl">Saved post sets</span>
            <span className="mt-1 block text-sm text-text-secondary">
              Each generation is saved under the link name you enter. Same name updates that set.
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="rounded-full border border-[var(--ds-line)] bg-card px-3 py-1.5 text-sm font-semibold text-ink">
              {librarySets.length} set{librarySets.length === 1 ? "" : "s"}
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 shrink-0 text-sapphire-700 transition-transform duration-200",
                libraryOpen && "rotate-180",
              )}
              aria-hidden
            />
          </span>
        </button>

        {libraryOpen ? (
          <div className="space-y-4 p-5 md:p-6">
            {libraryError ? (
              <p
                role="alert"
                className="rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
              >
                {libraryError}
              </p>
            ) : null}

            {librarySets.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--ds-line)] bg-card px-5 py-10 text-center">
                <FolderOpen className="mx-auto h-8 w-8 text-sapphire-700" aria-hidden />
                <p className="mt-3 text-sm font-semibold text-ink">No saved sets yet</p>
                <p className="mt-1 text-sm text-text-secondary">
                  Generate posts with a link name to start your library.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {librarySets.map((set) => {
                  const open = openLibraryId === set.id
                  return (
                    <article
                      key={set.id}
                      className="overflow-hidden rounded-2xl border border-[var(--ds-line)] bg-card shadow-[var(--ds-shadow-card)]"
                    >
                      <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                        <button
                          type="button"
                          onClick={() => setOpenLibraryId(open ? null : set.id)}
                          aria-expanded={open}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                            <FolderOpen className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-ink">{set.name}</span>
                            <span className="mt-0.5 block truncate text-xs text-text-secondary">
                              {set.niche} · {set.posts.length} posts ·{" "}
                              {new Date(set.updatedAt).toLocaleDateString()}
                            </span>
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-text-secondary transition-transform",
                              open && "rotate-180",
                            )}
                            aria-hidden
                          />
                        </button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={deletingId === set.id}
                          onClick={() => void handleDeleteSet(set.id)}
                          className={cn("h-9 shrink-0", outlineCtaClass)}
                          aria-label={`Delete ${set.name}`}
                        >
                          {deletingId === set.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      {open ? (
                        <div className="space-y-3 border-t border-[var(--ds-line)] bg-surface-nested/40 px-4 py-4 sm:px-5">
                          <p className="truncate text-xs text-text-secondary">{set.affiliateUrl}</p>
                          {set.posts.map((post, index) => {
                            const copyKey = `${set.id}-${post.id}`
                            const markKey = copyKey
                            const isUsed = Boolean(post.usedAt)
                            const isMarking = markingPostKey === markKey

                            return (
                              <div
                                key={post.id}
                                className={cn(
                                  "rounded-xl border border-[var(--ds-line)] bg-card p-4",
                                  isUsed && "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)]/40",
                                )}
                              >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-sapphire-700">
                                    Post #{index + 1}
                                  </p>
                                  {isUsed ? (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--ds-offer-green-800)]">
                                      <CheckCircle2 className="h-3 w-3" aria-hidden />
                                      Used
                                    </span>
                                  ) : null}
                                </div>
                                <p
                                  className={cn(
                                    "whitespace-pre-wrap text-sm leading-relaxed text-ink",
                                    isUsed && "text-ink-3",
                                  )}
                                >
                                  {post.body}
                                </p>
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                  <Button
                                    type="button"
                                    onClick={() => handleCopy(copyKey, post.body)}
                                    className={cn(
                                      "h-10 flex-1 text-sm",
                                      copiedId === copyKey
                                        ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500"
                                        : primaryCtaClass,
                                    )}
                                  >
                                    {copiedId === copyKey ? (
                                      <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Copied
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy this post
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isUsed || isMarking}
                                    onClick={() => void handleMarkPostUsed(set.id, post.id)}
                                    className={cn(
                                      "h-10 flex-1 text-sm",
                                      isUsed
                                        ? "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
                                        : outlineCtaClass,
                                    )}
                                  >
                                    {isMarking ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving…
                                      </>
                                    ) : isUsed ? (
                                      <>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Marked as used
                                      </>
                                    ) : (
                                      "Mark as used"
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : null}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        ) : null}
      </section>

      <PremiumControlCard
        icon={FolderOpen}
        title="Personalize your drafts"
        description="Pick a niche, paste your affiliate link once, and we drop it into every ready-to-post story."
      >
            <div className="space-y-3">
              <Label className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                Step 1 · Choose your niche
              </Label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {niches.map((niche) => {
                  const selected = selectedNiche === niche
                  return (
                    <Button
                      key={niche}
                      type="button"
                      onClick={() => setSelectedNiche(niche)}
                      variant={selected ? "default" : "outline"}
                      className={
                        selected
                          ? cn("h-11 text-sm", primaryCtaClass)
                          : cn("h-11 text-sm", outlineCtaClass)
                      }
                    >
                      {niche}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <Link2 className="h-3.5 w-3.5" aria-hidden />
                </span>
                Where to get your affiliate link
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">
                We recommend{" "}
                <a
                  href="http://digistore24.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sapphire-700 underline decoration-sapphire-300 underline-offset-2 hover:text-sapphire-900"
                >
                  DigiStore24
                </a>
                {" "}
                — a free marketplace with products you can promote for commission.
              </p>
              <ol className="mt-3 space-y-2">
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    1
                  </span>
                  Create a free account at digistore24.com (about two minutes).
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    2
                  </span>
                  Browse your niche and click Promote on a product.
                </li>
                <li className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-grad-sapphire text-[11px] font-medium text-white">
                    3
                  </span>
                  Copy your unique link and paste it below.
                </li>
              </ol>
              <Button asChild variant="outline" className={cn("mt-4 w-full", outlineCtaClass)}>
                <a href="http://digistore24.com" target="_blank" rel="noopener noreferrer">
                  Create free DigiStore24 account
                  <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
                </a>
              </Button>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <Label
                htmlFor="affiliate-link"
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <Link2 size={12} aria-hidden />
                </span>
                Step 2 · Affiliate link
              </Label>
              <Input
                id="affiliate-link"
                type="url"
                placeholder="https://digistore24.com/..."
                value={affiliateLink}
                onChange={(e) => {
                  setAffiliateLink(e.target.value)
                  setShowPosts(false)
                }}
                className="h-12 bg-card text-base text-ink"
              />
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                We add this URL to every draft below. Must start with https://
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--ds-line)] bg-surface-nested/70 p-4 sm:p-5">
              <Label
                htmlFor="set-name"
                className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-secondary"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-sapphire-100 text-sapphire-700">
                  <FolderOpen size={12} aria-hidden />
                </span>
                Step 3 · Name for this link
              </Label>
              <Input
                id="set-name"
                type="text"
                placeholder="e.g. Melatonin Digistore"
                value={setName}
                onChange={(e) => {
                  setNameTouched(true)
                  setSetName(e.target.value)
                }}
                className="h-12 bg-card text-base text-ink"
              />
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                Saved sets use this name. Generating again with the same name updates that set.
              </p>
            </div>

            {generating ? (
              <GenerationProgress
                offer="welcome"
                label={`Personalizing ${filteredPosts.length} posts with your affiliate link...`}
              />
            ) : showPosts ? (
              <WelcomeOfferBanner />
            ) : null}

            {formError ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
              >
                {formError}
              </p>
            ) : null}

            <Button
              onClick={() => void handleGeneratePosts()}
              disabled={!affiliateLink.trim() || !setName.trim() || generating}
              className={cn("h-12 w-full text-base sm:h-14 sm:text-lg", primaryCtaClass)}
              size="lg"
            >
              {generating ? "Generating your posts…" : `Show me my ${filteredPosts.length} posts`}
              {!generating ? <ArrowRight className="ml-2 h-5 w-5" aria-hidden /> : null}
            </Button>
      </PremiumControlCard>

      {showPosts && affiliateLink && (
        <div ref={postsResultsRef} className="space-y-6">
          <div className="glass-card overflow-hidden p-0">
            <div className="border-b border-[var(--ds-line)] bg-sapphire-100 p-5 md:p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-sapphire-700">
                    Ready to copy
                  </p>
                  <h2 className="font-medium text-ink">
                    Your {filteredPosts.length} posts are ready
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-3">
                    Copy a draft, rewrite the opening line in your voice, then paste where the group rules allow.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {libraryError ? (
            <p
              role="alert"
              className="rounded-xl border border-[#C53030]/30 bg-[#FDE4E4] px-3.5 py-2.5 text-sm font-medium text-[#C53030]"
            >
              {libraryError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4">
            {filteredPosts.map((post, index) => {
              const savedPost = savedSetForResults?.posts.find((p) => p.id === post.id)
              const isUsed = Boolean(savedPost?.usedAt)
              const setId = savedSetForResults?.id
              const markKey = setId ? `${setId}-${post.id}` : null
              const isMarking = markKey != null && markingPostKey === markKey
              const body = post.post.replace("[LINK]", affiliateLink)

              return (
                <article
                  key={post.id}
                  className={cn(
                    "glass-card overflow-hidden p-0",
                    isUsed && "ring-1 ring-[var(--ds-line-offer)]",
                  )}
                >
                  <div className="flex flex-wrap items-center gap-2 border-b border-[var(--ds-line)] px-5 py-3">
                    <span className="rounded-full bg-grad-sapphire px-3 py-1 text-xs font-medium text-white">
                      Post #{index + 1}
                    </span>
                    <span className="rounded-full border border-[var(--ds-line)] bg-surface-nested px-3 py-1 text-xs font-medium text-ink">
                      {post.niche}
                    </span>
                    {isUsed ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] px-2.5 py-1 text-xs font-semibold text-[var(--ds-offer-green-800)]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        Used
                      </span>
                    ) : null}
                  </div>
                  <div className="px-5 py-5">
                    <div
                      className={cn(
                        "rounded-xl border border-[var(--ds-line)] bg-surface-nested/80 p-4 sm:p-5",
                        isUsed && "opacity-90",
                      )}
                    >
                      <p
                        className={cn(
                          "whitespace-pre-wrap text-[15px] font-normal leading-7 text-ink sm:text-base",
                          isUsed && "text-ink-3",
                        )}
                      >
                        {body}
                      </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <Button
                        onClick={() => handleCopy(post.id, body)}
                        className={cn(
                          "h-12 flex-1 text-base",
                          copiedId === post.id
                            ? "rounded-xl bg-sapphire-500 font-medium text-white hover:bg-sapphire-500"
                            : primaryCtaClass,
                        )}
                        size="lg"
                      >
                        {copiedId === post.id ? (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Copied — now paste in Facebook
                          </>
                        ) : (
                          <>
                            <Copy className="mr-2 h-5 w-5" />
                            Copy this post
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={!setId || isUsed || isMarking}
                        onClick={() => setId && void handleMarkPostUsed(setId, post.id)}
                        className={cn(
                          "h-12 flex-1 text-base",
                          isUsed
                            ? "border-[var(--ds-line-offer)] bg-[var(--ds-offer-green-100)] font-medium text-[var(--ds-offer-green-800)]"
                            : outlineCtaClass,
                        )}
                      >
                        {isMarking ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Saving…
                          </>
                        ) : isUsed ? (
                          <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Marked as used
                          </>
                        ) : (
                          "Mark as used"
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </PremiumPageLayout>
  )
}
