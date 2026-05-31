import { state }  from './state.js';
import { ITEMS }  from '../data/items.js';

// ── Public API ────────────────────────────────────────────────

export function addItem(id) {
  if (!state.inventory.includes(id)) {
    state.inventory.push(id);
    _render();
  }
}

export function removeItem(id) {
  state.inventory = state.inventory.filter(i => i !== id);
  if (state.selectedItem === id) state.selectedItem = null;
  _render();
}

export function deselectItem() {
  state.selectedItem = null;
  _render();
}

export function renderInventory() {
  _render();
}

// ── Internal ──────────────────────────────────────────────────

function _render() {
  const slots = document.getElementById('inventory-slots');
  slots.innerHTML = '';
  state.inventory.forEach(id => {
    const item = ITEMS[id];
    const div  = document.createElement('div');
    div.className = 'inv-slot' + (state.selectedItem === id ? ' selected' : '');
    div.title     = item.name;
    div.innerHTML = `<span>${item.icon}</span><span class="inv-slot-name">${item.name}</span>`;
    div.addEventListener('click', () => {
      state.selectedItem = state.selectedItem === id ? null : id;
      _render();
    });
    slots.appendChild(div);
  });
}
