/* =========================================================================
   ADMIN DASHBOARD (admin.html)
   -------------------------------------------------------------------------
   Demo view for the shop owner. Reads/writes the same localStorage data
   used by the pickup flow via js/requests.js. In production this would be
   a password-protected page reading from a real backend.
   ========================================================================= */

function statusClass(status){
  return "status-" + status.toLowerCase().replace(/[^a-z]+/g, "-").replace(/(^-|-$)/g, "");
}

function renderAdminStats(list){
  const counts = { "New": 0, "Preparing": 0, "Ready for Pickup": 0, "Collected": 0 };
  list.forEach(r => { if(counts[r.status] !== undefined) counts[r.status]++; });
  const root = document.getElementById("admin-stats");
  root.innerHTML = Object.entries(counts).map(([label, num]) => `
    <div class="stat-card">
      <div class="num">${num}</div>
      <div class="lbl">${label}</div>
    </div>
  `).join("");
}

function renderAdminTable(){
  const list = getRequests();
  renderAdminStats(list);

  const root = document.getElementById("admin-rows");
  if(list.length === 0){
    root.innerHTML = `<div class="admin-row"><div>No pickup requests yet.</div></div>`;
    return;
  }

  root.innerHTML = list.map(r => {
    const itemsSummary = r.items.map(i => `${i.name} × ${i.qty}`).join(", ");
    return `
    <div class="admin-row" data-id="${r.id}">
      <div data-label="Pickup ID"><strong>${r.id}</strong></div>
      <div data-label="Customer">${r.name}<br><span class="muted">${r.mobile}</span></div>
      <div data-label="Items"><span class="muted">${itemsSummary}</span></div>
      <div data-label="Pickup Time">${r.time}</div>
      <div data-label="Est. Amount">${formatRupees(r.total)}</div>
      <div data-label="Status">
        <select class="status-select ${statusClass(r.status)}" data-status-for="${r.id}">
          ${STATUS_FLOW.map(s => `<option value="${s}" ${s === r.status ? "selected" : ""}>${s}</option>`).join("")}
        </select>
      </div>
    </div>`;
  }).join("");

  root.querySelectorAll("[data-status-for]").forEach(select => {
    select.addEventListener("change", () => {
      const id = select.getAttribute("data-status-for");
      updateRequestStatus(id, select.value);
      select.className = "status-select " + statusClass(select.value);
      renderAdminStats(getRequests());
      showToast(`${id} marked as "${select.value}"`);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  seedSampleRequestsIfEmpty();
  renderAdminTable();
});
