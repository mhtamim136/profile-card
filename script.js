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
  // Magnetic: a card drifts lightly toward the cursor and springs back.
  // The offset is NORMALISED to the cursor's position inside the button
  // (-1 at one edge, +1 at the other), so the follow is proportional and
  // smooth across the whole button. The old version multiplied the raw
  // pixel offset, which saturated almost everywhere — dead plateaus at the
  // edges and one sudden jump near the centre. translate() reads --mx / --my,
  // so the lerp below is the only smoothing.
  const magnetize = (el, maxX, maxY) => {
    let raf = null;
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    const render = () => {
      curX += (targetX - curX) * 0.12;
      curY += (targetY - curY) * 0.12;
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
      const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
      targetX = nx * maxX;
      targetY = ny * maxY;
      kick();
    });
    el.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
      kick();
    });
  };

  // Light touch only: 5px sideways, 4px up/down. Only the hovered card
  // moves, and the gaps are 12px, so a card can never reach its neighbour.
  document.querySelectorAll('.link-btn').forEach((b) => magnetize(b, 5, 4));

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

// ===== Photo lightbox =====
// Same behaviour as the portfolio's PhotoLightbox (Instagram-style):
// round photo over a dark blurred backdrop; × button, backdrop click or
// Escape closes. Desktop (fine pointer): click the photo zooms
// 1 → 1.5 → 2 → 1, wheel on the photo zooms continuously [1, 2]; wheel on
// the backdrop closes. Touch: tap the photo closes, zoom is off.
// Max zoom 2 is a quality cap (source is 880px, displays at ~560px).
// Reduced motion: instant open/close/zoom. Focus returns to the avatar.
const avatarBtn = document.getElementById('avatarBtn');
const lightbox = document.getElementById('lightbox');
const lightboxPhoto = document.getElementById('lightboxPhoto');
const lightboxClose = document.getElementById('lightboxClose');
let lightboxZoom = 1;
let lightboxCloseTimer = null;

function setLightboxZoom(z) {
  lightboxZoom = Math.min(2, Math.max(1, z));
  lightboxPhoto.style.setProperty('--zoom', lightboxZoom);
}

function openLightbox() {
  clearTimeout(lightboxCloseTimer);
  lightbox.classList.remove('closing');
  setLightboxZoom(1);
  lightbox.hidden = false;
  // Restart the open animation even on repeat opens.
  lightboxPhoto.style.animation = 'none';
  void lightboxPhoto.offsetWidth;
  lightboxPhoto.style.animation = '';
  const prevOverflow = document.body.style.overflow;
  lightbox.dataset.prevOverflow = prevOverflow;
  document.body.style.overflow = 'hidden';
  lightbox.focus();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  const done = () => {
    lightbox.hidden = true;
    lightbox.classList.remove('closing');
    document.body.style.overflow = lightbox.dataset.prevOverflow || '';
    avatarBtn.focus();
  };
  if (reduceMotion) {
    done();
  } else {
    lightbox.classList.add('closing');
    lightboxCloseTimer = setTimeout(done, 200);
  }
}

avatarBtn.addEventListener('click', openLightbox);
lightboxClose.addEventListener('click', (e) => {
  e.stopPropagation();
  closeLightbox();
});
// Backdrop click closes (clicks on the photo or the × button stop
// propagation, so they never reach here).
lightbox.addEventListener('click', closeLightbox);
// Wheel on the backdrop closes; wheel on the photo zooms instead.
lightbox.addEventListener('wheel', closeLightbox, { passive: true });
lightboxPhoto.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!finePointer) {
    closeLightbox();
    return;
  }
  setLightboxZoom(lightboxZoom >= 2 ? 1 : lightboxZoom + 0.5);
});
lightboxPhoto.addEventListener('wheel', (e) => {
  if (!finePointer) return;
  e.stopPropagation();
  setLightboxZoom(lightboxZoom - e.deltaY * 0.002);
}, { passive: true });
// Escape closes; Tab cycles between the dialog and the close button,
// so focus never escapes to the page behind.
lightbox.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'Tab') {
    e.preventDefault();
    if (document.activeElement === lightboxClose) lightbox.focus();
    else lightboxClose.focus();
  }
});

// ===== Footer year (rolls over every Jan 1, no deploy needed) =====
document.getElementById('year').textContent = new Date().getFullYear();
