# Modus

[Ghost](https://ghost.org) 6 theme built for my own website. Light/dark modes, dual heroes, transparent nav, dual accents, related posts. Inspired by [Edition](https://github.com/TryGhost/Edition) and [Joelma](https://github.com/HauntedThemes/joelma).

---

## Features

- **Light and dark mode** - reader choice is saved in the browser and applied before first paint; falls back to the system preference
- **Separate light and dark homepage heroes** - optional second image that swaps automatically with the colour scheme
- **Fullscreen homepage hero** - full-viewport cover with scroll-zoom and an animated chevron to scroll down
- **Transparent site-wide navbar** - sits over heroes and feature images; becomes solid after scroll; hamburger menu on mobile
- **Independent light and dark accent colours** - set in Design settings; used for buttons, links, tags, and the Portal subscribe button
- **Post feature images with scroll-zoom** - full-width band under the navbar (shorter than the homepage hero on desktop; natural height on mobile)
- **Equal-height post cards** - clamped titles and excerpts so meta lines align in the grid
- **All tags as accent pills** - shown on cards and at the top and bottom of posts
- **Related posts** - “You might also like…” with minimal image + title cards, based on shared tags (then other posts)
- **Featured + Latest on the homepage** - featured posts in their own section above the main feed
- **Load more** - appends the next page of posts without a full reload (normal link if JavaScript is off)
- **Full-width video embeds** - YouTube and similar cards fill the content column at 16:9
- **Members subscribe form** - end-of-post signup when Members is enabled
- **Member discussion** - native Ghost comments under the subscribe form when commenting is enabled
- **Social icons** - header and footer show only networks configured in Ghost
- **No build step** - plain HTML/CSS/JS; edit and upload

---

## Requirements

- Ghost **6.0** or newer

---

## Install

1. Download **[modus.zip](https://github.com/gcasqueiro/modus/releases/latest/download/modus.zip)** from the [latest release](https://github.com/gcasqueiro/modus/releases/latest).
2. Ghost Admin → **Settings → Design → Change theme → Upload theme**.
3. Upload `modus.zip` and **Activate**.

> Use the release asset **`modus.zip`**, not GitHub’s **Code → Download ZIP** (that creates `modus-main.zip` with an extra folder Ghost rejects).

---

## Theme settings

Configured under **Settings → Design** (no code required).

| Setting | Purpose |
| --- | --- |
| Navbar brand | Site title, logo, or nothing |
| Hero image (light) | Homepage hero in light mode |
| Hero image (dark) | Optional hero for dark mode |
| Show homepage description | Site tagline under the hero |
| Light-mode accent | Accent colour in light mode |
| Dark-mode accent | Accent colour in dark mode |
| Show reading time | On cards and posts |
| Show author on cards | Author name on listing cards |
| Footer text | Custom footer line |
| Subscribe heading / subtitle | End-of-post members form copy |

Publication cover is used as the homepage hero when no light hero is set. Logo appears when navbar brand is “Logo image”. Fonts follow Ghost’s site font settings when set.

---

## Development

```
modus/
├── default.hbs
├── index.hbs, post.hbs, page.hbs, tag.hbs, author.hbs, error.hbs
├── partials/
├── assets/css/screen.css
├── assets/js/main.js
└── package.json
```

No build pipeline. Validate with:

```bash
npx gscan .
```

---

## A note on scope

Modus was built for my own site. You’re free to **clone**, **fork**, and change it however you like under the MIT license.

I don’t plan to add features on request, take custom change requests, or maintain support for other people’s setups, unless I decide to for my own use. If you need something different, fork the repo and adapt it.

---

## License

[MIT](LICENSE) · [G. Casqueiro](https://gcasqueiro.com)
