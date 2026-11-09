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

// ===== Footer year (rolls over every Jan 1, no deploy needed) =====
document.getElementById('year').textContent = new Date().getFullYear();
