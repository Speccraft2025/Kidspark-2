// ---------------------------------------------------------------------------
// KidSpark product catalog — the SERVER-SIDE source of truth.
//
// Prices here are authoritative. The browser never sends a price; it only sends
// product ids, and the checkout function looks the price up in this file.
//
// priceKobo = price in Naira x 100  (Paystack charges in kobo).
//   e.g. NGN 1,500  ->  150000
//
// storagePath = the object path inside your PRIVATE Supabase bucket.
//   Upload the packaged file (a single PDF per pack, one ZIP for the bundle)
//   to that exact path. See SETUP.md.
//
// TODO(kidspark): set your real prices before going live.
// ---------------------------------------------------------------------------

const PRODUCTS = [
  {
    id: 'complete-bundle',
    name: 'KidSpark Complete Bundle',
    description: 'Every pack — Alphabet, Food, Fruits, Wildlife, Mazes & Join-the-Dots. Best value.',
    type: 'bundle',
    priceKobo: 600000, // NGN 6,000  <-- PLACEHOLDER
    files: [
      { name: 'KidSpark Complete Bundle', storagePath: 'bundle/kidspark-complete-bundle.zip' },
    ],
  },
  {
    id: 'alphabet',
    name: 'Alphabet Coloring Pack',
    description: 'Master the ABCs with fun, simple illustrations for every letter.',
    type: 'pack',
    priceKobo: 150000, // NGN 1,500  <-- PLACEHOLDER
    files: [{ name: 'Alphabet Coloring Pack', storagePath: 'packs/alphabet.pdf' }],
  },
  {
    id: 'food',
    name: 'Food Coloring Pack',
    description: 'Healthy snacks and yummy treats to bring to life with color.',
    type: 'pack',
    priceKobo: 150000, // PLACEHOLDER
    files: [{ name: 'Food Coloring Pack', storagePath: 'packs/food.pdf' }],
  },
  {
    id: 'fruits',
    name: 'Fruits Coloring Pack',
    description: 'A juicy set of fruit illustrations for little colorists.',
    type: 'pack',
    priceKobo: 150000, // PLACEHOLDER
    files: [{ name: 'Fruits Coloring Pack', storagePath: 'packs/fruits.pdf' }],
  },
  {
    id: 'wildlife',
    name: 'Wildlife Coloring Pack',
    description: 'Venture into the wild and bring majestic animals to life.',
    type: 'pack',
    priceKobo: 150000, // PLACEHOLDER
    files: [{ name: 'Wildlife Coloring Pack', storagePath: 'packs/wildlife.pdf' }],
  },
  {
    id: 'mazes',
    name: 'Maze Activity Pack',
    description: '21 printable mazes to sharpen focus and problem-solving.',
    type: 'pack',
    priceKobo: 150000, // PLACEHOLDER
    files: [{ name: 'Maze Activity Pack', storagePath: 'packs/mazes.pdf' }],
  },
  {
    id: 'dots',
    name: 'Join-the-Dots Activity Pack',
    description: '37 connect-the-dots pages for counting and fine motor skills.',
    type: 'pack',
    priceKobo: 150000, // PLACEHOLDER
    files: [{ name: 'Join-the-Dots Activity Pack', storagePath: 'packs/join-the-dots.pdf' }],
  },
];

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

// Public view — safe to expose to the browser (no storage paths).
function publicCatalog() {
  return PRODUCTS.map(({ id, name, description, type, priceKobo }) => ({
    id,
    name,
    description,
    type,
    priceKobo,
    priceNaira: priceKobo / 100,
  }));
}

// Look up a validated list of product ids and total them, server-side.
// Throws on any unknown id so we never charge for something that isn't real.
function resolveCart(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Cart is empty.');
  }
  const unique = [...new Set(ids)];
  const items = unique.map((id) => {
    const product = byId.get(id);
    if (!product) throw new Error(`Unknown product: ${id}`);
    return product;
  });
  const amountKobo = items.reduce((sum, p) => sum + p.priceKobo, 0);
  return { items, amountKobo };
}

module.exports = { PRODUCTS, byId, publicCatalog, resolveCart };
