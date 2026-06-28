const PRICE_PER_PAIR = 48;
const CURRENCY = "EUR";
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const STORAGE_KEY = "nepexog-cart-v3";
const colors = [
  ["01", "White", "#FFFFFF", "white"],
  ["02", "Milk", "#F4EFE7", "milk"],
  ["03", "Stone", "#D8D2C4", "stone"],
  ["04", "Warm Grey", "#A8A094", "warm-grey"],
  ["05", "Cool Grey", "#9EA4A6", "cool-grey"],
  ["06", "Charcoal", "#2F3030", "charcoal"],
  ["07", "Black", "#000000", "black"],
  ["08", "Navy", "#162A3A", "navy"],
  ["09", "Blue", "#2457A6", "blue"],
  ["10", "Dust Blue", "#7895A8", "dust-blue"],
  ["11", "Cyan", "#00A9C8", "cyan"],
  ["12", "Ice", "#D8EEF2", "ice"],
  ["13", "Forest", "#1F4A36", "forest"],
  ["14", "Green", "#2F8A4B", "green"],
  ["15", "Mint", "#A8D8BD", "mint"],
  ["16", "Acid", "#C8FF00", "acid"],
  ["17", "Olive", "#6F7443", "olive"],
  ["18", "Sand", "#D6B778", "sand"],
  ["19", "Yellow", "#FFD400", "yellow"],
  ["20", "Orange", "#F47A20", "orange"],
  ["21", "Red", "#D7261E", "red"],
  ["22", "Brick", "#9E3E2F", "brick"],
  ["23", "Pink", "#F2A7B8", "pink"],
  ["24", "Violet", "#5B3F8C", "violet"]
].map(([id, name, hex, slug]) => ({ id, name, hex, slug, price: PRICE_PER_PAIR, sizes: SIZES }));
const app = document.querySelector("#app");
const cartCount = document.querySelector("[data-cart-count]");
let cart = readCart();
let selectedSize = null;
let selectedQuantity = 1;
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function readCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch (error) { return []; }
}
function saveCart() { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount() { cartCount.textContent = String(cart.reduce((sum, item) => sum + item.quantity, 0)); }
function money(value) { return new Intl.NumberFormat("en", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(value); }
function bySlug(slug) { return colors.find((color) => color.slug === slug); }
function setTitle(title, description) {
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.setAttribute("content", description);
}
function clearApp() { app.replaceChildren(); }
function route() {
  selectedSize = null;
  selectedQuantity = 1;
  const path = (window.location.hash || "#/").replace(/^#\/?/, "");
  if (path.startsWith("color/")) {
    const color = bySlug(path.replace("color/", ""));
    return color ? renderProduct(color) : renderNotFound();
  }
  if (path === "cart") return renderCart();
  renderHome();
}
function renderHome() {
  setTitle("nepexog — 24 colors, two T-shirts", "A minimal catalog of 24 color pairs: two identical T-shirts in one selected color.");
  clearApp();
  const catalog = el("section", "catalog-page");
  const intro = el("div", "catalog-intro");
  ["24 colors", "2 identical T-shirts per order", "vacuum-packed"].forEach((text) => intro.append(el("p", "", text)));
  const grid = el("div", "tee-grid");
  grid.setAttribute("aria-label", "24 nepexog color T-shirts");
  colors.forEach((color) => grid.append(renderTeeCard(color)));
  catalog.append(intro, grid);
  app.append(catalog, renderInfoBlocks());
}
function renderInfoBlocks() {
  const section = el("section", "site-info");
  section.setAttribute("aria-label", "Product information");
  const blocks = [
    ["Delivery", "Compact shipping.", "Every pair is vacuum-packed to reduce volume during storage and delivery."],
    ["Contents", "Two T-shirts.", "Each order contains two identical T-shirts in the same selected color and size."],
    ["Price", money(PRICE_PER_PAIR) + " / pair.", "One quantity unit means one pair. One pair means two T-shirts."],
    ["Sizes", "Standard fit.", "Available in XS, S, M, L, XL, and XXL. One size applies to both T-shirts."]
  ];
  blocks.forEach(([label, title, body]) => {
    const article = el("article");
    article.append(el("span", "", label), el("h2", "", title), el("p", "", body));
    section.append(article);
  });
  return section;
}
function renderTeeCard(color) {
  const link = el("a", "tee-card");
  link.href = "#/color/" + color.slug;
  link.style.setProperty("--tee-color", color.hex);
  link.setAttribute("aria-label", "Open " + color.name + " " + color.hex);
  const visual = el("div", "tee-card-visual");
  visual.append(renderTeeVisual("front"));
  const meta = el("div", "tee-card-meta");
  const text = el("div");
  text.append(el("p", "color-code", color.hex), el("h2", "", color.name));
  meta.append(text, el("strong", "", money(color.price)));
  link.append(visual, meta);
  return link;
}
function renderTeeVisual(variant) {
  const tee = el("div", "tee-art" + (variant === "back" ? " tee-art--back" : ""));
  tee.setAttribute("aria-hidden", "true");
  ["tee-sleeve tee-sleeve--left", "tee-sleeve tee-sleeve--right", "tee-body", "tee-collar", "tee-neck", "tee-seam tee-seam--hem", "tee-seam tee-seam--left", "tee-seam tee-seam--right"].forEach((className) => tee.append(el("div", className)));
  return tee;
}
function renderMedia(kind, color) {
  if (kind === "fabric") {
    const media = el("div", "product-media product-media--fabric");
    media.style.setProperty("--tee-color", color.hex);
    media.append(el("div", "fabric-surface"));
    return media;
  }
  if (kind === "pack") {
    const media = el("div", "product-media product-media--pack");
    media.style.setProperty("--tee-color", color.hex);
    const pack = el("div", "vacuum-pack");
    const label = el("div", "pack-label", "nepexog");
    label.append(el("br"), el("span", "", "pair of 2"));
    pack.append(el("div", "pack-fold pack-fold--one"), el("div", "pack-fold pack-fold--two"), label);
    media.append(pack);
    return media;
  }
  const media = el("div", "product-media product-media--tee");
  media.style.setProperty("--tee-color", color.hex);
  media.append(renderTeeVisual(kind === "back" ? "back" : "front"));
  return media;
}
function renderProduct(color) {
  setTitle("nepexog " + color.id + " " + color.name + " " + color.hex, "Two identical T-shirts in one selected color.");
  clearApp();
  const page = el("section", "product-page");
  const gallery = el("div", "product-gallery");
  const main = el("div", "main-media");
  main.dataset.mainMedia = "true";
  main.append(renderMedia("front", color));
  const thumbs = el("div", "thumbs");
  thumbs.setAttribute("aria-label", "Product media");
  ["front", "back", "fabric", "pack"].forEach((kind, index) => thumbs.append(renderThumb(kind, color, index === 0)));
  gallery.append(main, thumbs);
  const details = el("aside", "product-details");
  const back = el("a", "back-link", "← 24 colors");
  back.href = "#/";
  const row = el("div", "color-row");
  const dot = el("span", "color-dot");
  dot.style.background = color.hex;
  row.append(dot, el("span", "", "Color " + color.id), el("span", "code-pill", color.hex));
  details.append(back, el("p", "eyebrow", "nepexog color pair"), el("h1", "", color.name), row, el("p", "product-price", money(color.price)), el("p", "product-description", "Two identical crewneck T-shirts in one selected color. Same color, same size, vacuum-packed."));
  const note = el("div", "included-note");
  note.append(el("strong", "", "This product is a pair."), el("span", "", "You receive 2 T-shirts of the same color and size."));
  details.append(note, renderSizeSelector(color), renderQuantitySelector(), renderPurchaseActions(color), renderDetailList());
  page.append(gallery, details);
  app.append(page);
}
function renderThumb(kind, color, active) {
  const thumb = el("button", "thumb" + (active ? " is-active" : ""));
  thumb.type = "button";
  thumb.dataset.gallery = kind;
  thumb.setAttribute("aria-pressed", String(active));
  if (kind === "fabric") {
    const fabric = el("span", "thumb-fabric");
    fabric.style.setProperty("--tee-color", color.hex);
    thumb.append(fabric);
  } else if (kind === "pack") {
    const pack = el("span", "thumb-pack");
    pack.style.setProperty("--tee-color", color.hex);
    pack.append(el("span"));
    thumb.append(pack);
  } else {
    const wrap = el("span");
    wrap.style.setProperty("--tee-color", color.hex);
    wrap.append(renderTeeVisual(kind));
    thumb.append(wrap);
  }
  thumb.append(el("em", "", kind[0].toUpperCase() + kind.slice(1)));
  thumb.addEventListener("click", () => setGallery(kind, color));
  return thumb;
}
function setGallery(kind, color) {
  const main = app.querySelector("[data-main-media]");
  main.replaceChildren(renderMedia(kind, color));
  app.querySelectorAll("[data-gallery]").forEach((button) => {
    const active = button.dataset.gallery === kind;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}
function renderSizeSelector(color) {
  const field = el("fieldset", "size-group");
  field.append(el("legend", "", "Size"));
  const options = el("div", "size-options");
  color.sizes.forEach((size) => {
    const button = el("button", "size-button", size);
    button.type = "button";
    button.dataset.size = size;
    button.setAttribute("aria-pressed", "false");
    button.addEventListener("click", () => selectSize(size));
    options.append(button);
  });
  field.append(options);
  return field;
}
function renderQuantitySelector() {
  const group = el("div", "quantity-group");
  group.append(el("label", "", "Pairs"));
  const control = el("div", "quantity-control");
  const minus = el("button", "", "−");
  const value = el("span", "", "1");
  const plus = el("button", "", "+");
  minus.type = "button";
  plus.type = "button";
  value.dataset.quantityValue = "true";
  minus.addEventListener("click", () => changeQuantity(-1));
  plus.addEventListener("click", () => changeQuantity(1));
  control.append(minus, value, plus);
  group.append(control, el("p", "", "1 pair = 2 T-shirts"));
  return group;
}
function renderPurchaseActions(color) {
  const actions = el("div", "purchase-actions");
  const add = el("button", "primary-button", "Select size");
  const buy = el("button", "secondary-button", "Checkout now");
  add.type = "button";
  buy.type = "button";
  add.disabled = true;
  buy.disabled = true;
  add.dataset.addToCart = "true";
  buy.dataset.buyNow = "true";
  add.addEventListener("click", () => { if (selectedSize) addToCart(color, selectedSize, selectedQuantity); });
  buy.addEventListener("click", () => { if (selectedSize) { addToCart(color, selectedSize, selectedQuantity); window.location.hash = "#/cart"; } });
  actions.append(add, buy);
  return actions;
}
function renderDetailList() {
  const list = el("div", "detail-list");
  [["Delivery", "Compact parcel. Shipping setup placeholder."], ["Packaging", "Vacuum-packed pair in one transparent pack."], ["Included", "2 same crewneck T-shirts, same color, same size."]].forEach(([title, body]) => {
    const item = el("div");
    item.append(el("strong", "", title), el("span", "", body));
    list.append(item);
  });
  return list;
}
function selectSize(size) {
  selectedSize = size;
  app.querySelectorAll("[data-size]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.size === size)));
  const add = app.querySelector("[data-add-to-cart]");
  const buy = app.querySelector("[data-buy-now]");
  add.disabled = false;
  buy.disabled = false;
  add.textContent = "Add to cart";
}
function changeQuantity(delta) {
  selectedQuantity = Math.max(1, selectedQuantity + delta);
  app.querySelector("[data-quantity-value]").textContent = String(selectedQuantity);
}
function addToCart(color, size, quantity) {
  const key = color.slug + "-" + size;
  const existing = cart.find((item) => item.key === key);
  if (existing) existing.quantity += quantity;
  else cart.push({ key, colorId: color.id, slug: color.slug, name: color.name, hex: color.hex, size, price: color.price, quantity });
  saveCart();
  const button = app.querySelector("[data-add-to-cart]");
  if (button) {
    button.textContent = "Added";
    setTimeout(() => { if (selectedSize) button.textContent = "Add to cart"; }, 900);
  }
}
function renderCart() {
  setTitle("nepexog cart", "Your nepexog cart. One pair means two identical T-shirts.");
  clearApp();
  const page = el("section", "cart-page");
  const header = el("div", "cart-header");
  const back = el("a", "back-link", "← Colors");
  back.href = "#/";
  header.append(back, el("h1", "", "Cart"), el("p", "", "Quantity is counted in pairs. One pair contains two identical T-shirts."));
  page.append(header);
  if (!cart.length) page.append(renderEmptyCart());
  else {
    const list = el("div", "cart-list");
    cart.forEach((item) => list.append(renderCartItem(item)));
    page.append(list, renderCartSummary());
  }
  app.append(page);
}
function renderCartItem(item) {
  const article = el("article", "cart-item");
  const art = el("div", "cart-art");
  art.style.setProperty("--tee-color", item.hex);
  art.append(renderTeeVisual("front"));
  const details = el("div", "cart-details");
  details.append(el("h2", "", item.name), el("p", "color-code", "Color " + item.colorId + " / " + item.hex), el("p", "", "Size " + item.size + ". Pair of 2 T-shirts. " + money(item.price) + " per pair."));
  const actions = el("div", "cart-actions");
  const minus = el("button", "", "−");
  const plus = el("button", "", "+");
  const remove = el("button", "", "Remove");
  minus.type = plus.type = remove.type = "button";
  minus.addEventListener("click", () => updateItemQuantity(item.key, -1));
  plus.addEventListener("click", () => updateItemQuantity(item.key, 1));
  remove.addEventListener("click", () => removeItem(item.key));
  actions.append(minus, el("span", "", String(item.quantity)), plus, remove);
  article.append(art, details, actions);
  return article;
}
function renderCartSummary() {
  const totalPairs = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = el("aside", "cart-summary");
  summary.setAttribute("aria-label", "Cart summary");
  [["Pairs", String(totalPairs)], ["T-shirts", String(totalPairs * 2)], ["Total", money(subtotal)]].forEach(([label, value], index) => {
    const row = el("div", index === 2 ? "total" : "");
    row.append(el("span", "", label), el("strong", "", value));
    summary.append(row);
  });
  const checkout = el("button", "primary-button", "Checkout request");
  checkout.type = "button";
  checkout.addEventListener("click", () => alert("Checkout placeholder. Connect a payment provider before launch."));
  summary.append(checkout, el("p", "", "MVP checkout placeholder. Connect Stripe, Shopify, Snipcart, or another payment flow."));
  return summary;
}
function renderEmptyCart() {
  const empty = el("div", "empty-cart");
  const link = el("a", "secondary-button", "Choose color");
  link.href = "#/";
  empty.append(el("p", "", "Your cart is empty."), link);
  return empty;
}
function updateItemQuantity(key, delta) {
  cart = cart.map((item) => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item);
  saveCart();
  renderCart();
}
function removeItem(key) { cart = cart.filter((item) => item.key !== key); saveCart(); renderCart(); }
function renderNotFound() {
  setTitle("nepexog — not found", "The requested nepexog page was not found.");
  clearApp();
  const page = el("section", "cart-page");
  const header = el("div", "cart-header");
  const back = el("a", "back-link", "← Colors");
  back.href = "#/";
  header.append(back, el("h1", "", "Not found"), el("p", "", "This color or page does not exist."));
  page.append(header);
  app.append(page);
}
window.addEventListener("hashchange", route);
window.addEventListener("storage", () => { cart = readCart(); updateCartCount(); });
updateCartCount();
route();
