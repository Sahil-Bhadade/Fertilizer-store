/* =========================================================================
   MAIN — shared behaviour loaded on every page
   ========================================================================= */

/* ---------- config hydration : fills [data-cfg="path.to.value"] elements ---------- */
function getConfigValue(path){
  return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), SITE_CONFIG);
}
function hydrateConfig(){
  document.querySelectorAll("[data-cfg]").forEach(el => {
    const val = getConfigValue(el.getAttribute("data-cfg"));
    if(val !== undefined) el.textContent = val;
  });
  document.querySelectorAll("[data-cfg-href]").forEach(el => {
    const val = getConfigValue(el.getAttribute("data-cfg-href"));
    if(val !== undefined) el.setAttribute("href", val);
  });
  document.querySelectorAll("[data-cfg-src]").forEach(el => {
    const val = getConfigValue(el.getAttribute("data-cfg-src"));
    if(val !== undefined) el.setAttribute("src", val);
  });
}

/* ---------- mobile nav ---------- */
function initMobileNav(){
  const openBtn = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-nav");
  const closeBtn = document.querySelector(".mobile-nav-close");
  if(!openBtn || !panel) return;
  const open = () => panel.classList.add("open");
  const close = () => panel.classList.remove("open");
  openBtn.addEventListener("click", open);
  if(closeBtn) closeBtn.addEventListener("click", close);
  panel.addEventListener("click", (e) => { if(e.target === panel) close(); });
}

/* ---------- theme switcher ---------- */
const THEME_KEY = "gbb_theme";
const THEMES = [
  { id: "harvest", label: "Harvest Green", swatch: "#1E5631" },
  { id: "earth",   label: "Earth Brown",   swatch: "#6B3F1D" },
  { id: "monsoon", label: "Monsoon Teal",  swatch: "#124F49" }
];
function applyTheme(themeId){
  if(themeId === "harvest"){
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", themeId);
  }
  try{ localStorage.setItem(THEME_KEY, themeId); }catch(e){}
}
function initThemeSwitcher(){
  const saved = (() => { try{ return localStorage.getItem(THEME_KEY); }catch(e){ return null; } })();
  if(saved) applyTheme(saved);

  const panel = document.querySelector(".theme-panel");
  const toggleBtn = document.querySelector(".theme-toggle-btn");
  if(!panel || !toggleBtn) return;
  panel.innerHTML = '<p>Choose a look</p>' + THEMES.map(t =>
    `<button type="button" class="theme-opt" data-theme-id="${t.id}">
       <span class="theme-swatch" style="background:${t.swatch}"></span> ${t.label}
     </button>`
  ).join("");
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panel.classList.toggle("open");
  });
  panel.querySelectorAll("[data-theme-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.getAttribute("data-theme-id"));
      panel.classList.remove("open");
    });
  });
  document.addEventListener("click", () => panel.classList.remove("open"));
}

/* ---------- toast ---------- */
let toastTimer = null;
function showToast(message){
  let el = document.querySelector(".toast");
  if(!el){
    el = document.createElement("div");
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

/* ---------- floating WhatsApp (general enquiry, not the pickup list) ---------- */
function initFloatingWhatsapp(){
  const btn = document.querySelector(".float-whatsapp");
  if(!btn) return;
  btn.addEventListener("click", () => {
    const msg = encodeURIComponent("Hello, I have a question about a product at " + SITE_CONFIG.shopName + ".");
    window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${msg}`, "_blank");
  });
}

/* ---------- stock badge helper (shared by homepage + catalog) ---------- */
function stockBadgeHtml(stock){
  if(stock === "out") return `<span class="stock-badge stock-out">Out of Stock</span>`;
  if(stock === "low") return `<span class="stock-badge stock-low">Low Stock</span>`;
  return `<span class="stock-badge stock-in">In Stock</span>`;
}

function productImgHtml(product){
  return `<div class="product-media" data-fallback>
      <img src="${product.img}" alt="${product.name}" loading="lazy"
           onerror="this.closest('[data-fallback]').classList.add('img-fallback')">
    </div>`;
}

/** Renders one product card. `compact=true` is used for the homepage strips. */
function productCardHtml(product){
  const disabled = product.stock === "out" ? "disabled" : "";
  return `
  <article class="product-card" data-id="${product.id}">
    ${productImgHtml(product)}
    ${stockBadgeHtml(product.stock)}
    <span class="cat-badge">${product.category}</span>
    <div class="product-body">
      <span class="product-brand">${product.brand}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-meta">
        <span>📦 ${product.packSize}</span>
      </div>
      <div class="product-meta">
        <span class="product-price">${formatRupees(product.price)} <small>/ ${product.unit} (approx.)</small></span>
      </div>
      <div class="qty-row">
        <div class="qty-stepper">
          <button type="button" class="qty-minus" ${disabled} aria-label="Decrease quantity">−</button>
          <input type="text" inputmode="numeric" class="qty-input" value="1" ${disabled} aria-label="Quantity">
          <button type="button" class="qty-plus" ${disabled} aria-label="Increase quantity">+</button>
        </div>
        <button type="button" class="btn btn-primary btn-sm add-cart-btn" ${disabled}>
          ${product.stock === "out" ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </div>
  </article>`;
}

/** Wires up qty steppers + add-to-cart buttons for any cards rendered into `root` */
function wireProductCards(root){
  root.querySelectorAll(".product-card").forEach(card => {
    const id = card.getAttribute("data-id");
    const input = card.querySelector(".qty-input");
    card.querySelector(".qty-minus")?.addEventListener("click", () => {
      input.value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    });
    card.querySelector(".qty-plus")?.addEventListener("click", () => {
      input.value = (parseInt(input.value, 10) || 1) + 1;
    });
    input?.addEventListener("change", () => {
      input.value = Math.max(1, parseInt(input.value, 10) || 1);
    });
    card.querySelector(".add-cart-btn")?.addEventListener("click", () => {
      const ok = addToCart(id, input.value);
      if(ok){
        const product = findProduct(id);
        showToast(`Added ${product.name} to your pickup list`);
        input.value = 1;
      }
    });
  });
}

/* ---------- Homepage-only renders (safe no-ops on other pages) ---------- */
const CATEGORY_IMAGES = {
  "Fertilizers": "https://www.coromandel.biz/wp-content/uploads/2025/03/c_Packshot_Urea.webp",
  "Seeds": "https://www.mahyco.com/img/products/paddy-hybrid/Raftar-mrp-5629.jpg",
  "Plant Nutrition": "https://www.coromandel.biz/wp-content/uploads/2025/03/Gromor-Sulphozinc.png",
  "Crop Protection": "https://www.coromandel.biz/wp-content/uploads/2025/03/Toscee.png"
};
const CATEGORY_TAGLINE = {
  "Fertilizers": "Urea, DAP, MOP, NPK & more",
  "Seeds": "Hybrid field crop & vegetable seeds",
  "Plant Nutrition": "Micronutrients & soil boosters",
  "Crop Protection": "Insecticides & pest control"
};

function renderPopularProducts(){
  const root = document.querySelector("[data-popular-products]");
  if(!root) return;
  const popular = PRODUCTS.filter(p => p.popular).slice(0, 8);
  root.innerHTML = popular.map(productCardHtml).join("");
  wireProductCards(root);
}

function renderCategoryTiles(){
  const root = document.querySelector("[data-category-tiles]");
  if(!root) return;
  root.innerHTML = CATEGORIES.map(cat => `
    <a class="cat-tile" href="products.html?category=${encodeURIComponent(cat)}">
      <img src="${CATEGORY_IMAGES[cat]}" alt="${cat}" loading="lazy">
      <div class="cat-tile-label">
        <h3>${cat}</h3>
        <span>${CATEGORY_TAGLINE[cat]}</span>
      </div>
    </a>
  `).join("");
}

function renderHowItWorks(){
  const root = document.querySelector("[data-how-it-works]");
  if(!root) return;
  root.innerHTML = SITE_CONFIG.howItWorks.map((step, i) => `
    <div class="step-card">
      <div class="step-num">${String(i+1).padStart(2,"0")}</div>
      <h3>${step.title}</h3>
      <p class="muted">${step.text}</p>
    </div>
  `).join("");
}

function renderWhyUs(){
  const root = document.querySelector("[data-why-us]");
  if(!root) return;
  const icons = [
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>`,
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v3a3 3 0 0 0 3 3h.5A4.5 4.5 0 0 0 11 18.9V21H8v2h8v-2h-3v-2.1A4.5 4.5 0 0 0 17.5 14H18a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1z"/></svg>`,
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8v4h8z"/></svg>`,
    `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.38 8.5 8.5 0 0 1-6.32-3.94L3 21l3-1.7A8.38 8.38 0 0 1 3 11.5 8.5 8.5 0 0 1 11.5 3a8.38 8.38 0 0 1 8.38 9z"/></svg>`
  ];
  root.innerHTML = SITE_CONFIG.whyUs.map((item, i) => `
    <div class="benefit-card">
      <div class="benefit-icon">${icons[i % icons.length]}</div>
      <h3>${item.title}</h3>
      <p class="muted">${item.text}</p>
    </div>
  `).join("");
}

function renderTrustChips(){
  const root = document.querySelector("[data-trust-chips]");
  if(!root) return;
  root.innerHTML = SITE_CONFIG.hero.trustChips.map(text => `
    <div class="trust-chip">
      <svg class="icon icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
      <span>${text}</span>
    </div>
  `).join("");
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  hydrateConfig();
  initMobileNav();
  initThemeSwitcher();
  initFloatingWhatsapp();
  refreshCartBadges();
  renderPopularProducts();
  renderCategoryTiles();
  renderHowItWorks();
  renderWhyUs();
  renderTrustChips();

  // highlight active nav link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .mobile-nav-panel a").forEach(a => {
    const href = a.getAttribute("href").split("?")[0];
    if(href === path) a.classList.add("active");
  });
});
