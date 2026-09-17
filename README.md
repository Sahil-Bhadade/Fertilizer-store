# Ganesh Beej Bhandar — Pickup Ordering Website

A mobile-first website for a local fertilizer & agricultural products shop.
Customers browse products, build a pickup list, pay the exact amount via
UPI, and send the confirmed request to the shop on WhatsApp — no delivery,
no waiting in line at the counter.

**Flow:** Home → Products → Pickup List (Cart) → Customer Details → Pay via UPI → WhatsApp → Pickup ID

## Files

```
index.html          Homepage (hero, popular products, categories, how it works, contact)
products.html        Full catalog with search + filters
cart.html            Pickup list review page
pickup.html          Customer details form → WhatsApp send → confirmation screen
admin.html           Demo dashboard for the shop owner to track requests

css/style.css         All styling. Theme colours are CSS variables at the top of the file.

js/config.js          Shop name, address, hours, WhatsApp number, homepage wording
js/products-data.js   The product catalog (sample data)
js/cart.js            Pickup-list ("cart") logic, stored in the browser's localStorage
js/requests.js        Pickup request storage, shared by pickup.html and admin.html
js/main.js            Shared behaviour: nav, theme switcher, homepage rendering
js/catalog.js         Search/filter logic for products.html
js/pickup.js          Pickup form validation, WhatsApp message + Pickup ID generation
js/admin.js           Admin dashboard rendering + status updates
```

## The one setting you must change

Open **`js/config.js`** and set your real WhatsApp number:

```js
whatsappNumber: "919404939173",   // country code + number, no + or spaces
```

The same file also holds the shop address, hours, phone number and the
homepage headline/subheading/button text — change any of it without
touching the HTML.

> **Address note:** we could not find a verified public listing for this
> shop's exact street address, so `js/config.js` currently has a
> placeholder (`Main Road, Near S.T. Stand, Hadgaon, Dist. Nanded`).
> Please update `address.line1` / `address.line2` with the real address.

## Changing the look ("theme")

- All colours live as CSS variables at the top of `css/style.css` under `:root`.
  Change those hex values to re-brand the whole site in one place.
- The site also ships 3 ready-made colour themes (Harvest Green / Earth Brown /
  Monsoon Teal) that customers (or you) can switch between using the small
  🎨 button in the bottom-left corner — see `[data-theme="earth"]` and
  `[data-theme="monsoon"]` in `style.css` to edit or add more.
- Fonts are Google Fonts "Oswald" (headings) + "Mukta" (body), loaded in the
  `<head>` of each page.

## Updating products

Edit the `PRODUCTS` array in `js/products-data.js`. Each product looks like:

```js
{
  id: "fert-urea",              // must be unique
  name: "Urea (46% Nitrogen)",
  brand: "Coromandel Gromor",
  category: "Fertilizers",      // one of the CATEGORIES below
  packSize: "45 kg bag",
  price: 266,                   // indicative price shown to customers
  unit: "bag",
  desc: "Short description...",
  stock: "in",                  // "in" | "low" | "out"
  img: "https://...",
  popular: true                 // optional — shows it in the homepage strip
}
```

Product photos are currently linked from manufacturer product pages
(Coromandel, Mahyco) so the demo shows real fertilizer/seed packaging
instead of placeholder icons. **For your live shop**, replace `img` with
photos of your own shelf stock/packaging — hot-linked manufacturer images
can change or move at any time, and product cards will gracefully fall back
to a leaf icon if an image fails to load, but your own photos will look
more trustworthy to customers and load more reliably.

Prices are indicative only — double-check them against your actual selling
prices, since the customer now pays this exact amount via UPI before their
request is sent (see "Online UPI payment" below).

## Online UPI payment (required before sending)

Payment is now **mandatory and UPI-only** — there is no "pay at store"
option. The flow on `pickup.html` is:

1. The customer fills in their name, mobile number and pickup time.
2. They tap **"Pay ₹X via UPI"** — this opens their own UPI app (Google
   Pay, PhonePe, Paytm, etc.) with your UPI ID and the **exact cart total
   already filled in**, via the standard `upi://pay` link format. No
   payment gateway, API key or backend is needed for this part.
3. Only after they tick **"I have completed the UPI payment of ₹X"** does
   the **"Send Pickup Request on WhatsApp"** button become clickable —
   it's disabled (greyed out) until then, both visually and in the code
   (submitting the form any other way is blocked too).

Set your real UPI ID in **`js/config.js`**:

```js
upiId: "9130262687@upi",          // <- must be your real UPI ID (VPA)
upiPayeeName: "Ganesh Beej Bhandar",
```

**Important:** `9130262687@upi` is a placeholder. A bare mobile number is
*not* a valid UPI ID by itself — open your UPI app, go to your profile /
"My QR code", and copy your actual UPI ID (it will look like
`9130262687@ybl`, `9130262687@okaxis`, `9130262687@paytm`, etc. depending
on your bank/app) into `upiId`. Using the wrong handle can send the
payment request nowhere, or fail to open the app at all.

**Please read this before relying on it:** this is a plain static website
with no server, so it has **no way to cryptographically confirm a payment
actually happened** — there's nothing to receive a bank/UPI webhook. The
"I have completed the payment" checkbox is an honest customer
self-declaration, not a verified transaction, and that's the strongest
guarantee a frontend-only site can give. In practice this still stops
casual/accidental unpaid requests, since customers can't reach the send
button without opening the payment step and ticking the box — but a
customer could, in theory, tick the box without having paid. If you need
real, tamper-proof payment verification (blocking the message until money
is *confirmed* received), that requires integrating a payment gateway
that supports UPI Intents with server-side webhooks — e.g. Razorpay,
Cashfree, or PayU — which in turn requires a small backend to receive and
check that webhook. That's a meaningful next step beyond this static site,
and `js/pickup.js` is structured so that swap only touches the payment
gate function (`initUpiPaymentGate`) and the submit handler.

The WhatsApp message sent to the shop always states the amount paid and
that it was via UPI, and the admin dashboard shows the same — so the shop
can cross-check against their own UPI app notifications before handing
over packed items.

## Pickup IDs

Each successful request gets a **randomly generated Pickup ID** — 3 to 5
characters long, built from `A–Z`, `0–9`, `@` and `#` (e.g. `K7#`,
`9F@ZQ`, `B2X8`). IDs are never repeated: every ID handed out is recorded
in the browser, and a new one is only used once it's confirmed to be
unused. With that character set there are about 81 million possible IDs,
so a real shop will never run out.

## Admin dashboard

`admin.html` is a **local-only demo**: it reads/writes the same
browser-local data as the pickup flow, with no login and no server. It's
enough to demo and test the status flow (New → Preparing → Ready for
Pickup → Collected), but for real use you should:

1. Put it behind a login.
2. Replace `js/requests.js` with real API calls to a backend + database —
   every other file calls into that one file, so nothing else needs to change.

## Running it

No build step — just open `index.html` in a browser, or upload the whole
folder to any static web host (Netlify, Vercel, GitHub Pages, or your own
hosting). All pages, styles and scripts are plain HTML/CSS/JS.
