<div align="center">

# 🪪 Profile Card

### A clean, responsive digital profile card — portfolio, resume, projects & socials in one place

[![Live Preview](https://img.shields.io/badge/🔗_Live_Preview-mhtamim136.github.io/profile--card-4f46e5?style=for-the-badge)](https://mhtamim136.github.io/profile-card/)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Hosted_on-GitHub_Pages-181717?style=for-the-badge&logo=github)](https://pages.github.com)

</div>

---

## 🔗 Live Preview

> 👉 **[https://mhtamim136.github.io/profile-card/](https://mhtamim136.github.io/profile-card/)**

---

## 📌 About

**Profile Card** is a minimal, fully responsive single-page profile card for **Murad Hasan Tamim** — a quick digital identity hub linking to his portfolio, projects, resume and social profiles in one clean interface.

It showcases:
- Who he is and what he does
- Core skills
- Links to his portfolio, projects, resume and social profiles

---

## ✨ Features

- 🌗 **Dark / Light Theme Toggle** — saved in `localStorage`, falls back to the system preference when nothing is saved
- 📤 **Share Button** — native Web Share API, with copy-link fallback (toast, no `alert()`)
- 🏷️ **Skill Tags** — C++, Java, C#, JavaScript, React, Node.js (the portfolio's highlighted skills) in one balanced flex row with a green-tinted border — never a 5+1 orphan wrap
- 🔗 **Quick Links** — portfolio, resume, GitHub profile, freelance contact, repositories
- 📄 **Resume** — direct link to the CV PDF
- 🟢 **Emerald Hover** — the green fill wipes slowly and smoothly left-to-right across every link button on hover (0.75s ease-in-out, exactly like the reference video); the text turns white 0.3s in, only once the fill reaches it — never white-on-pale-grey; light theme uses a brighter emerald so it never feels deep
- 🧲 **Magnetic Cards** — each link card drifts lightly (max 5px) toward the cursor with a smooth proportional follow and springs back on leave (same concept as the portfolio's Magnetic Buttons); off on touch devices and under reduced-motion, and only the hovered card moves so cards can never overlap
- 🔦 **Cursor Spotlight** — a soft glow follows the mouse across the card (same concept as the portfolio's Cursor Spotlight), sitting behind the content
- 🎞️ **Subtle Motion** — staggered card entrance, ambient background glows, gradient ring on the avatar, pulsing availability dot; all disabled under `prefers-reduced-motion`
- 📱 **Fully Responsive** — looks great on mobile, tablet, and desktop
- ♿ **Accessible** — semantic HTML (`main`, `nav`), `aria-label`s on icon-only buttons, visible keyboard focus, alt text on the photo
- 🔍 **Search-ready** — meta description, canonical URL, Open Graph & X cards, and `Person` JSON-LD so Google and AI search can tell whose card this is; `llms.txt` and `sitemap.xml` included
- ⚡ **No Build Step** — pure HTML, CSS, and vanilla JavaScript (Font Awesome loaded from CDN for icons)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Structure, semantic markup, SEO meta & JSON-LD |
| **CSS3** | Styling, CSS variables for theming, responsive layout, animations |
| **Vanilla JavaScript** | Theme toggle, share/copy, dynamic year |
| **Font Awesome 6** (CDN) | Icons (share, sun/moon, social) |
| **GitHub Pages** | Hosting & deployment |

---

## 📁 Project Structure

```
profile-card/
├── index.html        # Card structure, all links, SEO meta + Person JSON-LD
├── style.css         # All styles: themes, animations, responsive, reduced-motion
├── script.js         # Theme toggle + share button logic
├── your-photo.jpg    # Profile photo
├── llms.txt          # Plain-text identity summary for AI search / crawlers
├── sitemap.xml       # Single-URL sitemap for the card page
├── Resume/           # Resume / CV file (Resume-MHTamim.pdf)
└── LICENSE           # MIT License
```

---

## 🔍 SEO Notes

- **Canonical URL:** `https://mhtamim136.github.io/profile-card/`
- **Person schema:** `Person` JSON-LD in `index.html` — name, affiliation (AIUB), `sameAs` profiles (GitHub, X, Facebook, Instagram), `knowsAbout` skills. This is what lets Google / AI search connect this page to Murad Hasan Tamim.
- **Social previews:** Open Graph + X cards use the profile photo (`your-photo.jpg`).
- **X handle:** `@mhtamim136` — the old handle `@tamim_136` is no longer his and returns 404.
- **Main site:** the portfolio button and the Website icon point to the live portfolio at `https://mhtamim136.vercel.app/` (the `github.io` site is the backup).
- **Limits:** this repo is a subpath of `mhtamim136.github.io`, so a domain-level `robots.txt` cannot live here — that belongs to the main portfolio site. The `sitemap.xml` here covers only this card page.

---

## 🚀 Run Locally

No build tools needed — just open the file!

```bash
# Clone the repo
git clone https://github.com/mhtamim136/profile-card.git

# Open in browser
cd profile-card
# Simply open index.html in any browser
```

Or use a live server extension (VS Code → Live Server) for the best experience.

---

## 📬 Author

<div align="center">

### Murad Hasan Tamim

*CSE Student at AIUB (Information Systems), Dhaka — building practical web apps*
*Open to Internships & Freelance*

[![Portfolio](https://img.shields.io/badge/🌐_Portfolio-mhtamim136.vercel.app-4f46e5?style=for-the-badge)](https://mhtamim136.vercel.app/)
[![Profile Card](https://img.shields.io/badge/🪪_Profile_Card-Live-orange?style=for-the-badge)](https://mhtamim136.github.io/profile-card/)
[![GitHub](https://img.shields.io/badge/GitHub-mhtamim136-181717?style=for-the-badge&logo=github)](https://github.com/mhtamim136)
[![X](https://img.shields.io/badge/X-mhtamim136-000000?style=for-the-badge&logo=x)](https://x.com/mhtamim136)

</div>

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">

⭐ **If you found this useful, consider giving it a star!** ⭐

</div>
