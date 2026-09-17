/* =========================================================================
   PRODUCT DATA
   -------------------------------------------------------------------------
   This is sample/demo inventory data. In a production version this array
   would instead be fetched from a backend / database (see the comment at
   the bottom of this file for how that swap would work).

   Product images are linked from manufacturer product pages (Coromandel,
   Mahyco) purely to represent real branded products for this demo. For a
   live shop site, replace `img` with photos of your own shelf stock.

   stock: "in" | "low" | "out"
   ========================================================================= */

const PRODUCTS = [

  // ---------------- FERTILIZERS ----------------
  {
    id: "fert-urea",
    name: "Urea (46% Nitrogen)",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "45 kg bag",
    price: 266,
    unit: "bag",
    desc: "Granular nitrogen fertiliser used as a basal and top-dressing application for most field crops.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Urea.webp",
    popular: true
  },
  {
    id: "fert-dap",
    name: "DAP (18-46-0)",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1350,
    unit: "bag",
    desc: "Di-Ammonium Phosphate for strong root development, ideal for basal application at sowing.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_DAP.webp",
    popular: true
  },
  {
    id: "fert-mop",
    name: "MOP (Muriate of Potash)",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1700,
    unit: "bag",
    desc: "Potassium-only fertiliser, ideal for both basal and top dressing to improve crop quality.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Bharat_MOP_Final.webp",
    popular: true
  },
  {
    id: "fert-npk-15",
    name: "NPK 15:15:15:09",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1470,
    unit: "bag",
    desc: "Balanced complex fertiliser with Nitrogen, Phosphorus, Potassium and Sulphur for overall crop growth.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Side_15-15-15-09_Side%20Number.webp"
  },
  {
    id: "fert-npk-1026",
    name: "NPK 10:26:26 (Zinc Fortified)",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1470,
    unit: "bag",
    desc: "Zinc-fortified complex fertiliser suited for crops needing higher Phosphorus and Potassium.",
    stock: "low",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Side_10-10-26-Zn.webp",
    popular: true
  },
  {
    id: "fert-ssp",
    name: "SSP (Single Super Phosphate)",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 500,
    unit: "bag",
    desc: "Phosphatic fertiliser with Sulphur and Calcium, an economical basal nutrient source.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_SSP_Double_Horse_Brand_Granulated_Nimrani.webp"
  },
  {
    id: "fert-npk-2020",
    name: "NPK 20:20:0:13",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1350,
    unit: "bag",
    desc: "Suited for crops grown in Sulphur-deficient soils, with balanced Nitrogen and Phosphorus.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Side_20-20-0-13_Side%20Number.webp"
  },
  {
    id: "fert-npk-1232",
    name: "NPK 12:32:16",
    brand: "Coromandel Gromor",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 1470,
    unit: "bag",
    desc: "High-Phosphorus complex fertiliser for basal application in a wide range of crops.",
    stock: "out",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Side_12-32-16.webp"
  },

  // ---------------- PLANT NUTRITION / MICRONUTRIENTS ----------------
  {
    id: "micro-zinc",
    name: "Zinc Sulphate 21%",
    brand: "Coromandel Gromor SulphoZinc",
    category: "Plant Nutrition",
    packSize: "1 kg pack",
    price: 90,
    unit: "pack",
    desc: "Corrects Zinc and Sulphur deficiency in soil, commonly needed for paddy and wheat.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Gromor-Sulphozinc.png",
    popular: true
  },
  {
    id: "micro-zinc-5kg",
    name: "Zinc Sulphate 21%",
    brand: "Coromandel Gromor SulphoZinc",
    category: "Plant Nutrition",
    packSize: "5 kg pack",
    price: 420,
    unit: "pack",
    desc: "Corrects Zinc and Sulphur deficiency in soil, commonly needed for paddy and wheat.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Gromor-Sulphozinc.png"
  },
  {
    id: "micro-boron",
    name: "Boron Granules (BoroSuper)",
    brand: "Coromandel Gromor",
    category: "Plant Nutrition",
    packSize: "1 kg pack",
    price: 150,
    unit: "pack",
    desc: "Boron micronutrient supplement that supports flowering and fruit-set in crops.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_BoroSuper_Powder.webp"
  },
  {
    id: "micro-mix",
    name: "Multi-Micronutrient Mixture (Magik)",
    brand: "Coromandel Gromor",
    category: "Plant Nutrition",
    packSize: "1 kg pack",
    price: 180,
    unit: "pack",
    desc: "A combination micronutrient mix for crops showing multiple deficiency symptoms.",
    stock: "low",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Magik_Powder.webp"
  },
  {
    id: "fert-gypsum",
    name: "Gypsum (Soil Conditioner)",
    brand: "Coromandel Godavari",
    category: "Plant Nutrition",
    packSize: "50 kg bag",
    price: 350,
    unit: "bag",
    desc: "Supplies Calcium and Sulphur while improving the physical condition of the soil.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Gypsum.png"
  },

  // ---------------- ORGANIC / BIO FERTILIZER ----------------
  {
    id: "org-neemcake",
    name: "Neem Cake Organic Fertiliser",
    brand: "Coromandel Godavari Ncake",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 900,
    unit: "bag",
    desc: "Neem-based organic manure that enriches soil while naturally deterring soil pests.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Godavari-Ncake.png",
    popular: true
  },
  {
    id: "bio-nfix",
    name: "Bio-Fertiliser (N & P Solubilising)",
    brand: "Coromandel Godavari Bhubhagya",
    category: "Fertilizers",
    packSize: "1 kg pack",
    price: 120,
    unit: "pack",
    desc: "Biofertiliser enriched with nitrogen-fixing and phosphorous-solubilising bacteria culture.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Godavari-Bhubhagya.png"
  },
  {
    id: "org-manure",
    name: "Organic Manure (Godavari Gold)",
    brand: "Coromandel Godavari",
    category: "Fertilizers",
    packSize: "50 kg bag",
    price: 450,
    unit: "bag",
    desc: "Rich source of organic nutrients that improves soil efficiency over the season.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Godavari-Gold.png"
  },

  // ---------------- SEEDS ----------------
  {
    id: "seed-maize",
    name: "Hybrid Maize Seeds — Baazigar 4062",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "4 kg bag",
    price: 1800,
    unit: "bag",
    desc: "110–115 day duration hybrid maize with long cobs and high shelling percentage. Suitable for Kharif & Rabi.",
    stock: "in",
    img: "https://www.mahyco.com/img/products/maize-hybrid/Maize-Baazigar-4062.png",
    popular: true
  },
  {
    id: "seed-paddy-jaladhi",
    name: "Hybrid Paddy Seeds — Jaladhi 2.0",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "10 kg bag",
    price: 1200,
    unit: "bag",
    desc: "High-yielding hybrid paddy variety suited to irrigated conditions.",
    stock: "in",
    img: "https://www.mahyco.com/img/products/paddy-hybrid/Jaladji-2.0-mrp-5319.jpg"
  },
  {
    id: "seed-paddy-raftar",
    name: "Hybrid Paddy Seeds — Raftar",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "10 kg bag",
    price: 1100,
    unit: "bag",
    desc: "Fast-maturing hybrid paddy variety popular with farmers looking for an early harvest.",
    stock: "low",
    img: "https://www.mahyco.com/img/products/paddy-hybrid/Raftar-mrp-5629.jpg"
  },
  {
    id: "seed-tomato",
    name: "Tomato Hybrid Seeds",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "10 g packet",
    price: 250,
    unit: "packet",
    desc: "High-yielding hybrid tomato variety with firm fruit suited for local and market sale.",
    stock: "in",
    img: "https://www.mahyco.com/img/products/tomato.jpg"
  },
  {
    id: "seed-brinjal",
    name: "Brinjal Hybrid Seeds",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "10 g packet",
    price: 220,
    unit: "packet",
    desc: "Vigorous hybrid brinjal variety with good fruit colour and shape.",
    stock: "in",
    img: "https://www.mahyco.com/img/products/brinjal.jpg"
  },
  {
    id: "seed-bhindi",
    name: "Bhindi (Okra) Hybrid Seeds",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "250 g packet",
    price: 180,
    unit: "packet",
    desc: "YVMV-tolerant hybrid okra suitable for a quick 50-day harvest cycle.",
    stock: "in",
    img: "https://www.mahyco.com/img/products/bhindi.jpg"
  },
  {
    id: "seed-chilli",
    name: "Chilli Hybrid Seeds",
    brand: "Mahyco",
    category: "Seeds",
    packSize: "10 g packet",
    price: 300,
    unit: "packet",
    desc: "Hybrid chilli variety selected for pungency, colour and disease tolerance.",
    stock: "out",
    img: "https://www.mahyco.com/img/products/chillies.jpg"
  },

  // ---------------- CROP PROTECTION ----------------
  {
    id: "cp-toscee",
    name: "Toscee Insecticide",
    brand: "Coromandel",
    category: "Crop Protection",
    packSize: "250 ml bottle",
    price: 450,
    unit: "bottle",
    desc: "Broad-spectrum contact insecticide effective against a wide range of sucking pests.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Toscee.png",
    popular: true
  },
  {
    id: "cp-marvex",
    name: "Marvex Larvicide",
    brand: "Coromandel",
    category: "Crop Protection",
    packSize: "250 ml bottle",
    price: 500,
    unit: "bottle",
    desc: "Combination larvicide for effective control of caterpillar and larval pests.",
    stock: "in",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Marvex.png"
  },
  {
    id: "cp-astra",
    name: "Astra Insecticide",
    brand: "Coromandel",
    category: "Crop Protection",
    packSize: "100 ml bottle",
    price: 350,
    unit: "bottle",
    desc: "Works effectively against sap-sucking pests such as brown plant hopper.",
    stock: "low",
    img: "https://www.coromandel.biz/wp-content/uploads/2025/03/Astra.png"
  },
];

const CATEGORIES = ["Fertilizers", "Seeds", "Plant Nutrition", "Crop Protection"];
const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();
const PACK_SIZES = [...new Set(PRODUCTS.map(p => p.packSize))].sort();

/* -------------------------------------------------------------------------
   PRODUCTION NOTE
   To connect this to a real backend later, replace the PRODUCTS array above
   with, e.g.:
     let PRODUCTS = [];
     async function loadProducts(){
       const res = await fetch('/api/products');
       PRODUCTS = await res.json();
     }
   Every function in catalog.js / main.js reads from the PRODUCTS array, so
   the rest of the site does not need to change.
   ------------------------------------------------------------------------- */
