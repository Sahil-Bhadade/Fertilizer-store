/* =========================================================================
   PICKUP REQUESTS STORE
   -------------------------------------------------------------------------
   Demo/local data layer, backed by localStorage, shared by the pickup flow
   (js/pickup.js) and the admin dashboard (js/admin.js). In production this
   would be replaced by real API calls to a backend + database — every
   function below is written so that swap only touches this one file.
   ========================================================================= */

const REQUESTS_KEY = "gbb_requests_v1";
const USED_IDS_KEY = "gbb_used_pickup_ids";

const STATUS_FLOW = ["New", "Preparing", "Ready for Pickup", "Collected"];

function getRequests(){
  try{
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

function saveRequests(list){
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
}

/* -------------------------------------------------------------------------
   RANDOM PICKUP ID
   - 3 to 5 characters long (picked at random each time)
   - built only from A-Z, 0-9, @, # (38 possible characters)
   - never repeats: every ID handed out is recorded in localStorage, and a
     freshly generated ID is checked against that record before it is used.
     With this character set there are 38^3 + 38^4 + 38^5 ≈ 81.3 million
     possible IDs, so a real shop will never come close to exhausting them,
     but the uniqueness check is enforced regardless of volume.
   ------------------------------------------------------------------------- */
const PICKUP_ID_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#";
const PICKUP_ID_MIN_LEN = 3;
const PICKUP_ID_MAX_LEN = 5;

function getUsedPickupIds(){
  try{
    const raw = localStorage.getItem(USED_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  }catch(e){ return new Set(); }
}

function saveUsedPickupIds(set){
  localStorage.setItem(USED_IDS_KEY, JSON.stringify([...set]));
}

function randomPickupIdCandidate(){
  const len = PICKUP_ID_MIN_LEN + Math.floor(Math.random() * (PICKUP_ID_MAX_LEN - PICKUP_ID_MIN_LEN + 1));
  let id = "";
  for(let i = 0; i < len; i++){
    id += PICKUP_ID_CHARSET[Math.floor(Math.random() * PICKUP_ID_CHARSET.length)];
  }
  return id;
}

/** Generates a random Pickup ID (e.g. "K7#", "9F@ZQ", "B2X8") that has never
 *  been issued before. Call this once per successful pickup request. */
function nextPickupId(){
  const used = getUsedPickupIds();
  let id;
  let attempts = 0;
  do{
    id = randomPickupIdCandidate();
    attempts++;
  } while(used.has(id) && attempts < 2000);

  used.add(id);
  saveUsedPickupIds(used);
  return id;
}

function addRequest(request){
  const list = getRequests();
  list.unshift(request); // newest first
  saveRequests(list);
}

function updateRequestStatus(id, status){
  const list = getRequests();
  const req = list.find(r => r.id === id);
  if(req){ req.status = status; saveRequests(list); }
}

/** Seeds a few sample requests so the admin dashboard isn't empty on first
 *  visit. Runs only once — if anything is already stored, it is left
 *  untouched. The sample IDs are registered as "used" so a real pickup
 *  request can never randomly collide with one of them. */
function seedSampleRequestsIfEmpty(){
  if(localStorage.getItem(REQUESTS_KEY)) return;
  const sample = [
    {
      id: "7QX", name: "Sanjay Patil", mobile: "9876543210",
      time: "Today, 11:00 AM", note: "",
      items: [
        { name: "Urea (46% Nitrogen)", packSize: "45 kg bag", qty: 3 },
        { name: "Zinc Sulphate 21%", packSize: "1 kg pack", qty: 2 }
      ],
      total: 978, paymentPref: "upi", status: "Preparing",
      createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    },
    {
      id: "K9#F2", name: "Meera Deshmukh", mobile: "9822011223",
      time: "Today, 4:30 PM", note: "Please keep in a strong bag, coming by bike.",
      items: [
        { name: "DAP (18-46-0)", packSize: "50 kg bag", qty: 1 },
        { name: "Hybrid Maize Seeds — Baazigar 4062", packSize: "4 kg bag", qty: 1 }
      ],
      total: 3150, paymentPref: "upi", status: "Ready for Pickup",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    {
      id: "M4Z@", name: "Ramesh Kadam", mobile: "9765432180",
      time: "Yesterday, 5:00 PM", note: "",
      items: [
        { name: "NPK 10:26:26 (Zinc Fortified)", packSize: "50 kg bag", qty: 2 },
        { name: "Toscee Insecticide", packSize: "250 ml bottle", qty: 1 }
      ],
      total: 3390, paymentPref: "upi", status: "Collected",
      createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString()
    }
  ];
  saveRequests(sample);

  if(!localStorage.getItem(USED_IDS_KEY)){
    saveUsedPickupIds(new Set(sample.map(r => r.id)));
  }
}
