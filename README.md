# nepexog

Minimal static storefront for **nepexog**.

The product model is intentionally narrow:

> One color. Two identical T-shirts. Vacuum-packed.

The site presents 24 colors as the primary product surface. Each color is sold only as a pair of two identical T-shirts in the same size.

## Files

```text
index.html
styles.css
script.js
README.md
```

No build step is required.

## Local preview

Open `index.html` directly in a browser.

Or run a simple local server:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Product logic

- 24 colors
- 1 selected color per product
- 2 identical T-shirts per product
- 1 selected size per pair
- Quantity `1` means one pair, not one T-shirt
- One pair = two T-shirts
- Each pair is described as vacuum-packed

## Current MVP behavior

Implemented:

- homepage
- 24-color grid
- hash-based color pages
- color cards with HEX codes
- automatic dark/light text on swatches
- size selection
- add pair to cart
- cart stored in `localStorage`
- quantity controls
- size guide page
- vacuum pack page
- checkout request placeholder via `mailto:`

Not implemented yet:

- real payment
- inventory sync
- shipping calculation
- CMS
- product photography
- real size measurements
- order backend

## Checkout placeholder

The current checkout button opens a mailto request to:

```text
orders@nepexog.com
```

Before launch, replace this with one of:

- Stripe Checkout
- Shopify Buy Button
- Snipcart
- Ecwid
- custom backend checkout

## Color data

Color data lives in `script.js` as the `colors` array.

Each color has:

```js
{
  id: "01",
  name: "White",
  hex: "#FFFFFF",
  slug: "white"
}
```

HEX codes must remain uppercase and use the `#RRGGBB` format.

## Deployment

The site can be published through GitHub Pages.

Recommended GitHub Pages settings:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Because the site uses hash routes such as `#/color/white`, it does not require server-side routing configuration.
