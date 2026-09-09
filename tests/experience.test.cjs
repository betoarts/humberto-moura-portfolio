const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { initial, update, resetMode, content, modes } = require("../dist/assets/experience.js");
const root = path.resolve(__dirname, "..");
let checks = 0;
function check(condition, message) { assert.ok(condition, message); checks++; }
let state = initial();
const original = initial();
state = update(state, "ticket");
check(state.ticket === 1, "Ticket advances to in-progress");
state = update(update(state, "ticket"), "ticket");
check(state.ticket === 2, "Ticket is capped at resolved");
check(original.ticket === 0, "Transitions do not mutate prior state");
state = update(state, "call");
check(state.called === 0, "Cannot call a guest before freeing a table");
for (let i = 0; i < 3; i++) {
  state = update(update(state, "free"), "call");
  check(state.called === i + 1 && !state.free, "Call consumes a free table");
}
state = update(update(state, "free"), "call");
check(state.called === 3, "Queue cannot overrun");
state = update(update(update(state, "habit:0"), "habit:1"), "habit:2");
check(state.habits.every(Boolean), "All habits complete");
check(content("habits", state).includes('aria-valuenow="100"'), "Progress reaches 100%");
check(content("habits", state).includes("60 XP"), "XP matches completed habits");
state = update(state, "habit:0");
check(!state.habits[0], "Habits can be undone");
check(content("habits", state).includes("40 XP"), "Undo removes XP");
state = update(state, "slide:2");
check(state.slide === 2, "Playlist selection is reflected in state");
state = update(state, "overlay");
check(!content("tv", state).includes('class="tv-overlay"'), "Overlay toggle hides the message");
const reset = resetMode(state, "tickets");
check(reset.ticket === 0 && reset.called === 3 && reset.slide === 2, "Reset affects only the current demo");
check(resetMode(state, "queue").called === 0, "Queue reset");
check(resetMode(state, "habits").habits.every(x => !x), "Habit reset");
check(resetMode(state, "tv").overlay, "Player reset");
for (const mode of modes) {
  check(content(mode.id, initial()).length > 250, "Every demo renders useful initial content");
  check(!content(mode.id, initial()).includes("undefined"), "No undefined demo content");
}
const html = fs.readFileSync(path.join(root, "dist/index.html"), "utf8");
for (const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(script[1]);
check((html.match(/name:"/g) || []).length === 8, "All eight original projects preserved");
check(html.includes("5554991680204"), "Real contact number retained");
check(html.includes("viewport-fit=cover"), "Viewport supports safe-area insets");
const css = fs.readFileSync(path.join(root, "dist/assets/experience.css"), "utf8");
check(css.includes("safe-area-inset-right") && css.includes("safe-area-inset-bottom"), "WhatsApp safe-area placement");
check(css.includes("prefers-reduced-motion"), "Reduced-motion preference supported");
check(css.includes("grid-template-columns: minmax(0, 1fr)"), "Single-column mobile layout");
for (const asset of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g))
  check(fs.existsSync(path.join(root, "dist", asset[1].split("?")[0])), "Local asset exists: " + asset[1]);
console.log(checks + " checks passed: state transitions, resets, content, assets, mobile rules and gallery preservation.");
