# RPG Companion HMS Edition 2.9 beta

The side panel for the **HMS Living World** bots: Re:Zero, Mushoku Tensei, Classroom of the Elite,
Overlord, Harry Potter and SCP-4666 (and Undertale, Dark Souls and Skyrim bots). In an HMS chat the bot's WORLD STATE HUD **is** the
tracker: the extension reads it, shows it as cards, guards it, and never asks the model for a competing one.

Made to work with the **HMS Reporter beta** preset.

**New in 2.9 beta: seals, exams and contracts; lives of their own; history; a closer map.** Letters carry their
writer's **seal**; **exam papers** have a red mark out of 100 and a stamp, with a grades list; **contracts** keep their
terms (and the story is reminded of the ones in force). **Star** a person and they live their own life off screen
(an **Off screen** card). Every card has a **History** (bonds and why, moments, **milestones**, and how the others feel
about each other). Floor plans gain **things** (furniture, windows, stairs, pillars, water) in all three views, follow
people more closely, read the HUD's floor, and take sizes and floors from the lorebook. **Broken bones** show on the
chart; the female chart's organs sit inside her body; **21 more statuses**; more race parts (antlers, fox tails, insect
wings, fins, six arms…); **None** and **Custom** on Characters and Body & health. HMS Reporter 1.7 asks for exams,
contracts and seals.

**New in 2.8 beta: floor plans, statuses, others' bodies, one Mode dial.** **Floor plans** after the room atlas of
**Ryah | Wireless**: the room you are in, every room in 2D, or every floor in 3D (Map page; Settings → **Maps**).
**Statuses** for the people around you (asleep, knocked out, dead, tied up, missing, charmed and 19 more), each with
what it stops; the dead fold under **💀 Deceased** with how they died. **Party members get a body chart** (male or
female) with their wounds and lost limbs. Your own body adds **vitality** with a death clock, the main **arteries**, a
**female chart**, **cold and heat**, **sickness and poison**, **prosthetics**, and **Treated / Healed** by hand.
Dragons in human form keep their horns, wings and tail. **On you** (your bag), **Skills & traits**, **Side by side**
in fights, a **Picture prompt**, **settings tabs**, a **Magic & Skills** page, **Esc** to close the wide window, a
**Never** choice for Perch's round button, and phone layouts. **Play styles** run **None, Potato, Light, Medium,
Heavy, Max**, the same steps as HMS Reporter 1.6's **Mode** dial (Max adds Radiant's R. Prompt there). **D&D is off**
unless you pick the D&D style.

**Fixed in 2.7.1** (from the owner's bug report): the **Atlas** no longer vanishes when one line of the location book
is only a note (`- (Second Floor)`): the reader skips what it cannot follow and keeps the rest; the Re:Zero test zone
has an Atlas of its own. **People**: someone the model reports from far away (a mind or an agenda for Beatrice in her
library while you stand in the capital) is no longer shown in the scene; they fold under **Elsewhere** or are marked
**not in this scene**. The **wide window** has a **⇥ Back to the drawer** button on every page, the test zone a
**Leave** on every page, and a settings change can no longer be undone by an older state arriving late. The cost chip
keeps its last reading across a reload. Scan tools: `tests/scan_backend.js`, `tests/scan_atlas.js`,
`tests/fe/scan_panel.mjs`.

**New in 2.7 beta: the body you are in now.** The Race card and the Body & health card follow your **shape**: a dragon
in human form stands on two legs with its wings tucked away; a slime that took a person's shape is a person of jelly;
an Oni's horn or a succubus's wings are tracked **out or hidden** (the HUD wins, then what you set, then the story's
own small `shape` note, asked only for a race that can hide parts or change form). **Evolution** is kept as the race
on the HUD changes. **Organs** are tracked and drawn on the X-ray, with the race's own first (a Gate, the horns, a
core): a broken Gate cannot cast, both eyes lost is blind. A **Sanity** meter (sane to insane). Medium now keeps
**water and food**. **Your measurements**: height, weight, bust, waist and hips, typed in or read from the HUD (bust,
waist and hips are not kept for a character under 18). The slime is redrawn as a round, shiny dome with a core.

**New in 2.6 beta: Body & health.** A body, not a health bar, from how Escape from Tarkov, Gray Zone Warfare,
Project Zomboid, Barotrauma, Kenshi and RimWorld do it: an X-ray body map you can press, what you can still do
(Consciousness, Moving, Manipulation, Breathing, Sight, Hearing), and **hard locks** a broken body sets (two broken
legs: no standing, running or jumping) that no painkiller, adrenaline or power lifts. Pain can be masked; structure
cannot. Fresh wounds tear open, dressings go dirty, wounds get infected; blood, water, food, sleep and stress by the
HUD clock. Where the bot keeps wounds on its HUD (Re:Zero, Mushoku Tensei) it only reads them; where it does not, the
extension keeps the body. HP is hidden in worlds without hit points (kept in Overlord, Skyrim, Dark Souls, Undertale
and D&D). It tells the model nothing while you are fine. Also: **How much** in Play style (**Light**, **Medium**,
**Heavy**: light Re:Zero, heavy Overlord), the **Race** card draws dragons, beasts, serpents, nagas, slimes and
spirits, and HMS Reporter 1.5 has a **Body state** slot.

**New in 2.5 beta:** what the extension costs per reply (the ⚙ chip), **Powers** in the Magic card (Authorities,
Divine Protections, curses, meters, grades and pleas, with the lore each line loads; Veiled and Soft respected), a
**Race** card with a sketch of the body, the weather and the day in detail, Perch you can drag anywhere, and a test
zone with the CotE atlas and room map, Honami's gate and Draconia Malfoy.

**New in 2.1 beta: Minds**, from **FrankenSIM 4 Mini by Wireless (Ryah)**, with permission (TFDY by
**Pyropia**): how each person feels inside and toward you and each other, what they are doing, what they know,
the details the story planted, and whole buildings on the map. The model reports only what moved; the
extension keeps the numbers.

**New in 2.4 beta:** the **spell list reads the Re:Zero, Overlord and Mushoku Tensei magic lorebooks** as they are
written (one entry per spell, tier lists, rank lists), with **Overlord tiers** (`System: Arcane (Evocation) LV 7`);
**Re:Zero spirits** in the Magic card (affinity, contracts with their rank, group codes, spirit arts, a contract's
own clauses); **a clock for every world** (no two the same) with the **weather and °C**; the **test zone** with
Harry Potter and SCP-4666, the page menu in the wide window, and demo letters, weather, spells and spirits;
**Settings** with a picture on every heading in your theme, a find box, a **Look** section, and fewer overlaps;
**page shortcuts** in the drawer, floating and own windows; and **Credits** at the end of the guide.

**New in 2.3 beta:** the **wide window** (a big window over the chat with a menu on the left: World, People, You,
Map, Magic, Story, Letters); a **clock face for each world** (digital, astrolabe, round dial) with a **sky** above it
that follows the hour, and with the weather and the season if you like; **letters, notes, book pages, phone texts,
signs and documents** drawn as the real thing and kept to read again; a **pill HUD**; **Harry Potter** as a world of
its own; and **free emoji** written by the model. See the changelog.

**New in 2.2 beta:** a **Characters** category (every character card read from the lorebooks, profiles for people
without a card, one tracking level: Light, Standard, Full); the **SCP-4666** world with its own theme and card; a
new look (the day dial, four looks for any bot, easy reading) and **Perch**, the mascot. See the changelog.

**New in 2.1.2:** the Magic card lists every spell the bot's lorebook describes and what your HUD lets you use,
with *Study* to learn one; the agendas say how far away people are; and HMS Reporter 1.2.0 covers how people stay
themselves and change, comings and goings, pacing and minor characters.

**New in 2.1.1: Gates.** For characters made with the Character Creation Kit: the extension reads the card's
gated progression block, keeps which phase each character is in, checks a reported gate against the card's own
order, and hands the place back before each reply. See *Gates* below.

By **TenderTriper (Perch)**. Based on RPG Companion by Marinara — see Credits.

**New here? Read the guide.** It is in the panel (the **Guide** button in the top bar) and in
[`GUIDE.md`](GUIDE.md): how the bot, the preset and the extension fit together, how to set them up, and what
every card and setting does. This README is the technical reference. The history is in
[`CHANGELOG.md`](CHANGELOG.md).

## Who is in charge
Three parts make one game, and when they disagree this order wins:
1. **The bot** (its card's HMS core and its lorebooks): the world, its laws, the HUD and everything above the
   `***` wall, the start handler, the catalog and the OOC guide. STATE IS GOD.
2. **The preset** (HMS Reporter beta): how the prose below the wall reads, and the shape of the reply.
3. **The extension** (this): reads the HUD and one hidden block after the prose, shows them, and owns every
   display extra (emoji, dialogue colours, the HUD card). It keeps the Minds state and hands it back as memory.
   It adds no rules and writes no HUD of its own.

## Install
Needs Lumiverse 1.2.0 or newer.
1. Remove or disable the old **RPG Companion** extension first. Both inject into the prompt.
2. Drawer → **Extensions** → **Add Extension**, then either **Install from Source** with this repository's
   GitHub link, or (owner or admin) copy the `rpg_companion_hms` folder into `Lumiverse/data/extensions/` and
   use **Import Local**.
3. Review the permissions and **Install**. New extensions start disabled: turn **Enable** on, then grant the
   permissions: `interceptor`, `generation`, `chat_mutation`, `world_books`, `memories` and `image_gen`
   (portraits only). Skip any you don't want — that part switches itself off and says so.
   The extension asks only for what it uses. Perch on the screen is drawn by the extension itself and needs no
   permission. Nothing reads your other characters, personas or chats.
4. Import `preset/HMS_Reporter_beta.json` (it ships in this folder) in Lumiverse's Preset Manager and pick it
   for your HMS chats.
5. Open the **RPG Companion (HMS)** tab in the side drawer. After the first reply, the panel offers the world
   preset for your bot: one click sets it up.

Settings from an earlier HMS Edition carry over and upgrade themselves; the original RPG Companion's settings
are not read. The guide text lives in `GUIDE.md`; after editing it, `python3 tools/embed_guide.py` copies it
into the panel.

# Technical reference

## How it cooperates with HMS
- **The HUD is read, never duplicated.** Nothing competes with RANK 1. The model is asked for
  one small `<rpg_companion>` block placed after the prose — present characters, people and
  the party, your own state, phone contacts, quest details, a running fight, the Man-God's
  advice, what you did (for the survival clock) and the weather, whichever are switched on and
  nothing twice. It is hidden from the chat and removed from the saved message. Switch it off and the extension
  adds nothing to replies.
- **One request, in the preset's slot.** With the HMS Reporter beta preset, the request for
  that block rides in the preset's own *Side panel* slot after the chat, where it fits the preset's
  reply shape, and the extension does not add its usual message before your turn. Any preset can do
  the same with `{{if::{{matches::{{rpgc_on}}::^1$}}}}{{rpgc_request}}{{/if}}`; without the extension
  the guard keeps the slot empty. Other macros: `{{rpgc_fight}}` is `1` while a fight runs; `{{rpgc_minds}}` is the Minds state; `{{rpgc_gates}}` is where each gated character stands; `{{rpgc_health}}` (2.6) is the player's body (capacities, hard locks, what hurts; from 2.7 the shape, hurt organs and low sanity), empty while healthy; `{{rpgc_papers}}` is `1` while the extension draws letters, notes and books (HMS Reporter 1.4 asks for them only then); `{{rpgc_status}}` (2.8) is one line per person who is not as usual (asleep, out cold, dead, tied up, missing…), empty while everyone is fine; `{{rpgc_study}}` (2.8) is the spell you study, with what the lorebook says, empty otherwise; `{{rpgc_chronicle}}` is the key moments. Every
  other preset gets the message as before. The request only sends last reply's characters as names
  and looks (not their old thoughts), and asks for spells only where the HUD shows magic.
- **The HUD as a card.** In the chat, the World State is drawn as a card: the date and time on top,
  the location path, your lines in rows (bars for HP-style values, chips for lists and standings),
  quests with their barcodes and states, module lines and inline blocks as their own panels. It takes
  the colours of the bot's world (Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, Harry Potter,
  SCP-4666, Undertale, Dark Souls, Skyrim), one of the four looks (Lantern, Tidepool, Dusk, Paper), or
  Lumiverse's own. A small clock sits before the time, in the world's own face. **HUD style**: *Rows* (the
  whole card) or *Pills* (each line a small pill; a long one opens on a press). A dot marks a line that loads
  a lorebook entry, and *Show the HUD as text* opens the plain version. Only the display changes: the saved
  reply keeps its plain-text HUD, so every carrier line keeps loading its entry. Settings → Chat display.
- **Dialogue colours and emoji.** Switch on any of *Emoji before each spoken line*, *Colour each
  speaker* or *Speaker's name* and the model marks dialogue as `[D:Name:mood]"…"[/D]`. The extension
  draws the rest when the message is shown: one colour per character for the whole chat (mixed toward
  your theme's text colour, so it reads on light and dark), and an emoji for the feeling the speaker
  shows, from the same family every time and never the same one twice in a row. 42 feelings are built
  in and the list can be edited. Turning any of it off needs no new replies; markers in old messages are
  hidden. It replaces *Dialogue coloring* while it is on. Presets can follow it with `{{rpgc_marks}}`
  and `{{rpgc_emoji}}`. By default **the extension owns the emoji**: HMS Reporter beta writes none. 2.3 adds
  *Let the model add its own emoji* (`chatDisplay.emojiFree`): the model writes any emoji, as many as it likes,
  and the drawn ones switch off while it is on.
- **Internal states under each reply.** A small panel under the prose with four tabs: *Scene* (time,
  place, weather, who is here, how you are, what you got or lost), *People* (who is present, how they
  look and act, and their thoughts), *Bonds* (standing, bond and the bars that moved since that person's
  last reading, with why) and *Plot* (where the story stands, its threads, your objectives and quest
  details). It shows that reply's own block, so a swipe shows its own. Display only. Settings → Chat and
  panel extras → Under each reply (the panel, thoughts only, or nothing; which tab opens first).
- **The map: where everyone stands** (off by default). *Only in fights* (recommended; the D&D, Power
  scaling and Gritty play styles switch it on) or *Every reply*. The first time the story is in a place,
  the model draws it as squares of about 1.5 m, taking its size, furniture and ways out from the
  location's lorebook entry when one is in context; the room is then kept for that place and only
  people move. Each reply's positions are kept with the reply, and the last ones are sent back so nobody
  teleports. The map shows in Internal states (it opens on the Map tab during fights) and in the side
  panel. About 200 tokens of request plus a short answer, only on the replies it is on for.
  **Map bank:** every room the story draws is kept for its world (the HUD's first place: "ANHS
  Program", "World of Re:Zero"). Coming back the next day, or a new chat with the same bot, uses the
  saved room and spends no tokens drawing it again. A room that changes in one chat (a table went over)
  stays that chat's own; the bank keeps the first drawing unless you save the newer one. The Map card
  lists the bank (view, forget, save, clear), and the Atlas marks each place with a saved map.
  Windows are drawn into the wall they belong to, not as furniture.
- **Atlas: the bot's location book as a map.** The HMS bots write every place the same way — `◆ TIER n
  — KIND`, `◈ PATH: Root → Zone → Site → (Floor) → Room`, the `◈ TIER n NAVIGATION` and `◈ SCENE ANCHORS`
  lists, and the `[SURVEILLANCE]`, `[ACCESS & HOURS]` and `[WHO'S USUALLY HERE]` blocks. The extension
  reads those entries from the lorebooks the chat already loads (no extra calls, no setup), builds the
  whole graph and finds the HUD's ◆ line in it, short names included ("Main Building" is The Main School
  Building). The Atlas card shows where you are as a trail, the place around you with its rooms
  grouped by floor (roof at the top, basement at the bottom), and a details pane for any place: what it
  is, how watched it is, access and hours, who is usually there, its scene anchors. Click a place to go
  in, Up to go out, a trail step to jump. Shells shared by many rooms ("A Classroom") are dashed;
  places the book lists without an entry are dotted. Internal states' Scene tab says how watched the
  current place is, and the map draws a new room from the book: its own walls, or the shell it shares,
  its anchors and where it opens.
  Every bot's book is read, however it is spelled: `## Heading` or `**Bold label:**` sections,
  `- NAME — note` or `- **Name** *(note)*` lists, navigation addenda, population and fauna overlays
  (they join the place they describe), and paths that name a place two ways ("Lugunica" and "Dragon
  Kingdom of Lugunica", "Sanctuary" and "Sanctuary (Cremaldy Forest)") are one place. A room listed
  in one city is never linked to a room of the same name in another. Places without cameras (Re:Zero,
  Mushoku Tensei, Overlord) simply have no camera colour. `[In Transit: A → B]` on the HUD puts you on
  the road from A to B.
- **New game: the bot's catalog as a builder.** Every HMS bot opens on a catalog (its greeting pages):
  a hub that says which `X_Start_Handler` line goes first, a near-empty Canvas page to type under,
  and pages of commands. On a fresh chat the New game card reads those pages as they are: starts,
  add-ons that stack on a start, and ready-made combinations, grouped as the pages group them, with
  blanks like `[Name]` to fill. Pick, and the command is written the way the hub shows it (`Start at
  Arc 3 with RBD, Hell Mode, Start with Echidna` under `ReZero_Start_Handler`). It warns about a
  missing handler line, add-ons with no start, unfilled blanks, or no Return by Death (one click adds
  it). Start the game turns the greeting to the Canvas page and sends the command. The start and resume
  lines are found however the bot spells them (`MUSHOKU_TENSEI_START_HANDLER`), and from the lorebook when the
  pages do not name them. **Resume an old campaign** builds the bot's `X_Start_Continuer` message from the old
  chat's last HUD, your last messages and a summary.
- **Arc line guard.** Every start handler says the Arc line is a lookup key and a misspelled one
  loads nothing, silently. The extension checks the HUD's Arc line against the arc keys in your
  lorebooks every turn; when it fires none (`Arc 1: The First Month` instead of `Arc 1-A: …`, a missing
  track letter, a respaced name) the World State card says so and offers the book's spelling in one
  click. Sandbox arcs, which load no arc on purpose, are left alone.
- **OOC guide.** Each bot's guide (Echidna, Demiurge, Roxy, Sakayanagi) answers questions about the
  world, the rules and the commands. Ask from the panel and the answer stays there: a quiet call with
  the guide's own entry, the catalog pages the question touches and the lore it names; no HUD, no
  time passes, the story never sees it. Name another guide if the bot allows it. "Ask in the story"
  posts it with the bot's own trigger (`[OOC: …]` or `OOC guide: …`), and that turn gets no side-panel
  request, no HUD guard and nothing read as story.
- **Chronicle: the story's timeline, written back into the Memory Cortex.** The extension reads the
  chat as it stands (the swipes you kept) and keeps a timeline: **milestones** the HUD draws (a new arc,
  a rank, class or level, a power gained such as an Authority or a spirit contract, a death and the loop
  it ends, quests started and finished, the first time at a place), **relationship history** (first
  meetings, standing and bond changes, with the reason the story gave), **plot points** (threads opened
  and resolved) and **key moments** the model flags in the side-panel block (a promise, a confession, a
  betrayal, a death, a secret learned; most replies have none). The Chronicle card shows it newest first,
  by loop and day, with filters; click a name for that person's whole timeline with you. Star an
  entry, hide one, or add a moment of your own.
  Once you answer a reply, its entries go into the Memory Cortex: a fact on each person it is about
  (and on the place, for a key moment), one "relationship" link per person toward you, and your own
  milestones on you. Every fact carries an importance tag, so the Cortex keeps it when it trims. In
  Re:Zero a loop that Return by Death undoes is written as undone, for you and for everyone who was in
  it, so nobody acts on a loop that never happened. The latest reply waits, because a swipe could still
  change it. `{{rpgc_chronicle}}` gives the key moments to a preset that wants them without the Cortex.
- **What you carry beyond the HUD.** Some bots keep standard items off the HUD on purpose (Classroom
  of the Elite assumes uniform, student ID, phone, dorm key and textbooks). The You card lists them as
  standard issue and the Phone card uses the assumed phone. Small things you are handed or lose in the
  story (a booklet, a key, a note) are reported in the side-panel block and collect under *Carried*,
  with buttons to remove or add one.
- **HUD Guard.** Each reply's HUD is compared with the last. A vanished line gets **Restore**,
  which writes it back into the saved reply in its original slot so its entry keeps loading.
  **Carrier lines** (Arc, Quests, Memory, Blessings, Game Mode / Gamemode, Now Playing, and
  Authority, Divine Protection, Contract and Mental Council lines) are listed first and marked.
  Lines that end by their own rules — healed Injuries, a passed Condition, a resolved Exam or
  status — are shown softly as **cleared**, with a put-back button in case the engine was wrong.
  A whole-HUD template swap (WHDAAA) is recognised and not treated as damage. Rows inside a
  `───` inline block (Godmother, School Database, D&D sheet) move live and are never diffed.
- **Pins** carry a line forward exactly as written; the model is reminded, and a changed or
  dropped pin is restored.
- **(OOC: Correction).** When the engine catches its own violation and renders again in the
  same reply, the corrected HUD is the one read.
- **Move the world** sends a short nudge as your turn: you take no new action and one off-screen thread
  advances a step, nothing surfaces early, and it never trips The World Moves status on its own. It is a story
  turn, not an OOC message (an OOC message is answered outside the story, with no HUD).

## Minds (from FrankenSIM)
Ported from **FrankenSIM 4 Mini by Wireless (Ryah)**, with permission; **TFDY** (Tenderness, Fury, Dread,
Yearning) is **Pyropia**'s. FrankenSIM has the model rewrite its whole state in a long block every reply. Here
the model reports only what **moved** in the hidden block, and the extension keeps the rest — per reply and per
swipe, rebuilt from the replies themselves, so a swipe or an edit is always reflected.

- **What is asked** (`"minds"`, one entry per named character present): the feeling as a Parrott path and at
  whom; TFDY steps (±1); IW (how warm they show themselves, 0–4); the leading facet; the mask; and `"toward"`
  you and the others present: the twelve feelings that moved (eros, ludus, philia, pragma, storge, agape and
  their mirrors misos, eris, echthros, stasis, adiaphora, phthonos), why, the gate step, the E/L sluices, filter
  cracks and strains, a debt or its payment, the intent and the mode. Someone new also gets a temperament and 5–7
  facets; a new pair gets `"start"` values (3–20). Plus `"agendas"` (who is where doing what, until when),
  `"learned"` (a fact, how it reached them, how sure) and `"chekhov"` (load, fired, drop).
- **The math the extension does.** Each feeling moves at most *max step* (2) a reply; TFDY one step. A feeling
  nothing feeds for *decay* replies (3) eases one step toward where it settles — faster when far from it or near
  the top. Three pushes the same way move the settled level one step (deepening, not just a spike). Nothing falls
  below 1, and first values are at least 3. A mirror pair both at 10 or more is a **wall**. The gate moves one
  step per reply; an open filter never closes; a debt stays until it is paid. A minor (People's minor flag or your
  pin) or family (the bond, or `kin`) gets no desire and no romantic mode, whatever is reported. Facet rotation
  (one facet three replies running) and the strongest carried-over feeling are worked out, not asked.
- **Return by Death.** A rewind (the HUD clock going back in a world that can rewind) undoes every reply after the
  moment it went back to: the world forgets those feelings, what was learned and the plans. Planted details stay
  (the player saw them); a payoff in an undone loop does not count.
- **Chekhov's gun.** Loaded details get ids (`c1`, `c2`…), never twice; locks `T:` a time, `C:` a person present,
  `D:` another id fired, `K:` a condition the story judges. Ripe after three replies; 20 at most (the lightest,
  oldest go); light ones fade after 40 replies, medium after 80.
- **Handed back** before each reply as memory (`[RPG Companion — minds]`): the people likely in the next reply,
  their feelings and dam toward you and each other, agendas with time left or overdue, what they know and how,
  the planted details. In the preset's own slot with `{{rpgc_minds}}`; otherwise in the context message before
  your turn. Separate mode puts it in its own call.
- **The panel.** People cards gain a 🧠 line and *Inside, feelings and what they know*; Quests gains *Planted
  details*; Internal states gains a *Minds* tab; the Map card gains **Whole building** (below). Forget a fact,
  drop a detail, or undo your corrections — kept per chat.
- **Building maps.** The rooms the story drew (this chat's and the map bank's) are grouped into buildings — the
  location book's tier above its rooms, or the HUD path — and floors (`(Second Floor)`, the book's level, or the
  room's own `"floor"`), and laid out flush along their doors, the doors lined up. A new room never moves an old
  one; one that would overlap slides along the wall; a room no door reaches yet is drawn loose. FrankenSIM's
  furniture footprints keep a bed a bed. People not in your room show by their agenda. A new room is told which
  rooms of its building already exist, so its doors can name them.
- **Tone of voice** (FrankenSIM's tone tags): `[D:Name:mood:whisper|steady|tremble|bite]` is drawn as type
  (italic, firm, spaced, bold); the speaker keeps their colour.
- **Settings → Minds (from FrankenSIM)**: the feelings model (twelve feelings, or the classic bars), between
  the others or only toward you, max step, decay, handing the state back, and switches for agendas, who knows what,
  Chekhov's gun and building maps. About 1,000 tokens of instructions and 300–600 tokens of state per reply with
  everything on.

## Modules
**Settings → Modules** switches any feature off: You, Magic, People (with the Party and Present characters parts
of each person's card), Phone, Vitals (in You), Wounds, Conditions, Abilities, Quest details, the survival clock,
Fights, Quests, D&D, Weather, Portraits, Thoughts in chat, the Atlas, the Chronicle, the New game builder, the OOC
guide, Minds and feelings, Agendas, Who knows what, Chekhov's gun, Building maps, the World card, Injuries,
Chapters, Lorebook context, Long-term memory, the Test zone button, and recovering a HUD from the model's
thinking — plus the Spell list and Study a spell (in Magic), Gates (in People) and Profiles (people without a
card), Powers (in Magic), the Race card and Body & health (in You), and from 2.8 On you (in You), Statuses and Party bodies (in People), and the Picture prompt (in Story). Off means it leaves the panel *and* the prompt, so it costs no tokens. These are the same switches as in
the sections below; 2.4 puts a small arrow next to each that opens its section (`modSection(path)`).

The side-panel request goes in **its own system message just before your turn** — your own message is sent
exactly as you wrote it. (1.8 and earlier appended it to your message; that option is still there.)

## Lorebooks
Lumiverse gives the chat's own reply its world books. It does not give them to an extension:
the calls this one makes — the fight setup, every round, the aftermath, the tracker, the
companion block — are direct calls to the model that run no prompt assembly and no world-info
activation. So they used to arrive carrying the HUD and the history but not one line of lore,
and a fight in Nazarick knew nothing about the tier ladder. Now they carry it.

Two sources, because neither is enough alone. Lumiverse's own activation says what is live for
the chat — keywords, selective logic, probability, sticky and cooldown, groups, budget and
vector search, all of it the host's own result, not a guess. On top of that the extension
matches your entries against **the call itself**: the enemy who just walked in, the ability
being used this round, the item on the table. Lumiverse scans the chat, and a fight happens
outside the chat, so without that second pass a fight would never pull its own lore.

**The HUD is what fires them.** Every core says the same thing — each line is a keyword carrier,
and printing it is what keeps its entry loaded. So the whole HUD goes to the matcher: Abilities,
Skills, System / Magic / Gate, Classes, Racial Lvl, Martial Style, Equipment, `[AUTHORITY]`,
`[SPIRIT CONTRACT]`, Blessings, the Arc line and every segment of the ◆ path. A fight therefore
loads the same entries the bot itself would have loaded, instead of only what the last few
messages happened to say.

**Lorebook context** in Settings has the switches — fights, tracker, portraits — an entry and
character budget, and a line reporting what the last call actually carried, so a miss is
something you can see rather than guess at. Without the `world_books` permission it still works:
it falls back to matching the candidate pool itself, and says so.

**Watching world info has a cost, and it is a switch.** The pool comes from a pass-through
world-info interceptor. While any extension has one registered, Lumiverse builds every prompt on
its main thread instead of its faster worker pool — for every chat on the server, not only HMS
ones. **Watch the chat's world info** (on by default) is in Lorebook context. Turned off, the
extension still sends the entries the chat itself activated, read from the books that chat
actually uses, but a fight no longer pulls an entry the chat never triggered. Turning it on works
at once; turning it off takes effect when the extension restarts.

## The engine core in fights
Your engine lives in the card — the rank hierarchy, STATE IS GOD, the lethality gate, and the
world's own physics for how a fight is decided. The card always reached the fight calls, but it
reached them labelled *"information available to you about the characters"*, which frames a
900-line simulator as flavour text. The model read it as a character description and then
resolved the fight on generic RPG instinct.

It is now sent as what it is: **the engine, binding on the fight**, whole, ahead of everything
else — and the extension reads which laws that particular core carries and names them. Overlord
gets level-gap physics, the tier ladder and Super-Tier table, the Karma Firewall and the system
lockouts. Mushoku Tensei gets the Matchup Triangle, Touki, the no-regrowth law and the Drain
Syndrome clock. Classroom of the Elite gets the Plan Gate and its four tests, which outrank the
dice. Re:Zero gets Authorities, Spirit Contracts and Return by Death.

One thing the core cannot be told blindly: RANK 1 says render the HUD first, every response. A
fight round returns JSON, not a turn of the story. So the JSON calls carry the core with an
explicit exception — *this is a side calculation, do not render a HUD* — while the **aftermath**,
which posts to the chat as a real turn, is told RANK 1 applies in full: HUD, then `***`, then
prose.

This is real token cost: a core runs 30–52k characters, so a fight round lands around 12k tokens.
That is the same core the chat itself carries every turn, and it is the difference between a
fight that knows a two-tier gap cannot be closed and one that invents a power system. Both the
switch and the budget are in Settings.

## Long-term memory
Lumiverse feeds the chat's own reply from the Memory Cortex and the vectorised chunk store. A
quiet call gets neither, so a fight knew only the last eight messages — not who this enemy is to
you, not what you swore forty replies ago. Fights and the tracker now query the Cortex about
**the fight itself** (the enemy roster, the declared action, the HUD) and take the top few: the
ranked memories, the entities involved with their facts and status, the current arc, and the
long-term chunks. Retrieval, not a wider history window, so the cost stays small. Needs the
`memories` permission; without it the block is simply absent.

## The panels
In the order the panel shows them in an HMS chat. In the wide window each card sits on a page (World, People, You,
Map, Magic & Skills, Story, Letters); in the other windows a row of **page shortcuts** at the top jumps to them (`uiJumpBar`).
- **The day dial** — the time, the part of day, the day or date, how long the last reply took in the story, and
  the weather report (an icon, the word, the temperature in °C). The clock face is the world's own (see *The look*).
- **World State** — the HUD itself: the ◆ path (folded layers dimmed), arc, every line, inline
  blocks as cards (or a one-line pointer when a card below shows the block in full), pins, the guard,
  the engine's own dice rolls (`[JUDGMENT — d20 … → SUCCESS]`) and ✦ notices from below the wall.
- **The world card** — Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, Harry Potter, SCP-4666,
  Undertale, Dark Souls or Skyrim, found from the HUD. See *World cards*.
- **The fight** — while an immersive fight runs, its tracker sits here. See *Fights*.
- **You** — your body in one card: resource pools as bars (HP, MP, Focus, Super-Tier Slots, Blood Pool…)
  with damage and healing since the last reply, percent meters (Corruption, Od Integrity) with their
  stage, mood, stress, sanity, level and experience, balance and equipment. Experience only exists where the
  world has levels: XP comes from the HUD when it prints one (the Godmother header, an XP line); where the HUD
  prints a level but no XP, the story reports what you earn, and when you have enough for the next level on
  the curve the engine is told — it decides whether and how a level-up happens. A world whose HUD shows no
  level (Re:Zero, Mushoku Tensei, Classroom of the Elite, Harry Potter, SCP-4666) is never asked for experience.
- **Race** (2.5) — the HUD's `Race:` line read from the bot's race book: the floors of the race, a body sketch drawn
  from the entry's words (dashed for hidden parts), the book itself, and from 2.7 the shape you are in now (form,
  hidden parts, who decides), evolution and size. See the guide, part 6.
- **Body & health** (2.6) — the X-ray body map, what you can still do (capacities), the hard locks, pain and masking,
  wounds with their life (fresh, dressings, infection), the meters (blood, water, food, sleep, sanity, stress,
  stamina), organs (2.7), measurements (2.7); and from 2.8 vitality and the death clock, lost limbs first, arteries,
  the female chart, cold and heat, sickness and poison, prosthetics, Treated / Healed by hand. It **reads** a bot's
  own wounds, or **keeps** them where the bot has none (`hlBody`, `{{rpgc_health}}`).
- **On you** (2.8) — the HUD's inventory, money and gear in groups (`invPanel`, `INV_KINDS`). No tokens; the Body
  card's Treat tray uses the same list.
- **Floor plans** (2.8, Map page) — after the room atlas of Ryah | Wireless: **This room**, **Floor plan** (2D) and
  **3D** views, floors, who stands where with their status badge. 2.9: **things** in the rooms (`planThings`,
  `PLAN_THING_WORDS`; "has" words become things), the room map's spots and furniture, the HUD's floor (`planFloorHint`),
  a stale room let go (`lost`), the lorebook's words, size and floors for a new room (`planLoreFor`). The model's `plan` note is asked only for a room
  the plan does not know (`planRequest`); a bot's own `<state:locations>` is read as it is (`planReadXml`). Folded
  over the live replies (`planFold`), kept to `plans.keep` rooms.
- **D&D** — your sheet and the roller. See *D&D*.
- **People** — everyone, one card per person: how they feel about you, their party reading if they
  travel with you, and who they are in the scene right now. See below and *The party*.
  - **Statuses** (2.8): one badge per person (`NPC_STATUS`, 25 kinds: body, where they are, mind and magic), each
    with what it blocks (learn, act, move). From the model's `statuses` note when one changes, or **Change** by hand
    (`npc_status`). Asleep and knocked out expire; the dead and the unconscious learn nothing; the dead's agendas
    freeze. The dead fold under **💀 Deceased** with the cause of death.
  - **Body** (2.8): a party member's wounds and lost limbs on a male or female chart (`npcBodies`), from the party
    entry's `wounds` and `sex`; a dead person's chart shows the cause (beheaded: no head).
  - **☆ Star** (2.9): a starred person lives their own life off screen (`st.offscreen.stars`, message `npc_star`); the
    **Off screen** card on the People page; they come first in the Minds text and are asked for when their agenda is
    over or stale.
  - **📜 History** (2.9): what passed with you, their milestones, and **Between them** (`npcHistoryOf`: the Chronicle
    plus Minds' pair events).
- **Injuries** — for HUDs that do not keep wounds, run on the Re:Zero HUD's own injury law: every injury is
  raw until tended, basic field care makes it treated, and treated is not healed. Each shows its kind
  (wound, fracture, sprain, burn, internal), its severity, and how long it has been in its state; a treated
  one shows its healing window (a severe fracture 70–112 days, a moderate wound 7–21…). The card warns when
  a break has been left unset two days, and at three that it is healing crooked — a malunion is Permanent;
  when a wound or burn left raw risks infection; and that internal bleeding needs a healer. Mark one treated,
  healed, healed with a scar (cosmetic, no penalty) or Permanent — time never lifts Permanent — or add one
  yourself. The story is told them with every message, with the day each is on. **A bot that keeps its own
  wounds owns them for the whole chat**: Re:Zero and Mushoku Tensei print `Injuries: [wound] — [Tag]` only
  while something hurts, so the extension recognises their law (from the card, the `[HMS_INJURY_*]` lore, or
  any HUD that printed one) and stands down entirely — never asking, never reminding, never contradicting an
  absent wound. Their Body card says what the law says about an unset break.
- **Body** — wounds by tag (Raw, Treated, Magic-Healed, Permanent) with time in tag, and a flag
  when one stays Raw too long; conditions on their own ladders (Blood Loss, Shock, Exhaustion,
  Starvation, Thirst State…) with stage, trend and time at stage.
- **Mind** — Dread and other mind conditions, mind status flags, the Mental Council.
- **Survival** (off by default) — a clock for bots whose HUD does not track sleep, food, water
  or state of mind. It does the elapsed-time arithmetic off the HUD clock and hands the engine
  facts; the engine decides the consequences. It stands down for anything the HUD tracks, for
  Undead, and resets on a Return by Death rewind.
- **Magic** — magic pools and meters, traditions and ranks, cooldowns, and a spellbook that learns spells as
  fights and the story show them. The **spell list** (2.1.2) shows every spell the lorebook describes and what
  the HUD lets you use, with **Study** to learn one; 2.4 reads Overlord's tiers and Re:Zero's **spirits**
  (affinity, contracts, spirit arts). See *Spell list*.
- **Skills & traits** (was Abilities; split into learned skills, born traits and the rest in 2.8) — Authorities, Divine Protections, Contracts, Blessings, Skills, Martial Arts,
  magic, classes, talents, world items, traits, and **attributes** read from Gamer Stats, the D&D
  sheet, the School Database, the Godmother block and OAA. What counts is a vocabulary you edit.
- **Quests** — first **the plot**: where the main story stands and its open threads, marked moved or resolved
  as the story goes, with the resolved ones kept below. Then **objectives**: what you are trying to do right now
  as the story sets it, plus your own (those stay with you and are never sent). Then the quests: cards with the current objective, a progress bar, who gave it, where, the reward, and a deadline
  counted down on the HUD clock; a focus quest, starred to the top. Built on the Quests line and bracket quests (`[MAIN QUEST: …]`) with state badges,
  objectives (Decree checklists, Milestone, Exam, `[EVENT: …]`), a journal, and a warning with
  **Put back** when a quest leaves the line while still live — its printed name is what loads it.
- **The relationship part of a person's card** — everyone you have dealt with. Two things are tracked apart: **standing**, how close they
  are to you (Nemesis … Stranger … Devoted — closeness only, never romance), and **bond**, what kind of
  relationship it is, in their own entry's words (family, mentor, contracted spirit, rival, a romantic
  partner…). Plus their mood, and bars for Affection, Trust and Respect (−100 to 100) and Desire,
  Tension, Jealousy and Fear (0 to 100), with the reason shown under whichever bar moved. When they are
  in the scene, their outfit, position, agenda and secret show as a dossier. Four layouts.
  **Romance is guarded**: anyone who is or appears to be a minor, and every family bond, can never be
  given a romantic bond or any desire, whatever the model returns. If the story reads a relationship
  wrong, **set the bond** yourself; the model is told.
- **Phone** — your device and balance read from the HUD (or your inventory); contacts earned in the story;
  threads rebuilt from the chat. Four kinds: a **phone** (texts, calls, transfers), a **conversation
  mirror** (speaks only to its twin), the **Message** spell (reaches anyone you have met) and a **comms
  radio**. Everything goes into the story as your turn, and the engine decides whether it reaches anyone —
  a world without phones has no phones.
- **Letters and notes** (2.3) — every letter, note, book page, phone thread, sign and document the story gave
  you, newest first, drawn as the thing itself. Read from the replies (`papersOf`), so a swipe is followed.
- **Letters and notes** (2.9): seals (`paperSeal`, set by hand with `paper_op` seal), **EXAM** papers and a Grades
  list, **CONTRACT**s with terms, penalty and signatures, a Contracts list, **Mark this contract as ended** (`paper_op`
  end); contracts in force ride with the statuses (`contractLines`, `chatDisplay.papersContracts`).
- **Picture prompt** (2.8, Story page) — a prompt for Krea 2, Nano Banana or Qwen Image from the HUD and the
  people in the scene: full scene, one character or action, and the shape. No tokens.
- **Chapters** — see *Chapters*.
- Weather and portraits — as in the original.

A red **Critical** banner collects real danger: a health pool near zero, a condition at the top
of its ladder, a wound left Raw, a failing survival track, a party member starving or in agony.

## The party
Party readings sit inside each member's card under People. Add members by name at the bottom of People,
from suggestions (a contract on the HUD, or someone present in most recent replies), or with **+ Party**.
Each reply, members in the scene are read — and nothing is asked twice: their mood and jealousy come from
the relationship reading, what is on their mind from their thoughts in the scene:
- **In their card's own words** (V7.0 toolkit): State Register, Affect Band or behavioural mode,
  contract stage, gated progression phase, vessel front, signature tell. None are defined by the
  extension, and card content is never restated into the prompt — only short labels carry forward.
- **Universal levels**: affection, trust, jealousy (and of whom), irritation, holding the act,
  hunger, fatigue, pain, stress.
- **Alerts**: a strain at the alert level ("Honami is very jealous of Kikyo — for 40m"), a strain
  climbing several replies running, affection or trust falling sharply, and a **skipped phase or
  stage**, which a V7.0 card forbids. Absent members keep their last reading, in the past tense.

## World cards
Each world gets a card of its own, found from its HUD — no preset needed: the four HMS bots, Harry Potter and
SCP-4666 (2.2–2.3), and Undertale, Dark Souls and Skyrim. Everything on it
is read from the HUD; the only arithmetic is the time left on the HUD's own clock and the change between
two of its own readings.
- **Re:Zero** — deaths, the witch's scent and your save point; each Authority with its state and what
  *your own lorebook* says it does; Divine Protections the same way; Spirit Contracts on their rank ladder
  (Lesser → Sovereign) with what each rank *is*, from your spirits lorebook; your Spirit Affinity (2.4: when the
  Magic card shows the spirits, the world card leaves them to it and says so); your magic —
  element, what your Gate and Pool ranks mean (from the Magic module's own tables) and the element's spell
  series from your magic lorebook; Od Integrity and Corruption on their five named stages with the next one;
  curses with what your lorebook says they do; the Mental Council; the WHDAAA Theater (season, episode, scene,
  audience); in Arc 0,
  the prequel year on its −20 → 0 axis with its Part and milestones; and, with Loops on, how each life ended. In D&D mode the D&D card reads the bot's own character sheet.
- **Overlord** — overall, racial and job levels (and a warning if they stop adding up); each job class
  with its tier and level cap read from *your own class registry*, legendary classes marked; traditions with
  their LV (LV 11 is super-tier capable) and, opened, every spell up to that LV from *your own magic core*; a
  **framework check** against the Being Framework and the Traditions and Super-Tier modules (class caps —
  Base 15, High 10, Rare 5 — class levels adding up to Job Lvl, the 100 cap, no racial levels for Humanoids,
  LV 11 only from Job Lvl 71, Super-Tier slots by Job Lvl); Karma on its
  −500…+500 scale, Super-Tier slots and cooldown, the adventurer cover (Momon's rank), your role, World
  Items. In a fight every combatant has a level, and each enemy shows the gap to yours — the level gap is
  physics, and the story is told it.
- **Classroom of the Elite** — the school calendar and the days to the next Class Point announcement; cohort
  and seat; the Standings table and how each class moved since the last
  reading; Private Points and their change; Surveillance; the exam day by day; OAA; the Protection Point; an
  expulsion risk up front; the Godmother (level, XP, the Decree and its conditions, Owed, and the time left
  to Midnight); and the School Database sheet.
- **Mushoku Tensei** — the K. calendar and your age, where you were born and how, adventurer rank and party,
  Mana Capacity, casting and Touki, sword styles and magic schools on their rank ladders (Beginner → God) —
  open a school to see every spell you can cast from *your own Master Spell Index*, and what the next rank opens;
  the same for sword styles from *your Master Technique Index*, with the Sword God / Water God / North God
  triangle; what your Mana Capacity and Touki stage mean —
  languages, Demon Eyes, curses and blessings, Drain Syndrome, the academy term — and the Man-God: each
  piece of his advice is written down with the dream it came in, and you mark whether you followed it.

- **Harry Potter** — the school year (of 7) and term, your house, blood status and age, the four house-point
  hourglasses, your wand (wood, core, length; borrowed, won or broken), your studies on their LV-of-7 bars, extra
  spells, how you cast, and your Patronus. Reads `Year 4/7 · Autumn Term · …`, `House Points: G 115 · H 100 · …`,
  `Wand:`, `Studies: Charms LV 4 · …`, `Extra Spells:`, `Patronus:`.
- **SCP-4666** — the night of twelve and its phase (Weissnacht), the case code, the mode (the household or the task
  force), who is in the household or how many of the team still stand, conditions, and the coin. Reads
  `Weissnacht: Night 5/12 — The Watching #4666017`, `Mode:`, `Household:` or `Team: Standing 3/7`, `The Coin:`.
- **Undertale** — LV, EXP to the next LV and gold; your SOUL with its colour and trait; the route, with the
  kills in this area on a bar when the HUD counts them; the SAVE point; AT and DF, weapon and armor; KR;
  resets. SAVE, LOAD and RESET send the clock back, so with Loops on each timeline becomes a chapter.
- **Dark Souls** — soul level, souls and deaths; a warning while your bloodstain waits somewhere; Estus and
  Ashen Estus as flasks; Humanity and whether you are Hollow or Embered; the bonfire you rested at; your
  covenant, with what your lorebook says of it.
- **Skyrim** — level and the progress to the next; dragon souls and perks to spend; race and Standing Stone;
  every shout with its words; your skills as bars; bounties by hold; factions and ranks; gold; carry weight,
  with a warning when you are over-encumbered; afflictions.

The lines each of those three cards reads, for a bot that wants to print them:
`LV: 2 | EXP: 20 | NEXT: 10 | G: 42` · `SOUL: Red — Determination` · `Route: Neutral | Kills: 3/20` ·
`SAVE: Snowdin — Town` · `AT: 10 (1) | DF: 10 (2)` · `Weapon: … | Armor: …` · `KR: 12` · `Resets: 1`;
`Level: 31 | Souls: 4,120` · `Estus Flask: 3/5 (+2)` · `Ashen Estus: 2/2` · `Humanity: 2 | Form: Hollow` ·
`Bloodstain: 4,120 souls — the tower bridge` · `Bonfire: …` · `Covenant: … (Rank 1)` · `Deaths: 12`;
`Level: 18 (Next: 40%) | Race: Nord | Standing Stone: The Warrior` · `Dragon Souls: 2 | Perks: 1 unspent` ·
`Shouts: Unrelenting Force (2/3), …` · `Skills: One-Handed 52 · Block 41 · …` · `Bounty: Whiterun 40 · …` ·
`Factions: Companions (Whelp)` · `Gold: 612 | Carry: 214/300` · `Affliction: Vampirism (Stage 2)`.

The Godmother, School Database and D&D sheet blocks show in full on their card; the World State shows a
one-line pointer instead of printing them twice, and what a card shows (Authorities, classes, shouts, skills…)
the Abilities card leaves to it. Switch the card off under Modules → World card, and the Abilities card lists
them again.

## Chapters
Memory at the scale the story is cut at, riding along with every message **on top of** the history —
nothing is removed from the prompt.
- **By hand**, always: **End chapter and summarise** (or just **End chapter**) closes everything since the
  last chapter. Give it a title or let the summary name it. Edit any summary, leave one out of the prompt,
  or delete it; the messages stay.
- **Loops (Return by Death)** — off by default. When the HUD clock goes back, the life that just ended
  closes as a loop. Its summary says how it ended, and **what you uncovered** in it collects into one
  list. It goes to the model as what it is: *undone — the world does not remember it, only you do* — so
  nobody else acts on a loop that never happened.
- **Arcs**, **Days** and **Months** — off by default. A new chapter when the Arc line, the day or the calendar
  month changes (the Classroom of the Elite preset switches Months on).
- Long chapters are summarised in parts, then as a whole. Fights get the story so far too.

## Fights
Two different ways to fight. They are not variants of each other.

### Immersive fights
No window and no turns. You fight by writing in the chat, like any other turn, and the side panel
is the live tracker. Start one with **Immersive fight** (or set **When a fight starts in the
story** — it is off by default).

- **The body is real.** HP, MP and Stamina for everyone ride upstream with every message, in
  words the story has to honour: at low HP you are bloodied and short of breath, at low Stamina
  the blade is slow, at low MP each spell has to be forced out. **STATE IS GOD**: where your
  engine's HUD prints your own HP, MP or Stamina (Overlord prints HP and MP; Dark Souls and Skyrim print
  Stamina too), the HUD owns it and the panel only reads
  it; everything else the extension tracks. An undead who never tires gets no Stamina at all.
- **Effects and how long they last.** Bleeding, stunned, pinned, inside a barrier — each stays on
  the card with its duration ("Bleeding · 3 replies") until the story ends it.
- **What just happened.** Every fighter's last move, each enemy's visible telegraph ("Winding up:
  …"), a line saying what the last reply changed, and a fight log you can scroll back.
- **Hidden plans.** Each enemy keeps a real intent from one reply to the next. The story sees it;
  you only ever see the telegraph. It never reaches the panel.
- **Study** an enemy and your next message spends attention on them: the story reports what
  careful observation honestly reveals — intent, tells, weaknesses, true strength — and it stays
  on their card. **Click a weakness** to act on it with your next message, with advantage.
- **How it resolves**: Engine rules (the bot's own system), Power level with feats, hax and
  counters, or Fiction alone. **Difficulty**: Story, Normal, Hard, Hardcore.
- **Fate dice** (optional): a true-random die for every fighter with each message. A die leans how
  well an attempt goes; it never makes the impossible possible — a level gap stays physics, the
  Plan Gate still decides what can be tried. A swipe keeps its dice.
- **Swipes are safe.** Every reply is applied on top of the state from before it, so a swipe,
  regenerate or edit lands exactly once — pools, effects, the reply count and the log alike.
- **It ends itself** when one side is down, when the enemy gets away, or when you do. In Undertale it knows
  MERCY: a monster that can be spared says so, and a fight where everyone was spared ends as spared. A rewind
  (the HUD clock going back past the fight's start — Return by Death) drops it.
- Click any number the extension owns to correct it in place.

### Turn-based fights (D&D)
**Turn-based fight** opens a window and the extension runs D&D rules: initiative order, attack
rolls against AC, damage dice, critical hits, saving throws, spell slots, the Dodge action, death
saves (and massive damage), stabilising a dying ally. It rolls every die and applies HP itself; the
model narrates the final numbers and plans what everyone else does next round. Your actions come
in three categories (Attack, Spells, Abilities & skills) plus Items, from the setup, which sees your
HUD. Allies take **orders**, and an irritated or distrustful companion rolls to obey. **Check**
studies anything, **Guard / Dodge** and a risky **Flee** are there, and enemies keep hidden plans
behind visible telegraphs. Difficulty scales enemy HP, AC and to-hit, flee odds and death.

Turn-based fights live under **Settings → D&D**. Switch D&D off and the Turn-based fight button goes
with it.

### The narrative window (legacy)
The fight window from 1.8, where the model judges each action, is still here. Switch on **Show the
narrative fight window** under Settings → Fights → Legacy and a third button, **Narrative window**,
appears. It uses the same style, fate dice and difficulty as immersive fights.

One fight at a time: while one runs, the others stay hidden. The input-bar fight button asks which
kind you want.

## D&D
One section, one switch (Settings → D&D, or Modules). Off, all of it leaves the panel.
- **Your sheet**, per chat: the six ability scores with their modifiers, proficiency from your level,
  saving-throw proficiencies, and the 18 skills (not proficient, proficient, expertise), with Passive
  Perception. A chat without a sheet starts from the stats you set before. **STATE IS GOD**: where the
  bot's HUD prints STR, DEX and the rest, the sheet reads those and marks them HUD.
- **The roller**: a skill check, an ability check, a saving throw, initiative or plain dice, with
  advantage or disadvantage, a bonus and an optional DC. It shows the whole sum — *d20 14 + DEX +3 +
  proficiency +2 = 19, DC 15: success* — and that sum goes into your next reply, in the chat it was
  rolled in. A die decides how well an attempt goes; it never makes the impossible possible.
- **Turn-based fights**: the D&D fight window and its rules.
- **Off by default** (2.8): only the D&D play style turns it on (settings v10 turns it off in older settings).
  **No cap on stats** (`dnd.uncapped`) lets a score go up to 999.

## Play style presets
At the top of Settings. Every preset turns HMS on — **Always** mode, the side-panel block, the guard and
pin reminders — because they are made for HMS bots. A preset changes only what it names: a section it
touches is merged into yours, so your chapter budget, your D&D rules and your XP curve stay as you set them.
- **How much** (2.6; 2.8 adds **None**, **Potato** and **Max**) — applied on top of the world or style you pick
  (`STYLE_TIERS`), the same steps as HMS Reporter's **Mode** dial. **None** sets nothing. **Potato**: who is here, how
  they stand, the locks of a broken body; no thoughts, Minds, statuses asks, maps or profiles (about 150–300 tokens).
  **Max**: Heavy plus the room map every reply, the floor plans in 3D and the full Minds (about 2,000–3,000).
  Light: no Minds feelings, no profiles, the time-only sky, no weather detail, no room map, the light body (about 300–500
  tokens a reply). Medium (default): thoughts, feelings toward you, agendas, profiles, the medium body, the full sky
  (about 700–1,100). Heavy: feelings between the others, who knows what, the party's needs, the heavy body, the room map
  in fights (about 1,300–2,000). A saved preset of yours applies exactly as saved.
- **Worlds** — each sets what its bot needs in one click: the world's carrier lines, abilities vocabulary,
  meters, quest tags, party depth, phone kind, the world card, which chapters it keeps, fights and theme.
  - **Re:Zero — The Living World**: Authorities, Divine Protections, Spirit Contracts, the Mental Council
    and WHDAAA reels as carriers; Corruption rising and Od Integrity falling as dangers; conversation
    mirrors; the party tracking Affect Bands, gated phases and bond stages; Loops and Arcs chapters; D&D on
    for the bot's D&D mode; engine-rule immersive fights.
  - **Overlord — The Living World**: Gamemode and Blessings as carriers; Abilities read as passives and
    Skills as actions; Martial Arts, talents, world items, Runecraft, Focus, Super-Tier Slots, Blood Pool
    and Thirst State; the Message spell; the world card with its framework check; Arcs chapters; engine-rule
    immersive fights where the level gap is physics; no D&D — YGGDRASIL runs on its own levels.
  - **Classroom of the Elite — HMS Render Engine**: Arc, Quests, Memory and Game Mode as carriers; Exams that
    clear themselves; OAA, the School Database and Godmother stats as attributes; smartphones with Private
    Point transfers; relationships up front; Months and Arcs chapters; no D&D and no roller of yours — the
    School Database rolls its own dice.
  - **Mushoku Tensei — The Six-Faced World**: the Arc, Memory, Man-God and Demon Eye lines and Game Mode as
    carriers; sword styles, magic schools, Touki, casting and contracts as abilities; the HUD's own injuries
    and conditions, so no survival clock; no phone; Arcs chapters; no D&D; engine-rule immersive fights.
  - **Undertale — The Underground**: the Route, SOUL and SAVE point as carriers; LV, EXP, AT and DF on the
    world card, KR as a rising danger; cell phones; SAVE, LOAD and RESET understood as rewinds, with each
    timeline kept as a Loops chapter; engine-rule immersive fights.
  - **Dark Souls — The Age of Fire**: the Bonfire and Covenant as carriers; the nine stats as attributes;
    HP, FP and Stamina as pools, with Estus as flasks on the world card; Hollowing, Curse, Bleed, Poison and Frostbite as rising dangers; no
    phones; Hard difficulty; engine-rule immersive fights.
  - **Skyrim — The Last Dragonborn**: the Hold, Quests and Factions as carriers; Health, Magicka and Stamina
    as pools; shouts, skills, perks, the Standing Stone, powers and afflictions as abilities; followers in the
    party; no phones; engine-rule immersive fights. Switch the survival clock on for Survival Mode.
  - **SCP-4666 — The Yule Man**: the panel as a typed Foundation report; the world card counts the twelve
    nights of Weissnacht with the phase, the mode, the household or the team, and the coin; no magic, no D&D.
  - **Harry Potter — The Wizarding World**: Hogwarts colours; the world card shows the year and term, your house,
    the house-point hourglasses, your wand, your studies (LV of 7), extra spells and your Patronus; no D&D.
- **Play styles**, on top of a world or on their own:
  - **HMS Narrative** — the default: your engine decides immersive fights, party and relationships tracked,
    the world card and chapters on, no survival clock.
  - **D&D** — your sheet, the roller, and turn-based fights with the full tabletop rules.
  - **Power scaling** — fights settled by power level, feats, hax and counters, with fate dice.
  - **Pure narrative** — no dice anywhere (no roller, no D&D, no fate dice); fights ask the story for the
    least; lightest on tokens.
  - **Gritty survival** — the survival clock, wounds flagged sooner, companions who question orders, Hard.
  - **Social & romance** — relationships up front in the hearts layout, party moods and bonds, the phone.
- **Your own**: save your setup under a name and apply it later. It remembers every system.

Themes (Settings → **Look**): the four HMS world themes follow their official wikis — section headers as wiki
banners, cards as infoboxes. **Undertale** (black boxes, white borders, pixel type, MERCY yellow), **Dark Souls**
(ash and stone, ember light, carved capitals), **Skyrim** (smoke-black menus, bone-white type, thin rules),
**SCP Foundation** (a typed report: paper, black rules, one red stamp) and **Harry Potter (Hogwarts)** (deep red,
gold and old paper), plus four looks for any bot — **Lantern**, **Tidepool**, **Dusk** and **Paper** — and D&D,
Heaven, Horror, Hell, Space, Parchment, Midnight, Terminal and Sakura.

**Where the panel lives** (the selector in the top bar, next to Test zone and Settings): in the drawer, as a **floating mini panel** you can drag, resize,
minimise to its bar and enlarge, in **its own window** for a second screen — which wears Lumiverse's own
fonts, text boxes and colours, and follows the app's theme — or in the **wide window** (2.3): a big window over the
chat with a menu of pages down the left. Settings → **Look** (2.4, out of Play style) has the theme, density
(comfortable or compact), text size (small, normal, large), **Easy reading**, the day dial, **Clock face**, **Sky
above the clock**, the wide window's menu labels, **Perch** and the page shortcuts.

## Help & bug report
**Settings → Help & bug report → Copy bug report** puts a report on your clipboard: the version, your settings
(custom prompts summarised, not copied), what the extension read from the latest reply, what it injected, and
recent problems. No chat text unless you tick the box. Paste it in the Discord.

When a model writes the HUD or the side-panel block into its **thinking** instead of the reply (common with
reasoning models behind a proxy), the extension moves it back where it belongs, and a reply that still carries
a raw block is processed on the next update.

## Test zone
2.5: the demo lore is built from the owner's books (trimmed): `SANDBOX_RZ_POWERS` (template-shaped powers),
`SANDBOX_RACE_BOOK` and `SANDBOX_LICH` (races), `SANDBOX_HONAMI` and `SANDBOX_COTE_LOCS` (CotE gate and atlas),
`SANDBOX_DRACONIA` (the Thaw, phases 0–3 only). The room map is drawn in the test zone even with positions off.

**Test zone** in the top bar opens a practice chat that lives inside the extension. It runs exactly the
code a real chat runs — the prompt injection, reply processing, the HUD guard and pins, party, people,
the phone, immersive and turn-based fights — and touches none of your chats.
- **Demo** plays scripted turns for Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, Harry Potter,
  SCP-4666, Undertale, Dark Souls, Skyrim or a classic
  chat — each printing its bot's current HUD, so the world cards show there too — and fights
  answer from a script too — an immersive fight plays out over three scripted exchanges: no tokens. Turn 2 wounds you and hands you a contact; turn 3 drops a carrier
  line so you can watch the guard catch it.
- **Live** uses your model, with a small world narrator standing in for a bot card. Each narrator asks for a
  `Weather:` line with °C, so the clock has the weather there too.
- **2.4**: every demo HUD has a weather line with °C, and the turns carry a letter, a note, a sign or a notice
  (Letters card), and in Re:Zero `Magic:`, `Spirit Affinity:` and a `[SPIRIT CONTRACT: Blaise | RANK: …]` line.
  Re:Zero, Overlord and Mushoku Tensei get a small demo lorebook (`SANDBOX_LORE`, set as the zone's lore pool by
  `sandboxLore()`), so the spell list and spirits show; your own lorebooks are never read in the zone.
- **2.4, the wide window**: the zone has the page menu too (`wideShows` no longer shows every card in the zone).
  The zone's own page keeps the controls and page buttons; each card page gets a strip (`tzStrip`) with
  **Next turn** and **Back to the test zone**. In the other windows the page shortcuts sit under the controls.
- Type as you would in a chat, press **Next turn**, **Test a fight**, or try the phone. Settings you change
  apply in the zone too, so it is the place to try a preset before you use it for real.

## What stands down in HMS chats
- **Choose your own adventure** — every HMS engine forbids ending on options (World, not GM).
- **Plot buttons** — Move the world replaces them; the random twist list can break canon gating
  and hand out plot armor.
- **Immersive HTML and dialogue colouring** still work, but are told to keep the HUD and everything
  above the `***` wall as plain text.
- **Injuries** — for a bot that keeps its own (Re:Zero, Mushoku Tensei), the extension asks for nothing about
  wounds. From 2.6 the Body & health card **reads** that bot's own `Injuries:` and `Condition:` lines and tells the
  story the hard locks they mean (a broken leg: no running), adding no wound and running no clock.
- **HP** (2.6) — hidden in worlds without hit points (kept in Overlord, Skyrim, Dark Souls, Undertale and D&D games).
- **Experience** — never asked in a world whose HUD shows no level.
- **OOC turns** — a message starting with the bot's OOC trigger gets no side-panel request, no HUD guard, and
  its answer is not read as story.

## When something does not show up
- **Read again** (on the button row under the top bar) reads the latest reply again — its HUD and its
  side-panel block — exactly the way a new reply is read. It makes no model call, so it costs nothing. Use it
  whenever the automatic read missed something.
- **The World State is empty?** It says why: no reply yet, the WORLD STATE written inside the model's thinking,
  or a WORLD STATE that is not a heading on a line of its own — and shows how the reply starts. A HUD written in
  HTML (some presets do) is read through the markup.
- **"Your provider allows only one request at a time"**: some free plans run one request at once. The
  extension's own calls then wait for yours, try again twice, and never start while you are already writing the
  next reply. If it still cannot get through, press Refresh when the reply is done — or Read again, which is free.
- **Installed for every user (operator scope)?** Supported: every call that needs to know whose chat it is
  carries the user.

## Settings map
Sections are closed until you open them. In HMS chats the classic tracker sections stand aside. 2.8: **tabs** under
the find box (All, Setup & Look, World & Maps, People & Minds, Body & Health, Magic & Skills, Fights & D&D, Memory &
Chapters, Advanced; `SET_TABS`, `uiSetTab`) show one group of sections at a time. 2.4: each heading
has a small picture in the theme's colours (`SET_ICONS`, `.rpgc-sico`), and a box at the top finds a setting by
name (`settingsHero`, `settingsFilter`). Sections that touch the same thing link to each other (`goSection`).
- **General** — the master switch, Together or Separate mode (the tracker in the reply, or a second call
  after it), updating after each reply, narrator mode, the connection the extension's own calls run on,
  letting the model think, how many messages a call reads, and how long to wait for the model.
- **HMS engine** — mode (automatic / always / off), the side-panel block and fetching it when a reply forgets it,
  the guard, pin reminders.
- **Play style** — world presets, play styles and your own presets.
- **Look** (2.4) — the theme, density, text size, Easy reading, the day dial, the clock face, the sky above the
  clock, the wide window's menu labels, Perch, the round button (`uiPerchFloat`: wide, always, or off, 2.8), and the page shortcuts. Where the panel lives is chosen in the top bar.
- **Modules** — every feature in one place; switch off what you do not use. The arrow opens a switch's section.
- **Chat display** (called *Chat and panel extras* before 2.4) — under each reply (Internal states, thoughts
  only, or nothing), the map (off, only in fights, every reply) and the map bank, the HUD card (its colours and
  **HUD style**: Rows or Pills), **Letters, notes and books** (draw them; ask the model for them), dialogue emoji
  (and *Let the model add its own emoji*), colours, names, tone of voice and the emoji families, lock buttons,
  plot buttons, weather effects, portraits.
- **People, party & phone** (classic chats) — relationships, the party and the phone, read from the tracker.
- **Lorebook context** — whether the extension's calls carry your world books, and which (*Send lore with*: fight
  calls, tracker and companion calls, portrait calls), how lore is found (watching the chat's world info, matching
  the scene), how much is carried, and what the last call actually sent.
- **Engine core & memory** — whether the core runs in fights, and how much long-term memory is recalled.
- **HMS systems** — vitals, body and mind, abilities and attributes, injuries, You (the level-up note and the XP
  needed per level), people, phone, party, carrier and self-clearing lines, the survival clock. Every
  vocabulary is editable.
- **Body & health** (2.6) — on or off, How much it tracks (None, Light, Medium, Heavy, Custom; 2.9), each part on its own (locks,
  dressings, blood, sleep, water and food, stamina, strain, stress, cold and heat, sickness, sanity), the Race card,
  asking about your shape, the body chart (auto, male, female), arteries, vitality, units, telling the story your
  measurements, telling the story, asking for the body note, and where HP shows (`hlCfg`).
- **Characters** (2.2) — the tracking level (None, Light, Standard, Full, Custom; 2.9), every switch about people in one place,
  profiles for people without a card, your party's bodies (`party.trackBody`, 2.8), the **Statuses** switches
  (`statuses`: on, ask, tell, hooks; 2.8), and undoing your profile changes.
- **Maps** (2.8) — floor plans (`plans`: tier off / room / plan / 3d, who, ask), the Atlas, the room map and map
  bank, building maps.
- **Magic & Skills** (2.8) — the Magic card, the spell list, studying, powers, and Skills & traits.
- **Minds (from FrankenSIM)** — feelings (twelve or the classic bars), between the others too, the step size, the
  fading speed, handing the state back, agendas, who knows what, Chekhov's gun, building maps, and the credits.
- **Gates (card progression)** — on or off, moving by itself or asking you first, handing the positions back, the
  cards it read, and undoing your own changes.
- **Quests** — the Quests panel, the plot, objectives, quest details, the journal, the quest line labels and states.
- **Chapters** — loops, arcs, days and months, summarising on close, the summary length, the budget, and
  whether fights get them.
- **Chronicle** — the switch, asking the story for its key moments, and what goes into the Memory Cortex
  (off, only the biggest moments, key moments with bonds, plot and milestones, or everything).
- **Fights** — **Fights on** (2.4: moved here from Chat and panel extras), difficulty; immersive fights (how they
  resolve, fate dice, auto-start, effects, moves, hidden plans, the log); and the legacy narrative window. Links
  to Lorebook context (lore for fight calls) and D&D (turn-based fights).
- **D&D** — the switch (off unless the D&D style, 2.8), the roller, whether the HUD's scores win, turn-based fights,
  and No cap on stats.
- **Panels** (classic chats) — which tracker panels show, the story extras, and the bar colours.
- **Story extras** — immersive HTML, dialogue colouring, deception tags, the omniscience filter, choose
  your own adventure (classic chats only; HMS engines forbid ending on options), song suggestions.
- **Your stats setup**, **Scene setup**, **Present characters setup** (called *Characters setup* before 2.4) — which fields the tracker
  asks for: your stats, status, mood, skills, attributes and level; date, weather, time, place and recent
  events; each present character's details, relationship, thoughts and bars.
- **Tracker field presets** — save and load sets of tracker fields.
- **Custom prompts** — the words each feature sends (each box is named "… — words"), editable, with a reset to the
  built-in text. The switches for them are in Story extras.
- **Help & bug report** — open the guide, and one click to export what a bug report needs.
- **Reset** — settings back to their defaults, or this chat's trackers cleared.

## Engines tested
Re:Zero (the 18-slot map, wounds and conditions, Authorities, Spirit Contracts, the Mental
Council, WHDAAA, the D&D and Gamer Stats blocks), Overlord / YGGDRASIL (HP/MP, Martial Arts and
Focus, Super-Tier Slots, Undead immunities, the vampire line, Gamemode, Blessings, talents, world
items), Classroom of the Elite V2.0 (the header, Cohort and Standings, Private Points, Surveillance,
Quests, Condition, Exam, the School Database and Godmother blocks, the dice layer, OAA), and Mushoku
Tensei (the K. calendar, Birth and Age, Mana Capacity, Martial Style and Magic School ranks, Touki,
Languages, Demon Eyes, the Man-God, Drain Syndrome, Adventurer, the Ranoa term). Re:Zero's Return by Death
lines, Arc 0 years and the D&D character sheet; Overlord's racial and job levels, traditions and class
registry. Also CRLF line endings and a blank line before `***`.

## Non-HMS chats
Mode **Automatic** turns HMS handling on when the chat has a WORLD STATE HUD. Any other chat gets the
classic RPG Companion behavior — plus **People**, **Party** and **Phone**, read from the same tracker reply,
with their settings under **People, party & phone**.

## Not yet
The music player is not ported (song tags are still hidden). From FrankenSIM, on purpose: its time header
(the HUD owns time), the ARC engine (the bot owns its arcs), the POV and persona rules, and the GM's notebook
(the plot threads, the Chronicle and Chekhov's gun cover it). The interface is English only. The weather overlay and the floating panel mount straight into
the page rather than through Lumiverse's app-mount API. Momon and Ainz as two identities with separate
reputations: the Overlord HUD prints only the cover rank today; give it a line such as
`Identity: Momon (Cover)` and the card can read it.

## Characters (the card and the story)
Code: `HMS_SYS_DEFAULTS.characters` (`profiles`, `tell`), the `char*` functions (above the Spells banner).
- `charCards(chatId)`: every lorebook entry with `[BASIC INFO]` or a gated block → name, aliases, up to five facts
  (Age, Gender, Occupation, Role, …), known sections present, `tags` (`gatePhaseTags`: `[Phase 3]`, `[Phase 3-4]`).
- Profiles: asked as `"profiles": [{name, role, look, voice, persona, secret}]` only while someone in the last reply
  has neither a card nor a profile (`charNeed`); stored per swipe; `charFold` keeps the first words per field, fills
  empties from later reports, skips anyone with a card and the player, and applies the player's edits last
  (`st.chars.profiles`, `st.chars.forget`; message `char_edit`: field, forget, reset).
- Handed back as `[RPG Companion — people]` in the interceptor's context message, for profiled people around.
- The tracking level is not stored: the frontend's `charLevelOf(settings)` compares the switches with `CHAR_LEVELS`.

## The look
- Themes are CSS variable sets on `.rpgc.theme-<id>` (list: `THEMES`). 2.2 adds `scp`, `lantern`, `tidepool`,
  `dusk`, `paper`. The in-chat cards take the same looks through `HUD_CARD_THEMES` / `chatDisplay.hudTheme`.
- The day dial: backend `hmsNowPanel(chat)` → `state.hms.now`; frontend `renderNow()` (an SVG built from numbers).
- Perch: two small WebP copies of the owner's mascot inside `frontend.js` (`PERCH_S`, `PERCH_L`); `uiMascot`.
- Easy reading: `uiEasyRead` puts `rpgc-easy` on the root.
- SCP: `worldOf` → `scp`, `worldScp`, preset `w-scp`.
- 2.3, the wide window: `uiPanelMode: 'wide'`; `wideFrame()`, `openWideShell()`, `showWide()`, `hideWide()`; every HMS
  card has a page (`renderHmsTrackers` → `put(page, el)`); `uiWideRail` shows the menu's labels.
- 2.3, the clock: `uiDialFace` (auto | analog | digital | astrolabe), `uiDialSky` (off | time | full); frontend
  `dialFace()`, `astroSvg()`, `lcdEl()`, `renderScene()`; backend `dialFaceFor()` for the in-chat dial.
- 2.3, written things: backend `renderPapers()`, `papersOf()`, `papersPrompt()` (only with `chatDisplay.papersAsk`),
  macro `{{rpgc_papers}}`; frontend `renderPaperShelf()`. Pill HUD: `chatDisplay.hudStyle`, `hudPillsHtml()`.
- 2.3, Harry Potter: `worldOf` → `potter`, `worldPotter`, theme `potter`, preset `w-potter`. Free emoji:
  `chatDisplay.emojiFree`, `emojiFreePrompt()`.
- 2.4, a clock for every world: `DIAL_FACE_OF_WORLD` (frontend and backend, kept the same): cote `wall`, rezero
  `crystal`, mushoku `sundial`, overlord `game`, potter `astrolabe`, scp `digital`, skyrim `rune`, darksouls
  `bonfire`, undertale `pixel`; anything else `analog`. Frontend `wallSvg`, `crystalSvg`, `sundialSvg`, `gameSvg`,
  `runeSvg`, `bonfireSvg`, `pixelSvg`; the in-chat dial has a CSS variant for each (`.rh-dial.wl/.cr/.sd/.gm/.rn/.bf/.px`).
- 2.4, weather and °C: `hmsNowPanel` reads a `Weather:`/`Sky:`/`Forecast:`/`Temperature:` line, keeps the word and
  returns `tempC` (°F turned into °C, whole degrees). With `uiDialSky: 'full'` the companion block also asks for
  `"tempC"`; the infoBox gets `temperature: {value, unit: 'C'}`. Frontend `weatherReport(n)`.
- 2.4, settings: `renderLookSettings()` (`s-look`), `SET_ICONS`/`setIcon()` in `section()`, `settingsHero()`,
  `settingsFilter()`, `goSection()`, `sectionLink()`, `modSection()`. Page shortcuts: `pageJumpBar()`, `uiJumpBar`;
  every HMS card carries `data-rpgc-page`.

- 2.5, the cost chip: backend `costLog`, `costPart(chatId, key, name, text, where)` in `hmsRequestParts`, the
  interceptor and the macros, `costOut()` in `hmsProcessContent`, `costView()` in the state push (`cost`); estimates
  at 4 characters a token; the test zone is never counted. Frontend `costChip()`, `.rpgc-costpop`.
- 2.5, the weather and the day: `nowSky(date, season, world)` (sun from `WORLD_LAT`, moon and weekday when the date has
  a year); `hmsNowPanel` adds `sun`, `moon`, `weekday`, `weatherLine`, `prevWeather`, `prevTempC`. With Sky 'full' and
  `uiWeatherDetail` the companion block asks for `"wx": {feelsC, wind, fall, later, effect}` (`res.wx`,
  `infoBox.weatherDetail`). Frontend `weatherDetails(n)` under the weather button (`state.wxOpen`).
- 2.5, Perch on the screen: `uiPerchFloat` (wide | always), `uiLaunchPos` ({fx, fy}, shares of the window);
  `dragLaunch()`, `placeLaunch()`, `restoreLaunch()`, `syncPerchButton()`, `openPanelFromPerch()`.
- 2.5, powers: `loreKeyHits(chatId, text, label)` loads entries the way Lumiverse would (a key with punctuation or
  spaces as text, a single word as a whole word; regex keys and secret entries skipped; label keys are the family's
  hub). `powerSummary()` reads the template fields; `powerEntryView()` cuts Veiled to WHAT IS SEEN (no title) and Soft
  to NATURE/PRICE/SIGNS. `powersPanel(chatId, hud)` → `magic.powers` {items, hubs}. Switch: `hmsSystems.magic.powers`.
- 2.5, race: `raceLine(hud, override)` (V1.5 tower, lineage, state, origin, Overlord's `Racial Lvl`), `raceEntryView()`
  (sections via `loreSections()`, one-line V1.5 anatomy, IN PLAY, laws, standing), `raceTraits()` (with negation:
  "no mana-horns", "cannot be hidden"), `racePanel()` → `state.hms.race`. Frontend `renderRace()`, `raceSvg()`,
  `raceLegend()`. Switch: `hmsSystems.you.race`. Test zone: `SANDBOX_RACE_TRY`, message `sandbox_race`.

## Spell list (from the lorebook)
Code: `HMS_SYS_DEFAULTS.magic` (`spellList`, `study`), the `spell*` functions (above the Gates banner).
- **The catalogue** (`spellCatalog`) is read from the chat's lorebook pool, an entry by the first way that fits:
  `[SPELL — Name]` headers with labelled lines (School / Element, Rank / Tier / Scale, Effect, Chant / Incantation,
  Cost, Melded from / Parts, Requires); an entry with `– Core Definition` (one element: `## Series`, then
  `* **Name** – text`, the scale read from the name: El, Ul, Al, else Base); lines `Name [School Magic - Rank]: text`
  (only when the bracket says magic or holds a known rank); a spell index (`### School`, `**Series**`, bullets;
  accepted when it calls itself an index or most bullets carry a rank); and `worldSpellIndex` (Master Spell Index).
  A spell found twice is one spell with the fuller text. 1,600 at most (`SPELL_MAX`).
- **2.4 formats** (from the owner's Re:Zero, Overlord and Mushoku Tensei books): **1b**, one entry per spell under
  a `## Name` title with `Tier:` and `School:` lines (`Elemental (Fire)` → Fire, `Forbidden (Ol)` → special,
  `Status: … spirit art (Blaise)` → `spirit`); **5**, list blocks: `**System:** Arcane (Evocation School)` then
  `### 1st Tier` and `- **Name** — effect`, or `## Arcane (Evocation) — 2nd Tier (Level 8–14)` / `## Water —
  Elementary Rank` then `* Name — effect`; `Name (A + B)` gives melded `parts`; "Fan-extension additions" are
  kept with `series: 'Fan extension'`. `spellSchoolFrom()` turns a school line into `{school, system}`. A better
  source wins the school and rank (`entry` 5, `list`/`element` 4, `line` 3, `index` 2, `master` 1). Big books
  (more than 600 spells) send short effects; past 900, a school that is not yours sends thin rows.
- **Overlord tiers**: `System: Arcane (Evocation) LV 7` (several, split on `/ , ; |`) sets `mode: 'tier'`; a
  spell is in reach up to that tier in that tradition, LV 11 is Super-Tier, another tradition is locked.
- **Spirits (Re:Zero)**: `spiritCatalog` (the Master Spirit Index, `CONTRACT — A & B` clause entries, `[ROW]
  Spirit Affinity:` rows, the group codes entry), `spiritContracts` (expands `LIVING-GATE` and `SEVEN-STARS`;
  `SPIRIT_GROUPS_DEFAULT` when the book has none), `spiritPanel` → `state.hms.magic.spirits` (affinity, contracts
  with rank on the ladder Lesser → Quasi → Spirit → Great, the Sovereign rung only once the HUD shows it, clauses
  only for the contractor, spirits to befriend). A spirit art is in reach with a contract with its spirit, or with
  a contracted spirit of its element; a composite art needs two elements.
- **Ranks** (`spellRank`): Mushoku's ladder (Elementary … God), Re:Zero's scales (Base, El, Ul, Al), tiers, letter
  grades. `spellSpecial`: unique, inherent, forbidden, lost, ancient, sealed.
- **Reach** (`spellReach`): `Magic School:` gives a step per school; `Magic: … | Gate: …` gives elements and a cap.
  The cap comes from the bot's Gate table (`rzRankTables`) when its row names a scale it does not say strains or
  fails; otherwise a plain default (F–E Base, D–C El, B–A Ul, S–SS Al), and the card says which it used.
- **Status** (`spellView`): known (your mark, the spellbook, or a reply that reported it learned) → special →
  melded parts → by rank: reach, next (one step up), locked. Without a HUD line it only lists.
- **Study**: `st.spells.study`; the reminder `[RPG Companion — study]` rides in the interceptor's context message;
  the block asks `"study": {spell, progress, note}`; it is stored per swipe, so `spellStudyFold` follows swipes and
  Return by Death. Learned ends the study without touching the chat state. Marks: `st.spells.marks`. Message
  `spell_edit` (study, stop, mark, reset).

## Gates (card progression)
For cards made with the Character Creation Kit (V7.0 and V8.0). Code: `HMS_SYS_DEFAULTS.gates`, the `gate*` functions.
- **Where cards are read from.** The chat's lorebook pool (`lorePool`, filled by the world-info watch or
  `loreBuildPoolFromApi`). An entry counts when its text has a line `[NAME] — gated progression` and at least one
  `PHASE n — NAME` header under it. The character's name is the entry's first `Name:` line, else its title or first
  key; the entry's keys are aliases. Names compare without case or accents (`gateKey`), so "Kikyo" is "Kikyō".
- **The block** runs from that line to the next fenced section header. Phase headers are capital `PHASE`, a number,
  an optional letter (`5B`), a dash and the name; a header may wrap over lines until its brackets close. Lines such
  as `PHASE 5 ENTRIES —` or `PHASE 4 WITHOUT PHASE 3 —` are not phases.
- **Kinds** from the header's brackets and the trigger: `REQUIRED GATE`, `SECOND/THIRD/HARD GATE`, `AUTOMATIC`,
  `OPTIONAL`, `CONDITIONAL`, `STANDING`, `APEX`, `RESIDUE`, and a permission (`Trigger: none` / "a permission, not
  an unlock"), which is noted when it happens but is never a place on the road.
- **What a phase needs** (`need.all`, `need.any`): the header's own words first (`Requires Phase 1`, `Requires
  Phases 1-3`, `Requires all previous gates`, `after Phase 4`, `Phase 5 completes`; "does not require Phase 4" is
  not one). Else the `PHASE MAP` arrows (an optional step can be walked past). Else the phase before it.
- **The fold** (`gateFold`) walks the replies the way Minds does (`simReplies`): only the swipe on screen, and not
  the replies a Return by Death undid. A report moves the phase when the needs are met, the fork is open and no
  other gate fired in the same reply. A fall of one phase is taken; more waits. Anything not taken is `pending`
  with its reason, until you Accept or Dismiss it. `AUTOMATIC … immediately following Phase N` chains at once;
  `Phase N completes. Automatic` waits for the report.
- **Your hand** is kept per chat in `st.gates.ops` (`set`, `accept`, `dismiss`; message `gate_edit`), never in
  the replies, so it survives swipes and can be undone.
- **Handed back** as `[RPG Companion — gated progression]` by `{{rpgc_gates}}` or the interceptor's context message; asked in
  the hidden block as `"phases"` (the card's word; a Gate is the magic organ in Re:Zero) only while a gated character is in the last reply or named in the newest messages.
- **Settings**: `enabled`, `confirm` (`auto` | `ask`), `tell`.

## Credits
**HMS Edition** by **TenderTriper (Perch)** — a creator on Janitor AI
([profile](https://janitorai.com/profiles/cc9e471a-d758-4147-8cd9-be31afa1995a_profile-of-tender-triper)) and host
of the Discord server **The Appa Stand** ([discord.gg/k6DQPYQMFY](https://discord.gg/k6DQPYQMFY)). Bug reports go there.
**Minds, agendas, who knows what, Chekhov's gun, building maps and the tone tags** are ported from
**FrankenSIM 4 Mini** by **Wireless (Ryah)**, with permission. **TFDY** (Tenderness, Fury, Dread, Yearning)
is by **Pyropia**. Ideas from **Vexa**, FrankenSIM's successor, are used with its author's permission.
**Floor plans** follow the room atlas of **Ryah | Wireless**, with permission. **Radiant's R. Prompt** (Core
Engine v3.1.7 and Writing Style v3.1.5, made for **Megumin Suite**) runs in HMS Reporter's **Max** mode with
**Radiant's** permission; its intimacy section is left out. **Megumin Suite** also gave ideas (no code) for the wide
window, the cost chip and the round button on the screen.
**Body & health** takes ideas (no code or text) from Escape from Tarkov, Gray Zone Warfare, Project Zomboid,
Barotrauma, Kenshi and RimWorld.
**RPG Companion** by **Marinara** (Marysia, marinara_spaghetti), licensed AGPL-3.0. Panels,
presets, dice, deception tags, immersive HTML, portraits and the prompt editor are hers.
This fork stays AGPL-3.0 — see `LICENSE`.
