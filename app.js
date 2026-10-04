/**
 * Apna Ghar Fix Vala (AGFV) - Core Application Logic
 * Dynamic Services, Transparent Admin-Configured Pricing & Instant WhatsApp Booking
 */

let WEBSITE_CONFIG = {
  services: [],
  contact: {
    phone: "+91 9460809860",
    whatsapp: "919460809860",
    hours: "7:00 AM - 11:00 PM (Everyday)"
  }
};

// Known Service Localities for instant verification
const COVERAGE_LOCALITIES = [
  'mumbai', 'pune', 'thane', 'navi mumbai', 'andheri', 'bandra', 'juhu', 'powai',
  'borivali', 'goregaon', 'malad', 'dadar', 'chembur', 'thane west', 'vashi',
  'kharghar', 'hinjewadi', 'wakad', 'baner', 'kothrud', 'viman nagar', 'kalyani nagar',
  'magarpatta', 'aundh', 'pimple saudagar', 'hadapsar', 'santacruz', 'khar', 'worli',
  'kurla', 'ghatkopar', 'mulund', 'kandivali', 'dahisar', 'bavdhan', 'sinhagad road'
];

let calcQuantity = 1;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  loadServicesData();
});

/* --------------------------------------------------------------------------
   Load Services Data from services.json or Live API
   -------------------------------------------------------------------------- */
async function loadServicesData() {
  try {
    // Try local services.json first
    const res = await fetch('services.json?v=' + Date.now());
    if (res.ok) {
      const data = await res.json();
      WEBSITE_CONFIG.services = data.services || [];
      if (data.contact) WEBSITE_CONFIG.contact = data.contact;
    }
  } catch (err) {
    console.warn('Could not load services.json, trying fallback defaults:', err);
  }

  // If empty, supply standard defaults
  if (!WEBSITE_CONFIG.services || WEBSITE_CONFIG.services.length === 0) {
    WEBSITE_CONFIG.services = [
      {
        id: "ac-repair",
        name: "AC Repair & Servicing",
        category: "ac",
        base_price: 399,
        duration: "45 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "images/ac-service.jpg",
        description: "High-pressure indoor deep jet cleaning, foam wash, gas leak detection, PCB diagnosis, capacitor replacement & cooling restoration.",
        tasks: [
          { name: "AC Deep Jet Wash & Cleaning", price: 399 },
          { name: "AC Gas Check & Leakage Refill", price: 1499 },
          { name: "AC Not Cooling / Less Airflow Fix", price: 499 },
          { name: "Complete Split AC Installation", price: 1199 },
          { name: "Window AC Comprehensive Service", price: 449 }
        ]
      },
      {
        id: "plumbing",
        name: "Plumbing Repairs & Fitting",
        category: "plumbing",
        base_price: 149,
        duration: "30 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "images/plumbing-service.jpg",
        description: "Expert plumbers for leaking pipes, designer faucet installation, flush cistern fix, bathroom drain unblocking, sink waste coupling & water pump repairs.",
        tasks: [
          { name: "Tap / Faucet Leakage or Replacement", price: 149 },
          { name: "Flush Cistern & Tank Repair", price: 299 },
          { name: "Basin / Sink Blockage Removal", price: 249 },
          { name: "Water Pipe Concealed Leakage Fix", price: 399 },
          { name: "Shower / Mixer Installation", price: 299 }
        ]
      },
      {
        id: "electrical",
        name: "Electrician & Wiring Fixes",
        category: "electrical",
        base_price: 149,
        duration: "30 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "images/hero-technician.jpg",
        description: "Certified electricians equipped with digital multimeters for MCB tripping, loose wiring, fan regulator/motor repair, chandelier installation & earthing issues.",
        tasks: [
          { name: "Ceiling Fan Repair / Regulating Fix", price: 149 },
          { name: "Switchboard / Socket Replacement", price: 149 },
          { name: "MCB Tripping & Short Circuit Fix", price: 299 },
          { name: "Chandelier / Fancy Light Hanging", price: 349 },
          { name: "Inverter / Home Wiring Diagnosis", price: 399 }
        ]
      },
      {
        id: "carpentry",
        name: "Carpentry & Furniture Fix",
        category: "carpentry",
        base_price: 199,
        duration: "45 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "",
        description: "Precision woodworkers for door lock installation, hydraulic hinge adjustment, squeaky doors, modular drawer channels, and IKEA/online furniture assembly.",
        tasks: [
          { name: "Main Door Lock Fix or Installation", price: 299 },
          { name: "Wardrobe Hydraulic Hinge Alignment", price: 199 },
          { name: "Bed / Table Furniture Assembly", price: 499 },
          { name: "Drawer Channel & Handle Replacement", price: 249 }
        ]
      },
      {
        id: "washing-machine",
        name: "Washing Machine Repair",
        category: "appliances",
        base_price: 299,
        duration: "60 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "",
        description: "Specialized diagnostics for LG, Samsung, Whirlpool, Bosch & IFB. Fixes drum vibration, water not draining, spin cycle failure, belt snaps & motherboard errors.",
        tasks: [
          { name: "Water Drain / Pump Issue (No Drain)", price: 299 },
          { name: "Drum Vibration / Unbalanced Spin Fix", price: 349 },
          { name: "Machine Not Starting / Motherboard PCB", price: 499 },
          { name: "Complete Machine Deep Cleaning / Descale", price: 449 }
        ]
      },
      {
        id: "refrigerator",
        name: "Refrigerator & Deep Freezer",
        category: "appliances",
        base_price: 299,
        duration: "60 Mins",
        warranty: "30-Day Warranty",
        active: true,
        image: "",
        description: "Comprehensive repair for Single Door, Double Door, and Side-by-Side Inverter fridges. Thermostat calibration, defrost heater fix, relay change & eco gas charging.",
        tasks: [
          { name: "Fridge Not Cooling / Less Cooling Fix", price: 299 },
          { name: "Defrost Heater / Thermostat Issue", price: 399 },
          { name: "Eco Refrigerant Gas Charging", price: 1299 },
          { name: "Compressor & Starter Relay Diagnostic", price: 499 }
        ]
      },
      {
        id: "cleaning",
        name: "Deep Home & Bathroom Cleaning",
        category: "cleaning",
        base_price: 499,
        duration: "90 Mins",
        warranty: "100% Satisfaction",
        active: true,
        image: "",
        description: "Industrial-grade single-disc scrubbing machines, non-corrosive hard-water stain removal, oil/grease chimney degreasing & fabric shampoo extraction.",
        tasks: [
          { name: "Intense Bathroom Deep Descaling & Clean", price: 499 },
          { name: "Kitchen Chimney & Counter Degreasing", price: 699 },
          { name: "Sofa & Mattress Wet Extraction Clean", price: 799 }
        ]
      },
      {
        id: "pest-control",
        name: "Herbal Pest Control",
        category: "cleaning",
        base_price: 599,
        duration: "45 Mins",
        warranty: "90-Day Protection",
        active: true,
        image: "",
        description: "100% safe, pet-friendly and child-safe Bayer herbal gel treatment. No need to empty kitchen cabinets or vacate home. Guaranteed pest eradication.",
        tasks: [
          { name: "100% Odorless Herbal Cockroach Gel", price: 599 },
          { name: "Intense Bed Bug Thermal & Spray Defense", price: 899 },
          { name: "Drill-Fill-Seal Termite Protection", price: 1299 }
        ]
      }
    ];
  }

  // Update DOM with live data
  updateContactInfo();
  renderHeroCategories();
  renderCalculatorCategories();
  renderServicesCatalog();
}

/* --------------------------------------------------------------------------
   Contact Information Sync
   -------------------------------------------------------------------------- */
function updateContactInfo() {
  const wa = WEBSITE_CONFIG.contact.whatsapp || "919460809860";
  const hours = WEBSITE_CONFIG.contact.hours || "7:00 AM - 11:00 PM (Everyday)";

  const headerWa = document.getElementById('headerWhatsappBtn');
  if (headerWa) {
    headerWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala!%20I%20want%20to%20book%20a%20home%20repair%20service.`;
  }

  const drawerWa = document.getElementById('drawerWaBtn');
  if (drawerWa) {
    drawerWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala!%20I%20want%20to%20book%20a%20service.`;
  }

  const heroWa = document.getElementById('heroWhatsappBtn');
  if (heroWa) {
    heroWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala!%20I%20want%20to%20book%20a%20doorstep%20repair%20service.`;
  }

  const stickyWa = document.getElementById('mobileStickyWa');
  if (stickyWa) {
    stickyWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala!%20I%20want%20to%20book%20a%20repair%20service.`;
  }

  const emergWa = document.getElementById('emergencyWaBtn');
  if (emergWa) {
    emergWa.href = `https://wa.me/${wa}?text=EMERGENCY%20REPAIR%20REQUIRED!%20Please%20dispatch%20a%20technician%20immediately.`;
  }

  const popupWa = document.getElementById('popupWaBtn');
  if (popupWa) {
    popupWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala!%20I%20need%20help%20with%20a%20home%20repair.`;
  }

  const footerWa = document.getElementById('footerWa');
  if (footerWa) {
    footerWa.href = `https://wa.me/${wa}?text=Hi%20Apna%20Ghar%20Fix%20Vala`;
    footerWa.textContent = `+${wa}`;
  }

  const footerHours = document.getElementById('footerHours');
  if (footerHours) footerHours.textContent = hours;
}

/* --------------------------------------------------------------------------
   Hero Quick Booking Widget
   -------------------------------------------------------------------------- */
function renderHeroCategories() {
  const catSelect = document.getElementById('heroCategory');
  if (!catSelect) return;

  catSelect.innerHTML = '';
  WEBSITE_CONFIG.services.forEach((s) => {
    if (s.active !== false) {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (Starts ₹${s.base_price})`;
      catSelect.appendChild(opt);
    }
  });

  onHeroCategoryChange();
}

function onHeroCategoryChange() {
  const catSelect = document.getElementById('heroCategory');
  const subSelect = document.getElementById('heroSubService');
  if (!catSelect || !subSelect) return;

  const selectedId = catSelect.value;
  const service = WEBSITE_CONFIG.services.find((s) => s.id === selectedId) || WEBSITE_CONFIG.services[0];

  subSelect.innerHTML = '';
  if (service && service.tasks) {
    service.tasks.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.dataset.price = t.price;
      opt.textContent = `${t.name} — ₹${t.price}`;
      subSelect.appendChild(opt);
    });
  }

  const warrantyPill = document.getElementById('heroWarrantyPill');
  if (warrantyPill && service) {
    warrantyPill.textContent = `🛡️ ${service.warranty || '30-Day Warranty'}`;
  }

  calculateHeroPrice();
}

function calculateHeroPrice() {
  const subSelect = document.getElementById('heroSubService');
  const priceDisplay = document.getElementById('standardPriceDisplay');
  if (!subSelect || !priceDisplay) return;

  const opt = subSelect.options[subSelect.selectedIndex];
  const price = opt ? parseInt(opt.dataset.price, 10) || 399 : 399;

  priceDisplay.textContent = `₹${price}`;
}

function handleHeroBooking(e) {
  e.preventDefault();
  const catSelect = document.getElementById('heroCategory');
  const selectedService = WEBSITE_CONFIG.services.find((s) => s.id === catSelect.value);
  const serviceName = selectedService ? selectedService.name : 'Home Repair';
  const subTask = document.getElementById('heroSubService').value;
  const city = document.getElementById('heroCity').value;
  const area = document.getElementById('heroArea').value.trim();
  const price = document.getElementById('standardPriceDisplay').textContent;
  const waNumber = WEBSITE_CONFIG.contact.whatsapp || '919460809860';

  const message = `Hi Apna Ghar Fix Vala! 👋\nI would like to book a doorstep repair:\n\n🛠️ *Service:* ${serviceName}\n🔧 *Task:* ${subTask}\n📍 *Location:* ${area}, ${city}\n💰 *Standard Rate:* ${price}\n\nPlease confirm availability and technician arrival time. Thank you!`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   Render Services Catalog
   -------------------------------------------------------------------------- */
function renderServicesCatalog() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  grid.innerHTML = '';
  const waNumber = WEBSITE_CONFIG.contact.whatsapp || '919460809860';

  WEBSITE_CONFIG.services.forEach((s) => {
    if (s.active === false) return;

    const card = document.createElement('article');
    card.className = 'service-card';
    card.dataset.category = s.category;

    // Media element: image or styled graphic
    let mediaHtml = '';
    if (s.image) {
      mediaHtml = `<img src="${s.image}" alt="${s.name}" loading="lazy" width="400" height="250">`;
    } else {
      let icon = '🛠️';
      let bgClass = 'carpentry-bg';
      if (s.category === 'appliances') { icon = '🧺'; bgClass = 'washing-bg'; }
      else if (s.category === 'cleaning') { icon = '🧹'; bgClass = 'cleaning-bg'; }
      else if (s.category === 'plumbing') { icon = '🚰'; bgClass = 'fridge-bg'; }
      mediaHtml = `<div class="placeholder-art ${bgClass}"><span class="art-icon">${icon}</span><span class="art-label">${s.name}</span></div>`;
    }

    // Build tasks preview list
    let tasksHtml = '';
    if (s.tasks && s.tasks.length > 0) {
      tasksHtml = '<ul class="card-features">';
      s.tasks.slice(0, 3).forEach((t) => {
        tasksHtml += `<li>✓ ${t.name} <strong style="color:var(--whatsapp-dark);margin-left:4px;">(₹${t.price})</strong></li>`;
      });
      tasksHtml += '</ul>';
    }

    card.innerHTML = `
      <div class="card-media">
        ${mediaHtml}
        <span class="card-warranty">🛡️ ${s.warranty || '30-Day Warranty'}</span>
      </div>
      <div class="card-body">
        <div class="card-price-row">
          <span class="service-category-tag">${(s.category || 'REPAIR').toUpperCase()}</span>
          <div class="card-price">Starts <strong>₹${s.base_price}</strong></div>
        </div>
        <h3 class="card-title">${s.name}</h3>
        <p class="card-text">${s.description || 'Professional doorstep service with genuine spare parts.'}</p>
        ${tasksHtml}
        <div class="card-footer">
          <div class="service-time">⏱️ ${s.duration || '30 Mins'} Duration</div>
          <button class="btn btn-whatsapp btn-sm" onclick="bookDirectService('${s.id}')">
            Book on WhatsApp
          </button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function bookDirectService(serviceId) {
  const service = WEBSITE_CONFIG.services.find((s) => s.id === serviceId);
  if (!service) return;

  const city = document.getElementById('citySelect') ? document.getElementById('citySelect').value : 'Mumbai';
  const waNumber = WEBSITE_CONFIG.contact.whatsapp || '919460809860';

  const message = `Hi Apna Ghar Fix Vala! 👋\nI want to book the following service:\n\n🛠️ *Service:* ${service.name}\n📍 *City:* ${city}\n💰 *Standard Rate:* Starts ₹${service.base_price}\n🛡️ *Warranty:* ${service.warranty || '30-Day Warranty'}\n\nPlease share the earliest available technician slot today.`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/* --------------------------------------------------------------------------
   Filter Service Catalog Tabs
   -------------------------------------------------------------------------- */
function filterServices(category) {
  const cards = document.querySelectorAll('.service-card');
  const tabs = document.querySelectorAll('.tab-btn');

  tabs.forEach((tab) => tab.classList.remove('active'));
  if (window.event && window.event.target) {
    window.event.target.classList.add('active');
  }

  cards.forEach((card) => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

/* --------------------------------------------------------------------------
   Rate Estimator Calculator
   -------------------------------------------------------------------------- */
function renderCalculatorCategories() {
  const catSelect = document.getElementById('calcCategory');
  if (!catSelect) return;

  catSelect.innerHTML = '';
  WEBSITE_CONFIG.services.forEach((s) => {
    if (s.active !== false) {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = s.name;
      catSelect.appendChild(opt);
    }
  });

  updateCalcServices();
}

function updateCalcServices() {
  const catSelect = document.getElementById('calcCategory');
  const taskSelect = document.getElementById('calcTask');
  if (!catSelect || !taskSelect) return;

  const selectedId = catSelect.value;
  const service = WEBSITE_CONFIG.services.find((s) => s.id === selectedId) || WEBSITE_CONFIG.services[0];

  taskSelect.innerHTML = '';
  if (service && service.tasks) {
    service.tasks.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.name;
      opt.dataset.price = t.price;
      opt.textContent = `${t.name} (₹${t.price})`;
      taskSelect.appendChild(opt);
    });
  }

  runLiveCalculation();
}

function changeQty(delta) {
  calcQuantity = Math.max(1, Math.min(10, calcQuantity + delta));
  const qtyElem = document.getElementById('qtyDisplay');
  if (qtyElem) qtyElem.textContent = calcQuantity;
  const qtySummary = document.getElementById('calcQtySummary');
  if (qtySummary) qtySummary.textContent = calcQuantity;
  runLiveCalculation();
}

function runLiveCalculation() {
  const taskSelect = document.getElementById('calcTask');
  if (!taskSelect) return;

  const opt = taskSelect.options[taskSelect.selectedIndex];
  const unitPrice = opt ? parseInt(opt.dataset.price, 10) || 399 : 399;
  const total = unitPrice * calcQuantity;

  const unitElem = document.getElementById('calcUnitPrice');
  const finalElem = document.getElementById('calcFinalPrice');
  if (unitElem) unitElem.textContent = `₹${unitPrice}`;
  if (finalElem) finalElem.textContent = `₹${total}`;
}

function bookFromCalc() {
  const catSelect = document.getElementById('calcCategory');
  const service = WEBSITE_CONFIG.services.find((s) => s.id === catSelect.value);
  const serviceName = service ? service.name : 'Home Repair';
  const taskSelect = document.getElementById('calcTask');
  const taskName = taskSelect ? taskSelect.value : 'Standard Fix';
  const qty = calcQuantity;
  const finalPrice = document.getElementById('calcFinalPrice').textContent;
  const waNumber = WEBSITE_CONFIG.contact.whatsapp || '919460809860';

  const message = `Hi Apna Ghar Fix Vala! 👋\nI calculated my repair rate using your website estimator:\n\n🛠️ *Service:* ${serviceName}\n🔧 *Task:* ${taskName} (Qty: ${qty})\n💰 *Standard Total:* ${finalPrice}\n\nPlease book a technician visit for me.`;

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
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
  const waNumber = WEBSITE_CONFIG.contact.whatsapp || '919460809860';

  if (match || isPincode) {
    resultBox.className = 'area-status-result active text-success';
    resultBox.innerHTML = `✅ <strong>Yes! We serve in your area!</strong> Technicians available for arrival in <strong>30-45 minutes</strong>. <a href="https://wa.me/${waNumber}?text=Hi%20AGFV!%20I%20am%20located%20at%20${encodeURIComponent(query)}.%20Please%20send%20a%20technician." target="_blank" style="color:var(--whatsapp-dark);text-decoration:underline;margin-left:8px;">Book Now →</a>`;
  } else {
    resultBox.className = 'area-status-result active text-success';
    resultBox.innerHTML = `✅ We serve entire <strong>Mumbai MMR & Pune PCMC</strong>. Our nearest hub is ready to dispatch to your address!`;
  }
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function toggleFaq(button) {
  const item = button.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isExpanded = button.getAttribute('aria-expanded') === 'true';

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
