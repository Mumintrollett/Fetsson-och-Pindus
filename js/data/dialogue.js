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
};
