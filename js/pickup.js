/* =========================================================================
   PICKUP REQUEST PAGE (pickup.html)
   -------------------------------------------------------------------------
   Payment is required before a request can be sent: the customer must pay
   the exact cart amount via UPI and tick the confirmation checkbox before
   the "Send Pickup Request on WhatsApp" button is enabled.

   IMPORTANT — read this: a static website with no backend/payment gateway
   cannot cryptographically verify that a UPI payment actually went through
   (there is no server to receive a bank/UPI confirmation webhook). What
   this page *can* do, and does, is: (1) open the customer's UPI app with
   the exact amount pre-filled, and (2) refuse to enable the WhatsApp send
   button until the customer explicitly ticks "I have completed the
   payment". That checkbox is a customer self-declaration, not a verified
   transaction — the shop should still glance at their own UPI app/bank
   notifications and match them against the Pickup ID before handing over
   packed items. A real payment gateway (Razorpay/Cashfree/PayU UPI
   Intents + webhook) would be needed for true server-side verification.
   ========================================================================= */

function renderPickupList(){
  const items = getCartDetailed();
  const listEl = document.getElementById("pickup-items");
  const totalEl = document.getElementById("pickup-total");
  const emptyEl = document.getElementById("pickup-empty");
  const reviewWrap = document.getElementById("pickup-review-wrap");

  if(items.length === 0){
    emptyEl.style.display = "block";
    reviewWrap.style.display = "none";
    return;
  }
  emptyEl.style.display = "none";
  reviewWrap.style.display = "";

  listEl.innerHTML = items.map(item => `
    <div class="pickup-list-item">
      <span>${item.product.name} <span class="muted">(${item.product.packSize})</span></span>
      <strong>× ${item.qty}</strong>
    </div>
  `).join("");
  totalEl.textContent = formatRupees(getCartEstimatedTotal());
}

function validateField(groupEl, isValid){
  groupEl.classList.toggle("error", !isValid);
  return isValid;
}

function buildWhatsAppMessage({ name, mobile, time, note, items, total, pickupId }){
  const lines = [];
  lines.push("Hello, I would like to purchase these items for pickup:");
  lines.push("");
  items.forEach((item, i) => {
    lines.push(`${i + 1}. ${item.product.name} — ${item.qty} ${item.product.unit}${item.qty > 1 ? "s" : ""} (${item.product.packSize})`);
  });
  lines.push("");
  lines.push(`Pickup ID: ${pickupId}`);
  lines.push(`Name: ${name}`);
  lines.push(`Mobile: ${mobile}`);
  lines.push(`Preferred Pickup Time: ${time}`);
  if(note && note.trim()){
    lines.push(`Note: ${note.trim()}`);
  }
  lines.push(`Amount Paid: ${formatRupees(total)}`);
  lines.push(`Payment: Paid via UPI to ${SITE_CONFIG.upiId} (please confirm receipt on your end)`);
  lines.push("");
  lines.push("Please keep these items packed and ready for pickup.");
  lines.push("");
  lines.push("Thank you.");
  return lines.join("\n");
}

function buildUpiUrl(amount, note){
  const params = new URLSearchParams({
    pa: SITE_CONFIG.upiId,
    pn: SITE_CONFIG.upiPayeeName,
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: note
  });
  return "upi://pay?" + params.toString();
}

/* ---------------------------------------------------------------------
   Mandatory payment gate
   --------------------------------------------------------------------- */
function initUpiPaymentGate(){
  const total = getCartEstimatedTotal();
  const payBtn = document.getElementById("upi-pay-btn");
  const checkbox = document.getElementById("confirm-paid-checkbox");
  const checkboxRow = document.getElementById("confirm-paid-row");
  const sendBtn = document.getElementById("send-whatsapp-btn");
  const lockHint = document.getElementById("whatsapp-lock-hint");
  const statusHint = document.getElementById("upi-status-hint");
  if(!payBtn || !checkbox) return;

  // fill in the amount everywhere it's shown, and build the UPI deep link
  ["upi-amount", "upi-amount-2", "upi-amount-3"].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = formatRupees(total);
  });
  const note = `Pickup order at ${SITE_CONFIG.shopName}`;
  payBtn.href = total > 0 ? buildUpiUrl(total, note) : "#";
  payBtn.target = "_blank";

  // Clicking "Pay via UPI" unlocks the confirmation checkbox (it opens the
  // customer's UPI app in a new tab/app-switch; this tab stays put).
  payBtn.addEventListener("click", () => {
    checkbox.disabled = false;
    statusHint.innerHTML = `Once your UPI payment is complete, tick the box above to unlock sending your request.`;
    checkbox.focus();
  });

  checkbox.addEventListener("change", () => {
    sendBtn.disabled = !checkbox.checked;
    checkboxRow.classList.toggle("unlocked", checkbox.checked);
    lockHint.style.display = checkbox.checked ? "none" : "block";
    if(checkbox.checked) showToast("Payment confirmed — you can now send your request");
  });
}

function isPaymentConfirmed(){
  const checkbox = document.getElementById("confirm-paid-checkbox");
  return !!checkbox && checkbox.checked;
}

function handlePickupSubmit(e){
  e.preventDefault();

  const nameInput = document.getElementById("cust-name");
  const mobileInput = document.getElementById("cust-mobile");
  const timeInput = document.getElementById("cust-time");
  const noteInput = document.getElementById("cust-note");

  const nameOk = validateField(nameInput.closest(".form-group"), nameInput.value.trim().length > 1);
  const mobileOk = validateField(mobileInput.closest(".form-group"), /^[6-9]\d{9}$/.test(mobileInput.value.trim()));
  const timeOk = validateField(timeInput.closest(".form-group"), timeInput.value.trim().length > 0);

  if(!nameOk || !mobileOk || !timeOk){
    showToast("Please fill in the highlighted fields");
    return;
  }

  const items = getCartDetailed();
  if(items.length === 0){
    showToast("Your pickup list is empty");
    return;
  }

  // Safety net: the submit button is disabled until this is true, but a
  // stray Enter-key submit or programmatic call should never bypass it.
  if(!isPaymentConfirmed()){
    showToast("Please complete the UPI payment and tick the confirmation box first");
    return;
  }

  const pickupId = nextPickupId();
  const total = getCartEstimatedTotal();
  const data = {
    name: nameInput.value.trim(),
    mobile: mobileInput.value.trim(),
    time: timeInput.value.trim(),
    note: noteInput.value.trim(),
    items,
    total,
    pickupId
  };

  // Save into the shared request store (feeds the admin dashboard)
  addRequest({
    id: pickupId,
    name: data.name,
    mobile: data.mobile,
    time: data.time,
    note: data.note,
    items: items.map(i => ({ name: i.product.name, packSize: i.product.packSize, qty: i.qty })),
    total,
    paymentPref: "upi",
    status: "New",
    createdAt: new Date().toISOString()
  });

  // Build & open WhatsApp
  const message = buildWhatsAppMessage(data);
  const waUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, "_blank");

  showConfirmation(data, waUrl);
  clearCart();
}

function showConfirmation(data, waUrl){
  document.getElementById("pickup-review-wrap").style.display = "none";
  const confirm = document.getElementById("pickup-confirm");
  confirm.classList.add("show");

  document.getElementById("confirm-pickup-id").textContent = data.pickupId;
  document.getElementById("confirm-name").textContent = data.name;
  document.getElementById("confirm-time").textContent = data.time;
  document.getElementById("confirm-total").textContent = formatRupees(data.total);
  document.getElementById("confirm-payment").textContent = "Paid via UPI";

  document.getElementById("confirm-items").innerHTML = data.items.map(item => `
    <div class="confirm-row"><span>${item.product.name} (${item.product.packSize})</span><strong>× ${item.qty}</strong></div>
  `).join("");

  document.getElementById("resend-whatsapp").href = waUrl;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPickupList();
  initUpiPaymentGate();
  document.getElementById("pickup-form")?.addEventListener("submit", handlePickupSubmit);
});
