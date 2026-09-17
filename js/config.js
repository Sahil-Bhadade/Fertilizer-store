/* =========================================================================
   SITE CONFIGURATION
   -------------------------------------------------------------------------
   Edit the values below to customise the site for your shop — nothing
   else in the codebase needs to change. This file is intentionally kept
   separate from the design (css/style.css) and product data
   (js/products-data.js) so a shop owner (or a developer helping them) can
   update contact details, WhatsApp number and homepage wording in one place.
   ========================================================================= */

const SITE_CONFIG = {

  // ---- IMPORTANT: WhatsApp number the pickup requests are sent to ----
  // Use full international format WITHOUT "+", spaces or dashes.
  // Example for an Indian mobile 94049 39173 -> "919404939173"
  whatsappNumber: "919404939173",

  // Phone number shown on the site (can include spaces for readability)
  phoneDisplay: "94049 39173",
  phoneDial: "tel:+919404939173",

  // ---- UPI payment (opens the customer's own UPI app with the amount pre-filled) ----
  // IMPORTANT: "pa" must be your actual UPI ID (VPA), e.g. "9130262687@ybl",
  // "9130262687@okaxis", "9130262687@paytm" etc. — check "My UPI ID" inside
  // your UPI app (Google Pay / PhonePe / Paytm) and replace the value below.
  // A bare mobile number without the @handle part will NOT work reliably.
  upiId: "9130262687@upi",
  upiPayeeName: "Ganesh Beej Bhandar",

  shopName: "Ganesh Beej Bhandar",
  shopTagline: "Beej • Khad • Krishi Seva",
  shopTaglineEnglish: "Seeds, Fertilizers & Crop Care — Hadgaon",

  // NOTE: We could not confirm a verified street address for this shop
  // during setup — replace the placeholder below with the exact address.
  address: {
    line1: "Main Road, Near S.T. Stand",
    line2: "Hadgaon, Dist. Nanded, Maharashtra – 431712",
  },

  hours: {
    weekdays: "Mon – Sat: 8:00 AM – 8:30 PM",
    sunday: "Sunday: 9:00 AM – 2:00 PM",
  },

  // Google Maps search link — works even without a pinned listing.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Ganesh+Beej+Bhandar+Hadgaon+Maharashtra",
  mapsEmbedUrl: "https://www.google.com/maps?q=Ganesh+Beej+Bhandar+Hadgaon+Maharashtra&output=embed",

  // ---- Homepage copy — change freely, layout will not break ----
  hero: {
    headline: "Skip the Waiting. Pick Up Your Fertilizers Ready.",
    subheading: "Choose your fertilizers online, send your list to us, and we'll keep your items packed and ready for pickup at the shop.",
    primaryBtn: "Shop Fertilizers",
    secondaryBtn: "How It Works",
    trustChips: [
      "Trusted by farmers across Hadgaon",
      "Items packed before you arrive",
      "Secure UPI payment before pickup"
    ]
  },

  howItWorks: [
    { title: "Choose Products", text: "Browse fertilizers, seeds and crop care items and select what you need." },
    { title: "Pay & Send Request", text: "Pay the exact amount via UPI, then send your list to the shop on WhatsApp." },
    { title: "We Pack Your Items", text: "Our team prepares and packs your selected products at the shop." },
    { title: "Pick Up Your Order", text: "Visit the shop at your chosen time and collect your already-paid, packed items." }
  ],

  whyUs: [
    { title: "Save Your Time", text: "No standing in line while your items are weighed and packed — it's done before you arrive." },
    { title: "Items Packed & Ready", text: "Your exact list is prepared in advance so you walk in and walk out." },
    { title: "Pay Instantly via UPI", text: "Pay the exact amount securely with any UPI app before you even leave home." },
    { title: "Simple WhatsApp Process", text: "No app to install — just WhatsApp, which you already use every day." }
  ]
};
