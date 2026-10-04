/**
 * Apna Ghar Fix Vala (AGFV) - Core Application Logic
 * High-Performance, Interactive Booking, Dynamic Pricing & WhatsApp Generator
 */

const WHATSAPP_PHONE = '919460809860';

// Service Sub-items and base rates
const SERVICE_DATA = {
  'AC Repair': [
    { name: 'AC Deep Jet Wash & Cleaning', price: 399 },
    { name: 'AC Gas Check & Leakage Refill', price: 1499 },
    { name: 'AC Not Cooling / Less Airflow Fix', price: 499 },
    { name: 'Complete Split AC Installation', price: 1199 },
    { name: 'Window AC Comprehensive Service', price: 449 }
  ],
  'Plumbing': [
    { name: 'Tap / Faucet Leakage or Replacement', price: 149 },
    { name: 'Flush Cistern & Tank Repair', price: 299 },
    { name: 'Basin / Sink Blockage Removal', price: 249 },
    { name: 'Water Pipe Concealed Leakage Fix', price: 399 },
    { name: 'Shower / Mixer Installation', price: 299 }
  ],
  'Electrical': [
    { name: 'Ceiling Fan Repair / Regulating Fix', price: 149 },
    { name: 'Switchboard / Socket Replacement', price: 149 },
    { name: 'MCB Tripping & Short Circuit Fix', price: 299 },
    { name: 'Chandelier / Fancy Light Hanging', price: 349 },
    { name: 'Inverter / Home Wiring Diagnosis', price: 399 }
  ],
  'Carpentry': [
    { name: 'Main Door Lock Fix or Installation', price: 299 },
    { name: 'Wardrobe Hydraulic Hinge Alignment', price: 199 },
    { name: 'Bed / Table Furniture Assembly', price: 499 },
    { name: 'Drawer Channel & Handle Replacement', price: 249 }
  ],
  'Washing Machine': [
    { name: 'Water Drain / Pump Issue (No Drain)', price: 299 },
    { name: 'Drum Vibration / Unbalanced Spin Fix', price: 349 },
    { name: 'Machine Not Starting / Motherboard PCB', price: 499 },
    { name: 'Complete Machine Deep Cleaning / Descale', price: 449 }
  ],
  'Refrigerator': [
    { name: 'Fridge Not Cooling / Less Cooling Fix', price: 299 },
    { name: 'Defrost Heater / Thermostat Issue', price: 399 },
    { name: 'Eco Refrigerant Gas Charging', price: 1299 },
    { name: 'Compressor & Starter Relay Diagnostic', price: 499 }
  ],
  'Cleaning': [
    { name: 'Intense Bathroom Deep Descaling & Clean', price: 499 },
    { name: 'Kitchen Chimney & Counter Degreasing', price: 699 },
    { name: 'Sofa & Mattress Wet Extraction Clean', price: 799 }
  ],
  'Pest Control': [
    { name: '100% Odorless Herbal Cockroach Gel', price: 599 },
    { name: 'Intense Bed Bug Thermal & Spray Defense', price: 899 },
    { name: 'Drill-Fill-Seal Termite Protection', price: 1299 }
  ]
};

// Known Service Localities for instant verification
const COVERAGE_LOCALITIES = [
  'mumbai', 'pune', 'thane', 'navi mumbai', 'andheri', 'bandra', 'juhu', 'powai',
  'borivali', 'goregaon', 'malad', 'dadar', 'chembur', 'thane west', 'vashi',
  'kharghar', 'hinjewadi', 'wakad', 'baner', 'kothrud', 'viman nagar', 'kalyani nagar',
  'magarpatta', 'aundh', 'pimple saudagar', 'hadapsar', 'santacruz', 'khar', 'worli',
  'kurla', 'ghatkopar', 'mulund', 'kandivali', 'dahisar', 'bavdhan', 'sinhagad road'
];

// Active State
let currentDiscountPercent = 20; // Default AGFV20
let fixedDiscountAmount = 0;
let appliedPromo = 'AGFV20';
let calcQuantity = 1;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initHeroSubcategories();
  initCalculatorCategories();
  initPromoTimer();
  initMobileDrawer();
  calculateHeroPrice();
  runLiveCalculation();
});

/* --------------------------------------------------------------------------
   Hero Quick Booking Widget Functions
   -------------------------------------------------------------------------- */
function onHeroCategoryChange() {
  initHeroSubcategories();
  calculateHeroPrice();
}

function initHeroSubcategories() {
  const catSelect = document.getElementById('heroCategory');
  const subSelect = document.getElementById('heroSubService');
  if (!catSelect || !subSelect) return;

  const selectedCat = catSelect.value;
  const items = SERVICE_DATA[selectedCat] || [];

  subSelect.innerHTML = '';
  items.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.name;
    opt.dataset.price = item.price;
    opt.textContent = `${item.name} (₹${item.price})`;
    subSelect.appendChild(opt);
  });
}

function calculateHeroPrice() {
  const subSelect = document.getElementById('heroSubService');
  const originalDisplay = document.getElementById('originalPriceDisplay');
  const discountedDisplay = document.getElementById('discountedPriceDisplay');
  const savingsTag = document.getElementById('savingsTag');

  if (!subSelect || !originalDisplay || !discountedDisplay) return;

  const selectedOpt = subSelect.options[subSelect.selectedIndex];
  const basePrice = selectedOpt ? parseInt(selectedOpt.dataset.price, 10) || 399 : 399;

  let savings = 0;
  if (fixedDiscountAmount > 0) {
    savings = fixedDiscountAmount;
  } else if (currentDiscountPercent > 0) {
    savings = Math.round((basePrice * currentDiscountPercent) / 100);
  }

  const finalPrice = Math.max(99, basePrice - savings);

  originalDisplay.textContent = `₹${basePrice}`;
  discountedDisplay.textContent = `₹${finalPrice}`;
  if (savingsTag) {
    savingsTag.textContent = savings > 0 ? `You save ₹${savings}!` : 'Standard Rate';
  }
}

function validateHeroPromo() {
  const input = document.getElementById('heroPromoInput');
  const msg = document.getElementById('promoMessage');
  if (!input || !msg) return;

  const code = input.value.trim().toUpperCase();
  applyPromoCodeInternal(code, msg);
  calculateHeroPrice();
}

function applyPromoCodeInternal(code, msgElement) {
  if (code === 'AGFV20') {
    currentDiscountPercent = 20;
    fixedDiscountAmount = 0;
    appliedPromo = 'AGFV20';
    msgElement.className = 'promo-feedback success';
    msgElement.textContent = '✓ Promo code AGFV20 applied! Flat 20% discount activated.';
  } else if (code === 'ACCOOL150') {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 150;
    appliedPromo = 'ACCOOL150';
    msgElement.className = 'promo-feedback success';
    msgElement.textContent = '✓ Promo code ACCOOL150 applied! ₹150 instant discount.';
  } else if (code === 'HOMECARE') {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 250;
    appliedPromo = 'HOMECARE';
    msgElement.className = 'promo-feedback success';
    msgElement.textContent = '✓ Combo coupon HOMECARE applied! ₹250 discount.';
  } else if (code === 'FIRST100') {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 100;
    appliedPromo = 'FIRST100';
    msgElement.className = 'promo-feedback success';
    msgElement.textContent = '✓ Welcome coupon FIRST100 applied! ₹100 discount.';
  } else {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 0;
    appliedPromo = '';
    msgElement.className = 'promo-feedback text-danger';
    msgElement.textContent = '✗ Invalid promo code. Try AGFV20 for 20% OFF.';
  }
}

function handleHeroBooking(e) {
  e.preventDefault();
  const category = document.getElementById('heroCategory').value;
  const subService = document.getElementById('heroSubService').value;
  const city = document.getElementById('heroCity').value;
  const area = document.getElementById('heroArea').value.trim();
  const promo = appliedPromo || 'AGFV20';
  const finalPrice = document.getElementById('discountedPriceDisplay').textContent;

  const message = `Hi Apna Ghar Fix Vala! 👋\nI want to book a doorstep repair service:\n\n🛠️ *Service:* ${category} - ${subService}\n📍 *Location:* ${area}, ${city}\n🎟️ *Promo Code:* ${promo}\n💰 *Estimated Total:* ${finalPrice}\n\nPlease confirm availability and technician arrival time. Thank you!`;

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   Direct One-Click Service Booking
   -------------------------------------------------------------------------- */
function bookSpecificService(category, taskName, estimatedPrice) {
  const promo = appliedPromo || 'AGFV20';
  const discounted = Math.round(estimatedPrice * 0.8);
  const city = document.getElementById('citySelect') ? document.getElementById('citySelect').value.toUpperCase() : 'MUMBAI';

  const message = `Hi Apna Ghar Fix Vala! 👋\nI want to book this service:\n\n🛠️ *Service:* ${category} (${taskName})\n📍 *City:* ${city}\n🎟️ *Promo Code:* ${promo} (20% OFF)\n💰 *Estimated Rate:* ₹${discounted} (after discount)\n\nPlease share the earliest available technician slot today.`;

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   Interactive Calculator Section Logic
   -------------------------------------------------------------------------- */
const CALC_TASKS = {
  'ac': [
    { label: 'AC 2x Deep Jet Pump Wash', price: 399 },
    { label: 'Split AC Gas Charging & Leak Fix', price: 1499 },
    { label: 'PCB Board Diagnostic & Fix', price: 699 },
    { label: 'Split AC Complete Installation', price: 1199 }
  ],
  'plumb': [
    { label: 'Tap / Faucet Replacement', price: 149 },
    { label: 'Flush Tank / Cistern Servicing', price: 299 },
    { label: 'Drain & Basin Blockage Removal', price: 249 },
    { label: 'Concealed Water Leakage Repair', price: 399 }
  ],
  'elec': [
    { label: 'Ceiling Fan Repair / Regulating', price: 149 },
    { label: 'Switchboard / Socket Fix', price: 149 },
    { label: 'MCB Tripping Short Circuit Inspection', price: 299 },
    { label: 'Decorative Chandelier Hanging', price: 349 }
  ],
  'appliance': [
    { label: 'Washing Machine Drum & Drain Repair', price: 349 },
    { label: 'Refrigerator Cooling & Defrost Fix', price: 399 },
    { label: 'Fridge Gas Refill & Vacuuming', price: 1299 }
  ],
  'carpentry': [
    { label: 'Door Lock Repair or Fitting', price: 299 },
    { label: 'Wardrobe Hinge & Channel Alignment', price: 199 },
    { label: 'IKEA / Online Furniture Assembly', price: 499 }
  ],
  'cleaning': [
    { label: 'Intensive Bathroom Cleaning', price: 499 },
    { label: 'Kitchen Chimney & Slab Degreasing', price: 699 },
    { label: 'Odorless Herbal Cockroach Gel', price: 599 }
  ]
};

function initCalculatorCategories() {
  updateCalcServices();
}

function updateCalcServices() {
  const cat = document.getElementById('calcCategory').value;
  const taskSelect = document.getElementById('calcTask');
  if (!taskSelect) return;

  const tasks = CALC_TASKS[cat] || [];
  taskSelect.innerHTML = '';
  tasks.forEach((t) => {
    const opt = document.createElement('option');
    opt.value = t.label;
    opt.dataset.price = t.price;
    opt.textContent = `${t.label} (₹${t.price})`;
    taskSelect.appendChild(opt);
  });
  runLiveCalculation();
}

function changeQty(delta) {
  calcQuantity = Math.max(1, Math.min(10, calcQuantity + delta));
  const qtyElem = document.getElementById('qtyDisplay');
  if (qtyElem) qtyElem.textContent = calcQuantity;
  runLiveCalculation();
}

function applyCalcPromo() {
  const code = document.getElementById('calcPromoCode').value.trim().toUpperCase();
  const note = document.getElementById('calcPromoNote');
  if (code === 'AGFV20') {
    currentDiscountPercent = 20;
    fixedDiscountAmount = 0;
    note.className = 'text-success';
    note.textContent = '✓ Promo AGFV20 active (20% OFF)!';
  } else if (code === 'ACCOOL150') {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 150;
    note.className = 'text-success';
    note.textContent = '✓ Promo ACCOOL150 active (₹150 OFF)!';
  } else {
    currentDiscountPercent = 0;
    fixedDiscountAmount = 0;
    note.className = 'text-danger';
    note.textContent = '✗ Invalid promo code.';
  }
  runLiveCalculation();
}

function runLiveCalculation() {
  const taskSelect = document.getElementById('calcTask');
  if (!taskSelect) return;

  const opt = taskSelect.options[taskSelect.selectedIndex];
  const unitPrice = opt ? parseInt(opt.dataset.price, 10) || 399 : 399;
  const subtotal = unitPrice * calcQuantity;

  let discount = 0;
  if (fixedDiscountAmount > 0) {
    discount = fixedDiscountAmount;
  } else if (currentDiscountPercent > 0) {
    discount = Math.round((subtotal * currentDiscountPercent) / 100);
  }

  const finalTotal = Math.max(99, subtotal - discount);

  document.getElementById('calcBasePrice').textContent = `₹${subtotal}`;
  document.getElementById('calcDiscount').textContent = discount > 0 ? `- ₹${discount}` : '₹0';
  document.getElementById('calcFinalPrice').textContent = `₹${finalTotal}`;
}

function bookFromCalc() {
  const taskSelect = document.getElementById('calcTask');
  const taskName = taskSelect ? taskSelect.value : 'Home Repair';
  const qty = calcQuantity;
  const finalPrice = document.getElementById('calcFinalPrice').textContent;
  const promo = appliedPromo || 'AGFV20';

  const message = `Hi Apna Ghar Fix Vala! 👋\nI estimated my repair using your website calculator:\n\n🛠️ *Task:* ${taskName} (Qty: ${qty})\n🎟️ *Promo Applied:* ${promo}\n💰 *Estimated Total:* ${finalPrice}\n\nPlease book a technician visit for me.`;

  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   Filter Service Catalog
   -------------------------------------------------------------------------- */
function filterServices(category) {
  const cards = document.querySelectorAll('.service-card');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach((tab) => tab.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach((card) => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   Service Area / Pincode Availability Checker
   -------------------------------------------------------------------------- */
function checkServiceArea() {
  const input = document.getElementById('pincodeSearch');
  const resultBox = document.getElementById('areaStatusBox');
  if (!input || !resultBox) return;

  const query = input.value.trim().toLowerCase();
  if (!query) {
    resultBox.className = 'area-status-result active text-danger';
    resultBox.textContent = 'Please enter your locality or pincode.';
    return;
  }

  const match = COVERAGE_LOCALITIES.some((loc) => query.includes(loc) || loc.includes(query));
  const isPincode = /^\d{6}$/.test(query);

  if (match || isPincode) {
    resultBox.className = 'area-status-result active text-success';
    resultBox.innerHTML = `✅ <strong>Yes! We serve in your area!</strong> Technicians available for arrival in <strong>30-45 minutes</strong>. <a href="https://wa.me/${WHATSAPP_PHONE}?text=Hi%20AGFV!%20I%20am%20located%20at%20${encodeURIComponent(query)}.%20Please%20send%20a%20technician." target="_blank" style="color:var(--whatsapp-dark);text-decoration:underline;margin-left:8px;">Book Now →</a>`;
  } else {
    resultBox.className = 'area-status-result active text-success';
    resultBox.innerHTML = `✅ We serve entire <strong>Mumbai MMR & Pune PCMC</strong>. Our nearest hub is ready to dispatch to your address!`;
  }
}

/* --------------------------------------------------------------------------
   Promo Code Copy & Toast Feedback
   -------------------------------------------------------------------------- */
function copyPromoCode(code) {
  navigator.clipboard.writeText(code).then(() => {
    showToast(`✓ Promo code "${code}" copied! Paste on WhatsApp for discount.`);
  }).catch(() => {
    showToast(`Code: ${code} - Mention this on WhatsApp!`);
  });
}

function applyPromoDirect(code) {
  const heroPromo = document.getElementById('heroPromoInput');
  if (heroPromo) {
    heroPromo.value = code;
    validateHeroPromo();
  }
  showToast(`✓ Promo ${code} auto-applied in the booking widget!`);
  const widget = document.getElementById('quickBookingWidget');
  if (widget) {
    widget.scrollIntoView({ behavior: 'smooth' });
  }
}

function showToast(text) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function toggleFaq(button) {
  const item = button.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';

  // Close all other items
  document.querySelectorAll('.faq-item').forEach((otherItem) => {
    if (otherItem !== item) {
      otherItem.classList.remove('active');
      const otherBtn = otherItem.querySelector('.faq-question');
      const otherAns = otherItem.querySelector('.faq-answer');
      if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      if (otherAns) otherAns.style.maxHeight = null;
    }
  });

  if (isExpanded) {
    item.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');
    answer.style.maxHeight = null;
  } else {
    item.classList.add('active');
    button.setAttribute('aria-expanded', 'true');
    answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
  }
}

/* --------------------------------------------------------------------------
   Limited-Time Promo Countdown Timer
   -------------------------------------------------------------------------- */
function initPromoTimer() {
  const hoursElem = document.getElementById('timeHours');
  const minsElem = document.getElementById('timeMins');
  const secsElem = document.getElementById('timeSecs');
  if (!hoursElem || !minsElem || !secsElem) return;

  // Set 6 hours countdown or load from localStorage
  let remainingSeconds = localStorage.getItem('agfv_promo_timer');
  if (!remainingSeconds || remainingSeconds <= 0) {
    remainingSeconds = 6 * 3600;
  } else {
    remainingSeconds = parseInt(remainingSeconds, 10);
  }

  function updateTimer() {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      remainingSeconds = 6 * 3600; // Reset loop
    }
    localStorage.setItem('agfv_promo_timer', remainingSeconds);

    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;

    hoursElem.textContent = String(h).padStart(2, '0');
    minsElem.textContent = String(m).padStart(2, '0');
    secsElem.textContent = String(s).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* --------------------------------------------------------------------------
   Floating Expandable WhatsApp Chat Widget Toggle
   -------------------------------------------------------------------------- */
function toggleFloatingChat() {
  const popup = document.getElementById('chatPopup');
  if (popup) {
    popup.classList.toggle('active');
  }
}

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const openBtn = document.getElementById('mobileMenuBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const links = document.querySelectorAll('.drawer-link');

  if (!openBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
  links.forEach((l) => l.addEventListener('click', closeDrawer));
}
