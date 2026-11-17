# HMS Guide

**RPG Companion HMS Edition 2.9 beta** and **HMS Reporter beta 1.7**

This guide explains how an HMS game works, how to set it up, and what every part does.
Read **Start here** first. Use the other parts when you need them.

---

## 1. Start here: three parts, one game

An HMS game has three parts. Each part has one job.

| Part | What it is | Its job |
| --- | --- | --- |
| **The bot** | The character card and its lorebooks: Re:Zero, Mushoku Tensei, Classroom of the Elite, Overlord, Harry Potter, SCP-4666, Undertale, Dark Souls or Skyrim | The world and its rules. It writes the **WORLD STATE HUD** at the top of every reply. |
| **HMS Reporter beta** | A preset: the prompt Lumiverse sends | How the story under the HUD is written: style, voices, length, thinking. |
| **RPG Companion HMS Edition 2.9 beta** | An extension: the side panel | It reads the HUD and shows it as cards. It tracks people, how they feel and what they know, quests, fights and more. It helps you start a game and ask questions. |

### Who is in charge

When two parts disagree, this order wins:

1. **The bot.** Its rules and its HUD are the law. The bots call this **STATE IS GOD**. Nothing may hide, change or replace the HUD.
2. **The preset.** It only shapes the story under the HUD. It never changes a rule or a HUD line.
3. **The extension.** It reads and shows. It asks the model for one small hidden block after the story, and hands back what it remembers about the people (Minds) before the next reply. It never writes a HUD of its own and never adds rules.

### What a reply looks like

```
### WORLD STATE ###
Day: 3 | Time: 14:10 (Afternoon)
◆ World of Re:Zero → Lugunica → Roswaal Mansion
Arc: Arc 2: A Week at the Mansion
***
The story...
<rpg_companion>{ ... }</rpg_companion>
```

- **The HUD** is the top part, from `### WORLD STATE ###` down to the `***` line. It belongs to the bot.
- **The wall** is the `***` line.
- **The story** comes under the wall. It follows the bot's rules, written in the preset's style.
- **The hidden block** comes last. It belongs to the extension. You never see it: it is removed from the saved message.

### Who owns what

| Thing | Owner | Notes |
| --- | --- | --- |
| The HUD: time, place, arc, powers, money | Bot | The extension only reads it. |
| Rules: death, power gaps, Return by Death, exams | Bot | Fights in the extension use the bot's own rules. |
| Start commands and the catalog | Bot | The New game card only fills them in for you. |
| OOC answers | Bot (its guide character) | The OOC card asks that same guide. |
| Injuries in Re:Zero and Mushoku Tensei | Bot | These bots keep wounds on their HUD. The extension stays out. |
| Injuries in Classroom of the Elite and Overlord | Extension | These bots keep no wounds. The Injuries card tracks them. |
| How the story reads, its length, thinking | Preset | Set them under the sliders icon. |
| Emoji and dialogue colours | Extension | Drawn on your screen. The preset never writes emoji. |
| Side panel, map, Chronicle, people, quests | Extension | Read from the HUD and the hidden block. |
| Who a character is | Bot (its character cards) | The cards always win. |
| How characters are played from the inside | Preset (the Minds block) | From FrankenSIM. See part 7. |
| The numbers: feelings, agendas, who knows what, planted details | Extension (Minds) | The model only says what moved. The extension keeps the rest. See part 7. |

---

## 2. Install and set up

You need **Lumiverse 1.2.0 or newer**.

### Step 1: Remove the old RPG Companion

If you have the original RPG Companion extension, disable or remove it. Both would add to your prompt.

### Step 2: Install the extension

1. Open the drawer and go to **Extensions**.
2. Click **Add Extension**.
3. Pick one way:
    - **Install from Source**: paste the extension's GitHub link.
    - **Import Local** (owner or admin only): first put the `rpg_companion_hms` folder in `Lumiverse/data/extensions/`.
4. Read the permissions and click **Install**.
5. New extensions start switched off. Turn **Enable** on.
6. Grant the permissions. You can skip any. That part then switches off and tells you why.

| Permission | What it is for |
| --- | --- |
| interceptor | Adds the extension's small request to your prompt. |
| generation | The extension's own model calls: fights, the OOC guide, chapter summaries, a missed side-panel block. |
| chat_mutation | Keeps the hidden block out of saved replies, puts back HUD lines, and posts your new-game, phone and Move the world turns. |
| world_books | Reads your lorebooks: the Atlas, the Arc line check, the OOC guide, lore for fights. |
| memories | Uses Lumiverse's Memory Cortex: the Chronicle writes to it, fights read from it. |
| image_gen | Character portraits only. |

### Step 3: Import the preset

1. Open the **Preset Manager** in Lumiverse.
2. Import the file `HMS_Reporter_beta.json`. It comes with the extension, in its `preset` folder.
3. Choose **HMS Reporter beta** as the preset for your HMS chats.

### Step 4: Open the panel

Open a chat with an HMS bot. Then open the **RPG Companion (HMS)** tab in the side drawer.

### Step 5: Use your world's preset

After the first reply, the panel offers **Use the [world] preset**. Click it.
It sets the right cards, fights and theme for that bot in one click.
You can also do this later in **Settings → Play style**.
There you also pick **How much**: **Light**, **Medium** or **Heavy**. Light is cheap and simple. Heavy tracks everything. So you can play light Re:Zero, or heavy Overlord.

### Good settings to start with

- Preset sliders: **Thinking: Normal**, **Prose length: Scene-led**, **Start replies with the HUD header: Auto**.
- Lumiverse: switch on the **Memory Cortex** if you want the Chronicle to remember key moments.
- Extension: keep **Together** mode (Settings → General).
- Want emoji or coloured dialogue? Settings → **Chat display** → **Dialogue**. They are off at first.

---

## 3. Start a new game

### The catalog

Every HMS bot opens on a **catalog**. Its first message has many pages. Swipe left and right to see them.

- **The hub page** says how to start, and names the **start handler** line.
- **The canvas page** is almost empty. You type your start under it.
- **Command pages** list starts, add-ons and ready-made examples.

### The start handler line

Your first message must begin with the bot's start line, on a line of its own.

| Bot | First line | Line to resume an old campaign |
| --- | --- | --- |
| Re:Zero | `ReZero_Start_Handler` | `ReZero_Start_Continuer` |
| Mushoku Tensei | `MUSHOKU_TENSEI_START_HANDLER` | `MUSHOKU_TENSEI_START_CONTINUER` |
| Classroom of the Elite | `Cote_Start_Handler` | `Cote_Start_Continuer` |
| Overlord | `Overlord_Start_Handler` | `Overlord_Start_Continuer` |
| Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim | The line the bot's hub page names | The bot's continuer line, if it has one |

Every bot names its own start line on its hub page. The **New game** card finds it for you, so you do not need to know it.

Then come your commands. For example:

```
ReZero_Start_Handler
Start at Arc 3 with RBD, Hell Mode, Start with Echidna
```

### The New game card (the easy way)

On a new chat, the panel shows **New game**. It reads the catalog pages for you.

1. Pick a page at the top.
2. Pick one **start**.
3. Pick any **add-ons**. Add-ons stack on a start.
4. Fill any blanks, like `[Name]`.
5. Read the warnings. For example: no start yet, an empty blank, or no Return by Death in Re:Zero. One click adds `with RBD`.
6. Press **Start the game**.

The card turns the greeting to the canvas page and sends your command. You can also edit the command by hand, **Copy** it, or **Clear** it.

### Resume an old campaign

Inside the New game card, open **Resume an old campaign instead**.

1. Paste the last HUD from your old chat. This is your save file.
2. If you have them, paste your last few messages and a summary of the story.
3. Press **Resume the campaign**.

The card puts the bot's Continuer line first, as the bot asks.

### After the first reply

- The bot builds the HUD on turn 1. From then on it carries it in every reply.
- **Arc line check.** The Arc line is a lookup key. If it is misspelled, the arc's lore never loads. The World State card warns you and offers the book's spelling in one click.

---

## 4. What happens each turn

1. You write what you do, and send it.
2. The preset builds the prompt: the bot's card and engine, your lore, memory, the chat, the minds state, and the extension's small request.
3. The model writes the HUD, the `***` wall, the story, and the hidden block.
4. The extension reads the reply:
    - It reads the HUD and updates the cards.
    - It reads the hidden block (people, feelings, agendas, what people learned, planted details, quests, phone, injuries), then removes it from the saved message.
    - It does the Minds math: caps each step, lets old feelings fade, remembers debts.
    - It checks for HUD lines that vanished, and puts back lines you pinned.
    - It draws the HUD as a card in the chat, and dialogue colours and emoji if you switched them on.
5. When you answer a reply, that reply is settled. The Chronicle then writes its key moments to the Memory Cortex.

### The button row

| Button | What it does |
| --- | --- |
| **Move the world** | You do nothing new. One story thread off screen moves one step. |
| **Immersive fight** | Starts a fight you play in the chat. The panel tracks it. |
| **Turn-based fight** | Opens the D&D fight window. Only when D&D is on. |
| **Read again** | Reads the latest reply again. Free: no model call. Use it when a card did not update. |

### The top bar

| Item | What it does |
| --- | --- |
| Together mode / Separate mode / Paused | Shows how the extension gets its data. See Settings → General. |
| **⚙ ~N tokens** | About how many tokens the extension adds to each reply, on top of your bot and preset. Press it for the parts. See **What it costs** in part 11. |
| **Refresh** | Asks the model again for the side-panel data. This costs a call. |
| Drawer / Floating / Own window / Wide window | Where the panel lives: in the drawer, floating over the chat, in its own window for a second screen, or in the **wide window**: a big window over the chat with a menu down the left side. |
| **Test zone** | A practice chat inside the extension. Demo mode costs nothing. |
| **Guide** | This guide. |
| **Settings** | All settings. |

### Buttons in the chat input bar

**Refresh side panel**, **Open RPG Companion**, **Start or resume a fight**, and **Move the world**.

---

## 5. HMS Reporter beta (the preset)

### What it does

HMS Reporter beta tells the model how to write the story under the wall. It always puts the bot first. It says: the core and its lorebook entries outrank everything in this preset.

### One dial: Mode

Open the sliders icon (Prompt Variables). **Mode** is on the Frame block. It has the same steps as the extension's play styles, so you can pick the same word in both.

| Mode | What the model does | For |
| --- | --- | --- |
| **Potato** | Short rules. No long plan. The long craft blocks step aside. About 5,000 tokens less than Medium. | Small or cheap models. |
| **Light** | A short plan, and one short paragraph about the characters. About 2,900 tokens less than Medium. | Fast play. |
| **Medium** (default) | A full plan and every character block. | Most games. |
| **Heavy** | A deep plan (the world off screen, the player's action ten steps out) and a whole-sheet look at each person. | Long campaigns. |
| **Max** | Heavy, plus **Radiant's R. Prompt**: the Core Engine v3.1.7 with its planning pass, and the Writing Style v3.1.5. About 29,000 tokens more. | Big models with big contexts. |
| **Custom** | The **Thinking** and **Character depth** dials decide, as in 1.5. | Tweaking by hand. |

Radiant's prompt is used with Radiant's permission. In Max it runs inside the HMS bot: the bot's HUD is the "RPG panel" Radiant talks about, and the extension's hidden block takes the place of Megumin's HUD. Radiant's intimacy section is left out (the HMS bots have characters under 18 and it has no age guard). Radiant's gore section is its own block, off at first.

### The blocks, top to bottom

| Block | On at first? | What it does |
| --- | --- | --- |
| Frame | On | Says who is in charge and the reply shape: HUD, wall, story, then the hidden block if one is asked for. Explains OOC messages. Holds the **Mode** and **Start replies with the HUD header** dials. |
| Game card | On | The bot's description and its system prompt. |
| HMS core (personality field) | On | The bot's engine: its rules and its HUD. |
| Scenario | On | The card's scenario, if it has one. |
| Player persona | On | Your persona. |
| Example messages | On | Style examples only. |
| Potato mode: the short rules | On | Only in Potato: the short version of everything below. |
| Reporter: how the prose reads | On | Lead with what changed. Use exact details. Show only what you can see. End where the world hands it back. Cut stock phrases. Clothes stay put, small physical friction, no saying a thing twice, fix a slip quietly (ideas from Radiant). |
| The player's character | On | The model never writes your choices, words or thoughts. A Narrative Mode from the bot can change this. |
| Pacing | On | A reply is not a whole scene. Ordinary life first. No rushed days and no invented deadlines. The bot's clock and arcs still fire on time. |
| Written things (letters, notes, texts) | On | New in 1.7: exam papers (a mark out of 100, a stamp), contracts (terms, the price of breaking one, signatures) and seals. A letter, a note, a book page or a phone thread is shown as its own block, in the writer's own voice: their words, their schooling, what they share with you, their state when they wrote it, their own sign-off. |
| Character depth | Medium | The digest for Light (one short paragraph about people). Holds the **Character depth** dial for Custom. |
| Voices and groups | On | People speak briefly and in their own voice. Nobody reads minds. Each person feels from their own state; someone busy answers late; people talk past each other (ideas from Radiant). |
| Minds (from FrankenSIM) | On | How to play each character from the inside. See part 7. |
| Staying who they are (growth and change) | On | People stay themselves. Change is slow and earned. A card is a baseline, not a cage: who they are depends on who they are with. |
| Reading a character card (Creation Kit) | On | How a card built in sections fits together. |
| Comings and goings (the world off screen) | On | People have their own day. Arriving needs a reason, and so does staying. |
| New people (minor characters) | On | A shopkeeper or a guard gets a real person. |
| How Radiant's prompt fits HMS (Max) | Max only | The note that maps Radiant's rules onto an HMS bot. |
| Radiant: Critical Rules, Meta-rules, World and knowledge, People and bodies, OOC and boundaries, Writing Style (Max) | Max only | Radiant's R. Prompt, read as it is from `preset/radiant/`. |
| Radiant: Gore (Max, off by default) | Off | Radiant's gore section. |
| Mature content (adults only) | Off | Adult scenes between adults only. Minors and family bonds always stay non-explicit. |
| Gore | Off | Shows violence without softening it. |
| World info (before) and (after) | On | Your lorebook entries. |
| Memory (Chat Memory and Memory Cortex) | On | Lumiverse's long-term memory. |
| Story summary (Loom Summary) | Off | Lumiverse's own summary. Turn it on only if you use it instead of Chapters. |
| Chat history | On | The chat itself. |
| Card's post-history instructions | On | Anything the card puts after the chat. |
| Minds state (RPG Companion) | On | What the extension remembers about the people. Empty without the extension, with Minds off, and on OOC turns. |
| Gates state (RPG Companion) | On | The phase each gated character is in. |
| Body state (RPG Companion) | On | Your body: lost limbs first, in capitals, then how alive you are, wounds, the hard locks. Empty while you are fine. |
| Statuses (RPG Companion) | On | 1.7: also the contracts in force, so the story keeps their terms. New in 1.6. Who is asleep, out cold, dead, tied up, missing or charmed, and what the party's wounds stop them doing. Empty while everyone is fine. |
| Studying a spell (RPG Companion) | On | New in 1.6. While you study a spell: what the lorebook says about it. Empty otherwise. |
| Radiant: planning pass (Max) | Max only | Radiant's planning pass. |
| Fight craft | Fights only | Loads by itself during fights: on attack words (attacking, blocking, casting a named spell) or a fight on the HUD. |
| Side panel (RPG Companion) | On | The extension's request goes here. Empty without the extension and on OOC turns. |
| Before you write | On | The plan for this Mode, the length, and the dialogue marker reminder. On an OOC turn: answer out of character. |

### Your settings: the sliders icon

| Setting | Choices | Tip |
| --- | --- | --- |
| Mode | Potato, Light, Medium (default), Heavy, Max, Custom | See the table above. Pick the same step as the extension's play style. |
| Thinking | Off, Light, Normal, Deep | Used only when Mode is Custom. |
| Character depth | Light, Standard, Full | Used only when Mode is Custom. **Light** saves about 2,300 tokens. |
| Think out loud | On or off | For models that cannot think by themselves. Also switch on Auto-parse thoughts in Lumiverse, so the plan folds away. |
| Prose length | Brief, Scene-led (default), Long, Very long | The HUD never counts toward the length. |
| Start replies with the HUD header | Auto (default), Always, Never | Auto helps Kimi and DeepSeek, from the first turn. Use Always only if a model keeps skipping the HUD, with thinking off. |

### Using another preset

The extension works with any preset. Without HMS Reporter, it adds its own short messages before your turn (the body, the statuses, Minds), and its hidden-block request at the end. With HMS Reporter, those go in the preset's slots instead, and nothing is sent twice. A preset of your own can carry the same slots: `{{rpgc_request}}`, `{{rpgc_minds}}`, `{{rpgc_gates}}`, `{{rpgc_health}}`, `{{rpgc_status}}`, `{{rpgc_study}}` and `{{rpgc_chronicle}}`. Put each inside `{{if::{{matches::{{rpgc_on}}::^1$}}}} … {{/if}}`, so it is empty without the extension.

### Model tips

- **Small or cheap models:** Potato in both the preset and the extension. Thinking stays off by itself.
- **GLM, DeepSeek, Kimi:** Medium. Turn the model's own reasoning down if replies are slow; the preset's plan is enough.
- **Claude, Gemini, big models:** Heavy, or Max for long campaigns with room for 30,000 more tokens.
- If a model keeps skipping the HUD, set **Start replies with the HUD header** to Always and thinking off.

### OOC messages

Start a message with the bot's OOC trigger, like `[OOC: ...]` or `OOC guide: ...`.
The preset then asks for an answer out of character: no HUD, no story, no hidden block, and no time passes.

---

## 6. The extension's cards

The panel shows one card per thing. A card only shows when it has something to show.
Click a card's title to fold or unfold it.

### New game
Only on a new chat. See part 3.

### World State
The HUD, line by line.

- **Pin** a line (the pin icon) to keep it exactly as it is. If the model drops or changes it, the extension puts it back. The model is also reminded.
- **The guard.** If a line vanishes, you see it with **Restore**. A carrier line (one that keeps lore loaded, like the Arc line) is marked, because losing it hides lore.
- Lines that end by their own rules (a healed injury, a passed exam) show as **cleared**, with a put-back button.
- If a reply has no HUD at all, press **Put the last HUD back**.
- The **Arc line check** warns when the Arc line loads no arc lore, and fixes it in one click.

### The world card
One card per world: **Re:Zero**, **Overlord**, **Classroom of the Elite**, **Mushoku Tensei**, **SCP-4666**, **Harry Potter**, **Undertale**, **Dark Souls** and **Skyrim**.
It shows that world's own stats from the HUD, explained from your lorebooks. Some examples:

- Re:Zero: deaths and the save point. Authorities, Divine Protections, curses, spirit contracts and affinity are in the **Magic** card.
- Overlord: levels and classes, with a check that they add up.
- Classroom of the Elite: the calendar, class standings, Private Points, the exam.
- Mushoku Tensei: sword styles and magic ranks, and the Man-God's advice.
- Harry Potter: the school year and term, your house, the four house-point hourglasses, your wand, your four studies (LV of 7), extra spells and your Patronus.
- SCP-4666: the night of twelve and its phase, the mode, the household (or how many of the team still stand), conditions and the coin.
- Undertale: LV, EXP and NEXT, gold, your SOUL's colour and trait, the route and kills, the SAVE point, AT and DF.
- Dark Souls: level and souls, Estus, humanity or hollowing, your bloodstain, the last bonfire, your covenant and deaths.
- Skyrim: level and the next level, race and standing stone, dragon souls and perks, shouts, skills, bounties, factions, gold and carry weight.

### Map
Where everyone stands in the room. It is off at first: Settings → **Maps** → **Track positions**. (The test zone always draws it.)
A room is drawn once, then only people move. The **map bank** keeps every drawn room for that world, so a place is never paid for twice.

**Whole building.** When two or more rooms of one building are drawn, press **Whole building**. The extension joins the rooms by their doors, floor by floor. It costs no tokens. People not in your room show where their agenda puts them. A room no door leads to yet is drawn with a dashed line. See part 7.

### Atlas
The bot's location book as a map. It shows where you are, the rooms around you, and details for any place: how watched it is, opening hours, who is usually there.
Click a place to go in, **Up** to go out.
If a line in the location book cannot be read, that line is left out and the rest of the map still shows. The card says how many were left out.
The **Re:Zero** test zone has a small Atlas too: the capital, the market square, Roswaal's mansion and its rooms.

### Floor plans
New in 2.8. A plan of the rooms, after the room atlas of **Ryah | Wireless**. It is on the **Map** page. Pick how much in Settings → **Maps** → **How much to keep**:

| Choice | What you see |
| --- | --- |
| **The room you are in** (default) | One room: its size, its doors and ways out, who stands where. |
| **Every room (2D)** | Each floor from above, with the ways between rooms. Press a room to see it. |
| **Every floor, in 3D** | The floors as a cutaway, stairs between them. |
| **Off** | No plan, no tokens. |

- The model reports a room only when you reach one the plan does not know yet. Known rooms cost nothing again.
- A bot that prints its own room atlas (`<state:locations>`) is read as it is. The model is asked nothing.
- A person on the plan who has a status (asleep, out cold, dead) carries its badge. See **Statuses**.
- **Floor** buttons switch floors. The key: entered, seen, you are here, a way between rooms, a way out.

**New in 2.9:**
- **Things in the rooms.** Beds, tables, desks, chairs, shelves, chests, a fireplace, a board, rugs, statues, a throne, lamps, graves, cages, plants, **water**, **pillars**, **windows** on their wall, and **stairs** up or down. They are drawn in all three views: pillars stand up in 3D, water is blue. The room's details list them under **In it**. A room that only says "a bed and a desk" still gets them, set along the walls.
- **Where people stand.** The plan asks again whenever someone comes in or leaves, not only every eighth reply. With the **room map** on (Settings → Maps → Track positions), the plan takes its spots and furniture every reply, for free.
- **Which room and floor.** It reads every part of the HUD's place, and a floor like "(Second Floor)" picks between two rooms of one name. When you move somewhere the plan does not have yet, it says so ("not on the plan yet") instead of keeping you in the old room, and asks the story for it.
- **The lorebook.** When the plan asks for a new room, it sends the lorebook's own words for it, and its size: a size the lorebook gives ("15 x 10 m") wins. For **Every room** and **3D**, it also sends the floors the lorebook names, so rooms land on the right floor and stairs join them.

### You
Your own state: health and other pools, meters, mood, stress and sanity.
Level and experience show only in worlds that have levels.
**HP** shows only in worlds built on hit points: Overlord, Skyrim, Dark Souls, Undertale and D&D games. In the other worlds the **Body & health** card is your health instead. Change this in Settings → Body & health → **HP**.
**Standard issue** lists things the bot assumes you have. **Carried** lists small things you got in the story. You can add or remove them.

### On you
New in 2.8. Your bag, in one card on the **You** page: money first, then weapons, armour, clothes, tools, food and the rest, each in its group.
It reads the HUD's own lines (Inventory, Items, Equipment, Weapons, Pockets, Gold). It costs no tokens. The **Treat** buttons on the Body & health card use the same list.

### Race
Your race, from the `Race:` line on the HUD, explained from the bot's race book.

- **The line.** It reads every form of the race line: `Race: Oni (Demon Race · Demi-Human) — Hornless | Origin: Native`, a tower of floors like `Race: (Human) ▲ Half-Elf Lv 3 ▲ Elf`, and Overlord's `Racial Lvl: Skeleton Mage (15) / Elder Lich (10)`. Each floor shows in a row, the latest one lit.
- **The sketch.** A small body picture drawn from the words in the race's entry: horns, wings, a tail, ears, scales or fur, extra arms, size, bones. New in 2.9: **ram horns** that curl and **antlers**; **insect or fairy wings**, and two or three pairs (a seraph); **fox tails**, up to nine, fanned out (a kitsune); a scorpion's **stinger**; **fins**, **gills**, **antennae**, **tusks** and **six arms**. A part the book says stays hidden (an Oni's horn, a succubus's wings) is drawn **dashed**, with "hidden until shown". A race much taller or shorter than a human gets a dashed human outline beside it, for scale. It is a sketch, not the canon look.
- **The book.** The race's entry opens below: lifespan, build, what marks the race, the resting state, the signature tell, **In play**, laws like the Oni's **Horn Law**, and how each nation sees them.
- **Bodies not built like a person.** The sketch knows the body plan: a **dragon** (four legs, wings, a long neck and tail), a **beast** on four legs, a **serpent** (with all its heads), a **naga** (a person above, a serpent below), a **centaur**, an **insect**, a **slime** and a **spirit**. A big one gets a small human beside it, for scale: a True Dragon is so big a human barely reaches its knee. A dragon the book calls flightless (an Earth Dragon) has no wings.
- The body plan also changes the **Body & health** card: four legs, a wing to break, no bones, no blood.
- **Your shape now** (new in 2.7). The sketch shows the body you are in **now**, not just what the race can be.
  - **Form.** A dragon in human form is drawn as a person, with its horns, wings and tail out (2.8). A slime that took a person's shape is a person made of jelly. Press **Own form** or **Human form**, or type another one (a wolf, mist) and press **Set**.
  - **Hidden parts.** Each part the race can hide has its own row: **Hidden** or **Out**. An Oni's horn out is drawn solid. A broken horn says **broken**.
  - **Who decides.** The HUD wins when it says it (`Race: True Dragon (Human Form)`, `Form: Wolf`, `— Horn Manifested`, `— Hornless`). Then what you set here. Then the story's own small note. What you set holds until the story changes it. **Undo what I set** takes your picks back.
  - The **Body & health** card follows the shape: a dragon in human form stands on two legs and has hands. Wings that are tucked away cannot be hurt.
- **Dragons in human form** (new in 2.8). A dragon in human form keeps its **horns**, **wings** and **tail**, even when its race entry names only some of them. They stay **out** in human form, drawn on the sketch and on the body chart. Each has its own **Hidden** or **Out** row, to tuck one away.
- **Evolution** (new in 2.7). When the race on the HUD changes (Goblin to Hobgoblin, a new floor on the tower), the card says **Evolved this reply** and keeps the list with the day and time. A form is not an evolution. Return by Death undoes one on the loop it undoes.
- **Size in the book.** If the race's entry gives a size ("roughly one meter long"), the card shows it.
- The **slime** is now a round, shiny dome with a core.
- In the test zone, **Try a race** shows Human, Oni, Succubus, Elf, Wolf-Human, Dwarf, Dragonkin, Elder Lich, and from 2.6 True Dragon, Flying Dragon, Earth Dragon, Wolgarm, Black Serpent, Serpent-Human, Slime and Spirit. Trying another race starts in its own form.

### D&D
A character sheet and a dice roller. Your roll goes into your next message.
From 2.8 it is **off** unless you pick the **D&D** play style, or switch it on in Settings → Modules.
**No cap on stats** (Settings → D&D) lets a god or a dragon go past 30, up to 999.

### People
Everyone you have met. Each person shows:

- **Standing**: how close they feel to you, from Nemesis to Devoted. It is never romance.
- **Bond**: what kind of relationship it is: classmate, mentor, family, partner.
- **The 🧠 line**: what they feel right now and at whom, how warm they show themselves, and their three strongest feelings toward you. A ⚠️ means a wall, a ⚖️ means you owe them.
- **📍** what they are doing and until when.
- **The 🗝️ line**: the phase they are in on their own card, and which gate is open next. See **Gates** below.
- **Not in this scene.** A living-world bot also reports what people far away feel and do. They are not shown as standing next to you. Someone you have never dealt with folds away under **Elsewhere** at the bottom. Someone you know keeps their card, marked **not in this scene**, with where they are.
- **Inside, feelings and what they know**: open it for the rest. See part 7.
- **In the scene**: how they look and act now, and their thoughts.

The classic bars (Affection, Trust and the rest) come back if you set Settings → Minds → **Feelings toward you** to Classic bars.

Use **Set the bond** if the story reads a relationship wrong.
Minors are protected: never a romantic bond, never any desire.
Party members show how they are holding up. Add them with **Add to party**.

### Statuses
New in 2.8. Who is not as usual. A person can carry a badge on their card in **People**:

- **Body**: 😴 Asleep, 😵 Knocked out, 💫 Stunned, 🗿 Paralysed (or turned to stone), 🏥 Coma, 🩸 Bleeding out, 💀 Dead, 🩹 Crippled, 🤕 Injured, 🙈 Blinded, 🙉 Deafened, 🤐 Silenced, 🔥 On fire, 🥶 Freezing, 😮‍💨 Exhausted, 🍽️ Starving.
- **Where they are**: 🪢 Tied up, ⛓️ Prisoner, 🔒 Sealed away, 🏠 Confined, 🚫 Expelled, ❓ Missing, 📵 Unreachable, 🫥 Hiding, 🧳 Away, 🎯 Hunted, 🎭 In disguise.
- **Mind and magic**: 🤢 Sick, ☠️ Poisoned, 🌑 Cursed, 🍺 Drunk, 💊 Drugged, 📜 Under contract, 😱 Panicked, 😨 Frightened, 😠 Furious, 🖤 Grieving, 🌧️ Withdrawn, 🤯 Berserk, 🌀 Controlled, 💗 Charmed, 🌫️ Name eaten, 🌫️ Memory gone, ✨ Blessed, 👻 Invisible, 🐉 Transformed.

The ones marked new in 2.9: Stunned, Paralysed, Injured, Blinded, Deafened, Silenced, On fire, Freezing, Exhausted, Starving, Sealed away, Confined, Away, Hunted, Under contract, Frightened, Furious, Grieving, Withdrawn, Blessed, Invisible. "Bound by a pact" is a contract, not Tied up.

What a status changes:

- **Asleep or knocked out**: they see and hear nothing, and learn nothing, until they wake. It ends by itself when its time runs out.
- **Dead**: they learn nothing, and their plans stop.
- **Tied up, prisoner, missing, sealed away, confined, paralysed**: they cannot act or move freely, and their plans wait.
- **Stunned, on fire**: they cannot act this moment.
- **Memory gone**: what they knew, and how they felt about everyone, is wiped in Minds. They start fresh.
- **Name eaten**: everyone else forgets them: the others' feelings toward them, and what the others knew about them.
- The story is told, one line per person, before each reply. **Nothing is sent while everyone is fine.**
- **Change** under **Status of …** sets one by hand, if the story got it wrong.

**💀 Deceased.** The dead fold away at the bottom of People. Each card says how they died, from the story: "Dead: beheaded; found at the gate in the snow." If the story never said, it reads "Dead. The story has not said how."

Settings → **Characters** → **Statuses** has the switches.

### Off screen: people with lives of their own
New in 2.9. Press the **☆** on a person's card in **People** to star them. Starred people live their own lives out of your sight: work, training, errands, friends, plans, rest. They do not wait around for you.

- The **Off screen** card on the People page shows each one: where they are, what they are doing, until when, what they mean to do next, and where they were before.
- When what they were doing is over, or nothing was said about them for six replies, the story is asked what they do next. The story is told about them first, marked ★.
- Up to 12 people. Press the ★ again to stop.

### History
New in 2.9. Each person's card has a **📜 History** fold:

- What passed between you: when you met, how their standing and bond changed and why, the key moments, your own notes.
- Their **milestones** 🏁: turning points in their own life, seen or not (a promotion, an oath, a loss, a new rank, joining a group). The story reports them, and they go into the Chronicle and Memory too.
- **Between them**: how the people of the story feel about each other, and what moved it ("Ram → Rem: belonging +1 — Rem covered for her").
- The story is told a short history of the people in the scene, so it remembers what you have been through together.
- Settings → Chronicle → **… and milestones in other people's lives** switches milestones off.

### Party bodies
New in 2.8. Your party members get a body chart, like yours. Open their card in **People** → **🩺 Body**.

- Their wounds and **lost limbs**, drawn on the chart. A lost limb is not drawn: you see it is gone.
- **Male or female** chart, from what the story says. Press **♂ Male chart** or **♀ Female chart** to switch. In 2.9 the female chart's organs sit inside her narrower waist.
- **How they died.** A dead person's chart shows the cause. Beheaded: the head is missing from the chart.
- The model reports their wounds only when they change.
- Switch it off in Settings → **Characters** → **Their bodies**.

### Characters: the card and the story
Everything the extension keeps about a person shows on their card in **People**.

- **📇 Has a card**: this person has a character card in the lorebook. You see its first facts, like age and role. The card is who they are.
- **🪪 Profile**: this person has no card. The story wrote a short profile once: looks, voice, manner. The extension keeps it, so a shopkeeper stays the same shopkeeper. Their secret is a spoiler you open yourself.
- **✎** changes one field. **Forget and ask again** drops the profile, and the story writes a new one.

**Settings → Characters** has one choice for how much is tracked:

| Level | What you get |
| --- | --- |
| **None** (2.9) | Nothing about the people is kept or asked for. No tokens. |
| **Light** | Who is here, how they stand with you, and the phase on their card. The fewest tokens. |
| **Standard** | Adds their thoughts, their feelings toward you, what they are doing, and profiles. |
| **Full** | Adds feelings between the others, who knows what, and your party's masks and needs. |
| **Custom** (2.9) | Your own mix. Changing any switch picks Custom by itself. |

You can also set each switch yourself. The preset has its own dial for how characters are *written*: **Character depth**.

### Gates
For characters made with the **Character Creation Kit**. Such a card can hold one **gated progression block**, like `[THE THAW] — gated progression`. It is a road of phases. Each phase waits behind a **trigger**: one event that has to happen in the story.

The extension keeps the place on that road, so the story does not forget it or jump ahead.

1. It reads the block from the character's own lorebook entry: the phases, their triggers, and what each one needs first.
2. The model reports a gate only when its trigger **happened in the reply**. Most replies report nothing.
3. The extension checks the report against the card's own order, then keeps the new phase.
4. Before the next reply, it tells the model where each person stands. Only people in the scene get a full line.

On a person's card you see:

- **Phase 2 · The Debt**: the phase they are in now.
- **🔓**: a gate that is open. Its trigger can fire next.
- **The steps**: one circle per phase. Green is lived. Filled is now. Dashed is open. Grey is locked.
- **The road on this card**: open it for every phase, its trigger in the card's words, and what moved.

Sometimes a report does not fit the card. A phase was skipped, two gates fired in one reply, the other side of a fork already fired, or someone fell back several phases at once. Then nothing moves. The card shows a yellow box with **Accept** and **Dismiss**. You decide.

- **Set it yourself**: pick a phase and press **Set** if the tracker is wrong. **Undo mine** takes your changes back.
- **Other gated cards**: people you have not met yet wait here, all in Phase 0.
- A swipe, an edit or a **Return by Death** is followed: a gate fired in an undone loop is forgotten.
- The story is also told what is **not true yet**: anything the card tags to a later phase, like `[Phase 5]`.

The card stays in charge. The extension adds no phase and no rule. It works with V7.0 and V8.0 cards. A V8.0 card's **PHASE MAP** line is read too: forks, optional phases and second roads.

Settings → **Gates (card progression)** has the switches. **Always ask me first** makes every reported gate wait for your yes.

HMS Reporter has a **Gates state** slot for this, and a block called **Staying who they are** that tells the story how a gated card works.

### Phone
Your device, your money, your contacts, your messages and notices.
Send a text, call or transfer. It goes into the story as your turn, and the bot decides whether it reaches anyone.

### Letters and notes
Everything written that you read in the story: letters, notes, pages of a book, phone threads, signs and files. Newest first. Press one to read it again.
In the chat they look like the real thing: a letter on old paper with a seal, a yellow note, a book page, a phone thread, a wooden sign, a typed file.
From HMS Reporter 1.6, each one is written in the writer's own voice: their words and schooling, what they share with you, the state they wrote it in, and their own sign-off.
HMS Reporter 1.4 and later asks the model for them. With another preset, switch on **Ask the model for them** (Settings → Chat display → Letters, notes and books).

**New in 2.9:**
- **Seals.** A letter, book, document or contract can carry its writer's seal: the wax colour and an emblem pressed into it (a mask, a crown, a dragon, a key, a snowflake…). A writer keeps the same seal every time. Under a letter, **…'s seal** lets you pick the wax and the emblem yourself; **No seal** goes back to the story's.
- **Exam papers.** A marked paper with its subject, the student, a red circled mark out of 100, ✓ and ✗ by the answers, the examiner's red remarks, and a stamp: **Approved**, **Passed** or **Failed** (from the pass mark). A **Grades** list shows every mark and the average.
- **Contracts.** Who is bound, the numbered terms, what happens if it is broken, the signatures and seals (Beatrice's contract with the library, Puck's with Emilia). The **Contracts** list shows which are in force. Contracts in force are told to the story with the statuses, so it keeps their terms. **Mark this contract as ended** stops that; **It still binds** undoes it. Switch the reminder off in Settings → Chat display → **Remind the story of contracts in force**.

### Body
Wounds and conditions from the HUD, with how long each has lasted.
When **Body & health** is on, that card shows them instead.

### Body & health
New in 2.6. A body, not a health bar. It is on the **You** page.
It is made from how these games do it: Escape from Tarkov, Gray Zone Warfare, Project Zomboid, Barotrauma, Kenshi and RimWorld.

- **Two ways.** Where the bot keeps wounds on its own HUD (Re:Zero, Mushoku Tensei), the card only **reads** them. It adds no wound and runs no clock. Where the bot keeps none (Classroom of the Elite, Harry Potter, SCP, classic chats), the extension **keeps** the body from the story.
- **The body map.** An X-ray of your body. Each part is coloured by how hurt it is: red is raw, bright red is bleeding, blue is splinted, green is tended, orange is infected. A lock mark shows a part that stops you. Press a part to see only its wounds.
- **What you can do.** Six bars, like RimWorld: Consciousness, Moving, Manipulation (hands), Breathing, Sight and Hearing. Hover a bar to see why it is low.
- **Locks.** Things your body **cannot** do. Two broken legs: no standing, walking, running or jumping. A splinted leg: you limp, and you cannot run or jump. A broken hand cannot grip a sword. A hurt wing cannot fly. These come from **structure**, not pain. No painkiller, adrenaline, willpower or power lifts them. The story is told so.
- **Pain** is different. A painkiller or adrenaline **masks** it: the card shows **Pain (masked)**. Pushing on a masked cut or sprain makes it worse. After adrenaline comes a crash.
- **Wounds have a life.** Raw, then tended. A wound that bled hard is **fresh** for half an hour: a sprint or a hit tears it open, and it bleeds again. A dressing goes **dirty** after a day (half a day while bleeding or running hard). A dirty one can get **infected**. Change it to stop that. A tourniquet stops bleeding, but left on two hours the limb starts to die.
- **The meters.** Blood, pain, water, food, hours awake, **sanity**, stress, and stamina for legs and arms. Which ones show depends on **How much it tracks**.
- **Sanity** (new in 2.7). From 100 (sane) to 0 (insane), with a word: **Sane**, **Shaken**, **Fraying**, **Breaking**, **Insane**. It comes from the sanity the story already reports with your own state, a `Sanity:` line on the HUD, or HUD conditions like Despair, Trauma or Madness. Low sanity is told to the story: things at the edge of sight, voices, not knowing what is real.
- **Organs** (new in 2.7). Brain, eyes, ears, heart, lungs, liver, stomach, spleen, kidneys and guts, drawn on the X-ray. A hurt one shows as a chip and lights up on the map.
  - One eye lost: you still see, without depth. Both: **Blind**, a lock. A punctured lung lowers Breathing. A hurt heart is a lock on hard effort. A torn stomach keeps no food down.
  - **The race's own organs** come first: a **Gate** (Re:Zero), the **horns** (an Oni), a **core** or heart stone (a slime, a dragon), a third eye. A broken Gate: you cannot cast through it. A broken horn: you cannot draw power through it. A cracked core: one more blow may end you.
  - Undead have no soft organs. A slime has only its core. A spirit has no flesh.
  - **Lost for good** lists limbs that are gone.
- **Your measurements** (new in 2.7). Height, weight, bust, waist and hips. Press **Edit** and type them: `175`, `1.75 m`, `5 ft 9`, `62 kg` or `154 lb` all work. A `Height:`, `Weight:` or `Measurements:` line on the HUD wins. Pick cm and kg or feet and pounds in Settings. The story is only told them if you turn on **Tell the story your measurements**.
  - Bust, waist and hips are **not kept for a character under 18** (an `Age:` line under 18, a Hogwarts student, a Classroom of the Elite student).
- **Your race counts.** Undead do not bleed, tire, eat or feel pain, but their bones still break. A slime has no bones. A spirit does not bleed. A dragon or a beast stands on four legs: one broken leg leaves a hobble on three, and its hands are **Jaws and claws**.
- **Treat with what you carry.** Bandages, a splint, a tourniquet, painkillers, water or food from your Carried list or the HUD's inventory. Press a body part first, then a button. It goes into your next message as what you did. The story decides how well it goes. **Undo the last** takes it back.
- **Swipes and Return by Death.** The body follows the reply you keep. A loop undone by Return by Death takes its wounds with it.
- **What the model is told.** Before each reply, a few lines: what you can still do, the locks, what hurts. **Nothing at all while you are fine.** HMS Reporter 1.5 has a **Body state** slot for it. With another preset it goes in as its own message.
- **Vitality** (new in 2.8). How alive you are, in one word: **Hurt**, **Badly hurt**, **Critical**, **Dying**. Bleeding hard, it also shows how long until death without help (⏱). The story is told only when it is **Badly hurt** or worse.
- **Lost limbs first** (new in 2.8). A lost arm, leg, hand or eye shows in a red box at the top of the card, and is not drawn on the chart. The story gets it first too, in capitals, so it never forgets.
- **Arteries** (new in 2.8). The main arteries are drawn on the chart: neck, shoulders, arms, thighs and knees. An opened one is red and pulses, and the death clock runs. A tourniquet stops a limb's artery, never one in the neck, chest or groin.
- **Female chart** (new in 2.8). The chart is male or female, from the HUD's `Gender:` or `Sex:` line. Press **♂ Male chart** or **♀ Female chart** to switch, or pick it in Settings → Body & health → **Body chart**.
- **Cold and heat** (new in 2.8). From the HUD's `Weather:` line and where you are. Out in the cold and wet you shiver, then get hypothermia, then frostbite. Heat doubles thirst, then heatstroke. Indoors takes the edge off. A 🌡 chip shows what it feels like. The dead, spirits, and fire or ice races keep to their own side.
- **Sickness, poison and withdrawal** (new in 2.8). A cold or fever (a cough gives away where you hide), food poisoning, venom that slowly takes breath, and the crash after painkillers taken most days.
- **Prosthetics** (new in 2.8). On a lost limb, pick what replaces it: a peg leg, a hook, a metal limb, a magic limb, a glass eye. It gives back part of what the limb did. A broken one says **broken**.
- **Treated and Healed** (new in 2.8). If the card keeps a wound you already fixed, press **Treated** or **Healed** on it. The story is told on the next reply. **Undo the last** takes it back.
- **Broken bones** (new in 2.9). A broken bone shows on the chart as a crack across the bone: white while it is not set, with two wooden splints once it is splinted, yellow while it mends, grey with a bend if it healed crooked. If you lose a limb, the bones of the rest still show.
- **Dragons** (new in 2.8). A dragon's chart has wings, horns and a tail. The tail is drawn new: it curves out behind the hips.
- **Time skips.** A skip of three hours or more counts as eating and drinking along the way.
- **How much it tracks** (Settings → Body & health):
  - **None** (2.9): the wounds only, no locks and no meters.
  - **Light**: wounds and the locks only.
  - **Medium** (default): adds blood, **water and food**, dressings and infection, painkillers, sleep, **sanity**, **cold and heat**, and **sickness**.
  - **Heavy**: adds arm and leg stamina, next-day muscle strain, and stress.
  - **Custom** (2.9): you set each part. Changing one part picks Custom by itself, and keeps the rest as they were.
- Each world's preset sets its own: Re:Zero, Classroom of the Elite, Mushoku Tensei and Harry Potter **Medium**; SCP-4666 **Heavy**; Overlord, Undertale, Dark Souls and Skyrim **Light** (they keep their HP).

### Injuries
Only for bots that keep no wounds on their HUD (Classroom of the Elite, Overlord).
Each injury is raw until tended. Treated is not healed. The card shows healing time and warnings.
With Body & health on, the model also says how hard each wound bleeds, and the Body & health card shows what the wounds mean for your body.

### Mind
Mind conditions, like Dread, and the Mental Council.

### Survival
Off at first. Tracks time since you slept, ate and drank, from the HUD clock. The bot decides what it means.

### Magic
Magic pools, traditions, cooldowns, and a spellbook that learns your spells.

**The spell list** shows every spell your bot's lorebook describes, by school, with its rank, what it does and its chant.

- **✓ Known**: the story showed you cast or learn it, or you marked it.
- **Within reach**: your rank allows it.
- **Next rank**: one rank above you.
- **🔒 Locked**: further up, or a school or element you do not have.
- **✦ Special**: unique, forbidden or lost. Rank does not open these.

The HUD decides. In Mushoku Tensei it reads `Magic School: Water: Saint, …`. In Re:Zero it reads `Magic: Fire | Gate: C-Rank`: your elements, and the Gate as the cap. In Overlord it reads `System: Arcane (Evocation) LV 7`: your tradition, and the tier you can cast up to (LV 11 is Super-Tier). A melded spell needs its parts. `Casting Method: Voiceless` marks chants as optional.

**Spirits (Re:Zero).** The Magic card also shows your **spirit affinity** and what it allows, and every **contract** from the HUD: the spirit, its element, its rank on the ladder (Lesser, Quasi, Spirit, Great), and the spirit arts it opens. A group code like `LIVING-GATE` or `SEVEN-STARS` opens into its spirits. A contract's own clauses from the lorebook show only for the one who made it. **Spirits you may meet** lists the ones you have not contracted yet.

- A **spirit art** needs a contract: with that spirit when the art names one, or with a spirit of its element when it does not.

**Powers.** The Magic card also lists every power the HUD prints, with the lorebook entry its line loads. It reads the power families of *How to Build a Magic System V2.5*:

- **Gifts**: `[DIVINE PROTECTION: Soul of Language · The Sword Saint]` (also `[BLESSING: …]`).
- **Staged powers**: `[AUTHORITY: The Unseen Hand - Dormant]` or `[AUTHORITY: Return by Death] (Awakened)`, with the state.
- **Afflictions**: a curse on the `Condition:` line, like `Wolgarm Curse (Dormant)`.
- **Meters** with a named stage: `Corruption: 34% | Stage 2: Guiding Hand`.
- **Grades** with a `[ROW]` entry: `Gate: D-Rank` (what it allows, what strains, what is impossible).
- **Pleas**: `Plea: The Old River — open`.

Press a power to open its entry, field by field: what it does, the trigger, the limit, the price, what cancels it, who holds it. **The rules behind them** shows each family's core entry (the one keyed on the line's label, like `[AUTHORITY:`).
A **Veiled** power shows only **what is seen**, never its true name, its rule or its reveal. A **Soft** power shows only its nature, its price and its signs. This costs nothing: it reads the lorebook the chat already loads.

- **Usable and next / All**: choose what the list shows. **Find a spell** searches as you type.
- **Study**: press it on a spell. The story gets a short reminder with the lorebook's effect and chant, and the rule that learning takes practice and rank. The card shows how the practice goes. The first clean cast makes it Known and writes "Learned a spell" in the Chronicle.
- **✓ and ✕**: mark a spell known or not known by hand.
- A rank-up on the HUD shows which spells it opened. Fights are given the spells you know.

The world's own rules still decide what you can learn. The list only reads the lorebook and the HUD.

### The look
- **The wide window**: pick **Wide window** under Where the panel lives (top bar). The panel opens big, over the chat, with a menu on the left: **World**, **People**, **You**, **Map**, **Magic & Skills**, **Story**, **Letters**, then Guide, Test zone and Settings. Each page shows its cards in two columns. Close it with ×, **Esc**, or by clicking outside it. The round button in the corner brings it back. The **⇥** button beside × puts the panel back in the drawer (the normal view), from any page.
- **The day dial** at the top shows the time, the day or date, and how long the last reply took in the story. The HUD card in the chat has a small one too, before the time.
- **The clock face** is different in every world. Classroom of the Elite: a classroom **wall clock** with an hour hand and a minute hand. Re:Zero: a **time crystal** that glows a new colour through the day. Mushoku Tensei: a stone **sundial**. Overlord: the **YGGDRASIL ring**. Harry Potter: an **astrolabe**. SCP-4666: a **digital** clock. Skyrim: a carved **rune stone** with the northern lights at night. Dark Souls: a **bonfire** that burns low at night. Undertale: a **pixel box** with your SOUL on the hour. Any other bot: a round 24-hour dial. Pick one yourself: Settings → Look → **Clock face**.
- **The weather report** sits next to the clock: an icon, the word, and the temperature in **°C**. It reads a `Weather:` or `Temperature:` line on the HUD. A temperature in °F is turned into °C. With **Sky above the clock** set to **Time, weather and season**, the model is also asked for the temperature.
- **The weather in detail**: press the weather report. It opens: the temperature in °C and °F, what it feels like, the wind, rain or snow, what comes later, what it does to the scene, and what changed since the last reply. Then **the day**: sunrise, sunset and hours of daylight for the world's own latitude (polar night and midnight sun in the far north), how long until the next sunset or sunrise, the moon's phase and the weekday when the date has a year, and the season. Feels like, wind, later and the scene need **Sky → Time, weather and season** and **More weather detail** (on at first).
- **Page shortcuts**: in the drawer, the floating window and the own window, a row of buttons at the top (World, People, You, Map, Magic, Story, Letters) jumps to that page's cards. Switch it off in Settings → Look.
- **The sky above the clock**: a small window with the sky of the hour (dawn, day, dusk, night with stars). Set **Sky above the clock** to **Time, weather and season** and it also shows rain, snow, fog or storm, and the season on the ground: a winter night with snow on white hills. That asks the model for the weather (a few words). **Off** hides it.
- **Themes**: each bot has its own, and there are four looks for any bot: **Lantern**, **Tidepool**, **Dusk** and **Paper**. The **SCP Foundation** theme looks like a typed report. **Harry Potter (Hogwarts)** is gold on dark parchment, with wax-seal pictures.
- The cards under each reply can wear the same looks: Settings → Chat display → **Card colours**. A look has a shape too: the SCP report is square, Tidepool is round.
- Under a reply, each person has a card and their thought sits in a **thought cloud**. In **Minds**, each feeling that moved is a small pill with its name: green is good news, red is bad news.
- **Easy reading** also changes the cards in the chat: more space, no slanted type.
- **Perch** is the mascot: a small fish in a top hat. He has left the top bar. He opens the guide, and he is the round button that brings the wide window back.
- **Move Perch**: drag the round button anywhere on the screen. He stays there, even after a reload or a smaller window. The arrow keys move him too (Shift for big steps). Settings → Look → **The round button on the screen**: **Wide window only**, or **Always** (then he also opens the drawer, the floating window or the own window). **Put it back in the corner** resets him. Pick **Never** to hide him: then open the panel from its drawer tab (new in 2.8).
- **On a phone** (new in 2.8): the wide window fills the screen, its menu shows icons only, and every page and Settings stack in one column.

### Skills & traits
Your skills, traits and attributes, read from the HUD. It is on the **Magic & Skills** page (2.8).
- **Skills** are learned: they level up or evolve.
- **Traits** you are born with: always on.
- **Other**: titles, contracts, items and roles.

### Quests
- **The plot**: where the story stands, and its open threads.
- **🔫 Planted details** (Chekhov's gun): small things the story planted that should pay off later. **Ripe** ones are free to pay off. A 🔒 one waits for a time, a person or a condition. Press ✕ to drop one that does not fit.
- **Objectives**: what you are trying to do now. You can add your own. Yours are never sent to the model.
- **Quests** from the HUD, with the goal, who gave it, where, the reward, and the time left.
- **Your notes** are never sent to the model.
- If a quest drops off the HUD while still live, press **Put back**.

### Chronicle
The story's timeline: key moments, milestones, how people came to feel about you, and plot points.
Filter it, star an entry, hide one, or add your own.
Settled replies are written to the Memory Cortex. See part 9.

### Picture prompt
New in 2.8. On the **Story** page. It writes a picture prompt from the HUD (place, time, weather) and the people in the scene. Pick **Full scene**, **One character** or **Action**, the shape, and the image tool (**Krea 2**, **Nano Banana**, **Qwen Image**). Press **Copy** and paste it into any image tool. It costs no tokens.

### Chapters
Summaries of parts of the story. Press **End chapter and summarise** when a part ends.
Summaries go with every message, on top of the chat.

### OOC guide
Ask the bot's guide a question. See part 8.

### Critical
A red banner for real danger: health near zero, a condition at its worst, a wound left raw too long.

### The fight tracker
During an immersive fight: everyone's HP, MP and Stamina, effects, what each fighter just did, and a fight log.
**Side by side** (new in 2.8) puts you next to up to three enemies: each pool, with the best in each row lit. Your stats show; theirs show **?** until you **Study** them.

### Fights

| Kind | How it works |
| --- | --- |
| **Immersive fight** | No window. You fight by writing in the chat. The panel tracks bodies, effects and moves. Enemies keep hidden plans. **Study** an enemy to learn its weak points. The bot's rules decide who wins. |
| **Turn-based fight** | A D&D window: initiative, attack rolls, damage dice, saving throws. The extension rolls the dice. When it ends, the aftermath is posted to the chat as a normal reply, with the HUD. |
| **Narrative window** | The old fight window. Hidden unless you switch it on in Settings → Fights → Legacy. |

### In the chat itself

- **The HUD card.** The HUD drawn as a neat card in the bot's colours. The saved reply keeps its plain text. **Show the HUD as text** opens the plain version.
- **Internal states** under each reply: tabs for Scene, People, Minds, Bonds, Plot and Map. **Minds** shows what moved inside each person in that reply.
- **Dialogue display** (off at first): an emoji for each speaker's feeling, a colour per speaker, or their name. **Tone of voice** draws a whispered line in italics, a biting one in bold.
- **Let the model add its own emoji** (off at first): the model writes the emoji itself, any emoji, as many as it likes. This turns off the drawn ones.
- **HUD style**: **Rows** (the whole card) or **Pills** (each line a small pill; press a long one to open it).
- **Letters, notes and books** drawn as the real thing, right where they are in the reply.

### Test zone
A practice chat inside the extension. It runs the same code as a real chat and touches none of your chats.
**Demo** plays scripted turns for each world and costs nothing. **Live** uses your model.

- **Worlds**: Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim, and a classic chat with no HUD.
- **The demo shows the new things**: the weather and °C on the clock, a letter, a note, a sign or a notice in the Letters card, and in Re:Zero a spirit contract. Re:Zero, Overlord and Mushoku Tensei come with a small demo lorebook, so the Magic card has a spell list. Your own lorebooks are not read here.
- **2.5 in the demo**: Re:Zero shows **Powers** in the Magic card (Return by Death, Soul of Language, a Veiled condition, the Wolgarm Curse, the Gate row) and the **Race** card with **Try a race**. Classroom of the Elite has a slice of the CotE location book, so the **Atlas** and the **room map** show in the Delta classroom, and **Honami's gate** fires (The Fallen, Phase 1). Harry Potter has **Draconia Malfoy** at eleven: the Thaw, phases 0 to 3 only, and its first gate at the Owlery.
- **2.6 in the demo**: Classroom of the Elite has two new turns. Turn 4: you fall on the stairs (a broken shin, a deep cut that bleeds hard, a stubbed toe). Turn 5: the infirmary (a splint, a bandage, two pills). Open the **You** page to see the **Body & health** card. In Re:Zero the card reads the HUD's own wounds. **Try a race** has dragons, serpents, a slime and a spirit, and the Body card follows the race you try.
- **2.7 in the demo**: in Re:Zero, open **You → Race**. Try **Oni** and press **Out** on the horns. Try **True Dragon** and press **Human form**: the Body card stands up on two legs. Try **Slime** for the new look and its core. In Classroom of the Elite, turn 4 shows **Sanity 72% · Shaken**.
- **2.9 in the demo**: in Re:Zero, the Forbidden Library on the **Map** has its shelves, rug, table, ladder and lamp; the Great Hall has pillars and windows (try **3D**). In **Letters**: Roswaal's note with his violet seal, and two contracts (Beatrice's and Puck's). In **People**, star Rem and open her **History**. In Classroom of the Elite, **Letters** has a marked midterm paper, and the **You** page shows the broken shin as a crack, then splinted.
- **2.8 in the demo**: in Re:Zero, open **Map → Floor plan** in Roswaal's mansion (the library and the upstairs hall) and try **Floor plan** and **3D**. Beatrice's card in **People** shows her **Body**. In SCP-4666, the last turn has the cold, an opened artery with its clock, the **female chart**, and three **Statuses**: Mari asleep, Lars missing, Henrik dead (beheaded). Open **People → 💀 Deceased** to see his chart. Undertale has a **RESET**: the whole run starts over. Skyrim has a vampire turn: the Race card lists it as an evolution.
- **In the wide window** the test zone has the same page menu as a real chat. Each page has a strip at the top with **Next turn** and **Back to the test zone**.
- **In the other windows** the page shortcuts sit under the controls.

---

## 7. Minds (from FrankenSIM)

**Minds** is how the people of the story feel, think and act. It comes from **FrankenSIM 4 Mini by Wireless (Ryah)**, with permission. **TFDY** (Tenderness, Fury, Dread, Yearning) is by **Pyropia**. Thank you both.

### How it works

1. The model writes the story as usual.
2. In the hidden block, it says only **what moved** inside each person in this reply, and why.
3. The extension does the math: it keeps every number, caps each step, lets old feelings fade, and remembers.
4. Before the next reply, it hands the state back to the model as memory.

The bot still wins. Its character cards say who someone is. Minds only remembers what the story showed.

### Inside a person

| Part | What it means |
| --- | --- |
| **Feeling** | What they feel now, named by where it leads (Parrott's list: love, joy, surprise, anger, sadness, fear), and at whom. |
| **TFDY** | Their mood under everything: 💗 Tenderness, 🔥 Fury, 😰 Dread, 🌙 Yearning, from 0 to 4. Each rests at a level set by their temperament. |
| **Shows** | How warm they act on the outside: ❄️ frostbound, cool, temperate, warm, 🔥 fervent. It can differ from what they feel. |
| **Mask** | The face they wear: held, cracking or off. |
| **Sides of them** | Five to seven sides from their card. One leads at a time. If the same one leads three replies running, the panel says so. |
| **Still carrying** | A strong feeling from the last few replies that has not gone away. |

### Toward you (and toward each other)

Twelve feelings, each from 1 to 20:

| Warm | Its mirror |
| --- | --- |
| 🌶️ Desire | 😠 Hate |
| 🎲 Play | 🥊 Strife |
| 🤝 Friendship | ❄️ Enmity |
| 🛠️ Partnership | 🪨 Stuck |
| 🏠 Belonging | 🌫️ Indifference |
| 🕊️ Care | 🐍 Envy |

- **A wall** (⚠️): a feeling and its mirror are both high (10 or more), like desire and hate. It comes out sideways.
- **Gate** 🚪: how far they let themselves feel: dormant, attentive, aware, longing, open. It moves one step at a time, and only for an event.
- **Shows it / Says it**: whether the feeling comes out in what they do and in what they say.
- **Filters**: what holds the feeling back (social, values, fit, ties). Each can crack open step by step. Open never closes again.
- **Owed** ⚖️: a wrong done to them. It stays until it is made good.
- **Mode**: stranger, warm, strained, hostile, lovers and more.

### The math the extension does

| Rule | What it means for you |
| --- | --- |
| **Most a feeling moves in one reply: 2** | One scene cannot flip a person. |
| **Fading: one step every 3 quiet replies** | A feeling nothing feeds goes back toward where it rests. Big feelings fade a little faster. |
| **Settling** | A feeling pushed the same way three times becomes part of who they are to you. |
| **Never 0** | Nobody feels nothing. A first meeting starts at 3 or more. |
| **Minors and family** | Never desire, never a romantic mode, whatever the model says. |
| **Return by Death** | When time goes back, everyone forgets the undone loop: its feelings, what they learned there, and their plans. Planted details stay, because you saw them. |

You can change the step size and the fading speed in Settings → **Minds**.

### Agendas, knowledge and planted details

- **Agendas** 📍: what each person is doing, where, and until when, here or elsewhere. When the time passes, the panel says **over by**. Nobody jumps between places.
- **Who knows what**: each fact a person learned, and how: 👁️ saw it, 👂 overheard, 🗣️ told by someone, 🔎 evidence, ✉️ message, 🌐 common knowledge, 💬 gossip, 🤔 guessed. A **false belief** is underlined in red. Press ✕ if someone should not know a thing.
- **Planted details** 🔫 (Chekhov's gun): in the Quests card. The story decides when one pays off. Up to 20 are kept. Old light ones fade away.
- **Building maps**: in the Map card, from the rooms the story drew.

### Switch parts on and off

Settings → **Modules** → **Minds (from FrankenSIM)** has five switches: Minds and feelings, Agendas, Who knows what, Chekhov's gun, Building maps. Settings → **Minds** has the details. **Undo my corrections** brings back facts and details you took out.

**Cost:** with everything on, about 1,000 tokens of instructions and 300 to 600 tokens of state per reply, plus what the model writes in its hidden block.

---

## 8. Ask out of character (OOC)

Each bot has a guide character who answers questions about the world, the rules and the commands.

| Bot | Guide | Trigger |
| --- | --- | --- |
| Re:Zero | Echidna | `[OOC: your question]` |
| Mushoku Tensei | Roxy | `OOC guide: your question` |
| Overlord | Demiurge | `OOC guide: your question` |
| Classroom of the Elite | Arisu Sakayanagi | `OOC guide: your question` (also `[OOC:` or `OOC:`) |
| Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim | The one the bot names | The bot's own trigger. The OOC card reads it from the bot's lorebook. |

### Two ways to ask

1. **In the panel**: open the **OOC guide** card, type your question, press **Ask**. The answer stays in the panel. The story never sees it. It costs one model call.
2. **In the chat**: press **Ask in the story**, or type the trigger yourself.

You can name another guide in the **Guide** box, if the bot allows it.

### What happens on an OOC turn

- No HUD, no story, and no time passes.
- The extension adds nothing to that turn and does not read the answer as story.
- Your next normal message picks the story up again.

---

## 9. Memory: what remembers what

| Helper | Part | What it keeps | Reaches the model? |
| --- | --- | --- | --- |
| **Chronicle** | Extension | The timeline: moments, milestones, bonds, plot | Yes, through the Memory Cortex |
| **Chapters** | Extension | Summaries of story parts; loops in Re:Zero | Yes, as "the story so far", once summarised |
| **Map bank** | Extension | Every room drawn, per world | Only a short room plan when needed |
| **Minds** | Extension | Feelings, agendas, who knows what, planted details | Yes, as the minds state before each reply |
| **Memory Cortex** and **Chat Memory** | Lumiverse | People, places, links between them, older passages | Yes, through the preset's Memory block |
| **Loom Summary** | Lumiverse | One summary of the story | Only if you switch on its block in the preset |

### The Chronicle and the Memory Cortex

- A reply is written to the Cortex only after you answer it. So a swipe never leaves a wrong memory.
- Each entry becomes a fact on the people it is about, with an importance tag.
- Choose how much is written: Settings → **Chronicle** → Write to the Memory Cortex. **Key moments, bonds, plot and milestones** is the default.
- **Write now** writes at once. **Write everything again** is for after a Cortex rebuild. Nothing is written twice.
- In Re:Zero, a loop undone by Return by Death is written as undone.

### Tip

Use **Chapters** or the **Loom Summary**, not both. Both would send a summary of the same story.

---

## 10. Settings, section by section

Settings opens as a list of sections. Click one to open it. Every switch has a short note under it.
Each heading has a small picture in your theme's colours. The box at the top finds a switch by name: type **clock** or **emoji** and only the sections with it stay.
**Tabs** (new in 2.8) sit under the box: **All**, **Setup & Look**, **World & Maps**, **People & Minds**, **Body & Health**, **Magic & Skills**, **Fights & D&D**, **Memory & Chapters**, **Advanced**. Each shows only its sections.

| Section | What it holds |
| --- | --- |
| **Play style** | World presets (one click per bot), play styles (HMS Narrative, D&D, Power scaling, Pure narrative, Gritty survival, Social and romance), and your own saved presets. **How much** (2.8): **None / Custom**, **Potato**, **Light**, **Medium**, **Heavy** or **Max**, on top of the world or style you pick. They match the preset's **Mode**. **None** sets nothing: every tracker stays as you have it. D&D is on only in the **D&D** style. Your own saved presets keep exactly what you saved. |
| **Look** | The panel theme, density and text size, **Easy reading**, the day dial, **Clock face**, **Sky above the clock**, **More weather detail**, the labels in the wide window's menu, **Perch** and **The round button on the screen** (only when the wide window is closed, always, or **never**; with **Put it back in the corner**), and the page shortcuts. Where the panel lives (drawer, floating, own window, **wide window**) is in the top bar. |
| **Modules** | Every feature in one list. Switch off what you do not use: it leaves the panel and the prompt, and costs no tokens. These are the same switches as in the sections below. The small arrow next to one opens its section. |
| **HMS engine** | HMS mode (automatic, always, off), the hidden block, fetching a forgotten block, the guard for dropped lines, the pin reminder. |
| **HMS systems** | How the HUD is read: pools and meters, wounds and conditions, abilities and attributes, people and their bars, the phone, the party, the survival clock, injuries, experience. |
| **Minds (from FrankenSIM)** | Feelings (twelve feelings or the classic bars), between the others too, the step size, the fading speed, handing the state back, agendas, who knows what, Chekhov's gun, building maps, and the credits. |
| **Characters** | The tracking level (None, Light, Standard, Full, Custom), every switch about people in one place, profiles for people without a card, your party's **bodies**, the **Statuses** switches, and undoing your profile changes. |
| **Gates (card progression)** | Keeping each character's phase from their card's gated block, moving by itself or asking you first, handing the positions back, the list of cards it read, and undoing your own changes. |
| **Body & health** | On or off, **How much it tracks** (None, Light, Medium, Heavy, Custom), each part on its own (locks, dressings, blood, sleep, water and food, stamina, strain, stress, **cold and heat**, **sickness**, sanity), the **Body chart** (from the HUD, male or female), **arteries**, **vitality**, using the Race card, **asking the model about your shape**, **Units** (cm and kg, or feet and pounds), **telling the story your measurements**, telling the story, asking the model for the body note, and where **HP** shows. |
| **Maps** | New in 2.8. Everything that draws a map: **Floor plans** (how much to keep, who stands where, asking the model for new rooms), the **Atlas**, the **room map** and map bank, and **building maps**. |
| **Magic & Skills** | New in 2.8. The Magic card, the spell list, studying, powers, and the skills and traits card. |
| **Quests** | The Quests card, quest details, the plot, objectives, the quest journal, quest labels and states. |
| **Chapters** | Automatic chapters for loops, arcs, days or months; summaries; whether they go with every message and with fights. |
| **Chronicle** | On or off, asking the story for key moments (and, 2.9, **milestones in other people's lives**), and how much goes into the Memory Cortex. |
| **Lorebook context** | Whether the extension's own calls get your lorebooks, which ones (fight calls, tracker and companion calls, portrait calls), how lore is found, and what the last call sent. |
| **Engine core & memory** | Whether fights run on the bot's engine, and how much long-term memory they recall. |
| **General** | The master switch, Together or Separate mode, the connection for the extension's own calls, and time limits. |
| **Panels** | Which classic panels show, and bar colours. |
| **Chat display** | Internal states under each reply, the map and map bank, the HUD card (**Card colours**, **HUD style**: Rows or **Pills**), **Letters, notes and books** (2.9: **Remind the story of contracts in force**), dialogue emoji, **Let the model add its own emoji**, colours and names, lock and plot buttons, weather effects, portraits. (Called Chat and panel extras before 2.4.) |
| **Present characters setup** | What is asked about each character in the scene: details, thoughts, character bars. (Called Characters setup before 2.4.) |
| **Fights** | **Fights on**, difficulty, how immersive fights resolve, fate dice, effects, moves, hidden plans, the legacy window. Links to Lorebook context and D&D. |
| **D&D** | The D&D card, the roller, the HUD's scores, turn-based fights, **No cap on stats**. Off unless you pick the D&D style. |
| **Story extras** | Extras from the original RPG Companion: immersive HTML, dialogue colouring, deception tags, the omniscience filter, choose your own adventure (off in HMS chats), song suggestions. |
| **Tracker field presets** | Save and load whole tracker setups, mostly for classic chats. Link one to a character. |
| **Custom prompts** | The words each feature sends, editable. Empty uses the built-in words. The switches for them are in Story extras. |
| **Help & bug report** | **Open the guide**, and **Copy bug report** for Discord. No chat text unless you tick the box. |
| **Reset** | Clear this chat's trackers, or reset all settings. |

**Together or Separate?** Together (the default) gets the side-panel data in the same reply: one call. Separate makes a second call after each reply. Use Separate only if your model keeps forgetting the hidden block.

---

## 11. When something goes wrong

| Problem | What to do |
| --- | --- |
| The World State card is empty. | It says why. Often the model wrote the HUD inside its thinking. Press **Read again**. The extension also moves a HUD out of the thinking by itself. |
| A card did not update. | Press **Read again**. It is free. |
| "The reply left out the side-panel block." | The extension fetches it with a quick second call. If it happens a lot, use **Separate** mode (Settings → General). |
| A HUD line vanished. | Press **Restore** in the World State card. Pin the line if it keeps happening. |
| The reply has no HUD at all. | Press **Put the last HUD back**, or swipe for a new reply. |
| The HUD header shows twice. | The extension keeps one by itself. If it keeps happening, set the preset's HUD header slider to **Never**. |
| "The Arc line loads no arc entry." | Press **Use** to put in the book's spelling. |
| An OOC answer came back with a HUD or a story. | Check the trigger is at the very start of your message, like `[OOC: ...]`. |
| No emoji or dialogue colours. | They are off at first: Settings → Chat display → Dialogue. |
| A letter shows as plain text with [LETTER] around it. | The block was not closed with [/LETTER], or Letters, notes and books is off. With a preset that is not HMS Reporter 1.4, switch on Ask the model for them. |
| The wide window is gone. | Press the round button in the bottom right corner. Or pick Drawer under Where the panel lives. |
| The clock shows no temperature. | The HUD needs a `Weather:` or `Temperature:` line with a number and °C or °F. Or set Settings → Look → **Sky above the clock** to **Time, weather and season**. |
| The test zone shows only the controls. | Press **Start**. In the wide window the cards are on the pages in the menu. |
| I cannot find a setting. | Type its name in the box at the top of Settings. |
| The New game card does not show. | It only shows on a new chat whose first message has catalog pages. |
| The D&D card shows in a game without dice. | Use your world's preset, or switch D&D off in Settings → Modules. |
| "Your provider allows only one request at a time." | Wait for the reply to finish, then press **Refresh**, or **Read again** (free). |
| A permission is missing. | Grant it in the Extensions panel. The part that needs it says which one. |
| Someone knows something they could not know. | Open their card → Inside, feelings and what they know → press ✕ on the fact. |
| A planted detail does not fit the story. | Quests card → Planted details → press ✕. |
| The text is hard to read. | Settings → Look → **Easy reading**. It adds space between letters, words and lines and removes slanted type. **Text size** is next to it. |
| I do not want the fish or the clock. | Settings → Look → switch off **Perch, the mascot** or **The day dial**. |
| The spell list is empty. | The spells must be in a lorebook this chat uses. It reads `[SPELL — Name]` entries with `School:` and `Rank:`, an entry per spell with a `## Name` title and `Tier:` and `School:` lines (Re:Zero), lists under `## Water — Elementary Rank` (Mushoku Tensei) or `### 1st Tier` with a `**System:**` line (Overlord), lines like `Name [Fire Magic - Advanced]:`, spell indexes and the Master Spell Index. |
| No spirits in the Magic card (Re:Zero). | The HUD needs a `[SPIRIT CONTRACT: …]` line or a `Spirit Affinity:` line. |
| A spell shows the wrong state. | Press ✓ or ✕ on it. In Re:Zero the card says where the Gate cap comes from: the bot's own Gate table, or a plain default. |
| People pop up out of nowhere. | Keep **Comings and goings** on in the preset. With building maps on, the story is also told how many rooms away each person is. |
| Someone is in the wrong phase. | Open their card → the road on this card → pick the phase → **Set**. If a yellow box is waiting, press **Accept** or **Dismiss**. |
| A character with a gated card has no 🗝️ line. | The card must be an entry in a lorebook this chat uses, with a line like `[THE THAW] — gated progression` and `PHASE 1 — NAME` headers. Settings → Gates (card progression) lists the cards it read. |
| Someone's feelings look wrong. | They move at most 2 per reply, so give the story a few replies. If the relationship itself is wrong, use **Set the bond**. |
| Too many tokens. | Settings → Play style → **How much: Light**, then Apply. Or switch off parts of Minds in Settings → Modules. |
| The Atlas is missing in my chat. | Fixed in 2.7.1: one odd line in the location book no longer hides the whole map. If it is still missing, check **Atlas** is on in Settings → Modules and that the HUD has a `◆` location line. |
| Someone who is not here shows up in People. | From 2.7.1 they fold away under **Elsewhere**, or their card says **not in this scene**. The story still follows what they do. Turn **Agendas** off in Settings → Modules to stop that. |
| I cannot get out of the wide window. | Press **Esc**, or **⇥** beside the × at the top right. Or pick **Drawer** under Where the panel lives. |
| I cannot get out of the test zone. | Press **Leave test zone** in the menu, or **Leave** in the strip at the top of a page. |
| The cost chip says `~?`. | Nothing was measured in this chat yet. It fills in after the next reply, and from 2.7.1 it stays after a reload. |
| The story let me run on a broken leg. | Check Settings → Body & health is on, with **Tell the story** on. With HMS Reporter, keep the **Body state** block on. Where the bot keeps its own wounds, the HUD must list the break on its `Injuries:` line. |
| My HP is gone. | In worlds without hit points the Body & health card is your health. To bring HP back: Settings → Body & health → **HP** → **Always show HP**. |
| The card says I am in the wrong form, or my horn is hidden when it is out. | Open **You → Race → Your shape now** and press the right button. It holds until the story or the HUD changes it. |
| Bust, waist and hips are missing. | They are not kept for a character under 18. An `Age:` line of 18 or more on the HUD brings them back. |
| The Body card shows a wound I already healed. | Where the extension keeps the body, the model's next note fixes it. You can also fix the Injuries card by hand. Where the bot keeps wounds, its HUD wins. |
| The floor plan shows no room. | Settings → **Maps** → **How much to keep** must not be Off. The model draws a room the first time you enter it. |
| Someone is asleep, dead or missing, but they are not. | Open their card in **People** → **Status of …** → **Change**. |
| The body chart is male, but my character is female. | Press **♂ Male chart** on the card to switch. Or add a `Gender:` line to the HUD, or pick it in Settings → Body & health → **Body chart**. |
| The D&D card is gone. | From 2.8 it is off unless you pick the D&D style. Switch it on in Settings → Modules → **D&D**. |
| The round button is in the way. | Settings → Look → **The round button on the screen** → **Never**. Then open the panel from its drawer tab. |
| A wound I treated is still raw. | Press **Treated** or **Healed** on it in the Body & health card. |
| A starred person never seems to move. | Their last line may have no end time. Wait six replies, or set the HUD clock forward: the story is asked again. |
| The floor plan shows the wrong room. | Check the HUD's place line names the floor, like "(Second Floor)". Two rooms with one name are told apart by it. |
| A contract the story ended is still told. | In **Letters**, open it and press **Mark this contract as ended**. |
| Something else. | Settings → **Help & bug report** → **Copy bug report**, and paste it in the Discord. |

### What it costs

**The cost chip** (⚙ ~N tokens, top bar) shows what the extension added to the last reply, measured, not guessed. Press it for the parts: the side-panel request (in the preset's slot or as its own message), notes, Minds, Gates, the people and the fight, each with its tokens, and the hidden block the model writes back. Your bot's own tokens (card, lorebook, history) are not in it. Fights, the OOC guide and chapter summaries are their own calls and are listed under it. The numbers are estimates (about 4 letters a token).

- The hidden-block request is about 1,000 to 1,700 tokens per reply, depending on what is switched on.
- Minds adds about 1,000 tokens of instructions and 300 to 600 tokens of state per reply. Switch parts off to save.
- The character blocks in the preset add about 2,300 tokens. The preset's **Mode** decides: **Light** swaps them for one short paragraph, **Potato** for the short rules.
- **Floor plans** (2.8): about 60 tokens for a new room, about 150 for a new floor plan, only when you reach a room the plan does not know. Off costs nothing.
- **Statuses** (2.8): nothing while everyone is fine. One line per person who is not, and a short ask when one changes.
- **Party bodies** (2.8): a few lines while a party member is hurt, and the wounds the model reports when they change.
- **Milestones** (2.9): about 50 tokens of request; most replies answer [].
- **Starred people** (2.9): about 90 tokens of request, plus a short agenda line for each in the story text.
- **History** (2.9): up to three short lines each for the people in the scene.
- **Contracts in force** (2.9): one line per contract (up to four), sent with the statuses.
- **Floor plans** (2.9): a new room's request also carries the lorebook's words for it (up to about 225 tokens), and the list of things (about 90 tokens). Only when a room is new or people came or left.
- **On you**, **Picture prompt**, **arteries** and **vitality** read what is already there: no tokens, except one vitality line once you are badly hurt.
- A profile costs about 170 tokens, once, in the reply after someone new shows up. Reading cards costs nothing.
- Studying a spell adds about 100 tokens while you study. The spell list itself costs nothing.
- Gates adds about 150 tokens of instructions while a gated character is around, and one line of state per such character. A scene without one costs nothing.
- **Written things** (letters, notes, books, texts) adds about 200 tokens per reply: the preset's block, or the extension's line if you switched on **Ask the model for them**. Drawing them costs nothing.
- **Sky above the clock → Time, weather and season** adds about 25 tokens per reply: it asks for the weather and the temperature. **More weather detail** adds about 30 more (feels like, wind, rain or snow, later, the scene).
- Powers in the Magic card and the Race card cost nothing: they read the lorebook the chat already loads.
- **Body & health** costs nothing while you are fine. Hurt, the body note is about 60 to 150 tokens before a reply. Where the extension keeps the body, it asks for about 90 tokens more and the model writes back 10 to 40. Where the bot keeps its own wounds, nothing is asked.
- **Your shape** (2.7) is asked only for a race that can hide parts or change form, and only when the HUD does not already say it: about 40 tokens. **Tell the story your measurements** is off by default; on, it is one line of about 15 tokens.
- **How much** in Play style: **Potato** is about 150 to 300 tokens a reply, **Light** about 300 to 500, **Medium** about 700 to 1,100, **Heavy** about 1,300 to 2,000, **Max** about 2,000 to 3,000. **None** changes nothing.
- Modules you switch off cost nothing.
- Fights, the OOC guide and chapter summaries each make their own call when you use them.

---

## 12. Words used in this guide

| Word | Meaning |
| --- | --- |
| **HMS** | The game engine inside the bot's card. |
| **HUD** (WORLD STATE) | The block at the top of each reply: time, place, arc, powers and more. |
| **The wall** | The `***` line under the HUD. The story starts after it. |
| **STATE IS GOD** | The bots' rule: the HUD is true, and the story must agree with it. |
| **Carrier line** | A HUD line whose words keep a lorebook entry loaded, like the Arc line. |
| **Start handler** | The bot's start line, like `ReZero_Start_Handler`. Your first message begins with it. |
| **Catalog** | The pages of the bot's first message: how to start, and all the commands. |
| **Canvas** | The almost empty catalog page you type your start under. |
| **OOC** | Out of character: a question to the bot's guide, outside the story. |
| **Hidden block** | The small `<rpg_companion>` data after the story. The extension reads it and removes it. |
| **Pin** | Keep a HUD line exactly as it is. |
| **Guard** | The check for HUD lines that vanished. |
| **Swipe** | Another version of a reply. The extension follows the swipe you keep. |
| **Gated block** | The part of a character card that holds their road of phases: `[THE …] — gated progression`. |
| **Phase** | One step on that road. Phase 0 is the card as written. |
| **Gate / trigger** | The event that opens a phase. It has to happen in the story, whole. |
| **Lorebook** | The bot's world entries. A keyword in the chat loads an entry. |
| **Memory Cortex** | Lumiverse's memory of people, places and their links. |
| **Preset** | The prompt recipe Lumiverse sends to the model. Here: HMS Reporter beta. |
| **Extension** | An add-on for Lumiverse. Here: RPG Companion HMS Edition. |
| **Together / Separate** | Whether the side-panel data comes in the same reply, or from a second call. |
| **Settled reply** | A reply you have answered. It can no longer be swiped away. |
| **Minds** | How people feel, think and act, from FrankenSIM. The extension keeps the numbers. |
| **TFDY** | Tenderness, Fury, Dread, Yearning: a person's mood under everything, 0 to 4. By Pyropia. |
| **Shows (IW)** | How warm a person acts on the outside. FrankenSIM calls it Inner Weather. |
| **The twelve feelings** | Desire, Play, Friendship, Partnership, Belonging, Care, and their mirrors Hate, Strife, Enmity, Stuck, Indifference, Envy. |
| **Settles at** | Where a feeling rests. It moves slowly, when a feeling is pushed the same way again and again. |
| **Wall** | A feeling and its mirror both high at once. |
| **Gate** | How far a person lets themselves feel for someone. |
| **Agenda** | What a person is doing, where, and until when. |
| **Chekhov's gun** | A detail the story planted that should pay off later. |
| **Lock** | Something your body cannot do because a part is broken or gone. No pill or power lifts it. |
| **Capacity** | How well your body can do one thing: think, move, use hands, breathe, see, hear. 100% is whole. |
| **Masked** | Pain hidden by a painkiller or adrenaline. The wound is still there. |
| **Fresh wound** | A wound that bled hard and was just closed. A sprint or a hit tears it open. |
| **Form** | The shape you are in now: your race's own, a human form, or another one. |
| **Hidden part** | A horn, wings or a tail the race can tuck away. Out, it is drawn solid; hidden, dashed. |
| **Evolution** | The race itself changing into a higher one, like Goblin to Hobgoblin. |
| **Gate** | In Re:Zero, the organ mana passes through. Broken, you cannot cast. |
| **Mode** | The preset's one dial: Potato, Light, Medium, Heavy, Max, or Custom. The extension's **How much** has the same steps. |
| **Vitality** | How alive you are: Hurt, Badly hurt, Critical, Dying. |
| **Status** | A badge for someone not as usual: asleep, out cold, dead, tied up, missing, charmed. |
| **Floor plan** | The rooms of a place drawn from above, or in 3D. |
| **Prosthetic** | A peg leg, a hook, a metal or magic limb, or a glass eye in place of a lost one. |
| **Star** | A mark on a person's card: they live their own life off screen, and the story keeps up with them. |
| **Milestone** | A turning point in a character's own life: a promotion, an oath, a loss, a new rank. |
| **Contract** | A written pact: who is bound, the terms, the price of breaking it. It binds until it ends. |
| **Seal** | A writer's own wax mark on a letter, book, document or contract. |

---

## 13. Credits

**RPG Companion HMS Edition** and **HMS Reporter** are made by **Perch**, also known as **TenderTriper**.
Perch is a creator on Janitor AI and runs a Discord server called **The Appa Stand**. Come say hi, share your games, and bring your bug reports there.

- Janitor AI profile: [TenderTriper](https://janitorai.com/profiles/cc9e471a-d758-4147-8cd9-be31afa1995a_profile-of-tender-triper)
- Discord, The Appa Stand: [discord.gg/k6DQPYQMFY](https://discord.gg/k6DQPYQMFY)

Built on the work of others, with thanks:

- **RPG Companion** by **Marinara** (Marysia, marinara_spaghetti), licensed AGPL-3.0. Panels, presets, dice, deception tags, immersive HTML, portraits and the prompt editor are hers.
- **Minds** (feelings, agendas, who knows what, Chekhov's gun, building maps, tone tags) is from **FrankenSIM 4 Mini** by **Wireless (Ryah)**, with permission. Ideas from **Vexa**, its successor, are used with its author's permission.
- **Floor plans** follow the room atlas of **Ryah | Wireless**, with permission.
- **TFDY** (Tenderness, Fury, Dread, Yearning) is by **Pyropia**.
- **Radiant's R. Prompt** (Core Engine v3.1.7 and Writing Style v3.1.5, made for **Megumin Suite**) is used in HMS Reporter's **Max** mode, with **Radiant's** permission. Ideas from it also improved the Reporter, Voices and Written things blocks. Its intimacy section is left out.
- **Megumin Suite** gave ideas for the wide window, the cost chip and the round button on the screen. No code from it is used.
- **Body & health** takes its ideas from **Escape from Tarkov**, **Gray Zone Warfare**, **Project Zomboid**, **Barotrauma**, **Kenshi** and **RimWorld**. No code or text from them is used.
- **Lumiverse** is the app this all runs in.
