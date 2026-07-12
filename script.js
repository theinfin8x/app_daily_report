// ── CONFIG (must match amount.html) ──
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyeZqRIvY-IlkhADZQJNwMf-NU87p4HoWqMqpaA9r6SXOTaqmsfdn0jSHTZofUb_a1v/exec';

// ── INDEX PAGE ──
document.addEventListener('DOMContentLoaded', () => {
  // Card selection
  const cards = document.querySelectorAll('.card');
  const btnContinue = document.getElementById('btnContinue');
  let selectedValue = null;

  function selectCard(card) {
    cards.forEach(c => c.setAttribute('aria-checked', 'false'));
    card.setAttribute('aria-checked', 'true');
    selectedValue = card.dataset.value;
    btnContinue.disabled = false;
  }

  cards.forEach(card => {
    card.addEventListener('click', () => selectCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCard(card);
      }
    });
  });

  btnContinue.addEventListener('click', () => {
    if (selectedValue) {
      window.location.href = selectedValue === 'income' ? 'income.html' : 'expense.html';
    }
  });

  // Check for pending (unsynced) transactions
  checkPending();
});

// ── PENDING TRANSACTIONS (offline queue) ──
function checkPending() {
  const pending = getPendingKeys();
  const banner = document.getElementById('pendingBanner');
  const count = document.getElementById('pendingCount');
  const text = document.getElementById('pendingText');

  if (pending.length > 0) {
    count.textContent = pending.length;
    banner.style.display = 'block';
  }
}

async function retryPending() {
  const banner = document.getElementById('pendingBanner');
  const text = document.getElementById('pendingText');
  const pending = getPendingKeys();

  if (pending.length === 0) {
    banner.style.display = 'none';
    return;
  }

  text.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> កំពុងដាក់ស្នើ...';

  let success = 0;
  let failed = 0;

  for (const key of pending) {
    try {
      const payload = JSON.parse(localStorage.getItem(key));
      if (!payload) { localStorage.removeItem(key); continue; }

      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });

      localStorage.removeItem(key);
      success++;
    } catch (_) {
      failed++;
    }
  }

  if (failed === 0) {
    banner.style.display = 'none';
    if (success > 0) {
      alert('ដាក់ស្នើដោយជោគជ័យ ' + success + ' ប្រតិបត្តិការ');
    }
  } else {
    text.innerHTML = '<i class="fa-solid fa-cloud-upload-alt"></i> នៅសល់ ' + failed + ' ប្រតិបត្តិការដែលមិនទាន់ដាក់ស្នើ — ចុចដើម្បីព្យាយាមម្តងទៀត';
  }
}

function getPendingKeys() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('pending_')) keys.push(k);
  }
  return keys.sort();
}
