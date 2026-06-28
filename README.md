# nepexog

Minimal static storefront for **nepexog**.

The current layout is built around the product image, not a plain color swatch:

> One color. Two identical T-shirts. Vacuum-packed.

The homepage displays 24 T-shirt cards. The same procedural T-shirt template is reused for every card, and the actual product color is applied through CSS variables from the color data.

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
- each color has a visible `#RRGGBB` HEX code
- one product is always one pair
- one pair contains 2 identical T-shirts
- one selected size applies to both T-shirts
- quantity is counted in pairs, not individual T-shirts
- every pair is described as vacuum-packed

## Current MVP behavior

Implemented:

- centered lowercase logo in the header
- cart button on the right
- homepage grid of 24 colored T-shirt cards
- reusable CSS-based T-shirt image template
- product page split into gallery and product data
- product gallery states: front, back, fabric close-up, vacuum pack
- color-specific product page
- size selector
- pair quantity selector
- add to cart
- checkout-now flow into cart
- cart stored in `localStorage`
- delivery, contents, price, and size information below the homepage grid
- checkout placeholder

Not implemented yet:

- real payment
- inventory sync
- shipping calculation
- CMS
- real product photography
- real size measurements
- order backend

## Product image system

The T-shirt and packaging visuals are procedural HTML/CSS graphics inside `script.js` and `styles.css`.

The key CSS variable is:

```css
--tee-color: #FFFFFF;
```

Every product color from the `colors` array is applied to the same visual template through that variable.

This means the site does not need 24 separate product images for the MVP.

## Checkout placeholder

The current checkout button shows a placeholder alert.

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
["01", "White", "#FFFFFF", "white"]
```

HEX codes should remain uppercase and use the `#RRGGBB` format.

## Deployment

The site can be published through GitHub Pages.

Recommended GitHub Pages settings:

```text
Source: Deploy from a branch
Branch: main
Folder: /root
```

Because the site uses hash routes such as `#/color/white`, it does not require server-side routing configuration.
