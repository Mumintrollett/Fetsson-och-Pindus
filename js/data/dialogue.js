// All spoken dialogue in the game, grouped by trigger key.
// Each value is an array of { who, text } lines fed to the dialogue engine.
export const DLG = {
  intro: [
    { who: 'Pindus',  text: 'Wakey wakey, Fetsson! The sun is shining and the roosters are trying their best!' },
    { who: 'Pindus',  text: "Mrs. Hen promised us her legendary apple pancakes today. I've been up since the moon was still arguing with the horizon." },
    { who: 'Fetsson', text: "Mmm… pancakes… I'm up, I'm up!" },
    { who: 'Pindus',  text: "Oh — something's sticking out of that hay bale over there. Might be worth a look!" },
  ],
  pindus_barn_again: [
    { who: 'Pindus',  text: "Do you think she puts extra honey on the pancakes?" },
    { who: 'Fetsson', text: "She always does. Let's go already!" },
  ],
  hay_bale: [
    { who: 'Fetsson', text: "Oh! There's a sturdy stick buried in the hay." },
    { who: 'Fetsson', text: "I'll take it — you never know when a stick comes in handy." },
  ],
  farmhouse_locked_first: [
    { who: 'Fetsson', text: "Hmm. The farmhouse door is locked." },
    { who: 'Pindus',  text: "Mrs. Hen is a very organised hen. Except when she isn't." },
  ],
  farmhouse_locked_again: [
    { who: 'Fetsson', text: "Still locked. I should explore a bit more." },
  ],
  scarecrow: [
    { who: 'Scarecrow', text: '… … …' },
    { who: 'Fetsson',   text: 'Did… did the scarecrow just speak?' },
    { who: 'Scarecrow', text: 'CREEAK… The little stone man in the garden… he guards what you seek…' },
    { who: 'Pindus',    text: "Cryptic. Deeply cryptic. And yet, somehow, clarifying." },
    { who: 'Fetsson',   text: "Right. Now if only we could get INTO the garden…" },
  ],
  rusty_gate: [
    { who: 'Fetsson', text: "This gate is solid rust. It won't budge." },
  ],
  rusty_gate_hint: [
    { who: 'Fetsson', text: "This gate hasn't moved in years. The hinges are completely seized." },
    { who: 'Pindus',  text: "Iron's greatest weakness is water. Rust, you see, is iron giving up." },
  ],
  gate_open_water: [
    { who: 'Fetsson', text: "Let me pour this water on the rusty hinges…" },
    { who: 'Fetsson', text: "There we go! That loosened things up nicely." },
    { who: 'Pindus',  text: "The garden is open! Water solves everything eventually." },
  ],
  pickup_bucket: [
    { who: 'Fetsson', text: "An old wooden bucket by the well. Might be useful." },
  ],
  well_no_bucket: [
    { who: 'Fetsson', text: "A lovely stone well. The water looks cold and fresh." },
    { who: 'Pindus',  text: "And entirely unreachable without something to put it in." },
  ],
  fill_bucket: [
    { who: 'Fetsson', text: "I'll fill the bucket with well water." },
    { who: 'Pindus',  text: "Cold and clear. Good for many things." },
  ],
  gnome_no_stick: [
    { who: 'Fetsson', text: "I can see something shiny under that gnome, but my hoof can't reach it." },
    { who: 'Pindus',  text: "You need something long and thin. If only you had… a stick!" },
  ],
  gnome_with_stick: [
    { who: 'Fetsson', text: "Let me use this stick to fish under the gnome…" },
    { who: 'Fetsson', text: "Got it!" },
    { who: 'Pindus',  text: "Excellent. The gnome looks mildly offended." },
  ],
  veggies: [
    { who: 'Fetsson', text: "Look at those fat pumpkins! Nearly ready for harvest." },
    { who: 'Pindus',  text: "Mrs. Hen's pumpkin soup is legendary. But first — pancakes!" },
  ],
  open_door: [
    { who: 'Fetsson', text: "The key fits! The door swings open with a welcoming creak." },
    { who: 'Pindus',  text: "I can smell the pancakes from HERE!" },
  ],
  ending: [
    { who: 'Mrs. Hen', text: "Oh! Fetsson, Pindus! There you are! I was starting to worry." },
    { who: 'Fetsson',  text: "We found your spare key, Mrs. Hen! It was under the garden gnome." },
    { who: 'Mrs. Hen', text: "Oh gracious, I accidentally locked myself out earlier and hid the spare key in a hurry. How forgetful of me!" },
    { who: 'Pindus',   text: "No harm done! And those pancakes smell absolutely DIVINE." },
    { who: 'Mrs. Hen', text: "Sit, sit! Apple pancakes with clover honey — you've earned every last bite!" },
    { who: 'Fetsson',  text: "This is the best morning on the farm ever." },
    { who: 'Pindus',   text: "Agreed. I also found three excellent sticks in the garden on the way, so it's a double win for me." },
    { who: 'Mrs. Hen', text: "…You are a very peculiar stick insect, Pindus." },
    { who: 'Pindus',   text: "Thank you! That's the kindest thing anyone's said to me all week." },
  ],

  // ── Post-pancake ──────────────────────────────────────────────
  pancake_push: [
    { who: 'Fetsson', text: "Hmm. They're just out of reach. If I give them a nudge with this stick…" },
    { who: 'Fetsson', text: "Oh! They're sliding — SPLAT." },
    { who: 'Fetsson', text: "Ah well. Five-second rule." },
  ],
  apple_quest: [
    { who: 'Mrs. Hen', text: "Fetsson! You… you knocked my pancakes on the floor!" },
    { who: 'Fetsson',  text: "They still taste incredible! Every single one!" },
    { who: 'Mrs. Hen', text: "…Well, I suppose that's a compliment of sorts. But now I'm completely out of apples." },
    { who: 'Pindus',   text: "The orchard apples are the finest on the farm. But it's past the old bridge and the waterfall cave…" },
    { who: 'Mrs. Hen', text: "Oh, would you two be dears and fetch some? Take this basket. And — the old toolbox in the barn has everything you'll need. The combination is seven. Same as the pancakes you just ate off my floor." },
    { who: 'Pindus',   text: "Seven. Engraved upon my soul." },
  ],

  // ── Barn toolbox ─────────────────────────────────────────────
  toolbox_locked: [
    { who: 'Fetsson', text: "An old toolbox with a combination lock. Three dials." },
    { who: 'Pindus',  text: "Mrs. Hen did mention something about a number…" },
  ],
  toolbox_open: [
    { who: 'Fetsson', text: "Seven. Click! The lock pops." },
    { who: 'Fetsson', text: "A sturdy hammer and a good length of rope. Just what the farm ordered." },
  ],
  toolbox_empty: [
    { who: 'Fetsson', text: "Empty now. I already took everything useful." },
  ],

  // ── Bridge ───────────────────────────────────────────────────
  bridge_intro: [
    { who: 'Pindus',  text: "The old rope bridge! I remember crossing this as a larvae. It was much more structurally sound then." },
    { who: 'Fetsson', text: "Several planks have decided to pursue careers elsewhere. The railing looks suicidal. And that counterweight gate is locked." },
    { who: 'Pindus',  text: "Standard rot. I've seen it happen to sticks." },
    { who: 'Fetsson', text: "One thing at a time." },
  ],
  bridge_planks_pickup: [
    { who: 'Fetsson', text: "A pile of spare planks by the old shed. Could be just what this bridge needs." },
  ],
  bridge_no_tools: [
    { who: 'Fetsson', text: "Several planks are missing. I'd fall straight through into the ravine." },
    { who: 'Pindus',  text: "Tragic end. Undignified." },
  ],
  bridge_need_planks: [
    { who: 'Fetsson', text: "I have a hammer but nothing to actually repair. I'm just a pig carrying a hammer." },
    { who: 'Pindus',  text: "A very well-equipped pig." },
  ],
  bridge_need_hammer: [
    { who: 'Fetsson', text: "I have planks, but planks don't nail themselves." },
    { who: 'Pindus',  text: "That would be a remarkable advance in woodworking." },
  ],
  bridge_fix_floor: [
    { who: 'Fetsson', text: "Planks in, nails down…" },
    { who: 'Fetsson', text: "There. That floor isn't going anywhere." },
    { who: 'Pindus',  text: "Solid as the day it was built! Presumably." },
  ],
  bridge_need_rope: [
    { who: 'Fetsson', text: "The railing is a polite fiction at this point. It's mostly fraying hope." },
    { who: 'Pindus',  text: "I once held a bridge together with six good sticks and sheer willpower." },
    { who: 'Fetsson', text: "That's not helpful, Pindus." },
  ],
  bridge_fix_railing: [
    { who: 'Fetsson', text: "Lash the rope around the posts… pull it taut…" },
    { who: 'Fetsson', text: "That should hold. Bridge is certified Fetsson-proof." },
    { who: 'Pindus',  text: "Now for that gate mechanism." },
  ],
  bridge_mechanism_hint: [
    { who: 'Fetsson', text: "This mechanism controls the gate chain. Those stone blocks on the platform look like they belong somewhere." },
    { who: 'Pindus',  text: "I see a scale. Two pans. Heavy-looking rocks." },
    { who: 'Fetsson', text: "Some kind of counterweight. If we can balance it…" },
    { who: 'Pindus',  text: "The inscriptions on the rocks might be a clue. Just a hunch." },
  ],
  bridge_repaired: [
    { who: 'Fetsson', text: "The counterweight swings — the gate groans open!" },
    { who: 'Pindus',  text: "Onwards! I can practically smell the apples from here." },
    { who: 'Fetsson', text: "That's the ravine, Pindus." },
    { who: 'Pindus',  text: "I have an optimistic nose." },
  ],
  bridge_already_fixed: [
    { who: 'Fetsson', text: "The bridge is solid. Let's keep moving." },
  ],

  // ── Waterfall ────────────────────────────────────────────────
  waterfall_intro: [
    { who: 'Pindus',  text: "Mossfall Grotto! I've read about this place. Apparently someone very wise or very bored carved symbols in the cave." },
    { who: 'Fetsson', text: "And the only way through is behind that waterfall." },
    { who: 'Pindus',  text: "Pitch dark inside. I can hear the underground stream from here." },
    { who: 'Fetsson', text: "That's just pleasant." },
  ],
  torch_pickup: [
    { who: 'Fetsson', text: "An unlit torch on a wall bracket. Someone left it here with either hope or foresight." },
  ],
  campfire_no_torch: [
    { who: 'Fetsson', text: "The embers are still warm. Hot enough to start something." },
    { who: 'Pindus',  text: "A shame we have nothing to start." },
  ],
  campfire_light: [
    { who: 'Fetsson', text: "I touch the torch to the embers…" },
    { who: 'Fetsson', text: "It catches! A warm orange flame. Now we're in business." },
  ],
  cave_dark: [
    { who: 'Fetsson', text: "Absolutely, completely pitch dark in there. I'd walk straight into the stream." },
    { who: 'Pindus',  text: "I went in three steps and introduced my face to a stalactite. It was cold and unyielding." },
  ],
  cave_torch_unlit: [
    { who: 'Fetsson', text: "I'm not going in there with an unlit torch. That's just carrying a stick with ambitions." },
    { who: 'Pindus',  text: "Technically it IS a stick. Just with a dramatic hat." },
  ],
  stepping_stone_intro: [
    { who: 'Pindus',  text: "The underground stream. Natural. Inevitable. Deeply inconvenient." },
    { who: 'Fetsson', text: "There are stepping stones across. Three in each column." },
    { who: 'Pindus',  text: "And symbols carved into the rock above them. Someone put thought into this." },
    { who: 'Fetsson', text: "Let's hope it's navigable thought rather than the decorative kind." },
  ],
  waterfall_crossed: [
    { who: 'Fetsson', text: "Made it! The cave opens onto the other side. My feet are only slightly damp." },
    { who: 'Pindus',  text: "I smell apples. Real apples. We're close!" },
  ],

  // ── Apple Orchard ────────────────────────────────────────────
  orchard_intro: [
    { who: 'Pindus',  text: "The apple orchard! Look at those trees!" },
    { who: 'Fetsson', text: "The apples are perfectly ripe. Mrs. Hen is going to love these." },
    { who: 'Pindus',  text: "I have already found four excellent sticks. This place is paradise." },
  ],
  apple_pickup_no_basket: [
    { who: 'Fetsson', text: "I want to grab every apple I can see, but I'd need something to carry them in." },
    { who: 'Pindus',  text: "Mrs. Hen was very thoughtful about that." },
  ],
  apple_pickup: [
    { who: 'Fetsson', text: "I fill the basket with the ripest, reddest apples I can find." },
    { who: 'Pindus',  text: "That should be plenty. I also collected seventeen premium sticks." },
    { who: 'Fetsson', text: "Pindus, we came for apples." },
    { who: 'Pindus',  text: "I came for both." },
  ],
  rush_home: [
    { who: 'Fetsson', text: "We have a full basket of beautiful apples. Time to race back to Mrs. Hen!" },
    { who: 'Pindus',  text: "I know a shortcut through the hedge — follow me!" },
  ],

  // ── Game complete ─────────────────────────────────────────────
  game_complete: [
    { who: 'Mrs. Hen', text: "You're back — and you found the apples! You both look absolutely exhausted. What happened out there?" },
    { who: 'Fetsson',  text: "We fixed the old bridge, balanced a counterweight gate, crossed a dark cave, and made it all the way to the orchard and back." },
    { who: 'Pindus',   text: "I also acquired twenty-two sticks of exceptional quality. Very productive journey." },
    { who: 'Mrs. Hen', text: "Twenty-two sticks! You are truly remarkable, Pindus." },
    { who: 'Pindus',   text: "That's what I keep telling everyone." },
    { who: 'Mrs. Hen', text: "Sit, sit! I'll make a fresh batch of apple pancakes. With real apples this time." },
    { who: 'Fetsson',  text: "The best morning on the farm, second edition." },
  ],
};
