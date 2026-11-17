# Changelog — RPG Companion HMS Edition

## 2.9 beta — seals, exams and contracts; starred lives; history; a closer map; more parts and statuses
With **HMS Reporter beta 1.7.0**.
- **Fixes:** the female body chart's liver, stomach and spleen sat outside her narrower waist; they have their own spots
  now (`HL_ORGAN_SHAPE_F`; `tests/test_chart_geo.js` checks every organ is inside, by real SVG geometry in Chrome).
  Losing a limb no longer hid every bone: the bones are masked to the parts that are left. The map badge keeps joined
  emoji whole (`firstGlyph`).
- **Broken bones on the chart:** a crack across the bone: white while not set, with two wooden splints once splinted,
  yellow while it mends, grey with a bend if it healed crooked (`hlBreakSvg`, male and female, party charts too).
- **21 more statuses** (46): Stunned, Paralysed, Injured, Blinded, Deafened, Silenced, On fire, Freezing, Exhausted,
  Starving, Sealed away, Confined, Away, Hunted, Under contract, Frightened, Furious, Grieving, Withdrawn, Blessed,
  Invisible. "Bound by a pact" is a contract, not Tied up. The model is offered every label (built from the table).
- **Letters:** **seals** (wax colour and an emblem pressed in as a silhouette; a writer keeps their first seal; set one
  by hand under a letter); **EXAM** papers (subject, student, a red circled mark out of 100, ✓ ✗, red remarks, a stamp,
  Passed or Failed from the pass mark; a Grades list with the average); **CONTRACT**s (parties, numbered terms, the
  price of breaking it, signatures and seals; a Contracts list; contracts in force are told to the story with the
  statuses; **Mark this contract as ended**). Demo: Roswaal's violet seal, Beatrice's and Puck's contracts, a CotE
  midterm.
- **None and Custom** on Characters (None … Full, Custom) and Body & health (None … Heavy, Custom). Changing one switch
  picks Custom by itself and keeps the rest. Play style's None reads "None / Custom".
- **More parts the AI can name:** floor plan **things** (bed, table, desk, chair, sofa, bench, shelf, wardrobe, chest,
  counter, fireplace, board, stairs up or down, window on a wall, pillar, water, plant, rug, statue, throne, screen,
  light, grave, cage), drawn in the room, the floor plan and 3D; a room's "has" words become things along the walls.
  Race sketch: ram horns, antlers, insect wings and extra pairs, fox tails (up to nine), a stinger, fins, gills,
  antennae, tusks, six arms.
- **The map, closer:** asks for "who" again when someone comes or goes; takes the room map's spots and furniture when
  it draws the same room; reads every part of the HUD place and its floor ("(Second Floor)") to pick the room; lets a
  stale room go ("not on the plan yet"); sends the lorebook's words and size for a new room (its size wins) and the
  lorebook's floors for 2D and 3D.
- **Lives of their own:** a ☆ on each person's card. Starred people (up to 12) are asked for when what they were doing
  is over or after six quiet replies, come first (★) in the story text, and get an **Off screen** card (where, what,
  until, next, where they were).
- **History:** each card's 📜 History: meetings, standings and bonds with why, moments, **milestones** (new request
  field, kept with the moments and filed in the Chronicle as milestones), your notes, and **Between them** (Minds' pair
  events, with why). The story gets a short history line for the people likely in the scene.
- Tests: `test_v29.js` (53 checks), `fe/test_fe_v29.mjs` (27), `test_chart_geo.js` (18, needs Chrome; SKIPPED
  without). Old tests updated for the new labels and defaults.

## 2.8 beta — floor plans, statuses, others' bodies, vitality, one Mode dial
With **HMS Reporter beta 1.6.0**.
- **Play styles: None, Potato, Light, Medium, Heavy, Max** (Settings → Play style → How much). They match the preset's
  new **Mode** dial step for step. **None** sets nothing (every tracker stays as you have it). **Potato** is for small or
  cheap models (about 150–300 tokens a reply); **Max** turns everything on, with the floor plans in 3D.
- **D&D is off** unless you pick the D&D style. Settings v10 turns it off in old settings (unless their style is D&D).
  **No cap on stats** (Settings → D&D) lets scores go up to 999.
- **Floor plans** (Map page), after the room atlas of **Ryah | Wireless**, in three tiers: the room you are in, every
  room on a floor in 2D with the ways between them, or every floor in 3D. The model reports a room only when it is new
  (about 60 tokens; 150 for a plan); a bot that prints its own `<state:locations>` block is read as it is (U+2800 read
  as space). Folded over the live replies, so swipes and rewinds are followed. People with a status carry its badge.
  Settings → **Maps** holds the floor plans, the Atlas, the room map and building maps in one place.
- **Statuses** (People): 25 kinds in three groups (body; where they are; mind and magic), each with what it blocks
  (learning, acting, moving). Asleep and knocked out end by themselves; the dead and the unconscious learn nothing;
  the dead's agendas stop. Set by hand with **Change**. The dead fold under **💀 Deceased** with the cause of death.
  The story gets one line per person (`{{rpgc_status}}`; HMS Reporter's **Statuses** slot), nothing while all are fine.
- **Party bodies**: party members' wounds and lost limbs on a male or female body chart (`party.trackBody`). The model
  reports wounds and sex only when they change or are unknown. A beheaded person's chart has no head.
- **Body & health**: **Vitality** (Hurt, Badly hurt, Critical, Dying, with a death clock while bleeding); lost limbs
  first, in a red box and in capitals for the story; the main **arteries** on the chart (a femoral wound is a junction
  only at the groin or pelvis); a **female chart** (from the HUD's Gender or Sex line, or by hand); **cold and heat**
  from the Weather line and indoors or out; **sickness, poison and withdrawal**; **prosthetics** on a lost limb;
  **Treated** and **Healed** by hand (ops `mark`, `prosthetic`; the op list keeps 80). Time skips of 3 hours or more
  never leave you thirsty or hungry. "Cold in the bones" is no longer read as a sickness.
- **Dragons in human form keep their horns, wings and tail**, out by default, on the Race sketch and the Body chart.
  The tail on the body chart is redrawn; wings and tail draw behind the body.
- **On you** (You page): the HUD's inventory, money and gear in groups. No tokens.
- **Skills & traits** (was Abilities), split into learned skills, born traits and the rest, on the **Magic & Skills**
  page. **Side by side** in the fight tracker. **Picture prompt** (Story page) for Krea 2, Nano Banana and Qwen Image.
- **Settings tabs** (All, Setup & Look, World & Maps, People & Minds, Body & Health, Magic & Skills, Fights & D&D, Memory
  & Chapters, Advanced). New boxes: **Maps** and **Magic & Skills**. Modules gained On you, Statuses, Party bodies and
  Picture prompt; Characters gained the Statuses switches and Their bodies. A box the finder opened is not remembered
  as opened.
- **The round button**: a **Never** choice. **Esc** closes the wide window. Phones get one column.
- **Gemini's list**: survival is owned by the body when Body & health is on; fired gates are turning points in the
  Chronicle; `gatesOwnPhase` in the party request; card parsing (REQUIRED GATE for Phase N, Requires alternatives,
  GATE titles, multi-axis ages); Atlas keys tidied and aliases ("Od Lagna" = "World of Od Lagna"), switched-off
  entries skipped.
- **Rewinds**: Resets, Loads and Undertale deaths without a clock rewind the folds too.
- **Macros**: `{{rpgc_status}}` and `{{rpgc_study}}` (HMS Reporter has slots for both).
- **Demos**: Re:Zero manor floor plans and Beatrice's body; SCP-4666's cold yard (an opened artery, the female chart,
  Mari asleep, Lars missing, Henrik dead); an Undertale RESET; a Skyrim vampire evolution.
- **After the owner's check** ("did you do it all?"): **Memory gone** wipes what that person knew and felt in Minds,
  and **Name eaten** makes the others forget them (only when the status starts, so swipes and rewinds are followed).
  "Lost her memory" was read as **Missing**; it is Memory gone now ("lost an arm" is Crippled, "lost in the woods" is
  Missing). **Settings with no chat open** showed no Characters, Minds, Gates or Magic & Skills boxes; now every box
  shows. **Phones**: the wide window's head wraps, so the title and the buttons no longer overlap. "I bite his arm"
  loads the fight craft (preset). Docs: Race and Body & health in the README's panels, Modules and Settings lists; a
  Megumin Suite credit for ideas.
- Tests: `test_v28.js` (44 checks), `fe/test_fe_v28.mjs` (35 checks) and `fe/test_fe_nochat.mjs` (3 checks); older tests updated for D&D off, settings
  v10, "Magic & Skills" and the dragon's parts.

## 2.7.1 beta — fixes from the owner's bug report, and a full scan
With **HMS Reporter beta 1.5.0** (unchanged).
- **The Atlas was missing in a live Re:Zero chat** ("Could not read the location book: undefined is not an object
  (evaluating 'seg.alts.map')"). A navigation line that is only a note (`- (Second Floor)`, `- [LOCKED]`, `- ()`), or
  an empty `()` / `[]` part in a `◈ PATH`, was taken for a place and crashed the reader, and the whole Atlas with it.
  - Such lines are headings now, not places. A qualifier never reaches the matcher.
  - Every entry, place, overlay and navigation list is read on its own: what cannot be followed is left out and
    counted (`skipped`, shown on the Atlas card); the rest of the map is built.
  - `Name *(note)*` in a navigation list: the italic bracket is the note, not part of the place's name.
  - **The Re:Zero test zone has an Atlas**: a slice of the owner's location book (the world, Lugunica, the capital,
    the market square, the back alley, the slums, the loot house, the palace, Roswaal's mansion and six rooms, Arlam).
- **Beatrice showed up in the scene from the capital's market.** The panel took everyone the model reported in a reply
  (a mind, a relationship, a present-characters line) as standing in the room. A living-world bot also reports the
  absent. Now someone is **away** when the reply's own prose never names them and either their agenda puts them where
  the HUD's ◆ line is not, or the reply's present list leaves them out (someone only talked about: both must hold).
  With no prose to go by, nobody is taken out.
  - Minds, relationships, gates and profiles all use it (`sceneAway`). The minds block for the model lists them under
    "Known" and their agenda, not among the present.
  - People page: someone away you have never dealt with folds under **Elsewhere (N)**; someone you know keeps their
    card, marked **not in this scene** with where they are. The **Here** filter leaves them out.
- **Could not leave the wide window from the test zone.**
  - A **⇥ Back to the drawer** button beside × in the wide window's head, on every page.
  - On a page of the test zone the menu has **Leave test zone** as its own item, and the strip at the top has **Leave**.
  - The cause of the stuck state: any state from the backend replaced the panel's settings, so one that arrived just
    after a change (the 6-second heartbeat, a reply landing) put the old value back, and a second change in that
    moment lost the first. A settings save now carries a number; the backend echoes it (`settingsRev`); the panel keeps
    its own change until its number comes back (6 s at most). A pending save is sent, not dropped, when the panel closes.
  - Entering and leaving the test zone empties everything the panel held for the other chat. **Clear** also empties
    what the practice chat had kept.
- **The cost chip** said `~?` after a reload until the next reply: the last reading is kept with the chat.
- **Scan** (tools in `tests/`): `scan_backend.js` (mutated replies, side-panel blocks and lorebook entries through
  reply handling, the panel state, every macro and the interceptor), `scan_atlas.js` (odd location entries),
  `fe/scan_panel.mjs` (every page of the panel rendered from the same). 1,100+ backend rounds and 110+ panel rounds:
  no crash and no warning left. The same scan on 2.7.0 finds the Atlas crash.
- Tests: `test_fix271.js` (42 checks) and `fe/test_fe_fix271.mjs` (18 checks).

## 2.7 beta — the body you are in now: forms, hidden parts, evolution, organs, sanity, measurements
With **HMS Reporter beta 1.5.0** (unchanged; its Body state slot carries the new lines).
- **Your shape now** (Race card). The sketch and the Body & health card follow the shape you are in, not only what the
  race can be.
  - **Forms**: the race's own, a human form (every part tucked away), or another shape (a wolf, mist; a race from the
    book is drawn as that race). A dragon in human form has two legs, hands and no wings to hurt; a slime in a person's
    shape is drawn in jelly and still has no bones.
  - **Hidden parts**: horns, wings and a tail each **Hidden** or **Out** (or broken). Out is drawn solid, hidden dashed.
  - **Who decides**, at each reply: the HUD (`(Human Form)` after the race, `— True Form`, `Form:`, `Shape:`,
    `Mimicry:`, `Disguise:`, `— Horn Manifested`, `— Hornless`, conditions) > what you set on the card > the story's
    own `"shape": {"form", "shown"}` note. What you set holds until the HUD says otherwise or the story's note changes.
  - The `shape` note is asked only for a race that can hide parts or change form (from its book, or once you set a
    form), and not when the HUD already says it. Its example carries the shape as it stands, so the story keeps it.
    About 40 tokens. Settings → Body & health → **Ask the model about your shape**.
  - Folded over the live replies: swipes and Return by Death followed. In the test zone, trying another race starts in
    its own form.
- **Evolution**: each change of the race on the HUD (a new name, a new floor on the tower) is kept with its day and
  time; "Evolved this reply" on the card. A form is not an evolution.
- **Size in the book**: a race entry's own size ("roughly one meter long") is shown on the Race and Body cards.
- **Organs** (Body & health): brain, eyes, ears, heart, lungs, liver, stomach, spleen, kidneys, guts, read from the
  wounds and the HUD's conditions, drawn on the X-ray, listed as chips when hurt.
  - One eye lost: sight without depth; both: **Blind** (a lock). Lungs lower Breathing; heart and brain lower
    Consciousness; a hurt heart is a lock on hard effort; inner organs hurt and need a healer.
  - **The race's own organs**: a **Gate** (a Gate line on the HUD or in the race's book), the **horns** (hidden, out,
    broken), a **core / heart stone**, a third eye. Locks: Gate damaged or broken, horn broken, core cracked or
    shattered.
  - Undead: no soft organs. Slime: only its core. Spirit: no flesh. **Lost for good** lists what is gone.
  - The body block for the model adds `Shape now:` and `Organs:` lines when they matter.
- **Sanity**: a meter with a word (Sane, Shaken, Fraying, Breaking, Insane) from the sanity already reported with your
  own state, a `Sanity:` HUD line, or HUD conditions (Despair, Trauma, Madness…). Below 80 it is told to the story.
  Asked with the body note only where the You tracker is off.
- **Water and food** are now kept on **Medium** too (they were Heavy only). A gap of ten hours or more between
  replies holds ordinary meals and drinks.
- **Your measurements**: height, weight, bust, waist, hips. Typed in any usual way (`175`, `1.75 m`, `5 ft 9`,
  `154 lb`) or read from `Height:`, `Weight:`, `Measurements:` lines on the HUD (the HUD wins). **Units**: metric or
  imperial. **Tell the story your measurements** (off by default): one `Build:` line, about 15 tokens.
  - Bust, waist and hips are **not kept or shown for a character under 18**: an `Age:` line under 18, a Hogwarts
    student (by year), a Classroom of the Elite student (by class).
- **The slime** is redrawn: a round, glossy dome with a darker core. Its Body card is one body of jelly with the core;
  wounds show as marks on it.
- Fixes: the undead style of the X-ray was never applied; a HUD condition like "Horn Manifested" is not a wound.
- Tests: `test_shape27.js` (76 checks) and `fe/test_fe_shape27.mjs` (38 checks).

## 2.6 beta — Body & health, Light / Medium / Heavy, bodies not built like a person
With **HMS Reporter beta 1.5.0** (adds the Body state slot).
- **Body & health** (You page), from how Escape from Tarkov, Gray Zone Warfare, Project Zomboid, Barotrauma, Kenshi and
  RimWorld track a body. Ideas only; no code or text from them.
  - **Two modes, one owner.** Where the bot keeps wounds on its own HUD (`Injuries:`, `Condition:` — Re:Zero, Mushoku
    Tensei) the card only **reads** them: no wound added, no clock run, nothing asked. Where the bot keeps none (CotE,
    Harry Potter, SCP, classic chats), the extension **keeps** the body: the injuries list, plus a small `body` note
    (exertion, ate, drank, hours slept, painkiller, adrenaline, stress) and `care` list (bandage, clean, change
    dressing, splint, tourniquet, stitch, take it out, healed by magic) per reply. STATE IS GOD holds either way.
  - Folded over the live replies: a swipe is its own body; a Return by Death rewind takes the undone loop's wounds
    and lost blood with it.
  - **Capacities**: Consciousness, Moving, Manipulation (Jaws and claws on four legs), Breathing, Sight, Hearing, with
    what lowers each.
  - **Structure locks**, never maskable: both legs useless (no standing, walking, running, jumping), one leg useless
    or splinted, both arms, a broken hand, a hurt spine, broken ribs, a hurt wing, a missing part, unconscious, too
    little blood, forced sleep at 96 hours, a tourniquet on too long.
  - **Pain**, maskable: painkillers (4 hours) and adrenaline (with a crash after). The card shows Pain (masked).
  - **The wound's life**: raw, tended, splinted; **fresh** for 30 minutes after a hard bleed is closed (heavy
    exertion tears it open; it clots again in about two hours); a dressing goes **dirty** after a day (half a day
    while bleeding or running hard); dirty for another half day **festers**; a clean dressing ends it.
  - **Meters by the HUD clock**: blood (bleeds by severity, clots, comes back slowly), water, food, hours awake, stress,
    leg and arm stamina, next-day strain. A skip of ten hours or more is ordinary life: a night's sleep, meals.
  - **Race-aware**: undead (no blood, pain, food or sleep; bones still break), constructs, spirits, slimes (no bones),
    winged races (a wing to break), four-legged bodies (one useless leg is a hobble on three).
  - **The X-ray body map**: 17 parts plus wings and tail, coloured by state (raw, bleeding, splinted, tended, dirty,
    infected, bruise, gone), lock marks; press a part to see its wounds. Capacity bars, meters, the locks box.
  - **Treat with what you carry**: from Carried and the HUD's inventory (bandages, antiseptic, splints, a belt as a
    tourniquet, needle and thread, tweezers, painkillers, potions, water, food). Aimed at the part you pressed; goes
    into the next reply as what you did. **Undo the last**.
  - **`{{rpgc_health}}`**: a few lines before each reply (what you can still do, the hard locks, what hurts, what is
    masked, what you just did). **Empty while you are fine: zero tokens.** Without the macro in the preset it goes in
    as its own message, never twice. Counted in the cost chip as "Body & health".
  - **Depth**: Light (wounds and locks), Medium (adds blood, dressings and infection, painkillers, sleep), Heavy (adds
    water and food, stamina, strain, stress). Every part also switches on its own.
  - **HP** is hidden in worlds without hit points (kept in Overlord, Skyrim, Dark Souls, Undertale and D&D games).
    Settings → Body & health → HP: grounded worlds only, always, or never.
  - The old Body card steps aside where the Body & health card reads the HUD.
  - The injuries request asks how hard each wound bleeds (`none|light|medium|heavy`) while Blood is on.
- **Play style: How much** — **Light**, **Medium** or **Heavy** on top of any world or play style: "light Re:Zero" or
  "heavy Overlord". Light: no Minds feelings, no profiles, the time-only sky, the light body, no room map (about
  300–500 tokens a reply). Medium: the balance (about 700–1,100). Heavy: feelings between the others, who knows what,
  the party's needs, the heavy body, the room map in fights (about 1,300–2,000). Your own saved presets apply exactly as
  saved. Saved presets now also keep the sky, the weather detail and the thoughts switch. Gritty survival uses the
  heavy body.
- **World presets checked**: every world sets a body depth (Re:Zero, CotE, Mushoku, Potter medium; SCP heavy;
  Overlord, Undertale, Dark Souls, Skyrim light). SCP-4666 and Harry Potter now set fights, comms, the party and
  relations like the others (Potter also magic).
- **The Race card: bodies not built like a person.** A body plan from the race book: dragon (four legs, wings, long
  neck and tail), beast, serpent (with its heads), naga, centaur, insect, slime, spirit, each drawn with a small human
  for scale and a size line ("a human barely reaches its knee"). Dragons are known by name; a flightless one has no
  wings. No halo off a humanoid. Forelegs and hind legs are read as body parts.
- **The test zone**: Classroom of the Elite turns 4 and 5 (a fall on the wet stairs; the infirmary), the Re:Zero HUD
  without HP, quest lines fixed in CotE turns 4–5 and Re:Zero turn 4. **Try a race** adds True Dragon, Flying Dragon,
  Earth Dragon, Wolgarm, Black Serpent, Serpent-Human, Slime and Spirit; the Body card follows the race you try.
- **HMS Reporter 1.5.0**: a **Body state (RPG Companion)** block after Gates state, carrying `{{rpgc_health}}`, guarded
  by the extension and OOC. The description now says it is made for 2.6 beta (it still said 2.3).
- Tests: `test_body26.js` (79 checks) and `fe/test_fe_body26.mjs` (48 checks).

## 2.5 beta — what it costs, powers and race, the weather and the day, Perch on the move
With **HMS Reporter beta 1.4.0** (unchanged).
- **The cost chip** (⚙ ~N tokens, top bar): what the extension added to the last reply, on top of the bot and the
  preset, measured per part — the side-panel request (in the preset's slot or as its own message), notes, Minds,
  Gates, people, the fight — and the hidden block the model writes back. Fights, the OOC guide, chapter summaries and
  a fetched block are listed as their own calls. Estimates at about 4 letters a token. The test zone is never counted.
- **Powers in the Magic card**, read from the HUD and explained by the lorebook entries those lines load (the power
  families of How to Build a Magic System V2.5): gifts (`[DIVINE PROTECTION: A · B]`, `[BLESSING: …]`), staged powers
  (`[AUTHORITY: X - Dormant]`, `[AUTHORITY: X] (Awakened)`), curses on the condition line, meters with a named
  stage, grade rows (`Gate: D-Rank` with its `[ROW]` entry) and pleas. Each opens to its entry, field by field.
  **The rules behind them** shows each family's core entry (keyed on the line's label). **Veiled** powers show only
  what is seen (never the true name, the rule or the reveal); **Soft** powers only their nature, price and signs.
  The Re:Zero card points to the Magic card instead of repeating them. Switch: Modules → Powers (in Magic).
- **The Race card** (You page): the race line in every form (lineage, state, origin, the V1.5 tower with folded floors
  and levels, Overlord's `Racial Lvl`), the race book's entry (lifespan, build, marks, resting state, tell, In play,
  laws like the Oni's Horn Law, how each nation sees them), and a **sketch of the body** drawn from the entry's words:
  horns, wings, tail, ears, scales, fur, extra arms, size (with a human outline for scale), bones. Parts the book keeps
  hidden are dashed. "No mana-horns" draws no horns; "cannot be hidden" is not hidden. Switch: Modules → Race card.
- **The weather and the day in detail**: press the weather report. °C and °F, feels like, wind, rain or snow, later,
  what it does to the scene, what changed since the last reply; sunrise, sunset and daylight for the world's latitude
  (polar night and midnight sun far north), the next sunset or sunrise, the moon's phase and the weekday when the date
  has a year, the season. The model is asked for the extra weather only with Sky → Time, weather and season and
  **More weather detail** (about 30 tokens).
- **Perch on the move**: drag the round button anywhere; it stays there (also after a reload or a resize). Arrow keys
  move him. Settings → Look → The round button on the screen: wide window only, or always (then he opens the drawer,
  the floating window or the own window too). **Put it back in the corner**.
- **The test zone**:
  - Re:Zero: a Race line, Return by Death, Soul of Language, a Veiled condition, the Wolgarm Curse and the Gate row,
    all with demo entries in the template shapes; **Try a race** (Human, Oni, Succubus, Elf, Wolf-Human, Dwarf,
    Dragonkin, Elder Lich) from the Re:Zero race book.
  - Classroom of the Elite: a slice of the CotE location book (the Atlas), the book's exact paths on the HUD, a third
    turn in the Delta classroom with the **room map** (drawn in the test zone even with positions off), and
    **Honami's gate** (The Fallen, Phase 1). Honami is no longer marked a minor (18 on her card).
  - Harry Potter: **Draconia Malfoy** at eleven — the train branch and the Thaw, phases 0 to 3 only — and a third turn
    at the Owlery where her first gate fires.
- Tests: `test_powers25.js`, `fe/test_fe_powers25.mjs`.

## 2.4 beta — the real magic books, spirits, a clock for every world, a better test zone and settings
With **HMS Reporter beta 1.4.0** (unchanged).
- **The spell list reads the real magic lorebooks** of Re:Zero, Overlord and Mushoku Tensei, as they are written:
  - Re:Zero: one entry per spell, with a `## Name` title and `Tier:`, `School:` and `Status:` lines. "Elemental (Fire)"
    is the Fire school; the Ol prefix is forbidden; a spirit art belongs to its spirit.
  - Overlord: `**System:** Arcane (Evocation School)` with `### 1st Tier` lists, and `## Arcane (Evocation) — 2nd Tier` lists.
  - Mushoku Tensei: `## Water — Elementary Rank` lists, the fan-extension spells under their own school, and melded
    spells like `Thunderhead (Water + Wind)` with their two parts.
  - A better source wins the school and rank. Up to 1,600 spells; a big book sends lighter rows.
- **Overlord tiers**: `System: Arcane (Evocation) LV 7` on the HUD opens every spell up to the 7th tier in that tradition;
  LV 11 is Super-Tier. Other traditions are locked and say why.
- **Re:Zero spirits** in the Magic card: your Spirit Affinity and what it allows, every contract on the HUD with its element,
  its rank on the ladder (Lesser, Quasi, Spirit, Great) and the spirit arts it opens. The group codes `LIVING-GATE` and
  `SEVEN-STARS` open into their spirits. A contract's own clauses show only for the one who made it. Spirits you may meet
  are listed too. A spirit art needs a contract: with its spirit, or with a spirit of its element. The Re:Zero world card
  no longer repeats the contracts.
- **A clock for every world**, no two the same: a classroom wall clock (Classroom of the Elite), a time crystal (Re:Zero),
  a sundial (Mushoku Tensei), the YGGDRASIL ring (Overlord), an astrolabe (Harry Potter), a digital clock (SCP-4666),
  a rune stone with the northern lights (Skyrim), a bonfire (Dark Souls) and a pixel box with your SOUL (Undertale).
  The small clock on the HUD card in the chat matches.
- **Weather and °C on the clock**: an icon, the word, and the temperature in Celsius, read from a `Weather:` or
  `Temperature:` line (°F is turned into °C). With Sky → Time, weather and season, the model is also asked for it.
- **The test zone**:
  - two new worlds, Harry Potter and SCP-4666;
  - every demo HUD has the weather, and the turns carry letters, notes, a report, a notice and signs;
  - Re:Zero has magic and a spirit contract; Re:Zero, Overlord and Mushoku Tensei have a small demo lorebook,
    so the spell list shows;
  - in the wide window the test zone has the page menu, and each page has Next turn and Back to the test zone;
  - in the other windows, page shortcuts sit under the controls.
- **Page shortcuts** in the drawer, floating and own windows: World, People, You, Map, Magic, Story, Letters jump to
  their cards (Settings → Look).
- **Settings**: a small picture on every heading, in your theme's colours and shape (a wax seal for Hogwarts, a
  crystal for Re:Zero, a hexagon for Overlord, a pixel box for Undertale…); a picture and a **find box** at the top;
  a new **Look** section (theme, text, clock, sky, wide window, Perch), out of Play style.
- **Fewer overlaps in Settings**:
  - Lorebook context now says where the lore goes: "Send lore with: Fight calls, Tracker and companion calls, Portrait calls".
  - The fights switch moved to Fights ("Fights on"); Fights links to Lorebook context and D&D.
  - Chat and panel extras is now **Chat display**; Characters setup is now **Present characters setup**.
  - Custom prompts says they are the words each feature sends, and the switches are in Story extras.
  - Modules: each switch has a small arrow to its own section.
- **Credits** at the end of the guide (part 13): Perch, also known as TenderTriper, a creator on Janitor AI who runs the
  Discord server The Appa Stand, with links. Links in the guide open in a new tab. Help & bug report has the same credit.
- Docs: the guide, README and handover now name every world and every 2.3 setting where they belong.
- Fixes: a Forbidden school wins over a stray "special" in a tier note; a note in brackets no longer makes a second spell
  ("Element Anvil (all four)" is "Element Anvil"), while variants like Rewind (Minor) and Rewind (Major) stay two; the
  Refresh button hides in the test zone.

## 2.3 beta — the wide window, a clock for each world, letters you can read, Harry Potter
With **HMS Reporter beta 1.4.0**.
- **The wide window** (Where the panel lives → Wide window): a big window over the chat with a menu on the left:
  World, People, You, Map, Magic, Story, Letters, then Guide, Test zone and Settings. Each page has a head (an icon,
  a title, one line on what it holds) and its cards in two columns. A page with nothing yet is dim. Close it with ×
  or a click outside; a round button in the corner (Perch) brings it back. A fight window makes it step aside. The
  menu can show icons alone (Settings → Look). Drawer, Floating and Own window are as before.
- **The clock has a face for each world**: digital for Classroom of the Elite and SCP (hours and minutes, and the
  hours of the day as a strip), an astrolabe for Re:Zero, Overlord, Mushoku Tensei, Harry Potter, Skyrim and Dark
  Souls (the day above the horizon, the night below, the sun and the moon on one rule), the round 24-hour dial for the
  rest. Settings → Look → Clock face. The small dial on the HUD card in the chat follows it.
- **The sky above the clock**: the sky of the hour, from dawn to a night with stars, with the sun or the moon on its
  way across. With **Time, weather and season** it also rains, snows, fogs or storms, and the ground wears the
  season (white in winter, green in spring and summer, red-brown in autumn). The season comes from the HUD (a season
  word, or the month); the weather from a Weather: line, else the model is asked for it. Still for reduced motion.
- **Letters, notes, book pages, phone texts, signs and documents** are drawn as the real thing in the chat: old
  paper with a seal, a yellow note, a book page with its title and page, a phone thread with your words on the
  right, a wooden sign, a typed file. The model writes them as `[LETTER: from … | to …] … [/LETTER]` blocks; a block
  not closed stays as written. The **Letters and notes** card keeps all of them, newest first, to read again.
  HMS Reporter 1.4 asks for them (`{{rpgc_papers}}`); with another preset, switch on Ask the model for them.
- **Pill HUD** (Settings → Chat display → HUD style → Pills): the HUD card's lines as small pills; a long one opens
  on a press.
- **Harry Potter** is a world of its own: the year and term, the house, the four house-point hourglasses (yours
  marked, the leader starred), the wand (broken, borrowed or won), the four studies as LV of 7, extra spells and the
  Patronus. A Hogwarts theme (deep red, gold, old paper), an in-chat card look and a world preset.
- **Let the model add its own emoji** (from the owner's APEX preset): any emoji, as many as fit, anywhere in the
  prose. It turns the drawn emoji off; the drawn ones stay as they were.
- **Perch** has left the top bar. He opens the guide in the wide window's menu and is its round button.
- Fixes: the request stays empty by default (the letters line is only sent when asked for); the wide window keeps
  its scroll when the panel refreshes.

## 2.2 beta — Characters, the SCP world, a new look, Perch
With **HMS Reporter beta 1.3.0**. All seven bots were run through the reader (Re:Zero, Mushoku Tensei, Classroom of
the Elite, Overlord, Harry Potter, Undertale, SCP-4666): every one is recognised and read.
- **Characters**, a category of their own.
  - Every character card in the lorebooks is read (`[BASIC INFO]`, with or without a gated block): its first facts,
    the sections it carries (sealed knowledge, the day-one gate, an arc, learned words, a vessel) and the phases it
    tags content to. A person with a card shows **Has a card** on their People card. No tokens.
  - **Profiles** for people without a card: look, voice, manner, role and one small secret, asked once in the reply
    after someone new shows up, kept (the first words stand), and handed back while they are around
    (`[RPG Companion — people]`). You can change a field, or forget a profile so the story writes a new one.
  - **A tracking level** in Settings → Characters: Light, Standard, Full, or your own mix. It sets the switches that
    already exist (present characters, thoughts, standing, Minds, agendas, knowledge, gates, profiles, party).
  - Gates: the state now also says what is **not true yet**, by the phases the card tags (`[Phase 5]` …).
- **HMS Reporter 1.3.0**: a **Characters** category with one dial, **Character depth** (Light: a short digest;
  Standard: every block; Full: also a whole-sheet look at each person in the plan), and **Reading a character card**
  for Creation Kit cards. The fight craft also loads on Undertale's `Battle:` line.
- **SCP-4666**: recognised by its HUD; a world card (the night of twelve with a row of squares, the phase, the mode
  as a stamp, the household or the team still standing, conditions, the coin); a world preset; the **SCP Foundation**
  theme (a typed report: paper, black rules, one red stamp); its own colours for the in-chat card.
- **The look**: the **day dial** at the top of the panel (a 24-hour face, the day as the lit arc, the time, the day
  or date, how long the last reply took), and a small one on the HUD card in the chat; four looks for any bot, **Lantern, Tidepool, Dusk, Paper**, as panel
  themes and as colours for the cards under a reply; thoughts as a bubble; softer cards, bars and chips; clear
  focus rings. **Easy reading** (more space between letters, words and lines, no slanted type). **Perch**, the
  mascot, in the top bar, in the guide and where a card would be empty; he can be switched off.
- **The cards in the chat**: the panel under each reply has a coloured head, round tab buttons, a card for each
  person and their thought in a **thought cloud**; in Minds each feeling that moved is a small pill with its name
  (green for good news, red for bad; a whole reading gets a short bar). "Thoughts alone" is a card of clouds in
  the same look. A look now has a shape as well as colours (the SCP report is square, Tidepool is round). The
  chosen tab and the feeling chips are readable in every look. Easy reading and the day-dial switch reach these
  cards too.
- **Found by the check and fixed**: Harry Potter's date ("23 October 1994", the day before the month) was not read
  as a date; a label before the location mark ("Location: ◆ …") lost the location; a chat's cards, spells and gates
  did not come back after its lorebook pool was dropped (only twelve chats are kept) until the next reply; stored
  data damaged by hand could become a person or a spell; on the HUD card, a bare date and time line written
  after the place (SCP-4666, Harry Potter) now sits in the top band like the others.
- Tests: `test_chars.js`, `test_look.js`, `fe/test_fe_chars.mjs`, `fe/test_fe_look.mjs`; `test_preset.js` extended.

## 2.1.2 beta — the preset fills the gaps, the spell list, how far people are
- **HMS Reporter beta 1.2.0** fills what the bots' cores leave open about how people behave over time. Four new
  blocks, each its own switch: **Staying who they are** (the card is the person; temperament holds; change is slow,
  earned and shows first as an exception; deeper, not softer; nothing moves them for free; no cruelty for drama;
  closeness takes in-story days; a gated card's block is its own road and only its trigger turns a phase),
  **Comings and goings** (arriving and staying need a reason of their own; travel takes time; most turns the wider
  world adds nothing new), **Pacing** (a reply is not a scene; ordinary life first; no rushed days, no invented
  deadlines; the core's clock and arcs still fire on time) and **New people** (a minor character is a person, not a
  function). Also: memory that fades and wrong beliefs that are not corrected on cue (Minds), where to stop and how
  to use paragraphs (Reporter), a **Gates state** slot (`{{rpgc_gates}}`), a gated-card line in the plan, and a
  **last look** that closes the Normal and Deep plans. Several of these take ideas from **Vexa** (FrankenSIM's
  successor); the text is written fresh for HMS, nothing is copied. Vexa's jailbreak blocks, its dice-driven world
  events, its arc engine and its display tags were left out: the bot owns rules, arcs and the HUD.
- `preset/build_preset.py` runs on its own now: the fight pattern and the reply prefill sit beside it
  (`fight_re.txt`, `prefill.txt`).
- **Spell list from the bot's lorebook.** The Magic card lists every spell the lorebook describes, by school, with
  its rank, effect and chant. It reads one-entry-per-spell books (`[SPELL — Name]` with `School:` / `Rank:`), the
  older `Name [School Magic - Rank]:` lines, spell indexes (`### School` › `**Series**` › bullets), one-entry-per-
  element books (Re:Zero's `– Core Definition` entries) and the older Master Spell Index.
  - **What you can use.** The HUD's `Magic School: Water: Saint, …` (rank per school) or `Magic: Fire | Gate: C-Rank`
    (elements, the Gate as the cap; read from the bot's own Gate table when it names scales) marks each spell Known,
    Within reach, Next rank, Locked or Special (unique, forbidden, lost). Melded spells need their parts.
    `Casting Method: Voiceless` marks chants optional. A filter (Usable and next / All) and a search box.
  - **Learning magic.** *Study* a spell: the model gets a short reminder with the lorebook's effect and chant and
    the rule that learning takes practice and rank; the side-panel block reports progress and the first clean cast.
    Learned spells become Known and go to the Chronicle ("Learned a spell — …"), and a fight's setup is given the
    spells you know. ✓/✕ to mark by hand. A rank-up on the HUD shows which spells it opened. The same in Together
    and Separate modes; a swipe or a Return by Death is followed.
  - The Mushoku world card's spell lists also fill from one-entry-per-spell books and spell indexes.
- **How far people are.** With building maps on, the agendas the model is told say how many rooms away each person
  is, counted through the doors of the building the story drew ("2 rooms from you"). No tokens to keep.
- Locations: Vexa's atlas was compared with the Map, the Atlas and building maps. Ours stays: Vexa has the model
  rewrite the whole map every reply; here the story draws a room once and the extension keeps and joins them. The
  one idea taken is the line above: moving takes time.
- Tests: `test_spells.js`, `fe/test_fe_spells.mjs`; `test_preset.js` and `test_bld.js` extended.
- Version: the manifest says 2.1.2; the panel and bug reports say 2.1.2-beta. The preset is 1.2.0-beta.

## 2.1.1 beta — Gates (first half of the next release; the preset follows)
For characters made with the Character Creation Kit (V7.0 and V8.0 cards).
- **Gates**: a card's one gated progression block (`[THE …] — gated progression`, `PHASE 0` … `PHASE N`) is read
  from the character's own lorebook entry: every phase, its trigger in the card's words, its kind (required gate,
  second/third/hard gate, automatic, optional, conditional, standing, apex, end state, a permission), and what it
  needs first (`Requires Phase 1`, `Requires Phases 1 and 2`, `Requires all previous gates`, `after Phase 4`,
  `Phase 5 completes`; with nothing said, the phase before it). A V8.0 **PHASE MAP** line is read too: arrows,
  forks (`4A or 4B`), optional steps and alternate routes. `PHASE 4 WITHOUT PHASE 3` opens a second road.
- **The place is kept by the extension**, rebuilt from the replies every time, so a swipe, an edit or a
  **Return by Death** is followed. The model reports only a gate that fired in the reply
  (`"phases": [{"who", "to", "with", "why"}]`, `[]` in almost every reply), and only while a gated character is around.
- **The card's order is checked.** A report that fits moves the phase; a phase marked AUTOMATIC, *immediately
  following* another, follows by itself. A skipped phase, a second gate in one reply, the closed side of a fork
  or a fall of several phases at once does not move anything: it waits in the panel for **Accept** or **Dismiss**.
  Settings → Gates → *Always ask me first* makes every report wait.
- **Handed back** before each reply as memory, never as a rule (`[RPG Companion — gated progression]`): a full line for each
  gated character likely in the next reply (block, phase, when and with whom it fired, what was lived before,
  what is next on the card), a word for those elsewhere who have moved. New macro **`{{rpgc_gates}}`** for a
  preset slot; without it the extension adds the text to its own context message. OOC turns get nothing.
- **Panel**: a 🗝️ line on People cards (phase now, the gate open next, one step per phase), *the road on this
  card* (every phase with its trigger and what moved), **Set** a phase by hand, **Undo mine**; people not met
  yet fold under *Other gated cards*; a *Gates* row in the Plot tab under a reply; a **Gates** settings section
  and a Modules switch; diagnostics count the cards.
- To the model it speaks the card's own words (*gated progression*, *phase*), never a bare "gate": in Re:Zero a Gate
  is the magic organ on the HUD.
- The card stays in charge: no phase and no rule is added. The Party module's own phase field is unchanged.
- Tests: `test_gates.js` (synthetic V7/V8 cards, and the twelve Classroom of the Elite V7.0 cards in
  `tests/data/cote_cards_v7.json`), `fe/test_fe_gates.mjs`.
- Version: the manifest says 2.1.1; the panel and bug reports say 2.1.1-beta. The name stays 2.1 beta.

## 2.1 beta — Minds, from FrankenSIM
Ported from **FrankenSIM 4 Mini by Wireless (Ryah)**, with permission. **TFDY** is by **Pyropia**. Thank you both.
FrankenSIM has the model rewrite its whole state every reply; here the model says only what moved, and the
extension does the math and the remembering.
- **Minds**: each person's feeling (Parrott's tree) and at whom; TFDY (tenderness, fury, dread, yearning) resting
  where their temperament puts it; how warm they show themselves (IW); their mask; the side of them that leads.
  Toward you and toward each other: **twelve feelings** with walls between mirrors, a gate, what shows and what
  is said, filters that crack open, debts until paid, intent and mode. They replace the classic bars by default
  (Settings → Minds puts the bars back).
- **The math**: at most 2 a reply (TFDY 1); a quiet feeling eases back one step every 3 replies, faster when far
  off or near the top; three pushes the same way settle it a step deeper; never 0, first values 3 or more; minors
  and family never get desire or a romantic mode. A **Return by Death** makes the world forget the undone loop.
- **Agendas**: what everyone is doing, where and until when, here or elsewhere, with *over by* when the time passes.
- **Who knows what**: each fact with how it reached them and how sure, false beliefs marked. Forget one with ✕.
- **Chekhov's gun**: planted details in the Quests card, with weights, locks, ripe ones, payoffs. Drop one with ✕.
- **Building maps**: the rooms the story drew, joined into whole buildings floor by floor by their doors, at no
  token cost, with people placed by their agendas. A new room is told which rooms of its building exist.
  FrankenSIM's furniture footprints keep a bed a bed.
- **Tone of voice** in the dialogue display: whisper, steady, tremble, bite, drawn as type.
- **Handed back** before each reply as memory, never as a rule: in HMS Reporter's new *Minds state* slot
  (`{{rpgc_minds}}`), or in the extension's own context message.
- **Panel**: a 🧠 line on People cards and *Inside, feelings and what they know*; *Planted details* in Quests; a
  *Minds* tab under each reply; **Whole building** in the Map card; a **Minds (from FrankenSIM)** settings section
  and five Modules switches; credits in Help. The Test zone's Re:Zero demo shows all of it.
- **HMS Reporter beta 1.1.0**: a **Minds** block (play each character from the inside: facets that rotate,
  feelings that carry over and catch bystanders, masks, honesty that is earned, knowledge that needs a way in,
  people who act on their own), a minds step in the Normal and Deep plans (Deep also turns the world off screen
  and checks planted details), receipt beats cut, and the Minds state slot. Fix: the Frame category and the
  Frame block shared one id.
- Version: the manifest says 2.1.0; the panel and bug reports say 2.1.0-beta.

## 2.0 beta — the official beta
- **The guide is built in.** A **Guide** button in the top bar opens the whole guide in the panel, with a find
  box; the same text is `GUIDE.md`. It explains the three parts (bot, preset, extension), who is in charge,
  setup, a new game, each turn, every card, OOC questions, memory, every setting, and fixes for common problems.
- **The Cosmic Hierarchy is removed**: its module, card, settings, world preset and the Nexus theme. Saved
  settings drop it by themselves (a chosen Nexus theme falls back to Lumiverse's own).
- **Each part stays in its lane.**
  - Injuries: a bot that keeps its own wounds (Re:Zero, Mushoku Tensei) owns them for the whole chat, also on
    turns where its HUD shows none. The extension used to step in on those turns and could remind the model of
    a wound the HUD had already healed.
  - Experience is asked only where the HUD shows a level. Re:Zero, Mushoku Tensei and Classroom of the Elite
    no longer get an XP question every reply.
  - **Move the world** is no longer marked OOC (an OOC message is now answered outside the story, with no HUD).
    The Test zone's plot buttons likewise.
  - The **Chronicle** switch in Modules really stops it (it used to hide only the card while still asking and
    writing).
  - The Man-God's advice is asked only while the world card is on.
- **New game**: start lines in capitals are found (`MUSHOKU_TENSEI_START_HANDLER`), and from the lorebook when
  the catalog pages do not name them. **Resume an old campaign** builds the bot's Start Continuer message from
  the old chat's last HUD, your last messages and a summary.
- **A world preset in one click**: after the first reply, the panel offers the preset for the bot it found
  (once per world).
- **Settings open as a short list**: every section starts closed.
- **Fixes**: a time like `12:40` showed as a label "12" in the World State card; the world card shared its
  open/closed state with the World State card; a quest deadline given as a bare time ("08:40") counted to the
  next day instead of showing overdue; a turn-based fight's aftermath now keeps the plot, objectives, key
  moments, inbox and injuries like any reply; search boxes take the panel's colours.
- **HMS Reporter beta** (the preset, was 0.5): renamed, with a plain description of who owns what.
- Version: the manifest says 2.0.0; the panel and bug reports say 2.0.0-beta.

- 1.9.26: New game, the OOC guide, the Arc line guard; emoji have one owner.
  - **New game builder** from the bot's own catalog pages and start handler line (see above).
  - **OOC guide** in the panel, or in the chat with the bot's trigger; OOC turns are left alone.
  - **Arc line guard** with a one-click fix to the lorebook's spelling.
  - **Emoji: one owner.** The extension draws them from the dialogue markers; HMS Reporter 0.5 no
    longer has an emoji block or asks the model for any.
  - Catalog descriptions no longer repeat their label.
- 1.9.25: The map bank, and fixes from the first Chronicle test.
  - **Map bank.** A room drawn once is kept for its world and used on every later visit and in every
    chat with that bot, so it is never drawn (or paid for) twice. View, forget, save the current
    version, or clear the bank from the Map card; the Atlas shows 🗺️ on places with a saved map and
    opens it in the details. Setting: Chat and panel extras → Map bank.
  - **Windows belong to walls.** A window the model gives as a block is drawn as a blue line in the wall
    it names, touches or is nearest to; the request says so too.
  - **One look for both maps.** The side-panel map uses the same world colours as the map under the
    reply.
  - **Atlas tiles readable in every panel theme** (they were dark boxes in the light themes).
  - **A room with nothing inside** opens among its neighbours in the Atlas, selected.
  - **The phone reads the story.** Texts, group chats and school or app notices that reach your phone
    are an optional `"inbox"` in the side-panel block (asked only when you have a device that takes
    messages). Notices show on the Phone card, people who messaged you become contacts you can answer,
    and Internal states shows them under Phone. Messages are no longer filed as things you carry.
  - **Your own device, per chat.** Name a phone (or mirror) on the Phone card when the story gave you one
    the HUD never prints.
- 1.9.24: The Chronicle.
  - **A timeline of the story**, read from the chat as it stands, so a swipe or an edit changes it too:
    milestones from the HUD (arc, rank, class, level, standing, powers gained, deaths and loops, quests,
    first visits), relationship history from the People readings (first meetings, standing and bond
    changes with their reason), plot threads opened and resolved, and key moments.
  - **Key moments** are one optional key in the side-panel block (`"moments"`, about 60 tokens of
    request, usually answered with `[]`). They show on the Plot tab of Internal states too.
  - **Chronicle card**: newest first, grouped by loop and day; filters for moments, bonds, plot,
    milestones and places; a name opens that person's timeline with you; star, hide, add your own;
    ✓ written, ⏳ waits for your answer.
  - **Written back into the Memory Cortex** once a reply is settled: facts with importance tags on the
    people, places and you; one `relationship` link per person toward you with its label and feeling;
    loops undone by Return by Death written as undone. Write now and Write everything again (after a
    Cortex rebuild; nothing doubles). Setting: Off, only the biggest, most (default), everything.
  - `{{rpgc_chronicle}}`: the key moments so far, for presets.
  - **Fix:** fights read the Memory Cortex's facts about the people in them again (the snapshot calls
    them `topFacts`).
- 1.9.23: The Atlas reads every bot's book.
  - **Re:Zero-style books.** Sections written as `**Label:**` lines (Appearance & Atmosphere, Function
    & Properties, Availability), lists written as `- **Name** *(note)*`, `◈ TIER n NAVIGATION ADDENDUM`
    and `◈ ADDITIONAL TIER n` lists, and `◆ POPULATION & FAUNA OVERLAY` entries (added to their place).
  - **One place, many spellings.** Paths that name a place differently in different entries become one
    place: short and long names, a name with its other name in brackets, `[Pocket Dimension]` flags,
    groups across cities (`[Royal Capital / Flanders / Costuul]`), a META copy of the root.
  - **No wrong links.** A listed room is looked for inside its own place and next to it, never across
    the world (Lugunica's throne room is not Vollachia's). A room listed under one name and written
    under another ("Maids' Rooms" / "Maids' Quarters") is one tile, not two.
  - **Cleaner text.** The details pane shows the book without markdown marks, list items as bullets.
  - **On the road.** `[In Transit: Lugunica → Vollachia]` stays one HUD segment; the Atlas shows you
    at the start of the trip, "on the road to Vollachia", and no room is drawn.
- 1.9.22: The Atlas.
  - **The location book as a map.** Every `◆ TIER` / `◈ PATH` entry becomes a place in one graph:
    parents from the paths, children in the book's navigation order, floors from `(Second Floor)`-style
    segments, surveillance graded (covered, watched, blind spots, no cameras), access and hours, who is
    usually there, scene anchors and links. The HUD's ◆ line is found in it, with the deepest known place
    and anything past the book shown as such. Built for all four HMS bots' shared format; tested on the
    Classroom of the Elite book (112 places).
  - **Atlas card** in the side panel: trail, floors, places as tiles coloured by how watched they are,
    and a details pane. Modules → Atlas switches it off.
  - **The map draws rooms from the book**: a new room's request carries its walls (or its shell's), its
    anchors and where it opens, once per room.
  - Internal states' Scene tab adds a Cameras line for the current place.
- 1.9.21: The map.
  - **Positions and the room map**, off by default: *Only in fights* or *Every reply*. Rooms are drawn
    once per place (from the location's lorebook entry when it is loaded) and kept; each reply then
    only moves people, with the last positions sent back for continuity. A Map tab in Internal states
    and a Map card in the side panel: walls, furniture, labelled ways out, and you, allies, foes and
    others in their own colours.
  - The D&D, Power scaling and Gritty play styles turn it on for fights; the others leave it off.
- 1.9.20: Internal states, and what you carry.
  - **Internal states panel** under each reply: Scene, People (with thoughts), Bonds (what moved, and
    why) and Plot, as tabs. Replaces the thoughts block by default; *Thoughts only* brings it back.
  - **Standard issue.** In Classroom of the Elite the phone, ID, uniform, dorm key and textbooks are
    assumed by the bot and never on its HUD; the Phone card now finds the phone, and the You card lists
    them.
  - **Carried.** The side-panel block now reports things handed over or lost on screen (`got` / `lost`);
    they collect in the You card, follow swipes, and can be removed or added by hand.
- 1.9.19: The HUD card and dialogue display.
  - **HUD card** in the chat (on by default), in the bot's world colours or Lumiverse's, with the plain
    text one click away. Display only: the saved HUD never changes.
  - **Dialogue colours, emoji reading cues and speaker names** (off by default) from `[D:Name:mood]`
    markers, drawn when shown. 42 emoji families, editable; per-chat speaker colours.
  - New macros `{{rpgc_marks}}` and `{{rpgc_emoji}}` so a preset's own emoji instruction can stand down.
  - The Test zone log hides the markers.
- 1.9.18: The preset handshake.
  - **`{{rpgc_request}}`, `{{rpgc_on}}`, `{{rpgc_fight}}`.** A preset with the slot (HMS Reporter v0.2)
    carries the side-panel request where its own reply shape expects it; the extension sees it there and
    does not add a second copy. Without the slot, nothing changes. If the slot fails or is slow, the
    extension adds its own message as before.
  - **A smaller request.** Last reply's characters go back as names and looks only — their old
    thoughts and moods were the part that grew with every character in the scene, and invited repeats.
    Spells are asked for only where the HUD shows magic (not in Classroom of the Elite). In the slot the
    request also drops the lines the preset already covers. A Classroom of the Elite scene with five
    people: about 1,690 → 1,375 tokens.
  - Settings → Modules explains that Request placement does not apply when the preset carries it.
- 1.9.17: Fixes from the first HMS Reporter test.
  - **The WORLD STATE header written twice** (the preset's opening plus the model's own, seen with GLM)
    is now one header. The reply is cleaned when it lands and on screen, and the second header is never
    read as a HUD line — that was the false "a HUD line was dropped" alarm on the next reply.
  - **The same quest twice.** The HUD writes `Name #1572188`, the story block just `Name`; quests are now
    matched without the barcode, quotes or capitals, so the story's details join the HUD's quest instead
    of adding an "in the story" copy.
  - **Bond history** no longer logs a "change" that is only capital letters, punctuation or spacing.
  - The Injuries note no longer names the Re:Zero HUD in other worlds.
- 1.9.16: Choose the connection.
  - **Connection for side calls** (Settings → General). Fights, the tracker, chapter summaries, portrait
    prompts and the Test zone used to run on Lumiverse's *default* connection only — not the one you had
    selected — and failed with "No connection profile found" when no default was set, which is why a
    turn-based fight could not start. Every call now names its connection. **Same as my chat** (the
    default) follows the connection your own replies in that chat use; you can also pick Lumiverse's
    default, or any one connection, for example a cheaper model for side calls.
  - With nothing to follow yet it falls back to the connection selected in Lumiverse, then the default,
    then your first connection. A chosen connection that was deleted falls back the same way and says so.
  - The fight window now explains a missing connection in plain words instead of showing Lumiverse's raw
    error.
- 1.9.15: Fixes from the first round of real play.
  - **Operator-scoped installs**: reading world info, long-term memory and portraits failed with "userId is
    required for operator-scoped extensions". Every user-scoped call now carries the user.
  - **One-request-at-a-time providers** (free plans): the extension's own calls collided with your reply and
    came back 429. They now wait four seconds after a reply, stand aside if you have already sent the next
    message, and try a busy provider again twice; if it is still busy, the panel says so in plain words.
  - **Read again**: a new button that reads the latest reply again — HUD and side-panel block — without a model
    call. The manual way when the automatic read missed something.
  - **The World State says why it is empty**, and shows how the reply starts. A reply still being written no
    longer blanks it, and a HUD written in HTML is read through the markup.
  - **Fixed**: starting the Test zone over while a live turn was being written crashed it ("sandbox.busy").
- 1.9.14: Injuries on the Re:Zero HUD's injury law.
  - The Injuries card (for HUDs without wounds) now runs on the Re:Zero lorebook's own rules: raw → treated
    → healed; each kind and severity heals in its window (wounds, fractures, sprains, burns); a break left
    unset 3–4 days heals crooked and turns Permanent; a wound or burn left raw risks infection; internal
    bleeding needs a healer; Permanent never heals with time; a healed moderate-or-worse wound may scar.
  - The story is told each injury's state and the day it is on ("broken shin, severe fracture, treated, day 6
    of 70–112"), and the side-panel block asks for kind, severity and status in the same words.
  - Your controls: Treated, Back to raw, Healed, Healed with a scar, Permanent; add your own with a kind and
    severity. Injuries saved by 1.9.13 are read the new way.
  - The Body card (a HUD that keeps its own wounds) warns in the law's words: an unset break heals crooked.
- 1.9.13: From the players: what the cards send, forgetful models, injuries — and the whole Cosmic Hierarchy.
  - **What the story is told, said plainly.** The Survival and Mind cards now say it: once you are tired, hungry
    or thirsty, or your state of mind is not calm, the story is told with every message so it can play it.
    The buttons log what you did; the story reports it too. With "Tell the story" off, they say only you see them.
  - **Models that forget the side-panel block.** When a reply leaves it out, it is fetched with one quick second
    call, only then, so the panel does not go stale. Three misses running and the panel suggests Separate mode.
  - **Injuries**, for HUDs that do not keep wounds: the story reports every injury you carry; the Injuries card
    shows how bad each is, whether it was treated and for how long; you can add one, mark it treated or healed;
    and the story is told them with every message. A HUD that prints its own wounds owns them.
  - **Fixed**: Separate mode (and Refresh in an HMS chat) dropped the plot, objectives, the Cosmos reading and
    the Man-God's advice it had read. It keeps everything now.
  - **The Cosmic Hierarchy, from its full lorebook**: Kael, Malachi and Janus (Gaius and Malus) join the family,
    with the nine servitor orders; the Creator is your persona; six pulls instead of four (Memory–Oblivion and
    Good–Evil); the gated arcs tracked phase by phase, with a warning when one skips; the Dice of Fate move the
    world, never the Creator himself; and the veil line steps aside when the lorebook already carries it.
- 1.9.12: The Cosmic Hierarchy, and sections that no longer close by themselves.
  - **Fixed**: a section could snap shut (or back open) on its own. It saved its new state on the browser's
    toggle event, which arrives a moment after the click; if a reply landed or the panel refreshed in that
    moment, the panel was rebuilt in the old state. The state is now saved on the click itself.
  - **The Cosmic Hierarchy module**: the Dice of Fate (Aurora and Moira roll with every exchange and lean the
    next beat), who of the hierarchy is present and the omens mortals notice, the balance between the
    Firstborn's domains, the realm and its Overseer, the knowledge veil, and an editable roster from the lore
    bible. Off by default; its own preset turns it on, with the new Nexus theme.
- 1.9.11: The plot and objectives, and the three new worlds checked.
  - **The Quests card opens with the plot** — where the main story stands and its open threads, marked moved or
    resolved as the story goes, the resolved ones kept below — **and objectives**: what you are trying to do right
    now as the story sets it, plus your own, which stay with you and are never sent. HMS and classic chats. They
    add about 190 tokens to the side-panel request; switch either off under Settings → Quests.
  - **Undertale's MERCY** in immersive fights: a monster that can be spared is marked, and sparing everyone ends
    the fight as spared, not as an escape.
  - **Each thing in one place**: what a world card shows — Authorities, classes, shouts, skills, the covenant — the
    Abilities card no longer lists a second time. Switch the world card off and it lists them again.
  - **The three new presets, checked**: Dark Souls no longer shows Estus twice (as a bar and as flasks); Undertale's
    LV, EXP, AT and DF live on the world card only; Skyrim's perk count is not read as an ability.
- 1.9.10: The presets, checked, and three more worlds.
  - **Every preset turns HMS on** (Always mode, the side-panel block, the guard, pin reminders) — the play styles
    did not touch it before.
  - **Fixed**: a world preset *replaced* whole sections of your settings instead of changing only what it names.
    Applying Overlord, say, reset your chapter budget, your D&D rules, the legacy window switch and your XP
    curve to their defaults. A preset now merges into your settings.
  - **Fixed**: the four wiki themes (1.9.0) were partly overwritten by the older world themes further down the
    stylesheet, so Re:Zero, Overlord, Classroom of the Elite and Mushoku showed a mix of the two looks —
    Mushoku's cream wiki cards with the old dark theme's pale text. The old rules are gone; each shows as
    designed.
  - **The world presets, reviewed**: Overlord gets its world card, Arcs chapters and engine-rule fights (it had
    power scaling, and no world card); Overlord, Classroom of the Elite and Mushoku switch D&D off (their own
    systems replace it) and Classroom of the Elite drops your roller (the School Database rolls); Re:Zero keeps
    D&D for its D&D mode and adds Arcs to Loops; every world keeps its arcs as chapters.
  - **The play styles, reviewed**: Pure narrative now really has no dice (no roller, no D&D) and asks fights for
    the least; Gritty survival plays on Hard; Social & romance turns the phone on.
  - **Undertale, Dark Souls and Skyrim**: a world preset, a theme, a world card and a Test zone world each.
    Undertale's SAVE, LOAD and RESET count as rewinds, so each timeline can be a chapter.
  - **Fights**: a HUD that prints your Stamina (Dark Souls, Skyrim) owns it, like HP and MP; FP and Magicka are
    read as MP.
- 1.9.9: A full diagnosis of 1.9.8, top to bottom.
  - **Every switch explains itself.** 37 settings switches had no line saying what they do; each has one now.
  - **Settings with no control**: the You module's level-up note and the XP needed for each level could only be
    changed by editing files. They are under HMS systems → You.
  - **Faster in long chats**: the panel re-read every system of every HUD in the chat to build the quest journal,
    about 440 ms per refresh on a 1,200-message chat. It reads only the quest lines now and remembers HUDs it
    has read: about 80 ms.
  - **Bounded memory**: the per-chat caches grew with every chat you opened; they keep the recent ones now.
  - **Plain-language errors**: a missing permission read "PERMISSION_DENIED: generation"; it now names the
    permission and where to grant it. A timeout says how long it waited and where to raise it.
  - **Dead code removed**: the old Chapter card was still in the file, hidden behind the new one.
  - **Modules** now cover Chapters, Lorebook context and Long-term memory too; switched off, a card leaves the
    panel and its text leaves the prompt, as everywhere else.
  - **Help & bug report** opens with a short guide to how the panel fits together, and its version always
    matches the build (it used to be typed in by hand).
  - **Fixed**: ending a turn-based fight before a single round closed the window without a word; the panel now
    says nothing was posted and why.
  - **Fixed**: a Godmother Decree due at midnight on January 1, set on December 31, showed as eleven months past.
  - **Fixed**: with the world card switched off, the D&D card stopped reading the D&D sheet the HUD prints.
  - **Fixed**: a level the HUD prints could be "raised" by hand in the D&D card, with no effect. Those buttons
    are locked now, like the rest of a HUD-owned sheet.
  - With only one kind of fight available, the fight button opens it straight away instead of a one-item chooser.
  - The README's settings map covers every section of Settings, and the panels are listed once each, in the
    order the panel shows them.
  - **Tested further**: every Test zone world in Live mode; a classic chat in Separate mode; both fight
    windows played by clicking; the floating panel; the model answering with garbage, nothing, the wrong
    shape, an error or never; each permission missing; every view scanned for leftover program text.
- 1.9.8: The world cards read the rulebooks and lorebooks behind each world.
  - **Re:Zero**: magic (element, what the Gate and Pool ranks mean, the element's spell series), Spirit
    Affinity, what each spirit rank is, Od Integrity and Corruption on their named stages with the next one,
    and curses. Entries marked SECRET — the sealed Sovereign forms — never reach the panel.
  - **Overlord**: each tradition's spells up to its LV from your magic core, and a framework check against the
    Being Framework, Traditions and Super-Tier rules. The Test zone's Overlord build now follows those rules.
  - **Mushoku Tensei**: sword techniques per style and rank from your technique index, the matchup triangle,
    and what your Mana Capacity and Touki stage mean.
  - **Fixed**: an ability description could come from a module's rulebook (how the engine heals a curse)
    instead of the entry about the thing itself.
- 1.9.7: A full pass over everything since 1.9.1.
  - **Fixed**: a clock going back was read as Return by Death in every story, so a new school year in
    Classroom of the Elite could close a "loop", and a new K. year in Mushoku Tensei could drop a fight as a
    rewind. Only a story with Return by Death rewinds now.
  - **Fixed**: your own presets forgot everything added since 1.8 — immersive fights, D&D, Chapters, the world
    card, Lorebook context, the engine core and memory. They remember all of it now.
  - **Fixed**: with "Watch the chat's world info" off, a world card showed no ability descriptions, class caps
    or spell lists until the first fight or tracker call. It reads the lorebook as soon as the card appears.
  - **Fixed**: amber text (enemy telegraphs, legendary classes) was hard to read on the light themes.
  - The bug report now says which systems are in play: the world card, chapters, a fight, D&D, the lore pool.
  - Modules name where merged parts live ("Party (in People)"), and the README is brought up to date:
    install permissions, presets, the Test zone, engines tested.
- 1.9.6: The world cards, built out from the bots' own start handlers, central controls and registries.
  Re:Zero shows the Arc 0 prequel year on the handler's −20 → 0 axis with its Part and milestones. Overlord
  reads each job class's tier and cap from your class registry, marks legendary classes, and shows traditions
  with their LV. Classroom of the Elite shows the school calendar and the days to the next Class Point
  announcement, and Chapters can follow the school months. Mushoku Tensei lists what you can cast in each
  school from your Master Spell Index, and what the next rank opens. The Test zone plays Mushoku Tensei, and
  its Re:Zero, Overlord and CotE scripts print the bots' current HUDs, so their world cards show there too.
- 1.9.5: A card of its own for each of the four worlds — Re:Zero, Overlord, Classroom of the Elite and Mushoku
  Tensei — found from the HUD. Overlord fights know every combatant's level and the gap to yours. The D&D card
  reads a D&D character sheet the HUD prints. The Mushoku Tensei preset is an HMS preset now (carriers,
  abilities, no survival clock, no phone); the Re:Zero preset switches Loops chapters on.
- 1.9.4: The pop-out window scrolls again. Lumiverse's own page rules (which the window copies so it matches
  the app) make the page itself unscrollable; the panel now scrolls in a container of its own, with the mouse
  wheel, touch and the keyboard.
- 1.9.3: Chapters, one card per person, and nothing asked twice.
  - **Chapters** are memory at the story's own scale: by hand (the default), or — switched on — per loop
    under Return by Death, per arc, per day. Summaries ride on top of the history; nothing is removed. A
    finished loop is sent as undone and remembered only by you, and what you uncovered collects into one list.
    The old "hide everything before this message" chapter is gone; a chat still using one can show its
    messages again from the Chapters card.
  - **One card per person.** Present characters, Party and People showed the same person three times; they
    are one card under People now.
  - **Nothing asked twice.** A party member was asked their mood twice, what is on their mind twice (as
    "thoughts" and as "concern") and their jealousy twice on two scales. Each is asked once now and the
    party reading is filled from the others. With the survival clock on, your stress is read from your state
    of mind instead of being asked separately.
  - **Fixed**: in an immersive fight with fate dice, a roll you made yourself and your fate die both went to
    the model for the same action. Your own roll now replaces your fate die.
- 1.9.2: From the first look at 1.9.1.
  - **D&D is one section with one switch**: a per-chat sheet (ability scores, saves, the 18 skills,
    proficiency from your level), a roller that adds your modifiers, advantage and a DC and sends the whole
    sum into your next reply, and turn-based fights. Switched off, the Turn-based fight button goes too.
  - **You and Vitals are one card.** The same HP bar was shown twice.
  - **Quests have their own Settings section.**
  - **The panel's place is chosen in the top bar**, next to Test zone and Settings.
  - **Fixed**: the pop-out window used unstyled text boxes and default fonts; it now copies Lumiverse's own
    look and follows its theme. Dropdown lists were white with pale text in dark themes (and pale on white
    in light ones); they are readable in every theme now. The Test zone called you "User" instead of your
    persona. A roll made in one chat went into the next reply of whichever chat you used next.
- 1.9.1: One extension again, and fights split into two different things.
  - **Merged**: the lore, engine and memory work that had been numbered 1.9–1.11 on its own line is
    folded into this build. Fights, the tracker and the companion block now carry your world books
    (Lorebook context), your engine core as binding law (Engine core & memory), and the Memory Cortex.
  - **Fights are two things now.** *Immersive*: you fight in the chat and the panel tracks everyone —
    HP, MP, Stamina, effects and how long they have lasted, each fighter's last move, enemy telegraphs,
    hidden enemy plans, Study, acting on a weakness, fate dice, a fight log. *Turn-based*: the D&D
    window. The narrative window is a legacy option under Settings → Fights. Your style, fate dice and
    difficulty carry over to immersive fights. Auto-start stays off by default.
  - **Fixed** in immersive fights: the fight froze in HMS chats whenever Present characters, Party,
    People and Phone were all switched off (the numbers only came back through their block). A reply
    that only carried the fight numbers was ignored and left raw JSON in the chat. The note to the model
    told it not to render "a status block", which made classic chats drop their trackers — the likely
    cause of "No trackers yet" during a fight. Swipes inflated the reply count. Every enemy fleeing never
    ended the fight, and you getting away was not an outcome. An enemy knocked out with HP left was never
    down. The auto-start notice used a host call that does not exist, so it never showed. Correcting a
    number used a browser prompt the desktop app may not show. Switching Fights off mid-fight hid End
    fight while the fight kept running, and auto-start ignored the switch. The Test zone's Demo spent
    tokens on an immersive fight.
  - **Fixed**: in Separate mode, the companion call was told to "add the block after the prose" instead of
    describing the latest reply (a wording change in 1.9.0 broke it). Granting the memories permission
    mid-session did nothing until a restart. With no watched pool, the lore fallback read every book you
    own, so a fight in one world could pull another world's lore; it now reads only the books the chat uses.
  - **New switch**: Watch the chat's world info — see Lorebooks for what it costs.
  - Settings move to v8: "Turn-based" now always means the D&D window.
- 1.9.0: The pre-2.0 build, from playtest feedback.
  - **Fixed**: the side-panel request was appended to your own message (~1,170 tokens on a one-line turn),
    which shortened replies and pushed some models to write the HUD into their thinking. It now has its own
    system message before your turn, framed as an extra, and is trimmed.
  - **Fixed**: a HUD or block written into the model's thinking is moved back into the reply; a reply that
    still carries a raw block is processed later — never while it is still being written.
  - **Fixed**: Fights, Tracker field presets, Custom prompts and Reset closed themselves a few seconds after
    opening. A HUD drafted inside <think> was read as the state. A block with only our newer keys, or an empty
    fence, could show in chat. Move the world posted a visible OOC message (now a short marker). Plot buttons
    failed in the test zone. An edited HUD value of the same length could be served stale.
  - **Fixed**: in HMS chats, present characters no longer ask for per-character stats (Health, Arousal) — and
    the minor guard now covers character stats too. People tracks feelings; it no longer pulls NPCs toward
    neutral, and never steers how they are written.
  - **New**: You (with XP and level-ups), Magic, richer Quests, Check what?, Difficulty, Modules, wiki-style
    world themes plus D&D / Heaven / Horror, the floating mini panel and pop-out window, and the bug report.
- 1.8.0: World presets that set everything, and the test zone.
  - **Living World presets**: Re:Zero — The Living World, Overlord — The Living World and Classroom of the
    Elite — HMS Render Engine now configure HMS (always on), carriers, vocabularies, meters, quest tags, party
    depth, phone kind, fights and theme for their bot. Presets merge deeply: they change only what they name.
    Your own presets now remember every system, not just a few switches; presets saved by 1.6 still apply.
  - **Test zone**: a practice chat inside the extension, in Demo (scripted, free) or Live (your model) mode.
  - Density and text size.
  - Every chat call now goes through one layer, which is what lets the test zone run the real code paths.
- 1.7.0: Relationships done right, every chat, and worlds.
  - **Fixed: closeness was read as romance.** The ladder ended in Lover, so deep affection became a
    romantic label — it called Beatrice, a child-appearing spirit whose card makes her bond daughter-
    and-parent, a lover. Standing now measures closeness only (it tops out at Devoted); the kind of bond is
    tracked apart, from the character's own entry and contract; minors and family bonds are guarded from
    romance and desire by the extension itself; and the bond can be set by hand. Untouched v1.6 lists
    upgrade automatically.
  - Relationship cards: mood, bond, Desire / Tension / Jealousy bars, the reason under the bar that moved,
    and the present-character dossier.
  - **People, Party and Phone in classic chats**, with their own settings section. Before, they only
    existed in HMS chats, so any bot the HUD detector did not recognise never showed them.
  - Phone kinds: phone, conversation mirror, Message spell, comms radio. The device can come from the
    inventory in classic chats.
  - World presets (Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei) and six new themes.
- 1.6.0: People, the phone, two combat systems, and play-style presets.
  - **People**: a relationship tracker for everyone you deal with — standing on a ladder, six bars,
    what changed, alerts, and four layouts. Party members take affection and trust from here.
  - **Phone**: device and balance from the HUD, contacts earned in the story, threads from the chat;
    texts, calls and transfers go into the story, where the engine decides whether they connect.
  - **Fights split in two**: Narrative (engine rules, power level with feats, hax and counters, or
    fiction; fate dice; outcome badges) and D&D (a rules engine in the extension: initiative, attack
    rolls against AC, damage dice, crits, saving throws, spell slots, Dodge, death saves, massive
    damage, stabilising, and companions rolling to obey). Your v1.5 choice carries over.
  - **Play-style presets** and **themes**. Tracker presets were renamed Tracker field presets.
- 1.5.0: Fights rebuilt, and a full audit against every source.
  - **Fights**: Physical / Magical / Abilities & skills menus, orders for allies (a request their
    card and mood answer), Check with lasting intel and exploit-with-advantage, Guard, a risky
    Flee, hidden enemy plans with visible telegraphs, apparent threat vs true power, four
    resolution modes, and true-random dice for every combatant.
  - Fixed: the aftermath of an HMS fight crashed when the side-panel block was on (a v1.4
    regression). A combatant a reply forgot to restate vanished from the fight. Try again
    re-rolled the dice. The fight settings' defaults were stored where nothing read them.
  - **Audit** against the three engines, their HUD modules, the original extension and the card
    toolkit: Gamemode, Now Playing and the Mental Council are carriers; Blood Pool, Thirst State,
    talents' Status, multi-Authority brackets, `[… - state]`, world items, Runecraft, Passives,
    `[MAIN QUEST: …]`, `[EVENT: …]`, Exam lines, attributes, the engine's own dice rolls and ✦
    notices are all read; self-clearing lines show as cleared; the corrected HUD after an
    (OOC: Correction) is the one read.
  - **Stands down in HMS chats**: Choose your own adventure (the engines forbid ending on
    options), and the plot buttons (Move the world replaces them). Styling prompts keep the HUD
    plain text. Move the world can no longer trip The World Moves.
  - README rewritten; LICENSE added with the modification notice AGPL asks for.
- 1.4.0: The party.
  - **Keep tabs on the people travelling with you.** Add them by name, from the suggestions
    (a contract on the HUD, or someone present in most recent replies), or with **+ Party** on
    a present character. Each reply, members in the scene are read through the side-panel
    block; the absent keep their last reading and read in the past tense ("was very hungry
    when last seen, 40m ago").
  - **Built on the V7.0 card toolkit.** Every state a card names for itself is reported in the
    card's own words: State Register (Territorial), Affect Band or behavioural mode (Band 1),
    contract stage, gated progression phase, vessel front, signature tell. The extension
    defines none of them and never restates card content into the prompt — it carries short
    labels forward so readings stay continuous.
  - **Universal levels** for what cards do not name: affection, trust, jealousy (and of whom),
    irritation, how hard they are holding an act, hunger, fatigue, pain, stress — none,
    slight, moderate, high, extreme.
  - **Alerts.** A strain at the alert level ("Honami is very jealous of Kikyo — for 40m"), a
    strain climbing several replies in a row, affection or trust dropping sharply, and a
    **skipped phase or stage** — which a V7.0 card forbids. The request itself tells the
    model a stage or phase moves only after an event with a cost. Durations run on the HUD
    clock. A member in agony, starving or about to drop joins the Critical banner; social
    strain stays in the Party panel.
  - **Other names.** Aliases per member ("Momonga", "Ainz Ooal Gown"); a shared vessel's souls go
    here too.
  - Each group (mask, bond, needs, phase) can be switched off, which removes it from the request.
  - **The side-panel block no longer depends on Present Characters.** The party and the survival
    clock can ride it on their own.
- 1.3.0: Vitals, body, mind, abilities, quests — and an optional survival clock.
  - **Read, never computed.** Every new panel reads what the engine already prints. HP, wounds
    and conditions stay the engine's; the extension shows them, tracks them over time, and
    never edits them.
  - **Vitals.** Resource pools (HP, MP, Focus, Super-Tier Slots…) as bars, with damage and
    healing since the last reply. Percent meters (Corruption, Od Integrity) with their stage,
    rising-is-bad ones inverted. Health pools can go critical.
  - **Body.** Wounds by tag — Raw, Treated, Magic-Healed, Permanent — with how long each has
    sat in its tag. A wound left Raw past a threshold (72h default, the malunion window) is
    flagged. Conditions on their own ladders (Blood Loss, Shock, Exhaustion, Starvation, Dread…)
    with stage, trend and time at stage. Unlisted conditions still read Mild…Critical and
    Stage N. Healed wounds and cleared conditions are noted.
  - **Mind.** Psychological conditions and status flags (Dread, Blood Frenzy, Emotion
    Suppression) in their own panel.
  - **Abilities.** Authorities, Divine Protections, Contracts, Blessings, Skills, Martial Arts,
    magic systems, classes, traits — grouped by category. What counts as an ability is a
    vocabulary you edit per world.
  - **Quests.** State badges, objective checklists (a Godmother Decree, a D&D Milestone), and a
    journal of quests that left the HUD. **A quest that leaves the line while still live is
    flagged**, with a one-click put-back: its printed name is what loads its entry, so a silent
    drop darkens it. Quest names are never injected into the prompt.
  - **Carrier lines.** When the guard catches a dropped Arc, Quests, Memory, Blessings, Game
    Mode, Authority, Divine Protection or Contract line, it is listed first and marked.
  - **Inline blocks respected.** Rows inside a ─── fenced block (Godmother, School
    Database, D&D sheet) are no longer diffed or pinned. Before, every XP tick flagged two false
    drops, and Restore would have written the stale header back in. Blocks now show as their own
    card, and restored lines never land inside one.
  - **Folded path layers** like `(Eastern Provinces)` show dimmed.
  - **Survival clock (off by default).** For bots whose HUD does not track sleep, food, water or
    state of mind. It measures elapsed time from the HUD clock — the arithmetic models are bad
    at — and tells the engine the facts; the engine decides the consequences. It stands down
    for anything the HUD already tracks, for immune races (Undead), and resets on a Return by
    Death rewind. Events come from the side-panel block or the Slept / Rested / Ate / Drank
    buttons.
  - Everything is configurable under Settings → HMS systems.
  - Fixed: quests after a ` | ` separator were cut from the Quests line.
- 1.2.0: Audit pass — correctness, reachability and honouring your own switches.
  - **HUD line identity is now content-based, not positional.** A HUD may legitimately
    carry several lines under one tag (Re:Zero's seven `[SPIRIT CONTRACT: …]` lines, two
    `[STATUS: …]` lines in Overlord). Those were keyed by tag alone and disambiguated by
    order, so when one dropped the survivors renumbered: the guard named a line that was
    still present, missed the one that actually vanished, and Restore wrote a duplicate
    into the saved reply. Pins had the same fault. Both fixed and covered by tests.
  - **A HUD template swap is no longer read as dropped lines.** Entering or leaving
    Re:Zero's WHDAAA theater replaces the whole HUD by design; the guard used to flag
    every standard line at once, and Restore would have spliced twelve stale lines into
    a theater HUD the module forbids touching. The swap is now detected and reported as
    a template change with nothing to restore. Ordinary drops are unaffected.
  - **Switching the extension off now actually stops it.** Refresh, Move the world,
    fights, plot nudges and portraits used to run regardless: Refresh spent tokens,
    Move the world posted to the chat, a fight could write its aftermath. Those actions
    are refused while it is off, and the three input-bar buttons grey out. Reading the
    panel, editing saved data and changing settings still work.
  - **Refresh honours “Ask for present characters and thoughts.”** With it off, a manual
    Refresh in an HMS chat used to fire the companion call anyway, against the promise
    that off means nothing is added. It now says there is nothing to fetch.
  - **Three settings became reachable in HMS mode.** Present characters, Quests, Dice and
    the bar colours are all live in HMS, but their controls sat in a panel HMS mode hid.
    Turning one off elsewhere left no way to turn it back on — worst for Present
    characters, which also gates the companion request. The section now appears in HMS
    with the toggles that apply there. Quests also honours its own toggle now.
  - **Portraits can be removed.** The backend could always clear one; nothing ever asked
    it to. There is now an ✕ next to Redraw.
  - **Leaked preset reasoning is stripped wherever it lands**, not only in the run
    directly after `***`. Prose that merely mentions the words is still untouched.
  - Settings carry a version and migrate on load. Stale HMS detection is cleared when
    messages are deleted. Unlabelled numeric inputs got labels. Dead CSS removed.
- 1.1.2: Panel auto-updates after every reply without a manual Refresh. It now listens for the
  reply-ended event, self-heals if a push is missed, and a repaint deferred while you're editing
  a field flushes correctly on blur (the applied data is never lost).
- 1.1.1: Safety net for a preset that spills its reasoning into the reply — a leaked
  fn:/page:/REPORT CARD/VIOLATION LOOP block sitting between the HUD's *** and the prose is
  stripped from the saved message and hidden live. Only fires when those markers appear right
  after the separator; ordinary prose that mentions the words is untouched. This is a
  backstop; the real fix is preset-side (keep that reasoning in the Thinking panel).
- 1.1.0: Relationship field widened and free-form by default (no more wrong "Lover" for a
  contracted or family bond); Quests panel (reads a HUD `Quests:` line and keeps your own
  notes); combat gains a per-fight thinking toggle, optional dice/skill checks, abilities read
  from the HUD each turn, and a Past fights log.
- 1.0.0: HMS Edition. Reads the WORLD STATE HUD instead of competing with it; HUD Guard
  with restore; pins; Move the world; fights and aftermaths on HMS rules; companion block
  for characters; automatic HMS detection with classic fallback.
