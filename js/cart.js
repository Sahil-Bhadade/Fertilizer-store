/* =========================================================================
   CART
   -------------------------------------------------------------------------
   The cart is a simple object of { productId: quantity } stored in the
   browser's localStorage under CART_KEY, so it persists as the customer
   moves between pages (and even if they close the tab and come back).

   This is a *pickup list*, not a payment cart — nothing here calculates
   shipping, taxes or takes payment. See js/pickup.js for the WhatsApp
   handoff step.
   ========================================================================= */

const CART_KEY = "gbb_cart_v1";

function getCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    console.error("Cart read failed", e);
    return {};
  }
}

function saveCart(cart){
  try{
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }catch(e){
    console.error("Cart save failed", e);
  }
  refreshCartBadges();
}

function findProduct(id){
  return PRODUCTS.find(p => p.id === id);
}

function addToCart(productId, qty){
  qty = Math.max(1, parseInt(qty, 10) || 1);
  const product = findProduct(productId);
  if(!product || product.stock === "out") return false;
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  return true;
}

function setCartQty(productId, qty){
  const cart = getCart();
  qty = parseInt(qty, 10) || 0;
  if(qty <= 0){
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId){
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}

function clearCart(){
  saveCart({});
}

function getCartCount(){
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

/** Returns an array of { product, qty, lineTotal } for every item in the cart */
function getCartDetailed(){
  const cart = getCart();
  return Object.keys(cart)
    .map(id => {
      const product = findProduct(id);
      if(!product) return null;
      const qty = cart[id];
      return { product, qty, lineTotal: (product.price || 0) * qty };
    })
    .filter(Boolean);
}

function getCartEstimatedTotal(){
  return getCartDetailed().reduce((sum, item) => sum + item.lineTotal, 0);
}

function formatRupees(n){
  return "₹" + Number(n).toLocaleString("en-IN");
}

/** Updates every cart-count badge + sticky mobile bar present on the current page */
function refreshCartBadges(){
  const count = getCartCount();
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
  const bar = document.querySelector(".mobile-cart-bar");
  if(bar){
    const label = bar.querySelector("[data-cart-bar-count]");
    if(label) label.textContent = count;
    bar.classList.toggle("show", count > 0);
  }
  // lets the floating WhatsApp button + theme switcher move out of the way
  // of the sticky mobile cart bar on small screens (see style.css)
  document.body.classList.toggle("has-cart-bar", !!bar && count > 0);
}

document.addEventListener("DOMContentLoaded", refreshCartBadges);
