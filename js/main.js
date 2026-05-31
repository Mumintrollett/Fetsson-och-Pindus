import { initInput }      from './engine/input.js';
import { renderInventory } from './engine/inventory.js';
import { loop }            from './engine/loop.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx    = canvas.getContext('2d');
  initInput(canvas);
  renderInventory();
  loop(ctx);
});
