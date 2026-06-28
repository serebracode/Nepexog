const PRICE_PER_PAIR = 48;
const CURRENCY = "EUR";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const STORAGE_KEY = "nepexog-cart-v1";

const colors = [
  { id: "01", name: "White", hex: "#FFFFFF", slug: "white" },
  { id: "02", name: "Milk", hex: "#F4EFE7", slug: "milk" },
  { id: "03", name: "Stone", hex: "#D8D2C4", slug: "stone" },
  { id: "04", name: "Warm Grey", hex: "#A8A094", slug: "warm-grey" },
  { id: "05", name: "Cool Grey", hex: "#9EA4A6", slug: "cool-grey" },
  { id: "06", name: "Charcoal", hex: "#2F3030", slug: "charcoal" },

  { id: "07", name: "Black", hex: "#000000", slug: "black" },
  { id: "08", name: "Navy", hex: "#162A3A", slug: "navy" },
  { id: "09", name: "Blue", hex: "#2457A6", slug: "blue" },
  { id: "10", name: "Dust Blue", hex: "#7895A8", slug: "dust-blue" },
  { id: "11", name: "Cyan", hex: "#00A9C8", slug: "cyan" },
  { id: "12", name: "Ice", hex: "#D8EEF2", slug: "ice" },

  { id: "13", name: "Forest", hex: "#1F4A36", slug: "forest" },
  { id: "14", name: "Green", hex: "#2F8A4B", slug: "green" },
  { id: "15", name: "Mint", hex: "#A8D8BD", slug: "mint" },
  { id: "16", name: "Acid", hex: "#C8FF00", slug: "acid" },
  { id: "17", name: "Olive", hex: "#6F7443", slug: "olive" },
  { id: "18", name: "Sand", hex: "#D6B778", slug: "sand" },

  { id: "19", name: "Yellow", hex: "#FFD400", slug: "yellow" },
  { id: "20", name: "Orange", hex: "#F47A20", slug: "orange" },
  { id: "21", name: "Red", hex: "#D7261E", slug: "red" },
  { id: "22", name: "Brick", hex: "#9E3E2F", slug: "brick" },
  { id: "23", name: "Pink", hex: "#F2A7B8", slug: "pink" },
  { id: "24", name: "Violet", hex: "#5B3F8C", slug: "violet" }
].map((color) => ({
  ...color,
  hex: color.hex.toUpperCase(),
  price: PRICE_PER_PAIR,
  currency: CURRENCY,
  sizes: SIZES,
  available: true
}));

const app = document.querySelector("#app");
const cartCount = document.querySelector("[data-cart-count]");

let cart = readCart();
let selectedSize = null;

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const totalPairs = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = String(totalPairs);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0
  }).format(value);
}

function getColorBySlug(slug) {
  return colors.find((color) => color.slug === slug);
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const srgb = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return luminance > 0.48 ? "#111111" : "#FFFFFF";
}

function setDocumentTitle(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", description);
}

function route() {
  selectedSize = null;
  const hash = window.location.hash || "#/";
  const path = hash.replace(/^#\/?/, "");

  if (path.startsWith("color/")) {
    const slug = path.replace("color/", "");
    const color = getColorBySlug(slug);
    if (!color) return renderNotFound();
    return renderProduct(color);
  }

  if (path === "cart") return renderCart();
  if (path === "size") return renderSizeGuide();
  if (path === "pack") return renderPackPage();

  return renderHome();
}

function renderHome() {
  setDocumentTitle(
    "nepexog — 24 colors, two T-shirts",
    "nepexog sells color pairs: two identical T-shirts in one selected color, vacuum-packed."
  );

  app.innerHTML = `
    <section class="hero section">
      <div>
        <h1>One color.<br>Two T-shirts.</h1>
      </div>
      <div class="hero-copy">
        <p>24 colors. Two identical T-shirts in one chosen color. Vacuum-packed.</p>
        <div class="hero-meta" aria-label="Product summary">
          <div class="meta-cell"><strong>24</strong><span>colors</span></div>
          <div class="meta-cell"><strong>2</strong><span>T-shirts per pair</span></div>
          <div class="meta-cell"><strong>1</strong><span>selected color</span></div>
        </div>
      </div>
    </section>

    <section class="section" id="colors">
      <div class="section-header">
        <h2>Choose color.</h2>
        <p>Every product is sold as one pair: two identical T-shirts in the same color and size.</p>
      </div>
      <div class="color-grid" aria-label="24 nepexog colors">
        ${colors.map(renderColorCard).join("")}
      </div>
    </section>

    <section class="info-band" aria-label="Product principles">
      <article class="info-block">
        <h2>Pair always.</h2>
        <p>No single T-shirt purchase. One quantity means one pair: two identical T-shirts.</p>
      </article>
      <article class="info-block">
        <h2>Code visible.</h2>
        <p>Every color carries a six-character HEX code. The code is part of the product identity.</p>
      </article>
      <article class="info-block">
        <h2>Compact pack.</h2>
        <p>Each pair is vacuum-packed to reduce volume during storage and delivery.</p>
      </article>
    </section>
  `;
}

function renderColorCard(color) {
  const textColor = getReadableTextColor(color.hex);
  return `
    <a
      class="color-card"
      href="#/color/${color.slug}"
      style="--swatch: ${color.hex}; --card-text: ${textColor};"
      aria-label="Select ${color.name} ${color.hex}"
    >
      <span class="color-number">${color.id}</span>
      <span class="color-info">
        <span class="color-hex">${color.hex}</span>
        <span class="color-name">${color.name}</span>
      </span>
    </a>
  `;
}

function renderProduct(color) {
  setDocumentTitle(
    `nepexog ${color.id} ${color.name} ${color.hex} — Pair of 2 T-shirts`,
    `Two identical T-shirts in ${color.name} ${color.hex}. Vacuum-packed. One color, two T-shirts.`
  );

  const textColor = getReadableTextColor(color.hex);

  app.innerHTML = `
    <section class="product-page">
      <div class="product-swatch" style="--swatch: ${color.hex}; --card-text: ${textColor};">
        <div class="product-swatch-inner">
          <a class="back-link" href="#/">← All colors</a>
          <div>
            <p class="product-code">${color.id} / ${color.hex}</p>
            <h1 class="product-title">${color.name}</h1>
          </div>
        </div>
      </div>

      <div class="product-panel">
        <p class="product-code">Color ${color.id} / ${color.hex}</p>
        <h2 class="product-title">Pair of 2.</h2>
        <div class="product-summary">
          <p><strong>Two identical T-shirts.</strong></p>
          <p>Same color. Same size. Vacuum-packed.</p>
          <p>${formatMoney(color.price)} per pair.</p>
        </div>

        <fieldset class="size-group">
          <legend>Select size</legend>
          <div class="size-options">
            ${color.sizes.map((size) => `
              <button class="size-button" type="button" data-size="${size}" aria-pressed="false">${size}</button>
            `).join("")}
          </div>
        </fieldset>

        <button class="primary-button" type="button" data-add-to-cart disabled>Select size</button>
        <a class="secondary-button" href="#/cart">Open cart</a>
        <p class="product-note">Quantity 1 = one pair = two T-shirts.</p>
      </div>
    </section>
  `;

  app.querySelectorAll("[data-size]").forEach((button) => {
    button.addEventListener("click", () => selectSize(button.dataset.size));
  });

  app.querySelector("[data-add-to-cart]").addEventListener("click", () => {
    if (!selectedSize) return;
    addToCart(color, selectedSize);
  });
}

function selectSize(size) {
  selectedSize = size;
  app.querySelectorAll("[data-size]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.size === size));
  });

  const button = app.querySelector("[data-add-to-cart]");
  button.disabled = false;
  button.textContent = "Add pair to cart";
}

function addToCart(color, size) {
  const key = `${color.slug}-${size}`;
  const existing = cart.find((item) => item.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      key,
      colorId: color.id,
      slug: color.slug,
      name: color.name,
      hex: color.hex,
      size,
      price: color.price,
      quantity: 1
    });
  }

  saveCart();
  const button = app.querySelector("[data-add-to-cart]");
  button.textContent = "Added";
  setTimeout(() => {
    button.textContent = "Add pair to cart";
  }, 900);
}

function renderCart() {
  setDocumentTitle(
    "nepexog cart",
    "Your nepexog cart. One pair means two identical T-shirts."
  );

  const totalPairs = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalTshirts = totalPairs * 2;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  app.innerHTML = `
    <section class="cart-page">
      <div class="simple-page-header">
        <h1>Cart.</h1>
        <p>1 pair = 2 identical T-shirts. Quantity changes pairs, not single T-shirts.</p>
      </div>

      ${cart.length === 0 ? renderEmptyCart() : `
        <div class="cart-list">
          ${cart.map(renderCartItem).join("")}
        </div>
        <aside class="cart-summary" aria-label="Cart summary">
          <div class="summary-row"><span>Pairs</span><span>${totalPairs}</span></div>
          <div class="summary-row"><span>T-shirts</span><span>${totalTshirts}</span></div>
          <div class="summary-row total"><span>Total</span><span>${formatMoney(subtotal)}</span></div>
          <button class="primary-button" type="button" data-checkout>Checkout request</button>
          <p class="checkout-note">MVP checkout placeholder. Replace with Stripe, Shopify, Snipcart, or another payment flow.</p>
        </aside>
      `}
    </section>
  `;

  app.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => updateItemQuantity(button.dataset.increase, 1));
  });

  app.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => updateItemQuantity(button.dataset.decrease, -1));
  });

  app.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.remove));
  });

  const checkout = app.querySelector("[data-checkout]");
  if (checkout) checkout.addEventListener("click", openCheckoutRequest);
}

function renderCartItem(item) {
  return `
    <article class="cart-item">
      <div class="cart-swatch" style="--swatch: ${item.hex};" aria-hidden="true"></div>
      <div class="cart-details">
        <h2>Color ${item.colorId} — ${item.name}</h2>
        <p class="cart-code">${item.hex}</p>
        <p>Size ${item.size} / Pair of 2 T-shirts / ${formatMoney(item.price)} per pair</p>
      </div>
      <div class="cart-actions" aria-label="Quantity controls for ${item.name} size ${item.size}">
        <button class="quantity-button" type="button" data-decrease="${item.key}" aria-label="Decrease quantity">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-button" type="button" data-increase="${item.key}" aria-label="Increase quantity">+</button>
        <button class="remove-button" type="button" data-remove="${item.key}">Remove</button>
      </div>
    </article>
  `;
}

function renderEmptyCart() {
  return `
    <div class="empty-cart">
      <p>Your cart is empty.</p>
      <a class="secondary-button" href="#/">Choose a color</a>
    </div>
  `;
}

function updateItemQuantity(key, delta) {
  cart = cart.map((item) => {
    if (item.key !== key) return item;
    return { ...item, quantity: Math.max(1, item.quantity + delta) };
  });
  saveCart();
  renderCart();
}

function removeItem(key) {
  cart = cart.filter((item) => item.key !== key);
  saveCart();
  renderCart();
}

function openCheckoutRequest() {
  const lines = cart.map((item) => (
    `${item.quantity} pair(s) / Color ${item.colorId} ${item.name} ${item.hex} / Size ${item.size}`
  ));

  const totalPairs = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const body = [
    "nepexog order request",
    "",
    ...lines,
    "",
    `Pairs: ${totalPairs}`,
    `T-shirts: ${totalPairs * 2}`,
    `Total: ${formatMoney(subtotal)}`,
    "",
    "Name:",
    "Shipping address:",
    "Phone:"
  ].join("\n");

  window.location.href = `mailto:orders@nepexog.com?subject=${encodeURIComponent("nepexog order request")}&body=${encodeURIComponent(body)}`;
}

function renderSizeGuide() {
  setDocumentTitle(
    "nepexog size guide",
    "Standard T-shirt sizes for nepexog color pairs."
  );

  app.innerHTML = `
    <section class="size-page">
      <div class="simple-page-header">
        <h1>Size.</h1>
        <p>One selected size applies to both T-shirts in the pair. Mixed-size pairs are not available in the MVP.</p>
      </div>

      <table class="size-table" aria-label="Size guide">
        <thead>
          <tr>
            <th>Size</th>
            <th>Chest</th>
            <th>Length</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>XS</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
          <tr><td>S</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
          <tr><td>M</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
          <tr><td>L</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
          <tr><td>XL</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
          <tr><td>XXL</td><td>TBD</td><td>TBD</td><td>Placeholder</td></tr>
        </tbody>
      </table>
    </section>
  `;
}

function renderPackPage() {
  setDocumentTitle(
    "nepexog vacuum pack",
    "Each nepexog pair is vacuum-packed to reduce volume."
  );

  app.innerHTML = `
    <section class="pack-page">
      <div class="simple-page-header">
        <h1>Pack.</h1>
        <p>Each pair is vacuum-packed. Two T-shirts are compressed into one compact transparent pack.</p>
      </div>
      <section class="info-band">
        <article class="info-block">
          <h2>Less volume.</h2>
          <p>The pack reduces physical volume for storage and shipping.</p>
        </article>
        <article class="info-block">
          <h2>One pair.</h2>
          <p>Every pack contains two identical T-shirts in the same color and size.</p>
        </article>
        <article class="info-block">
          <h2>No excess.</h2>
          <p>The visual system should stay factual: color, code, size, pack.</p>
        </article>
      </section>
    </section>
  `;
}

function renderNotFound() {
  setDocumentTitle("nepexog — not found", "The requested nepexog page was not found.");
  app.innerHTML = `
    <section class="size-page">
      <div class="simple-page-header">
        <h1>Not found.</h1>
        <p>This color or page does not exist.</p>
        <a class="secondary-button" href="#/">Back to colors</a>
      </div>
    </section>
  `;
}

window.addEventListener("hashchange", route);
window.addEventListener("storage", () => {
  cart = readCart();
  updateCartCount();
});

updateCartCount();
route();
