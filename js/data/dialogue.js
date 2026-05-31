// All spoken dialogue in the game, grouped by trigger key.
// Each value is an array of { who, text } lines fed to the dialogue engine.
export const DLG = {
  intro: [
    { who: 'Pindus',  text: 'Wakey wakey, Fetsson! The sun is shining and the roosters are crowing!' },
    { who: 'Pindus',  text: "Mrs. Hen promised us her legendary apple pancakes today. I've been up since dawn!" },
    { who: 'Fetsson', text: "Mmm… pancakes… I'm up, I'm up!" },
    { who: 'Pindus',  text: "Oh — I noticed something sticking out of that hay bale earlier. Worth a look!" },
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
    { who: 'Pindus',  text: "That's odd. Mrs. Hen always keeps a spare key somewhere on the farm." },
    { who: 'Pindus',  text: "We just need to find it!" },
  ],
  farmhouse_locked_again: [
    { who: 'Fetsson', text: "Still locked. I need to find the spare key first." },
  ],
  scarecrow: [
    { who: 'Scarecrow', text: '… … …' },
    { who: 'Fetsson',   text: 'Did… did the scarecrow just speak?' },
    { who: 'Scarecrow', text: 'CREEAK… The little stone man in the garden… he guards what you seek…' },
    { who: 'Pindus',    text: "It means the garden gnome! The key must be hidden near the garden gnome!" },
    { who: 'Fetsson',   text: "Right. Now if only we could get INTO the garden…" },
  ],
  rusty_gate: [
    { who: 'Fetsson', text: "This gate is solid rust. It won't budge." },
  ],
  rusty_gate_hint: [
    { who: 'Fetsson', text: "This gate is really stuck. The hinges are completely seized up." },
    { who: 'Pindus',  text: "Water dissolves rust, you know. Stick-insect science fact!" },
  ],
  gate_open_water: [
    { who: 'Fetsson', text: "Let me pour this water on the rusty hinges…" },
    { who: 'Fetsson', text: "There we go! That loosened things up!" },
    { who: 'Pindus',  text: "The garden is open! Excellent stick-insect teamwork." },
  ],
  pickup_bucket: [
    { who: 'Fetsson', text: "An old wooden bucket by the well. Might be useful." },
  ],
  well_no_bucket: [
    { who: 'Fetsson', text: "A lovely stone well. The water looks cold and fresh." },
    { who: 'Pindus',  text: "If only we had something to carry it in…" },
  ],
  fill_bucket: [
    { who: 'Fetsson', text: "I'll fill the bucket with well water." },
    { who: 'Pindus',  text: "Cold and clear! Perfect for dissolving stubborn rust." },
  ],
  gnome_no_stick: [
    { who: 'Fetsson', text: "I can see something shiny under that gnome, but my hoof can't reach it." },
    { who: 'Pindus',  text: "You need something long and thin. If only you had… a stick!" },
  ],
  gnome_with_stick: [
    { who: 'Fetsson', text: "Let me use this stick to fish under the gnome…" },
    { who: 'Fetsson', text: "Got it!" },
    { who: 'Pindus',  text: "It's a key! That must be Mrs. Hen's spare house key!" },
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
    { who: 'Mrs. Hen', text: "…Well, I suppose that's a compliment. But now I'm completely out of apples." },
    { who: 'Pindus',   text: "A tragedy! The orchard apples are the finest on the farm. But it's past the old bridge and the waterfall cave…" },
    { who: 'Mrs. Hen', text: "Oh, would you two be dears and fetch some? Take this basket. And — the old toolbox in the barn has everything you'll need. The combination is seven. Same as the pancakes you just ate off my floor." },
    { who: 'Pindus',   text: "Seven. Committed to memory!" },
  ],

  // ── Barn toolbox ─────────────────────────────────────────────
  toolbox_locked: [
    { who: 'Fetsson', text: "An old toolbox with a combination lock. Three dials." },
    { who: 'Pindus',  text: "Mrs. Hen said something about the code… what was it again?" },
  ],
  toolbox_open: [
    { who: 'Fetsson', text: "The combination is seven — same as the pancakes. Let me try…" },
    { who: 'Fetsson', text: "Click! The lock opens." },
    { who: 'Fetsson', text: "A sturdy hammer and a good length of rope. Just what I needed." },
  ],
  toolbox_empty: [
    { who: 'Fetsson', text: "Empty now. I already took the hammer and rope." },
  ],

  // ── Bridge ───────────────────────────────────────────────────
  bridge_intro: [
    { who: 'Pindus',  text: "The old rope bridge! It used to connect the farm to the apple orchard…" },
    { who: 'Fetsson', text: "Used to is right. Planks are missing everywhere, the railing is snapped, and that counterweight gate is locked shut." },
    { who: 'Pindus',  text: "We'll need planks and a hammer to fix the floor, some rope for the railing, then figure out that gate mechanism." },
    { who: 'Fetsson', text: "One step at a time. There's a woodpile by the old shed." },
  ],
  bridge_planks_pickup: [
    { who: 'Fetsson', text: "A pile of spare planks! Exactly the right length for the bridge." },
  ],
  bridge_no_tools: [
    { who: 'Fetsson', text: "Several planks are missing. This bridge won't hold our weight." },
    { who: 'Pindus',  text: "We need planks AND a hammer to nail them in. Mrs. Hen's toolbox in the barn had both!" },
  ],
  bridge_need_planks: [
    { who: 'Fetsson', text: "I have a hammer but nothing to replace the missing planks with." },
    { who: 'Pindus',  text: "There's a woodpile near the left side of the bridge!" },
  ],
  bridge_need_hammer: [
    { who: 'Fetsson', text: "I have planks, but nothing to nail them down. The toolbox in the barn had a hammer." },
  ],
  bridge_fix_floor: [
    { who: 'Fetsson', text: "Planks down, nails in…" },
    { who: 'Fetsson', text: "There! The floor is solid again." },
    { who: 'Pindus',  text: "Excellent carpigwork!" },
    { who: 'Fetsson', text: '"Carpigwork" is not a word, Pindus.' },
    { who: 'Pindus',  text: "It is now." },
  ],
  bridge_need_rope: [
    { who: 'Fetsson', text: "The railing is snapped clean through. Someone could fall into the ravine." },
    { who: 'Pindus',  text: "Rope would fix it! Mrs. Hen put some in the toolbox, remember?" },
  ],
  bridge_fix_railing: [
    { who: 'Fetsson', text: "Lash the rope around the posts… tie it firm…" },
    { who: 'Fetsson', text: "That'll hold. Railing's secure." },
    { who: 'Pindus',  text: "Now for that gate. It looks like a counterweight puzzle." },
  ],
  bridge_mechanism_hint: [
    { who: 'Pindus',  text: "See those four stone blocks? There's a riddle plaque: 'Four stones, four weights. The star outweighs all. The moon is second. The sun is third. The cloud weighs least.'" },
    { who: 'Fetsson', text: "So I need to stack them in order — heaviest at the base, lightest at the crown." },
    { who: 'Pindus',  text: "Correct! Get the order wrong and the whole stack resets. Think before you place!" },
  ],
  bridge_repaired: [
    { who: 'Fetsson', text: "The counterweight swings down — the gate creaks open!" },
    { who: 'Pindus',  text: "Brilliant! The orchard path is just beyond the waterfall now." },
  ],
  bridge_already_fixed: [
    { who: 'Fetsson', text: "The bridge is solid. Let's press on." },
  ],

  // ── Waterfall ────────────────────────────────────────────────
  waterfall_intro: [
    { who: 'Pindus',  text: "Mossfall Grotto! The waterfall pours down from the ridge." },
    { who: 'Fetsson', text: "And the only way through is that cave behind the falls." },
    { who: 'Pindus',  text: "It's completely dark inside. I can hear the underground stream echoing." },
    { who: 'Fetsson', text: "There's a torch bracket on the cave wall and those fire-pit embers look warm…" },
  ],
  torch_pickup: [
    { who: 'Fetsson', text: "An unlit torch left on the wall bracket. Useful — if I can light it." },
  ],
  campfire_no_torch: [
    { who: 'Fetsson', text: "Still-warm embers. Easily hot enough to light something." },
    { who: 'Pindus',  text: "Good thing there's an unlit torch on that wall bracket over there!" },
  ],
  campfire_light: [
    { who: 'Fetsson', text: "I touch the torch to the embers…" },
    { who: 'Fetsson', text: "It catches! A warm orange flame. Now I can see in the dark." },
  ],
  cave_dark: [
    { who: 'Fetsson', text: "It's pitch dark in there. I can't see my own hoof." },
    { who: 'Pindus',  text: "We need a light source. That torch on the wall bracket — and the campfire embers should still be warm!" },
  ],
  cave_torch_unlit: [
    { who: 'Fetsson', text: "I have a torch but it isn't lit. The campfire embers might still be warm enough." },
  ],
  stepping_stone_intro: [
    { who: 'Pindus',  text: "The underground stream! Look — there are carvings above each column of stones." },
    { who: 'Fetsson', text: "Symbols… some kind of guide?" },
    { who: 'Pindus',  text: "I've seen these in the Cave Elder's almanac. Arch means middle. Peak means top. Bowl means bottom. Diamond means middle." },
    { who: 'Fetsson', text: "So I read the symbol above each column and step on the matching row." },
    { who: 'Pindus',  text: "Exactly! One wrong step and the stream will reset you. It's very cold." },
  ],
  waterfall_crossed: [
    { who: 'Fetsson', text: "Made it! The cave opens out onto the other side." },
    { who: 'Pindus',  text: "The apple orchard is just ahead — I can already smell them!" },
  ],

  // ── Apple Orchard ────────────────────────────────────────────
  orchard_intro: [
    { who: 'Pindus',  text: "The apple orchard! Look at those trees!" },
    { who: 'Fetsson', text: "The apples are perfectly ripe. Mrs. Hen is going to love these." },
    { who: 'Pindus',  text: "I have already found four excellent sticks. This place is paradise." },
  ],
  apple_pickup_no_basket: [
    { who: 'Fetsson', text: "I want to grab every apple I can see, but I have nothing to carry them in." },
    { who: 'Pindus',  text: "Mrs. Hen gave us a basket for exactly this!" },
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
    { who: 'Fetsson',  text: "We fixed the old bridge, crossed a dark cave, and made it all the way to the orchard and back." },
    { who: 'Pindus',   text: "I also acquired twenty-two sticks of exceptional quality. Very productive journey." },
    { who: 'Mrs. Hen', text: "Twenty-two sticks! You are truly remarkable, Pindus." },
    { who: 'Pindus',   text: "That's what I keep telling everyone." },
    { who: 'Mrs. Hen', text: "Sit, sit! I'll make a fresh batch of apple pancakes. With real apples this time." },
    { who: 'Fetsson',  text: "The best morning on the farm, second edition." },
  ],
};
