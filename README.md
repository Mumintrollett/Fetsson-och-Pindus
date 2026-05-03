# Fetsson och Pindus — A Cozy Farm Adventure

A browser-based point-and-click adventure game about Fetsson the pig and his
stick-insect companion Pindus. Help them find their way to Mrs. Hen's famous
apple pancakes!

## How to Play

Open `index.html` directly in any modern web browser — no build step required.

| Action | How |
|--------|-----|
| Move Fetsson | Click anywhere on the ground |
| Interact with an object | Click on it (objects glow/highlight on hover) |
| Pick up / use an item | Click an item in the **Inventory** bar to select it (gold border), then click on an object in the scene |
| Advance dialogue | Click anywhere on the dialogue box or on the canvas |

## Story

Fetsson wakes up in the barn on a sunny morning. Pindus is buzzing with
excitement — Mrs. Hen has promised her legendary apple pancakes. But when they
reach the farmhouse, the door is locked! Explore the farm, solve two small
puzzles, and make it to breakfast.

## Scenes

| Scene | Description |
|-------|-------------|
| The Barn | Starting location. Search the hay bales! |
| The Farm Yard | Central hub with the farmhouse, well, scarecrow, and garden gate |
| The Garden | Find the hidden key with a little ingenuity |
| Mrs. Hen's Kitchen | The cosy ending — sit down and enjoy those pancakes |

## Puzzles

1. **The Rusty Gate** — The garden gate is seized with rust. Find water to
   loosen the hinges.
2. **The Garden Gnome** — Something shiny is hidden under the gnome, but it is
   too heavy to move. You will need a long reach.

## Running / Developing

```bash
# Just open the file — no server needed for local play
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows

# Or serve with any static server if you prefer:
npx serve .
python3 -m http.server
```

## File Structure

```
index.html       Main HTML shell
css/
  style.css      UI styling (inventory bar, dialogue box, tooltip)
js/
  game.js        Complete game — engine, scenes, characters, systems
```
