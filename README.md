# Modus

[Ghost](https://ghost.org) 6 theme built for my own website. Light/dark modes, dual heroes, transparent nav, dual accents, related posts. Inspired by [Edition](https://github.com/TryGhost/Edition) and [Joelma](https://github.com/HauntedThemes/joelma).

---

## What makes Modus different

Most Ghost themes look polished, but many still:

- flash the wrong colour scheme on first load  
- hard-code one hero image for every visitor  
- force a narrow text column that wastes large screens  
- leave YouTube embeds tiny unless you add custom CSS  

Modus is built to avoid those defaults:

| Feature | What you get |
| --- | --- |
| **True light / dark mode** | Readers pick light or dark. The choice is saved in the browser and applied *before* the page paints (no white flash). If they never choose, the site follows their system setting. |
| **Separate light & dark heroes** | Optionally upload two homepage images. The theme shows the right one for light or dark mode automatically. |
| **Tall homepage hero** | The homepage image is large and full-width; post feature images stay shorter so the title is not pushed far down the page. |
| **Wider reading column** | Post text uses about half the screen width on large displays (roughly 25% margin on each side), and goes full width on phones. |
| **Full-size embeds** | YouTube and other video cards stretch to the content width in a proper 16:9 frame — same idea as images, not a tiny default player. |
| **Featured + Latest homepage** | Posts you mark as *Featured* in Ghost appear in their own row above the main feed. |
| **Load more (no page jump)** | Listing pages append the next set of posts in place. Without JavaScript, the same control is a normal “next page” link. |
| **Scroll-zoom on images** | Homepage hero and post feature images gently zoom as you scroll (respects “reduce motion”). |
| **Social links that stay in sync** | Header and footer show only the networks you connect under Ghost’s social settings (X, Threads, Bluesky, Mastodon, and more). |
| **Design controls in Ghost Admin** | Brand, heroes, accents, reading time, footer text, and subscribe copy are all editable under **Settings → Design** — no code edits. |
| **Zero build step** | Plain CSS and a single small JS file. Edit and upload. |

---

## Requirements

- **Ghost 6.0 or newer**

---

## Install

1. Download **[modus.zip](https://github.com/gcasqueiro/modus/releases/latest/download/modus.zip)** from the [latest release](https://github.com/gcasqueiro/modus/releases/latest).
2. In Ghost Admin: **Settings → Design → Change theme → Upload theme**.
3. Upload `modus.zip` and **Activate**.

> Use the release file named **`modus.zip`**.  
> Do not use GitHub’s **Code → Download ZIP** (that produces `modus-main.zip` with an extra folder Ghost will not accept).

---

## Configure (no code)

### Ghost brand settings

| Setting | Effect in Modus |
| --- | --- |
| Accent colour | Links, buttons, tags, and the dark-mode toggle track in light mode |
| Publication cover | Homepage hero if you do not set a custom light hero |
| Logo | Shown when navbar brand is set to “Logo image” |
| Site fonts | Used automatically when you pick fonts in Ghost |

### Theme settings (Design panel)

| Setting | What it does |
| --- | --- |
| Navbar brand | Site title, logo image, or nothing |
| Hero image (light) | Homepage hero for light mode |
| Hero image (dark) | Optional hero that swaps in for dark mode |
| Show homepage description | Show the site tagline under the hero |
| Dark-mode accent | Separate accent colour when dark mode is on |
| Show reading time | Reading time on cards and posts |
| Show author on cards | Author name on listing cards |
| Footer text | Replaces the default copyright line |
| Subscribe heading / subtitle | Text above the members signup form at the end of posts |

Social icons appear when you fill in accounts under Ghost’s **social settings**.  
The subscribe form appears when **Members** is enabled and the visitor is not already signed in.

---

## Files

```
modus/
├── default.hbs          # Site shell (header, footer, theme bootstrap)
├── index.hbs            # Home + post lists
├── post.hbs             # Single post
├── page.hbs             # Static page
├── tag.hbs / author.hbs # Archives
├── error.hbs            # Error page
├── partials/            # Header, nav, cards, socials, load-more
├── assets/css/screen.css
├── assets/js/main.js    # Theme toggle, scroll-zoom, load-more
└── package.json         # Ghost theme config + design settings
```

There is no build pipeline. Edit CSS/JS/templates, re-zip, re-upload.

Optional check before shipping:

```bash
npx gscan .
```

---

## License

[MIT](LICENSE) · [G. Casqueiro](https://gcasqueiro.com)
