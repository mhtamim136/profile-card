// ===== Theme Toggle =====
const themeBtn = document.getElementById('themeBtn');
const html = document.documentElement;

// Saved theme wins; otherwise follow the device (system) preference.
const savedTheme = localStorage.getItem('theme');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const initialTheme = savedTheme || systemTheme;
html.setAttribute('data-theme', initialTheme);
updateThemeIcon(initialTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  // Show the icon for the theme you would switch TO.
  themeBtn.innerHTML = theme === 'dark'
    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
}

// ===== Toast (replaces alert()) =====
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  // Restart the transition so it animates even on repeat clicks.
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    toast.hidden = true;
  }, 2500);
}

// ===== Share Button =====
const shareBtn = document.getElementById('shareBtn');
const PROFILE_URL = 'https://mhtamim136.github.io/profile-card/';

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Murad Hasan Tamim — Profile Card',
    text: 'Check out my profile!',
    url: PROFILE_URL
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // User cancelled the share sheet — nothing to do.
    }
  } else {
    copyText(PROFILE_URL, 'Profile link copied to clipboard!');
  }
});

async function copyText(text, successMessage) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMessage);
  } catch (err) {
    // Clipboard API unavailable (e.g. non-secure context): fall back to a
    // temporary textarea + execCommand, then to showing the value.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch (e) {
      showToast(text);
    }
    document.body.removeChild(ta);
  }
}

// ===== Magnetic buttons + cursor spotlight =====
// Same concepts as the main portfolio (Magnetic Buttons + Cursor Spotlight),
// rebuilt in vanilla JS — no libraries. Both stay off on touch devices
// (coarse pointers) and under prefers-reduced-motion.
const finePointer = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (finePointer && !reduceMotion) {
  // Magnetic: a card drifts a few px toward the cursor and springs back.
  // translate() reads --mx / --my, so the lerp below is the only smoothing.
  const magnetize = (el, maxShift) => {
    let raf = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const render = () => {
      curX += (targetX - curX) * 0.18;
      curY += (targetY - curY) * 0.18;
      el.style.setProperty('--mx', curX.toFixed(2) + 'px');
      el.style.setProperty('--my', curY.toFixed(2) + 'px');
      if (Math.abs(targetX - curX) > 0.05 || Math.abs(targetY - curY) > 0.05) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
        if (targetX === 0 && targetY === 0) {
          el.style.removeProperty('--mx');
          el.style.removeProperty('--my');
        }
      }
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(render); };

    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const relX = e.clientX - (r.left + r.width / 2);
      const relY = e.clientY - (r.top + r.height / 2);
      targetX = Math.max(-maxShift, Math.min(maxShift, relX * 0.25));
      targetY = Math.max(-maxShift, Math.min(maxShift, relY * 0.35));
      kick();
    });
    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      kick();
    });
  };

  // 8px max shift: the 12px gap between cards can never close, so cards
  // can never overlap while magnetised.
  document.querySelectorAll('.link-btn').forEach((b) => magnetize(b, 8));

  // Cursor spotlight: a soft glow follows the mouse across the card.
  const card = document.querySelector('.card');
  const spot = document.getElementById('spotlight');
  let spotRaf = null;

  card.addEventListener('mousemove', (e) => {
    if (spotRaf) return;
    spotRaf = requestAnimationFrame(() => {
      const r = card.getBoundingClientRect();
      spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
      spot.style.opacity = '1';
      spotRaf = null;
    });
  });
  card.addEventListener('mouseleave', () => {
    spot.style.opacity = '0';
  });
}

// ===== Footer year (rolls over every Jan 1, no deploy needed) =====
document.getElementById('year').textContent = new Date().getFullYear();
