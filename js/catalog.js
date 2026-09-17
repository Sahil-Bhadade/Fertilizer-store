/* =========================================================================
   CATALOG (products.html) — search, filters, rendering
   ========================================================================= */

function initCatalogFilters(){
  const catSelect = document.getElementById("filter-category");
  const brandSelect = document.getElementById("filter-brand");
  const packSelect = document.getElementById("filter-pack");
  const availSelect = document.getElementById("filter-availability");
  const searchInput = document.getElementById("filter-search");

  catSelect.innerHTML = `<option value="">All Categories</option>` +
    CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join("");
  brandSelect.innerHTML = `<option value="">All Brands</option>` +
    BRANDS.map(b => `<option value="${b}">${b}</option>`).join("");
  packSelect.innerHTML = `<option value="">All Pack Sizes</option>` +
    PACK_SIZES.map(p => `<option value="${p}">${p}</option>`).join("");

  // pre-select category from ?category= query param (used by homepage category tiles)
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get("category");
  if(initialCategory && CATEGORIES.includes(initialCategory)){
    catSelect.value = initialCategory;
  }

  [catSelect, brandSelect, packSelect, availSelect].forEach(el =>
    el.addEventListener("change", renderCatalog)
  );
  searchInput.addEventListener("input", debounce(renderCatalog, 150));

  document.getElementById("filters-reset")?.addEventListener("click", () => {
    catSelect.value = ""; brandSelect.value = ""; packSelect.value = "";
    availSelect.value = ""; searchInput.value = "";
    history.replaceState(null, "", location.pathname);
    renderCatalog();
  });
}

function debounce(fn, ms){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function renderCatalog(){
  const category = document.getElementById("filter-category").value;
  const brand = document.getElementById("filter-brand").value;
  const pack = document.getElementById("filter-pack").value;
  const availability = document.getElementById("filter-availability").value;
  const query = document.getElementById("filter-search").value.trim().toLowerCase();

  const results = PRODUCTS.filter(p => {
    if(category && p.category !== category) return false;
    if(brand && p.brand !== brand) return false;
    if(pack && p.packSize !== pack) return false;
    if(availability === "in" && p.stock === "out") return false;
    if(availability === "out" && p.stock !== "out") return false;
    if(query){
      const hay = `${p.name} ${p.brand} ${p.category} ${p.desc}`.toLowerCase();
      if(!hay.includes(query)) return false;
    }
    return true;
  });

  const grid = document.getElementById("catalog-grid");
  const countEl = document.getElementById("results-count");
  const emptyEl = document.getElementById("catalog-empty");

  countEl.textContent = `${results.length} product${results.length === 1 ? "" : "s"} found`;

  if(results.length === 0){
    grid.innerHTML = "";
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";
  grid.innerHTML = results.map(productCardHtml).join("");
  wireProductCards(grid);
}

document.addEventListener("DOMContentLoaded", () => {
  initCatalogFilters();
  renderCatalog();
});
