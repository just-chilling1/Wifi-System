#!/usr/bin/env python3
"""Align Wifi System training slides to voiceover transcripts."""
import json
import re
import sys
from difflib import SequenceMatcher

BASE = r"d:\Apps\Wifi-System\wifi-system-videos"


def norm(t):
    out = []
    for w in t.lower().split():
        w = re.sub(r"[^a-z0-9]+", "", w)
        if w:
            out.append(w)
    return out


def load_words(path):
    d = json.load(open(path, encoding="utf-8"))
    words = []
    for s in d["segments"]:
        for w in s["words"]:
            token = re.sub(r"[^a-z0-9]+", "", w["w"].lower())
            if token:
                words.append({"t": token, "raw": w["w"].strip(), "s": w["s"], "e": w["e"]})
    return words


def find_anchor(words, anchor, start_idx):
    atoks = norm(anchor)
    n = len(atoks)
    best, best_i = 0.0, None
    hi = len(words) - n
    for i in range(start_idx, max(start_idx, hi) + 1):
        window = [words[j]["t"] for j in range(i, i + n)]
        r = SequenceMatcher(None, atoks, window).ratio()
        if r > best:
            best, best_i = r, i
            if r > 0.97:
                break
    return best_i, best


def captions(words, max_chars=46):
    chunks, cur, cur_s = [], [], None
    for w in words:
        if cur_s is None:
            cur_s = w["s"]
        cur.append(w)
        text = " ".join(x["raw"] for x in cur)
        endp = re.search(r"[.!?…]$", w["raw"])
        if len(text) >= max_chars or endp:
            chunks.append({"s": round(cur_s, 2), "e": round(w["e"], 2), "text": text})
            cur, cur_s = [], None
    if cur:
        chunks.append({"s": round(cur_s, 2), "e": round(cur[-1]["e"], 2), "text": " ".join(x["raw"] for x in cur)})
    return chunks


def build(video, slides, out_path):
    words = load_words(f"{BASE}/transcripts/{video}.json")
    dur = max(w["e"] for w in words)
    resolved = []
    idx = 0
    misses = []
    for sl in slides:
        if sl.get("anchor") is None:
            t = sl.get("at", 0.0)
        else:
            i, score = find_anchor(words, sl["anchor"], idx)
            if i is None or score < 0.55:
                misses.append((sl["anchor"], score))
                continue
            t = words[i]["s"]
            idx = i
        item = {k: v for k, v in sl.items() if k not in ("anchor", "at")}
        item["start"] = round(t, 2)
        resolved.append(item)
    for a, b in zip(resolved, resolved[1:]):
        a["end"] = b["start"]
    resolved[-1]["end"] = round(dur, 2)
    data = {"durationSec": round(dur + 0.5, 2), "slides": resolved, "captions": captions(words)}
    json.dump(data, open(out_path, "w", encoding="utf-8"), indent=1)
    print(f"video {video}: {len(resolved)} slides, dur {dur:.1f}s -> {out_path}")
    for m, s in misses:
        print(f"  MISS ({s if s else 0:.2f}): {m[:80]}")
    return misses


V1 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "1", "title": ["WATCH", "THIS FIRST"], "sub": "Before you click anything in Wifi System"},
    {"anchor": "did I really just spend money on that", "type": "quote", "text": "\u201cDid I really just spend money on that?\u201d", "label": "TONIGHT, A SMALL VOICE"},
    {"anchor": "before you click anything inside Wifi System", "type": "shot", "img": "dashboard.png", "caption": "About eleven minutes. The one that keeps you on day one."},
    {"anchor": "first congratulations not for buying software", "type": "title", "kicker": "FIRST", "headline": "Congratulations.", "sub": "Not for buying software \u2014 for what the purchase says about you."},
    {"anchor": "most people watch make money online content", "type": "title", "kicker": "THE LINE", "headline": "Most people watch.\nYou decided.", "sub": "You backed a call with your own money."},
    {"anchor": "it is not talent it is not luck it is decisions", "type": "title", "kicker": "", "headline": "Not talent.\nNot luck.\nDecisions.", "sub": ""},
    {"anchor": "now let's talk about that voice", "type": "title", "kicker": "NAME IT", "headline": "The doubt voice.", "sub": "I know its script by heart."},
    {"anchor": "you bought things like this before", "type": "quote", "text": "\u201cYou bought things like this before\u2026\u201d", "label": "THE VOICE SAYS"},
    {"anchor": "everybody online is running some kind of scam", "type": "quote", "text": "\u201cEverybody online is running a scam\u2026\u201d", "label": "THE VOICE SAYS"},
    {"anchor": "you are not the kind of person this works for", "type": "quote", "text": "\u201cYou're not the kind of person this works for.\u201d", "label": "THE 2 A.M. LINE"},
    {"anchor": "every member who stuck with this model heard that voice", "type": "title", "kicker": "THE TRUTH", "headline": "Every member who stuck\nheard that voice.", "sub": "It is weather. It shows up on schedule."},
    {"anchor": "post purchase dissonance", "type": "title", "kicker": "REAL NAME", "headline": "Post-purchase\ndissonance.", "sub": "Your brain felt money leave. It cannot see the result yet."},
    {"anchor": "the feeling is not a mistake it is commitment", "type": "title", "kicker": "SO THAT FEELING?", "headline": "Not a mistake.\nA commitment.", "sub": "Nobody gets buyer's remorse over a sandwich."},
    {"anchor": "you bought a different kind of evening", "type": "title", "kicker": "WHAT YOU BOUGHT", "headline": "A different kind\nof evening.", "sub": "Gold Rush. Comments. Your link inside."},
    {"anchor": "you tell Wifi System what you are promoting", "type": "shot", "img": "create.png", "caption": "Gold Rush finds Shorts. AI drafts comments with your link."},
    {"anchor": "here is why picking this was smart", "type": "title", "kicker": "WHY THIS WAS SMART", "headline": "Eyeballs already\non YouTube Shorts.", "sub": "Comments bridge curiosity and your affiliate link."},
    {"anchor": "you did not buy a lottery ticket", "type": "title", "kicker": "", "headline": "Not a lottery ticket.", "sub": "You bought back minutes that used to vanish into blank boxes."},
    {"anchor": "before Wifi System was a product", "type": "title", "kicker": "HOW I KNOW", "headline": "Before it was a product,\nit was hand work.", "sub": "Same me. More at-bats. Less procrastination."},
    {"anchor": "you might get the look", "type": "quote", "text": "\u201cYou bought WHAT?\u201d", "label": "THE LOOK"},
    {"anchor": "give me a month I will show you", "type": "quote", "text": "\u201cGive me a month.\nI'll show you instead of telling you.\u201d", "label": "JUST SAY THIS"},
    {"anchor": "this works and it is still work", "type": "title", "kicker": "HONEST PART", "headline": "This works.\nAnd it is still work.", "sub": "You still post on YouTube yourself."},
    {"anchor": "money with zero effort close the tab", "type": "title", "kicker": "STRAIGHT TALK", "headline": "\u201cZero effort\u201d\nis a lie.", "sub": "Every session creates packs in My Vault."},
    {"anchor": "free member training", "type": "banner", "headline": "FREE MEMBER TRAINING", "sub": "Scale toward $1,000 \u2013 $5,000 a day", "note": "Between Home videos on the dashboard"},
    {"anchor": "watch the free training", "type": "banner", "headline": "WATCH THE FREE TRAINING \u2192", "sub": "About thirty seconds. Do it now.", "note": "Or Exclusive Offers in the sidebar."},
    {"anchor": "finish these three Home videos", "type": "steps", "kicker": "YOUR MAP", "items": ["Watch This First", "How The Money Flows", "Your 5-Minute Tour", "Gold Rush, then Academy"], "sub": "Do not skip video two."},
    {"anchor": "thirty day money back guarantee", "type": "title", "kicker": "UPGRADES", "headline": "Upgrade purchases\ncarry the guarantee.", "sub": "As written in Support and terms."},
    {"anchor": "How The Money Flows", "type": "end", "headline": "Next: How The Money Flows", "sub": "See you in video two."},
]

V2 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "2", "title": ["HOW THE", "MONEY FLOWS"], "sub": "YouTube Shorts \u00b7 affiliate commissions"},
    {"anchor": "before you touch Gold Rush for real", "type": "title", "kicker": "THE MAP", "headline": "The map the Academy\nassumes you have.", "sub": "Ten minutes now saves ten hours later."},
    {"anchor": "whole business in one sentence", "type": "title", "kicker": "ONE SENTENCE", "headline": "Link. Comment.\nClick. Commission.", "sub": "That is the machine."},
    {"anchor": "picture a busy street fair", "type": "title", "kicker": "THE FAIR", "headline": "Flyers with\nyour coupon code.", "sub": "Vendor pays you when strangers buy."},
    {"anchor": "who pays you the vendor", "type": "title", "kicker": "WHO PAYS", "headline": "The vendor pays you.", "sub": "Not YouTube. Not Wifi System."},
    {"anchor": "why would a stranger click your link", "type": "title", "kicker": "WARM ATTENTION", "headline": "They were already\ninterested.", "sub": "Comments meet curiosity on the Short."},
    {"anchor": "where does YouTube fit", "type": "title", "kicker": "SHORTS", "headline": "Shorts = crowded room.", "sub": "Comment section = your flyer handoff."},
    {"anchor": "Gold Rush automates the hunt", "type": "shot", "img": "create.png", "caption": "Gold Rush Generator \u2014 find Shorts, draft comments."},
    {"anchor": "affiliate link", "type": "term", "n": 1, "term": "Affiliate link", "def": "Your personal tracking URL for one offer.", "analogy": "Coat-check ticket with your name on it."},
    {"anchor": "commission", "type": "term", "n": 2, "term": "Commission", "def": "Money the vendor pays when someone buys through your link.", "analogy": "Finder's fee for sending a buyer."},
    {"anchor": "comment pack", "type": "term", "n": 3, "term": "Comment pack", "def": "AI-written comments for one Short, ready to copy.", "analogy": "Sticky notes you wrote ahead of time."},
    {"anchor": "Gold Rush", "type": "term", "n": 4, "term": "Gold Rush", "def": "Finds Shorts and writes comments with your link inside.", "analogy": "Metal detector on a busy beach."},
    {"anchor": "My Vault", "type": "term", "n": 5, "term": "My Vault", "def": "Library of saved comment packs.", "analogy": "Filing cabinet for winners."},
    {"anchor": "Link Vault", "type": "term", "n": 6, "term": "Link Vault", "def": "Saved affiliate URLs to reuse in Gold Rush.", "analogy": "Wallet of tickets."},
    {"anchor": "meet Jamie", "type": "title", "kicker": "ONE STORY", "headline": "Meet Jamie.", "sub": "Fitness offer. Real https link. One full lap."},
    {"anchor": "opens Gold Rush on Wifi System", "type": "shot", "img": "create.png", "caption": "Product, description, affiliate link \u2192 Find Viral Opportunities."},
    {"anchor": "pack lands in My Vault", "type": "shot", "img": "pages.png", "caption": "Copy a comment. Open the Short. Paste on YouTube."},
    {"anchor": "free member training", "type": "banner", "headline": "FREE MEMBER TRAINING", "sub": "While generation runs \u2014 optional scale path", "note": "Bonus card or Exclusive Offers"},
    {"anchor": "open Link Vault once", "type": "shot", "img": "share.png", "caption": "Save hops once. Gold Rush picks from the list."},
    {"anchor": "Academy walks mindset then how to", "type": "steps", "kicker": "TRAINING ORDER", "items": ["Platform tutorials", "Mindset then how-to", "Premium when ready", "Support if stuck"], "sub": "Training in the sidebar."},
    {"anchor": "Your 5 Minute Tour", "type": "end", "headline": "Next: Your 5-Minute Tour", "sub": "Then Gold Rush tonight if you can."},
]

V4 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "4", "title": ["GOLD RUSH", "MINDSET"], "sub": "Beliefs before the click-by-click"},
    {"anchor": "tackle Gold Rush Mindset", "type": "title", "kicker": "THIS VIDEO", "headline": "Operator, not gambler.", "sub": "The how-to is the next Academy video."},
    {"anchor": "you are not spamming", "type": "title", "kicker": "BELIEF 1", "headline": "You are showing up\nwhere eyeballs are.", "sub": "Helpful comment + your tracking link."},
    {"anchor": "match beats clever", "type": "title", "kicker": "BELIEF 2", "headline": "Match beats clever.", "sub": "Describe the offer honestly in the form."},
    {"anchor": "one real link tested once", "type": "title", "kicker": "BELIEF 3", "headline": "One real link\nbeats ten fantasies.", "sub": "Paste full https before you chase volume."},
    {"anchor": "speed is the unfair advantage", "type": "title", "kicker": "BELIEF 4", "headline": "Speed only wins\nif you post.", "sub": "Empty My Vault is usually a posting problem."},
    {"anchor": "reject perfect choose posted", "type": "title", "kicker": "BELIEF 5", "headline": "Posted beats perfect.", "sub": "Copy one line. Tweak a word. Post tonight."},
    {"anchor": "respect the platform", "type": "title", "kicker": "BELIEF 6", "headline": "Respect YouTube\nor get muted.", "sub": "Space your posting. Sound human."},
    {"anchor": "empty results as data", "type": "title", "kicker": "BELIEF 7", "headline": "Empty search = data.", "sub": "Widen keyword. Fix offer description."},
    {"anchor": "step one of a loop", "type": "title", "kicker": "BELIEF 8", "headline": "Gold Rush is step one\nof the loop.", "sub": "Link Vault \u2192 Gold Rush \u2192 My Vault \u2192 post."},
    {"anchor": "three habits before the click", "type": "steps", "kicker": "HABITS", "items": ["Explain offer to your aunt", "Pick a posting window", "Copy within 24 hours"], "sub": "Mindset without motion is noise."},
    {"anchor": "Watch Gold Rush Training next", "type": "end", "headline": "Next: Gold Rush Training", "sub": "One real offer. One lap tonight."},
]

V6 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "6", "title": ["MY VAULT", "MINDSET"], "sub": "Memory of your operation"},
    {"anchor": "My Vault Mindset", "type": "title", "kicker": "THIS VIDEO", "headline": "Assets, not clutter.", "sub": "Packs save automatically on success."},
    {"anchor": "pack in the vault is potential energy", "type": "title", "kicker": "BELIEF 1", "headline": "Potential \u2192 kinetic\nwhen you post.", "sub": "Uncopied comments send no traffic."},
    {"anchor": "organize by action not by perfection", "type": "title", "kicker": "BELIEF 2", "headline": "Organize by action.", "sub": "Delete dead offers \u2014 not weird line two."},
    {"anchor": "My Vault is your rehearsal room", "type": "shot", "img": "pages.png", "caption": "View comments. Open video. Copy. Post."},
    {"anchor": "empty vault means empty habit", "type": "title", "kicker": "BELIEF 4", "headline": "Empty vault?\nFix the habit.", "sub": "One Gold Rush run before more theory."},
    {"anchor": "numbers are feedback not judgment", "type": "title", "kicker": "BELIEF 5", "headline": "Opens & copies = feedback.", "sub": "Generate \u2192 vault \u2192 copy \u2192 post."},
    {"anchor": "Link Vault and My Vault are siblings", "type": "title", "kicker": "BELIEF 7", "headline": "Links vs comment packs.", "sub": "New hop link \u2192 fresh Gold Rush pack."},
    {"anchor": "three operator habits", "type": "steps", "kicker": "HABITS", "items": ["Open vault after each run", "Post one old pack weekly", "Double down on winners"], "sub": "Motion beats theory."},
    {"anchor": "My Vault Training", "type": "end", "headline": "Next: My Vault Training", "sub": "Copy one line tonight if you have a pack."},
]

V8 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "8", "title": ["LINK VAULT", "MINDSET"], "sub": "Beliefs before buttons"},
    {"anchor": "Link Vault Mindset", "type": "title", "kicker": "THIS VIDEO", "headline": "Save trust,\nnot just URLs.", "sub": "Sidebar: Link Vault. Button: Save to Your Links."},
    {"anchor": "naming is caring for future you", "type": "title", "kicker": "BELIEF 1", "headline": "Name offers\nlike products on a shelf.", "sub": "Messy names become mis-clicks."},
    {"anchor": "one canonical link per offer", "type": "title", "kicker": "BELIEF 2", "headline": "One canonical hop\nper offer.", "sub": "Invalid at save beats invalid in fifty comments."},
    {"anchor": "Link Vault is setup not traffic", "type": "shot", "img": "share.png", "caption": "Wallet of tickets \u2192 Gold Rush \u2192 My Vault \u2192 post."},
    {"anchor": "edit beats delete and hope", "type": "title", "kicker": "BELIEF 4", "headline": "Edit beats delete.", "sub": "Regenerate packs after a link swap."},
    {"anchor": "organization is targeting", "type": "title", "kicker": "BELIEF 5", "headline": "Match links to niches.", "sub": "Mismatch gets views \u2014 rarely buyers."},
    {"anchor": "your link is public the moment", "type": "title", "kicker": "BELIEF 6", "headline": "Treat hops like cash.", "sub": "Promote what you'd tell your sister about."},
    {"anchor": "three habits before the click by click", "type": "steps", "kicker": "HABITS", "items": ["Confirm saved cards", "One notes line on winners", "Pick Link Vault winner before premium"], "sub": "Boring accuracy \u2192 paydays later."},
    {"anchor": "Link Vault Training", "type": "end", "headline": "Next: Link Vault Training", "sub": "Save one https hop before the how-to."},
]

V10 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "10", "title": ["UNLIMITED", "MINDSET"], "sub": "Premium library mode"},
    {"anchor": "Unlimited Mindset", "type": "title", "kicker": "THIS VIDEO", "headline": "Library mode\nafter hunter mode.", "sub": "Same comment play. Different starting line."},
    {"anchor": "premium rewards operators not tourists", "type": "title", "kicker": "BELIEF 1", "headline": "Operators first.", "sub": "Post one core comment before you unlock scroll."},
    {"anchor": "lock your offer once", "type": "title", "kicker": "BELIEF 2", "headline": "Lock offer + link once.", "sub": "Change product only on purpose."},
    {"anchor": "pre loaded doesn't mean post blind", "type": "title", "kicker": "BELIEF 3", "headline": "Pre-loaded \u2260 post-blind.", "sub": "Watch ten seconds. Pick one line."},
    {"anchor": "five comments per video is variety", "type": "title", "kicker": "BELIEF 4", "headline": "Five lines = variety,\nnot homework.", "sub": "One comment per Short."},
    {"anchor": "Unlimited complements Gold Rush", "type": "title", "kicker": "BELIEF 5", "headline": "Unlimited + Gold Rush.", "sub": "Sniper shots + batch sessions."},
    {"anchor": "link accuracy is still everything", "type": "title", "kicker": "BELIEF 6", "headline": "Wrong hop = unpaid library.", "sub": "Verify https before unlock."},
    {"anchor": "three habits before Unlimited Training", "type": "steps", "kicker": "HABITS", "items": ["Pick Link Vault winner", "30-min copy session", "Track Shorts you hit"], "sub": "The library isn't income \u2014 live comments are."},
    {"anchor": "Unlimited Training", "type": "end", "headline": "Next: Unlimited Training", "sub": "Mindset now. Click path in video eleven."},
]

V22 = [
    {"anchor": None, "at": 0.0, "type": "intro", "num": "22", "title": ["DONE-FOR-YOU", "PROFIT MINDSET"], "sub": "Campaign day, not casual browsing"},
    {"anchor": "Done For You Profit", "type": "title", "kicker": "THIS VIDEO", "headline": "Full promo kit\nin one run.", "sub": "Mindset before Generate kit."},
    {"anchor": "paste affiliate link pick a niche", "type": "title", "kicker": "THE BUNDLE", "headline": "Five videos + article\n+ Facebook posts.", "sub": "Saved under the kit name you enter."},
    {"anchor": "campaign day not casual browsing", "type": "title", "kicker": "MINDSET", "headline": "Block 60\u201390 minutes.", "sub": "Deploy while the story is fresh."},
    {"anchor": "Generate your kit", "type": "shot", "img": "dfy-profit.png", "caption": "Link, niche pill, kit name \u2192 Generate kit."},
    {"anchor": "progress stages rotate labels", "type": "title", "kicker": "THE WAIT", "headline": "Real waits inside\nprogress.", "sub": "Breathe. Don't refresh the page."},
    {"anchor": "Saved kits library", "type": "title", "kicker": "LIBRARY", "headline": "Open this kit\nbeats duplicate runs.", "sub": "Mark as Used when you ship."},
    {"anchor": "still need you to paste comments on YouTube", "type": "title", "kicker": "SAME LOOP", "headline": "You still post\non YouTube manually.", "sub": "Same money story as Disconnect."},
    {"anchor": "Done For You Profit Training", "type": "end", "headline": "Next: Done-For-You Profit Training", "sub": "Plan tonight. Click path in the how-to."},
]

JOBS = [
    ("vo1", V1, "video1.json"),
    ("vo2", V2, "video2.json"),
    ("vo4", V4, "video4.json"),
    ("vo6", V6, "video6.json"),
    ("vo8", V8, "video8.json"),
    ("vo10", V10, "video10.json"),
    ("vo22", V22, "video22.json"),
]

if __name__ == "__main__":
    all_miss = []
    for vo, slides, fname in JOBS:
        out = f"{BASE}/remotion/src/data/{fname}"
        all_miss.extend(build(vo, slides, out))
    if all_miss:
        print(f"\n{len(all_miss)} total anchor misses (continuing anyway)", file=sys.stderr)
