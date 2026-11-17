// RPG Companion — Lumiverse Spindle frontend
// Renders the tracker panel in a drawer tab and a settings view. All persistence goes through the backend.

const ICON_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5 20.5 7.3v9.4L12 21.5 3.5 16.7V7.3z"/><path d="M12 2.5 7.5 15h9z"/><path d="M3.5 7.3 7.5 15M20.5 7.3 16.5 15M7.5 15 12 21.5 16.5 15"/></svg>';
const SMALL_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>';

const CSS = `
.rpgc { --rpgc-gap: 10px; color: var(--lumiverse-text, #ddd); font-size: 13px; line-height: 1.4; padding: 10px 10px 24px; display: flex; flex-direction: column; gap: 12px; }
.rpgc * { box-sizing: border-box; }
.rpgc-top { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-top .rpgc-mode { color: var(--lumiverse-text-muted, #999); font-size: 12px; flex: 1; white-space: nowrap; }
.rpgc-status { font-size: 12px; padding: 6px 8px; border-radius: 6px; border: 1px solid var(--lumiverse-border, #333); color: var(--lumiverse-text-muted, #aaa); }
.rpgc-status.warning { border-color: #c9a227; color: #e5c55a; }
.rpgc-status.error { border-color: #c0504d; color: #e88683; }
.rpgc-status.ok { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-status.busy { border-color: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-btn { appearance: none; border: 1px solid var(--lumiverse-border, #444); background: var(--lumiverse-fill-subtle, transparent); color: inherit; border-radius: var(--lumiverse-radius, 6px); padding: 4px 9px; font: inherit; font-size: 12px; cursor: pointer; }
.rpgc-btn:hover { border-color: var(--lumiverse-border-hover, #666); }
.rpgc-btn:focus-visible, .rpgc-edit:focus-visible, .rpgc input:focus-visible, .rpgc select:focus-visible, .rpgc textarea:focus-visible { outline: 2px solid var(--lumiverse-accent, #7aa2f7); outline-offset: 1px; }
.rpgc-btn.primary { background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); border-color: transparent; }
.rpgc-btn.icon { padding: 2px 7px; line-height: 1.2; }
.rpgc-btn.danger { color: #e06c75; }
.rpgc-btn[disabled] { opacity: .5; cursor: default; }
.rpgc-note { color: var(--lumiverse-text-muted, #999); font-size: 12px; }
.rpgc-sec { border: 1px solid var(--lumiverse-border, #333); border-radius: var(--lumiverse-radius, 8px); background: var(--lumiverse-fill-subtle, transparent); }
.rpgc-sec > summary { list-style: none; cursor: pointer; padding: 8px 10px; font-weight: 600; display: flex; align-items: center; gap: 6px; }
.rpgc-sec > summary::-webkit-details-marker { display: none; }
.rpgc-sec > summary::before { content: '▸'; font-size: 10px; color: var(--lumiverse-text-dim, #777); transition: transform var(--lumiverse-transition-fast, .12s); }
.rpgc-sec[open] > summary::before { transform: rotate(90deg); }
.rpgc-sec > summary .rpgc-sum-extra { margin-left: auto; font-weight: 400; color: var(--lumiverse-text-muted, #999); font-size: 12px; }
.rpgc-body { padding: 2px 10px 10px; display: flex; flex-direction: column; gap: 8px; }
.rpgc-edit { border-radius: 4px; padding: 0 2px; min-width: 1ch; display: inline-block; white-space: pre-wrap; word-break: break-word; }
.rpgc-edit:hover { background: var(--lumiverse-fill, rgba(255,255,255,.05)); }
.rpgc-edit:empty::before { content: attr(data-ph); color: var(--lumiverse-text-dim, #666); font-size: 12px; font-style: normal; }
.rpgc-who { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 600; }
.rpgc-who .rpgc-mood { font-size: 20px; }
.rpgc-who .rpgc-lvl { margin-left: auto; font-size: 12px; font-weight: 400; color: var(--lumiverse-text-muted, #999); display: flex; gap: 4px; align-items: center; }
.rpgc-stat { display: grid; grid-template-columns: minmax(64px, 30%) 1fr auto; gap: 8px; align-items: center; }
.rpgc-stat-name { color: var(--lumiverse-text-muted, #aaa); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rpgc-bar { height: 8px; border-radius: 99px; background: rgba(128,128,128,.22); background: color-mix(in srgb, var(--lumiverse-text, #ddd) 14%, transparent); overflow: hidden; }
.rpgc-bar > i { display: block; height: 100%; border-radius: 99px; transition: width .35s ease, background-color .35s ease; }
.rpgc-stat-val { font-variant-numeric: tabular-nums; font-size: 12px; min-width: 42px; text-align: right; }
.rpgc-kv { display: grid; grid-template-columns: minmax(70px, 32%) 1fr; gap: 4px 8px; }
.rpgc-kv > .k { color: var(--lumiverse-text-muted, #aaa); font-size: 12px; padding-top: 1px; }
.rpgc-attrs { display: grid; grid-template-columns: repeat(auto-fill, minmax(78px, 1fr)); gap: 6px; }
.rpgc-attr { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 6px; display: flex; align-items: center; justify-content: space-between; gap: 4px; }
.rpgc-attr b { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); font-weight: 600; }
.rpgc-attr span { font-variant-numeric: tabular-nums; font-weight: 600; }
.rpgc-mini { appearance: none; border: 0; background: none; color: var(--lumiverse-text-muted, #aaa); cursor: pointer; padding: 0 3px; font: inherit; line-height: 1; }
.rpgc-mini:hover { color: var(--lumiverse-text, #fff); }
.rpgc-dice { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.rpgc-dice input { width: 52px; }
.rpgc-roll { font-weight: 600; }
.rpgc input[type=text], .rpgc input[type=search], .rpgc input[type=number], .rpgc select, .rpgc textarea { background: var(--lumiverse-fill, rgba(255,255,255,.05)); color: inherit; border: 1px solid var(--lumiverse-border, #444); border-radius: 5px; padding: 3px 6px; font: inherit; font-size: 12px; }
.rpgc textarea { width: 100%; min-height: 90px; resize: vertical; }
.rpgc-scene { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.rpgc-scene .cell { display: flex; flex-direction: column; gap: 1px; }
.rpgc-scene .cell.wide { grid-column: 1 / -1; }
.rpgc-scene .lbl { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-scene .weather { font-size: 18px; }
.rpgc-list { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 3px; }
.rpgc-list li { display: flex; align-items: flex-start; gap: 6px; }
.rpgc-list li .grow { flex: 1; }
.rpgc-list li .qty { color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-add { display: flex; gap: 6px; }
.rpgc-add input { flex: 1; min-width: 0; }
.rpgc-char { border-top: 1px solid var(--lumiverse-border, #333); padding-top: 8px; display: flex; flex-direction: column; gap: 5px; }
.rpgc-char:first-child { border-top: 0; padding-top: 0; }
.rpgc-char-head { display: flex; align-items: center; gap: 7px; }
.rpgc-char-head .emo { font-size: 22px; }
.rpgc-char-head .name { font-weight: 600; font-size: 14px; }
.rpgc-rel { margin-left: auto; font-size: 12px; color: var(--lumiverse-text-muted, #aaa); display: flex; align-items: center; gap: 3px; }
.rpgc-thought { font-style: italic; border-left: 2px solid var(--lumiverse-accent, #7aa2f7); padding: 2px 0 2px 8px; color: var(--lumiverse-text, #ddd); }
.rpgc-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.rpgc-tabs .rpgc-btn.on { border-color: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-loc { font-size: 12px; font-weight: 600; margin-top: 4px; display: flex; gap: 6px; align-items: center; }
.rpgc-quest-main { font-weight: 600; }
.rpgc-set { display: flex; flex-direction: column; gap: 6px; }
.rpgc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.rpgc-row > label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.rpgc-row .lbl { min-width: 110px; color: var(--lumiverse-text-muted, #aaa); font-size: 12px; }
.rpgc-cfg-item { display: flex; gap: 6px; align-items: center; }
.rpgc-cfg-item input[type=text] { flex: 1; min-width: 0; }
.rpgc-cfg-item input.num { width: 64px; flex: none; }
.rpgc h4 { margin: 6px 0 0; font-size: 12px; font-weight: 600; color: var(--lumiverse-text-muted, #aaa); }
.rpgc input[type=color] { width: 34px; height: 22px; padding: 0 2px; border: 1px solid var(--lumiverse-border, #444); border-radius: 4px; background: none; cursor: pointer; }
.rpgc-lock { appearance: none; border: 0; background: none; padding: 0 2px; margin: 0 2px 0 0; cursor: pointer; color: var(--lumiverse-text-dim, #777); opacity: .55; vertical-align: -2px; line-height: 1; }
.rpgc-lock:hover { opacity: 1; }
.rpgc-lock.on { color: var(--lumiverse-accent, #7aa2f7); opacity: 1; }
.rpgc-story { display: flex; gap: 6px; flex-wrap: wrap; }
.rpgc-imm { border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 8px 10px; display: flex; flex-direction: column; gap: 6px; }
.rpgc-imm.live { border-color: color-mix(in srgb, #d9534f 45%, var(--lumiverse-border, #333)); }
.rpgc-imm-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-imm-head b { flex: 1; }
.rpgc-imm-env { font-size: 12px; font-style: italic; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-side { font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-muted, #999); margin-top: 4px; }
.rpgc-imm-c { display: flex; flex-direction: column; gap: 3px; padding: 5px 0; border-top: 1px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); }
.rpgc-imm-c.down { opacity: .5; }
.rpgc-imm-name { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.rpgc-imm-name span.tag { font-size: 10px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-name span.tag.down { border-color: #d9534f; color: #d9534f; }
.rpgc-imm-note { font-size: 11px; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-pool { display: grid; grid-template-columns: 58px 1fr auto; gap: 6px; align-items: center; font-size: 12px; }
.rpgc-imm-pool .val { font-variant-numeric: tabular-nums; white-space: nowrap; background: none; border: 0; color: inherit; font: inherit; padding: 0; cursor: pointer; }
.rpgc-imm-pool .val[disabled] { cursor: default; }
.rpgc-imm-pool .band { grid-column: 2 / 4; font-size: 11px; color: var(--lumiverse-text-muted, #999); margin-top: -2px; }
.rpgc-imm-src { font-size: 9px; border: 1px solid currentColor; border-radius: 3px; padding: 0 3px; margin-left: 4px; opacity: .8; }
.rpgc-imm-chg { font-size: 11px; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-chips { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-imm-chips span { font-size: 10px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-fx { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 1px; }
.rpgc-imm-fx span { font-size: 11px; border-radius: 4px; padding: 0 6px; background: color-mix(in srgb, #e0a93b 16%, transparent); }
.rpgc-imm-fx span.new { box-shadow: inset 0 0 0 1px color-mix(in srgb, #e0a93b 70%, transparent); }
.rpgc-imm-did { font-size: 11px; font-style: italic; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-imm-tell { font-size: 11px; color: #e0a93b; }
.rpgc-imm-intel { display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.rpgc-imm-intel button { text-align: left; background: none; border: 1px dashed var(--lumiverse-border, #555); border-radius: 4px; color: inherit; font: inherit; padding: 1px 6px; cursor: pointer; }
.rpgc-imm-intel button.on, .rpgc-mini.on { border: 1px solid #5b8def; color: #8fb0f5; }
.rpgc-imm-intel button:focus-visible, .rpgc-imm-pool .val:focus-visible { outline: 2px solid #5b8def; outline-offset: 1px; }
.rpgc-imm-flag { font-size: 11px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; padding: 3px 6px; border-radius: 6px; background: color-mix(in srgb, #5b8def 14%, transparent); }
.rpgc-imm-dice { font-size: 11px; font-variant-numeric: tabular-nums; }
.rpgc-imm-log summary { font-size: 11px; cursor: pointer; color: var(--lumiverse-text-muted, #999); }
.rpgc-imm-log ol { margin: 4px 0 0 18px; padding: 0; font-size: 11px; display: flex; flex-direction: column; gap: 2px; }
.rpgc-imm-pool .val.editing input { width: 76px; font: inherit; }
.rpgc-chooser { display: flex; flex-direction: column; gap: 8px; padding: 12px; }
.rpgc select option, .rpgc select optgroup { background-color: Canvas; color: CanvasText; }
.rpgc.theme-rezero, .rpgc.theme-overlord, .rpgc.theme-horror, .rpgc.theme-hell, .rpgc.theme-space, .rpgc.theme-midnight, .rpgc.theme-terminal, .rpgc.theme-undertale, .rpgc.theme-darksouls, .rpgc.theme-skyrim { color-scheme: dark; }
.rpgc.theme-cote, .rpgc.theme-mushoku, .rpgc.theme-dnd, .rpgc.theme-heaven, .rpgc.theme-parchment, .rpgc.theme-sakura { color-scheme: light; }
.rpgc-top .rpgc-panelsel { font-size: 12px; max-width: 110px; }
.rpgc-dnd-roller { display: flex; flex-direction: column; gap: 4px; }
.rpgc-dnd-roll { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rpgc-dnd-roll select { max-width: 100%; }
.rpgc-dnd-num { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; }
.rpgc-dnd-num input, .rpgc-dnd-roll .rpgc-dice input { width: 56px; }
.rpgc-dnd-result { display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; font-variant-numeric: tabular-nums; font-size: 12px; }
.rpgc-dnd-result b { font-size: 18px; }
.rpgc-dnd-abils { display: grid; grid-template-columns: repeat(auto-fill, minmax(86px, 1fr)); gap: 6px; }
.rpgc-dnd-abil { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 6px; display: flex; flex-direction: column; align-items: center; gap: 2px; }
.rpgc-dnd-abil.hud { border-style: dashed; }
.rpgc-dnd-abil .ab { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-dnd-abil .mod { font-size: 17px; font-weight: 600; font-variant-numeric: tabular-nums; }
.rpgc-dnd-abil .score { display: flex; align-items: center; gap: 4px; font-size: 12px; font-variant-numeric: tabular-nums; }
.rpgc-dnd-abil label { font-size: 10px; display: flex; gap: 3px; align-items: center; }
.rpgc-dnd-skillbox > summary { font-size: 12px; cursor: pointer; }
.rpgc-dnd-skills { display: grid; grid-template-columns: repeat(auto-fill, minmax(168px, 1fr)); gap: 2px 10px; font-size: 12px; margin-top: 4px; }
.rpgc-dnd-skill { display: flex; align-items: center; gap: 6px; }
.rpgc-dnd-skill .nm { flex: 1; }
.rpgc-dnd-skill .nm .ab { font-size: 10px; color: var(--lumiverse-text-muted, #999); }
.rpgc-dnd-skill .md { width: 28px; text-align: right; font-variant-numeric: tabular-nums; }
.rpgc-dnd-skill button { min-width: 48px; font-size: 10px; }
.rpgc-dnd-skill button.p1 { border-color: #5b8def; }
.rpgc-dnd-skill button.p2 { border-color: #e0a93b; }
.rpgc-psub { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 6px; padding-top: 5px; border-top: 1px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, transparent); }
.rpgc-psub .gt { font-size: 11px; font-weight: 600; color: var(--lumiverse-text-muted, #aaa); margin-right: auto; }
.rpgc-pcard.sub, .rpgc-char.sub { border: 0; padding: 0; margin: 0; background: none; box-shadow: none; }
.rpgc-chapter { border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; padding: 4px 8px; }
.rpgc-chapter > summary { cursor: pointer; display: flex; flex-wrap: wrap; gap: 6px; align-items: baseline; }
.rpgc-chapter.loop { border-left: 3px solid #9b6bd6; }
.rpgc-chapter.arc { border-left: 3px solid #5b8def; }
.rpgc-chapter.day { border-left: 3px solid #e0a93b; }
.rpgc-chapter.unsummarised > summary b { opacity: .75; }
.rpgc-chip.kind { font-size: 10px; }
.rpgc-chsum { white-space: pre-wrap; font-size: 12px; line-height: 1.5; margin: 6px 0; }
.rpgc-knowledge ul, .rpgc-chapter ul { margin: 4px 0 4px 18px; padding: 0; font-size: 12px; }
.rpgc-knowledge li { display: flex; gap: 6px; align-items: baseline; }
.rpgc-wgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 6px; }
.rpgc-wstat { display: flex; flex-direction: column; align-items: center; padding: 6px; border: 1px solid var(--lumiverse-border, #333); border-radius: 6px; }
.rpgc-wstat b { font-size: 18px; font-variant-numeric: tabular-nums; }
.rpgc-wstat span { font-size: 10px; color: var(--lumiverse-text-muted, #aaa); text-transform: none; }
.rpgc-wrow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-wrow .lbl { min-width: 96px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-wrow .val { font-variant-numeric: tabular-nums; }
.rpgc-wrow > .rpgc-bar { flex: 1; min-width: 80px; }
.rpgc-wrow.mine .lbl { color: var(--lumiverse-text, #eee); font-weight: 600; }
.rpgc-wability { border-left: 2px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 20%, transparent); padding-left: 8px; }
.rpgc-wlore { margin: 2px 0 0; font-size: 11px; }
.rpgc-wlist { margin: 4px 0 0 18px; padding: 0; font-size: 12px; display: flex; flex-direction: column; gap: 3px; }
.rpgc-wlist li.followed { opacity: .75; } .rpgc-wlist li.ignored { opacity: .6; text-decoration: line-through; }
.rpgc-ladder { display: inline-flex; gap: 2px; } .rpgc-ladder i { width: 10px; height: 6px; border-radius: 2px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, transparent); } .rpgc-ladder i.on { background: #e0a93b; }
.rpgc-karma { position: relative; flex: 1; min-width: 100px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #7a1f2b, #555 50%, #d8c27a); }
.rpgc-karma i { position: absolute; top: -3px; width: 3px; height: 12px; margin-left: -1px; background: var(--lumiverse-text, #fff); border-radius: 1px; }
.rpgc-decree { border: 1px solid var(--lumiverse-border, #444); border-radius: 6px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; }
.rpgc-decree.urgent { border-color: #d9534f; }
.rpgc-checklist { list-style: none; margin: 0; padding: 0; font-size: 12px; display: flex; flex-direction: column; gap: 2px; }
.rpgc-checklist li.met { opacity: .7; } .rpgc-checklist li.active { font-weight: 600; }
.rpgc-hud-block.pointer { opacity: .7; font-style: italic; }
.rpgc-soul { font-size: 16px; line-height: 1; }
.rpgc-savestar { color: #ffe600; }
.rpgc-ember { color: #e07b39; }
.rpgc-pips { display: inline-flex; gap: 3px; }
.rpgc-pips i { width: 9px; height: 13px; border-radius: 2px 2px 4px 4px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 15%, transparent); }
.rpgc-pips i.on { background: #e8a83a; box-shadow: 0 0 4px rgba(232,168,58,.6); }
.rpgc-wstat.ready b { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-plotnow { font-size: 13px; line-height: 1.45; margin: 2px 0 6px; }
.rpgc-threads { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.rpgc-threads li.resolved { opacity: .7; }
.rpgc-checklist li.failed { opacity: .6; text-decoration: line-through; }
.rpgc-checklist.mine li { display: flex; align-items: center; gap: 6px; }
.rpgc-imm-name .tag.mercy { background: color-mix(in srgb, #ffe600 30%, transparent); color: inherit; }
.rpgc-imm-name .tag.spared { background: color-mix(in srgb, #ffe600 55%, transparent); color: #000; }
.rpgc-injuries { display: flex; flex-direction: column; gap: 6px; }
.rpgc-injury { border-left: 3px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 25%, transparent); padding-left: 8px; }
.rpgc-injury.moderate { border-left-color: #d9b44f; } .rpgc-injury.severe { border-left-color: #d9964f; } .rpgc-injury.critical { border-left-color: #d9534f; }
.rpgc-injury.scar { opacity: .75; } .rpgc-chip.perm { background: color-mix(in srgb, var(--lumiverse-text, #ddd) 18%, transparent); }
.rpgc-chip.warm { background: color-mix(in srgb, #d9b44f 30%, transparent); }
.rpgc-injury.treated { opacity: .8; }
.rpgc-chip.crit { font-weight: 700; }
.rpgc-tells { font-style: italic; }
.rpgc-diag { font-family: ui-monospace, monospace; font-size: 11px; word-break: break-word; }
.rpgc-arc0 { position: relative; height: 8px; border-radius: 4px; margin: 6px 0; background: linear-gradient(90deg, #3a5a8a, #6b2a3a 50%, #2a2a2a); }
.rpgc-arc0 i { position: absolute; top: -4px; width: 4px; height: 16px; margin-left: -2px; border-radius: 2px; background: var(--lumiverse-text, #fff); }
.rpgc-arc0 .mark { position: absolute; top: 0; width: 1px; height: 8px; background: rgba(255,255,255,.55); }
.rpgc-wlist li.past { opacity: .6; }
.rpgc-wrow.legendary .lbl, .rpgc-chip.legendary { color: #e0a93b; }
.rpgc-spells > summary { cursor: pointer; list-style: none; }
.rpgc-spells > summary::-webkit-details-marker { display: none; }
.rpgc-spells .next { opacity: .7; }
.rpgc-chapter.month { border-left: 3px solid #6bbf8a; }
.rpgc.theme-mushoku .rpgc-imm-tell, .rpgc.theme-mushoku .rpgc-wrow.legendary .lbl, .rpgc.theme-mushoku .rpgc-chip.legendary,
.rpgc.theme-cote .rpgc-imm-tell, .rpgc.theme-dnd .rpgc-imm-tell, .rpgc.theme-heaven .rpgc-imm-tell, .rpgc.theme-parchment .rpgc-imm-tell, .rpgc.theme-sakura .rpgc-imm-tell,
.rpgc.theme-cote .rpgc-wrow.legendary .lbl, .rpgc.theme-dnd .rpgc-wrow.legendary .lbl, .rpgc.theme-heaven .rpgc-wrow.legendary .lbl, .rpgc.theme-parchment .rpgc-wrow.legendary .lbl, .rpgc.theme-sakura .rpgc-wrow.legendary .lbl,
.rpgc.theme-cote .rpgc-chip.legendary, .rpgc.theme-dnd .rpgc-chip.legendary, .rpgc.theme-heaven .rpgc-chip.legendary, .rpgc.theme-parchment .rpgc-chip.legendary, .rpgc.theme-sakura .rpgc-chip.legendary { color: #8a5a00; }
.rpgc-btn.rpgc-choice { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; text-align: left; padding: 10px 12px; white-space: normal; }
.rpgc-btn.rpgc-choice span { font-size: 12px; opacity: .8; font-weight: normal; }
.rpgc-story .rpgc-btn { flex: 1 1 auto; }
.rpgc-enc { padding: 4px 2px 8px; }
.rpgc-enc-stage { border-radius: 8px; padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.rpgc-enc-env { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-enc-side h4 { margin: 0 0 4px; }
.rpgc-enc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
.rpgc-fighter { border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; background: var(--lumiverse-fill-subtle, rgba(0,0,0,.15)); }
.rpgc-fighter.down { opacity: .45; }
.rpgc-fighter-head { display: flex; align-items: center; gap: 6px; font-weight: 600; }
.rpgc-fighter-head .sprite { font-size: 20px; line-height: 1; }
.rpgc-fighter-head .you { margin-left: auto; font-size: 10px; font-weight: 600; color: var(--lumiverse-accent, #7aa2f7); text-transform: uppercase; letter-spacing: .05em; }
.rpgc-fighter .hp { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-fighter .desc { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-chips { display: flex; flex-wrap: wrap; gap: 3px; }
.rpgc-map { --rh-bg: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); --rh-fg: var(--lumiverse-text, #ddd); --rh-mute: var(--lumiverse-text-muted, #999); --rh-acc: var(--lumiverse-accent, #7aa2f7); --rh-line: var(--lumiverse-border, #444);
    --rh-soft: color-mix(in srgb, var(--lumiverse-text, #ddd) 6%, transparent); text-align: center; overflow-x: auto; }
.rpgc-map svg { max-width: 100%; height: auto; }
.rpgc-map-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
/* ── Atlas: the location book as a map ── */
.rpgc-atlas-trail { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; font-size: 12px; margin-bottom: 6px; }
.rpgc-atlas-trail button { background: none; border: 0; padding: 1px 3px; border-radius: 4px; color: var(--lumiverse-text-muted, #999); cursor: pointer; font: inherit; }
.rpgc-atlas-trail button:hover { background: var(--lumiverse-fill-subtle, rgba(127,127,127,.1)); color: var(--lumiverse-text, #ddd); }
.rpgc-atlas-trail button.here { color: var(--lumiverse-text, #ddd); font-weight: 700; }
.rpgc-atlas-trail .sep { opacity: .5; }
.rpgc-atlas-focus { border: 1px solid var(--lumiverse-border, #444); border-radius: 10px; padding: 8px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 3%, transparent); }
.rpgc-atlas-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
.rpgc-atlas-head b { font-size: 14px; }
.rpgc-atlas-floor { margin-top: 8px; }
.rpgc-atlas-floor > .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 0 0 4px 2px; }
.rpgc-atlas-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: 5px; }
.rpgc-atlas-tile { position: relative; text-align: left; min-height: 48px; padding: 6px 7px 6px 9px; border-radius: 8px; border: 1px solid var(--lumiverse-border, #444); background: color-mix(in srgb, var(--lumiverse-text, #ddd) 5%, transparent); color: var(--lumiverse-text, #ddd); cursor: pointer; font: inherit; font-size: 12px; line-height: 1.25; display: flex; flex-direction: column; gap: 3px; }
.rpgc-atlas-tile:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-atlas-tile .nm { font-weight: 600; }
.rpgc-plan { margin: 4px 0; border: 1px solid var(--lumiverse-border, #3334); border-radius: 10px; padding: 4px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent); }
.rpgc-plan svg { display: block; width: 100%; height: auto; max-height: 460px; }
.rpgc-plan .pfl { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); }
.rpgc-plan .pt > * { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 22%, transparent); stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 55%, transparent); stroke-width: .8; }
.rpgc-plan .pt .dk { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 38%, transparent); stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 60%, transparent); }
.rpgc-plan .pt text { fill: var(--lumiverse-text, #ddd); stroke: none; font: 7px system-ui, sans-serif; text-anchor: middle; }
.rpgc-plan .pt.k-window path { stroke: #8fd3ff; stroke-width: 3.2; fill: none; stroke-linecap: butt; }
.rpgc-plan .pt.k-water > rect { fill: rgba(70, 150, 230, .45); stroke: rgba(120, 190, 255, .8); } .rpgc-plan .pt .wave { fill: none; stroke: rgba(220, 240, 255, .8); }
.rpgc-plan .pt.k-plant > circle { fill: rgba(80, 170, 90, .55); stroke: rgba(120, 210, 130, .8); } .rpgc-plan .pt.k-light > circle { fill: rgba(255, 210, 90, .7); stroke: none; }
.rpgc-plan .pt .fire { fill: #ff8a3d; stroke: none; } .rpgc-plan .pt.k-rug > rect { fill: rgba(176, 106, 160, .22); stroke-dasharray: 3 2; } .rpgc-plan .pt.k-pillar > circle { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 55%, transparent); }
.rpgc-plan .pt.k-stairs > rect { fill: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 22%, transparent); stroke: var(--lumiverse-accent, #7aa2f7); }
.rpgc-plan .p3 { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 24%, transparent); stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 50%, transparent); stroke-width: .5; pointer-events: none; }
.rpgc-plan .p3.k-water { fill: rgba(70, 150, 230, .5); } .rpgc-plan .p3.k-plant { fill: rgba(80, 170, 90, .6); } .rpgc-plan .p3.k-stairs { fill: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 35%, transparent); } .rpgc-plan .p3.k-pillar { stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 70%, transparent); stroke-width: 2.2; }
.rpgc-plan .pg, .rpgc-plan .pgrid path { stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); stroke-width: .6; }
.rpgc-plan .pg.b, .rpgc-plan .pgrid path.b { stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 20%, transparent); }
.rpgc-plan .pwall { fill: none; stroke: var(--lumiverse-text, #ddd); stroke-opacity: .7; stroke-width: 2.4; }
.rpgc-plan .pdoor, .rpgc-plan .pdoor path { stroke: var(--lumiverse-accent, #7aa2f7); stroke-width: 3.4; stroke-linecap: round; fill: none; }
.rpgc-plan .pdt { fill: var(--lumiverse-text-muted, #999); font: 8px system-ui, sans-serif; }
.rpgc-plan .proom rect { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 9%, transparent); stroke: var(--lumiverse-text, #ddd); stroke-opacity: .55; stroke-width: 1.4; }
.rpgc-plan .proom.seen rect { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 3%, transparent); stroke-dasharray: 4 3; stroke-opacity: .4; }
.rpgc-plan .proom.here rect { fill: color-mix(in srgb, #e8b030 20%, transparent); stroke: #e8b030; stroke-opacity: 1; stroke-width: 2; }
.rpgc-plan .proom.sel rect { stroke: var(--lumiverse-accent, #7aa2f7); stroke-opacity: 1; stroke-width: 2.4; }
.rpgc-plan .proom, .rpgc-plan .pr3 { cursor: pointer; outline: none; }
.rpgc-plan .proom:focus-visible rect { stroke: var(--lumiverse-accent, #7aa2f7); stroke-width: 3; }
.rpgc-plan .proom text, .rpgc-plan .pr3 text { fill: var(--lumiverse-text, #ddd); text-anchor: middle; font-family: system-ui, sans-serif; font-weight: 600; pointer-events: none; }
.rpgc-plan .pr3 text { font-size: 7.5px; paint-order: stroke; stroke: var(--lumiverse-bg, #111); stroke-width: 2.4px; }
.rpgc-plan .pstair { font-size: 8px; fill: var(--lumiverse-accent, #7aa2f7); }
.rpgc-plan .pway { fill: none; stroke: var(--lumiverse-accent, #7aa2f7); stroke-opacity: .55; stroke-width: 1.3; stroke-dasharray: 3 3; pointer-events: none; }
.rpgc-plan .pexit { fill: #3fae6a; stroke: var(--lumiverse-bg, #111); stroke-width: 1.2; }
.rpgc-plan .pw circle { fill: #9a9ab0; stroke: var(--lumiverse-bg, #111); stroke-width: 1.4; }
.rpgc-plan .pw.me circle { fill: #e8b030; }
.rpgc-plan .pw path { stroke: #9a9ab0; stroke-width: 1.4; }
.rpgc-plan .pw.me path { stroke: #e8b030; }
.rpgc-plan .pw text { fill: #fff; text-anchor: middle; font-weight: 700; font-family: system-ui, sans-serif; pointer-events: none; }
.rpgc-plan .pflr { opacity: .38; } .rpgc-plan .pflr.cur { opacity: 1; }
.rpgc-plan .pr3 .fl { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, var(--lumiverse-bg, #111)); stroke: var(--lumiverse-text, #ddd); stroke-opacity: .5; stroke-width: .8; }
.rpgc-plan .pr3.seen .fl { stroke-dasharray: 3 2; fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 5%, var(--lumiverse-bg, #111)); }
.rpgc-plan .pr3 .bw { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 22%, var(--lumiverse-bg, #111)); stroke: var(--lumiverse-text, #ddd); stroke-opacity: .35; stroke-width: .6; }
.rpgc-plan .pr3 .bw2 { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, var(--lumiverse-bg, #111)); stroke: var(--lumiverse-text, #ddd); stroke-opacity: .35; stroke-width: .6; }
.rpgc-plan .pr3 .fw, .rpgc-plan .pr3 .fw2 { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 30%, var(--lumiverse-bg, #111)); stroke: none; }
.rpgc-plan .pr3.here .fl { fill: color-mix(in srgb, #e8b030 35%, var(--lumiverse-bg, #111)); stroke: #e8b030; stroke-opacity: 1; }
.rpgc-plan .pr3.sel .fl { stroke: var(--lumiverse-accent, #7aa2f7); stroke-opacity: 1; stroke-width: 1.6; }
.rpgc-plan .pup { fill: none; stroke: var(--lumiverse-accent, #7aa2f7); stroke-width: 1.2; stroke-dasharray: 2 2; }
.rpgc-plan-key { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 6px; margin: 2px 0 4px; }
.rpgc-plan-key .k { display: inline-block; width: 12px; height: 8px; border-radius: 2px; border: 1.4px solid var(--lumiverse-text, #ddd); }
.rpgc-plan-key .k.seen { border-style: dashed; opacity: .6; } .rpgc-plan-key .k.here { border-color: #e8b030; background: color-mix(in srgb, #e8b030 25%, transparent); }
.rpgc-plan-key .k.way { border: none; border-top: 1.6px dashed var(--lumiverse-accent, #7aa2f7); height: 0; } .rpgc-plan-key .k.exit { width: 8px; height: 8px; transform: rotate(45deg); background: #3fae6a; border: none; }
.rpgc-plan-det { margin-top: 4px; } .rpgc-plan-det .k, .rpgc-plan-doors .k { font-size: 11px; opacity: .7; margin-right: 4px; }
.rpgc-plan-doors { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin: 4px 0; }
.rpgc-plan-door { cursor: pointer; }
.rpgc-credit { font-size: 11px; opacity: .7; }
.rpgc-npcbody { margin-top: 4px; } .rpgc-npcbody summary { cursor: pointer; font-size: 12px; }
.rpgc-npcbodyrow { display: grid; grid-template-columns: 110px 1fr; gap: 8px; align-items: start; margin-top: 4px; } .rpgc-npcbodyrow ul { margin: 2px 0 4px 16px; padding: 0; font-size: 12px; }
.rpgc-npcmap svg { width: 110px; height: auto; display: block; } .rpgc-npcbody .cause { font-weight: 600; margin: 0 0 4px; } .rpgc-hlgone.mini { font-size: 10.5px; padding: 3px 6px; margin-bottom: 3px; }
.hlmap .hz.gone path, .hlmap .hz.gone ellipse, .hlmap .hz.gone rect { fill: transparent !important; stroke: #e0443e; stroke-width: 1.4; stroke-dasharray: 3 3; }
.rpgc-picrow { gap: 8px; flex-wrap: wrap; align-items: flex-end; } .rpgc-picsel { display: flex; flex-direction: column; gap: 2px; } .rpgc-picsel small { opacity: .7; }
.rpgc-pictext { width: 100%; box-sizing: border-box; font: inherit; font-size: 12px; margin: 6px 0; }
.rpgc-abilkind { margin: 8px 0 2px; padding-bottom: 2px; border-bottom: 1px solid var(--lumiverse-border, #3334); } .rpgc-abilkind small { opacity: .7; }
.rpgc-imm-cmp { margin: 6px 0; } .rpgc-imm-cmp table { width: 100%; border-collapse: collapse; font-size: 12px; }
.rpgc-imm-cmp th, .rpgc-imm-cmp td { padding: 2px 6px; text-align: center; border-bottom: 1px solid var(--lumiverse-border, #3334); } .rpgc-imm-cmp tbody th { text-align: left; font-weight: 500; opacity: .8; }
.rpgc-imm-cmp th.me { color: #e8b030; } .rpgc-imm-cmp td.lead { font-weight: 700; } .rpgc-imm-cmp td.unk { opacity: .5; }
.rpgc-dnd-num { width: 48px; font: inherit; text-align: center; }
.rpgc-npcst { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 2px 0 4px; } .rpgc-npcst small { opacity: .75; } .rpgc-npcst select { font: inherit; font-size: 12px; }
.rpgc-npcst .st-body { border-color: #e0902f; } .rpgc-npcst .st-free { border-color: #7aa2f7; } .rpgc-npcst .st-mind { border-color: #b07ae0; }
.rpgc-person.dead { opacity: .88; } .rpgc-person.dead > .head { filter: grayscale(.85); opacity: .7; }
.rpgc-invgroup h5 { margin: 6px 0 2px; } .rpgc-invmoney { margin-bottom: 4px; }
.rpgc-vital { display: flex; flex-wrap: wrap; align-items: center; gap: 4px 8px; padding: 6px 10px; border-radius: 9px; margin: 0 0 6px; border: 1px solid var(--lumiverse-border, #3334); }
.rpgc-vital .steps { display: inline-flex; gap: 2px; } .rpgc-vital .steps i { width: 10px; height: 8px; border-radius: 2px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 15%, transparent); }
.rpgc-vital.v1 .steps i.on { background: #e6c13a; } .rpgc-vital.v2 .steps i.on { background: #e0902f; } .rpgc-vital.v3 .steps i.on, .rpgc-vital.v4 .steps i.on { background: #e0443e; }
.rpgc-vital.v3, .rpgc-vital.v4 { border-color: #e0443e; background: color-mix(in srgb, #e0443e 12%, transparent); }
.rpgc-vital .clock { font-weight: 600; color: #e0443e; } .rpgc-vital small { flex-basis: 100%; opacity: .8; }
.rpgc-hlgone { margin: 0 0 6px; padding: 6px 10px; border-radius: 9px; border: 2px solid #e0443e; font-weight: 700; letter-spacing: .02em; font-size: 12px; }
.rpgc-hlfix { display: inline-flex; gap: 4px; margin-left: auto; flex-wrap: wrap; } .rpgc-hlfix select { font: inherit; font-size: 11px; }
.rpgc-hlmap .arteries path.art { fill: none; stroke: #c0392b; stroke-width: 1.4; stroke-linecap: round; opacity: .55; pointer-events: stroke; }
.rpgc-hlmap .arteries path.art.hot { stroke: #ff3b30; stroke-width: 2.6; opacity: 1; animation: rpgc-pulse 0.9s ease-in-out infinite; }
@keyframes rpgc-pulse { 0%, 100% { stroke-opacity: 1; } 50% { stroke-opacity: .35; } }
@media (prefers-reduced-motion: reduce) { .rpgc-hlmap .arteries path.art.hot { animation: none; } }
.rpgc-settabs { display: flex; flex-wrap: wrap; gap: 4px; margin: 2px 0 10px; }
.rpgc-settab { font: inherit; font-size: 12px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--lumiverse-border, #3334); background: transparent; color: inherit; cursor: pointer; }
.rpgc-settab.on { background: var(--lumiverse-accent, #7aa2f7); border-color: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-bg, #111); font-weight: 600; }
.rpgc-atlas-tile .sub { font-size: 10.5px; color: var(--lumiverse-text-muted, #999); display: flex; gap: 6px; flex-wrap: wrap; }
.rpgc-atlas-tile .bar { position: absolute; left: 0; top: 6px; bottom: 6px; width: 3px; border-radius: 3px; }
.rpgc-atlas-tile.generic { border-style: dashed; }
.rpgc-atlas-tile.stub { border-style: dotted; opacity: .65; }
.rpgc-atlas-tile.here { border-color: #e8b030; box-shadow: 0 0 0 1px #e8b030 inset; }
.rpgc-atlas-tile.onpath { border-color: color-mix(in srgb, #e8b030 55%, var(--lumiverse-border, #444)); }
.rpgc-atlas-tile.sel { outline: 2px solid var(--lumiverse-accent, #7aa2f7); outline-offset: 1px; }
.rpgc-atlas-det { margin-top: 8px; border-top: 1px dashed var(--lumiverse-border, #444); padding-top: 6px; font-size: 12px; }
.rpgc-atlas-det p { margin: 3px 0; white-space: pre-line; }
.rpgc-atlas-det .k { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); display: block; margin-top: 6px; }
/* ── New game: the bot's catalog ── */
.rpgc-ng-pages { display: flex; flex-wrap: wrap; gap: 4px; margin: 6px 0; }
.rpgc-ng-pages .rpgc-btn { font-size: 11px; padding: 2px 8px; }
.rpgc-ng-sec { margin-top: 6px; }
.rpgc-ng-sec > .lbl { display: block; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 6px 0 3px 2px; }
.rpgc-ng-item { display: block; width: 100%; text-align: left; border: 1px solid var(--lumiverse-border, #444); border-radius: 8px; padding: 5px 8px; margin: 3px 0; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent); color: var(--lumiverse-text, #ddd); font: inherit; font-size: 12px; cursor: pointer; line-height: 1.35; }
.rpgc-ng-item:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-ng-item.on { border-color: var(--lumiverse-accent, #7aa2f7); box-shadow: 0 0 0 1px var(--lumiverse-accent, #7aa2f7) inset; }
.rpgc-ng-item .c { font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace; font-size: 11.5px; font-weight: 600; }
.rpgc-ng-item .k { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; margin-right: 6px; padding: 0 5px; border-radius: 99px; border: 1px solid currentColor; opacity: .75; }
.rpgc-ng-item .d { display: block; color: var(--lumiverse-text-muted, #999); font-size: 11.5px; margin-top: 2px; }
.rpgc-ng-cmd { width: 100%; box-sizing: border-box; min-height: 64px; font-family: ui-monospace, 'Cascadia Mono', Consolas, monospace; font-size: 12px; }
.rpgc-ng-warn { color: #e0902f; font-size: 12px; margin: 3px 0; }
/* ── OOC guide ── */
.rpgc-ooc-q { font-weight: 600; margin-top: 8px; }
.rpgc-ooc-a { white-space: pre-wrap; border-left: 3px solid var(--lumiverse-accent, #7aa2f7); padding: 4px 8px; margin: 3px 0 0; font-size: 12.5px; line-height: 1.45; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent); border-radius: 0 8px 8px 0; }
/* ── Chronicle: the story's timeline ── */
.rpgc-chron-add { display: flex; gap: 5px; margin: 6px 0; }
.rpgc-chron-add input { flex: 1; min-width: 0; }
.rpgc-chron-loop { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #e8b030; margin: 10px 0 2px; display: flex; align-items: center; gap: 6px; }
.rpgc-chron-loop::after { content: ''; flex: 1; border-top: 1px solid color-mix(in srgb, #e8b030 45%, transparent); }
.rpgc-chron-day { font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #999); margin: 8px 0 2px 2px; }
.rpgc-chron-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.rpgc-chron-item { display: grid; grid-template-columns: 22px 1fr auto; gap: 2px 6px; align-items: start; padding: 5px 6px; border-radius: 8px; border: 1px solid transparent; font-size: 12.5px; line-height: 1.4; }
.rpgc-chron-item:hover { background: var(--lumiverse-fill-subtle, rgba(127,127,127,.08)); }
.rpgc-chron-item .ic { text-align: center; font-size: 13px; line-height: 1.35; }
.rpgc-chron-item .tx { min-width: 0; overflow-wrap: anywhere; }
.rpgc-chron-item .tm { color: var(--lumiverse-text-muted, #999); font-size: 11px; margin-right: 5px; font-variant-numeric: tabular-nums; }
.rpgc-chron-item .who { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 2px; }
.rpgc-chron-item .act { display: flex; gap: 1px; align-items: center; white-space: nowrap; }
.rpgc-chron-item .st { font-size: 11px; width: 16px; text-align: center; }
.rpgc-chron-item .st.sent { color: #7fc99a; }
.rpgc-chron-item .st.wait { color: var(--lumiverse-text-muted, #999); }
.rpgc-chron-item.moment, .rpgc-chron-item.note { border-color: color-mix(in srgb, #e8b030 35%, transparent); background: color-mix(in srgb, #e8b030 6%, transparent); }
.rpgc-chron-item.moment .ic, .rpgc-chron-item.star .ic { color: #e8b030; }
.rpgc-chron-item.big .tx { font-weight: 600; }
.rpgc-chron-item.hidden { opacity: .5; }
.rpgc-chron-item.hidden .tx { text-decoration: line-through; }
.rpgc-chron-cortex { margin-top: 10px; border-top: 1px dashed var(--lumiverse-border, #444); padding-top: 8px; display: flex; flex-direction: column; gap: 5px; font-size: 12px; }
.rpgc-chron-cortex .on { color: #7fc99a; font-weight: 600; }
.rpgc-chron-cortex .off { color: #e88683; font-weight: 600; }
.rpgc-surv { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; padding: 0 6px; border-radius: 999px; border: 1px solid currentColor; white-space: nowrap; }
.rpgc-chip { font-size: 11px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; padding: 0 6px; }
.rpgc-enc-log { max-height: 220px; overflow-y: auto; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
.rpgc-enc-log .player { color: var(--lumiverse-accent, #7aa2f7); font-weight: 600; }
.rpgc-enc-log .enemy { color: #e88683; }
.rpgc-enc-log .party { color: #7fc99a; }
.rpgc-enc-log .system { color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-enc-actions { display: flex; flex-wrap: wrap; gap: 5px; }
.rpgc-enc-actions .lbl { width: 100%; font-size: 11px; color: var(--lumiverse-text-dim, #888); margin-top: 2px; }
.rpgc-enc-result { font-size: 18px; font-weight: 700; text-align: center; padding: 8px 0 2px; }
.rpgc-hud { display: flex; flex-direction: column; gap: 5px; }
.rpgc-hud-row { display: flex; align-items: flex-start; gap: 6px; }
.rpgc-hud-row .body { flex: 1; min-width: 0; display: flex; flex-wrap: wrap; gap: 3px 10px; }
.rpgc-hud-row.pinned { background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 9%, transparent); border-radius: 6px; }
.rpgc-hud-f { display: inline-flex; align-items: baseline; gap: 4px; min-width: 0; }
.rpgc-hud-f .l { font-size: 11px; color: var(--lumiverse-text-dim, #888); }
.rpgc-hud-f .v { word-break: break-word; }
.rpgc-hud-f.frac { flex: 1 1 100%; display: grid; grid-template-columns: minmax(40px, auto) 1fr auto; align-items: center; gap: 8px; }
.rpgc-hud-path { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 4px; font-size: 12px; }
.rpgc-hud-path .seg { padding: 1px 6px; border-radius: 5px; background: var(--lumiverse-fill, rgba(127,127,127,.12)); }
.rpgc-hud-path .seg:last-child { font-weight: 600; }
.rpgc-hud-path .sep { color: var(--lumiverse-text-dim, #777); font-size: 10px; }
.rpgc-hud-mod { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 6px; border: 1px solid var(--lumiverse-border, #444); word-break: break-word; }
.rpgc-hud-arc { font-weight: 600; }
.rpgc-pin { appearance: none; border: 0; background: none; padding: 1px 2px; cursor: pointer; color: var(--lumiverse-text-dim, #777); opacity: .5; line-height: 1; flex: none; }
.rpgc-pin:hover { opacity: 1; }
.rpgc-pin.on { color: var(--lumiverse-accent, #7aa2f7); opacity: 1; }
.rpgc-guard { display: flex; flex-direction: column; gap: 5px; }
.rpgc-guard .line { font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 11px; word-break: break-word; flex: 1; min-width: 0; }
.rpgc-guard .item { display: flex; gap: 6px; align-items: center; }
.rpgc-enc-log .roll { color: #c9a227; font-variant-numeric: tabular-nums; }
.rpgc-quest { display: flex; align-items: center; gap: 6px; }
.rpgc-quest .grow { flex: 1; min-width: 0; }
.rpgc-quest .st { font-size: 10px; text-transform: uppercase; letter-spacing: .04em; padding: 1px 6px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #444); cursor: pointer; }
.rpgc-quest .st.open { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-quest .st.live { color: var(--lumiverse-accent, #7aa2f7); border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-quest .st.closing { color: #c9a227; border-color: #c9a227; }
.rpgc-quest .st.done { opacity: .5; text-decoration: line-through; }
.rpgc-quest .hud { font-size: 10px; color: var(--lumiverse-text-dim, #777); }
.rpgc-song { display: flex; align-items: center; gap: 8px; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; padding: 6px 8px; }
.rpgc-song .note { font-size: 18px; }
.rpgc-song .info { flex: 1; min-width: 0; }
.rpgc-song .info .t { font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpgc-song .info .a { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rpgc-avatar { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; flex: none; background: var(--lumiverse-fill, rgba(127,127,127,.12)); }
.rpgc-char-head .rpgc-avatar-wrap { position: relative; flex: none; }
.rpgc-avatar-btn { appearance: none; border: 1px solid var(--lumiverse-border, #444); background: var(--lumiverse-fill-subtle, transparent); color: var(--lumiverse-text-muted, #aaa); border-radius: 6px; padding: 2px 7px; font: inherit; font-size: 11px; cursor: pointer; }
.rpgc-avatar-btn:hover { color: var(--lumiverse-text, #fff); border-color: var(--lumiverse-border-hover, #666); }
.rpgc-avatar-acts { display: inline-flex; gap: 4px; align-items: center; }
/* ── HMS systems ── */
.rpgc .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.rpgc-danger { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; padding: 7px 10px; border-radius: var(--lumiverse-radius, 8px); border: 1px solid #c0504d; background: color-mix(in srgb, #c0504d 14%, transparent); color: #f0a09d; font-size: 12px; }
.rpgc-danger strong { color: #ff8c87; text-transform: uppercase; letter-spacing: .04em; font-size: 11px; }
.rpgc-cards { display: flex; flex-direction: column; gap: 5px; }
.rpgc-subhead { margin: 10px 0 2px; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; color: var(--lumiverse-text-muted, #999); }
.rpgc-vital { display: flex; flex-direction: column; gap: 3px; margin-bottom: 6px; }
.rpgc-vital .head { display: flex; align-items: baseline; gap: 6px; font-size: 12px; }
.rpgc-vital .lbl { font-weight: 600; }
.rpgc-vital .num { color: var(--lumiverse-text-muted, #aaa); font-variant-numeric: tabular-nums; }
.rpgc-vital .stage { margin-left: auto; color: var(--lumiverse-text-muted, #aaa); font-size: 11px; }
.rpgc-vital .delta { margin-left: auto; font-variant-numeric: tabular-nums; font-size: 11px; padding: 0 5px; border-radius: 99px; }
.rpgc-vital .delta.down { color: #ff8c87; background: color-mix(in srgb, #c0504d 16%, transparent); }
.rpgc-vital .delta.up { color: #8fd18f; background: color-mix(in srgb, #4caf50 16%, transparent); }
.rpgc-lvbar > i.ok { background: #5fae6e; }
.rpgc-lvbar > i.low { background: #d8a33a; }
.rpgc-lvbar > i.critical { background: #d9534f; animation: rpgc-pulse 1.6s ease-in-out infinite; }
@keyframes rpgc-pulse { 50% { opacity: .55; } }
@media (prefers-reduced-motion: reduce) { .rpgc-lvbar > i.critical { animation: none; } }
.rpgc-wound, .rpgc-cond, .rpgc-qcard { border: 1px solid var(--lumiverse-border, #333); border-left-width: 3px; border-radius: 6px; padding: 5px 8px; }
.rpgc-wound .head, .rpgc-cond .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-wound .name, .rpgc-cond .name, .rpgc-qcard .name { font-weight: 600; font-size: 12px; }
.rpgc-wound .meta, .rpgc-cond .meta { font-size: 11px; color: var(--lumiverse-text-muted, #999); margin-top: 1px; }
.rpgc-wound .tag { margin-left: auto; font-size: 11px; padding: 0 6px; border-radius: 99px; border: 1px solid currentColor; }
.rpgc-wound.raw { border-left-color: #d9534f; } .rpgc-wound .tag.raw { color: #ff8c87; }
.rpgc-wound.treated { border-left-color: #d8a33a; } .rpgc-wound .tag.treated { color: #e5c55a; }
.rpgc-wound.healed { border-left-color: #5fae6e; } .rpgc-wound .tag.healed { color: #8fd18f; }
.rpgc-wound.permanent { border-left-color: #8a7fb8; } .rpgc-wound .tag.permanent { color: #b7aee0; }
.rpgc-wound.cosmetic, .rpgc-wound.other { border-left-color: var(--lumiverse-border-hover, #666); }
.rpgc-wound.warn .warn { color: #ff8c87; }
.rpgc-cond { border-left-color: #d8a33a; }
.rpgc-cond.rec { border-left-color: #5fae6e; }
.rpgc-cond.critical { border-left-color: #d9534f; background: color-mix(in srgb, #c0504d 8%, transparent); }
.rpgc-cond .trend { margin-left: auto; font-size: 11px; }
.rpgc-cond .trend.up { color: #ff8c87; } .rpgc-cond .trend.down { color: #8fd18f; } .rpgc-cond .trend.new { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-ladder { display: inline-flex; gap: 2px; }
.rpgc-ladder > i { width: 10px; height: 6px; border-radius: 2px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, transparent); }
.rpgc-ladder > i.on { background: #d8a33a; }
.rpgc-ladder > i.on.top { background: #d9534f; }
.rpgc-ladder.rec > i.on { background: #5fae6e; }
.rpgc-mind-scale { display: flex; flex-wrap: wrap; gap: 3px; margin-top: 6px; }
.rpgc-mind-step { appearance: none; font: inherit; font-size: 11px; padding: 2px 7px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #444); background: none; color: var(--lumiverse-text-muted, #aaa); cursor: pointer; }
.rpgc-mind-step.on { background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); border-color: transparent; }
.rpgc-mind-step.hot.on { background: #d9534f; color: #fff; }
.rpgc-surv { display: flex; align-items: center; gap: 8px; font-size: 12px; margin-bottom: 4px; flex-wrap: wrap; }
.rpgc-surv .lbl { min-width: 60px; font-weight: 600; }
.rpgc-surv .num, .rpgc-surv .own { color: var(--lumiverse-text-muted, #aaa); font-size: 11px; }
.rpgc-surv.hot .num { color: #ff8c87; }
.rpgc-surv-acts { margin-top: 6px; }
.rpgc-abil { margin-bottom: 6px; }
.rpgc-abil h4 { margin: 0 0 3px; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: var(--lumiverse-text-muted, #999); }
.rpgc-chip.abil em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.abil .lv, .rpgc-chip.abil .st { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.mind { border-color: #8a7fb8; color: #b7aee0; }
.rpgc-chip.carrier { border-color: #d9534f; color: #ff8c87; flex: none; }
.rpgc-guard .item.carrier .line { color: #ff8c87; }
.rpgc-hud-block { font-family: var(--lumiverse-font-mono, ui-monospace, monospace); font-size: 11px; padding: 5px 8px; margin: 3px 0; border-radius: 6px; border: 1px dashed var(--lumiverse-border, #444); white-space: pre-wrap; word-break: break-word; }
.rpgc-hud-block .row:first-child { font-weight: 600; }
.rpgc-hud-path .seg.fold { background: none; border: 1px dashed var(--lumiverse-border, #444); color: var(--lumiverse-text-muted, #999); font-style: italic; }
.rpgc-qcard { display: flex; align-items: center; gap: 6px; border-left-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-qcard.closing { border-left-color: #d8a33a; }
.rpgc-qcard.done { border-left-color: #5fae6e; }
.rpgc-qcard.failed { border-left-color: #d9534f; }
.rpgc-qcard.ended, .rpgc-qcard.hidden, .rpgc-qcard.other { border-left-color: var(--lumiverse-border-hover, #666); }
.rpgc .qst { margin-left: auto; font-size: 11px; padding: 0 6px; border-radius: 99px; border: 1px solid currentColor; white-space: nowrap; }
.rpgc .qst.active { color: var(--lumiverse-accent, #7aa2f7); } .rpgc .qst.closing { color: #e5c55a; } .rpgc .qst.done { color: #8fd18f; }
.rpgc .qst.failed { color: #ff8c87; } .rpgc .qst.ended, .rpgc .qst.hidden, .rpgc .qst.other { color: var(--lumiverse-text-muted, #999); }
.rpgc-objs { list-style: none; margin: 0 0 4px; padding: 0; display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.rpgc-objs li { display: flex; gap: 6px; }
.rpgc-objs li .mark { width: 12px; text-align: center; }
.rpgc-objs li.done { color: var(--lumiverse-text-muted, #999); text-decoration: line-through; }
.rpgc-objs li.done .mark { color: #8fd18f; text-decoration: none; }
.rpgc-objs li.active .mark { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-journal li { flex-wrap: wrap; }
.rpgc-journal .path { width: 100%; font-size: 11px; color: var(--lumiverse-text-dim, #777); }
.rpgc-subdet > summary { cursor: pointer; font-size: 12px; color: var(--lumiverse-text-muted, #aaa); margin: 6px 0 3px; }
/* ── Party ── */
.rpgc-sec.alarm > summary .rpgc-sum-extra { color: #ff8c87; }
.rpgc-pcard { border: 1px solid var(--lumiverse-border, #333); border-left: 3px solid var(--lumiverse-accent, #7aa2f7); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 4px; }
.rpgc-pcard.warn { border-left-color: #d8a33a; }
.rpgc-pcard.high { border-left-color: #d9534f; }
.rpgc-pcard.away { opacity: .82; }
.rpgc-pcard .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.rpgc-pcard .head .name { font-weight: 600; }
.rpgc-pcard .head .mood { font-style: italic; color: var(--lumiverse-text-muted, #aaa); font-size: 12px; }
.rpgc-pcard .head .rpgc-chip.here, .rpgc-pcard .head .rpgc-chip.away { margin-left: auto; }
.rpgc-pcard .head .rpgc-avatar { width: 22px; height: 22px; }
.rpgc-chip.here { border-color: #5fae6e; color: #8fd18f; }
.rpgc-chip.away { color: var(--lumiverse-text-muted, #999); }
.rpgc-chip.card em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.card.reg { border-color: #8a7fb8; }
.rpgc-chip.card.band { border-color: #d8a33a; }
.rpgc-chip.card.stage, .rpgc-chip.card.phase { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-palerts { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; font-size: 12px; }
.rpgc-palerts li { padding-left: 14px; position: relative; color: #e5c55a; }
.rpgc-palerts li::before { content: '!'; position: absolute; left: 3px; font-weight: 700; }
.rpgc-palerts li.high { color: #ff8c87; }
.rpgc-palerts li.info { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-pgroup { display: flex; flex-direction: column; gap: 2px; }
.rpgc-pgroup .gt { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-dim, #777); }
.rpgc-pdim { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-pdim .lbl { min-width: 92px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-pdim .w { min-width: 58px; }
.rpgc-pdim.hot .w { color: #ff8c87; }
.rpgc-pdim .trend.worse { color: #ff8c87; } .rpgc-pdim .trend.better { color: #8fd18f; }
.rpgc-pdim .dur { color: var(--lumiverse-text-dim, #777); font-size: 11px; }
.rpgc-ladder.party > i.on { background: #d8a33a; }
.rpgc-ladder.party > i.on.hot { background: #d9534f; }
.rpgc-ladder.party > i.on.good { background: #5fae6e; }
.rpgc-ptell { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-ptell em { font-style: normal; color: #d8a33a; }
.rpgc-pconcern { font-size: 12px; font-style: italic; border-left: 2px solid var(--lumiverse-border, #444); padding-left: 6px; }
.rpgc-suggest .rpgc-btn { font-size: 11px; padding: 2px 7px; }
/* ── Combat v2 ── */
.rpgc-fighter .power { font-size: 11px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-fighter .telegraph { font-size: 11px; font-style: italic; color: #e5c55a; border-left: 2px solid #d8a33a; padding-left: 5px; }
.rpgc-chip.threat { margin-left: auto; font-size: 10px; }
.rpgc-chip.threat.trivial, .rpgc-chip.threat.weaker { color: #8fd18f; border-color: #5fae6e; }
.rpgc-chip.threat.even { color: #e5c55a; border-color: #d8a33a; }
.rpgc-chip.threat.stronger, .rpgc-chip.threat.overwhelming { color: #ff8c87; border-color: #d9534f; }
.rpgc-intel { display: flex; flex-wrap: wrap; gap: 3px; }
.rpgc-chip.intel { font-size: 11px; text-align: left; cursor: default; background: none; }
button.rpgc-chip.intel { cursor: pointer; font: inherit; font-size: 11px; color: inherit; }
button.rpgc-chip.intel:hover { border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-chip.intel em { font-style: normal; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.intel.weakness { border-color: #5fae6e; } .rpgc-chip.intel.resist { border-color: #d9534f; }
.rpgc-chip.intel.intent, .rpgc-chip.intel.tell { border-color: #d8a33a; } .rpgc-chip.intel.power { border-color: #8a7fb8; }
.rpgc-order { display: flex; align-items: center; gap: 5px; font-size: 11px; flex-wrap: wrap; }
.rpgc-order .o { flex: 1; min-width: 0; color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-order .o.own { color: var(--lumiverse-text-dim, #777); font-style: italic; }
.rpgc-order .rpgc-btn { font-size: 11px; padding: 1px 7px; }
.rpgc-mpbar > i.mp { background: #6c8fd9; }
.rpgc-enc-tabs { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-enc-tabs .n { opacity: .6; font-size: 10px; }
.rpgc-enc-tactics { display: flex; flex-wrap: wrap; gap: 4px; padding-top: 4px; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-enc-orderhead { display: flex; flex-direction: column; gap: 2px; }
.rpgc-btn .cost { opacity: .65; font-size: 10px; }
.rpgc-enc-log .order { color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-enc-log .intel { color: #e5c55a; }
.rpgc-enc-log .party.refused { color: #ff8c87; }
/* ── read-layer additions ── */
.rpgc-attrs { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-attr { display: inline-flex; gap: 4px; align-items: baseline; font-size: 12px; padding: 1px 7px; border: 1px solid var(--lumiverse-border, #444); border-radius: 6px; }
.rpgc-attr b { font-size: 10px; letter-spacing: .04em; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-rolls { display: flex; flex-direction: column; gap: 2px; margin-top: 6px; font-size: 12px; }
.rpgc-rollline.win b:last-child { color: #8fd18f; } .rpgc-rollline.lose b:last-child { color: #ff8c87; }
.rpgc-notices { list-style: none; margin: 4px 0 0; padding: 0; font-size: 12px; color: #e5c55a; }
.rpgc-cleared { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; margin-bottom: 4px; }
.rpgc-cleared .rpgc-chip { display: inline-flex; gap: 3px; align-items: center; color: var(--lumiverse-text-muted, #aaa); }
/* ── Themes: variable overrides, so every component follows ── */
.rpgc.theme-parchment { --lumiverse-text: #3a2e1f; --lumiverse-text-muted: #6b5a43; --lumiverse-text-dim: #8a7a62; --lumiverse-border: #b89f78; --lumiverse-border-hover: #8f774f; --lumiverse-accent: #8b4513; --lumiverse-accent-fg: #fff8ec; background: linear-gradient(#f4e9d4, #eadbbd); font-family: Georgia, 'Palatino Linotype', serif; }
.rpgc.theme-midnight { --lumiverse-text: #e6e3ff; --lumiverse-text-muted: #a7a2d6; --lumiverse-text-dim: #77729f; --lumiverse-border: #3a3566; --lumiverse-border-hover: #5a52a0; --lumiverse-accent: #b388ff; --lumiverse-accent-fg: #150f2a; background: radial-gradient(circle at top, #221c44, #0e0b1f); }
.rpgc.theme-terminal { --lumiverse-text: #b8f5b0; --lumiverse-text-muted: #6fcf73; --lumiverse-text-dim: #3f8f45; --lumiverse-border: #1f5f2a; --lumiverse-border-hover: #2f8f3f; --lumiverse-accent: #39ff88; --lumiverse-accent-fg: #021; background: #050b06; font-family: ui-monospace, Menlo, Consolas, monospace; }
.rpgc.theme-sakura { --lumiverse-text: #4a2a3a; --lumiverse-text-muted: #8a5a70; --lumiverse-text-dim: #b08aa0; --lumiverse-border: #f0b8cc; --lumiverse-border-hover: #e08aa8; --lumiverse-accent: #d6457a; --lumiverse-accent-fg: #fff; background: linear-gradient(#fff4f8, #ffe6ef); }
/* ── People ── */
.rpgc-chip.standing { font-size: 11px; }
.rpgc-chip.standing.neg { color: #ff8c87; border-color: #d9534f; } .rpgc-chip.standing.pos { color: #8fd18f; border-color: #5fae6e; }
.rpgc-chip.standing.top { color: #ff9ec4; border-color: #d6457a; } .rpgc-chip.standing.neutral, .rpgc-chip.standing.unknown { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-person { border: 1px solid var(--lumiverse-border, #333); border-left: 3px solid var(--lumiverse-border-hover, #666); border-radius: 8px; padding: 6px 8px; display: flex; flex-direction: column; gap: 3px; }
.rpgc-person.neg { border-left-color: #d9534f; } .rpgc-person.pos { border-left-color: #5fae6e; } .rpgc-person.top { border-left-color: #d6457a; }
.rpgc-person .head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; } .rpgc-person .name { font-weight: 600; }
.rpgc-person .meta { margin-left: auto; font-size: 11px; color: var(--lumiverse-text-dim, #777); }
.rpgc-relrow { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.rpgc-relrow .lbl { min-width: 70px; color: var(--lumiverse-text-muted, #aaa); } .rpgc-relrow .v { min-width: 30px; text-align: right; font-variant-numeric: tabular-nums; }
.rpgc-relrow .d.up { color: #8fd18f; font-size: 11px; } .rpgc-relrow .d.down { color: #ff8c87; font-size: 11px; }
.rpgc-relbar { position: relative; flex: 1; height: 6px; border-radius: 3px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 14%, transparent); overflow: hidden; }
.rpgc-relbar.two::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: var(--lumiverse-text-dim, #777); }
.rpgc-relbar > i { position: absolute; top: 0; bottom: 0; left: 0; border-radius: 3px; } .rpgc-relbar > i.pos { background: #5fae6e; } .rpgc-relbar > i.neg { background: #d9534f; }
.rpgc-hearts, .rpgc-stars { color: #d6457a; letter-spacing: 1px; } .rpgc-stars { color: #e5c55a; } .rpgc-hearts .off, .rpgc-stars .off { opacity: .22; }
.rpgc-people-compact { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; }
.rpgc-people-compact li { display: flex; align-items: center; gap: 6px; font-size: 12px; } .rpgc-people-compact .name { min-width: 90px; font-weight: 600; }
.rpgc-people-compact .rpgc-relrow { flex: 1; } .rpgc-people-compact .rpgc-relrow .lbl { display: none; }
.rpgc-codex { display: grid; grid-template-columns: repeat(auto-fill, minmax(84px, 1fr)); gap: 6px; }
.rpgc-codex-tile { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 4px; border: 1px solid var(--lumiverse-border, #333); border-radius: 8px; text-align: center; font-size: 11px; }
.rpgc-codex-tile .glyph { width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 22%, transparent); }
.rpgc-codex-tile .name { font-weight: 600; } .rpgc-codex-tile.neg .st { color: #ff8c87; } .rpgc-codex-tile.pos .st { color: #8fd18f; } .rpgc-codex-tile.top .st { color: #ff9ec4; }
.rpgc-filters .rpgc-btn { font-size: 11px; padding: 2px 8px; }
/* ── Phone ── */
.rpgc-phone-head { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; padding: 4px 8px; border-radius: 6px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); }
.rpgc-phone-head .bal { font-weight: 600; font-variant-numeric: tabular-nums; }
.rpgc-thread { display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow-y: auto; padding: 4px 0; }
.rpgc-thread .msg { max-width: 82%; padding: 4px 9px; border-radius: 12px; font-size: 12px; line-height: 1.35; }
.rpgc-thread .msg.in { align-self: flex-start; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, transparent); }
.rpgc-thread .msg.out { align-self: flex-end; background: var(--lumiverse-accent, #7aa2f7); color: var(--lumiverse-accent-fg, #111); }
.rpgc-thread .msg.call, .rpgc-thread .msg.pay { align-self: center; background: none; color: var(--lumiverse-text-muted, #aaa); font-style: italic; }
.rpgc-contacts li { align-items: center; } .rpgc-contacts .prev { color: var(--lumiverse-text-dim, #777); font-size: 11px; }
.rpgc-linkbtn { appearance: none; background: none; border: 0; padding: 0; color: inherit; font: inherit; text-align: left; cursor: pointer; }
/* ── Fights: D&D and outcomes ── */
.rpgc-initiative { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; font-size: 11px; }
.rpgc-initiative .slot { padding: 1px 7px; border: 1px solid var(--lumiverse-border, #444); border-radius: 99px; }
.rpgc-initiative .slot.you { border-color: var(--lumiverse-accent, #7aa2f7); } .rpgc-initiative .slot.out { opacity: .4; text-decoration: line-through; }
.rpgc-ac { margin-left: 6px; font-size: 10px; padding: 0 5px; border: 1px solid var(--lumiverse-border, #555); border-radius: 4px; }
.rpgc-deathsaves { font-size: 12px; letter-spacing: 2px; color: #8fd18f; } .rpgc-deathsaves .fail { color: #ff8c87; } .rpgc-deathsaves .off { opacity: .3; }
.rpgc-outcome { margin-left: 6px; font-size: 10px; padding: 0 5px; border-radius: 99px; border: 1px solid currentColor; }
.rpgc-outcome.success { color: #8fd18f; } .rpgc-outcome.partial { color: #e5c55a; } .rpgc-outcome.fail { color: #ff8c87; }
/* ── Relationship cards ── */
.rpgc-relmood { display: flex; gap: 10px; align-items: baseline; font-size: 12px; }
.rpgc-relmood .lbl { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--lumiverse-text-dim, #777); }
.rpgc-relgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px 12px; }
.rpgc-reltile { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.rpgc-reltile .top { display: flex; justify-content: space-between; align-items: baseline; font-size: 12px; }
.rpgc-reltile .lbl { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-reltile .v { font-weight: 700; font-variant-numeric: tabular-nums; } .rpgc-reltile .v small { font-weight: 400; opacity: .6; }
.rpgc-reltile .rpgc-relbar { flex: none; height: 5px; }
.rpgc-reltile .why { font-size: 11px; line-height: 1.3; } .rpgc-reltile .why.up { color: #5fd18f; } .rpgc-reltile .why.down { color: #ff8c87; }
.rpgc-chip.bond { font-size: 11px; color: var(--lumiverse-accent, #7aa2f7); border-color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-chip.bond.pinned::after { content: ' \u2713'; }
.rpgc-chip.minor { font-size: 10px; color: #8fd18f; border-color: #5fae6e; }
.rpgc-dossier { display: grid; grid-template-columns: max-content 1fr; gap: 3px 12px; font-size: 12px; padding: 5px 0; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-dossier .row { display: contents; }
.rpgc-dossier .k { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--lumiverse-text-dim, #777); padding-top: 2px; }
.rpgc-dossier .v { font-style: italic; }
.rpgc-dossier .row.secret .k { color: #ff8c87; } .rpgc-dossier .row.secret .v { color: #ffb3ae; }
/* ── Test zone ── */
.rpgc-tz { display: flex; flex-direction: column; gap: 8px; padding: 10px; border: 1px dashed var(--lumiverse-accent, #7aa2f7); border-radius: 10px; background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 6%, transparent); }
.rpgc-tz-banner { display: flex; flex-direction: column; gap: 2px; font-size: 12px; } .rpgc-tz-banner strong { font-size: 13px; color: var(--lumiverse-accent, #7aa2f7); }
.rpgc-tz-log { display: flex; flex-direction: column; gap: 5px; max-height: 280px; overflow-y: auto; font-size: 12px; }
.rpgc-tz-log .msg { display: flex; gap: 6px; align-items: baseline; } .rpgc-tz-log .who { font-weight: 700; min-width: 38px; flex: none; }
.rpgc-tz-log .msg.user .who { color: var(--lumiverse-accent, #7aa2f7); } .rpgc-tz-log .txt { white-space: pre-wrap; word-break: break-word; }
/* ── Density and text size ── */
.rpgc.density-compact { gap: 6px; padding: 6px 6px 16px; }
.rpgc.density-compact .rpgc-body { gap: 4px; } .rpgc.density-compact .rpgc-person, .rpgc.density-compact .rpgc-pcard { padding: 4px 6px; }
.rpgc.text-small { font-size: 12px; } .rpgc.text-large { font-size: 15px; }
/* ── 1.9 panels ── */
.rpgc-you-head { display: flex; flex-wrap: wrap; gap: 4px; }
.rpgc-chip.hot { color: #ff8c87; border-color: #d9534f; }
.rpgc-vital.levelup .lbl { color: #e5c55a; } .rpgc-chip.levelup { margin-left: auto; color: #e5c55a; border-color: #d8a33a; }
.rpgc-modgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 4px 10px; }
.rpgc-mod { display: flex; gap: 6px; align-items: center; font-size: 12px; cursor: pointer; } .rpgc-mod:not(.on) span { opacity: .55; }
.rpgc-qcard { flex-direction: column; align-items: stretch; gap: 3px; } .rpgc-qcard .qhead { display: flex; align-items: center; gap: 6px; }
.rpgc-qcard .obj { font-size: 12px; } .rpgc-qcard.focus { box-shadow: 0 0 0 1px #e5c55a inset; } .rpgc-mini.star { color: #e5c55a; }
.rpgc-float { position: fixed; z-index: 9990; width: 380px; height: 70vh; min-width: 260px; min-height: 160px; display: flex; flex-direction: column; resize: both; overflow: hidden;
    border: 1px solid var(--lumiverse-border, #444); border-radius: 10px; background: var(--lumiverse-bg, #15151b); box-shadow: 0 10px 40px rgba(0,0,0,.5); }
.rpgc-float.big { width: 640px; height: 88vh; } .rpgc-float.min { height: auto !important; resize: none; } .rpgc-float.min > .rpgc { display: none; }
.rpgc-float-bar { display: flex; align-items: center; gap: 4px; padding: 5px 8px; cursor: move; user-select: none; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 8%, transparent); }
.rpgc-float-bar .ttl { flex: 1; font-weight: 700; font-size: 12px; } .rpgc-float > .rpgc { flex: 1; overflow-y: auto; }
.rpgc-parked { padding: 16px; }
/* ── wiki banners: section headers and cards take a world's wiki look through these variables ── */
.rpgc .rpgc-sec > summary { background: var(--rpgc-banner-bg, transparent); color: var(--rpgc-banner-fg, inherit); border-radius: var(--rpgc-banner-radius, inherit); justify-content: var(--rpgc-banner-align, flex-start); }
.rpgc .rpgc-sec > summary .rpgc-sum-extra { color: var(--rpgc-banner-muted, var(--lumiverse-text-muted, #999)); }
.rpgc .rpgc-sec { background: var(--rpgc-card-bg, var(--lumiverse-fill-subtle, transparent)); }
.rpgc .rpgc-person > .head, .rpgc .rpgc-pcard > .head { background: var(--rpgc-infobox-bg, transparent); color: var(--rpgc-infobox-fg, inherit); margin: var(--rpgc-infobox-margin, 0); padding: var(--rpgc-infobox-pad, 0); border-radius: 6px 6px 0 0; }
.rpgc .rpgc-filters .rpgc-btn.primary, .rpgc .rpgc-enc-tabs .rpgc-btn.primary { background: var(--rpgc-tab-bg, var(--lumiverse-accent, #7aa2f7)); color: var(--rpgc-tab-fg, var(--lumiverse-accent-fg, #111)); }
/* Re:Zero wiki: near-black panels, violet banners, cyan links, an icy frame */
.rpgc.theme-rezero { --lumiverse-text: #ecebf5; --lumiverse-text-muted: #b3aed0; --lumiverse-text-dim: #7d7899; --lumiverse-border: #3a2f5c; --lumiverse-accent: #2ad4cf; --lumiverse-accent-fg: #06201f;
    --rpgc-banner-bg: #7b5bb8; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #e6ddff; --rpgc-card-bg: #0f0d15; --rpgc-infobox-bg: #6a2dff; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #5b2bff; --rpgc-tab-fg: #fff;
    background: linear-gradient(#0b0a10, #0b0a10) padding-box, linear-gradient(160deg, #cfe7f7, #8fb6db 45%, #e8f4fb) border-box; border: 3px solid transparent; }
/* Overlord wiki: charcoal, grey uppercase banners, blue links, deep red */
.rpgc.theme-overlord { --lumiverse-text: #eaeaea; --lumiverse-text-muted: #b8b8b8; --lumiverse-text-dim: #858585; --lumiverse-border: #4a4a4a; --lumiverse-accent: #7fa8ff; --lumiverse-accent-fg: #0a1020;
    --rpgc-banner-bg: linear-gradient(#444, #333); --rpgc-banner-fg: #fff; --rpgc-banner-muted: #d0d0d0; --rpgc-card-bg: #161616; --rpgc-infobox-bg: #3a3a3a; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #555; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at top, #2a0d0d, #0c0c0c 55%); font-family: Georgia, 'Times New Roman', serif; }
.rpgc.theme-overlord .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .05em; }
/* Classroom of the Elite wiki: sky page, white cards, magenta accent, red infobox headers */
.rpgc.theme-cote { --lumiverse-text: #1d2433; --lumiverse-text-muted: #4f5b70; --lumiverse-text-dim: #7c889c; --lumiverse-border: #f0bdd0; --lumiverse-accent: #e3326f; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(#f0578e, #d92a62); --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe3ee; --rpgc-card-bg: #ffffff; --rpgc-infobox-bg: #d61f3c; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #e2335e; --rpgc-tab-fg: #fff;
    background: linear-gradient(#cfe6f8, #e8f3fc 40%, #dbeefb); font-family: 'Segoe UI', system-ui, sans-serif; }
/* Mushoku Tensei wiki: cream cards, a red header bar, brown-orange tabs */
.rpgc.theme-mushoku { --lumiverse-text: #3b2a1e; --lumiverse-text-muted: #6d5642; --lumiverse-text-dim: #9a846c; --lumiverse-border: #e2cfae; --lumiverse-accent: #b5652a; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: #c0392b; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe0d8; --rpgc-card-bg: #fdf7ea; --rpgc-infobox-bg: #b83a2f; --rpgc-infobox-fg: #fff; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #b5652a; --rpgc-tab-fg: #fff;
    background: linear-gradient(#f3e3c4, #faf1de 30%, #efd9b4); }
/* D&D: a player's handbook — parchment, dragon red, serif */
.rpgc.theme-dnd { --lumiverse-text: #2b1d12; --lumiverse-text-muted: #5b4632; --lumiverse-text-dim: #8b7358; --lumiverse-border: #c9ad7f; --lumiverse-accent: #9b1c1c; --lumiverse-accent-fg: #fff5e6;
    --rpgc-banner-bg: #8e1b1b; --rpgc-banner-fg: #f7e9cf; --rpgc-banner-muted: #f0d9b0; --rpgc-card-bg: #f6ecd6; --rpgc-infobox-bg: #58180d; --rpgc-infobox-fg: #f7e9cf; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #9b1c1c; --rpgc-tab-fg: #fff5e6;
    background: #eee0c2; font-family: 'Bookman Old Style', Georgia, serif; }
/* Heaven: ivory, gold, soft sky */
.rpgc.theme-heaven { --lumiverse-text: #3b3526; --lumiverse-text-muted: #6d6550; --lumiverse-text-dim: #9d9478; --lumiverse-border: #eadba8; --lumiverse-accent: #c79a2a; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(90deg, #f6e7b0, #fff8e1, #f6e7b0); --rpgc-banner-fg: #5a4710; --rpgc-card-bg: rgba(255,255,255,.75); --rpgc-tab-bg: #c79a2a; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at top, #ffffff, #eaf5ff 55%, #fdf6e0); }
/* Horror: black, bone, dried blood */
.rpgc.theme-horror { --lumiverse-text: #d6cfcf; --lumiverse-text-muted: #9b8f8f; --lumiverse-text-dim: #6c6262; --lumiverse-border: #3a1010; --lumiverse-accent: #a30f0f; --lumiverse-accent-fg: #fff;
    --rpgc-banner-bg: linear-gradient(#240707, #140404); --rpgc-banner-fg: #e8d9d9; --rpgc-card-bg: #0d0a0a; --rpgc-infobox-bg: #3a0808; --rpgc-infobox-fg: #f0e0e0; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #6e0b0b; --rpgc-tab-fg: #fff;
    background: radial-gradient(ellipse at center, #140909, #030202 75%); font-family: Georgia, serif; }
/* ── World themes ── */
/* Undertale: black boxes, white borders, pixel type, the yellow of MERCY and the orange of the buttons */
.rpgc.theme-undertale { --lumiverse-text: #ffffff; --lumiverse-text-muted: #c8c8c8; --lumiverse-text-dim: #8a8a8a; --lumiverse-border: #ffffff; --lumiverse-accent: #ffe600; --lumiverse-accent-fg: #000;
    --rpgc-banner-bg: #000; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #ffe600; --rpgc-card-bg: #000; --rpgc-infobox-bg: #000; --rpgc-infobox-fg: #ffe600; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #ff7f27; --rpgc-tab-fg: #000;
    background: #000; font-family: 'Determination Mono', 'Press Start 2P', 'VT323', 'Courier New', monospace; letter-spacing: .02em; }
.rpgc.theme-undertale .rpgc-sec { border: 2px solid #fff; border-radius: 0; }
.rpgc.theme-undertale .rpgc-sec > summary::before { content: '* '; color: #fff; }
.rpgc.theme-undertale .rpgc-btn { border-radius: 0; border-color: #ff7f27; color: #ff7f27; }
.rpgc.theme-undertale .rpgc-btn.primary { background: #ff7f27; color: #000; }
/* Dark Souls: ash and stone, ember light, carved serif capitals */
.rpgc.theme-darksouls { --lumiverse-text: #d9d1c0; --lumiverse-text-muted: #a69c88; --lumiverse-text-dim: #716a5e; --lumiverse-border: #3b342a; --lumiverse-border-hover: #6a5a44; --lumiverse-accent: #e07b39; --lumiverse-accent-fg: #140a04;
    --rpgc-banner-bg: linear-gradient(#2a241c, #17130e); --rpgc-banner-fg: #eadcb8; --rpgc-banner-muted: #bfae88; --rpgc-card-bg: #12100d; --rpgc-infobox-bg: #2a2117; --rpgc-infobox-fg: #f0e2c0; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #8a4a1f; --rpgc-tab-fg: #fff3e6;
    background: radial-gradient(ellipse at bottom, rgba(224,123,57,.14), transparent 60%), linear-gradient(#0f0e0c, #070605); font-family: 'Optimus Princeps', 'Cinzel', 'Trajan Pro', Georgia, serif; }
.rpgc.theme-darksouls .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .08em; }
/* Skyrim: smoke-black menus, bone-white type, thin rules, pale gold */
.rpgc.theme-skyrim { --lumiverse-text: #ebe6d6; --lumiverse-text-muted: #b5ae9b; --lumiverse-text-dim: #7e796c; --lumiverse-border: #4a473f; --lumiverse-border-hover: #7a7564; --lumiverse-accent: #d9c58a; --lumiverse-accent-fg: #15130c;
    --rpgc-banner-bg: linear-gradient(90deg, transparent, rgba(235,230,214,.14), transparent); --rpgc-banner-fg: #f1ebd8; --rpgc-banner-muted: #c9c1aa; --rpgc-card-bg: rgba(14,14,13,.9); --rpgc-infobox-bg: #1d1c19; --rpgc-infobox-fg: #f1ebd8; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #3a372f; --rpgc-tab-fg: #f1ebd8;
    background: radial-gradient(ellipse at top, #22242a, #0b0b0b 65%); font-family: Futura, 'Century Gothic', 'Trebuchet MS', sans-serif; }
.rpgc.theme-skyrim .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .14em; font-weight: 400; border-top: 1px solid rgba(235,230,214,.25); border-bottom: 1px solid rgba(235,230,214,.25); }
.rpgc.theme-hell { --lumiverse-text: #ffd9cf; --lumiverse-text-muted: #e09a88; --lumiverse-text-dim: #a8624f; --lumiverse-border: #5a1a12; --lumiverse-border-hover: #8a2a1a; --lumiverse-accent: #ff4d2e; --lumiverse-accent-fg: #1a0200; background: radial-gradient(ellipse at bottom, #3a0a04, #0d0202 70%); }
.rpgc.theme-space { --lumiverse-text: #d8ecff; --lumiverse-text-muted: #93b4d6; --lumiverse-text-dim: #5c7897; --lumiverse-border: #1b2a44; --lumiverse-border-hover: #2d4670; --lumiverse-accent: #4fd1ff; --lumiverse-accent-fg: #021018;
    background: radial-gradient(1px 1px at 12% 18%, #fff, transparent), radial-gradient(1px 1px at 68% 34%, #cfe8ff, transparent), radial-gradient(1.5px 1.5px at 40% 72%, #fff, transparent), radial-gradient(1px 1px at 86% 82%, #bfe0ff, transparent), radial-gradient(ellipse at top, #0e1a33, #04060d 70%); }
.rpgc-weather-layer { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.rpgc-wp { position: absolute; will-change: transform; }
.rpgc-snow { color: #fff; opacity: .85; animation: rpgc-fall linear infinite; top: -5%; }
.rpgc-rain { width: 2px; height: 14px; background: linear-gradient(transparent, rgba(174,194,224,.75)); animation: rpgc-rain linear infinite; top: -5%; }
.rpgc-mist { left: -20%; width: 140%; height: 40%; background: radial-gradient(ellipse at center, rgba(200,200,210,.16), transparent 70%); animation: rpgc-drift ease-in-out infinite alternate; }
.rpgc-leaf { color: rgba(210,200,170,.6); animation: rpgc-wind linear infinite; top: -5%; }
.rpgc-flash { position: absolute; inset: 0; background: rgba(255,255,255,.5); opacity: 0; animation: rpgc-flash ease-out infinite; }
.rpgc-glow { position: absolute; border-radius: 50%; filter: blur(30px); }
@keyframes rpgc-fall { to { transform: translateY(110vh) translateX(4vw); } }
@keyframes rpgc-rain { to { transform: translateY(110vh); } }
@keyframes rpgc-drift { to { transform: translateX(8%); } }
@keyframes rpgc-wind { to { transform: translate(110vw, 20vh) rotate(360deg); } }
@keyframes rpgc-flash { 0%,92%,100% { opacity: 0; } 94% { opacity: .8; } 96% { opacity: .1; } 98% { opacity: .6; } }
@media (prefers-reduced-motion: reduce) { .rpgc-wp, .rpgc-flash { animation: none !important; } .rpgc-flash { display: none; } }
@media (prefers-reduced-motion: reduce) { .rpgc-bar > i { transition: none; } }
/* ── The guide: roomy lines, left-aligned, nothing justified ── */
.rpgc-guide { font-size: 14px; line-height: 1.65; }
.rpgc-guide .rpgc-body p { margin: 0 0 10px; }
.rpgc-guide h4 { margin: 14px 0 6px; font-size: 14px; }
.rpgc-guide ul, .rpgc-guide ol { margin: 0 0 10px; padding-left: 20px; }
.rpgc-guide li { margin: 3px 0; }
.rpgc-guide code { font-family: ui-monospace, monospace; font-size: 12.5px; padding: 0 3px; border-radius: 4px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); }
.rpgc-guide pre { white-space: pre-wrap; word-break: break-word; font-family: ui-monospace, monospace; font-size: 12px; line-height: 1.5; padding: 8px; border-radius: 6px; margin: 0 0 10px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); }
.rpgc-guide table { width: 100%; border-collapse: collapse; margin: 0 0 12px; font-size: 13px; line-height: 1.5; }
.rpgc-guide th, .rpgc-guide td { text-align: left; vertical-align: top; padding: 5px 6px; border-bottom: 1px solid var(--lumiverse-border, #333); }
.rpgc-guide th { font-weight: 600; }
.rpgc-guide .rpgc-guide-intro { font-size: 13px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-guide input[type=search] { font-size: 14px; padding: 7px 9px; margin: 6px 0 10px; }
.rpgc-guide mark { background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 35%, transparent); color: inherit; border-radius: 3px; }
/* Minds (from FrankenSIM) */
.rpgc-mind { display: flex; flex-direction: column; gap: 4px; padding-top: 5px; margin-top: 2px; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-mind .gt, .rpgc-pair .gt, .rpgc-chips.facets .gt { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-dim, #777); }
.rpgc-mind h5 { margin: 8px 0 2px; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.feel { font-weight: 600; } .rpgc-chip.feel small { font-weight: 400; opacity: .85; }
.rpgc-chip.ax.warm { border-color: #5fae6e; } .rpgc-chip.ax.cold { border-color: #d9534f; }
.rpgc-chip.hot { border-color: #d9534f; color: #ff8c87; } .rpgc-chip.lead { border-color: var(--lumiverse-accent, #8c82ff); color: var(--lumiverse-accent, #8c82ff); font-weight: 600; }
.rpgc-chip.gate { display: inline-flex; align-items: center; gap: 4px; } .rpgc-ladder.gate > i.on { background: #d6457a; }
.rpgc-chip.mode { border-color: #8a7fb8; color: #b7aee0; }
.rpgc-tfdy { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 4px 12px; font-size: 12px; }
.rpgc-tfdy .ax { display: flex; align-items: center; justify-content: space-between; gap: 6px; } .rpgc-tfdy .lbl { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-ladder.tf > i.on { background: #d8a33a; } .rpgc-ladder.tf > i.base { outline: 1px solid var(--lumiverse-text-muted, #aaa); outline-offset: 1px; }
.rpgc-pair { display: flex; flex-direction: column; gap: 4px; padding: 6px 0 2px; border-top: 1px dotted var(--lumiverse-border, #444); }
.rpgc-row.tight { gap: 6px; flex-wrap: wrap; align-items: center; }
.rpgc-ax .rpgc-relbar { position: relative; overflow: visible; } .rpgc-ax .rpgc-relbar > i { overflow: hidden; }
.rpgc-ax .rpgc-relbar > b.set { position: absolute; top: -2px; bottom: -2px; width: 2px; margin-left: -1px; background: var(--lumiverse-text, #ddd); opacity: .7; border-radius: 1px; }
.rpgc-ax .v .up { color: #5fd18f; } .rpgc-ax .v .down { color: #ff8c87; }
.rpgc-simwarn { font-size: 12px; color: #e5c55a; } .rpgc-simwarn.debt { color: #ffb3ae; }
.rpgc-simlog { list-style: none; margin: 0; padding: 0; font-size: 11.5px; display: flex; flex-direction: column; gap: 2px; }
.rpgc-simlog .when { color: var(--lumiverse-text-dim, #777); margin-right: 6px; }
.rpgc-agenda { display: flex; gap: 6px; align-items: baseline; font-size: 12px; } .rpgc-agenda.late .ic { filter: grayscale(.3); }
.rpgc-knows { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; }
.rpgc-knows li { display: flex; gap: 6px; align-items: baseline; } .rpgc-knows .fact { flex: 1; } .rpgc-knows .src { font-size: 11px; color: var(--lumiverse-text-dim, #777); white-space: nowrap; }
.rpgc-knows li.wrong .fact { text-decoration: underline wavy #d9534f; text-underline-offset: 3px; } .rpgc-knows li.wrong .src { color: #ff8c87; }
.rpgc-chekhov li { display: flex; gap: 6px; align-items: center; } .rpgc-chekhov li .mark { width: 14px; text-align: center; }
.rpgc-chekhov li.ripe .grow { font-weight: 600; } .rpgc-chekhov li.locked { opacity: .75; } .rpgc-chekhov li.fired .grow { text-decoration: line-through; opacity: .7; }
.rpgc-note.credit { border-left: 2px solid var(--lumiverse-accent, #8c82ff); padding-left: 6px; }
/* ── 2.2 look ── */
/* a little polish for every theme */
.rpgc-sec[open] > summary { border-bottom: 1px solid color-mix(in srgb, var(--lumiverse-border, #444) 55%, transparent); }
.rpgc-bar { height: 9px; box-shadow: inset 0 1px 2px rgba(0,0,0,.28); }
.rpgc-bar > i { background-image: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.26)); }
.rpgc-person { background: color-mix(in srgb, var(--lumiverse-text, #ddd) 3.5%, transparent); border-radius: 10px; padding: 8px 10px; gap: 5px; }
.rpgc-chip { padding: 1px 8px; line-height: 1.5; }
.rpgc-btn { transition: background-color .15s ease, border-color .15s ease; }
.rpgc-btn:hover:not([disabled]) { border-color: var(--lumiverse-accent, #8c82ff); }
.rpgc :focus-visible { outline: 2px solid var(--lumiverse-accent, #8c82ff); outline-offset: 2px; }
.rpgc-thought { font-style: italic; border: 1px solid color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 45%, transparent); border-left-width: 1px; border-radius: 14px; padding: 6px 11px; margin: 2px 0 9px;
    background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 8%, transparent); position: relative; }
.rpgc-thought::after { content: ''; position: absolute; left: 16px; bottom: -8px; width: 9px; height: 9px; border-radius: 50%; background: color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 30%, transparent);
    box-shadow: -8px 6px 0 -2px color-mix(in srgb, var(--lumiverse-accent, #7aa2f7) 30%, transparent); }
/* the day dial */
.rpgc-dial { display: flex; align-items: center; gap: 12px; border: 1px solid var(--lumiverse-border, #333); border-radius: 12px; padding: 8px 12px;
    background: linear-gradient(135deg, color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 10%, transparent), transparent 70%); }
.rpgc-dial .face { flex: 0 0 84px; width: 84px; height: 84px; color: var(--lumiverse-accent, #8c82ff); }
.rpgc-dial .face svg { width: 100%; height: 100%; display: block; }
.rpgc-dial .read { flex: 1; min-width: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 2px 12px; }
.rpgc-dial .big { grid-column: 1 / -1; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.rpgc-dial .big b { font-size: 26px; font-weight: 600; letter-spacing: .01em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.rpgc-dial .cell { display: flex; flex-direction: column; border-top: 1px solid color-mix(in srgb, var(--lumiverse-border, #444) 60%, transparent); padding-top: 3px; min-width: 0; }
.rpgc-dial .cell span { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--lumiverse-text-dim, #777); }
.rpgc-dial .cell b { font-weight: 600; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* Perch, the mascot */
.rpgc-perch { width: 26px; height: 26px; border-radius: 8px; flex: 0 0 auto; display: block; }
.rpgc-perch-card { display: flex; align-items: center; gap: 12px; border: 1px dashed var(--lumiverse-border, #444); border-radius: 12px; padding: 10px 12px; }
.rpgc-perch-card img { width: 72px; height: 72px; border-radius: 14px; flex: 0 0 auto; }
.rpgc-perch-card b { display: block; font-size: 14px; margin-bottom: 2px; }
/* easy reading: more air between letters, words and lines; upright text */
.rpgc.rpgc-easy { font-size: 14.5px; line-height: 1.65; letter-spacing: .035em; word-spacing: .12em; }
.rpgc.rpgc-easy .rpgc-note, .rpgc.rpgc-easy .rpgc-chip, .rpgc.rpgc-easy .rpgc-btn { font-size: 13px; }
.rpgc.rpgc-easy i, .rpgc.rpgc-easy em, .rpgc.rpgc-easy .rpgc-thought, .rpgc.rpgc-easy .chant { font-style: normal; }
.rpgc.rpgc-easy p, .rpgc.rpgc-easy li { max-width: 68ch; }
.rpgc.rpgc-easy .rpgc-sec > summary { font-size: 15px; }
/* SCP Foundation: a typed report. Paper, black rules, one red stamp. */
.rpgc.theme-scp { --lumiverse-text: #151515; --lumiverse-text-muted: #4f4c46; --lumiverse-text-dim: #7a766d; --lumiverse-border: #151515; --lumiverse-border-hover: #151515; --lumiverse-accent: #9c1c1c; --lumiverse-accent-fg: #fff; --lumiverse-fill-subtle: #ebe9e2;
    --rpgc-banner-bg: #141414; --rpgc-banner-fg: #f3f2ee; --rpgc-banner-muted: #c9c5b8; --rpgc-card-bg: #f3f2ee; --rpgc-infobox-bg: #141414; --rpgc-infobox-fg: #f3f2ee; --rpgc-infobox-margin: -6px -8px 4px; --rpgc-infobox-pad: 5px 8px; --rpgc-tab-bg: #141414; --rpgc-tab-fg: #f3f2ee;
    background: #f3f2ee; font-family: 'Courier New', ui-monospace, monospace; }
.rpgc.theme-scp .rpgc-sec { border: 1px solid #151515; border-radius: 0; background: #f3f2ee; }
.rpgc.theme-scp .rpgc-sec > summary { text-transform: uppercase; letter-spacing: .08em; font-size: 12px; }
.rpgc.theme-scp .rpgc-sec > summary::before { content: '■ '; color: #9c1c1c; }
.rpgc.theme-scp .rpgc-btn, .rpgc.theme-scp .rpgc-chip, .rpgc.theme-scp .rpgc-person, .rpgc.theme-scp .rpgc-dial { border-radius: 0; }
.rpgc.theme-scp .rpgc-btn { border-color: #151515; } .rpgc.theme-scp .rpgc-btn.primary { background: #151515; color: #f3f2ee; }
.rpgc-scp-stamp { display: inline-block; border: 2px solid #9c1c1c; color: #9c1c1c; padding: 1px 8px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; transform: rotate(-3deg); font-size: 11px; }
.rpgc-scp-nights { display: grid; grid-template-columns: repeat(12, 1fr); gap: 3px; margin: 2px 0; }
.rpgc-scp-nights i { height: 14px; border: 1px solid currentColor; display: block; } .rpgc-scp-nights i.done { background: currentColor; opacity: .55; } .rpgc-scp-nights i.now { background: #9c1c1c; border-color: #9c1c1c; }
.rpgc-scp-code { font-family: 'Courier New', ui-monospace, monospace; letter-spacing: .14em; background: #151515; color: #f3f2ee; padding: 0 6px; }
/* four looks of the extension's own */
.rpgc.theme-lantern { --lumiverse-text: #f2e6d2; --lumiverse-text-muted: #c2ab8a; --lumiverse-text-dim: #8f7a5f; --lumiverse-border: #57402e; --lumiverse-border-hover: #8a6a48; --lumiverse-accent: #f0a14c; --lumiverse-accent-fg: #1c1510; --lumiverse-fill-subtle: rgba(240,161,76,.06);
    --rpgc-banner-bg: #4a2f1a; --rpgc-banner-fg: #ffdca6; --rpgc-banner-muted: #e2c08e; --rpgc-card-bg: #231a13; --rpgc-infobox-bg: #2a1f16; --rpgc-infobox-fg: #ffdca6; --rpgc-tab-bg: #6e4524; --rpgc-tab-fg: #ffdca6;
    background: #1c1510; font-family: Georgia, 'Times New Roman', serif; }
.rpgc.theme-tidepool { --lumiverse-text: #e4f2ef; --lumiverse-text-muted: #a0c1bc; --lumiverse-text-dim: #6f918c; --lumiverse-border: #2c4c4f; --lumiverse-border-hover: #3f6b6e; --lumiverse-accent: #70d7c5; --lumiverse-accent-fg: #0f2427; --lumiverse-fill-subtle: rgba(112,215,197,.06);
    --rpgc-banner-bg: #1a4a4e; --rpgc-banner-fg: #ebfffb; --rpgc-banner-muted: #a9d9d1; --rpgc-card-bg: #132c30; --rpgc-infobox-bg: #17353a; --rpgc-infobox-fg: #ebfffb; --rpgc-tab-bg: #1f5c5e; --rpgc-tab-fg: #ebfffb;
    background: #0f2427; }
.rpgc.theme-dusk { --lumiverse-text: #f1e9f8; --lumiverse-text-muted: #baaace; --lumiverse-text-dim: #87779c; --lumiverse-border: #41335b; --lumiverse-border-hover: #5d4a80; --lumiverse-accent: #f3a7c9; --lumiverse-accent-fg: #221a2f; --lumiverse-fill-subtle: rgba(243,167,201,.06);
    --rpgc-banner-bg: #57407a; --rpgc-banner-fg: #fff; --rpgc-banner-muted: #dcc7ee; --rpgc-card-bg: #2a2139; --rpgc-infobox-bg: #312743; --rpgc-infobox-fg: #fff; --rpgc-tab-bg: #6b4b8d; --rpgc-tab-fg: #fff;
    background: #221a2f; }
.rpgc.theme-dusk .rpgc-btn, .rpgc.theme-dusk .rpgc-sec, .rpgc.theme-tidepool .rpgc-sec { border-radius: 12px; }
.rpgc.theme-paper { --lumiverse-text: #2e2419; --lumiverse-text-muted: #6b5a45; --lumiverse-text-dim: #948168; --lumiverse-border: #d9c8a9; --lumiverse-border-hover: #b9a47e; --lumiverse-accent: #8b3046; --lumiverse-accent-fg: #fff7ea; --lumiverse-fill-subtle: #efe3cc;
    --rpgc-banner-bg: #7b303c; --rpgc-banner-fg: #fff7ea; --rpgc-banner-muted: #f0d9c2; --rpgc-card-bg: #fbf5ea; --rpgc-infobox-bg: #efe3cc; --rpgc-infobox-fg: #2e2419; --rpgc-tab-bg: #7b303c; --rpgc-tab-fg: #fff7ea;
    background: #f6efe2; font-family: Georgia, 'Times New Roman', serif; }
.rpgc.theme-paper .rpgc-sec { background: #fbf5ea; border-style: dashed; }
/* Characters: card facts and profiles */
.rpgc-sheet { display: flex; flex-direction: column; gap: 3px; padding-top: 5px; margin-top: 2px; border-top: 1px dashed var(--lumiverse-border, #444); font-size: 12px; }
.rpgc-sheet .gt { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-dim, #777); }
.rpgc-sheet .row { display: flex; gap: 6px; align-items: baseline; } .rpgc-sheet .row .k { flex: 0 0 52px; color: var(--lumiverse-text-muted, #aaa); font-size: 11px; } .rpgc-sheet .row .v { flex: 1; }
.rpgc-sheet .row input { flex: 1; min-width: 0; }
.rpgc-levels { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 6px; }
.rpgc-level { appearance: none; text-align: left; border: 1px solid var(--lumiverse-border, #444); border-radius: 8px; padding: 6px 8px; background: none; color: inherit; font: inherit; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
.rpgc-level b { font-size: 13px; } .rpgc-level span { font-size: 11.5px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-level.on { border-color: var(--lumiverse-accent, #8c82ff); box-shadow: inset 0 0 0 1px var(--lumiverse-accent, #8c82ff); }
/* Spell list (from the lorebook) */
.rpgc-spellbox { display: flex; flex-direction: column; gap: 5px; }
.rpgc-spellbox .bar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rpgc-spellbox .bar input[type=search] { flex: 1 1 120px; min-width: 0; }
.rpgc-spell { border-left: 2px solid var(--lumiverse-border, #444); padding-left: 6px; margin: 2px 0; }
.rpgc-spell > summary { cursor: pointer; font-size: 12.5px; } .rpgc-spell > summary .rk { color: var(--lumiverse-text-muted, #aaa); font-size: 11.5px; }
.rpgc-spell.known { border-left-color: #5fae6e; } .rpgc-spell.reach { border-left-color: var(--lumiverse-accent, #8c82ff); } .rpgc-spell.next { border-left-color: #d8a33a; border-left-style: dashed; }
.rpgc-spell.locked > summary, .rpgc-spell.special > summary { opacity: .75; }
.rpgc-spell .body { display: flex; flex-direction: column; gap: 3px; font-size: 12px; padding: 3px 0 6px; }
.rpgc-spell .chant { font-style: italic; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-chip.sknown { border-color: #5fae6e; color: #8fd18f; } .rpgc-chip.sreach { border-color: var(--lumiverse-accent, #8c82ff); color: var(--lumiverse-accent, #8c82ff); } .rpgc-chip.snext { border-style: dashed; border-color: #d8a33a; color: #e5c55a; }
.rpgc-spellnote { font-size: 12px; border: 1px solid var(--lumiverse-border, #444); border-radius: 6px; padding: 4px 6px; display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.rpgc-spellnote.study { border-color: var(--lumiverse-accent, #8c82ff); } .rpgc-spellnote.up { border-color: #5fae6e; }
/* Gates (card progression) */
.rpgc-gate { display: flex; flex-direction: column; gap: 4px; padding-top: 5px; margin-top: 2px; border-top: 1px dashed var(--lumiverse-border, #444); }
.rpgc-gate .gt, .rpgc-gateroad .gt { font-size: 10px; text-transform: uppercase; letter-spacing: .06em; color: var(--lumiverse-text-dim, #777); }
.rpgc-chip.gnow { border-color: var(--lumiverse-accent, #8c82ff); color: var(--lumiverse-accent, #8c82ff); font-weight: 600; }
.rpgc-chip.gopen { border-style: dashed; border-color: #d8a33a; color: #e5c55a; }
.rpgc-gatemap { display: flex; flex-wrap: wrap; align-items: center; gap: 3px; }
.rpgc-gatemap .st { min-width: 20px; height: 20px; padding: 0 5px; box-sizing: border-box; display: inline-flex; align-items: center; justify-content: center; border-radius: 99px; border: 1px solid var(--lumiverse-border, #444); font-size: 11px; line-height: 1; color: var(--lumiverse-text-dim, #777); }
.rpgc-gatemap .st.done { border-color: #5fae6e; color: #8fd18f; }
.rpgc-gatemap .st.now { background: var(--lumiverse-accent, #8c82ff); border-color: var(--lumiverse-accent, #8c82ff); color: #fff; font-weight: 700; }
.rpgc-gatemap .st.open { border-style: dashed; border-color: #d8a33a; color: #e5c55a; }
.rpgc-gatemap .st.closed { text-decoration: line-through; opacity: .55; }
.rpgc-gatemap .st.side { border-radius: 4px; }
.rpgc-gatemap .arrow { color: var(--lumiverse-text-dim, #777); font-size: 10px; }
.rpgc-gatepend { display: flex; flex-direction: column; gap: 3px; font-size: 12px; border: 1px solid #d8a33a; border-radius: 6px; padding: 4px 6px; }
.rpgc-gateroad { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
.rpgc-gateroad li { display: flex; flex-direction: column; gap: 1px; padding-left: 8px; border-left: 2px solid var(--lumiverse-border, #444); }
.rpgc-gateroad li.done { border-left-color: #5fae6e; } .rpgc-gateroad li.now { border-left-color: var(--lumiverse-accent, #8c82ff); } .rpgc-gateroad li.open { border-left-color: #d8a33a; border-left-style: dashed; }
.rpgc-gateroad li.locked, .rpgc-gateroad li.closed { opacity: .72; }
.rpgc-gateroad .ph { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; } .rpgc-gateroad .ph b { font-weight: 600; }
.rpgc-gateroad .trig { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-gatewait { font-size: 12px; color: #e5c55a; }
.rpgc-spell.thin { display: block; padding: 2px 4px; font-size: 12.5px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-spell.thin .rpgc-chip { font-size: 10.5px; }
.rpgc-spirits .rpgc-spirit { margin: 6px 0; padding: 7px 10px; border: 1px solid var(--lumiverse-border, #3a3a48); border-radius: 10px; background: var(--lumiverse-fill-subtle, rgba(255,255,255,.03)); }
.rpgc-spirits .rpgc-spirit > summary { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; cursor: pointer; }
.rpgc-rungs { display: flex; gap: 3px; margin: 8px 0 4px; }
.rpgc-rungs span { flex: 1; padding: 2px 0; text-align: center; font-size: 10.5px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #3a3a48); color: var(--lumiverse-text-dim, #777); }
.rpgc-rungs span.past { color: var(--lumiverse-text-muted, #aaa); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 14%, transparent); }
.rpgc-rungs span.now { color: var(--lumiverse-accent-fg, #fff); background: var(--lumiverse-accent, #8c82ff); border-color: var(--lumiverse-accent, #8c82ff); font-weight: 700; }
.rpgc-chip.el-fire { border-color: #d9583b; color: #f08a6a; } .rpgc-chip.el-water { border-color: #3b7fd9; color: #7fb2f0; }
.rpgc-chip.el-wind { border-color: #3bb07a; color: #79d6a6; } .rpgc-chip.el-earth { border-color: #a27a45; color: #d1a66d; }
.rpgc-chip.el-yin { border-color: #7a52c7; color: #b494ef; } .rpgc-chip.el-yang { border-color: #d6b03a; color: #f0d27a; }
.rpgc-clauses .lbl { display: block; margin-top: 6px; font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #aaa); }
/* ───────── 2.5: powers and race ───────── */
.rpgc-powers .rpgc-power { margin: 6px 0; padding: 7px 10px; border: 1px solid var(--lumiverse-border, #3a3a48); border-radius: 10px; background: var(--lumiverse-fill-subtle, rgba(255,255,255,.03)); }
.rpgc-powers .rpgc-power > summary { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; cursor: pointer; }
.rpgc-powers .fam-affliction { border-color: color-mix(in srgb, #d9583b 45%, var(--lumiverse-border, #3a3a48)); }
.rpgc-powers .fam-staged { border-color: color-mix(in srgb, #7a52c7 45%, var(--lumiverse-border, #3a3a48)); }
.rpgc-powers .fam-gift { border-color: color-mix(in srgb, #d6b03a 40%, var(--lumiverse-border, #3a3a48)); }
.rpgc-pcount { margin-left: auto; font-size: 11px; color: var(--lumiverse-text-dim, #777); }
.rpgc-pentry { margin: 8px 0 2px; } .rpgc-pentry h5, .rpgc-race h5 { margin: 6px 0 2px; font-size: 12px; }
.rpgc-pfields { display: grid; grid-template-columns: minmax(90px, max-content) 1fr; gap: 3px 10px; margin: 4px 0; font-size: 12.5px; }
.rpgc-pfields dt { color: var(--lumiverse-text-muted, #aaa); } .rpgc-pfields dd { margin: 0; }
.rpgc-racehead { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; } .rpgc-racehead .nm { font-size: 16px; }
.rpgc-racetower { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; margin: 8px 0 2px; font-size: 12.5px; }
.rpgc-racetower .fl { padding: 2px 8px; border-radius: 99px; border: 1px solid var(--lumiverse-border, #3a3a48); }
.rpgc-racetower .fl.now { border-color: var(--lumiverse-accent, #8c82ff); color: var(--lumiverse-accent, #8c82ff); font-weight: 600; }
.rpgc-racetower .fl.folded { opacity: .6; font-style: italic; } .rpgc-racetower .up { color: var(--lumiverse-text-dim, #777); font-size: 10px; }
.rpgc-racebody { display: grid; grid-template-columns: 160px 1fr; gap: 10px; align-items: start; margin: 8px 0; }
.rpgc-racepic svg { width: 100%; height: auto; display: block; }
.rpgc-racepic .body, .rpgc-racepic .body * { fill: color-mix(in srgb, var(--lumiverse-text, #ddd) 30%, transparent); stroke: none; }
.rpgc-racepic .limb { fill: none !important; stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 30%, transparent) !important; stroke-width: 9; stroke-linecap: round; }
.rpgc-racepic .limb.leg { stroke-width: 11; }
.rpgc-racepic .ghost, .rpgc-racepic .ghost * { fill: none; stroke: var(--lumiverse-text-dim, #777); stroke-width: 1.4; stroke-dasharray: 3 3; }
.rpgc-racepic .ghost .limb { stroke-width: 1.4 !important; stroke: var(--lumiverse-text-dim, #777) !important; }
.rpgc-racepic .sh * { fill: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 70%, transparent); stroke: var(--lumiverse-accent, #8c82ff); stroke-width: 1.2; }
.rpgc-racepic .hid * { fill: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 12%, transparent); stroke: var(--lumiverse-accent, #8c82ff); stroke-width: 1.4; stroke-dasharray: 4 3; }
.rpgc-racepic .line { fill: none !important; stroke-width: 3 !important; }
.rpgc-racepic .gauze { fill: rgba(170, 210, 255, .26) !important; stroke: rgba(170, 210, 255, .8) !important; stroke-width: 1.2 !important; }
.rpgc-racepic .halo { fill: none; stroke: #e5c55a; stroke-width: 2.4; } .rpgc-racepic .mark { fill: #e05a6a; }
.rpgc-racepic .bone { fill: var(--lumiverse-bg, #15151b); stroke: var(--lumiverse-bg, #15151b); stroke-width: 2.4; }
.rpgc-racepic .tex { fill: none; stroke: var(--lumiverse-bg, #15151b); stroke-width: 1.4; }
.rpgc-racepic .cap { font-size: 11px; text-anchor: middle; fill: var(--lumiverse-text-dim, #777); }
/* ───────── 2.6: Body & health ───────── */
.rpgc-hlbody { display: grid; grid-template-columns: 190px 1fr; gap: 12px; align-items: start; margin: 8px 0; }
@media (max-width: 460px) { .rpgc-hlbody { grid-template-columns: 1fr; } .rpgc-hlmap { max-width: 210px; margin: 0 auto; } }
.rpgc-hlmap svg { width: 100%; height: auto; display: block; }
.rpgc-awayline { margin: 2px 0 4px; font-size: 12px; } .rpgc-awayline small { color: var(--lumiverse-text-dim, #888); }
.rpgc-person.away, .rpgc-pcard.away { opacity: .82; }
.rpgc-racepic .slime > * { fill: rgba(126, 186, 240, .38); stroke: #3d7cc9; stroke-width: 2.4; }
.rpgc-racepic .slime .shade { fill: rgba(70, 130, 205, .42); stroke: none; }
.rpgc-racepic .slime .core { fill: rgba(40, 92, 170, .7); stroke: none; }
.rpgc-racepic .slime .gloss { fill: rgba(255, 255, 255, .78); stroke: none; }
.rpgc-racepic .body.gel, .rpgc-racepic .gel .body, .rpgc-racepic .gel.body * { fill: rgba(126, 186, 240, .42) !important; }
.rpgc-racepic .gel .limb { stroke: rgba(126, 186, 240, .5) !important; }
.rpgc-raceshape .rpgc-row { flex-wrap: wrap; gap: 4px; align-items: center; }
.rpgc-raceshape input[type=text] { flex: 1 1 140px; min-width: 0; }
.rpgc-raceshape .lbl { min-width: 64px; font-size: 12px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-evolved { color: var(--lumiverse-accent, #8c82ff); font-weight: 600; }
.rpgc-evo { padding-left: 18px; } .rpgc-evo small { color: var(--lumiverse-text-dim, #777); }
.rpgc-hlmap .brk { pointer-events: none; } .rpgc-hlmap .brk .gap { stroke: #0b0f14; stroke-width: 3.4; } .rpgc-hlmap .brk .crack { fill: none; stroke: #fff; stroke-width: 1.6; stroke-linejoin: bevel; filter: url(#hlglow); } .rpgc-hlmap .brk .chip { stroke: #fff; stroke-width: 1.2; }
.rpgc-hlmap .brk.splint .crack, .rpgc-hlmap .brk.splint .chip { stroke: #ffe08a; filter: none; } .rpgc-hlmap .brk .spl { fill: #e8d2a6; stroke: #5a4630; stroke-width: .5; }
.rpgc-hlmap .brk.mend .crack, .rpgc-hlmap .brk.mend .chip { stroke: #ffe08a; opacity: .85; filter: none; } .rpgc-hlmap .brk.crooked .crack, .rpgc-hlmap .brk.crooked .chip { stroke: #d0d0d8; filter: none; } .rpgc-hlmap .brk .kink { fill: none; stroke: #fff; stroke-width: 1.4; }
.rpgc-hlmap .org { pointer-events: none; }
.rpgc-hlmap .org > * { fill: none; stroke: rgba(150, 220, 255, .32); stroke-width: 1; }
.rpgc-hlmap .org.bad > * { fill: color-mix(in srgb, var(--oc) 60%, transparent); stroke: var(--oc); stroke-width: 1.3; filter: url(#hlglow); }
.rpgc-hlmap .org.special > * { stroke: rgba(150, 255, 220, .55); stroke-dasharray: 2 1.5; }
.rpgc-hlmap .org.out > * { fill: rgba(150, 255, 220, .28); stroke: rgba(150, 255, 220, .85); }
.rpgc-hlmap .gelmap { fill: rgba(126, 186, 240, .12); stroke: rgba(150, 210, 255, .55); stroke-width: 1.4; }
.rpgc-org.st-hurt { border-color: #e6c13a; } .rpgc-org.st-out { border-color: #4fbf7a; }
.rpgc-hlmap.nobones .bones { display: none; }
.rpgc-hlmap.gel .flesh > *, .rpgc-hlmap.gel .flesh g > * { fill: rgba(126, 186, 240, .14); stroke: rgba(150, 210, 255, .5); }
.rpgc-hlmap .hz.slimez.hurt > * { fill: color-mix(in srgb, var(--hz) 16%, transparent); filter: none; }
.rpgc-hlmap .slimewound { fill: var(--wc); stroke: none; filter: url(#hlglow); pointer-events: none; }
.rpgc-hlmeas { display: grid; grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); gap: 6px; margin: 4px 0; }
.rpgc-hlmeas > div { border: 1px solid var(--lumiverse-border, #3a3a48); border-radius: 8px; padding: 4px 8px; font-size: 12px; }
.rpgc-hlmeas b { display: block; font-size: 14px; } .rpgc-hlmeas small { color: var(--lumiverse-text-dim, #777); }
.rpgc-hlmeas input { width: 100%; box-sizing: border-box; }
.rpgc-sec .rpgc-row > select { max-width: 100%; min-width: 0; }
.rpgc-hlmap .bg { fill: #070b0e; stroke: color-mix(in srgb, var(--lumiverse-text, #ddd) 18%, transparent); }
.rpgc-hlmap .grid path { stroke: rgba(150, 200, 220, .06); stroke-width: 1; }
.rpgc-hlmap .flesh > * , .rpgc-hlmap .flesh g > * { fill: rgba(190, 215, 230, .07); stroke: rgba(190, 215, 230, .28); stroke-width: 1; }
.rpgc-hlmap .bones, .rpgc-hlmap .bones * { fill: none; stroke: rgba(225, 240, 245, .42); stroke-width: 1.3; stroke-linecap: round; }
.rpgc-hlmap .bones circle { fill: rgba(225, 240, 245, .08); }
.rpgc-hlmap.undead .flesh > *, .rpgc-hlmap.undead .flesh g > * { fill: rgba(190, 215, 230, .02); stroke-dasharray: 3 3; }
.rpgc-hlmap.undead .bones, .rpgc-hlmap.undead .bones * { stroke: rgba(235, 245, 250, .75); }
.rpgc-hlmap .hz { cursor: pointer; outline: none; }
.rpgc-hlmap .hz > *, .rpgc-hlmap .hz g > * { fill: transparent; stroke: transparent; stroke-width: 1.4; }
.rpgc-hlmap .hz:hover > *, .rpgc-hlmap .hz:hover g > *, .rpgc-hlmap .hz:focus-visible > *, .rpgc-hlmap .hz:focus-visible g > * { stroke: rgba(225, 240, 245, .7); }
.rpgc-hlmap .hz.hurt > *, .rpgc-hlmap .hz.hurt g > * { fill: color-mix(in srgb, var(--hz) 55%, transparent); stroke: var(--hz); filter: url(#hlglow); }
.rpgc-hlmap .hz.sel > *, .rpgc-hlmap .hz.sel g > * { stroke: #fff; stroke-width: 2; stroke-dasharray: 4 2; }
.rpgc-hlmap .lockmark { font-size: 11px; text-anchor: middle; pointer-events: none; }
.rpgc-hlcaps { display: grid; gap: 5px; }
.rpgc-hlcap { display: grid; grid-template-columns: 100px 1fr 40px; align-items: center; gap: 6px; font-size: 12.5px; }
.rpgc-hlcap .bar { height: 7px; border-radius: 99px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 12%, transparent); overflow: hidden; }
.rpgc-hlcap .bar i { display: block; height: 100%; background: #4fbf7a; border-radius: inherit; }
.rpgc-hlcap.low .bar i { background: #e0a33a; } .rpgc-hlcap.crit .bar i { background: #e0443e; }
.rpgc-hlcap .val { text-align: right; font-variant-numeric: tabular-nums; }
.rpgc-hlcap .why { grid-column: 1 / -1; margin-top: -3px; color: var(--lumiverse-text-dim, #888); font-size: 11px; }
.rpgc-hlmeters { flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.rpgc-hllocks { margin: 8px 0; padding: 8px 10px; border-radius: 10px; border: 1px solid #b3122e; background: color-mix(in srgb, #b3122e 12%, transparent); }
.rpgc-hllocks ul { margin: 4px 0; padding-left: 18px; } .rpgc-hllocks small { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-hlwounds li { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
.rpgc-hlwounds .dot { width: 9px; height: 9px; border-radius: 50%; background: var(--hz); box-shadow: 0 0 6px var(--hz); flex: none; }
.rpgc-hltray { flex-wrap: wrap; gap: 4px; }
.rpgc-racetry { flex-wrap: wrap; gap: 4px; margin: 6px 0; } .rpgc-racetry .lbl { font-size: 12px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-racelegend { list-style: none; margin: 0; padding: 0; font-size: 12.5px; } .rpgc-racelegend li { margin: 3px 0; }
.rpgc-racelegend li.hid b { text-decoration: underline dashed; } .rpgc-racelegend .rpgc-chip { margin-left: 6px; font-size: 10.5px; }
@media (max-width: 420px) { .rpgc-racebody { grid-template-columns: 1fr; } .rpgc-racepic { max-width: 160px; margin: 0 auto; } }
/* ───────── 2.3: the wide window ───────── */
.rpgc-wide-back { position: fixed; inset: 0; z-index: 9000; background: rgba(0,0,0,.5); }
.rpgc-wide-box { position: fixed; z-index: 9001; left: 50%; top: 50%; transform: translate(-50%, -50%); width: min(1180px, 94vw); height: min(880px, 90vh);
    display: flex; border-radius: 16px; overflow: hidden; background: var(--lumiverse-bg, #15151b); border: 1px solid var(--lumiverse-border, #333);
    box-shadow: 0 30px 80px -20px rgba(0,0,0,.85); }
.rpgc-wide-back[hidden], .rpgc-wide-box[hidden], .rpgc-launch[hidden] { display: none !important; }
.rpgc.rpgc-is-wide { flex: 1; min-width: 0; height: 100%; padding: 0; gap: 0; display: grid; grid-template-columns: auto minmax(0, 1fr); overflow: hidden; }
.rpgc-rail { display: flex; flex-direction: column; gap: 3px; padding: 14px 10px; min-width: 62px; box-sizing: border-box; overflow-y: auto;
    border-right: 1px solid var(--lumiverse-border, #333); background: color-mix(in srgb, var(--lumiverse-text, #ddd) 3.5%, transparent); }
.rpgc-rail.labels { width: 200px; }
.rpgc-rail button { display: flex; align-items: center; gap: 10px; width: 100%; box-sizing: border-box; padding: 9px 10px; border: 1px solid transparent; border-radius: 10px;
    background: transparent; color: var(--lumiverse-text-muted, #aaa); font: inherit; font-size: 13px; font-weight: 600; text-align: left; cursor: pointer; }
.rpgc-rail button:hover { background: color-mix(in srgb, var(--lumiverse-text, #ddd) 7%, transparent); color: var(--lumiverse-text, #ddd); }
.rpgc-rail button[aria-current="page"] { background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 18%, transparent);
    border-color: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 50%, transparent); color: var(--lumiverse-accent, #8c82ff); }
.rpgc-rail button.empty:not([aria-current="page"]) { opacity: .5; }
.rpgc-rail .ico { flex: 0 0 22px; width: 22px; height: 22px; display: inline-flex; align-items: center; justify-content: center; }
.rpgc-rail .ico svg { width: 20px; height: 20px; display: block; }
.rpgc-rail .ico img { width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 0 0 2px color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 70%, transparent); }
.rpgc-rail .n { margin-left: auto; font-size: 11px; padding: 0 7px; border-radius: 99px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 10%, transparent); }
.rpgc-rail:not(.labels) .lbl, .rpgc-rail:not(.labels) .n { display: none; }
.rpgc-rail:not(.labels) button { justify-content: center; padding: 9px; }
.rpgc-rail .sep { height: 1px; margin: 7px 4px; background: var(--lumiverse-border, #333); }
.rpgc-rail .grow { flex: 1; }
.rpgc-wmain { display: flex; flex-direction: column; min-width: 0; min-height: 0; overflow: hidden; }
.rpgc-whead { display: flex; align-items: center; gap: 14px; padding: 18px 22px 14px; border-bottom: 1px solid var(--lumiverse-border, #333);
    background: linear-gradient(115deg, color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 16%, transparent), transparent 62%); }
.rpgc-whead .pico { flex: 0 0 44px; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--lumiverse-accent, #8c82ff);
    border: 1px solid color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 45%, transparent); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 13%, transparent); }
.rpgc-whead .pico svg { width: 22px; height: 22px; }
.rpgc-whead .ttl { min-width: 0; }
.rpgc-whead h2 { position: relative; margin: 0; font-size: 20px; line-height: 1.2; }
.rpgc-whead h2::before { content: ''; position: absolute; left: 0; top: -8px; width: 24px; height: 3px; border-radius: 3px; background: var(--lumiverse-accent, #8c82ff); }
.rpgc-whead .sub { margin: 3px 0 0; font-size: 12.5px; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-whead .acts { margin-left: auto; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.rpgc-whead .acts .rpgc-top { flex-wrap: nowrap; }
.rpgc-whead .acts .rpgc-top .rpgc-mode { flex: 0 1 auto; }
.rpgc-whead .xbtn, .rpgc-whead .dockbtn { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--lumiverse-border, #444); background: transparent; color: inherit; font-size: 18px; line-height: 1; cursor: pointer; }
.rpgc-whead .xbtn:hover, .rpgc-whead .dockbtn:hover { border-color: var(--lumiverse-accent, #8c82ff); }
.rpgc-whead .dockbtn { font-size: 16px; }
.rpgc-wbody { flex: 1; min-height: 0; overflow-y: auto; padding: 16px 22px 30px; display: flex; flex-direction: column; gap: 12px; }
.rpgc-wlead { display: flex; flex-direction: column; gap: 8px; }
.rpgc-wcols { columns: 2 420px; column-gap: 16px; }
.rpgc-wcols > * { break-inside: avoid; margin: 0 0 14px; }
.rpgc-wcols.solo { columns: auto; }
.rpgc-wcols.solo .rpgc-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 12px; align-items: start; }
.rpgc-wone { width: 100%; max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 12px; }
.rpgc-wbody .rpgc-sec { border-radius: 12px; }
.rpgc-wbody .rpgc-sec > summary { padding: 11px 14px; font-size: 14px; }
.rpgc-wempty { border: 1px dashed var(--lumiverse-border, #444); border-radius: 12px; padding: 22px; text-align: center; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-launch { position: fixed; z-index: 8999; right: 18px; bottom: 18px; width: 54px; height: 54px; padding: 0; border-radius: 50%; cursor: pointer;
    display: flex; align-items: center; justify-content: center; overflow: hidden; color: var(--lumiverse-accent, #8c82ff);
    border: 2px solid var(--lumiverse-accent, #8c82ff); background: var(--lumiverse-bg, #15151b); box-shadow: 0 10px 26px -10px rgba(0,0,0,.8); }
.rpgc-launch img { width: 100%; height: 100%; object-fit: cover; display: block; }
.rpgc-launch svg { width: 24px; height: 24px; }
.rpgc-launch.dragging { cursor: grabbing; transform: scale(1.06); transition: none; box-shadow: 0 0 0 4px color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 45%, transparent), 0 14px 30px -10px rgba(0,0,0,.85); }
.rpgc-launch { touch-action: none; user-select: none; -webkit-user-select: none; }
.rpgc-launch:hover { box-shadow: 0 0 0 4px color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 30%, transparent), 0 10px 26px -10px rgba(0,0,0,.8); }
@media (max-width: 760px) {
  .rpgc-wide-box { width: 100vw; height: 100vh; border-radius: 0; }
  .rpgc-rail.labels { width: auto; } .rpgc-rail .lbl, .rpgc-rail .n { display: none; } .rpgc-rail button { justify-content: center; }
  .rpgc-whead .sub { display: none; }
  .rpgc-whead { flex-wrap: wrap; gap: 10px; padding: 12px 12px 10px; } .rpgc-whead .ttl { flex: 1 1 auto; } .rpgc-whead .acts .rpgc-mode { display: none; }
  /* 2.8: one column on phones (the wide window and Settings stack instead of squeezing two) */
  .rpgc-wcols { columns: 1 !important; } .rpgc-wcols.solo .rpgc-cards, .rpgc-wbody .rpgc-cards { grid-template-columns: 1fr !important; }
  .rpgc-wbody { padding: 10px 10px 24px; } .rpgc-scene { grid-template-columns: 1fr; }
  .rpgc-settabs { flex-wrap: nowrap; overflow-x: auto; } .rpgc-settab { flex: 0 0 auto; }
  .rpgc-hlbody { grid-template-columns: 1fr !important; } .rpgc-hlmap { max-width: 230px; margin: 0 auto; }
  .rpgc-plan svg { max-height: 360px; }
}
/* ───────── 2.3: the clock ───────── */
.rpgc-dial { flex-wrap: wrap; position: relative; }
.rpgc-scene { position: relative; flex: 1 0 100%; height: 58px; border-radius: 9px; overflow: hidden; background: linear-gradient(var(--sky-a, #4e95dc), var(--sky-b, #bfe1f6)); }
.rpgc-scene .orb { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border-radius: 50%; }
.rpgc-scene .orb.sun { background: #ffe9a3; box-shadow: 0 0 10px 4px rgba(255,214,120,.65); }
.rpgc-scene .orb.moon { background: #f2f0e6; box-shadow: 0 0 8px 2px rgba(240,240,255,.35); }
.rpgc-scene .orb.moon::after { content: ''; position: absolute; left: 4px; top: -2px; width: 14px; height: 14px; border-radius: 50%; background: var(--sky-a, #0b1026); }
.rpgc-scene .orb.dim { opacity: .35; }
.rpgc-scene .star { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff; opacity: .8; animation: rpgc-twinkle 3s ease-in-out infinite; }
.rpgc-scene .cloud { position: absolute; height: 12px; border-radius: 12px; background: rgba(255,255,255,.75); filter: blur(1px); animation: rpgc-cloud 40s linear infinite; }
.rpgc-scene.dark .cloud { background: rgba(90,96,112,.85); }
.rpgc-scene .drop { position: absolute; top: -10px; width: 1px; height: 9px; background: rgba(210,225,255,.75); animation: rpgc-drop .7s linear infinite; }
.rpgc-scene .flake { position: absolute; top: -6px; width: 3px; height: 3px; border-radius: 50%; background: #fff; animation: rpgc-flake 4s linear infinite; }
.rpgc-scene.blizzard .flake { animation-duration: 1.6s; }
.rpgc-scene .mist { position: absolute; left: -10%; right: -10%; height: 12px; background: linear-gradient(90deg, transparent, rgba(235,240,245,.55), transparent); animation: rpgc-mist 9s ease-in-out infinite alternate; }
.rpgc-scene .gust { position: absolute; height: 1px; width: 40px; background: rgba(255,255,255,.6); animation: rpgc-gust 2.4s linear infinite; }
.rpgc-scene .flash { position: absolute; inset: 0; background: #fff; opacity: 0; animation: rpgc-flash 7s infinite; }
.rpgc-scene .ground { position: absolute; left: 0; right: 0; bottom: 0; width: 100%; height: 22px; display: block; }
.rpgc-scene.night .ground, .rpgc-scene.dusk .ground { filter: brightness(.45); }
.rpgc-scene.night.winter .ground, .rpgc-scene.dusk.winter .ground { filter: brightness(.8) saturate(.7); }
.rpgc-scene .speck { position: absolute; bottom: 4px; width: 3px; height: 3px; border-radius: 50%; }
.rpgc-scene .tag { position: absolute; right: 7px; top: 5px; font-size: 10.5px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.7); }
@keyframes rpgc-twinkle { 50% { opacity: .25; } }
@keyframes rpgc-cloud { from { transform: translateX(0); } to { transform: translateX(60px); } }
@keyframes rpgc-drop { to { transform: translate(-4px, 76px); } }
@keyframes rpgc-flake { to { transform: translate(14px, 70px); } }
@keyframes rpgc-mist { to { transform: translateX(8%); } }
@keyframes rpgc-gust { from { transform: translateX(-60px); } to { transform: translateX(420px); } }
@media (prefers-reduced-motion: reduce) { .rpgc-scene *, .rpgc-lcd .col { animation: none !important; } }
.rpgc-dial .face.astro { color: var(--lumiverse-accent, #d4a437); }
.rpgc-dial.digital .face { flex: 0 0 auto; width: auto; height: auto; }
.rpgc-lcd { position: relative; padding: 8px 12px 9px; border-radius: 10px; min-width: 132px; box-sizing: border-box;
    border: 1px solid color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 55%, transparent);
    background: repeating-linear-gradient(0deg, color-mix(in srgb, var(--lumiverse-text, #ddd) 4%, transparent) 0 1px, transparent 1px 3px), color-mix(in srgb, var(--lumiverse-text, #ddd) 5%, transparent); }
.rpgc-lcd .digits { position: relative; display: block; font-family: ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace; font-size: 34px; font-weight: 300;
    line-height: 1; letter-spacing: .04em; font-variant-numeric: tabular-nums; color: var(--lumiverse-accent, #8c82ff); }
.rpgc-lcd .ghost { position: absolute; left: 0; top: 0; opacity: .08; }
.rpgc-lcd .col { animation: rpgc-blink 2s steps(1) infinite; }
@keyframes rpgc-blink { 50% { opacity: .25; } }
.rpgc-lcd .hours { display: grid; grid-template-columns: repeat(24, 1fr); gap: 2px; margin-top: 7px; }
.rpgc-lcd .hours i { height: 4px; border-radius: 1px; background: color-mix(in srgb, var(--lumiverse-text, #ddd) 14%, transparent); }
.rpgc-lcd .hours i.past { background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 55%, transparent); }
.rpgc-lcd .hours i.now { background: var(--lumiverse-accent, #8c82ff); }
.rpgc-dial.digital .big b, .rpgc-dial.game .big b, .rpgc-dial.pixel .big b { display: none; }
.rpgc-dial .face.game { color: var(--lumiverse-accent, #8c82ff); }
.rpgc-dial .face.crystal { color: var(--lumiverse-text-dim, #777); }
.rpgc-dial .read .wx { grid-column: 1 / -1; display: flex; align-items: center; gap: 8px; margin-top: 4px; padding: 5px 9px; border-radius: 9px; border: 1px solid var(--lumiverse-border, #3a3a48); background: var(--lumiverse-fill-subtle, rgba(255,255,255,.03)); font-size: 13px; }
.rpgc-dial .read .wx .ico { font-size: 16px; line-height: 1; }
.rpgc-dial .read .wx .t { margin-left: auto; font-variant-numeric: tabular-nums; font-size: 15px; }
.rpgc-dial .read button.wx { font: inherit; color: inherit; background: none; cursor: pointer; text-align: left; width: 100%; }
.rpgc-dial .read button.wx:hover, .rpgc-dial .read button.wx.on { border-color: var(--lumiverse-accent, #8c82ff); }
.rpgc-dial .read .wx .more { opacity: .6; font-size: 11px; margin-left: 4px; }
.rpgc-dial .read .wx .w + .more { margin-left: auto; }
.rpgc-wxd { flex: 1 0 100%; display: grid; gap: 4px; margin-top: 4px; padding: 8px 10px; border-radius: 10px; border: 1px solid var(--lumiverse-border, #3a3a48); background: var(--lumiverse-fill-subtle, rgba(255,255,255,.03)); font-size: 12px; }
.rpgc-wxd .r { display: grid; grid-template-columns: 130px 1fr; gap: 8px; align-items: baseline; }
.rpgc-wxd .k { color: var(--lumiverse-text-dim, #888); font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
.rpgc-wxd .r.dim .v { color: var(--lumiverse-text-muted, #aaa); }
.rpgc-easy .rpgc-wxd { font-size: 14px; } .rpgc-easy .rpgc-wxd .k { text-transform: none; letter-spacing: 0; }
/* ───────── 2.3: letters, notes, books and texts in the panel ───────── */
.rpgc-shelf { display: flex; flex-wrap: wrap; gap: 5px; }
.rpgc-shelf button { display: inline-flex; align-items: center; gap: 6px; max-width: 100%; padding: 4px 10px; border-radius: 99px; cursor: pointer; font: inherit; font-size: 12px;
    border: 1px solid var(--lumiverse-border, #444); background: transparent; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-shelf button[aria-pressed="true"] { border-color: var(--lumiverse-accent, #8c82ff); color: var(--lumiverse-text, #ddd); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 14%, transparent); }
.rpgc-shelf button .t { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 220px; }
.rpgc-paper { position: relative; margin-top: 8px; padding: 16px 18px; font-size: 14px; line-height: 1.65; border-radius: 4px; box-shadow: 0 10px 22px -14px rgba(0,0,0,.8); }
.rpgc-paper .ph { display: flex; flex-wrap: wrap; gap: 2px 12px; align-items: baseline; margin-bottom: 10px; font-size: 11.5px; letter-spacing: .04em; }
.rpgc-paper .ph .kd { font-weight: 700; letter-spacing: .14em; text-transform: uppercase; opacity: .7; }
.rpgc-paper .ph .wh { margin-left: auto; opacity: .75; }
.rpgc-paper .pt { display: block; font-weight: 700; margin-bottom: 8px; }
.rpgc-paper p { margin: 0 0 10px; } .rpgc-paper p:last-child { margin-bottom: 0; }
.rpgc-paper.letter { color: #3a2a17; background: #f1e3c2; border: 1px solid #c9b07a; font-family: Georgia, 'Times New Roman', serif; }
.rpgc-paper.letter .ph { padding-bottom: 7px; border-bottom: 1px solid rgba(90,60,20,.35); }
.rpgc-paper.note { max-width: 380px; color: #2e2a12; background: #f7ec9c; border-radius: 2px; transform: rotate(-.6deg); }
.rpgc-paper.book { color: #2b2620; background: #f6f1e6; border: 1px solid #d9cfba; border-left: 7px solid #6b4a2b; font-family: Georgia, 'Times New Roman', serif; }
.rpgc-paper.book .pt { text-align: center; font-variant: small-caps; letter-spacing: .1em; }
.rpgc-paper.text { max-width: 400px; color: #e9edf2; background: #12161c; border: 1px solid #2b323c; border-radius: 18px; font-family: system-ui, sans-serif; }
.rpgc-paper.text .bub { display: block; width: fit-content; max-width: 86%; margin: 5px 0; padding: 6px 11px; border-radius: 16px 16px 16px 4px; background: #232a34; }
.rpgc-paper.text .bub.me { margin-left: auto; border-radius: 16px 16px 4px 16px; background: #2f6fed; color: #fff; }
.rpgc-paper.text .bub b { display: block; font-size: 11px; opacity: .78; }
.rpgc-paper.sign { max-width: 420px; text-align: center; color: #f3ead7; background: #3d2c1d; border: 3px solid #24180e; border-radius: 6px; font-family: Georgia, serif; }
.rpgc-paper.doc { color: #191919; background: #f4f3ee; border: 1px solid #191919; border-radius: 0; font-family: 'Courier New', ui-monospace, monospace; }
.rpgc-paper.doc .ph { padding-bottom: 7px; border-bottom: 2px solid #191919; }
.rpgc-seal { display: inline-flex; align-items: center; justify-content: center; width: 30px; height: 30px; border-radius: 50%; vertical-align: middle; color: #f7e3d6; font: 700 14px Georgia, serif; background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--wax, #a51d16) 72%, #fff 28%), var(--wax, #a51d16) 62%, color-mix(in srgb, var(--wax, #a51d16) 70%, #000 30%)); box-shadow: 0 2px 5px rgba(0,0,0,.5), inset 0 0 0 3px rgba(0,0,0,.16); }
.rpgc-seal .em { color: transparent; text-shadow: 0 0 0 rgba(255,236,222,.88); font-weight: 400; font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif; }
.rpgc-seal.onpaper { position: absolute; right: 14px; bottom: -10px; width: 36px; height: 36px; font-size: 17px; }
.rpgc-paper .stamp { position: absolute; right: 16px; top: 14px; padding: 2px 8px; border: 3px solid #b3122e; border-radius: 5px; color: #b3122e; font: 700 13px 'Courier New', monospace; letter-spacing: .12em; text-transform: uppercase; transform: rotate(-9deg); opacity: .85; }
.rpgc-paper .stamp.ok { border-color: #1d6b3a; color: #1d6b3a; }
.rpgc-paper.exam { color: #1d2330; background: #fbfbf7 repeating-linear-gradient(#fbfbf7 0 22px, #cfdbe8 22px 23px); border: 1px solid #b9c3cf; border-left: 2px solid #e2a3a3; font-family: 'Segoe UI', system-ui, sans-serif; padding-right: 86px; }
.rpgc-paper.exam .ph { padding-bottom: 6px; border-bottom: 2px solid #1d2330; }
.rpgc-paper.exam .stamp { top: auto; bottom: 14px; }
.rpgc-paper.exam .score { position: absolute; right: 12px; top: 10px; display: flex; align-items: baseline; justify-content: center; width: 58px; height: 58px; padding-top: 15px; border: 3px solid #c4161c; border-radius: 50%; color: #c4161c; font: 700 19px 'Segoe Print', 'Bradley Hand', cursive, sans-serif; transform: rotate(-8deg); box-sizing: border-box; }
.rpgc-paper.exam .score small { font-size: 10px; opacity: .85; }
.rpgc-paper.exam .ok { color: #1d6b3a; } .rpgc-paper.exam .no { color: #c4161c; } .rpgc-paper.exam .red { color: #c4161c; font-family: 'Segoe Print', 'Bradley Hand', cursive, sans-serif; }
.rpgc-paper.contract { color: #2e2213; background: #efe2c3; border: 1px solid #b89a5e; outline: 1px solid #b89a5e; outline-offset: -6px; font-family: Georgia, 'Times New Roman', serif; padding: 20px 22px 26px; }
.rpgc-paper.contract .pt { text-align: center; font-variant: small-caps; letter-spacing: .14em; font-size: 16px; }
.rpgc-paper.contract .between { text-align: center; font-style: italic; opacity: .85; }
.rpgc-paper.contract .terms { margin: 6px 0 10px; padding-left: 28px; list-style: upper-roman; } .rpgc-paper.contract .terms li { margin-bottom: 5px; }
.rpgc-paper.contract .penalty { padding: 6px 9px; border-left: 3px solid #8a1c12; background: rgba(138,28,18,.08); }
.rpgc-paper.contract .signs { display: flex; flex-wrap: wrap; justify-content: space-around; gap: 10px 24px; margin-top: 14px; }
.rpgc-paper.contract .sig { display: flex; flex-direction: column; align-items: center; min-width: 110px; } .rpgc-paper.contract .sig .ink { min-height: 22px; font: 19px 'Segoe Script', 'Brush Script MT', 'Bradley Hand', cursive; }
.rpgc-paper.contract .sig .line { width: 100%; border-top: 1px solid #5a4630; padding-top: 2px; font-size: 11px; text-align: center; opacity: .75; }
.rpgc-paper.contract.ended { filter: saturate(.55); }
.rpgc-papertools { display: flex; flex-direction: column; gap: 6px; margin-top: 16px; } .rpgc-sealrow { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 12.5px; } .rpgc-sealrow select { font: inherit; font-size: 12px; }
.rpgc-plain { list-style: none; padding: 0; margin: 4px 0; } .rpgc-plain li { margin: 3px 0; display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px; }
.rpgc-grades, .rpgc-contracts { margin-top: 12px; }
.rpgc-mini.star.on { color: #e8b030; } .rpgc-person .head .rpgc-mini.star { margin-left: auto; }
.rpgc-offrow { padding: 8px 10px; margin: 6px 0; border: 1px solid color-mix(in srgb, var(--lumiverse-text, #ddd) 16%, transparent); border-radius: 8px; } .rpgc-offrow.here { border-color: #e8b030; }
.rpgc-offrow .head { display: flex; align-items: center; gap: 8px; } .rpgc-offrow .head .rpgc-mini { margin-left: auto; } .rpgc-offrow p { margin: 4px 0; }
.rpgc-hist li { display: block; font-size: 12.5px; } .rpgc-hist small { opacity: .7; } .rpgc-grades li b { display: inline-block; min-width: 2.2em; color: #c4161c; }
.rpgc.rpgc-easy .rpgc-paper { font-family: inherit; transform: none; letter-spacing: .03em; line-height: 1.85; }
/* ───────── 2.3: Harry Potter ───────── */
.rpgc.theme-potter { --lumiverse-text: #efe3c8; --lumiverse-text-muted: #bfae8c; --lumiverse-text-dim: #8d7c5e; --lumiverse-border: #4a3a26; --lumiverse-border-hover: #7a6037; --lumiverse-accent: #d4a437; --lumiverse-accent-fg: #1a1208; --lumiverse-fill-subtle: rgba(212,164,55,.07);
    --rpgc-banner-bg: linear-gradient(90deg, #6d1d1d, #43120f); --rpgc-banner-fg: #f6e7b8; --rpgc-banner-muted: #e3c98e; --rpgc-card-bg: #1d1713; --rpgc-infobox-bg: #2a1f17; --rpgc-infobox-fg: #f6e7b8; --rpgc-tab-bg: #6d1d1d; --rpgc-tab-fg: #f6e7b8;
    background: #17120f; font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif; }
.rpgc-hp-glasses { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.rpgc-hp-glass { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 6px 4px; border-radius: 8px; border: 1px solid var(--lumiverse-border, #444); }
.rpgc-hp-glass.mine { border-color: var(--lumiverse-accent, #d4a437); box-shadow: 0 0 0 1px var(--lumiverse-accent, #d4a437) inset; }
.rpgc-hp-glass .tube { position: relative; width: 16px; height: 54px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,.25); background: rgba(0,0,0,.25); }
.rpgc-hp-glass .tube i { position: absolute; left: 0; right: 0; bottom: 0; display: block; }
.rpgc-hp-glass b { font-size: 15px; font-variant-numeric: tabular-nums; }
.rpgc-hp-glass span { font-size: 10.5px; letter-spacing: .06em; text-transform: uppercase; color: var(--lumiverse-text-muted, #aaa); }
.rpgc-scene { order: -1; }
.rpgc-paper p, .rpgc-paper .bub { white-space: pre-line; }
.rpgc-perch-card img { box-shadow: 0 0 0 2px color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 70%, transparent); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 18%, transparent); }
/* ── 2.5: what the extension costs ── */
.rpgc-costwrap { position: relative; display: inline-flex; }
.rpgc-costchip { display: inline-flex; align-items: center; gap: 4px; font: inherit; font-size: 12px; padding: 3px 9px; border-radius: 999px; cursor: pointer; border: 1px solid var(--lumiverse-border, #3a3a48); background: var(--lumiverse-fill-subtle, rgba(255,255,255,.04)); color: var(--lumiverse-text, #ddd); }
.rpgc-costchip .ico { opacity: .7; } .rpgc-costchip .unit { opacity: .6; font-size: 11px; } .rpgc-costchip.on, .rpgc-costchip:hover { border-color: var(--lumiverse-accent, #8c82ff); }
.rpgc-costpop { position: absolute; top: calc(100% + 6px); left: 0; z-index: 30; width: min(360px, 86vw); padding: 10px 12px; border-radius: 12px; background: var(--lumiverse-bg, #15151b); border: 1px solid var(--lumiverse-border, #3a3a48); box-shadow: 0 10px 30px rgba(0,0,0,.4); color: var(--lumiverse-text, #ddd); font-size: 12px; text-align: left; }
.rpgc-costpop .hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; } .rpgc-costpop .hd b { font-size: 13px; }
.rpgc-costpop .x { appearance: none; border: 0; background: none; color: inherit; font-size: 16px; cursor: pointer; opacity: .7; }
.rpgc-costpop .tot b { font-size: 15px; } .rpgc-costpop .tot span { opacity: .75; }
.rpgc-costpop .bar { display: flex; height: 10px; border-radius: 999px; overflow: hidden; margin: 8px 0; background: rgba(127,127,127,.15); } .rpgc-costpop .bar i { display: block; height: 100%; }
.rpgc-costpop .rows { display: grid; gap: 3px; } .rpgc-costpop .row { display: grid; grid-template-columns: 10px 1fr auto auto; gap: 6px; align-items: baseline; }
.rpgc-costpop .row .dot { width: 9px; height: 9px; border-radius: 3px; align-self: center; } .rpgc-costpop .row .w { opacity: .55; font-size: 11px; } .rpgc-costpop .row b { text-align: right; min-width: 52px; }
.rpgc-costpop .sum { display: flex; gap: 12px; flex-wrap: wrap; margin: 8px 0 4px; padding-top: 6px; border-top: 1px solid var(--lumiverse-border, #3a3a48); }
.rpgc-whead .rpgc-costpop { left: auto; right: 0; }
/* ── 2.4: pictures on the settings headings, themed ── */
.rpgc-sico { display: inline-grid; place-items: center; width: 24px; height: 24px; flex: 0 0 24px; border-radius: 7px; color: var(--lumiverse-accent, #8c82ff); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 15%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 35%, transparent); }
.rpgc-sico svg { width: 15px; height: 15px; display: block; }
.rpgc-wbody .rpgc-sico { width: 28px; height: 28px; flex-basis: 28px; } .rpgc-wbody .rpgc-sico svg { width: 17px; height: 17px; }
.rpgc.theme-scp .rpgc-sico { border-radius: 0; background: #151515; color: #f3f2ee; box-shadow: inset 0 -3px 0 #9c1c1c; }
.rpgc.theme-potter .rpgc-sico { border-radius: 50%; background: radial-gradient(circle at 38% 32%, #a83434, #5c1010 70%); color: #f0d27a; box-shadow: 0 0 0 1px #d4a437, 0 1px 2px rgba(0,0,0,.5); }
.rpgc.theme-rezero .rpgc-sico { border-radius: 4px; transform: rotate(45deg) scale(.86); background: linear-gradient(135deg, #e9fffd, #2ad4cf 60%, #10506e); color: #06201f; box-shadow: 0 0 8px rgba(42,212,207,.55); }
.rpgc.theme-rezero .rpgc-sico svg { transform: rotate(-45deg); }
.rpgc.theme-overlord .rpgc-sico { border-radius: 0; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: linear-gradient(#3e2c62, #160d2a); color: #e3c06a; box-shadow: none; width: 27px; flex-basis: 27px; }
.rpgc.theme-undertale .rpgc-sico { border-radius: 0; background: #000; color: #fff; box-shadow: 0 0 0 2px #fff; }
.rpgc.theme-darksouls .rpgc-sico { border-radius: 50%; background: radial-gradient(circle at 50% 75%, rgba(255,154,60,.45), #140e0a 72%); color: #ffb366; box-shadow: 0 0 7px rgba(255,122,26,.35); }
.rpgc.theme-skyrim .rpgc-sico { border-radius: 50%; background: radial-gradient(circle at 40% 35%, #6d7279, #2b2e33); color: #eef2f6; box-shadow: 0 0 0 1px #9aa0a8; }
.rpgc.theme-cote .rpgc-sico { border-radius: 6px; background: var(--lumiverse-accent, #e0538f); color: var(--lumiverse-accent-fg, #fff); box-shadow: none; }
.rpgc.theme-mushoku .rpgc-sico { border-radius: 50%; background: radial-gradient(circle at 40% 35%, #f3e8cc, #d8c8a1); color: #5a4a2c; box-shadow: 0 0 0 1px #7a6a48; }
.rpgc.theme-paper .rpgc-sico, .rpgc.theme-parchment .rpgc-sico { background: transparent; color: var(--lumiverse-text, #333); box-shadow: inset 0 0 0 1.2px currentColor; border-radius: 50%; }
.rpgc.theme-terminal .rpgc-sico { border-radius: 0; background: transparent; color: #39ff7a; box-shadow: inset 0 0 0 1px rgba(57,255,122,.6); }
.rpgc.theme-sakura .rpgc-sico { border-radius: 50% 50% 50% 0; }
.rpgc.theme-heaven .rpgc-sico { border-radius: 50%; box-shadow: 0 0 0 1px #f3d98a, 0 0 8px rgba(243,217,138,.6); }
.rpgc.theme-hell .rpgc-sico, .rpgc.theme-horror .rpgc-sico { border-radius: 2px; background: #1a0606; color: #ff4a3a; box-shadow: inset 0 0 0 1px #6a1010; }
/* the top of Settings */
.rpgc-sethero { position: relative; display: flex; align-items: center; gap: 12px; padding: 12px 14px; margin: 4px 0 10px; border-radius: 12px; overflow: hidden;
  background: linear-gradient(135deg, color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 22%, transparent), transparent 72%), var(--lumiverse-fill-subtle, rgba(255,255,255,.03));
  border: 1px solid color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 32%, transparent); }
.rpgc-sethero .art { width: 58px; height: 58px; flex: 0 0 58px; color: var(--lumiverse-accent, #8c82ff); } .rpgc-sethero .art svg { width: 100%; height: 100%; display: block; }
.rpgc-sethero .txt { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; } .rpgc-sethero .txt b { font-size: 15px; }
.rpgc-sethero input { width: 100%; box-sizing: border-box; margin-top: 2px; }
.rpgc-sethero .perch { width: 44px; height: 44px; flex: 0 0 44px; align-self: flex-end; image-rendering: auto; }
.rpgc-wbody .rpgc-sethero { margin: 0; }
.rpgc.theme-scp .rpgc-sethero { border-radius: 0; border: 1px solid #151515; background: repeating-linear-gradient(-45deg, #151515 0 8px, #f3f2ee 8px 16px) top / 100% 6px no-repeat, #f3f2ee; padding-top: 16px; }
.rpgc.theme-potter .rpgc-sethero { background: radial-gradient(ellipse at 20% 0, rgba(212,164,55,.25), transparent 60%), linear-gradient(#2a1d10, #1a1208); border-color: #7a6037; }
.rpgc.theme-rezero .rpgc-sethero { background: radial-gradient(ellipse at 10% 50%, rgba(42,212,207,.28), transparent 60%), linear-gradient(135deg, #1b1438, #10102a); }
.rpgc.theme-overlord .rpgc-sethero { background: radial-gradient(ellipse at 15% 50%, rgba(227,192,106,.18), transparent 60%), linear-gradient(135deg, #1e1433, #0d0818); border-color: #5a4580; }
.rpgc.theme-undertale .rpgc-sethero { border-radius: 0; background: #000; border: 3px solid #fff; }
.rpgc.theme-darksouls .rpgc-sethero { background: radial-gradient(ellipse at 12% 100%, rgba(255,122,26,.3), transparent 55%), #120c08; border-color: #4a3424; }
.rpgc.theme-skyrim .rpgc-sethero { background: linear-gradient(180deg, rgba(93,255,176,.08), transparent 50%), linear-gradient(135deg, #2b2e33, #1c1e22); border-color: #5c6168; }
.rpgc.theme-cote .rpgc-sethero { border-radius: 10px; background: linear-gradient(135deg, color-mix(in srgb, var(--lumiverse-accent, #e0538f) 28%, #fff), #fff 70%); }
.rpgc.theme-mushoku .rpgc-sethero { background: linear-gradient(135deg, #f3e8cc, #e2d3ad); border-color: #7a6a48; color: #3a2e18; }
/* links between sections that touch the same thing */
.rpgc-seclink { color: var(--lumiverse-accent, #8c82ff); text-decoration: underline; text-underline-offset: 2px; font-size: 12px; }
.rpgc-modwrap { display: inline-flex; align-items: center; gap: 2px; min-width: 0; }
.rpgc-modgo { appearance: none; border: 0; background: none; color: var(--lumiverse-text-dim, #777); cursor: pointer; font-size: 14px; line-height: 1; padding: 0 4px; border-radius: 4px; }
.rpgc-modgo:hover, .rpgc-modgo:focus-visible { color: var(--lumiverse-accent, #8c82ff); background: var(--lumiverse-fill-subtle, rgba(255,255,255,.05)); }
/* page shortcuts in the narrow windows, and the test zone's page buttons */
.rpgc-jump { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; margin: 2px 0 8px; }
.rpgc-jump .lbl { font-size: 11px; color: var(--lumiverse-text-dim, #777); margin-right: 2px; }
.rpgc-jump .rpgc-chip { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; font: inherit; font-size: 12px; }
.rpgc-jump .ico { display: inline-grid; width: 14px; height: 14px; } .rpgc-jump .ico svg { width: 14px; height: 14px; }
.rpgc-jump .n { font-size: 10px; opacity: .65; }
.rpgc-tzstrip { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 9px; border: 1px dashed color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 55%, transparent); background: color-mix(in srgb, var(--lumiverse-accent, #8c82ff) 9%, transparent); }
.rpgc-tzstrip .ico { display: inline-grid; width: 16px; height: 16px; color: var(--lumiverse-accent, #8c82ff); } .rpgc-tzstrip .ico svg { width: 16px; height: 16px; }
.rpgc-tzstrip > span { color: var(--lumiverse-text-muted, #aaa); font-size: 12px; } .rpgc-tzstrip .rpgc-btn:first-of-type { margin-left: auto; }
`;

// The guide, embedded from GUIDE.md so it ships inside the extension (tools/embed_guide.py refreshes it).
const GUIDE_MD = /* GUIDE:BEGIN */ "# HMS Guide\n\n**RPG Companion HMS Edition 2.9 beta** and **HMS Reporter beta 1.7**\n\nThis guide explains how an HMS game works, how to set it up, and what every part does.\nRead **Start here** first. Use the other parts when you need them.\n\n---\n\n## 1. Start here: three parts, one game\n\nAn HMS game has three parts. Each part has one job.\n\n| Part | What it is | Its job |\n| --- | --- | --- |\n| **The bot** | The character card and its lorebooks: Re:Zero, Mushoku Tensei, Classroom of the Elite, Overlord, Harry Potter, SCP-4666, Undertale, Dark Souls or Skyrim | The world and its rules. It writes the **WORLD STATE HUD** at the top of every reply. |\n| **HMS Reporter beta** | A preset: the prompt Lumiverse sends | How the story under the HUD is written: style, voices, length, thinking. |\n| **RPG Companion HMS Edition 2.9 beta** | An extension: the side panel | It reads the HUD and shows it as cards. It tracks people, how they feel and what they know, quests, fights and more. It helps you start a game and ask questions. |\n\n### Who is in charge\n\nWhen two parts disagree, this order wins:\n\n1. **The bot.** Its rules and its HUD are the law. The bots call this **STATE IS GOD**. Nothing may hide, change or replace the HUD.\n2. **The preset.** It only shapes the story under the HUD. It never changes a rule or a HUD line.\n3. **The extension.** It reads and shows. It asks the model for one small hidden block after the story, and hands back what it remembers about the people (Minds) before the next reply. It never writes a HUD of its own and never adds rules.\n\n### What a reply looks like\n\n```\n### WORLD STATE ###\nDay: 3 | Time: 14:10 (Afternoon)\n\u25c6 World of Re:Zero \u2192 Lugunica \u2192 Roswaal Mansion\nArc: Arc 2: A Week at the Mansion\n***\nThe story...\n<rpg_companion>{ ... }<\/rpg_companion>\n```\n\n- **The HUD** is the top part, from `### WORLD STATE ###` down to the `***` line. It belongs to the bot.\n- **The wall** is the `***` line.\n- **The story** comes under the wall. It follows the bot's rules, written in the preset's style.\n- **The hidden block** comes last. It belongs to the extension. You never see it: it is removed from the saved message.\n\n### Who owns what\n\n| Thing | Owner | Notes |\n| --- | --- | --- |\n| The HUD: time, place, arc, powers, money | Bot | The extension only reads it. |\n| Rules: death, power gaps, Return by Death, exams | Bot | Fights in the extension use the bot's own rules. |\n| Start commands and the catalog | Bot | The New game card only fills them in for you. |\n| OOC answers | Bot (its guide character) | The OOC card asks that same guide. |\n| Injuries in Re:Zero and Mushoku Tensei | Bot | These bots keep wounds on their HUD. The extension stays out. |\n| Injuries in Classroom of the Elite and Overlord | Extension | These bots keep no wounds. The Injuries card tracks them. |\n| How the story reads, its length, thinking | Preset | Set them under the sliders icon. |\n| Emoji and dialogue colours | Extension | Drawn on your screen. The preset never writes emoji. |\n| Side panel, map, Chronicle, people, quests | Extension | Read from the HUD and the hidden block. |\n| Who a character is | Bot (its character cards) | The cards always win. |\n| How characters are played from the inside | Preset (the Minds block) | From FrankenSIM. See part 7. |\n| The numbers: feelings, agendas, who knows what, planted details | Extension (Minds) | The model only says what moved. The extension keeps the rest. See part 7. |\n\n---\n\n## 2. Install and set up\n\nYou need **Lumiverse 1.2.0 or newer**.\n\n### Step 1: Remove the old RPG Companion\n\nIf you have the original RPG Companion extension, disable or remove it. Both would add to your prompt.\n\n### Step 2: Install the extension\n\n1. Open the drawer and go to **Extensions**.\n2. Click **Add Extension**.\n3. Pick one way:\n    - **Install from Source**: paste the extension's GitHub link.\n    - **Import Local** (owner or admin only): first put the `rpg_companion_hms` folder in `Lumiverse/data/extensions/`.\n4. Read the permissions and click **Install**.\n5. New extensions start switched off. Turn **Enable** on.\n6. Grant the permissions. You can skip any. That part then switches off and tells you why.\n\n| Permission | What it is for |\n| --- | --- |\n| interceptor | Adds the extension's small request to your prompt. |\n| generation | The extension's own model calls: fights, the OOC guide, chapter summaries, a missed side-panel block. |\n| chat_mutation | Keeps the hidden block out of saved replies, puts back HUD lines, and posts your new-game, phone and Move the world turns. |\n| world_books | Reads your lorebooks: the Atlas, the Arc line check, the OOC guide, lore for fights. |\n| memories | Uses Lumiverse's Memory Cortex: the Chronicle writes to it, fights read from it. |\n| image_gen | Character portraits only. |\n\n### Step 3: Import the preset\n\n1. Open the **Preset Manager** in Lumiverse.\n2. Import the file `HMS_Reporter_beta.json`. It comes with the extension, in its `preset` folder.\n3. Choose **HMS Reporter beta** as the preset for your HMS chats.\n\n### Step 4: Open the panel\n\nOpen a chat with an HMS bot. Then open the **RPG Companion (HMS)** tab in the side drawer.\n\n### Step 5: Use your world's preset\n\nAfter the first reply, the panel offers **Use the [world] preset**. Click it.\nIt sets the right cards, fights and theme for that bot in one click.\nYou can also do this later in **Settings \u2192 Play style**.\nThere you also pick **How much**: **Light**, **Medium** or **Heavy**. Light is cheap and simple. Heavy tracks everything. So you can play light Re:Zero, or heavy Overlord.\n\n### Good settings to start with\n\n- Preset sliders: **Thinking: Normal**, **Prose length: Scene-led**, **Start replies with the HUD header: Auto**.\n- Lumiverse: switch on the **Memory Cortex** if you want the Chronicle to remember key moments.\n- Extension: keep **Together** mode (Settings \u2192 General).\n- Want emoji or coloured dialogue? Settings \u2192 **Chat display** \u2192 **Dialogue**. They are off at first.\n\n---\n\n## 3. Start a new game\n\n### The catalog\n\nEvery HMS bot opens on a **catalog**. Its first message has many pages. Swipe left and right to see them.\n\n- **The hub page** says how to start, and names the **start handler** line.\n- **The canvas page** is almost empty. You type your start under it.\n- **Command pages** list starts, add-ons and ready-made examples.\n\n### The start handler line\n\nYour first message must begin with the bot's start line, on a line of its own.\n\n| Bot | First line | Line to resume an old campaign |\n| --- | --- | --- |\n| Re:Zero | `ReZero_Start_Handler` | `ReZero_Start_Continuer` |\n| Mushoku Tensei | `MUSHOKU_TENSEI_START_HANDLER` | `MUSHOKU_TENSEI_START_CONTINUER` |\n| Classroom of the Elite | `Cote_Start_Handler` | `Cote_Start_Continuer` |\n| Overlord | `Overlord_Start_Handler` | `Overlord_Start_Continuer` |\n| Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim | The line the bot's hub page names | The bot's continuer line, if it has one |\n\nEvery bot names its own start line on its hub page. The **New game** card finds it for you, so you do not need to know it.\n\nThen come your commands. For example:\n\n```\nReZero_Start_Handler\nStart at Arc 3 with RBD, Hell Mode, Start with Echidna\n```\n\n### The New game card (the easy way)\n\nOn a new chat, the panel shows **New game**. It reads the catalog pages for you.\n\n1. Pick a page at the top.\n2. Pick one **start**.\n3. Pick any **add-ons**. Add-ons stack on a start.\n4. Fill any blanks, like `[Name]`.\n5. Read the warnings. For example: no start yet, an empty blank, or no Return by Death in Re:Zero. One click adds `with RBD`.\n6. Press **Start the game**.\n\nThe card turns the greeting to the canvas page and sends your command. You can also edit the command by hand, **Copy** it, or **Clear** it.\n\n### Resume an old campaign\n\nInside the New game card, open **Resume an old campaign instead**.\n\n1. Paste the last HUD from your old chat. This is your save file.\n2. If you have them, paste your last few messages and a summary of the story.\n3. Press **Resume the campaign**.\n\nThe card puts the bot's Continuer line first, as the bot asks.\n\n### After the first reply\n\n- The bot builds the HUD on turn 1. From then on it carries it in every reply.\n- **Arc line check.** The Arc line is a lookup key. If it is misspelled, the arc's lore never loads. The World State card warns you and offers the book's spelling in one click.\n\n---\n\n## 4. What happens each turn\n\n1. You write what you do, and send it.\n2. The preset builds the prompt: the bot's card and engine, your lore, memory, the chat, the minds state, and the extension's small request.\n3. The model writes the HUD, the `***` wall, the story, and the hidden block.\n4. The extension reads the reply:\n    - It reads the HUD and updates the cards.\n    - It reads the hidden block (people, feelings, agendas, what people learned, planted details, quests, phone, injuries), then removes it from the saved message.\n    - It does the Minds math: caps each step, lets old feelings fade, remembers debts.\n    - It checks for HUD lines that vanished, and puts back lines you pinned.\n    - It draws the HUD as a card in the chat, and dialogue colours and emoji if you switched them on.\n5. When you answer a reply, that reply is settled. The Chronicle then writes its key moments to the Memory Cortex.\n\n### The button row\n\n| Button | What it does |\n| --- | --- |\n| **Move the world** | You do nothing new. One story thread off screen moves one step. |\n| **Immersive fight** | Starts a fight you play in the chat. The panel tracks it. |\n| **Turn-based fight** | Opens the D&D fight window. Only when D&D is on. |\n| **Read again** | Reads the latest reply again. Free: no model call. Use it when a card did not update. |\n\n### The top bar\n\n| Item | What it does |\n| --- | --- |\n| Together mode / Separate mode / Paused | Shows how the extension gets its data. See Settings \u2192 General. |\n| **\u2699 ~N tokens** | About how many tokens the extension adds to each reply, on top of your bot and preset. Press it for the parts. See **What it costs** in part 11. |\n| **Refresh** | Asks the model again for the side-panel data. This costs a call. |\n| Drawer / Floating / Own window / Wide window | Where the panel lives: in the drawer, floating over the chat, in its own window for a second screen, or in the **wide window**: a big window over the chat with a menu down the left side. |\n| **Test zone** | A practice chat inside the extension. Demo mode costs nothing. |\n| **Guide** | This guide. |\n| **Settings** | All settings. |\n\n### Buttons in the chat input bar\n\n**Refresh side panel**, **Open RPG Companion**, **Start or resume a fight**, and **Move the world**.\n\n---\n\n## 5. HMS Reporter beta (the preset)\n\n### What it does\n\nHMS Reporter beta tells the model how to write the story under the wall. It always puts the bot first. It says: the core and its lorebook entries outrank everything in this preset.\n\n### One dial: Mode\n\nOpen the sliders icon (Prompt Variables). **Mode** is on the Frame block. It has the same steps as the extension's play styles, so you can pick the same word in both.\n\n| Mode | What the model does | For |\n| --- | --- | --- |\n| **Potato** | Short rules. No long plan. The long craft blocks step aside. About 5,000 tokens less than Medium. | Small or cheap models. |\n| **Light** | A short plan, and one short paragraph about the characters. About 2,900 tokens less than Medium. | Fast play. |\n| **Medium** (default) | A full plan and every character block. | Most games. |\n| **Heavy** | A deep plan (the world off screen, the player's action ten steps out) and a whole-sheet look at each person. | Long campaigns. |\n| **Max** | Heavy, plus **Radiant's R. Prompt**: the Core Engine v3.1.7 with its planning pass, and the Writing Style v3.1.5. About 29,000 tokens more. | Big models with big contexts. |\n| **Custom** | The **Thinking** and **Character depth** dials decide, as in 1.5. | Tweaking by hand. |\n\nRadiant's prompt is used with Radiant's permission. In Max it runs inside the HMS bot: the bot's HUD is the \"RPG panel\" Radiant talks about, and the extension's hidden block takes the place of Megumin's HUD. Radiant's intimacy section is left out (the HMS bots have characters under 18 and it has no age guard). Radiant's gore section is its own block, off at first.\n\n### The blocks, top to bottom\n\n| Block | On at first? | What it does |\n| --- | --- | --- |\n| Frame | On | Says who is in charge and the reply shape: HUD, wall, story, then the hidden block if one is asked for. Explains OOC messages. Holds the **Mode** and **Start replies with the HUD header** dials. |\n| Game card | On | The bot's description and its system prompt. |\n| HMS core (personality field) | On | The bot's engine: its rules and its HUD. |\n| Scenario | On | The card's scenario, if it has one. |\n| Player persona | On | Your persona. |\n| Example messages | On | Style examples only. |\n| Potato mode: the short rules | On | Only in Potato: the short version of everything below. |\n| Reporter: how the prose reads | On | Lead with what changed. Use exact details. Show only what you can see. End where the world hands it back. Cut stock phrases. Clothes stay put, small physical friction, no saying a thing twice, fix a slip quietly (ideas from Radiant). |\n| The player's character | On | The model never writes your choices, words or thoughts. A Narrative Mode from the bot can change this. |\n| Pacing | On | A reply is not a whole scene. Ordinary life first. No rushed days and no invented deadlines. The bot's clock and arcs still fire on time. |\n| Written things (letters, notes, texts) | On | New in 1.7: exam papers (a mark out of 100, a stamp), contracts (terms, the price of breaking one, signatures) and seals. A letter, a note, a book page or a phone thread is shown as its own block, in the writer's own voice: their words, their schooling, what they share with you, their state when they wrote it, their own sign-off. |\n| Character depth | Medium | The digest for Light (one short paragraph about people). Holds the **Character depth** dial for Custom. |\n| Voices and groups | On | People speak briefly and in their own voice. Nobody reads minds. Each person feels from their own state; someone busy answers late; people talk past each other (ideas from Radiant). |\n| Minds (from FrankenSIM) | On | How to play each character from the inside. See part 7. |\n| Staying who they are (growth and change) | On | People stay themselves. Change is slow and earned. A card is a baseline, not a cage: who they are depends on who they are with. |\n| Reading a character card (Creation Kit) | On | How a card built in sections fits together. |\n| Comings and goings (the world off screen) | On | People have their own day. Arriving needs a reason, and so does staying. |\n| New people (minor characters) | On | A shopkeeper or a guard gets a real person. |\n| How Radiant's prompt fits HMS (Max) | Max only | The note that maps Radiant's rules onto an HMS bot. |\n| Radiant: Critical Rules, Meta-rules, World and knowledge, People and bodies, OOC and boundaries, Writing Style (Max) | Max only | Radiant's R. Prompt, read as it is from `preset/radiant/`. |\n| Radiant: Gore (Max, off by default) | Off | Radiant's gore section. |\n| Mature content (adults only) | Off | Adult scenes between adults only. Minors and family bonds always stay non-explicit. |\n| Gore | Off | Shows violence without softening it. |\n| World info (before) and (after) | On | Your lorebook entries. |\n| Memory (Chat Memory and Memory Cortex) | On | Lumiverse's long-term memory. |\n| Story summary (Loom Summary) | Off | Lumiverse's own summary. Turn it on only if you use it instead of Chapters. |\n| Chat history | On | The chat itself. |\n| Card's post-history instructions | On | Anything the card puts after the chat. |\n| Minds state (RPG Companion) | On | What the extension remembers about the people. Empty without the extension, with Minds off, and on OOC turns. |\n| Gates state (RPG Companion) | On | The phase each gated character is in. |\n| Body state (RPG Companion) | On | Your body: lost limbs first, in capitals, then how alive you are, wounds, the hard locks. Empty while you are fine. |\n| Statuses (RPG Companion) | On | 1.7: also the contracts in force, so the story keeps their terms. New in 1.6. Who is asleep, out cold, dead, tied up, missing or charmed, and what the party's wounds stop them doing. Empty while everyone is fine. |\n| Studying a spell (RPG Companion) | On | New in 1.6. While you study a spell: what the lorebook says about it. Empty otherwise. |\n| Radiant: planning pass (Max) | Max only | Radiant's planning pass. |\n| Fight craft | Fights only | Loads by itself during fights: on attack words (attacking, blocking, casting a named spell) or a fight on the HUD. |\n| Side panel (RPG Companion) | On | The extension's request goes here. Empty without the extension and on OOC turns. |\n| Before you write | On | The plan for this Mode, the length, and the dialogue marker reminder. On an OOC turn: answer out of character. |\n\n### Your settings: the sliders icon\n\n| Setting | Choices | Tip |\n| --- | --- | --- |\n| Mode | Potato, Light, Medium (default), Heavy, Max, Custom | See the table above. Pick the same step as the extension's play style. |\n| Thinking | Off, Light, Normal, Deep | Used only when Mode is Custom. |\n| Character depth | Light, Standard, Full | Used only when Mode is Custom. **Light** saves about 2,300 tokens. |\n| Think out loud | On or off | For models that cannot think by themselves. Also switch on Auto-parse thoughts in Lumiverse, so the plan folds away. |\n| Prose length | Brief, Scene-led (default), Long, Very long | The HUD never counts toward the length. |\n| Start replies with the HUD header | Auto (default), Always, Never | Auto helps Kimi and DeepSeek, from the first turn. Use Always only if a model keeps skipping the HUD, with thinking off. |\n\n### Using another preset\n\nThe extension works with any preset. Without HMS Reporter, it adds its own short messages before your turn (the body, the statuses, Minds), and its hidden-block request at the end. With HMS Reporter, those go in the preset's slots instead, and nothing is sent twice. A preset of your own can carry the same slots: `{{rpgc_request}}`, `{{rpgc_minds}}`, `{{rpgc_gates}}`, `{{rpgc_health}}`, `{{rpgc_status}}`, `{{rpgc_study}}` and `{{rpgc_chronicle}}`. Put each inside `{{if::{{matches::{{rpgc_on}}::^1$}}}} \u2026 {{/if}}`, so it is empty without the extension.\n\n### Model tips\n\n- **Small or cheap models:** Potato in both the preset and the extension. Thinking stays off by itself.\n- **GLM, DeepSeek, Kimi:** Medium. Turn the model's own reasoning down if replies are slow; the preset's plan is enough.\n- **Claude, Gemini, big models:** Heavy, or Max for long campaigns with room for 30,000 more tokens.\n- If a model keeps skipping the HUD, set **Start replies with the HUD header** to Always and thinking off.\n\n### OOC messages\n\nStart a message with the bot's OOC trigger, like `[OOC: ...]` or `OOC guide: ...`.\nThe preset then asks for an answer out of character: no HUD, no story, no hidden block, and no time passes.\n\n---\n\n## 6. The extension's cards\n\nThe panel shows one card per thing. A card only shows when it has something to show.\nClick a card's title to fold or unfold it.\n\n### New game\nOnly on a new chat. See part 3.\n\n### World State\nThe HUD, line by line.\n\n- **Pin** a line (the pin icon) to keep it exactly as it is. If the model drops or changes it, the extension puts it back. The model is also reminded.\n- **The guard.** If a line vanishes, you see it with **Restore**. A carrier line (one that keeps lore loaded, like the Arc line) is marked, because losing it hides lore.\n- Lines that end by their own rules (a healed injury, a passed exam) show as **cleared**, with a put-back button.\n- If a reply has no HUD at all, press **Put the last HUD back**.\n- The **Arc line check** warns when the Arc line loads no arc lore, and fixes it in one click.\n\n### The world card\nOne card per world: **Re:Zero**, **Overlord**, **Classroom of the Elite**, **Mushoku Tensei**, **SCP-4666**, **Harry Potter**, **Undertale**, **Dark Souls** and **Skyrim**.\nIt shows that world's own stats from the HUD, explained from your lorebooks. Some examples:\n\n- Re:Zero: deaths and the save point. Authorities, Divine Protections, curses, spirit contracts and affinity are in the **Magic** card.\n- Overlord: levels and classes, with a check that they add up.\n- Classroom of the Elite: the calendar, class standings, Private Points, the exam.\n- Mushoku Tensei: sword styles and magic ranks, and the Man-God's advice.\n- Harry Potter: the school year and term, your house, the four house-point hourglasses, your wand, your four studies (LV of 7), extra spells and your Patronus.\n- SCP-4666: the night of twelve and its phase, the mode, the household (or how many of the team still stand), conditions and the coin.\n- Undertale: LV, EXP and NEXT, gold, your SOUL's colour and trait, the route and kills, the SAVE point, AT and DF.\n- Dark Souls: level and souls, Estus, humanity or hollowing, your bloodstain, the last bonfire, your covenant and deaths.\n- Skyrim: level and the next level, race and standing stone, dragon souls and perks, shouts, skills, bounties, factions, gold and carry weight.\n\n### Map\nWhere everyone stands in the room. It is off at first: Settings \u2192 **Maps** \u2192 **Track positions**. (The test zone always draws it.)\nA room is drawn once, then only people move. The **map bank** keeps every drawn room for that world, so a place is never paid for twice.\n\n**Whole building.** When two or more rooms of one building are drawn, press **Whole building**. The extension joins the rooms by their doors, floor by floor. It costs no tokens. People not in your room show where their agenda puts them. A room no door leads to yet is drawn with a dashed line. See part 7.\n\n### Atlas\nThe bot's location book as a map. It shows where you are, the rooms around you, and details for any place: how watched it is, opening hours, who is usually there.\nClick a place to go in, **Up** to go out.\nIf a line in the location book cannot be read, that line is left out and the rest of the map still shows. The card says how many were left out.\nThe **Re:Zero** test zone has a small Atlas too: the capital, the market square, Roswaal's mansion and its rooms.\n\n### Floor plans\nNew in 2.8. A plan of the rooms, after the room atlas of **Ryah | Wireless**. It is on the **Map** page. Pick how much in Settings \u2192 **Maps** \u2192 **How much to keep**:\n\n| Choice | What you see |\n| --- | --- |\n| **The room you are in** (default) | One room: its size, its doors and ways out, who stands where. |\n| **Every room (2D)** | Each floor from above, with the ways between rooms. Press a room to see it. |\n| **Every floor, in 3D** | The floors as a cutaway, stairs between them. |\n| **Off** | No plan, no tokens. |\n\n- The model reports a room only when you reach one the plan does not know yet. Known rooms cost nothing again.\n- A bot that prints its own room atlas (`<state:locations>`) is read as it is. The model is asked nothing.\n- A person on the plan who has a status (asleep, out cold, dead) carries its badge. See **Statuses**.\n- **Floor** buttons switch floors. The key: entered, seen, you are here, a way between rooms, a way out.\n\n**New in 2.9:**\n- **Things in the rooms.** Beds, tables, desks, chairs, shelves, chests, a fireplace, a board, rugs, statues, a throne, lamps, graves, cages, plants, **water**, **pillars**, **windows** on their wall, and **stairs** up or down. They are drawn in all three views: pillars stand up in 3D, water is blue. The room's details list them under **In it**. A room that only says \"a bed and a desk\" still gets them, set along the walls.\n- **Where people stand.** The plan asks again whenever someone comes in or leaves, not only every eighth reply. With the **room map** on (Settings \u2192 Maps \u2192 Track positions), the plan takes its spots and furniture every reply, for free.\n- **Which room and floor.** It reads every part of the HUD's place, and a floor like \"(Second Floor)\" picks between two rooms of one name. When you move somewhere the plan does not have yet, it says so (\"not on the plan yet\") instead of keeping you in the old room, and asks the story for it.\n- **The lorebook.** When the plan asks for a new room, it sends the lorebook's own words for it, and its size: a size the lorebook gives (\"15 x 10 m\") wins. For **Every room** and **3D**, it also sends the floors the lorebook names, so rooms land on the right floor and stairs join them.\n\n### You\nYour own state: health and other pools, meters, mood, stress and sanity.\nLevel and experience show only in worlds that have levels.\n**HP** shows only in worlds built on hit points: Overlord, Skyrim, Dark Souls, Undertale and D&D games. In the other worlds the **Body & health** card is your health instead. Change this in Settings \u2192 Body & health \u2192 **HP**.\n**Standard issue** lists things the bot assumes you have. **Carried** lists small things you got in the story. You can add or remove them.\n\n### On you\nNew in 2.8. Your bag, in one card on the **You** page: money first, then weapons, armour, clothes, tools, food and the rest, each in its group.\nIt reads the HUD's own lines (Inventory, Items, Equipment, Weapons, Pockets, Gold). It costs no tokens. The **Treat** buttons on the Body & health card use the same list.\n\n### Race\nYour race, from the `Race:` line on the HUD, explained from the bot's race book.\n\n- **The line.** It reads every form of the race line: `Race: Oni (Demon Race \u00b7 Demi-Human) \u2014 Hornless | Origin: Native`, a tower of floors like `Race: (Human) \u25b2 Half-Elf Lv 3 \u25b2 Elf`, and Overlord's `Racial Lvl: Skeleton Mage (15) / Elder Lich (10)`. Each floor shows in a row, the latest one lit.\n- **The sketch.** A small body picture drawn from the words in the race's entry: horns, wings, a tail, ears, scales or fur, extra arms, size, bones. New in 2.9: **ram horns** that curl and **antlers**; **insect or fairy wings**, and two or three pairs (a seraph); **fox tails**, up to nine, fanned out (a kitsune); a scorpion's **stinger**; **fins**, **gills**, **antennae**, **tusks** and **six arms**. A part the book says stays hidden (an Oni's horn, a succubus's wings) is drawn **dashed**, with \"hidden until shown\". A race much taller or shorter than a human gets a dashed human outline beside it, for scale. It is a sketch, not the canon look.\n- **The book.** The race's entry opens below: lifespan, build, what marks the race, the resting state, the signature tell, **In play**, laws like the Oni's **Horn Law**, and how each nation sees them.\n- **Bodies not built like a person.** The sketch knows the body plan: a **dragon** (four legs, wings, a long neck and tail), a **beast** on four legs, a **serpent** (with all its heads), a **naga** (a person above, a serpent below), a **centaur**, an **insect**, a **slime** and a **spirit**. A big one gets a small human beside it, for scale: a True Dragon is so big a human barely reaches its knee. A dragon the book calls flightless (an Earth Dragon) has no wings.\n- The body plan also changes the **Body & health** card: four legs, a wing to break, no bones, no blood.\n- **Your shape now** (new in 2.7). The sketch shows the body you are in **now**, not just what the race can be.\n  - **Form.** A dragon in human form is drawn as a person, with its horns, wings and tail out (2.8). A slime that took a person's shape is a person made of jelly. Press **Own form** or **Human form**, or type another one (a wolf, mist) and press **Set**.\n  - **Hidden parts.** Each part the race can hide has its own row: **Hidden** or **Out**. An Oni's horn out is drawn solid. A broken horn says **broken**.\n  - **Who decides.** The HUD wins when it says it (`Race: True Dragon (Human Form)`, `Form: Wolf`, `\u2014 Horn Manifested`, `\u2014 Hornless`). Then what you set here. Then the story's own small note. What you set holds until the story changes it. **Undo what I set** takes your picks back.\n  - The **Body & health** card follows the shape: a dragon in human form stands on two legs and has hands. Wings that are tucked away cannot be hurt.\n- **Dragons in human form** (new in 2.8). A dragon in human form keeps its **horns**, **wings** and **tail**, even when its race entry names only some of them. They stay **out** in human form, drawn on the sketch and on the body chart. Each has its own **Hidden** or **Out** row, to tuck one away.\n- **Evolution** (new in 2.7). When the race on the HUD changes (Goblin to Hobgoblin, a new floor on the tower), the card says **Evolved this reply** and keeps the list with the day and time. A form is not an evolution. Return by Death undoes one on the loop it undoes.\n- **Size in the book.** If the race's entry gives a size (\"roughly one meter long\"), the card shows it.\n- The **slime** is now a round, shiny dome with a core.\n- In the test zone, **Try a race** shows Human, Oni, Succubus, Elf, Wolf-Human, Dwarf, Dragonkin, Elder Lich, and from 2.6 True Dragon, Flying Dragon, Earth Dragon, Wolgarm, Black Serpent, Serpent-Human, Slime and Spirit. Trying another race starts in its own form.\n\n### D&D\nA character sheet and a dice roller. Your roll goes into your next message.\nFrom 2.8 it is **off** unless you pick the **D&D** play style, or switch it on in Settings \u2192 Modules.\n**No cap on stats** (Settings \u2192 D&D) lets a god or a dragon go past 30, up to 999.\n\n### People\nEveryone you have met. Each person shows:\n\n- **Standing**: how close they feel to you, from Nemesis to Devoted. It is never romance.\n- **Bond**: what kind of relationship it is: classmate, mentor, family, partner.\n- **The \ud83e\udde0 line**: what they feel right now and at whom, how warm they show themselves, and their three strongest feelings toward you. A \u26a0\ufe0f means a wall, a \u2696\ufe0f means you owe them.\n- **\ud83d\udccd** what they are doing and until when.\n- **The \ud83d\udddd\ufe0f line**: the phase they are in on their own card, and which gate is open next. See **Gates** below.\n- **Not in this scene.** A living-world bot also reports what people far away feel and do. They are not shown as standing next to you. Someone you have never dealt with folds away under **Elsewhere** at the bottom. Someone you know keeps their card, marked **not in this scene**, with where they are.\n- **Inside, feelings and what they know**: open it for the rest. See part 7.\n- **In the scene**: how they look and act now, and their thoughts.\n\nThe classic bars (Affection, Trust and the rest) come back if you set Settings \u2192 Minds \u2192 **Feelings toward you** to Classic bars.\n\nUse **Set the bond** if the story reads a relationship wrong.\nMinors are protected: never a romantic bond, never any desire.\nParty members show how they are holding up. Add them with **Add to party**.\n\n### Statuses\nNew in 2.8. Who is not as usual. A person can carry a badge on their card in **People**:\n\n- **Body**: \ud83d\ude34 Asleep, \ud83d\ude35 Knocked out, \ud83d\udcab Stunned, \ud83d\uddff Paralysed (or turned to stone), \ud83c\udfe5 Coma, \ud83e\ude78 Bleeding out, \ud83d\udc80 Dead, \ud83e\ude79 Crippled, \ud83e\udd15 Injured, \ud83d\ude48 Blinded, \ud83d\ude49 Deafened, \ud83e\udd10 Silenced, \ud83d\udd25 On fire, \ud83e\udd76 Freezing, \ud83d\ude2e\u200d\ud83d\udca8 Exhausted, \ud83c\udf7d\ufe0f Starving.\n- **Where they are**: \ud83e\udea2 Tied up, \u26d3\ufe0f Prisoner, \ud83d\udd12 Sealed away, \ud83c\udfe0 Confined, \ud83d\udeab Expelled, \u2753 Missing, \ud83d\udcf5 Unreachable, \ud83e\udee5 Hiding, \ud83e\uddf3 Away, \ud83c\udfaf Hunted, \ud83c\udfad In disguise.\n- **Mind and magic**: \ud83e\udd22 Sick, \u2620\ufe0f Poisoned, \ud83c\udf11 Cursed, \ud83c\udf7a Drunk, \ud83d\udc8a Drugged, \ud83d\udcdc Under contract, \ud83d\ude31 Panicked, \ud83d\ude28 Frightened, \ud83d\ude20 Furious, \ud83d\udda4 Grieving, \ud83c\udf27\ufe0f Withdrawn, \ud83e\udd2f Berserk, \ud83c\udf00 Controlled, \ud83d\udc97 Charmed, \ud83c\udf2b\ufe0f Name eaten, \ud83c\udf2b\ufe0f Memory gone, \u2728 Blessed, \ud83d\udc7b Invisible, \ud83d\udc09 Transformed.\n\nThe ones marked new in 2.9: Stunned, Paralysed, Injured, Blinded, Deafened, Silenced, On fire, Freezing, Exhausted, Starving, Sealed away, Confined, Away, Hunted, Under contract, Frightened, Furious, Grieving, Withdrawn, Blessed, Invisible. \"Bound by a pact\" is a contract, not Tied up.\n\nWhat a status changes:\n\n- **Asleep or knocked out**: they see and hear nothing, and learn nothing, until they wake. It ends by itself when its time runs out.\n- **Dead**: they learn nothing, and their plans stop.\n- **Tied up, prisoner, missing, sealed away, confined, paralysed**: they cannot act or move freely, and their plans wait.\n- **Stunned, on fire**: they cannot act this moment.\n- **Memory gone**: what they knew, and how they felt about everyone, is wiped in Minds. They start fresh.\n- **Name eaten**: everyone else forgets them: the others' feelings toward them, and what the others knew about them.\n- The story is told, one line per person, before each reply. **Nothing is sent while everyone is fine.**\n- **Change** under **Status of \u2026** sets one by hand, if the story got it wrong.\n\n**\ud83d\udc80 Deceased.** The dead fold away at the bottom of People. Each card says how they died, from the story: \"Dead: beheaded; found at the gate in the snow.\" If the story never said, it reads \"Dead. The story has not said how.\"\n\nSettings \u2192 **Characters** \u2192 **Statuses** has the switches.\n\n### Off screen: people with lives of their own\nNew in 2.9. Press the **\u2606** on a person's card in **People** to star them. Starred people live their own lives out of your sight: work, training, errands, friends, plans, rest. They do not wait around for you.\n\n- The **Off screen** card on the People page shows each one: where they are, what they are doing, until when, what they mean to do next, and where they were before.\n- When what they were doing is over, or nothing was said about them for six replies, the story is asked what they do next. The story is told about them first, marked \u2605.\n- Up to 12 people. Press the \u2605 again to stop.\n\n### History\nNew in 2.9. Each person's card has a **\ud83d\udcdc History** fold:\n\n- What passed between you: when you met, how their standing and bond changed and why, the key moments, your own notes.\n- Their **milestones** \ud83c\udfc1: turning points in their own life, seen or not (a promotion, an oath, a loss, a new rank, joining a group). The story reports them, and they go into the Chronicle and Memory too.\n- **Between them**: how the people of the story feel about each other, and what moved it (\"Ram \u2192 Rem: belonging +1 \u2014 Rem covered for her\").\n- The story is told a short history of the people in the scene, so it remembers what you have been through together.\n- Settings \u2192 Chronicle \u2192 **\u2026 and milestones in other people's lives** switches milestones off.\n\n### Party bodies\nNew in 2.8. Your party members get a body chart, like yours. Open their card in **People** \u2192 **\ud83e\ude7a Body**.\n\n- Their wounds and **lost limbs**, drawn on the chart. A lost limb is not drawn: you see it is gone.\n- **Male or female** chart, from what the story says. Press **\u2642 Male chart** or **\u2640 Female chart** to switch. In 2.9 the female chart's organs sit inside her narrower waist.\n- **How they died.** A dead person's chart shows the cause. Beheaded: the head is missing from the chart.\n- The model reports their wounds only when they change.\n- Switch it off in Settings \u2192 **Characters** \u2192 **Their bodies**.\n\n### Characters: the card and the story\nEverything the extension keeps about a person shows on their card in **People**.\n\n- **\ud83d\udcc7 Has a card**: this person has a character card in the lorebook. You see its first facts, like age and role. The card is who they are.\n- **\ud83e\udeaa Profile**: this person has no card. The story wrote a short profile once: looks, voice, manner. The extension keeps it, so a shopkeeper stays the same shopkeeper. Their secret is a spoiler you open yourself.\n- **\u270e** changes one field. **Forget and ask again** drops the profile, and the story writes a new one.\n\n**Settings \u2192 Characters** has one choice for how much is tracked:\n\n| Level | What you get |\n| --- | --- |\n| **None** (2.9) | Nothing about the people is kept or asked for. No tokens. |\n| **Light** | Who is here, how they stand with you, and the phase on their card. The fewest tokens. |\n| **Standard** | Adds their thoughts, their feelings toward you, what they are doing, and profiles. |\n| **Full** | Adds feelings between the others, who knows what, and your party's masks and needs. |\n| **Custom** (2.9) | Your own mix. Changing any switch picks Custom by itself. |\n\nYou can also set each switch yourself. The preset has its own dial for how characters are *written*: **Character depth**.\n\n### Gates\nFor characters made with the **Character Creation Kit**. Such a card can hold one **gated progression block**, like `[THE THAW] \u2014 gated progression`. It is a road of phases. Each phase waits behind a **trigger**: one event that has to happen in the story.\n\nThe extension keeps the place on that road, so the story does not forget it or jump ahead.\n\n1. It reads the block from the character's own lorebook entry: the phases, their triggers, and what each one needs first.\n2. The model reports a gate only when its trigger **happened in the reply**. Most replies report nothing.\n3. The extension checks the report against the card's own order, then keeps the new phase.\n4. Before the next reply, it tells the model where each person stands. Only people in the scene get a full line.\n\nOn a person's card you see:\n\n- **Phase 2 \u00b7 The Debt**: the phase they are in now.\n- **\ud83d\udd13**: a gate that is open. Its trigger can fire next.\n- **The steps**: one circle per phase. Green is lived. Filled is now. Dashed is open. Grey is locked.\n- **The road on this card**: open it for every phase, its trigger in the card's words, and what moved.\n\nSometimes a report does not fit the card. A phase was skipped, two gates fired in one reply, the other side of a fork already fired, or someone fell back several phases at once. Then nothing moves. The card shows a yellow box with **Accept** and **Dismiss**. You decide.\n\n- **Set it yourself**: pick a phase and press **Set** if the tracker is wrong. **Undo mine** takes your changes back.\n- **Other gated cards**: people you have not met yet wait here, all in Phase 0.\n- A swipe, an edit or a **Return by Death** is followed: a gate fired in an undone loop is forgotten.\n- The story is also told what is **not true yet**: anything the card tags to a later phase, like `[Phase 5]`.\n\nThe card stays in charge. The extension adds no phase and no rule. It works with V7.0 and V8.0 cards. A V8.0 card's **PHASE MAP** line is read too: forks, optional phases and second roads.\n\nSettings \u2192 **Gates (card progression)** has the switches. **Always ask me first** makes every reported gate wait for your yes.\n\nHMS Reporter has a **Gates state** slot for this, and a block called **Staying who they are** that tells the story how a gated card works.\n\n### Phone\nYour device, your money, your contacts, your messages and notices.\nSend a text, call or transfer. It goes into the story as your turn, and the bot decides whether it reaches anyone.\n\n### Letters and notes\nEverything written that you read in the story: letters, notes, pages of a book, phone threads, signs and files. Newest first. Press one to read it again.\nIn the chat they look like the real thing: a letter on old paper with a seal, a yellow note, a book page, a phone thread, a wooden sign, a typed file.\nFrom HMS Reporter 1.6, each one is written in the writer's own voice: their words and schooling, what they share with you, the state they wrote it in, and their own sign-off.\nHMS Reporter 1.4 and later asks the model for them. With another preset, switch on **Ask the model for them** (Settings \u2192 Chat display \u2192 Letters, notes and books).\n\n**New in 2.9:**\n- **Seals.** A letter, book, document or contract can carry its writer's seal: the wax colour and an emblem pressed into it (a mask, a crown, a dragon, a key, a snowflake\u2026). A writer keeps the same seal every time. Under a letter, **\u2026's seal** lets you pick the wax and the emblem yourself; **No seal** goes back to the story's.\n- **Exam papers.** A marked paper with its subject, the student, a red circled mark out of 100, \u2713 and \u2717 by the answers, the examiner's red remarks, and a stamp: **Approved**, **Passed** or **Failed** (from the pass mark). A **Grades** list shows every mark and the average.\n- **Contracts.** Who is bound, the numbered terms, what happens if it is broken, the signatures and seals (Beatrice's contract with the library, Puck's with Emilia). The **Contracts** list shows which are in force. Contracts in force are told to the story with the statuses, so it keeps their terms. **Mark this contract as ended** stops that; **It still binds** undoes it. Switch the reminder off in Settings \u2192 Chat display \u2192 **Remind the story of contracts in force**.\n\n### Body\nWounds and conditions from the HUD, with how long each has lasted.\nWhen **Body & health** is on, that card shows them instead.\n\n### Body & health\nNew in 2.6. A body, not a health bar. It is on the **You** page.\nIt is made from how these games do it: Escape from Tarkov, Gray Zone Warfare, Project Zomboid, Barotrauma, Kenshi and RimWorld.\n\n- **Two ways.** Where the bot keeps wounds on its own HUD (Re:Zero, Mushoku Tensei), the card only **reads** them. It adds no wound and runs no clock. Where the bot keeps none (Classroom of the Elite, Harry Potter, SCP, classic chats), the extension **keeps** the body from the story.\n- **The body map.** An X-ray of your body. Each part is coloured by how hurt it is: red is raw, bright red is bleeding, blue is splinted, green is tended, orange is infected. A lock mark shows a part that stops you. Press a part to see only its wounds.\n- **What you can do.** Six bars, like RimWorld: Consciousness, Moving, Manipulation (hands), Breathing, Sight and Hearing. Hover a bar to see why it is low.\n- **Locks.** Things your body **cannot** do. Two broken legs: no standing, walking, running or jumping. A splinted leg: you limp, and you cannot run or jump. A broken hand cannot grip a sword. A hurt wing cannot fly. These come from **structure**, not pain. No painkiller, adrenaline, willpower or power lifts them. The story is told so.\n- **Pain** is different. A painkiller or adrenaline **masks** it: the card shows **Pain (masked)**. Pushing on a masked cut or sprain makes it worse. After adrenaline comes a crash.\n- **Wounds have a life.** Raw, then tended. A wound that bled hard is **fresh** for half an hour: a sprint or a hit tears it open, and it bleeds again. A dressing goes **dirty** after a day (half a day while bleeding or running hard). A dirty one can get **infected**. Change it to stop that. A tourniquet stops bleeding, but left on two hours the limb starts to die.\n- **The meters.** Blood, pain, water, food, hours awake, **sanity**, stress, and stamina for legs and arms. Which ones show depends on **How much it tracks**.\n- **Sanity** (new in 2.7). From 100 (sane) to 0 (insane), with a word: **Sane**, **Shaken**, **Fraying**, **Breaking**, **Insane**. It comes from the sanity the story already reports with your own state, a `Sanity:` line on the HUD, or HUD conditions like Despair, Trauma or Madness. Low sanity is told to the story: things at the edge of sight, voices, not knowing what is real.\n- **Organs** (new in 2.7). Brain, eyes, ears, heart, lungs, liver, stomach, spleen, kidneys and guts, drawn on the X-ray. A hurt one shows as a chip and lights up on the map.\n  - One eye lost: you still see, without depth. Both: **Blind**, a lock. A punctured lung lowers Breathing. A hurt heart is a lock on hard effort. A torn stomach keeps no food down.\n  - **The race's own organs** come first: a **Gate** (Re:Zero), the **horns** (an Oni), a **core** or heart stone (a slime, a dragon), a third eye. A broken Gate: you cannot cast through it. A broken horn: you cannot draw power through it. A cracked core: one more blow may end you.\n  - Undead have no soft organs. A slime has only its core. A spirit has no flesh.\n  - **Lost for good** lists limbs that are gone.\n- **Your measurements** (new in 2.7). Height, weight, bust, waist and hips. Press **Edit** and type them: `175`, `1.75 m`, `5 ft 9`, `62 kg` or `154 lb` all work. A `Height:`, `Weight:` or `Measurements:` line on the HUD wins. Pick cm and kg or feet and pounds in Settings. The story is only told them if you turn on **Tell the story your measurements**.\n  - Bust, waist and hips are **not kept for a character under 18** (an `Age:` line under 18, a Hogwarts student, a Classroom of the Elite student).\n- **Your race counts.** Undead do not bleed, tire, eat or feel pain, but their bones still break. A slime has no bones. A spirit does not bleed. A dragon or a beast stands on four legs: one broken leg leaves a hobble on three, and its hands are **Jaws and claws**.\n- **Treat with what you carry.** Bandages, a splint, a tourniquet, painkillers, water or food from your Carried list or the HUD's inventory. Press a body part first, then a button. It goes into your next message as what you did. The story decides how well it goes. **Undo the last** takes it back.\n- **Swipes and Return by Death.** The body follows the reply you keep. A loop undone by Return by Death takes its wounds with it.\n- **What the model is told.** Before each reply, a few lines: what you can still do, the locks, what hurts. **Nothing at all while you are fine.** HMS Reporter 1.5 has a **Body state** slot for it. With another preset it goes in as its own message.\n- **Vitality** (new in 2.8). How alive you are, in one word: **Hurt**, **Badly hurt**, **Critical**, **Dying**. Bleeding hard, it also shows how long until death without help (\u23f1). The story is told only when it is **Badly hurt** or worse.\n- **Lost limbs first** (new in 2.8). A lost arm, leg, hand or eye shows in a red box at the top of the card, and is not drawn on the chart. The story gets it first too, in capitals, so it never forgets.\n- **Arteries** (new in 2.8). The main arteries are drawn on the chart: neck, shoulders, arms, thighs and knees. An opened one is red and pulses, and the death clock runs. A tourniquet stops a limb's artery, never one in the neck, chest or groin.\n- **Female chart** (new in 2.8). The chart is male or female, from the HUD's `Gender:` or `Sex:` line. Press **\u2642 Male chart** or **\u2640 Female chart** to switch, or pick it in Settings \u2192 Body & health \u2192 **Body chart**.\n- **Cold and heat** (new in 2.8). From the HUD's `Weather:` line and where you are. Out in the cold and wet you shiver, then get hypothermia, then frostbite. Heat doubles thirst, then heatstroke. Indoors takes the edge off. A \ud83c\udf21 chip shows what it feels like. The dead, spirits, and fire or ice races keep to their own side.\n- **Sickness, poison and withdrawal** (new in 2.8). A cold or fever (a cough gives away where you hide), food poisoning, venom that slowly takes breath, and the crash after painkillers taken most days.\n- **Prosthetics** (new in 2.8). On a lost limb, pick what replaces it: a peg leg, a hook, a metal limb, a magic limb, a glass eye. It gives back part of what the limb did. A broken one says **broken**.\n- **Treated and Healed** (new in 2.8). If the card keeps a wound you already fixed, press **Treated** or **Healed** on it. The story is told on the next reply. **Undo the last** takes it back.\n- **Broken bones** (new in 2.9). A broken bone shows on the chart as a crack across the bone: white while it is not set, with two wooden splints once it is splinted, yellow while it mends, grey with a bend if it healed crooked. If you lose a limb, the bones of the rest still show.\n- **Dragons** (new in 2.8). A dragon's chart has wings, horns and a tail. The tail is drawn new: it curves out behind the hips.\n- **Time skips.** A skip of three hours or more counts as eating and drinking along the way.\n- **How much it tracks** (Settings \u2192 Body & health):\n  - **None** (2.9): the wounds only, no locks and no meters.\n  - **Light**: wounds and the locks only.\n  - **Medium** (default): adds blood, **water and food**, dressings and infection, painkillers, sleep, **sanity**, **cold and heat**, and **sickness**.\n  - **Heavy**: adds arm and leg stamina, next-day muscle strain, and stress.\n  - **Custom** (2.9): you set each part. Changing one part picks Custom by itself, and keeps the rest as they were.\n- Each world's preset sets its own: Re:Zero, Classroom of the Elite, Mushoku Tensei and Harry Potter **Medium**; SCP-4666 **Heavy**; Overlord, Undertale, Dark Souls and Skyrim **Light** (they keep their HP).\n\n### Injuries\nOnly for bots that keep no wounds on their HUD (Classroom of the Elite, Overlord).\nEach injury is raw until tended. Treated is not healed. The card shows healing time and warnings.\nWith Body & health on, the model also says how hard each wound bleeds, and the Body & health card shows what the wounds mean for your body.\n\n### Mind\nMind conditions, like Dread, and the Mental Council.\n\n### Survival\nOff at first. Tracks time since you slept, ate and drank, from the HUD clock. The bot decides what it means.\n\n### Magic\nMagic pools, traditions, cooldowns, and a spellbook that learns your spells.\n\n**The spell list** shows every spell your bot's lorebook describes, by school, with its rank, what it does and its chant.\n\n- **\u2713 Known**: the story showed you cast or learn it, or you marked it.\n- **Within reach**: your rank allows it.\n- **Next rank**: one rank above you.\n- **\ud83d\udd12 Locked**: further up, or a school or element you do not have.\n- **\u2726 Special**: unique, forbidden or lost. Rank does not open these.\n\nThe HUD decides. In Mushoku Tensei it reads `Magic School: Water: Saint, \u2026`. In Re:Zero it reads `Magic: Fire | Gate: C-Rank`: your elements, and the Gate as the cap. In Overlord it reads `System: Arcane (Evocation) LV 7`: your tradition, and the tier you can cast up to (LV 11 is Super-Tier). A melded spell needs its parts. `Casting Method: Voiceless` marks chants as optional.\n\n**Spirits (Re:Zero).** The Magic card also shows your **spirit affinity** and what it allows, and every **contract** from the HUD: the spirit, its element, its rank on the ladder (Lesser, Quasi, Spirit, Great), and the spirit arts it opens. A group code like `LIVING-GATE` or `SEVEN-STARS` opens into its spirits. A contract's own clauses from the lorebook show only for the one who made it. **Spirits you may meet** lists the ones you have not contracted yet.\n\n- A **spirit art** needs a contract: with that spirit when the art names one, or with a spirit of its element when it does not.\n\n**Powers.** The Magic card also lists every power the HUD prints, with the lorebook entry its line loads. It reads the power families of *How to Build a Magic System V2.5*:\n\n- **Gifts**: `[DIVINE PROTECTION: Soul of Language \u00b7 The Sword Saint]` (also `[BLESSING: \u2026]`).\n- **Staged powers**: `[AUTHORITY: The Unseen Hand - Dormant]` or `[AUTHORITY: Return by Death] (Awakened)`, with the state.\n- **Afflictions**: a curse on the `Condition:` line, like `Wolgarm Curse (Dormant)`.\n- **Meters** with a named stage: `Corruption: 34% | Stage 2: Guiding Hand`.\n- **Grades** with a `[ROW]` entry: `Gate: D-Rank` (what it allows, what strains, what is impossible).\n- **Pleas**: `Plea: The Old River \u2014 open`.\n\nPress a power to open its entry, field by field: what it does, the trigger, the limit, the price, what cancels it, who holds it. **The rules behind them** shows each family's core entry (the one keyed on the line's label, like `[AUTHORITY:`).\nA **Veiled** power shows only **what is seen**, never its true name, its rule or its reveal. A **Soft** power shows only its nature, its price and its signs. This costs nothing: it reads the lorebook the chat already loads.\n\n- **Usable and next / All**: choose what the list shows. **Find a spell** searches as you type.\n- **Study**: press it on a spell. The story gets a short reminder with the lorebook's effect and chant, and the rule that learning takes practice and rank. The card shows how the practice goes. The first clean cast makes it Known and writes \"Learned a spell\" in the Chronicle.\n- **\u2713 and \u2715**: mark a spell known or not known by hand.\n- A rank-up on the HUD shows which spells it opened. Fights are given the spells you know.\n\nThe world's own rules still decide what you can learn. The list only reads the lorebook and the HUD.\n\n### The look\n- **The wide window**: pick **Wide window** under Where the panel lives (top bar). The panel opens big, over the chat, with a menu on the left: **World**, **People**, **You**, **Map**, **Magic & Skills**, **Story**, **Letters**, then Guide, Test zone and Settings. Each page shows its cards in two columns. Close it with \u00d7, **Esc**, or by clicking outside it. The round button in the corner brings it back. The **\u21e5** button beside \u00d7 puts the panel back in the drawer (the normal view), from any page.\n- **The day dial** at the top shows the time, the day or date, and how long the last reply took in the story. The HUD card in the chat has a small one too, before the time.\n- **The clock face** is different in every world. Classroom of the Elite: a classroom **wall clock** with an hour hand and a minute hand. Re:Zero: a **time crystal** that glows a new colour through the day. Mushoku Tensei: a stone **sundial**. Overlord: the **YGGDRASIL ring**. Harry Potter: an **astrolabe**. SCP-4666: a **digital** clock. Skyrim: a carved **rune stone** with the northern lights at night. Dark Souls: a **bonfire** that burns low at night. Undertale: a **pixel box** with your SOUL on the hour. Any other bot: a round 24-hour dial. Pick one yourself: Settings \u2192 Look \u2192 **Clock face**.\n- **The weather report** sits next to the clock: an icon, the word, and the temperature in **\u00b0C**. It reads a `Weather:` or `Temperature:` line on the HUD. A temperature in \u00b0F is turned into \u00b0C. With **Sky above the clock** set to **Time, weather and season**, the model is also asked for the temperature.\n- **The weather in detail**: press the weather report. It opens: the temperature in \u00b0C and \u00b0F, what it feels like, the wind, rain or snow, what comes later, what it does to the scene, and what changed since the last reply. Then **the day**: sunrise, sunset and hours of daylight for the world's own latitude (polar night and midnight sun in the far north), how long until the next sunset or sunrise, the moon's phase and the weekday when the date has a year, and the season. Feels like, wind, later and the scene need **Sky \u2192 Time, weather and season** and **More weather detail** (on at first).\n- **Page shortcuts**: in the drawer, the floating window and the own window, a row of buttons at the top (World, People, You, Map, Magic, Story, Letters) jumps to that page's cards. Switch it off in Settings \u2192 Look.\n- **The sky above the clock**: a small window with the sky of the hour (dawn, day, dusk, night with stars). Set **Sky above the clock** to **Time, weather and season** and it also shows rain, snow, fog or storm, and the season on the ground: a winter night with snow on white hills. That asks the model for the weather (a few words). **Off** hides it.\n- **Themes**: each bot has its own, and there are four looks for any bot: **Lantern**, **Tidepool**, **Dusk** and **Paper**. The **SCP Foundation** theme looks like a typed report. **Harry Potter (Hogwarts)** is gold on dark parchment, with wax-seal pictures.\n- The cards under each reply can wear the same looks: Settings \u2192 Chat display \u2192 **Card colours**. A look has a shape too: the SCP report is square, Tidepool is round.\n- Under a reply, each person has a card and their thought sits in a **thought cloud**. In **Minds**, each feeling that moved is a small pill with its name: green is good news, red is bad news.\n- **Easy reading** also changes the cards in the chat: more space, no slanted type.\n- **Perch** is the mascot: a small fish in a top hat. He has left the top bar. He opens the guide, and he is the round button that brings the wide window back.\n- **Move Perch**: drag the round button anywhere on the screen. He stays there, even after a reload or a smaller window. The arrow keys move him too (Shift for big steps). Settings \u2192 Look \u2192 **The round button on the screen**: **Wide window only**, or **Always** (then he also opens the drawer, the floating window or the own window). **Put it back in the corner** resets him. Pick **Never** to hide him: then open the panel from its drawer tab (new in 2.8).\n- **On a phone** (new in 2.8): the wide window fills the screen, its menu shows icons only, and every page and Settings stack in one column.\n\n### Skills & traits\nYour skills, traits and attributes, read from the HUD. It is on the **Magic & Skills** page (2.8).\n- **Skills** are learned: they level up or evolve.\n- **Traits** you are born with: always on.\n- **Other**: titles, contracts, items and roles.\n\n### Quests\n- **The plot**: where the story stands, and its open threads.\n- **\ud83d\udd2b Planted details** (Chekhov's gun): small things the story planted that should pay off later. **Ripe** ones are free to pay off. A \ud83d\udd12 one waits for a time, a person or a condition. Press \u2715 to drop one that does not fit.\n- **Objectives**: what you are trying to do now. You can add your own. Yours are never sent to the model.\n- **Quests** from the HUD, with the goal, who gave it, where, the reward, and the time left.\n- **Your notes** are never sent to the model.\n- If a quest drops off the HUD while still live, press **Put back**.\n\n### Chronicle\nThe story's timeline: key moments, milestones, how people came to feel about you, and plot points.\nFilter it, star an entry, hide one, or add your own.\nSettled replies are written to the Memory Cortex. See part 9.\n\n### Picture prompt\nNew in 2.8. On the **Story** page. It writes a picture prompt from the HUD (place, time, weather) and the people in the scene. Pick **Full scene**, **One character** or **Action**, the shape, and the image tool (**Krea 2**, **Nano Banana**, **Qwen Image**). Press **Copy** and paste it into any image tool. It costs no tokens.\n\n### Chapters\nSummaries of parts of the story. Press **End chapter and summarise** when a part ends.\nSummaries go with every message, on top of the chat.\n\n### OOC guide\nAsk the bot's guide a question. See part 8.\n\n### Critical\nA red banner for real danger: health near zero, a condition at its worst, a wound left raw too long.\n\n### The fight tracker\nDuring an immersive fight: everyone's HP, MP and Stamina, effects, what each fighter just did, and a fight log.\n**Side by side** (new in 2.8) puts you next to up to three enemies: each pool, with the best in each row lit. Your stats show; theirs show **?** until you **Study** them.\n\n### Fights\n\n| Kind | How it works |\n| --- | --- |\n| **Immersive fight** | No window. You fight by writing in the chat. The panel tracks bodies, effects and moves. Enemies keep hidden plans. **Study** an enemy to learn its weak points. The bot's rules decide who wins. |\n| **Turn-based fight** | A D&D window: initiative, attack rolls, damage dice, saving throws. The extension rolls the dice. When it ends, the aftermath is posted to the chat as a normal reply, with the HUD. |\n| **Narrative window** | The old fight window. Hidden unless you switch it on in Settings \u2192 Fights \u2192 Legacy. |\n\n### In the chat itself\n\n- **The HUD card.** The HUD drawn as a neat card in the bot's colours. The saved reply keeps its plain text. **Show the HUD as text** opens the plain version.\n- **Internal states** under each reply: tabs for Scene, People, Minds, Bonds, Plot and Map. **Minds** shows what moved inside each person in that reply.\n- **Dialogue display** (off at first): an emoji for each speaker's feeling, a colour per speaker, or their name. **Tone of voice** draws a whispered line in italics, a biting one in bold.\n- **Let the model add its own emoji** (off at first): the model writes the emoji itself, any emoji, as many as it likes. This turns off the drawn ones.\n- **HUD style**: **Rows** (the whole card) or **Pills** (each line a small pill; press a long one to open it).\n- **Letters, notes and books** drawn as the real thing, right where they are in the reply.\n\n### Test zone\nA practice chat inside the extension. It runs the same code as a real chat and touches none of your chats.\n**Demo** plays scripted turns for each world and costs nothing. **Live** uses your model.\n\n- **Worlds**: Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim, and a classic chat with no HUD.\n- **The demo shows the new things**: the weather and \u00b0C on the clock, a letter, a note, a sign or a notice in the Letters card, and in Re:Zero a spirit contract. Re:Zero, Overlord and Mushoku Tensei come with a small demo lorebook, so the Magic card has a spell list. Your own lorebooks are not read here.\n- **2.5 in the demo**: Re:Zero shows **Powers** in the Magic card (Return by Death, Soul of Language, a Veiled condition, the Wolgarm Curse, the Gate row) and the **Race** card with **Try a race**. Classroom of the Elite has a slice of the CotE location book, so the **Atlas** and the **room map** show in the Delta classroom, and **Honami's gate** fires (The Fallen, Phase 1). Harry Potter has **Draconia Malfoy** at eleven: the Thaw, phases 0 to 3 only, and its first gate at the Owlery.\n- **2.6 in the demo**: Classroom of the Elite has two new turns. Turn 4: you fall on the stairs (a broken shin, a deep cut that bleeds hard, a stubbed toe). Turn 5: the infirmary (a splint, a bandage, two pills). Open the **You** page to see the **Body & health** card. In Re:Zero the card reads the HUD's own wounds. **Try a race** has dragons, serpents, a slime and a spirit, and the Body card follows the race you try.\n- **2.7 in the demo**: in Re:Zero, open **You \u2192 Race**. Try **Oni** and press **Out** on the horns. Try **True Dragon** and press **Human form**: the Body card stands up on two legs. Try **Slime** for the new look and its core. In Classroom of the Elite, turn 4 shows **Sanity 72% \u00b7 Shaken**.\n- **2.9 in the demo**: in Re:Zero, the Forbidden Library on the **Map** has its shelves, rug, table, ladder and lamp; the Great Hall has pillars and windows (try **3D**). In **Letters**: Roswaal's note with his violet seal, and two contracts (Beatrice's and Puck's). In **People**, star Rem and open her **History**. In Classroom of the Elite, **Letters** has a marked midterm paper, and the **You** page shows the broken shin as a crack, then splinted.\n- **2.8 in the demo**: in Re:Zero, open **Map \u2192 Floor plan** in Roswaal's mansion (the library and the upstairs hall) and try **Floor plan** and **3D**. Beatrice's card in **People** shows her **Body**. In SCP-4666, the last turn has the cold, an opened artery with its clock, the **female chart**, and three **Statuses**: Mari asleep, Lars missing, Henrik dead (beheaded). Open **People \u2192 \ud83d\udc80 Deceased** to see his chart. Undertale has a **RESET**: the whole run starts over. Skyrim has a vampire turn: the Race card lists it as an evolution.\n- **In the wide window** the test zone has the same page menu as a real chat. Each page has a strip at the top with **Next turn** and **Back to the test zone**.\n- **In the other windows** the page shortcuts sit under the controls.\n\n---\n\n## 7. Minds (from FrankenSIM)\n\n**Minds** is how the people of the story feel, think and act. It comes from **FrankenSIM 4 Mini by Wireless (Ryah)**, with permission. **TFDY** (Tenderness, Fury, Dread, Yearning) is by **Pyropia**. Thank you both.\n\n### How it works\n\n1. The model writes the story as usual.\n2. In the hidden block, it says only **what moved** inside each person in this reply, and why.\n3. The extension does the math: it keeps every number, caps each step, lets old feelings fade, and remembers.\n4. Before the next reply, it hands the state back to the model as memory.\n\nThe bot still wins. Its character cards say who someone is. Minds only remembers what the story showed.\n\n### Inside a person\n\n| Part | What it means |\n| --- | --- |\n| **Feeling** | What they feel now, named by where it leads (Parrott's list: love, joy, surprise, anger, sadness, fear), and at whom. |\n| **TFDY** | Their mood under everything: \ud83d\udc97 Tenderness, \ud83d\udd25 Fury, \ud83d\ude30 Dread, \ud83c\udf19 Yearning, from 0 to 4. Each rests at a level set by their temperament. |\n| **Shows** | How warm they act on the outside: \u2744\ufe0f frostbound, cool, temperate, warm, \ud83d\udd25 fervent. It can differ from what they feel. |\n| **Mask** | The face they wear: held, cracking or off. |\n| **Sides of them** | Five to seven sides from their card. One leads at a time. If the same one leads three replies running, the panel says so. |\n| **Still carrying** | A strong feeling from the last few replies that has not gone away. |\n\n### Toward you (and toward each other)\n\nTwelve feelings, each from 1 to 20:\n\n| Warm | Its mirror |\n| --- | --- |\n| \ud83c\udf36\ufe0f Desire | \ud83d\ude20 Hate |\n| \ud83c\udfb2 Play | \ud83e\udd4a Strife |\n| \ud83e\udd1d Friendship | \u2744\ufe0f Enmity |\n| \ud83d\udee0\ufe0f Partnership | \ud83e\udea8 Stuck |\n| \ud83c\udfe0 Belonging | \ud83c\udf2b\ufe0f Indifference |\n| \ud83d\udd4a\ufe0f Care | \ud83d\udc0d Envy |\n\n- **A wall** (\u26a0\ufe0f): a feeling and its mirror are both high (10 or more), like desire and hate. It comes out sideways.\n- **Gate** \ud83d\udeaa: how far they let themselves feel: dormant, attentive, aware, longing, open. It moves one step at a time, and only for an event.\n- **Shows it / Says it**: whether the feeling comes out in what they do and in what they say.\n- **Filters**: what holds the feeling back (social, values, fit, ties). Each can crack open step by step. Open never closes again.\n- **Owed** \u2696\ufe0f: a wrong done to them. It stays until it is made good.\n- **Mode**: stranger, warm, strained, hostile, lovers and more.\n\n### The math the extension does\n\n| Rule | What it means for you |\n| --- | --- |\n| **Most a feeling moves in one reply: 2** | One scene cannot flip a person. |\n| **Fading: one step every 3 quiet replies** | A feeling nothing feeds goes back toward where it rests. Big feelings fade a little faster. |\n| **Settling** | A feeling pushed the same way three times becomes part of who they are to you. |\n| **Never 0** | Nobody feels nothing. A first meeting starts at 3 or more. |\n| **Minors and family** | Never desire, never a romantic mode, whatever the model says. |\n| **Return by Death** | When time goes back, everyone forgets the undone loop: its feelings, what they learned there, and their plans. Planted details stay, because you saw them. |\n\nYou can change the step size and the fading speed in Settings \u2192 **Minds**.\n\n### Agendas, knowledge and planted details\n\n- **Agendas** \ud83d\udccd: what each person is doing, where, and until when, here or elsewhere. When the time passes, the panel says **over by**. Nobody jumps between places.\n- **Who knows what**: each fact a person learned, and how: \ud83d\udc41\ufe0f saw it, \ud83d\udc42 overheard, \ud83d\udde3\ufe0f told by someone, \ud83d\udd0e evidence, \u2709\ufe0f message, \ud83c\udf10 common knowledge, \ud83d\udcac gossip, \ud83e\udd14 guessed. A **false belief** is underlined in red. Press \u2715 if someone should not know a thing.\n- **Planted details** \ud83d\udd2b (Chekhov's gun): in the Quests card. The story decides when one pays off. Up to 20 are kept. Old light ones fade away.\n- **Building maps**: in the Map card, from the rooms the story drew.\n\n### Switch parts on and off\n\nSettings \u2192 **Modules** \u2192 **Minds (from FrankenSIM)** has five switches: Minds and feelings, Agendas, Who knows what, Chekhov's gun, Building maps. Settings \u2192 **Minds** has the details. **Undo my corrections** brings back facts and details you took out.\n\n**Cost:** with everything on, about 1,000 tokens of instructions and 300 to 600 tokens of state per reply, plus what the model writes in its hidden block.\n\n---\n\n## 8. Ask out of character (OOC)\n\nEach bot has a guide character who answers questions about the world, the rules and the commands.\n\n| Bot | Guide | Trigger |\n| --- | --- | --- |\n| Re:Zero | Echidna | `[OOC: your question]` |\n| Mushoku Tensei | Roxy | `OOC guide: your question` |\n| Overlord | Demiurge | `OOC guide: your question` |\n| Classroom of the Elite | Arisu Sakayanagi | `OOC guide: your question` (also `[OOC:` or `OOC:`) |\n| Harry Potter, SCP-4666, Undertale, Dark Souls, Skyrim | The one the bot names | The bot's own trigger. The OOC card reads it from the bot's lorebook. |\n\n### Two ways to ask\n\n1. **In the panel**: open the **OOC guide** card, type your question, press **Ask**. The answer stays in the panel. The story never sees it. It costs one model call.\n2. **In the chat**: press **Ask in the story**, or type the trigger yourself.\n\nYou can name another guide in the **Guide** box, if the bot allows it.\n\n### What happens on an OOC turn\n\n- No HUD, no story, and no time passes.\n- The extension adds nothing to that turn and does not read the answer as story.\n- Your next normal message picks the story up again.\n\n---\n\n## 9. Memory: what remembers what\n\n| Helper | Part | What it keeps | Reaches the model? |\n| --- | --- | --- | --- |\n| **Chronicle** | Extension | The timeline: moments, milestones, bonds, plot | Yes, through the Memory Cortex |\n| **Chapters** | Extension | Summaries of story parts; loops in Re:Zero | Yes, as \"the story so far\", once summarised |\n| **Map bank** | Extension | Every room drawn, per world | Only a short room plan when needed |\n| **Minds** | Extension | Feelings, agendas, who knows what, planted details | Yes, as the minds state before each reply |\n| **Memory Cortex** and **Chat Memory** | Lumiverse | People, places, links between them, older passages | Yes, through the preset's Memory block |\n| **Loom Summary** | Lumiverse | One summary of the story | Only if you switch on its block in the preset |\n\n### The Chronicle and the Memory Cortex\n\n- A reply is written to the Cortex only after you answer it. So a swipe never leaves a wrong memory.\n- Each entry becomes a fact on the people it is about, with an importance tag.\n- Choose how much is written: Settings \u2192 **Chronicle** \u2192 Write to the Memory Cortex. **Key moments, bonds, plot and milestones** is the default.\n- **Write now** writes at once. **Write everything again** is for after a Cortex rebuild. Nothing is written twice.\n- In Re:Zero, a loop undone by Return by Death is written as undone.\n\n### Tip\n\nUse **Chapters** or the **Loom Summary**, not both. Both would send a summary of the same story.\n\n---\n\n## 10. Settings, section by section\n\nSettings opens as a list of sections. Click one to open it. Every switch has a short note under it.\nEach heading has a small picture in your theme's colours. The box at the top finds a switch by name: type **clock** or **emoji** and only the sections with it stay.\n**Tabs** (new in 2.8) sit under the box: **All**, **Setup & Look**, **World & Maps**, **People & Minds**, **Body & Health**, **Magic & Skills**, **Fights & D&D**, **Memory & Chapters**, **Advanced**. Each shows only its sections.\n\n| Section | What it holds |\n| --- | --- |\n| **Play style** | World presets (one click per bot), play styles (HMS Narrative, D&D, Power scaling, Pure narrative, Gritty survival, Social and romance), and your own saved presets. **How much** (2.8): **None / Custom**, **Potato**, **Light**, **Medium**, **Heavy** or **Max**, on top of the world or style you pick. They match the preset's **Mode**. **None** sets nothing: every tracker stays as you have it. D&D is on only in the **D&D** style. Your own saved presets keep exactly what you saved. |\n| **Look** | The panel theme, density and text size, **Easy reading**, the day dial, **Clock face**, **Sky above the clock**, **More weather detail**, the labels in the wide window's menu, **Perch** and **The round button on the screen** (only when the wide window is closed, always, or **never**; with **Put it back in the corner**), and the page shortcuts. Where the panel lives (drawer, floating, own window, **wide window**) is in the top bar. |\n| **Modules** | Every feature in one list. Switch off what you do not use: it leaves the panel and the prompt, and costs no tokens. These are the same switches as in the sections below. The small arrow next to one opens its section. |\n| **HMS engine** | HMS mode (automatic, always, off), the hidden block, fetching a forgotten block, the guard for dropped lines, the pin reminder. |\n| **HMS systems** | How the HUD is read: pools and meters, wounds and conditions, abilities and attributes, people and their bars, the phone, the party, the survival clock, injuries, experience. |\n| **Minds (from FrankenSIM)** | Feelings (twelve feelings or the classic bars), between the others too, the step size, the fading speed, handing the state back, agendas, who knows what, Chekhov's gun, building maps, and the credits. |\n| **Characters** | The tracking level (None, Light, Standard, Full, Custom), every switch about people in one place, profiles for people without a card, your party's **bodies**, the **Statuses** switches, and undoing your profile changes. |\n| **Gates (card progression)** | Keeping each character's phase from their card's gated block, moving by itself or asking you first, handing the positions back, the list of cards it read, and undoing your own changes. |\n| **Body & health** | On or off, **How much it tracks** (None, Light, Medium, Heavy, Custom), each part on its own (locks, dressings, blood, sleep, water and food, stamina, strain, stress, **cold and heat**, **sickness**, sanity), the **Body chart** (from the HUD, male or female), **arteries**, **vitality**, using the Race card, **asking the model about your shape**, **Units** (cm and kg, or feet and pounds), **telling the story your measurements**, telling the story, asking the model for the body note, and where **HP** shows. |\n| **Maps** | New in 2.8. Everything that draws a map: **Floor plans** (how much to keep, who stands where, asking the model for new rooms), the **Atlas**, the **room map** and map bank, and **building maps**. |\n| **Magic & Skills** | New in 2.8. The Magic card, the spell list, studying, powers, and the skills and traits card. |\n| **Quests** | The Quests card, quest details, the plot, objectives, the quest journal, quest labels and states. |\n| **Chapters** | Automatic chapters for loops, arcs, days or months; summaries; whether they go with every message and with fights. |\n| **Chronicle** | On or off, asking the story for key moments (and, 2.9, **milestones in other people's lives**), and how much goes into the Memory Cortex. |\n| **Lorebook context** | Whether the extension's own calls get your lorebooks, which ones (fight calls, tracker and companion calls, portrait calls), how lore is found, and what the last call sent. |\n| **Engine core & memory** | Whether fights run on the bot's engine, and how much long-term memory they recall. |\n| **General** | The master switch, Together or Separate mode, the connection for the extension's own calls, and time limits. |\n| **Panels** | Which classic panels show, and bar colours. |\n| **Chat display** | Internal states under each reply, the map and map bank, the HUD card (**Card colours**, **HUD style**: Rows or **Pills**), **Letters, notes and books** (2.9: **Remind the story of contracts in force**), dialogue emoji, **Let the model add its own emoji**, colours and names, lock and plot buttons, weather effects, portraits. (Called Chat and panel extras before 2.4.) |\n| **Present characters setup** | What is asked about each character in the scene: details, thoughts, character bars. (Called Characters setup before 2.4.) |\n| **Fights** | **Fights on**, difficulty, how immersive fights resolve, fate dice, effects, moves, hidden plans, the legacy window. Links to Lorebook context and D&D. |\n| **D&D** | The D&D card, the roller, the HUD's scores, turn-based fights, **No cap on stats**. Off unless you pick the D&D style. |\n| **Story extras** | Extras from the original RPG Companion: immersive HTML, dialogue colouring, deception tags, the omniscience filter, choose your own adventure (off in HMS chats), song suggestions. |\n| **Tracker field presets** | Save and load whole tracker setups, mostly for classic chats. Link one to a character. |\n| **Custom prompts** | The words each feature sends, editable. Empty uses the built-in words. The switches for them are in Story extras. |\n| **Help & bug report** | **Open the guide**, and **Copy bug report** for Discord. No chat text unless you tick the box. |\n| **Reset** | Clear this chat's trackers, or reset all settings. |\n\n**Together or Separate?** Together (the default) gets the side-panel data in the same reply: one call. Separate makes a second call after each reply. Use Separate only if your model keeps forgetting the hidden block.\n\n---\n\n## 11. When something goes wrong\n\n| Problem | What to do |\n| --- | --- |\n| The World State card is empty. | It says why. Often the model wrote the HUD inside its thinking. Press **Read again**. The extension also moves a HUD out of the thinking by itself. |\n| A card did not update. | Press **Read again**. It is free. |\n| \"The reply left out the side-panel block.\" | The extension fetches it with a quick second call. If it happens a lot, use **Separate** mode (Settings \u2192 General). |\n| A HUD line vanished. | Press **Restore** in the World State card. Pin the line if it keeps happening. |\n| The reply has no HUD at all. | Press **Put the last HUD back**, or swipe for a new reply. |\n| The HUD header shows twice. | The extension keeps one by itself. If it keeps happening, set the preset's HUD header slider to **Never**. |\n| \"The Arc line loads no arc entry.\" | Press **Use** to put in the book's spelling. |\n| An OOC answer came back with a HUD or a story. | Check the trigger is at the very start of your message, like `[OOC: ...]`. |\n| No emoji or dialogue colours. | They are off at first: Settings \u2192 Chat display \u2192 Dialogue. |\n| A letter shows as plain text with [LETTER] around it. | The block was not closed with [/LETTER], or Letters, notes and books is off. With a preset that is not HMS Reporter 1.4, switch on Ask the model for them. |\n| The wide window is gone. | Press the round button in the bottom right corner. Or pick Drawer under Where the panel lives. |\n| The clock shows no temperature. | The HUD needs a `Weather:` or `Temperature:` line with a number and \u00b0C or \u00b0F. Or set Settings \u2192 Look \u2192 **Sky above the clock** to **Time, weather and season**. |\n| The test zone shows only the controls. | Press **Start**. In the wide window the cards are on the pages in the menu. |\n| I cannot find a setting. | Type its name in the box at the top of Settings. |\n| The New game card does not show. | It only shows on a new chat whose first message has catalog pages. |\n| The D&D card shows in a game without dice. | Use your world's preset, or switch D&D off in Settings \u2192 Modules. |\n| \"Your provider allows only one request at a time.\" | Wait for the reply to finish, then press **Refresh**, or **Read again** (free). |\n| A permission is missing. | Grant it in the Extensions panel. The part that needs it says which one. |\n| Someone knows something they could not know. | Open their card \u2192 Inside, feelings and what they know \u2192 press \u2715 on the fact. |\n| A planted detail does not fit the story. | Quests card \u2192 Planted details \u2192 press \u2715. |\n| The text is hard to read. | Settings \u2192 Look \u2192 **Easy reading**. It adds space between letters, words and lines and removes slanted type. **Text size** is next to it. |\n| I do not want the fish or the clock. | Settings \u2192 Look \u2192 switch off **Perch, the mascot** or **The day dial**. |\n| The spell list is empty. | The spells must be in a lorebook this chat uses. It reads `[SPELL \u2014 Name]` entries with `School:` and `Rank:`, an entry per spell with a `## Name` title and `Tier:` and `School:` lines (Re:Zero), lists under `## Water \u2014 Elementary Rank` (Mushoku Tensei) or `### 1st Tier` with a `**System:**` line (Overlord), lines like `Name [Fire Magic - Advanced]:`, spell indexes and the Master Spell Index. |\n| No spirits in the Magic card (Re:Zero). | The HUD needs a `[SPIRIT CONTRACT: \u2026]` line or a `Spirit Affinity:` line. |\n| A spell shows the wrong state. | Press \u2713 or \u2715 on it. In Re:Zero the card says where the Gate cap comes from: the bot's own Gate table, or a plain default. |\n| People pop up out of nowhere. | Keep **Comings and goings** on in the preset. With building maps on, the story is also told how many rooms away each person is. |\n| Someone is in the wrong phase. | Open their card \u2192 the road on this card \u2192 pick the phase \u2192 **Set**. If a yellow box is waiting, press **Accept** or **Dismiss**. |\n| A character with a gated card has no \ud83d\udddd\ufe0f line. | The card must be an entry in a lorebook this chat uses, with a line like `[THE THAW] \u2014 gated progression` and `PHASE 1 \u2014 NAME` headers. Settings \u2192 Gates (card progression) lists the cards it read. |\n| Someone's feelings look wrong. | They move at most 2 per reply, so give the story a few replies. If the relationship itself is wrong, use **Set the bond**. |\n| Too many tokens. | Settings \u2192 Play style \u2192 **How much: Light**, then Apply. Or switch off parts of Minds in Settings \u2192 Modules. |\n| The Atlas is missing in my chat. | Fixed in 2.7.1: one odd line in the location book no longer hides the whole map. If it is still missing, check **Atlas** is on in Settings \u2192 Modules and that the HUD has a `\u25c6` location line. |\n| Someone who is not here shows up in People. | From 2.7.1 they fold away under **Elsewhere**, or their card says **not in this scene**. The story still follows what they do. Turn **Agendas** off in Settings \u2192 Modules to stop that. |\n| I cannot get out of the wide window. | Press **Esc**, or **\u21e5** beside the \u00d7 at the top right. Or pick **Drawer** under Where the panel lives. |\n| I cannot get out of the test zone. | Press **Leave test zone** in the menu, or **Leave** in the strip at the top of a page. |\n| The cost chip says `~?`. | Nothing was measured in this chat yet. It fills in after the next reply, and from 2.7.1 it stays after a reload. |\n| The story let me run on a broken leg. | Check Settings \u2192 Body & health is on, with **Tell the story** on. With HMS Reporter, keep the **Body state** block on. Where the bot keeps its own wounds, the HUD must list the break on its `Injuries:` line. |\n| My HP is gone. | In worlds without hit points the Body & health card is your health. To bring HP back: Settings \u2192 Body & health \u2192 **HP** \u2192 **Always show HP**. |\n| The card says I am in the wrong form, or my horn is hidden when it is out. | Open **You \u2192 Race \u2192 Your shape now** and press the right button. It holds until the story or the HUD changes it. |\n| Bust, waist and hips are missing. | They are not kept for a character under 18. An `Age:` line of 18 or more on the HUD brings them back. |\n| The Body card shows a wound I already healed. | Where the extension keeps the body, the model's next note fixes it. You can also fix the Injuries card by hand. Where the bot keeps wounds, its HUD wins. |\n| The floor plan shows no room. | Settings \u2192 **Maps** \u2192 **How much to keep** must not be Off. The model draws a room the first time you enter it. |\n| Someone is asleep, dead or missing, but they are not. | Open their card in **People** \u2192 **Status of \u2026** \u2192 **Change**. |\n| The body chart is male, but my character is female. | Press **\u2642 Male chart** on the card to switch. Or add a `Gender:` line to the HUD, or pick it in Settings \u2192 Body & health \u2192 **Body chart**. |\n| The D&D card is gone. | From 2.8 it is off unless you pick the D&D style. Switch it on in Settings \u2192 Modules \u2192 **D&D**. |\n| The round button is in the way. | Settings \u2192 Look \u2192 **The round button on the screen** \u2192 **Never**. Then open the panel from its drawer tab. |\n| A wound I treated is still raw. | Press **Treated** or **Healed** on it in the Body & health card. |\n| A starred person never seems to move. | Their last line may have no end time. Wait six replies, or set the HUD clock forward: the story is asked again. |\n| The floor plan shows the wrong room. | Check the HUD's place line names the floor, like \"(Second Floor)\". Two rooms with one name are told apart by it. |\n| A contract the story ended is still told. | In **Letters**, open it and press **Mark this contract as ended**. |\n| Something else. | Settings \u2192 **Help & bug report** \u2192 **Copy bug report**, and paste it in the Discord. |\n\n### What it costs\n\n**The cost chip** (\u2699 ~N tokens, top bar) shows what the extension added to the last reply, measured, not guessed. Press it for the parts: the side-panel request (in the preset's slot or as its own message), notes, Minds, Gates, the people and the fight, each with its tokens, and the hidden block the model writes back. Your bot's own tokens (card, lorebook, history) are not in it. Fights, the OOC guide and chapter summaries are their own calls and are listed under it. The numbers are estimates (about 4 letters a token).\n\n- The hidden-block request is about 1,000 to 1,700 tokens per reply, depending on what is switched on.\n- Minds adds about 1,000 tokens of instructions and 300 to 600 tokens of state per reply. Switch parts off to save.\n- The character blocks in the preset add about 2,300 tokens. The preset's **Mode** decides: **Light** swaps them for one short paragraph, **Potato** for the short rules.\n- **Floor plans** (2.8): about 60 tokens for a new room, about 150 for a new floor plan, only when you reach a room the plan does not know. Off costs nothing.\n- **Statuses** (2.8): nothing while everyone is fine. One line per person who is not, and a short ask when one changes.\n- **Party bodies** (2.8): a few lines while a party member is hurt, and the wounds the model reports when they change.\n- **Milestones** (2.9): about 50 tokens of request; most replies answer [].\n- **Starred people** (2.9): about 90 tokens of request, plus a short agenda line for each in the story text.\n- **History** (2.9): up to three short lines each for the people in the scene.\n- **Contracts in force** (2.9): one line per contract (up to four), sent with the statuses.\n- **Floor plans** (2.9): a new room's request also carries the lorebook's words for it (up to about 225 tokens), and the list of things (about 90 tokens). Only when a room is new or people came or left.\n- **On you**, **Picture prompt**, **arteries** and **vitality** read what is already there: no tokens, except one vitality line once you are badly hurt.\n- A profile costs about 170 tokens, once, in the reply after someone new shows up. Reading cards costs nothing.\n- Studying a spell adds about 100 tokens while you study. The spell list itself costs nothing.\n- Gates adds about 150 tokens of instructions while a gated character is around, and one line of state per such character. A scene without one costs nothing.\n- **Written things** (letters, notes, books, texts) adds about 200 tokens per reply: the preset's block, or the extension's line if you switched on **Ask the model for them**. Drawing them costs nothing.\n- **Sky above the clock \u2192 Time, weather and season** adds about 25 tokens per reply: it asks for the weather and the temperature. **More weather detail** adds about 30 more (feels like, wind, rain or snow, later, the scene).\n- Powers in the Magic card and the Race card cost nothing: they read the lorebook the chat already loads.\n- **Body & health** costs nothing while you are fine. Hurt, the body note is about 60 to 150 tokens before a reply. Where the extension keeps the body, it asks for about 90 tokens more and the model writes back 10 to 40. Where the bot keeps its own wounds, nothing is asked.\n- **Your shape** (2.7) is asked only for a race that can hide parts or change form, and only when the HUD does not already say it: about 40 tokens. **Tell the story your measurements** is off by default; on, it is one line of about 15 tokens.\n- **How much** in Play style: **Potato** is about 150 to 300 tokens a reply, **Light** about 300 to 500, **Medium** about 700 to 1,100, **Heavy** about 1,300 to 2,000, **Max** about 2,000 to 3,000. **None** changes nothing.\n- Modules you switch off cost nothing.\n- Fights, the OOC guide and chapter summaries each make their own call when you use them.\n\n---\n\n## 12. Words used in this guide\n\n| Word | Meaning |\n| --- | --- |\n| **HMS** | The game engine inside the bot's card. |\n| **HUD** (WORLD STATE) | The block at the top of each reply: time, place, arc, powers and more. |\n| **The wall** | The `***` line under the HUD. The story starts after it. |\n| **STATE IS GOD** | The bots' rule: the HUD is true, and the story must agree with it. |\n| **Carrier line** | A HUD line whose words keep a lorebook entry loaded, like the Arc line. |\n| **Start handler** | The bot's start line, like `ReZero_Start_Handler`. Your first message begins with it. |\n| **Catalog** | The pages of the bot's first message: how to start, and all the commands. |\n| **Canvas** | The almost empty catalog page you type your start under. |\n| **OOC** | Out of character: a question to the bot's guide, outside the story. |\n| **Hidden block** | The small `<rpg_companion>` data after the story. The extension reads it and removes it. |\n| **Pin** | Keep a HUD line exactly as it is. |\n| **Guard** | The check for HUD lines that vanished. |\n| **Swipe** | Another version of a reply. The extension follows the swipe you keep. |\n| **Gated block** | The part of a character card that holds their road of phases: `[THE \u2026] \u2014 gated progression`. |\n| **Phase** | One step on that road. Phase 0 is the card as written. |\n| **Gate / trigger** | The event that opens a phase. It has to happen in the story, whole. |\n| **Lorebook** | The bot's world entries. A keyword in the chat loads an entry. |\n| **Memory Cortex** | Lumiverse's memory of people, places and their links. |\n| **Preset** | The prompt recipe Lumiverse sends to the model. Here: HMS Reporter beta. |\n| **Extension** | An add-on for Lumiverse. Here: RPG Companion HMS Edition. |\n| **Together / Separate** | Whether the side-panel data comes in the same reply, or from a second call. |\n| **Settled reply** | A reply you have answered. It can no longer be swiped away. |\n| **Minds** | How people feel, think and act, from FrankenSIM. The extension keeps the numbers. |\n| **TFDY** | Tenderness, Fury, Dread, Yearning: a person's mood under everything, 0 to 4. By Pyropia. |\n| **Shows (IW)** | How warm a person acts on the outside. FrankenSIM calls it Inner Weather. |\n| **The twelve feelings** | Desire, Play, Friendship, Partnership, Belonging, Care, and their mirrors Hate, Strife, Enmity, Stuck, Indifference, Envy. |\n| **Settles at** | Where a feeling rests. It moves slowly, when a feeling is pushed the same way again and again. |\n| **Wall** | A feeling and its mirror both high at once. |\n| **Gate** | How far a person lets themselves feel for someone. |\n| **Agenda** | What a person is doing, where, and until when. |\n| **Chekhov's gun** | A detail the story planted that should pay off later. |\n| **Lock** | Something your body cannot do because a part is broken or gone. No pill or power lifts it. |\n| **Capacity** | How well your body can do one thing: think, move, use hands, breathe, see, hear. 100% is whole. |\n| **Masked** | Pain hidden by a painkiller or adrenaline. The wound is still there. |\n| **Fresh wound** | A wound that bled hard and was just closed. A sprint or a hit tears it open. |\n| **Form** | The shape you are in now: your race's own, a human form, or another one. |\n| **Hidden part** | A horn, wings or a tail the race can tuck away. Out, it is drawn solid; hidden, dashed. |\n| **Evolution** | The race itself changing into a higher one, like Goblin to Hobgoblin. |\n| **Gate** | In Re:Zero, the organ mana passes through. Broken, you cannot cast. |\n| **Mode** | The preset's one dial: Potato, Light, Medium, Heavy, Max, or Custom. The extension's **How much** has the same steps. |\n| **Vitality** | How alive you are: Hurt, Badly hurt, Critical, Dying. |\n| **Status** | A badge for someone not as usual: asleep, out cold, dead, tied up, missing, charmed. |\n| **Floor plan** | The rooms of a place drawn from above, or in 3D. |\n| **Prosthetic** | A peg leg, a hook, a metal or magic limb, or a glass eye in place of a lost one. |\n| **Star** | A mark on a person's card: they live their own life off screen, and the story keeps up with them. |\n| **Milestone** | A turning point in a character's own life: a promotion, an oath, a loss, a new rank. |\n| **Contract** | A written pact: who is bound, the terms, the price of breaking it. It binds until it ends. |\n| **Seal** | A writer's own wax mark on a letter, book, document or contract. |\n\n---\n\n## 13. Credits\n\n**RPG Companion HMS Edition** and **HMS Reporter** are made by **Perch**, also known as **TenderTriper**.\nPerch is a creator on Janitor AI and runs a Discord server called **The Appa Stand**. Come say hi, share your games, and bring your bug reports there.\n\n- Janitor AI profile: [TenderTriper](https://janitorai.com/profiles/cc9e471a-d758-4147-8cd9-be31afa1995a_profile-of-tender-triper)\n- Discord, The Appa Stand: [discord.gg/k6DQPYQMFY](https://discord.gg/k6DQPYQMFY)\n\nBuilt on the work of others, with thanks:\n\n- **RPG Companion** by **Marinara** (Marysia, marinara_spaghetti), licensed AGPL-3.0. Panels, presets, dice, deception tags, immersive HTML, portraits and the prompt editor are hers.\n- **Minds** (feelings, agendas, who knows what, Chekhov's gun, building maps, tone tags) is from **FrankenSIM 4 Mini** by **Wireless (Ryah)**, with permission. Ideas from **Vexa**, its successor, are used with its author's permission.\n- **Floor plans** follow the room atlas of **Ryah | Wireless**, with permission.\n- **TFDY** (Tenderness, Fury, Dread, Yearning) is by **Pyropia**.\n- **Radiant's R. Prompt** (Core Engine v3.1.7 and Writing Style v3.1.5, made for **Megumin Suite**) is used in HMS Reporter's **Max** mode, with **Radiant's** permission. Ideas from it also improved the Reporter, Voices and Written things blocks. Its intimacy section is left out.\n- **Megumin Suite** gave ideas for the wide window, the cost chip and the round button on the screen. No code from it is used.\n- **Body & health** takes its ideas from **Escape from Tarkov**, **Gray Zone Warfare**, **Project Zomboid**, **Barotrauma**, **Kenshi** and **RimWorld**. No code or text from them is used.\n- **Lumiverse** is the app this all runs in.\n" /* GUIDE:END */;

// ─────────────────────────── utilities ───────────────────────────

function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
        for (const [k, v] of Object.entries(attrs)) {
            if (v === undefined || v === null || v === false) continue;
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
            else if (k === 'value') node.value = v;
            else if (k === 'checked') node.checked = !!v;
            else node.setAttribute(k, v === true ? '' : String(v));
        }
    }
    for (const c of children.flat(Infinity)) {
        if (c === null || c === undefined || c === false) continue;
        node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
}

function clone(v) { return v === undefined ? undefined : JSON.parse(JSON.stringify(v)); }
function isObj(v) { return v !== null && typeof v === 'object' && !Array.isArray(v); }
function toSnakeCase(name) { return String(name).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_+|_+$/g, ''); }
function toFieldKey(name) { return toSnakeCase(String(name).replace(/\s*\(.*\)\s*$/, '').trim()); }
function labelOf(key) { return String(key).replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, c => c.toUpperCase()); }

function plain(v) {
    if (v === null || v === undefined) return '';
    if (isObj(v)) {
        if ('value' in v) return plain(v.value);
        if ('content' in v) return plain(v.content);
        if ('title' in v) return plain(v.title);
        if ('name' in v) return plain(v.name);
        if ('status' in v) return plain(v.status);
        return '';
    }
    if (Array.isArray(v)) return v.map(plain).filter(Boolean).join(', ');
    return String(v);
}

function hexToRgb(hex) {
    const m = String(hex || '').replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
    if (!m) return [128, 128, 128];
    let s = m[1];
    if (s.length === 3) s = s.split('').map(c => c + c).join('');
    return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
}
function mixColor(low, high, t) {
    const a = hexToRgb(low), b = hexToRgb(high);
    const c = a.map((x, i) => Math.round(x + (b[i] - x) * Math.max(0, Math.min(1, t))));
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/**
 * Inline editable text. onCommit(newText) fires on blur/Enter when changed.
 */
function editable(value, onCommit, opts = {}) {
    const span = h('span', {
        class: 'rpgc-edit' + (opts.class ? ' ' + opts.class : ''),
        contenteditable: 'plaintext-only',
        role: 'textbox',
        tabindex: '0',
        'data-ph': opts.placeholder || '—',
        'aria-label': opts.label || 'Edit value',
        spellcheck: 'false'
    });
    span.textContent = value ?? '';
    const original = span.textContent;
    span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !(opts.multiline && e.shiftKey)) { e.preventDefault(); span.blur(); }
        if (e.key === 'Escape') { span.textContent = original; span.blur(); }
    });
    span.addEventListener('blur', () => {
        const next = span.textContent.trim();
        if (next !== original.trim()) onCommit(next);
    });
    // Firefox lacks plaintext-only
    if (span.contentEditable !== 'plaintext-only') span.contentEditable = 'true';
    return span;
}

// 2.4: a small picture on every settings heading. Line icons in the theme's accent; each theme gives the badge its own shape (see .rpgc-sico).
const SET_ICONS = {
    's-style': '<path d="M12 2.5l8.5 4.9v9.2L12 21.5l-8.5-4.9V7.4z"/><path d="M12 2.5v19M3.5 7.4L12 12l8.5-4.6"/>',
    's-look': '<path d="M12 3a9 9 0 1 0 0 18c1.2 0 1.6-.9 1.2-1.8-.5-1-.2-2.2 1.2-2.2H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10.5" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
    's-modules': '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><path d="M17 13.5v7M13.5 17h7"/>',
    's-hms': '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.6M12 18.6v2.6M2.8 12h2.6M18.6 12h2.6M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M5.5 18.5l1.9-1.9M16.6 7.4l1.9-1.9"/>',
    's-hmssys': '<path d="M12 3l9 4.5-9 4.5-9-4.5z"/><path d="M3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5"/>',
    's-characters': '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.5A5 5 0 0 1 21 19"/>',
    's-minds': '<path d="M9 4a3.5 3.5 0 0 0-3.4 4.3A3.5 3.5 0 0 0 6 15a3.5 3.5 0 0 0 6 3V5.5A3 3 0 0 0 9 4zM15 4a3.5 3.5 0 0 1 3.4 4.3A3.5 3.5 0 0 1 18 15a3.5 3.5 0 0 1-6 3"/>',
    's-gates': '<path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M3 21h18M9 21v-7a3 3 0 0 1 6 0v7"/>',
    's-health': '<path d="M12 20.5s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.9c0 5.4-7.5 10-7.5 10z"/><path d="M6.5 12.5h3l1.5-3 2 5 1.5-2h3"/>',
    's-quests': '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    's-chapters': '<path d="M6 3h12v18l-6-4-6 4z"/>',
    's-chronicle': '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7M8 11h7"/>',
    's-lore': '<path d="M3 5.5C5.5 4 8.5 4 12 6c3.5-2 6.5-2 9-.5v14c-2.5-1.5-5.5-1.5-9 .5-3.5-2-6.5-2-9-.5z"/><path d="M12 6v14"/>',
    's-engine': '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.8"/><path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8"/>',
    's-general': '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    's-panels': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M3 10h6"/>',
    's-display': '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    's-chars': '<circle cx="12" cy="9" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M2.5 9.5C4.5 6 8 4 12 4s7.5 2 9.5 5.5"/>',
    's-enc': '<path d="M4 4l9 9M4 4h4M4 4v4M20 4l-9 9M20 4h-4M20 4v4"/><path d="M8 15l-3 3 1 1 3-3M16 15l3 3-1 1-3-3"/>',
    's-dnd': '<path d="M12 2.5l8.5 5v9L12 21.5l-8.5-5v-9z"/><path d="M12 7.5l4 7h-8z"/>',
    's-extras': '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    's-presets': '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M3.5 6l1.2 1.2L7 5M3.5 12l1.2 1.2L7 11M3.5 18l1.2 1.2L7 17"/>',
    's-prompts': '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    's-help': '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
    's-reset': '<path d="M4 4v6h6"/><path d="M5.5 15a7.5 7.5 0 1 0 1.3-8.2L4 10"/>',
    's-stats': '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    's-scene': '<path d="M3 19l6-8 4 5 3-3 5 6z"/><circle cx="16.5" cy="6.5" r="2.5"/>',
    's-maps': '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    's-magic': '<path d="M5 19L15 9"/><path d="M15 9l2-2M17 3v2M21 7h-2M19.5 4.5l-1.4 1.4"/><path d="M8 4l.7 1.8L10.5 6.5l-1.8.7L8 9l-.7-1.8L5.5 6.5l1.8-.7zM17 13l.6 1.4 1.4.6-1.4.6L17 17l-.6-1.4-1.4-.6 1.4-.6z"/>'
};
function setIcon(id) {
    const d = SET_ICONS[id];
    if (!d) return null;
    const el = h('span', { class: 'rpgc-sico', 'aria-hidden': 'true' });
    el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    return el;
}
function section(id, title, openState, extra, ...content) {
    const d = h('details', { class: 'rpgc-sec' },
        h('summary', null, String(id).startsWith('s-') ? setIcon(id) : null, title, extra ? h('span', { class: 'rpgc-sum-extra' }, extra) : null),
        h('div', { class: 'rpgc-body' }, ...content));
    // Settings sections start closed, so Settings opens as a short list of headings; cards start open.
    d.open = String(id).startsWith('s-') ? openState[id] === true : openState[id] !== false;
    d.dataset.openKey = id;
    // 2.8: a section the settings finder opened is shown open, not remembered as opened (it opened by itself after a reload)
    d.addEventListener('toggle', () => { if (d.dataset.found === '1') { if (d.open) return; delete d.dataset.found; } openState[id] = d.open; });
    return d;
}

// ─────────────────────────── the guide ───────────────────────────
// A small markdown reader for GUIDE.md: headings, paragraphs, lists, tables, code, **bold** and `code`.
// Everything is built as elements, never as HTML, so the text can hold any character.

function guideInline(text, find) {
    const out = [];
    // 2.4: [words](https://…) is a link that opens in a new tab. Only http(s) links; anything else stays text.
    for (const part of String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]\n]{1,120}\]\(https?:\/\/[^)\s]{4,300}\))/)) {
        if (!part) continue;
        const ln = part.match(/^\[([^\]\n]{1,120})\]\((https?:\/\/[^)\s]{4,300})\)$/);
        if (ln) { out.push(h('a', { href: ln[2], target: '_blank', rel: 'noopener noreferrer' }, guideMark(ln[1], find))); continue; }
        if (/^\*\*[^*]+\*\*$/.test(part)) out.push(h('b', null, guideMark(part.slice(2, -2), find)));
        else if (/^`[^`]+`$/.test(part)) out.push(h('code', null, part.slice(1, -1)));
        else out.push(...guideMark(part, find));
    }
    return out;
}
function guideMark(text, find) {
    const t = String(text);
    if (!find) return [t];
    const out = [];
    const low = t.toLowerCase();
    let at = 0, i;
    while ((i = low.indexOf(find, at)) >= 0) { if (i > at) out.push(t.slice(at, i)); out.push(h('mark', null, t.slice(i, i + find.length))); at = i + find.length; }
    if (at < t.length) out.push(t.slice(at));
    return out;
}
function guideSections(md) {
    const secs = [];
    let intro = [];
    let cur = null;
    for (const line of String(md || '').replace(/\r/g, '').split('\n')) {
        const m = line.match(/^##\s+(.+?)\s*$/);
        if (m && !/^###/.test(line)) { cur = { title: m[1], lines: [] }; secs.push(cur); continue; }
        if (/^#\s/.test(line)) continue;
        (cur ? cur.lines : intro).push(line);
    }
    return { intro, secs };
}
function guideBlocks(lines, find) {
    const out = [];
    let i = 0;
    const isTable = (l) => /^\s*\|/.test(l);
    const isItem = (l) => /^\s*(?:[-*]|\d+\.)\s+/.test(l);
    while (i < lines.length) {
        const l = lines[i];
        if (!l.trim() || /^\s*---+\s*$/.test(l)) { i++; continue; }
        if (/^\s*```/.test(l)) {
            const body = [];
            for (i++; i < lines.length && !/^\s*```/.test(lines[i]); i++) body.push(lines[i]);
            i++;
            out.push(h('pre', null, body.join('\n')));
            continue;
        }
        const hm = l.match(/^###\s+(.+)$/);
        if (hm) { out.push(h('h4', null, guideInline(hm[1], find))); i++; continue; }
        if (isTable(l)) {
            const rows = [];
            for (; i < lines.length && isTable(lines[i]); i++) {
                const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
                if (cells.every(c => /^:?-{3,}:?$/.test(c))) continue;
                rows.push(cells);
            }
            if (rows.length) out.push(h('table', null,
                h('thead', null, h('tr', null, rows[0].map(c => h('th', null, guideInline(c, find))))),
                h('tbody', null, rows.slice(1).map(r => h('tr', null, r.map(c => h('td', null, guideInline(c, find))))))));
            continue;
        }
        if (isItem(l)) {
            const ordered = /^\s*\d+\./.test(l);
            const list = h(ordered ? 'ol' : 'ul', null);
            let last = null;
            for (; i < lines.length && (isItem(lines[i]) || (lines[i].trim() && /^\s{2,}/.test(lines[i]))); i++) {
                const raw = lines[i];
                const deep = /^\s{2,}/.test(raw);
                const text = raw.replace(/^\s*(?:[-*]|\d+\.)\s+/, '').trim();
                if (deep && last) {
                    let sub = last.querySelector(':scope > ul, :scope > ol');
                    if (!sub) { sub = h(/^\s*\d+\./.test(raw) ? 'ol' : 'ul', null); last.appendChild(sub); }
                    sub.appendChild(h('li', null, guideInline(text, find)));
                } else {
                    last = h('li', null, guideInline(text, find));
                    list.appendChild(last);
                }
            }
            out.push(list);
            continue;
        }
        const para = [];
        for (; i < lines.length && lines[i].trim() && !isTable(lines[i]) && !isItem(lines[i]) && !/^\s*```|^###\s|^\s*---+\s*$/.test(lines[i]); i++) para.push(lines[i].trim());
        out.push(h('p', null, guideInline(para.join(' '), find)));
    }
    return out;
}

// ─────────────────────────── setup ───────────────────────────

export function setup(ctx) {
    const state = {
        chatId: null,
        userName: 'You',
        data: { userStats: null, infoBox: null, characters: null },
        settings: null,
        busy: false,
        busySince: 0,
        status: null,
        view: 'trackers',
        invTab: 'onPerson',
        open: { chapter: false },
        locks: {},
        checkpoint: null,
        encounter: null,
        encounterBusy: false,
        encounterActive: false,
        encounterFor: null,
        encounterNotice: null,
        encPick: null,
        encOrders: {},        // pending orders to allies, sent with the next action
        encOrderFor: null,    // the ally an order is being built for
        encExploit: null,     // intel the next action acts on
        encTab: 'physical',
        encOrderTab: 'physical',
        plotBusy: false,
        characterId: null,
        presetSel: '',
        song: null,
        hms: null,
        worldBusy: false,
        encHistory: null,
        showHistory: false,
        expectPush: false,
        expectPushSince: 0,
        avatars: {},
        avatarBusy: {},
        diceCount: 1,
        diceSides: 20
    };

    const removeStyle = ctx.dom.addStyle(CSS);
    const tab = ctx.ui.registerDrawerTab({
        id: 'rpg-companion-hms',
        title: 'RPG Companion (HMS)',
        shortName: 'RPG',
        headerTitle: 'RPG Companion HMS Edition 2.9 beta',
        description: 'The side panel for HMS bots: the HUD as cards, people, quests, the map, fights, the Chronicle, and a guide',
        keywords: ['rpg', 'hms', 'tracker', 'hud', 'quests', 'dice', 'guide'],
        iconSvg: ICON_SVG
    });
    const root = h('div', { class: 'rpgc' });
    // A collapsible saves where it is going the moment it is clicked. The browser's own toggle event
    // comes later; a repaint in between (a reply landing, the panel refreshing) used to rebuild it in its
    // old state, so a section snapped shut \u2014 or back open \u2014 as if by itself.
    root.addEventListener('click', (e) => {
        const sum = e.target && e.target.closest ? e.target.closest('summary') : null;
        if (!sum) return;
        const ctl = e.target.closest('button, a, input, select, textarea, label');
        if (ctl && ctl !== sum && sum.contains(ctl)) return;          // a control inside the header does its own thing
        const det = sum.parentElement;
        if (det && det.tagName === 'DETAILS' && det.dataset.openKey) state.open[det.dataset.openKey] = !det.open;
    }, true);
    tab.root.appendChild(root);

    const refreshAction = ctx.ui.registerInputBarAction({ id: 'rpgh-refresh', label: 'Refresh side panel', iconSvg: SMALL_ICON });
    refreshAction.onClick(() => requestRefresh());
    const openAction = ctx.ui.registerInputBarAction({ id: 'rpgh-open', label: 'Open RPG Companion' });
    openAction.onClick(() => tab.activate());
    const fightAction = ctx.ui.registerInputBarAction({ id: 'rpgh-fight', label: 'Start or resume a fight' });
    fightAction.onClick(() => openFightChooser());
    const worldAction = ctx.ui.registerInputBarAction({ id: 'rpgh-world', label: 'Move the world' });
    worldAction.onClick(() => { if (state.chatId) send({ type: 'world_moves', chatId: state.chatId }); });

    // The three actions that spend tokens or write to the chat follow the Enabled
    // toggle. Opening the panel stays available so the toggle can be found again.
    let actionsEnabled = null;
    function syncActionAvailability() {
        const s = state.settings;
        const on = !!(s && s.enabled) && !!state.chatId;
        // The fight button also follows "Enable fights", like the fight buttons in the panel.
        const fights = on && s.encounterSettings?.enabled !== false;
        const key = `${on}|${fights}`;
        if (key === actionsEnabled) return;
        actionsEnabled = key;
        for (const a of [refreshAction, worldAction]) {
            try { a.setEnabled?.(on); } catch { /* host may not support it */ }
        }
        try { fightAction.setEnabled?.(fights); } catch { /* host may not support it */ }
    }

    // ── backend comms ──
    const send = (payload) => ctx.sendToBackend(payload);
    const requestState = (extra = {}) => send({ type: 'get_state', chatId: state.chatId, characterId: state.characterId, ...extra });
    function requestRefresh() {
        if (!state.chatId || state.busy) return;
        state.busy = true;
        state.busySince = Date.now();
        state.status = { kind: 'busy', text: 'Generating trackers with a separate call…' };
        render();
        send({ type: 'refresh', chatId: state.chatId });
    }
    function cancelRefresh() {
        if (!state.chatId) return;
        state.busy = false;
        render();
        send({ type: 'cancel_refresh', chatId: state.chatId });
    }

    let saveTimer = null;
    function saveTrackers() {
        clearTimeout(saveTimer);
        const chatId = state.chatId;
        const data = clone(state.data);
        saveTimer = setTimeout(() => send({ type: 'save_trackers', chatId, data }), 350);
    }
    let settingsTimer = null;
    // 2.7.1: a change made here holds until the backend has taken it. Before, any state that arrived in between (the
    // heartbeat, a reply landing) put the old settings back for a moment, and a second change in that moment lost the first.
    let settingsRev = 0, settingsWait = 0, settingsUnsent = null;
    function saveSettings(rerender = true) {
        clearTimeout(settingsTimer);
        const settings = clone(state.settings);
        const rev = ++settingsRev;
        settingsWait = Date.now() + 6000;
        settingsUnsent = { settings, rev };
        settingsTimer = setTimeout(() => { settingsUnsent = null; send({ type: 'save_settings', chatId: state.chatId, settings, rev }); }, 300);
        if (rerender) render();
    }
    function flushSettings() {
        if (!settingsUnsent) return;
        clearTimeout(settingsTimer);
        const u = settingsUnsent; settingsUnsent = null;
        try { send({ type: 'save_settings', chatId: state.chatId, settings: u.settings, rev: u.rev }); } catch { /* the page is closing */ }
    }

    const unsubBackend = ctx.onBackendMessage((msg) => {
        if (!msg) return;
        if (msg.type === 'diagnostics') { onDiagnostics(msg); return; }
        if (msg.type === 'catalog') {
            if (msg.chatId === state.chatId) { state.catalog = msg.catalog ? { ...msg.catalog, chatId: msg.chatId } : { none: true, chatId: msg.chatId, pages: [] }; state.catReq = false; render(); }
            return;
        }
        if (msg.type === 'catalog_check') {
            if (msg.chatId === state.chatId && state.ng && msg.text === ngText()) { state.ng.warnings = msg.warnings || []; render(); }
            return;
        }
        if (msg.type === 'mapbank_view') {
            state.mapView = msg.svg ? { key: msg.key, svg: msg.svg, vars: msg.vars || '', name: msg.name || '' } : null;
            render();
            return;
        }
        if (msg.type === 'chronicle') {
            if (msg.chatId === state.chatId) { state.chronData = msg.chronicle ? { ...msg.chronicle, chatId: msg.chatId } : { none: true, chatId: msg.chatId, version: null, entries: [] }; state.chronReq = false; render(); }
            return;
        }
        if (msg.type === 'building') {
            if (msg.chatId === state.chatId) { state.buildingView = msg.building ? { ...msg.building, key: msg.building.key || msg.key } : null; state.mapMode = 'building'; render(); }
            return;
        }
        if (msg.type === 'atlas') {
            if (msg.chatId === state.chatId) { state.atlasData = msg.atlas || { version: null, nodes: [], none: true }; state.atlasReq = false;
                if (state.atlasData.nodes) state.atlasIndex = new Map(state.atlasData.nodes.map(n => [n.id, n])); render(); }
            return;
        }
        if (msg.type === 'connections') {
            state.connections = { available: !!msg.available, list: Array.isArray(msg.list) ? msg.list : [] };
            state.connReq = false;
            render();
            return;
        }
        if (msg.type === 'plot_prompt') {
            if (msg.chatId === state.chatId) runPlot(msg);
            return;
        }
        if (msg.type === 'encounter') {
            if (msg.chatId !== state.chatId && msg.chatId !== state.encounterFor) return;
            if (!encModal || msg.chatId === (state.encounterFor || state.chatId)) {
                state.encounter = msg.encounter || null;
                state.encounterBusy = !!msg.busy;
                // Orders and half-built picks belong to one fight; a fight that ended takes them along.
                if (!state.encounter || state.encounter.phase !== 'combat') { state.encOrders = {}; state.encOrderFor = null; state.encExploit = null; state.encPick = null; }
                if (msg.notice) state.encounterNotice = msg.notice;
            }
            if (msg.chatId === state.chatId) state.encounterActive = !!(msg.encounter && msg.encounter.active);
            renderEncounter();
            render(true);
            return;
        }
        if (msg.type === 'encounter_history') {
            if (msg.chatId === state.chatId) { state.encHistory = msg.logs || []; renderEncounter(); }
            return;
        }
        if (msg.type === 'fight_engaged') {
            if (msg.chatId !== state.chatId) return;
            if (msg.mode === 'turnbased' && dndOn()) openEncounter('dnd');
            else { state.status = { kind: 'ok', text: 'A fight started in the story. The panel is tracking it.' }; render(); }
            return;
        }
        if (msg.type === 'avatar_status') {
            const key = msg.name;
            if (msg.busy) state.avatarBusy[key] = true;
            else {
                delete state.avatarBusy[key];
                if (msg.url) state.avatars[key] = { url: msg.url };
                if (msg.error) state.status = { kind: 'error', text: msg.error };
            }
            render();
            return;
        }
        if (msg.type !== 'state') return;
        if (msg.chatId && state.chatId && msg.chatId !== state.chatId) return;
        if (msg.settings) {
            const mine = settingsRev > 0 && Date.now() < settingsWait && !(Number(msg.settingsRev) >= settingsRev);
            if (!mine || !state.settings) { state.settings = msg.settings; settingsWait = 0; }
        }
        if (msg.chatId !== undefined) {
            if (msg.data) state.data = msg.data;
            else if (!msg.status || msg.status.kind !== 'error') state.data = { userStats: null, infoBox: null, characters: null };
            if (msg.userName) state.userName = msg.userName;
            const wasBusy = state.busy;
            state.busy = !!msg.busy;
            if (state.busy && !wasBusy) state.busySince = Date.now();
            state.status = msg.status || null;
            state.locks = msg.locks || {};
            state.checkpoint = msg.checkpoint || null;
            if (msg.encounterActive !== undefined) state.encounterActive = !!msg.encounterActive;
            if (msg.song !== undefined) state.song = msg.song;
            if (msg.hms !== undefined) state.hms = msg.hms;
            if (msg.extras !== undefined) state.extras = msg.extras;
            if (msg.sandbox !== undefined) state.sandboxInfo = msg.sandbox;
            if (msg.cost !== undefined) state.cost = msg.cost;
            if (msg.lore !== undefined) state.lore = msg.lore;
            if (msg.dnd !== undefined) state.dnd = msg.dnd;
            if (msg.version) state.version = msg.version;
            if (msg.paletteDefault) state.paletteDefault = msg.paletteDefault;
            if (msg.chapters !== undefined) state.chapters = msg.chapters;
            if (msg.chronicle !== undefined) state.chronicle = msg.chronicle;
            if (msg.newGame !== undefined) state.newGame = msg.newGame;
            if (msg.ooc !== undefined) state.ooc = msg.ooc;
            if (msg.world !== undefined) state.world = msg.world;
            if (msg.plotView !== undefined) state.plotView = msg.plotView;
            if (msg.injuries !== undefined) state.injuries = msg.injuries;
            if (msg.hudSheet !== undefined) state.hudSheet = msg.hudSheet;
            if (msg.immersive !== undefined) state.immersive = msg.immersive;
            if (msg.immBusy !== undefined) state.immBusy = !!msg.immBusy;
            if (state.settings && panelMode() !== state.panelApplied) { state.panelApplied = panelMode(); applyPanelMode(); }
            if (msg.avatars) state.avatars = msg.avatars;
        }
        state.expectPush = false;
        syncActionAvailability();
        render(true);
    });

    // ── chat tracking ──
    /** Everything the panel holds for one chat. Emptied when the chat changes, and (2.7.1) on the way into and out of the
     *  test zone, so nothing of one shows in the other while the next state is on its way. */
    function resetChatScope() {
        state.data = { userStats: null, infoBox: null, characters: null };
        state.busy = false;
        state.locks = {};
        state.checkpoint = null;
        state.encounterActive = false;
        state.status = null;
        state.hms = null; state.extras = null;
        state.lore = null;
        state.immersive = null;
        state.immBusy = false;
        state.immEdit = null;
        state.dnd = null;
        state.chapters = null;
        state.chEdit = null;
        state.chronicle = null;
        state.chronData = null;
        state.chronReq = false;
        state.newGame = null; state.catalog = null; state.catReq = false; state.ng = null;
        state.ooc = null;
        state.world = null;
        state.hudSheet = null;
        state.plotView = null;
        state.injuries = null;
        state.cost = null; state.costOpen = false;
        state.hlZone = null; state.hlMeasEdit = false; state.hlMeasVals = {}; state.raceFormText = '';
    }
    function syncChat() {
        if (state.sandbox) return;   // the test zone is not a Lumiverse chat; stay in it
        let chatId = null;
        let characterId = null;
        try {
            const active = ctx.getActiveChat();
            chatId = active?.chatId ?? null;
            characterId = active?.characterId ?? null;
        } catch { chatId = null; }
        if (chatId !== state.chatId || characterId !== state.characterId) {
            const chatChanged = chatId !== state.chatId;
            state.chatId = chatId;
            state.characterId = characterId;
            if (chatChanged) resetChatScope();
            syncActionAvailability();
            render();
            requestState({ refreshName: true });
        }
    }
    let pollTick = 0;
    const pollTimer = setInterval(() => {
        syncChat();
        // If the backend never reports back, stop showing the busy state
        const limit = ((state.settings?.trackerTimeoutSec || 180) + 30) * 1000;
        if (state.busy && state.busySince && Date.now() - state.busySince > limit) {
            state.busy = false;
            state.status = { kind: 'error', text: 'No answer from the tracker call. Check the Lumiverse console for [RPG Companion] messages.' };
            render();
        }
        // Self-heal: if a reply just landed and a push was missed, re-request state.
        // Also a slow heartbeat so the panel can never sit stale for long.
        pollTick++;
        const active = document.activeElement;
        const editing = active && root.contains(active) && (active.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(active.tagName));
        if (state.chatId && !editing && (state.expectPush || pollTick % 6 === 0)) {
            if (state.expectPush && Date.now() - (state.expectPushSince || 0) > 1500) { state.expectPush = false; requestState(); }
            else if (!state.expectPush) requestState();
        }
    }, 1000);
    const evUnsubs = [];
    const onChatEvent = (p) => {
        if (p && p.chatId && p.chatId !== state.chatId) { syncChat(); return; }
        requestState();
    };
    for (const ev of ['MESSAGE_SWIPED', 'SWIPE_EDITED', 'MESSAGE_DELETED']) evUnsubs.push(ctx.events.on(ev, onChatEvent));
    evUnsubs.push(ctx.events.on('CHAT_SWITCHED', () => syncChat()));
    evUnsubs.push(ctx.events.on('PERSONA_CHANGED', () => requestState({ refreshName: true })));
    evUnsubs.push(ctx.events.on('GENERATION_STARTED', (p) => {
        if (p?.chatId === state.chatId) { state.expectPush = false; }
    }));
    evUnsubs.push(ctx.events.on('GENERATION_ENDED', (p) => {
        if (!p || p.chatId === state.chatId || p.chatId === undefined) {
            // The backend pushes after it processes the reply; mark that we're waiting for it,
            // and request once now in case the event beat us to it.
            state.expectPush = true;
            state.expectPushSince = Date.now();
            requestState();
        }
    }));

    // ── data helpers (create skeletons on first edit) ──
    const S = () => state.settings;
    function us() {
        if (!isObj(state.data.userStats)) state.data.userStats = {};
        return state.data.userStats;
    }
    function ib() {
        if (!isObj(state.data.infoBox)) state.data.infoBox = {};
        return state.data.infoBox;
    }
    function chars() {
        if (!Array.isArray(state.data.characters)) state.data.characters = [];
        return state.data.characters;
    }
    function inv() {
        const u = us();
        if (!isObj(u.inventory)) u.inventory = {};
        const i = u.inventory;
        for (const k of ['onPerson', 'clothing', 'assets']) {
            if (!Array.isArray(i[k])) i[k] = typeof i[k] === 'string' && i[k] && i[k] !== 'None' ? i[k].split(',').map(n => ({ name: n.trim() })) : [];
        }
        if (!isObj(i.stored)) i.stored = {};
        return i;
    }
    function commit() { saveTrackers(); render(); }

    // ── rendering ──
    let pendingRender = false;
    let deferredEl = null;
    function render(fromBackend = false) {
        root.className = 'rpgc' + themeClass() + (panelMode() === 'wide' ? ' rpgc-is-wide' : '');
        if (encModal) encModal.root.className = 'rpgc rpgc-enc' + themeClass();
        const active = document.activeElement;
        if (fromBackend && active && root.contains(active) && (active.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(active.tagName))) {
            // Repaint would blow away the field the user is editing. Defer it until they blur,
            // but the incoming state was already applied, so nothing is lost.
            pendingRender = true;
            if (deferredEl !== active) {
                deferredEl = active;
                const flush = () => { deferredEl = null; if (pendingRender) { pendingRender = false; setTimeout(() => render(), 0); } };
                active.addEventListener('blur', flush, { once: true });
            }
            return;
        }
        pendingRender = false;
        deferredEl = null;
        const scroll = tab.root.scrollTop;
        const wb = root.querySelector('.rpgc-wbody'), wscroll = wb ? wb.scrollTop : 0;
        const kids = (state.view === 'settings' ? renderSettings() : state.view === 'guide' ? renderGuide() : state.view === 'sandbox' ? renderSandbox() : renderTrackers()).filter(Boolean);   // a switched-off card is simply absent
        root.replaceChildren(...(panelMode() === 'wide' ? wideFrame(kids) : kids));
        tab.root.scrollTop = scroll;
        const nb = root.querySelector('.rpgc-wbody');
        if (nb) nb.scrollTop = state.wideScroll === 0 ? 0 : wscroll;
        state.wideScroll = null;
        if (wideLaunch) paintLaunch();
        syncPerchButton();
        updateWeather();
    }

    // Perch, the mascot of TenderTriper (Perch): a small picture kept inside the file, so it needs no network.
    const PERCH_S = 'data:image/webp;base64,UklGRpgKAABXRUJQVlA4WAoAAAAQAAAARwAARwAAQUxQSIUFAAABjwIQxH+1AQERkcKEgraNnPZHb/MH/A8iov8TsL6S5vSS7pUZcI5lWQOgkeYA0CTpwIBvkWsXv532kxlsSZKtSpJkdm5EJGdWNTMz//b+d9A9zMycFPDePR/3vhdRMRuIiAl4SkJCAgkkSTeZK4iAIiqBfTwsiCqgCgjK7J5KR9kLVFFBBVBRQGegqNii7Kdiiyq2IIiAe6CoonKAuaiAoggI6BSKKipzogmNKVTsIyogCPZQVFREw3AmU9MAIq10ZQIVUQUNIwyj2R+nVA6AoqhpIOJMwMRUQWxRAFUk6UwrCoqKTEhCohphHwEVjByGOnYEERElUFRDmgSUVMFo6ApobncWqz1ARDEUEdVQJXIcq2opdnHubshisXZEEFHC6VCN3K53CRLe76IE+6xZGEbuhYqIEbabOyajPv73Pw81wpwAXAdoVJEpRALVqFU1dn+gn8QOhvv/DDUKDaCxG8GohuylGI8PHfOfQw/KGiCp9QJUUcWaWSkAMi/UuI0LirJMJq9fZHoRzl0WohRARZkODcNhsQiNPDuZmK/R0FgWxS4qAmJHXZ2UBZpxexiSpk9KR1GRbulQCkJZ/4kD1wGVRme0gCBhGCqo8cfBA7ErqnEABATCLqjysOHgL68ID4qAU6Ak5frhcKuwy6wkZqgiIaX48Kf7wzGmosFUbB80pkIQofznf+vKM/WFS3IcltIA/4uLuqBtsKX8/pZnf7XcbG7H1RICcL09KwEIECoQ9/9C8ll1t3fb1RIBRgOkK4q5+BdWjnV3s+hJIiAQgBAPHPHqOex0BRCwYXdMJzfOwp4oaD0aOb3JOIAiNnk8F9fpHEFAVIjbe48FFpXZE6imLB/+X2QCQfKM6tGUJE1nCIgIwunj8SxHSzVrChAmApIAdbWqHkcSbv+6Xj29LDU1No9XiJhAYj1LPArTza8Bzp9en9Txf39777oqCSSQmecDR5p/5Wb7CLDIkfdeHRQbSJLHH/+lHsl64fVbj//45xZYvfXKKCKTlb/8jGM9fQpPPnP333+MT188HQKRnBj51Z/MIwHkzbfHZRI1RcEZw3drAD2Wm68HBbVkKp0E//VD2kw8jlc/HhGDcXuyQGoDGT/758XJInj1SeE4FydWLGXYbT56fxsdIfN2uQzlrXffe3Ioddbs82+XUJE2Y0wlay5fPMWD9HVCSIE0n36bTpEogHA5csjFE6EmBzTf/XKICnYQQJLkb78TcoakvPn2LsZx/eE17mEuPsgwaQUQQJKav/wfXXMZ4wCYb74xlIh4/ZuLdA+fnFWtByDJend7n8OW5J3nNsPm7t/5wgtXqcGmPGW+mVl2OuJ+kFkc4z+/Orn412uvjMV4zMtMCTUvZ4W1PH2jhtYOAtgzSdJa4O1/PLyVQnEMMQLyhJzKypsfXDt2EMAZQgKZMGxf3CwURLGlLmXmkzdeYDCACmAPJ0wgw1pHAFFRMbIuFjMun+TOIsBoD6cQaZRKpqiiqGYtK+wN7moxs6kI2JF51p8v3lukQIiiBqAJIItPLlJU1BkIzhFcx2kKimIfKLUzvvlyVRGBBKQ9AIUUxJaeqSkpp+9HCiJABRAEQRABEcFGVJQGKJng8OaTEZrusxG0h6gYKUGaLN4WEJwhyB4iIjIhTUvdABevvnpZaUWwEQQEQQQRaUR6SoPj03L3/MsvnTApSE9A9pMJUUVFMt5ZrW5/PWZ2UroJTAmCyIQiMqefBIIN2KkgCCAIIoiIKCiKSqD0BQFBugkgCAiIICIiQoCKKoY6AUgrCRUBQcAGQUREREHFLoBTczMBGxAEBBEUFFFEZQrcjwZBQMAeIoKiKKhMqWRPIGchICCCgIIiiqLYiMj8ZB4CAiKICCiKoqjMMBEw6QMAVlA4IOwEAADQFwCdASpIAEgAPmEokEWkIiGXCu20QAYEtABi/hzFx+c83K0N66I3txfMB5z3o59AD/D9R3vIX7k+krSD8gT/U5ymrQVUo0Xx1/TnsCbrkiG10Gg2TS9t2IZ0X1jr2d1J64iJe7uQrkNZGzhtDBgyY9j8TOBFcdSLHPiM4YSBLbwA9MDOjQHKXTWKNM0V4RtlUsxyGHDbsI0bxEsfkwUgzMEqBm5gIiC7AOmfQUu1bpdQuOZq21AqbNkqnxyiTl1BOAT43e4AAP65ZkGLgzA32VNxswOMbueUScmkWJDB+P/9QZ/xNn9Js7kAcgf//ylfG7Q1A4Hq5i+iJ9rPDwzuU/PmLEYEV1vGmcym10w8ufmJpACM6DkP7j3/Fh7XPbYeTCztlqU5X36+RkhPj1fBVPur7yMVt7KMd2jLh+QwR8Tn1JGJ6Tqsufcr0C9eebBPZ36gAGtKUpOoEzTHMYQvSTUH4nfDv6JS6wMSUy2HpncwegpVYUqxRbML7ypjTtPa2MMP3tKxTT61uqfsvg1hR6uOxvioySAuFmNvE4RNOYEgFpb3OjnZ/dFsZbfDewvc7myJ7epV6MshND3FYM20ojuFA/+1LGnwvxGSoFbJohX+ndxVBlB+GM9lwjbZKbNVG4aogh1vLkP8K4ey3c2jIMV116//C+IP73ZgFgOmzdSTzpI1OR+o9md4BBw6ajeP8yTeiBh0Vu06fiunV9bMkEqVrZ7UVMPn6oUFGOio7Uke2tX7foQzCU3muM1z0OEtjLFLZHgrxxIC8X/18fU46MQVPnyYqSx4vWZ+/hNiVMCahjYEMnTQsmfdvasLLlZRT6ixr/0/IabMf9qXg42HjSvMuj2OgqpEi45Y9teS8MaWlHaWwF8hlIl+D/20//tmI8BlOwGgWkP6c4G9EQD8MgNcF+nX5ysvzY287k7uVJzhP/Ca4vZ1YUAi9tb+Xn1duGs2tB0okg9pYtMT+D61l8t9cJ/1aMUvoKvPk4y3QUqoseBtSh1VfTyQSvUQsIMHViJMfI2Jsp0nty983SbaoZY7iCZ1+3AAWV/mBpfyiUx0sAWfSti5I2hnrFnNb2Bs9cyQSll8VDfzZTxWbh3bI7hkrOzmfbXazFyTrUATHCoERiZXP9+i0C/5d/FytkKb3Gy9gRbBOjHN9A4r4gz87ng6rjoDU2xlUf0xn3Xh+36Ld4lu2eRHRK5ddjkcHvSN0vs3h/1ELzPTDRGClwyENli6wRc0cOz5wLqbj8HMSg1zwbSOrbvTwnXnZXpc/zbI/glxs6zqXYPzsF9v4Zw8S5Ifz2ldUOOOqPtmu7Dj3Apy3rM7bie77WSdjLGyt1yMJh3O7NZzoS+lwZDRgjO1ZwbW0hDTz9Uz6tMoPlG/gJlOo+Ye8wYnwlkSj2aPQzk+a3pJ/P0esMqPlZkXGd9e4RNMMj8nJEhDZ5PfNYSn1rq+J1p4chgDT375UR8fpmKqaqirge0sWq+H6Kc9QNLSR+AEo2bfucseYtH2dQBPsKif/QB6RZHT+potjZMG4iI9H40Z/fjAUeMXohs9a3T5lOoq6CV+HAkCE+46IHuqK3eLM4ouhaNilqgv8ElKD6sHMvyl3frnvPhrRgiFnJ8grhuEZTIav+lB/L1Fzl937OyDVB4P6J/aeeVsKAUsMIXTwZCeK1lAABwAgAA=';
    const PERCH_L = 'data:image/webp;base64,UklGRiomAABXRUJQVlA4WAoAAAAQAAAAxwAAxwAAQUxQSOsTAAABjwIQxH+1AQERkcKEw0iS4oZZ7vR4yT9hDpAziOj/BHCoMuaTbhf6Ls6gOyRteeFXNQzxgAcEgDvY024EtW0XvQJVUI2xikrMaqdmOXSgjfjq9fOcjMq2T3Q1ejEOWhOznYZrj+3rqYA2EwYSrgs38zOotTaGnUukBN536n0n7SlTam+XtJFkOUVE7CwFmd8kOd9f1P9gMGgbyVHCH/Zs+wIgIiZAflwFO+tBrQXoTimVrdNCwyGg2jEYhy+i39UAdy4hyE1PfWFFR8dQJQVWdApg0we36tWXfUuSZEmSZFvCVf//wVV94b6Y8EXUPyAiaNG2UkmSLAzB5xURjaiann9f17anbbZt277tku2kKcPJzMzMUxdf//7EixkPKCcGaRsjlmRIfExHhEMBQOmouSnPJGS2+4AjaS/KTAqAo35okRhI7Q8EAAMDDggUEqyevIRJJZkOPPs5C5Xejol9/P0fjOMzVhOrUcDHZRxew5Qtc5Trwqt4aFvVNDohprMECwPODZtujrR1XgkMrKUz7MdNyIxck4XqWgirN3QZjlkbquq/QnwcL0+QZ0J5BLQwIADQRvwkceb3iEEzGp3xZ9k5qnxOcACelUbNyK8UNHvO8d04uKlRNSNbIVZZQw8N8I6i21u6LmxP3FN6miIvgsWiBOgQaMa6lGzMw1KqZnV3KKrDYmGmcl5swrdE2UxDvNulPLOYaf38T5Br9gNvPzLAHYau9C13NxzeBWkYuQZ4nA6fjsmHj2y3RM1Cw672a2UV/LmXzAsM+EGOd13xOiQT/Epk1owZHTXgfS4OCYFpRzYeqIX9Tj2gFyq52MS2WX2v+1GOe3qhsoBUr3b3baAGClUlegoZziETUB6GzaLDV95DtCYgQ5xgYtvO5efc9SaFXzpVA5BVjVEWvcDNI9BSXrPJeEoIwTvNQADWZuo4MhRWw5wa5pLi6Ss8TTjwjOEGFuf+oQ27fzwUqCJ0tZ8jnG0gwOgGCIlq60nuvPCY1HhBRYuwP9fOZeNbUmVZC2rbEN9T5tu12BYSYroGsYWChGMMmnGuarGrDb69CLWtKmEjGNf8ncJ5mOQiZuAuL+OkuV4xjolpQOgaVzfOBwzt7DKx1ST7uD6wUe+gERZ2rLrzbwjh9upGgbiqquukVFzUC1hVszyBjOUw0TbfdPW78fpFoN6ktcDEOiBNVa1cZ0OAUOnvecmK3AjHeFzgbqnQTDtsf3RYfDlJryCbXSSQ8rr0A9af6jzgIM8LCDmmCwZidyNQR+nTkmZ1cXm97BsSxOj1dayMs8J0IHXoMslCHdeLeCAwNe/7N/3nqYB5PV+lGpPluYkacXD6qPGakmUoTWfO41ihSHhn1ZtzH/LOO76jPVmWm6hRbClbinQx6L3hYYwFEOJpovk3MaHV95r+QPUQ/JUgMjbLw/4c6m4k9thOmmK0Ah1a3AsQXZWiUmpoYW0bN7XIIIJI96w1oYai8pxobjIiwRVpm0554YmAZW3nmXAZGoobj4Eb4ADq3zGsApE+dbRaZW1oeInQb/BJG8W0mjKrFyIzU6sgaeZkA7yylfPfxa0tllpJpYkjndvQGQese9SVNic3DlJ4BoRKfG9oAgnkwWSCwbfWtisbmDawdlZ7V4KZg6AcVWUXVZQ+TUDy/gkdFK6wkgTGsnDHNTVVNCvAzZSDtalHZMOutHMf9XFaNuvtNSvwNp9abCQcZGgR9JIm+ak7QQBH8eR8GUx78NAOAgOi/f/H6CTkjx6GUHQVVWCjzRbd4l6ZmyzT27lhx3JMc/G/DZ7O9arn9rtyE52gu+BFpZlyliV+jOwF+We5MWh8PEb5hHD3Sw+z3EBVwuRrktH8yXhlvvr35jwNlvNhPsf+7u9s0ExQzoRRXPALeSnvkCt59+N9543p6xzPoxWCbsIfk4z8rdz0AbbT7rxMt/DtL2FMoGdaiOJjz/znHNz8SXw783YJJhHOHCbyGD9ICild/nUbXilY1RjhxldxcBRF/3YDbgGyWnnQt2UtXO7SNSVXQn2a6Y1QtuPa1fCREvKEBxe4+DxLa++GIhVsCezJ4IWYr+JA9Ot6WXE3/OO2+LIfbeeGDdA3cWB4K20sxD3ZFljEplvAPbweBdlCW8Fwa/KRbYGZJmIfMCOsv3QCpR1vy+abj+l2gF6FZnS/eL4txA1P8ODVFw62I8u9O06TZljGFcs8QhEzwivqD9xcmS0F0W3JvPx/FWrUMdM4aqYcugp/nUmXlwhCC1b+fynbc3lNbLHHKga8dQ5SNgi6/epe59FRCEhYnt/ZstdtXLAvHTEBbuqSamcuHgqpoDZiOiYuHlpfbwjrrLMSyogI6puVtSKSux5Y3Ex8XEaQQn0ty/Nb2cbLHTONgX3yUoTlslm0q50Buzc/cbOgsvhn6/P7N5BtvXZP4KNGA77K4XtgIlzXqgIMLn041jNGFVz867blANxStzi27bou4urVbbl3YP2AW3ljEcpLO0OK+6mXCPH2v3+JNhNbi9rD3EpZVVUdLMwH+/BEX9v7QoxQtDaQiTtBGinXf6jBrf8mzLJJcVHszw19iK++AsmSuWAKRiVrlwQ8fLAjkMld+dETz8Czl/OrRo3NKFJ2JXuOdlf6ukzzQjFf2F5FYn1T4SA7FbL1Jw1Z0ccFE0XOT/d9/0UMPS3u7LFhaV3IVK98wd71YgyLm4R4BEFaylQJmVuHzdzwOaNkRQTRtWCqkAEb3FT/21sOsJpsjBTtCjTmdto99AhhP1yJThRszmAEjo/sIfU4a8RXk01pDbHBTTVFGr40RK2mS+smsPSCyoChhpMFyoadCqEtZ4WYKJKp2w402h4wx2RJI9gUBpkmCa9TJTJszn3L7BiYchJsSwRimxx4oBHh+etu5gGJH6eaEdlZGrbx1T3NDx4T9TR5H0PIhsESaf5MTvRmzntIf4nmYz5QzWqdZk4bPHBOkJSj4JTTLAQaLOwBhT8+XoZPi0YnWcOGSsE0/3rO3lOcZCHW/PstQXcf7RrOFm56HsTq4JbsnSgDp6aeaPQWBG02OpBGdjtFUiEcty6MIunMNhPEZyBkexyiNLsQmdwqHGME4u3LoAp7OjqggGBeTjBbXEGz8mKNBdnbnDNuQFSg0cJOL7oJut/Ivf+shGqLs31LT3Q6wvB+c8Z+jlHXbkcmV4gJQu/+N/UY7eh4rt4nBUUR66/+Vb+SMYlGHBlXQF24qd2ckvZflx3duDg6KuB9vB1T8O5/r+WNheuKrYZTt/vo1DxHMRd/6/6+zJ489/rMirSjdJ3+f9ciF0/U6BVb/IL9odPJZQP/3sohFRCxsCiKzJe1+9M/rgRyUWtnLO0LnH8Hend3WuDFni+DFyC6zISOeT4UM3rEI4+k8INnpwUrh/Ogzp0cPi6vh3RWSxUVGaMo8P9Se6+f28eEoimVk3INh+++eXZ8fKC+6Scbz8Bw7vL4v/K8otf//WNy61YV9O/lX1eZmHy+lxFdYaBk8ee/vb2sm/sOU0uykkYo/v/fmoVZk9nOKydZUkpr7JG9wMoZGGt8Db2sbqdnaf/fnLQCgaM/tO0E/+ln779wkHjqkZ+c5ERXWjS9hjmAmwmeIuGx1/ajl1l+aKwoKGr86s7dW4ruPnxU/Jvja+DgEEluGCakEHYnanT5O6ehEkO1ua1NPjOuC2tbMqLgL4UT3ocSl/+wgsQn5Qi+Cu8qVzeLMwhBVU0G4rn/d2liAUU2da8y0CGHh9BcAZMGQXOpCYn1LzcS6QrB+52MwUwOueg1sWMcs/IZMIk3dcrVlOjia6T2SeG7a9+oxVwIJg9zRQ9C5qiQVwkmpX7fBGBi8OZRk7p1pVYjLu0x71Rvz8Ek84z4nFJKHr5u21Ur2d8MjrcA+uqap3FQgTwQ+LlrLStOGcVCjnd8oVWzhlJzrzDYva1mN+Vttapmnxp2EWGmv6sBUzbPM4BqnSeasmGcaaqnGXlTR5t9/95DNYYT1MtrQb7Yn+VWEyySfneu5bSMinR3ITpQQajZZ+85DCXa+83h0bywbZ0SckkJLJIsz/RWHgyX/Wzu0QntIHZnBs57tqM5dBI4CE1Wl+6BcI7Ex95pBFZA0EEwnWpKXxL1eIdsKQ8G98zrjoKdhKH4G3ts+xbfTloWHiCXb5Agiisel8Lcex0YjNW5e1BkeL0GAjj4PADw/w+p2BYpdJOVbtFKDnxOQDqmUiIN7mRQIBZ2e7Zr3CTTT/+2QhfzCP/jbezt6/gW1Nabg0f3lnXTVJ5SJleYjVz5z16Pfda3HARmHh9RFcpNzW5nL7Xc04vnqq6r8rIKticb8V/6hVHptQSjZz5gY7O1qDZ0/IvwqEGDBRFQVmV9Wx4G32+M2Iqw6d+83MQ6xJZDioRtpJ1zM5C9Fe72EWqhhu+sffmk5LYYsxWAykO/2fFRi6BDX9+eapR/1OBQkXHAlIJ1kmjIBV941btybPLMBMnClccZjBb0/P4wSz1pZKahaWaM5l9RVYDqsVOOnIGyS/SebHH2TWuNaK4uA1H0C5jPmLOu6rqLZ9Avj0M+vhzijO543DgBdeETKfAqiC9ZenGzbPopLWfPOxXPplrWZbnyscQoOYXoBX4BjvcLwgEwkdME3Ani/FL4ury66yke7PgbmmUlCNoYfNK33Amn9J3T3ZlxEW8YRSKc7W2gKowyMfagyEgjVGrv1j9X/ivJlooyocTQxx4/IM0jz9nwPy+5M2JHoT0c1ZaCiGeiy/EqG7vDUJUiUZgqqMDuBVA5y7RiFQ89evzEI7Y1jImEP6KpGXU23rKBIC43AIRwzBu31P2fTTW1hdnbzxTBkdYiPUZ0jSwKJGQ1I5uF7DAfywgEajF7D+3v576HcYhmK4aJKIAkmKC4+vD5I8GKBUMJ2f0DDRbyaOB8qIXFaAA42X/und1MXH/i+NSI9KkaaEct9uknZVnuiMajDhIeYmsDMysDwTP4Dn/38ecP4avwWW0qzIk+EQNk+DY5qRB3+pj/X2GiPDNJyr29uUGTJhO0JM7J8dNF5dj2zAgVoRYgsqApYsYJtNl7SitLdJWjqzP4H1V4MzyClIcfMU2iuRix36+urNJpCoKTXtAe5HEZutQBF+kXwGCgHD51BofkYIIOVSFPDBujg0gZMNHR/0FqqmNTPrjf9k/QpMbAQOVH6R4FJFmXYotTA6gZ9XevMYAv3K/KyOF3gEVDk+Qn61wQDun0BxW84/hYMKVIfOvGHgIXJxQ30EDws2HDx+7Cg6HUYw3cwLyYA6UBoEFJPt4e6/YrZ/4fsGYOs08pnJv+nQRReGE6BYN5Ix6nBwC94xIEDIVdIDmNxLpN8UXO4DCL1KduGKRwa3nz4LkrBXzbjSm77dtctdWcNhDparSH2kEiSJRDWYO3wt33l7ClKmVXa+DrDwQA874Q61Y0J7+HEGOsK2chzF/5BIAuivgWXCY+lhJVAseJbnQKkcBkQ/HvBT4HdHfp3QvDhgf4nXxANPbExxpu/rrRlwpJEUzf6ZgnEvjx0kCfN95A3t1WP4mfP3LPZ49YD/bqDaEqVWrAcQ025tFQY60PYoNsfk2pdfkDhKBvTpraZg7sUsdg/Z3lYQupZDRMs+vRxqazce3TRaxvEAmATNgaIf/EMEGHCD1M1hcufUI4MjQHylbRnBKsNW3C6Hsea0E0PaHZuxMYhrbMTPD9Sqt7xCyar8IFDvKwRZ/qwHKJxqC6gRR0HRyY+82Mwk6V9N7XZI9LhOZt3J5jxD/VCHcfhEq5pl2vJYuZb8WTM1t4cmtgbhHIBkC3MCYKmz6tX+72Gi1Z63bZTwVkApDsQSQLtbz5LBQl1Qo5DfzewmmEA92EMBLGH0pCaxtDmAR/5W9QX7fxnenhbPfluRVx6A2FwnVk1mL2lT69nfWBc/35KX7CWXGKOVlWtIApbdFPgKUg3WxQzkxcAqoFPCi5EZITt3QriXkKgck/dAw3rEf7xNDxtYWIe/SV/fW+YBDj6ySIzI8eWsSyiE//xofiPOdnPl2x9eqVRCSYne4fZfQ9pMW7yaC18KzdpeD3NfaWa1HUTVQ2uP/ivA3R0WyDQK04y7FQfIImI+6VYYDAt8jRC8YDGCALsxs/kIuj9YYbTrMIORdpAN8/8rMvvkatLu80jz5FqiA1ewx/dKGX7vZR9pMUtrYmmpn9AgJzc/1Qq+rJJ+sDlg6t4RfeLuztjaehkr7sZz5//PEvtdcQ9MZ9SFMcaQbjnQ4OkOJ8IaSZLxuG3iocmbExIbC6yqvVvSQo4C4WCL3NQGotViWuXrO4YerH0zs3q11baMICNAfA3W/hWMNEkcPyGEHuibKlRT5VlDs+safD/jLddIcrMwbDQNt08+EOCO479fox5Q5HECjyadbGSYdAiQ2pTjTMsmJe//TQjg0TO/ipRkJAMF55L+ZbBmk7BgCQKRrVURakNLg8dl7dTmOuyIh8BXLb7u86zVc7Kcx9BcwdZxcsTDqOaXc0He9Ir5NTBm27zJHffnD3w0TV89nc1GHuaxC+3WXocCizFrAnwtiOYzi+9JC7r3Al0GjrsklhtGgYuA19kOobaCe4igzqvufgAMbWhAP6SqHnF6mIgfXemmnoURxnuuuTEFgnUDBHHdVuI9NqiYSF7hG5k08HxtlEF6Lhifnahc+axeaNytciZmg5vfpYUIRohPuMQWwt1oZzG9GTZlLEy3tFIvR6KzJM5QCdkH1huP0i8LSGrWzDChb93aNqZiwfravJahlQXliBM0Yo0z7jvJkGstYUBROYN+ViMxBeBgsjqHMEANNIH1hiAGikG4ACNQBWUDggGBIAADBPAJ0BKsgAyAA+bTCUR6QioiEolPnggA2JTdwH6SR7Ms/2ebRAygDy1IfZflV7a15/yP456FFCfcFnU/YD2d/pn2B/1k6YnmK/aL9qvd+9HP+b9QD+zf47rXPQP8uT2Wf26/b72nrx/x6dLvvT3I3gzU7+X/kz975r99fyj1CHh9od7GfXO/K1F/CPsAd9R4QnofsEfz//Qeivn/eqf/d7hX84/unXG9IMuyRcTKbiZTcRoebx9pCAS/cy6y5QDxN2z0viM1hsYK4Mp8IWV3aEYvRjUsaKSiL2UD62Owsgz84H4qVcYLcRAkKHI7FqNZ508qfgPFw2VlFUjL/iOlkpby+e9+4sjuyPUMODrNuirCPuQwhDpOOcVkYxw8NHk60oWPQcxy4+E+2/0VB84chbYqXvSJ92pkZxvH2HmZeJldAtadmFm5ih6+DDqalaQq3Y7RrNd4ISCU7ThkrKJM+PueVYoEE8aYvdy3H7rEb/PvD1zSywLbwcfScwGRDGgYwYzzZ7wig/1nf84TIsU/N4jzwYnjUe38PKm7hNCtOXEZ8lRU3fmpZIdmX1QlGcrKfhonB4dReV6/nmR3eiCgrJQ3fusNlkUm4/al1scam+EaRqc82hg/7kpdO239RUl3vQB0Mp/5p4Q9q3i7e/gZhkW5ToPUWGA28zTPynsaoCoKxkg3TxLYKeHUMbmvvA/JVHMfU4P3MuE2768c+4QmM+Xl2XqIpjE/2iEAdb2M6MBtPeK1t05VwUrGFy3u7frPlidI0ok5cvQSUQ/yp5E2HaXc8Mt9awJ6v9Mjmf0UJXkQ99JKrPK6lFCrUgeBBoza2AGo0TllfzsjeJ9jTXkMlsAAD+6GzXLT/88t5hZ9uv//xUaMzs2/Ddfi6U+ge7fedqy09b15SpYaCOEoPNV1L2sY2vNSYNYip/S8HdyW3/hfOHXVpfwezMBdnfF4a9h7yGMM05TwI8Enr8bdLC0SJd1h6W5TGvSzyADRtFho+uXn60Upg2jzSgqHFjNC/SvU2LAQTX3bDAGQfWrZeImlxPLsrozzQc7bqJe3PnBmhrXph1uCG9VlCQ4L+RH2YUPo9VCH1bH+jyacj6fuXJ1oWur3dUxn3X+iduYtE40iR3C8QSN3bgP9tPY+Zo1rvUEB/m867LjMnQfp9BZ2jCwyxivjWV7WsVZvBO/E7CvuDKRtXsi8CVLjd10qO9il0RljDvn7Ogdu7iG3v7/1cqfLa1FxjqNNOj51raJ5husJGSL/1sXMnTNAtRkSVTEQ8txd+QmTf6GKm1ack4+9zCKB1jx4jfYdb1aJHydZpsTlFF4arggIlk4x/LAH9wYD+er2Pncv7C+HxgIkiKXZhLa5kBwjB/bhkl3u60+v8nvrnBWlSw6YOiq8ls4m34zVh+HU+3mj0orlpQCB1GXwLctVDZDBzoNlvv7XHpxIt3lf3qcjU3Z+ExwGBV4+K6U+/9PVizJXyOAxtESPyxWOMOcnVobbYm0zte5VqXD6stgRGnrB4Fo08P2CSA51/9fdYeYNR/ZY98tyrXeO5YysTouqUjUaDOnEStYYEaBnwKK/55822nwCc2PGTaSXIu0SjqNIyKJA1DSCAw+7t20NQfMUnIKADPCZZbdpHVLpYotOCBxVyFflV/0a8+Ln9Qww+HlNu090TaxcF5QCTOfiKUA5norRkCWMF+wHGZFRjFj3phLU3iCwN4/1x2ZW0KaSnzu3Sd5rSd/4fM57PutM3R7RW5VLrzX3bj24eftBEVP2Q605kJmrtxcDq5AvWFNpkPJ0Av74R1Zbb7hD3uRreDhHiMXVyIN/bQHxZ1jwI5+uUDziGS+x7Ln3uW+NHMH7DX1lFUyJRp8+bXw8/wW+JVxsBnLb0c5zbsL4eDu0zCc2KKCEwoOcAUwGJvuPM2RTHUI//PC3d75GvmURgDivSzx/W1aqb2caADNwQIxCocJdtaUzbz2YNlJ1j2ESDo4Z4O8vEEWyWtJNow8qitF2D4T5nxBiwk4gth2VvRcTEm3XNnd8kUXVzNhAOA6/y76UmqKlahqDBO8ztSIpk6yVNbRcPDDmW8Jn5Hv+N/Q8OMJB4ggO9b2IA4I4XY1kKj6wJ/wmAUrTMWU9JN/9CRINd55WIeuYVIMz49HpSrh8WpJZXsE7ne6yz1dsJhxuIamaqa+rJ9M1cYToFGKQ2Wnhz28kJtO/J/ZRnpStCUSlccZ2sXjlbENiq/7iWkdGnRT6d2Ivs0Kns7yRZN2g+CWH+/xrvw5pRMcHuTW12dnJ6J5J8+r6qWfnvGwXJTJOEo83+V/3550/XrTsUEZ9g2IUEn1045LEMkTYPWwG5817ja6o3fyVQXD706HDGmsOGN8vgDHQLtACBStrBjjP4NhlsBEc+YFOi0HCeVY9GuRdhlNdEUQdIlzVyvOAo58ofawhnW8WLac4DPibhdOt1uWSEvJz1Jr38dyA3fTb6JrFCBbvQOM1CoU6x43T8qg1f/rOZurW8M0vXQ5lzFQ5DMPBMQSj25P/h7VEViyrSrmtNZoTMQO0uRFLDOmyLt5swvNML4JW7DoPXVZc6tU1uZalZ41EVHkYIMsKqrS/kcGanBEy/YMBpVhmToVal4lgoIKLmGl0ycDKbVA/TfGNAwcp1W3yDOthtOzYQihWyLD1FOXxVNgo44O/+w9Db+0c5rVIJ2nnamZkpfCeWXyoSYr7cJwyL+Je9tR0oCJzrX1zUtdWhsTNkAiAk3GegluX8fL70sNJJvDAqfr91tiRSFX/SRH0FRtIPnPLdJw6FeqUORNfLBWttnH+WYcES/v6jNLmfLy2/cp8+yD4sCV87T8hYm5jYK3wHWswzEW6cJOJzJbAJwTDRuagMFBO7QdB/morLye5rtB6vDzZ8tL04MLJ6+M1480nKKNeJlZZ43PE8WfGmLeTXWLPkTl9nAfCpCQ7y+muVTwMelfZHQspkVVPezx1sDJVt4vJHZk49s/sahm8ZAfZIvCMj/d3yP+/rx1vHtoNvtQTuI+UDje4wjghuOfM28V83OyPyWp1zrFKOFm4ewomPEP+CIF4TDlKVqkRbA1ezDdK77V+YvIK3u+pwnBuAWQp59lxtY/EiWf9Y+adOdKLpl1S7VONjJhAJKhbcw5SG6FWHqvYhDA7l2swGfw63uibSZF6nTXy7WA+EPJIGesY5wVPRNtdfWYTlrdaVHilXQctyHG3AK84caYu+qaE5BqMz7JV0EuYWR5jKUPNyp08vIsh0YR7j5w+m0zZWBDcZQPZEXTwWXGB7t3/cR2lEQXDuq0cu9bRRoKq3XE3BOIgbh0ebfZ5pgAaFrdak0exI/NOGXmjLyYe6gtDAFNsff/uA7n0EGPX4D2LNctF60fB172Q7bnOgh98/SbVcLGUdJUoEfYOGsYnqq0NTD2legXv5cb5+raKCG/LeSklRXG6YLNTB1xb2US21m/1qgYcjWRtcefPUl5DZryjYyLjkE8HEAhFlR1rqGKZCecfRVTOykVr9+5u6O+Urfu+5GvraJFMsn5r1//T+YvAWT0OSTFJOhvUy89uk6pajMR0Udoav5TmxY2mQZMyGxC4fv0C4DfF4hBfVtIt8dW7aLJJe58xWuU8v0pi//op7yDeJBjv3EdxsVI2hMm/VEoymYCpUo8m1CC2QvB/qEOyzFVktOq9Kt9/ywV8m/x9cwNtM8YhgQjZJ6mfRXH9r7uVnKGOthstWz6NkElugyY3b+NaCHd9dLKdFuYZxq7Ho2nIQPcd3vJd9izpVuHRg9JuW+VWI31fRXf5axJQevCTK6S5xBUkm4YUPa9/iVwwdh/hchMkgvVbJ3zYJdf5GgtWEhCivGQU4zcv9K1UXZ7xCJ3kvN8GLfMvaXI1V7oS81S18xng/1mO/uFkrTc5bPQ5lzgF8+4IGmWI+OvC+fHVyRBgh+mn47t+stJlQocVG52sDnPnPhAF4HOfnVVnKmleeUGZuUyzZVcnDzwNqpM9/xY4kT3cGim+H4sNLc1QY+kNSGEXa5uRBBVR4i4pIWupAY7mz+oSh4hiZteuD1mmqtCa+qX0pHJGxNFdEYUZPe+3d9Q5hkD1Bu0WLHJ8AD1ekio+8k9faZ+aQkQrmruflXgZ0/8SX3QdySrbfpU3NoNZ790VSS4xKKU7Wdlzf4iVhMXy2HIUuc00vc47odhE4Vz6fyJTP0PHmdYFd8/hr/gCi8OZB9ySx+lv8WWZ2oNolGKVippOckPWqe3taIQJ+j2Rn3HkLw4HWlcUfQAogss3WzhEhaHL0L/7Wm3V8rTGAbaBUUP6q9v5jlWgEUFepztWNy4/eT8enRw/y+ssNeCLfb9F2XeCzAB6jVXn9ALFnL+aBxrTEDvu1pONHGCHu7jlyhfqhBhuXV7/fEkc2ovYWok3UICRy7JYuHfGnCR368gKpMRkghyXRBADIqK5of9/aOq5iVzpSv2lr61p+gbT6J0lXvSgfY6ltJAybXQuWGP8d+/35f9f8oB5ZiQKQEOeL1VikWLbBMMCUEPR7SR1qxJssJggi9WmOK54ceZcmmsB8b21MyRu4PWvewufudsL/M5Z/9ILE+jzZnLZuViDSn7FMv9TGj5SSEmb0JWnC1iKzBgm0C3rDsV0vg5Oj9Yp7c2xNie2UgbE1+djv3/1kyYAU5FeApch+z2f480UaGzXVLie1v89cMLFiPVzw/uoJAIM7fldCnMIgiTaWqUP2ViNI4Qo9A9O/1wHOPZHSrsvVIXpV+vCGSVqe3JzDmfdbMz2DC77taI9Q++QASYSWII3gTxtXbUF7mu73lqkzA1l/ZgStllS6rqRj9U15QOet38kErNXZtGVf6Jq7FsOiZu4IC0AD/rTj5459A3+dIIy8UxgNnqhNM+zHvIFPynK3TXB4FV6WdkgCrXC8vYx9R8RtD4b4c/WOrt2Zn50JbaRQ8zRpTsGnuE6ZexyXgvEjQIq27delhenJVl97Ysiszm0FmV4bqqKQW03DxWzOfQ8W7t+vhf6fyJScEjy7lPYCpKOehCW9GVVNMr2k4fbhdpoTLKWdlYwaJ4NzhE0txXMzEyybebmM/X5J3XdM8gtTqV4RunyjHYmn/ghip1HNBrgyPcF8KjWZ7e+IurtV0NWvvUwLrJ7SEBYAYnMR0zPX8rD9xSX9z6fY6eNNKIeuvpXQQ5rvZN7duwvDweo3XDJMQE9I2J6lKGfFccfe5QtbtxZrl7yXQ7SQaQZSFehtvfFqi2JbsYFmjaQKsqTZkS3YPPCr061qXKcZ/5NU00288zsbZfXe3o+WVZWDRy6Yn+Q1q0r8eEZb7fZz/ToAU2nf4E0Wvxt2sx3w9leHBTyQW6YybruDyNT9qKViyTMm9PWPdQgi+ZnRt237Ob1ux1GTip7S9g9K/RnenIjqwgk2XWod6pPSLk4BFEw2+h7++nYDSZZbJJiI51zO5TwD0TnipQgB9f12TM6Vutz+xflMfSCubcBFc/deL8DOWTGhbEokqTvg84LvDH+rncrqGVbh3EYTBryYNMUeyAZzmqPloIbyaHx2t/RzfbSIRN6Mi6qkyr6/q/zMGxeLR3SDlz9TJ5F6RWkY6GB4p1GZn/Qc/IP7uU/G/XTREIBm/Su0hvGqDBZBWzEU5VLTYEyDalhEa6sf7vsbjkf43qFexRclEzDrx+fRTAtuJS85t8O8bNBYNMvbWKo+thy3g78/8Cl7CwSLNtlvF+7g6/EgCohKuf67mv9zAHPuTaFf83/2++YbfJvcxAqFyctnNK/lWqEpLNh6E75I0WtN0tLPQ/fp5bNgxwILygfAqO1Es02ydVdYtZii38/+w4BoixFJbG8l6Mo2YfcPkjvah4NUanPQe3iTuSeOpSHvnTRpuGynjlBq+0QkKYpxn/THoJEALLMBqymciDF4Q8R8HYdN3/4tr5nmwwGaJW2pGSTw67WkFV9qtaU6LJ8Rv8EhsdenMtIXLBmYaegKa5FoJfHTSD++kmJurDh30uMDKBUEeZ9YGAT47tUUDGNr5o6eSbm3sMOTxZDoRjVCEuiNfJVpuNBJL3ufNaMy3z/Z5A7gYrWELGqSeWu9w7lDz15sOCBIHLl/Gh/pGSKsnqGf13T0iD/4YIBEYlX+qRXPilwvMvze63kKd2up7LselGLkBk7jvIH8k1UALQnkIolAGI5uhsFBcD9qCmtYQAA==';
    const perchOn = () => S()?.uiMascot !== false;
    function perchCard(title, text, pic = true) {
        return h('div', { class: 'rpgc-perch-card' }, pic && perchOn() ? h('img', { src: PERCH_L, alt: 'Perch, a green fish in a top hat', loading: 'lazy' }) : null, h('div', null, h('b', null, title), h('span', { class: 'rpgc-note' }, text)));
    }
    // ───────── 2.3: the clock: a face for each world, and a sky above it ─────────
    // ───────── 2.4: a clock face for each world ─────────
    // wall: Classroom of the Elite's classroom clock (12 hours, hour and minute hands). crystal: Re:Zero's time crystal, whose
    // light changes with the hour. sundial: Mushoku Tensei, Skyrim, Dark Souls. game: Overlord's YGGDRASIL ring. astrolabe:
    // Harry Potter. digital: SCP. analog: the round 24-hour dial for anything else. All drawn from numbers only.
    const DIAL_FACES = ['analog', 'wall', 'digital', 'astrolabe', 'crystal', 'sundial', 'game', 'rune', 'bonfire', 'pixel'];
    // 2.4: every world has a clock of its own; no two share one.
    const DIAL_FACE_OF_WORLD = { cote: 'wall', scp: 'digital', rezero: 'crystal', mushoku: 'sundial', skyrim: 'rune', darksouls: 'bonfire', overlord: 'game', potter: 'astrolabe', undertale: 'pixel' };
    const DIAL_FACE_OF_THEME = { cote: 'wall', scp: 'digital', terminal: 'digital', space: 'digital', rezero: 'crystal', mushoku: 'sundial', overlord: 'game', potter: 'astrolabe', parchment: 'sundial', dnd: 'sundial', skyrim: 'rune', darksouls: 'bonfire', undertale: 'pixel' };
    function dialFace() {
        const s = S() || {};
        if (DIAL_FACES.includes(s.uiDialFace)) return s.uiDialFace;
        const w = (state.world && state.world.id) || '';
        return DIAL_FACE_OF_WORLD[w] || (!w && DIAL_FACE_OF_THEME[s.uiTheme || '']) || 'analog';
    }
    const P2 = (r, a) => [(50 + r * Math.cos(a)).toFixed(1), (50 + r * Math.sin(a)).toFixed(1)];
    /** The classroom clock: white face, twelve numbers, an hour hand and a minute hand. */
    function wallSvg(n, label) {
        const hr = Math.floor(n.minute / 60) % 24, mn = n.minute % 60;
        let ticks = '';
        for (let i = 0; i < 60; i++) {
            const a = (i * 6 - 90) * Math.PI / 180, big = i % 5 === 0;
            const [x1, y1] = P2(big ? 37.5 : 40.5, a), [x2, y2] = P2(43, a);
            ticks += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#2a2a2e" stroke-width="${big ? 1.6 : 0.6}"/>`;
        }
        let nums = '';
        for (let i = 1; i <= 12; i++) { const [x, y] = P2(31.5, (i * 30 - 90) * Math.PI / 180); nums += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="8.5" font-family="'Helvetica Neue', Arial, sans-serif" fill="#1e1e22">${i}</text>`; }
        const ha = (((hr % 12) + mn / 60) * 30 - 90) * Math.PI / 180, ma = (mn * 6 - 90) * Math.PI / 180;
        const [hx, hy] = P2(21, ha), [mx, my] = P2(33, ma), [tx, ty] = P2(-6, ma);
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><circle cx="50" cy="50" r="47" fill="#2a2a2e"/><circle cx="50" cy="50" r="44.5" fill="#fbfbfa" style="stroke:var(--lumiverse-accent,#e0538f)" stroke-width="1.6"/>`
            + `${ticks}${nums}<text x="50" y="66" text-anchor="middle" font-size="5.5" font-family="Arial, sans-serif" fill="#8a8a90" letter-spacing=".08em">${hr < 12 ? 'AM' : 'PM'}</text>`
            + `<path d="M50 50L${hx} ${hy}" stroke="#1e1e22" stroke-width="3.6" stroke-linecap="round"/><path d="M${tx} ${ty}L${mx} ${my}" stroke="#1e1e22" stroke-width="2.2" stroke-linecap="round"/>`
            + `<circle cx="50" cy="50" r="2.6" style="fill:var(--lumiverse-accent,#e0538f)"/></svg>`;
    }
    /** Re:Zero's time crystal: it glows a different colour through the day; the ring of lights counts the hours. */
    const CRYSTAL_LIGHT = { night: ['#5b4be0', '#1b1650'], dawn: ['#ffc1d6', '#e86f9e'], morning: ['#fff3b8', '#f2c14e'], noon: ['#f2fbff', '#8fd0ff'], afternoon: ['#ffd9a0', '#f0943f'], evening: ['#ff9a74', '#b8385f'], dusk: ['#c49bff', '#5d3fc9'] };
    function crystalSvg(n, label) {
        const part = skyPart(n.minute), [ca, cb] = CRYSTAL_LIGHT[part];
        const hour = Math.floor(n.minute / 60) % 24;
        let ring = '';
        for (let i = 0; i < 24; i++) { const [x, y] = P2(45, (i * 15 - 90) * Math.PI / 180); ring += `<circle cx="${x}" cy="${y}" r="${i === hour ? 2.4 : 1.2}" fill="${i <= hour ? ca : 'currentColor'}" opacity="${i === hour ? 1 : i < hour ? 0.7 : 0.25}"/>`; }
        const id = 'rpgc-cg-' + part;
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}" style="filter:drop-shadow(0 0 7px ${ca})"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${ca}"/><stop offset="1" stop-color="${cb}"/></linearGradient></defs>`
            + ring + `<polygon points="50,10 74,32 68,76 50,90 32,76 26,32" fill="url(#${id})" stroke="#ffffff" stroke-opacity=".7" stroke-width="1"/>`
            + `<path d="M50 10L50 90M26 32L50 44L74 32M32 76L50 44L68 76" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width=".8"/>`
            + `<polygon points="50,14 60,26 50,40 40,26" fill="#ffffff" opacity=".35"/></svg>`;
    }
    /** A stone sundial: by day the shadow lies on the hour line; at night there is only the moon. */
    function sundialSvg(n, label) {
        const day = n.minute >= 360 && n.minute < 1080;
        const cx = 50, cy = 60;
        const at = (h) => (180 + (h - 6) * 15) * Math.PI / 180;
        const Q = (r, a) => [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)];
        let lines = '';
        const ROMAN = { 6: 'VI', 9: 'IX', 12: 'XII', 15: 'III', 18: 'VI' };
        for (let h = 6; h <= 18; h++) {
            const [x1, y1] = Q(8, at(h)), [x2, y2] = Q(h % 3 === 0 ? 34 : 31, at(h));
            lines += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#6d5d3d" stroke-width="${h % 3 === 0 ? 1.1 : 0.5}"/>`;
            if (ROMAN[h]) { const [tx, ty] = Q(39.5, at(h)); lines += `<text x="${tx}" y="${ty}" text-anchor="middle" dominant-baseline="central" font-size="5.5" font-family="Georgia, serif" fill="#5a4a2c">${ROMAN[h]}</text>`; }
        }
        let shade = '';
        if (day) { const a = at(n.minute / 60); const [x1, y1] = Q(-2, a), [x2, y2] = Q(32, a), [x3, y3] = Q(32, a + 0.07); shade = `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="#2a2216" opacity=".7"/>`; }
        const moon = day ? '' : `<circle cx="50" cy="80" r="5" fill="#f2efe2"/><circle cx="52.6" cy="78.6" r="4.6" fill="#8d8065"/>`;
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><circle cx="50" cy="50" r="47" fill="${day ? '#d8c8a1' : '#8d8065'}" stroke="#7a6a48" stroke-width="2"/>`
            + `<circle cx="50" cy="50" r="42.5" fill="none" stroke="#7a6a48" stroke-width=".6" opacity=".7"/>${lines}${shade}`
            + `<polygon points="${cx},${cy - 2} ${cx - 3},${cy + 3} ${cx + 3},${cy + 3}" fill="#5a4a2c"/>${moon}</svg>`;
    }
    /** YGGDRASIL's ring: the day as a gauge, twenty-four hour segments, the time in the middle. */
    function gameSvg(n, label) {
        const hour = Math.floor(n.minute / 60) % 24;
        let seg = '';
        for (let i = 0; i < 24; i++) {
            const a1 = (i * 15 - 90 + 1.5) * Math.PI / 180, a2 = ((i + 1) * 15 - 90 - 1.5) * Math.PI / 180;
            const [x1, y1] = P2(42, a1), [x2, y2] = P2(42, a2);
            seg += `<path d="M${x1} ${y1}A42 42 0 0 1 ${x2} ${y2}" fill="none" stroke="currentColor" stroke-width="5" opacity="${i < hour ? 0.85 : i === hour ? 1 : 0.18}"/>`;
        }
        let hex = '';
        for (let i = 0; i < 6; i++) { const [x, y] = P2(48, (i * 60 - 90) * Math.PI / 180); hex += `${i ? 'L' : 'M'}${x} ${y}`; }
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><path d="${hex}Z" fill="none" stroke="currentColor" stroke-width="1" opacity=".55"/>${seg}`
            + `<circle cx="50" cy="50" r="31" fill="none" stroke="currentColor" stroke-width=".6" opacity=".4"/>`
            + `<text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="15" font-weight="700" font-family="ui-monospace, Menlo, Consolas, monospace" fill="currentColor">${n.time}</text>`
            + `<text x="50" y="63" text-anchor="middle" font-size="5" letter-spacing=".2em" font-family="ui-monospace, Menlo, monospace" fill="currentColor" opacity=".7">${n.day !== null && n.day !== undefined ? 'DAY ' + Number(n.day) : 'NEW WORLD'}</text></svg>`;
    }
    /** Skyrim's rune stone: a carved stone ring, runes every three hours, an iron needle on the hour; at night the northern lights in the window. */
    const RUNES = ['M0 0V8M0 1L3 3M0 4L3 6', 'M0 8V0L3 3L0 6', 'M1.5 0V8M0 2L1.5 4L3 2', 'M0 0V8M3 0V8M0 2L3 6', 'M1.5 8V0M0 3L1.5 0L3 3', 'M0 8L1.5 0L3 8M0.6 5H2.4', 'M0 0L3 8M3 0L0 8', 'M1.5 0L3 4L1.5 8L0 4Z'];
    function runeSvg(n, label) {
        const day = n.minute >= 360 && n.minute < 1080, part = skyPart(n.minute);
        const ang = ((n.minute / 1440) * 360 + 180 - 90) * Math.PI / 180;
        let notch = '', runes = '';
        for (let i = 0; i < 24; i++) { const a = (i * 15 - 90) * Math.PI / 180, [x1, y1] = P2(i % 3 ? 43 : 41, a), [x2, y2] = P2(46, a); notch += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#2b2e33" stroke-width="${i % 3 ? 0.8 : 1.6}"/>`; }
        for (let i = 0; i < 8; i++) { const a = (i * 45 - 90) * Math.PI / 180, [x, y] = P2(37.2, a); runes += `<path transform="translate(${(x - 1.5).toFixed(1)} ${(y - 4).toFixed(1)})" d="${RUNES[i]}"/>`; }
        const sky = { night: ['#0b1424', '#16243a'], dawn: ['#3b3a5a', '#c98b6a'], morning: ['#6f95b8', '#b9cfe0'], noon: ['#7fa6c9', '#cfe0ec'], afternoon: ['#7397b6', '#d9c7a4'], evening: ['#9a6a58', '#46395a'], dusk: ['#2a2a48', '#8a5a6a'] }[part];
        const aurora = day ? '' : `<path d="M24 46C34 34 44 42 52 34S68 30 76 40" fill="none" stroke="#5dffb0" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/><path d="M28 44C38 38 46 44 56 38S70 36 74 42" fill="none" stroke="#9a7bff" stroke-opacity=".4" stroke-width="2" stroke-linecap="round"/>`;
        const [nx, ny] = P2(29, ang), [bx, by] = P2(-7, ang), [lx, ly] = P2(23, ang + 0.13), [rx, ry] = P2(23, ang - 0.13);
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><defs><radialGradient id="rpgc-stone" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#8d939b"/><stop offset="1" stop-color="#4c5158"/></radialGradient>`
            + `<linearGradient id="rpgc-rsky-${part}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient><clipPath id="rpgc-rwin"><circle cx="50" cy="50" r="31"/></clipPath></defs>`
            + `<circle cx="50" cy="50" r="47.5" fill="url(#rpgc-stone)" stroke="#2b2e33" stroke-width="1.5"/>${notch}<g fill="none" stroke="#e9eef3" stroke-opacity=".8" stroke-width=".9" stroke-linecap="round">${runes}</g>`
            + `<circle cx="50" cy="50" r="31.5" fill="#2b2e33"/><g clip-path="url(#rpgc-rwin)"><rect x="18" y="18" width="64" height="64" fill="url(#rpgc-rsky-${part})"/>${aurora}`
            + `<path d="M18 66L30 52L38 60L50 44L62 58L70 50L82 64V82H18Z" fill="#dfe6ee"/><path d="M18 70L32 58L42 66L52 54L64 66L82 60V82H18Z" fill="#3c4a4f"/></g>`
            + `<path d="M${bx} ${by}L${lx} ${ly}L${nx} ${ny}L${rx} ${ry}Z" fill="#1c1e22" stroke="#c9d1d9" stroke-width=".6"/>`
            + `<circle cx="50" cy="50" r="4.2" fill="#1c1e22" stroke="#c9d1d9" stroke-width=".8"/><path d="M47.8 48.5l1.4 2.8M50 47.8v3.4M52.2 48.5l-1.4 2.8" stroke="#c9d1d9" stroke-width=".5"/></svg>`;
    }
    /** Dark Souls' bonfire: the coiled sword in the ash; the fire burns high by day and sinks to embers at night; the ring of embers counts the hours. */
    function bonfireSvg(n, label) {
        const hour = Math.floor(n.minute / 60) % 24, day = n.minute >= 360 && n.minute < 1080;
        const k = day ? 1 : 0.55;
        let ring = '';
        for (let i = 0; i < 24; i++) { const [x, y] = P2(44.5, (i * 15 - 90) * Math.PI / 180); ring += `<circle cx="${x}" cy="${y}" r="${i === hour ? 2.3 : 1.1}" fill="${i <= hour ? '#ff9a3c' : '#5a3a26'}" opacity="${i === hour ? 1 : i < hour ? 0.75 : 0.6}"/>`; }
        const fl = (h, w, c) => `<path d="M${50 - w} 72C${50 - w} ${72 - h * 0.45} ${50 - w * 0.3} ${72 - h * 0.6} 50 ${72 - h}C${50 + w * 0.3} ${72 - h * 0.6} ${50 + w} ${72 - h * 0.45} ${50 + w} 72Z" fill="${c}"/>`;
        let coil = '';
        for (let y = 44; y < 66; y += 4) coil += `<path d="M47.6 ${y}L52.4 ${y + 2.6}" stroke="#2a2018" stroke-width="1.2"/>`;
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><circle cx="50" cy="50" r="47.5" fill="#140e0a" stroke="#3a2a1c" stroke-width="1.5"/>${ring}`
            + `<circle cx="50" cy="62" r="${(22 * k).toFixed(1)}" fill="#ff7a1a" opacity="${day ? 0.18 : 0.1}"/>`
            + `<g style="filter:drop-shadow(0 0 3px #ff8a2a)">${fl(34 * k, 13 * k, '#e2531a')}${fl(26 * k, 9 * k, '#ff9a3c')}${fl(16 * k, 5 * k, '#ffe7a8')}</g>`
            + `<path d="M50 30L51.6 34V68H48.4V34Z" fill="#a9a196" stroke="#4a3f33" stroke-width=".5"/>${coil}<path d="M44.5 35H55.5" stroke="#4a3f33" stroke-width="2" stroke-linecap="round"/><path d="M50 35V27" stroke="#4a3f33" stroke-width="2.2" stroke-linecap="round"/>`
            + `<ellipse cx="50" cy="73" rx="18" ry="4.5" fill="#3b332c"/><ellipse cx="50" cy="71.5" rx="11" ry="2.4" fill="#5a4d40"/>`
            + `<path d="M36 74l3-3M60 72l4 2M42 76l-3 1M57 76l3 1" stroke="#7a6a58" stroke-width="1.2" stroke-linecap="round"/></svg>`;
    }
    /** Undertale's box: pixel digits in a white frame, the hours as squares, and your SOUL on the hour. */
    const PX_DIGIT = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001', '111100111001111', '111100111101111', '111001010010010', '111101111101111', '111101111001111'];
    const PX_HEART = ['0110110', '1111111', '1111111', '0111110', '0011100', '0001000'];
    function pixelSvg(n, label) {
        const hour = Math.floor(n.minute / 60) % 24;
        const digits = String(n.time).replace(/[^\d]/g, '').padStart(4, '0').slice(0, 4).split('').map(Number);
        const S = 3.4, W = 3 * S, gap = S;
        let x = 50 - (4 * W + S + 4 * gap) / 2, px = '';
        const dot = (yy) => `<rect x="${x.toFixed(1)}" y="${(24 + yy * S).toFixed(1)}" width="${S}" height="${S}"/>`;
        digits.forEach((d, i) => {
            const bits = PX_DIGIT[d] || PX_DIGIT[0];
            for (let b = 0; b < 15; b++) if (bits[b] === '1') px += `<rect x="${(x + (b % 3) * S).toFixed(1)}" y="${(24 + Math.floor(b / 3) * S).toFixed(1)}" width="${S}" height="${S}"/>`;
            x += W + gap;
            if (i === 1) { px += dot(1) + dot(3); x += S + gap; }      // the colon
        });
        let row = '';
        for (let i = 0; i < 24; i++) row += `<rect x="${(14 + i * 3).toFixed(1)}" y="64" width="2.2" height="2.2" fill="#fff" opacity="${i < hour ? 0.9 : i === hour ? 1 : 0.25}"/>`;
        let heart = '';
        const hp = 1.3, hx = 14 + hour * 3 + 1.1 - 3.5 * hp, hy = 62 - 6 * hp;
        PX_HEART.forEach((r, j) => r.split('').forEach((c, i) => { if (c === '1') heart += `<rect x="${(hx + i * hp).toFixed(2)}" y="${(hy + j * hp).toFixed(2)}" width="${hp}" height="${hp}"/>`; }));
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}" shape-rendering="crispEdges"><rect x="5" y="12" width="90" height="76" fill="#000" stroke="#fff" stroke-width="3"/>`
            + `<g fill="#fff">${px}</g>${row}<g fill="#ff1a1a">${heart}</g>`
            + `<text x="14" y="80" font-size="6.5" font-family="ui-monospace, 'Courier New', monospace" fill="#fff">* ${n.day !== null && n.day !== undefined ? 'DAY ' + Number(n.day) : (n.part ? String(n.part).toUpperCase().replace(/[^A-Z ]/g, '').slice(0, 12) : 'TIME')}</text></svg>`;
    }
    /** The weather report: an icon, the word, and the temperature in Celsius. */
    const WX_ICON = { clear: '☀️', cloud: '☁️', rain: '🌧️', storm: '⛈️', snow: '❄️', blizzard: '🌨️', mist: '🌫️', wind: '💨' };
    function weatherReport(n) {
        const word = (n.weather || weatherWordNow() || '').trim();
        const wx = skyWeather(word);
        let c = Number.isFinite(n.tempC) ? n.tempC : null;
        if (c === null) {
            const t = state.data && isObj(state.data.infoBox) ? state.data.infoBox.temperature : null;
            const v = isObj(t) ? Number(t.value) : Number(t);
            if (Number.isFinite(v)) c = isObj(t) && /^f/i.test(String(t.unit || '')) ? Math.round((v - 32) * 5 / 9) : Math.round(v);
        }
        if (!word && c === null && !n.sun) return null;
        // 2.5: press it for the weather and the day in detail
        return h('button', { type: 'button', class: 'wx' + (state.wxOpen ? ' on' : ''), 'aria-expanded': state.wxOpen ? 'true' : 'false', title: 'The weather and the day, in detail',
            onclick: () => { state.wxOpen = !state.wxOpen; render(); } },
            wx ? h('span', { class: 'ico', 'aria-hidden': 'true' }, WX_ICON[wx]) : null,
            word ? h('span', { class: 'w' }, word.charAt(0).toUpperCase() + word.slice(1)) : h('span', { class: 'w' }, 'The day'),
            c !== null ? h('b', { class: 't' }, `${c}°C`) : null, h('span', { class: 'more', 'aria-hidden': 'true' }, state.wxOpen ? '\u25B4' : '\u25BE'));
    }
    const hm = (m) => `${String(Math.floor(((m % 1440) + 1440) % 1440 / 60)).padStart(2, '0')}:${String(((m % 60) + 60) % 60).padStart(2, '0')}`;
    const span = (m) => { m = Math.max(0, Math.round(m)); const hh = Math.floor(m / 60), mm = m % 60; return hh ? `${hh} h${mm ? ` ${mm} min` : ''}` : `${mm} min`; };
    /** The weather and the day, in plain rows: what it is now, what it was, the sun, the moon, and where it all comes from. */
    function weatherDetails(n) {
        const s = S() || {};
        const ib = state.data && isObj(state.data.infoBox) ? state.data.infoBox : {};
        const det = isObj(ib.weatherDetail) ? ib.weatherDetail : null;
        const word = (n.weather || weatherWordNow() || '').trim();
        const wx = skyWeather(word);
        let c = Number.isFinite(n.tempC) ? n.tempC : null;
        if (c === null) { const t = ib.temperature; const v = isObj(t) ? Number(t.value) : Number(t); if (Number.isFinite(v)) c = isObj(t) && /^f/i.test(String(t.unit || '')) ? Math.round((v - 32) * 5 / 9) : Math.round(v); }
        const rows = [];
        const row = (k, v, cls) => { if (v !== null && v !== undefined && v !== '') rows.push(h('div', { class: 'r' + (cls ? ' ' + cls : '') }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, v))); };
        row('Now', [wx ? WX_ICON[wx] + ' ' : '', word ? word.charAt(0).toUpperCase() + word.slice(1) : 'No weather given', c !== null ? ` \u00B7 ${c}°C (${Math.round(c * 9 / 5 + 32)}°F)` : ''].join(''));
        if (det) {
            if (Number.isFinite(det.feelsC)) row('Feels like', `${det.feelsC}°C`);
            row('Wind', det.wind); row('Rain or snow', det.fall); row('Later', det.later); row('In the scene', det.effect);
        }
        if (n.prevWeather || Number.isFinite(n.prevTempC)) {
            const same = (n.prevWeather || '') === (n.weather || '') && n.prevTempC === n.tempC;
            row('Since the last reply', same ? 'No change' : `Was ${[n.prevWeather, Number.isFinite(n.prevTempC) ? `${n.prevTempC}°C` : null].filter(Boolean).join(', ')}`);
        }
        const sun = n.sun;
        if (sun) {
            const guess = sun.from === 'season' ? ' (a guess from the season)' : '';
            if (sun.polar === 'night') row('The sun', `Polar night: it does not rise today (about ${sun.lat}° north)${guess}`);
            else if (sun.polar === 'day') row('The sun', `Midnight sun: it does not set today (about ${sun.lat}° north)${guess}`);
            else {
                row('The sun', `Rises about ${hm(sun.rise)} \u00B7 sets about ${hm(sun.set)} \u00B7 ${span(sun.set - sun.rise)} of daylight${guess}`);
                const m = n.minute;
                row('Right now', m < sun.rise ? `Night: sunrise in about ${span(sun.rise - m)}` : m < sun.set ? `Day: sunset in about ${span(sun.set - m)}` : `Night: sunrise in about ${span(1440 - m + sun.rise)}`);
            }
        } else row('The sun', 'The HUD gives no month or season, so the clock counts day as 06:00\u201318:00.', 'dim');
        if (n.moon) row('The moon', `${n.moon.icon} ${n.moon.name} (${n.moon.age} days old)`);
        if (n.weekday || n.date) row('The day', [n.weekday, n.date].filter(Boolean).join(', '));
        if (n.season) row('Season', SEASON_WORD[n.season] || n.season);
        const src = n.weatherLine ? `The HUD\u2019s own line: \u201C${n.weatherLine}\u201D. The bot keeps the weather.`
            : word || c !== null ? 'The side-panel block: the model is asked for the weather (Sky above the clock: Time, weather and season).'
            : 'Nothing yet. The HUD has no weather line.';
        row('Where it comes from', src, 'dim');
        const tip = !n.weatherLine && (s.uiDialSky !== 'full' || s.uiWeatherDetail === false)
            ? h('p', { class: 'rpgc-note' }, 'For the wind, feels-like and what comes later, set Settings \u2192 Look \u2192 Sky above the clock to \u201CTime, weather and season\u201D (about 50 tokens a reply).')
            : null;
        return h('div', { class: 'rpgc-wxd', role: 'group', 'aria-label': 'The weather and the day' }, ...rows, tip);
    }

    /** An astrolabe: the day above the horizon, the night below; the sun and the moon on one rule, turning with the hour. Built from numbers only. */
    function astroSvg(n, label) {
        const ang = (n.minute / 1440) * 360 + 180, rad = (ang - 90) * Math.PI / 180;
        const P = (r, a) => `${(50 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
        let marks = '';
        for (let i = 0; i < 96; i++) {
            const a = (i * 3.75 - 90) * Math.PI / 180;
            marks += `<path d="M${P(i % 4 === 0 ? 40.5 : 43, a)}L${P(45.5, a)}" stroke-width="${i % 4 === 0 ? 1 : 0.5}"/>`;
        }
        let rete = '';
        for (let i = 0; i < 16; i++) { const a = rad + i * Math.PI / 8; rete += `${i ? 'L' : 'M'}${P(i % 2 ? 5 : 13, a)}`; }
        const stars = [[30, 62], [41, 71], [58, 66], [67, 74], [24, 70], [50, 80], [74, 61]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7"/>`).join('');
        const sun = P(30, rad), moon = P(30, rad + Math.PI);
        let rays = '';
        for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, [sx, sy] = sun.split(' ').map(Number); rays += `<path d="M${(sx + 6 * Math.cos(a)).toFixed(1)} ${(sy + 6 * Math.sin(a)).toFixed(1)}L${(sx + 8.2 * Math.cos(a)).toFixed(1)} ${(sy + 8.2 * Math.sin(a)).toFixed(1)}"/>`; }
        const num = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" font-size="6.5" font-family="Georgia, serif" fill="currentColor" stroke="none">${t}</text>`;
        return `<svg viewBox="0 0 100 100" role="img" aria-label="${label}"><g fill="none" stroke="currentColor">`
            + `<circle cx="50" cy="50" r="47" stroke-width="2.2"/><circle cx="50" cy="50" r="45.5" stroke-width=".6"/>${marks}`
            + `<path d="M12 50 A38 38 0 0 1 88 50 Z" fill="currentColor" fill-opacity=".12" stroke="none"/><path d="M12 50 A38 38 0 0 0 88 50 Z" fill="currentColor" fill-opacity=".04" stroke="none"/>`
            + `<circle cx="50" cy="50" r="38" stroke-width=".6" opacity=".6"/><path d="M12 50H88" stroke-width=".6" opacity=".6"/>`
            + `<g fill="currentColor" stroke="none" opacity=".7">${stars}</g>`
            + num(50, 18, '12') + num(82, 50, '18') + num(50, 82, '0') + num(18, 50, '6')
            + `<path d="${rete}Z" stroke-width=".8" fill="currentColor" fill-opacity=".1"/>`
            + `<path d="M${moon}L${sun}" stroke-width="1.1"/>`
            + `<g stroke-width="1.1" stroke-linecap="round">${rays}</g><circle cx="${sun.split(' ')[0]}" cy="${sun.split(' ')[1]}" r="4.6" fill="currentColor" stroke="none"/>`
            + `<circle cx="${moon.split(' ')[0]}" cy="${moon.split(' ')[1]}" r="3.6" stroke-width="1.4"/>`
            + `<circle cx="50" cy="50" r="2.2" fill="currentColor" stroke="none"/></g></svg>`;
    }
    /** A digital clock: the hour and minute, with an hour strip of the day below. */
    function lcdEl(n) {
        const hh = String(n.time).slice(0, 2), mm = String(n.time).slice(3, 5);
        const hour = Math.floor(n.minute / 60);
        return h('div', { class: 'rpgc-lcd' },
            h('span', { class: 'digits', role: 'img', 'aria-label': `${n.time}${n.part ? ', ' + n.part : ''}` },
                h('span', { class: 'ghost', 'aria-hidden': 'true' }, '88:88'),
                h('span', { 'aria-hidden': 'true' }, hh, h('span', { class: 'col' }, ':'), mm)),
            h('div', { class: 'hours', 'aria-hidden': 'true' }, Array.from({ length: 24 }, (x, i) => h('i', { class: i < hour ? 'past' : i === hour ? 'now' : null }))));
    }
    const SKY_COLORS = { night: ['#060a1c', '#18224a'], dawn: ['#2a2652', '#f0a07c'], morning: ['#4f97de', '#c4e3f7'], noon: ['#2f86da', '#a3d2f4'],
        afternoon: ['#3a86d2', '#ecc98d'], evening: ['#e9824a', '#5a3d86'], dusk: ['#1c1c4a', '#c96a78'] };
    const SKY_WORD = { night: 'Night', dawn: 'Dawn', morning: 'Morning', noon: 'Midday', afternoon: 'Afternoon', evening: 'Evening', dusk: 'Dusk' };
    const WX_WORD = { clear: 'Clear', cloud: 'Cloudy', rain: 'Rain', storm: 'Storm', snow: 'Snow', blizzard: 'Blizzard', mist: 'Fog', wind: 'Windy' };
    const SEASON_WORD = { winter: 'Winter', spring: 'Spring', summer: 'Summer', autumn: 'Autumn' };
    const GROUND = { winter: ['#eef3f8', '#c9d6e4'], spring: ['#7cc06a', '#58994a'], summer: ['#4f9a3c', '#3b7d2c'], autumn: ['#c4762f', '#93501f'], none: ['#2c3140', '#1f2330'] };
    const SKY_STARS = [[6, 14], [13, 32], [19, 9], [27, 22], [34, 6], [41, 28], [48, 12], [55, 30], [62, 8], [69, 20], [76, 34], [83, 11], [90, 25], [96, 7]];
    function skyPart(min) { const hr = min / 60; return hr < 5 ? 'night' : hr < 7 ? 'dawn' : hr < 11 ? 'morning' : hr < 15 ? 'noon' : hr < 18 ? 'afternoon' : hr < 19.5 ? 'evening' : hr < 21 ? 'dusk' : 'night'; }
    function skyWeather(word) {
        const t = String(word || '').toLowerCase();
        if (!t || /indoor|inside/.test(t)) return '';
        return /blizzard/.test(t) ? 'blizzard' : /storm|thunder|lightning/.test(t) ? 'storm' : /snow|flurr|sleet/.test(t) ? 'snow' : /rain|drizzle|shower/.test(t) ? 'rain'
            : /fog|mist|haze/.test(t) ? 'mist' : /wind|gale|breeze|gust/.test(t) ? 'wind' : /cloud|overcast|grey|gray/.test(t) ? 'cloud' : /clear|sun|bright|fair/.test(t) ? 'clear' : '';
    }
    function weatherWordNow() {
        const b = state.data && state.data.infoBox;
        const w = isObj(b) ? b.weather : null;
        return isObj(w) ? (plain(w.forecast) || '') : (plain(w) || '');
    }
    /** The little window above the clock: the sky of the hour, and with "full" the weather and the season on the ground. */
    function renderScene(n) {
        const s = S() || {};
        const mode = s.uiDialSky === 'off' || s.uiDialSky === 'full' ? s.uiDialSky : 'time';
        if (mode === 'off') return null;
        const part = skyPart(n.minute);
        const full = mode === 'full';
        const wx = full ? skyWeather(n.weather || weatherWordNow()) : '';
        const season = full && SEASON_WORD[n.season] ? n.season : 'none';
        const words = [SKY_WORD[part], season !== 'none' ? SEASON_WORD[season] : '', wx ? WX_WORD[wx] : ''].filter(Boolean);
        const box = h('div', { class: `rpgc-scene ${part}${season !== 'none' ? ' ' + season : ''}${wx ? ' ' + wx : ''}${wx === 'storm' || wx === 'rain' ? ' dark' : ''}`, role: 'img', 'aria-label': words.join(', ') });
        box.style.setProperty('--sky-a', SKY_COLORS[part][0]);
        box.style.setProperty('--sky-b', SKY_COLORS[part][1]);
        const put = (cls, style) => { const el = h('i', { class: cls }); Object.assign(el.style, style); box.appendChild(el); return el; };
        if (part === 'night' || part === 'dusk' || part === 'dawn') SKY_STARS.forEach(([x, y], i) => { if (part !== 'night' && i % 3) return; put('star', { left: x + '%', top: y + '%', animationDelay: (i * 0.37).toFixed(2) + 's' }); });
        const day = n.minute >= 360 && n.minute < 1080;
        const t = day ? (n.minute - 360) / 720 : ((((n.minute - 1080) % 1440) + 1440) % 1440) / 720;
        put('orb ' + (day ? 'sun' : 'moon') + (/^(cloud|rain|storm|snow|blizzard|mist)$/.test(wx) ? ' dim' : ''), { left: (5 + t * 90).toFixed(1) + '%', top: (66 - Math.sin(Math.PI * t) * 48).toFixed(1) + '%' });
        if (/^(cloud|rain|storm|snow|blizzard)$/.test(wx)) [[8, 14, 46], [38, 8, 58], [66, 18, 40]].forEach(([x, y, w], i) => put('cloud', { left: x + '%', top: y + '%', width: w + 'px', animationDelay: (-i * 13) + 's' }));
        if (wx === 'rain' || wx === 'storm') for (let i = 0; i < 26; i++) put('drop', { left: ((i * 37) % 100) + '%', animationDelay: '-' + ((i * 0.13) % 0.7).toFixed(2) + 's' });
        if (wx === 'snow' || wx === 'blizzard') for (let i = 0; i < (wx === 'blizzard' ? 40 : 22); i++) put('flake', { left: ((i * 41) % 100) + '%', animationDelay: '-' + ((i * 0.29) % 4).toFixed(2) + 's' });
        if (wx === 'storm') put('flash', {});
        if (wx === 'mist') [30, 52].forEach((y, i) => put('mist', { top: y + '%', animationDelay: (-i * 4) + 's' }));
        if (wx === 'wind') [20, 42, 60].forEach((y, i) => put('gust', { top: y + '%', animationDelay: (i * 0.8) + 's' }));
        const g = GROUND[season];
        const wrap = h('span', null);
        wrap.innerHTML = `<svg class="ground" viewBox="0 0 300 22" preserveAspectRatio="none" aria-hidden="true"><path d="M0 14 C40 4 90 6 140 13 C190 20 240 6 300 10 L300 22 L0 22 Z" fill="${g[1]}"/><path d="M0 18 C60 10 120 12 170 17 C220 21 260 14 300 16 L300 22 L0 22 Z" fill="${g[0]}"/></svg>`;
        box.appendChild(wrap.firstChild);
        if (season === 'spring' || season === 'autumn') for (let i = 0; i < 9; i++) put('speck', { left: (4 + i * 11) + '%', bottom: (2 + (i % 3) * 3) + 'px', background: season === 'spring' ? (i % 2 ? '#f6b8cf' : '#fff') : (i % 2 ? '#e8a13a' : '#b8471f') });
        if (full && words.length > 1) box.appendChild(h('span', { class: 'tag', 'aria-hidden': 'true' }, words.slice(1).join(' · ')));
        return box;
    }

    // The day dial: a 24-hour face with noon at the top. The lit arc is the day (06:00 to 18:00); the hand is now.
    function renderNow() {
        const n = state.hms && state.hms.now;
        if (!n || S()?.uiDial === false) return null;
        const kind = dialFace();
        const ang = (n.minute / 1440) * 360 + 180, rad = (ang - 90) * Math.PI / 180;
        const px = (r) => (50 + r * Math.cos(rad)).toFixed(1), py = (r) => (50 + r * Math.sin(rad)).toFixed(1);
        const day = n.minute >= 360 && n.minute < 1080;
        let ticks = '';
        for (let i = 0; i < 24; i++) { const a = (i * 15 - 90) * Math.PI / 180, r1 = i % 6 === 0 ? 36 : i % 3 === 0 ? 39 : 41, r2 = 44; ticks += `<line x1="${(50 + r1 * Math.cos(a)).toFixed(1)}" y1="${(50 + r1 * Math.sin(a)).toFixed(1)}" x2="${(50 + r2 * Math.cos(a)).toFixed(1)}" y2="${(50 + r2 * Math.sin(a)).toFixed(1)}" stroke="currentColor" stroke-width="${i % 6 === 0 ? 1.6 : 0.8}" opacity="${i % 6 === 0 ? 0.9 : 0.45}"/>`; }
        const svg = `<svg viewBox="0 0 100 100" role="img" aria-label="${n.time}${n.part ? ', ' + String(n.part).replace(/[^\w ,.'-]/g, '') : ''}"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".5"/>`
            + `<path d="M 6 50 A 44 44 0 0 1 94 50" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" opacity=".85"/>`
            + `<path d="M 94 50 A 44 44 0 0 1 6 50" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 4" opacity=".4"/>${ticks}`
            + `<circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" stroke-width=".7" opacity=".35"/>`
            + `<line x1="50" y1="50" x2="${px(31)}" y2="${py(31)}" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
            + (day ? `<circle cx="${px(31)}" cy="${py(31)}" r="5.5" fill="currentColor"/>` : `<circle cx="${px(31)}" cy="${py(31)}" r="5" fill="none" stroke="currentColor" stroke-width="2"/>`)
            + `<circle cx="50" cy="50" r="3" fill="currentColor"/></svg>`;
        const face = h('div', { class: 'face' + (kind === 'astrolabe' ? ' astro' : '') + ' ' + kind });
        const label = `${n.time}${n.part ? ', ' + String(n.part).replace(/[^\w ,.'-]/g, '') : ''}`;
        if (kind === 'digital') face.appendChild(lcdEl(n));
        else face.innerHTML = kind === 'astrolabe' ? astroSvg(n, label) : kind === 'wall' ? wallSvg(n, label) : kind === 'crystal' ? crystalSvg(n, label)
            : kind === 'sundial' ? sundialSvg(n, label) : kind === 'game' ? gameSvg(n, label) : kind === 'rune' ? runeSvg(n, label)
            : kind === 'bonfire' ? bonfireSvg(n, label) : kind === 'pixel' ? pixelSvg(n, label) : svg;
        const took = n.elapsed === null ? null : n.elapsed === 0 ? 'no time' : n.elapsed < 60 ? `${n.elapsed} min` : n.elapsed < 1440 ? `${Math.floor(n.elapsed / 60)} h${n.elapsed % 60 ? ` ${n.elapsed % 60} min` : ''}` : `${Math.floor(n.elapsed / 1440)} d${Math.floor((n.elapsed % 1440) / 60) ? ` ${Math.floor((n.elapsed % 1440) / 60)} h` : ''}`;
        const cell = (k, v) => (v === null || v === undefined || v === '' ? null : h('div', { class: 'cell' }, h('span', null, k), h('b', { title: String(v) }, String(v))));
        return h('div', { class: 'rpgc-dial ' + kind }, face,
            h('div', { class: 'read' },
                h('div', { class: 'big' }, h('b', null, n.time), n.part ? h('span', { class: 'rpgc-chip' }, n.part) : h('span', { class: 'rpgc-chip' }, day ? 'Day' : 'Night')),
                cell('Day', n.day), cell('Date', n.date), cell('Last reply took', took), weatherReport(n)), renderScene(n), state.wxOpen ? weatherDetails(n) : null);
    }

    function topBar() {
        const s = S();
        const mode = !s ? '' : !s.enabled ? 'Paused' : s.generationMode === 'separate' ? 'Separate mode' : 'Together mode';
        const st = state.busy && (!state.status || state.status.kind !== 'busy')
            ? { kind: 'busy', text: 'Generating trackers with a separate call…' }
            : state.status;
        const bar = h('div', { class: 'rpgc-top' },
            h('span', { class: 'rpgc-mode' }, mode),
            costChip(),
            state.view === 'trackers' && state.busy
                ? h('button', { class: 'rpgc-btn', onclick: cancelRefresh }, 'Cancel')
                : null,
            state.view === 'trackers' && !state.busy && !state.sandbox      // the test zone writes its own turns
                ? h('button', { class: 'rpgc-btn', title: 'Generate trackers for the latest reply with a separate call', disabled: !state.chatId || !s?.enabled ? true : null, onclick: requestRefresh }, 'Refresh')
                : null,
            s ? (() => {
                const pm = h('select', { class: 'rpgc-panelsel', 'aria-label': 'Where the panel lives', title: 'Where the panel lives', onchange: (e) => setPanelMode(e.target.value) },
                    h('option', { value: 'drawer' }, 'Drawer'), h('option', { value: 'float' }, 'Floating'), h('option', { value: 'popout' }, 'Own window'), h('option', { value: 'wide' }, 'Wide window'));
                pm.value = panelMode();
                return pm;
            })() : null,
            wideOn() || (S()?.uiTestZone === false && !state.sandbox) ? null : h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'sandbox' ? 'true' : 'false', title: state.sandbox ? 'Back to your chat' : 'Try everything without a chat',
                onclick: () => (state.sandbox ? leaveSandbox() : enterSandbox())
            }, state.sandbox ? 'Leave test zone' : 'Test zone'),
            wideOn() ? null : h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'guide' ? 'true' : 'false', title: 'How everything works: the bot, the preset and this panel',
                onclick: () => { state.view = state.view === 'guide' ? (state.sandbox ? 'sandbox' : 'trackers') : 'guide'; render(); }
            }, state.view === 'guide' ? 'Close the guide' : 'Guide'),
            wideOn() ? null : h('button', {
                class: 'rpgc-btn', 'aria-pressed': state.view === 'settings' ? 'true' : 'false',
                onclick: () => { state.view = state.view === 'settings' ? (state.sandbox ? 'sandbox' : 'trackers') : 'settings'; render(); }
            }, state.view === 'settings' ? (state.sandbox ? 'Back to the test zone' : 'Back to trackers') : 'Settings'));
        if (!st || !st.text || !state.chatId) return bar;
        const wrap = document.createDocumentFragment();
        wrap.appendChild(bar);
        wrap.appendChild(h('div', { class: 'rpgc-status ' + (st.kind || ''), role: 'status' }, st.text));
        return wrap;
    }

    /** 2.5: what the extension adds to each reply, on top of the bot and the preset: a chip with the total, and the parts on a press. */
    const COST_COL = ['#7c8cff', '#3fb8a4', '#e0a84a', '#d46a9a', '#6fae4f', '#c77b52', '#8e7cc3', '#4f97c7', '#b3a24a', '#9a9ab0'];
    function costChip() {
        const s = S();
        if (!s || !s.enabled || state.sandbox || !state.chatId || state.view === 'settings' && !wideOn()) return null;
        const c = state.cost;
        const fmt = (n) => Number(n || 0).toLocaleString('en-US');
        const label = c ? `~${fmt(c.total)}` : '~?';
        const chip = h('button', { type: 'button', class: 'rpgc-costchip' + (state.costOpen ? ' on' : ''), 'aria-expanded': state.costOpen ? 'true' : 'false',
            title: 'What RPG Companion adds to each reply, on top of your bot and preset (estimated tokens). Press for the parts.',
            onclick: () => { state.costOpen = !state.costOpen; render(); } },
            h('span', { class: 'ico', 'aria-hidden': 'true' }, '\u2699'), h('b', null, label), h('span', { class: 'unit' }, 'tokens'));
        if (!state.costOpen) return h('span', { class: 'rpgc-costwrap' }, chip);
        let body;
        if (!c) body = [h('p', { class: 'rpgc-note' }, 'Measured on the next reply. Send a message, and the parts show here.')];
        else {
            const parts = (c.parts || []).slice().sort((a, b) => b.tokens - a.tokens);
            const all = parts.concat(c.out ? [{ key: 'out', name: 'The hidden block the model writes back', tokens: c.out, whereText: 'written by the model' }] : []);
            const sum = Math.max(1, all.reduce((a, x) => a + x.tokens, 0));
            const bar = h('div', { class: 'bar', role: 'img', 'aria-label': all.map(x => `${x.name} ${x.tokens}`).join(', ') },
                all.map((x, i) => { const seg = h('i', { title: `${x.name}: ~${fmt(x.tokens)}` }); seg.style.width = (x.tokens / sum * 100).toFixed(2) + '%'; seg.style.background = COST_COL[i % COST_COL.length]; return seg; }));
            body = [h('div', { class: 'tot' }, h('b', null, `~${fmt(c.total)} tokens`), h('span', null, ' each reply, on top of what your bot and preset already send')), bar,
                h('div', { class: 'rows' }, all.map((x, i) => h('div', { class: 'row' }, h('i', { class: 'dot', style: `background:${COST_COL[i % COST_COL.length]}` }),
                    h('span', { class: 'n' }, x.name), h('span', { class: 'w' }, x.whereText || ''), h('b', null, `~${fmt(x.tokens)}`)))),
                h('div', { class: 'sum' }, h('span', null, `Added to the prompt: ~${fmt(c.input)}`), c.out !== null && c.out !== undefined ? h('span', null, `Written back: ~${fmt(c.out)}`) : null),
                c.separate ? h('p', { class: 'rpgc-note' }, 'Separate mode: the side-panel block comes from a second call after each reply, which also reads the recent chat.') : null,
                h('p', { class: 'rpgc-note' }, 'Only when used: ' + (c.side || []).join(' ')),
                h('p', { class: 'rpgc-note' }, `${c.kept ? 'Kept from the last reply before the reload' : 'Measured on the last reply'}${c.at ? ' at ' + new Date(c.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}. About four letters make a token. Switch parts off in Settings \u2192 Modules to save.`)];
        }
        const pop = h('div', { class: 'rpgc-costpop', role: 'dialog', 'aria-label': 'What the extension costs' },
            h('div', { class: 'hd' }, h('b', null, 'What this costs'), h('button', { type: 'button', class: 'x', 'aria-label': 'Close', onclick: () => { state.costOpen = false; render(); } }, '\u00D7')), ...body);
        return h('span', { class: 'rpgc-costwrap' }, chip, pop);
    }

    function renderTrackers() {
        const s = S();
        if (!s) return [h('p', { class: 'rpgc-note' }, 'Loading…')];
        const out = [topBar()];
        if (!state.chatId) {
            out.push(h('p', { class: 'rpgc-note' }, 'Open a chat to see its trackers.'));
            return out;
        }
        const ng = renderNewGame();
        state.wideHms = false;
        if (hmsOn()) { const r = renderHmsTrackers(); if (ng && wideShows('world')) r.splice(1, 0, ng); const oo = renderOoc(); if (oo) r.push(oo); return r; }
        if (ng) out.push(ng);
        const d = state.data;
        if (!d.userStats && !d.infoBox && !(d.characters && d.characters.length)) {
            out.push(h('p', { class: 'rpgc-note' }, s.generationMode === 'separate'
                ? 'No trackers yet. They fill in after the next reply, or press Refresh to generate them now.'
                : 'No trackers yet. They fill in with the next reply. You can also set starting values below.'));
        }
        const story = storyRow();
        if (story) out.push(story);
        const immEl = renderImmersive();
        if (immEl) out.push(immEl);
        const songEl = renderSong();
        if (songEl) out.push(songEl);
        if (s.showUserStats) out.push(renderUserStats());
        { const inj = renderInjuries(); if (inj) out.push(inj); }
        { const dnd = renderDnd(); if (dnd) out.push(dnd); }
        if (s.showInfoBox) out.push(renderInfoBox());
        for (const el of [renderPeopleAll(), renderPhone()]) if (el) out.push(el);
        if (s.showUserStats && s.showInventory) out.push(renderInventory());
        if (s.showUserStats && s.showQuests) out.push(renderQuests());
        out.push(renderChapter());
        return out;
    }

    function statBar(value, max) {
        const s = S();
        const num = Number(value);
        const pct = Number.isFinite(num) ? Math.max(0, Math.min(100, (num / (max || 100)) * 100)) : 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        fill.style.backgroundColor = mixColor(s.statBarColorLow, s.statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max || 100), 'aria-valuenow': String(Number.isFinite(num) ? num : 0) }, fill);
    }

    function renderUserStats() {
        const s = S();
        const cfg = s.trackerConfig.userStats;
        const u = state.data.userStats || {};
        const status = isObj(u.status) ? u.status : {};
        const numberMode = cfg.statsDisplayMode === 'number';

        const lvl = cfg.showLevel !== false ? h('span', { class: 'rpgc-lvl' },
            'Level',
            h('button', { class: 'rpgc-mini', 'aria-label': 'Lower level', onclick: () => { s.level = Math.max(1, (s.level || 1) - 1); saveSettings(); } }, '−'),
            h('b', null, String(s.level || 1)),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Raise level', onclick: () => { s.level = (s.level || 1) + 1; saveSettings(); } }, '+')) : null;

        const who = h('div', { class: 'rpgc-who' },
            cfg.statusSection?.enabled && cfg.statusSection.showMoodEmoji
                ? editable(plain(status.mood), (v) => { const st = us(); st.status = isObj(st.status) ? st.status : {}; st.status.mood = v; commit(); }, { class: 'rpgc-mood', placeholder: 'mood', label: 'Mood emoji' })
                : null,
            h('span', null, state.userName),
            cfg.statusSection?.enabled ? lockBtn(['status'], 'mood and status') : null,
            lvl);

        const statsEls = (cfg.customStats || []).filter(st => st && st.enabled && st.name).map(st => {
            const list = Array.isArray(u.stats) ? u.stats : [];
            const found = list.find(x => x && (x.id === st.id || String(x.name).toLowerCase() === String(st.name).toLowerCase()));
            const max = numberMode ? (st.maxValue || 100) : 100;
            const val = found ? found.value : '';
            return h('div', { class: 'rpgc-stat' },
                h('span', { class: 'rpgc-stat-name', title: st.name }, lockBtn(['stats', st.id], st.name), st.name),
                statBar(val, max),
                h('span', { class: 'rpgc-stat-val' },
                    editable(val === '' ? '' : String(val), (v) => {
                        const n = Number(v);
                        if (!Number.isFinite(n)) { render(); return; }
                        const target = us();
                        if (!Array.isArray(target.stats)) target.stats = [];
                        const ex = target.stats.find(x => x && (x.id === st.id || String(x.name).toLowerCase() === String(st.name).toLowerCase()));
                        if (ex) ex.value = n; else target.stats.push({ id: st.id, name: st.name, value: n });
                        commit();
                    }, { placeholder: '–', label: `${st.name} value` }),
                    numberMode ? `/${max}` : '%'));
        });

        const statusEls = [];
        if (cfg.statusSection?.enabled) {
            for (const field of cfg.statusSection.customFields || []) {
                const key = toFieldKey(String(field).toLowerCase());
                statusEls.push(h('span', { class: 'k' }, field),
                    editable(plain(status[key]), (v) => { const st = us(); st.status = isObj(st.status) ? st.status : {}; st.status[key] = v; commit(); }, { label: field }));
            }
        }

        let skillsEl = null;
        if (cfg.skillsSection?.enabled) {
            const skills = Array.isArray(u.skills) ? u.skills : [];
            skillsEl = h('div', null,
                h('h4', null, cfg.skillsSection.label || 'Skills'),
                listEditor(skills.map(plain), (arr) => { us().skills = arr.map(name => ({ name })); commit(); }, 'Add a skill', (t) => ['skills', lockKey(t)]));
        }

        const attrsEl = null, diceEl = null;   // ability scores and the roller live in the D&D card now

        return section('stats', 'Your stats', state.open, null,
            who,
            ...statsEls,
            statusEls.length ? h('div', { class: 'rpgc-kv' }, ...statusEls) : null,
            skillsEl,
            attrsEl,
            diceEl);
    }

    function listEditor(items, onChange, addLabel, lockPathFor) {
        const list = h('ul', { class: 'rpgc-list' }, items.map((txt, i) => h('li', null,
            lockPathFor ? lockBtn(lockPathFor(txt), txt) : null,
            h('span', { class: 'grow' }, editable(txt, (v) => { const next = items.slice(); if (v) next[i] = v; else next.splice(i, 1); onChange(next); }, { label: 'Edit entry' })),
            h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${txt}`, onclick: () => { const next = items.slice(); next.splice(i, 1); onChange(next); } }, '✕'))));
        const input = h('input', { type: 'text', placeholder: addLabel, 'aria-label': addLabel });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; onChange([...items, v]); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        return h('div', { class: 'rpgc-set' }, list, h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
    }

    function renderInfoBox() {
        const w = S().trackerConfig.infoBox.widgets;
        const d = state.data.infoBox || {};
        const cells = [];
        const setField = (key, sub, v) => { const b = ib(); b[key] = isObj(b[key]) ? b[key] : {}; b[key][sub] = v; commit(); };

        if (w.date?.enabled) cells.push(h('div', { class: 'cell wide' }, sceneLbl('Date', 'date'), editable(plain(d.date), v => setField('date', 'value', v), { label: 'Date' })));
        if (w.time?.enabled) {
            const t = isObj(d.time) ? d.time : {};
            cells.push(h('div', { class: 'cell' }, sceneLbl('Time', 'time'),
                h('span', null, editable(t.start ?? plain(d.time), v => setField('time', 'start', v), { label: 'Time start' }), ' – ', editable(t.end ?? '', v => setField('time', 'end', v), { label: 'Time end' }))));
        }
        if (w.temperature?.enabled) {
            const t = isObj(d.temperature) ? d.temperature : { value: d.temperature };
            cells.push(h('div', { class: 'cell' }, sceneLbl('Temperature', 'temperature'),
                h('span', null, editable(t.value === undefined ? '' : String(t.value), v => { const n = Number(v); setField('temperature', 'value', Number.isFinite(n) ? n : v); }, { label: 'Temperature' }), `°${t.unit || w.temperature.unit || 'C'}`)));
        }
        if (w.weather?.enabled) {
            const wt = isObj(d.weather) ? d.weather : { forecast: d.weather };
            cells.push(h('div', { class: 'cell wide' }, sceneLbl('Weather', 'weather'),
                h('span', null, editable(wt.emoji ?? '', v => setField('weather', 'emoji', v), { class: 'weather', placeholder: 'sky', label: 'Weather emoji' }), ' ', editable(plain(wt.forecast), v => setField('weather', 'forecast', v), { label: 'Forecast' }))));
        }
        if (w.location?.enabled) cells.push(h('div', { class: 'cell wide' }, sceneLbl('Location', 'location'), editable(plain(d.location), v => setField('location', 'value', v), { label: 'Location' })));

        let events = null;
        if (w.recentEvents?.enabled) {
            const list = Array.isArray(d.recentEvents) ? d.recentEvents.map(plain) : (d.recentEvents ? [plain(d.recentEvents)] : []);
            events = h('div', null, h('h4', null, lockBtn(['infoBox', 'recentEvents'], 'recent events'), 'Recent events'), listEditor(list, (arr) => { ib().recentEvents = arr; commit(); }, 'Add an event'));
        }
        return section('scene', 'Scene', state.open, plain(d.location) || null, h('div', { class: 'rpgc-scene' }, ...cells), events);
    }

    function charCard(c, idx, opt = {}) {
        const pc = S().trackerConfig.presentCharacters;
        const fields = (pc.customFields || []).filter(f => f && f.enabled && f.name);
        const charStats = pc.characterStats?.enabled ? (pc.characterStats.customStats || []).filter(x => x && x.enabled && x.name) : [];
        const emojis = pc.relationshipEmojis || {};

        const cName = plain(c.name);
        const edit = (fn) => { const arr = chars(); fn(arr[idx]); commit(); };
        const relStatus = plain(c.relationship ?? c.Relationship);
        const details = isObj(c.details) ? c.details : {};
        const detailEls = [];
        const shownKeys = new Set();
        for (const f of fields) {
            const key = toSnakeCase(f.name);
            shownKeys.add(key);
            detailEls.push(h('span', { class: 'k' }, f.name), editable(plain(details[key]), v => edit(ch => { ch.details = isObj(ch.details) ? ch.details : {}; ch.details[key] = v; }), { label: f.name }));
        }
        for (const [k, v] of Object.entries(details)) {
            if (shownKeys.has(k)) continue;
            detailEls.push(h('span', { class: 'k' }, labelOf(k)), editable(plain(v), nv => edit(ch => { ch.details[k] = nv; }), { label: labelOf(k) }));
        }
        const statEls = charStats.map(st => {
            const arr = Array.isArray(c.stats) ? c.stats : [];
            const found = arr.find(x => x && String(x.name).toLowerCase() === st.name.toLowerCase());
            const val = found ? found.value : '';
            return h('div', { class: 'rpgc-stat' }, h('span', { class: 'rpgc-stat-name' }, st.name), statBar(val, 100),
                h('span', { class: 'rpgc-stat-val' }, editable(val === '' ? '' : String(val), v => {
                    const n = Number(v);
                    if (!Number.isFinite(n)) { render(); return; }
                    edit(ch => {
                        if (!Array.isArray(ch.stats)) ch.stats = [];
                        const ex = ch.stats.find(x => x && String(x.name).toLowerCase() === st.name.toLowerCase());
                        if (ex) ex.value = n; else ch.stats.push({ name: st.name, value: n });
                    });
                }, { placeholder: '–', label: `${plain(c.name)} ${st.name}` }), '%'));
        });
        const thought = plain(c.thoughts);
            return h('div', { class: 'rpgc-char' + (opt.merged ? ' sub' : '') },
            opt.merged ? h('div', { class: 'rpgc-psub' }, h('span', { class: 'gt' }, 'In the scene'), avatarControls(cName), lockBtn(['characters', lockKey(plain(c.name))], plain(c.name)),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${plain(c.name) || 'character'} from the scene`, onclick: () => { chars().splice(idx, 1); commit(); } }, '\u2715')) : h('div', { class: 'rpgc-char-head' },
                avatarImg(cName) || editable(plain(c.emoji), v => edit(ch => { ch.emoji = v; }), { class: 'emo', placeholder: 'icon', label: 'Character emoji' }),
                editable(plain(c.name), v => edit(ch => { ch.name = v; }), { class: 'name', placeholder: 'Name', label: 'Character name' }),
                pc.relationships?.enabled !== false ? h('span', { class: 'rpgc-rel' },
                    emojis[relStatus] ? h('span', { 'aria-hidden': 'true' }, emojis[relStatus]) : null,
                    editable(relStatus, v => edit(ch => { ch.relationship = { status: v }; }), { placeholder: 'Relationship', label: 'Relationship' })) : null,
                avatarControls(cName),
                relFor(cName) && relFor(cName).standing ? standingChip(relFor(cName)) : null,
                partyOf() && cName ? (inParty(cName)
                    ? h('span', { class: 'rpgc-chip here', title: 'In your party' }, 'party')
                    : h('button', { class: 'rpgc-avatar-btn', title: `Add ${cName} to the party`, onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'add', name: cName }) }, '+ Party')) : null,
                lockBtn(['characters', lockKey(plain(c.name))], plain(c.name)),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${plain(c.name) || 'character'}`, onclick: () => { chars().splice(idx, 1); commit(); } }, '✕')),
                detailEls.length ? h('div', { class: 'rpgc-kv' }, ...detailEls) : null,
            ...statEls,
            pc.thoughts?.enabled ? h('div', { class: 'rpgc-thought' }, editable(thought, v => edit(ch => { ch.thoughts = { content: v }; }), { placeholder: pc.thoughts.name || 'Thoughts', label: 'Thoughts', multiline: true })) : null);
    }

    function itemList(items, onChange, withQty, addLabel, lockPathFor) {
        const listEl = h('ul', { class: 'rpgc-list' }, items.map((it, i) => {
            const name = plain(it.name ?? it);
            return h('li', null,
                lockPathFor ? lockBtn(lockPathFor(name), name) : null,
                h('span', { class: 'grow' }, editable(name, v => { const next = clone(items); if (v) next[i] = { ...(isObj(next[i]) ? next[i] : {}), name: v }; else next.splice(i, 1); onChange(next); }, { label: 'Item name' })),
                withQty ? h('span', { class: 'qty' }, '×', editable(it.quantity === undefined ? '1' : String(it.quantity), v => { const n = parseInt(v); const next = clone(items); next[i] = { ...(isObj(next[i]) ? next[i] : { name }), quantity: Number.isFinite(n) ? n : 1 }; onChange(next); }, { label: `${name} quantity` })) : null,
                it.location ? h('span', { class: 'qty' }, it.location) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${name}`, onclick: () => { const next = clone(items); next.splice(i, 1); onChange(next); } }, '✕'));
        }));
        const input = h('input', { type: 'text', placeholder: addLabel, 'aria-label': addLabel });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; onChange([...clone(items), withQty ? { name: v, quantity: 1 } : { name: v }]); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        return [items.length ? listEl : h('p', { class: 'rpgc-note' }, 'Empty.'), h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add'))];
    }

    function renderInventory() {
        const cur = state.data.userStats?.inventory || {};
        const arr = (v) => Array.isArray(v) ? v : [];
        const tabs = [['onPerson', 'On person'], ['clothing', 'Clothing'], ['stored', 'Stored'], ['assets', 'Assets']];
        const tabBar = h('div', { class: 'rpgc-tabs', role: 'tablist' }, tabs.map(([k, label]) => h('button', {
            class: 'rpgc-btn' + (state.invTab === k ? ' on' : ''), role: 'tab', 'aria-selected': state.invTab === k ? 'true' : 'false',
            onclick: () => { state.invTab = k; render(); }
        }, label)));

        let body;
        if (state.invTab === 'stored') {
            const stored = isObj(cur.stored) ? cur.stored : {};
            const blocks = Object.entries(stored).map(([loc, items]) => h('div', null,
                h('div', { class: 'rpgc-loc' }, editable(loc, v => { const i = inv(); if (!v || v === loc) return render(); i.stored[v] = i.stored[loc]; delete i.stored[loc]; commit(); }, { label: 'Storage location' }),
                    h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${loc}`, onclick: () => { delete inv().stored[loc]; commit(); } }, '✕')),
                ...itemList(arr(items), next => { inv().stored[loc] = next; commit(); }, true, `Add to ${loc}`, (n) => ['inventory', 'stored', loc, lockKey(n)])));
            const locInput = h('input', { type: 'text', placeholder: 'New storage location', 'aria-label': 'New storage location' });
            const addLoc = () => { const v = locInput.value.trim(); if (!v) return; const i = inv(); if (!i.stored[v]) i.stored[v] = []; commit(); };
            locInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); addLoc(); } });
            body = h('div', { class: 'rpgc-set' }, blocks.length ? blocks : h('p', { class: 'rpgc-note' }, 'No storage locations.'), h('div', { class: 'rpgc-add' }, locInput, h('button', { class: 'rpgc-btn', onclick: addLoc }, 'Add location')));
        } else {
            const key = state.invTab;
            body = h('div', { class: 'rpgc-set' }, ...itemList(arr(cur[key]), next => { inv()[key] = next; commit(); }, key === 'onPerson', key === 'clothing' ? 'Add clothing' : key === 'assets' ? 'Add an asset' : 'Add an item', (n) => ['inventory', key, lockKey(n)]));
        }
        return section('inv', 'Inventory', state.open, null, tabBar, body);
    }

    function renderQuests() {
        const q = state.data.userStats?.quests || {};
        const main = plain(q.main);
        const optional = Array.isArray(q.optional) ? q.optional.map(plain) : [];
        const quests = () => { const u = us(); u.quests = isObj(u.quests) ? u.quests : {}; return u.quests; };
        return section('quests', 'Quests', state.open, null,
            ...renderPlotObjectives(),
            h('div', null, h('h4', null, lockBtn(['quests', 'main'], 'main quest'), 'Main quest'), h('div', { class: 'rpgc-quest-main' }, editable(main === 'None' ? '' : main, v => { quests().main = { title: v || 'None' }; commit(); }, { placeholder: 'No main quest', label: 'Main quest' }))),
            h('div', null, h('h4', null, 'Optional quests'), listEditor(optional, arr => { quests().optional = arr.map(title => ({ title })); commit(); }, 'Add a quest', (t) => ['quests', 'optional', lockKey(t)])));
    }

    // ─────────── settings view ───────────

    // Which connection fights, the tracker, chapter summaries, portrait prompts and the Test zone run on.
    function requestConnections() {
        state.connReq = true;
        send({ type: 'list_connections' });
    }
    function connectionPicker(s) {
        if (!state.connections && !state.connReq) requestConnections();
        const c = state.connections;
        const cur = typeof s.sideConnection === 'string' && s.sideConnection ? s.sideConnection : 'chat';
        const opts = [['chat', 'Same as my chat (recommended)'], ['default', 'Lumiverse’s default connection']];
        if (c && c.available) {
            for (const x of c.list) opts.push([x.id, `${x.name}${x.model ? ' — ' + x.model : ''}${x.isDefault ? ' (default)' : ''}`]);
        }
        if (cur !== 'chat' && cur !== 'default' && !opts.some(o => o[0] === cur)) {
            opts.push([cur, c ? 'A connection that no longer exists' : 'Loading…']);
        }
        const sel = h('select', { 'aria-label': 'Connection for side calls', onchange: (e) => { s.sideConnection = e.target.value; saveSettings(); } },
            opts.map(([v, t]) => h('option', { value: v }, t)));
        sel.value = cur;
        const reload = h('button', { class: 'rpgc-btn', title: 'Reload the list of connections', 'aria-label': 'Reload the list of connections', onclick: requestConnections }, '↻');
        let note;
        if (c && !c.available) note = 'This Lumiverse version cannot list connections, so only the first two choices are offered.';
        else if (c && !c.list.length) note = 'You have no connections yet. Add one in Lumiverse’s Connections panel.';
        else if (cur === 'chat') note = 'Fights, the tracker, chapter summaries, portrait prompts and the Test zone use the connection your own replies in that chat use. Before your first reply it follows the connection you have selected in Lumiverse, then Lumiverse’s default, then your first connection.';
        else if (cur === 'default') note = 'Lumiverse’s default connection. With no default set, your first connection is used instead.';
        else note = 'Every side call uses this connection, whatever your chat runs on. Handy for a cheaper or faster model.';
        return h('div', null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Use'), sel, reload),
            h('p', { class: 'rpgc-note' }, note));
    }

    function toggle(label, get, set, note) {
        const cb = h('input', { type: 'checkbox', checked: get(), onchange: (e) => { set(e.target.checked); saveSettings(); } });
        return h('div', { class: 'rpgc-row' }, h('label', null, cb, label), note ? h('span', { class: 'rpgc-note' }, note) : null);
    }
    function textInput(label, get, set, attrs = {}) {
        const inp = h('input', { type: 'text', value: get() ?? '', 'aria-label': label, ...attrs, onchange: (e) => { set(e.target.value); saveSettings(); } });
        return h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, label), inp);
    }
    function promptArea(label, key, fallbackNote) {
        const s = S();
        const ta = h('textarea', { value: s[key] || '', placeholder: fallbackNote, 'aria-label': label, onchange: (e) => { s[key] = e.target.value; saveSettings(false); } });
        return h('div', { class: 'rpgc-set' }, h('h4', null, label), ta);
    }

    function renderSettings() {
        const s = S();
        if (!s) return [topBar(), h('p', { class: 'rpgc-note' }, 'Loading…')];
        const cfg = s.trackerConfig;
        const us_ = cfg.userStats;
        const pc = cfg.presentCharacters;
        const w = cfg.infoBox.widgets;

        const modeSel = h('select', { 'aria-label': 'Generation mode', onchange: (e) => { s.generationMode = e.target.value; saveSettings(); } },
            h('option', { value: 'together' }, 'Together (trackers come with the reply)'),
            h('option', { value: 'separate' }, 'Separate (extra call after the reply)'));
        modeSel.value = s.generationMode;

        const general = section('s-general', 'General', state.open, null,
            toggle('Enabled', () => s.enabled, v => { s.enabled = v; }, 'Off: the extension adds nothing to your prompts and runs nothing on its own. The panel and your saved data stay readable.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Mode'), modeSel),
            s.generationMode === 'separate' ? toggle('Update automatically after each reply', () => s.autoUpdate, v => { s.autoUpdate = v; }, 'Separate mode: run the tracker call by itself after every reply. Off: only when you press Refresh.') : null,
            s.generationMode === 'separate' ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Messages of history'),
                h('input', { type: 'number', min: '1', max: '50', value: String(s.updateDepth), 'aria-label': 'Messages of history', onchange: (e) => { s.updateDepth = Math.max(1, parseInt(e.target.value) || 4); saveSettings(); } })) : null,
            toggle('Narrator mode', () => s.narratorMode, v => { s.narratorMode = v; }, 'Treat the card as a narrator and infer characters from the story.'),
            h('h4', null, 'Connection for side calls'),
            connectionPicker(s),
            h('h4', null, 'Separate tracker calls (Separate mode and Refresh)'),
            toggle('Let the model think', () => s.trackerThinking, v => { s.trackerThinking = v; }, 'Off is much faster with reasoning models.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Give up after (s)'),
                h('input', { type: 'number', min: '20', max: '1800', value: String(s.trackerTimeoutSec || 180), 'aria-label': 'Give up after (seconds)', onchange: (e) => { s.trackerTimeoutSec = Math.max(20, parseInt(e.target.value) || 180); saveSettings(); } })));

        const panels = section('s-panels', 'Panels', state.open, null,
            // In HMS mode the HUD replaces Your stats, Scene and Inventory, but the other
            // three toggles are still live there — so they stay on show.
            hmsOn() ? null : toggle('Your stats', () => s.showUserStats, v => { s.showUserStats = v; }, 'Your own trackers: health, needs, mood, conditions.'),
            hmsOn() ? null : toggle('Scene', () => s.showInfoBox, v => { s.showInfoBox = v; }, 'Date, time, weather, place and what just happened.'),
            toggle('Present characters', () => s.showCharacterThoughts, v => { s.showCharacterThoughts = v; },
                hmsOn() ? 'Off also stops the extension asking the model for them.' : undefined),
            hmsOn() ? null : toggle('Inventory', () => s.showInventory, v => { s.showInventory = v; }, 'What you carry, wear and own.'),
            toggle('Quests', () => s.showQuests, v => { s.showQuests = v; }, 'Your main and side quests.'),
            toggle('Dice', () => s.showDiceDisplay, v => { s.showDiceDisplay = v; }, 'The roller. It lives in the D&D card.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Bar colors'),
                h('label', null, 'Low', h('input', { type: 'color', value: s.statBarColorLow, 'aria-label': 'Low value color', onchange: (e) => { s.statBarColorLow = e.target.value; saveSettings(); } })),
                h('label', null, 'High', h('input', { type: 'color', value: s.statBarColorHigh, 'aria-label': 'High value color', onchange: (e) => { s.statBarColorHigh = e.target.value; saveSettings(); } }))));

        const extras = section('s-extras', 'Story extras', state.open, null,
            toggle('Immersive HTML', () => s.enableHtmlPrompt, v => { s.enableHtmlPrompt = v; }, 'Lets the model add small visual touches in HTML \u2014 a letter, a sign, a screen \u2014 inside its prose.'),
            toggle('Dialogue coloring', () => s.enableDialogueColoring, v => { s.enableDialogueColoring = v; }, 'Asks the model to give each speaker\u2019s dialogue its own colour.'),
            toggle('Deception tags', () => s.enableDeceptionSystem, v => { s.enableDeceptionSystem = v; }, 'Lies are marked for the model and hidden from you.'),
            toggle('Omniscience filter', () => s.enableOmniscienceFilter, v => { s.enableOmniscienceFilter = v; }, 'Keeps characters from acting on what they could not know: someone else\u2019s thoughts, events they did not see.'),
            toggle('Choose your own adventure', () => s.enableCYOA, v => { s.enableCYOA = v; }, hmsOn() ? 'Off in HMS chats: the engines forbid ending on options (World, not GM). Still applies in other chats.' : undefined),
            toggle('Song suggestions', () => s.enableSpotifyMusic, v => { s.enableSpotifyMusic = v; }, 'Tags are hidden; the music player is not ported yet.'));

        // stats editor
        const statRows = (us_.customStats || []).map((st, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: st.enabled, 'aria-label': `Track ${st.name}`, onchange: (e) => { st.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: st.name, 'aria-label': 'Stat name', onchange: (e) => { st.name = e.target.value.trim() || st.name; saveSettings(); } }),
            us_.statsDisplayMode === 'number' ? h('input', { type: 'number', class: 'num', value: String(st.maxValue || 100), 'aria-label': `${st.name} maximum`, onchange: (e) => { st.maxValue = Math.max(1, parseInt(e.target.value) || 100); saveSettings(); } }) : null,
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${st.name}`, onclick: () => { us_.customStats.splice(i, 1); saveSettings(); } }, '✕')));
        const dispSel = h('select', { 'aria-label': 'Stat display', onchange: (e) => { us_.statsDisplayMode = e.target.value; saveSettings(); } },
            h('option', { value: 'percentage' }, 'Percent'), h('option', { value: 'number' }, 'Number out of a maximum'));
        dispSel.value = us_.statsDisplayMode || 'percentage';
        const attrRows = (us_.rpgAttributes || []).map((a, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: a.enabled, 'aria-label': `Show ${a.name}`, onchange: (e) => { a.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: a.name, 'aria-label': 'Attribute name', onchange: (e) => { a.name = e.target.value.trim() || a.name; saveSettings(); } }),
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${a.name}`, onclick: () => { us_.rpgAttributes.splice(i, 1); saveSettings(); } }, '✕')));

        const statsCfg = section('s-stats', 'Your stats setup', state.open, null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Show values as'), dispSel),
            ...statRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { us_.customStats.push({ id: 'stat_' + Date.now().toString(36), name: 'New stat', enabled: true, maxValue: 100 }); saveSettings(); } }, 'Add stat')),
            h('h4', null, 'Status'),
            toggle('Track status', () => us_.statusSection.enabled, v => { us_.statusSection.enabled = v; }, 'Conditions such as Bleeding or Exhausted, as a line under your stats.'),
            toggle('Mood emoji', () => us_.statusSection.showMoodEmoji, v => { us_.statusSection.showMoodEmoji = v; }, 'An emoji for your current mood.'),
            textInput('Status fields', () => (us_.statusSection.customFields || []).join(', '), v => { us_.statusSection.customFields = v.split(',').map(x => x.trim()).filter(Boolean); }, { placeholder: 'Conditions, Hunger' }),
            h('h4', null, 'Skills'),
            toggle('Track skills', () => us_.skillsSection.enabled, v => { us_.skillsSection.enabled = v; }, 'Skills and how practised they are.'),
            textInput('Section name', () => us_.skillsSection.label, v => { us_.skillsSection.label = v || 'Skills'; }),
            textInput('Skill list', () => (us_.skillsSection.customFields || []).join(', '), v => { us_.skillsSection.customFields = v.split(',').map(x => x.trim()).filter(Boolean); }, { placeholder: 'Leave empty to let the model decide' }),
            h('h4', null, 'Attributes'),
            toggle('Show attributes', () => us_.showRPGAttributes !== false, v => { us_.showRPGAttributes = v; }, 'STR, DEX and the rest. You edit them in the D&D card.'),
            toggle('Show level', () => us_.showLevel !== false, v => { us_.showLevel = v; }, 'Your level, next to your attributes.'),
            toggle('Send attributes with every reply', () => us_.alwaysSendAttributes, v => { us_.alwaysSendAttributes = v; }, 'Otherwise only dice rolls are sent.'),
            ...attrRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { us_.rpgAttributes.push({ id: 'attr_' + Date.now().toString(36), name: 'NEW', enabled: true }); saveSettings(); } }, 'Add attribute')));

        const sceneCfg = section('s-scene', 'Scene setup', state.open, null,
            toggle('Date', () => w.date.enabled, v => { w.date.enabled = v; }, 'The in-story date.'),
            w.date.enabled ? textInput('Date format', () => w.date.format, v => { w.date.format = v || 'Weekday, Month, Year'; }) : null,
            toggle('Weather', () => w.weather.enabled, v => { w.weather.enabled = v; }, 'The weather in the scene.'),
            toggle('Temperature', () => w.temperature.enabled, v => { w.temperature.enabled = v; }, 'How warm or cold it is.'),
            w.temperature.enabled ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Unit'), (() => {
                const sel = h('select', { 'aria-label': 'Temperature unit', onchange: (e) => { w.temperature.unit = e.target.value; saveSettings(); } }, h('option', { value: 'C' }, 'Celsius'), h('option', { value: 'F' }, 'Fahrenheit'));
                sel.value = w.temperature.unit || 'C';
                return sel;
            })()) : null,
            toggle('Time', () => w.time.enabled, v => { w.time.enabled = v; }, 'The time of day.'),
            toggle('Location', () => w.location.enabled, v => { w.location.enabled = v; }, 'Where the scene is.'),
            toggle('Recent events', () => w.recentEvents.enabled, v => { w.recentEvents.enabled = v; }, 'One line on what just happened.'));

        const fieldRows = (pc.customFields || []).map((f, i) => h('div', { class: 'rpgc-cfg-item' },
            h('input', { type: 'checkbox', checked: f.enabled, 'aria-label': `Track ${f.name}`, onchange: (e) => { f.enabled = e.target.checked; saveSettings(); } }),
            h('input', { type: 'text', value: f.name, 'aria-label': 'Field name', onchange: (e) => { f.name = e.target.value.trim() || f.name; saveSettings(); } }),
            h('input', { type: 'text', value: f.description || '', placeholder: 'What the model should write', 'aria-label': 'Field description', onchange: (e) => { f.description = e.target.value; saveSettings(); } }),
            h('button', { class: 'rpgc-mini', 'aria-label': `Delete ${f.name}`, onclick: () => { pc.customFields.splice(i, 1); saveSettings(); } }, '✕')));
        const relText = (pc.relationshipFields || []).map(r => `${r}=${(pc.relationshipEmojis || {})[r] || ''}`).join(', ');
        const charsCfg = section('s-chars', 'Present characters setup', state.open, null,
            toggle('Relationships', () => pc.relationships?.enabled !== false, v => { pc.relationships = { ...(pc.relationships || {}), enabled: v }; }, 'A relationship label on each character in the scene.'),
            toggle('Let the model choose the wording', () => pc.relationshipFree !== false, v => { pc.relationshipFree = v; }, 'On: it writes the bond in its own words (best for HMS). Off: it must pick one of your categories.'),
            textInput(pc.relationshipFree !== false ? 'Example categories' : 'Categories', () => relText, v => {
                const fieldsOut = [], em = {};
                for (const part of v.split(',')) {
                    const [name, emoji] = part.split('=').map(x => (x || '').trim());
                    if (!name) continue;
                    fieldsOut.push(name);
                    if (emoji) em[name] = emoji;
                }
                pc.relationshipFields = fieldsOut;
                pc.relationshipEmojis = em;
            }, { placeholder: 'Family=🏡, Contracted spirit=🔗, Friend=⭐' }),
            h('h4', null, 'Detail fields'),
            ...fieldRows,
            h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { pc.customFields.push({ id: 'field_' + Date.now().toString(36), name: 'New field', enabled: true, description: '' }); saveSettings(); } }, 'Add field')),
            h('h4', null, 'Thoughts'),
            toggle('Track thoughts', () => pc.thoughts.enabled, v => { pc.thoughts.enabled = v; }, 'Each character\u2019s inner thoughts.'),
            textInput('Instruction', () => pc.thoughts.description, v => { pc.thoughts.description = v; }),
            h('h4', null, 'Character stats'),
            toggle('Track character stats', () => pc.characterStats.enabled, v => { pc.characterStats.enabled = v; }, 'Bars for each character in the scene, from the list below.'),
            textInput('Stat names', () => (pc.characterStats.customStats || []).filter(x => x.enabled).map(x => x.name).join(', '), v => {
                pc.characterStats.customStats = v.split(',').map(x => x.trim()).filter(Boolean).map(name => ({ id: toSnakeCase(name), name, enabled: true }));
            }, { placeholder: 'Health, Arousal' }));

        const prompts = section('s-prompts', 'Custom prompts', closedByDefault('s-prompts'), null,
            h('p', { class: 'rpgc-note' }, 'The words each feature sends. Leave a box empty to use the built-in words. The switches for these are in ', sectionLink('s-extras', 'Story extras')),
            promptArea('Tracker instructions ({userName} works here)', 'customTrackerInstructionsPrompt', 'Built-in instructions'),
            promptArea('Continue instruction (together mode)', 'customTrackerContinuationPrompt', 'Built-in instruction'),
            promptArea('Scene context note (separate mode)', 'customContextInstructionsPrompt', 'Built-in note'),
            promptArea('Narrator \u2014 words', 'customNarratorPrompt', 'Built-in narrator prompt'),
            promptArea('Immersive HTML \u2014 words', 'customHtmlPrompt', 'Built-in prompt'),
            promptArea('Dialogue coloring \u2014 words', 'customDialogueColoringPrompt', 'Built-in prompt'),
            promptArea('Deception \u2014 words', 'customDeceptionPrompt', 'Built-in prompt'),
            promptArea('Omniscience filter \u2014 words', 'customOmnisciencePrompt', 'Built-in prompt'),
            promptArea('Choose your own adventure \u2014 words', 'customCYOAPrompt', 'Built-in prompt'),
            promptArea('Song suggestions \u2014 words', 'customSpotifyPrompt', 'Built-in prompt'),
            promptArea('Plot twist ({{random::a::b}} picks one option)', 'customPlotRandomPrompt', 'Built-in plot twist prompt'),
            promptArea('Move the story', 'customPlotNaturalPrompt', 'Built-in prompt'),
            promptArea('Move the world (HMS, sent as your turn)', 'customWorldMovesPrompt', 'Built-in nudge'));
        prompts.dataset.openKey = 's-prompts'; prompts.addEventListener('toggle', () => { state.open['s-prompts'] = prompts.open; });

        const danger = section('s-reset', 'Reset', closedByDefault('s-reset'), null,
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn danger', disabled: !state.chatId ? true : null, onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear trackers for this chat?', message: 'Every saved tracker in this chat is removed. Messages stay as they are.', variant: 'danger', confirmLabel: 'Clear trackers' }) : { confirmed: window.confirm('Clear every saved tracker in this chat?') };
                    if (res?.confirmed) send({ type: 'clear_chat_trackers', chatId: state.chatId });
                } }, 'Clear this chat\'s trackers'),
                h('button', { class: 'rpgc-btn danger', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Reset settings?', message: 'All settings go back to defaults. Attributes and level are kept.', variant: 'danger', confirmLabel: 'Reset settings' }) : { confirmed: window.confirm('Reset all settings to defaults?') };
                    if (res?.confirmed) { clearTimeout(settingsTimer); settingsUnsent = null; settingsWait = 0; send({ type: 'reset_settings', chatId: state.chatId }); }
                } }, 'Reset settings')));
        danger.dataset.openKey = 's-reset'; danger.addEventListener('toggle', () => { state.open['s-reset'] = danger.open; });

        // 2.8: with no chat open, every box shows (the HMS ones were missing, so Minds, Gates and the rest could not be set up first)
        const list = hmsOn() || !state.chatId
            ? [renderStyleSettings(), renderLookSettings(), renderModulesSettings(), renderHmsSettings(), renderMapsSettings(), renderHmsSystemsSettings(), renderCharactersSettings(), renderMindsSettings(), renderGatesSettings(), renderHealthSettings(), renderMagicSettings(), renderQuestSettings(), renderChapterSettings(), renderChronicleSettings(), renderLoreSettings(), renderEngineSettings(), general, panels, renderDisplaySettings(), charsCfg, renderEncounterSettings(), renderDndSettings(), extras, renderPresetSettings(), prompts, renderHelpSettings(), danger]
            : [renderStyleSettings(), renderLookSettings(), renderModulesSettings(), renderHmsSettings(), renderMapsSettings(), renderSocialSettings(), renderHealthSettings(), renderQuestSettings(), renderChapterSettings(), renderChronicleSettings(), renderLoreSettings(), renderEngineSettings(), general, renderPresetSettings(), panels, renderDisplaySettings(), extras, statsCfg, sceneCfg, charsCfg, renderEncounterSettings(), renderDndSettings(), prompts, renderHelpSettings(), danger];
        return [topBar(), settingsHero(), settingsTabs(), ...settingsFilter(settingsTabbed(list.filter(Boolean)))];
    }
    /** 2.4: the top of Settings: a picture in the theme's colours, and a box that finds a switch. */
    // 2.8: Settings in tabs. "All" lists every box, as before; a tab shows only its own boxes. Finding a switch looks in every tab.
    const SET_TABS = [
        ['all', 'All', null],
        ['setup', 'Setup & Look', ['s-style', 's-look', 's-modules', 's-hms', 's-general', 's-panels', 's-display', 's-presets', 's-help']],
        ['world', 'World & Maps', ['s-maps', 's-quests', 's-extras', 's-scene']],
        ['people', 'People & Minds', ['s-hmssys', 's-characters', 's-minds', 's-gates', 's-chars', 's-stats']],
        ['body', 'Body & Health', ['s-health', 's-hmssys']],
        ['magic', 'Magic & Skills', ['s-magic']],
        ['fights', 'Fights & D&D', ['s-enc', 's-dnd']],
        ['memory', 'Memory & Chapters', ['s-chapters', 's-chronicle', 's-engine', 's-lore']],
        ['advanced', 'Advanced', ['s-prompts', 's-presets', 's-engine', 's-reset']]
    ];
    function setTabNow() { const t = S() && S().uiSetTab; return SET_TABS.some(([k]) => k === t) ? t : 'all'; }
    function settingsTabs() {
        const cur = String(state.setFind || '').trim() ? 'all' : setTabNow();
        return h('div', { class: 'rpgc-settabs', role: 'tablist', 'aria-label': 'Settings tabs' }, SET_TABS.map(([k, l]) => h('button', {
            type: 'button', role: 'tab', class: 'rpgc-settab' + (k === cur ? ' on' : ''), 'aria-selected': k === cur ? 'true' : 'false',
            onclick: () => { S().uiSetTab = k; state.setFind = ''; saveSettings(false); render(); }
        }, l)));
    }
    function settingsTabbed(list) {
        if (String(state.setFind || '').trim()) return list;
        const t = SET_TABS.find(([k]) => k === setTabNow());
        if (!t || !t[2]) return list;
        const want = new Set(t[2]);
        const keep = list.filter(el => !(el.matches && el.matches('details.rpgc-sec')) || want.has(el.dataset.openKey));
        return keep.length ? keep : [h('p', { class: 'rpgc-note' }, 'Nothing in this tab for this chat. These settings are for HMS chats: open one (or set HMS mode to Always, under HMS engine) to see them.')];
    }

    // 2.8: every map in one box: the Atlas, the floor plans (Ryah | Wireless), the room map and its bank, the building maps.
    function renderMapsSettings() {
        const s = S();
        if (!s.hmsSystems || typeof s.hmsSystems !== 'object') s.hmsSystems = {};
        const hs = s.hmsSystems;
        const pl = () => (hs.plans && typeof hs.plans === 'object' ? hs.plans : (hs.plans = {}));
        const tier = ['off', 'room', 'plan', '3d'].includes(pl().tier) ? pl().tier : 'room';
        if (!s.positions || typeof s.positions !== 'object') s.positions = {};
        return section('s-maps', 'Maps', state.open, tier === 'off' ? 'floor plans off' : { room: 'room', plan: 'floor plan', '3d': '3D' }[tier],
            h('p', { class: 'rpgc-note' }, 'Everything that draws a map, in one place. The Map page shows them all.'),
            h('h4', { class: 'rpgc-subhead' }, 'Floor plans'),
            selectRow('How much to keep', tier, [['off', 'Off (no tokens)'], ['room', 'The room you are in'], ['plan', 'Every room, with the ways between them (2D)'], ['3d', 'Every floor, in 3D']],
                v => { pl().tier = v; saveSettings(); }),
            h('p', { class: 'rpgc-note' }, 'The model reports a room only when you reach one the plan does not know yet (and every eighth reply, for the people in it): about 60 tokens for the room, about 150 for the plan, plus the known rooms of the floor so new ones fit beside them. A bot that prints its own room atlas (<state:locations>) is read as it is, and asked nothing. After the room atlas of Ryah | Wireless.'),
            toggle('Show who stands where in each room', () => pl().who !== false, v => { pl().who = v; }),
            toggle('Ask the model for new rooms', () => pl().ask !== false, v => { pl().ask = v; }, 'Off: the plan only keeps what a bot’s own room atlas prints.'),
            h('h4', { class: 'rpgc-subhead' }, 'Atlas'),
            toggle('Show the Atlas', () => s.showAtlas !== false, v => { s.showAtlas = v; }, 'The bot’s location book as places you can walk through, with where you are. Read from the lorebook: no tokens.'),
            h('h4', { class: 'rpgc-subhead' }, 'Room map: where everyone stands'),
            selectRow('Track positions', ['fights', 'always'].includes(s.positions.mode) ? s.positions.mode : 'off',
                [['off', 'Off'], ['fights', 'Only in fights (recommended)'], ['always', 'Every reply (more tokens, slower)']], v => { s.positions.mode = v; saveSettings(); }),
            toggle('Map bank: keep every drawn room for the whole world', () => s.positions.bank !== false, v => { s.positions.bank = v; }),
            h('h4', { class: 'rpgc-subhead' }, 'Building maps'),
            toggle('Join drawn rooms into whole buildings', () => !hs.minds || hs.minds.buildings !== false, v => { if (!hs.minds || typeof hs.minds !== 'object') hs.minds = {}; hs.minds.buildings = v; }, 'From FrankenSIM. Needs the room map on.'),
            h('p', { class: 'rpgc-note' }, 'The round button that brings the wide window back is under Look.'));
    }

    // 2.8: magic, powers and skills in one box.
    function renderMagicSettings() {
        const s = S();
        if (!s.hmsSystems || typeof s.hmsSystems !== 'object') s.hmsSystems = {};
        const hs = s.hmsSystems;
        const n = (k) => (hs[k] && typeof hs[k] === 'object' ? hs[k] : (hs[k] = {}));
        const tog = (label, k, f, note, def = true) => toggle(label, () => (def ? n(k)[f] !== false : n(k)[f] === true), v => { n(k)[f] = v; }, note);
        return section('s-magic', 'Magic & Skills', state.open, null,
            h('p', { class: 'rpgc-note' }, 'Spells, powers, skills and traits. They show on the Magic & Skills page.'),
            h('h4', { class: 'rpgc-subhead' }, 'Magic'),
            tog('Magic card', 'magic', 'enabled'),
            tog('Spell list from the lorebook', 'magic', 'spellList'),
            tog('Study a spell', 'magic', 'study', 'Reminds the story of the spell you practise; the world’s own rules decide when it is learned.'),
            tog('Powers (Authorities, gifts, curses, meters)', 'magic', 'powers'),
            h('h4', { class: 'rpgc-subhead' }, 'Skills and traits'),
            tog('Abilities card', 'abilities', 'enabled'),
            tog('Split skills from traits', 'abilities', 'split', 'Skills are learned: they level up or evolve. Traits you are born with: they are always on. Anything else (titles, items, contracts) stays apart.'),
            h('h4', { class: 'rpgc-subhead' }, 'Stats'),
            tog('Compare stats in fights', 'abilities', 'compare', 'Your stats beside the enemy’s, side by side, when a fight or the HUD gives both.'),
            toggle('No cap on stats', () => !!(s.dnd && s.dnd.uncapped), v => { if (!s.dnd || typeof s.dnd !== 'object') s.dnd = {}; s.dnd.uncapped = v; }, 'D&D and RPG stats may go past 20 (a god, a dragon, a level 90 hero). Off keeps the usual 1 to 20 (30 for monsters).'),
            sectionLink('s-dnd', 'D&D'));
    }

    function settingsHero() {
        const box = h('input', { type: 'search', placeholder: 'Find a setting (for example: clock, emoji, lore)', 'aria-label': 'Find a setting', value: state.setFind || '' });
        box.addEventListener('input', () => {
            state.setFind = box.value; clearTimeout(state.setFindT);
            state.setFindT = setTimeout(() => { render(); const b = root.querySelector('input[aria-label="Find a setting"]'); if (b) { b.focus(); b.setSelectionRange(b.value.length, b.value.length); } }, 250);
        });
        const art = h('span', { class: 'art', 'aria-hidden': 'true' });
        art.innerHTML = '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="4" y="8" width="56" height="48" rx="11" stroke-opacity=".35"/><path d="M18 18v28M32 18v28M46 18v28" stroke-opacity=".5"/><circle cx="18" cy="38" r="4.6" fill="currentColor"/><circle cx="32" cy="24" r="4.6" fill="currentColor"/><circle cx="46" cy="33" r="4.6" fill="currentColor"/></svg>';
        return h('div', { class: 'rpgc-sethero rpgc-lead' }, art,
            h('div', { class: 'txt' }, h('b', null, 'Settings'), h('span', { class: 'rpgc-note' }, 'Open a heading to change it, or find a switch by name.'), box),
            perchOn() ? h('img', { class: 'perch', src: PERCH_S, alt: '' }) : null);
    }
    function settingsFilter(list) {
        const find = String(state.setFind || '').trim().toLowerCase();
        if (!find) return list;
        const hit = list.filter(el => !(el.matches && el.matches('details.rpgc-sec')) || el.textContent.toLowerCase().includes(find));
        hit.forEach(el => { if (el.matches && el.matches('details.rpgc-sec') && !el.open) { el.dataset.found = '1'; el.open = true; } });
        return hit.length ? hit : [h('p', { class: 'rpgc-note' }, `No setting matches \u201C${String(state.setFind).trim()}\u201D.`)];
    }
    /** Opens a settings section and scrolls to it: the links between sections that touch the same thing. */
    function goSection(id) {
        state.open[id] = true; state.setFind = '';
        { const t = SET_TABS.find(([k]) => k === setTabNow()); if (t && t[2] && !t[2].includes(id) && S()) S().uiSetTab = 'all'; }   // 2.8: out of the open tab
        if (state.view !== 'settings') state.view = 'settings';
        render();
        setTimeout(() => { const d = root.querySelector(`details.rpgc-sec[data-open-key="${id}"]`); if (d) { d.open = true; if (d.scrollIntoView) d.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }, 30);
    }
    function sectionLink(id, text) { return h('button', { type: 'button', class: 'rpgc-linkbtn rpgc-seclink', onclick: () => goSection(id) }, text, ' \u203A'); }

    // ─────────── locks ───────────

    const LOCK_ON = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
    const LOCK_OFF = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>';
    function lockKey(v) { return String(v ?? '').trim().toLowerCase(); }
    function isLocked(path) {
        let node = state.locks || {};
        for (const k of path) {
            if (node === true || !node || typeof node !== 'object') return false;
            node = node[String(k)];
        }
        return node === true;
    }
    function setLockLocal(path, on) {
        if (!state.locks || typeof state.locks !== 'object') state.locks = {};
        let node = state.locks;
        for (let i = 0; i < path.length - 1; i++) {
            const k = String(path[i]);
            if (!isObj(node[k])) node[k] = {};
            node = node[k];
        }
        const last = String(path[path.length - 1]);
        if (on) node[last] = true; else delete node[last];
    }
    function lockBtn(path, what) {
        if (!S()?.showLockIcons || !state.chatId || !path || path.some(p => p === '' || p === undefined)) return null;
        const on = isLocked(path);
        const b = h('button', {
            class: 'rpgc-lock' + (on ? ' on' : ''),
            title: on ? 'Locked: the AI keeps this as it is' : 'Unlocked: the AI may change this',
            'aria-label': `${on ? 'Unlock' : 'Lock'} ${what || path[path.length - 1]}`,
            'aria-pressed': on ? 'true' : 'false',
            onclick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                setLockLocal(path, !on);
                render();
                send({ type: 'toggle_lock', chatId: state.chatId, path });
            }
        });
        b.innerHTML = on ? LOCK_ON : LOCK_OFF;
        return b;
    }
    function sceneLbl(text, key) {
        return h('span', { class: 'lbl' }, lockBtn(['infoBox', key], text), text);
    }

    // ─────────── story actions (plot + encounter) ───────────

    // Two different ways to fight, plus the legacy window. While one runs the others stay hidden:
    // one fight at a time. A running immersive fight always shows End fight — even with the Fights
    // module switched off, or it could never be stopped.
    function fightButtons() {
        const s = S();
        const out = [];
        if (!s) return out;
        const imm = state.immersive;
        if (imm && imm.active) {
            out.push(h('button', { class: 'rpgc-btn primary', title: 'Stop tracking this fight', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'End the fight?', message: 'The extension stops tracking this fight and stops telling the story about it. Nothing in the chat changes.', confirmLabel: 'End fight' }) : { confirmed: true };
                if (res?.confirmed) send({ type: 'immersive_end', chatId: state.chatId });
            } }, 'End fight'));
            return out;
        }
        if (state.encounterActive) {
            out.push(h('button', { class: 'rpgc-btn primary', onclick: () => openEncounter() }, 'Resume fight'));
            return out;
        }
        if (!s.encounterSettings?.enabled) return out;
        out.push(h('button', { class: 'rpgc-btn', title: 'Keep playing in the chat. The panel tracks everyone\u2019s HP, MP, Stamina and effects, and the story is told what shape they are in.', disabled: state.immBusy ? true : null, onclick: openImmersiveStart }, state.immBusy ? 'Setting up\u2026' : 'Immersive fight'));
        if (dndOn()) out.push(h('button', { class: 'rpgc-btn', title: 'Opens the fight window with D&D rules: initiative, attack rolls, damage dice, spell slots and death saves.', onclick: () => openEncounter('dnd') }, 'Turn-based fight'));
        if (s.encounterSettings.legacyWindow) out.push(h('button', { class: 'rpgc-btn', title: 'The narrative fight window from 1.8: turns and menus, and the model judges each action.', onclick: () => openEncounter('narrative') }, 'Narrative window'));
        return out;
    }

    // One entry point for the input-bar button and the Test zone: pick how to fight.
    let chooserModal = null;
    function openFightChooser() {
        if (!state.chatId || chooserModal) return;
        if (state.immersive && state.immersive.active) { try { tab.activate(); } catch { /* optional */ } return; }
        if (state.encounterActive) { openEncounter(); return; }
        const es = S()?.encounterSettings || {};
        if (es.enabled === false) { state.status = { kind: 'info', text: 'Fights are switched off. Turn them on in Settings \u2192 Modules.' }; render(); return; }
        // With only one kind of fight available there is nothing to choose: open it.
        if (!dndOn() && !es.legacyWindow) { openImmersiveStart(); return; }
        hideWide();
        try { chooserModal = ctx.ui.showModal({ title: 'Start a fight', width: 460, maxHeight: 480 }); }
        catch { openImmersiveStart(); return; }
        chooserModal.root.classList.add('rpgc');
        chooserModal.onDismiss(() => { chooserModal = null; });
        // Close this one before opening the next: Lumiverse allows two stacked modals at most.
        const pick = (fn) => { const m = chooserModal; chooserModal = null; try { m && m.dismiss(); } catch { /* gone */ } setTimeout(fn, 60); };
        const opt = (title, text, fn) => h('button', { class: 'rpgc-btn rpgc-choice', onclick: () => pick(fn) }, h('b', null, title), h('span', null, text));
        chooserModal.root.append(h('div', { class: 'rpgc rpgc-chooser' },
            opt('Immersive fight', 'Stay in the chat. You fight by writing, and the side panel tracks everyone\u2019s HP, MP, Stamina and effects as the story moves them.', openImmersiveStart),
            dndOn() ? opt('Turn-based fight', 'A fight window with D&D rules. The extension rolls initiative, attacks, damage and saves; the model narrates the numbers.', () => openEncounter('dnd')) : null,
            es.legacyWindow ? opt('Narrative window (legacy)', 'The 1.8 fight window: turns and menus, and the model judges each action.', () => openEncounter('narrative')) : null));
    }

    function rulesSummary() {
        const es = S()?.encounterSettings || {};
        const style = { engine: 'the engine\u2019s own rules', power: 'power scaling', fiction: 'the fiction alone' }[es.style] || 'the engine\u2019s own rules';
        const diff = { story: 'Story', normal: 'Normal', hard: 'Hard', hardcore: 'Hardcore' }[es.difficulty] || 'Normal';
        return `Resolved by ${style} \u00B7 difficulty ${diff} \u00B7 ${es.fateDice ? `fate dice d${es.combatDiceSides || 20}` : 'no fate dice'}. Change these in Settings \u2192 Fights.`;
    }

    let immModal = null;
    function openImmersiveStart() {
        if (!state.chatId || immModal || state.immBusy) return;
        hideWide();
        try { immModal = ctx.ui.showModal({ title: 'Immersive fight', width: 520, maxHeight: 460 }); }
        catch { send({ type: 'immersive_start', chatId: state.chatId, framing: '' }); state.immBusy = true; render(); return; }
        immModal.root.classList.add('rpgc');
        immModal.onDismiss(() => { immModal = null; });
        const framingIn = h('input', { type: 'text', placeholder: 'Optional: who you are fighting, if the scene leaves it unclear', 'aria-label': 'Who you are fighting' });
        const go = () => { send({ type: 'immersive_start', chatId: state.chatId, framing: framingIn.value.trim() }); state.immBusy = true; render(); immModal && immModal.dismiss(); };
        framingIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
        immModal.root.append(h('div', { class: 'rpgc', style: 'padding:12px;display:flex;flex-direction:column;gap:10px' },
            h('p', { class: 'rpgc-note' }, 'No window, no turns. You keep writing in the chat. The extension reads the scene once to find who is fighting and what shape they are in, then tracks everyone\u2019s pools and effects and tells the story, with every message, what those bodies look like.'),
            h('p', { class: 'rpgc-note' }, rulesSummary()),
            framingIn,
            h('div', { class: 'rpgc-top' },
                h('button', { class: 'rpgc-btn primary', onclick: go }, 'Start tracking'),
                h('button', { class: 'rpgc-btn', onclick: () => immModal && immModal.dismiss() }, 'Cancel'))));
        setTimeout(() => framingIn.focus(), 30);
    }

    const IMM_COLORS = { mp: ['#1f2a4a', '#5b8def'], stamina: ['#4a3a12', '#e0a93b'] };
    function immBar(pool, enemy) {
        const pct = Number.isFinite(pool.pct) ? pool.pct : 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        const pair = IMM_COLORS[pool.id];
        fill.style.backgroundColor = pair ? mixColor(pair[0], pair[1], pct / 100)
            : enemy ? mixColor('#6b1d1d', '#d9534f', pct / 100) : mixColor(S().statBarColorLow, S().statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-label': pool.label, 'aria-valuemin': '0', 'aria-valuemax': String(pool.max || 0), 'aria-valuenow': String(pool.cur || 0) }, fill);
    }

    // A correction happens in place: the number turns into a field. No browser prompt — the
    // desktop app's window does not always support one.
    function immPoolValue(c, pl, live) {
        const fromHud = pl.src === 'hud';
        const ed = state.immEdit;
        if (live && !fromHud && ed && ed.name === c.name && ed.pool === pl.id) {
            const inp = h('input', { type: 'number', min: '0', max: String(pl.max), value: String(pl.cur), 'aria-label': `${c.name} ${pl.label}` });
            let done = false;
            const commit = (save) => {
                if (done) return; done = true;
                const v = Number(inp.value);
                state.immEdit = null;
                if (save && Number.isFinite(v) && v !== pl.cur) send({ type: 'immersive_adjust', chatId: state.chatId, name: c.name, pool: pl.id, value: v });
                render();
            };
            inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(true); else if (e.key === 'Escape') commit(false); });
            inp.addEventListener('blur', () => commit(true));
            setTimeout(() => { try { inp.focus(); inp.select(); } catch { /* gone */ } }, 0);
            return h('span', { class: 'val editing' }, inp, ` / ${pl.max}`);
        }
        return h('button', { class: 'val', disabled: (!live || fromHud) ? true : null,
            title: fromHud ? 'From the WORLD STATE HUD \u2014 edit the HUD line to change it' : 'Click to correct',
            onclick: () => { state.immEdit = { name: c.name, pool: pl.id }; render(); } }, `${pl.cur} / ${pl.max}`);
    }

    const IMM_OUTCOME = { spared: 'Fight over \u2014 everyone was spared', victory: 'Fight over \u2014 your side stands', defeat: 'Fight over \u2014 your side fell', escaped: 'Fight over \u2014 they got away', fled: 'Fight over \u2014 you got away' };
    const INTEL_LABEL = { intent: 'Intent', weakness: 'Weakness', resist: 'Resists', power: 'True strength', tell: 'Tell', note: 'Note' };

    // The tracker. Every number here is what the story is being told.
    function immCompare(imm) {
        const me = imm.combatants.find(c => c.isPlayer);
        const foes = imm.combatants.filter(c => c.side === 'enemy' && !c.down && !c.left).slice(0, 3);
        if (!me || !foes.length) return null;
        const cols = [me, ...foes];
        const ids = [];
        for (const c of cols) for (const pl of c.pools || []) if (!ids.some(x => x.id === pl.id)) ids.push({ id: pl.id, label: pl.label });
        if (!ids.length) return null;
        const mine = (sysOf() && sysOf().attributes) || [];
        const attrs = mine.flatMap(g => g.items).slice(0, 8);
        const cell = (c, id) => { const pl = (c.pools || []).find(p => p.id === id); return pl ? `${Math.round(pl.cur)}/${Math.round(pl.max)}` : '\u2014'; };
        const better = (id) => { const v = cols.map(c => { const pl = (c.pools || []).find(p => p.id === id); return pl ? pl.cur : null; }); const mx = Math.max(...v.filter(x => x != null)); return v.map(x => x != null && x === mx && v.filter(y => y === mx).length === 1); };
        return h('details', { class: 'rpgc-imm-cmp', open: true }, h('summary', null, 'Side by side'),
            h('table', null, h('thead', null, h('tr', null, h('th', null, ''), ...cols.map(c => h('th', { class: c.isPlayer ? 'me' : '' }, c.isPlayer ? 'You' : c.name)))),
                h('tbody', null, ...ids.map(p => { const b = better(p.id); return h('tr', null, h('th', null, p.label), ...cols.map((c, i) => h('td', { class: b[i] ? 'lead' : '' }, cell(c, p.id)))); }),
                    ...attrs.map(a => h('tr', null, h('th', null, a.name), h('td', null, a.value), ...foes.map(() => h('td', { class: 'unk', title: 'Study them to learn more' }, '?')))))));
    }
    function renderImmersive() {
        const imm = state.immersive;
        if (!imm || !Array.isArray(imm.combatants)) return null;
        const live = !!imm.active;
        const pend = imm.pending || {};
        const rules = imm.rules || {};
        const head = h('div', { class: 'rpgc-imm-head' },
            h('b', null, live ? 'Fight in progress' : (IMM_OUTCOME[imm.outcome] || 'Fight over')),
            live && imm.round ? h('span', { class: 'rpgc-note' }, `${imm.round} repl${imm.round === 1 ? 'y' : 'ies'}`) : null,
            !live ? h('button', { class: 'rpgc-mini', 'aria-label': 'Dismiss', onclick: () => send({ type: 'immersive_dismiss', chatId: state.chatId }) }, '\u2715') : null);
        const rows = [head];
        if (live && rules.styleLabel) rows.push(h('div', { class: 'rpgc-imm-chips' },
            h('span', { title: 'How the story resolves each exchange' }, rules.styleLabel),
            h('span', { title: 'Difficulty' }, rules.difficultyLabel || 'Normal'),
            rules.fateDice ? h('span', { title: 'A true-random die for every fighter with each message' }, `Fate dice d${rules.sides}`) : null));
        if (imm.environment) rows.push(h('div', { class: 'rpgc-imm-env' }, imm.environment));
        if (live && (pend.study || pend.exploit)) {
            rows.push(h('div', { class: 'rpgc-imm-flag', role: 'status' },
                h('span', null, 'With your next message:'),
                pend.study ? h('span', null, `you study ${pend.study}`) : null,
                pend.exploit ? h('span', null, `you act on \u201C${pend.exploit.text}\u201D`) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': 'Clear', title: 'Clear', onclick: () => send({ type: 'immersive_clear', chatId: state.chatId, what: 'all' }) }, '\u2715')));
        }
        for (const side of ['ally', 'enemy']) {
            const list = imm.combatants.filter(c => c.side === side);
            if (!list.length) continue;
            rows.push(h('div', { class: 'rpgc-imm-side' }, side === 'ally' ? 'Your side' : 'Against you'));
            for (const c of list) {
                const enemy = side === 'enemy';
                const studying = pend.study && pend.study === c.name;
                const name = h('div', { class: 'rpgc-imm-name' },
                    h('b', null, c.name),
                    c.isPlayer ? h('span', { class: 'tag' }, 'you') : null,
                    c.level ? (() => {
                        const me = imm.combatants.find(x => x.isPlayer);
                        const gap = !c.isPlayer && me && me.level ? c.level - me.level : null;
                        return h('span', { class: 'tag' + (gap !== null && gap >= 10 ? ' down' : ''), title: gap === null ? 'Level' : gap === 0 ? 'Your level' : `${Math.abs(gap)} level${Math.abs(gap) === 1 ? '' : 's'} ${gap > 0 ? 'above' : 'below'} you` }, `Lv ${c.level}${gap ? ` (${gap > 0 ? '+' : '\u2212'}${Math.abs(gap)})` : ''}`);
                    })() : null,
                    c.down ? h('span', { class: 'tag down' }, 'down') : null,
                    c.spared ? h('span', { class: 'tag spared' }, 'spared') : c.left ? h('span', { class: 'tag' }, 'gone') : null,
                    !c.left && !c.down && c.spareable ? h('span', { class: 'tag mercy', title: 'MERCY would work now' }, 'can be spared') : null,
                    live && enemy && !c.down && !c.left ? h('button', { class: 'rpgc-mini' + (studying ? ' on' : ''), 'aria-pressed': studying ? 'true' : 'false',
                        title: 'Study them with your next message: the story reports what careful observation honestly reveals', onclick: () => send({ type: 'immersive_study', chatId: state.chatId, name: c.name }) }, studying ? 'Studying' : 'Study') : null,
                    live && !c.isPlayer ? h('button', { class: 'rpgc-mini', title: 'Take them out of the fight', 'aria-label': `Remove ${c.name}`, onclick: () => send({ type: 'immersive_remove', chatId: state.chatId, name: c.name }) }, '\u2715') : null);
                const pools = c.pools.map(pl => h('div', { class: 'rpgc-imm-pool' },
                    h('span', null, pl.label, pl.src === 'hud' ? h('span', { class: 'rpgc-imm-src' }, 'HUD') : null),
                    immBar(pl, enemy), immPoolValue(c, pl, live),
                    h('span', { class: 'band' }, pl.band)));
                const fx = (c.statuses || []).length ? h('div', { class: 'rpgc-imm-fx', 'aria-label': 'Effects' },
                    c.statuses.map(st => h('span', { class: st.fresh ? 'new' : '', title: st.fresh ? 'New this reply' : `For ${st.replies} replies` }, st.replies > 1 ? `${st.name} \u00B7 ${st.replies} replies` : st.name))) : null;
                const intel = (c.intel || []).length ? h('div', { class: 'rpgc-imm-intel' },
                    c.intel.map(f => {
                        const usable = live && enemy && !c.down && !c.left && (f.kind === 'weakness' || f.kind === 'tell' || f.kind === 'intent');
                        const on = pend.exploit && pend.exploit.text === f.text;
                        const label = [h('em', null, `${INTEL_LABEL[f.kind] || 'Note'}: `), f.text];
                        return usable ? h('button', { class: on ? 'on' : '', 'aria-pressed': on ? 'true' : 'false', title: 'Act on this with your next message (advantage if it is true)', onclick: () => send({ type: 'immersive_exploit', chatId: state.chatId, name: c.name, text: f.text }) }, ...label)
                            : h('span', null, ...label);
                    })) : null;
                rows.push(h('div', { class: 'rpgc-imm-c' + (c.down ? ' down' : '') }, name,
                    c.note ? h('div', { class: 'rpgc-imm-note' }, c.note) : null,
                    ...(pools.length ? pools : [h('div', { class: 'rpgc-imm-note' }, 'No pools tracked.')]),
                    fx,
                    c.did ? h('div', { class: 'rpgc-imm-did' }, `Last: ${c.did}`) : null,
                    c.tell ? h('div', { class: 'rpgc-imm-tell' }, `Winding up: ${c.tell}`) : null,
                    intel));
            }
        }
        const dice = imm.dice && Array.isArray(imm.dice.rolls) && imm.dice.rolls.length ? imm.dice : null;
        if (live && dice) rows.push(h('div', { class: 'rpgc-imm-dice' }, `Fate dice (d${dice.sides}): ` + dice.rolls.map(r => `${r.name} ${r.value}${r.kept ? ` (${r.kept.join('/')})` : ''}${r.player ? ` \u2014 ${r.band}` : ''}`).join(' \u00B7 ')));
        const last = Array.isArray(imm.last) && imm.last.length ? imm.last
            : (Array.isArray(imm.changes) ? imm.changes.map(x => `${x.name} ${({ hp: 'HP', mp: 'MP', stamina: 'Stamina' })[x.pool] || x.pool} ${Math.round(x.from)}\u2192${Math.round(x.to)}`) : []);
        if (last.length) rows.push(h('div', { class: 'rpgc-imm-chg' }, 'Last reply: ' + last.join(' \u00B7 ')));
        const log = Array.isArray(imm.log) ? imm.log.filter(e => e.lines && e.lines.length) : [];
        if (log.length > 1) {
            const det = h('details', { class: 'rpgc-imm-log' }, h('summary', null, `Fight log (${log.length})`),
                h('ol', null, log.slice().reverse().map(e => h('li', null, h('b', null, `Reply ${e.round}: `), e.lines.join(' \u00B7 ')))));
            det.open = !!state.open['imm-log'];
            det.dataset.openKey = 'imm-log'; det.addEventListener('toggle', () => { state.open['imm-log'] = det.open; });
            rows.push(det);
        }
        // 2.8: your numbers beside the enemy's, side by side (blokkat's idea)
        const cmp = live && ((sysCfg().abilities || {}).compare !== false) ? immCompare(imm) : null;
        if (cmp) rows.splice(rows.length - (rows[rows.length - 1] && rows[rows.length - 1].tagName === 'DETAILS' ? 1 : 0), 0, cmp);
        return h('div', { class: 'rpgc-imm' + (live ? ' live' : '') }, ...rows);
    }

    function storyRow() {
        const s = S();
        if (!s || !s.enabled || !state.chatId) return null;
        const btns = [];
        if (s.showPlotButtons) {
            btns.push(h('button', { class: 'rpgc-btn', title: 'Continue the last reply with a random twist', disabled: state.plotBusy ? true : null, onclick: () => plot('random') }, 'Plot twist'));
            btns.push(h('button', { class: 'rpgc-btn', title: 'Continue the last reply and push the story forward', disabled: state.plotBusy ? true : null, onclick: () => plot('natural') }, 'Move the story'));
        }
        btns.push(...fightButtons());
        btns.push(rereadButton());
        return btns.length ? h('div', { class: 'rpgc-story' }, btns) : null;
    }

    let plotTimer = null;
    function plot(kind) {
        if (!state.chatId || state.plotBusy) return;
        state.plotBusy = true;
        render();
        send({ type: 'plot', chatId: state.chatId, kind });
        clearTimeout(plotTimer);
        plotTimer = setTimeout(() => { if (state.plotBusy) { state.plotBusy = false; render(); } }, 15000);
    }

    async function runPlot(msg) {
        try {
            const url = msg.endpoint === 'continue' ? '/api/v1/generate/continue' : '/api/v1/generate';
            const body = { chat_id: msg.chatId, regen_feedback: msg.prompt, regen_feedback_position: 'user' };
            if (msg.endpoint === 'continue' && msg.messageId) body.message_id = msg.messageId;
            const res = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                let err = '';
                try { err = (await res.json())?.error || ''; } catch { /* not json */ }
                throw new Error(err || `HTTP ${res.status}`);
            }
            state.status = { kind: 'ok', text: msg.kind === 'random' ? 'Plot twist sent. Watch the chat.' : 'The story is moving on in the chat.' };
        } catch (e) {
            state.status = { kind: 'error', text: `Could not start the plot generation: ${e?.message || e}` };
        }
        state.plotBusy = false;
        clearTimeout(plotTimer);
        render();
    }

    // ─────────── settings: display, presets, plot, encounters ───────────

    function selectRow(label, value, options, onChange) {
        const sel = h('select', { 'aria-label': label, onchange: (e) => onChange(e.target.value) }, options.map(([v, t]) => h('option', { value: v }, t)));
        sel.value = value;
        return h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, label), sel);
    }

    function renderDisplaySettings() {
        const s = S();
        return section('s-display', 'Chat display', state.open, null,
            ...chatDisplaySettings(s),
            toggle('Show lock buttons', () => s.showLockIcons, v => { s.showLockIcons = v; }, 'Locked values stay as they are when the AI updates trackers.'),
            toggle('Show plot buttons', () => s.showPlotButtons, v => { s.showPlotButtons = v; }, hmsOn() ? 'Classic chats only. In HMS chats Move the world replaces them: the random twist list can break canon gating and hand out plot armor.' : undefined),
            h('h4', null, 'Weather effects'),
            toggle('Animate the weather', () => s.enableDynamicWeather, v => { s.enableDynamicWeather = v; }, 'A light overlay that follows the scene forecast and time.'),
            toggle('Draw it in front of the chat', () => s.weatherForeground, v => { s.weatherForeground = v; }, 'Off keeps it behind the chat.'),
            h('h4', null, 'Character portraits'),
            toggle('Enable portraits', () => s.enableAvatars, v => { s.enableAvatars = v; }, 'Adds a Portrait button to each present character. Uses your Lumiverse image-generation setup.'),
            s.enableAvatars ? promptArea('Portrait style', 'avatarPromptStyle', 'Built-in style instruction') : null);
    }

    // HUD card and dialogue: drawn when a message is shown, so the saved reply never changes.
    function chatDisplaySettings(s) {
        if (!s.chatDisplay || typeof s.chatDisplay !== 'object') s.chatDisplay = {};
        const d = s.chatDisplay;
        const on = (k, def) => (d[k] === undefined ? def : d[k] === true);
        const marks = on('colours', false) || on('emoji', false) || on('names', false);
        const pal = h('textarea', { rows: '8', 'aria-label': 'Emoji families', spellcheck: 'false', style: 'width:100%;font-size:13px;line-height:1.6',
            placeholder: state.paletteDefault || 'joy: 😊 😄 😁', onchange: (e) => { d.palette = e.target.value; saveSettings(false); } });
        pal.value = d.palette || '';
        const under = ['panel', 'thoughts', 'off'].includes(d.states) ? d.states : (s.showThoughtsInChat === false ? 'off' : 'panel');
        return [
            h('h4', null, 'Under each reply'),
            selectRow('Show', under, [['panel', 'Internal states: scene, people, bonds, plot'], ['thoughts', 'Thoughts only'], ['off', 'Nothing']],
                v => { d.states = v; if (v === 'thoughts') s.showThoughtsInChat = true; saveSettings(); }),
            under === 'panel' ? selectRow('Open on', ['scene', 'people', 'minds', 'bonds', 'plot', 'map'].includes(d.statesTab) ? d.statesTab : 'people',
                [['scene', 'Scene'], ['people', 'People (with thoughts)'], ['minds', 'Minds'], ['bonds', 'Bonds'], ['plot', 'Plot'], ['map', 'Map']], v => { d.statesTab = v; saveSettings(); }) : null,
            under === 'panel' ? toggle('Start open', () => on('statesOpen', true), v => { d.statesOpen = v; }, 'What the side-panel block said about each reply, with what moved. Display only; never sent to the model.') : null,
            h('h4', null, 'Map: where everyone stands'), sectionLink('s-maps', 'All the map settings are in Maps'),
            (() => { if (!s.positions || typeof s.positions !== 'object') s.positions = {}; return selectRow('Track positions', ['fights', 'always'].includes(s.positions.mode) ? s.positions.mode : 'off',
                [['off', 'Off'], ['fights', 'Only in fights (recommended)'], ['always', 'Every reply (more tokens, slower)']], v => { s.positions.mode = v; saveSettings(); }); })(),
            h('p', { class: 'rpgc-note' }, 'The model draws each room once, from the location\u2019s lorebook entry when it has one, then only moves people in it. While it is on it costs about 200 tokens of request plus a short answer per reply. The map shows in Internal states and in the side panel.'),
            toggle('Map bank: keep every drawn room for the whole world', () => !s.positions || s.positions.bank !== false, v => { if (!s.positions || typeof s.positions !== 'object') s.positions = {}; s.positions.bank = v; },
                'A place is drawn once: coming back to it, or a new chat with the same bot, uses the saved room. The bank is in the Map card; the Atlas shows a saved map for each place that has one.'),
            h('h4', null, 'HUD card'),
            toggle('Show the HUD as a card', () => on('hudCard', true), v => { d.hudCard = v; },
                'The World State drawn as a card in the chat: time, place, your lines, quests and inline blocks. The saved reply keeps its plain text, so every lorebook entry keeps loading. • marks a line that loads one.'),
            on('hudCard', true) ? selectRow('Card colours', ['app', 'lantern', 'tidepool', 'dusk', 'paper'].includes(d.hudTheme) ? d.hudTheme : 'world',
                [['world', 'The bot\u2019s world (Re:Zero, Overlord, Classroom of the Elite, Mushoku Tensei, SCP, Harry Potter)'], ['app', 'Follow Lumiverse'], ['lantern', 'Lantern (warm, dark)'], ['tidepool', 'Tidepool (teal, dark)'], ['dusk', 'Dusk (plum, dark)'], ['paper', 'Paper (light)']], v => { d.hudTheme = v; saveSettings(); }) : null,
            on('hudCard', true) ? toggle('Start with the text version open', () => on('hudRawOpen', false), v => { d.hudRawOpen = v; }) : null,
            on('hudCard', true) ? selectRow('HUD style', d.hudStyle === 'pills' ? 'pills' : 'card', [['card', 'Rows (the whole card)'], ['pills', 'Pills (short; tap a long one to open it)']], v => { d.hudStyle = v; saveSettings(); }) : null,
            h('h4', null, 'Letters, notes and books'),
            toggle('Draw them as the real thing', () => on('papers', true), v => { d.papers = v; },
                'A letter on old paper, a note, a book page, a phone thread, a sign or a file, right where it is in the reply. They also wait in the Letters and notes card, to read again.'),
            on('papers', true) ? toggle('Ask the model for them', () => on('papersAsk', false), v => { d.papersAsk = v; }, 'HMS Reporter 1.4 asks for them itself. Turn this on with another preset.') : null,
            on('papers', true) ? toggle('Remind the story of contracts in force', () => on('papersContracts', true), v => { d.papersContracts = v; }, 'A short line with each contract\u2019s terms, sent with the statuses, so the story keeps them (2.9).') : null,
            h('h4', null, 'Dialogue'),
            toggle('Emoji before each spoken line', () => on('emoji', false), v => { d.emoji = v; if (v) d.emojiFree = false; },
                'A reading aid: one emoji for the feeling the speaker shows, from the same family every time, never the same one twice in a row.'),
            toggle('Let the model add its own emoji', () => on('emojiFree', false), v => { d.emojiFree = v; if (v) d.emoji = false; },
                'The model writes the emoji itself: any emoji, as many as it likes, anywhere in the prose. Turns off the one above.'),
            toggle('Colour each speaker', () => on('colours', false), v => { d.colours = v; }, 'Each character keeps one colour for the whole chat.'),
            toggle('Speaker’s name before each line', () => on('names', false), v => { d.names = v; }),
            marks ? toggle('Tone of voice', () => on('tones', true), v => { d.tones = v; }, 'From FrankenSIM: a line can be whispered, steady, trembling or biting, and is drawn that way (italic, firm, spaced or bold). The speaker keeps their colour.') : null,
            marks ? h('p', { class: 'rpgc-note' }, 'The model now marks each spoken line as ', h('code', null, '[D:Name:mood]"…"[/D]'),
                ' and the extension draws the rest, so turning these on or off needs no new replies. Older messages redraw after you reload the page. This replaces “Dialogue coloring” under Story extras while it is on.') : null,
            on('emoji', false) ? h('div', null,
                h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Emoji families'),
                    h('button', { class: 'rpgc-mini', title: 'Copy the built-in list in, to edit it', onclick: () => { pal.value = state.paletteDefault || ''; d.palette = pal.value; saveSettings(false); } }, 'Edit the built-in list'),
                    h('button', { class: 'rpgc-mini', title: 'Go back to the built-in list', onclick: () => { pal.value = ''; d.palette = ''; saveSettings(false); } }, 'Reset')),
                pal,
                h('p', { class: 'rpgc-note' }, 'One family per line: the feeling, a colon, then its emojis. Empty uses the built-in list (42 feelings). The model is told these feeling names.')) : null
        ];
    }

    function renderPresetSettings() {
        const s = S();
        const pm = s.presetManager || {};
        const presets = Object.values(pm.presets || {}).sort((a, b) => String(a.name).localeCompare(String(b.name)));
        const sel = h('select', { 'aria-label': 'Preset', onchange: (e) => { state.presetSel = e.target.value; render(); } },
            h('option', { value: '' }, presets.length ? 'Choose a preset' : 'No presets yet'),
            presets.map(p => h('option', { value: p.id }, `${p.name}${p.id === pm.defaultPresetId ? ' (default)' : ''}${p.id === pm.activePresetId ? ' • in use' : ''}`)));
        const selected = state.presetSel && pm.presets?.[state.presetSel] ? state.presetSel : (pm.activePresetId && pm.presets?.[pm.activePresetId] ? pm.activePresetId : '');
        sel.value = selected;
        const id = () => sel.value;
        const nameIn = h('input', { type: 'text', placeholder: 'Preset name', 'aria-label': 'Preset name' });
        const op = (o, extra = {}) => send({ type: 'preset', chatId: state.chatId, op: o, id: id(), ...extra });
        const need = (fn) => () => { if (!id()) { state.status = { kind: 'info', text: 'Choose a preset first.' }; render(); return; } fn(); };
        const charId = state.characterId;
        const linked = charId ? pm.characterAssociations?.[charId] : null;
        const fileIn = h('input', { type: 'file', accept: '.json,application/json', style: 'display:none', onchange: async (e) => {
            const f = e.target.files && e.target.files[0];
            if (!f) return;
            try {
                const data = JSON.parse(await f.text());
                send({ type: 'preset', chatId: state.chatId, op: 'import', preset: data });
            } catch {
                state.status = { kind: 'error', text: 'That file is not valid JSON.' };
                render();
            }
            e.target.value = '';
        } });
        const exportPreset = () => {
            const p = pm.presets[id()];
            const blob = new Blob([JSON.stringify({ format: 'rpg-companion-preset', name: p.name, trackerConfig: p.trackerConfig }, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${String(p.name).replace(/[^\w\- ]+/g, '_') || 'preset'}.json`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
        };
        return section('s-presets', 'Tracker field presets', closedByDefault('s-presets'), pm.activePresetId && pm.presets?.[pm.activePresetId] ? pm.presets[pm.activePresetId].name : null,
            h('p', { class: 'rpgc-note' }, 'A preset stores your whole tracker setup: stats, status, skills, attributes, scene and character fields.'),
            h('div', { class: 'rpgc-row' }, sel),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', onclick: need(() => op('load')) }, 'Load'),
                h('button', { class: 'rpgc-btn', onclick: need(() => op('save')) }, 'Save current setup into it'),
                h('button', { class: 'rpgc-btn', onclick: need(exportPreset) }, 'Export')),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', onclick: need(() => op('set_default')) }, 'Make default'),
                pm.defaultPresetId ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'preset', chatId: state.chatId, op: 'set_default', id: null }) }, 'Clear default') : null,
                h('button', { class: 'rpgc-btn danger', onclick: need(async () => {
                    const name = pm.presets[id()]?.name || 'this preset';
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Delete preset?', message: `"${name}" will be removed.`, variant: 'danger', confirmLabel: 'Delete' }) : { confirmed: window.confirm(`Delete "${name}"?`) };
                    if (res?.confirmed) { state.presetSel = ''; op('delete'); }
                }) }, 'Delete')),
            charId ? h('div', { class: 'rpgc-row' },
                linked
                    ? h('span', { class: 'rpgc-note' }, `This character uses "${pm.presets?.[linked]?.name || 'a deleted preset'}".`)
                    : h('span', { class: 'rpgc-note' }, 'No preset linked to this character.'),
                linked
                    ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'preset', chatId: state.chatId, op: 'unassociate', characterId: charId }) }, 'Unlink')
                    : h('button', { class: 'rpgc-btn', onclick: need(() => op('associate', { characterId: charId })) }, 'Link selected preset to this character')) : null,
            h('div', { class: 'rpgc-row' }, nameIn,
                h('button', { class: 'rpgc-btn', onclick: () => { const n = nameIn.value.trim(); if (!n) { nameIn.focus(); return; } send({ type: 'preset', chatId: state.chatId, op: 'create', name: n }); } }, 'Save as new'),
                h('button', { class: 'rpgc-btn', onclick: need(() => { const n = nameIn.value.trim(); if (!n) { nameIn.focus(); return; } op('rename', { name: n }); }) }, 'Rename')),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => fileIn.click() }, 'Import preset file'), fileIn));
    }

    const TENSES = [['story', 'Match the story'], ['present', 'Present'], ['past', 'Past']];
    const PERSONS = [['first', 'First person'], ['second', 'Second person'], ['third', 'Third person']];
    const NARRATIONS = [['omniscient', 'Omniscient'], ['limited', 'Limited']];

    function narrativeRows(title, obj) {
        return [
            h('h4', null, title),
            selectRow('Tense', obj.tense, TENSES, v => { obj.tense = v; saveSettings(false); }),
            selectRow('Person', obj.person, PERSONS, v => { obj.person = v; saveSettings(false); }),
            selectRow('Narration', obj.narration, NARRATIONS, v => { obj.narration = v; saveSettings(false); }),
            textInput('Point of view', () => obj.pov, v => { obj.pov = v.trim() || 'narrator'; }, { placeholder: 'narrator' })
        ];
    }

    function renderEncounterSettings() {
        const s = S();
        const es = s.encounterSettings;
        if (!isObj(es.dnd)) es.dnd = { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true };
        const I = () => (s.immersive = s.immersive || {});
        const diffSel = h('select', { 'aria-label': 'Difficulty', onchange: (e) => { es.difficulty = e.target.value; saveSettings(false); render(); } },
            h('option', { value: 'story' }, 'Story \u2014 the odds lean your way; a loss is never death'),
            h('option', { value: 'normal' }, 'Normal \u2014 fair odds; death is possible but rare'),
            h('option', { value: 'hard' }, 'Hard \u2014 the odds favour the enemy; a loss can maim or kill'),
            h('option', { value: 'hardcore' }, 'Hardcore \u2014 no mercy; a loss is death'));
        diffSel.value = es.difficulty || 'normal';
        const styleSel = h('select', { 'aria-label': 'How narrative fights resolve', onchange: (e) => { es.style = e.target.value; saveSettings(false); render(); } },
            h('option', { value: 'engine' }, 'Engine rules \u2014 the bot\u2019s own system'),
            h('option', { value: 'power' }, 'Power level, feats, hax and counters'),
            h('option', { value: 'fiction' }, 'Fiction alone'));
        styleSel.value = es.style || 'engine';
        const engageSel = h('select', { 'aria-label': 'When a fight starts in the story', onchange: (e) => { I().autoEngage = e.target.value; saveSettings(false); } },
            h('option', { value: 'off' }, 'Nothing \u2014 I press a button'),
            h('option', { value: 'immersive' }, 'Start an immersive fight'),
            h('option', { value: 'turnbased', disabled: dndOn() ? null : true }, dndOn() ? 'Open the turn-based window' : 'Open the turn-based window (needs D&D)'));
        engageSel.value = ['immersive', 'turnbased'].includes(I().autoEngage) ? I().autoEngage : 'off';
        return section('s-enc', 'Fights', closedByDefault('s-enc'), null,
            toggle('Fights on', () => s.encounterSettings.enabled, v => { s.encounterSettings.enabled = v; }, 'Shows the fight buttons: Immersive, and Turn-based when D&D is on. (It was under Chat and panel extras before 2.4.)'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Lore for fights: '), sectionLink('s-lore', 'Lorebook context')),
            h('p', { class: 'rpgc-note' }, 'Two different ways to fight. Immersive: you keep writing in the chat and the side panel tracks everyone. Turn-based: a fight window opens and the extension runs D&D rules.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Difficulty'), diffSel),
            h('p', { class: 'rpgc-note' }, ({ story: 'Immersive: the odds lean your way. Turn-based: enemies are weaker (HP \u00D70.7, AC and to-hit \u22122), fleeing is easier, and three failed death saves leave you out of the fight rather than dead.', normal: 'Fair odds in both.', hard: 'Immersive: the odds favour the enemy. Turn-based: enemies are tougher (HP \u00D71.25, AC and to-hit +1) and fleeing is harder.', hardcore: 'Immersive: no mercy, a loss is death. Turn-based: enemies HP \u00D71.5, AC and to-hit +2, fleeing much harder, and massive damage kills at half your max HP.' })[es.difficulty || 'normal']),

            h('h4', null, 'Immersive fights'),
            h('p', { class: 'rpgc-note' }, 'No window and no turns: you fight by writing in the chat, and HP, MP, Stamina and effects ride along with every message so the story writes the wounds, the slowing blade and the forced spells. Your own HP and MP come from the WORLD STATE HUD when your engine prints them; everyone else, and Stamina, the extension tracks.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'How it resolves'), styleSel),
            h('p', { class: 'rpgc-note' }, {
                engine: 'Follows the bot\u2019s engine: COTE rolls its own dice, Overlord runs on level gaps and tiers, Re:Zero on ranks and Authorities.',
                power: 'Power level and demonstrated feats decide an exchange; hax bypasses raw power only within its rules, and a counter answers hax. Study an enemy to learn their feats, hax and counters.',
                fiction: 'No system: what these fighters could plausibly do to each other decides it. Power gaps still hold.'
            }[es.style || 'engine']),
            toggle('Fate dice', () => !!es.fateDice, v => { es.fateDice = v; }, 'A true-random die for every fighter with each message you send. It leans how well an attempt goes \u2014 never whether the engine allows it. A swipe keeps its dice.'),
            es.fateDice ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Die sides'),
                h('input', { type: 'number', min: '2', max: '100', value: String(es.combatDiceSides || 20), 'aria-label': 'Die sides', onchange: (e) => { es.combatDiceSides = Math.max(2, Math.min(100, parseInt(e.target.value, 10) || 20)); saveSettings(); } })) : null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'When a fight starts in the story'), engageSel),
            h('p', { class: 'rpgc-note' }, 'Watches for a clear opening \u2014 a weapon drawn on you, an attack, a charge \u2014 in a new reply. It never fires twice on the same reply, and never while a fight is running.'),
            toggle('Track effects and how long they last', () => I().statuses !== false, v => { I().statuses = v; }, 'Bleeding, stunned, pinned, inside a barrier\u2026 An effect stays on a fighter until the story ends it.'),
            toggle('Track what each fighter just did', () => I().moves !== false, v => { I().moves = v; }, 'And what each enemy is visibly winding up.'),
            toggle('Enemies keep a hidden plan', () => I().plans !== false, v => { I().plans = v; }, 'The story remembers what each enemy intends from one reply to the next; you only see the telegraph. Study an enemy to learn more.'),
            toggle('Describe everyone\u2019s condition, not only yours', () => I().tellForEveryone !== false, v => { I().tellForEveryone = v; }, 'Off: only your own condition is put into words for the story. Everyone keeps their numbers either way.'),
            toggle('Stop tracking once the fight is decided', () => I().endOnOutcome !== false, v => { I().endOnOutcome = v; }, 'One side down, or one side gone.'),
            toggle('Ask the story to report the fight each reply', () => I().askEachTurn !== false, v => { I().askEachTurn = v; }, 'Off means the numbers only move when you correct them by hand.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Fight log length'),
                h('input', { type: 'number', min: '3', max: '50', value: String(I().logSize ?? 12), 'aria-label': 'Replies kept in the fight log', onchange: (e) => { I().logSize = Math.max(3, Math.min(50, parseInt(e.target.value, 10) || 12)); saveSettings(); } })),

            h('h4', null, 'Turn-based fights'),
            h('p', { class: 'rpgc-note' }, dndOn() ? 'Turn-based fights run D&D rules. Their settings are under ' : 'Turn-based fights run D&D rules, and D&D is switched off. Turn it on under ', sectionLink('s-dnd', 'D&D')),

            h('h4', null, 'Legacy'),
            toggle('Show the narrative fight window', () => !!es.legacyWindow, v => { es.legacyWindow = v; }, 'The fight window from 1.8, with turns and menus where the model judges each action. It uses the style, fate dice and difficulty above.'));
    }

    // ─────────── encounter window ───────────

    let encModal = null;
    const ENV_HUES = { forest: 125, dungeon: 265, desert: 40, cave: 28, city: 215, ruins: 35, snow: 200, water: 195, castle: 285, wasteland: 22, plains: 85, mountains: 220, swamp: 100, volcanic: 8, spaceship: 190, mansion: 330 };
    const TIME_LIGHT = { dawn: 30, day: 34, dusk: 24, twilight: 20, night: 14 };

    function openEncounter(kind) {
        if (!state.chatId) return;
        if (encModal) return;
        if (kind === 'dnd' || kind === 'narrative') state.encKind = kind;
        else if (!state.encounterActive) state.encKind = 'dnd';
        try {
            hideWide();
            encModal = ctx.ui.showModal({ title: state.encounterActive ? 'Fight' : state.encKind === 'narrative' ? 'Narrative fight (legacy)' : 'Turn-based fight', width: 780, maxHeight: 880, persistent: true });
        } catch (e) {
            state.status = { kind: 'error', text: `Could not open the fight window: ${e?.message || e}` };
            render();
            return;
        }
        encModal.root.classList.add('rpgc', 'rpgc-enc');
        encModal.onDismiss(() => { encModal = null; state.encounterNotice = null; });
        state.encounterFor = state.chatId;
        state.showHistory = false;
        renderEncounter();
        send({ type: 'encounter_get', chatId: state.chatId });
    }

    function hpBar(hp, max, enemy) {
        const pct = Math.max(0, Math.min(100, (Number(hp) / (Number(max) || 1)) * 100)) || 0;
        const fill = h('i');
        fill.style.width = pct + '%';
        fill.style.backgroundColor = enemy ? mixColor('#6b1d1d', '#d9534f', pct / 100) : mixColor(S().statBarColorLow, S().statBarColorHigh, pct / 100);
        return h('div', { class: 'rpgc-bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max || 0), 'aria-valuenow': String(hp || 0) }, fill);
    }

    function encLog(enc) {
        const box = h('div', { class: 'rpgc-enc-log', role: 'log', 'aria-live': 'polite' },
            (enc.entries || []).map(e => h('div', { class: e.type || '' }, e.type === 'player' ? `You: ${e.text}` : e.type === 'roll' ? `\uD83C\uDFB2 ${e.text}` : e.type === 'order' ? `\u2192 Order to ${e.text}` : e.type === 'intel' ? `\uD83D\uDD0D ${e.text}` : e.text,
                e.outcome ? h('span', { class: 'rpgc-outcome ' + e.outcome }, e.outcome === 'fail' ? 'failed' : e.outcome) : null)));
        setTimeout(() => { box.scrollTop = box.scrollHeight; }, 0);
        return box;
    }

    function encSend(payload) {
        state.encPick = null;
        state.encounterBusy = true;
        renderEncounter();
        send({ chatId: state.encounterFor || state.chatId, ...payload });
    }

    function renderEncounterStart() {
        const es = S().encounterSettings;
        const combat = { ...es.combatNarrative };
        const framingIn = h('textarea', { placeholder: 'Leave empty to fight whoever is hostile in the scene. Or describe it: "Garfiel challenges you to a sparring match", "bandits ambush the carriage"…', 'aria-label': 'Describe the fight', style: 'min-height:64px' });
        const summary = { ...es.summaryNarrative };
        const rows = (title, obj) => [
            h('h4', null, title),
            selectRow('Tense', obj.tense, TENSES, v => { obj.tense = v; }),
            selectRow('Person', obj.person, PERSONS, v => { obj.person = v; }),
            selectRow('Narration', obj.narration, NARRATIONS, v => { obj.narration = v; }),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Point of view'), h('input', { type: 'text', 'aria-label': 'Point of view', value: obj.pov || 'narrator', onchange: (e) => { obj.pov = e.target.value.trim() || 'narrator'; } }))
        ];
        return [
            state.encounterNotice ? h('div', { class: 'rpgc-status warning', role: 'status' }, state.encounterNotice) : null,
            state.encKind === 'narrative'
                ? h('p', { class: 'rpgc-note' }, 'Narrative window (legacy): turns and menus, and the model judges each action. It uses your narrative style, fate dice and difficulty from Settings \u2192 Fights.')
                : h('p', { class: 'rpgc-note' }, 'D&D rules: initiative, attack rolls against AC, damage dice, saving throws, spell slots and death saves. The extension rolls every die and applies the numbers; the model narrates them.'),
            h('p', null, 'The game master reads the recent scene, your trackers and the present characters, then sets up the fight. If nobody in the scene is hostile, it tells you instead of inventing an enemy. The aftermath is posted to the chat when it ends.'),
            h('h4', null, 'What is the fight? (optional)'),
            framingIn,
            ...rows('Combat narration', combat),
            ...rows('Aftermath narration', summary),
            h('div', { class: 'rpgc-row', style: 'margin-top:8px' },
                h('button', { class: 'rpgc-btn primary', onclick: () => { state.encounterNotice = null; encSend({ type: 'encounter_start', system: state.encKind === 'narrative' ? 'narrative' : 'dnd', framing: framingIn.value.trim(), narrative: { combatNarrative: combat, summaryNarrative: summary } }); } }, 'Start the fight'),
                h('button', { class: 'rpgc-btn', onclick: () => encModal && encModal.dismiss() }, 'Cancel'))
        ];
    }

    // ─────────── Combat v2: categories, orders, Check, Guard, Flee ───────────

    const COMBAT_TABS = [['physical', 'Physical'], ['magical', 'Magical'], ['abilities', 'Abilities & skills'], ['items', 'Items']];
    const THREAT_LABEL = { trivial: 'looks trivial', weaker: 'looks weaker', even: 'looks evenly matched', stronger: 'looks stronger', overwhelming: 'looks overwhelming' };

    function combatOptionsOf(f, isPlayerView, enc) {
        if (enc.system === 'dnd') {
            const me = isPlayerView ? ((enc.combatStats || {}).party || []).find(m => m && m.isPlayer) || {} : f;
            const sl = me.slots || {};
            return {
                physical: (me.attacks || []).map(a => ({ name: a.name, type: 'single-target', cost: `${a.toHit >= 0 ? '+' : ''}${a.toHit} \u00B7 ${a.damage}`, note: a.note })),
                magical: (me.spells || []).map(sp => ({ name: sp.name, type: sp.heal ? (sp.aoe ? 'self' : 'ally') : (sp.aoe ? 'aoe' : 'single-target'),
                    cost: sp.level ? `L${sp.level}${sl[sp.level] ? ` (${sl[sp.level][0]}/${sl[sp.level][1]})` : ''}` : 'cantrip', note: [sp.save ? `${sp.save.toUpperCase()} save DC ${sp.dc}` : sp.attack !== null ? `+${sp.attack} to hit` : null, sp.damage || sp.heal].filter(Boolean).join(' \u00B7 '),
                    empty: sp.level > 0 && (!sl[sp.level] || sl[sp.level][0] <= 0) })),
                abilities: (me.abilities || []).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o),
                items: isPlayerView ? (enc.playerActions?.items || []) : (me.items || [])
            };
        }
        const pa = isPlayerView ? (enc.playerActions || {}) : f;
        const out = {};
        for (const [k] of COMBAT_TABS) {
            if (k === 'items') { out.items = (Array.isArray(pa.items) ? pa.items : []).filter(Boolean); continue; }
            out[k] = (Array.isArray(pa[k]) ? pa[k] : []).filter(Boolean).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o);
        }
        // A save from before categories carries one flat list; it reads as physical.
        if (!out.physical.length && !out.magical.length && !out.abilities.length && Array.isArray(pa.attacks)) {
            out.physical = pa.attacks.filter(Boolean).map(o => typeof o === 'string' ? { name: o, type: 'single-target' } : o);
        }
        return out;
    }

    function encKey(n) { return String(n || '').trim().toLowerCase(); }

    function mpBar(f) {
        if (!Number(f.maxMp)) return null;
        const pct = Math.max(0, Math.min(100, (Number(f.mp) / Number(f.maxMp)) * 100));
        const i = h('i', { class: 'mp' }); i.style.width = pct + '%';
        return h('div', { class: 'rpgc-bar rpgc-mpbar', role: 'meter', 'aria-label': `${f.name} MP`, 'aria-valuenow': String(Math.round(pct)) }, i);
    }

    function fighterCard(f, enemy, enc) {
        enc = enc || {};
        const down = Number(f.hp) <= 0;
        const sprite = String(f.sprite || '').trim();
        const shortSprite = sprite && [...sprite].length <= 3;
        const statuses = (Array.isArray(f.statuses) ? f.statuses : []).filter(x => x && (x.emoji || x.name));
        const key = encKey(f.name);
        const intel = enemy && enc.intel ? (enc.intel[key] || []) : [];
        const tele = enemy && enc.intents && enc.intents[key] ? enc.intents[key].telegraph : null;
        const revealedPower = intel.find(x => x.kind === 'power');
        const order = !enemy && !f.isPlayer ? (state.encOrders || {})[f.name] : null;
        return h('div', { class: 'rpgc-fighter' + (down ? ' down' : '') + (enemy ? ' foe' : '') },
            h('div', { class: 'rpgc-fighter-head' },
                enemy && shortSprite ? h('span', { class: 'sprite', 'aria-hidden': 'true' }, sprite) : null,
                h('span', null, f.name || '?'),
                !enemy && f.isPlayer ? h('span', { class: 'you' }, 'You') : null,
                enemy && f.threat ? h('span', { class: 'rpgc-chip threat ' + f.threat, title: 'How they look to you. A Check can tell you more.' }, THREAT_LABEL[f.threat] || f.threat) : null),
            hpBar(f.hp, f.maxHp, enemy),
            h('span', { class: 'hp' }, `${f.hp ?? '?'} / ${f.maxHp ?? '?'} HP${Number(f.maxMp) ? ` \u00B7 ${f.mp ?? '?'} / ${f.maxMp} MP` : ''}${f.dead ? ' \u00B7 dead' : f.stable ? ' \u00B7 stable' : down ? ' \u00B7 down' : ''}`,
                enc.system === 'dnd' && f.ac !== undefined ? h('span', { class: 'rpgc-ac', title: 'Armor Class' }, `AC ${f.ac}`) : null),
            enc.system === 'dnd' && down && !enemy && !f.dead && !f.stable ? h('span', { class: 'rpgc-deathsaves', 'aria-label': `death saves ${f.death?.s || 0} successes ${f.death?.f || 0} failures` },
                '\u2713'.repeat(f.death?.s || 0), h('span', { class: 'off' }, '\u25CB'.repeat(3 - (f.death?.s || 0))), ' ', h('span', { class: 'fail' }, '\u2717'.repeat(f.death?.f || 0)), h('span', { class: 'off' }, '\u25CB'.repeat(3 - (f.death?.f || 0)))) : null,
            enc.system === 'dnd' && f.slots && Object.keys(f.slots).length ? h('span', { class: 'power' }, 'Slots ' + Object.entries(f.slots).map(([lv, v]) => `L${lv} ${v[0]}/${v[1]}`).join(' \u00B7 ')) : null,
            ['feats', 'hax', 'counters'].some(k => Array.isArray(f[k]) && f[k].length) ? h('div', { class: 'rpgc-intel' }, ['feats', 'hax', 'counters'].flatMap(k => (f[k] || []).map(x => h('span', { class: 'rpgc-chip intel ' + (k === 'feats' ? 'power' : k === 'hax' ? 'weakness' : 'resist') }, h('em', null, k.replace(/s$/, '') + ': '), x)))) : null,
            mpBar(f),
            (!enemy && f.power) || revealedPower ? h('span', { class: 'power' }, revealedPower ? revealedPower.text : f.power) : null,
            statuses.length ? h('div', { class: 'rpgc-chips' }, statuses.map(x => h('span', { class: 'rpgc-chip', title: x.duration ? `${x.duration} turn(s) left` : '' }, `${x.emoji || ''} ${x.name || ''}`.trim()))) : null,
            tele && !down ? h('div', { class: 'telegraph', title: 'What they seem to be doing' }, tele) : null,
            intel.length ? h('div', { class: 'rpgc-intel' }, intel.map(k => {
                const usable = ['weakness', 'tell', 'intent', 'resist'].includes(k.kind) && !down && !state.encounterBusy;
                return h(usable ? 'button' : 'span', {
                    class: 'rpgc-chip intel ' + k.kind,
                    title: usable ? 'Act on this — pick how, and you get the advantage it honestly gives' : k.kind,
                    onclick: usable ? () => { state.encExploit = { target: f.name, fact: `${k.kind}: ${k.text}` }; state.encPick = null; state.encOrderFor = null; renderEncounter(); } : null
                }, h('em', null, k.kind + ': '), k.text);
            })) : null,
            enemy && (f.description || (sprite && !shortSprite)) ? h('span', { class: 'desc' }, [f.description, sprite && !shortSprite ? sprite : ''].filter(Boolean).join(' \u00B7 ')) : null,
            !enemy && !f.isPlayer && !down ? h('div', { class: 'rpgc-order' },
                order ? h('span', { class: 'o' }, `Ordered: ${order.text}`) : h('span', { class: 'o own' }, 'Own judgment'),
                order ? h('button', { class: 'rpgc-mini', 'aria-label': `Cancel the order to ${f.name}`, onclick: () => { delete state.encOrders[f.name]; renderEncounter(); } }, '\u2715') : null,
                h('button', { class: 'rpgc-btn', disabled: state.encounterBusy ? true : null, title: `Tell ${f.name} what to do this round`, onclick: () => { state.encOrderFor = f.name; state.encPick = null; state.encExploit = null; renderEncounter(); } }, 'Order')) : null);
    }

    /** Sends the player's action with every pending order, then clears the orders. */
    function sendAct(act) {
        const orders = Object.entries(state.encOrders || {}).map(([member, o]) => ({ member, text: o.text, plan: o.plan || null }));
        state.encOrders = {};
        state.encExploit = null;
        state.encOrderFor = null;
        encSend({ type: 'encounter_action', act: { ...act, orders } });
    }

    /**
     * Target choice for one option. `actor` is null for the player, or an ally's name when
     * building an order; `done` receives the finished sentence and the chosen target.
     */
    function pickTarget(enc, actor, verb, type, done) {
        const cs = enc.combatStats || {};
        const alive = (l) => (l || []).filter(x => x && Number(x.hp) > 0);
        const self = actor ? 'themself' : 'myself';
        if (type === 'aoe') return done(`${verb} on all enemies`, 'all enemies');
        if (type === 'self') return done(`${verb} on ${self}`, actor || 'yourself');
        const opts = [];
        if (type === 'ally') {
            opts.push([actor || 'yourself', actor ? actor : 'Yourself']);
            for (const m of alive(cs.party)) if (!m.isPlayer && m.name !== actor) opts.push([m.name, m.name]);
            if (actor) { const p = alive(cs.party).find(m => m.isPlayer); if (p) opts.push([p.name, `${p.name} (you)`]); }
        } else {
            for (const e of alive(cs.enemies)) opts.push([e.name, e.name]);
        }
        state.encPick = { verb, allowAll: type === 'both', opts, done };
        renderEncounter();
    }

    function targetPickerView() {
        const p = state.encPick;
        return h('div', { class: 'rpgc-enc-actions' },
            h('span', { class: 'lbl' }, `${p.verb}: choose a target`),
            p.allowAll ? h('button', { class: 'rpgc-btn', onclick: () => { const d = p.done; state.encPick = null; d(`${p.verb} on all enemies`, 'all enemies'); } }, 'All enemies') : null,
            p.opts.map(([val, label]) => h('button', { class: 'rpgc-btn', onclick: () => { const d = p.done; state.encPick = null; d(val === 'yourself' ? `${p.verb} on myself` : `${p.verb} on ${val}`, val); } }, label)),
            h('button', { class: 'rpgc-btn', onclick: () => { state.encPick = null; renderEncounter(); } }, 'Back'));
    }

    /** One category's option buttons, for the player or for an ally being given an order. */
    function optionButtons(enc, options, tab, actor, onDone) {
        const list = options[tab] || [];
        if (tab === 'items') {
            return list.map(it => h('button', { class: 'rpgc-btn', onclick: () => pickTarget(enc, actor, `Use ${String(it).replace(/\s*x\d+\s*$/i, '')}`, 'ally', (t, target) => onDone({ text: t, kind: 'item', target })) }, String(it)));
        }
        const shown = list.length ? list : (tab === 'physical' ? [{ name: actor ? 'Attack' : 'Attack with what I have', type: 'single-target' }] : []);
        return shown.map(o => h('button', {
            class: 'rpgc-btn', title: [o.type, o.cost, o.note].filter(Boolean).join(' \u00B7 '), disabled: o.empty ? true : null,
            onclick: () => pickTarget(enc, actor, `${tab === 'magical' ? 'Cast' : tab === 'physical' && enc.system === 'dnd' ? 'Attack with' : 'Use'} ${o.name}`, String(o.type || 'single-target').toLowerCase(), (t, target) => onDone({ text: t, kind: tab, target, use: o.name }))
        }, o.name, o.cost ? h('span', { class: 'cost' }, ` ${o.cost}`) : null));
    }

    function categoryMenu(enc, options, actor, onDone, tabKey) {
        const tabs = COMBAT_TABS.filter(([k]) => k === 'physical' || (options[k] && options[k].length))
            .map(([k, l]) => [k, enc.system === 'dnd' ? ({ physical: 'Attack', magical: 'Spells' }[k] || l) : l]);
        const cur = tabs.some(([k]) => k === state[tabKey]) ? state[tabKey] : tabs[0][0];
        return [
            h('div', { class: 'rpgc-enc-tabs', role: 'tablist' }, tabs.map(([k, label]) => h('button', {
                class: 'rpgc-btn' + (k === cur ? ' primary' : ''), role: 'tab', 'aria-selected': k === cur ? 'true' : 'false',
                onclick: () => { state[tabKey] = k; renderEncounter(); }
            }, label, k !== 'physical' && options[k] ? h('span', { class: 'n' }, ` ${options[k].length}`) : null))),
            h('div', { class: 'rpgc-enc-actions' }, optionButtons(enc, options, cur, actor, onDone))
        ];
    }

    function combatActions(enc) {
        const cs = enc.combatStats || {};
        const out = [];
        if (state.encPick) { out.push(targetPickerView()); return out; }
        if (state.encCheck) {
            const alive = (l) => (l || []).filter(x => x && Number(x.hp) > 0);
            const go = (target, text) => { state.encCheck = false; sendAct({ text: text || `Check ${target}: study it closely`, kind: 'check', target }); };
            const other = h('input', { type: 'text', placeholder: 'Something else \u2014 the door, her sword, the ceiling\u2026', 'aria-label': 'What to check', style: 'flex:1;min-width:0' });
            other.addEventListener('keydown', (e) => { if (e.key === 'Enter' && other.value.trim()) { e.preventDefault(); go(other.value.trim()); } });
            out.push(h('div', { class: 'rpgc-enc-actions' }, h('span', { class: 'lbl' }, 'Check what?'),
                alive(cs.enemies).map(e => h('button', { class: 'rpgc-btn', onclick: () => go(e.name) }, e.name)),
                alive(cs.party).filter(m => !m.isPlayer).map(m => h('button', { class: 'rpgc-btn', title: 'Read an ally: how they are really doing', onclick: () => go(m.name) }, m.name)),
                h('button', { class: 'rpgc-btn', title: 'Terrain, cover, hazards, ways out', onclick: () => go('the surroundings', 'Check the surroundings: terrain, cover, hazards and ways out') }, 'The room / terrain')));
            out.push(h('div', { class: 'rpgc-row' }, other, h('button', { class: 'rpgc-btn', onclick: () => { if (other.value.trim()) go(other.value.trim()); } }, 'Check it'), h('button', { class: 'rpgc-btn', onclick: () => { state.encCheck = false; renderEncounter(); } }, 'Back')));
            return out;
        }
        if (state.encOrderFor) {
            const ally = (cs.party || []).find(m => m && m.name === state.encOrderFor);
            if (!ally) { state.encOrderFor = null; return combatActions(enc); }
            out.push(h('div', { class: 'rpgc-enc-orderhead' }, h('strong', null, `Order for ${ally.name}`),
                h('span', { class: 'rpgc-note' }, S().encounterSettings?.companionsMayRefuse === false ? 'They will carry it out in their own style.' : 'A request: they may hesitate, improvise or refuse, as their character and mood decide.')));
            out.push(...categoryMenu(enc, combatOptionsOf(ally, false, enc), ally.name, (a) => {
                state.encOrders = state.encOrders || {};
                state.encOrders[ally.name] = { text: a.text, plan: { action: a.kind === 'physical' ? 'attack' : a.kind === 'magical' ? 'spell' : a.kind, use: a.use || null, target: a.target || null } };
                state.encOrderFor = null;
                renderEncounter();
            }, 'encOrderTab'));
            const custom = h('input', { type: 'text', placeholder: `Or tell ${ally.name} in your own words…`, 'aria-label': `Custom order for ${ally.name}`, style: 'flex:1;min-width:0' });
            const give = () => { const v = custom.value.trim(); if (!v) return; state.encOrders[ally.name] = { text: v }; state.encOrderFor = null; renderEncounter(); };
            custom.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); give(); } });
            out.push(h('div', { class: 'rpgc-row' }, custom, h('button', { class: 'rpgc-btn', onclick: give }, 'Give order'), h('button', { class: 'rpgc-btn', onclick: () => { state.encOrderFor = null; renderEncounter(); } }, 'Back')));
            return out;
        }
        const options = combatOptionsOf(null, true, enc);
        if (state.encExploit) {
            const ex = state.encExploit;
            out.push(h('div', { class: 'rpgc-enc-orderhead' }, h('strong', null, `Act on what you know about ${ex.target}`), h('span', { class: 'rpgc-note' }, ex.fact)));
            const done = (a) => sendAct({ ...a, text: `${a.text}, acting on what I learned (${ex.fact})`, target: ex.target, exploit: `${ex.target} — ${ex.fact}` });
            // The target is already chosen: every option goes straight at them.
            const tabs = COMBAT_TABS.filter(([k]) => k !== 'items' && (k === 'physical' || (options[k] && options[k].length)));
            out.push(h('div', { class: 'rpgc-enc-actions' }, tabs.flatMap(([k]) => (options[k].length ? options[k] : [{ name: 'Attack with what I have' }]).map(o =>
                h('button', { class: 'rpgc-btn', onclick: () => done({ text: `${k === 'magical' ? 'Cast' : 'Use'} ${o.name} on ${ex.target}`, kind: k }) }, o.name)))));
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.encExploit = null; renderEncounter(); } }, 'Back')));
            return out;
        }
        const me = (cs.party || []).find(m => m && m.isPlayer);
        if (enc.system === 'dnd' && me && Number(me.hp) <= 0) {
            out.push(h('div', { class: 'rpgc-status error', role: 'status' }, me.dead ? 'You are dead.' : me.stable ? 'You are down but stable. Your allies fight on.' : `You are dying. Death saves: ${me.death?.s || 0} \u2713 ${me.death?.f || 0} \u2717. Each round you roll one on your turn.`));
            if (!me.dead) out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => sendAct({ text: 'Hold on', kind: 'deathsave' }) }, me.stable ? 'Wait' : 'Hold on (roll the round)')));
            return out;
        }
        out.push(...categoryMenu(enc, options, null, sendAct, 'encTab'));
        const enemies = (cs.enemies || []).filter(e => e && Number(e.hp) > 0);
        const downAllies = enc.system === 'dnd' ? (cs.party || []).filter(m => m && !m.isPlayer && Number(m.hp) <= 0 && !m.dead && !m.stable) : [];
        out.push(h('div', { class: 'rpgc-enc-tactics' },
            h('button', { class: 'rpgc-btn', title: 'Spend the round studying something: an enemy, an ally, the room, or anything you name', onclick: () => { state.encCheck = true; renderEncounter(); } }, 'Check'),
            enc.system === 'dnd'
                ? h('button', { class: 'rpgc-btn', title: 'Attacks against you have disadvantage until your next turn', onclick: () => sendAct({ text: 'Dodge', kind: 'guard' }) }, 'Dodge')
                : h('button', { class: 'rpgc-btn', title: 'Brace, or cover an ally, instead of attacking', onclick: () => pickTarget(enc, null, 'Guard', 'ally', (t, target) => sendAct({ text: target === 'yourself' ? 'Guard: brace and defend myself' : `Guard: cover ${target}`, kind: 'guard', target })) }, 'Guard'),
            downAllies.map(a => h('button', { class: 'rpgc-btn', title: `Medicine check DC 10 to stabilise ${a.name}`, onclick: () => sendAct({ text: `Help ${a.name}: stabilise them`, kind: 'help', target: a.name }) }, `Stabilise ${a.name}`)),
            h('button', { class: 'rpgc-btn danger', title: 'Try to escape. Risky: they may be faster, cut you off, or follow.', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Try to flee?', message: 'Escape is judged by speed, distance and terrain. You may get away, be pursued, be cut off, or leave someone behind — and enemies may strike as you turn.', confirmLabel: 'Flee' }) : { confirmed: window.confirm('Try to flee? It is risky.') };
                if (res?.confirmed) sendAct({ text: 'Flee: break away and try to escape with the party', kind: 'flee' });
            } }, 'Flee')));
        const custom = h('input', { type: 'text', placeholder: 'Do or say something else…', 'aria-label': 'Custom action', style: 'flex:1;min-width:0' });
        const sendCustom = () => { const v = custom.value.trim(); if (v) sendAct({ text: v, kind: 'custom' }); };
        custom.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendCustom(); } });
        out.push(h('div', { class: 'rpgc-row' }, custom, h('button', { class: 'rpgc-btn primary', onclick: sendCustom }, 'Act')));
        const orders = Object.entries(state.encOrders || {});
        if (orders.length) out.push(h('p', { class: 'rpgc-note' }, 'Orders go with your next action: ' + orders.map(([m, o]) => `${m} \u2192 ${o.text}`).join(' \u00B7 ')));
        return out;
    }

    function renderEncounterCombat(enc, busy) {
        const cs = enc.combatStats || { party: [], enemies: [] };
        const out = [];
        if (cs.environment) out.push(h('div', { class: 'rpgc-enc-env' }, cs.environment));
        if (enc.system === 'dnd' && Array.isArray(enc.initiative)) out.push(h('div', { class: 'rpgc-initiative', 'aria-label': 'Initiative order' },
            h('b', null, `Round ${enc.round || 1}`), ...enc.initiative.map(i => {
                const c = [...(cs.party || []), ...(cs.enemies || [])].find(x => x && x.name === i.name);
                return h('span', { class: 'slot' + (c && (c.dead || Number(c.hp) <= 0) ? ' out' : '') + (c && c.isPlayer ? ' you' : '') }, `${i.name} ${i.total}`);
            })));
        out.push(h('div', { class: 'rpgc-enc-side' }, h('h4', null, 'Enemies'), h('div', { class: 'rpgc-enc-grid' }, (cs.enemies || []).map(e => fighterCard(e, true, enc)))));
        out.push(h('div', { class: 'rpgc-enc-side' }, h('h4', null, 'Your side'), h('div', { class: 'rpgc-enc-grid' }, (cs.party || []).map(m => fighterCard(m, false, enc)))));
        out.push(encLog(enc));
        if (enc.error) {
            out.push(h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error));
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again')));
        } else if (busy) {
            out.push(h('div', { class: 'rpgc-status busy', role: 'status' }, 'The game master is working out what happens…'));
        } else {
            out.push(...combatActions(enc));
        }
        out.push(h('div', { class: 'rpgc-row', style: 'margin-top:4px' },
            h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: async () => {
                if (!(enc.log || []).length) {
                    const r0 = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Close the fight?', message: 'No rounds have been played yet, so there is nothing to write an aftermath about. The fight is closed and nothing is posted.', confirmLabel: 'Close fight' }) : { confirmed: window.confirm('No rounds played yet. Close the fight without posting anything?') };
                    if (r0?.confirmed) { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); }
                    return;
                }
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'End the fight now?', message: 'The game master writes the aftermath from what happened so far and posts it to the chat.', confirmLabel: 'End and summarize' }) : { confirmed: window.confirm('End the fight now and post the aftermath?') };
                if (res?.confirmed) encSend({ type: 'encounter_conclude', result: 'concluded early' });
            } }, 'End fight'),
            pastFightsBtn(),
            h('button', { class: 'rpgc-btn danger', disabled: busy ? true : null, onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Abandon the fight?', message: 'Nothing is posted to the chat and the fight is discarded.', variant: 'danger', confirmLabel: 'Abandon' }) : { confirmed: window.confirm('Abandon the fight without a summary?') };
                if (res?.confirmed) { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); }
            } }, 'Abandon')));
        return out;
    }

    function pastFightsBtn() {
        return h('button', { class: 'rpgc-btn', onclick: () => { send({ type: 'encounter_history', chatId: state.encounterFor || state.chatId }); state.showHistory = true; renderEncounter(); } }, 'Past fights');
    }

    function historyView() {
        const logs = state.encHistory || [];
        return [
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.showHistory = false; renderEncounter(); } }, 'Back')),
            logs.length ? logs.slice().reverse().map(lg => h('details', { class: 'rpgc-sec' },
                h('summary', null, `${new Date(lg.at).toLocaleString()} — ${lg.result || 'ended'}`),
                h('div', { class: 'rpgc-body' },
                    h('div', { class: 'rpgc-enc-log' }, (lg.log || []).map(e => h('div', null, h('div', { class: 'player' }, e.action), h('div', null, e.result), e.roll ? h('div', { class: 'roll' }, `\uD83C\uDFB2 ${e.roll.formula}: ${e.roll.value} — ${e.roll.band}`) : null))),
                    lg.summary ? h('p', { class: 'rpgc-note' }, lg.summary) : null)))
                : h('p', { class: 'rpgc-note' }, 'No past fights in this chat yet.')
        ];
    }

    function renderEncounter() {
        if (!encModal) return;
        if (state.showHistory) { encModal.root.replaceChildren(h('div', { class: 'rpgc-enc-stage' }, historyView())); return; }
        const enc = state.encounter;
        const busy = !!state.encounterBusy;
        let content;
        if (!enc) {
            content = busy ? [h('div', { class: 'rpgc-status busy', role: 'status' }, 'Setting up the fight…')] : renderEncounterStart();
        } else if (enc.phase === 'starting') {
            content = enc.error
                ? [h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error), h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again'),
                    h('button', { class: 'rpgc-btn', onclick: () => { send({ type: 'encounter_abandon', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); } }, 'Cancel'))]
                : [h('div', { class: 'rpgc-status busy', role: 'status' }, 'Setting up the fight…')];
        } else if (enc.phase === 'combat') {
            content = renderEncounterCombat(enc, busy);
        } else if (enc.phase === 'ending') {
            content = [encLog(enc), enc.error
                ? h('div', null, h('div', { class: 'rpgc-status error', role: 'alert' }, enc.error), h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => encSend({ type: 'encounter_retry' }) }, 'Try again')))
                : h('div', { class: 'rpgc-status busy', role: 'status' }, 'Writing the aftermath…')];
        } else {
            const label = String(enc.result || 'Over');
            content = [
                h('div', { class: 'rpgc-enc-result' }, label.charAt(0).toUpperCase() + label.slice(1)),
                encLog(enc),
                h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => { send({ type: 'encounter_dismiss', chatId: state.encounterFor || state.chatId }); encModal && encModal.dismiss(); } }, 'Close'))
            ];
        }
        const stage = h('div', { class: 'rpgc-enc-stage' }, content);
        const sn = enc?.combatStats?.styleNotes || {};
        const hue = ENV_HUES[String(sn.environmentType || '').toLowerCase()];
        if (hue !== undefined) {
            const light = TIME_LIGHT[String(sn.timeOfDay || '').toLowerCase()] ?? 26;
            stage.style.background = `linear-gradient(165deg, hsla(${hue}, 45%, ${light}%, .38), transparent 75%)`;
        }
        encModal.root.replaceChildren(stage);
        const kindTitle = ((enc && enc.system) || state.encKind) === 'narrative' ? 'Narrative fight (legacy)' : 'Turn-based fight';
        try { encModal.setTitle(enc && enc.phase === 'combat' ? `${kindTitle} · round ${(enc.log || []).length + 1}` : kindTitle); } catch { /* older host */ }
    }


    // ─────────── weather overlay ───────────

    let weatherLayer = null;
    let weatherKey = '';

    function parseHour(timeStr) {
        if (!timeStr) return null;
        const t = String(timeStr).toLowerCase();
        if (t.includes('dawn') || t.includes('sunrise')) return 6;
        if (t.includes('early morning')) return 7;
        if (t.includes('midday') || t.includes('noon')) return 12;
        if (t.includes('late afternoon')) return 16;
        if (t.includes('afternoon')) return 14;
        if (t.includes('morning')) return 9;
        if (t.includes('evening') || t.includes('dusk') || t.includes('sunset')) return 19;
        if (t.includes('twilight')) return 20;
        if (t.includes('midnight')) return 0;
        if (t.includes('late night')) return 2;
        if (t.includes('night')) return 22;
        const ampm = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/);
        if (ampm) { let h = parseInt(ampm[1], 10); const pm = ampm[3] === 'pm'; if (pm && h !== 12) h += 12; if (!pm && h === 12) h = 0; return h; }
        const mil = t.match(/(\d{1,2}):(\d{2})/);
        if (mil) return parseInt(mil[1], 10);
        return null;
    }
    function timeOfDay(hour) {
        if (hour === null) return 'day';
        if (hour >= 20 || hour < 5) return 'night';
        if (hour >= 5 && hour < 7) return 'dawn';
        if (hour >= 18 && hour < 20) return 'dusk';
        return 'day';
    }
    const WEATHER_PATTERNS = [
        ['blizzard', ['blizzard']],
        ['storm', ['storm', 'thunder', 'lightning']],
        ['wind', ['wind', 'breeze', 'gust', 'gale']],
        ['snow', ['snow', 'flurries']],
        ['rain', ['rain', 'drizzle', 'shower']],
        ['mist', ['mist', 'fog', 'haze']],
        ['sunny', ['sunny', 'clear', 'bright']],
        ['none', ['cloud', 'overcast', 'indoor', 'inside']]
    ];
    function weatherType(text) {
        if (!text) return 'none';
        const t = String(text).toLowerCase();
        for (const [id, pats] of WEATHER_PATTERNS) if (pats.some(p => t.includes(p))) return id;
        return 'none';
    }
    function currentWeather() {
        const b = state.data.infoBox;
        if (!isObj(b)) return { type: 'none', tod: 'day' };
        const w = b.weather;
        const forecast = isObj(w) ? (plain(w.forecast) || plain(w.emoji)) : plain(w);
        const timeObj = b.time;
        const timeStr = isObj(timeObj) ? (timeObj.end || timeObj.start) : plain(timeObj);
        return { type: weatherType(forecast), tod: timeOfDay(parseHour(timeStr)) };
    }
    function px(el, cls, styles) {
        const d = h('div', { class: 'rpgc-wp ' + cls });
        Object.assign(d.style, styles);
        el.appendChild(d);
        return d;
    }
    function buildWeather(type, tod) {
        const layer = h('div', { class: 'rpgc-weather-layer', 'aria-hidden': 'true' });
        layer.style.zIndex = S().weatherForeground ? '9998' : '0';
        const rnd = (a, b) => a + Math.random() * (b - a);
        const add = (type2) => {
            if (type2 === 'snow') for (let i = 0; i < 40; i++) { const f = px(layer, 'rpgc-snow', { left: rnd(0, 100) + '%', fontSize: rnd(8, 16) + 'px', animationDelay: rnd(0, 10) + 's', animationDuration: rnd(9, 18) + 's' }); f.textContent = '\u2744'; }
            if (type2 === 'rain') for (let i = 0; i < 80; i++) px(layer, 'rpgc-rain', { left: rnd(0, 100) + '%', animationDelay: rnd(0, 2) + 's', animationDuration: rnd(0.5, 1) + 's' });
            if (type2 === 'mist') for (let i = 0; i < 5; i++) px(layer, 'rpgc-mist', { top: rnd(0, 80) + '%', opacity: rnd(0.1, 0.3), animationDelay: (i * 2) + 's', animationDuration: (14 + i * 2) + 's' });
            if (type2 === 'wind') for (let i = 0; i < 22; i++) { const l = px(layer, 'rpgc-leaf', { left: rnd(-10, 40) + '%', top: rnd(0, 70) + '%', fontSize: rnd(8, 14) + 'px', animationDelay: rnd(0, 6) + 's', animationDuration: rnd(4, 9) + 's' }); l.textContent = '\u2022'; }
        };
        if (type === 'storm') { add('rain'); layer.appendChild(h('div', { class: 'rpgc-flash' })); const f = layer.lastChild; f.style.animationDuration = rnd(6, 10) + 's'; }
        else if (type === 'blizzard') { add('snow'); add('wind'); }
        else if (type === 'sunny') {
            const glow = h('div', { class: 'rpgc-glow' });
            if (tod === 'night') { Object.assign(glow.style, { width: '160px', height: '160px', right: '12%', top: '10%', background: 'radial-gradient(circle, rgba(220,225,255,.5), transparent 70%)' }); }
            else if (tod === 'dawn') { Object.assign(glow.style, { width: '200px', height: '200px', left: '10%', bottom: '12%', background: 'radial-gradient(circle, rgba(255,190,140,.45), transparent 70%)' }); }
            else if (tod === 'dusk') { Object.assign(glow.style, { width: '200px', height: '200px', right: '10%', bottom: '12%', background: 'radial-gradient(circle, rgba(255,150,120,.45), transparent 70%)' }); }
            else { Object.assign(glow.style, { width: '220px', height: '220px', right: '8%', top: '6%', background: 'radial-gradient(circle, rgba(255,230,150,.4), transparent 70%)' }); }
            layer.appendChild(glow);
        }
        else add(type);
        return layer;
    }
    function updateWeather() {
        const s = S();
        const wantOn = s && s.enabled && s.enableDynamicWeather && state.chatId && state.view === 'trackers';
        if (!wantOn) { removeWeather(); return; }
        const { type, tod } = currentWeather();
        const key = type + '|' + (type === 'sunny' ? tod : '') + '|' + (s.weatherForeground ? 'fg' : 'bg');
        if (type === 'none') { removeWeather(); weatherKey = ''; return; }
        if (key === weatherKey && weatherLayer) return;
        removeWeather();
        weatherKey = key;
        weatherLayer = buildWeather(type, tod);
        document.body.appendChild(weatherLayer);
    }
    function removeWeather() {
        if (weatherLayer) { weatherLayer.remove(); weatherLayer = null; }
    }

    // ─────────── music card ───────────

    function renderSong() {
        const s = S();
        if (!s || !s.enableSpotifyMusic || !state.song || !state.song.display) return null;
        const song = state.song;
        return h('div', { class: 'rpgc-song' },
            h('span', { class: 'note', 'aria-hidden': 'true' }, '\u266A'),
            h('div', { class: 'info' },
                h('div', { class: 't', title: song.song }, song.song),
                h('div', { class: 'a', title: song.artist }, song.artist)),
            h('a', { class: 'rpgc-btn', href: song.webUrl, target: '_blank', rel: 'noopener noreferrer', title: 'Open in Spotify' }, 'Play'),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Dismiss song', onclick: () => { state.song = null; render(); send({ type: 'dismiss_song', chatId: state.chatId }); } }, '\u2715'));
    }

    // ─────────── avatars ───────────

    function avatarKey(name) { return String(name || '').trim().toLowerCase(); }

    function requestAvatar(name) {
        const key = avatarKey(name);
        state.avatarBusy[key] = true;
        render();
        send({ type: 'generate_avatar', chatId: state.chatId, name });
    }
    function avatarFor(name) {
        const key = avatarKey(name);
        const a = state.avatars[key];
        return a && a.url ? a.url : null;
    }
    function avatarControls(name) {
        if (!S()?.enableAvatars) return null;
        const key = avatarKey(name);
        if (state.avatarBusy[key]) return h('span', { class: 'rpgc-note' }, 'drawing\u2026');
        const url = avatarFor(name);
        const draw = h('button', { class: 'rpgc-avatar-btn', onclick: () => requestAvatar(name) }, url ? 'Redraw' : 'Portrait');
        if (!url) return draw;
        return h('span', { class: 'rpgc-avatar-acts' }, draw,
            h('button', {
                class: 'rpgc-avatar-btn',
                'aria-label': `Remove the portrait of ${name}`,
                title: 'Remove this portrait',
                onclick: () => {
                    delete state.avatars[avatarKey(name)];
                    render();
                    send({ type: 'clear_avatar', chatId: state.chatId, name });
                }
            }, '\u2715'));
    }
    function avatarImg(name) {
        const url = avatarFor(name);
        if (!S()?.enableAvatars || !url) return null;
        return h('div', { class: 'rpgc-avatar-wrap' }, h('img', { class: 'rpgc-avatar', src: url, alt: `Portrait of ${name}`, loading: 'lazy' }));
    }


    // ─────────── HMS: World State panel ───────────

    const PIN_SVG = '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M9 3h6l-1 6 4 4H6l4-4z"/><path d="M12 13v8"/></svg>';

    function hmsOn() { return !!(state.hms && state.hms.active); }

    function pinBtn(line) {
        if (!state.chatId) return null;
        const on = !!(state.hms.pins && state.hms.pins[line.key]);
        const b = h('button', {
            class: 'rpgc-pin' + (on ? ' on' : ''),
            title: on ? 'Pinned: kept exactly as it is every turn' : 'Pin this line so it is always carried forward unchanged',
            'aria-label': `${on ? 'Unpin' : 'Pin'} ${line.key.replace(/^module:/, '')}`,
            'aria-pressed': on ? 'true' : 'false',
            onclick: (e) => {
                e.preventDefault();
                if (on) delete state.hms.pins[line.key]; else state.hms.pins[line.key] = line.text;
                render();
                send({ type: 'hud_pin', chatId: state.chatId, key: line.key });
            }
        });
        b.innerHTML = PIN_SVG;
        return b;
    }

    function fracParts(value) {
        const m = String(value || '').match(/^\s*(-?[\d,.]+)\s*\/\s*([\d,.]+)/);
        if (!m) return null;
        const cur = Number(m[1].replace(/,/g, ''));
        const max = Number(m[2].replace(/,/g, ''));
        if (!Number.isFinite(cur) || !Number.isFinite(max) || max <= 1) return null;
        return { cur, max };
    }

    function hudFieldEl(f) {
        const label = f.label;
        const frac = label && !/^(year|month|day|standings|seat)\b/i.test(label) ? fracParts(f.value) : null;
        if (frac) {
            return h('span', { class: 'rpgc-hud-f frac' },
                h('span', { class: 'l' }, label),
                statBar(frac.cur, frac.max),
                h('span', { class: 'v rpgc-stat-val' }, f.value));
        }
        return h('span', { class: 'rpgc-hud-f' }, label ? h('span', { class: 'l' }, label) : null, h('span', { class: 'v' + (label && /^(current\s+)?arc$/i.test(label) ? ' rpgc-hud-arc' : '') }, f.value));
    }

    function hudLineEl(line) {
        let body;
        if (line.kind === 'location') {
            const segs = line.segments && line.segments.length ? line.segments : [line.text];
            const parts = [];
            segs.forEach((sg, i) => {
                if (i) parts.push(h('span', { class: 'sep', 'aria-hidden': 'true' }, '\u203A'));
                parts.push(h('span', { class: 'seg' + (/^\(.*\)$/.test(sg) ? ' fold' : ''), title: /^\(.*\)$/.test(sg) ? 'A folded layer: connective, with no entry of its own' : null }, sg));
            });
            body = h('div', { class: 'body rpgc-hud-path', 'aria-label': 'Location' }, parts);
        } else if (line.kind === 'module') {
            body = h('div', { class: 'body' }, h('span', { class: 'rpgc-hud-mod' }, line.text.replace(/^\[|\]$/g, '')));
        } else {
            body = h('div', { class: 'body' }, (line.fields || [{ label: null, value: line.text }]).map(hudFieldEl));
        }
        const pinned = !!(state.hms.pins && state.hms.pins[line.key]);
        return h('div', { class: 'rpgc-hud-row' + (pinned ? ' pinned' : '') }, pinBtn(line), body);
    }

    function guardEl() {
        const g = state.hms.guard;
        if (!g) return null;
        const parts = [];
        if (g.noHud) {
            parts.push(h('div', { class: 'rpgc-status warning', role: 'status' }, 'The latest reply has no WORLD STATE HUD. The engine treats a missing HUD as a render fault, not a state change.'));
            parts.push(h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'hud_insert', chatId: state.chatId }) }, 'Put the last HUD back'),
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_dismiss', chatId: state.chatId }) }, 'Dismiss')));
        }
        if (g.swapped) {
            parts.push(h('div', { class: 'rpgc-status ok', role: 'status' }, 'The HUD template changed this turn \u2014 a mode swap, not dropped lines. Nothing to restore.'));
        }
        if (g.cleared && g.cleared.length) {
            parts.push(h('div', { class: 'rpgc-cleared' },
                h('span', { class: 'rpgc-note' }, 'Cleared this turn, as their own rules allow: '),
                g.cleared.map(x => h('span', { class: 'rpgc-chip' }, x.text.length > 60 ? x.text.slice(0, 57) + '\u2026' : x.text,
                    h('button', { class: 'rpgc-mini', title: 'If it should still be there, put it back', 'aria-label': `Put back ${x.text}`, onclick: () => send({ type: 'hud_restore', chatId: state.chatId, key: x.key }) }, '\u21BA')))));
        }
        if (g.missing && g.missing.length) {
            parts.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `${g.missing.length} line${g.missing.length === 1 ? '' : 's'} dropped since the last reply. If a line ended by its own rules, dismiss it. Otherwise restore it so its lorebook entry keeps firing.`));
            if (g.missing.some(x => x.carrier)) parts.push(h('div', { class: 'rpgc-status error', role: 'status' }, 'A carrier line is gone. Its printed text is what keeps its entry loaded, so everything that entry holds is dark until it is back.'));
            parts.push(h('div', { class: 'rpgc-guard' }, g.missing.map(x => h('div', { class: 'item' + (x.carrier ? ' carrier' : '') },
                x.carrier ? h('span', { class: 'rpgc-chip carrier', title: 'Carrier line' }, 'carrier') : null,
                h('span', { class: 'line' }, x.text),
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_restore', chatId: state.chatId, key: x.key }) }, 'Restore')))));
            parts.push(h('div', { class: 'rpgc-row' },
                g.missing.length > 1 ? h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'hud_restore', chatId: state.chatId }) }, 'Restore all') : null,
                h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'hud_dismiss', chatId: state.chatId }) }, 'They ended, dismiss')));
        }
        if (g.restored && g.restored.length) {
            parts.push(h('p', { class: 'rpgc-note' }, `Pinned line${g.restored.length === 1 ? '' : 's'} put back in the last reply: ${g.restored.map(k => k.replace(/^module:/, '')).join(', ')}.`));
        }
        return parts.length ? h('div', { class: 'rpgc-set' }, parts) : null;
    }


    function renderWorldState() {
        const hud = state.hms.hud;
        const content = [];
        // the start handlers' ARC NAME LAW: an Arc line that is no key loads nothing, silently
        const ac = state.hms.arcCheck;
        if (ac && ac.ok === false) {
            content.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `The Arc line "${ac.arc}" loads no arc entry from your lorebooks, so the arc and its quests are not in the story.${ac.suggest ? ` The book spells it "${ac.suggest}".` : ''}`));
            if (ac.suggest) content.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'arc_fix', chatId: state.chatId, value: ac.suggest }) }, `Use "${ac.suggest}"`)));
        }
        const g = guardEl();
        if (g) content.push(g);
        if (!hud) {
            const d = state.hms.noHud || { reason: 'no-reply' };
            const why = d.reason === 'no-reply' ? 'There is no reply in this chat yet. The HUD appears here as soon as the engine renders one.'
                : d.reason === 'in-thinking' ? 'The model wrote the WORLD STATE inside its thinking, not in the reply, so there is nothing to read in the reply itself.'
                : d.reason === 'not-alone' ? `The reply mentions WORLD STATE, but not as a heading on a line of its own: \u201C${d.wsLine}\u201D. The HUD starts with a line that reads only WORLD STATE (### WORLD STATE ### works).`
                : 'The latest reply has no WORLD STATE heading.';
            content.push(d.reason === 'no-reply' ? perchCard('Nothing to read yet', why, false) : h('p', { class: 'rpgc-note' }, why));
            if (d.head && d.head.length && d.reason !== 'no-reply') content.push(h('p', { class: 'rpgc-note rpgc-diag' }, h('b', null, 'It starts with: '), d.head.join(' \u23CE ')));
            if (d.reason !== 'no-reply') content.push(h('div', { class: 'rpgc-row' }, rereadButton('Read the last reply again')));
        } else {
            const rows = [];
            let blk = null;
            const shownElsewhere = (title) => !!((state.world && S()?.worldCard !== false && (state.world.blocks || []).some(b => String(title).toUpperCase().startsWith(b)))
                || (/^D&D CHARACTER SHEET/i.test(String(title)) && hudSheetNow() && dndOn() && (!isObj(S()?.dnd) || S().dnd.useHud !== false)));
            const pointed = new Set();
            for (const l of hud.lines) {
                if (l.block === 'fence') { blk = null; continue; }
                if (l.block && shownElsewhere(l.block)) {
                    const k = String(l.block).split(/\s+[\u2014\u2013-]\s+/)[0];
                    if (!pointed.has(k)) { pointed.add(k); rows.push(h('div', { class: 'rpgc-hud-block pointer' }, h('div', { class: 'row' }, `${k} \u2014 shown in the ${/D&D/.test(k) ? 'D&D' : state.world.label} card.`))); }
                    blk = null;
                    continue;
                }
                if (l.block) {
                    if (!blk) { blk = h('div', { class: 'rpgc-hud-block', title: 'An inline block: rendered by its own module, not a HUD line. The guard and pins leave it alone.' }); rows.push(blk); }
                    blk.appendChild(h('div', { class: 'row' }, l.text.replace(/^\s{0,2}/, '')));
                    continue;
                }
                blk = null;
                rows.push(hudLineEl(l));
            }
            content.push(h('div', { class: 'rpgc-hud' }, rows));
            const sysw = sysOf();
            if (sysw && sysw.rolls && sysw.rolls.length) content.push(h('div', { class: 'rpgc-rolls' }, sysw.rolls.map(r => h('div', { class: 'rpgc-rollline ' + (/SUCC|CRIT|PASS|HIT/.test(r.result) ? 'win' : /FAIL|MISS/.test(r.result) ? 'lose' : '') },
                '\uD83C\uDFB2 ', h('b', null, r.what), ` ${r.total}${r.dc !== null ? ` vs DC ${r.dc}` : ''} \u2192 `, h('b', null, r.result)))));
            if (sysw && sysw.notices && sysw.notices.length) content.push(h('ul', { class: 'rpgc-notices' }, sysw.notices.map(n => h('li', null, '\u2726 ' + n))));
            if (!Object.keys(state.hms.pins || {}).length) content.push(h('p', { class: 'rpgc-note' }, 'Pin a line to have it carried forward unchanged every turn.'));
        }
        if (hud && hud.fromHtml) content.push(h('p', { class: 'rpgc-note' }, 'This HUD was written in HTML and is read through it. The guard can flag dropped lines here, but cannot put them back into the reply.'));
        return section('world', 'World State', state.open, hud && hud.time ? hud.time : null, ...content);
    }

    function hmsStoryRow() {
        const s = S();
        if (!s || !s.enabled || !state.chatId) return null;
        const btns = [
            h('button', { class: 'rpgc-btn', title: 'Sends a short nudge as your turn: you do nothing new, and one off-screen thread advances a step, within everything the engine already allows', disabled: state.worldBusy ? true : null, onclick: () => {
                state.worldBusy = true;
                render();
                send({ type: 'world_moves', chatId: state.chatId });
                setTimeout(() => { state.worldBusy = false; render(); }, 5000);
            } }, 'Move the world')
        ];
        btns.push(...fightButtons());
        btns.push(rereadButton());
        return h('div', { class: 'rpgc-story' }, btns);
    }
    // Reads the latest reply again \u2014 its HUD and its side-panel block \u2014 the same way a new reply is read.
    // No model call, so it costs nothing: the manual way when the automatic read missed something.
    function rereadButton(label = 'Read again') {
        return h('button', { class: 'rpgc-btn', title: 'Read the latest reply again \u2014 its HUD and side-panel block \u2014 the way a new reply is read. No model call, so it costs nothing.', disabled: state.rereadBusy ? true : null, onclick: () => {
            if (!state.chatId) return;
            state.rereadBusy = true; render();
            send({ type: 'reread', chatId: state.chatId });
            setTimeout(() => { state.rereadBusy = false; render(); }, 2500);
        } }, label);
    }

    // A chat whose world has a preset of its own: offer it once, so a new player is set up in one click.
    function worldHint() {
        const s = S(), w = state.world;
        if (!s || !w || !w.id || s.worldCard === false) return null;
        const pid = 'w-' + w.id;
        const preset = WORLD_STYLES.find(x => x.id === pid);
        const sp = isObj(s.stylePresets) ? s.stylePresets : { presets: {}, active: 'hms' };
        const seen = Array.isArray(sp.hintSeen) ? sp.hintSeen : [];
        if (!preset || sp.active === pid || seen.includes(pid)) return null;
        const mark = (active) => { s.stylePresets = { ...sp, presets: sp.presets || {}, ...(active ? { active } : {}), hintSeen: [...seen, pid] }; };
        return h('div', { class: 'rpgc-status info rpgc-hint', role: 'note' },
            h('p', { class: 'rpgc-note' }, `This chat is ${w.label}. Its world preset sets the panel up for this bot in one click: the right cards, carrier lines, fights and theme. You can change everything after.`),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', onclick: () => { mark(pid); applyStyle(preset.data); } }, `Use the ${w.label} preset`),
                h('button', { class: 'rpgc-btn', onclick: () => { mark(null); saveSettings(false); render(); } }, 'No thanks')));
    }

    function renderHmsTrackers() {
        const s = S();
        const out = [topBar()];
        // 2.3: each card belongs to a page of the wide window; outside it they all show, in the same order as before
        const parts = [];
        const put = (page, el) => { if (el) parts.push([page, el]); };
        put('world', worldHint());
        put('world', hmsStoryRow());
        put('world', renderImmersive());
        put('world', renderSong());
        put('*', renderDanger());
        put('world', renderNow());
        put('world', renderWorldState());
        put('world', renderWorldCard());
        put('map', renderMap());
        put('map', renderAtlas());
        put('map', renderPlans());
        put('you', renderYou());
        put('you', renderOnYou());
        put('you', renderRace());
        put('you', renderHealth());
        put('you', renderDnd());
        put('people', renderPeopleAll());
        put('people', renderOffscreen());
        put('letters', renderPhone());
        put('letters', renderPaperShelf());
        put('you', renderBody());
        put('you', renderInjuries());
        put('you', renderMind());
        put('you', renderSurvival());
        put('magic', renderMagic());
        put('magic', renderAbilities());
        if (s.showQuests) put('story', renderHmsQuests());
        put('story', renderChronicle());
        put('story', renderPicturePrompt());
        put('story', renderChapter());
        state.wideHms = true;
        const counts = {};
        for (const [page] of parts) if (page !== '*') counts[page] = (counts[page] || 0) + 1;
        state.widePageCount = counts;
        for (const [page, el] of parts) if (wideShows(page)) { if (page !== '*' && el.dataset) el.dataset.rpgcPage = page; out.push(el); }
        if (!wideOn()) { const jb = pageJumpBar(); if (jb) out.splice(1, 0, jb); }
        const strip = tzStrip(); if (strip) out.splice(1, 0, strip);
        return out;
    }

    // ───────── 2.3: letters, notes, books and texts, to read again ─────────
    const PAPER_ICON = { letter: '✉️', note: '📝', book: '📖', text: '💬', sign: '📌', doc: '📄', exam: '💯', contract: '📜' };
    // 2.9: a writer's seal: wax colour and an emblem pressed into it
    function sealEl(seal, extra = '') {
        if (!seal) return null;
        return h('span', { class: 'rpgc-seal ' + extra, style: `--wax:${seal.wax}`, title: seal.desc || 'seal', 'aria-hidden': 'true' }, seal.emblem ? h('span', { class: 'em' }, seal.emblem) : (seal.letter || ''));
    }
    const SEAL_COLOURS = [['', 'No seal'], ['red', 'Red'], ['black', 'Black'], ['violet', 'Violet'], ['blue', 'Blue'], ['green', 'Green'], ['gold', 'Gold'], ['silver', 'Silver'], ['brown', 'Brown'], ['pink', 'Pink']];
    const SEAL_EMBLEMS = [['', 'Their initial'], ['crown', '👑 Crown'], ['sword', '🗡 Sword'], ['moon', '🌙 Moon'], ['sun', '☀ Sun'], ['star', '⭐ Star'], ['rose', '🌹 Rose'], ['lily', '⚜ Lily'], ['dragon', '🐉 Dragon'], ['wolf', '🐺 Wolf'], ['eagle', '🦅 Eagle'], ['lion', '🦁 Lion'], ['owl', '🦉 Owl'], ['serpent', '🐍 Serpent'], ['mask', '🎭 Mask'], ['skull', '💀 Skull'], ['key', '🗝 Key'], ['eye', '👁 Eye'], ['tower', '🏰 Tower'], ['book', '📖 Book'], ['snowflake', '❄ Snowflake'], ['flame', '🔥 Flame'], ['tree', '🌳 Tree'], ['scales', '⚖ Scales'], ['heart', '❤ Heart']];
    function paperCard(x) {
        const kind = PAPER_ICON[x.kind] ? x.kind : 'note';
        const head = [h('span', { class: 'kd' }, x.name || kind)];
        if (x.from) head.push(h('span', null, kind === 'text' ? '' : 'From ', h('b', null, x.from)));
        if (x.to) head.push(h('span', null, kind === 'exam' ? 'Name ' : 'To ', h('b', null, x.to)));
        if (x.when) head.push(h('span', { class: 'wh' }, x.when));
        const me = String(state.userName || '').trim().toLowerCase();
        const clean = (t) => String(t).replace(/\*\*([^*]+)\*\*/g, '$1').replace(/(^|\s)\*([^*]+)\*/g, '$1$2').replace(/`([^`]+)`/g, '$1');
        let body;
        if (kind === 'text') {
            const bubbles = [];
            for (const l of String(x.text || '').split('\n')) {
                const t = l.trim();
                if (!t) continue;
                const m = t.match(/^(?:\[?\d{1,2}:\d{2}\]?\s*)?([^:]{1,40}?):\s+(.+)$/);
                if (m) bubbles.push({ who: m[1].trim(), words: [m[2]] });
                else if (bubbles.length) bubbles[bubbles.length - 1].words.push(t);
                else bubbles.push({ who: x.from || '', words: [t] });
            }
            body = bubbles.map(b => h('span', { class: 'bub' + (/^(you|me)$/i.test(b.who) || (me && b.who.toLowerCase() === me) ? ' me' : '') }, b.who ? h('b', null, b.who) : null, clean(b.words.join('\n'))));
        } else if (kind === 'contract') {
            // 2.9: a contract: who is bound, the numbered terms, the price of breaking it, the signatures
            const lines = String(x.text || '').split('\n').map(l => l.trim()).filter(Boolean);
            const isTerm = (l) => /^(?:\d{1,2}[.)]|[ivxlc]{1,6}[.)]|[-•*]|§\s*\d+|art(?:icle)?\.?\s*\d+|clause\s*\d+)\s+/i.test(l);
            const rest = lines.filter(l => !isTerm(l) && !/^(signed|signature|sealed by|witness)/i.test(l) && !/^(terms(?: and conditions)?|conditions|clauses?)\s*:?$/i.test(l) && !(x.penalty && x.penalty.includes(l)));
            body = [
                (x.parties || []).length ? h('p', { class: 'between' }, 'Between ' + x.parties.join(' and ')) : null,
                ...rest.map(l => h('p', null, clean(l))),
                (x.terms || []).length ? h('ol', { class: 'terms' }, x.terms.map(t => h('li', null, clean(t)))) : null,
                x.penalty ? h('p', { class: 'penalty' }, clean(x.penalty)) : null,
                h('div', { class: 'signs' }, ...((x.signed || []).length ? x.signed : x.parties || []).map(n => h('span', { class: 'sig' }, h('span', { class: 'ink' }, (x.signed || []).length ? n : ''), h('span', { class: 'line' }, n), x.sigSeals && x.sigSeals[n] ? sealEl(x.sigSeals[n]) : null)),
                    x.cseal ? h('span', { class: 'sig' }, h('span', { class: 'ink' }), h('span', { class: 'line' }, 'Seal'), sealEl(x.cseal)) : null),
            ];
        } else if (kind === 'exam') {
            body = String(x.text || '').split(/\n\s*\n/).map(p => h('p', null, ...p.trim().split('\n').flatMap((l, i) => {
                const t = l.trim(), cls = /^[✓✔]|[✓✔]\s*$/.test(t) ? 'ok' : /^[✗✘×]|[✗✘×]\s*$/.test(t) ? 'no' : /^(remarks?|comments?|teacher|examiner|feedback|note)\s*[:—-]/i.test(t) ? 'red' : '';
                return [i ? h('br') : null, cls ? h('span', { class: cls }, clean(t)) : clean(t)];
            })));
        } else body = String(x.text || '').split(/\n\s*\n/).map(p => h('p', null, clean(p.trim())));
        const showHead = !['book', 'sign', 'contract'].includes(kind) || x.from || x.to || x.when;
        const ok = kind === 'exam' && x.pass != null && x.mark != null ? x.mark >= x.pass : null;
        const stamp = x.stamp || (kind === 'exam' && ok !== null ? (ok ? 'Passed' : 'Failed') : kind === 'contract' && x.status === 'ended' ? 'Void' : '');
        return h('div', { class: 'rpgc-paper ' + kind + (kind === 'contract' && x.status === 'ended' ? ' ended' : ''), role: 'document', 'aria-label': [x.name, x.title, x.from ? 'from ' + x.from : '', kind === 'exam' && x.mark != null ? `mark ${x.mark} out of 100` : ''].filter(Boolean).join(' ') },
            kind === 'exam' ? h('span', { class: 'score' }, x.mark != null ? String(x.mark) : (x.grade || '?'), x.mark != null ? h('small', null, '/100') : null) : null,
            showHead ? h('div', { class: 'ph' }, ...head) : null,
            x.title ? h('span', { class: 'pt' }, x.title) : null,
            ...body,
            kind === 'book' && x.page ? h('p', { style: 'text-align:center;font-size:12px;opacity:.65;margin-top:8px' }, x.page) : null,
            stamp ? h('span', { class: 'stamp' + (/pass|approv|accept|granted|paid|merit|honou?r/i.test(stamp) ? ' ok' : '') }, stamp) : null,
            kind !== 'text' && kind !== 'sign' && x.seal ? sealEl(x.seal, 'onpaper') : null);
    }
    function renderPaperShelf() {
        const list = state.hms && Array.isArray(state.hms.papers) ? state.hms.papers : [];
        if (!list.length) return null;
        const items = list.slice().reverse();
        const pick = Math.max(0, Math.min(items.length - 1, Number(state.paperPick) || 0));
        const label = (x) => x.title || (x.from ? `${x.name} from ${x.from}` : x.name);
        return section('papers', 'Letters and notes', state.open, String(list.length),
            h('p', { class: 'rpgc-note' }, 'Everything written that you have read in this story, newest first. Press one to read it again.'),
            h('div', { class: 'rpgc-shelf' }, items.slice(0, 40).map((x, i) => h('button', { type: 'button', 'aria-pressed': i === pick ? 'true' : 'false', onclick: () => { state.paperPick = i; render(); } },
                h('span', { 'aria-hidden': 'true' }, PAPER_ICON[x.kind] || PAPER_ICON.note), h('span', { class: 't' }, label(x)),
                x.kind === 'exam' && x.mark != null ? h('span', { class: 'rpgc-chip' + (x.pass != null && x.mark < x.pass ? ' hot' : '') }, String(x.mark)) : null,
                x.kind === 'contract' && x.status === 'ended' ? h('span', { class: 'rpgc-chip' }, 'ended') : null))),
            paperCard(items[pick]),
            paperTools(items[pick]),
            paperGrades(list),
            paperContracts(list));
    }
    // 2.9: the writer's seal by hand, and a contract ended by hand
    function paperTools(x) {
        if (!x) return null;
        const whos = x.kind === 'contract' ? (x.parties || []).slice(0, 3) : x.from ? [x.from] : [];
        const out = [];
        if (x.kind !== 'text' && x.kind !== 'sign') for (const who of whos) {
            const own = x.kind === 'contract' ? (x.sigSeals || {})[who] : x.seal;
            const cur = own && own.desc ? own.desc.toLowerCase() : '';
            const colour = (SEAL_COLOURS.find(([v]) => v && new RegExp('\\b' + v + '\\b').test(cur)) || [''])[0];
            const emblem = (SEAL_EMBLEMS.find(([v]) => v && cur.includes(v)) || [''])[0];
            const setSeal = (c, e) => send({ type: 'paper_op', chatId: state.chatId, op: 'seal', name: who, seal: c ? `${c} wax${e ? ', a ' + e : ''}` : '' });
            out.push(h('div', { class: 'rpgc-sealrow' }, h('span', null, `${who}\u2019s seal`), own ? sealEl(own) : null,
                h('select', { 'aria-label': `Wax colour of ${who}'s seal`, onchange: (e) => setSeal(e.target.value, emblem) }, SEAL_COLOURS.map(([v, l]) => h('option', { value: v, selected: v === colour ? '' : null }, l))),
                h('select', { 'aria-label': `Emblem of ${who}'s seal`, disabled: colour ? null : '', onchange: (e) => setSeal(colour || 'red', e.target.value) }, SEAL_EMBLEMS.map(([v, l]) => h('option', { value: v, selected: v === emblem ? '' : null }, l)))));
        }
        if (x.kind === 'contract' && x.id) out.push(h('div', { class: 'rpgc-actions' },
            x.status === 'ended' && !x.endedByHand ? h('span', { class: 'rpgc-note' }, 'The story ended this contract.')
                : h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'paper_op', chatId: state.chatId, op: 'end', id: x.id, on: x.status !== 'ended' }) }, x.status === 'ended' ? 'It still binds' : 'Mark this contract as ended')));
        return out.length ? h('div', { class: 'rpgc-papertools' }, ...out) : null;
    }
    function paperGrades(list) {
        const ex = list.filter(x => x.kind === 'exam' && x.mark != null);
        if (!ex.length) return null;
        const avg = Math.round(ex.reduce((a, x) => a + x.mark, 0) / ex.length);
        return h('div', { class: 'rpgc-grades' }, h('h4', null, `Grades \u00B7 average ${avg}`),
            h('ul', { class: 'rpgc-plain' }, ex.slice(-12).reverse().map(x => h('li', null, h('b', null, String(x.mark)), ` ${x.title || 'Exam'}${x.to ? ` (${x.to})` : ''}`, x.pass != null ? h('span', { class: 'rpgc-chip' + (x.mark < x.pass ? ' hot' : '') }, x.mark < x.pass ? `below ${x.pass}` : 'passed') : null))));
    }
    function paperContracts(list) {
        const last = new Map();
        for (const x of list) if (x.kind === 'contract' && x.id) last.set(x.id, x);
        const all = [...last.values()];
        if (!all.length) return null;
        return h('div', { class: 'rpgc-contracts' }, h('h4', null, 'Contracts'),
            h('ul', { class: 'rpgc-plain' }, all.map(x => h('li', null, '\uD83D\uDCDC ', h('b', null, x.title || 'Contract'), (x.parties || []).length ? ` \u2014 ${x.parties.join(' & ')}` : '', ' ', h('span', { class: 'rpgc-chip' + (x.status === 'ended' ? '' : ' hot') }, x.status === 'ended' ? 'ended' : 'in force')))),
            h('p', { class: 'rpgc-note' }, 'Contracts in force are told to the story with the statuses, so it keeps their terms.'));
    }

    function renderHmsQuests() {
        const sys = sysOf();
        const legacy = (state.hms && state.hms.hud && state.hms.hud.quests) || [];
        const quests = sys ? sys.quests : legacy.map(q => ({ name: q.name, state: q.state, cls: 'active' }));
        const objectives = sys ? sys.objectives : [];
        const journal = sys ? sys.journal : [];
        const dropped = journal.filter(j => j.dropped);
        const finished = journal.filter(j => !j.dropped);
        const notes = (state.hms && state.hms.questNotes) || [];
        const items = [...renderPlotObjectives()];
        const chekhov = renderChekhov();
        if (quests.length) {
            items.push(h('h4', null, 'On the HUD'));
            const focus = sys && sys.questFocus;
            const due = (m) => m === null || m === undefined ? null : m < 0 ? h('span', { class: 'rpgc-chip hot' }, 'overdue') : h('span', { class: 'rpgc-chip' + (m < 1440 ? ' hot' : '') }, `due in ${fmtSpan(m)}`);
            const sorted = quests.slice().sort((a, b) => ((b.key === focus) - (a.key === focus)) || ((a.category === 'main' ? 0 : 1) - (b.category === 'main' ? 0 : 1)));
            items.push(h('div', { class: 'rpgc-cards' }, sorted.map(q => h('div', { class: 'rpgc-qcard ' + q.cls + (q.key && q.key === focus ? ' focus' : '') },
                h('div', { class: 'qhead' },
                    q.key ? h('button', { class: 'rpgc-mini star', 'aria-label': q.key === focus ? 'Unfocus this quest' : 'Focus this quest', title: 'Focus quest', onclick: () => send({ type: 'quest_focus', chatId: state.chatId, name: q.name }) }, q.key === focus ? '\u2605' : '\u2606') : null,
                    h('span', { class: 'name' }, q.name),
                    q.category ? h('span', { class: 'rpgc-chip' }, q.category) : null,
                    q.state ? h('span', { class: 'qst ' + q.cls }, q.state) : q.fromStory ? h('span', { class: 'qst active' }, 'in the story') : null),
                q.objective ? h('div', { class: 'obj' }, '\u25B8 ' + q.objective) : null,
                q.progress !== null && q.progress !== undefined ? levelBar(q.progress, 'ok') : null,
                (q.giver || q.where || q.reward || q.dueIn !== undefined) ? h('div', { class: 'rpgc-chips' },
                    q.giver ? h('span', { class: 'rpgc-chip' }, h('em', null, 'From: '), q.giver) : null,
                    q.where ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Where: '), q.where) : null,
                    q.reward ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Reward: '), q.reward) : null,
                    due(q.dueIn)) : null))));
        }
        for (const g of objectives) {
            items.push(h('h4', null, g.title));
            items.push(h('ul', { class: 'rpgc-objs' }, g.items.map(o => h('li', { class: o.status },
                h('span', { class: 'mark', 'aria-hidden': 'true' }, o.status === 'done' ? '\u2713' : o.status === 'active' ? '\u25B8' : '\u25CB'),
                h('span', { class: 'sr' }, o.status === 'done' ? 'Done: ' : o.status === 'active' ? 'In progress: ' : 'Not started: '),
                o.text))));
        }
        if (dropped.length) {
            items.push(h('div', { class: 'rpgc-status warning', role: 'status' }, `${dropped.length === 1 ? 'A quest' : dropped.length + ' quests'} left the HUD while still live. The printed name is what loads a quest\u2019s entry, so if it is not over, the story can no longer see it.`));
            items.push(h('div', { class: 'rpgc-guard' }, dropped.map(j => h('div', { class: 'item' },
                h('span', { class: 'line' }, j.name + (j.last ? ` \u2014 ${j.last}` : '')),
                h('button', { class: 'rpgc-btn', title: 'Write it back onto the Quests line of the latest reply', onclick: () => send({ type: 'quest_restore', chatId: state.chatId, name: j.name, state: j.last || null }) }, 'Put back')))));
        }
        if (finished.length) {
            const list = h('ul', { class: 'rpgc-list rpgc-journal' }, finished.map(j => h('li', null,
                h('span', { class: 'grow' }, j.name),
                h('span', { class: 'qst ' + j.cls }, j.last || 'ended'),
                j.states.length > 1 ? h('span', { class: 'path', title: 'How it moved' }, j.states.map(x => x.state || '\u2014').join(' \u2192 ')) : null)));
            const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, `Journal (${finished.length})`), list);
            det.open = state.open['quest-journal'] === true;
            det.dataset.openKey = 'quest-journal'; det.addEventListener('toggle', () => { state.open['quest-journal'] = det.open; });
            items.push(det);
        }
        items.push(...chekhov);
        items.push(h('h4', null, 'Your notes'));
        if (notes.length) {
            items.push(h('ul', { class: 'rpgc-list' }, notes.map(n => h('li', { class: 'rpgc-quest' },
                h('span', { class: 'grow' }, editable(n.text, v => { if (v) send({ type: 'quest_note', chatId: state.chatId, op: 'edit', id: n.id, text: v }); }, { label: 'Quest note' })),
                h('button', { class: 'st ' + (n.state || 'open'), title: 'Cycle state', onclick: () => send({ type: 'quest_note', chatId: state.chatId, op: 'cycle', id: n.id }) }, n.state || 'open'),
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${n.text}`, onclick: () => send({ type: 'quest_note', chatId: state.chatId, op: 'remove', id: n.id }) }, '\u2715')))));
        }
        const input = h('input', { type: 'text', placeholder: 'Add a quest note', 'aria-label': 'Add a quest note' });
        const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'quest_note', chatId: state.chatId, op: 'add', text: v }); };
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        items.push(h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
        items.push(h('p', { class: 'rpgc-note' }, 'Notes are yours and never sent to the model. Quest names are never injected either: in these engines a printed name loads its entry, so only the engine writes them.'));
        const badge = dropped.length ? `${dropped.length} dropped` : quests.length ? String(quests.length) : (notes.length ? String(notes.length) : null);
        if (!items.length) return null;
        return section('quests', 'Quests', state.open, badge, ...items);
    }
    function sysCfg() {
        const s = S();
        return (s && s.hmsSystems) || {};
    }
    function sysOf() {
        return (state.hms && state.hms.systems) || null;
    }
    function fmtSpan(min) {
        if (min === null || min === undefined || !Number.isFinite(min)) return '';
        const m = Math.max(0, Math.round(min));
        if (m < 60) return `${m}m`;
        const hh = Math.floor(m / 60);
        if (hh < 48) return `${hh}h${m % 60 ? ' ' + (m % 60) + 'm' : ''}`;
        const d = Math.floor(hh / 24);
        return `${d}d${hh % 24 ? ' ' + (hh % 24) + 'h' : ''}`;
    }
    function fmtNum(n) {
        return Number(n).toLocaleString('en-US', { maximumFractionDigits: 1 });
    }
    function levelBar(pct, level) {
        const fill = h('i', { class: level || 'ok' });
        fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
        return h('div', { class: 'rpgc-bar rpgc-lvbar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(Math.round(pct)) }, fill);
    }
    function ladder(rank, max, recovering) {
        const cells = [];
        for (let i = 1; i <= (max || 4); i++) {
            const cls = i <= rank ? (i === max ? 'on top' : 'on') : '';
            cells.push(h('i', { class: cls }));
        }
        return h('span', { class: 'rpgc-ladder' + (recovering ? ' rec' : ''), role: 'img', 'aria-label': `stage ${rank} of ${max}` }, cells);
    }

    function renderDanger() {
        const sys = sysOf();
        if (!sys || !sys.danger || !sys.danger.length) return null;
        return h('div', { class: 'rpgc-danger', role: 'alert' },
            h('strong', null, 'Critical'),
            h('span', null, sys.danger.join(' \u00B7 ')));
    }


    const WOUND_LABEL = { raw: 'untreated', treated: 'stable, still there', healed: 'closed', permanent: 'no restoration path', cosmetic: 'cosmetic', other: '' };

    function renderBody() {
        if (state.hms && state.hms.health && state.hms.health.mode === 'read' && (sysCfg().health || {}).enabled !== false) return null;   // 2.6: the Body & health card shows them
        const sys = sysOf();
        const c = (sysCfg().body) || {};
        if (!sys) return null;
        const wounds = c.wounds === false ? [] : sys.wounds;
        const conds = c.conditions === false ? [] : sys.conditions.filter(x => !x.mind);
        if (!wounds.length && !conds.length && !sys.healed.length && !sys.cleared.filter(n => !sys.conditions.some(x => x.name === n)).length) return null;
        const out = [];
        if (wounds.length) {
            out.push(h('h4', null, 'Wounds'));
            out.push(h('div', { class: 'rpgc-cards' }, wounds.map(w => h('div', { class: 'rpgc-wound ' + w.cls + (w.warn ? ' warn' : '') },
                h('div', { class: 'head' },
                    h('span', { class: 'name' }, w.name),
                    w.tag ? h('span', { class: 'tag ' + w.cls, title: WOUND_LABEL[w.cls] || '' }, w.cls === 'permanent' ? '\uD83D\uDD12 ' + w.tag : w.tag) : null),
                h('div', { class: 'meta' },
                    w.inTag === null || w.inTag === undefined ? null
                        : w.inTag < 1 ? (w.age >= 1 ? `${w.tag || 'Changed'} this turn` : 'New this turn')
                        : `${w.tag || 'This'} for ${fmtSpan(w.inTag)}`,
                    w.age !== null && w.age !== undefined && w.age >= 1 && w.age !== w.inTag ? ` \u00B7 ${fmtSpan(w.age)} old` : null,
                    w.warn ? h('span', { class: 'warn' }, /fractur|broken|break|shatter/i.test(w.name) ? ' \u00B7 a break left unset 3\u20134 days heals crooked \u2014 Permanent' : /burn|scald/i.test(w.name) ? ' \u00B7 a burn left raw this long risks infection' : ' \u00B7 untreated this long risks infection and lasting damage') : null)))));
        }
        if (conds.length) {
            out.push(h('h4', null, 'Conditions'));
            out.push(h('div', { class: 'rpgc-cards' }, conds.map(condCard)));
        }
        const gone = [...sys.healed.map(n => `${n} healed`), ...sys.cleared.filter(n => !sys.conditions.some(x => x.name === n)).map(n => `${n} cleared`)];
        if (gone.length) out.push(h('p', { class: 'rpgc-note' }, 'Since the last reply: ' + gone.join(', ') + '.'));
        return section('body', 'Body', state.open, wounds.length || conds.length ? String(wounds.length + conds.length) : null, ...out);
    }

    function condCard(cd) {
        const arrow = cd.trend === 'up' ? '\u2191 worse' : cd.trend === 'down' ? '\u2193 easing' : cd.trend === 'new' ? 'new' : null;
        return h('div', { class: 'rpgc-cond' + (cd.critical ? ' critical' : '') + (cd.recovering ? ' rec' : '') },
            h('div', { class: 'head' },
                h('span', { class: 'name' }, cd.name),
                cd.rank ? ladder(cd.rank, cd.max, cd.recovering) : null,
                arrow ? h('span', { class: 'trend ' + cd.trend }, arrow) : null),
            h('div', { class: 'meta' },
                cd.stage ? cd.stage : null,
                cd.recovering ? ' \u00B7 recovering' : null,
                cd.detail ? ` \u00B7 ${cd.detail}` : null,
                cd.inStage ? ` \u00B7 ${fmtSpan(cd.inStage)} at this stage` : null));
    }

    const MIND_WORDS = ['calm', 'uneasy', 'agitated', 'frightened', 'panicked', 'broken'];

    function renderMind() {
        const sys = sysOf();
        if (!sys) return null;
        const conds = sys.conditions.filter(x => x.mind);
        const flags = sys.flags.filter(f => f.mind);
        const sv = sys.survival;
        const tracked = sv && !sv.paused && sv.mind && sv.mind.owner === 'tracked' ? sv.mind : null;
        if (!conds.length && !flags.length && !tracked && !sys.immunities.mindDampened) return null;
        const out = [];
        if (conds.length) out.push(h('div', { class: 'rpgc-cards' }, conds.map(condCard)));
        if (flags.length) out.push(h('div', { class: 'rpgc-chips' }, flags.map(f => h('span', { class: 'rpgc-chip mind', title: f.group || 'Status' }, f.group ? h('em', null, f.group + ': ') : null, f.name + (f.detail ? ` (${f.detail})` : '')))));
        if (sys.immunities.mindDampened) out.push(h('p', { class: 'rpgc-note' }, 'Emotion Suppression is active: strong feelings are forced back to calm.'));
        if (tracked) {
            const idx = Math.max(0, MIND_WORDS.indexOf(tracked.value));
            const btns = MIND_WORDS.map((w, i) => h('button', {
                class: 'rpgc-mind-step' + (i === idx ? ' on' : '') + (i >= 4 ? ' hot' : ''),
                'aria-pressed': i === idx ? 'true' : 'false',
                title: `Set state of mind: ${w}`,
                onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'mind', value: w })
            }, w));
            out.push(h('div', { class: 'rpgc-mind-scale', role: 'group', 'aria-label': 'State of mind' }, btns));
            out.push(h('p', { class: 'rpgc-note' },
                tracked.src === 'story' ? 'Read from the story.' : tracked.src === 'you' ? 'Set by you.' : 'No reading yet.',
                tracked.since ? ` For ${fmtSpan(tracked.since)}.` : '',
                ((sysCfg().survival || {}).tellModel !== false) ? ' The story is told your state of mind with every message while it is not calm.' : ' Only you see it; the survival clock is not telling the story.'));
        } else if (sv && sv.mind && sv.mind.owner === 'hud') {
            out.push(h('p', { class: 'rpgc-note' }, 'The HUD tracks state of mind here, so the survival clock stays out of it.'));
        }
        return section('mind', 'Mind', state.open, conds.length ? conds.map(c => c.stage ? `${c.name} \u00B7 ${c.stage}` : c.name).join(', ') : (tracked ? tracked.value : null), ...out);
    }

    const TRACK_LABEL = { fatigue: 'Fatigue', hunger: 'Hunger', thirst: 'Thirst' };
    const TRACK_SINCE = { fatigue: 'awake', hunger: 'since a meal', thirst: 'since a drink' };

    function renderSurvival() {
        const sys = sysOf();
        const c = sysCfg().survival || {};
        if (!sys || !c.enabled) return null;
        const sv = sys.survival;
        const out = [];
        if (!sv || sv.paused) {
            out.push(h('p', { class: 'rpgc-note' }, (sv && sv.reason) || 'Waiting for a HUD with a clock.'));
            return section('survival', 'Survival', state.open, 'paused', ...out);
        }
        for (const t of sv.tracks) {
            if (t.owner === 'off') continue;
            let right, bar = null;
            if (t.owner === 'immune') right = h('span', { class: 'own' }, `not needed (${t.immuneReason})`);
            else if (t.owner === 'hud') right = h('span', { class: 'own' }, `the HUD owns this: ${t.hudText}`);
            else if (t.owner === 'body') right = h('span', { class: 'own' }, 'kept by Body & health');
            else {
                right = h('span', { class: 'num' }, t.minutes < 1 ? `${t.stageName} \u00B7 just now` : `${t.stageName} \u00B7 ${fmtSpan(t.minutes)} ${TRACK_SINCE[t.id]}`);
                bar = ladder(t.stage, 4, false);
            }
            out.push(h('div', { class: 'rpgc-surv' + (t.owner === 'tracked' && t.stage >= 3 ? ' hot' : '') },
                h('span', { class: 'lbl' }, TRACK_LABEL[t.id]), bar, right));
        }
        const logBtn = (kind, label, title) => h('button', { class: 'rpgc-btn', title, onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'add', kind }) }, label);
        out.push(h('div', { class: 'rpgc-row rpgc-surv-acts' },
            logBtn('slept', 'Slept', 'A proper sleep, logged at the current HUD time'),
            logBtn('rested', 'Rested', `A short break: takes ${c.restCreditHours || 4}h off the awake counter`),
            logBtn('ate', 'Ate', 'A real meal, logged at the current HUD time'),
            logBtn('drank', 'Drank', 'A drink, logged at the current HUD time'),
            h('button', { class: 'rpgc-mini', title: 'Undo the last thing you logged', 'aria-label': 'Undo last log entry', onclick: () => send({ type: 'survival_log', chatId: state.chatId, op: 'undo' }) }, '\u21B6')));
        if (c.askCompanion && !S().hmsCompanion) out.push(h('p', { class: 'rpgc-note' }, 'Automatic tracking rides on the side-panel block, which is switched off. Use the buttons, or turn on \u201CAsk for present characters and thoughts.\u201D'));
        const worst = Math.max(0, ...sv.tracks.filter(t => t.owner === 'tracked').map(t => t.stage));
        out.push(h('p', { class: 'rpgc-note rpgc-tells' }, c.tellModel !== false
            ? 'The story is told these with every message once they are not fine \u2014 tired, hungry, thirsty \u2014 and your state of mind once it is not calm, so it can play them. The buttons log what you did; the story reports it too.'
            : 'Only you see these. Switch on \u201CTell the story\u201D under HMS systems \u2192 Survival clock to send them.'));
        return section('survival', 'Survival', state.open, worst ? sv.tracks.filter(t => t.owner === 'tracked' && t.stage === worst).map(t => t.stageName).join(', ') : 'fine', ...out);
    }

    function renderAbilities() {
        const sys = sysOf();
        const c = sysCfg().abilities || {};
        if (!sys || c.enabled === false || (!sys.abilities.length && !(sys.attributes || []).length)) return null;
        const covers = new Set((state.world && S()?.worldCard !== false && state.world.covers) || []);
        const groups = sys.abilities.map(g => ({ ...g, items: g.items.filter(it => !(it.src && covers.has(String(it.src).toUpperCase()))) })).filter(g => g.items.length);
        if (!groups.length && !(sys.attributes || []).length) return null;
        // 2.8: skills (learned: they level up or evolve) apart from traits (born with: always on); anything else after
        const SKILL_RE = /skill|abilit|martial|class|talent|craft|magic|spell|technique|art\b|arts\b|school|tradition|style/i;
        const TRAIT_RE = /trait|passive|divine protection|blessing|resistan|racial|innate|gift|nature|instinct|curse/i;
        const kindOf = (g) => TRAIT_RE.test(g.category) ? 'trait' : SKILL_RE.test(g.category) ? 'skill' : 'other';
        if (c.split !== false && groups.length > 1) {
            const order = { skill: 0, trait: 1, other: 2 };
            groups.sort((a, b) => order[kindOf(a)] - order[kindOf(b)]);
        }
        let lastKind = null;
        const out = groups.flatMap(g => [c.split !== false && kindOf(g) !== lastKind ? (lastKind = kindOf(g), h('div', { class: 'rpgc-abilkind' }, h('b', null, { skill: 'Skills', trait: 'Traits', other: 'Other' }[kindOf(g)]),
            h('small', null, { skill: ' \u2014 learned: they level up or evolve', trait: ' \u2014 born with: always on', other: ' \u2014 titles, contracts, items, roles' }[kindOf(g)]))) : null, h('div', { class: 'rpgc-abil' },
            h('h4', null, g.category),
            h('div', { class: 'rpgc-chips' }, g.items.map(it => h('span', { class: 'rpgc-chip abil', title: [it.label, it.state].filter(Boolean).join(' \u00B7 ') || null },
                it.label ? h('em', null, it.label + ': ') : null,
                it.name,
                it.level ? h('span', { class: 'lv' }, ` Lv ${it.level}`) : null,
                it.state ? h('span', { class: 'st' }, ` (${it.state})`) : null))))]);
        for (const g of (sys.attributes || [])) {
            out.push(h('div', { class: 'rpgc-abil' },
                h('h4', null, g.title.replace(/^\[/, '')),
                h('div', { class: 'rpgc-attrs' }, g.items.map(it => h('span', { class: 'rpgc-attr' }, h('b', null, it.name), h('span', null, it.value))))));
        }
        const n = groups.reduce((a, g) => a + g.items.length, 0);
        return section('abilities', 'Skills & traits', state.open, n ? String(n) : null, ...out);
    }

    function renderHmsSystemsSettings() {
        const s = S();
        if (!s.hmsSystems) s.hmsSystems = {};
        const hs = s.hmsSystems;
        const node = (path) => {
            let o = hs;
            for (const k of path.slice(0, -1)) { if (!isObj(o[k])) o[k] = {}; o = o[k]; }
            return o;
        };
        const get = (path) => node(path)[path[path.length - 1]];
        const set = (path, v) => { node(path)[path[path.length - 1]] = v; };
        const tog = (label, path, note) => toggle(label, () => get(path) !== false, v => set(path, v), note);
        const area = (label, path, note, rows = 4) => h('div', { class: 'rpgc-set' },
            h('h4', null, label),
            note ? h('p', { class: 'rpgc-note' }, note) : null,
            h('textarea', { rows: String(rows), value: get(path) || '', 'aria-label': label, onchange: (e) => { set(path, e.target.value); saveSettings(false); } }));
        const num = (label, path, min, max, note) => h('div', { class: 'rpgc-row' },
            h('span', { class: 'lbl' }, label),
            h('input', { type: 'number', min: String(min), max: String(max), value: String(get(path) ?? ''), 'aria-label': label, onchange: (e) => { const v = Number(e.target.value); if (Number.isFinite(v)) { set(path, v); saveSettings(false); } } }),
            note ? h('span', { class: 'rpgc-note' }, note) : null);
        const txt = (label, path, note) => h('div', { class: 'rpgc-row' },
            h('span', { class: 'lbl' }, label),
            h('input', { type: 'text', value: get(path) || '', 'aria-label': label, onchange: (e) => { set(path, e.target.value); saveSettings(false); } }),
            note ? h('span', { class: 'rpgc-note' }, note) : null);
        const sub = (title) => h('h4', { class: 'rpgc-subhead' }, title);
        const survOn = get(['survival', 'enabled']) === true;
        return section('s-hmssys', 'HMS systems', state.open, null,
            h('p', { class: 'rpgc-note' }, 'Everything here reads what the engine already prints. Nothing edits the HUD except the explicit repair buttons.'),
            sub('Vitals'),
            tog('Show vitals', ['vitals', 'enabled']),
            txt('Resource pools', ['vitals', 'pools'], 'HUD labels read as current/max bars.'),
            txt('Health pools', ['vitals', 'healthPools'], 'The ones that can go critical.'),
            txt('Rising-is-bad meters', ['vitals', 'invertedMeters'], 'Percent meters where high is dangerous.'),
            num('Low below (%)', ['vitals', 'lowPct'], 1, 90),
            num('Critical below (%)', ['vitals', 'criticalPct'], 1, 50),
            tog('Show damage and healing since the last reply', ['vitals', 'showDeltas']),
            sub('Body and mind'),
            tog('Show wounds', ['body', 'wounds']),
            num('Warn when a wound stays Raw (hours)', ['body', 'rawWarnHours'], 1, 2000, 'Fractures set wrong after about 72h in Re:Zero.'),
            tog('Show conditions', ['body', 'conditions']),
            area('Condition ladders', ['body', 'ladders'], 'One per line — Name: first > second > \u2026 > last. Unlisted conditions still read Mild/Moderate/Severe/Critical and Stage N.', 7),
            txt('Mind conditions', ['body', 'mindNames'], 'Conditions, status flags and bracket lines ([MENTAL COUNCIL: \u2026]) shown under Mind.'),
            txt('Labels read as conditions', ['body', 'conditionFields'], 'HUD fields beside the Condition line, like the vampire\u2019s Thirst State.'),
            sub('Abilities'),
            tog('Show abilities', ['abilities', 'enabled']),
            txt('Attributes', ['abilities', 'attributes'], 'Read as NAME value anywhere in the HUD: STR 10, DEX[+3], Academics [B +2].'),
            area('What counts as an ability', ['abilities', 'vocabulary'], 'One category per line — Category: Label, [TAG]. A plain word matches a HUD label (Skills:), [TAG] matches a bracket line ([AUTHORITY: \u2026]). Add your world\u2019s own.', 8),
            h('p', { class: 'rpgc-note' }, 'Quests have their own section: Settings \u2192 Quests.'),
            sub('People'),
            tog('Track relationships', ['relations', 'enabled'], 'Everyone you deal with: how they see you and how they feel about you.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Layout'), (() => {
                const sel = h('select', { 'aria-label': 'People layout', onchange: (e) => { set(['relations', 'layout'], e.target.value); saveSettings(false); render(); } },
                    h('option', { value: 'cards' }, 'Cards with bars'), h('option', { value: 'compact' }, 'Compact list'), h('option', { value: 'hearts' }, 'Hearts and stars'), h('option', { value: 'codex' }, 'Codex grid'));
                sel.value = get(['relations', 'layout']) || 'cards';
                return sel;
            })()),
            txt('Standing ladder (worst to best)', ['relations', 'ladder'], 'One label is picked each reply.'),
            txt('Neutral standing', ['relations', 'neutral'], 'Where a first meeting starts; below it counts as against you.'),
            txt('Bars', ['relations', 'bars'], 'Add \u00B1 to a bar that runs -100 to 100; the rest run 0 to 100.'),
            num('Most a bar moves in one reply', ['relations', 'maxStep'], 1, 100),
            num('People remembered', ['relations', 'keep'], 10, 300, 'The most recently seen are kept.'),
            sub('Phone'),
            tog('Phone and messages', ['comms', 'enabled'], 'Texts, calls and transfers go into the story as your turn. Contacts come from the story.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Kind'), (() => {
                const sel = h('select', { 'aria-label': 'Kind of device', onchange: (e) => { set(['comms', 'kind'], e.target.value); saveSettings(false); render(); } },
                    h('option', { value: 'phone' }, 'Phone — texts, calls, transfers'), h('option', { value: 'mirror' }, 'Conversation mirror — speaks to its twin'),
                    h('option', { value: 'spell' }, 'Message spell — reaches anyone you have met'), h('option', { value: 'radio' }, 'Comms radio — texts and hails'));
                sel.value = get(['comms', 'kind']) || 'phone';
                return sel;
            })()),
            txt('Your device', ['comms', 'device'], 'Leave empty to read it from your HUD or inventory. Name one for a world where it never shows there.'),
            txt('Device words', ['comms', 'deviceWords'], 'What counts as a device on the Equipment, Items or ability lines.'),
            txt('Balance labels', ['comms', 'balanceLabels'], 'The HUD line read as your balance.'),
            sub('Party'),
            tog('Track the party', ['party', 'enabled'], 'Reads party members in the scene through the side-panel block.'),
            tog('Mask: band or mode, holding the act, signature tell', ['party', 'trackMask']),
            tog('Bond: contract stage, jealousy, irritation (and affection and trust when relationships are off)', ['party', 'trackBond']),
            tog('Needs: hunger, fatigue, pain, stress', ['party', 'trackNeeds']),
            tog('Progression phase and vessel front', ['party', 'trackPhase']),
            num('Alert at level (1 slight \u2026 4 extreme)', ['party', 'alertLevel'], 1, 4),
            num('Alert when rising this many replies', ['party', 'risingTurns'], 2, 10),
            h('p', { class: 'rpgc-note' }, 'Register, band, stage and phase are read in the card\u2019s own words and never defined here. A stage or phase is only allowed to move when something with a cost happened; a skipped phase is flagged.'),
            sub('Guard'),
            txt('Carrier lines', ['carriers'], 'Lines whose printed text keeps an entry loaded. Listed first and marked when dropped. [TAG] matches bracket lines.'),
            txt('Lines that clear themselves', ['selfClearing'], 'Gone by the engine\u2019s own rules when their state ends \u2014 healed wounds, a passed condition. Shown as cleared, not dropped.'),
            sub('You'),
            tog('Tell the story when you can level up', ['you', 'tellModel'], 'When the XP the extension tracks reaches your next level, the story is told the level is there to be earned. A HUD that prints its own XP is left alone.'),
            txt('XP for each level', ['you', 'xpCurve'], 'Total XP for level 2, 3, 4\u2026 separated by commas. Used only when the HUD prints no XP of its own.'),
            sub('Injuries'),
            tog('Track injuries', ['injuries', 'enabled'], 'For HUDs that do not keep wounds, on the Re:Zero HUD\u2019s injury law: raw until tended, treated is not healed, healing takes the time its kind and severity need, a break left unset heals crooked, and a healed wound may scar. A HUD that prints its own wounds owns them, and this stands down.'),
            tog('Tell the story about them', ['injuries', 'tellModel'], 'Your injuries go with every message, so the story does not forget them two replies later.'),
            sub('Survival clock'),
            h('p', { class: 'rpgc-note' }, 'For bots whose HUD does not track sleep, food, water or state of mind. It measures elapsed time from the HUD clock and tells the engine the facts; the engine decides the consequences. It stands down for anything the HUD already tracks, and for immune races.'),
            toggle('Use the survival clock', () => get(['survival', 'enabled']) === true, v => set(['survival', 'enabled'], v), 'For bots whose HUD does not track sleep, food and water: it measures time on the HUD clock and tells the story the facts. It stands down for anything the HUD already tracks.'),
            survOn ? tog('Tell the model', ['survival', 'tellModel'], 'Adds a short note of elapsed time when something is past its first stage.') : null,
            survOn ? tog('Read what you did from the story', ['survival', 'askCompanion'], 'Uses the side-panel block. Without it, log with the buttons.') : null,
            survOn ? tog('Track fatigue', ['survival', 'fatigue']) : null,
            survOn ? txt('Fatigue stages (hours awake)', ['survival', 'fatigueHours'], 'Tired, Fatigued, Exhausted, Collapsing.') : null,
            survOn ? tog('Track hunger', ['survival', 'hunger']) : null,
            survOn ? txt('Hunger stages (hours)', ['survival', 'hungerHours']) : null,
            survOn ? tog('Track thirst', ['survival', 'thirst']) : null,
            survOn ? txt('Thirst stages (hours)', ['survival', 'thirstHours']) : null,
            survOn ? num('A rest takes off (hours)', ['survival', 'restCreditHours'], 0, 24) : null,
            survOn ? tog('Track state of mind', ['survival', 'mind']) : null,
            survOn ? h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn danger', onclick: async () => {
                const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear the survival log?', message: 'Removes everything you logged by hand in this chat. What the story reported stays.', variant: 'danger', confirmLabel: 'Clear' }) : { confirmed: window.confirm('Clear the survival log for this chat?') };
                if (res?.confirmed) send({ type: 'survival_log', chatId: state.chatId, op: 'clear' });
            } }, 'Clear this chat\u2019s survival log')) : null);
    }

    // ─────────── Party ───────────

    function partyOf() {
        return (state.hms && state.hms.party) || (state.extras && state.extras.party) || null;
    }
    function inParty(name) {
        const p = partyOf();
        if (!p || !name) return false;
        const k = String(name).trim().toLowerCase();
        const first = k.split(/\s+/)[0];
        return p.members.some(m => m.key === k || (m.aliases || []).some(a => a.toLowerCase() === k) || (first.length >= 3 && m.key.split(/\s+/)[0] === first));
    }
    const PARTY_GROUPS = [['bond', 'Bond'], ['mask', 'The act'], ['needs', 'Needs']];

    function partyMeter(d) {
        const cells = [];
        for (let i = 1; i <= 4; i++) cells.push(h('i', { class: i <= d.level ? (d.bad ? (i >= 3 ? 'on hot' : 'on') : 'on good') : '' }));
        return h('span', { class: 'rpgc-ladder party', role: 'img', 'aria-label': `${d.label}: ${d.word}` }, cells);
    }

    function partyCard(m, opt = {}) {
        const cur = m.cur || {};
        const chips = [];
        const card = (label, val, cls) => { if (val) chips.push(h('span', { class: 'rpgc-chip card ' + (cls || ''), title: `${label}, in the card\u2019s own words` }, h('em', null, label + ': '), val)); };
        if (m.contract) chips.push(h('span', { class: 'rpgc-chip card stage', title: 'A contract on your HUD' }, h('em', null, 'Contract: '), m.contract));
        const rel = relFor(m.name);
        if (!opt.merged && rel && rel.standing) chips.push(standingChip(rel));
        card('Register', cur.register, 'reg');
        card('Band', cur.band, 'band');
        card('Front', cur.front, 'front');
        card('Stage', cur.stage, 'stage');
        card('Phase', cur.phase, 'phase');
        const groups = [];
        for (const [g, title] of PARTY_GROUPS) {
            const ds = m.dims.filter(d => d.group === g);
            if (!ds.length) continue;
            groups.push(h('div', { class: 'rpgc-pgroup' },
                h('span', { class: 'gt' }, title),
                ds.map(d => h('div', { class: 'rpgc-pdim' + (d.bad && d.level >= 3 ? ' hot' : '') },
                    h('span', { class: 'lbl' }, d.label),
                    partyMeter(d),
                    h('span', { class: 'w' }, d.word + (d.id === 'jealousy' && cur.jealousOf && d.level > 0 ? ` of ${cur.jealousOf}` : '')),
                    d.trend ? h('span', { class: 'trend ' + (d.bad === (d.trend === 'up') ? 'worse' : 'better'), 'aria-label': d.trend === 'up' ? 'rising' : 'falling' }, d.trend === 'up' ? '\u2191' : '\u2193') : null,
                    d.since && d.since >= 30 ? h('span', { class: 'dur' }, fmtSpan(d.since)) : null))));
        }
        const presence = m.present ? h('span', { class: 'rpgc-chip here' }, 'here')
            : m.seen ? h('span', { class: 'rpgc-chip away' }, m.lastSeen !== null && m.lastSeen !== undefined ? `away \u00B7 ${fmtSpan(m.lastSeen) || 'just now'}` : 'away')
            : h('span', { class: 'rpgc-chip away' }, 'not read yet');
        const aliasIn = h('input', { type: 'text', value: (m.aliases || []).join(', '), placeholder: 'e.g. Momonga, Ainz Ooal Gown', 'aria-label': `Other names for ${m.name}`,
            onchange: (e) => send({ type: 'party_member', chatId: state.chatId, op: 'aliases', name: m.name, aliases: e.target.value }) });
        const aliasDet = h('details', { class: 'rpgc-subdet' }, h('summary', null, 'Also called'), h('div', { class: 'rpgc-row' }, aliasIn,
            h('span', { class: 'rpgc-note' }, 'Other names the story uses. A shared vessel\u2019s souls go here too.')));
        aliasDet.open = state.open['party-alias-' + m.key] === true;
        aliasDet.dataset.openKey = 'party-alias-' + m.key; aliasDet.addEventListener('toggle', () => { state.open['party-alias-' + m.key] = aliasDet.open; });
        const worst = m.alerts.some(a => a.sev === 'high') ? ' high' : m.alerts.length ? ' warn' : '';
        return h('div', { class: 'rpgc-pcard' + worst + (m.present ? '' : ' away') + (opt.merged ? ' sub' : '') },
            h('div', { class: opt.merged ? 'rpgc-psub' : 'head' },
                opt.merged ? h('span', { class: 'gt' }, 'Party') : avatarImg(m.name),
                opt.merged ? null : h('span', { class: 'name' }, m.name),
                cur.mood && !opt.merged ? h('span', { class: 'mood' }, cur.mood) : null,
                presence,
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${m.name} from the party`, title: 'Remove from the party', onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'remove', name: m.name }) }, '\u2715')),
            chips.length ? h('div', { class: 'rpgc-chips' }, chips) : null,
            m.alerts.length ? h('ul', { class: 'rpgc-palerts' }, m.alerts.map(a => h('li', { class: a.sev }, a.text))) : null,
            !opt.merged && rel && rel.bars.length ? h('div', { class: 'rpgc-pgroup' }, h('span', { class: 'gt' }, 'Toward you'), rel.bars.filter(b => ['affection', 'trust'].includes(b.id)).map(relBar)) : null,
            ...groups,
            cur.tell ? h('div', { class: 'rpgc-ptell' }, h('em', null, 'Tell: '), cur.tell) : null,
            cur.concern && !opt.skipConcern ? h('div', { class: 'rpgc-pconcern' }, cur.concern) : null,
            m.events && m.events.length ? h('p', { class: 'rpgc-note' }, m.events.join(' \u00B7 ')) : null,
            !m.seen ? h('p', { class: 'rpgc-note' }, `Read the next time ${m.name} is in the scene.`) : null,
            aliasDet);
    }


    // ─────────── People (relationships) ───────────

    function relOf() { return (state.hms && state.hms.relations) || (state.extras && state.extras.relations) || null; }
    function relFor(name) {
        const r = relOf();
        if (!r || !name) return null;
        const k = String(name).trim().toLowerCase();
        return r.people.find(p => p.key === k) || null;
    }
    function standingChip(p) {
        return h('span', { class: 'rpgc-chip standing ' + p.tone, title: 'How they see you' }, p.standing || 'unknown');
    }
    function relBar(b) {
        const wrap = h('div', { class: 'rpgc-relbar' + (b.two ? ' two' : ''), role: 'meter', 'aria-label': `${b.name} ${b.value}`, 'aria-valuenow': String(b.value) });
        const fill = h('i', { class: b.value < 0 ? 'neg' : 'pos' });
        if (b.two) { const w = Math.abs(b.value) / 2; fill.style.width = w + '%'; fill.style.left = b.value < 0 ? (50 - w) + '%' : '50%'; }
        else fill.style.width = Math.max(0, Math.min(100, b.value)) + '%';
        wrap.appendChild(fill);
        return h('div', { class: 'rpgc-reltile' },
            h('div', { class: 'top' }, h('span', { class: 'lbl' }, b.name), h('span', { class: 'v' }, b.two ? `${b.value > 0 ? '+' : ''}${b.value}` : `${b.value}`, h('small', null, b.two ? '' : '/100'))),
            wrap,
            b.delta ? h('div', { class: 'why ' + (b.delta > 0 ? 'up' : 'down') }, `${b.delta > 0 ? '+' : ''}${b.delta}${b.reason ? ' ' + b.reason : ''}`) : null);
    }
    function hearts(n) {
        const full = Math.max(0, Math.min(5, Math.round((n + 100) / 40)));
        return h('span', { class: 'rpgc-hearts', 'aria-label': `${full} of 5 hearts` }, '\u2665'.repeat(full), h('span', { class: 'off' }, '\u2665'.repeat(5 - full)));
    }
    function personMeta(p) {
        return [p.present ? 'here' : p.lastSeen !== null ? `seen ${fmtSpan(p.lastSeen) || 'just now'} ago` : null, p.metAgo ? `met ${fmtSpan(p.metAgo)} ago` : null, p.party ? 'party' : null].filter(Boolean).join(' \u00B7 ');
    }
    function bondEditor(p) {
        const bondIn = h('input', { type: 'text', value: p.pinned && p.pinned.bond ? p.pinned.bond : '', placeholder: p.bond || 'e.g. family — daughter to you', 'aria-label': `Bond with ${p.name}` });
        const minor = h('input', { type: 'checkbox', 'aria-label': `${p.name} is a minor` });
        minor.checked = !!(p.pinned && p.pinned.minor);
        const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, p.pinned ? 'Bond (set by you)' : 'Set the bond'),
            h('p', { class: 'rpgc-note' }, 'When the story reads the relationship wrong, set it here. The model is told, and a minor or a family bond can never be romantic.'),
            h('div', { class: 'rpgc-row' }, bondIn, h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'rel_pin', chatId: state.chatId, name: p.name, bond: bondIn.value }) }, 'Set')),
            h('label', { class: 'rpgc-row' }, minor, h('span', null, 'Minor — no romance, no desire')));
        minor.addEventListener('change', () => send({ type: 'rel_pin', chatId: state.chatId, name: p.name, minor: minor.checked }));
        det.open = state.open['bond-' + p.key] === true;
        det.dataset.openKey = 'bond-' + p.key; det.addEventListener('toggle', () => { state.open['bond-' + p.key] = det.open; });
        return det;
    }
    function personCard(p, opt = {}) {
        const dossier = !opt.noDossier && p.present && p.details ? Object.entries(p.details).filter(([, v]) => v && typeof v !== 'object') : [];
        return h('div', { class: 'rpgc-person ' + p.tone },
            h('div', { class: 'head' }, avatarImg(p.name), h('span', { class: 'name' }, p.name), standingChip(p),
                p.bond ? h('span', { class: 'rpgc-chip bond' + (p.pinned && p.pinned.bond ? ' pinned' : ''), title: 'The kind of relationship' }, p.bond) : null,
                p.minor ? h('span', { class: 'rpgc-chip minor', title: 'A minor: no romance, no desire' }, 'minor') : null,
                h('span', { class: 'meta' }, personMeta(p))),
            p.alerts.length ? h('ul', { class: 'rpgc-palerts' }, p.alerts.map(a => h('li', { class: a.sev }, a.text))) : null,
            p.mood ? h('div', { class: 'rpgc-relmood' }, h('span', { class: 'lbl' }, 'Mood'), h('b', null, p.mood)) : null,
            p.bars.length ? h('div', { class: 'rpgc-relgrid' }, p.bars.map(relBar)) : null,
            dossier.length ? h('div', { class: 'rpgc-dossier' }, dossier.map(([k, v]) => h('div', { class: 'row' + (/secret/i.test(k) ? ' secret' : '') }, h('span', { class: 'k' }, k), h('span', { class: 'v' }, String(v))))) : null,
            p.why ? h('div', { class: 'rpgc-pconcern' }, p.why) : null,
            p.events.length ? h('p', { class: 'rpgc-note' }, p.events.slice(-3).join(' \u00B7 ')) : null,
            bondEditor(p));
    }
    function renderPeopleLayout(list, layout) {
        if (!list.length) return null;
        if (layout === 'compact') return h('ul', { class: 'rpgc-people-compact' }, list.map(p => {
            const aff = p.bars.find(b => b.id === 'affection');
            return h('li', { class: p.tone }, h('span', { class: 'name' }, p.name), standingChip(p), p.bond ? h('span', { class: 'rpgc-chip bond' }, p.bond) : null, aff ? relBar(aff) : simYouChips(p.name, 2), h('span', { class: 'meta' }, p.present ? 'here' : ''));
        }));
        if (layout === 'hearts') return h('div', { class: 'rpgc-cards' }, list.map(p => {
            const aff = p.bars.find(b => b.id === 'affection'), att = p.bars.find(b => b.id === 'desire' || b.id === 'attraction'), tr = p.bars.find(b => b.id === 'trust');
            return h('div', { class: 'rpgc-person hearts ' + p.tone },
                h('div', { class: 'head' }, avatarImg(p.name), h('span', { class: 'name' }, p.name), standingChip(p)),
                aff ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Affection'), hearts(aff.value)) : null,
                att ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, att.name), hearts(att.value * 2 - 100)) : null,
                p.bond ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Bond'), h('span', null, p.bond)) : null,
                !aff && !att && !tr ? simYouChips(p.name, 3) : null,
                tr ? h('div', { class: 'rpgc-relrow' }, h('span', { class: 'lbl' }, 'Trust'), h('span', { class: 'rpgc-stars' }, '\u2605'.repeat(Math.max(0, Math.round((tr.value + 100) / 40))), h('span', { class: 'off' }, '\u2605'.repeat(5 - Math.max(0, Math.round((tr.value + 100) / 40)))))) : null,
                p.why ? h('div', { class: 'rpgc-pconcern' }, p.why) : null);
        }));
        if (layout === 'codex') return h('div', { class: 'rpgc-codex' }, list.map(p => h('div', { class: 'rpgc-codex-tile ' + p.tone, title: [p.standing, p.why].filter(Boolean).join(' \u2014 ') },
            avatarImg(p.name) || h('span', { class: 'glyph', 'aria-hidden': 'true' }, (p.name || '?').charAt(0)),
            h('span', { class: 'name' }, p.name), h('span', { class: 'st' }, p.standing || '?'))));
        return h('div', { class: 'rpgc-cards' }, list.map(p => personCard(p)));
    }

    // ─────────── Minds (from FrankenSIM): what goes on inside the people of the story ───────────
    // Ported from FrankenSIM 4 Mini by Wireless (Ryah), with permission; TFDY by Pyropia. The model reports
    // what moved; the extension keeps the numbers. Shown as plain words first, numbers on a second look.

    const SIM_IW_ICON = ['❄️', '🌥️', '⛅', '☀️', '🔥'];
    const SIM_TFDY_ICON = { T: '💗', F: '🔥', D: '😰', Y: '🌙' };
    const SIM_HOW_ICON = { saw: '👁️', heard: '👂', told: '🗣️', evidence: '🔎', message: '✉️', common: '🌐', gossip: '💬', guessed: '🤔' };
    const SIM_SURE_WORD = { certain: 'sure', partly: 'partly sure', unsure: 'not sure', wrong: 'a false belief' };
    const SIM_LEVEL_WORD = { low: 'a little', med: '', high: 'strongly' };
    const SIM_GATE_WORD = ['dormant', 'attentive', 'aware', 'longing', 'open'];
    function mindsOf() { return (state.hms && state.hms.minds) || null; }
    function mindFor(name) {
        const m = mindsOf();
        if (!m || !name) return null;
        const k = String(plain(name)).trim().toLowerCase();
        return m.people.find(p => p.key === k) || m.people.find(p => k.startsWith(p.key + ' ') || p.key.startsWith(k + ' ')) || null;
    }
    const capWord = (s) => (s ? String(s).charAt(0).toUpperCase() + String(s).slice(1) : '');
    function simSubdet(key, title, ...content) {
        const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, title), ...content);
        det.open = state.open[key] === true;
        det.dataset.openKey = key; det.addEventListener('toggle', () => { state.open[key] = det.open; });
        return det;
    }
    function simAxisTile(a) {
        const bar = h('div', { class: 'rpgc-relbar' + (a.warm ? ' warm' : ' cold') });
        const fill = h('i', { class: a.warm ? 'pos' : 'neg' });
        fill.style.width = Math.max(0, Math.min(100, a.v * 5)) + '%';
        bar.appendChild(fill);
        if (a.s !== a.v) { const tick = h('b', { class: 'set', title: `Settles at ${a.s}` }); tick.style.left = Math.max(0, Math.min(100, a.s * 5)) + '%'; bar.appendChild(tick); }
        return h('div', { class: 'rpgc-reltile rpgc-ax', title: `${a.greek} (${a.label}): ${a.v} of 20${a.s !== a.v ? `, settles at ${a.s}` : ''}` },
            h('div', { class: 'top' }, h('span', { class: 'lbl' }, `${a.emoji} ${a.label}`), h('span', { class: 'v' }, String(a.v), a.mom > 0 ? h('span', { class: 'up' }, a.mom > 1 ? ' ↑↑' : ' ↑') : a.mom < 0 ? h('span', { class: 'down' }, a.mom < -1 ? ' ↓↓' : ' ↓') : null)),
            bar);
    }
    function simTopChips(p, n = 3) {
        return p.axes.filter(a => !a.off).slice().sort((a, b) => b.v - a.v).slice(0, n).map(a => h('span', { class: 'rpgc-chip ax ' + (a.warm ? 'warm' : 'cold'), title: `${a.label} ${a.v}/20` }, `${a.emoji} ${a.v}${a.mom > 0 ? '↑' : a.mom < 0 ? '↓' : ''}`));
    }
    /** The strongest feelings toward you, as chips, for the compact People views. */
    function simYouChips(name, n) {
        const mp = mindFor(name);
        const yp = mp && (mp.pairs || []).find(x => x.you);
        return yp ? h('span', { class: 'rpgc-chips' }, simTopChips(yp, n)) : null;
    }
    function simGateLadder(g) {
        const cells = [];
        for (let i = 1; i <= 4; i++) cells.push(h('i', { class: i <= g.i ? 'on' : '' }));
        return h('span', { class: 'rpgc-ladder gate', role: 'img', 'aria-label': `Opening up: ${g.word}` }, cells);
    }
    function simPairBlock(p, mp) {
        const shown = p.axes.filter(a => !a.off && (a.v >= 6 || a.mom || p.walls.some(w => w.a === a.id || w.b === a.id))).sort((a, b) => b.v - a.v);
        const rest = p.axes.filter(a => !a.off && !shown.includes(a));
        const dam = [];
        dam.push(h('span', { class: 'rpgc-chip', title: 'Whether the feeling comes out in what they do (E) and in what they say (L)' }, `Shows it: ${p.E === 'open' ? 'yes' : 'no'} · Says it: ${p.L === 'open' ? 'yes' : 'no'}`));
        const loose = p.filters.filter(f => f.i > 0);
        if (loose.length) dam.push(h('span', { class: 'rpgc-chip', title: 'What holds the feeling back, and how far it has given way' }, loose.map(f => `${f.label} ${f.word}`).join(', ')));
        if (p.clash) dam.push(h('span', { class: 'rpgc-chip hot', title: 'They feel very differently about each other' }, 'they see it differently'));
        return h('div', { class: 'rpgc-pair' },
            h('div', { class: 'rpgc-row tight' },
                h('span', { class: 'gt' }, p.you ? 'Toward you' : `Toward ${p.toName}`),
                h('span', { class: 'rpgc-chip gate', title: 'How far they let themselves feel: dormant, attentive, aware, longing, open' }, '🚪 ', p.gate.word, ' ', simGateLadder(p.gate)),
                p.mode && p.mode !== 'stranger' ? h('span', { class: 'rpgc-chip mode' }, p.mode) : null,
                p.guessed ? h('span', { class: 'rpgc-chip', title: 'First values are a guess until the story gives them' }, 'first guess') : null),
            p.intent ? h('div', { class: 'rpgc-pconcern' }, 'Wants: ', p.intent) : null,
            p.walls.length ? h('div', { class: 'rpgc-simwarn' }, '⚠️ Wall: ', p.walls.map(w => w.text).join(', '), h('span', { class: 'rpgc-note' }, ' — both high at once, so it comes out sideways')) : null,
            p.debts.length ? h('div', { class: 'rpgc-simwarn debt' }, '⚖️ Not made good: ', p.debts.map(d => d.text).join('; ')) : null,
            h('div', { class: 'rpgc-relgrid' }, shown.map(simAxisTile)),
            rest.length ? simSubdet(`ax-${mp.key}-${p.to}`, `All twelve feelings (${rest.length} more, all low)`, h('div', { class: 'rpgc-relgrid' }, rest.map(simAxisTile))) : null,
            h('div', { class: 'rpgc-chips' }, dam),
            p.events.length ? h('ul', { class: 'rpgc-simlog' }, p.events.slice(0, 3).map(e => h('li', null,
                h('span', { class: 'when' }, e.ago === 0 ? 'this reply' : `${e.ago} repl${e.ago === 1 ? 'y' : 'ies'} ago`),
                [e.moved, e.gate ? `gate ${e.gate}` : null, e.mode ? `mode ${e.mode}` : null, e.debt ? `wronged: ${e.debt}` : null, e.paid ? `made good: ${e.paid}` : null].filter(Boolean).join(' · '),
                e.why ? h('i', null, ' — ', e.why) : null))) : null);
    }
    function simKnowsList(mp) {
        return h('ul', { class: 'rpgc-knows' }, mp.knows.map(f => h('li', { class: f.sure === 'wrong' ? 'wrong' : '' },
            h('span', { class: 'how', title: f.howText || 'how is not known' }, SIM_HOW_ICON[f.how] || '•'),
            h('span', { class: 'fact' }, f.fact),
            h('span', { class: 'src' }, [f.how === 'told' && f.from ? `told by ${f.from}` : f.howText, SIM_SURE_WORD[f.sure] || f.sure].filter(Boolean).join(', ')),
            h('button', { class: 'rpgc-mini', title: 'They should not know this: forget it', 'aria-label': `${mp.name} forgets: ${f.fact}`, onclick: () => send({ type: 'sim_edit', chatId: state.chatId, op: 'forget', who: mp.name, fact: f.fact }) }, '✕'))));
    }
    function simAgendaLine(a) {
        if (!a) return null;
        const when = a.until ? (a.left === null || a.left === undefined ? `until ${a.until}` : a.overdue ? `was until ${a.until}` : `until ${a.until} (in ${fmtSpan(a.left)})`) : null;
        return h('div', { class: 'rpgc-agenda' + (a.overdue ? ' late' : '') },
            h('span', { class: 'ic', 'aria-hidden': 'true' }, '📍'),
            h('span', null, [a.where, a.doing].filter(Boolean).join(' — '), when ? h('span', { class: 'rpgc-note' }, ` · ${when}`) : null,
                a.overdue ? h('span', { class: 'rpgc-chip hot', title: 'The time they gave has passed: done, or held up?' }, `over by ${fmtSpan(-a.left)}`) : null,
                a.next ? h('span', { class: 'rpgc-note' }, ` · then: ${a.next}`) : null));
    }
    /** The Minds part of a person card: one line of what shows, the rest a click away. */
    function mindBlock(mp) {
        if (!mp) return null;
        const youPair = (mp.pairs || []).find(p => p.you) || null;
        const others = (mp.pairs || []).filter(p => !p.you);
        const top = [];
        if (mp.feel) top.push(h('span', { class: 'rpgc-chip feel', style: mp.feel.color ? `border-color:${mp.feel.color};color:${mp.feel.color}` : null, title: `Feeling (Parrott): ${mp.feel.text}` },
            `${mp.feel.icon} ${capWord(mp.feel.word)}`, SIM_LEVEL_WORD[mp.feel.level] ? h('small', null, ` · ${SIM_LEVEL_WORD[mp.feel.level]}`) : null, mp.feel.at ? h('small', null, ` → ${mp.feel.at}`) : null));
        if (mp.iw) top.push(h('span', { class: 'rpgc-chip iw', title: 'How warm they show themselves (Inner Weather), whatever they feel inside' }, `${SIM_IW_ICON[mp.iw.v]} shows ${mp.iw.word}`));
        if (mp.mask && mp.mask !== 'held') top.push(h('span', { class: 'rpgc-chip hot', title: 'The face they wear' }, mp.mask === 'off' ? '🎭 mask off' : '🎭 mask cracking'));
        if (youPair) { top.push(...simTopChips(youPair)); if (youPair.walls.length) top.push(h('span', { class: 'rpgc-chip hot', title: youPair.walls.map(w => w.text).join(', ') }, '⚠️ wall')); if (youPair.debts.length) top.push(h('span', { class: 'rpgc-chip hot', title: youPair.debts.map(d => d.text).join('; ') }, '⚖️ owed')); }
        const inside = mp.tfdy ? h('div', { class: 'rpgc-tfdy' }, mp.tfdy.map(x => {
            const cells = [];
            for (let i = 1; i <= 4; i++) cells.push(h('i', { class: (i <= x.v ? 'on' : '') + (i === x.base ? ' base' : '') }));
            return h('span', { class: 'ax', title: `${x.label}: ${x.word} (${x.v} of 4); rests at ${x.base}` }, h('span', { class: 'lbl' }, `${SIM_TFDY_ICON[x.ax]} ${x.label}`), h('span', { class: 'rpgc-ladder tf' }, cells));
        })) : null;
        const more = [];
        if (inside) more.push(h('h5', null, 'Inside'), inside);
        if (mp.facets && mp.facets.length) more.push(h('div', { class: 'rpgc-chips facets' }, h('span', { class: 'gt' }, 'Sides of them'), mp.facets.map(f => h('span', { class: 'rpgc-chip' + (f === mp.facet ? ' lead' : ''), title: f === mp.facet ? 'Leads right now' : '' }, f))),
            mp.stuck ? h('p', { class: 'rpgc-note' }, `“${mp.stuck}” has led three replies running.`) : null);
        if (mp.residual) more.push(h('p', { class: 'rpgc-note' }, `Still carrying: ${mp.residual.word}${mp.residual.at ? ` at ${mp.residual.at}` : ''} (${mp.residual.ago} repl${mp.residual.ago === 1 ? 'y' : 'ies'} ago)`));
        if (youPair) more.push(simPairBlock(youPair, mp));
        for (const p of others) more.push(simPairBlock(p, mp));
        if (mp.knows && mp.knows.length) more.push(h('h5', null, `What ${mp.name.split(/\s+/)[0]} knows`), simKnowsList(mp));
        if (mp.agenda && mp.agenda.was && mp.agenda.was.length) more.push(h('p', { class: 'rpgc-note' }, 'Before: ', mp.agenda.was.map(w => [w.where, w.doing].filter(Boolean).join(' — ')).join(' · ')));
        return h('div', { class: 'rpgc-mind' },
            top.length ? h('div', { class: 'rpgc-chips' }, h('span', { class: 'gt', title: 'Minds (from FrankenSIM)' }, '🧠'), top) : null,
            simAgendaLine(mp.agenda),
            more.length ? simSubdet('mind-' + mp.key, mp.feel || mp.tfdy ? 'Inside, feelings and what they know' : 'What they know', ...more) : null);
    }
    function mindCard(mp) {
        return h('div', { class: 'rpgc-person neutral' },
            h('div', { class: 'head' }, avatarImg(mp.name), h('span', { class: 'name' }, mp.name), mp.minor ? h('span', { class: 'rpgc-chip minor' }, 'minor') : null,
                h('span', { class: 'meta' }, mp.present ? 'here' : mp.away ? 'elsewhere' : mp.ago ? `last seen ${mp.ago} repl${mp.ago === 1 ? 'y' : 'ies'} ago` : '')),
            mindBlock(mp));
    }

    // Characters: what their card says (read from the lorebook), or the profile the story wrote for someone without one.
    function charsOf() { const c = state.hms && state.hms.chars; return c && Array.isArray(c.people) ? c : null; }
    const SHEET_ROWS = [['role', 'Role'], ['look', 'Looks'], ['voice', 'Voice'], ['persona', 'Manner']];
    function sheetBlock(sh) {
        if (!sh) return null;
        if (sh.carded) {
            const also = [];
            if (sh.sections.includes('DAY ONE GATE')) also.push('what is not true yet');
            if (sh.sections.includes('SEALED KNOWLEDGE')) also.push('sealed knowledge');
            if (sh.sections.includes('ARC EVOLUTION')) also.push('an arc');
            if (sh.sections.includes('LEARNED WORDS')) also.push('learned words');
            if (sh.sections.includes('VESSEL')) also.push('a shared vessel');
            return h('div', { class: 'rpgc-sheet' },
                h('div', { class: 'rpgc-chips' }, h('span', { class: 'gt', title: 'From their character card, read from the lorebook' }, '\uD83D\uDCC7'), h('span', { class: 'rpgc-chip', title: 'This person has a character card in the lorebook. The card is who they are.' }, 'Has a card'),
                    sh.facts.slice(0, 4).map(f => h('span', { class: 'rpgc-chip', title: f.label }, h('em', null, f.label + ': '), f.value))),
                also.length || sh.tags.length ? h('p', { class: 'rpgc-note' }, [also.length ? `The card also holds ${also.join(', ')}.` : null, sh.tags.length ? `It keeps some content for Phase ${sh.tags.join(', ')}.` : null].filter(Boolean).join(' ')) : null);
        }
        const p = sh.profile || {};
        const edit = (o) => send({ type: 'char_edit', chatId: state.chatId, key: sh.key, name: sh.name, ...o });
        const rows = SHEET_ROWS.filter(([f]) => p[f] || state.sheetEdit === `${sh.key}:${f}`).map(([f, label]) => {
            if (state.sheetEdit === `${sh.key}:${f}`) {
                const inp = h('input', { type: 'text', value: p[f] || '', 'aria-label': `${label} of ${sh.name}` });
                const save = () => { state.sheetEdit = null; edit({ op: 'field', field: f, value: inp.value }); };
                inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } if (e.key === 'Escape') { state.sheetEdit = null; render(); } });
                return h('div', { class: 'row' }, h('span', { class: 'k' }, label), inp, h('button', { class: 'rpgc-btn', onclick: save }, 'Save'));
            }
            return h('div', { class: 'row' }, h('span', { class: 'k' }, label), h('span', { class: 'v' }, p[f]),
                h('button', { class: 'rpgc-mini', title: `Change ${label.toLowerCase()}`, 'aria-label': `Change ${label.toLowerCase()} of ${sh.name}`, onclick: () => { state.sheetEdit = `${sh.key}:${f}`; render(); } }, '\u270E'));
        });
        return h('div', { class: 'rpgc-sheet' },
            h('div', { class: 'rpgc-chips' }, h('span', { class: 'gt', title: 'A profile the story wrote for someone without a character card' }, '\uD83E\uDEAA'), h('span', { class: 'rpgc-chip', title: 'No character card in the lorebook. The story wrote this once; the extension keeps it so they stay the same person.' }, p.byYou ? 'Profile (changed by you)' : 'Profile')),
            rows,
            p.secret ? simSubdet('secret-' + sh.key, 'Spoiler: what they keep to themselves', h('p', null, p.secret)) : null,
            h('div', { class: 'rpgc-row tight' }, h('button', { class: 'rpgc-btn', title: 'Drop this profile. The story writes a new one the next time they are around.', onclick: () => edit({ op: 'forget' }) }, 'Forget and ask again')));
    }
    function sheetCard(sh) {
        return h('div', { class: 'rpgc-person neutral' },
            h('div', { class: 'head' }, avatarImg(sh.name), h('span', { class: 'name' }, sh.name), h('span', { class: 'meta' }, sh.present ? 'here' : '')),
            sheetBlock(sh));
    }
    // How much is tracked about people: three ready levels over the switches that already exist.
    const CHAR_KEYS = { present: 'showCharacterThoughts', thoughts: 'trackerConfig.presentCharacters.thoughts.enabled', relations: 'hmsSystems.relations.enabled', minds: 'hmsSystems.minds.enabled', pairs: 'hmsSystems.minds.pairs',
        agendas: 'hmsSystems.minds.agendas', knowledge: 'hmsSystems.minds.knowledge', gates: 'hmsSystems.gates.enabled', profiles: 'hmsSystems.characters.profiles', partyMask: 'hmsSystems.party.trackMask', partyNeeds: 'hmsSystems.party.trackNeeds' };
    const CHAR_LEVELS = {
        // 2.9: None keeps nothing about people; Custom is your own mix (the switches below)
        none: { present: false, thoughts: false, relations: false, minds: false, pairs: 'you', agendas: false, knowledge: false, gates: false, profiles: false, partyMask: false, partyNeeds: false },
        light: { present: true, thoughts: false, relations: true, minds: false, pairs: 'you', agendas: false, knowledge: false, gates: true, profiles: false, partyMask: false, partyNeeds: false },
        standard: { present: true, thoughts: true, relations: true, minds: true, pairs: 'you', agendas: true, knowledge: false, gates: true, profiles: true, partyMask: true, partyNeeds: false },
        full: { present: true, thoughts: true, relations: true, minds: true, pairs: 'all', agendas: true, knowledge: true, gates: true, profiles: true, partyMask: true, partyNeeds: true }
    };
    const charGet = (s, k) => { const v = pathGet(s, CHAR_KEYS[k]); return k === 'pairs' ? (v === 'you' ? 'you' : 'all') : v !== false; };
    function charLevelOf(s) {
        if (s.charLevel === 'custom') return 'custom';
        for (const [name, lv] of Object.entries(CHAR_LEVELS)) if (Object.keys(lv).every(k => charGet(s, k) === lv[k])) return name;
        return 'custom';
    }
    function renderCharactersSettings() {
        const s = S();
        const level = charLevelOf(s);
        const setLevel = (name) => { if (name === 'custom') s.charLevel = 'custom'; else { delete s.charLevel; for (const [k, v] of Object.entries(CHAR_LEVELS[name])) pathSet(s, CHAR_KEYS[k], v); } saveSettings(); render(); };
        const tog = (label, k, note) => toggle(label, () => charGet(s, k), v => { pathSet(s, CHAR_KEYS[k], v); s.charLevel = 'custom'; render(); }, note);
        const c = charsOf(), g = gatesOf();
        const LV = [['none', 'None', 'Nothing about the people is kept or asked for. No tokens.'],
            ['light', 'Light', 'Who is here, how they stand with you, and the phase on their card. The fewest tokens.'],
            ['standard', 'Standard', 'Adds their thoughts, their feelings toward you, what they are doing, and profiles for people without a card.'],
            ['full', 'Full', 'Adds feelings between the others, who knows what, and your party\u2019s masks and needs. The most tokens.'],
            ['custom', 'Custom', 'Your own mix: set each switch below. Changing a switch picks this by itself.']];
        return section('s-characters', 'Characters', state.open, level === 'custom' ? 'custom' : level,
            h('p', { class: 'rpgc-note' }, 'Everything the extension keeps about the people of the story, in one place. Some of it is read from their character card at no cost. The rest the story reports as it goes. Pick a level, or set each switch yourself.'),
            h('div', { class: 'rpgc-levels', role: 'group', 'aria-label': 'Tracking level' }, LV.map(([k, name, text]) => h('button', { class: 'rpgc-level' + (level === k ? ' on' : ''), 'aria-pressed': level === k ? 'true' : 'false', onclick: () => setLevel(k) }, h('b', null, (level === k ? '\u2713 ' : '') + name), h('span', null, text)))),
            level === 'custom' ? h('p', { class: 'rpgc-note' }, 'Custom: your own mix of switches. Pick a level above to go back to one.') : null,
            h('h4', null, 'From the story'),
            tog('Who is in the scene', 'present', 'Present characters, with how they look and act right now.'),
            tog('Their thoughts', 'thoughts', 'One line of what is on their mind.'),
            tog('Standing and bond', 'relations', 'How close each person is to you, and what kind of bond it is.'),
            tog('Feelings inside and toward you', 'minds', 'Minds, from FrankenSIM: mood, mask, and twelve feelings toward you.'),
            selectRow('Feelings between the others', charGet(s, 'pairs'), [['all', 'Yes, between the people present'], ['you', 'No, only toward you']], v => { pathSet(s, CHAR_KEYS.pairs, v); saveSettings(); render(); }),
            tog('What they are doing', 'agendas', 'Where each person is, what they do, and until when.'),
            tog('Who knows what', 'knowledge', 'What each person found out, and how.'),
            tog('Profiles for people without a card', 'profiles', 'A short, lasting note on looks, voice and manner, written once by the story and kept, so a shopkeeper stays the same shopkeeper.'),
            h('h4', null, 'From the character card'),
            tog('Gates: the phase on their card', 'gates', 'Which phase of their gated progression block each person is in.'),
            h('p', { class: 'rpgc-note' }, c ? `Read in this chat: ${c.cards} character card${c.cards === 1 ? '' : 's'}${g ? `, ${g.cards} with a gated block` : ''}, and ${c.profiles} profile${c.profiles === 1 ? '' : 's'} written by the story.` : 'No character card or profile in this chat yet. Cards are read from the lorebooks when the chat opens or after the first reply.'),
            h('h4', null, 'Your party'),
            tog('Masks and tells', 'partyMask', 'The band and facade a party member\u2019s card names, and their tell.'),
            tog('Needs', 'partyNeeds', 'Hunger, fatigue, pain and stress.'),
            toggle('Their bodies', () => pathGet(s, 'hmsSystems.party.trackBody') !== false, v => { pathSet(s, 'hmsSystems.party.trackBody', v); }, 'Wounds and lost limbs on a body chart (male or female), like yours. The story reports them only when they change.'),
            h('h4', null, 'Statuses'),
            toggle('Statuses: asleep, out cold, dead, tied up, missing\u2026', () => pathGet(s, 'hmsSystems.statuses.enabled') !== false, v => { pathSet(s, 'hmsSystems.statuses.enabled', v); }, 'One badge on the person\u2019s card. Nothing is sent while everyone is fine.'),
            toggle('Ask the model when one changes', () => pathGet(s, 'hmsSystems.statuses.ask') !== false, v => { pathSet(s, 'hmsSystems.statuses.ask', v); }, 'Off: only the HUD\u2019s own lines and what you set by hand.'),
            toggle('Tell the story', () => pathGet(s, 'hmsSystems.statuses.tell') !== false, v => { pathSet(s, 'hmsSystems.statuses.tell', v); }, 'One line per person who is not as usual, before each reply.'),
            toggle('Statuses change what they do', () => pathGet(s, 'hmsSystems.statuses.hooks') !== false, v => { pathSet(s, 'hmsSystems.statuses.hooks', v); }, 'Asleep or out cold: they learn nothing until they wake. Dead: their plans stop.'),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', disabled: !state.chatId ? true : null, onclick: () => send({ type: 'char_edit', chatId: state.chatId, op: 'reset' }) }, 'Undo my profile changes in this chat'),
                h('span', { class: 'rpgc-note' }, 'Fields you changed, profiles you forgot.')),
            h('p', { class: 'rpgc-note' }, 'The fine settings are in their own sections: Minds, Gates and HMS systems. The preset has its own dial for how characters are written: Character depth.'));
    }

    // Gates: where a character stands on their own card's gated progression block (Creation Kit).
    function gatesOf() { const g = state.hms && state.hms.gates; return g && g.on && Array.isArray(g.people) ? g : null; }
    // Cards write phase names in capitals; they read easier in the panel as words.
    const gateTitle = (t) => { const v = String(t || ''); return /\p{Ll}/u.test(v) ? v : v.toLowerCase().replace(/(^|[\s\-\u2014\u2013(\[\u201C"])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()); };
    const GATE_MARK = { done: '\u2713', now: '\u25CF', open: '\uD83D\uDD13', locked: '\uD83D\uDD12', closed: '\u2715' };
    const GATE_WORD = { done: 'lived', now: 'now', open: 'open: its trigger can fire', locked: 'locked', closed: 'closed by the other branch' };
    const gateWhen = (ago) => (ago === null || ago === undefined ? '' : ago === 0 ? 'this reply' : `${ago} repl${ago === 1 ? 'y' : 'ies'} ago`);
    function gateBlock(g) {
        if (!g) return null;
        const edit = (p) => send({ type: 'gate_edit', chatId: state.chatId, ...p });
        const cur = g.cur, block = gateTitle(g.block);
        const top = [h('span', { class: 'gt', title: `Gated progression: ${block}` }, '\uD83D\uDDDD\uFE0F'),
            h('span', { class: 'rpgc-chip gnow', title: `${block}: the phase ${g.name.split(/\s+/)[0]} is in${cur.with ? `, with ${cur.with}` : ''}${cur.why ? ` \u2014 ${cur.why}` : ''}` }, `Phase ${cur.id} \u00B7 ${gateTitle(cur.name)}`)];
        for (const nx of (g.next || []).slice(0, 2)) top.push(h('span', { class: 'rpgc-chip gopen', title: `Open: this gate can fire next${nx.kindText ? ` (${nx.kindText})` : ''}` }, `\uD83D\uDD13 ${nx.id} ${gateTitle(nx.name)}`));
        if (g.pending.length) top.push(h('span', { class: 'rpgc-chip hot', title: 'A reported move is waiting for your yes' }, `\u23F3 ${g.pending.length} waiting`));
        const side = (p) => /optional|always open/.test(p.kindText || '');
        const map = h('div', { class: 'rpgc-gatemap', role: 'img', 'aria-label': `${block}: phase ${cur.id} of ${g.phases[g.phases.length - 1].id}, ${gateTitle(cur.name)}` },
            g.phases.map((p, i) => [i ? h('span', { class: 'arrow', 'aria-hidden': 'true' }, '\u203A') : null,
                h('span', { class: 'st ' + p.state + (side(p) ? ' side' : ''), title: `Phase ${p.id} \u2014 ${gateTitle(p.name)}: ${GATE_WORD[p.state] || p.state}${p.kindText ? ` (${p.kindText})` : ''}` }, p.id)]));
        const pend = g.pending.map(p => h('div', { class: 'rpgc-gatepend' },
            h('span', null, p.type === 'drop' ? `The story reported a fall back to Phase ${p.to} (${gateTitle(p.toName)}).` : `The story reported Phase ${p.to} (${gateTitle(p.toName)}).`, p.why ? h('i', null, ` \u201C${p.why}\u201D`) : null),
            h('span', { class: 'rpgc-note' }, `Not taken: ${p.reason}.`),
            h('div', { class: 'rpgc-row tight' },
                h('button', { class: 'rpgc-btn primary', 'aria-label': `Accept: ${g.name} to phase ${p.to}`, onclick: () => edit({ op: 'accept', ref: p.ref }) }, 'Accept'),
                h('button', { class: 'rpgc-btn', 'aria-label': `Dismiss: ${g.name} to phase ${p.to}`, onclick: () => edit({ op: 'dismiss', ref: p.ref }) }, 'Dismiss'))));
        const said = (p) => (p.state === 'done' || p.state === 'now'
            ? [p.state === 'now' ? 'now' : 'lived', p.id === '0' ? null : p.byYou ? 'set by you' : p.auto ? 'followed by itself' : null, gateWhen(p.ago) || null].filter(Boolean).join(' \u00B7 ')
            : GATE_WORD[p.state] || p.state);
        const road = h('ul', { class: 'rpgc-gateroad' }, g.phases.map(p => h('li', { class: p.state },
            h('span', { class: 'ph' }, h('span', { 'aria-hidden': 'true' }, GATE_MARK[p.state] || ''), h('b', null, `Phase ${p.id} \u2014 ${gateTitle(p.name)}`), p.kindText ? h('span', { class: 'rpgc-chip' }, p.kindText) : null, h('span', { class: 'rpgc-note' }, said(p))),
            p.trigger && p.id !== '0' ? h('span', { class: 'trig' }, h('span', { class: 'gt' }, 'Trigger '), p.trigger) : null,
            p.scope ? h('span', { class: 'trig' }, h('span', { class: 'gt' }, 'Scope '), p.scope) : null,
            p.state === 'locked' && p.needs ? h('span', { class: 'rpgc-note' }, `Needs Phase ${p.needs} first.`) : null,
            p.why || p.with ? h('span', { class: 'rpgc-note' }, [p.with ? `With ${p.with}` : null, p.why].filter(Boolean).join(': ')) : null)));
        const sel = h('select', { 'aria-label': `Set the phase ${g.name} is in` }, g.phases.filter(p => !/always open/.test(p.kindText || '')).map(p => h('option', { value: p.id }, `Phase ${p.id} \u2014 ${gateTitle(p.name)}`)));
        sel.value = cur.id;
        const setRow = h('div', { class: 'rpgc-row tight' }, h('span', { class: 'rpgc-note' }, 'Wrong? Set it yourself:'), sel,
            h('button', { class: 'rpgc-btn', onclick: () => { if (sel.value !== cur.id) edit({ op: 'set', who: g.key, to: sel.value }); } }, 'Set'),
            h('button', { class: 'rpgc-btn', title: 'Take back what you set, accepted or dismissed for this person', onclick: () => edit({ op: 'reset', who: g.key }) }, 'Undo mine'));
        const log = (g.log || []).length ? h('ul', { class: 'rpgc-simlog' }, g.log.map(l => h('li', null, h('span', { class: 'when' }, gateWhen(l.ago)),
            l.type === 'drop' ? `fell back to Phase ${l.id}` : l.type === 'set' ? `set to Phase ${l.id} by you` : `Phase ${l.id}${l.auto ? ' followed by itself' : ' fired'}`, l.name ? ` (${gateTitle(l.name)})` : '', l.why ? `: ${l.why}` : ''))) : null;
        return h('div', { class: 'rpgc-gate' },
            h('div', { class: 'rpgc-chips' }, top), map, pend,
            simSubdet('gate-' + g.key, `${block}: the road on this card`, road, g.anchor ? h('p', { class: 'rpgc-note' }, 'The anchor: ', g.anchor) : null, log ? h('h5', null, 'What moved') : null, log, setRow,
                h('p', { class: 'rpgc-note' }, 'Read from the character\u2019s own card. The card owns every phase and trigger; this only keeps the place.')));
    }
    function gateCard(g) {
        return h('div', { class: 'rpgc-person neutral' },
            h('div', { class: 'head' }, avatarImg(g.name), h('span', { class: 'name' }, g.name), h('span', { class: 'meta' }, g.present ? 'here' : '')),
            gateBlock(g));
    }
    function renderGatesSettings() {
        const s = S();
        if (!s.hmsSystems) s.hmsSystems = {};
        const G = () => (s.hmsSystems.gates = isObj(s.hmsSystems.gates) ? s.hmsSystems.gates : {});
        const tog = (label, key, note) => toggle(label, () => G()[key] !== false, v => { G()[key] = v; }, note);
        const on = G().enabled !== false;
        const g = gatesOf();
        return section('s-gates', 'Gates (card progression)', state.open, on ? 'on' : 'off',
            h('p', { class: 'rpgc-note' }, 'For characters built with the Creation Kit: a card can carry one gated progression block ([THE \u2026] \u2014 gated progression), a road of phases each behind a trigger. The extension reads that block from the card, keeps which phase each character is in, and hands it back before every reply, so the story does not forget where someone stands or jump ahead. The card owns every phase and rule; nothing is added to it.'),
            tog('Gates: keep each character\u2019s phase', 'enabled', 'Shown on their card in People. The model only reports a gate when its trigger happened in the reply.'),
            selectRow('When the story reports a gate', G().confirm === 'ask' ? 'ask' : 'auto', [['auto', 'Move by itself when the card\u2019s order allows it'], ['ask', 'Always ask me first']], v => { G().confirm = v; saveSettings(); }),
            h('p', { class: 'rpgc-note' }, 'A move the card\u2019s order does not allow (a skipped phase, two gates in one reply, the closed side of a fork, a fall of several phases) always waits for your Accept or Dismiss.'),
            tog('Hand the positions back to the model', 'tell', 'Before each reply. Off saves tokens, but the story is not reminded where anyone stands.'),
            h('p', { class: 'rpgc-note' }, g && g.cards ? `Cards read in this chat (${g.cards}): ${g.people.map(p => `${p.name} \u2014 Phase ${p.cur.id}`).join(' \u00B7 ')}.` : 'No card with a gated block is in this chat\u2019s lorebooks yet. They are read when the chat opens or after the first reply.'),
            h('p', { class: 'rpgc-note' }, 'Cost: about 150 tokens of instructions while a gated character is around, and one line of state per such character. Nothing is asked in a scene without one.'),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', disabled: !state.chatId ? true : null, onclick: () => send({ type: 'gate_edit', chatId: state.chatId, op: 'reset' }) }, 'Undo my changes in this chat'),
                h('span', { class: 'rpgc-note' }, 'Phases you set by hand, reports you accepted or dismissed.')),
            h('p', { class: 'rpgc-note' }, 'A preset can place the positions itself with {{rpgc_gates}}; then the extension does not add its own message.'));
    }

    // Chekhov's gun (FrankenSIM): details the story planted that have not paid off yet.
    function renderChekhov() {
        const m = mindsOf();
        const c = m && m.chekhov;
        if (!c || ((sysCfg().minds || {}).chekhov === false)) return [];
        if (!c.chamber.length && !c.locked.length && !c.fired.length && !(c.byYou || []).length) return [];
        const out = [h('h4', null, '🔫 Planted details')];
        const drop = (b) => h('button', { class: 'rpgc-mini', title: 'This does not fit: stop reminding the story of it', 'aria-label': `Drop: ${b.what}`, onclick: () => send({ type: 'sim_edit', chatId: state.chatId, op: 'drop', what: b.what }) }, '✕');
        const row = (b, cls, lead) => h('li', { class: cls },
            h('span', { class: 'mark' }, lead), h('span', { class: 'grow' }, b.what),
            h('span', { class: 'rpgc-chip', title: 'How much it matters, 1-3' }, '★'.repeat(b.w)),
            b.locked ? h('span', { class: 'rpgc-chip', title: b.lock || '' }, '🔒 ', b.lockText) : b.ripe ? h('span', { class: 'rpgc-chip warm', title: 'Planted a while ago and free to pay off' }, 'ripe') : h('span', { class: 'rpgc-chip' }, `${b.age} repl${b.age === 1 ? 'y' : 'ies'}`),
            b.status === 'live' ? drop(b) : null);
        if (c.chamber.length || c.locked.length) out.push(h('ul', { class: 'rpgc-list rpgc-chekhov' }, ...c.chamber.map(b => row(b, b.ripe ? 'ripe' : '', '▸')), ...c.locked.map(b => row(b, 'locked', '▸'))));
        if (c.fired.length) out.push(simSubdet('chekhov-fired', `Paid off (${c.fired.length})`, h('ul', { class: 'rpgc-list rpgc-chekhov' }, c.fired.map(b => h('li', { class: 'fired' }, h('span', { class: 'mark' }, '💥'), h('span', { class: 'grow' }, b.what), h('span', { class: 'rpgc-note' }, b.ago === 0 ? 'this reply' : `${b.ago} repl${b.ago === 1 ? 'y' : 'ies'} ago`))))));
        if ((c.byYou || []).length) out.push(simSubdet('chekhov-mine', `Taken out by you (${c.byYou.length})`, h('ul', { class: 'rpgc-list' }, c.byYou.map(t => h('li', null, h('span', { class: 'grow' }, t), h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'sim_edit', chatId: state.chatId, op: 'undrop', what: t }) }, 'Put back'))))));
        out.push(h('p', { class: 'rpgc-note' }, 'Planted by the story, kept by the extension (Chekhov’s gun, from FrankenSIM). The story is reminded of them and decides itself when one pays off.'));
        return out;
    }

    function renderMindsSettings() {
        const s = S();
        if (!s.hmsSystems) s.hmsSystems = {};
        const M = () => (s.hmsSystems.minds = isObj(s.hmsSystems.minds) ? s.hmsSystems.minds : {});
        const tog = (label, key, note) => toggle(label, () => M()[key] !== false, v => { M()[key] = v; }, note);
        const num = (label, key, lo, hi, def, note) => h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, label),
            h('input', { type: 'number', min: String(lo), max: String(hi), value: String(M()[key] ?? def), 'aria-label': label, onchange: (e) => { M()[key] = Math.max(lo, Math.min(hi, parseInt(e.target.value) || def)); saveSettings(); } }),
            note ? h('span', { class: 'rpgc-note' }, note) : null);
        const on = M().enabled !== false;
        return section('s-minds', 'Minds (from FrankenSIM)', state.open, on ? 'on' : 'off',
            h('p', { class: 'rpgc-note' }, 'What goes on inside the people of the story: how they feel, what they show, how they feel about you and each other, what they are doing, what they know, and the details the story planted. The model only reports what moved in a reply; the extension keeps the numbers, caps each step, lets unfed feelings fade, and hands the state back before the next reply. Your bot’s cards and HUD always come first.'),
            tog('Minds: feelings inside and toward others', 'enabled', 'TFDY (tenderness, fury, dread, yearning), how warm they show themselves, their mask, and twelve feelings toward you.'),
            selectRow('Feelings toward you', M().matrix === 'bars' ? 'bars' : 'aether', [['aether', 'Twelve feelings (FrankenSIM)'], ['bars', 'Classic bars (Affection, Trust…)']], v => { M().matrix = v; saveSettings(); }),
            selectRow('Also between the others', M().pairs === 'you' ? 'you' : 'all', [['all', 'Yes, between the people present'], ['you', 'No, only toward you']], v => { M().pairs = v; saveSettings(); }),
            num('Most a feeling moves in one reply', 'maxStep', 1, 4, 2, 'FrankenSIM: 2.'),
            num('Replies before an unfed feeling eases', 'decay', 2, 8, 3, 'One step back every this many replies.'),
            tog('Hand the state back to the model', 'tell', 'Before each reply. Off saves tokens, but the story forgets between replies.'),
            h('h4', null, 'More from FrankenSIM'),
            tog('Agendas: what everyone is doing', 'agendas', 'Here and elsewhere, until when. Nobody jumps between places.'),
            tog('Who knows what', 'knowledge', 'What each person found out, and how. Nobody knows what never reached them.'),
            tog('Chekhov’s gun: planted details', 'chekhov', 'Shown in the Quests card. The story decides when one pays off.'),
            tog('Building maps', 'buildings', 'The rooms the story drew, joined into whole buildings, floor by floor, in the Map card. Needs the room map (Positions) on.'),
            h('p', { class: 'rpgc-note' }, 'Cost: with everything on, about 1,000 tokens of instructions and 300–600 tokens of state per reply, plus what the model writes in its hidden block. Each switch saves some.'),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', disabled: !state.chatId ? true : null, onclick: () => send({ type: 'sim_edit', chatId: state.chatId, op: 'reset' }) }, 'Undo my corrections in this chat'),
                h('span', { class: 'rpgc-note' }, 'Facts you made someone forget, details you dropped.')),
            h('p', { class: 'rpgc-note credit' }, 'Ported from ', h('b', null, 'FrankenSIM 4 Mini'), ' by ', h('b', null, 'Wireless (Ryah)'), ', with permission. ', h('b', null, 'TFDY'), ' (Tenderness, Fury, Dread, Yearning) is by ', h('b', null, 'Pyropia'), '. Thank you both.'));
    }

    // Building maps (from FrankenSIM's atlas): the rooms the story drew, joined into whole buildings.
    function renderBuilding() {
        const own = state.hms && state.hms.buildings;
        const b = state.buildingView && state.buildingView.key && own && state.buildingView.key !== own.key ? state.buildingView : own;
        if (!b || !b.floors || !b.floors.length) return null;
        const fk = 'bfloor-' + b.key;
        let z = state[fk];
        if (!b.floors.some(f => f.z === z)) z = (b.floors.find(f => f.here) || b.floors.find(f => f.z === 0) || b.floors[0]).z;
        const f = b.floors.find(x => x.z === z);
        const out = [];
        out.push(h('div', { class: 'rpgc-row tight' }, h('b', null, b.name), b.here ? h('span', { class: 'rpgc-chip here' }, 'you are here') : null,
            b !== own && own ? h('button', { class: 'rpgc-mini', onclick: () => { state.buildingView = null; render(); } }, 'Back to where you are') : null));
        if (b.floors.length > 1) out.push(h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Floor' }, b.floors.map(x => h('button', { class: 'rpgc-btn' + (x.z === z ? ' primary' : ''), 'aria-pressed': x.z === z ? 'true' : 'false', onclick: () => { state[fk] = x.z; render(); } }, `${x.here ? '📍 ' : ''}${x.label}`))));
        out.push(mapBox(f.svg, b.vars, `${b.name}, ${f.label}`));
        if (f.people.length) out.push(h('div', { class: 'rpgc-chips', style: 'justify-content:center;margin-top:4px' }, f.people.map(q => h('span', { class: 'rpgc-chip' }, `${q.name === 'You' ? '📍 You' : q.name} · ${q.room}`))));
        const loose = f.rooms.filter(r => !r.joined);
        if (loose.length) out.push(h('p', { class: 'rpgc-note' }, `Not joined yet (no door leads there so far): ${loose.map(r => r.name).join(', ')}.`));
        if (b.others && b.others.length) out.push(h('div', { class: 'rpgc-row rpgc-suggest' }, h('span', { class: 'rpgc-note' }, 'Other buildings:'),
            b.others.map(o => h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'building_get', chatId: state.chatId, key: o.key }) }, `${o.name} (${o.rooms})`))));
        out.push(h('p', { class: 'rpgc-note' }, 'Joined from the rooms the story drew, by their doors — no tokens spent (building maps, from FrankenSIM’s atlas). Someone not in the room with you shows by their agenda.'));
        return out;
    }

    // ─────────── Phone ───────────

    function renderPhone() {
        const p = (state.hms && state.hms.comms) || (state.extras && state.extras.comms) || null;
        const c = (sysCfg().comms) || {};
        if (!p || c.enabled === false) return null;
        const out = [];
        out.push(h('div', { class: 'rpgc-phone-head' },
            h('span', null, p.device ? `${p.icon || '\uD83D\uDCF1'} ${p.device.name}${p.device.from === 'you' || p.device.from === 'chat' ? ' (set by you)' : p.device.from === 'inventory' ? ' (in your inventory)' : p.device.from === 'standard' ? ' (standard issue)' : ''}` : 'No device'),
            p.balance ? h('span', { class: 'bal' }, `${p.balance.label}: ${p.balance.value}`) : null));
        // your own device for this chat: for a story that gave you one the HUD never prints
        const devIn = h('input', { type: 'text', placeholder: p.kind === 'mirror' ? 'Conversation mirror' : p.kind === 'spell' ? 'Message spell' : 'Phone', 'aria-label': 'Your device', maxlength: '40', style: 'flex:1;min-width:0' });
        const setDev = () => { const v = devIn.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'set_device', name: v }); };
        devIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') setDev(); });
        if (!p.device) {
            out.push(h('p', { class: 'rpgc-note' }, 'You have nothing to reach anyone with. When the story gives you a phone, a paired mirror or the like \u2014 and it shows on your HUD \u2014 this wakes up. If the story already gave you one, name it here:'));
            out.push(h('div', { class: 'rpgc-row' }, devIn, h('button', { class: 'rpgc-btn primary', onclick: setDev }, 'I have this')));
            return section('phone', p.title || 'Phone', state.open, null, ...out);
        }
        const devSet = h('details', { class: 'rpgc-subdet' }, h('summary', null, p.device.from === 'chat' ? 'Your device (set by you)' : 'Use another device'),
            h('p', { class: 'rpgc-note' }, 'For this chat only. The story still decides whether a message gets through.'),
            h('div', { class: 'rpgc-row' }, devIn, h('button', { class: 'rpgc-btn', onclick: setDev }, 'Set'),
                p.device.from === 'chat' ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'comms', chatId: state.chatId, op: 'clear_device' }) }, 'Clear') : null));
        if (p.device.from === 'chat') devIn.value = p.device.name;
        const open = state.phoneWith;
        const th = open ? p.threads.find(t => t.name.toLowerCase() === open.toLowerCase()) : null;
        if (open) {
            const contact = p.contacts.find(x => x.name.toLowerCase() === open.toLowerCase());
            out.push(h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn', onclick: () => { state.phoneWith = null; render(); } }, '\u2190 Contacts'), h('strong', null, open), contact && contact.how ? h('span', { class: 'rpgc-note' }, contact.how) : null));
            out.push(h('div', { class: 'rpgc-thread', role: 'log' }, th && th.items.length ? th.items.map(it => h('div', { class: 'msg ' + it.dir + ' ' + it.kind },
                it.kind === 'call' ? `\uD83D\uDCDE ${it.dir === 'out' ? 'You called' : 'Call'}${it.text ? ': ' + it.text : ''}` : it.kind === 'pay' ? `\uD83D\uDCB8 You sent ${it.text}` : it.text)) : h('p', { class: 'rpgc-note' }, 'No messages yet.')));
            const input = h('input', { type: 'text', placeholder: `Message ${open}\u2026`, 'aria-label': `Message to ${open}`, style: 'flex:1;min-width:0' });
            const sendText = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'comms', chatId: state.chatId, op: 'text', to: open, text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendText(); } });
            const callLabel = { phone: '\uD83D\uDCDE Call', mirror: '\uD83E\uDE9E Speak', spell: '\u2728 Message', radio: '\uD83D\uDCE1 Hail' }[p.kind] || '\uD83D\uDCDE Call';
            const callBtn = h('button', { class: 'rpgc-btn' + (p.canText ? '' : ' primary'), title: `Reach ${open}`, onclick: () => { const v = p.canText ? '' : input.value.trim(); input.value = ''; send({ type: 'comms', chatId: state.chatId, op: 'call', to: open, text: v }); } }, callLabel);
            if (!p.canText) input.placeholder = `What you say to ${open}\u2026 (optional)`;
            out.push(h('div', { class: 'rpgc-row' }, input, p.canText ? h('button', { class: 'rpgc-btn primary', onclick: sendText }, 'Send') : null, callBtn));
            if (p.balance && p.canPay) {
                const amt = h('input', { type: 'text', placeholder: 'Amount', 'aria-label': 'Amount to send', style: 'width:90px' });
                out.push(h('div', { class: 'rpgc-row' }, amt, h('button', { class: 'rpgc-btn', onclick: () => { const v = amt.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'pay', to: open, amount: v }); } }, `Send ${p.balance.label}`)));
            }
            out.push(h('p', { class: 'rpgc-note' }, 'Everything you send goes into the story as your turn. Whether it reaches them, and what they do, is the story\u2019s call.'));
            return section('phone', p.title || 'Phone', state.open, open, ...out);
        }
        const unknown = p.threads.filter(t => !t.known && t.items.some(i => i.dir === 'in'));
        if (!p.contacts.length) out.push(h('p', { class: 'rpgc-note' }, p.kind === 'spell' ? 'A Message reaches someone you know. Everyone you meet appears here.' : p.kind === 'mirror' ? 'A conversation mirror reaches only its paired twin. When the story hands you one, it appears here.' : 'No contacts yet. You get them in the story \u2014 swap numbers, get added to a group chat \u2014 and they appear here.'));
        out.push(h('ul', { class: 'rpgc-list rpgc-contacts' }, p.contacts.map(ct => {
            const t = p.threads.find(x => x.name.toLowerCase() === ct.name.toLowerCase());
            const last = t && t.items.length ? t.items[t.items.length - 1] : null;
            return h('li', null,
                h('button', { class: 'rpgc-linkbtn grow', onclick: () => { state.phoneWith = ct.name; render(); } }, h('b', null, ct.name), last ? h('span', { class: 'prev' }, ` ${last.dir === 'in' ? '' : 'You: '}${String(last.text || last.kind).slice(0, 40)}`) : null),
                ct.from === 'you' ? h('span', { class: 'rpgc-chip', title: 'Added by you, not by the story' }, 'yours') : ct.from === 'met' ? h('span', { class: 'rpgc-chip', title: 'Someone you have met' }, 'met') : ct.from === 'inbox' ? h('span', { class: 'rpgc-chip', title: 'They messaged you, so you can answer' }, ct.how === 'group chat' ? 'group' : 'messaged you') : null,
                ct.from === 'you' ? h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${ct.name}`, onclick: () => send({ type: 'comms', chatId: state.chatId, op: 'remove_contact', name: ct.name }) }, '\u2715') : null);
        })));
        if (unknown.length) out.push(h('p', { class: 'rpgc-note' }, `Messages from people not in your contacts: ${unknown.map(t => t.name).join(', ')}.`));
        if (p.notices && p.notices.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, '\uD83D\uDD14 Notices'),
            h('ul', { class: 'rpgc-list' }, p.notices.slice(0, 5).map(n => h('li', { style: 'display:block' }, h('b', null, n.from), ` \u2014 ${n.text}`)))));
        const nameIn = h('input', { type: 'text', placeholder: 'Name', 'aria-label': 'Contact name', style: 'flex:1;min-width:0' });
        out.push(h('details', { class: 'rpgc-subdet' }, h('summary', null, 'Add a contact by hand'),
            h('p', { class: 'rpgc-note' }, 'Only for a number the story really gave you and the tracker missed.'),
            h('div', { class: 'rpgc-row' }, nameIn, h('button', { class: 'rpgc-btn', onclick: () => { const v = nameIn.value.trim(); if (v) send({ type: 'comms', chatId: state.chatId, op: 'add_contact', name: v }); } }, 'Add'))));
        out.push(devSet);
        return section('phone', p.title || 'Phone', state.open, p.contacts.length ? String(p.contacts.length) : null, ...out);
    }

    // ─────────── Play-style presets and themes ───────────

    // What a saved preset remembers: the look, how HMS runs, the panels, fights and every system.
    const STYLE_PATHS = ['positions', 'uiTheme', 'uiDensity', 'uiTextSize', 'hmsMode', 'hmsCompanion', 'hmsGuard', 'hmsPinReminder', 'showDiceDisplay', 'showCharacterThoughts', 'showQuests', 'enableDynamicWeather', 'encounterSettings', 'hmsSystems', 'immersive', 'dnd', 'chapters', 'worldCard', 'lore', 'hmsCore', 'memory', 'uiDialSky', 'uiWeatherDetail', 'trackerConfig.presentCharacters.thoughts.enabled', 'chatDisplay.papersAsk'];
    // Worlds: everything a bot's world needs, so one click makes the panel belong to it.
    // 2.8: D&D is off in every style but the D&D one
    const HMS_ON = { hmsMode: 'on', hmsCompanion: true, hmsGuard: true, hmsPinReminder: true, showCharacterThoughts: true, showQuests: true, 'dnd.enabled': false };
    const WORLD_STYLES = [
        { id: 'w-rezero', name: 'Re:Zero \u2014 The Living World', hms: true,
            desc: 'HMS always on. Carriers for Authorities, Spirit Contracts, the Mental Council and WHDAAA reels; Authorities, Divine Protections and Spirit Contracts as abilities; Corruption read as a rising danger and Od Integrity as a falling one; Return by Death rewinds understood, and every life kept as a Loops chapter alongside the arcs. Conversation mirrors instead of phones. The party tracks Affect Bands, gated phases and bond stages. The world card, and D&D for the bot\u2019s D&D mode. Engine-rule immersive fights; the HUD owns wounds and conditions, so no survival clock.',
            data: { ...HMS_ON, uiTheme: 'rezero', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, loops: true, arcs: true }, dnd: { enabled: false, useHud: true },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, MP, Mana, Od, Integrity, Vitality, Health', healthPools: 'HP, Health, Vitality', invertedMeters: 'Corruption, Strain, Overload', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'STR, DEX, CON, INT, WIS, CHA, AGI, VIT, PER, LUK',
                        vocabulary: 'Authorities: [AUTHORITY], [WITCH FACTOR]\nDivine Protections: [DIVINE PROTECTION]\nContracts: [SPIRIT CONTRACT], [CONTRACT]\nMagic: Magic, Gate, Pool, Spirit Affinity\nSkills: Skills\nClasses: Class\nTraits: [HEAVENLY SWORD], [AXIOM]\nTitles: Titles, Title\nRoles: Role, Academic Rank, Academic Role' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, [MAIN QUEST], [SIDE QUEST], [QUEST]', journal: true },
                    carriers: 'Arc, Memory, Quests, Game Mode, Now Playing, [AUTHORITY], [DIVINE PROTECTION], [SPIRIT CONTRACT], [MENTAL COUNCIL]',
                    selfClearing: 'Injuries, Condition, [STATUS], [WARNING], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'mirror', device: '', deviceWords: 'conversation mirror, dialogue mirror, metia, mirror', balanceLabels: 'Gold, Silver, Coins, Holy Coins, Money' },
                    survival: { enabled: false }, health: { enabled: true, depth: 'medium' } } } },
        { id: 'w-overlord', name: 'Overlord \u2014 The Living World', hms: true,
            desc: 'HMS always on. Carriers for Gamemode and Blessings; the Abilities line read as passives and Skills as actions; Martial Arts, talents, world items, Runecraft and Perfect Warrior understood; Focus, Super-Tier Slots and the vampire\u2019s Blood Pool as resources, Thirst State as a condition. The Message spell reaches anyone you have met (clear the device if your character cannot cast it). The world card with its framework check, arcs as chapters. Engine-rule immersive fights: every combatant has a level and the level gap is physics. No D&D: YGGDRASIL runs on its own levels.',
            data: { ...HMS_ON, uiTheme: 'overlord', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, MP, Focus, Super-Tier Slots, Spell Slots, Blood Pool, Integrity', healthPools: 'HP', invertedMeters: 'Corruption, Strain', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Thirst State' },
                    abilities: { enabled: true, attributes: 'STR, DEX, CON, INT, WIS, CHA',
                        vocabulary: 'Skills: Skills\nPassives: Abilities, Passives\nMartial Arts: Martial Arts\nMagic: System, Tradition, Traditions, Wild Magic, Blood Tradition\nClasses: Classes, Class, Racial Lvl\nTalents: Talent, Talents, [TALENT]\nCrafts: Runecraft\nWorld Items: [WORLD ITEM]\nBlessings: Blessings\nTraits: [PERFECT WARRIOR], [OVER MAGIC]\nRoles: Role, Adventurer, Worker' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Arc, Current Arc, Gamemode, Blessings, Memory, Quests',
                    selfClearing: 'Injuries, Condition, [STATUS], [WARNING], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'spell', device: 'Message spell', deviceWords: 'Message, scroll of Message', balanceLabels: 'Gold, Coins, Money' },
                    survival: { enabled: false }, health: { enabled: true, depth: 'light' } } } },
        { id: 'w-cote', name: 'Classroom of the Elite \u2014 HMS Render Engine', hms: true,
            desc: 'HMS always on. Carriers for Arc, Quests, Memory and Game Mode; Exams and resolved statuses clear themselves; OAA ratings, the School Database and Godmother stats read as attributes; the Protection Point as an asset. School smartphones with texts, calls and Private Point transfers. Relationships up front, with facades tracked for the people who wear them. The world card with the Standings, the Godmother and the School Database; the school months and arcs as chapters. The School Database rolls its own dice, so no D&D and no roller of yours.',
            data: { ...HMS_ON, uiTheme: 'cote', showDiceDisplay: false, enableDynamicWeather: false, worldCard: true, chapters: { enabled: true, months: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, Stamina, Energy', healthPools: 'HP', invertedMeters: 'Stress, Suspicion, Exposure', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'ACA, JUD, PRE, PHY, AGI, END, Academics, Academic, Intellect, Judgment, Presence, Physical, Agility, Endurance, Cooperation',
                        vocabulary: 'Roles: Role, Committee, Club\nSkills: Skills\nTitles: Titles, Title\nAssets: Protection Point' },
                    quests: { enabled: true, labels: 'Quests, Quest', journal: true },
                    carriers: 'Arc, Quests, Memory, Game Mode',
                    selfClearing: 'Injuries, Condition, Exam, [STATUS], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'phone', device: '', deviceWords: 'smartphone, phone, school phone, cellphone', balanceLabels: 'Private Points, PP' },
                    survival: { enabled: false }, health: { enabled: true, depth: 'medium' } } } },
        { id: 'w-mushoku', name: 'Mushoku Tensei \u2014 The Six-Faced World', hms: true,
            desc: 'HMS always on. Carriers for the Arc, Memory, the Man-God and Demon Eye lines and Game Mode; sword styles, magic schools, Touki, casting and contracts read as abilities; Injuries and conditions are the HUD\u2019s own, so no survival clock. No phones in this world. The world card follows the K. calendar, your age, your ranks on both ladders, languages, and writes down the Man-God\u2019s advice; arcs as chapters. No D&D. Engine-rule immersive fights.',
            data: { ...HMS_ON, uiTheme: 'mushoku', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'Mana, MP', healthPools: '', invertedMeters: '', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Drain Syndrome' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'Martial: Martial Style, Touki, Active Stance\nMagic: Magic School, Casting Method, Mana Capacity\nContracts: Contracts, [SUMMON PACT], [SPIRIT]\nEyes: [DEMON EYE]\nMarks: [CURSE], [BLESSING]\nRoles: Role, Term, Adventurer' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Current Arc, Arc, Memory, [HITOGAMI], [DEMON EYE], Game Mode',
                    selfClearing: 'Injuries, Condition, Active Stance, [STATUS]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false }, health: { enabled: true, depth: 'medium' } } } },
        { id: 'w-scp', name: 'SCP-4666 \u2014 The Yule Man', hms: true,
            desc: 'HMS always on. The panel as a typed Foundation report: paper, black rules, one red stamp. The world card counts the twelve nights of Weissnacht and shows the phase, the mode, the household or the team, and the coin. Conditions and items read from the HUD. No magic, no D&D, no roller of yours.',
            data: { ...HMS_ON, uiTheme: 'scp', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                // 2.6: horror, not a power fight; a farmhouse with no phone line to speak of; a body that freezes and cannot sleep
                encounterSettings: { enabled: true, style: 'fiction', fateDice: false, companionsMayRefuse: true },
                hmsSystems: { magic: { enabled: false }, comms: { enabled: false }, party: { enabled: true, trackMask: true, trackNeeds: true }, relations: { enabled: true, layout: 'cards' },
                    health: { enabled: true, depth: 'heavy' } } } },
        { id: 'w-potter', name: 'Harry Potter \u2014 The Wizarding World', hms: true,
            desc: 'HMS always on. The panel in Hogwarts colours: deep red, gold and old paper. The world card shows the school year and term, your house, the four house-point hourglasses, your wand, your four studies (LV of 7), your extra spells and your Patronus. The clock is an astrolabe. No D&D, no rolls.',
            data: { ...HMS_ON, uiTheme: 'potter', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                // 2.6: owls carry the letters (the Letters card), not phones; duels by the engine's own rules; a body, not hit points
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: { comms: { enabled: false }, party: { enabled: true, trackMask: true }, relations: { enabled: true, layout: 'cards' }, magic: { enabled: true, spellList: true, study: true },
                    health: { enabled: true, depth: 'medium' } } } },
        { id: 'w-undertale', name: 'Undertale \u2014 The Underground', hms: true,
            desc: 'HMS always on. Carriers for the Route, the SOUL, the SAVE point and Game Mode; LV, EXP, AT and DF on the world card, KR as a rising danger; items and ACTs as abilities. Cell phones, with Papyrus\u2019s number waiting. SAVE, LOAD and RESET understood as rewinds, and each timeline kept as a Loops chapter. The world card shows your SOUL, LV, the route and its kills. Engine-rule immersive fights, where sparing a monster ends it as well as winning.',
            data: { ...HMS_ON, uiTheme: 'undertale', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, loops: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP', healthPools: 'HP', invertedMeters: 'KR, Karma', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'SOUL: SOUL\nMagic: Magic, Attacks\nACT: ACT, ACTs\nItems: Items\nEquipment: Weapon, Armor\nRoute: Route, Kills\nTitles: Title, Titles' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives', journal: true },
                    carriers: 'Route, SOUL, SAVE, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT]',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: true, kind: 'phone', device: '', deviceWords: 'Cell Phone, cell phone, phone', balanceLabels: 'G, Gold' },
                    survival: { enabled: false }, health: { enabled: true, depth: 'light' } } } },
        { id: 'w-darksouls', name: 'Dark Souls \u2014 The Age of Fire', hms: true,
            desc: 'HMS always on. Carriers for the Bonfire, the Covenant, the area and Game Mode; the nine stats read as attributes; HP, FP and Stamina as pools \u2014 the HUD owns your Stamina in fights \u2014 with Estus as flasks on the world card; Hollowing, Curse, Bleed, Poison and Frostbite as rising dangers. No phones. The world card shows your souls, your bloodstain, Estus, Humanity and the bonfire you rested at. Hard difficulty, engine-rule immersive fights.',
            data: { ...HMS_ON, uiTheme: 'darksouls', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true, difficulty: 'hard' },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'HP, FP, Stamina', healthPools: 'HP', invertedMeters: 'Hollowing, Curse, Bleed, Poison, Toxic, Frostbite', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: '' },
                    abilities: { enabled: true, attributes: 'VIG, VIT, ATT, END, STR, DEX, RES, INT, FTH, LCK',
                        vocabulary: 'Covenant: Covenant\nSpells: Sorceries, Miracles, Pyromancies, Spells, Attuned\nRings: Rings, Ring\nEquipment: Weapon, Shield, Armor, Catalyst\nEmbers: Humanity, Form, Hollowing\nRoles: Class, Origin, Title' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, Lords of Cinder, Bells of Awakening, Lord Souls', journal: true },
                    carriers: 'Bonfire, Covenant, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT], Buildup',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: false, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false }, health: { enabled: true, depth: 'light' } } } },
        { id: 'w-skyrim', name: 'Skyrim \u2014 The Last Dragonborn', hms: true,
            desc: 'HMS always on. Carriers for the Hold, Quests, factions and Game Mode; Health, Magicka and Stamina as pools \u2014 the HUD owns yours in fights; shouts, skills, perks, the Standing Stone, powers and afflictions as abilities. No phones: couriers carry letters. Followers in the party. The world card shows your level, dragon souls, every shout\u2019s words, your skills, bounties by hold and carry weight. Arcs as chapters, engine-rule immersive fights. Switch the survival clock on for Survival Mode.',
            data: { ...HMS_ON, uiTheme: 'skyrim', showDiceDisplay: false, enableDynamicWeather: true, worldCard: true, chapters: { enabled: true, arcs: true }, dnd: { enabled: false },
                encounterSettings: { enabled: true, style: 'engine', fateDice: false, companionsMayRefuse: true },
                hmsSystems: {
                    vitals: { enabled: true, pools: 'Health, Magicka, Stamina, HP, MP', healthPools: 'Health, HP', invertedMeters: 'Hunger, Fatigue, Cold, Blood Starvation', lowPct: 25, criticalPct: 10, showDeltas: true },
                    body: { wounds: true, conditions: true, rawWarnHours: 72, conditionFields: 'Disease' },
                    abilities: { enabled: true, attributes: '',
                        vocabulary: 'Shouts: Shouts, Shout, [SHOUT]\nSkills: Skills\nPerks: Perks\nStanding Stone: Standing Stone\nSpells: Spells\nPowers: Powers, Racial Power\nFactions: Factions, Faction\nAfflictions: Affliction, [AFFLICTION], Vampirism, Lycanthropy\nRoles: Race, Title, Thane' },
                    quests: { enabled: true, labels: 'Quests, Quest, Objectives, Main Quest, Side Quests, Miscellaneous', journal: true },
                    carriers: 'Hold, Quests, Factions, Arc, Memory, Game Mode',
                    selfClearing: 'Condition, [STATUS], [EVENT], Disease',
                    party: { enabled: true, trackMask: true, trackBond: true, trackNeeds: true, trackPhase: true, alertLevel: 3, risingTurns: 3 },
                    relations: { enabled: true, layout: 'cards' },
                    comms: { enabled: false },
                    survival: { enabled: false }, health: { enabled: true, depth: 'light' } } } }
    ];
    // 2.6: how much the panel tracks, on top of any world or play style. Light is cheap; Heavy tracks everything.
    // 2.8: six steps. None sets nothing (every switch is yours); Potato is the fewest tokens; Max is everything.
    const STYLE_TIERS = {
        none: { name: 'None / Custom', desc: 'Nothing is set for you: the world or play style still sets fights and the look, but every tracker stays exactly as you have it. For tweaking it all by hand (Characters and Body & health have their own None and Custom too).', data: {} },
        potato: { name: 'Potato', desc: 'For small or cheap models. Only who is here, how they stand with you, and the locks of a broken body. No thoughts, no Minds, no statuses asked, no maps, no profiles. About 150\u2013300 tokens a reply. Pairs with the preset\u2019s Potato mode.',
            data: { 'showCharacterThoughts': false, 'trackerConfig.presentCharacters.thoughts.enabled': false, 'hmsSystems.minds.enabled': false, 'hmsSystems.minds.pairs': 'you', 'hmsSystems.minds.agendas': false, 'hmsSystems.minds.knowledge': false,
                'hmsSystems.characters.profiles': false, 'hmsSystems.party.trackMask': false, 'hmsSystems.party.trackNeeds': false, 'hmsSystems.party.trackBody': false, 'hmsSystems.health.depth': 'light', 'hmsSystems.health.shape': false, 'uiDialSky': 'time', 'uiWeatherDetail': false,
                'positions.mode': 'off', 'hmsSystems.plans.tier': 'off', 'hmsSystems.statuses.ask': false } },
        light: { name: 'Light', desc: 'The story first, the fewest tokens. Who is here and how they stand with you, the phase on their card, wounds and the locks of a broken body. No Minds feelings, no profiles, no weather asks, no map. About 300\u2013500 tokens a reply.',
            data: { 'showCharacterThoughts': true, 'trackerConfig.presentCharacters.thoughts.enabled': false, 'hmsSystems.minds.enabled': false, 'hmsSystems.minds.pairs': 'you', 'hmsSystems.minds.agendas': false, 'hmsSystems.minds.knowledge': false,
                'hmsSystems.characters.profiles': false, 'hmsSystems.party.trackMask': false, 'hmsSystems.party.trackNeeds': false, 'hmsSystems.health.depth': 'light', 'uiDialSky': 'time', 'uiWeatherDetail': false, 'positions.mode': 'off', 'hmsSystems.plans.tier': 'off', 'hmsSystems.statuses.ask': true, 'hmsSystems.party.trackBody': false, 'chatDisplay.papersAsk': false } },
        medium: { name: 'Medium', desc: 'The balance, and the default. Adds thoughts, feelings toward you, agendas and profiles; blood, water and food, dressings, painkillers, sleep and sanity; the weather. About 700\u20131,100 tokens a reply.',
            data: { 'showCharacterThoughts': true, 'trackerConfig.presentCharacters.thoughts.enabled': true, 'hmsSystems.minds.enabled': true, 'hmsSystems.minds.pairs': 'you', 'hmsSystems.minds.agendas': true, 'hmsSystems.minds.knowledge': false,
                'hmsSystems.characters.profiles': true, 'hmsSystems.party.trackMask': true, 'hmsSystems.party.trackNeeds': false, 'hmsSystems.health.depth': 'medium', 'uiDialSky': 'full', 'uiWeatherDetail': true, 'hmsSystems.plans.tier': 'room', 'hmsSystems.statuses.ask': true, 'hmsSystems.party.trackBody': true } },
        heavy: { name: 'Heavy', desc: 'Everything, for long campaigns and gritty play. Adds feelings between the others, who knows what, the party\u2019s needs; stamina, strain and stress; the room map in fights. About 1,300\u20132,000 tokens a reply.',
            data: { 'showCharacterThoughts': true, 'trackerConfig.presentCharacters.thoughts.enabled': true, 'hmsSystems.minds.enabled': true, 'hmsSystems.minds.pairs': 'all', 'hmsSystems.minds.agendas': true, 'hmsSystems.minds.knowledge': true,
                'hmsSystems.characters.profiles': true, 'hmsSystems.party.trackMask': true, 'hmsSystems.party.trackNeeds': true, 'hmsSystems.health.depth': 'heavy', 'uiDialSky': 'full', 'uiWeatherDetail': true, 'positions.mode': 'fights', 'hmsSystems.plans.tier': 'plan', 'hmsSystems.statuses.ask': true, 'hmsSystems.party.trackBody': true } },
        max: { name: 'Max', desc: 'Everything on, for big models and long campaigns: Heavy, plus the room map every reply, the floor plans in 3D, and the full Minds. About 2,000\u20133,000 tokens a reply. Pairs with the preset\u2019s Max mode.',
            data: { 'showCharacterThoughts': true, 'trackerConfig.presentCharacters.thoughts.enabled': true, 'hmsSystems.minds.enabled': true, 'hmsSystems.minds.pairs': 'all', 'hmsSystems.minds.agendas': true, 'hmsSystems.minds.knowledge': true,
                'hmsSystems.characters.profiles': true, 'hmsSystems.party.trackMask': true, 'hmsSystems.party.trackNeeds': true, 'hmsSystems.health.depth': 'heavy', 'uiDialSky': 'full', 'uiWeatherDetail': true, 'positions.mode': 'always',
                'hmsSystems.plans.tier': '3d', 'hmsSystems.statuses.ask': true, 'hmsSystems.party.trackBody': true } },
    };
    const BUILTIN_STYLES = [
        { id: 'hms', name: 'HMS Narrative', desc: 'The default. HMS always on; your engine decides immersive fights; party and relationships tracked; the world card and chapters on; no survival clock.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'worldCard': true, 'chapters.enabled': true, 'encounterSettings.style': 'engine', 'encounterSettings.fateDice': false, 'encounterSettings.companionsMayRefuse': true, 'hmsSystems.relations.enabled': true, 'hmsSystems.party.enabled': true, 'hmsSystems.survival.enabled': false, 'uiTheme': 'host', 'showDiceDisplay': true } },
        { id: 'dnd', name: 'D&D', desc: 'HMS always on, with full tabletop rules: your sheet and the roller, and turn-based fights with initiative, attack rolls against AC, damage dice, criticals, saving throws, spell slots and death saves. The extension rolls and does the math. The map tracks positions in fights.',
            data: { ...HMS_ON, 'encounterSettings.system': 'dnd', 'dnd.enabled': true, 'positions.mode': 'fights', 'encounterSettings.dnd': { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true }, 'showDiceDisplay': true, 'hmsSystems.abilities.enabled': true, 'uiTheme': 'parchment' } },
        { id: 'power', name: 'Power scaling', desc: 'HMS always on. Immersive fights settled by power level, feats, hax and counters, with fate dice for close matches.',
            data: { ...HMS_ON, 'encounterSettings.style': 'power', 'encounterSettings.fateDice': true, 'positions.mode': 'fights', 'uiTheme': 'midnight' } },
        { id: 'story', name: 'Pure narrative', desc: 'HMS always on. No dice anywhere: no roller, no D&D, no fate dice. The fiction decides, and fights ask the story for the least \u2014 lightest on tokens.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'encounterSettings.style': 'fiction', 'encounterSettings.fateDice': false, 'showDiceDisplay': false, 'dnd.enabled': false, 'immersive.moves': false, 'immersive.plans': false } },
        { id: 'gritty', name: 'Gritty survival', desc: 'HMS always on. Survival clock on, wounds flagged sooner, companions question orders, hard difficulty, engine-rule fights.',
            data: { ...HMS_ON, 'encounterSettings.difficulty': 'hard', 'positions.mode': 'fights', 'hmsSystems.survival.enabled': true, 'hmsSystems.survival.tellModel': true, 'hmsSystems.health.depth': 'heavy', 'hmsSystems.body.rawWarnHours': 48, 'encounterSettings.style': 'engine', 'encounterSettings.companionsMayRefuse': true, 'uiTheme': 'host' } },
        { id: 'social', name: 'Social & romance', desc: 'HMS always on. Relationships up front in the hearts layout, party moods and bonds tracked closely, the phone on.',
            data: { ...HMS_ON, 'positions.mode': 'off', 'hmsSystems.comms.enabled': true, 'hmsSystems.relations.enabled': true, 'hmsSystems.relations.layout': 'hearts', 'hmsSystems.party.enabled': true, 'hmsSystems.party.trackBond': true, 'hmsSystems.party.trackMask': true, 'uiTheme': 'sakura' } }
    ];
    const THEMES = [['host', 'Lumiverse (follow the app)'], ['rezero', 'Re:Zero (wiki)'], ['overlord', 'Overlord (wiki)'], ['cote', 'Classroom of the Elite (wiki)'], ['mushoku', 'Mushoku Tensei (wiki)'], ['undertale', 'Undertale'], ['darksouls', 'Dark Souls'], ['skyrim', 'Skyrim'], ['scp', 'SCP Foundation'], ['potter', 'Harry Potter (Hogwarts)'],
        ['lantern', 'Lantern (warm, dark)'], ['tidepool', 'Tidepool (teal, dark)'], ['dusk', 'Dusk (plum, dark)'], ['paper', 'Paper (light)'],
        ['dnd', 'D&D'], ['heaven', 'Heaven'], ['horror', 'Horror'], ['hell', 'Hell'], ['space', 'Space'], ['parchment', 'Parchment'], ['midnight', 'Midnight'], ['terminal', 'Terminal'], ['sakura', 'Sakura']];

    function pathGet(o, path) { return path.split('.').reduce((a, k) => (a && typeof a === 'object' ? a[k] : undefined), o); }
    function pathSet(o, path, v) {
        const ks = path.split('.');
        let cur = o;
        for (const k of ks.slice(0, -1)) { if (!isObj(cur[k])) cur[k] = {}; cur = cur[k]; }
        const last = ks[ks.length - 1];
        // Deep: a preset changes what it names and leaves everything else as you had it.
        const merge = (base, add) => {
            if (!isObj(base) || !isObj(add)) return JSON.parse(JSON.stringify(add));
            const out = { ...base };
            for (const [k, x] of Object.entries(add)) out[k] = isObj(x) && isObj(base[k]) ? merge(base[k], x) : JSON.parse(JSON.stringify(x));
            return out;
        };
        cur[last] = merge(cur[last], v);
    }
    // A preset changes only what it names. A section it names is merged into yours, not swapped for it:
    // your chapter budget, your D&D rules and your XP curve stay as you set them.
    function applyStyle(data) {
        const s = S();
        if (data && Object.keys(data).some(k => /^(showCharacterThoughts|trackerConfig\.presentCharacters|hmsSystems\.(relations|minds|gates|characters|party))/.test(k))) delete s.charLevel;   // 2.9: a style's level replaces Custom
        const merge = (dst, src) => { for (const [k, v] of Object.entries(src)) { if (isObj(v) && isObj(dst[k])) merge(dst[k], v); else dst[k] = clone(v); } return dst; };
        for (const [path, v] of Object.entries(data || {})) {
            const cur = pathGet(s, path);
            if (isObj(v) && isObj(cur)) merge(cur, v);
            else pathSet(s, path, clone(v));
        }
        saveSettings(false);
        render();
    }
    function captureStyle() {
        const s = S(), out = {};
        for (const path of STYLE_PATHS) { const v = pathGet(s, path); if (v !== undefined) out[path] = JSON.parse(JSON.stringify(v)); }
        return out;
    }
    function themeClass() {
        const s = S() || {};
        const t = s.uiTheme;
        return (t && t !== 'host' ? ' theme-' + t : '') + (s.uiDensity === 'compact' ? ' density-compact' : '') + (s.uiTextSize && s.uiTextSize !== 'normal' ? ' text-' + s.uiTextSize : '') + (s.uiEasyRead ? ' rpgc-easy' : '');
    }

    function renderStyleSettings() {
        const s = S();
        if (!isObj(s.stylePresets)) s.stylePresets = { presets: {}, active: 'hms' };
        const sp = s.stylePresets;
        const user = Object.entries(sp.presets || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
        const sel = h('select', { 'aria-label': 'Play style preset', onchange: (e) => { state.stylePick = e.target.value; render(); } },
            h('optgroup', { label: 'Worlds' }, WORLD_STYLES.map(b => h('option', { value: b.id }, b.name))),
            h('optgroup', { label: 'Play styles' }, BUILTIN_STYLES.map(b => h('option', { value: b.id }, b.name))),
            user.length ? h('optgroup', { label: 'Yours' }, user.map(u => h('option', { value: 'user:' + u.id }, u.name))) : null);
        const pick = state.stylePick || sp.active || 'hms';
        const tier = STYLE_TIERS[state.styleTier] ? state.styleTier : STYLE_TIERS[sp.tier] ? sp.tier : 'medium';
        sel.value = pick;
        const chosen = pick.startsWith('user:') ? user.find(u => 'user:' + u.id === pick) : [...WORLD_STYLES, ...BUILTIN_STYLES].find(b => b.id === pick);
        const nameIn = h('input', { type: 'text', placeholder: 'Name your preset', 'aria-label': 'Preset name', style: 'flex:1;min-width:0' });
        return section('s-style', 'Play style', state.open, chosen ? chosen.name : null,
            h('p', { class: 'rpgc-note' }, 'One click sets fights, trackers and the look to fit how you want to play. Everything stays adjustable afterwards.'),
            h('div', { class: 'rpgc-row' }, sel, h('button', { class: 'rpgc-btn primary', disabled: chosen ? null : true, onclick: () => {
                if (!chosen) return;
                sp.active = pick;
                // a world or play style, then how much of it (a saved preset of yours keeps exactly what you saved)
                if (pick.startsWith('user:')) applyStyle(chosen.data);
                else { sp.tier = tier; applyStyle({ ...chosen.data }); if (tier !== 'none') applyStyle(STYLE_TIERS[tier].data); }
            } }, 'Apply')),
            chosen ? h('p', { class: 'rpgc-note' }, chosen.desc || (chosen.at ? `Saved ${new Date(chosen.at).toLocaleString()}.` : '')) : null,
            !pick.startsWith('user:') ? h('div', { class: 'rpgc-row rpgc-tiers', role: 'group', 'aria-label': 'How much to track' }, h('span', { class: 'lbl' }, 'How much:'),
                ...Object.entries(STYLE_TIERS).map(([k, t]) => h('button', { class: 'rpgc-btn' + (tier === k ? ' primary' : ''), 'aria-pressed': tier === k ? 'true' : 'false', onclick: () => { state.styleTier = k; render(); } }, t.name))) : null,
            !pick.startsWith('user:') ? h('p', { class: 'rpgc-note' }, STYLE_TIERS[tier].desc, sp.tier ? ` (Applied last: ${STYLE_TIERS[sp.tier] ? STYLE_TIERS[sp.tier].name : sp.tier}.)` : '') : null,
            chosen && pick.startsWith('user:') ? h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn', title: 'Overwrite it with your current settings', onclick: () => { sp.presets[chosen.id] = { ...sp.presets[chosen.id], data: captureStyle(), at: Date.now() }; saveSettings(false); render(); } }, 'Update from current'),
                h('button', { class: 'rpgc-btn danger', onclick: () => { delete sp.presets[chosen.id]; state.stylePick = 'hms'; saveSettings(false); render(); } }, 'Delete')) : null,
            h('div', { class: 'rpgc-row' }, nameIn, h('button', { class: 'rpgc-btn', onclick: () => {
                const n = nameIn.value.trim();
                if (!n) return;
                const id = 'p' + Date.now().toString(36);
                sp.presets[id] = { name: n.slice(0, 40), data: captureStyle(), at: Date.now() };
                sp.active = 'user:' + id; state.stylePick = 'user:' + id;
                saveSettings(false); render();
            } }, 'Save current as preset')));
    }

    /** 2.4: how the panel looks, on its own (it was inside Play style): the theme, the text, the clock, the wide window, Perch. */
    function renderLookSettings() {
        const s = S();
        const themeSel = h('select', { 'aria-label': 'Panel theme', onchange: (e) => { s.uiTheme = e.target.value; saveSettings(false); render(); } }, THEMES.map(([v, l]) => h('option', { value: v }, l)));
        themeSel.value = s.uiTheme || 'host';
        const themeName = (THEMES.find(([v]) => v === (s.uiTheme || 'host')) || [0, ''])[1];
        return section('s-look', 'Look', state.open, themeName || null,
            h('p', { class: 'rpgc-note' }, 'The panel\u2019s colours, its text, its clock and its window. The chat\u2019s own look (the HUD card, letters, emoji) is under Chat display.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Theme'), themeSel),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Density'), (() => { const x = h('select', { 'aria-label': 'Panel density', onchange: (e) => { s.uiDensity = e.target.value; saveSettings(false); render(); } }, h('option', { value: 'comfortable' }, 'Comfortable'), h('option', { value: 'compact' }, 'Compact')); x.value = s.uiDensity || 'comfortable'; return x; })()),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Text size'), (() => { const x = h('select', { 'aria-label': 'Text size', onchange: (e) => { s.uiTextSize = e.target.value; saveSettings(false); render(); } }, h('option', { value: 'small' }, 'Small'), h('option', { value: 'normal' }, 'Normal'), h('option', { value: 'large' }, 'Large')); x.value = s.uiTextSize || 'normal'; return x; })()),
            toggle('Easy reading', () => !!s.uiEasyRead, v => { s.uiEasyRead = v; render(); }, 'More air between letters, words and lines, bigger text, and no slanted type. Made for dyslexic readers.'),
            toggle('The day dial', () => s.uiDial !== false, v => { s.uiDial = v; render(); }, 'A small clock at the top of the panel: the time of day, the day, the date, and how long the last reply took in the story.'),
            s.uiDial !== false ? selectRow('Clock face', DIAL_FACES.includes(s.uiDialFace) ? s.uiDialFace : 'auto',
                [['auto', 'Fits the world'], ['wall', 'Wall clock (Classroom of the Elite)'], ['crystal', 'Time crystal (Re:Zero)'], ['sundial', 'Sundial (Mushoku Tensei)'], ['game', 'YGGDRASIL ring (Overlord)'], ['astrolabe', 'Astrolabe (Harry Potter)'], ['digital', 'Digital (SCP)'], ['rune', 'Rune stone (Skyrim)'], ['bonfire', 'Bonfire (Dark Souls)'], ['pixel', 'Pixel box (Undertale)'], ['analog', 'Round 24-hour dial']], v => { s.uiDialFace = v; saveSettings(); }) : null,
            s.uiDial !== false ? selectRow('Sky above the clock', ['off', 'full'].includes(s.uiDialSky) ? s.uiDialSky : 'time',
                [['off', 'Off'], ['time', 'The sky follows the time of day'], ['full', 'Time, weather and season (asks the model for the weather and the temperature)']], v => { s.uiDialSky = v; saveSettings(); }) : null,
            s.uiDial !== false && s.uiDialSky === 'full' ? toggle('More weather detail', () => s.uiWeatherDetail !== false, v => { s.uiWeatherDetail = v; }, 'With the full sky, the model also gives what the weather feels like, the wind, rain or snow, what comes later and what it does to the scene (about 50 tokens a reply). Press the weather under the clock to read it.') : null,
            toggle('Labels in the wide window\u2019s menu', () => s.uiWideRail !== false, v => { s.uiWideRail = v; render(); }, 'Off leaves only the icons, for more room. Pick the wide window under Where the panel lives, at the top.'),
            toggle('Perch, the mascot', () => s.uiMascot !== false, v => { s.uiMascot = v; render(); }, 'A small fish in a top hat. He opens the guide, and he is the round button that brings the wide window back.'),
            selectRow('The round button on the screen', perchFloatMode(),
                [['wide', 'Only when the wide window is closed'], ['always', 'Always, in every window (opens the panel)'], ['off', 'Never (open the panel from its drawer tab)']], v => { s.uiPerchFloat = v; saveSettings(); paintLaunch(); syncPerchButton(); }),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Drag the round button anywhere; it stays there. The arrow keys move it too.'),
                h('button', { class: 'rpgc-btn', onclick: () => { s.uiLaunchPos = null; saveSettings(false); for (const b of [wideLaunch, perchBtn]) if (b) restoreLaunch(b); } }, 'Put it back in the corner')),
            toggle('Page shortcuts in the other windows', () => s.uiJumpBar !== false, v => { s.uiJumpBar = v; render(); }, 'A row of buttons at the top of the drawer, the floating window and the own window: World, People, You, Map, Magic, Story, Letters. Each one jumps to its cards. The wide window has its menu instead.'));
    }

    /** Classic chats: the People, Phone and Party parts of the systems settings, nothing that needs a HUD. */
    function renderSocialSettings() {
        const secEl = renderHmsSystemsSettings();
        const tn = [...secEl.querySelector('summary').childNodes].find(x => x.nodeType === 3);   // the title, after the picture
        if (tn) tn.textContent = 'People, party & phone';
        const body = secEl.querySelector('.rpgc-body') || secEl;
        let keep = false;
        for (const el of [...body.children]) {
            if (el.classList.contains('rpgc-subhead')) keep = ['People', 'Phone', 'Party'].includes(el.textContent);
            else if (el.tagName === 'P' && !keep && !el.previousElementSibling) { el.textContent = 'Everyone you deal with, your party, and any way you have to reach people. In a chat without a HUD they are read from the tracker reply.'; continue; }
            if (!keep && !(el.tagName === 'P' && !el.previousElementSibling)) el.remove();
        }
        return secEl;
    }

    // ─────────── Test zone ───────────

    const SANDBOX_ID = '__rpgc_test_zone__';
    function enterSandbox() {
        state.sandbox = true;
        state.chatId = SANDBOX_ID;
        state.characterId = null;
        state.view = 'sandbox';
        resetChatScope();
        state.wideHms = false; state.widePage = 'world';
        render();
        send({ type: 'get_state', chatId: SANDBOX_ID });
    }
    function leaveSandbox() {
        state.sandbox = false;
        state.chatId = null; state.characterId = null;
        state.view = 'trackers';
        resetChatScope();
        state.sandboxInfo = null; state.wideHms = false;
        syncChat();
        render();
    }
    function renderSandbox() {
        const info = state.sandboxInfo || { none: true };
        const out = [topBar()];
        if (info.none) state.wideHms = false;
        const cards = info.none ? [] : renderTrackers().slice(1);      // also counts the cards on each page, for the menu
        const worldSel = h('select', { 'aria-label': 'Test world', onchange: (e) => { state.tzWorld = e.target.value; } },
            h('option', { value: 'rezero' }, 'Re:Zero'), h('option', { value: 'overlord' }, 'Overlord'), h('option', { value: 'cote' }, 'Classroom of the Elite'), h('option', { value: 'mushoku' }, 'Mushoku Tensei'), h('option', { value: 'potter' }, 'Harry Potter'), h('option', { value: 'scp' }, 'SCP-4666 (Weissnacht)'), h('option', { value: 'undertale' }, 'Undertale'), h('option', { value: 'darksouls' }, 'Dark Souls'), h('option', { value: 'skyrim' }, 'Skyrim'), h('option', { value: 'classic' }, 'A classic chat (no HUD)'));
        worldSel.value = state.tzWorld || info.world || 'rezero';
        const modeSel = h('select', { 'aria-label': 'Test mode', onchange: (e) => { state.tzMode = e.target.value; if (!info.none) send({ type: 'sandbox_mode', chatId: SANDBOX_ID, mode: e.target.value }); } },
            h('option', { value: 'demo' }, 'Demo — scripted turns, no tokens'), h('option', { value: 'live' }, 'Live — your model plays the world'));
        modeSel.value = state.tzMode || info.mode || 'demo';
        const start = () => send({ type: 'sandbox_start', chatId: SANDBOX_ID, world: worldSel.value, mode: modeSel.value });
        const box = [h('div', { class: 'rpgc-tz-banner' }, h('strong', null, 'Test zone'), h('span', null, 'A practice chat inside the extension. Everything runs exactly as in a real chat — prompts, replies, the guard, fights, the phone — and none of it touches your chats.')),
            h('div', { class: 'rpgc-row' }, worldSel, modeSel),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', disabled: info.busy ? true : null, onclick: start }, info.none ? 'Start' : 'Start over'),
                !info.none ? h('button', { class: 'rpgc-btn danger', onclick: () => send({ type: 'sandbox_reset', chatId: SANDBOX_ID }) }, 'Clear') : null)];
        if (!info.none) {
            box.push(h('p', { class: 'rpgc-note' }, `${info.worldName || info.world} · ${info.mode === 'live' ? 'Live: replies cost tokens' : 'Demo: scripted, free'}${info.busy ? ' · writing…' : ''}`));
            box.push(h('div', { class: 'rpgc-tz-log', role: 'log' }, (info.messages || []).map(m => h('div', { class: 'msg ' + m.role },
                h('span', { class: 'who' }, m.role === 'user' ? 'You' : 'Story'), m.hud ? h('span', { class: 'rpgc-chip', title: 'This reply carried a WORLD STATE HUD' }, 'HUD') : null, h('span', { class: 'txt' }, m.text || '…')))));
            const input = h('input', { type: 'text', placeholder: 'Act or speak, as in a real chat…', 'aria-label': 'Your turn in the test zone', style: 'flex:1;min-width:0' });
            const say = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'sandbox_say', chatId: SANDBOX_ID, text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); say(); } });
            box.push(h('div', { class: 'rpgc-row' }, input, h('button', { class: 'rpgc-btn primary', disabled: info.busy ? true : null, onclick: say }, 'Send')));
            box.push(h('div', { class: 'rpgc-row' },
                info.mode !== 'live' ? h('button', { class: 'rpgc-btn', disabled: info.busy ? true : null, onclick: () => send({ type: 'sandbox_say', chatId: SANDBOX_ID, text: 'Continue.' }) }, 'Next turn') : null,
                h('button', { class: 'rpgc-btn', onclick: openFightChooser }, 'Test a fight'),
                h('button', { class: 'rpgc-btn', onclick: () => { for (const k of ['phone', 'people', 'party']) state.open[k] = true; render(); } }, 'Open phone, people & party')));
            if (wideOn() && state.wideHms) { const jb = pageJumpBar(); if (jb) box.push(jb); box.push(h('p', { class: 'rpgc-note' }, 'The cards are on the pages in the menu, as in a real chat. Each page has a Next turn button at the top.')); }
        }
        out.push(h('div', { class: 'rpgc-tz' }, box));
        if (!(wideOn() && state.wideHms)) out.push(...cards);      // the wide window shows them on their pages
        return out;
    }
    /** On a page of the wide window while in the test zone: where you are, the next turn, and the way back. */
    function tzStrip() {
        if (!state.sandbox || state.view !== 'trackers') return null;
        const info = state.sandboxInfo || { none: true };
        if (info.none) return null;
        return h('div', { class: 'rpgc-hint rpgc-tzstrip', role: 'group', 'aria-label': 'Test zone' }, iconEl('test'), h('b', null, 'Test zone'),
            h('span', null, `${info.worldName || info.world} \u00B7 ${info.mode === 'live' ? 'Live' : 'Demo'}${info.busy ? ' \u00B7 writing\u2026' : ''}`),
            info.mode !== 'live' ? h('button', { class: 'rpgc-btn', disabled: info.busy ? true : null, onclick: () => send({ type: 'sandbox_say', chatId: SANDBOX_ID, text: 'Continue.' }) }, 'Next turn') : null,
            h('button', { class: 'rpgc-btn', onclick: () => { state.view = 'sandbox'; render(); } }, 'Back to the test zone'),
            h('button', { class: 'rpgc-btn', title: 'Back to your own chat', onclick: () => leaveSandbox() }, 'Leave'));
    }
    /** 2.4: the pages as buttons. In the wide window they open the page; in every other window they jump to its first card. */
    function pageJumpBar() {
        const s = S() || {};
        const counts = state.widePageCount || {};
        const wide = wideOn();
        const pages = WIDE_PAGES.filter(([id]) => counts[id]);
        if (!state.wideHms || pages.length < (wide ? 1 : 3) || (!wide && s.uiJumpBar === false)) return null;
        return h('nav', { class: 'rpgc-jump', 'aria-label': wide ? 'Pages' : 'Jump to a page' }, h('span', { class: 'lbl' }, wide ? 'See it on' : 'Jump to'),
            pages.map(([id, label, desc]) => h('button', { type: 'button', class: 'rpgc-chip', title: desc, onclick: (e) => {
                if (wide) { state.view = 'trackers'; state.widePage = id; state.wideScroll = 0; render(); return; }
                const rn = e.currentTarget.getRootNode();
                const el = rn && rn.querySelector ? rn.querySelector(`[data-rpgc-page="${id}"]`) : null;
                if (!el) return;
                if (el.tagName === 'DETAILS' && !el.open) el.open = true;
                if (el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } }, iconEl(id), h('span', null, label), h('span', { class: 'n' }, String(counts[id])))));
    }

    // ─────────── Injuries, on the Re:Zero HUD's injury law, for HUDs that do not keep wounds ───────────
    function renderInjuries() {
        const iv = state.injuries;
        if (!iv || !iv.on || iv.hudOwns) return null;          // a HUD with its own wounds: the Body card shows them
        const STATUS = { raw: ['Raw', 'hot'], treated: ['Treated', 'warm'], permanent: ['\uD83D\uDD12 Permanent', 'perm'], scar: ['Scar', ''] };
        const out = [];
        if (iv.list.length) out.push(h('div', { class: 'rpgc-injuries' }, iv.list.map(x => {
            const [label, cls] = STATUS[x.status] || STATUS.raw;
            const d = Number.isFinite(x.inStatus) ? x.inStatus : null;
            return h('div', { class: `rpgc-injury ${x.severity} ${x.status}` },
                h('div', { class: 'rpgc-wrow' },
                    h('span', { class: 'rpgc-chip ' + cls }, label),
                    x.where ? h('b', null, x.where) : null,
                    h('span', null, x.what),
                    h('span', { class: 'rpgc-chip' }, `${x.severity}${x.kind && x.kind !== 'wound' && x.kind !== 'other' ? ' ' + x.kind : ''}`),
                    d !== null ? h('span', { class: 'rpgc-note' }, `${label.replace(/^\S+ /, '')} for ${fmtSpan(d) || 'moments'}`) : null),
                x.status === 'treated' && x.window ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Healing'), levelBar(x.progress || 0, x.progress >= 100 ? 'ok' : 'low'),
                    h('span', { class: 'val' }, `${x.window[0]}\u2013${x.window[1]} days`)) : null,
                x.warn ? h('p', { class: 'rpgc-status warning', role: 'status' }, x.warn) : null,
                x.note ? h('p', { class: 'rpgc-note' }, x.note) : null,
                h('div', { class: 'rpgc-row' },
                    x.status === 'raw' ? h('button', { class: 'rpgc-mini', title: 'Bandaged, splinted, stitched: basic field care', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'treat', key: x.key }) }, 'Treated') : null,
                    x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Torn open again: back to raw', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'treat', key: x.key }) }, 'Back to raw') : null,
                    x.status === 'raw' || x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Healed: take it off the list', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key }) }, 'Healed') : null,
                    (x.status === 'raw' || x.status === 'treated') && x.severity !== 'minor' ? h('button', { class: 'rpgc-mini', title: 'Healed, but it left a mark: cosmetic, no penalty', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key, scar: true }) }, 'Healed with a scar') : null,
                    x.status === 'raw' || x.status === 'treated' ? h('button', { class: 'rpgc-mini', title: 'Lost for good: time will not heal it', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'permanent', key: x.key }) }, 'Permanent') : null,
                    x.status === 'scar' || x.status === 'permanent' ? h('button', { class: 'rpgc-mini', title: 'Take it off the list (a healer undid it)', onclick: () => send({ type: 'injury', chatId: state.chatId, op: 'heal', key: x.key }) }, 'Remove') : null));
        })));
        else out.push(h('p', { class: 'rpgc-note' }, 'Unhurt. When you are injured, the story reports it here.'));
        const where = h('input', { type: 'text', placeholder: 'Where', 'aria-label': 'Where the injury is', size: '10' });
        const what = h('input', { type: 'text', placeholder: 'What happened', 'aria-label': 'The injury' });
        const kind = h('select', { 'aria-label': 'What kind' }, ...['wound', 'fracture', 'sprain', 'burn', 'internal', 'other'].map(k => h('option', { value: k }, k)));
        const sev = h('select', { 'aria-label': 'How bad' }, ...['minor', 'moderate', 'severe', 'critical'].map(k => h('option', { value: k }, k)));
        const add = () => { if (!what.value.trim()) return; send({ type: 'injury', chatId: state.chatId, op: 'add', where: where.value, what: what.value, kind: kind.value, severity: sev.value }); where.value = ''; what.value = ''; };
        what.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        out.push(h('div', { class: 'rpgc-add' }, where, what, kind, sev, h('button', { class: 'rpgc-btn', onclick: add }, 'Add')));
        out.push(h('p', { class: 'rpgc-note' }, 'How wounds work here: raw until tended, treated is not healed, each kind and severity heals in its own time, a break left unset 3\u20134 days heals crooked for good, and a healed wound may leave a scar. ',
            iv.tell ? 'The story is told these with every message.' : 'Only you see these \u2014 switch on \u201CTell the story about them\u201D under HMS systems \u2192 Injuries to send them.'));
        const worst = iv.list.some(x => x.status === 'raw' && (x.severity === 'critical' || x.warn)) ? 'raw' : iv.list.length ? String(iv.list.filter(x => x.status !== 'scar').length || iv.list.length) : null;
        return section('injuries', 'Injuries', state.open, worst, ...out);
    }

    // ─────────── 1.9.11: the plot and your objectives, on top of the quests ───────────
    function renderPlotObjectives() {
        const pv = state.plotView;
        if (!pv) return [];
        const out = [];
        const STATE_LABEL = { open: 'open', advanced: 'moved', resolved: 'resolved' };
        if (pv.on.plot && (pv.now || pv.threads.length || pv.resolved.length)) {
            out.push(h('div', { class: 'rpgc-set rpgc-plot' }, h('h4', null, 'The plot'),
                pv.now ? h('p', { class: 'rpgc-plotnow' }, pv.now) : null,
                pv.threads.length ? h('ul', { class: 'rpgc-threads' }, pv.threads.map(t => h('li', { class: t.state },
                    h('span', { class: 'rpgc-chip ' + (t.state === 'advanced' ? 'ok' : t.state === 'resolved' ? '' : 'hot') }, STATE_LABEL[t.state] || t.state), ' ', h('b', null, t.name), t.note ? h('span', { class: 'rpgc-note' }, ` \u2014 ${t.note}`) : null))) : null,
                pv.resolved.length ? (() => {
                    const d = h('details', { class: 'rpgc-spells' }, h('summary', null, `Resolved (${pv.resolved.length})`), h('ul', { class: 'rpgc-threads' }, pv.resolved.map(t => h('li', { class: 'resolved' }, h('b', null, t.name), t.note ? h('span', { class: 'rpgc-note' }, ` \u2014 ${t.note}`) : null))));
                    d.open = !!state.open['plot-resolved']; d.dataset.openKey = 'plot-resolved'; d.addEventListener('toggle', () => { state.open['plot-resolved'] = d.open; }); return d;
                })() : null));
        }
        if (pv.on.objectives) {
            const ICON = { active: '\u25B8', done: '\u2713', failed: '\u2717' };
            const input = h('input', { type: 'text', placeholder: 'Add an objective of your own', 'aria-label': 'Add an objective of your own' });
            const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'objective_mine', chatId: state.chatId, op: 'add', text: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
            out.push(h('div', { class: 'rpgc-set rpgc-objectives' }, h('h4', null, 'Objectives'),
                pv.objectives.length ? h('ul', { class: 'rpgc-checklist' }, pv.objectives.map(o => h('li', { class: o.state === 'done' ? 'met' : o.state === 'active' ? 'active' : 'failed' },
                    h('span', { 'aria-hidden': 'true' }, ICON[o.state] || '\u25B8'), ` ${o.text}`, o.quest ? h('span', { class: 'rpgc-chip' }, o.quest) : null))) : null,
                pv.mine.length ? h('ul', { class: 'rpgc-checklist mine' }, pv.mine.map(o => h('li', { class: o.done ? 'met' : '' },
                    (() => { const cb = h('input', { type: 'checkbox', 'aria-label': `Done: ${o.text}` }); cb.checked = !!o.done; cb.addEventListener('change', () => send({ type: 'objective_mine', chatId: state.chatId, op: 'toggle', id: o.id })); return cb; })(),
                    ` ${o.text} `, h('button', { class: 'rpgc-mini', 'aria-label': `Remove: ${o.text}`, onclick: () => send({ type: 'objective_mine', chatId: state.chatId, op: 'remove', id: o.id }) }, '\u2715')))) : null,
                !pv.objectives.length && !pv.mine.length ? h('p', { class: 'rpgc-note' }, 'What you are trying to do right now shows here as the story sets it. Your own go below, just for you.') : null,
                h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add'))));
        }
        return out;
    }

    // ─────────── 1.9.5: a card of its own for each of the four worlds ───────────

    const ladderBar = (step, total) => {
        const wrap = h('span', { class: 'rpgc-ladder', role: 'img', 'aria-label': `step ${step + 1} of ${total}` });
        for (let i = 0; i < total; i++) wrap.appendChild(h('i', { class: i <= step ? 'on' : '' }));
        return wrap;
    };
    const fmtLeft = (m) => {
        if (m === null || m === undefined) return null;
        if (m < 0) return `${fmtSpan(-m) || 'moments'} past`;
        return `${fmtSpan(m) || 'under a minute'} left`;
    };
    const loreNote = (text) => text ? h('p', { class: 'rpgc-note rpgc-wlore' }, text) : null;
    const wDetails = (key, summary, ...body) => {
        const det = h('details', { class: 'rpgc-spells' }, h('summary', null, summary), ...body);
        det.open = !!state.open[key];
        det.dataset.openKey = key; det.addEventListener('toggle', () => { state.open[key] = det.open; });
        return det;
    };
    // A school or style on its rank ladder; open it to see what each rank you hold lets you use.
    const rankedList = (title, list, keyPrefix, noun) => h('div', { class: 'rpgc-set' }, h('h4', null, title),
        ...list.map(m => {
            const row = h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, m.name), m.step !== null ? ladderBar(m.step, 7) : null, h('span', { class: 'val' }, m.rank));
            if (!m.spells || !m.spells.length) return row;
            return wDetails(keyPrefix + m.name, row,
                ...m.spells.map(r => h('p', { class: 'rpgc-note' }, h('b', null, `${r.rank}: `), r.spells.join(' \u00B7 '))),
                m.nextRank ? h('p', { class: 'rpgc-note next' }, h('b', null, `Next \u2014 ${m.nextRank.rank}: `), m.nextRank.spells.join(' \u00B7 ')) : null);
        }),
        list.some(m => m.spells && m.spells.length) ? h('p', { class: 'rpgc-note' }, `Open one to see the ${noun} you have, from your own index.`) : null);
    const stageLadder = (label, s) => {
        if (!s) return null;
        const n = s.stages.length || 5;
        const cur = s.stages.find(x => x.stage === s.stage);
        const next = s.stages.find(x => x.stage === (s.stage || 0) + 1);
        return h('div', { class: 'rpgc-set' },
            h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, label), s.stage ? ladderBar(s.stage - 1, n) : null, h('b', null, `${s.pct}%`), h('span', null, cur ? `Stage ${cur.stage}: ${cur.name}` : s.text)),
            cur && cur.note ? h('p', { class: 'rpgc-note' }, cur.note) : null,
            next ? h('p', { class: 'rpgc-note next' }, `Next \u2014 Stage ${next.stage}: ${next.name} (${next.lo === next.hi ? `${next.lo}%` : `${Math.min(next.lo, next.hi)}\u2013${Math.max(next.lo, next.hi)}%`})`) : null);
    };
    const wRow = (label, ...value) => h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, label), h('span', { class: 'val' }, ...value));

    function renderWorldCard() {
        const w = state.world;
        if (!w || !w.id || S()?.worldCard === false) return null;
        const out = [];
        if (w.id === 'rezero') {
            if (w.deaths !== null || w.savePoint || w.scent) out.push(h('div', { class: 'rpgc-wgrid' },
                w.deaths !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.deaths)), h('span', null, 'deaths')) : null,
                w.scent ? h('div', { class: 'rpgc-wstat' }, h('b', null, w.scent), h('span', null, 'witch\u2019s scent')) : null,
                w.loops.current ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.loops.current)), h('span', null, 'current loop')) : null));
            if (w.savePoint) out.push(wRow('Save point', w.savePoint));
            if (!w.loops.tracking && w.deaths !== null) out.push(h('p', { class: 'rpgc-note' }, 'Switch on Loops under Settings \u2192 Chapters and every life is kept: how it ended, and what you uncovered.'));
            if (w.loops.ended.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'How each life ended'),
                h('ol', { class: 'rpgc-wlist', reversed: true }, w.loops.ended.map(l => h('li', null, h('b', null, `Loop ${l.no || '?'}`), ` \u2014 ${l.ended || l.title}`)))));
            if (w.loops.known) out.push(h('p', { class: 'rpgc-note' }, `You carry ${w.loops.known} thing${w.loops.known === 1 ? '' : 's'} from earlier loops \u2014 see Chapters.`));
            const mgp = state.hms && state.hms.magic, powersElsewhere = (sysCfg().magic || {}).enabled !== false && mgp && mgp.powers;
            if (powersElsewhere && (w.authorities.length || w.protections.length || (w.curses || []).length)) out.push(h('p', { class: 'rpgc-note' }, `Authorities, Divine Protections and curses, with what the lorebook says: in the Magic card (${[...w.authorities.map(a => a.name), ...w.protections.map(p => p.name), ...(w.curses || []).map(c => c.name)].join(', ')}).`));
            if (!powersElsewhere) for (const a of w.authorities) out.push(h('div', { class: 'rpgc-wability' },
                h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Authority'), h('b', null, a.name), h('span', { class: 'rpgc-chip ' + (/awakened/i.test(a.state) ? 'ok' : 'hot') }, a.state), a.power ? h('span', { class: 'rpgc-note' }, a.power) : null),
                loreNote(a.lore)));
            if (!powersElsewhere) for (const p of w.protections) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Divine Protection'), h('b', null, p.name)), loreNote(p.lore)));
            const mg = state.hms && state.hms.magic, magicOn = (sysCfg().magic || {}).enabled !== false;
            const spiritsElsewhere = magicOn && mg && mg.spirits;
            if (spiritsElsewhere && (w.contracts.length || w.affinity)) out.push(h('p', { class: 'rpgc-note' }, `Spirit contracts and affinity: in the Magic card${w.contracts.length ? ` (${w.contracts.map(c => c.name).join(', ')})` : ''}.`));
            if (w.contracts.length && !spiritsElsewhere) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Spirit contracts'),
                ...w.contracts.map(c => h('div', { class: 'rpgc-wability' },
                    h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, c.name), c.step >= 0 ? ladderBar(c.step, 5) : null, h('span', { class: 'val' }, c.rank)),
                    c.means ? loreNote(c.means) : null))));
            if (w.affinity && !spiritsElsewhere) out.push(wRow('Spirit affinity', h('b', null, w.affinity)));
            if (w.magic) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Magic'),
                wRow('Element', ...w.magic.elements.map(e => h('span', { class: 'rpgc-chip' }, e))),
                h('div', { class: 'rpgc-wability' }, wRow('Gate', h('b', null, w.magic.gate)), loreNote(w.magic.gateMeans)),
                h('div', { class: 'rpgc-wability' }, wRow('Pool', h('b', null, w.magic.pool)), loreNote(w.magic.poolMeans)),
                ...(magicOn && mg && mg.spells ? [] : w.magic.spells).map(sp => wDetails('rz-spells-' + sp.element, h('span', null, `${sp.element} spells`),
                    ...sp.series.map(se => h('p', { class: 'rpgc-note' }, h('b', null, `${se.name}: `), ...se.spells.map((x, i) => h('span', { title: x.text }, (i ? ' \u00B7 ' : '') + x.name))))))));
            out.push(stageLadder('Od Integrity', w.od));
            out.push(stageLadder('Corruption', w.corruption));
            if (!powersElsewhere) for (const cu of w.curses || []) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind hot' }, 'Curse'), h('b', null, cu.name)), loreNote(cu.lore)));
            if (w.council.length) out.push(wRow('Mental Council', ...w.council.map(x => h('span', { class: 'rpgc-chip' }, x.sin ? `${x.name} \u00B7 ${x.sin}` : x.name))));
            if (w.arc0) {
                const pct = (w.arc0.year + 20) / 20 * 100;
                const bar = h('div', { class: 'rpgc-arc0', role: 'img', 'aria-label': `Year ${w.arc0.year} of the prequel, ${-w.arc0.year} years before Arc 1` },
                    ...w.arc0.marks.map(m => h('span', { class: 'mark', style: `left:${(m.year + 20) / 20 * 100}%`, title: `Year ${m.year}: ${m.text}` })),
                    h('i', { style: `left:${pct}%` }));
                out.push(h('div', { class: 'rpgc-set' }, h('h4', null, w.arc0.part ? `Arc 0 \u2014 Part ${w.arc0.part}${w.arc0.partName ? `: ${w.arc0.partName}` : ''}` : 'Arc 0 \u2014 the prequel years'),
                    bar, h('div', { class: 'rpgc-wrow' }, h('span', null, 'Year \u221220'), h('b', { style: 'margin:0 auto' }, `Year ${w.arc0.year} \u00B7 ${w.arc0.year === 0 ? 'the eve of Arc 1' : `${-w.arc0.year} year${w.arc0.year === -1 ? '' : 's'} before Arc 1`}`), h('span', null, 'Year 0')),
                    h('ul', { class: 'rpgc-wlist' }, w.arc0.marks.map(m => h('li', { class: m.year <= w.arc0.year ? 'past' : '' }, h('b', null, `Year ${m.year}`), ` \u2014 ${m.text}`)))));
            }
            if (w.theater) out.push(h('div', { class: 'rpgc-set rpgc-theater' }, h('h4', null, 'The Theater of Despair'),
                w.theater.reel ? wRow('Now playing', h('b', null, w.theater.season ? `Season ${w.theater.season}, episode ${w.theater.episode}${w.theater.cut ? ` (${w.theater.cut})` : ''}` : w.theater.reel)) : null,
                w.theater.scene ? wRow('Scene', w.theater.scene) : null,
                w.theater.star ? wRow('Screen star', w.theater.star) : null,
                w.theater.audience.length ? wRow('Audience', w.theater.audience.join(', ')) : null,
                w.theater.memory ? wRow('Memory', w.theater.memory) : null));
        } else if (w.id === 'overlord') {
            if (w.overall !== null) out.push(h('div', { class: 'rpgc-wgrid' },
                h('div', { class: 'rpgc-wstat' }, h('b', null, `${w.overall}`), h('span', null, 'overall level')),
                w.racialSum ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.racialSum)), h('span', null, 'racial')) : null,
                w.job !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.job)), h('span', null, 'job')) : null));
            if (w.overall !== null) out.push(levelBar(Math.min(100, w.overall), 'ok'));
            if (w.levelsAddUp === false) out.push(h('p', { class: 'rpgc-status warning' }, `The HUD's levels do not add up: racial ${w.racialSum} + job ${w.job} is not ${w.overall}.`));
            if (w.checks && w.checks.length) out.push(h('div', { class: 'rpgc-status warning', role: 'status' }, h('b', null, 'Framework check'),
                h('ul', { class: 'rpgc-wlist' }, w.checks.map(c => h('li', null, c)))));
            if (w.race) out.push(wRow('Race', h('b', null, w.race), w.category ? h('span', { class: 'rpgc-chip' }, w.category) : null, w.origin ? h('span', { class: 'rpgc-note' }, w.origin) : null));
            if (w.racial.length) out.push(wRow('Racial', w.racial.map(t => `${t.name} ${t.lv}`).join(' \u2192 ')));
            if (w.classes.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Job classes'),
                ...w.classes.map(t => h('div', { class: 'rpgc-wrow' + (t.info && t.info.legendary ? ' legendary' : '') },
                    h('span', { class: 'lbl' }, t.name),
                    t.info && t.info.max ? levelBar(Math.min(100, t.lv / t.info.max * 100), t.lv >= t.info.max ? 'ok' : 'low') : null,
                    h('span', { class: 'val' }, t.info && t.info.max ? `${t.lv} / ${t.info.max}` : String(t.lv)),
                    t.info ? h('span', { class: 'rpgc-chip' + (t.info.legendary ? ' legendary' : '') }, t.info.tier) : null))));
            if (w.traditions && w.traditions.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Traditions'),
                ...w.traditions.map(t => {
                    const row = h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, t.name), ladderBar(Math.min(10, t.lv) - 1, 10), h('span', { class: 'rpgc-chip' + (t.lv >= 11 ? ' ok' : '') }, `LV ${t.lv}${t.lv >= 11 ? ' \u00B7 super-tier' : ''}`));
                    if (!t.spells || !t.spells.length) return row;
                    return wDetails('ov-spells-' + t.name, row, ...t.spells.map(s => h('p', { class: 'rpgc-note' }, h('b', null, `${s.tier === 11 ? 'Super-Tier' : `Tier ${s.tier}`}: `), s.spells.join(' \u00B7 '))));
                }),
                w.traditions.some(t => t.spells && t.spells.length) ? h('p', { class: 'rpgc-note' }, 'Open a tradition to see its spells up to your LV, from your own magic core.') : null));
            if (w.karma && w.karma.value !== null) {
                const pct = Math.max(0, Math.min(100, (w.karma.value + 500) / 10));
                out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Karma'),
                    h('span', { class: 'rpgc-karma', role: 'meter', 'aria-valuemin': '-500', 'aria-valuemax': '500', 'aria-valuenow': String(w.karma.value) }, h('i', { style: `left:${pct}%` })),
                    h('span', { class: 'val' }, `${w.karma.value}${w.karma.label ? ` \u00B7 ${w.karma.label}` : ''}`)));
            }
            if (w.superTier) out.push(wRow('Super-Tier', h('b', null, `${w.superTier.cur} / ${w.superTier.max}`), w.superTier.cooldown ? h('span', { class: 'rpgc-chip' + (/active/i.test(w.superTier.cooldown) ? ' hot' : '') }, w.superTier.cooldown) : null));
            if (w.role) out.push(wRow('Role', h('b', null, w.role)));
            if (w.adventurer) out.push(wRow('Adventurer', h('b', null, w.adventurer.rank), w.adventurer.team ? ` \u00B7 ${w.adventurer.team}` : ''));
            if (w.worker) out.push(wRow('Worker', w.worker));
            for (const it of w.worldItems) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'World Item'), h('b', null, it.name)), loreNote(it.lore)));
        } else if (w.id === 'cote') {
            if (w.calendar) out.push(wRow('Calendar', h('b', null, `Year ${w.calendar.year} \u00B7 Month ${w.calendar.month}`), ` \u00B7 ${w.calendar.date}`,
                h('span', { class: 'rpgc-chip', title: 'Class Points are announced on the first of the month' }, `announcement ${w.calendar.next} \u2014 in ${w.calendar.daysToNext} day${w.calendar.daysToNext === 1 ? '' : 's'}`)));
            if (w.cohort) out.push(wRow('Cohort', h('b', null, w.cohort), w.standing ? ` \u00B7 ${w.standing}` : '', w.seat ? ` \u00B7 seat ${w.seat}` : ''));
            if (w.standings && w.standings.rows.length) {
                const max = Math.max(1, ...w.standings.rows.map(r => r.cp || 0));
                out.push(h('div', { class: 'rpgc-set' }, h('h4', null, `Standings \u00B7 ${w.standings.date}`),
                    ...w.standings.rows.map(r => h('div', { class: 'rpgc-wrow' + (r.mine ? ' mine' : '') },
                        h('span', { class: 'lbl' }, `${r.callsign} (${r.letter})`), levelBar(Math.max(0, (r.cp || 0) / max * 100), r.mine ? 'ok' : 'low'),
                        h('span', { class: 'val' }, `${fmtNum(r.cp)}${r.delta ? ` (${r.delta > 0 ? '+' : '\u2212'}${fmtNum(Math.abs(r.delta))})` : ''}`))),
                    w.standings.since ? h('p', { class: 'rpgc-note' }, `Changes since ${w.standings.since}.`) : null));
            }
            if (w.pp) out.push(wRow('Private Points', h('b', null, fmtNum(w.pp.value)), w.pp.delta ? h('span', { class: 'delta ' + (w.pp.delta < 0 ? 'down' : 'up') }, ` ${w.pp.delta > 0 ? '+' : '\u2212'}${fmtNum(Math.abs(w.pp.delta))}`) : null));
            if (w.surveillance) out.push(wRow('Surveillance', h('span', { class: 'rpgc-chip ' + (w.surveillance.watched ? 'hot' : 'ok') }, w.surveillance.state), w.surveillance.source ? h('span', { class: 'rpgc-note' }, ` ${w.surveillance.source}`) : null));
            for (const f of w.flags) if (f.alarm) out.push(h('p', { class: 'rpgc-status warning', role: 'status' }, f.text));
            if (w.exam) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, w.exam.name), levelBar(Math.min(100, w.exam.day / Math.max(1, w.exam.of) * 100), 'ok'),
                h('p', { class: 'rpgc-note' }, `Day ${w.exam.day} of ${w.exam.of}${w.exam.state ? ` \u00B7 ${w.exam.state}` : ''}`)));
            if (w.oaa.length) out.push(wRow('OAA', ...w.oaa.map(o => h('span', { class: 'rpgc-chip' }, `${o.name} ${o.grade}`))));
            if (w.protection) out.push(wRow('Protection Point', w.protection));
            const g = w.godmother;
            if (g) {
                const left = g.decree ? fmtLeft(g.decree.minutesLeft) : null;
                out.push(h('div', { class: 'rpgc-set rpgc-godmother' }, h('h4', null, `The Godmother \u00B7 Lv ${g.level}`),
                    g.xpMax ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'XP'), levelBar(Math.min(100, g.xp / g.xpMax * 100), 'ok'), h('span', { class: 'val' }, `${fmtNum(g.xp)} / ${fmtNum(g.xpMax)} \u00B7 ${g.sp} SP \u00B7 ${g.sk} SK`)) : null,
                    g.stats.length ? wRow('Stats', g.stats.map(s => `${s.name} ${s.value}`).join(' \u00B7 ')) : null,
                    g.decree ? h('div', { class: 'rpgc-decree' + (g.decree.minutesLeft !== null && g.decree.minutesLeft <= 120 ? ' urgent' : '') },
                        h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Decree'), h('b', null, g.decree.name)),
                        h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Midnight'), h('span', null, g.decree.due), left ? h('span', { class: 'rpgc-chip ' + (g.decree.minutesLeft <= 120 ? 'hot' : '') }, left) : null),
                        g.conditions.length ? h('ul', { class: 'rpgc-checklist' }, g.conditions.map(c => h('li', { class: c.state }, h('span', { 'aria-hidden': 'true' }, c.state === 'met' ? '\u2713' : c.state === 'active' ? '\u25B8' : '\u25CB'), ` ${c.text}`))) : null) : null,
                    g.owed !== null ? wRow('Owed', h('b', null, fmtNum(g.owed))) : null,
                    g.reckoning ? h('p', { class: 'rpgc-status warning' }, `Reckoning: ${g.reckoning.name} \u2014 ${g.reckoning.at}`) : null));
            }
            const d = w.database;
            if (d) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'School Database'),
                h('div', { class: 'rpgc-dnd-abils' }, d.stats.map(s => {
                    const prof = d.proficient.some(p => p.toLowerCase() === s.name.toLowerCase());
                    const def = d.deficient.some(p => p.toLowerCase() === s.name.toLowerCase());
                    return h('div', { class: 'rpgc-dnd-abil hud', title: prof ? 'Proficient' : def ? 'Deficient' : s.name },
                        h('span', { class: 'ab' }, s.name), h('span', { class: 'mod' }, `${s.grade} ${s.mod >= 0 ? '+' : '\u2212'}${Math.abs(s.mod)}`),
                        prof ? h('span', { class: 'rpgc-chip ok' }, `prof${d.pb ? ' ' + (d.pb >= 0 ? '+' : '') + d.pb : ''}`) : def ? h('span', { class: 'rpgc-chip hot' }, 'deficient') : null);
                })),
                d.defect ? h('p', { class: 'rpgc-note' }, `Defect: ${d.defect.name} \u2014 ${d.defect.when}`) : null,
                h('p', { class: 'rpgc-note' }, 'The engine rolls these itself; the sheet is read from its block.')));
        } else if (w.id === 'mushoku') {
            if (w.year !== null) out.push(h('div', { class: 'rpgc-wgrid' },
                h('div', { class: 'rpgc-wstat' }, h('b', null, `K. ${w.year}`), h('span', null, w.day ? `day ${w.day}${w.period ? ' \u00B7 ' + w.period : ''}` : 'year')),
                w.age !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.age)), h('span', null, 'years old')) : null,
                w.adventurer ? h('div', { class: 'rpgc-wstat' }, h('b', null, `${w.adventurer.rank}-Rank`), h('span', null, w.adventurer.party || (w.adventurer.solo ? 'solo' : 'adventurer'))) : null));
            if (w.race) out.push(wRow('Born', `K. ${w.birth} \u00B7 ${w.race}`, w.origin ? h('span', { class: 'rpgc-chip' + (/outworlder/i.test(w.origin) ? ' hot' : '') }, w.origin) : null));
            if (w.mana) out.push(h('div', { class: 'rpgc-wability' }, wRow('Mana capacity', h('b', null, w.mana)), loreNote(w.manaLore)));
            if (w.casting) out.push(wRow('Casting', w.casting));
            if (w.touki) out.push(h('div', { class: 'rpgc-wability' }, wRow('Touki', w.touki), loreNote(w.toukiLore)));
            if (w.martial.length) { out.push(rankedList('Sword styles', w.martial, 'mt-tech-', 'techniques')); if (w.triangle) out.push(h('p', { class: 'rpgc-note' }, h('b', null, 'The triangle: '), w.triangle)); }
            if (w.magic.length) out.push(rankedList('Magic', w.magic, 'spells-', 'spells'));
            if (w.languages.length) out.push(wRow('Languages', ...w.languages.map(l => h('span', { class: 'rpgc-chip' }, l.fluency ? `${l.name} \u00B7 ${l.fluency}` : l.name))));
            if (w.contracts) out.push(wRow('Contracts', w.contracts));
            for (const e of w.eyes) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' }, 'Demon Eye'), h('b', null, e.text)), loreNote(e.lore)));
            for (const m of w.marks) out.push(h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'rpgc-chip kind' + (m.kind === 'CURSE' ? ' hot' : '') }, m.kind === 'CURSE' ? 'Curse' : 'Blessing'), h('b', null, m.name)), loreNote(m.lore)));
            if (w.drain) out.push(h('p', { class: 'rpgc-status warning' }, `Drain Syndrome: ${w.drain.stage}${w.drain.onset ? ` \u00B7 onset ${w.drain.onset}` : ''}`));
            if (w.term) out.push(wRow('Ranoa', `${w.term.term} \u00B7 ${w.term.role}`));
            if (w.hitogami) {
                out.push(h('div', { class: 'rpgc-set rpgc-hitogami' }, h('h4', null, 'The Man-God'),
                    wRow('Standing', h('b', null, w.hitogami.state)),
                    w.advice.length ? h('ul', { class: 'rpgc-wlist' }, w.advice.map(a => h('li', { class: a.followed === true ? 'followed' : a.followed === false ? 'ignored' : '' },
                        a.dream ? h('span', { class: 'rpgc-chip kind' }, `Dream ${a.dream}`) : null, ` \u201C${a.text}\u201D `,
                        h('span', { class: 'rpgc-row', role: 'group', 'aria-label': 'Did you follow it?' },
                            h('button', { class: 'rpgc-mini' + (a.followed === true ? ' on' : ''), 'aria-pressed': a.followed === true ? 'true' : 'false', onclick: () => send({ type: 'hitogami_mark', chatId: state.chatId, msgId: a.msgId, followed: a.followed === true ? null : true }) }, 'Followed'),
                            h('button', { class: 'rpgc-mini' + (a.followed === false ? ' on' : ''), 'aria-pressed': a.followed === false ? 'true' : 'false', onclick: () => send({ type: 'hitogami_mark', chatId: state.chatId, msgId: a.msgId, followed: a.followed === false ? null : false }) }, 'Ignored'))))) :
                        h('p', { class: 'rpgc-note' }, 'His advice is written down here the next time he speaks.')));
            }
        } else if (w.id === 'scp' && w.scp) {
            const c = w.scp;
            if (c.night !== null && c.nights) {
                out.push(h('div', { class: 'rpgc-wgrid' },
                    h('div', { class: 'rpgc-wstat' }, h('b', null, `${c.night} / ${c.nights}`), h('span', null, 'night of Weissnacht')),
                    c.phase ? h('div', { class: 'rpgc-wstat' }, h('b', null, c.phase), h('span', null, 'phase')) : null));
                out.push(h('div', { class: 'rpgc-scp-nights', role: 'img', 'aria-label': `Night ${c.night} of ${c.nights}` }, Array.from({ length: Math.min(31, c.nights) }, (x, i) => h('i', { class: i + 1 < c.night ? 'done' : i + 1 === c.night ? 'now' : '' }))));
            } else if (c.phase) out.push(wRow('Weissnacht', c.phase));
            if (c.mode) out.push(wRow('Mode', h('span', { class: 'rpgc-scp-stamp' }, c.mode)));
            if (c.household.length) out.push(wRow('Household', h('div', { class: 'rpgc-chips' }, c.household.map(n => h('span', { class: 'rpgc-chip' }, n)))));
            if (c.team) out.push(c.teamOf ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Team'), levelBar(Math.min(100, c.teamNow / Math.max(1, c.teamOf) * 100), c.teamNow / Math.max(1, c.teamOf) <= 0.34 ? 'critical' : 'ok'), h('span', { class: 'val' }, `${c.teamNow} / ${c.teamOf} standing`)) : wRow('Team', c.team));
            if (c.conditions.length) out.push(wRow('Condition', h('div', { class: 'rpgc-chips' }, c.conditions.map(n => h('span', { class: 'rpgc-chip warn' }, n)))));
            if (c.coin || c.code) out.push(wRow('The coin', c.coin ? h('span', { class: 'rpgc-scp-code' }, c.coin) : null, c.code ? h('span', { class: 'rpgc-note' }, ` entry #${c.code}`) : null));
        } else if (w.id === 'potter' && w.potter) {
            const c = w.potter;
            const HP_COLOR = { G: '#b3202a', H: '#e3b23c', R: '#3b6fd8', S: '#2f9a55' };
            out.push(h('div', { class: 'rpgc-wgrid' },
                c.year ? h('div', { class: 'rpgc-wstat' }, h('b', null, `Year ${c.year}${c.years ? ` / ${c.years}` : ''}`), h('span', null, c.term || 'at Hogwarts')) : null,
                c.house ? h('div', { class: 'rpgc-wstat' }, h('b', null, c.house), h('span', null, 'house')) : null,
                c.age ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(c.age)), h('span', null, 'years old')) : null));
            if (c.points && c.points.length) {
                const top = Math.max(1, ...c.points.map(p => p.n));
                const lead = c.points.reduce((x, y) => (y.n > x.n ? y : x));
                out.push(h('div', { class: 'rpgc-hp-glasses', role: 'list', 'aria-label': 'House points' }, c.points.map(p => {
                    const fill = h('i');
                    fill.style.height = Math.round(p.n / top * 100) + '%';
                    fill.style.background = HP_COLOR[p.id] || '#999';
                    return h('div', { class: 'rpgc-hp-glass' + (c.house && p.house === c.house ? ' mine' : ''), role: 'listitem', title: `${p.house}: ${p.n} points` },
                        h('div', { class: 'tube', 'aria-hidden': 'true' }, fill), h('b', null, fmtNum(p.n)), h('span', null, (p === lead ? '\u2605 ' : '') + p.house));
                })));
            }
            if (c.wand) out.push(wRow('Wand', ([c.wand.wood, c.wand.core, c.wand.length].filter(Boolean).join(' \u00B7 ') || c.wand.text) + ' ',
                c.wand.mod ? h('span', { class: 'rpgc-chip ' + (/broken/i.test(c.wand.mod) ? 'hot' : /borrowed/i.test(c.wand.mod) ? 'warn' : 'ok') }, c.wand.mod) : null));
            for (const st of c.studies || []) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, st.name), levelBar(Math.min(100, st.lv / 7 * 100), 'ok'), h('span', { class: 'val' }, `LV ${st.lv} of 7`)));
            if (c.spells && c.spells.length) out.push(wRow('Extra spells', h('div', { class: 'rpgc-chips' }, c.spells.map(x => h('span', { class: 'rpgc-chip' }, x)))));
            if (c.patronus) out.push(wRow('Patronus', c.patronus));
            if (c.casting) out.push(wRow('Casting', c.casting));
            if (c.blood) out.push(wRow('Blood status', c.blood));
        } else if (w.id === 'undertale') {
            const UT_HEX = { red: '#ff2020', cyan: '#42fcff', orange: '#fca600', blue: '#2d6bff', purple: '#d535d9', green: '#1fd11f', yellow: '#ffe600' };
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.lv !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, `LV ${w.lv}`), h('span', null, 'LOVE')) : null,
                w.exp !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, fmtNum(w.exp)), h('span', null, 'EXP')) : null,
                w.gold !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, `${fmtNum(w.gold)} G`), h('span', null, 'gold')) : null));
            if (w.exp !== null && w.next !== null) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Next LV'), levelBar(Math.min(100, w.exp / Math.max(1, w.exp + w.next) * 100), 'ok'), h('span', { class: 'val' }, `${fmtNum(w.next)} EXP to go`)));
            if (w.soul) out.push(wRow('SOUL', h('span', { class: 'rpgc-soul', 'aria-hidden': 'true', style: `color:${UT_HEX[w.soulColor] || 'currentColor'}` }, '\u2665'), h('b', null, w.soulTrait || w.soul), w.soulColor ? h('span', { class: 'rpgc-note' }, w.soulColor) : null));
            if (w.route) out.push(h('div', { class: 'rpgc-set' },
                wRow('Route', h('span', { class: 'rpgc-chip ' + (/genocide/i.test(w.route) ? 'hot' : /pacifist/i.test(w.route) ? 'ok' : '') }, w.route), w.kills !== null ? h('span', { class: 'rpgc-note' }, `kills: ${w.kills}`) : null),
                w.killsOf ? h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'This area'), levelBar(Math.min(100, w.killsNow / w.killsOf * 100), 'critical'), h('span', { class: 'val' }, `${w.killsNow} / ${w.killsOf}`)) : null));
            if (w.savePoint) out.push(wRow('SAVE', h('span', { class: 'rpgc-savestar', 'aria-hidden': 'true' }, '\u2726'), w.savePoint));
            if (w.at || w.df) out.push(wRow('Stats', w.at ? `AT ${w.at.base}${w.at.bonus ? ` (${w.at.bonus})` : ''}` : '', w.at && w.df ? ' \u00B7 ' : '', w.df ? `DF ${w.df.base}${w.df.bonus ? ` (${w.df.bonus})` : ''}` : ''));
            if (w.weapon || w.armor) out.push(wRow('Equipped', [w.weapon, w.armor].filter(Boolean).join(' \u00B7 ')));
            if (w.kr) out.push(wRow('KR', h('span', { class: 'rpgc-chip hot' }, `${w.kr} karmic retribution`)));
            if (w.resets) out.push(wRow('Resets', h('b', null, String(w.resets)), h('span', { class: 'rpgc-note' }, 'Switch on Loops under Settings \u2192 Chapters to keep each timeline.')));
        } else if (w.id === 'darksouls') {
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.level !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.level)), h('span', null, 'soul level')) : null,
                w.souls !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, fmtNum(w.souls)), h('span', null, 'souls')) : null,
                w.deaths !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.deaths)), h('span', null, 'deaths')) : null));
            if (w.bloodstain) out.push(h('p', { class: 'rpgc-status warning', role: 'status' }, `${fmtNum(w.bloodstain.souls)} souls lie at ${w.bloodstain.where}. Reach them before you die again, or they are gone.`));
            const pips = (cur, max) => h('span', { class: 'rpgc-pips', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(cur) }, ...Array.from({ length: max }, (_, i) => h('i', { class: i < cur ? 'on' : '' })));
            if (w.estus) out.push(wRow('Estus Flask', pips(w.estus.cur, w.estus.max), h('span', { class: 'val' }, `${w.estus.cur} / ${w.estus.max}${w.estus.plus ? ` \u00B7 +${w.estus.plus}` : ''}`)));
            if (w.ashen) out.push(wRow('Ashen Estus', pips(w.ashen.cur, w.ashen.max), h('span', { class: 'val' }, `${w.ashen.cur} / ${w.ashen.max}`)));
            if (w.humanity !== null || w.form || w.hollowing !== null) out.push(wRow('Humanity', w.humanity !== null ? h('b', null, String(w.humanity)) : null,
                w.form ? h('span', { class: 'rpgc-chip ' + (/hollow/i.test(w.form) ? 'hot' : /embered|human/i.test(w.form) ? 'ok' : '') }, w.form) : null,
                w.hollowing !== null ? h('span', { class: 'rpgc-note' }, `hollowing ${w.hollowing}`) : null));
            if (w.bonfire) out.push(wRow('Bonfire', h('span', { class: 'rpgc-ember', 'aria-hidden': 'true' }, '\u2736'), w.bonfire));
            if (w.covenant) out.push(h('div', { class: 'rpgc-wability' }, wRow('Covenant', h('b', null, w.covenant.name), w.covenant.rank ? h('span', { class: 'rpgc-chip' }, `rank ${w.covenant.rank}`) : null), loreNote(w.covenant.lore)));
            if (w.weapon) out.push(wRow('Weapon', w.weapon));
        } else if (w.id === 'skyrim') {
            out.push(h('div', { class: 'rpgc-wgrid' },
                w.level !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.level)), h('span', null, 'level')) : null,
                w.dragonSouls !== null ? h('div', { class: 'rpgc-wstat' }, h('b', null, String(w.dragonSouls)), h('span', null, 'dragon souls')) : null,
                w.perks !== null ? h('div', { class: 'rpgc-wstat' + (w.perks ? ' ready' : '') }, h('b', null, String(w.perks)), h('span', null, 'perks to spend')) : null));
            if (w.nextPct !== null) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Next level'), levelBar(w.nextPct, 'ok'), h('span', { class: 'val' }, `${w.nextPct}%`)));
            if (w.race || w.stone) out.push(wRow('Race', w.race ? h('b', null, w.race) : null, w.stone ? h('span', { class: 'rpgc-chip' }, w.stone) : null));
            if (w.shouts.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Shouts'),
                ...w.shouts.map(s => h('div', { class: 'rpgc-wability' }, h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, s.name), ladderBar(s.words - 1, 3), h('span', { class: 'val' }, `${s.words} of 3 words`)), loreNote(s.lore)))));
            if (w.skills.length) out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Skills'),
                ...w.skills.slice(0, 8).map(s => h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, s.name), levelBar(Math.min(100, s.lv), s.lv >= 100 ? 'ok' : 'low'), h('span', { class: 'val' }, String(s.lv)))),
                w.skills.length > 8 ? wDetails('sk-skills', h('span', null, `${w.skills.length - 8} more`), ...w.skills.slice(8).map(s => h('p', { class: 'rpgc-note' }, `${s.name} ${s.lv}`))) : null));
            if (w.bounties.length) out.push(wRow('Bounty', ...w.bounties.map(x => h('span', { class: 'rpgc-chip hot' }, `${x.hold} ${fmtNum(x.gold)}`))));
            if (w.factions.length) out.push(wRow('Factions', ...w.factions.map(x => h('span', { class: 'rpgc-chip' }, x.rank ? `${x.name} \u00B7 ${x.rank}` : x.name))));
            if (w.gold !== null) out.push(wRow('Gold', h('b', null, `${fmtNum(w.gold)} septims`)));
            if (w.carry) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Carry weight'), levelBar(Math.min(100, w.carry.cur / Math.max(1, w.carry.max) * 100), w.carry.cur > w.carry.max ? 'critical' : 'ok'), h('span', { class: 'val' }, `${fmtNum(w.carry.cur)} / ${fmtNum(w.carry.max)}${w.carry.cur > w.carry.max ? ' \u00B7 over-encumbered' : ''}`)));
            for (const a of w.afflictions) out.push(h('p', { class: 'rpgc-status warning' }, a));
        }
        if (!out.length) return null;
        const badge = w.id === 'rezero' ? (w.deaths !== null ? `${w.deaths} death${w.deaths === 1 ? '' : 's'}` : w.theater ? 'Theater' : null)
            : w.id === 'overlord' ? (w.overall !== null ? `Lv ${w.overall}` : null)
            : w.id === 'cote' ? (w.godmother && w.godmother.decree && w.godmother.decree.minutesLeft !== null ? fmtLeft(w.godmother.decree.minutesLeft) : w.pp ? `${fmtNum(w.pp.value)} PP` : null)
            : w.id === 'scp' ? (w.scp && w.scp.night !== null ? `Night ${w.scp.night}` : null)
            : w.id === 'potter' ? (w.potter && w.potter.year ? `Year ${w.potter.year}` : null)
            : w.id === 'undertale' ? (w.lv !== null ? `LV ${w.lv}` : null)
            : w.id === 'darksouls' ? (w.souls !== null ? `${fmtNum(w.souls)} souls` : null)
            : w.id === 'skyrim' ? (w.level !== null ? `Level ${w.level}` : null)
            : (w.year !== null ? `K. ${w.year}` : null);
        return section('worldcard', w.label, state.open, badge, ...out);
    }

    // ─────────── 1.9.3: one card per person, and chapters ───────────

    function partyMemberFor(name) {
        const p = partyOf();
        if (!p || !name) return null;
        const k = String(name).trim().toLowerCase();
        const first = k.split(/\s+/)[0];
        return p.members.find(m => m.key === k || (m.aliases || []).some(a => a.toLowerCase() === k) || (first.length >= 3 && m.key.split(/\s+/)[0] === first)) || null;
    }

    // Present characters, Party and People describe the same people. One card each: the relationship
    // first, then what the party reading adds, then who they are in the scene right now.
    // 2.8: what you have on you, from the HUD's own item lines (no tokens)
    const INV_ICON = { weapon: '\u2694\uFE0F', armour: '\uD83D\uDEE1\uFE0F', magic: '\u2728', medical: '\uD83E\uDE79', food: '\uD83C\uDF5E', tools: '\uD83E\uDDF0', clothes: '\uD83D\uDC55', money: '\uD83E\uDE99', other: '\uD83D\uDCE6' };
    // 2.8: a picture prompt to copy into any image tool (KordyInsie's idea): no tokens, nothing is sent anywhere
    const PIC_STYLE = { rezero: 'anime key visual, soft cel shading', overlord: 'dark fantasy anime, dramatic lighting', cote: 'anime, clean school slice-of-life look', mushoku: 'anime fantasy, warm painterly backgrounds',
        tensura: 'bright fantasy anime', potter: 'storybook illustration, warm candlelight', scp: 'grim realistic photo, cold blue light, film grain', darksouls: 'dark fantasy oil painting, ash and ember',
        skyrim: 'painterly nordic fantasy, cold daylight', undertale: 'pixel art, limited palette' };
    const PIC_SIZES = { '1:1': [1328, 1328], '3:4': [1140, 1472], '4:3': [1472, 1140], '16:9': [1664, 928], '9:16': [928, 1664] };
    function picPrompt(o) {
        const hud = state.hms && state.hms.hud;
        const place = hud && Array.isArray(hud.location) ? hud.location.slice(-2).join(', ') : '';
        const lines = hud && Array.isArray(hud.lines) ? hud.lines.map(l => String(l.text || '')) : [];
        const wx = (lines.map(l => (l.match(/(?:^|\|\s*)Weather:\s*([^|]+)/i) || [])[1]).find(Boolean) || '').trim();
        const tline = lines.find(l => /\b\d{1,2}:\d\d\b/.test(l)) || '';
        const tm = tline.match(/\b(\d{1,2}):\d\d\b/);
        const tod = (tline.match(/\((morning|afternoon|evening|night|late night|dawn|dusk|noon|midnight)\)/i) || [])[1] || (tm ? (() => { const hh = Number(tm[1]); return hh < 5 ? 'night' : hh < 8 ? 'dawn' : hh < 12 ? 'morning' : hh < 17 ? 'afternoon' : hh < 20 ? 'evening' : 'night'; })() : '');
        const chars = Array.isArray(state.data && state.data.characters) ? state.data.characters.filter(c => c && plain(c.name)) : [];
        const look = (c) => { const d = c.details || {}; return [plain(d.Appearance || d.Look || ''), plain(d.Outfit || ''), plain(d.Position || '')].filter(Boolean).join(', '); };
        const who = o.what === 'one' ? chars.filter(c => plain(c.name) === o.who).slice(0, 1) : chars.slice(0, 4);
        const style = PIC_STYLE[(state.world && state.world.id) || ''] || 'detailed illustration';
        const people = who.map(c => `${plain(c.name)}${look(c) ? ` (${look(c)})` : ''}`);
        const setting = [place, tod, wx].filter(Boolean).join(', ');
        const subject = o.what === 'one' ? (people[0] ? `a portrait of ${people[0]}` : 'a character portrait')
            : o.what === 'action' ? `a dynamic action moment${people.length ? `: ${people.join('; ')}` : ''}, motion, tension`
            : `a wide establishing shot${people.length ? ` with ${people.join('; ')}` : ''}`;
        const [w, hgt] = PIC_SIZES[o.ar] || PIC_SIZES['16:9'];
        if (o.fmt === 'nano') return `Create a ${o.ar} image: ${subject}${setting ? `, in ${setting}` : ''}. Style: ${style}. Keep faces consistent and the lighting true to the time and weather. No text or watermarks.`;
        if (o.fmt === 'qwen') return `${subject.charAt(0).toUpperCase() + subject.slice(1)}${setting ? `, ${setting}` : ''}. ${style}, highly detailed, sharp focus, coherent anatomy.\nSize: ${w}×${hgt} (${o.ar})\nNegative: text, watermark, extra limbs, blurry`;
        return `${subject}${setting ? `, ${setting}` : ''}, ${style}, cinematic composition, rich detail\nAspect ratio: ${o.ar}`;   // Krea 2
    }
    function renderPicturePrompt() {
        if (S()?.showPicPrompt === false || !hmsOn()) return null;
        const o = state.pic || (state.pic = { what: 'scene', ar: '16:9', fmt: 'krea', who: '' });
        const chars = Array.isArray(state.data && state.data.characters) ? state.data.characters.filter(c => c && plain(c.name)) : [];
        if (o.what === 'one' && !chars.some(c => plain(c.name) === o.who)) o.who = chars.length ? plain(chars[0].name) : '';
        const sel = (label, key, opts) => { const x = h('select', { 'aria-label': label, onchange: (e) => { o[key] = e.target.value; render(); } }, ...opts.map(([v, t]) => h('option', { value: v }, t))); x.value = o[key]; return h('label', { class: 'rpgc-picsel' }, h('small', null, label), x); };
        const text = picPrompt(o);
        const ta = h('textarea', { rows: '5', 'aria-label': 'Picture prompt', readonly: true, class: 'rpgc-pictext' });
        ta.value = text;
        return section('picture', 'Picture prompt', closedByDefault('picture'), null,
            h('div', { class: 'rpgc-row rpgc-picrow' },
                sel('Picture', 'what', [['scene', 'Full scene'], ['one', 'One character'], ['action', 'Action']]),
                o.what === 'one' && chars.length ? sel('Who', 'who', chars.map(c => [plain(c.name), plain(c.name)])) : null,
                sel('Shape', 'ar', [['16:9', '16:9 wide'], ['4:3', '4:3'], ['1:1', '1:1 square'], ['3:4', '3:4 portrait'], ['9:16', '9:16 phone']]),
                sel('For', 'fmt', [['krea', 'Krea 2'], ['qwen', 'Qwen Image'], ['nano', 'Nano Banana']])),
            ta,
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: async () => { try { await navigator.clipboard.writeText(text); state.status = { kind: 'ok', text: 'Picture prompt copied.' }; } catch { ta.select(); state.status = { kind: 'info', text: 'Select the text and copy it.' }; } render(); } }, 'Copy'),
                h('span', { class: 'rpgc-note' }, 'Built from the HUD (place, time, weather) and the people in the scene. Paste it into any image tool. No tokens.')));
    }

    function renderOnYou() {
        const I = state.hms && state.hms.inventory;
        if (!I || S()?.showOnYou === false) return null;
        const out = [];
        if (I.money && I.money.length) out.push(h('div', { class: 'rpgc-row rpgc-invmoney' }, ...I.money.map(m => h('span', { class: 'rpgc-chip' }, `\uD83E\uDE99 ${m.name}: ${m.value}`))));
        for (const g of I.groups) out.push(h('div', { class: 'rpgc-invgroup' }, h('h5', null, `${INV_ICON[g.key] || ''} ${g.name}`),
            h('div', { class: 'rpgc-chips' }, ...g.items.map(it => h('span', { class: 'rpgc-chip', title: [it.note, it.src === 'hud' ? 'from the HUD' : 'kept by you'].filter(Boolean).join(' \u00B7 ') }, it.name, it.qty ? h('b', null, ` \u00D7${it.qty}`) : null, it.note ? h('small', null, ` (${it.note})`) : null)))));
        out.push(h('p', { class: 'rpgc-note' }, 'Read from the HUD\u2019s own lines (Inventory, Items, Equipment, Weapons, Pockets, Gold): no tokens. The Body card\u2019s Treat tray uses the same list.'));
        return section('inventory', 'On you', state.open, `${I.count} item${I.count === 1 ? '' : 's'}`, ...out);
    }

    function renderPeopleAll() {
        const s = S();
        if (!s) return null;
        const r = relOf();
        const rc = (sysCfg().relations) || {};
        const relOn = !!r && rc.enabled !== false;
        const p = partyOf();
        const pcfg = (sysCfg().party) || {};
        const partyOn = !!p && pcfg.enabled !== false && s.enabled;
        const charsOn = !!s.showCharacterThoughts;
        const charList = charsOn && Array.isArray(state.data.characters) ? state.data.characters : [];
        const mindList = (mindsOf() && mindsOf().cfg && mindsOf().people) || [];
        const gateInfo = (sysCfg().gates || {}).enabled !== false ? gatesOf() : null;
        const gateList = gateInfo ? gateInfo.people : [];
        const sheetInfo = charsOf();
        if (!relOn && !partyOn && !charsOn && !mindList.length && !gateList.length && !(sheetInfo && sheetInfo.people.some(q => !q.carded))) return null;
        const people = new Map();
        const keyOf = (name) => { const m = partyMemberFor(plain(name)); return m ? 'p:' + m.key : 'n:' + String(plain(name) || '').trim().toLowerCase(); };
        const put = (name, patch) => {
            if (!plain(name)) return;
            const k = keyOf(name);
            if (!people.has(k)) people.set(k, { key: k, name: plain(name) });
            Object.assign(people.get(k), patch);
        };
        if (relOn) for (const pp of r.people) put(pp.name, { rel: pp });
        if (partyOn) for (const m of p.members) put(m.name, { member: m });
        charList.forEach((c, idx) => put(c.name, { char: c, charIdx: idx }));
        // Minds (FrankenSIM): joined to whoever they belong to; someone known only by an agenda or a fact gets a card of their own
        for (const mp of mindList) {
            const k = keyOf(mp.name);
            const words = (x) => String(x || '').toLowerCase().split(/\s+/).filter(w => w.length >= 3);
            const same = (n) => { if (n === mp.key || n.startsWith(mp.key + ' ') || mp.key.startsWith(n + ' ')) return true; const a = words(n), b = words(mp.key); return !!(a.length && b.length && (a.every(w => b.includes(w)) || b.every(w => a.includes(w)))); };
            const cands = [...people.values()].filter(x => same(String(x.name || '').toLowerCase()));
            const hit = people.get(k) || (cands.length === 1 ? cands[0] : null);
            if (hit) hit.mind = mp; else if (mp.feel || mp.tfdy || mp.present || (mp.knows && mp.knows.length) || mp.agenda) put(mp.name, { mind: mp });
        }
        // Gates: the phase a character is in on their own card, joined to their card here. Someone not otherwise
        // listed gets a card once it matters (in the scene, moved, or a report is waiting); the rest fold away below.
        const gateRest = [];
        const gateNorm = (t) => String(t || '').normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase().replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
        for (const gp of gateList) {
            const names = new Set(gp.names || [gp.key]);
            const gw = gp.key.split(/[\s-]+/).filter(w => w.length >= 3);
            const same = (n) => { if (names.has(n)) return true; const a = n.split(/[\s-]+/).filter(w => w.length >= 3); return !!(a.length && gw.length && (a.every(w => gw.includes(w)) || gw.every(w => a.includes(w)))); };
            const cands = [...people.values()].filter(x => same(gateNorm(x.name)));
            if (cands.length === 1) cands[0].gate = gp;
            else if (gp.present || gp.moved || gp.pending.length) put(gp.name, { gate: gp });
            else gateRest.push(gp);
        }
        // Characters: card facts for those who have a card, the story's profile for those who do not
        const profRest = [];
        if (sheetInfo) for (const sh of sheetInfo.people) {
            const names = new Set(sh.names || [sh.key]);
            const sw = sh.key.split(/[\s-]+/).filter(w => w.length >= 3);
            const same = (n) => { if (names.has(n)) return true; const a = n.split(/[\s-]+/).filter(w => w.length >= 3); return !!(a.length && sw.length && (a.every(w => sw.includes(w)) || sw.every(w => a.includes(w)))); };
            const cands = [...people.values()].filter(x => same(gateNorm(x.name)));
            if (cands.length === 1) cands[0].sheet = sh;
            else if (!sh.carded && sh.present) put(sh.name, { sheet: sh });
            else if (!sh.carded) profRest.push(sh);
        }
        // 2.8: statuses (asleep, out cold, dead, tied up, missing…): on the person's card; someone known only by a status gets one
        for (const b of (state.hms && state.hms.bodies) || []) if (b.party && ![...people.values()].some(x => String(x.name || '').toLowerCase() === b.name.toLowerCase())) put(b.name, {});
        const stList = (state.hms && state.hms.statuses && state.hms.statuses.people) || [];
        for (const sp of stList) {
            const n = String(sp.name || '').trim().toLowerCase();
            const hit = [...people.values()].find(x => String(x.name || '').trim().toLowerCase() === n) || [...people.values()].find(x => { const a = String(x.name || '').toLowerCase(); return a.startsWith(n + ' ') || n.startsWith(a + ' '); });
            if (hit) hit.status = sp; else put(sp.name, { status: sp });
        }
        const all0 = [...people.values()];
        const isDead = (x) => !!(x.status && x.status.list.some(q => q.key === 'dead'));
        const deadRest = all0.filter(isDead);
        const all = all0.filter(x => !isDead(x));
        // 2.7.1: someone the reply reports but never shows (a mind or an agenda for a person far away) is not in the scene
        const awayBy = new Map(((state.hms && Array.isArray(state.hms.away)) ? state.hms.away : []).map(a => [String(a.name || '').trim().toLowerCase(), a]));
        for (const x of all) { const a = awayBy.get(String(x.name || '').trim().toLowerCase()) || (x.mind && x.mind.away) || (x.rel && x.rel.away) || null; if (a) x.away = { where: a.where || (x.mind && x.mind.agenda && x.mind.agenda.where) || null }; }
        const here = (x) => !x.away && !!((x.rel && x.rel.present) || (x.member && x.member.present) || x.char || (x.mind && x.mind.present) || (x.gate && x.gate.present && !x.rel && !x.member && !x.mind) || (x.sheet && x.sheet.present && !x.rel && !x.member && !x.mind && !x.gate));
        const f = state.peopleFilter || 'all';
        // people you have never dealt with and who are not here (the story only follows what they do elsewhere) fold away below
        const farOnly = (x) => !here(x) && !x.rel && !x.member && !x.gate && !x.sheet && (x.away || (!x.char && x.mind && !x.mind.present && !(x.mind.pairs && x.mind.pairs.length)));
        const elseRest = all.filter(farOnly);
        const list = all.filter(x => !farOnly(x) && (f === 'all' || (f === 'here' && here(x)) || (f === 'party' && x.member) || (f === 'foes' && x.rel && x.rel.tone === 'neg')));
        // people in the scene first, then the party, then everyone else
        list.sort((a, b) => (here(b) - here(a)) || (!!b.member - !!a.member));
        const layout = rc.layout || (r && r.layout) || 'cards';
        const out = [h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Show' },
            [['all', 'All'], ['here', 'Here'], ['party', 'Party'], ['foes', 'Against you']].map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === f ? ' primary' : ''), 'aria-pressed': k === f ? 'true' : 'false', onclick: () => { state.peopleFilter = k; render(); } }, l)))];
        if (partyOn && !s.hmsCompanion && hmsOn()) out.push(h('p', { class: 'rpgc-note' }, 'Party readings ride on the side-panel block, which is switched off. Turn it on in Settings \u2192 HMS engine.'));
        if (gateInfo && gateInfo.pending) out.push(h('p', { class: 'rpgc-gatewait', role: 'status' }, `\uD83D\uDDDD\uFE0F ${gateInfo.pending} reported gate${gateInfo.pending === 1 ? '' : 's'} waiting for your Accept or Dismiss, on the card${gateInfo.pending === 1 ? '' : 's'} below.`));
        if (!all.length) out.push(h('p', { class: 'rpgc-note' }, 'Everyone you deal with shows up here: who is in the scene, how they feel about you, and \u2014 for your party \u2014 their mood, needs and the states their card names.'));
        else if (!list.length) out.push(h('p', { class: 'rpgc-note' }, f === 'all' && elseRest.length ? 'Nobody is in the scene with you.' : 'Nobody matches.'));
        else if (layout !== 'cards' && relOn) {
            // The compact, hearts and codex views are relationship views; people without a reading use a card.
            const relOnly = list.filter(x => x.rel);
            const rest = list.filter(x => !x.rel);
            const view = renderPeopleLayout(relOnly.map(x => x.rel), layout);
            if (view) out.push(view);
            if (rest.length) out.push(h('div', { class: 'rpgc-cards' }, rest.map(personMerged)));
        } else out.push(h('div', { class: 'rpgc-cards' }, list.map(personMerged)));
        if (partyOn) {
            const input = h('input', { type: 'text', placeholder: 'Add a party member', 'aria-label': 'Add a party member' });
            const add = () => { const v = input.value.trim(); if (!v) return; input.value = ''; send({ type: 'party_member', chatId: state.chatId, op: 'add', name: v }); };
            input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
            if (p.members.length < (p.max || 8)) out.push(h('div', { class: 'rpgc-add' }, input, h('button', { class: 'rpgc-btn', onclick: add }, 'Add to party')));
            if (p.suggest && p.suggest.length) out.push(h('div', { class: 'rpgc-row rpgc-suggest' }, h('span', { class: 'rpgc-note' }, 'Suggested:'),
                p.suggest.map(n => h('button', { class: 'rpgc-btn', title: `Add ${n} to the party`, onclick: () => send({ type: 'party_member', chatId: state.chatId, op: 'add', name: n }) }, '+ ' + n))));
        }
        if (elseRest.length && f === 'all') out.push(simSubdet('people-elsewhere', `\uD83E\uDDED Elsewhere (${elseRest.length}): people the story follows who are not in this scene`, h('div', { class: 'rpgc-cards' }, elseRest.map(personMerged))));
        if (deadRest.length && f === 'all') out.push(simSubdet('people-dead', `\uD83D\uDC80 Deceased (${deadRest.length})`, h('div', { class: 'rpgc-cards rpgc-dead' }, deadRest.map(personMerged)),
            h('p', { class: 'rpgc-note' }, 'Their plans stop and they learn nothing more. A Return by Death (or the world\u2019s own power) that undoes it brings them back here.')));
        if (gateRest.length && f === 'all') out.push(simSubdet('gates-rest', `\uD83D\uDDDD\uFE0F Other gated cards (${gateRest.length}): not met yet, all in Phase 0`, h('div', { class: 'rpgc-cards' }, gateRest.map(gateCard))));
        if (profRest.length && f === 'all') out.push(simSubdet('profiles-rest', `\uD83E\uDEAA Other people the story has profiled (${profRest.length})`, h('div', { class: 'rpgc-cards' }, profRest.map(sheetCard))));
        if (charsOn) out.push(h('div', null, h('button', { class: 'rpgc-btn', onclick: () => { chars().push({ name: 'New character', emoji: '\uD83D\uDE42' }); commit(); } }, 'Add someone to the scene')));
        const alerts = all.reduce((a, x) => a + (x.member ? x.member.alerts.length : 0) + (x.rel ? x.rel.alerts.filter(y => y.sev === 'warn').length : 0), 0) + (gateInfo ? gateInfo.pending : 0);
        const high = all.some(x => x.member && x.member.alerts.some(a => a.sev === 'high'));
        const nHere = all.filter(here).length;
        const sec = section('people', 'People', state.open, alerts ? `${alerts} alert${alerts === 1 ? '' : 's'}` : all.length ? `${nHere} here \u00B7 ${all.length}` : null, ...out);
        if (high) sec.classList.add('alarm');
        return sec;
    }

    // 2.8: a person's status badges, and setting one by hand
    function npcStatusRow(x) {
        const sp = x.status;
        const kinds = (state.hms && state.hms.statuses && state.hms.statuses.kinds) || [];
        if (!kinds.length) return null;
        const hm = (m) => { const d = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`; };
        const open = state.npcEdit === x.name;
        const sel = h('select', { 'aria-label': `Status of ${x.name}`, onchange: (e) => { send({ type: 'npc_status', chatId: state.chatId, name: x.name, now: e.target.value ? [e.target.value] : [] }); state.npcEdit = null; } },
            h('option', { value: '' }, 'Fine (no status)'),
            ...['body', 'free', 'mind'].map(g => h('optgroup', { label: { body: 'Body', free: 'Where they are', mind: 'Mind and magic' }[g] }, ...kinds.filter(k => k.group === g).map(k => h('option', { value: k.key }, `${k.emoji} ${k.label}`)))));
        sel.value = sp && sp.list.length === 1 ? sp.list[0].key : '';
        return h('div', { class: 'rpgc-npcst' },
            ...(sp ? sp.list.map(q => h('span', { class: `rpgc-chip st-${q.group}${q.late ? ' hot' : ''}`, title: sp.note || null }, `${q.emoji} ${q.label}${q.until != null ? (q.late ? ' \u00B7 time is up' : ` \u00B7 until ${hm(q.until)}`) : ''}`)) : []),
            sp && sp.note ? h('small', null, sp.note) : null,
            open ? sel : h('button', { class: 'rpgc-mini', title: 'Set a status by hand (asleep, out cold, dead, tied up, missing\u2026)', onclick: () => { state.npcEdit = x.name; render(); } }, sp ? 'Change' : '+ status'));
    }
    // 2.8: their body, like yours: a party member's wounds, a crippled leg, how the dead died (no head, if beheaded)
    function npcBodyOf(name) {
        const B = (state.hms && state.hms.bodies) || [];
        const n = String(name || '').trim().toLowerCase();
        return B.find(o => o.name.toLowerCase() === n) || B.find(o => { const a = o.name.toLowerCase(); return a.startsWith(n + ' ') || n.startsWith(a + ' '); }) || null;
    }
    function npcBodyFold(x) {
        const b = npcBodyOf(x.name);
        if (!b) return null;
        const q0 = hlQuad, s0 = hlSlime;
        hlQuad = false; hlSlime = false;
        let svg = '';
        try { svg = hlBodySvg({ ...b.H, locks: b.H.locks || [] }, null).replace(/Your body: press (a part|it) to see its wounds/, `${pEsc(b.name)}\u2019s body`); } finally { hlQuad = q0; hlSlime = s0; }
        const pic = h('div', { class: 'rpgc-hlmap rpgc-npcmap' });
        pic.innerHTML = svg;
        const V = b.H.vital;
        const wounds = (b.H.affl || []).filter(a => a.state !== 'healed').slice(0, 6);
        const open = b.dead ? true : !!(b.H.gone && b.H.gone.length);
        return h('details', { class: 'rpgc-npcbody', open: open ? true : null }, h('summary', null, b.dead ? '\uD83D\uDC80 How they died' : `\uD83E\uDE7A Body${V && V.rank ? ` \u00B7 ${V.word}` : ''}`),
            h('div', { class: 'rpgc-npcbodyrow' }, pic, h('div', null,
                b.dead ? h('p', { class: 'cause' }, b.dead === 'unknown' ? 'Dead. The story has not said how.' : `Dead: ${b.dead}.`) : null,
                ...(b.H.gone || []).map(g => h('div', { class: 'rpgc-hlgone mini' }, g)),
                wounds.length ? h('ul', null, ...wounds.map(a => h('li', null, `${a.zone ? hlZn(a.zone) + ': ' : ''}${a.text}${a.prosthetic ? ` (${a.prosthetic.kind})` : ''}`))) : null,
                h('button', { class: 'rpgc-mini', title: 'Which body chart', onclick: () => send({ type: 'npc_status', op: 'figure', chatId: state.chatId, name: b.name, figure: b.figure === 'female' ? 'male' : 'female' }) },
                    b.figure === 'female' ? '\u2640 Female chart' : '\u2642 Male chart', b.figureSrc === 'story' ? ' (from the story)' : ''))));
    }
    // 2.9: starred people live their own lives off screen; each person's history with you and the others
    const starsOf = () => (state.hms && state.hms.minds && Array.isArray(state.hms.minds.offscreen)) ? state.hms.minds.offscreen : [];
    const isStarred = (name) => { const n = String(name || '').trim().toLowerCase(); return starsOf().some(o => { const a = String(o.name || '').trim().toLowerCase(); return a === n || a.split(' ')[0] === n.split(' ')[0]; }); };
    function starBtn(name) {
        const on = isStarred(name);
        return h('button', { class: 'rpgc-mini star' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', 'aria-label': on ? `Stop following ${name} off screen` : `Follow ${name}'s life off screen`, title: on ? 'Lives their own life off screen (press to stop)' : 'Star: they live their own life off screen, and the story keeps up with them',
            onclick: () => send({ type: 'npc_star', chatId: state.chatId, name, on: !on }) }, on ? '\u2605' : '\u2606');
    }
    function historyFold(x) {
        const hs = state.hms && state.hms.history;
        if (!hs) return null;
        const n = String(x.name || '').trim().toLowerCase();
        const hx = hs[n] || Object.entries(hs).find(([k]) => k.split(' ')[0] === n.split(' ')[0])?.[1];
        if (!hx || (!hx.life.length && !hx.between.length)) return null;
        const ICON = { bond: '\uD83E\uDD1D', moment: '\u2728', milestone: '\uD83C\uDFC1', note: '\uD83D\uDCDD' };
        return simSubdet('hist-' + n, `\uD83D\uDCDC History (${hx.life.length + hx.between.length})`,
            hx.life.length ? h('ul', { class: 'rpgc-plain rpgc-hist' }, hx.life.slice().reverse().map(e => h('li', null, h('span', { 'aria-hidden': 'true' }, ICON[e.kind] || '\u2022'), ' ', e.kind === 'milestone' ? h('b', null, e.text) : e.text, e.when ? h('small', null, ` \u00B7 ${e.when}`) : null))) : null,
            hx.between.length ? h('h4', null, 'Between them') : null,
            hx.between.length ? h('ul', { class: 'rpgc-plain rpgc-hist' }, hx.between.slice().reverse().map(e => h('li', null, e.text, h('small', null, ` \u00B7 ${e.ago ? `${e.ago} repl${e.ago === 1 ? 'y' : 'ies'} ago` : 'this reply'}`)))) : null);
    }
    function renderOffscreen() {
        const list = starsOf();
        if (!list.length) return null;
        const hm = (v) => v === null || v === undefined ? '' : v;
        const rows = list.map(o => {
            const a = o.agenda;
            const now = o.present ? 'in the scene with you' : a ? [a.where, a.doing].filter(Boolean).join(' \u2014 ') : 'nothing said yet: the story is asked on the next reply';
            const when = a && a.until ? (a.overdue ? `was until ${a.until} (over: asked again)` : `until ${a.until}`) : '';
            return h('div', { class: 'rpgc-offrow' + (o.present ? ' here' : '') },
                h('div', { class: 'head' }, avatarImg(o.name), h('b', null, o.name), starBtn(o.name)),
                h('p', null, now, when ? h('small', null, ` \u00B7 ${when}`) : null),
                a && a.next ? h('p', { class: 'rpgc-note' }, `Next: ${a.next}`) : null,
                a && a.was && a.was.length ? h('ul', { class: 'rpgc-plain rpgc-hist' }, a.was.slice(0, 5).map(w => h('li', null, [w.where, w.doing].filter(Boolean).join(' \u2014 '), h('small', null, ` \u00B7 ${w.ago} repl${w.ago === 1 ? 'y' : 'ies'} ago`)))) : null);
        });
        return section('offscreen', 'Off screen', state.open, String(list.length),
            h('p', { class: 'rpgc-note' }, 'The people you starred live their own lives out of your sight: work, training, errands, friends, plans. When what they were doing is over, the story is asked what they do next. Star someone on their card in People.'),
            ...rows);
    }
    function personMerged(x) {
        if (!x.rel && !x.member && !x.char && !x.mind && !x.gate && !x.sheet) {
            // known only by a status
            const c = h('div', { class: 'rpgc-person neutral' + (x.status && x.status.list.some(q => q.key === 'dead') ? ' dead' : '') }, h('div', { class: 'head' }, avatarImg(x.name), h('span', { class: 'name' }, x.name)), npcStatusRow(x), npcBodyFold(x));
            return c;
        }
        const card = personMergedCard(x);
        if (card) { const row = npcStatusRow(x); if (row) card.insertBefore(row, card.children[1] || null); const bf = npcBodyFold(x); if (bf) card.appendChild(bf); if (x.status && x.status.list.some(q => q.key === 'dead')) card.classList.add('dead'); }
        if (card) { const hd = card.querySelector('.head'); if (hd && !(x.status && x.status.list.some(q => q.key === 'dead'))) hd.appendChild(starBtn(x.name)); const hf = historyFold(x); if (hf) card.appendChild(hf); }
        if (card && x.away) {
            card.classList.add('away');
            card.insertBefore(h('div', { class: 'rpgc-awayline' }, h('span', { class: 'rpgc-chip' }, 'not in this scene'), x.away.where ? h('small', null, ` ${x.away.where}`) : null), card.children[1] || null);
        }
        return card;
    }
    function personMergedCard(x) {
        const thoughtsShown = !!(x.char && S().trackerConfig?.presentCharacters?.thoughts?.enabled && plain(x.char.thoughts));
        let card;
        if (x.rel) card = personCard(x.rel, { noDossier: !!x.char });
        else if (x.member) card = partyCard(x.member, { skipConcern: thoughtsShown });
        else if (x.char) { card = charCard(x.char, x.charIdx); if (x.mind) { const mb = mindBlock(x.mind); if (mb) card.appendChild(mb); } if (x.gate) card.appendChild(gateBlock(x.gate)); if (x.sheet) card.appendChild(sheetBlock(x.sheet)); return card; }
        else if (x.mind) { card = mindCard(x.mind); if (x.gate) card.appendChild(gateBlock(x.gate)); if (x.sheet) card.appendChild(sheetBlock(x.sheet)); return card; }
        else if (x.gate) { card = gateCard(x.gate); if (x.sheet) card.appendChild(sheetBlock(x.sheet)); return card; }
        else return sheetCard(x.sheet);
        if (x.mind) { const mb = mindBlock(x.mind); if (mb) card.appendChild(mb); }
        if (x.gate) card.appendChild(gateBlock(x.gate));
        if (x.sheet) card.appendChild(sheetBlock(x.sheet));
        if (x.rel && x.member) card.appendChild(partyCard(x.member, { merged: true, skipConcern: thoughtsShown }));
        if (x.char) card.appendChild(charCard(x.char, x.charIdx, { merged: true }));
        if (x.member && x.member.alerts.some(a => a.sev === 'high')) card.classList.add('high');
        return card;
    }

    // ── chapters ──

    const CH_KIND = { manual: 'Chapter', loop: 'Loop', arc: 'Arc', day: 'Day', month: 'Month' };
    function chapterSpan(c) {
        const a = c.start && (c.start.time || c.start.where) ? [c.start.time, c.start.arc].filter(Boolean).join(', ') : null;
        const b = c.end && c.end.time ? c.end.time : null;
        const msgs = c.messages ? `${c.messages} message${c.messages === 1 ? '' : 's'}` : null;
        return [a && b ? `${a} \u2192 ${b}` : a, msgs].filter(Boolean).join(' \u00B7 ');
    }


    // ─────────── 1.9.26: New game (the bot's catalog), the OOC guide ───────────
    // The bot's greeting pages are its catalog: pick a start, stack what you like on it, and the
    // command goes in from the Canvas page with the handler line on top, the way the hub asks.
    function ngText() {
        const ng = state.ng; const c = state.catalog;
        if (!ng) return '';
        if (ng.edited !== null && ng.edited !== undefined) return ng.edited;
        let body = String(ng.start || '').trim();
        for (const m of ng.mods || []) body = body ? (/^with\b/i.test(m) ? `${body} ${m}` : `${body}, ${m}`) : m;
        return c && c.handler ? `${c.handler}\n${body}` : body;
    }
    function ngCheckSoon() {
        clearTimeout(state.ngTimer);
        state.ngTimer = setTimeout(() => send({ type: 'catalog_check', chatId: state.chatId, text: ngText() }), 250);
    }
    function ngPick(it, value) {
        const ng = state.ng;
        const cmd = value || it.cmd;
        if (it.kind === 'example') { ng.start = cmd; ng.mods = []; }
        else if (it.kind === 'start') ng.start = ng.start === cmd ? '' : cmd;
        else ng.mods = ng.mods.includes(cmd) ? ng.mods.filter(x => x !== cmd) : [...ng.mods, cmd];
        ng.edited = null; ng.fill = null;
        ngCheckSoon(); render();
    }
    function renderNewGame() {
        const info = state.newGame;
        if (!info || S()?.showNewGame === false) return null;
        const C = state.catalog && state.catalog.chatId === state.chatId ? state.catalog : null;
        if (!C && !state.catReq && state.open.newgame !== false) { state.catReq = true; send({ type: 'catalog_get', chatId: state.chatId }); }
        if (!C) return section('newgame', 'New game', state.open, `${info.pages} catalog pages`, h('p', { class: 'rpgc-note' }, 'Reading the bot’s catalog…'));
        if (C.none || !C.pages.length) return null;
        if (!state.ng) state.ng = { page: 0, start: '', mods: [], edited: null, fill: null, warnings: [], filter: '' };
        const ng = state.ng;
        const pg = C.pages[Math.min(ng.page, C.pages.length - 1)];
        const out = [h('p', { class: 'rpgc-note' }, `Built from this bot’s own catalog (its greeting pages). Pick one start, add anything that stacks on it, then Start. The command goes in from the Canvas page${C.handler ? `, with ${C.handler} on the first line` : ''}, as the bot’s hub asks.`)];
        out.push(h('div', { class: 'rpgc-ng-pages', role: 'tablist', 'aria-label': 'Catalog pages' }, C.pages.map((p, i) => h('button', { class: 'rpgc-btn' + (i === ng.page ? ' primary' : ''), role: 'tab', 'aria-selected': i === ng.page ? 'true' : 'false', title: p.note || p.title, onclick: () => { ng.page = i; ng.fill = null; render(); } }, p.title.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase())))));
        if (pg.note) out.push(h('p', { class: 'rpgc-note' }, pg.note));
        const fIn = h('input', { type: 'search', placeholder: 'Find on this page', 'aria-label': 'Find on this page', value: ng.filter || '' });
        fIn.addEventListener('input', () => { ng.filter = fIn.value; clearTimeout(state.ngF); state.ngF = setTimeout(render, 200); });
        if (pg.items.length > 12) out.push(fIn);
        const f = (ng.filter || '').toLowerCase();
        const groups = new Map();
        const READY = 'Ready-made (a start and its add-ons in one)';
        for (const it of pg.items) {
            if (f && !`${it.cmd} ${it.label} ${it.desc}`.toLowerCase().includes(f)) continue;
            const key = it.kind === 'example' ? READY : it.section;
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(it);
        }
        // the page's own options first, its worked examples last
        if (groups.has(READY)) { const r = groups.get(READY); groups.delete(READY); groups.set(READY, r); }
        const many = pg.items.length > 20 && !f;
        let firstOpen = true;
        const KIND = { start: 'start', mod: 'add-on', example: 'ready' };
        for (const [sec, items] of groups) {
            const okey = `ng:${pg.index}:${sec}`;
            const openNow = state.open[okey] !== undefined ? state.open[okey] : (!many || (firstOpen && sec !== READY));
            if (sec !== READY) firstOpen = false;
            const det = h('details', { class: 'rpgc-ng-sec' }, h('summary', null, h('span', { class: 'lbl', style: 'display:inline' }, `${sec} (${items.length})`)), ...items.map(it => {
                const on = ng.start === it.cmd || ng.mods.includes(it.cmd);
                const fill = ng.fill && ng.fill.cmd === it.cmd;
                const btn = h('button', { class: 'rpgc-ng-item' + (on ? ' on' : ''), 'aria-pressed': on ? 'true' : 'false', onclick: () => {
                    if (it.fields && it.fields.length && !on) { ng.fill = { cmd: it.cmd, values: {} }; render(); return; }
                    ngPick(it);
                } },
                    h('span', { class: 'k' }, KIND[it.kind] || it.kind), h('span', { class: 'c' }, it.cmd),
                    it.label && it.label !== sec && it.label !== it.cmd ? h('span', { class: 'rpgc-note' }, ` · ${it.label}`) : null,
                    it.desc ? h('span', { class: 'd' }, it.desc) : null);
                if (!fill) return btn;
                // the blanks in [brackets]: fill them, or leave an optional one empty
                const ins = it.fields.map(name => { const i = h('input', { type: 'text', placeholder: name, 'aria-label': name }); i.addEventListener('input', () => { ng.fill.values[name] = i.value; }); return i; });
                const done = () => {
                    let v = it.cmd;
                    for (const name of it.fields) { const val = String(ng.fill.values[name] || '').trim(); v = v.split(`[${name}]`).join(val); }
                    ngPick(it, v.replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',').trim());
                };
                return h('div', null, btn, h('div', { class: 'rpgc-row' }, ...ins, h('button', { class: 'rpgc-btn primary', onclick: done }, 'Add')));
            }));
            det.open = !!openNow || !!f;
            det.addEventListener('toggle', () => { state.open[okey] = det.open; });
            out.push(det);
        }
        if (!groups.size) out.push(h('p', { class: 'rpgc-note' }, 'Nothing on this page matches.'));
        // what you have so far
        const chosen = [ng.start ? h('span', { class: 'rpgc-chip', style: 'font-weight:600' }, ng.start, ' ', h('button', { class: 'rpgc-mini', 'aria-label': 'Remove the start', onclick: () => { ng.start = ''; ng.edited = null; ngCheckSoon(); render(); } }, '✕')) : h('span', { class: 'rpgc-note' }, 'No start yet.'),
            ...ng.mods.map(m => h('span', { class: 'rpgc-chip' }, m, ' ', h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${m}`, onclick: () => { ng.mods = ng.mods.filter(x => x !== m); ng.edited = null; ngCheckSoon(); render(); } }, '✕')))];
        const ta = h('textarea', { class: 'rpgc-ng-cmd', 'aria-label': 'Your start command', value: ngText(), rows: '3' });
        ta.addEventListener('input', () => { ng.edited = ta.value; ngCheckSoon(); });
        out.push(h('div', { class: 'rpgc-set' }, h('h4', null, 'Your start'), h('div', { class: 'rpgc-chips' }, ...chosen), ta,
            ...(ng.warnings || []).map(w => h('p', { class: 'rpgc-ng-warn' }, '⚠ ' + w,
                /"with RBD"/.test(w) ? h('button', { class: 'rpgc-btn', style: 'margin-left:6px', onclick: () => { if (!ng.mods.includes('with RBD')) ng.mods = ['with RBD', ...ng.mods]; ng.edited = null; ngCheckSoon(); render(); } }, 'Add "with RBD"') : null)),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', disabled: !ngText().trim() ? true : null, onclick: () => send({ type: 'newgame_start', chatId: state.chatId, text: ngText() }) }, 'Start the game'),
                h('button', { class: 'rpgc-btn', onclick: async () => { try { await navigator.clipboard.writeText(ngText()); } catch { /* no clipboard */ } } }, 'Copy'),
                h('button', { class: 'rpgc-btn', onclick: () => { state.ng = null; render(); } }, 'Clear'))));
        // A story from another chat: the bot's Start Continuer line, the old HUD, and the last messages.
        if (C.continuer) {
            const rs = state.ngResume || (state.ngResume = { hud: '', tail: '', sum: '', warn: false });
            const hudTa = h('textarea', { rows: '6', 'aria-label': 'The last HUD from your old chat', placeholder: 'Paste the last WORLD STATE HUD from your old chat (from ### WORLD STATE ### down to ***)', style: 'width:100%;box-sizing:border-box' });
            hudTa.value = rs.hud;
            hudTa.addEventListener('input', () => { rs.hud = hudTa.value; });
            const tailTa = h('textarea', { rows: '4', 'aria-label': 'Your last few messages', placeholder: 'Optional: paste your last few messages, so the story picks up mid-scene', style: 'width:100%;box-sizing:border-box' });
            tailTa.value = rs.tail;
            tailTa.addEventListener('input', () => { rs.tail = tailTa.value; });
            const sumTa = h('textarea', { rows: '4', 'aria-label': 'A summary of the story so far', placeholder: 'Optional: a summary of the story so far (the old chat\u2019s Summary, or your own notes)', style: 'width:100%;box-sizing:border-box' });
            sumTa.value = rs.sum || '';
            sumTa.addEventListener('input', () => { rs.sum = sumTa.value; });
            const resumeText = () => `${C.continuer}\nResume from this HUD.\n\n${rs.hud.trim()}${rs.tail.trim() ? `\n\nMy last messages:\n${rs.tail.trim()}` : ''}${(rs.sum || '').trim() ? `\n\nThe story so far:\n${rs.sum.trim()}` : ''}`;
            const det = h('details', { class: 'rpgc-ng-sec' },
                h('summary', null, h('span', { class: 'lbl', style: 'display:inline' }, 'Resume an old campaign instead')),
                h('p', { class: 'rpgc-note' }, `For a story you began in another chat. Paste its last HUD: that is the save file. Add your last few messages and a summary of the story if you have them, so it picks up mid-scene. The line ${C.continuer} goes first, as the bot asks.`),
                hudTa, tailTa, sumTa,
                rs.warn ? h('p', { class: 'rpgc-ng-warn' }, '⚠ Paste the HUD first: it must include the WORLD STATE heading.') : null,
                h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => {
                        if (!/WORLD STATE/i.test(rs.hud)) { rs.warn = true; render(); return; }
                        rs.warn = false;
                        send({ type: 'newgame_start', chatId: state.chatId, text: resumeText() });
                    } }, 'Resume the campaign'),
                    h('button', { class: 'rpgc-btn', onclick: async () => { try { await navigator.clipboard.writeText(resumeText()); } catch { /* no clipboard */ } } }, 'Copy')));
            det.open = state.open['ng:resume'] === true || !!rs.warn;
            det.addEventListener('toggle', () => { state.open['ng:resume'] = det.open; });
            out.push(det);
        }
        return section('newgame', 'New game', state.open, `${C.pages.length} pages`, ...out);
    }

    // The bot's OOC guide: a question outside the story, answered in voice, the story untouched.
    function renderOoc() {
        const o = state.ooc;
        if (!o || (!o.guide && !(o.log && o.log.length)) || S()?.showOoc === false) return null;
        const busy = !!o.busy || (state.status && state.status.kind === 'busy' && /guide/i.test(state.status.text || ''));
        const qIn = h('textarea', { rows: '2', placeholder: o.guide ? `Ask ${o.guide} anything about the world, the rules or the commands` : 'Ask about the world, the rules or the commands', 'aria-label': 'Your OOC question', style: 'width:100%;box-sizing:border-box' });
        if (state.oocDraft) qIn.value = state.oocDraft;
        qIn.addEventListener('input', () => { state.oocDraft = qIn.value; });
        const gIn = h('input', { type: 'text', placeholder: o.guide ? `Guide: ${o.guide}` : 'Guide (optional)', 'aria-label': 'Another guide (optional)', value: state.oocGuide || '', style: 'flex:1;min-width:0' });
        gIn.addEventListener('input', () => { state.oocGuide = gIn.value; });
        const ask = (inChat) => { const q = qIn.value.trim(); if (!q) return; send({ type: inChat ? 'ooc_chat' : 'ooc_ask', chatId: state.chatId, question: q, guide: (state.oocGuide || '').trim() }); state.oocDraft = ''; qIn.value = ''; };
        const out = [h('p', { class: 'rpgc-note' }, `${o.guide ? `${o.guide} is this bot’s guide. ` : ''}Ask here and the answer stays in this panel: no HUD, no time passes, the story never sees it. "Ask in the story" posts it in the chat as ${o.trigger.startsWith('[') ? `${o.trigger} …]` : `${o.trigger} …`} instead.`), qIn,
            h('div', { class: 'rpgc-row' }, gIn,
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => ask(false) }, busy ? 'Asking…' : 'Ask'),
                h('button', { class: 'rpgc-btn', title: 'Post it in the chat with the bot’s own trigger; that turn gets no HUD and no side-panel block', onclick: () => ask(true) }, 'Ask in the story'))];
        for (const x of (o.log || []).slice().reverse().slice(0, 8)) out.push(h('div', null, h('div', { class: 'rpgc-ooc-q' }, `❓ ${x.q}`), h('div', { class: 'rpgc-ooc-a' }, h('b', null, `${x.guide}: `), x.a)));
        if (o.log && o.log.length) out.push(h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'ooc_clear', chatId: state.chatId }) }, 'Clear the answers'));
        return section('ooc', `OOC guide${o.guide ? ` — ${o.guide}` : ''}`, closedByDefault('ooc'), o.log && o.log.length ? String(o.log.length) : null, ...out);
    }

    // ─────────── 1.9.24: the Chronicle ───────────
    // The story's timeline: key moments, milestones, relationship history and plot points, newest first,
    // grouped by loop and day. What is already in the Memory Cortex is ticked; the latest reply waits
    // until you answer it, because a swipe could still change it.
    const CHRON_ICON = { moment: '★', note: '✎', bond: '💞', plot: '🧭', milestone: '◆', place: '📍' };
    const CHRON_FILTERS = [['all', 'All'], ['moment', '★ Moments'], ['bond', '💞 Bonds'], ['plot', '🧭 Plot'], ['milestone', '◆ Milestones'], ['place', '📍 Places']];
    const CHRON_MODE = { off: 'writes nothing by itself', key: 'writes only the biggest moments', most: 'writes key moments, bonds, plot and milestones', all: 'writes everything, places too' };
    function chronTime(ms) { if (!ms) return ''; const d = new Date(ms); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
    function renderChronicle() {
        const info = state.chronicle;
        if (!info || S()?.showChronicle === false || (isObj(S()?.chronicle) && S().chronicle.enabled === false)) return null;
        const D = state.chronData && state.chronData.chatId === state.chatId ? state.chronData : null;
        const fresh = D && D.version === info.version;
        if (!fresh && !state.chronReq && state.open.chronicle !== false) { state.chronReq = true; send({ type: 'chronicle_get', chatId: state.chatId }); }
        if (!D) return section('chronicle', 'Chronicle', state.open, null, h('p', { class: 'rpgc-note' }, 'Reading the story…'));
        const all = D.entries || [];
        const f = state.chronFilter || 'all';
        const showHidden = !!state.chronHidden;
        const who = state.chronWho || null;
        const list = all.filter(e => (showHidden || !e.hidden) && (f === 'all' || e.kind === f || (f === 'moment' && (e.kind === 'note' || e.star)))
            && (!who || (e.who || []).some(n => n.toLowerCase() === who.toLowerCase()))).slice().reverse();
        const limit = state.chronShow || 40;
        const out = [];
        out.push(h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Show' },
            CHRON_FILTERS.map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === f ? ' primary' : ''), 'aria-pressed': k === f ? 'true' : 'false', onclick: () => { state.chronFilter = k; state.chronShow = 40; render(); } }, l))));
        const noteIn = h('input', { type: 'text', placeholder: 'Add a moment of your own', 'aria-label': 'Add a moment of your own', maxlength: '240' });
        const addNote = () => { const t = noteIn.value.trim(); if (!t) return; send({ type: 'chronicle_edit', chatId: state.chatId, op: 'note', text: t }); noteIn.value = ''; };
        noteIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') addNote(); });
        out.push(h('div', { class: 'rpgc-chron-add' }, noteIn, h('button', { class: 'rpgc-btn', onclick: addNote }, 'Add')));
        // one person's timeline: everything between you and them, from the first meeting on
        if (who) out.push(h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Only '), h('b', null, who),
            h('button', { class: 'rpgc-mini', 'aria-label': 'Show everyone', title: 'Show everyone', onclick: () => { state.chronWho = null; render(); } }, '\u2715')));
        if (!all.length) out.push(h('p', { class: 'rpgc-note' }, 'Nothing yet. The Chronicle fills itself from the story: a new arc, a rank or level, a power gained, a death and its loop, quests, first meetings, how people come to feel about you, and the key moments the story flags.'));
        else if (!list.length) out.push(h('p', { class: 'rpgc-note' }, 'Nothing matches.'));
        let loop = undefined, day = undefined, ul = null;
        for (const e of list.slice(0, limit)) {
            if (D.loops && e.loop !== loop) { loop = e.loop; day = undefined; out.push(h('div', { class: 'rpgc-chron-loop' }, e.loop ? `Loop ${e.loop}` : 'Before the loops')); }
            const dpart = (e.when || '').split(',')[0].trim();
            if (dpart !== day || !ul) { day = dpart; if (dpart) out.push(h('div', { class: 'rpgc-chron-day' }, dpart)); ul = h('ul', { class: 'rpgc-chron-list' }); out.push(ul); }
            const tpart = (e.when || '').includes(',') ? e.when.split(',').slice(1).join(',').trim() : (/^\d{1,2}:\d{2}/.test(e.when || '') ? e.when : '');
            const status = e.sent ? h('span', { class: 'st sent', title: 'In the Memory Cortex', 'aria-label': 'In the Memory Cortex' }, '✓')
                : !e.settled ? h('span', { class: 'st wait', title: 'Waits until you answer this reply — a swipe could still change it', 'aria-label': 'Waits for your answer' }, '⏳')
                : e.goes && !e.hidden ? h('span', { class: 'st wait', title: 'Goes into the Memory Cortex with the next write', 'aria-label': 'Next write' }, '•')
                : h('span', { class: 'st', title: 'Stays in the Chronicle (below what you chose to write)', 'aria-label': 'Stays here' }, '');
            const cls = ['rpgc-chron-item', e.kind, e.star ? 'star' : '', e.imp >= 8 ? 'big' : '', e.hidden ? 'hidden' : ''].filter(Boolean).join(' ');
            ul.appendChild(h('li', { class: cls },
                h('span', { class: 'ic', 'aria-hidden': 'true' }, CHRON_ICON[e.kind] || '•'),
                h('span', { class: 'tx' }, tpart ? h('span', { class: 'tm' }, tpart) : null, e.text,
                    e.who && e.who.length ? h('span', { class: 'who' }, e.who.map(n => h('button', { class: 'rpgc-chip', style: 'cursor:pointer;background:none;color:inherit;font:inherit;font-size:11px', title: `Only ${n}: their timeline with you`, onclick: () => { state.chronWho = n; state.chronShow = 40; render(); } }, n))) : null),
                h('span', { class: 'act' }, status,
                    h('button', { class: 'rpgc-mini star', title: e.star ? 'Unstar' : 'Star: a key moment, always written', 'aria-label': e.star ? `Unstar: ${e.text}` : `Star: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'star', id: e.id }) }, e.star ? '★' : '☆'),
                    e.user && e.noteId ? h('button', { class: 'rpgc-mini', title: 'Delete your note', 'aria-label': `Delete your note: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'unnote', noteId: e.noteId }) }, '🗑')
                        : h('button', { class: 'rpgc-mini', title: e.hidden ? 'Show it again' : 'Hide it: never written to the Memory Cortex', 'aria-label': e.hidden ? `Show again: ${e.text}` : `Hide: ${e.text}`, onclick: () => send({ type: 'chronicle_edit', chatId: state.chatId, op: 'hide', id: e.id }) }, e.hidden ? '↺' : '✕'))));
        }
        if (list.length > limit) out.push(h('button', { class: 'rpgc-btn', onclick: () => { state.chronShow = limit + 60; render(); } }, `Show ${Math.min(60, list.length - limit)} more`));
        if (all.some(e => e.hidden)) out.push(h('label', { class: 'rpgc-row' }, (() => { const cb = h('input', { type: 'checkbox', 'aria-label': 'Show hidden entries' }); cb.checked = showHidden; cb.addEventListener('change', () => { state.chronHidden = cb.checked; render(); }); return cb; })(), h('span', { class: 'rpgc-note' }, `Show hidden (${all.filter(e => e.hidden).length})`)));
        // the Memory Cortex
        const c = D.cortex || {};
        const busy = !!c.busy || (state.status && state.status.kind === 'busy' && /Chronicle/.test(state.status.text || ''));
        const waiting = all.filter(e => !e.settled && e.goes && !e.hidden).length;
        out.push(h('div', { class: 'rpgc-chron-cortex' },
            h('div', null, h('b', null, 'Memory Cortex: '), c.on === true ? h('span', { class: 'on' }, 'on') : c.on === false ? h('span', { class: 'off' }, 'not available') : h('span', null, 'unknown'),
                ` · ${CHRON_MODE[c.mode] || ''}`),
            c.note ? h('p', { class: 'rpgc-note' }, c.note) : null,
            h('p', { class: 'rpgc-note' }, `${c.sent || 0} written${c.last ? `, last at ${chronTime(c.last)}` : ''}.${waiting ? ` ${waiting} wait${waiting === 1 ? 's' : ''} until you answer the latest reply.` : ''} ✓ written · ⏳ waits for your answer · • next write`),
            h('div', { class: 'rpgc-row' },
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => send({ type: 'chronicle_sync', chatId: state.chatId }) }, busy ? 'Writing…' : 'Write now'),
                h('button', { class: 'rpgc-btn', disabled: busy ? true : null, title: 'Use this after a Memory Cortex rebuild. The Cortex skips facts it already has, so nothing doubles.', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Write everything again?', message: 'Every entry goes to the Memory Cortex once more. Facts it already has are skipped, so nothing doubles. Useful after a Cortex rebuild.', confirmLabel: 'Write again' }) : { confirmed: true };
                    if (res?.confirmed) send({ type: 'chronicle_sync', chatId: state.chatId, again: true });
                } }, 'Write everything again'))));
        const sent = all.filter(e => e.sent).length;
        return section('chronicle', 'Chronicle', state.open, `${all.filter(e => !e.hidden).length}${sent ? ` · ${sent} in the Cortex` : ''}`, ...out);
    }

    function renderChronicleSettings() {
        const s = S();
        const C = () => (s.chronicle = isObj(s.chronicle) ? s.chronicle : {});
        const mode = h('select', { 'aria-label': 'Write to the Memory Cortex', onchange: (e) => { C().cortex = e.target.value; saveSettings(false); } },
            h('option', { value: 'off' }, 'Off — only when I press Write now'),
            h('option', { value: 'key' }, 'Only the biggest moments'),
            h('option', { value: 'most' }, 'Key moments, bonds, plot and milestones (recommended)'),
            h('option', { value: 'all' }, 'Everything, places too'));
        mode.value = ['off', 'key', 'most', 'all'].includes(C().cortex) ? C().cortex : 'most';
        return section('s-chronicle', 'Chronicle', closedByDefault('s-chronicle'), null,
            h('p', { class: 'rpgc-note' }, 'The story’s timeline, read from the chat: a new arc, a rank or level, a power gained, a death and the loop it ends, quests, the first time at a place, first meetings and how people come to feel about you, and the key moments the story flags. A swipe or an edit changes it with the chat.'),
            toggle('Chronicle', () => C().enabled !== false, v => { C().enabled = v; }),
            toggle('Ask the story for its key moments', () => C().moments !== false, v => { C().moments = v; }, 'A promise, a confession, a betrayal, a death, a secret learned. About 60 tokens of request in the side-panel block; most replies answer [].'),
            C().moments !== false ? toggle('\u2026 and milestones in other people\u2019s lives', () => C().milestones !== false, v => { C().milestones = v; }, 'A promotion, an oath, a loss, a new rank, joining a group: on screen or off. About 50 tokens more. They show in each person\u2019s History (2.9).') : null,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Write to the Memory Cortex'), mode),
            h('p', { class: 'rpgc-note' }, 'A reply is written once you answer it, so a swipe never leaves a wrong memory behind. Each entry becomes a fact on the people it is about (the place too, for a key moment), with an importance tag the Cortex keeps when it trims. Relationships become one "relationship" link per person toward you. Your own milestones go on you. A loop undone by Return by Death is written as undone. The Cortex only adds: what was written stays, even if you change the chat later — hide an entry before it is written to keep it out. Needs the Memory Cortex switched on in Lumiverse and the extension’s "Memories" permission.'),
            h('p', { class: 'rpgc-note' }, 'Without the Memory Cortex: {{rpgc_chronicle}} in a preset gives the key moments so far, one line each.'));
    }

    function renderChapter() {
        if (isObj(S()?.chapters) && S().chapters.enabled === false) return null;
        const cs = state.chapters || { list: [], knowledge: [], open: {} };
        const busy = !!cs.busy || (state.status && state.status.kind === 'busy' && /chapter summary/i.test(state.status.text || ''));
        const titleIn = h('input', { type: 'text', placeholder: 'Title (optional)', 'aria-label': 'Chapter title' });
        const out = [
            h('p', { class: 'rpgc-note' }, 'A chapter is a stretch of the story with a summary that rides along with every message, on top of the history \u2014 nothing is removed. End one where the story turns: a death and a rewind, the end of an arc, the end of a day.'),
            h('div', { class: 'rpgc-row' }, titleIn,
                h('button', { class: 'rpgc-btn primary', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_end', chatId: state.chatId, title: titleIn.value.trim(), summarize: true }) }, busy ? 'Summarising\u2026' : 'End chapter and summarise'),
                h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_end', chatId: state.chatId, title: titleIn.value.trim(), summarize: false }) }, 'End chapter'))
        ];
        const openNow = cs.list.filter(c => c.status === 'open');
        if (openNow.length) out.push(h('p', { class: 'rpgc-note' }, 'Now: ' + openNow.map(c => `${c.title}${c.start && c.start.time ? ` since ${c.start.time}` : ''}`).join(' \u00B7 ')));
        for (const c of cs.list.slice().reverse()) {
            const editing = state.chEdit === c.id;
            const ta = editing ? h('textarea', { rows: '6', 'aria-label': `Summary of ${c.title}`, value: c.summary }) : null;
            const tIn = editing ? h('input', { type: 'text', value: c.title, 'aria-label': 'Chapter title' }) : null;
            const det = h('details', { class: 'rpgc-chapter ' + c.kind + (c.summarized ? '' : ' unsummarised') },
                h('summary', null, h('span', { class: 'rpgc-chip kind' }, CH_KIND[c.kind] || 'Chapter'), h('b', null, c.title),
                    h('span', { class: 'rpgc-note' }, ` ${chapterSpan(c)}`), c.status === 'open' ? h('span', { class: 'rpgc-chip here' }, 'open') : null,
                    !c.summarized ? h('span', { class: 'rpgc-chip' }, 'not summarised') : c.inPrompt ? null : h('span', { class: 'rpgc-chip' }, 'left out')),
                editing ? h('div', { class: 'rpgc-set' }, tIn, ta, h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn primary', onclick: () => { send({ type: 'chapter_edit', chatId: state.chatId, id: c.id, title: tIn.value, summary: ta.value }); state.chEdit = null; } }, 'Save'),
                    h('button', { class: 'rpgc-btn', onclick: () => { state.chEdit = null; render(); } }, 'Cancel')))
                    : c.summary ? h('p', { class: 'rpgc-chsum' }, c.summary) : h('p', { class: 'rpgc-note' }, 'No summary yet.'),
                !editing && c.ended ? h('p', { class: 'rpgc-note' }, `It ended: ${c.ended}`) : null,
                !editing && c.learned && c.learned.length ? h('div', { class: 'rpgc-set' }, h('h4', null, 'What you uncovered'), h('ul', null, c.learned.map(l => h('li', null, l)))) : null,
                !editing ? h('div', { class: 'rpgc-row' },
                    h('button', { class: 'rpgc-btn', disabled: busy ? true : null, onclick: () => send({ type: 'chapter_summarize', chatId: state.chatId, id: c.id }) }, c.summarized ? 'Summarise again' : 'Summarise'),
                    h('button', { class: 'rpgc-btn', onclick: () => { state.chEdit = c.id; state.open['ch-' + c.id] = true; render(); } }, 'Edit'),
                    c.summarized ? h('label', { class: 'rpgc-row' }, (() => { const cb = h('input', { type: 'checkbox', 'aria-label': 'Send with every message' }); cb.checked = c.inPrompt; cb.addEventListener('change', () => send({ type: 'chapter_edit', chatId: state.chatId, id: c.id, inPrompt: cb.checked })); return cb; })(), h('span', null, 'Send with every message')) : null,
                    h('button', { class: 'rpgc-btn danger', onclick: async () => {
                        const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Delete this chapter?', message: `"${c.title}" and its summary are removed. The messages stay.`, variant: 'danger', confirmLabel: 'Delete' }) : { confirmed: true };
                        if (res?.confirmed) send({ type: 'chapter_delete', chatId: state.chatId, id: c.id });
                    } }, 'Delete')) : null);
            det.open = !!state.open['ch-' + c.id] || editing;
            det.dataset.openKey = 'ch-' + c.id; det.addEventListener('toggle', () => { state.open['ch-' + c.id] = det.open; });
            out.push(det);
        }
        if (cs.knowledge && cs.knowledge.length) {
            const kIn = h('input', { type: 'text', placeholder: 'Add something you know', 'aria-label': 'Add something you know' });
            kIn.addEventListener('keydown', (e) => { if (e.key === 'Enter' && kIn.value.trim()) { send({ type: 'knowledge_edit', chatId: state.chatId, op: 'add', text: kIn.value.trim() }); kIn.value = ''; } });
            out.push(h('div', { class: 'rpgc-set rpgc-knowledge' }, h('h4', null, 'What you know from earlier loops'),
                h('p', { class: 'rpgc-note' }, 'Only you remember these. They ride along with every message, so the story knows what you know.'),
                h('ul', null, cs.knowledge.map(k => h('li', null, k.loop ? h('span', { class: 'rpgc-chip kind' }, `Loop ${k.loop}`) : null, ' ', k.text,
                    h('button', { class: 'rpgc-mini', 'aria-label': `Forget: ${k.text}`, onclick: () => send({ type: 'knowledge_edit', chatId: state.chatId, op: 'remove', text: k.text }) }, '\u2715')))),
                kIn));
        }
        const cp = state.checkpoint;
        if (cp) out.push(h('div', { class: 'rpgc-set' }, h('p', { class: 'rpgc-note' }, `From an older version: ${cp.hiddenCount} message${cp.hiddenCount === 1 ? ' is' : 's are'} hidden from the prompt before #${cp.index}.`),
            h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'clear_checkpoint', chatId: state.chatId }) }, 'Show them again')));
        const n = cs.list.filter(c => c.summarized && c.inPrompt).length;
        return section('chapter', 'Chapters', state.open, cs.list.length ? `${cs.list.length}${n ? ` \u00B7 ${n} in the prompt` : ''}` : null, ...out);
    }

    function renderChapterSettings() {
        const s = S();
        const C = () => (s.chapters = isObj(s.chapters) ? s.chapters : {});
        const len = h('select', { 'aria-label': 'Summary length', onchange: (e) => { C().length = e.target.value; saveSettings(false); } },
            h('option', { value: 'short' }, 'Short \u2014 a few sentences'), h('option', { value: 'medium' }, 'Medium \u2014 a paragraph or two'), h('option', { value: 'long' }, 'Long \u2014 several paragraphs'));
        len.value = C().length || 'medium';
        return section('s-chapters', 'Chapters', closedByDefault('s-chapters'), null,
            h('p', { class: 'rpgc-note' }, 'Memory at the scale the story is cut at. You can always end a chapter by hand. The kinds below are found by the extension from the HUD, so they work in HMS chats.'),
            toggle('Loops (Return by Death)', () => !!C().loops, v => { C().loops = v; }, 'A new loop starts when the HUD clock goes back. Its summary is sent as what it is \u2014 undone, remembered only by you \u2014 and what you uncovered collects into one list.'),
            toggle('Arcs', () => !!C().arcs, v => { C().arcs = v; }, 'A new chapter each time the Arc line changes.'),
            toggle('Days', () => !!C().days, v => { C().days = v; }, 'A new chapter each in-story day.'),
            toggle('Months', () => !!C().months, v => { C().months = v; }, 'A new chapter each month of the calendar \u2014 the school year in Classroom of the Elite.'),
            toggle('Summarise a chapter as soon as it closes', () => !!C().autoSummarize, v => { C().autoSummarize = v; }, 'One model call per closed chapter. Off: press Summarise in the Chapters card.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Summary length'), len),
            toggle('Send summaries with every message', () => C().inPrompt !== false, v => { C().inPrompt = v; }, 'On top of the history; nothing is removed from the prompt.'),
            toggle('Give them to fights too', () => C().inFights !== false, v => { C().inFights = v; }, 'Fight setups read the story so far, so a fight remembers who these people are to you.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Budget (chars)'),
                h('input', { type: 'number', min: '500', max: '40000', step: '500', value: String(C().budget ?? 4000), 'aria-label': 'Chapter budget', onchange: (e) => { C().budget = Math.max(500, parseInt(e.target.value, 10) || 4000); saveSettings(); } })),
            h('p', { class: 'rpgc-note' }, 'When the summaries run past the budget, the newest chapters are kept.'));
    }

    // ─────────── 1.9.2: D&D, Quests settings, pop-out styling ───────────

    const DND_ABIL_LIST = [['str', 'STR', 'Strength'], ['dex', 'DEX', 'Dexterity'], ['con', 'CON', 'Constitution'], ['int', 'INT', 'Intelligence'], ['wis', 'WIS', 'Wisdom'], ['cha', 'CHA', 'Charisma']];
    const DND_SKILL_LIST = [['acrobatics', 'Acrobatics', 'dex'], ['animal', 'Animal Handling', 'wis'], ['arcana', 'Arcana', 'int'], ['athletics', 'Athletics', 'str'], ['deception', 'Deception', 'cha'], ['history', 'History', 'int'],
        ['insight', 'Insight', 'wis'], ['intimidation', 'Intimidation', 'cha'], ['investigation', 'Investigation', 'int'], ['medicine', 'Medicine', 'wis'], ['nature', 'Nature', 'int'], ['perception', 'Perception', 'wis'],
        ['performance', 'Performance', 'cha'], ['persuasion', 'Persuasion', 'cha'], ['religion', 'Religion', 'int'], ['sleight', 'Sleight of Hand', 'dex'], ['stealth', 'Stealth', 'dex'], ['survival', 'Survival', 'wis']];
    const signed = (n) => (n >= 0 ? '+' : '\u2212') + Math.abs(n);
    function hudSheetNow() { return state.hudSheet || (state.world && state.world.dndSheet) || null; }
    function dndOn() { const s = S(); return !!s && (!isObj(s.dnd) || s.dnd.enabled !== false); }
    function dndSheet() {
        const hs = hudSheetNow();
        const d0 = state.dnd;
        if (hs && (!isObj(S()?.dnd) || S().dnd.useHud !== false)) {
            // STATE IS GOD: the bot's own sheet \u2014 level, proficiency, saves and skills as it prints them.
            const base = d0 && isObj(d0.scores) ? d0 : { scores: {}, saves: {}, skills: {}, level: 1 };
            const saves = {}, skills = {};
            for (const [a] of DND_ABIL_LIST) saves[a] = hs.saves.includes(a);
            for (const [k, name] of DND_SKILL_LIST) skills[k] = hs.skills[name.toLowerCase()] || 0;
            return { ...base, level: hs.level || base.level, saves, skills, hud: true, pb: hs.pb };
        }
        const d = d0;
        if (d && isObj(d.scores)) return d;
        const s = S() || {};
        const scores = {}, saves = {}, skills = {};
        for (const [a] of DND_ABIL_LIST) { scores[a] = Number(s.classicStats?.[a]) || 10; saves[a] = false; }
        for (const [k] of DND_SKILL_LIST) skills[k] = 0;
        return { scores, saves, skills, level: Number(s.level) || 1 };
    }
    const dndProf = (level) => { const hs = hudSheetNow(); if (hs && Number.isFinite(hs.pb) && (!isObj(S()?.dnd) || S().dnd.useHud !== false)) return hs.pb; return 2 + Math.floor((Math.max(1, Math.min(20, level)) - 1) / 4); };
    const dndMod = (score) => Math.floor((Number(score) - 10) / 2);

    /** STATE IS GOD: ability scores (or modifiers) the bot's HUD prints win over the sheet. */
    function dndHudAbils() {
        const s = S();
        if (!hmsOn() || (isObj(s?.dnd) && s.dnd.useHud === false)) return {};
        const hs = hudSheetNow();
        if (hs && hs.mods && Object.keys(hs.mods).length) {
            const out = {};
            for (const [id, v] of Object.entries(hs.mods)) out[id] = { mod: v, text: (v >= 0 ? '+' : '') + v };
            return out;
        }
        const sys = sysOf();
        const out = {};
        for (const g of (sys && sys.attributes) || []) {
            for (const it of g.items || []) {
                const name = String(it.name || '').toLowerCase();
                const hit = DND_ABIL_LIST.find(([id, short, long]) => name === short.toLowerCase() || name === long.toLowerCase() || name === id);
                if (!hit || out[hit[0]]) continue;
                const v = String(it.value || '').trim();
                if (/^[+-]\d+$/.test(v)) out[hit[0]] = { mod: Number(v), text: v };
                else if (/^\d+$/.test(v)) out[hit[0]] = { score: Number(v), mod: dndMod(Number(v)), text: v };
            }
        }
        return out;
    }
    function dndAbilMod(sheet, hud, id) { return hud[id] ? hud[id].mod : dndMod(sheet.scores[id]); }

    function dndSave(mut) {
        const sheet = JSON.parse(JSON.stringify(dndSheet()));
        mut(sheet);
        state.dnd = sheet;
        send({ type: 'dnd_set', chatId: state.chatId, sheet });
        render();
    }

    state.dndRoll = state.dndRoll || { what: 'skill:perception', adv: 'none', bonus: 0, dc: '', count: 1, sides: 20 };
    function dndDoRoll() {
        const s = S();
        const r = state.dndRoll;
        const sheet = dndSheet();
        const hud = dndHudAbils();
        const prof = dndProf(sheet.level);
        const bonus = Number(r.bonus) || 0;
        const dc = Number(r.dc) > 0 ? Number(r.dc) : null;
        const d = (n) => Math.floor(Math.random() * n) + 1;
        let roll;
        if (r.what === 'dice') {
            const n = Math.max(1, Math.min(100, Number(r.count) || 1)), sd = Math.max(2, Math.min(1000, Number(r.sides) || 20));
            const rolls = Array.from({ length: n }, () => d(sd));
            const sum = rolls.reduce((a, b) => a + b, 0);
            roll = { formula: `${n}d${sd}`, rolls, total: sum + bonus, label: `${n}d${sd}`, breakdown: `${n}d${sd} (${rolls.join(' + ')})${bonus ? ` ${signed(bonus)} bonus` : ''}` };
        } else {
            const [kind, id] = r.what.split(':');
            const rolls = r.adv === 'none' ? [d(20)] : [d(20), d(20)];
            const kept = r.adv === 'adv' ? Math.max(...rolls) : r.adv === 'dis' ? Math.min(...rolls) : rolls[0];
            let abil, label, profPart = 0;
            if (kind === 'skill') {
                const sk = DND_SKILL_LIST.find(x => x[0] === id) || DND_SKILL_LIST[11];
                abil = sk[2]; label = `a ${sk[1]} check (${abil.toUpperCase()})`;
                profPart = (sheet.skills[sk[0]] || 0) * prof;
            } else if (kind === 'save') {
                abil = id; label = `a ${id.toUpperCase()} saving throw`;
                profPart = sheet.saves[id] ? prof : 0;
            } else if (kind === 'init') { abil = 'dex'; label = 'initiative'; }
            else { abil = id; label = `a ${id.toUpperCase()} check`; }
            const mod = dndAbilMod(sheet, hud, abil);
            const parts = [`d20 ${kept}${rolls.length > 1 ? ` (${rolls.join(' / ')}, ${r.adv === 'adv' ? 'advantage' : 'disadvantage'})` : ''}${kept === 20 ? ', natural 20' : kept === 1 ? ', natural 1' : ''}`, `${abil.toUpperCase()} ${signed(mod)}${hud[abil] ? ' (HUD)' : ''}`];
            if (profPart) parts.push(`${profPart === 2 * prof ? 'expertise' : 'proficiency'} ${signed(profPart)}`);
            if (bonus) parts.push(`bonus ${signed(bonus)}`);
            roll = { formula: '1d20', rolls, total: kept + mod + profPart + bonus, label, breakdown: parts.join(' ') };
        }
        if (dc) { roll.dc = dc; roll.outcome = roll.total >= dc ? 'success' : 'failure'; }
        s.lastDiceRoll = { ...roll, chatId: state.chatId, timestamp: Date.now() };
        saveSettings();
    }

    function dndRoller() {
        const s = S();
        if (s.showDiceDisplay === false) return null;
        const r = state.dndRoll;
        const what = h('select', { 'aria-label': 'What to roll', onchange: (e) => { r.what = e.target.value; render(); } },
            h('optgroup', { label: 'Skills' }, DND_SKILL_LIST.map(([id, name, ab]) => h('option', { value: `skill:${id}` }, `${name} (${ab.toUpperCase()})`))),
            h('optgroup', { label: 'Ability checks' }, DND_ABIL_LIST.map(([id, short, long]) => h('option', { value: `check:${id}` }, `${long} check`))),
            h('optgroup', { label: 'Saving throws' }, DND_ABIL_LIST.map(([id, short, long]) => h('option', { value: `save:${id}` }, `${long} save`))),
            h('optgroup', { label: 'Other' }, h('option', { value: 'init:dex' }, 'Initiative'), h('option', { value: 'dice' }, 'Plain dice')));
        what.value = r.what;
        const adv = h('select', { 'aria-label': 'Advantage', onchange: (e) => { r.adv = e.target.value; } },
            h('option', { value: 'none' }, 'Normal'), h('option', { value: 'adv' }, 'Advantage'), h('option', { value: 'dis' }, 'Disadvantage'));
        adv.value = r.adv;
        const num = (label, key, attrs) => h('label', { class: 'rpgc-dnd-num' }, h('span', null, label),
            h('input', { type: 'number', value: String(r[key] ?? ''), 'aria-label': label, ...attrs, onchange: (e) => { r[key] = e.target.value; } }));
        const roll = s.lastDiceRoll && (!s.lastDiceRoll.chatId || s.lastDiceRoll.chatId === state.chatId) ? s.lastDiceRoll : null;
        return h('div', { class: 'rpgc-dnd-roller' },
            h('div', { class: 'rpgc-dnd-roll' },
                what,
                r.what === 'dice' ? h('span', { class: 'rpgc-dice' },
                    h('input', { type: 'number', min: '1', max: '100', value: String(r.count), 'aria-label': 'Number of dice', onchange: (e) => { r.count = e.target.value; } }), 'd',
                    h('input', { type: 'number', min: '2', max: '1000', value: String(r.sides), 'aria-label': 'Sides per die', onchange: (e) => { r.sides = e.target.value; } })) : adv,
                num('Bonus', 'bonus', { step: '1' }), num('DC', 'dc', { min: '0', placeholder: '\u2014' }),
                h('button', { class: 'rpgc-btn primary', onclick: dndDoRoll }, 'Roll')),
            roll ? h('div', { class: 'rpgc-dnd-result', role: 'status' },
                h('b', null, String(roll.total)),
                h('span', null, roll.label ? ` ${roll.label}: ${roll.breakdown}` : ` ${roll.formula}`),
                roll.dc ? h('span', { class: 'rpgc-chip ' + (roll.outcome === 'success' ? 'ok' : 'hot') }, `DC ${roll.dc} \u2014 ${roll.outcome}`) : null,
                h('button', { class: 'rpgc-mini', 'aria-label': 'Clear roll', onclick: () => { s.lastDiceRoll = null; saveSettings(); } }, '\u2715')) : null,
            h('p', { class: 'rpgc-note' }, roll ? 'This roll goes into your next reply.' : 'Your roll goes into your next reply, with its whole sum.'));
    }

    function renderDnd() {
        if (!dndOn() || !state.chatId) return null;
        const sheet = dndSheet();
        const hud = dndHudAbils();
        const prof = dndProf(sheet.level);
        const abils = h('div', { class: 'rpgc-dnd-abils' }, DND_ABIL_LIST.map(([id, short, long]) => {
            const fromHud = hud[id];
            const mod = dndAbilMod(sheet, hud, id);
            const save = h('input', { type: 'checkbox', 'aria-label': `Proficient in ${long} saves` });
            save.checked = !!sheet.saves[id];
            if (sheet.hud) save.disabled = true;
            save.addEventListener('change', () => dndSave(x => { x.saves[id] = save.checked; }));
            return h('div', { class: 'rpgc-dnd-abil' + (fromHud ? ' hud' : ''), title: fromHud ? `From the WORLD STATE HUD: ${fromHud.text}` : long },
                h('span', { class: 'ab' }, short, fromHud ? h('span', { class: 'rpgc-imm-src' }, 'HUD') : null),
                h('span', { class: 'mod' }, signed(mod)),
                fromHud ? h('span', { class: 'score' }, fromHud.score ? String(fromHud.score) : 'mod') : h('span', { class: 'score' },
                    h('button', { class: 'rpgc-mini', 'aria-label': `Lower ${long}`, onclick: () => dndSave(x => { x.scores[id] = Math.max(1, x.scores[id] - 1); }) }, '\u2212'),
                    S()?.dnd?.uncapped ? h('input', { type: 'number', class: 'rpgc-dnd-num', min: '1', max: '999', value: String(sheet.scores[id]), 'aria-label': long, onchange: (e) => { const v = Math.round(Number(e.target.value)); if (Number.isFinite(v)) dndSave(x => { x.scores[id] = Math.max(1, Math.min(999, v)); }); } })
                        : h('span', null, String(sheet.scores[id])),
                    h('button', { class: 'rpgc-mini', 'aria-label': `Raise ${long}`, onclick: () => dndSave(x => { x.scores[id] = Math.min(S()?.dnd?.uncapped ? 999 : 30, x.scores[id] + 1); }) }, '+')),
                h('label', null, save, 'Save ' + signed(mod + (sheet.saves[id] ? prof : 0))));
        }));
        const PROF_LABEL = ['\u2014', 'Prof', 'Expert'];
        const skills = h('div', { class: 'rpgc-dnd-skills' }, DND_SKILL_LIST.map(([id, name, ab]) => {
            const p = sheet.skills[id] || 0;
            const total = dndAbilMod(sheet, hud, ab) + p * prof;
            return h('div', { class: 'rpgc-dnd-skill' },
                h('span', { class: 'md' }, signed(total)),
                h('span', { class: 'nm' }, name, h('span', { class: 'ab' }, ` ${ab.toUpperCase()}`)),
                h('button', { class: 'rpgc-mini p' + p, disabled: sheet.hud ? true : null, 'aria-label': `${name}: ${['not proficient', 'proficient', 'expertise'][p]}`, title: sheet.hud ? 'From the HUD\u2019s D&D sheet' : 'Not proficient \u2192 proficient \u2192 expertise',
                    onclick: () => dndSave(x => { x.skills[id] = ((x.skills[id] || 0) + 1) % 3; }) }, PROF_LABEL[p]));
        }));
        const passive = 10 + dndAbilMod(sheet, hud, 'wis') + (sheet.skills.perception || 0) * prof;
        return section('dnd', 'D&D', state.open, `Lv ${sheet.level} \u00B7 prof ${signed(prof)}`,
            dndRoller(),
            h('div', { class: 'rpgc-row' },
                h('span', { class: 'lbl' }, 'Level'),
                h('button', { class: 'rpgc-mini', 'aria-label': 'Lower level', disabled: sheet.hud ? true : null, onclick: () => dndSave(x => { x.level = Math.max(1, x.level - 1); }) }, '\u2212'),
                h('b', null, String(sheet.level)),
                h('button', { class: 'rpgc-mini', 'aria-label': 'Raise level', disabled: sheet.hud ? true : null, onclick: () => dndSave(x => { x.level = Math.min(30, x.level + 1); }) }, '+'),
                h('span', { class: 'rpgc-note' }, `Proficiency ${signed(prof)} \u00B7 Passive Perception ${passive}`)),
            abils,
            (() => { const d = h('details', { class: 'rpgc-dnd-skillbox' }, h('summary', null, 'Skills'), skills); d.open = !!state.open['dnd-skills']; d.dataset.openKey = 'dnd-skills'; d.addEventListener('toggle', () => { state.open['dnd-skills'] = d.open; }); return d; })(),
            sheet.hud ? h('p', { class: 'rpgc-note' }, `Read from the HUD\u2019s D&D character sheet${hudSheetNow().klass ? ` (${hudSheetNow().klass})` : ''}: level, proficiency, saves and skills are the bot\u2019s own.`)
                : Object.keys(hud).length ? h('p', { class: 'rpgc-note' }, 'Scores marked HUD come from the WORLD STATE and cannot be changed here.') : null);
    }

    function renderDndSettings() {
        const s = S();
        const D = () => (s.dnd = isObj(s.dnd) ? s.dnd : {});
        const es = s.encounterSettings;
        if (!isObj(es.dnd)) es.dnd = { deathSaves: true, crits: true, massiveDamage: true, obedienceRolls: true };
        const on = D().enabled !== false;
        const dt = (label, key, note) => toggle(label, () => es.dnd[key] !== false, v => { es.dnd[key] = v; }, note);
        return section('s-dnd', 'D&D', closedByDefault('s-dnd'), on ? 'on' : 'off',
            h('p', { class: 'rpgc-note' }, 'Everything D&D in one place: your sheet (ability scores, saving throws, the 18 skills, proficiency from your level), the roller, and turn-based fights. Switch it off and all of it leaves the panel \u2014 the Turn-based fight button too.'),
            toggle('D&D', () => D().enabled !== false, v => { D().enabled = v; }, 'Off hides the D&D card, the roller and Turn-based fights.'),
            on ? toggle('The roller', () => s.showDiceDisplay !== false, v => { s.showDiceDisplay = v; }, 'Checks, saves, skills and initiative with your modifiers, advantage or disadvantage and a DC. The whole sum goes into your next reply.') : null,
            on ? toggle('Use the HUD\u2019s scores when it prints them', () => D().useHud !== false, v => { D().useHud = v; }, 'STATE IS GOD: where the bot\u2019s HUD prints STR, DEX and the rest, the sheet reads them instead of your own numbers.') : null,
            on ? h('p', { class: 'rpgc-note' }, 'Each chat keeps its own sheet. A chat that has none starts from the stats you set before.') : null,
            on ? h('h4', null, 'Turn-based fights') : null,
            on ? h('p', { class: 'rpgc-note' }, 'Initiative order, attack rolls against AC, damage dice, saving throws, spell slots and death saves. Every die is rolled by the extension and HP is applied here; the model narrates the numbers and plans what the other side does next.') : null,
            on ? dt('Death saving throws', 'deathSaves', 'Party members at 0 HP roll each turn: three successes stabilise, three failures kill.') : null,
            on ? dt('Critical hits', 'crits', 'A natural 20 doubles the damage dice.') : null,
            on ? dt('Massive damage', 'massiveDamage', 'Damage past 0 HP equal to max HP kills outright.') : null,
            on ? dt('Companions roll to obey', 'obedienceRolls', 'An irritated or distrustful companion may do it their own way.') : null,
            on ? toggle('Companions may question orders', () => es.companionsMayRefuse !== false, v => { es.companionsMayRefuse = v; }, 'An order is a request: a companion answers it as their card and current mood say.') : null,
            on ? toggle('Let the model think each combat turn', () => !!es.combatThinking, v => { es.combatThinking = v; }, 'Sharper tactics, slower turns.') : null,
            on ? h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Messages of history'),
                h('input', { type: 'number', min: '1', max: '50', value: String(es.historyDepth || 8), 'aria-label': 'Messages of chat history a fight reads', onchange: (e) => { es.historyDepth = Math.max(1, parseInt(e.target.value, 10) || 8); saveSettings(); } })) : null,
            ...(on ? narrativeRows('Combat narration', es.combatNarrative) : []),
            ...(on ? narrativeRows('Aftermath narration', es.summaryNarrative) : []),
            on ? promptArea('Combat prose rules ({userName} works here)', 'customCombatNarrativePrompt', 'Built-in prose rules') : null);
    }

    function renderQuestSettings() {
        const s = S();
        if (!isObj(s.hmsSystems)) s.hmsSystems = {};
        const Q = () => (s.hmsSystems.quests = isObj(s.hmsSystems.quests) ? s.hmsSystems.quests : {});
        return section('s-quests', 'Quests', closedByDefault('s-quests'), s.showQuests === false ? 'off' : null,
            h('p', { class: 'rpgc-note' }, 'Everything about quests in one place. In HMS chats the Quests line on the HUD decides which quests exist; the extension reads it, keeps the details and the journal, and never invents a quest.'),
            toggle('Show the Quests panel', () => s.showQuests !== false, v => { s.showQuests = v; }, 'In HMS chats and classic chats alike.'),
            toggle('Ask for quest details', () => Q().details !== false, v => { Q().details = v; }, 'Objective, progress, giver, where, deadline and reward, carried in the side-panel block. HMS chats.'),
            toggle('Track the plot', () => Q().plot !== false, v => { Q().plot = v; }, 'Where the main story stands, and its open threads \u2014 moved or resolved as the story goes. Kept apart from quests.'),
            toggle('Track objectives', () => Q().objectives !== false, v => { Q().objectives = v; }, 'What you are trying to do right now, as the story sets it. You can add your own; those stay with you and are not sent.'),
            toggle('Keep a journal of quests that left the HUD', () => Q().journal !== false, v => { Q().journal = v; }, 'Finished, failed and dropped quests stay readable; a quest that vanishes while active is flagged.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Quest line labels'),
                h('input', { type: 'text', value: Q().labels || '', 'aria-label': 'Quest line labels', onchange: (e) => { Q().labels = e.target.value; saveSettings(false); } })),
            h('div', { class: 'rpgc-set' }, h('h4', null, 'Quest states'),
                h('p', { class: 'rpgc-note' }, 'class: words. Classes active, closing, done, ended, failed, hidden colour the badges; a quest leaving the HUD while active or closing is flagged.'),
                h('textarea', { rows: '4', value: Q().states || '', 'aria-label': 'Quest states', onchange: (e) => { Q().states = e.target.value; saveSettings(false); } })));
    }

    // ── the pop-out window wears Lumiverse's own look: its styles, fonts, variables and theme ──
    function syncPopoutLook(win) {
        if (!win || win.closed) return;
        const pd = win.document;
        try {
            if (!pd.getElementById('rpgc-host-base')) {
                const base = pd.createElement('base'); base.id = 'rpgc-host-base'; base.href = ((typeof window !== 'undefined' && window.location && window.location.origin) || '') + '/';
                pd.head.prepend(base);
                const sheets = [];
                for (const n of document.querySelectorAll('link[rel~="stylesheet"], style')) {
                    if (n.tagName === 'LINK') { const l = pd.createElement('link'); l.rel = 'stylesheet'; l.href = n.href; sheets.push(l); continue; }
                    let css = n.textContent || '';
                    if (!css && n.sheet) { try { css = [...n.sheet.cssRules].map(r => r.cssText).join('\n'); } catch { css = ''; } }
                    if (css) { const st = pd.createElement('style'); st.textContent = css; sheets.push(st); }
                }
                for (const sh of (document.adoptedStyleSheets || [])) {
                    try { const st = pd.createElement('style'); st.textContent = [...sh.cssRules].map(r => r.cssText).join('\n'); sheets.push(st); } catch { /* cross-origin */ }
                }
                const own = pd.createElement('style'); own.id = 'rpgc-own'; own.textContent = CSS;
                for (const sh of sheets) pd.head.appendChild(sh);
                pd.head.appendChild(own);   // ours last, so the panel's own rules win
            }
            const src = document.documentElement, dst = pd.documentElement;
            for (const a of [...src.attributes]) if (a.name === 'class' || a.name === 'style' || a.name.startsWith('data-')) dst.setAttribute(a.name, a.value);
            if (document.body) pd.body.className = document.body.className;
            const cs = getComputedStyle(src);
            let vars = '';
            for (let i = 0; i < cs.length; i++) { const p = cs[i]; if (p.startsWith('--')) vars += `${p}:${cs.getPropertyValue(p)};`; }
            const bs = document.body ? getComputedStyle(document.body) : null;
            let v = pd.getElementById('rpgc-host-vars');
            if (!v) { v = pd.createElement('style'); v.id = 'rpgc-host-vars'; pd.head.appendChild(v); }
            v.textContent = `:root{${vars}color-scheme:${cs.colorScheme || 'normal'};}
html,body{height:100%!important;margin:0;overflow:hidden!important;}
body{background:${bs ? bs.backgroundColor : '#111'};color:${bs ? bs.color : '#ddd'};font-family:${bs ? bs.fontFamily : 'system-ui, sans-serif'};font-size:${bs ? bs.fontSize : '14px'};}
#rpgc-pop-scroll{position:fixed!important;inset:0!important;zoom:1!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-y;outline:none;}
#rpgc-pop-scroll > .rpgc{max-width:860px;margin:0 auto;zoom:var(--lumiverse-ui-scale, 1);}`;
        } catch (e) { state.status = { kind: 'warning', text: `The pop-out window could not copy Lumiverse\u2019s look: ${e?.message || e}` }; }
    }

    // ─────────── 1.9: You, Magic, Modules, bug report, mini panel ───────────

    function youOf() { return (state.hms && state.hms.you) || null; }
    function magicOf() { return (state.hms && state.hms.magic) || null; }
    const LEVEL_WORDS = ['none', 'slight', 'moderate', 'high', 'extreme'];

    function renderYou() {
        const y = youOf();
        const c = sysCfg().you || {};
        const vc = sysCfg().vitals || {};
        const sys = sysOf();
        const showYou = !!y && c.enabled !== false;
        const showVitals = !!sys && vc.enabled !== false;
        if (!showYou && !showVitals) return null;
        const out = [];
        if (showYou) {
            const top = h('div', { class: 'rpgc-you-head' },
                y.mood ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Mood: '), y.mood) : null,
                y.stress !== null && y.stress !== undefined ? h('span', { class: 'rpgc-chip' + (y.stress >= 3 ? ' hot' : '') }, h('em', null, 'Stress: '), LEVEL_WORDS[y.stress]) : null,
                y.balance ? h('span', { class: 'rpgc-chip' }, h('em', null, y.balance.label + ': '), y.balance.value) : null);
            if (top.childNodes.length) out.push(top);
        }
        // The body: the HUD's pools with what the last reply changed, then its meters. One place, not two.
        if (showVitals) {
            for (const v of sys.vitals) {
                const d = v.delta;
                out.push(h('div', { class: 'rpgc-vital ' + v.level },
                    h('div', { class: 'head' },
                        h('span', { class: 'lbl' }, v.label),
                        h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`),
                        d ? h('span', { class: 'delta ' + (d < 0 ? 'down' : 'up'), title: 'Change since the last reply' }, (d > 0 ? '+' : '\u2212') + fmtNum(Math.abs(d))) : null),
                    levelBar(v.pct, v.level)));
            }
            for (const m of sys.meters) {
                out.push(h('div', { class: 'rpgc-vital ' + m.level },
                    h('div', { class: 'head' }, h('span', { class: 'lbl' }, m.label), h('span', { class: 'num' }, `${fmtNum(m.pct)}%`), m.stage ? h('span', { class: 'stage' }, m.stage) : null),
                    levelBar(m.pct, m.level)));
            }
        } else if (showYou) {
            for (const v of y.vitals || []) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`)), levelBar(v.pct, v.level)));
        }
        let x = {};
        if (showYou) {
            if (y.sanity !== null && y.sanity !== undefined) out.push(h('div', { class: 'rpgc-vital ' + (y.sanity <= 15 ? 'critical' : y.sanity <= 40 ? 'low' : 'ok') }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, 'Sanity'), h('span', { class: 'num' }, `${y.sanity} / 100`)), levelBar(y.sanity, y.sanity <= 15 ? 'critical' : y.sanity <= 40 ? 'low' : 'ok')));
            x = y.xp || {};
            if (x.mode === 'hud' || x.total || x.level) {
                const lv = x.level || x.derivedLevel;
                const span = x.mode === 'hud' ? x.max : (x.nextAt ? x.nextAt - (x.prevAt || 0) : null);
                const into = x.mode === 'hud' ? x.total : x.total - (x.prevAt || 0);
                out.push(h('div', { class: 'rpgc-vital' + (x.levelUp ? ' levelup' : '') },
                    h('div', { class: 'head' }, h('span', { class: 'lbl' }, lv ? `Level ${lv}` : 'Experience'), h('span', { class: 'num' }, span ? `${fmtNum(into)} / ${fmtNum(span)} XP` : `${fmtNum(x.total)} XP`),
                        x.levelUp ? h('span', { class: 'rpgc-chip levelup' }, 'level-up ready') : null),
                    span ? levelBar(Math.max(0, Math.min(100, into / span * 100)), 'ok') : null,
                    x.lastGain ? h('p', { class: 'rpgc-note' }, `Last: +${x.lastGain.xp}${x.lastGain.why ? ' \u2014 ' + x.lastGain.why : ''}`) : null,
                    x.mode === 'tracked' ? h('div', { class: 'rpgc-row' }, h('span', { class: 'rpgc-note' }, 'Adjust:'),
                        [-100, -10, 10, 100].map(dd => h('button', { class: 'rpgc-mini', 'aria-label': `${dd > 0 ? 'Add' : 'Remove'} ${Math.abs(dd)} XP`, onclick: () => send({ type: 'xp_adjust', chatId: state.chatId, delta: dd }) }, (dd > 0 ? '+' : '') + dd))) : null));
            }
        }
        // Wounds and conditions have their own card; repeat them here only when that card is off.
        const bc = sysCfg().body || {};
        if (sys && bc.enabled === false) {
            const conds = (sys.conditions || []).map(cd => cd.stage ? `${cd.name} (${cd.stage})` : cd.name);
            const wounds = (sys.wounds || []).map(w => w.name + (w.tag ? ` \u2014 ${w.tag}` : ''));
            if (conds.length || wounds.length) out.push(h('p', { class: 'rpgc-note' }, [...wounds, ...conds].join(' \u00B7 ')));
        }
        if (showVitals) for (const n of sys.notes) out.push(h('p', { class: 'rpgc-note' }, n));
        if (showYou && y.equipment) out.push(h('p', { class: 'rpgc-note' }, y.equipment));
        if (showYou) out.push(...renderCarried(y));
        if (!out.length) return null;
        const worst = showVitals ? sys.vitals.find(v => v.health) : null;
        return section('you', 'You', state.open, x.levelUp ? 'level-up ready' : ((showYou && y.mood) || (worst ? `${worst.label} ${Math.round(worst.pct)}%` : null)), ...out);
    }

    // Where everyone stands, from the latest reply that said so (Settings → Chat and panel extras → Map).
    // a map drawn by the backend (numbers and escaped names only), in the world's card colours
    function mapBox(svg, vars, label) {
        const box = h('div', { class: 'rpgc-map', role: 'img', 'aria-label': label || 'Map' });
        box.innerHTML = svg;
        if (vars) box.setAttribute('style', `${vars};background:var(--rh-bg);color:var(--rh-fg);border:1px solid var(--rh-line);border-radius:10px;padding:6px 4px`);
        return box;
    }
    function viewBanked(key) {
        if (state.mapView && state.mapView.key === key) { state.mapView = null; render(); return; }
        send({ type: 'mapbank_view', chatId: state.chatId, key });
    }
    // The map bank: every room drawn in this world, so a place is drawn once.
    function renderMapBank() {
        const bank = state.hms && state.hms.mapBank;
        if (!bank || !bank.rooms || !bank.rooms.length) return null;
        const n = bank.rooms.length;
        const det = h('details', { class: 'rpgc-subdet' }, h('summary', null, `\uD83D\uDDC2\uFE0F Map bank \u2014 ${n} room${n === 1 ? '' : 's'} in this world`),
            h('p', { class: 'rpgc-note' }, 'Every room the story has drawn here is kept for this world, so a place is drawn once \u2014 coming back, or a new chat with the same bot, uses the saved room and spends no tokens drawing it. Forget a room and the story draws it fresh the next time you are there.'),
            h('ul', { class: 'rpgc-list' }, bank.rooms.map(r => h('li', { style: 'display:block' },
                h('div', { class: 'rpgc-row', style: 'gap:6px;flex-wrap:nowrap' },
                    h('span', { style: 'flex:1;min-width:0' }, h('b', null, r.name), r.place && r.place !== r.name ? h('span', { class: 'rpgc-note' }, ` \u00B7 ${r.place}`) : null, r.w ? h('span', { class: 'rpgc-note' }, ` \u00B7 ${r.w}\u00D7${r.h}`) : null),
                    r.here ? h('span', { class: 'rpgc-chip' }, 'you are here') : null,
                    h('button', { class: 'rpgc-mini', 'aria-label': `${state.mapView && state.mapView.key === r.key ? 'Hide' : 'View'} ${r.name}`, onclick: () => viewBanked(r.key) }, state.mapView && state.mapView.key === r.key ? 'Hide' : 'View'),
                    h('button', { class: 'rpgc-mini', title: 'Forget it: the story draws it fresh next time', 'aria-label': `Forget ${r.name}`, onclick: () => send({ type: 'mapbank_edit', chatId: state.chatId, op: 'forget', key: r.key }) }, '\u2715')),
                state.mapView && state.mapView.key === r.key ? mapBox(state.mapView.svg, state.mapView.vars, `Saved map of ${r.name}`) : null))),
            h('div', { class: 'rpgc-row' },
                bank.chatRoom ? h('button', { class: 'rpgc-btn', title: 'The room you are in, as it is in this chat now, becomes the bank\u2019s drawing of the place', onclick: () => send({ type: 'mapbank_edit', chatId: state.chatId, op: 'save' }) }, 'Save this room as it is now') : null,
                h('button', { class: 'rpgc-btn danger', onclick: async () => {
                    const res = ctx.ui.showConfirm ? await ctx.ui.showConfirm({ title: 'Clear the map bank?', message: 'Every saved room of this world is forgotten. The story draws each one again when you are there with the map on.', variant: 'danger', confirmLabel: 'Clear' }) : { confirmed: true };
                    if (res?.confirmed) send({ type: 'mapbank_edit', chatId: state.chatId, op: 'clear' });
                } }, 'Clear this world\u2019s bank')));
        det.open = !!state.open.mapbank; det.addEventListener('toggle', () => { state.open.mapbank = det.open; });
        return det;
    }
    function renderMap() {
        const m = state.hms && state.hms.map;
        const bankEl = renderMapBank();
        const bld = renderBuilding();
        const view = bld && (state.mapMode === 'building' || !m) ? 'building' : 'room';
        const switcher = bld && m ? h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Map view' },
            [['room', 'This room'], ['building', 'Whole building']].map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === view ? ' primary' : ''), 'aria-pressed': k === view ? 'true' : 'false', onclick: () => { state.mapMode = k; render(); } }, l))) : null;
        if (view === 'building') return section('map', 'Map', state.open, (state.hms.buildings && state.hms.buildings.name) || null, switcher, ...bld, bankEl);
        if (!m) return bankEl ? section('map', 'Map', state.open, null, h('p', { class: 'rpgc-note' }, 'No positions in the latest replies.'), bankEl) : null;
        const box = mapBox(m.svg, m.vars, m.name ? `Map of ${m.name}` : 'Map');
        const col = { you: '#e8b030', ally: '#3fae6a', foe: '#e05050', other: '#9a9ab0' };
        const me = (m.pos || []).find(p => p.side === 'you');
        const dist = (p) => (me && p !== me ? Math.max(Math.abs(p.x - me.x), Math.abs(p.y - me.y)) : null);
        const legend = h('div', { class: 'rpgc-chips', style: 'justify-content:center;margin-top:4px' }, (m.pos || []).map(p => { const k = dist(p);
            return h('span', { class: 'rpgc-chip', title: p.note || '' }, h('span', { class: 'rpgc-map-dot', style: `background:${col[p.side] || col.other}` }),
                `${p.name} (${p.x},${p.y})${k === null ? '' : k === 1 ? ' \u00B7 next to you' : ` \u00B7 ${k} sq`}`); }));
        return section('map', 'Map', state.open, m.name || null, switcher, box, legend,
            m.latest ? null : h('p', { class: 'rpgc-note' }, 'From an earlier reply: the latest one did not say where everyone stands.'), bankEl);
    }

    // ─────────── Atlas: the bot's location book as a map you can walk through ───────────
    const SURV = { full: ['#d9534f', '\uD83D\uDCF9', 'covered, no blind spot'], watched: ['#e0902f', '\uD83D\uDCF9', 'watched'], partial: ['#c9a300', '\uD83D\uDCF9', 'blind spots'], blind: ['#3fae6a', '\uD83D\uDD76\uFE0F', 'no cameras'], unknown: ['#9a9ab0', '\uD83D\uDCF9', 'see notes'] };
    function survBadge(sv) {
        if (!sv || !SURV[sv.level]) return null;
        const [c, ic, lbl] = SURV[sv.level];
        return h('span', { class: 'rpgc-surv', style: `color:${c}`, title: sv.text || lbl }, ic, ' ', lbl);
    }
    function floorRank(label, name) {
        const t = String(label || '').toLowerCase(), n = String(name || '').toLowerCase();
        if (!t) return /roof/.test(n) ? 99 : /basement|cellar/.test(n) ? -1 : null;
        const nums = { basement: -1, ground: 0, first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8 };
        const hits = Object.keys(nums).filter(k => new RegExp(`\\b${k}\\b`).test(t)).map(k => nums[k]);
        if (/\bfloor|basement|storey|level\b/.test(t) && hits.length) return hits.reduce((a, b) => a + b, 0) / hits.length;
        return null;
    }
    // ─────────── 2.8 Floor plans: the room atlas of Ryah | Wireless ───────────
    // Three views of the rooms the story has shown: the room you are in, a plan of a floor with the doors and the ways
    // between the rooms, and the floors as a cutaway in 3D. The backend keeps the rooms; this only draws them.
    // one whole character, so a joined emoji (😮‍💨) or one with its style mark (⛓️) stays whole
    const firstGlyph = (t) => { const v = String(t || ''); try { const it = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(v)[Symbol.iterator]().next(); return it.done ? '' : it.value.segment; } catch { return [...v][0] || ''; } };
    const pEsc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    const PLAN_U = 8;                       // drawing units per metre
    const pNice = (id) => String(id || '').replace(/_/g, ' ').replace(/\b\p{L}/gu, c => c.toUpperCase());
    function planRoomsOf(P, map, z) { return P.rooms.filter(r => r.map === map && (z === undefined || r.z === z)); }
    function planNameOf(P, id) { const r = P.rooms.find(x => x.id === id); return r ? r.name : (id === 'outside' ? 'Outside' : pNice(id)); }
    function planWhoDot(p, x, y, u) {
        const me = /^(you|me)$/i.test(p.name) || (state.userName && p.name.toLowerCase() === String(state.userName).toLowerCase());
        return `<g class="pw${me ? ' me' : ''}"><title>${pEsc(p.name)}${p.st ? ' ' + pEsc(p.st) : ''}</title><circle cx="${x}" cy="${y}" r="${u * 0.55}"/><text x="${x}" y="${y + u * 0.22}" font-size="${u * 0.62}">${pEsc((me ? 'You' : p.name).charAt(0))}</text>${p.st ? `<text x="${x + u * 0.55}" y="${y - u * 0.45}" font-size="${u * 0.8}">${pEsc(firstGlyph(p.st))}</text>` : ''}</g>`;
    }
    // 2.9: the things in a room, drawn to scale from the room's north-west corner (ox, oy in pixels, u pixels a metre).
    // A thing with no spot stands along the walls in the order it was named; a window sits on its wall.
    const PLAN_THING_SIZE = { bed: [2, 1.4], table: [1.6, 1], desk: [1.4, 0.7], chair: [0.5, 0.5], sofa: [2, 0.9], bench: [1.8, 0.5], shelf: [2, 0.4], wardrobe: [1.2, 0.6], chest: [0.9, 0.6],
        counter: [2.4, 0.7], fireplace: [1.6, 0.6], board: [2.4, 0.2], stairs: [1.2, 3], window: [1.4, 0.25], pillar: [0.6, 0.6], water: [3, 2], plant: [0.7, 0.7], rug: [2.4, 1.6],
        statue: [0.8, 0.8], throne: [1, 1], screen: [1.6, 0.2], light: [0.4, 0.4], grave: [1, 2], cage: [2, 2], thing: [0.8, 0.8] };
    function planThingSpots(things, W, L) {
        const out = [], perSide = {}, seenSide = {};
        for (const t of things) if (t.kind === 'window') perSide[t.side || 'N'] = (perSide[t.side || 'N'] || 0) + 1;
        let cx = 0.3, cy = 0.3, rowH = 0;
        for (const t of (things || []).slice(0, 30)) {
            const [dw, dl] = PLAN_THING_SIZE[t.kind] || PLAN_THING_SIZE.thing;
            let w = Math.min(t.w || dw, W), l = Math.min(t.l || dl, L), x = t.x, y = t.y;
            if (t.kind === 'window') {
                const side = t.side || 'N', along = side === 'N' || side === 'S', len = Math.min(w, along ? W : L), k = (seenSide[side] = (seenSide[side] || 0) + 1);
                const at = x !== null && x !== undefined ? x : (along ? W : L) * k / (perSide[side] + 1) - len / 2;
                out.push({ ...t, side, at: Math.max(0, Math.min((along ? W : L) - len, at)), len });
                continue;
            }
            if (x === null || x === undefined || y === null || y === undefined) {
                if (cx + w > W - 0.3) { cx = 0.3; cy += rowH + 0.4; rowH = 0; }
                x = cx; y = cy; cx += w + 0.4; rowH = Math.max(rowH, l);
            }
            out.push({ ...t, x: Math.max(0, Math.min(W - w, x)), y: Math.max(0, Math.min(L - l, y)), w, l });
        }
        return out;
    }
    function planThingsSvg(things, ox, oy, u, W, L) {
        if (!Array.isArray(things) || !things.length || !(W > 0 && L > 0)) return '';
        let o = '';
        for (const t of planThingSpots(things, W, L)) {
            const tt = `<title>${pEsc(t.label || t.kind)}${t.dir ? ` (${t.dir === 'Up' ? 'up' : 'down'})` : ''}</title>`;
            if (t.kind === 'window') {
                const a = t.at * u, n = t.len * u;
                const d = t.side === 'N' ? `M${ox + a} ${oy}h${n}` : t.side === 'S' ? `M${ox + a} ${oy + L * u}h${n}` : t.side === 'W' ? `M${ox} ${oy + a}v${n}` : `M${ox + W * u} ${oy + a}v${n}`;
                o += `<g class="pt k-window">${tt}<path d="${d}"/></g>`;
                continue;
            }
            const x = ox + t.x * u, y = oy + t.y * u, w = t.w * u, l = t.l * u, cxp = x + w / 2, cyp = y + l / 2, r = Math.min(w, l) / 2;
            let g = '';
            switch (t.kind) {
                case 'bed': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}" rx="1.5"/><rect class="dk" x="${x + 1.5}" y="${y + 1.5}" width="${Math.max(1, w - 3)}" height="${Math.max(1, l * 0.24)}" rx="1"/>`; break;
                case 'sofa': case 'throne': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}" rx="2"/><path class="dk" d="M${x + 1} ${y + 1.6}h${Math.max(0, w - 2)}"/>`; break;
                case 'shelf': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}"/><path class="dk" d="M${x} ${cyp}h${w}"/>`; break;
                case 'fireplace': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}"/><circle class="fire" cx="${cxp}" cy="${cyp}" r="${Math.max(1.2, r * 0.6)}"/>`; break;
                case 'stairs': { const steps = Math.max(3, Math.round(Math.max(t.w, t.l) * 3)); const long = l >= w; let lines = ''; for (let i = 1; i < steps; i++) lines += long ? `M${x} ${y + (l * i) / steps}h${w}` : `M${x + (w * i) / steps} ${y}v${l}`; g = `<rect x="${x}" y="${y}" width="${w}" height="${l}"/><path class="dk" d="${lines}"/>${t.dir ? `<text x="${cxp}" y="${cyp + 3}">${t.dir === 'Up' ? '▲' : '▼'}</text>` : ''}`; break; }
                case 'pillar': case 'statue': g = `<circle cx="${cxp}" cy="${cyp}" r="${Math.max(1.5, r)}"/>${t.kind === 'statue' ? `<circle class="dk" cx="${cxp}" cy="${cyp}" r="${Math.max(0.8, r * 0.45)}"/>` : ''}`; break;
                case 'plant': case 'light': g = `<circle cx="${cxp}" cy="${cyp}" r="${Math.max(1.2, r)}"/>`; break;
                case 'water': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}" rx="${Math.min(6, r)}"/><path class="wave" d="M${x + w * 0.15} ${cyp}q${w * 0.1} -2 ${w * 0.2} 0t${w * 0.2} 0t${w * 0.2} 0"/>`; break;
                case 'cage': { let bars = ''; for (let i = 1; i < 6; i++) bars += `M${x + (w * i) / 6} ${y}v${l}`; g = `<rect x="${x}" y="${y}" width="${w}" height="${l}"/><path class="dk" d="${bars}"/>`; break; }
                case 'grave': g = `<rect x="${x}" y="${y}" width="${w}" height="${l}" rx="${Math.min(4, r)}"/><path class="dk" d="M${cxp} ${y + l * 0.2}v${l * 0.45}M${cxp - w * 0.2} ${y + l * 0.35}h${w * 0.4}"/>`; break;
                default: g = `<rect x="${x}" y="${y}" width="${w}" height="${l}" rx="1"/>`;
            }
            o += `<g class="pt k-${t.kind}">${tt}${g}</g>`;
        }
        return `<g class="pth">${o}</g>`;
    }
    /** One room by itself, from its size: its doors on their walls and the people in it. */
    function planRoomSvg(P, r) {
        const W = r.box ? r.box[2] - r.box[0] : r.w, L = r.box ? r.box[3] - r.box[1] : r.l;
        if (!(W > 0 && L > 0)) return '';
        const u = Math.max(4, Math.min(16, 220 / Math.max(W, L))), pad = 14;
        const vw = W * u + pad * 2, vh = L * u + pad * 2;
        let s = `<svg viewBox="0 0 ${vw} ${vh}" class="planroom" role="img" aria-label="${pEsc(r.name)}, ${W} by ${L} metres">`;
        s += `<rect class="pfl" x="${pad}" y="${pad}" width="${W * u}" height="${L * u}" rx="2"/>`;
        for (let i = 1; i < W; i++) s += `<path class="pg${i % 5 ? '' : ' b'}" d="M${pad + i * u} ${pad}v${L * u}"/>`;
        for (let i = 1; i < L; i++) s += `<path class="pg${i % 5 ? '' : ' b'}" d="M${pad} ${pad + i * u}h${W * u}"/>`;
        s += planThingsSvg(r.things, pad, pad, u, W, L);
        s += `<rect class="pwall" x="${pad}" y="${pad}" width="${W * u}" height="${L * u}" rx="2"/>`;
        const side = {};
        for (const d of r.doors || []) {
            if (!['N', 'S', 'E', 'W'].includes(d.dir)) continue;
            side[d.dir] = (side[d.dir] || 0) + 1;
            const k = side[d.dir];
            let x, y;
            if (r.box && d.x !== null && d.y !== null && d.x !== undefined) { x = pad + (d.x - r.box[0]) * u; y = pad + (d.y - r.box[1]) * u; }
            else { x = pad + (d.dir === 'E' ? W * u : d.dir === 'W' ? 0 : (W * u * k) / ((r.doors.filter(q => q.dir === d.dir).length) + 1)); y = pad + (d.dir === 'S' ? L * u : d.dir === 'N' ? 0 : (L * u * k) / ((r.doors.filter(q => q.dir === d.dir).length) + 1)); }
            x = Math.max(pad, Math.min(pad + W * u, x)); y = Math.max(pad, Math.min(pad + L * u, y));
            const along = d.dir === 'N' || d.dir === 'S';
            const dl = Math.min(u * 1.2, 14);
            s += `<g class="pdoor"><title>${pEsc(`${d.dir} → ${planNameOf(P, d.to)}`)}</title><path d="${along ? `M${x - dl / 2} ${y}h${dl}` : `M${x} ${y - dl / 2}v${dl}`}"/></g>`;
            const tx = along ? x : (d.dir === 'E' ? x - 3 : x + 3), ty = along ? (d.dir === 'N' ? y + 10 : y - 4) : y + 3;
            s += `<text class="pdt" x="${tx}" y="${ty}" text-anchor="${along ? 'middle' : d.dir === 'E' ? 'end' : 'start'}">${pEsc(planNameOf(P, d.to)).slice(0, 18)}</text>`;
        }
        for (const p of r.who || []) if (p.x !== null && p.y !== null && p.x !== undefined) s += planWhoDot(p, pad + Math.max(0.5, Math.min(W - 0.5, p.x)) * u, pad + Math.max(0.5, Math.min(L - 0.5, p.y)) * u, u);
        return s + '</svg>';
    }
    /** A floor: every room with a box, the doors, the ways between rooms (the "roads"), the way out, the people. */
    function planFloorSvg(P, map, z, sel) {
        const rooms = planRoomsOf(P, map, z).filter(r => r.box);
        if (!rooms.length) return '';
        let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
        for (const r of rooms) { x1 = Math.min(x1, r.box[0]); y1 = Math.min(y1, r.box[1]); x2 = Math.max(x2, r.box[2]); y2 = Math.max(y2, r.box[3]); }
        const m = 4; x1 -= m; y1 -= m; x2 += m; y2 += m;
        const u = PLAN_U, X = (v) => ((v - x1) * u).toFixed(1), Y = (v) => ((v - y1) * u).toFixed(1);
        const vw = (x2 - x1) * u, vh = (y2 - y1) * u;
        let s = `<svg viewBox="0 0 ${vw.toFixed(0)} ${vh.toFixed(0)}" class="planmap" role="group" aria-label="Floor plan">`;
        s += '<g class="pgrid">';
        for (let gx = Math.ceil(x1 / 5) * 5; gx <= x2; gx += 5) s += `<path class="${gx % 10 ? '' : 'b'}" d="M${X(gx)} 0V${vh.toFixed(0)}"/>`;
        for (let gy = Math.ceil(y1 / 5) * 5; gy <= y2; gy += 5) s += `<path class="${gy % 10 ? '' : 'b'}" d="M0 ${Y(gy)}H${vw.toFixed(0)}"/>`;
        s += '</g>';
        const hereId = P.here && P.here.map === map ? P.here.id : null;
        const ctr = (r) => [(r.box[0] + r.box[2]) / 2, (r.box[1] + r.box[3]) / 2];
        const byId = new Map(rooms.map(r => [r.id, r]));
        // the ways between rooms: centre, door, centre
        const ways = new Set();
        let wayS = '';
        for (const r of rooms) for (const d of r.doors || []) {
            const t = byId.get(d.to);
            if (!t || d.x === null || d.x === undefined || d.y === null) continue;
            const k = [r.id, t.id].sort().join('|');
            if (ways.has(k)) continue;
            ways.add(k);
            const [ax, ay] = ctr(r), [bx, by] = ctr(t);
            wayS += `<path class="pway" d="M${X(ax)} ${Y(ay)}L${X(d.x)} ${Y(d.y)}L${X(bx)} ${Y(by)}"/>`;
        }
        for (const r of rooms) {
            const [a, b, c, d] = r.box, w = (c - a) * u, hh = (d - b) * u;
            const cls = ['proom', r.entered ? 'in' : 'seen', r.id === hereId ? 'here' : '', r.id === sel ? 'sel' : ''].filter(Boolean).join(' ');
            const fs = Math.max(6, Math.min(13, (w / Math.max(4, r.name.length)) * 1.7, hh / 2.4));
            // the name near the top of the room, so the people standing in it do not cover it
            const label = w > 26 && hh > 12 ? `<text x="${X((a + c) / 2)}" y="${(Number(Y(b)) + Math.min(hh / 2 + fs * 0.35, fs * 1.25 + 2)).toFixed(1)}" font-size="${fs.toFixed(1)}">${pEsc(r.name.length * fs * 0.55 > w - 4 ? r.name.slice(0, Math.max(3, Math.floor((w - 4) / (fs * 0.55)) - 1)) + '…' : r.name)}</text>` : '';
            const vert = (r.doors || []).filter(x => x.dir === 'Up' || x.dir === 'Down').map(x => x.dir === 'Up' ? '▲' : '▼');
            s += `<g class="${cls}" data-room="${pEsc(r.id)}" tabindex="0" role="button" aria-label="${pEsc(r.name)}${r.id === hereId ? ', you are here' : ''}"><title>${pEsc(r.name)}${r.has ? ' — ' + pEsc(r.has) : ''}</title><rect x="${X(a)}" y="${Y(b)}" width="${w.toFixed(1)}" height="${hh.toFixed(1)}" rx="2"/>${label}${vert.length ? `<text class="pstair" x="${(Number(X(c)) - 3).toFixed(1)}" y="${(Number(Y(b)) + 9).toFixed(1)}" text-anchor="end">${[...new Set(vert)].join('')}</text>` : ''}</g>`;
        }
        for (const r of rooms) if ((r.things || []).length) s += planThingsSvg(r.things, Number(X(r.box[0])), Number(Y(r.box[1])), u, r.box[2] - r.box[0], r.box[3] - r.box[1]);
        s += wayS;
        const doorSeen = new Set();
        for (const r of rooms) for (const d of r.doors || []) {
            if (!['N', 'S', 'E', 'W'].includes(d.dir) || d.x === null || d.x === undefined || d.y === null) continue;
            const k = `${d.x},${d.y}`;
            if (doorSeen.has(k)) continue;
            doorSeen.add(k);
            const along = d.dir === 'N' || d.dir === 'S';
            s += `<path class="pdoor" d="${along ? `M${(Number(X(d.x)) - u * 0.6).toFixed(1)} ${Y(d.y)}h${(u * 1.2).toFixed(1)}` : `M${X(d.x)} ${(Number(Y(d.y)) - u * 0.6).toFixed(1)}v${(u * 1.2).toFixed(1)}`}"><title>${pEsc(`${r.name} ↔ ${planNameOf(P, d.to)}`)}</title></path>`;
        }
        const mp = P.maps.find(x => x.id === map);
        if (mp && mp.exit && mp.exit.x !== null && mp.exit.x !== undefined && (z === 0 || rooms.some(r => mp.exit.x >= r.box[0] && mp.exit.x <= r.box[2] && mp.exit.y >= r.box[1] && mp.exit.y <= r.box[3]))) {
            const ex = Number(X(mp.exit.x)), ey = Number(Y(mp.exit.y)), q = u * 0.9;
            s += `<path class="pexit" d="M${ex} ${ey - q}L${ex + q} ${ey}L${ex} ${ey + q}L${ex - q} ${ey}Z"><title>The way out</title></path>`;
        }
        for (const r of rooms) for (const p of r.who || []) if (p.x !== null && p.x !== undefined && p.y !== null)
            s += planWhoDot(p, Number(X(r.box[0] + Math.max(0.5, Math.min(r.box[2] - r.box[0] - 0.5, p.x)))), Number(Y(r.box[1] + Math.max(0.5, Math.min(r.box[3] - r.box[1] - 0.5, p.y)))), u);
        return s + '</svg>';
    }
    /** The floors of a building as an isometric cutaway: low front walls, so you see into every room. */
    function planIsoSvg(P, map, zSel, sel) {
        const all = planRoomsOf(P, map).filter(r => r.box);
        if (!all.length) return '';
        const zs = [...new Set(all.map(r => r.z))].sort((a, b) => a - b).slice(-5);
        const u = 5.2, C = Math.cos(Math.PI / 6), gap = 4;
        // floors pulled apart (an exploded view), so an upper floor does not hide the one under it
        let sMin = Infinity, sMax = -Infinity;
        for (const r of all) { sMin = Math.min(sMin, r.box[0] + r.box[1]); sMax = Math.max(sMax, r.box[2] + r.box[3]); }
        const lift = Math.max(10, (sMax - sMin) * 0.5 * 0.62);
        const base = {}; let acc = 0;
        for (const z of zs) { base[z] = acc; acc += Math.max(lift, Math.max(3, ...all.filter(r => r.z === z).map(r => Math.min(9, r.h || 4))) * 0.7 + gap); }
        const iso = (x, y, hgt) => [(x - y) * C * u, ((x + y) * 0.5 - hgt) * u];
        let mnX = Infinity, mnY = Infinity, mxX = -Infinity, mxY = -Infinity;
        for (const r of all) for (const [x, y] of [[r.box[0], r.box[1]], [r.box[2], r.box[1]], [r.box[2], r.box[3]], [r.box[0], r.box[3]]]) for (const hh of [base[r.z], base[r.z] + 6]) {
            const [px, py] = iso(x, y, hh); mnX = Math.min(mnX, px); mxX = Math.max(mxX, px); mnY = Math.min(mnY, py); mxY = Math.max(mxY, py);
        }
        const pad = 16, ox = -mnX + pad, oy = -mnY + pad;
        const P2 = (x, y, hh) => { const [a, b] = iso(x, y, hh); return `${(a + ox).toFixed(1)},${(b + oy).toFixed(1)}`; };
        const hereId = P.here && P.here.map === map ? P.here.id : null;
        let s = `<svg viewBox="0 0 ${(mxX - mnX + pad * 2).toFixed(0)} ${(mxY - mnY + pad * 2).toFixed(0)}" class="planiso" role="group" aria-label="The floors in 3D">`;
        for (const z of zs) {
            const b0 = base[z];
            const fl = all.filter(r => r.z === z).sort((a, b) => (a.box[0] + a.box[1]) - (b.box[0] + b.box[1]));
            s += `<g class="pflr${z === zSel ? ' cur' : ''}">`;
            for (const r of fl) {
                const [a, b, c, d] = r.box, wh = Math.min(4, (r.h || 4) * 0.5), lo = 0.6;
                const cls = ['pr3', r.entered ? 'in' : 'seen', r.id === hereId ? 'here' : '', r.id === sel ? 'sel' : ''].filter(Boolean).join(' ');
                s += `<g class="${cls}" data-room="${pEsc(r.id)}" data-z="${z}" tabindex="0" role="button" aria-label="${pEsc(r.name)}"><title>${pEsc(r.name)}</title>`;
                s += `<polygon class="bw" points="${P2(a, b, b0)} ${P2(c, b, b0)} ${P2(c, b, b0 + wh)} ${P2(a, b, b0 + wh)}"/>`;          // north wall
                s += `<polygon class="bw2" points="${P2(a, b, b0)} ${P2(a, d, b0)} ${P2(a, d, b0 + wh)} ${P2(a, b, b0 + wh)}"/>`;        // west wall
                s += `<polygon class="fl" points="${P2(a, b, b0)} ${P2(c, b, b0)} ${P2(c, d, b0)} ${P2(a, d, b0)}"/>`;
                s += `<polygon class="fw" points="${P2(a, d, b0)} ${P2(c, d, b0)} ${P2(c, d, b0 + lo)} ${P2(a, d, b0 + lo)}"/>`;          // low south wall
                s += `<polygon class="fw2" points="${P2(c, b, b0)} ${P2(c, d, b0)} ${P2(c, d, b0 + lo)} ${P2(c, b, b0 + lo)}"/>`;        // low east wall
                // 2.9: the things on the floor: footprints, pillars standing to the wall's height, water in blue
                for (const t of planThingSpots(r.things || [], c - a, d - b)) {
                    if (t.kind === 'window') continue;
                    const x0 = a + t.x, y0 = b + t.y, x1 = x0 + t.w, y1 = y0 + t.l;
                    if (t.kind === 'pillar') { const [px, py] = iso((x0 + x1) / 2, (y0 + y1) / 2, b0); s += `<path class="p3 k-pillar" d="M${(px + ox).toFixed(1)} ${(py + oy).toFixed(1)}v${(-wh * u).toFixed(1)}"><title>${pEsc(t.label)}</title></path>`; continue; }
                    const hh = t.kind === 'water' || t.kind === 'rug' ? 0.02 : t.kind === 'stairs' ? 0.6 : 0.25;
                    s += `<polygon class="p3 k-${t.kind}" points="${P2(x0, y0, b0 + hh)} ${P2(x1, y0, b0 + hh)} ${P2(x1, y1, b0 + hh)} ${P2(x0, y1, b0 + hh)}"><title>${pEsc(t.label)}</title></polygon>`;
                }
                for (const p of r.who || []) if (p.x !== null && p.x !== undefined && p.y !== null) {
                    const [px, py] = iso(a + Math.max(0.5, Math.min(c - a - 0.5, p.x)), b + Math.max(0.5, Math.min(d - b - 0.5, p.y)), b0 + 0.9);
                    const me = /^(you|me)$/i.test(p.name);
                    s += `<g class="pw${me ? ' me' : ''}"><title>${pEsc(p.name)}</title><path d="M${(px + ox).toFixed(1)} ${(py + oy + 5).toFixed(1)}v-6"/><circle cx="${(px + ox).toFixed(1)}" cy="${(py + oy - 2).toFixed(1)}" r="2.6"/></g>`;
                }
                if ((c - a) * (d - b) >= 60) { const [tx, ty] = iso((a + c) / 2, (b + d) / 2, b0); s += `<text x="${(tx + ox).toFixed(1)}" y="${(ty + oy + 3).toFixed(1)}">${pEsc(r.name.length > 18 ? r.name.slice(0, 17) + '…' : r.name)}</text>`; }
                s += '</g>';
            }
            s += '</g>';
        }
        // stairs and lifts: a dashed line between rooms on different floors
        const byId = new Map(all.map(r => [r.id, r]));
        const done = new Set();
        for (const r of all) for (const d of r.doors || []) {
            if (d.dir !== 'Up' && d.dir !== 'Down') continue;
            const t = byId.get(d.to);
            if (!t || t.z === r.z) continue;
            const k = [r.id, t.id].sort().join('|');
            if (done.has(k)) continue;
            done.add(k);
            const c1 = [(r.box[0] + r.box[2]) / 2, (r.box[1] + r.box[3]) / 2], c2 = [(t.box[0] + t.box[2]) / 2, (t.box[1] + t.box[3]) / 2];
            s += `<polyline class="pup" points="${P2(c1[0], c1[1], base[r.z])} ${P2(c2[0], c2[1], base[t.z])}"><title>${pEsc(`${r.name} ↕ ${t.name}`)}</title></polyline>`;
        }
        return s + '</svg>';
    }
    function planDetail(P, r) {
        if (!r) return null;
        const size = r.box || (r.w && r.l) ? `${r.box ? r.box[2] - r.box[0] : r.w} × ${r.box ? r.box[3] - r.box[1] : r.l} m${r.h ? `, ${r.h} m high` : ''}` : null;
        const mp = P.maps.find(m => m.id === r.map);
        const fl = mp && mp.floors.find(f => f.z === r.z);
        return h('div', { class: 'rpgc-plan-det' },
            h('div', { class: 'rpgc-atlas-head' }, h('b', null, (P.here && P.here.id === r.id && P.here.map === r.map ? '📍 ' : ''), r.name),
                size ? h('span', { class: 'rpgc-chip' }, size) : null, fl ? h('span', { class: 'rpgc-chip' }, fl.name) : null,
                mp && mp.id !== '_' ? h('span', { class: 'rpgc-chip' }, mp.name) : null, r.entered ? null : h('span', { class: 'rpgc-chip', title: 'Seen or heard of, not entered yet' }, 'not entered')),
            r.has ? h('p', null, r.has) : null,
            (r.things || []).length ? h('div', { class: 'rpgc-chips' }, h('span', { class: 'k' }, 'In it'), ...Object.entries(r.things.reduce((m, t) => { const k = t.kind === 'thing' ? (t.label || 'thing') : t.kind; m[k] = (m[k] || 0) + 1; return m; }, {})).map(([k, n]) => h('span', { class: 'rpgc-chip' }, n > 1 ? `${k} \u00D7${n}` : k))) : null,
            r.sizeFrom === 'lorebook' ? h('p', { class: 'rpgc-note' }, 'Its size is the lorebook\u2019s.') : null,
            r.whoFrom === 'room map' ? h('p', { class: 'rpgc-note' }, 'Who stands where comes from the room map, every reply.') : null,
            (r.doors || []).length ? h('div', { class: 'rpgc-plan-doors' }, h('span', { class: 'k' }, 'Ways out'),
                ...r.doors.map(d => h('button', { class: 'rpgc-chip rpgc-plan-door', title: 'Show that room', onclick: () => { const t = P.rooms.find(x => x.id === d.to && x.map === r.map); if (t) { state.planSel = t.id; state.planFloor = `${t.map}|${t.z}`; render(); } } },
                    `${{ N: '↑ N', S: '↓ S', E: '→ E', W: '← W', Up: '▲ Up', Down: '▼ Down', In: 'In', Out: 'Out' }[d.dir] || '•'} ${planNameOf(P, d.to)}`))) : null,
            (r.who || []).length ? h('div', { class: 'rpgc-chips' }, h('span', { class: 'k' }, 'Here now'), ...r.who.map(p => h('span', { class: 'rpgc-chip' }, p.name))) : null);
    }
    function renderPlans() {
        const P = state.hms && state.hms.plans;
        if (!P || !Array.isArray(P.rooms)) return null;
        const views = [['room', 'This room']].concat(P.boxes ? [['plan', 'Floor plan'], ['3d', '3D']] : []);
        let view = views.some(([k]) => k === state.planView) ? state.planView : (views.some(([k]) => k === P.tier) ? P.tier : 'room');
        const here = P.here ? P.rooms.find(r => r.id === P.here.id && r.map === P.here.map) : null;
        // the floor shown: the one you chose, the one you are on, the one the bot's block names, or the first
        const floors = P.maps.flatMap(m => m.floors.map(f => ({ key: `${m.id}|${f.z}`, map: m.id, z: f.z, label: `${P.maps.length > 1 ? m.name + ' · ' : ''}${f.name}` })));
        let fk = floors.some(f => f.key === state.planFloor) ? state.planFloor
            : here ? `${here.map}|${here.z}` : P.active && floors.some(f => f.key === `${P.active.map}|${P.active.z}`) ? `${P.active.map}|${P.active.z}` : (floors[0] && floors[0].key);
        const F = floors.find(f => f.key === fk) || null;
        const switcher = views.length > 1 ? h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Floor plan view' },
            views.map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === view ? ' primary' : ''), 'aria-pressed': k === view ? 'true' : 'false', onclick: () => { state.planView = k; render(); } }, l))) : null;
        const pick = (e) => { const g = e.target.closest && e.target.closest('[data-room]'); if (!g) return; state.planSel = g.getAttribute('data-room'); if (g.getAttribute('data-z') !== null && F) state.planFloor = `${F.map}|${g.getAttribute('data-z')}`; render(); };
        const out = [switcher];
        if (view === 'room') {
            if (!here) out.push(h('p', { class: 'rpgc-note' }, P.lost ? `You are at ${P.lost}: not on the plan yet${P.owner === 'bot' ? '' : '. The story draws it on the next reply'}.` : P.place ? `The HUD says ${P.place}. The plan has no room by that name yet${P.owner === 'bot' ? '' : '; the model adds it when it is next asked'}.` : 'No room yet.'));
            else {
                const pic = planRoomSvg(P, here);
                if (pic) { const box = h('div', { class: 'rpgc-plan' }); box.innerHTML = pic; out.push(box); }
                out.push(planDetail(P, here));
            }
        } else if (F) {
            const sel = state.planSel && P.rooms.some(r => r.id === state.planSel && r.map === F.map) ? state.planSel : (here && here.map === F.map ? here.id : null);
            const fsel = floors.filter(f => f.map === F.map).length > 1 || P.maps.length > 1
                ? h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Floor' }, floors.map(f => h('button', { class: 'rpgc-btn' + (f.key === fk ? ' primary' : ''), 'aria-pressed': f.key === fk ? 'true' : 'false', onclick: () => { state.planFloor = f.key; state.planSel = null; render(); } }, f.label))) : null;
            const box = h('div', { class: 'rpgc-plan' + (view === '3d' ? ' iso' : ''), onclick: pick, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(e); } } });
            box.innerHTML = view === '3d' ? planIsoSvg(P, F.map, F.z, sel) : planFloorSvg(P, F.map, F.z, sel);
            if (!box.innerHTML) box.appendChild(h('p', { class: 'rpgc-note' }, 'No room on this floor has a size yet.'));
            const unplaced = planRoomsOf(P, F.map, F.z).filter(r => !r.box);
            out.push(fsel, box,
                h('div', { class: 'rpgc-plan-key rpgc-note' }, h('span', { class: 'k in' }), 'entered ', h('span', { class: 'k seen' }), 'seen ', h('span', { class: 'k here' }), 'you are here ',
                    view === 'plan' ? [h('span', { class: 'k way' }), 'way between rooms ', h('span', { class: 'k exit' }), 'way out'] : h('span', null, '↕ stairs between floors')),
                sel ? planDetail(P, P.rooms.find(r => r.id === sel && r.map === F.map)) : null,
                unplaced.length ? h('p', { class: 'rpgc-note' }, `Known here without a size yet: ${unplaced.map(r => r.name).join(', ')}.`) : null);
        }
        out.push(h('p', { class: 'rpgc-note rpgc-credit' }, P.owner === 'bot' ? 'Read from the bot’s own room atlas. ' : '', 'Floor plans after the room atlas of Ryah | Wireless.'));
        const n = P.rooms.length;
        return section('plans', 'Floor plan', state.open, here ? here.name : `${n} room${n === 1 ? '' : 's'}`, ...out);
    }
    function renderAtlas() {
        const info = state.hms && state.hms.atlas;
        if (!info || !info.count || S()?.showAtlas === false) return null;
        const A = state.atlasData && state.atlasData.version === info.version ? state.atlasData : null;
        if (!A && !state.atlasReq && state.open.atlas !== false) { state.atlasReq = true; send({ type: 'atlas_get', chatId: state.chatId }); }
        const idx = state.atlasIndex || new Map();
        const hereId = info.here ? info.here.id : null;
        const onPath = new Set((info.trail || []).map(t => t.id));
        const trail = h('div', { class: 'rpgc-atlas-trail', 'aria-label': 'Where you are' }, '\uD83D\uDCCD ',
            ...(info.trail || []).flatMap((t, i) => [i ? h('span', { class: 'sep' }, '\u203A') : null,
                // a room with nothing inside opens as its place among its neighbours, selected
                h('button', { class: t.id === hereId ? 'here' : '', onclick: () => { const n = idx.get(t.id); state.atlasFocus = n && !n.children.length && n.parent != null ? n.parent : t.id; state.atlasSel = t.id; render(); } }, t.name)]),
            info.here && info.here.transit != null ? h('span', { class: 'rpgc-note' }, ` \u203A on the road${info.here.transit ? ` to ${info.here.transit}` : ''}`) : null,
            info.here && info.here.past && info.here.past.length ? h('span', { class: 'rpgc-note', title: 'The HUD names a place the location book does not have' }, ` \u203A ${info.here.past.join(' \u203A ')} (not in the book)`) : null,
            info.surv ? survBadge(info.surv) : null);
        if (!A) return section('atlas', 'Atlas', state.open, `${info.count} places`, trail, h('p', { class: 'rpgc-note' }, 'Opening the location book\u2026'));
        // what to show: the place you chose, or the one around you
        const here = hereId != null ? idx.get(hereId) : null;
        let focusId = state.atlasFocus != null && idx.has(state.atlasFocus) ? state.atlasFocus : null;
        if (focusId != null && !idx.get(focusId).children.length && idx.get(focusId).parent != null) { state.atlasSel = focusId; focusId = idx.get(focusId).parent; }
        if (focusId == null) focusId = here ? (here.children.length ? here.id : (here.parent != null ? here.parent : here.id)) : (A.roots.length ? A.roots[0] : null);
        const focus = focusId != null ? idx.get(focusId) : null;
        if (!focus) return section('atlas', 'Atlas', state.open, `${info.count} places`, trail);
        const selId = state.atlasSel != null && idx.has(state.atlasSel) ? state.atlasSel : (hereId != null && focus.children.includes(hereId) ? hereId : focus.id);
        const tile = (id) => {
            const n = idx.get(id);
            if (!n) return null;
            const kids = n.children.filter(c => idx.has(c)).length;
            const sv = n.surv && SURV[n.surv.level];
            const cls = ['rpgc-atlas-tile', n.generic ? 'generic' : '', n.stub ? 'stub' : '', id === hereId ? 'here' : onPath.has(id) ? 'onpath' : '', id === selId ? 'sel' : ''].filter(Boolean).join(' ');
            return h('button', { class: cls, title: (focus.notes && focus.notes[id]) || n.summary || n.name,
                onclick: () => { state.atlasSel = id; if (n.children.length) state.atlasFocus = id; render(); } },
                sv ? h('span', { class: 'bar', style: `background:${sv[0]}` }) : null,
                h('span', { class: 'nm' }, id === hereId ? '\uD83D\uDCCD ' : '', n.name),
                h('span', { class: 'sub' }, kids ? h('span', null, `\u25B8 ${kids}`) : null, n.generic ? h('span', null, 'any') : null,
                    (n.flags || []).filter(f => /EVENT/i.test(f)).map(f => h('span', null, f.replace(/^EVENT\s*[\u2014\u2013-]?\s*/i, '').toLowerCase() || 'event')),
                A.maps && A.maps[id] ? h('span', { title: 'A saved map of this place' }, '\uD83D\uDDFA\uFE0F') : null, sv ? h('span', { style: `color:${sv[0]}` }, n.surv.level === 'full' ? 'no blind spot' : sv[2]) : null));
        };
        // group the places inside by floor, top floor first; anything else keeps the book's order
        const groups = new Map();
        for (const id of focus.children) {
            const n = idx.get(id); if (!n) continue;
            const r = floorRank(n.level, n.name);
            const key = n.level ? n.level : r === 99 ? 'Roof' : r === -1 ? 'Basement' : '';
            if (!groups.has(key)) groups.set(key, { label: key, rank: r === null ? (key ? 50 : -50) : r, ids: [] });
            groups.get(key).ids.push(id);
        }
        const ordered = [...groups.values()].sort((a, b) => b.rank - a.rank);
        const floors = ordered.length > 1 || (ordered[0] && ordered[0].label);
        const body = ordered.map(g => h('div', { class: 'rpgc-atlas-floor' }, floors ? h('span', { class: 'lbl' }, g.label || 'On this level') : null, h('div', { class: 'rpgc-atlas-grid' }, g.ids.map(tile))));
        const sel = idx.get(selId) || focus;
        const det = h('div', { class: 'rpgc-atlas-det' },
            h('div', { class: 'rpgc-atlas-head' }, h('b', null, sel.name), sel.kind ? h('span', { class: 'rpgc-chip' }, `Tier ${sel.tier} \u00B7 ${sel.kind.toLowerCase()}`) : null, sel.level ? h('span', { class: 'rpgc-chip' }, sel.level) : null, survBadge(sel.surv)),
            sel.summary ? h('p', null, sel.summary) : null,
            sel.surv && sel.surv.text ? [h('span', { class: 'k' }, 'Surveillance'), h('p', null, sel.surv.text)] : null,
            Object.entries(sel.meta || {}).map(([k, v]) => [h('span', { class: 'k' }, k.charAt(0) + k.slice(1).toLowerCase()), h('p', null, v)]),
            sel.anchors && sel.anchors.length ? [h('span', { class: 'k' }, 'Scene anchors'), h('ul', { style: 'margin:2px 0 0 16px;padding:0' }, sel.anchors.map(a => h('li', null, h('b', null, a.name), a.note ? ` \u2014 ${a.note}` : '')))] : null,
            sel.linked && sel.linked.length ? [h('span', { class: 'k' }, 'Linked'), h('p', null, sel.linked.join(' \u00B7 '))] : null,
            sel.stub ? h('p', { class: 'rpgc-note' }, 'Listed in the book without an entry of its own.') : null,
            A.maps && A.maps[sel.id] ? [h('button', { class: 'rpgc-btn', style: 'margin-top:6px', onclick: () => viewBanked(A.maps[sel.id]) }, state.mapView && state.mapView.key === A.maps[sel.id] ? 'Hide the saved map' : '\uD83D\uDDFA\uFE0F Saved map'),
                state.mapView && state.mapView.key === A.maps[sel.id] ? mapBox(state.mapView.svg, state.mapView.vars, `Saved map of ${sel.name}`) : null] : null);
        const focusBox = h('div', { class: 'rpgc-atlas-focus' },
            h('div', { class: 'rpgc-atlas-head' },
                focus.parent != null ? h('button', { class: 'rpgc-mini', title: 'Up one level', onclick: () => { state.atlasFocus = focus.parent; state.atlasSel = focus.id; render(); } }, '\u2191 Up') : null,
                h('b', null, focus.name), survBadge(focus.surv),
                hereId != null && here && focusId !== (here.children.length ? here.id : (here.parent != null ? here.parent : here.id)) ? h('button', { class: 'rpgc-mini', onclick: () => { state.atlasFocus = null; state.atlasSel = null; render(); } }, 'Where am I?') : null),
            focus.children.length ? body : h('p', { class: 'rpgc-note' }, 'Nothing listed inside this place.'),
            det);
        return section('atlas', 'Atlas', state.open, `${info.count} places`, trail, focusBox,
            info.skipped ? h('p', { class: 'rpgc-note' }, `${info.skipped} location ${info.skipped === 1 ? 'entry' : 'entries'} could not be read and ${info.skipped === 1 ? 'is' : 'are'} left out.`) : null);
    }

    // What you carry beyond the HUD: what the bot assumes (standard issue) and what the story handed you.
    function renderCarried(y) {
        const out = [];
        const carried = Array.isArray(y.carried) ? y.carried : [];
        if (y.standard && y.standard.items && y.standard.items.length) {
            out.push(h('div', { class: 'rpgc-row', title: y.standard.note || '' }, h('span', { class: 'lbl' }, 'Standard issue'),
                h('span', { class: 'rpgc-chips' }, y.standard.items.map(n => h('span', { class: 'rpgc-chip' }, n)))));
        }
        out.push(h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Carried'),
            carried.length ? h('span', { class: 'rpgc-chips' }, carried.map(it => h('span', { class: 'rpgc-chip', title: it.from === 'you' ? 'Added by you' : 'Handed over in the story' }, it.name, ' ',
                h('button', { class: 'rpgc-mini', 'aria-label': `Remove ${it.name}`, title: 'Not carried any more', onclick: () => send({ type: 'pocket', chatId: state.chatId, op: 'remove', key: it.key }) }, '\u2715'))))
                : h('span', { class: 'rpgc-note' }, 'Nothing yet. Things you are handed in the story land here.')));
        const inp = h('input', { type: 'text', placeholder: 'Add something you carry', 'aria-label': 'Add something you carry', style: 'flex:1;min-width:0' });
        const add = () => { const v = inp.value.trim(); if (!v) return; inp.value = ''; send({ type: 'pocket', chatId: state.chatId, op: 'add', name: v }); };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
        out.push(h('div', { class: 'rpgc-row' }, inp, h('button', { class: 'rpgc-mini', onclick: add }, 'Add')));
        return out;
    }

    function renderMagic() {
        const m = magicOf();
        const c = sysCfg().magic || {};
        if (!m || c.enabled === false) return null;
        const out = [];
        for (const v of m.pools) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.cur)} / ${fmtNum(v.max)}`)), levelBar(v.pct, v.level)));
        for (const v of m.meters) out.push(h('div', { class: 'rpgc-vital ' + v.level }, h('div', { class: 'head' }, h('span', { class: 'lbl' }, v.label), h('span', { class: 'num' }, `${fmtNum(v.pct)}%`), v.stage ? h('span', { class: 'stage' }, v.stage) : null), levelBar(v.pct, v.level)));
        for (const g of m.arts) out.push(h('div', { class: 'rpgc-abil' }, h('h4', null, g.category), h('div', { class: 'rpgc-chips' }, g.items.map(it => h('span', { class: 'rpgc-chip abil' }, it.label ? h('em', null, it.label + ': ') : null, it.name, it.level ? h('span', { class: 'lv' }, ` Lv ${it.level}`) : null, it.state ? h('span', { class: 'st' }, ` (${it.state})`) : null)))));
        for (const cd of m.cooldowns) out.push(h('p', { class: 'rpgc-note' }, '\u23F3 ' + cd));
        if (m.spellbook.length) out.push(h('div', { class: 'rpgc-abil' }, h('h4', null, `Spellbook (${m.spellbook.length})`),
            h('div', { class: 'rpgc-chips' }, m.spellbook.map(sp => h('span', { class: 'rpgc-chip abil', title: [sp.note, sp.from === 'fight' ? 'seen in a fight' : 'seen in the story', sp.seen > 1 ? `${sp.seen} times` : null].filter(Boolean).join(' \u00B7 ') },
                sp.name, sp.cost ? h('span', { class: 'st' }, ` ${sp.cost}`) : null)))));
        if (m.powers && m.powers.items.some(x => x.family !== 'grade' || x.entries.length)) out.push(renderPowers(m.powers, m));
        if (m.spirits) out.push(renderSpirits(m.spirits));
        const L = c.spellList === false ? null : m.spells;
        if (L) out.push(renderSpellList(L));
        const sp = m.spirits && m.spirits.contracts.length ? `${m.spirits.contracts.length} spirit${m.spirits.contracts.length === 1 ? '' : 's'}` : null;
        const pwn = m.powers ? m.powers.items.filter(x => x.family !== 'grade' || x.entries.length).length : 0;
        const pw = pwn ? `${pwn} power${pwn === 1 ? '' : 's'}` : null;
        return section('magic', 'Magic', state.open, [L ? `${L.counts.known} known \u00B7 ${L.total} listed` : m.spellbook.length ? `${m.spellbook.length} spells` : null, pw, sp].filter(Boolean).join(' \u00B7 ') || null, ...out);
    }

    // ───────── 2.6: Body & health: an X-ray body map, what the body can still do, the locks, what hurts, the Treat tray ─────────
    const HL_COLOR = { amputated: '#4a4a52', locked: '#b3122e', bleed: '#ff3b3b', infected: '#e2671f', dirty: '#e0a33a', raw: '#e0443e', sprain: '#e6c13a', bruise: '#9b6bd6', splint: '#4a9be0', treated: '#4fbf7a', permanent: '#8a8a92' };
    const HL_RANK = ['amputated', 'locked', 'bleed', 'infected', 'dirty', 'raw', 'sprain', 'bruise', 'splint', 'treated', 'permanent'];
    const HL_STATUS_WORD = { amputated: 'gone', locked: 'broken, unset', bleed: 'bleeding', infected: 'infected', dirty: 'dirty dressing', raw: 'raw', sprain: 'sprain or strain', bruise: 'bruised', splint: 'splinted', treated: 'tended', permanent: 'healed wrong / permanent' };
    function hlStatusOf(a) {
        if (a.kind === 'amputated') return 'amputated';
        if (a.kind === 'fracture' && a.state === 'raw') return 'locked';
        if (a.bleed) return 'bleed';
        if (a.infected) return 'infected';
        if (a.dressing === 'dirty') return 'dirty';
        if (a.state === 'permanent') return 'permanent';
        if (a.state === 'splinted' || a.dressing === 'splint') return 'splint';
        if (a.state !== 'raw') return 'treated';
        if (a.kind === 'sprain' || a.kind === 'strain') return 'sprain';
        if (a.kind === 'bruise') return 'bruise';
        return 'raw';
    }
    // zone shapes; the character faces you, so their right side is on your left (as on a medical chart)
    const HL_SHAPES = {
        head: '<ellipse cx="100" cy="28" rx="14" ry="17"/>', neck: '<rect x="93" y="45" width="14" height="10" rx="3"/>',
        chest: '<path d="M74 56Q100 50 126 56L124 100L76 100Z"/>', stomach: '<path d="M76 100L124 100L122 128L78 128Z"/>', pelvis: '<path d="M78 128L122 128L126 146L100 153L74 146Z"/>',
        r_upper_arm: '<path d="M74 57L61 60L54 104L66 106Z"/>', r_forearm: '<path d="M54 106L66 108L59 150L48 147Z"/>', r_hand: '<ellipse cx="52" cy="160" rx="6.5" ry="9.5"/>',
        r_thigh: '<path d="M75 147L99 153L97 206L81 206Z"/>', r_shin: '<path d="M81 208L97 208L94 264L84 264Z"/>', r_foot: '<path d="M83 266L95 266L97 281L75 283Z"/>',
        r_wing: '<path d="M70 62C42 34 14 40 4 76C16 72 22 82 26 92C36 84 44 90 50 100C56 88 64 80 70 80Z"/>', tail: '<path d="M106 142C110 170 120 196 120 222C120 244 124 258 134 264C142 268 150 266 154 258C158 254 162 254 164 258C162 266 154 276 142 278C128 280 116 274 112 262C108 250 108 238 108 224C108 200 94 176 90 146Z"/>',
    };
    // 2.8: a dragon's parts, after the owner's dragon-girl sheets: horns swept back, clawed wings with a scalloped edge, a thick
    // spined tail down to the floor
    const HL_DRAGON = {
        r_wing: '<path d="M72 62C60 46 44 30 30 18L22 6L33 13C22 38 10 64 2 102C10 96 16 100 18 110C24 100 32 102 36 114C42 104 50 104 54 116C58 104 64 94 72 90Z"/>',
        tail: '<path d="M107 140C112 170 124 196 124 222C124 242 128 256 138 262C146 266 154 262 158 256L168 252L162 262L172 264L160 270C150 280 128 282 116 270C106 260 106 242 106 226C106 200 92 176 88 146Z"/><path d="M118 192l8-5-3 9zM122 210l8-3-4 8zM124 228l8-2-5 7zM128 246l8 0-6 6z"/>',
    };
    HL_DRAGON.l_wing = `<g transform="translate(200,0) scale(-1,1)">${HL_DRAGON.r_wing}</g>`;
    for (const k of Object.keys(HL_SHAPES)) if (k.startsWith('r_')) {
        const l = 'l_' + k.slice(2);
        if (!HL_SHAPES[l]) HL_SHAPES[l] = `<g transform="translate(200,0) scale(-1,1)">${HL_SHAPES[k]}</g>`;
    }
    const HL_BONES = '<g class="bones"><circle cx="100" cy="27" r="11"/><path d="M94 25h4M102 25h4M96 34q4 3 8 0"/><path d="M100 46V146"/>'
        + '<path d="M80 62q20-8 40 0M78 70q22-8 44 0M78 78q22-8 44 0M79 86q21-7 42 0M81 94q19-6 38 0"/><path d="M79 131q21 18 42 0M83 140q17 10 34 0"/>'
        + '<path d="M70 60L61 104M61 108L55 148M63 108L58 148M91 151L89 206M89 210L88 262M86 268L80 280"/>'
        + '<g transform="translate(200,0) scale(-1,1)"><path d="M70 60L61 104M61 108L55 148M63 108L58 148M91 151L89 206M89 210L88 262M86 268L80 280"/></g>'
        + '<circle cx="61" cy="105" r="2.2"/><circle cx="139" cy="105" r="2.2"/><circle cx="89" cy="208" r="2.4"/><circle cx="111" cy="208" r="2.4"/></g>';
    // 2.8: the female chart: narrower shoulders, a bust, a narrower waist, wider hips
    const HL_SHAPES_F = {
        head: '<ellipse cx="100" cy="28" rx="13" ry="17"/>', neck: '<rect x="94" y="45" width="12" height="10" rx="3"/>',
        chest: '<path d="M78 56Q100 51 122 56L121 72C127 80 126 95 115 99L85 99C74 95 73 80 79 72Z"/>', stomach: '<path d="M85 99L115 99L113 115Q112 122 117 128L83 128Q88 122 87 115Z"/>',
        pelvis: '<path d="M83 128L117 128L129 145L100 153L71 145Z"/>',
        r_upper_arm: '<path d="M78 57L66 60L60 104L71 106Z"/>', r_forearm: '<path d="M60 106L71 108L63 150L53 147Z"/>', r_hand: '<ellipse cx="57" cy="160" rx="6" ry="9"/>',
        r_thigh: '<path d="M72 146L99 153L97 206L82 206Z"/>', r_shin: '<path d="M82 208L96 208L93 264L85 264Z"/>', r_foot: '<path d="M84 266L94 266L96 280L77 282Z"/>',
        r_wing: HL_SHAPES.r_wing, tail: HL_SHAPES.tail,
    };
    for (const k of Object.keys(HL_SHAPES_F)) if (k.startsWith('r_')) HL_SHAPES_F['l_' + k.slice(2)] = `<g transform="translate(200,0) scale(-1,1)">${HL_SHAPES_F[k]}</g>`;
    const HL_BONES_F = HL_BONES.replace(/M70 60L61 104M61 108L55 148M63 108L58 148/g, 'M74 60L65 104M65 108L59 148M67 108L62 148').replace('<circle cx="61" cy="105" r="2.2"/><circle cx="139" cy="105" r="2.2"/>', '<circle cx="65" cy="105" r="2.2"/><circle cx="135" cy="105" r="2.2"/>');
    // 2.8: the main arteries (the character faces you: their right side is on your left)
    const HL_ART_R = { carotid: 'M96 44L95 56', subclavian: 'M99 61Q88 57 76 61', brachial: 'M71 63L62 104', radial: 'M62 108L55 148', femoral: 'M93 140L89 204', popliteal: 'M89 206L89 218' };
    const HL_ART_RF = { ...HL_ART_R, subclavian: 'M99 61Q90 57 80 61', brachial: 'M75 63L66 104', radial: 'M66 108L58 148', femoral: 'M93 141L89 204' };
    const HL_ART_LABEL = { carotid: 'carotid artery', subclavian: 'subclavian artery', aorta: 'aorta', brachial: 'brachial artery', radial: 'radial artery', femoral: 'femoral artery', popliteal: 'popliteal artery' };
    function hlArterySvg(H, female) {
        const R = female ? HL_ART_RF : HL_ART_R;
        const hot = new Set((H.affl || []).filter(a => a.artery && a.bleed >= 2).map(a => `${a.artery.key}|${a.artery.side || ''}`));
        const show = !H.cfg || H.cfg.arteries !== false;
        if (!show && !hot.size) return '';
        const line = (key, side, d) => {
            const on = hot.has(`${key}|${side}`) || hot.has(`${key}|`);
            if (!show && !on) return '';
            const t = `${side === 'l' ? 'Left ' : side === 'r' ? 'Right ' : ''}${HL_ART_LABEL[key]}${on ? ': open, bleeding' : ''}`;
            return `<path class="art${on ? ' hot' : ''}" d="${d}"${side === 'l' ? ' transform="translate(200,0) scale(-1,1)"' : ''}><title>${t}</title></path>`;
        };
        let out = line('aorta', '', 'M100 62C104 55 109 58 106 64L101 70V130');
        for (const [k, d] of Object.entries(R)) out += line(k, 'r', d) + line(k, 'l', d);
        return `<g class="arteries">${out}</g>`;
    }
    // 2.7: organs on the X-ray (the character faces you: their right eye is on your left)
    const HL_ORGAN_SHAPE = {
        brain: '<ellipse cx="100" cy="22" rx="8" ry="6"/>', r_eye: '<circle cx="94.5" cy="29" r="2.6"/>', l_eye: '<circle cx="105.5" cy="29" r="2.6"/>',
        r_ear: '<ellipse cx="85.6" cy="30" rx="2" ry="4"/>', l_ear: '<ellipse cx="114.4" cy="30" rx="2" ry="4"/>',
        r_lung: '<ellipse cx="89" cy="77" rx="9" ry="15"/>', l_lung: '<ellipse cx="111" cy="77" rx="9" ry="15"/>', heart: '<path d="M104 78c3-5 10-2 8 4l-6 7-6-7c-2-6 3-8 4-4z"/>',
        liver: '<ellipse cx="91" cy="106" rx="11" ry="5.5"/>', stomach: '<ellipse cx="109" cy="108" rx="8" ry="6"/>', spleen: '<ellipse cx="119" cy="104" rx="3" ry="5"/>',
        kidneys: '<ellipse cx="92" cy="117" rx="3" ry="5"/><ellipse cx="108" cy="117" rx="3" ry="5"/>', guts: '<ellipse cx="100" cy="124" rx="14" ry="5.5"/>',
        gate: '<circle cx="100" cy="95" r="5"/><circle cx="100" cy="95" r="2"/>', core: '<path d="M100 82l7 8-7 8-7-8z"/>', third_eye: '<ellipse cx="100" cy="17" rx="3.4" ry="2"/>',
        horns: '<path d="M92 15C88 10 87 6 89 1C91 6 93 10 96 13Z"/><path d="M108 15C112 10 113 6 111 1C109 6 107 10 104 13Z"/>',
        horns_dragon: '<path d="M92 17C84 12 80 4 84 -6C78 0 78 10 82 16C85 20 88 22 91 22Z"/><path d="M108 17C116 12 120 4 116 -6C122 0 122 10 118 16C115 20 112 22 109 22Z"/><path d="M87 27L77 22L80 27L75 30L87 31Z"/><path d="M113 27L123 22L120 27L125 30L113 31Z"/>',
    };
    // 2.9: the female chart's waist is narrower: the belly organs move in so none sits outside the body
    const HL_ORGAN_SHAPE_F = {
        ...HL_ORGAN_SHAPE,
        r_lung: '<ellipse cx="90" cy="77" rx="8.5" ry="14"/>', l_lung: '<ellipse cx="110" cy="77" rx="8.5" ry="14"/>',
        liver: '<ellipse cx="94" cy="105" rx="7" ry="4.6"/>', stomach: '<ellipse cx="107" cy="107" rx="5.6" ry="4.8"/>', spleen: '<ellipse cx="111.6" cy="101" rx="1.8" ry="3.2"/>',
        kidneys: '<ellipse cx="93" cy="117" rx="2.6" ry="4.4"/><ellipse cx="107" cy="117" rx="2.6" ry="4.4"/>', guts: '<ellipse cx="100" cy="124" rx="11.5" ry="4.8"/>',
    };
    const HL_ORGAN_COLOR = { hurt: '#e6c13a', damaged: '#e0443e', broken: '#8a8a92', lost: '#4a4a52' };
    // 2.9: a broken bone is drawn on the bone: [x, y, crack angle] for their right side (the left is mirrored)
    const HL_BREAK_AT = {
        head: [100, 14, 70], neck: [100, 50, 0], chest: [86, 79, 90], stomach: [100, 112, 0], pelvis: [90, 138, 60],
        r_upper_arm: [65.5, 82, 191.6], r_forearm: [59.2, 128, 187.8], r_hand: [52, 160, 185], r_thigh: [90, 178.5, 182.1], r_shin: [88.5, 236, 181.1], r_foot: [83, 274, 206.6],
    };
    const HL_BREAK_AT_F = { ...HL_BREAK_AT, r_upper_arm: [69.5, 82, 191.6], r_forearm: [63.2, 128, 187.8], r_hand: [57, 160, 185] };
    const HL_BREAK_RANK = ['raw', 'splint', 'mend', 'crooked'];
    function hlBreakSvg(H, female, gone) {
        const AT = female ? HL_BREAK_AT_F : HL_BREAK_AT;
        const by = {};
        for (const a of H.affl || []) if (a.kind === 'fracture' && a.zone && a.state !== 'healed' && !gone.has(a.zone)) {
            const st = a.state === 'raw' ? 'raw' : a.state === 'permanent' ? 'crooked' : (a.state === 'splinted' || a.dressing === 'splint') ? 'splint' : 'mend';
            if (!by[a.zone] || HL_BREAK_RANK.indexOf(st) < HL_BREAK_RANK.indexOf(by[a.zone].st)) by[a.zone] = { st, what: a.what || a.name || 'broken bone' };
        }
        const out = [];
        for (const [z, b] of Object.entries(by)) {
            const side = z.startsWith('l_') ? 'l' : 'r', base = AT[side === 'l' ? 'r_' + z.slice(2) : z];
            if (!base) continue;
            const [x, y, r] = side === 'l' ? [200 - base[0], base[1], 180 - base[2]] : base;
            const word = { raw: 'broken, not set', splint: 'broken, splinted', mend: 'broken, mending', crooked: 'healed crooked' }[b.st];
            out.push(`<g class="brk ${b.st}" transform="translate(${x} ${y}) rotate(${r})"><title>${pEsc(hlZn(z))}: ${word} (${pEsc(b.what)})</title>`
                + '<path class="gap" d="M-6.5 0H6.5"/><path class="crack" d="M-6 -1.2L-3 1.3L-.5 -1.4L2 1.2L4.5 -1L6.5 .6"/><path class="chip" d="M-2 -3.6l1.3 1.7M2.4 3.4l-1-1.7"/>'
                + (b.st === 'splint' ? '<rect class="spl" x="-1" y="-8.5" width="1.8" height="17" rx=".8" transform="translate(-7 0)"/><rect class="spl" x="-1" y="-8.5" width="1.8" height="17" rx=".8" transform="translate(7 0)"/>' : '')
                + (b.st === 'crooked' ? '<path class="kink" d="M0 -9L2.4 0L0 9"/>' : '') + '</g>');
        }
        return out.length ? `<g class="breaks">${out.join('')}</g>` : '';
    }
    let hlMaskN = 0;
    function hlOrganSvg(H, female) {
        const out = [];
        const OS = female ? HL_ORGAN_SHAPE_F : HL_ORGAN_SHAPE;
        for (const o of H.organs || []) {
            const shape = (o.key === 'horns' && H.bio && H.bio.dragon && OS.horns_dragon) || OS[o.key];
            if (!shape) continue;
            if (o.key === 'horns' && o.status === 'hidden') continue;           // tucked away: nothing to draw
            const bad = !!HL_ORGAN_COLOR[o.status];
            out.push(`<g class="org${o.special ? ' special' : ''}${bad ? ' bad' : ''}${o.status === 'out' ? ' out' : ''}" style="${bad ? `--oc:${HL_ORGAN_COLOR[o.status]}` : ''}"><title>${o.label}: ${o.status === 'ok' ? 'fine' : o.status}</title>${shape}</g>`);
        }
        return out.join('');
    }
    function hlBodySvg(H, selected) {
        if (H.bio && H.bio.plan === 'slime') {
            // a slime in its own shape: one body, and the core inside it
            const worst = H.affl.map(hlStatusOf).sort((a, b) => HL_RANK.indexOf(a) - HL_RANK.indexOf(b))[0] || null;
            const lbl = `Body${worst ? ': ' + HL_STATUS_WORD[worst] : ': fine'}`;
            return '<svg viewBox="0 0 200 290" class="hlmap" role="group" aria-label="Your body: press it to see its wounds">'
                + '<defs><filter id="hlglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
                + '<rect class="bg" x="0" y="0" width="200" height="290" rx="10"/><g class="grid">' + Array.from({ length: 13 }, (_, i) => `<path d="M0 ${i * 24 + 6}H200"/>`).join('') + '</g>'
                + '<path class="gelmap" d="M12 252C10 192 48 146 100 144C152 146 190 192 188 252C140 262 60 262 12 252Z"/>'
                + `<g class="hz slimez${worst ? ' hurt' : ''}${selected === 'chest' ? ' sel' : ''}" data-zone="chest" tabindex="0" role="button" aria-label="${lbl}" style="${worst ? `--hz:${HL_COLOR[worst]}` : ''}"><title>${lbl}</title><path d="M12 252C10 192 48 146 100 144C152 146 190 192 188 252C140 262 60 262 12 252Z"/></g>`
                + H.affl.slice(0, 8).map((a, i) => `<circle class="slimewound" cx="${[72, 128, 100, 44, 156, 84, 116, 100][i]}" cy="${[196, 200, 170, 230, 232, 244, 244, 160][i]}" r="${4 + Math.min(3, a.sev || 0) * 1.6}" style="--wc:${HL_COLOR[hlStatusOf(a)]}"><title>${a.text}</title></circle>`).join('')
                + `<g transform="translate(0,128)">${hlOrganSvg({ organs: (H.organs || []).filter(o => o.key === 'core') })}</g></svg>`;
        }
        const byZone = {};
        for (const a of H.affl) if (a.zone) {
            const st = hlStatusOf(a);
            if (!byZone[a.zone] || HL_RANK.indexOf(st) < HL_RANK.indexOf(byZone[a.zone])) byZone[a.zone] = st;
        }
        const locked = new Set(H.locks.flatMap(l => l.zones || (l.zone ? [l.zone] : [])));
        const female = H.figure === 'female' && !(H.bio && (H.bio.quad || H.bio.slime));
        const SH = female ? HL_SHAPES_F : HL_SHAPES;
        const back = (z) => /wing/.test(z) || z === 'tail';
        const zones = Object.keys(SH).filter(z => (!/wing/.test(z) || H.bio.wings) && (z !== 'tail' || H.bio.tail)).sort((a, b) => back(b) - back(a));
        const DRG = H.bio && H.bio.dragon ? HL_DRAGON : null;
        const shp = (z) => (DRG && DRG[z]) || SH[z];
        // 2.8: a part that is gone (cut off, torn off, beheaded) is drawn as missing, unless a prosthetic took its place
        const gone = new Set((H.affl || []).filter(a => a.kind === 'amputated' && !a.prosthetic && a.zone).flatMap(a => {
            const z = a.zone, s0 = z.slice(0, 2);
            return /_(upper_arm)$/.test(z) ? [z, s0 + 'forearm', s0 + 'hand'] : /_forearm$/.test(z) ? [z, s0 + 'hand'] : /_thigh$/.test(z) ? [z, s0 + 'shin', s0 + 'foot'] : /_shin$/.test(z) ? [z, s0 + 'foot'] : z === 'head' ? ['head'] : [z];
        }));
        const label = (z) => { const n = hlZn(z); const st = byZone[z]; return `${n}${st ? ': ' + HL_STATUS_WORD[st] : ': fine'}`; };
        const shape = (z) => `<g class="hz${byZone[z] ? ' hurt' : ''}${gone.has(z) ? ' gone' : ''}${selected === z ? ' sel' : ''}" data-zone="${z}" tabindex="0" role="button" aria-label="${label(z)}${gone.has(z) ? ' (gone)' : ''}" style="${byZone[z] ? `--hz:${HL_COLOR[byZone[z]]}` : ''}"><title>${label(z)}${gone.has(z) ? ' \u2014 gone' : ''}</title>${shp(z)}</g>`;
        const lockMarks = [...locked].map(z => { const c = HL_LOCK_AT[z]; return c ? `<text class="lockmark" x="${c[0]}" y="${c[1]}" aria-hidden="true">🔒</text>` : ''; }).join('');
        const undead = H.bio.undead;
        return `<svg viewBox="0 0 200 290" class="hlmap${undead ? ' undead' : ''}" role="group" aria-label="Your body: press a part to see its wounds">`
            + '<defs><filter id="hlglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'
            + '<rect class="bg" x="0" y="0" width="200" height="290" rx="10"/><g class="grid">' + Array.from({ length: 13 }, (_, i) => `<path d="M0 ${i * 24 + 6}H200"/>`).join('') + '</g>'
            + (gone.size ? `<mask id="hlbm${++hlMaskN}"><g fill="#fff" stroke="#fff" stroke-width="2">${zones.filter(z => !gone.has(z)).map(shp).join('')}</g></mask>` : '')
            + `<g class="flesh">${zones.filter(z => !gone.has(z)).map(shp).join('')}</g>${gone.size ? `<g mask="url(#hlbm${hlMaskN})">${female ? HL_BONES_F : HL_BONES}</g>` : (female ? HL_BONES_F : HL_BONES)}<g class="zones">${zones.map(shape).join('')}</g>${hlArterySvg(H, female)}${hlBreakSvg(H, female, gone)}<g class="organs">${hlOrganSvg(gone.size ? { ...H, organs: (H.organs || []).filter(o => !gone.has(o.zone)) } : H, female)}</g>${lockMarks}</svg>`;
    }
    const HL_ZONE_FE = { head: 'Head', neck: 'Neck', chest: 'Chest', stomach: 'Stomach', pelvis: 'Hips', l_upper_arm: 'Left upper arm', l_forearm: 'Left forearm', l_hand: 'Left hand', r_upper_arm: 'Right upper arm', r_forearm: 'Right forearm', r_hand: 'Right hand',
        l_thigh: 'Left thigh', l_shin: 'Left shin', l_foot: 'Left foot', r_thigh: 'Right thigh', r_shin: 'Right shin', r_foot: 'Right foot', l_wing: 'Left wing', r_wing: 'Right wing', tail: 'Tail' };
    // four-legged bodies: the chart's arms are the forelegs
    let hlQuad = false, hlSlime = false;
    const hlZn = (z) => { if (hlSlime) return 'Body'; const n = HL_ZONE_FE[z] || z; return hlQuad ? n.replace('upper arm', 'foreleg (upper)').replace('forearm', 'foreleg').replace('hand', 'forepaw').replace('thigh', 'hind leg (upper)').replace('shin', 'hind leg').replace('foot', 'hind paw') : n; };
    const HL_LOCK_AT = { head: [100, 30], chest: [100, 82], l_shin: [140, 238], r_shin: [60, 238], l_forearm: [158, 130], r_forearm: [42, 130], l_hand: [158, 165], r_hand: [42, 165], l_wing: [180, 70], r_wing: [20, 70], l_foot: [140, 278], r_foot: [60, 278] };
    const HL_DEPTH_WORDS = [['none', 'None: the wounds only, no locks and no meters'], ['light', 'Light: wounds and the locks only'], ['medium', 'Medium: + blood, water, food, sleep, sanity, cold and heat, sickness'], ['heavy', 'Heavy: + stamina, strain, stress'], ['custom', 'Custom: you set each part below']];
    function hlTrayRows(H) {
        if (!H.tray || !H.tray.length) return null;
        const target = (state.hlZone && H.affl.find(a => a.zone === state.hlZone)) || H.affl.find(a => a.bleed) || H.affl.find(a => a.state === 'raw') || H.affl[0] || null;
        const where = target && target.zone ? hlZn(target.zone).toLowerCase() : null;
        const needsWound = new Set(['bandage', 'clean', 'splint', 'tourniquet', 'stitch', 'remove_object', 'healed_by_magic']);
        const say = (t) => ({ bandage: `I bandage my ${where} with the ${t.item}.`, clean: `I clean the wound on my ${where} with the ${t.item}.`, splint: `I splint my ${where} with the ${t.item}.`, tourniquet: `I tie the ${t.item} tight above the wound on my ${where}.`,
            stitch: `I stitch the wound on my ${where} with the ${t.item}.`, remove_object: `I work what is stuck in my ${where} out with the ${t.item}.`, healed_by_magic: `I use the ${t.item} on my ${where}.`,
            painkiller: `I take the ${t.item}.`, drink: `I drink from the ${t.item}.`, eat: `I eat the ${t.item}.` })[t.act];
        const btns = H.tray.filter(t => !needsWound.has(t.act) || where).map(t => h('button', { class: 'rpgc-btn', title: say(t),
            onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'care', act: t.act === 'drink' ? 'drank' : t.act === 'eat' ? 'ate' : t.act, where: needsWound.has(t.act) ? where : '', say: say(t) }) },
            `${t.label}${needsWound.has(t.act) ? ` — ${where}` : ''}`, h('small', null, ` (${t.item})`)));
        if (!btns.length) return null;
        return h('div', { class: 'rpgc-set' }, h('h5', null, 'Treat with what you carry'), h('div', { class: 'rpgc-row rpgc-hltray' }, ...btns),
            h('p', { class: 'rpgc-note' }, `Press a part on the body first to choose where. It goes into your next reply as what you did; the story decides how well it goes.${H.ops && H.ops.length ? ` Done: ${H.ops.map(o => o.say).filter(Boolean).slice(-2).join(' ')}` : ''}`),
            H.ops && H.ops.length ? h('button', { class: 'rpgc-btn', onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'undo' }) }, 'Undo the last') : null);
    }
    const hlClock = (m) => m <= 0 ? 'now' : m < 90 ? `about ${Math.max(1, Math.round(m / 5) * 5)} min` : `about ${Math.round(m / 30) / 2} h`;
    const HL_PROS_KINDS = [['', 'No prosthetic'], ['peg leg', 'Peg leg'], ['hook', 'Hook'], ['metal limb', 'Metal limb'], ['magic limb', 'Magic limb'], ['prosthetic', 'Prosthetic'], ['glass eye', 'Glass eye']];
    function hlProsSelect(H, a) {
        const cur = (H.pros && H.pros[a.limb]) || null;
        const val = cur ? cur.kind : (a.prosthetic ? a.prosthetic.kind : '');
        const sel = h('select', { class: 'rpgc-mini', 'aria-label': 'Prosthetic', title: 'A peg leg, a hook, a metal arm: some use back, never bleeds, needs repairs (Kenshi, RimWorld)',
            onchange: (e) => send({ type: 'health_edit', chatId: state.chatId, op: 'prosthetic', limb: a.limb, kind: e.target.value }) },
            ...HL_PROS_KINDS.filter(([k]) => /leg|foot/.test(a.limb) ? k !== 'hook' && k !== 'glass eye' : k !== 'peg leg' && k !== 'glass eye').map(([k, l]) => h('option', { value: k }, l)));
        sel.value = val;
        const brk = val ? h('button', { class: 'rpgc-mini' + (cur && cur.broken ? ' on' : ''), title: 'Broken: it needs a repair', onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'prosthetic', limb: a.limb, kind: val, broken: !(cur && cur.broken) }) }, cur && cur.broken ? 'Repaired' : 'Broken') : null;
        return [sel, brk];
    }
    // 2.7: organs (the race's own first), and what is lost for good
    function hlOrganRows(H) {
        const orgs = H.organs || [];
        const gone = H.affl.filter(a => a.kind === 'amputated');
        if (!orgs.length && !gone.length) return null;
        const WORD = { ok: 'fine', hurt: 'hurt', damaged: 'damaged', broken: 'broken', lost: 'lost', hidden: 'hidden', out: 'out' };
        const chip = (o) => h('span', { class: `rpgc-chip rpgc-org st-${o.status}${['damaged', 'broken', 'lost'].includes(o.status) ? ' hot' : ''}`, title: [o.what, o.why].filter(Boolean).join(' \u2014 ') || null }, `${o.label} \u00B7 ${WORD[o.status] || o.status}`);
        const special = orgs.filter(o => o.special), inner = orgs.filter(o => !o.special), badInner = inner.filter(o => o.status !== 'ok');
        return h('div', { class: 'rpgc-set' }, h('h5', null, 'Organs'),
            special.length ? h('div', { class: 'rpgc-row' }, ...special.map(chip)) : null,
            badInner.length ? h('div', { class: 'rpgc-row' }, ...badInner.map(chip)) : null,
            inner.length ? h('p', { class: 'rpgc-note' }, badInner.length ? `The other ${inner.length - badInner.length} organs are fine.` : 'Brain, eyes, ears, heart, lungs, liver, stomach, spleen, kidneys and guts: all fine.')
                : h('p', { class: 'rpgc-note' }, H.bio && H.bio.slime ? 'A slime has no organs but its core.' : H.bio && H.bio.undead ? 'Undead: no soft organs left.' : H.bio && H.bio.spirit ? 'A spirit has no flesh.' : ''),
            gone.length ? h('p', { class: 'rpgc-note' }, h('b', null, 'Lost for good: '), gone.map(a => a.zone ? hlZn(a.zone).toLowerCase() : a.text).join(', ')) : null);
    }
    // 2.7: your height, weight and measurements (the HUD's own lines win); the race's size from its book
    function hlLen(cm, imp) {
        if (cm == null) return '\u2014';
        if (!imp) return cm >= 1000 ? `${(cm / 100).toFixed(1)} m` : `${Math.round(cm)} cm`;
        const inch = Math.round(cm / 2.54);
        return inch >= 48 ? `${Math.floor(inch / 12)} ft ${inch % 12} in` : `${inch} in`;
    }
    const hlMass = (kg, imp) => kg == null ? '\u2014' : imp ? `${Math.round(kg / 0.45359)} lb` : `${Math.round(kg)} kg`;
    function hlMeasureRows(H) {
        const M = H.measure;
        if (!M) return null;
        const imp = H.units === 'imperial';
        const keys = M.minor ? ['height', 'weight'] : ['height', 'weight', 'bust', 'waist', 'hips'];
        const NAME = { height: 'Height', weight: 'Weight', bust: 'Bust', waist: 'Waist', hips: 'Hips' };
        const show = (k) => k === 'weight' ? hlMass(M[k], imp) : hlLen(M[k], imp);
        const editing = !!state.hlMeasEdit;
        const vals = state.hlMeasVals || (state.hlMeasVals = {});
        const cells = keys.map(k => h('div', null, h('small', null, NAME[k]), editing
            ? h('input', { type: 'text', 'aria-label': NAME[k], value: vals[k] ?? (M[k] == null ? '' : show(k)), placeholder: k === 'weight' ? (imp ? 'lb' : 'kg') : (imp ? 'ft and in, or in' : 'cm'), oninput: (e) => { vals[k] = e.target.value; } })
            : h('b', null, show(k)), !editing && M.src && M.src[k] === 'hud' ? h('small', null, ' from the HUD') : null));
        const save = () => { send({ type: 'health_edit', chatId: state.chatId, op: 'measure', values: { ...vals }, form: M.form || undefined }); state.hlMeasEdit = false; state.hlMeasVals = {}; };
        return h('div', { class: 'rpgc-set' }, h('h5', null, 'Your measurements', M.form ? ` · in ${M.form}` : ''),
            h('div', { class: 'rpgc-hlmeas' }, ...cells),
            h('div', { class: 'rpgc-row' }, editing ? h('button', { class: 'rpgc-btn primary', onclick: save }, 'Save') : h('button', { class: 'rpgc-btn', onclick: () => { state.hlMeasEdit = true; state.hlMeasVals = {}; render(); } }, 'Edit'),
                editing ? h('button', { class: 'rpgc-btn', onclick: () => { state.hlMeasEdit = false; state.hlMeasVals = {}; render(); } }, 'Cancel') : null),
            editing ? h('p', { class: 'rpgc-note' }, `Type ${imp ? '5 ft 9, 69 in or 154 lb' : '175, 1.75 m or 62 kg'}; any unit works. Empty clears it. A line the HUD prints (Height:, Weight:, Measurements:) always wins.`) : null,
            M.minor ? h('p', { class: 'rpgc-note' }, 'Bust, waist and hips are not kept for a character under 18.') : null,
            M.race ? h('p', { class: 'rpgc-note' }, h('b', null, 'Your race in its book: '), M.race.say || `about ${M.race.heightM} m`) : null);
    }
    function renderHealth() {
        const H = state.hms && state.hms.health;
        if (!H || (sysCfg().health || {}).enabled === false) return null;
        hlQuad = !!(H.bio && H.bio.quad);
        hlSlime = !!(H.bio && H.bio.plan === 'slime');
        const out = [];
        // 2.8: how alive you are, and how long the blood lasts; then what is gone, loud
        if (H.vital && H.vital.rank >= 1 && (!H.cfg || H.cfg.vital !== false)) out.push(h('div', { class: `rpgc-vital v${H.vital.rank}`, role: 'status' },
            h('span', { class: 'steps', 'aria-hidden': 'true' }, ...[1, 2, 3, 4].map(i => h('i', { class: i <= H.vital.rank ? 'on' : '' }))),
            h('b', null, H.vital.word), H.vital.clock != null ? h('span', { class: 'clock' }, ` ⏱ ${hlClock(H.vital.clock)} to death without help`) : null,
            H.vital.why && H.vital.why.length ? h('small', null, H.vital.why.join(' · ')) : null));
        if (H.gone && H.gone.length) out.push(h('div', { class: 'rpgc-hlgone', role: 'note' }, ...H.gone.map(g => h('div', null, g))));
        if (H.shape && H.shape.form !== 'own') out.push(h('p', { class: 'rpgc-note' }, `In ${H.shape.formLabel || 'another form'} now: the chart shows this shape (the Race card sets it).`));
        if (hlQuad) out.push(h('p', { class: 'rpgc-note' }, 'A four-legged body, drawn on the chart: the arms are your forelegs.'));
        if (hlSlime) out.push(h('p', { class: 'rpgc-note' }, 'A slime: one body of jelly and a core. Every wound lands on the one body.'));
        out.push(h('p', { class: 'rpgc-note' }, H.mode === 'read' ? 'Read from the HUD: the bot keeps your wounds and conditions. This card adds none; it shows what they mean for your body.' : 'Kept by the extension from the story: the injuries, a short note of what happened to your body, and the clock on the HUD.'));
        const youP = state.hms && state.hms.you;
        if (youP && youP.hpHidden && youP.hpHidden.length) out.push(h('p', { class: 'rpgc-note' }, `${youP.hpHidden.join(', ')} is not shown in this world: your body is your health here. (Settings → Body & health → HP.)`));
        const map = h('div', { class: 'rpgc-hlmap' + (H.bio && H.bio.undead ? ' undead' : '') + (H.bio && H.bio.bones === false ? ' nobones' : '') + (H.bio && H.bio.slime ? ' gel' : '') });
        map.innerHTML = hlBodySvg(H, state.hlZone || null);
        const pick = (z) => { state.hlZone = state.hlZone === z ? null : z; render(); };
        map.addEventListener('click', (e) => { const g = e.target.closest && e.target.closest('[data-zone]'); if (g) pick(g.getAttribute('data-zone')); });
        map.addEventListener('keydown', (e) => { if (e.key !== 'Enter' && e.key !== ' ') return; const g = e.target.closest && e.target.closest('[data-zone]'); if (g) { e.preventDefault(); pick(g.getAttribute('data-zone')); } });
        const capRow = (c) => h('div', { class: 'rpgc-hlcap' + (c.value < 30 ? ' crit' : c.value < 70 ? ' low' : '') , title: c.why.length ? `Lowered by: ${c.why.join(', ')}` : 'Not lowered' },
            h('span', { class: 'lbl' }, c.name), h('span', { class: 'bar', role: 'meter', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': String(c.value), 'aria-label': `${c.name} ${c.value}%` }, h('i', { style: `width:${c.value}%` })),
            h('span', { class: 'val' }, `${c.value}%`), c.why.length && c.value < 100 ? h('small', { class: 'why' }, c.why.join(', ')) : null);
        const meter = (m) => h('span', { class: 'rpgc-chip rpgc-hlmeter' + (m.bad ? ' hot' : ''), title: m.key === 'pain' && m.raw !== m.value ? `Felt ${m.value}% (really ${m.raw}%)` : m.key === 'sanity' ? '100 is sane, 0 is lost to madness' : null }, `${m.name} ${m.value}${m.unit || '%'}${m.word ? ` \u00B7 ${m.word}` : ''}`);
        out.push(h('div', { class: 'rpgc-hlbody' }, map, h('div', { class: 'rpgc-hlside' },
            h('div', { class: 'rpgc-hlcaps' }, ...H.capacities.map(capRow)),
            H.meters.length || H.temp ? h('div', { class: 'rpgc-row rpgc-hlmeters' }, ...H.meters.map(meter),
                H.temp ? h('span', { class: 'rpgc-chip rpgc-hlmeter' + (H.temp.word ? ' hot' : ''), title: `Feels like, here${H.temp.inside ? ' (indoors takes the edge off)' : ''}. ${H.temp.coldMin ? `${H.temp.coldMin} min in the cold. ` : ''}${H.temp.heatMin ? `${H.temp.heatMin} min in the heat.` : ''}`.trim() },
                    `🌡 ${Math.round(H.temp.feels)}°C${H.temp.wet ? ' · wet' : ''}${H.temp.word ? ` · ${H.temp.word}` : ''}`) : null) : null,
            !(H.bio && (H.bio.quad || H.bio.slime)) ? h('button', { class: 'rpgc-mini', title: 'Which body chart (Settings → Body & health)', onclick: () => { const c = (S().hmsSystems = S().hmsSystems || {}); c.health = c.health || {}; c.health.figure = H.figure === 'female' ? 'male' : 'female'; saveSettings(); } },
                H.figure === 'female' ? '♀ Female chart' : '♂ Male chart', H.figureSrc === 'hud' ? ' (from the HUD)' : '') : null,
            H.buffs.length ? h('div', { class: 'rpgc-row' }, ...H.buffs.map(b => h('span', { class: 'rpgc-chip ok', title: b.text }, `💊 ${b.name} · ${b.left} min`))) : null)));
        if (H.locks.length) out.push(h('div', { class: 'rpgc-hllocks', role: 'note' }, h('b', null, '🔒 What your body cannot do'), h('ul', null, ...H.locks.map(l => h('li', null, l.text))),
            h('small', null, 'Structure, not pain: no painkiller, adrenaline or willpower lifts these. The story is told so.')));
        if (H.misery.length) out.push(h('div', { class: 'rpgc-set' }, h('h5', null, 'Hurting'), h('ul', { class: 'rpgc-wlist' }, ...H.misery.map(m => h('li', null, m)))));
        const list = H.affl.filter(a => !state.hlZone || a.zone === state.hlZone);
        out.push(h('div', { class: 'rpgc-set' }, h('h5', null, state.hlZone ? `${hlZn(state.hlZone)} (${list.length})` : `Wounds (${H.affl.length})`,
            state.hlZone ? h('button', { class: 'rpgc-mini', onclick: () => pick(state.hlZone) }, 'Show all') : null),
            list.length ? h('ul', { class: 'rpgc-list rpgc-hlwounds' }, ...list.map(a => { const st = hlStatusOf(a); return h('li', { style: `--hz:${HL_COLOR[st]}` },
                h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', { class: 'grow' }, h('b', null, a.zone ? hlZn(a.zone) : 'Body'), ' — ', a.text),
                // a bleeding wound says how hard in its one chip; a tended wound that bleeds again gets a second
                st === 'bleed' && a.bleed ? h('span', { class: 'rpgc-chip hot' }, ['', 'light bleed', 'bleeding', 'heavy bleed', 'ARTERIAL'][a.bleed]) : h('span', { class: 'rpgc-chip' }, HL_STATUS_WORD[st]),
                a.bleed && st !== 'bleed' ? h('span', { class: 'rpgc-chip hot' }, ['', 'light bleed', 'bleeding', 'heavy bleed', 'ARTERIAL'][a.bleed]) : null,
                a.artery ? h('span', { class: 'rpgc-chip hot', title: a.artery.junction ? 'A tourniquet cannot go here: pressure and packing' : 'A tourniquet above it stops it' }, `♥ ${a.artery.label}`) : null,
                a.prosthetic ? h('span', { class: 'rpgc-chip' + (a.prosthetic.broken ? ' hot' : '') }, `${a.prosthetic.kind}${a.prosthetic.broken ? ' · broken' : ''}`) : null,
                a.venom ? h('span', { class: 'rpgc-chip hot' }, 'venom') : null,
                a.dressing && a.dressing !== 'none' && a.dressing !== 'splint' ? h('span', { class: 'rpgc-chip' + (a.dressing === 'dirty' ? ' hot' : '') }, a.dressing === 'clean' ? 'clean dressing' : a.dressing) : null,
                a.fresh ? h('span', { class: 'rpgc-chip hot', title: 'Sprinting, jumping or a hit tears it open' }, 'fresh') : null,
                a.lodged ? h('span', { class: 'rpgc-chip hot' }, 'something inside') : null,
                // 2.8: fix a ghost injury by hand: the story is told on the next reply
                h('span', { class: 'rpgc-hlfix' },
                    a.kind === 'amputated' && a.limb ? hlProsSelect(H, a) : null,
                    a.state === 'raw' && a.kind !== 'amputated' ? h('button', { class: 'rpgc-mini', title: 'Mark it treated (bandaged, splinted)', onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'mark', key: a.key, as: 'treated', say: `${a.zone ? hlZn(a.zone) : 'The'} wound (${a.text}) has been treated.` }) }, 'Treated') : null,
                    a.kind !== 'amputated' ? h('button', { class: 'rpgc-mini', title: 'Mark it healed: it leaves the body', onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'mark', key: a.key, as: 'healed', say: `${a.zone ? hlZn(a.zone) : 'The'} wound (${a.text}) is healed now.` }) }, 'Healed') : null)); })) : h('p', { class: 'rpgc-note' }, state.hlZone ? 'Nothing wrong here.' : 'No wounds.'),
            H.ops && H.ops.some(o => o.mark) ? h('p', { class: 'rpgc-note' }, 'Marked by hand: ', H.ops.filter(o => o.mark).slice(-2).map(o => o.say).join(' '), ' ', h('button', { class: 'rpgc-mini', onclick: () => send({ type: 'health_edit', chatId: state.chatId, op: 'undo' }) }, 'Undo the last')) : null));
        if (H.mode === 'read' && H.conds && H.conds.length) out.push(h('div', { class: 'rpgc-set' }, h('h5', null, 'Conditions on the HUD'), h('div', { class: 'rpgc-row' }, ...H.conds.map(c => h('span', { class: 'rpgc-chip' + (c.read ? ' warm' : '') }, c.name, c.stage ? ` · ${c.stage}` : '')))));
        const orgs = hlOrganRows(H);
        if (orgs) out.push(orgs);
        const tray = hlTrayRows(H);
        if (tray) out.push(tray);
        const meas = hlMeasureRows(H);
        if (meas) out.push(meas);
        if (H.bio && (H.bio.undead || !H.bio.bleeds || !H.bio.bones)) out.push(h('p', { class: 'rpgc-note' }, `Your race (${H.race || 'your body'}): ${[!H.bio.bleeds ? 'no blood to lose' : null, !H.bio.pains ? 'feels no pain' : null, !H.bio.eats ? 'no hunger or thirst' : null, !H.bio.tires ? 'never tires' : null, !H.bio.bones ? 'no bones to break' : null].filter(Boolean).join(', ')}.`));
        const sum = H.locks.length ? `${H.locks.length} lock${H.locks.length === 1 ? '' : 's'}` : H.affl.length ? `${H.affl.length} wound${H.affl.length === 1 ? '' : 's'}` : 'fine';
        return section('health', 'Body & health', state.open, `${sum}${H.felt ? ` · pain ${H.felt}%` : ''}`, ...out);
    }
    function renderHealthSettings() {
        const s = S();
        if (!s.hmsSystems) s.hmsSystems = {};
        const C = () => (s.hmsSystems.health = isObj(s.hmsSystems.health) ? s.hmsSystems.health : {});
        const DEP = { light: { locks: true, hygiene: false, blood: false, sleep: false, stamina: false, food: false, stress: false, strain: false, sanity: false, temp: false, sickness: false }, medium: { locks: true, hygiene: true, blood: true, sleep: true, stamina: false, food: true, stress: false, strain: false, sanity: true, temp: true, sickness: true }, heavy: { locks: true, hygiene: true, blood: true, sleep: true, stamina: true, food: true, stress: true, strain: true, sanity: true, temp: true, sickness: true } };
        DEP.none = Object.fromEntries(Object.keys(DEP.light).map(k => [k, false])); DEP.custom = { ...DEP.medium };
        const dep = DEP[C().depth] ? C().depth : 'medium';
        const sw = (k) => typeof C()[k] === 'boolean' ? C()[k] : DEP[dep][k];
        // 2.9: changing one part moves the dial to Custom, keeping every other part as it was
        const tog = (label, key, note) => toggle(label, () => sw(key), v => { const c = C(); if (c.depth !== 'custom') { for (const k of Object.keys(DEP.light)) c[k] = sw(k); c.depth = 'custom'; } c[key] = v; render(); }, note);
        const on = C().enabled !== false;
        return section('s-health', 'Body & health', state.open, on ? dep : 'off',
            h('p', { class: 'rpgc-note' }, 'A body, not a health bar. Where the bot keeps wounds on its HUD (Re:Zero, Mushoku Tensei) this only reads them. Where it does not (Classroom of the Elite, Harry Potter, SCP, classic chats) the extension keeps the body from the story and the HUD clock.'),
            toggle('Body & health', () => on, v => { C().enabled = v; }, 'The Body & health card on the You page, and the locks the story is told.'),
            selectRow('How much it tracks', dep, HL_DEPTH_WORDS, v => { const c = C(); if (v === 'custom') { for (const k of Object.keys(DEP.light)) c[k] = sw(k); } else for (const k of Object.keys(DEP.light)) delete c[k]; c.depth = v; saveSettings(); render(); }),
            tog('Locks from broken bones', 'locks', 'A broken or missing limb stops what it would stop: two broken legs, no jumping. Pills and adrenaline never lift these.'),
            tog('Dressings and fresh wounds', 'hygiene', 'A dressing goes dirty after a day (half a day while bleeding or running hard); a dirty one can fester. A wound that bled hard tears open if you sprint in the first half hour.'),
            tog('Blood', 'blood', 'Open wounds drain blood by the HUD clock; it comes back slowly when the bleeding stops.'),
            tog('Sleep', 'sleep', 'Hours awake. After a day you slow down; after a day and a half, microsleeps and things at the edge of sight.'),
            tog('Water and food', 'food', 'Thirst and hunger by the clock. Thirst blurs sight and shakes the hands.'),
            tog('Arm and leg stamina', 'stamina', 'Sprinting tires the legs; climbing and fighting tire the arms. A hurt limb tires sooner.'),
            tog('Delayed strain', 'strain', 'Hard work aches the next day, in the limbs that did it.'),
            tog('Stress', 'stress', 'Frights raise it, calm lowers it. High stress hears and sees things that are not there.'),
            tog('Cold and heat', 'temp', 'From the HUD’s Weather line (°C or °F) and where you are: out in the cold and wet you shiver, then hypothermia, then frostbite; heat doubles thirst, then heatstroke. Indoors takes the edge off. The dead, spirits and fire or ice races keep to their own side. No tokens in normal weather.'),
            tog('Sickness, poison and withdrawal', 'sickness', 'A cold or fever (coughing gives away hiding), food poisoning, venom that slowly takes breath and waking until an antidote, and the crash after painkillers most days.'),
            tog('Sanity', 'sanity', 'Sane, shaken, fraying, breaking, insane: from the sanity the story already reports with your own state, the HUD\u2019s Sanity line, or its conditions (Despair, Trauma, Madness). Low sanity is told to the story.'),
            toggle('Use the Race card', () => C().race !== false, v => { C().race = v; }, 'An undead does not bleed, tire or feel pain; a slime has no bones; a winged race can break a wing. The body follows the form you are in (a dragon in human form walks on two legs).'),
            toggle('Ask the model about your shape', () => C().shape !== false, v => { C().shape = v; }, 'Only for a race that can hide parts (an Oni\u2019s horn, a succubus\u2019s wings) or change form, and only when the HUD does not already say it. About 40 tokens.'),
            selectRow('Body chart', ['male', 'female'].includes(C().figure) ? C().figure : 'auto', [['auto', 'From the HUD’s Gender or Sex line'], ['male', 'Male'], ['female', 'Female']], v => { C().figure = v; saveSettings(); }),
            toggle('Show the main arteries on the chart', () => C().arteries !== false, v => { C().arteries = v; }, 'Neck, shoulders, arms, thighs and knees. An opened artery is drawn red and pulses, and the death clock runs: a tourniquet stops a limb’s, never one in the neck, chest or groin.'),
            toggle('Vitality: how alive you are', () => C().vital !== false, v => { C().vital = v; }, 'One word (hurt, badly hurt, critical, dying) and how long the blood lasts. Told to the story only when it is badly hurt or worse.'),
            selectRow('Units', C().units === 'imperial' ? 'imperial' : 'metric', [['metric', 'Metric (cm, kg)'], ['imperial', 'Imperial (ft and in, lb)']], v => { C().units = v; saveSettings(); }),
            toggle('Tell the story your measurements', () => C().tellSize === true, v => { C().tellSize = v; }, 'Off: your height, weight and measurements are only shown on the card. On: one short line before each reply (about 15 tokens), also while you are fine.'),
            toggle('Tell the story', () => C().tell !== false, v => { C().tell = v; }, 'Before each reply, a few lines: what the body can still do, the locks, what hurts. Nothing when you are fine.'),
            toggle('Ask the model for the body note', () => C().ask !== false, v => { C().ask = v; }, 'Only where the bot keeps no wounds: the body part and bleed of each injury, and one short note of what changed (ate, drank, slept, ran, took a pill).'),
            selectRow('HP', ['grounded', 'always', 'never'].includes(C().hideHp) ? C().hideHp : 'grounded', [['grounded', 'Only in worlds with hit points'], ['never', 'Always show HP'], ['always', 'Never show HP']], v => { C().hideHp = v; saveSettings(); }),
            h('p', { class: 'rpgc-note' }, 'Worlds with hit points: Overlord, Skyrim, Dark Souls, Undertale and D&D games. In the others the Body & health card is your health.'),
            h('p', { class: 'rpgc-note' }, 'Cost: nothing while you are fine. Hurt, about 60–150 tokens before a reply. Where the extension keeps the body, about 90 tokens of request and 10–40 written back. HMS Reporter has a Body slot ({{rpgc_health}}); then the extension adds no message of its own.'));
    }

    // 2.5: powers by family (How to Build a Magic System V2.5): each HUD line with the lore entries it loads.
    const POWER_ORDER = ['staged', 'gift', 'affliction', 'meter', 'grade', 'plea'];
    const POWER_HUB = { staged: 'How staged powers work', gift: 'How gifts work', affliction: 'How curses work', meter: 'How the meters work', grade: 'How grades work', plea: 'How pleas work' };
    const niceLabel = (t) => { const s = String(t || '').toLowerCase(); return s.charAt(0).toUpperCase() + s.slice(1); };
    function powerEntry(e, own) {
        const same = !e.name || (own && String(e.name).toLowerCase() === String(own).toLowerCase());
        return h('div', { class: 'rpgc-pentry' },
            h('div', { class: 'rpgc-wrow' }, same ? null : h('b', null, e.name),
                e.hardness === 'Veiled' ? h('span', { class: 'rpgc-chip', title: 'The book hides the rest until the story reveals it' }, 'Veiled — only what is seen') : null,
                e.hardness === 'Soft' ? h('span', { class: 'rpgc-chip', title: 'The book keeps the rules loose on purpose' }, 'Soft — nature and signs') : null),
            e.summary ? h('p', { class: 'rpgc-note' }, e.summary) : null,
            e.fields && e.fields.length ? h('dl', { class: 'rpgc-pfields' }, ...e.fields.flatMap(([k, v]) => [h('dt', null, niceLabel(k)), h('dd', null, v)])) : null);
    }
    function renderPowers(P, m) {
        const shown = P.items.filter(x => x.family !== 'grade' || x.entries.length);
        const out = [h('h4', null, `Powers (${shown.length})`)];
        const barred = new Set((m.meters || []).map(v => String(v.label).toLowerCase()));
        // a grade with no lore says nothing the chips above do not; it shows once the book explains it
        for (const fam of POWER_ORDER) for (const it of P.items.filter(x => x.family === fam && (fam !== 'grade' || x.entries.length))) {
            const st = it.state || null;
            const kind = fam === 'gift' ? niceLabel(it.label).replace(/^Divine protection$/, 'Divine Protection') : fam === 'staged' ? niceLabel(it.label) : fam === 'grade' ? 'Grade' : it.kind;
            const stCls = !st ? '' : /awakened|answered/i.test(st) ? ' ok' : /dormant|waiting/i.test(st) ? ' hot' : '';
            const det = h('details', { class: 'rpgc-power fam-' + fam },
                h('summary', null, h('span', { class: 'rpgc-chip kind' + (fam === 'affliction' ? ' hot' : '') }, kind), h('b', null, it.name),
                    st ? h('span', { class: 'rpgc-chip' + stCls }, st) : null, it.stage ? h('span', { class: 'rpgc-chip' }, it.stage) : null,
                    h('span', { class: 'rpgc-pcount' }, it.entries.length ? `${it.entries.length} lore` : 'no lore')),
                fam === 'meter' && it.pct !== undefined && !barred.has(String(it.label).toLowerCase()) ? levelBar(it.pct, it.pct >= 75 ? 'critical' : it.pct >= 50 ? 'low' : 'ok') : null,
                it.power ? h('p', { class: 'rpgc-note' }, `Awakening into: ${it.power}`) : null,
                ...it.entries.map(e => powerEntry(e, it.name)),
                !it.entries.length ? h('p', { class: 'rpgc-note' }, P.lore ? 'No lorebook entry is keyed to this line yet. The story still uses it as written.' : 'No lorebook seen in this chat yet. It shows once the bot’s books load.') : null);
            const key = 'power-' + fam + '-' + it.name;
            det.open = state.open[key] === true;
            det.addEventListener('toggle', () => { state.open[key] = det.open; });
            out.push(det);
        }
        const hubs = POWER_ORDER.filter(f => P.hubs && P.hubs[f]);
        if (hubs.length) out.push(simSubdet('powers-hubs', `The rules behind them (${hubs.length})`, ...hubs.map(f => h('div', { class: 'rpgc-pentry' }, h('h5', null, POWER_HUB[f]), powerEntry(P.hubs[f], null)))));
        out.push(h('p', { class: 'rpgc-note' }, 'Read from the HUD lines and the lorebook entries those lines load. A Veiled power shows only what is seen until the story reveals it.'));
        return h('div', { class: 'rpgc-abil rpgc-powers' }, ...out);
    }

    // 2.5: the race card: the race line, the race book's entry, and a sketch of the body drawn from its words.
    const RACE_ROWS = ['Classification', 'Average Lifespan', 'LIFESPAN / AGE', 'Default Habitat', 'Power / Mana Source', 'Physical Build', 'Racial Identifiers', 'Default Resting State', 'Signature Tell', 'Social Structure', 'Core Instincts / Drives'];
    const RACE_ROW_WORD = { 'LIFESPAN / AGE': 'Lifespan and age', 'Power / Mana Source': 'Power source', 'Core Instincts / Drives': 'Drives' };
    // 2.6: bodies not built like a person: a dragon, a beast, a serpent (one head or many), a lamia, a centaur, an insect, a spirit
    function racePlanSvg(t) {
        const look = (hidden) => hidden ? 'class="hid"' : 'class="sh"';
        const P = [];
        const legs = (xs, top, foot = 236) => xs.map(([x0, x1]) => `<path class="limb" d="M${x0} ${top}L${x1} ${foot}"/>`).join('');
        const spikes = (x0, x1, y) => { let d = ''; for (let x = x0; x < x1; x += 12) d += `M${x} ${y + 4}L${x + 5} ${y - 9}L${x + 10} ${y + 4}`; return `<path class="mark" d="${d}"/>`; };
        if (t.plan === 'dragon') {
            P.push(`<g ${look(t.wingsHidden)}><path d="M92 142C78 92 56 62 22 40C38 70 32 92 44 112C56 102 66 112 72 128Z"/><path d="M112 140C114 90 126 60 150 30C146 60 152 86 142 110C134 104 126 116 122 130Z"/></g>`);
            P.push('<g class="body"><ellipse cx="100" cy="162" rx="50" ry="25"/><path d="M52 160C24 172 14 196 8 222C28 204 42 190 60 178Z"/></g>');
            P.push('<path class="limb" style="stroke-width:13" d="M136 150Q158 116 164 84"/>');
            P.push('<path class="body" d="M156 72L192 78L188 90L160 92Z"/>');
            P.push(`<g ${look(t.hornsHidden)}><path d="M164 74L156 52L172 72Z"/><path d="M174 74L172 54L182 74Z"/></g>`);
            P.push(legs([[130, 178], [144, 176], [66, 180], [80, 182]].map(([x, y]) => [x, x + (x > 100 ? 4 : -4)]), 178));
            if (t.spikes) P.push(spikes(64, 136, 138));
        } else if (t.plan === 'beast') {
            P.push('<g class="body"><ellipse cx="96" cy="160" rx="54" ry="23"/><path d="M134 150Q150 128 164 120L186 124Q192 132 182 138L162 140Q152 150 146 160Z"/></g>');
            if (t.ears !== false) P.push(`<g class="sh"><path d="M160 122L164 104L172 122Z"/></g>`);
            if (t.horns) P.push(`<g ${look(t.hornsHidden)}><path d="M174 124L178 104L182 124Z"/></g>`);
            P.push(legs([[128, 130], [140, 144], [58, 54], [72, 70]], 172));
            P.push(t.tail === 'reptile' ? '<path class="body" d="M44 156C20 160 10 176 4 196C22 184 34 176 48 168Z"/>' : '<path class="sh" d="M44 152C26 146 16 132 14 114C24 126 36 136 48 142Z"/>');
            if (t.spikes) P.push(spikes(56, 134, 138));
            if (t.wings) P.push(`<g ${look(t.wingsHidden)}><path d="M96 140C84 104 64 84 40 70C50 92 48 108 58 124Z"/></g>`);
        } else if (t.plan === 'serpent') {
            P.push('<path class="limb" style="stroke-width:20" d="M14 232C56 250 96 214 76 182C56 150 96 120 124 138C146 152 156 132 150 108"/>');
            const n = Math.max(1, Math.min(9, t.heads || 1));
            for (let i = 0; i < n; i++) {
                const a = n === 1 ? 0 : (-0.9 + (1.8 * i) / (n - 1)), x = 150 + Math.sin(a) * 34, y = 100 - Math.cos(a) * 30;
                if (n > 1) P.push(`<path class="limb" style="stroke-width:7" d="M150 112Q${150 + Math.sin(a) * 16} ${104 - Math.cos(a) * 14} ${x.toFixed(1)} ${y.toFixed(1)}"/>`);
                P.push(`<ellipse class="body" cx="${x.toFixed(1)}" cy="${(y - 4).toFixed(1)}" rx="${n > 1 ? 7 : 12}" ry="${n > 1 ? 5 : 8}"/>`);
            }
            if (t.wings) P.push(`<g ${look(t.wingsHidden)}><path d="M92 150C78 112 60 96 36 86C48 108 46 122 56 136Z"/><path d="M108 140C118 104 136 86 162 78C154 100 158 116 146 130Z"/></g>`);
        } else if (t.plan === 'naga') {
            P.push('<g class="body"><circle cx="100" cy="40" r="17"/><rect x="94" y="54" width="12" height="10" rx="3"/><path d="M78 64Q100 57 122 64L118 126Q100 132 82 126Z"/>'
                + '<path class="limb" d="M80 68Q66 96 62 124"/><path class="limb" d="M120 68Q134 96 138 124"/></g>');
            P.push('<path class="limb" style="stroke-width:24" d="M100 128C100 176 58 196 66 226C80 246 146 242 172 218C184 206 176 196 166 204"/>');
        } else if (t.plan === 'centaur') {
            P.push('<g class="body"><ellipse cx="96" cy="160" rx="50" ry="22"/><path d="M48 152C30 150 20 168 18 186C30 174 40 168 52 166Z"/></g>');
            P.push(legs([[124, 128], [136, 140], [62, 58], [76, 74]], 172));
            P.push('<g class="body"><path d="M126 150L130 96Q146 90 160 96L156 150Z"/><circle cx="145" cy="74" r="14"/></g><path class="limb" d="M130 100Q118 120 116 140"/><path class="limb" d="M158 100Q170 120 172 140"/>');
            if (t.ears === 'pointed') P.push('<g class="sh"><path d="M132 72L120 64L132 80Z"/></g>');
        } else if (t.plan === 'insect') {
            P.push('<g class="body"><ellipse cx="78" cy="168" rx="34" ry="20"/><ellipse cx="124" cy="164" rx="16" ry="12"/><circle cx="150" cy="156" r="10"/></g>');
            P.push(legs([[114, 92], [124, 120], [134, 152], [116, 104], [126, 140], [134, 170]].map(([x0, x1], i) => [x0, x1]), 172, 214));
            P.push('<path class="limb" style="stroke-width:2" d="M154 148Q164 128 176 124M150 148Q156 126 162 118"/>');
            if (t.wings) P.push(`<g ${look(t.wingsHidden)}><path d="M110 152C96 118 74 104 52 104C64 124 80 140 104 156Z"/></g>`);
        } else if (t.plan === 'spirit') {
            P.push('<g class="hid"><circle cx="100" cy="60" r="18"/><path d="M80 82Q100 74 120 82L116 140Q100 150 84 140Z"/><path d="M84 140C82 172 98 190 92 214C110 196 112 170 116 140Z"/></g>');
            P.push('<g class="hid"><path style="fill:none;opacity:.7" d="M58 120c6-10 14-10 20 0M126 100c6-10 14-10 20 0M70 190c6-10 14-10 20 0"/></g>');   // drifting light, in the spirit's own colour
        }
        return P.join('');
    }
    function raceSvg(t) {
        if (t.plan && t.plan !== 'humanoid' && t.plan !== 'slime') {
            const size = t.size || 1, k = size > 1 ? 1 : Math.max(0.45, size), gk = size > 1 ? Math.max(0.16, 1 / size) : 1;
            const W = 250;
            const ghost = `<g transform="translate(${W - 34},240) scale(${(gk * 0.94).toFixed(3)}) translate(-100,-240)"><g class="ghost"><circle cx="100" cy="52" r="18"/><path d="M78 78Q100 71 122 78L118 140Q100 147 82 140Z"/><path class="limb" d="M80 82Q66 110 62 140"/><path class="limb" d="M120 82Q134 110 138 140"/><path class="limb leg" d="M91 142L87 232"/><path class="limb leg" d="M109 142L113 232"/></g></g><text x="${W - 34}" y="250" class="cap">human</text>`;
            return `<svg viewBox="0 0 ${W} 254" role="img" aria-label="A sketch of the race's body"><g transform="translate(96,240) scale(${k.toFixed(3)}) translate(-100,-240)">${racePlanSvg(t)}</g>${ghost}</svg>`;
        }
        const size = t.size || 1, ghost = size !== 1;
        const k = size > 1 ? 1 : size, gk = size > 1 ? 1 / size : 1;
        const W = ghost ? 250 : 200;
        const SOLID = 'class="sh"', HID = 'class="hid"';
        const look = (hidden) => hidden ? HID : SOLID;
        const mirror = (inner) => `${inner}<g transform="translate(200,0) scale(-1,1)">${inner}</g>`;
        const body = (cls) => t.slime && cls === 'body'
            ? '<g class="slime"><path d="M24 236C20 186 52 140 100 138C148 140 180 186 176 236C140 244 60 244 24 236Z"/>'
              + '<path class="shade" d="M44 232C40 206 62 190 88 196C106 182 140 186 152 206C166 214 160 232 150 234C112 240 72 240 44 232Z"/>'
              + '<ellipse class="core" cx="104" cy="214" rx="12" ry="9"/>'
              + '<ellipse class="gloss" cx="66" cy="166" rx="16" ry="8" transform="rotate(-28 66 166)"/><circle class="gloss" cx="46" cy="190" r="3.6"/></g>'
            : `<g class="${cls}${t.gel && cls === 'body' ? ' gel' : ''}"><circle cx="100" cy="52" r="18"/><rect x="94" y="66" width="12" height="12" rx="3"/><path d="M78 78Q100 71 122 78L118 140Q100 147 82 140Z"/>`
              + `<path class="limb" d="M80 82Q66 110 62 140"/><path class="limb" d="M120 82Q134 110 138 140"/>`
              + ((t.arms === 4 || t.arms === 6) && cls === 'body' ? `<path class="limb" d="M82 104Q66 124 58 152"/><path class="limb" d="M118 104Q134 124 142 152"/>` : '')
              + (t.arms === 6 && cls === 'body' ? `<path class="limb" d="M83 120Q70 138 66 162"/><path class="limb" d="M117 120Q130 138 134 162"/>` : '')
              + `<path class="limb leg" d="M91 142L87 232"/><path class="limb leg" d="M109 142L113 232"/></g>`;
        const parts = [];
        // 2.8: a dragon (in any form) after the owner's dragon-girl sheets: big clawed wings, horns swept back, a spined tail to the floor
        if (t.dragon) {
            if (t.wings) parts.push(`<g ${look(t.wingsHidden)}>${mirror('<path d="M84 88C70 66 50 44 32 30L24 18L35 25C24 50 14 82 4 124C14 116 22 120 26 132C32 120 42 122 48 136C54 122 64 118 70 128C74 114 78 104 84 100Z"/><path class="line" d="M33 27L26 128M33 27L47 132M33 27L69 124"/>')}</g>`);
            if (t.tail) parts.push(`<g ${look(t.tailHidden)}><path d="M106 134C110 166 116 196 116 220C116 236 122 244 134 244C146 244 154 238 158 230L168 226L162 236L172 240L160 244C150 254 130 256 120 250C106 242 104 230 104 216C104 192 92 164 92 138Z"/><path d="M112 180l8-4-3 8zM114 198l8-3-4 8zM116 216l8-2-5 7z"/></g>`);
            t = { ...t, wings: null, tail: null };
        }
        const WING = { feather: '<path d="M84 88C55 60 25 55 8 70C20 80 15 90 22 98C32 100 30 112 40 116C50 114 55 122 64 124C70 112 78 104 84 100Z"/>',
            bat: '<path d="M84 86C50 50 20 60 10 100C25 95 30 105 35 115C45 105 55 110 60 120C65 108 75 100 84 100Z"/>',
            insect: '<path class="gauze" d="M84 90C70 60 40 46 22 56C12 66 30 84 84 96Z"/><path class="gauze" d="M84 100C60 104 38 120 36 136C40 146 64 130 84 106Z"/>' };
        if (t.wings) {
            const one = WING[t.wings] || WING.bat;
            const extra = t.wingPairs >= 2 ? `<g transform="translate(18,-30) scale(0.78)">${one}</g>` + (t.wingPairs >= 3 ? `<g transform="translate(20,62) scale(0.7)">${one}</g>` : '') : '';
            parts.push(`<g ${look(t.wingsHidden)}>${mirror(extra + one)}</g>`);
        }
        if (t.tail) {
            const FOX = '<path d="M110 140C140 136 168 160 166 196C164 214 150 222 140 214C152 200 146 174 112 150Z"/>';
            const n = t.tail === 'fox' ? Math.max(1, Math.min(9, t.tails || 1)) : 1;
            // several tails fan out on both sides behind the body, the middle one longest
            const fox = n === 1 ? FOX : Array.from({ length: n }, (_, j) => {
                const left = j % 2 === 1, idx = Math.floor(j / 2), per = Math.ceil(n / 2);
                const ang = -62 + idx * (per > 1 ? 70 / (per - 1) : 0);
                return `<g transform="${left ? 'translate(200,0) scale(-1,1) ' : ''}rotate(${ang.toFixed(1)} 104 146)">${FOX}</g>`;
            }).join('');
            parts.push(`<g ${look(t.tailHidden)}>${t.tail === 'spade'
                ? '<path class="line" d="M110 138C142 156 152 186 136 202"/><path d="M136 198L126 210L136 222L146 210Z"/>'
                : t.tail === 'reptile' ? '<path d="M112 136C140 150 160 190 168 228C150 195 130 160 108 146Z"/>'
                : t.tail === 'fox' ? fox
                : t.tail === 'stinger' ? '<path class="line" d="M110 140C138 150 156 130 160 100C162 84 152 74 144 78"/><path d="M144 78L132 70L140 84Z"/><path class="tex" d="M124 146l4 6M138 140l5 5M150 128l6 3M157 112l6 1"/>'
                : '<path d="M112 138C150 140 165 175 150 205C160 180 140 160 112 146Z"/>'}</g>`);
        }
        parts.push(body('body'));
        if (t.ears) parts.push(`<g class="sh">${mirror(t.ears === 'pointed' ? '<path d="M84 49L64 38L84 59Z"/>'
            : t.ears === 'rabbit' ? '<ellipse cx="91" cy="20" rx="5" ry="16" transform="rotate(-12 91 20)"/>'
            : t.ears === 'round' ? '<circle cx="86" cy="37" r="6"/>' : '<path d="M86 40L83 21L97 35Z"/>')}</g>`);
        if (t.horns && t.dragon && !t.hornsBroken) parts.push(`<g ${look(t.hornsHidden)}>${mirror('<path d="M90 38C80 30 74 18 80 2C72 10 70 26 76 36C79 41 83 44 87 46Z"/><path d="M83 54L66 47L72 53L64 58L83 60Z"/>')}</g>`);
        else if (t.horns) parts.push(`<g ${look(t.hornsHidden)}>${t.hornsBroken
            ? (t.horns === 1 ? '<path d="M96 36L97 28L100 31L102 27L104 36Z"/>' : mirror('<path d="M88 40L85 32L89 33L90 29L94 36Z"/>'))
            : t.hornKind === 'antler' ? mirror('<path class="line" d="M90 38C84 26 78 16 70 6M82 24L70 22M77 15L80 4M74 10L64 12"/>')
            : t.hornKind === 'ram' ? mirror('<path d="M90 40C78 34 68 38 66 48C64 58 74 64 80 58C84 54 80 48 76 50C74 46 80 42 86 46Z"/>')
            : (t.horns === 1 ? '<path d="M95 36C97 22 99 15 100 6C101 15 103 22 105 36Z"/>' : mirror('<path d="M88 40C80 26 78 18 84 9C86 20 90 28 95 36Z"/>'))}</g>`);
        if (t.antennae) parts.push(`<g class="sh">${mirror('<path class="line" d="M94 36C90 22 84 14 76 10"/><circle cx="75" cy="9" r="2.6"/>')}</g>`);
        if (t.fins) parts.push(`<g class="sh">${mirror('<path d="M83 48L70 42L74 50L68 54L83 56Z"/><path d="M70 112L58 108L64 118L60 126L68 124Z"/>')}</g>`);
        if (t.gills) parts.push('<path class="mark" d="M94 69l3 2M94 73l3 2M106 69l-3 2M106 73l-3 2"/>');
        if (t.tusks) parts.push('<path class="sh" d="M94 62l-1-6 3 5zM106 62l1-6-3 5z"/>');
        if (t.halo) parts.push('<ellipse class="halo" cx="100" cy="27" rx="17" ry="4.5"/>');
        if (t.eye) parts.push('<ellipse class="mark" cx="100" cy="45" rx="4" ry="2.4"/>');
        if (t.fangs) parts.push('<path class="mark" d="M95 60l2 4.5 2-4.5zM101 60l2 4.5 2-4.5z"/>');
        if (t.undead) parts.push('<g class="bone"><circle cx="93" cy="50" r="3.6"/><circle cx="107" cy="50" r="3.6"/><path d="M100 82V138M86 94H114M85 104H115M85 114H115M86 124H114"/></g>');
        if (t.scales) parts.push('<g class="tex"><path d="M64 118a3 3 0 0 0 6 0M66 126a3 3 0 0 0 6 0M130 118a3 3 0 0 0 6 0M128 126a3 3 0 0 0 6 0M86 180a3 3 0 0 0 6 0M108 190a3 3 0 0 0 6 0"/></g>');
        if (t.fur) parts.push('<g class="tex"><path d="M66 112l-4 2M64 122l-4 2M134 112l4 2M136 122l4 2M86 172l-4 2M114 172l4 2"/></g>');
        const ghostG = ghost ? `<g transform="translate(${W - 50},240) scale(${gk * 0.94}) translate(-100,-240)">${body('ghost')}</g><text x="${W - 50}" y="248" class="cap">human</text>` : '';
        const kx = size < 1 ? k * 1.22 : k;          // a short race is broad, not just small
        return `<svg viewBox="0 0 ${W} 252" role="img" aria-label="A sketch of the race's body"><g transform="translate(${ghost ? 90 : 100},240) scale(${kx},${k}) translate(-100,-240)">${parts.join('')}</g>${ghostG}</svg>`;
    }
    function raceLegend(t, nw = null, r = null) {
        const rows = [];
        const canHide = (p) => !!(nw && (nw.hideable.includes(p) || (nw.form !== 'own' && nw.parts.includes(p))));
        const add = (name, hidden, what, part = null) => rows.push(h('li', { class: hidden ? 'hid' : null }, h('b', null, name), what ? ` — ${what}` : '',
            hidden ? h('span', { class: 'rpgc-chip' }, 'hidden until shown') : part && canHide(part) ? h('span', { class: 'rpgc-chip ok' }, 'out now') : null));
        if (t.horns) add(t.hornKind === 'antler' ? 'Antlers' : t.horns === 1 ? 'A horn' : 'Horns', t.hornsHidden, t.hornsBroken ? 'broken' : t.hornKind === 'ram' ? 'curled, like a ram\u2019s' : t.hornKind === 'antler' ? 'branched' : t.horns === 1 ? 'one' : 'two', 'horns');
        if (t.wings) add('Wings', t.wingsHidden, (t.wings === 'feather' ? 'feathered' : t.wings === 'insect' ? 'thin, like an insect\u2019s' : 'leathery') + (t.wingPairs ? `, ${t.wingPairs} pairs` : ''), 'wings');
        if (t.tail) add(t.tail === 'fox' && t.tails > 1 ? `${t.tails} tails` : 'Tail', t.tailHidden, { spade: 'thin, spade tip', reptile: 'thick, scaled', fur: 'furred', fox: 'big and bushy, a fox\u2019s', stinger: 'segmented, with a stinger' }[t.tail], 'tail');
        if (t.fins) add('Fins', false, 'on the head and the forearms'); if (t.gills) add('Gills', false, 'breathes under water'); if (t.antennae) add('Antennae', false); if (t.tusks) add('Tusks', false);
        if (t.ears) add('Ears', false, { pointed: 'long and pointed', animal: 'animal ears', rabbit: 'long rabbit ears', round: 'round ears' }[t.ears]);
        if (t.scales) add('Scales', false); if (t.fur) add('Fur', false);
        if (t.arms === 4 || t.arms === 6) add('Extra arms', false, `${t.arms === 6 ? 'six' : 'four'} arms`);
        if (t.size && (!t.plan || t.plan === 'humanoid')) add('Size', false, t.size > 1 ? 'far taller than a human' : 'shorter and broader than a human');
        if (t.undead) add('Undead', false, 'bone and empty eyes');
        if (t.gel && !t.slime) add('Jelly', false, 'still a slime inside this shape');
        if (t.undeadBelow) add('Undead', false, 'still bone under the guise');
        if (t.slime) add('Slime body', false); if (t.eye) add('A third eye', false); if (t.halo) add('Halo', false); if (t.fangs) add('Fangs', false);
        const PLAN = { dragon: 'a dragon: four legs, wings, a long neck and tail', beast: 'four legs: a beast', serpent: t.heads > 1 ? `a serpent with ${t.heads} heads` : 'a serpent: no limbs', naga: 'a person above, a serpent below',
            centaur: 'a person above, a horse below', insect: 'six legs: an insect body', spirit: 'a spirit: no flesh, no fixed shape', slime: 'a slime: no bones, no fixed shape' };
        if (t.plan && PLAN[t.plan]) rows.unshift(h('li', null, h('b', null, 'Body'), ` \u2014 ${PLAN[t.plan]}`));
        if (t.spikes) add('Spikes', false, 'along the back');
        if (t.plan && t.plan !== 'humanoid' && t.size) rows.push(h('li', null, h('b', null, 'Size'), ` \u2014 ${t.size >= 2.5 ? 'colossal: a human barely reaches its knee' : t.size > 1.2 ? 'bigger than a human' : t.size < 0.8 ? 'smaller than a human' : 'about a human\u2019s size'}`));
        if (!rows.length) add('A human shape', false, nw && nw.form === 'human' ? 'its own parts tucked away' : 'the book names no horns, wings, tail or ears');
        if (nw && nw.form !== 'own') rows.unshift(h('li', null, h('b', null, 'Form'), ` \u2014 ${nw.formLabel || 'another shape'} (own form: ${r ? r.top : 'the race'})`));
        return h('ul', { class: 'rpgc-racelegend' }, ...rows);
    }
    // 2.7: the shape you are in now: your form, and each part that can hide (out or hidden), with who said so
    function raceShapeRows(r, nw) {
        const SRC = { hud: 'the HUD', model: 'the story', you: 'set by you' };
        const setForm = (v) => { if (!v) return; send({ type: 'race_edit', chatId: state.chatId, op: 'form', value: v }); state.raceFormText = ''; };
        const inp = h('input', { type: 'text', placeholder: 'another form: a wolf, mist…', 'aria-label': 'Another form', value: state.raceFormText || '',
            oninput: (e) => { state.raceFormText = e.target.value; }, onkeydown: (e) => { if (e.key === 'Enter') setForm(state.raceFormText); } });
        const formNow = nw.form === 'own' ? `Own form (${r.top})` : niceLabel(nw.formLabel || 'another form');
        const rows = [h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Form now:'), h('b', null, formNow), nw.src && nw.src.form ? h('small', null, ` (${SRC[nw.src.form] || nw.src.form})`) : null),
            h('div', { class: 'rpgc-row', role: 'group', 'aria-label': 'Change your form' },
                h('button', { class: 'rpgc-btn' + (nw.form === 'own' ? ' primary' : ''), 'aria-pressed': nw.form === 'own' ? 'true' : 'false', onclick: () => setForm('own') }, 'Own form'),
                h('button', { class: 'rpgc-btn' + (nw.form === 'human' ? ' primary' : ''), 'aria-pressed': nw.form === 'human' ? 'true' : 'false', onclick: () => setForm('human form') }, 'Human form'),
                inp, h('button', { class: 'rpgc-btn', onclick: () => setForm(state.raceFormText) }, 'Set'))];
        const WORD = { horns: r.traits && r.traits.horns === 1 ? 'Horn' : 'Horns', wings: 'Wings', tail: 'Tail' };
        for (const p of nw.parts) {
            const st = nw.shown[p];
            rows.push(h('div', { class: 'rpgc-row rpgc-racepart', role: 'group', 'aria-label': `${WORD[p]}: ${st}` }, h('span', { class: 'lbl' }, `${WORD[p]}:`),
                ...['hidden', 'out'].map(v => h('button', { class: 'rpgc-btn' + (st === v ? ' primary' : ''), 'aria-pressed': st === v ? 'true' : 'false',
                    onclick: () => send({ type: 'race_edit', chatId: state.chatId, op: 'shown', part: p, value: v }) }, v === 'out' ? 'Out' : 'Hidden')),
                st === 'broken' ? h('span', { class: 'rpgc-chip hot' }, 'broken') : null,
                nw.src && nw.src[p] ? h('small', null, ` (${SRC[nw.src[p]] || nw.src[p]})`) : null));
        }
        const mine = Object.values(nw.src || {}).includes('you');
        rows.push(h('p', { class: 'rpgc-note' }, 'The HUD wins when it says your form or shows a part; then what you set here; then the story\u2019s own note. The Body & health card follows this shape.'),
            mine ? h('button', { class: 'rpgc-mini', onclick: () => send({ type: 'race_edit', chatId: state.chatId, op: 'reset' }) }, 'Undo what I set') : null);
        return h('div', { class: 'rpgc-set rpgc-raceshape' }, h('h5', null, 'Your shape now'), ...rows);
    }
    function renderRace() {
        const r = state.hms && state.hms.race;
        if (!r || (sysCfg().you || {}).race === false) return null;
        const out = [];
        out.push(h('div', { class: 'rpgc-racehead' }, h('b', { class: 'nm' }, r.top),
            ...r.lineage.map(x => h('span', { class: 'rpgc-chip' }, x)),
            r.state ? h('span', { class: 'rpgc-chip' + (/hornless|severed|broken|sealed|cursed/i.test(r.state) ? ' hot' : '') }, r.state) : null,
            r.origin ? h('span', { class: 'rpgc-chip' }, h('em', null, 'Origin: '), r.origin) : null));
        if (r.floors.length > 1) out.push(h('div', { class: 'rpgc-racetower', role: 'list', 'aria-label': 'Race floors, first to latest' },
            ...r.floors.flatMap((f, i) => [i ? h('span', { class: 'up', 'aria-hidden': 'true' }, '▲') : null,
                h('span', { class: 'fl' + (f.folded ? ' folded' : '') + (i === r.floors.length - 1 ? ' now' : ''), role: 'listitem', title: f.folded ? 'Folded into the next floor' : null }, f.name, f.level ? h('small', null, ` Lv ${f.level}`) : null)]).filter(Boolean)));
        if (r.tries) out.push(h('div', { class: 'rpgc-row rpgc-filters rpgc-racetry', role: 'group', 'aria-label': 'Try another race (test zone)' },
            h('span', { class: 'lbl' }, 'Try a race: '),
            ...[null, ...r.tries.list].map(l => h('button', { class: 'rpgc-btn' + ((r.tries.now || null) === l ? ' primary' : ''), 'aria-pressed': (r.tries.now || null) === l ? 'true' : 'false',
                onclick: () => send({ type: 'sandbox_race', race: l }) }, l || 'The HUD\u2019s own'))));
        const nw = r.now || null;
        const tNow = nw && nw.traits ? nw.traits : (r.traits || {});
        const evo = Array.isArray(r.evolution) ? r.evolution : [];
        if (r.evolvedNow && evo.length) out.push(h('p', { class: 'rpgc-note rpgc-evolved', role: 'status' }, `\u2726 Evolved this reply: ${evo[evo.length - 1].from} \u2192 ${evo[evo.length - 1].to}`));
        const pic = h('div', { class: 'rpgc-racepic' }); pic.innerHTML = raceSvg({ ...tNow, dragon: /\b(dragons?|drakes?|wyrms?|wyverns?|dragonkin|dragonoid|dragonewt|ryujin)\b/i.test(`${r.top || ''} ${(r.lineage || []).join(' ')}`) });
        out.push(h('div', { class: 'rpgc-racebody' }, pic, h('div', null, raceLegend(tNow, nw, r),
            r.measure ? h('p', { class: 'rpgc-note' }, h('b', null, 'Size in the book: '), r.measure.say || `about ${r.measure.heightM} m`) : null,
            h('p', { class: 'rpgc-note' }, 'A sketch drawn from the words in the race’s entry, not its canon look. Dashed parts stay hidden until the story shows them.'))));
        if (nw) out.push(raceShapeRows(r, nw));
        if (evo.length) out.push(h('div', { class: 'rpgc-set' }, h('h5', null, `Evolution (${evo.length})`),
            h('ol', { class: 'rpgc-wlist rpgc-evo' }, ...evo.map(e => h('li', null, `${e.from} \u2192 `, h('b', null, e.to), e.when ? h('small', null, ` \u00B7 ${e.when}`) : null)))));
        for (const e of r.entries) {
            const keys = RACE_ROWS.filter(k => e.fields[k]);
            const rows = keys.length ? [h('dl', { class: 'rpgc-pfields' }, ...keys.flatMap(k => [h('dt', null, RACE_ROW_WORD[k] || k), h('dd', null, e.fields[k])]))] : [];
            const det = simSubdet('race-' + e.name, e.of && e.of.toLowerCase() !== String(e.name).toLowerCase() ? `${e.name} (for ${e.of})` : e.name,
                e.prints ? h('p', { class: 'rpgc-note' }, h('em', null, 'Prints as: '), e.prints) : null,
                e.lineage ? h('p', { class: 'rpgc-note' }, h('em', null, 'Lineage: '), e.lineage) : null,
                e.identity ? h('p', null, e.identity) : null,
                ...rows,
                e.inPlay && e.inPlay.length ? h('div', { class: 'rpgc-set' }, h('h5', null, 'In play'), h('ul', { class: 'rpgc-wlist' }, e.inPlay.map(x => h('li', null, x)))) : null,
                ...(e.laws || []).map(l => h('div', { class: 'rpgc-set' }, h('h5', null, niceLabel(l.name)), h('ul', { class: 'rpgc-wlist' }, l.rules.map(x => h('li', null, x))))),
                e.standing && e.standing.length ? h('div', { class: 'rpgc-set' }, h('h5', null, 'How each nation sees them'), h('dl', { class: 'rpgc-pfields' }, ...e.standing.flatMap(([n, v]) => [h('dt', null, n), h('dd', null, v)]))) : null);
            out.push(det);
        }
        if (!r.entries.length) out.push(h('p', { class: 'rpgc-note' }, r.lore ? `The lorebook has no entry keyed to “${r.top}”. The card shows what the race line says.` : 'No lorebook seen in this chat yet. The card shows what the race line says.'));
        const formSum = nw && nw.form !== 'own' ? ` \u00B7 ${nw.formLabel || 'another form'}` : '';
        const lin = r.lineage.filter(x => !/\bform\b/i.test(x));
        return section('race', 'Race', state.open, (lin.length ? `${r.top} · ${lin[0]}` : r.top) + formSum, ...out);
    }

    // 2.4: contracted spirits: each spirit's rung, element, what the lorebook says, this contract's clauses and its arts
    const SPIRIT_RUNGS = ['Lesser', 'Quasi', 'Spirit', 'Great', 'Sovereign'];
    function renderSpirits(S) {
        const out = [h('h4', null, `Spirits${S.contracts.length ? ` (${S.contracts.length})` : ''}`)];
        if (S.affinity) out.push(h('div', { class: 'rpgc-wrow' }, h('span', { class: 'lbl' }, 'Spirit affinity'), h('b', null, `${S.affinity.band}${S.affinity.grade ? ` (${S.affinity.grade})` : ''}`)),
            S.affinity.means ? h('p', { class: 'rpgc-note' }, S.affinity.means) : null);
        if (S.groups && S.groups.length) out.push(h('p', { class: 'rpgc-note' }, `Contract group: ${S.groups.join(', ')}. The rank on the line is the group's shared stage.`));
        const rungs = SPIRIT_RUNGS.slice(0, S.rungs || 4);
        for (const c of S.contracts) {
            const det = h('details', { class: 'rpgc-spirit' },
                h('summary', null, h('b', null, c.name), c.element ? h('span', { class: 'rpgc-chip el el-' + String(c.element).toLowerCase() }, c.element) : null, h('span', { class: 'rpgc-chip' }, c.rankWord || c.rank)),
                h('div', { class: 'rpgc-rungs', role: 'img', 'aria-label': `${c.rankWord || c.rank}: rung ${c.step + 1} of ${rungs.length}` },
                    rungs.map((r, i) => h('span', { class: i < c.step ? 'past' : i === c.step ? 'now' : null }, r))),
                c.line ? h('p', { class: 'rpgc-note' }, c.line) : null,
                c.clauses && c.clauses.length ? h('div', { class: 'rpgc-clauses' }, h('span', { class: 'lbl' }, 'This contract'), h('ul', { class: 'rpgc-wlist' }, c.clauses.map(x => h('li', null, x)))) : null,
                c.arts && c.arts.length ? h('div', { class: 'rpgc-chips' }, h('span', { class: 'lbl' }, 'Spirit arts: '), ...c.arts.map(a => h('span', { class: 'rpgc-chip abil' }, a))) : null);
            det.open = state.open['spirit-' + c.name] === true;
            det.addEventListener('toggle', () => { state.open['spirit-' + c.name] = det.open; });
            out.push(det);
        }
        if (!S.contracts.length) out.push(h('p', { class: 'rpgc-note' }, 'No spirit contract yet. A contract comes only from an event in the story.'));
        if (S.befriend && S.befriend.length) out.push(simSubdet('spirits-befriend', `Spirits you may meet (${S.befriend.length})`,
            ...S.befriend.map(b => h('p', { class: 'rpgc-note' }, h('b', null, b.name), b.element ? ` \u00B7 ${b.element}` : '', b.line ? ` \u2014 ${b.line}` : ''))));
        return h('div', { class: 'rpgc-abil rpgc-spirits' }, ...out);
    }

    // The spell list from the bot's lorebook: every spell it describes, by school, with what the HUD lets you use.
    const SPELL_WORD = { known: '\u2713 Known', reach: 'Within reach', next: 'Next rank', locked: '\uD83D\uDD12 Locked', special: '\u2726 Special' };
    const SPELL_CHIP = { known: ' sknown', reach: ' sreach', next: ' snext' };
    function renderSpellList(L) {
        const edit = (p) => send({ type: 'spell_edit', chatId: state.chatId, ...p });
        const judged = !!L.mode;                    // the HUD says what you can use
        const filter = state.spellFilter || (judged ? 'usable' : 'all');
        const shown = (sp) => filter === 'all' || sp.status === 'known' || sp.status === 'reach' || sp.status === 'next' || (L.study && L.study.key === sp.key);
        const out = [h('h4', null, `Spell list (${L.total})`)];
        const facts = [];
        if (L.casting) facts.push(`Casting: ${L.casting.method}${L.casting.voiceless ? ' \u2014 chants are optional for you' : ''}.`);
        if (L.gate) facts.push(L.gate.broken ? `Gate: ${L.gate.text}. Nothing can be cast through it.` : L.gate.cap ? `Gate ${L.gate.text}: up to the ${L.gate.cap} scale (${L.gate.from === 'table' ? 'from the bot\u2019s own Gate table' : 'a plain default; the bot\u2019s Gate table decides'}).` : `Gate: ${L.gate.text}.`);
        if (facts.length) out.push(h('p', { class: 'rpgc-note' }, facts.join(' ')));
        if (L.study) out.push(h('div', { class: 'rpgc-spellnote study', role: 'status' },
            h('span', null, '\uD83D\uDCD6 Studying: ', h('b', null, L.study.name), L.study.progress && L.study.progress !== 'none' ? ` \u2014 ${L.study.progress}` : L.study.progress === 'none' ? ' \u2014 no practice in the last reply' : '', L.study.note ? h('i', null, ` (${L.study.note})`) : null,
                L.study.status === 'locked' || L.study.status === 'next' ? h('span', { class: 'rpgc-note' }, ` Out of reach for now${L.study.why ? `: ${L.study.why}` : ''}.`) : null),
            h('button', { class: 'rpgc-btn', onclick: () => edit({ op: 'stop' }) }, 'Stop studying')));
        if (L.opened) for (const u of L.opened.ups) out.push(h('div', { class: 'rpgc-spellnote up' },
            h('span', null, `\u2B06 ${u.school}: ${u.from ? `${u.from} \u2192 ` : ''}${u.to}${L.opened.ago ? ` (${L.opened.ago} repl${L.opened.ago === 1 ? 'y' : 'ies'} ago)` : ''}. `, u.names.length ? `It opened: ${u.names.join(', ')}.` : 'The lorebook lists no new spell for it.')));
        const find = h('input', { type: 'search', placeholder: 'Find a spell', 'aria-label': 'Find a spell', value: state.spellFind || '' });
        const listBox = h('div', null);
        const none = h('p', { class: 'rpgc-note', style: 'display:none' }, 'No spell matches.');
        const apply = () => {
            const q = String(find.value || '').trim().toLowerCase();
            state.spellFind = find.value;
            let any = false;
            for (const g of listBox.querySelectorAll('details.rpgc-subdet')) {
                let n = 0;
                for (const r of g.querySelectorAll('details.rpgc-spell, div.rpgc-spell')) { const ok = !q || r.dataset.q.includes(q); r.style.display = ok ? '' : 'none'; if (ok) n++; }
                g.style.display = n ? '' : 'none';
                if (q && n) g.open = true;
                if (n) any = true;
            }
            none.style.display = any ? 'none' : '';
        };
        find.addEventListener('input', apply);
        out.push(h('div', { class: 'bar' },
            judged ? h('div', { class: 'rpgc-row rpgc-filters', role: 'group', 'aria-label': 'Show' }, [['usable', 'Usable and next'], ['all', 'All']].map(([k, l]) => h('button', { class: 'rpgc-btn' + (k === filter ? ' primary' : ''), 'aria-pressed': k === filter ? 'true' : 'false', onclick: () => { state.spellFilter = k; render(); } }, l))) : null,
            find));
        for (const g of L.schools) {
            const rows = g.spells.filter(shown);
            if (!rows.length) continue;
            const det = simSubdet('spells-' + g.key, `${g.name}${g.system && !/^(Elemental|Abstract)$/.test(g.system) ? ` (${g.system})` : ''}${g.rank ? ` \u00B7 ${g.rank}` : g.yours === false ? ' \u00B7 not yours' : ''} (${rows.length}${rows.length < g.spells.length ? ` of ${g.spells.length}` : ''})`,
                rows.map(sp => {
                    if (sp.thin) {
                        const thin = h('div', { class: 'rpgc-spell thin ' + sp.status }, h('span', { class: 'rpgc-chip' }, SPELL_WORD[sp.status] || sp.status), ' ', h('b', null, sp.name), sp.rank ? h('span', { class: 'rk' }, ` \u00B7 ${sp.rank}`) : null);
                        thin.dataset.q = `${sp.name} ${g.name} ${sp.rank || ''}`.toLowerCase();
                        return thin;
                    }
                    const body = [];
                    if (sp.spirit) body.push(h('span', { class: 'rpgc-note' }, sp.spirit === '*' ? 'A spirit art: cast through a contracted spirit.' : `A spirit art of ${sp.spirit}.`));
                    if (sp.effect) body.push(h('span', null, sp.effect));
                    if (sp.chant) body.push(h('span', { class: 'chant' }, 'Chant: ', sp.chant, L.casting && L.casting.voiceless ? ' (optional for you)' : ''));
                    if (sp.parts && sp.parts.length) body.push(h('span', { class: 'rpgc-note' }, `Melded from ${sp.parts.join(' + ')}.`));
                    if (sp.needs) body.push(h('span', { class: 'rpgc-note' }, `Needs: ${sp.needs}`));
                    if (sp.cost) body.push(h('span', { class: 'rpgc-note' }, `Cost: ${sp.cost}`));
                    if (sp.why && sp.status !== 'known') body.push(h('span', { class: 'rpgc-note' }, `${sp.status === 'next' ? 'Next rank' : 'Locked'}: ${sp.why}.`));
                    if (sp.special) body.push(h('span', { class: 'rpgc-note' }, `Marked ${sp.special} in the lorebook: not learned by rank.`));
                    const studying = L.study && L.study.key === sp.key;
                    body.push(h('div', { class: 'rpgc-row tight' },
                        L.canStudy && sp.status !== 'known' && !studying ? h('button', { class: 'rpgc-btn', 'aria-label': `Study ${sp.name}`, onclick: () => edit({ op: 'study', key: sp.key, name: sp.name }) }, 'Study') : null,
                        studying ? h('span', { class: 'rpgc-chip sreach' }, '\uD83D\uDCD6 studying') : null,
                        sp.status !== 'known' ? h('button', { class: 'rpgc-btn', title: 'Mark as known', 'aria-label': `Mark ${sp.name} as known`, onclick: () => edit({ op: 'mark', key: sp.key, as: 'known' }) }, '\u2713') : null,
                        sp.status === 'known' && sp.mark !== 'known' ? h('button', { class: 'rpgc-btn', title: 'I do not know this one', 'aria-label': `Mark ${sp.name} as not known`, onclick: () => edit({ op: 'mark', key: sp.key, as: 'not' }) }, '\u2715') : null,
                        sp.mark ? h('button', { class: 'rpgc-btn', title: 'Take my mark off', 'aria-label': `Take my mark off ${sp.name}`, onclick: () => edit({ op: 'mark', key: sp.key, as: null }) }, sp.mark === 'known' ? 'Unmark (set by you)' : 'Unmark (you said not known)') : null));
                    const row = h('details', { class: 'rpgc-spell ' + sp.status },
                        h('summary', null, SPELL_WORD[sp.status] ? h('span', { class: 'rpgc-chip' + (SPELL_CHIP[sp.status] || '') }, SPELL_WORD[sp.status]) : null, ' ', h('b', null, sp.name), sp.rank ? h('span', { class: 'rk' }, ` \u00B7 ${sp.rank}`) : null, sp.melded ? h('span', { class: 'rk' }, ' \u00B7 melded') : null),
                        h('div', { class: 'body' }, body));
                    row.dataset.q = `${sp.name} ${g.name} ${sp.rank || ''} ${sp.effect || ''} ${sp.series || ''}`.toLowerCase();
                    return row;
                }));
            if (state.open['spells-' + g.key] === undefined && g.yours) det.open = true;
            listBox.appendChild(det);
        }
        if (!listBox.children.length) listBox.appendChild(h('p', { class: 'rpgc-note' }, 'Nothing usable yet. Press All to see every spell the lorebook describes.'));
        out.push(listBox, none);
        const cts = [['known', 'known'], ['reach', 'within reach'], ['next', 'next rank'], ['locked', 'locked'], ['special', 'special']].filter(([k]) => L.counts[k]).map(([k, l]) => `${L.counts[k]} ${l}`);
        out.push(h('p', { class: 'rpgc-note' }, `${cts.length ? cts.join(' \u00B7 ') + '. ' : ''}Read from the bot\u2019s lorebook${judged ? '; your HUD says what you can use' : ''}. Studying a spell reminds the story of it; the world\u2019s own rules decide when it is learned.`));
        const box = h('div', { class: 'rpgc-spellbox' }, out);
        if (state.spellFind) setTimeout(apply, 0);
        return box;
    }

    // Every feature in one place. Each switch writes the setting the feature already obeys.
    const MODULES = [
        ['Trackers', [['You', 'hmsSystems.you.enabled'], ['Magic', 'hmsSystems.magic.enabled'], ['Spell list (in Magic)', 'hmsSystems.magic.spellList'], ['Powers (in Magic)', 'hmsSystems.magic.powers'], ['Body & health (in You)', 'hmsSystems.health.enabled'], ['Race card (in You)', 'hmsSystems.you.race'], ['On you (in You)', 'showOnYou'], ['Statuses (in People)', 'hmsSystems.statuses.enabled'], ['Party bodies (in People)', 'hmsSystems.party.trackBody'], ['Study a spell', 'hmsSystems.magic.study'], ['Party (in People)', 'hmsSystems.party.enabled'], ['People', 'hmsSystems.relations.enabled'], ['Gates (in People)', 'hmsSystems.gates.enabled'], ['Profiles (people without a card)', 'hmsSystems.characters.profiles'], ['Phone', 'hmsSystems.comms.enabled'],
            ['Vitals (in You)', 'hmsSystems.vitals.enabled'], ['Wounds', 'hmsSystems.body.wounds'], ['Conditions', 'hmsSystems.body.conditions'], ['Abilities', 'hmsSystems.abilities.enabled'], ['Quest details', 'hmsSystems.quests.details'], ['Survival clock', 'hmsSystems.survival.enabled', false]]],
        ['Story tools', [['Fights', 'encounterSettings.enabled'], ['Present characters (in People)', 'showCharacterThoughts'], ['Quests', 'showQuests'], ['D&D', 'dnd.enabled'], ['Weather', 'enableDynamicWeather', false], ['Portraits', 'enableAvatars', false], ['Thoughts in chat', 'showThoughtsInChat', false], ['Atlas (the location book)', 'showAtlas'], ['Chronicle', 'chronicle.enabled'], ['New game builder', 'showNewGame'], ['OOC guide', 'showOoc']]],
        ['Minds (from FrankenSIM)', [['Minds and feelings', 'hmsSystems.minds.enabled'], ['Agendas', 'hmsSystems.minds.agendas'], ['Who knows what', 'hmsSystems.minds.knowledge'], ['Chekhov\u2019s gun', 'hmsSystems.minds.chekhov'], ['Building maps', 'hmsSystems.minds.buildings']]],
        ['Extras', [['World card', 'worldCard'], ['Atlas (in Map)', 'showAtlas'], ['Picture prompt (in Story)', 'showPicPrompt'], ['Injuries', 'hmsSystems.injuries.enabled'], ['Chapters', 'chapters.enabled'], ['Lorebook context', 'lore.enabled'], ['Long-term memory', 'memory.enabled'], ['Test zone button', 'uiTestZone'], ['Recover a HUD from the model\u2019s thinking', 'recoverFromThinking']]]
    ];
    /** Which settings section holds the details of a module switch. */
    function modSection(path) {
        const p = String(path);
        const T = [[/^showAtlas$|^hmsSystems\.plans\./, 's-maps'], [/^hmsSystems\.(magic|abilities)\./, 's-magic'], [/^hmsSystems\.health\./, 's-health'], [/^hmsSystems\.minds\./, 's-minds'], [/^hmsSystems\.gates|^gates\./, 's-gates'], [/^hmsSystems\.quests/, 's-quests'], [/^hmsSystems\.characters/, 's-characters'], [/^hmsSystems\./, 's-hmssys'], [/^encounterSettings\./, 's-enc'], [/^dnd\./, 's-dnd'],
            [/^showCharacterThoughts$/, 's-chars'], [/^showQuests$/, 's-quests'], [/^(enableDynamicWeather|enableAvatars|showThoughtsInChat)$/, 's-display'], [/^chapters\./, 's-chapters'], [/^chronicle\./, 's-chronicle'],
            [/^lore\./, 's-lore'], [/^memory\./, 's-engine'], [/^characters\./, 's-characters'], [/^hmsSystems\.(statuses\.|party\.trackBody)/, 's-characters']];
        const hit = T.find(([re]) => re.test(p));
        return hit ? hit[1] : null;
    }
    function renderModulesSettings() {
        const s = S();
        const groups = MODULES.map(([title, list]) => h('div', { class: 'rpgc-modgroup' }, h('h4', { class: 'rpgc-subhead' }, title),
            h('div', { class: 'rpgc-modgrid' }, list.map(([label, path, def]) => {
                const cur = pathGet(s, path);
                const on = cur === undefined ? def !== false : cur !== false;
                const box = h('input', { type: 'checkbox', 'aria-label': label });
                box.checked = on;
                box.addEventListener('change', () => { pathSet(s, path, box.checked); saveSettings(false); render(); });
                const to = modSection(path);
                return h('span', { class: 'rpgc-modwrap' }, h('label', { class: 'rpgc-mod' + (on ? ' on' : '') }, box, h('span', null, label)),
                    to ? h('button', { type: 'button', class: 'rpgc-modgo', title: 'Open its section', 'aria-label': `Open the ${label} settings`, onclick: () => goSection(to) }, '\u203A') : null);
            }))));
        const place = h('select', { 'aria-label': 'Where the side-panel request goes', onchange: (e) => { s.injectPlacement = e.target.value; saveSettings(false); } },
            h('option', { value: 'system' }, 'Its own message before yours (recommended)'), h('option', { value: 'append' }, 'Added to your message (1.8 and earlier)'));
        place.value = s.injectPlacement === 'append' ? 'append' : 'system';
        return section('s-modules', 'Modules', closedByDefault('s-modules'), null,
            h('p', { class: 'rpgc-note' }, 'Switch off anything you do not use: it leaves the panel and the prompt, and costs no tokens. These are the same switches as in the sections below, all in one place. The small arrow opens that section.'),
            ...groups,
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Request placement'), place),
            h('p', { class: 'rpgc-note' }, 'With the HMS Reporter preset, the request sits in the preset\u2019s own slot after the chat and is not added again, so this setting does not apply. Any other preset can do the same with ',
                h('code', null, '{{if::{{matches::{{rpgc_on}}::^1$}}}}{{rpgc_request}}{{/if}}'), '.'));
    }

    // The guide (GUIDE.md, shipped inside the extension): one section per part, a find box, Start here open.
    function renderGuide() {
        const find = String(state.guideFind || '').trim().toLowerCase();
        const { intro, secs } = guideSections(GUIDE_MD);
        const out = [topBar()];
        if (!secs.length) { out.push(h('p', { class: 'rpgc-note' }, 'The guide is missing from this build. GUIDE.md in the extension folder has the same text.')); return out; }
        const box = h('input', { type: 'search', placeholder: 'Find in the guide (for example: pin, OOC, emoji)', 'aria-label': 'Find in the guide', value: state.guideFind || '', style: 'width:100%;box-sizing:border-box' });
        box.addEventListener('input', () => { state.guideFind = box.value; clearTimeout(state.guideT); state.guideT = setTimeout(() => { render(); const b = root.querySelector('input[aria-label="Find in the guide"]'); if (b) { b.focus(); b.setSelectionRange(b.value.length, b.value.length); } }, 250); });
        const wrap = h('div', { class: 'rpgc-guide' });
        if (!find) wrap.appendChild(perchCard('Hi, I am Perch', 'This is the guide. Short words, one thing at a time. Use the box above to find something.'));
        wrap.appendChild(h('div', { class: 'rpgc-guide-intro' }, guideBlocks(intro, null)));
        wrap.appendChild(box);
        let shown = 0;
        secs.forEach((sec, i) => {
            const text = (sec.title + '\n' + sec.lines.join('\n')).toLowerCase();
            if (find && !text.includes(find)) return;
            shown++;
            const key = 'g-' + i;
            const d = section(key, sec.title, state.open, null, ...guideBlocks(sec.lines, find || null));
            if (find) d.open = true;
            else if (state.open[key] === undefined) d.open = i === 0;      // Start here opens; the rest wait
            wrap.appendChild(d);
        });
        if (find && !shown) wrap.appendChild(h('p', { class: 'rpgc-note' }, `Nothing in the guide matches \u201C${state.guideFind.trim()}\u201D.`));
        out.push(wrap);
        return out;
    }

    function renderHelpSettings() {
        const inc = h('input', { type: 'checkbox', 'aria-label': 'Include the latest reply' });
        const out = h('textarea', { rows: '6', readonly: true, 'aria-label': 'Bug report', placeholder: 'Your report appears here.', style: 'width:100%;font-family:ui-monospace,monospace;font-size:11px' });
        state.diagTarget = out;
        return section('s-help', 'Help & bug report', closedByDefault('s-help'), state.version ? 'v' + state.version : null,
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => { state.view = 'guide'; render(); } }, 'Open the guide'), h('span', { class: 'rpgc-note' }, 'How the bot, the HMS Reporter preset and this panel fit together, and what every card and setting does.')),
            h('p', { class: 'rpgc-note' }, h('b', null, 'How it fits together. '), 'In an HMS chat the World State is your bot\u2019s own HUD, read line by line: pin a line to keep it, and the guard flags a line that vanishes. The cards below read the same HUD \u2014 You, the world card for your bot, People, Quests and the rest. Fights: Immersive keeps you in the chat with the panel as the tracker; Turn-based opens the D&D window. Chapters keep summaries of the story so far. The Test zone is a practice chat that costs no tokens in Demo. Anything you do not use can be switched off under Modules.'),
            h('p', { class: 'rpgc-note credit' }, h('b', null, 'Thanks. '), 'Minds, agendas, who knows what, Chekhov\u2019s gun and building maps are ported from FrankenSIM 4 Mini by Wireless (Ryah), with permission. TFDY (Tenderness, Fury, Dread, Yearning) is by Pyropia.'),
            h('p', { class: 'rpgc-note credit' }, h('b', null, 'Made by Perch (TenderTriper). '), 'A creator on Janitor AI, and the host of the Discord server The Appa Stand. ',
                h('a', { href: 'https://janitorai.com/profiles/cc9e471a-d758-4147-8cd9-be31afa1995a_profile-of-tender-triper', target: '_blank', rel: 'noopener noreferrer' }, 'Janitor AI profile'), ' \u00B7 ',
                h('a', { href: 'https://discord.gg/k6DQPYQMFY', target: '_blank', rel: 'noopener noreferrer' }, 'The Appa Stand on Discord'), '. More in the guide, part 13: Credits.'),
            h('p', { class: 'rpgc-note' }, 'Found a bug? Copy a report and paste it in the Discord (The Appa Stand). It holds the version, your settings, what the extension read from the latest reply and recent problems \u2014 no chat text unless you tick the box.'),
            h('label', { class: 'rpgc-row' }, inc, h('span', null, 'Include the latest reply')),
            h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => send({ type: 'diagnostics', chatId: state.chatId, includeReply: inc.checked }) }, 'Copy bug report')),
            out);
    }
    function onDiagnostics(msg) {
        const txt = '```json\n' + JSON.stringify({ ...msg.report, browser: navigator.userAgent, panel: S()?.uiPanelMode || 'drawer', theme: S()?.uiTheme || 'host' }, null, 1) + '\n```';
        if (state.diagTarget) state.diagTarget.value = txt;
        try { navigator.clipboard.writeText(txt).then(() => { state.status = { kind: 'ok', text: 'Bug report copied. Paste it in the Discord.' }; render(); }, () => {}); } catch { /* shown in the box */ }
    }

    // ── the mini panel: float it, minimise it, or pop it out to a second screen ──
    let floatBox = null, popWin = null, popLookObs = null;
    function panelMode() { return (S() && S().uiPanelMode) || 'drawer'; }
    function setPanelMode(mode) {
        const s = S();
        if (!s) return;
        state.wideOpenNext = mode === 'wide';
        s.uiPanelMode = mode;
        state.panelApplied = mode;
        saveSettings(false);
        applyPanelMode();
        render();
    }
    function drawerNote(text, action) {
        tab.root.replaceChildren(h('div', { class: 'rpgc rpgc-parked' + themeClass() }, h('p', { class: 'rpgc-note' }, text), h('button', { class: 'rpgc-btn primary', onclick: action }, 'Bring it back here')));
    }
    function applyPanelMode() {
        const mode = panelMode();
        if (mode !== 'wide') closeWideShell();
        if (mode === 'wide') {
            if (popWin) { const w = popWin; popWin = null; try { w.close(); } catch { /* gone */ } }
            if (floatBox) { floatBox.remove(); floatBox = null; }
            openWideShell();
            wideBox.appendChild(root);
            tab.root.replaceChildren(h('div', { class: 'rpgc rpgc-parked' + themeClass() }, h('p', { class: 'rpgc-note' }, 'The panel is in the wide window. Esc closes it.'),
                h('div', { class: 'rpgc-row' }, h('button', { class: 'rpgc-btn primary', onclick: () => showWide(true) }, 'Open it'), h('button', { class: 'rpgc-btn', onclick: () => setPanelMode('drawer') }, 'Bring it back here'))));
        } else if (mode === 'float') {
            if (popWin) { try { popWin.close(); } catch { /* gone */ } popWin = null; }
            if (!floatBox) {
                const f = (S() && S().uiFloat) || {};
                floatBox = h('div', { class: 'rpgc-float', role: 'dialog', 'aria-label': 'RPG Companion' });
                const bar = h('div', { class: 'rpgc-float-bar' }, h('span', { class: 'ttl' }, 'RPG Companion'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Minimise', title: 'Minimise', onclick: () => { floatBox.classList.toggle('min'); saveFloat(); } }, '\u2013'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Enlarge', title: 'Enlarge', onclick: () => { floatBox.classList.toggle('big'); saveFloat(); } }, '\u25A1'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Pop out to a new window', title: 'Pop out (second screen)', onclick: () => setPanelMode('popout') }, '\u2197'),
                    h('button', { class: 'rpgc-mini', 'aria-label': 'Back to the drawer', title: 'Back to the drawer', onclick: () => setPanelMode('drawer') }, '\u21E5'));
                floatBox.appendChild(bar);
                floatBox.style.left = (f.x ?? 80) + 'px'; floatBox.style.top = (f.y ?? 80) + 'px';
                if (f.w) floatBox.style.width = f.w + 'px'; if (f.h) floatBox.style.height = f.h + 'px';
                if (f.min) floatBox.classList.add('min'); if (f.big) floatBox.classList.add('big');
                let drag = null;
                bar.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; drag = { x: e.clientX - floatBox.offsetLeft, y: e.clientY - floatBox.offsetTop }; bar.setPointerCapture?.(e.pointerId); });
                bar.addEventListener('pointermove', (e) => { if (!drag) return; floatBox.style.left = Math.max(0, e.clientX - drag.x) + 'px'; floatBox.style.top = Math.max(0, e.clientY - drag.y) + 'px'; });
                bar.addEventListener('pointerup', () => { if (drag) { drag = null; saveFloat(); } });
                document.body.appendChild(floatBox);
            }
            floatBox.appendChild(root);
            drawerNote('The panel is floating. Drag it by its bar; minimise or enlarge it there.', () => setPanelMode('drawer'));
        } else if (mode === 'popout') {
            if (!popWin || popWin.closed) {
                popWin = window.open('', 'rpgc_popout', 'width=460,height=860');
                if (!popWin) { state.status = { kind: 'warning', text: 'The browser blocked the pop-out window. Allow pop-ups for Lumiverse and try again.' }; const s = S(); s.uiPanelMode = 'drawer'; return applyPanelMode(); }
                popWin.document.title = 'RPG Companion HMS Edition 2.9 beta';
                syncPopoutLook(popWin);
                try { if (!popLookObs) { popLookObs = new MutationObserver(() => syncPopoutLook(popWin)); popLookObs.observe(document.documentElement, { attributes: true }); if (document.body) popLookObs.observe(document.body, { attributes: true, attributeFilter: ['class'] }); } } catch { /* optional */ }
                popWin.addEventListener('beforeunload', () => { popWin = null; if (panelMode() === 'popout') { const s = S(); s.uiPanelMode = 'drawer'; saveSettings(false); applyPanelMode(); render(); } });
            }
            if (floatBox) { floatBox.remove(); floatBox = null; }
            let scroller = popWin.document.getElementById('rpgc-pop-scroll');
            if (!scroller) { scroller = popWin.document.createElement('div'); scroller.id = 'rpgc-pop-scroll'; scroller.tabIndex = -1; popWin.document.body.appendChild(scroller); }
            scroller.appendChild(root);
            try { scroller.focus({ preventScroll: true }); } catch { /* optional */ }
            drawerNote('The panel is in its own window.', () => setPanelMode('drawer'));
        } else {
            if (floatBox) { floatBox.remove(); floatBox = null; }
            if (popWin) { const w = popWin; popWin = null; try { w.close(); } catch { /* gone */ } }
            tab.root.replaceChildren(root);
        }
    }
    // ───────── 2.3: the wide window: a side menu, a page head, cards in two columns ─────────
    // The icons are fixed drawings kept in this file (24×24, drawn in the text colour).
    const WIDE_ICONS = {
        world: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
        people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14.5A5 5 0 0 1 21 19"/>',
        you: '<circle cx="12" cy="8" r="3.6"/><path d="M5 21a7 7 0 0 1 14 0"/>',
        map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
        magic: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
        story: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7M8 11h7"/>',
        letters: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
        guide: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/>',
        settings: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
        test: '<path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4a1.5 1.5 0 0 0 1.3-2L14 9V3M7.5 15h9"/>',
        trackers: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
        compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>'
    };
    function iconEl(id) {
        const el = h('span', { class: 'ico', 'aria-hidden': 'true' });
        el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${WIDE_ICONS[id] || WIDE_ICONS.trackers}</svg>`;
        return el;
    }
    const WIDE_PAGES = [
        ['world', 'World', 'The time, the place, and what the world says about it.'],
        ['people', 'People', 'Who is here, how they feel, and how far they have come.'],
        ['you', 'You', 'Your body, your mind, your skills and your bag.'],
        ['map', 'Map', 'Where everyone stands, and the places you know.'],
        ['magic', 'Magic & Skills', 'Spells, powers, skills and traits, and what you can learn next.'],
        ['story', 'Story', 'Quests, the chronicle and the chapters.'],
        ['letters', 'Letters', 'Your phone, and every letter, note and page you have read.']
    ];
    const WIDE_OTHER = { trackers: ['Trackers', 'What the story says right now.'], guide: ['Guide', 'How the bot, the preset and this panel work.'],
        settings: ['Settings', 'Everything you can switch on, off or change.'], test: ['Test zone', 'Try everything without a chat.'] };
    function wideOn() { return panelMode() === 'wide'; }
    function widePage() { return WIDE_PAGES.some(p => p[0] === state.widePage) ? state.widePage : 'world'; }
    /** Is this page's card shown now? Always outside the wide window, and in the test zone. */
    function wideShows(page) { return !wideOn() || page === '*' || widePage() === page; }      // 2.4: the test zone has pages too

    function wideFrame(kids) {
        const s = S() || {};
        const view = state.view;
        const pages = !!state.wideHms;
        const page = view === 'settings' ? 'settings' : view === 'guide' ? 'guide' : view === 'sandbox' ? 'test' : pages ? widePage() : 'trackers';
        const meta = WIDE_PAGES.find(p => p[0] === page) || [page, ...(WIDE_OTHER[page] || ['', ''])];
        // the top bar goes in the head; notices go above the cards
        let bar = null;
        const lead = [], body = [];
        const take = (k) => {
            if (!k) return;
            if (k.nodeType === 11) { [...k.childNodes].forEach(take); return; }
            const cl = k.classList;
            if (!bar && cl && cl.contains('rpgc-top')) { bar = k; return; }
            if (cl && (cl.contains('rpgc-status') || cl.contains('rpgc-hint') || cl.contains('rpgc-lead'))) { lead.push(k); return; }
            body.push(k);
        };
        kids.forEach(take);
        const go = (v, p) => () => { state.view = v; if (p) state.widePage = p; state.wideScroll = 0; render(); };
        const item = (id, label, onclick, opt = {}) => h('button', { type: 'button', title: label, class: opt.empty ? 'empty' : null, 'aria-current': id === page ? 'page' : null, onclick },
            opt.icon || iconEl(id), h('span', { class: 'lbl' }, label), opt.n ? h('span', { class: 'n' }, String(opt.n)) : null);
        const counts = state.widePageCount || {};
        const testLabel = state.sandbox && view === 'sandbox' ? 'Leave test zone' : 'Test zone';
        const rail = h('nav', { class: 'rpgc-rail' + (s.uiWideRail !== false ? ' labels' : ''), 'aria-label': 'Pages' },
            pages ? WIDE_PAGES.map(([id, label]) => item(id, label, go('trackers', id), { empty: !counts[id] })) : state.sandbox ? null : item('trackers', 'Trackers', go('trackers')),
            h('div', { class: 'sep' }), h('div', { class: 'grow' }),
            item('guide', 'Guide', go('guide'), { icon: perchOn() ? h('span', { class: 'ico', 'aria-hidden': 'true' }, h('img', { src: PERCH_S, alt: '' })) : null }),
            s.uiTestZone === false && !state.sandbox ? null : item('test', testLabel, () => {
                if (state.sandbox && state.view !== 'sandbox') { state.view = 'sandbox'; render(); } else if (state.sandbox) leaveSandbox(); else enterSandbox();
            }),
            // 2.7.1: on a page of the test zone, the way back to your own chat is its own button
            state.sandbox && view !== 'sandbox' ? item('leave', 'Leave test zone', () => leaveSandbox(), { icon: iconEl('test') }) : null,
            item('settings', 'Settings', go('settings')));
        const pico = h('div', { class: 'pico', 'aria-hidden': 'true' }, iconEl(page));
        const head = h('header', { class: 'rpgc-whead' }, pico,
            h('div', { class: 'ttl' }, h('h2', null, meta[1]), h('p', { class: 'sub' }, meta[2])),
            h('div', { class: 'acts' }, bar,
                h('button', { type: 'button', class: 'dockbtn', title: 'Back to the drawer: the normal side panel', 'aria-label': 'Back to the drawer', onclick: () => setPanelMode('drawer') }, '\u21E5'),
                h('button', { type: 'button', class: 'xbtn', title: 'Close. The round button in the corner brings it back.', 'aria-label': 'Close the wide window', onclick: () => hideWide() }, '×')));
        const cols = view === 'trackers' || view === 'settings' || view === 'sandbox';
        let content;
        if (view === 'trackers' && pages && !body.length) content = h('div', { class: 'rpgc-wempty' }, 'Nothing on this page yet in this chat. It fills in as the story gives it something.');
        else content = h('div', { class: cols ? 'rpgc-wcols' + (body.length === 1 ? ' solo' : '') : 'rpgc-wone' }, ...body);   // one card alone takes the whole width
        return [rail, h('div', { class: 'rpgc-wmain' }, head, h('div', { class: 'rpgc-wbody' }, lead.length ? h('div', { class: 'rpgc-wlead' }, ...lead) : null, content))];
    }

    // The wide window lives on the page itself, over the chat. Closing it leaves a round button in the corner (Perch, when he is on).
    var wideBack, wideBox, wideLaunch;
    function openWideShell() {
        const fresh = !wideBox;
        if (fresh) {
            wideBack = h('div', { class: 'rpgc-wide-back', onclick: () => hideWide() });
            wideBox = h('div', { class: 'rpgc-wide-box', role: 'dialog', 'aria-label': 'RPG Companion' });
            wideLaunch = h('button', { type: 'button', class: 'rpgc-launch', title: 'Open RPG Companion (drag to move)', 'aria-label': 'Open RPG Companion' });
            dragLaunch(wideLaunch, () => showWide(true));
            document.body.append(wideBack, wideBox, wideLaunch);
            restoreLaunch(wideLaunch);
        }
        if (fresh || state.wideOpenNext) showWide(!!state.wideOpenNext, false);   // opened when picked; after a reload it waits behind its button
        state.wideOpenNext = false;
    }
    function paintLaunch() {
        for (const b of [wideLaunch, perchBtn]) if (b) b.replaceChildren(perchOn() ? h('img', { src: PERCH_L, alt: '', draggable: 'false' }) : iconEl('compass'));
        // 2.8: "off" keeps the round button away; the drawer tab still opens the wide window
        if (wideLaunch && wideBox) wideLaunch.hidden = !wideBox.hidden || perchFloatMode() === 'off';
    }
    function perchFloatMode() { const v = S() && S().uiPerchFloat; return v === 'always' || v === 'off' ? v : 'wide'; }
    // 2.8: Esc closes the wide window (not while typing, and not while a pop-up of its own is open)
    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape' || e.defaultPrevented || !wideBox || wideBox.hidden) return;
        const t = e.target;
        if (t && t.closest && (t.closest('input, textarea, select, [contenteditable="true"]') || t.closest('.rpgc-costpop, .rpgc-pop, dialog[open]'))) return;
        if (document.querySelector('.rpgc-costpop:not([hidden])')) return;
        hideWide();
    });
    // 2.5: Perch can be dragged anywhere on the screen, and he stays where he is put (as a share of the window,
    // so he survives a resize). A press that does not move is a click.
    function placeLaunch(btn, x, y) {
        const w = btn.offsetWidth || 54, hh = btn.offsetHeight || 54;
        const X = Math.max(4, Math.min(window.innerWidth - w - 4, x)), Y = Math.max(4, Math.min(window.innerHeight - hh - 4, y));
        btn.style.left = X + 'px'; btn.style.top = Y + 'px'; btn.style.right = 'auto'; btn.style.bottom = 'auto';
    }
    function restoreLaunch(btn) {
        const p = S() && S().uiLaunchPos;
        if (btn && p && Number.isFinite(p.fx) && Number.isFinite(p.fy)) placeLaunch(btn, p.fx * window.innerWidth, p.fy * window.innerHeight);
        else if (btn) { btn.style.left = ''; btn.style.top = ''; btn.style.right = ''; btn.style.bottom = ''; }
    }
    function dragLaunch(btn, onClick) {
        let id = null, sx = 0, sy = 0, ox = 0, oy = 0, moved = false;
        btn.addEventListener('pointerdown', (e) => {
            if (e.button !== undefined && e.button !== 0) return;
            id = e.pointerId; sx = e.clientX; sy = e.clientY; moved = false;
            const r = btn.getBoundingClientRect(); ox = r.left; oy = r.top;
            try { btn.setPointerCapture(id); } catch { /* optional */ }
        });
        btn.addEventListener('pointermove', (e) => {
            if (id === null || e.pointerId !== id) return;
            const dx = e.clientX - sx, dy = e.clientY - sy;
            if (!moved && Math.hypot(dx, dy) < 6) return;
            moved = true; btn.classList.add('dragging');
            placeLaunch(btn, ox + dx, oy + dy);
        });
        const end = (e) => {
            if (id === null || (e && e.pointerId !== id)) return;
            id = null; btn.classList.remove('dragging');
            if (moved) {
                const r = btn.getBoundingClientRect(), s = S();
                if (s) { s.uiLaunchPos = { fx: +(r.left / window.innerWidth).toFixed(4), fy: +(r.top / window.innerHeight).toFixed(4) }; saveSettings(false); }
                for (const b of [wideLaunch, perchBtn]) if (b && b !== btn) restoreLaunch(b);
            }
        };
        btn.addEventListener('pointerup', end);
        btn.addEventListener('pointercancel', end);
        btn.addEventListener('click', (e) => { if (moved) { moved = false; e.preventDefault(); return; } onClick(); });
        btn.addEventListener('keydown', (e) => {            // the arrow keys move him too
            const step = e.shiftKey ? 40 : 10, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
            if (!d) return;
            e.preventDefault();
            const r = btn.getBoundingClientRect();
            placeLaunch(btn, r.left + d[0], r.top + d[1]);
            const s = S(); if (s) { const r2 = btn.getBoundingClientRect(); s.uiLaunchPos = { fx: +(r2.left / window.innerWidth).toFixed(4), fy: +(r2.top / window.innerHeight).toFixed(4) }; saveSettings(false); }
        });
    }
    // 2.5: Perch on the screen in every window, as a quick way back to the panel (Settings → Look)
    var perchBtn;
    function openPanelFromPerch() {
        const mode = panelMode();
        if (mode === 'wide') { showWide(true); return; }
        if (mode === 'float' && floatBox) { floatBox.classList.remove('min'); saveFloat(); return; }
        if (mode === 'popout') { if (popWin && !popWin.closed) { try { popWin.focus(); } catch { /* blocked */ } } else applyPanelMode(); return; }
        try { if (tab && typeof tab.activate === 'function') tab.activate(); } catch { /* the drawer opens from its own tab */ }
    }
    function syncPerchButton() {
        const s = S();
        const want = !!s && s.uiPerchFloat === 'always' && panelMode() !== 'wide';
        if (!want) { if (perchBtn) { perchBtn.remove(); perchBtn = undefined; } return; }
        if (!perchBtn) {
            perchBtn = h('button', { type: 'button', class: 'rpgc-launch rpgc-perchfloat', title: 'Open RPG Companion (drag to move)', 'aria-label': 'Open RPG Companion' });
            dragLaunch(perchBtn, openPanelFromPerch);
            document.body.appendChild(perchBtn);
            restoreLaunch(perchBtn);
        }
        paintLaunch();
    }
    window.addEventListener('resize', () => { for (const b of [wideLaunch, perchBtn]) if (b) restoreLaunch(b); });
    function showWide(open = true, paint = true) {
        if (!wideBox) return;
        wideBox.hidden = !open;
        wideBack.hidden = !open;
        wideLaunch.hidden = open || perchFloatMode() === 'off';
        paintLaunch();
        if (open && paint) render();
    }
    function hideWide() { if (wideBox && !wideBox.hidden) showWide(false); }
    function closeWideShell() {
        for (const el of [wideBack, wideBox, wideLaunch]) if (el) el.remove();
        wideBack = wideBox = wideLaunch = undefined;
    }

    function saveFloat() {
        if (!floatBox) return;
        const s = S(); s.uiFloat = { x: floatBox.offsetLeft, y: floatBox.offsetTop, w: floatBox.offsetWidth || null, h: floatBox.offsetHeight || null, min: floatBox.classList.contains('min'), big: floatBox.classList.contains('big') };
        saveSettings(false);
    }
    function closedByDefault(id) { if (state.open[id] === undefined) state.open[id] = false; return state.open; }

    function renderLoreSettings() {
        const s = S();
        const L = () => (s.lore = s.lore || {});
        const rep = state.lore || null;
        // The status line is the point of this panel: it says what the last side call actually
        // carried, so "the fight ignored my lorebook" becomes something you can see.
        let note;
        if (!s.lore || s.lore.enabled === false) note = 'Off.';
        else if (!rep) note = 'Nothing sent yet.';
        else if (rep.names && rep.names.length) note = `${rep.names.length} entr${rep.names.length === 1 ? 'y' : 'ies'} sent${rep.where ? ` to the ${rep.where}` : ''}.`;
        else if (!rep.pooled) note = 'No world books are reaching this chat. Attach one to the character, the persona or the chat, or activate it globally.';
        else note = 'Nothing matched the last call. Check that your entries\' keywords appear in the scene.';

        return section('s-lore', 'Lorebook context', state.open, rep && rep.names && rep.names.length ? `${rep.names.length}` : null,
            h('p', { class: 'rpgc-note' }, 'Lumiverse gives the chat\'s own reply its world books. It does not give them to the extension\'s calls — those are direct calls to the model. Without this, fights, the tracker and the companion block ran with no lore at all.'),
            toggle('Send lore with the extension\'s calls', () => s.lore?.enabled !== false, v => { L().enabled = v; }, 'Your world books go with fights, the tracker and the side-panel block. Without this, those calls see none of your lore.'),
            h('h4', null, 'Send lore with'),
            toggle('Fight calls', () => L().inCombat !== false, v => { L().inCombat = v; }, 'The setup, every round and the aftermath. The fights themselves are set up under Fights.'),
            toggle('Tracker and companion calls', () => L().inTracker !== false, v => { L().inTracker = v; }, 'What the panels are read from.'),
            toggle('Portrait calls', () => !!L().inPortraits, v => { L().inPortraits = v; }, 'Off by default: most lore is rules, not faces.'),
            h('h4', null, 'How lore is found'),
            toggle('Watch the chat\u2019s world info', () => L().watch !== false, v => { L().watch = v; },
                'Lets fights and the tracker pull entries the chat itself never triggered \u2014 an enemy\u2019s own entry, an ability\u2019s rules. The cost: while any extension watches world info, Lumiverse builds every prompt on its main thread instead of its faster worker pool, for every chat on this server. Turning it off takes effect when the extension restarts (disable and enable it in the Extensions panel); turning it on works at once.'),
            toggle('Also match the scene itself', () => L().matchSceneTerms !== false, v => { L().matchSceneTerms = v; },
                'Lumiverse matches lore against the chat. A fight happens outside the chat, so its enemies and abilities would never pull their own entries without this.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Most entries'),
                h('input', { type: 'number', min: '1', max: '80', value: String(L().maxEntries ?? 20), 'aria-label': 'Most entries', onchange: (e) => { L().maxEntries = Math.max(1, parseInt(e.target.value) || 20); saveSettings(); } })),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Character budget'),
                h('input', { type: 'number', min: '500', max: '60000', step: '500', value: String(L().maxChars ?? 6000), 'aria-label': 'Character budget', onchange: (e) => { L().maxChars = Math.max(500, parseInt(e.target.value) || 6000); saveSettings(); } })),
            toggle('Report what was sent', () => L().showInPanel !== false, v => { L().showInPanel = v; }, 'The panel lists which entries each call carried, so a missing entry is easy to spot.'),
            h('p', { class: 'rpgc-note' }, note),
            rep && rep.names && rep.names.length ? h('p', { class: 'rpgc-note' }, rep.names.join(' · ')) : null,
            rep && rep.exact === false ? h('p', { class: 'rpgc-note' }, 'Without the "world books" permission the extension approximates activation itself. Grant it in the Extensions panel for the host\'s exact result.') : null);
    }

    function renderEngineSettings() {
        const s = S();
        const C = () => (s.hmsCore = s.hmsCore || {});
        const M = () => (s.memory = s.memory || {});
        const rep = state.lore || null;
        return section('s-engine', 'Engine core & memory', state.open, null,
            h('h4', null, 'The engine core in fights'),
            h('p', { class: 'rpgc-note' }, 'Your bot keeps its combat law in the card — the rank hierarchy, STATE IS GOD, the lethality gate, how power is actually compared. The fight calls always received the card, but as "information about the characters", so a rules engine read as flavour. It is now sent as the engine, and binding.'),
            toggle('Run the core in fights', () => C().inCombat !== false, v => { C().inCombat = v; },
                'The setup, every round and the aftermath. The aftermath renders the HUD; the JSON calls are told not to.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Core budget (chars)'),
                h('input', { type: 'number', min: '2000', max: '200000', step: '1000', value: String(C().maxChars ?? 80000), 'aria-label': 'Core budget', onchange: (e) => { C().maxChars = Math.max(2000, parseInt(e.target.value) || 80000); saveSettings(); } })),
            h('p', { class: 'rpgc-note' }, 'The cores run roughly 30–52k characters (~8–13k tokens), so the default carries the largest whole. It is real cost on every fight call — but it is the same core the chat itself runs on every turn. Lowering it truncates the core, which is worse than leaving it off.'),

            h('h4', null, 'Long-term memory'),
            h('p', { class: 'rpgc-note' }, 'Lumiverse feeds the chat\'s own reply from the Memory Cortex and the vectorised chunk store. A fight got neither, so it knew only the last few messages. This retrieves what is relevant to the fight rather than widening the history window.'),
            toggle('Use memory', () => M().enabled !== false, v => { M().enabled = v; }, 'Lumiverse\u2019s long-term memory goes with the extension\u2019s calls.'),
            toggle('In fights', () => M().inCombat !== false, v => { M().inCombat = v; }, 'Fight setups recall what matters about the people in them.'),
            toggle('In the tracker and companion block', () => !!M().inTracker, v => { M().inTracker = v; }, 'Off by default: the tracker reads the latest reply, where recall rarely helps.'),
            toggle('Memory Cortex (entities, relations, arc)', () => M().cortex !== false, v => { M().cortex = v; }, 'Who is who and how they relate, from Lumiverse\u2019s Memory Cortex.'),
            toggle('Long-term chat chunks', () => M().longTerm !== false, v => { M().longTerm = v; }, 'Passages from far back in this chat that match the scene.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'How many to recall'),
                h('input', { type: 'number', min: '1', max: '30', value: String(M().topK ?? 6), 'aria-label': 'How many to recall', onchange: (e) => { M().topK = Math.max(1, parseInt(e.target.value) || 6); saveSettings(); } })),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Memory budget (chars)'),
                h('input', { type: 'number', min: '500', max: '40000', step: '500', value: String(M().maxChars ?? 4000), 'aria-label': 'Memory budget', onchange: (e) => { M().maxChars = Math.max(500, parseInt(e.target.value) || 4000); saveSettings(); } })),
            rep && rep.memory && rep.memory.length ? h('p', { class: 'rpgc-note' }, `Last call recalled: ${rep.memory.join(' · ')}.`)
                : rep && rep.memoryOn === false ? h('p', { class: 'rpgc-note' }, 'Memory is off, or the "memories" permission has not been granted.')
                : h('p', { class: 'rpgc-note' }, 'Nothing recalled yet.'));
    }

    function renderHmsSettings() {
        const s = S();
        const modeSel = h('select', { 'aria-label': 'HMS mode', onchange: (e) => { s.hmsMode = e.target.value; saveSettings(); } },
            h('option', { value: 'auto' }, 'Automatic (on when the chat has a WORLD STATE HUD)'),
            h('option', { value: 'on' }, 'Always on'),
            h('option', { value: 'off' }, 'Off (classic RPG Companion)'));
        modeSel.value = s.hmsMode || 'auto';
        return section('s-hms', 'HMS engine', state.open, hmsOn() ? 'active' : 'not detected',
            h('p', { class: 'rpgc-note' }, 'In HMS chats the WORLD STATE HUD is the tracker. The extension reads it and never asks the model for a competing one.'),
            h('div', { class: 'rpgc-row' }, h('span', { class: 'lbl' }, 'Mode'), modeSel),
            toggle('Ask for present characters and thoughts', () => s.hmsCompanion, v => { s.hmsCompanion = v; }, 'A small block after the prose, hidden from the chat. Off means the extension adds nothing to the reply at all.'),
            toggle('Fetch a forgotten side-panel block', () => s.catchUp !== false, v => { s.catchUp = v; }, 'Some models leave the block out now and then. Only then, it is fetched with a quick second call, so the panel does not go stale. Three misses running and the panel suggests Separate mode.'),
            toggle('Watch for dropped HUD lines', () => s.hmsGuard, v => { s.hmsGuard = v; }, 'Flags lines that vanish between replies, with a one-click restore.'),
            toggle('Remind the model of pinned lines', () => s.hmsPinReminder, v => { s.hmsPinReminder = v; }, 'Your pinned HUD lines are repeated in the prompt, so they are less likely to drop in the first place.'));
    }


    // ── start ──
    render();
    syncChat();
    if (!state.chatId) requestState();

    return () => {
        try { if (floatBox) floatBox.remove(); if (popWin && !popWin.closed) popWin.close(); } catch { /* gone */ }
        clearInterval(pollTimer);
        clearTimeout(saveTimer);
        flushSettings();                    // a change made in the last moment is still saved
        clearTimeout(settingsTimer);
        evUnsubs.forEach(u => { try { u(); } catch { /* ignore */ } });
        try { unsubBackend(); } catch { /* ignore */ }
        try { refreshAction.destroy(); } catch { /* ignore */ }
        try { openAction.destroy(); } catch { /* ignore */ }
        try { fightAction.destroy(); } catch { /* ignore */ }
        try { worldAction.destroy(); } catch { /* ignore */ }
        try { if (encModal) encModal.dismiss(); } catch { /* ignore */ }
        clearTimeout(plotTimer);
        try { tab.destroy(); } catch { /* ignore */ }
        removeWeather();
        removeStyle();
    };
}
