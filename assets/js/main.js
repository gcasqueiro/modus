/* Modus — theme toggle, scroll-zoom, load-more, header (no dependencies) */
(function () {
    'use strict';

    var STORAGE_KEY = 'gc-theme';
    var root = document.documentElement;

    function currentTheme() {
        return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme !== 'dark' && theme !== 'light') return;
        root.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) { /* private mode / blocked storage */ }
        syncToggle(theme);
        stylePortalAccent();
    }

    function syncToggle(theme) {
        var toggle = document.getElementById('gc-theme-toggle');
        if (toggle) {
            toggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
        }
    }

    function initToggle() {
        var toggle = document.getElementById('gc-theme-toggle');
        if (!toggle) return;

        syncToggle(currentTheme());
        toggle.addEventListener('click', function () {
            applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
        });
    }

    /* Follow OS preference only until the visitor picks a theme. */
    function initSystemSync() {
        if (!window.matchMedia) return;
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var handler = function (e) {
            var stored;
            try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) { stored = null; }
            if (stored !== 'dark' && stored !== 'light') {
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                syncToggle(currentTheme());
            }
        };
        if (mq.addEventListener) {
            mq.addEventListener('change', handler);
        } else if (mq.addListener) {
            mq.addListener(handler);
        }
    }

    /* Scroll-zoom (parallax) on homepage hero and post/page feature images. */
    function initParallax() {
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        var frames = document.querySelectorAll('[data-parallax]');
        if (!frames.length) return;

        var MAX_SCALE = 0.15;
        var MAX_SHIFT = 0.05;
        var ticking = false;

        function update() {
            for (var i = 0; i < frames.length; i++) {
                var frame = frames[i];
                var rect = frame.getBoundingClientRect();
                var h = rect.height || 1;
                var progress = -rect.top / h;
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                var scale = 1 + progress * MAX_SCALE;
                var shift = progress * h * MAX_SHIFT;
                var transform = 'translate3d(0,' + shift.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';

                var imgs = frame.querySelectorAll('img');
                for (var j = 0; j < imgs.length; j++) {
                    imgs[j].style.transform = transform;
                }
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* Only allow load-more to fetch same-origin listing pages. */
    function isSafeNextUrl(url) {
        if (!url) return false;
        try {
            var resolved = new URL(url, window.location.origin);
            return resolved.origin === window.location.origin;
        } catch (e) {
            return false;
        }
    }

    /* Append the next page of posts without a full navigation. */
    function initLoadMore() {
        var btn = document.querySelector('.gc-loadmore');
        var grid = document.querySelector('[data-posts-grid]');
        if (!btn || !grid) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var url = btn.getAttribute('data-next-url');
            if (!isSafeNextUrl(url) || btn.getAttribute('aria-busy') === 'true') return;

            btn.setAttribute('aria-busy', 'true');
            btn.textContent = 'Loading…';

            fetch(url, { credentials: 'same-origin' })
                .then(function (res) {
                    if (!res.ok) throw new Error('load-more failed');
                    return res.text();
                })
                .then(function (html) {
                    var doc = new DOMParser().parseFromString(html, 'text/html');
                    var newGrid = doc.querySelector('[data-posts-grid]');
                    var nextBtn = doc.querySelector('.gc-loadmore');

                    if (newGrid) {
                        var cards = newGrid.querySelectorAll('.gc-card');
                        for (var i = 0; i < cards.length; i++) {
                            grid.appendChild(document.importNode(cards[i], true));
                        }
                    }

                    if (nextBtn && isSafeNextUrl(nextBtn.getAttribute('data-next-url'))) {
                        var nextUrl = nextBtn.getAttribute('data-next-url');
                        btn.setAttribute('data-next-url', nextUrl);
                        btn.setAttribute('href', nextUrl);
                        btn.removeAttribute('aria-busy');
                        btn.textContent = 'Load more';
                    } else {
                        var wrap = btn.parentNode;
                        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
                    }
                })
                .catch(function () {
                    btn.removeAttribute('aria-busy');
                    btn.textContent = 'Load more';
                });
        });
    }

    /* Site-wide transparent header: solid after scrolling past top image (or a small offset). */
    function initTransparentHeader() {
        if (!document.body.classList.contains('is-head-transparent')) return;

        var header = document.querySelector('.gc-header');
        if (!header) return;

        var topImage = document.querySelector('.gc-home-hero, .gc-post-feature, .gc-page-hero');
        var ticking = false;

        function update() {
            var threshold = 24;
            if (topImage) {
                threshold = Math.max(topImage.offsetHeight - header.offsetHeight, 24);
            }
            if (window.scrollY > threshold) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
            ticking = false;
        }

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        update();
    }

    /* Current theme accent as a resolved color (for Portal iframe --brandcolor). */
    function currentAccentColor() {
        var value = getComputedStyle(root).getPropertyValue('--gc-accent').trim();
        return value || getComputedStyle(root).getPropertyValue('--ghost-accent-color').trim();
    }

    /*
     * Ghost's floating Portal button (bottom-right) lives in an iframe and uses
     * --brandcolor from the site Brand accent, not theme CSS. Push our light/dark
     * theme accents into those iframes so Subscribe matches the active mode.
     */
    function stylePortalAccent() {
        var color = currentAccentColor();
        if (!color) return;

        var frames = document.querySelectorAll(
            'iframe[data-testid="portal-trigger-frame"], iframe.gh-portal-triggerbtn-iframe, iframe[title="portal-trigger"], iframe[data-testid="portal-popup-frame"], iframe[title="portal-popup"]'
        );

        for (var i = 0; i < frames.length; i++) {
            try {
                var doc = frames[i].contentDocument;
                if (!doc || !doc.documentElement) continue;

                doc.documentElement.style.setProperty('--brandcolor', color);

                var btn = doc.querySelector('.gh-portal-triggerbtn-container');
                if (btn) {
                    btn.style.background = color;
                }

                /* Primary buttons inside the open portal popup */
                var primary = doc.querySelectorAll('.gh-portal-btn-main, .gh-portal-btn-primary, button.gh-portal-btn');
                for (var j = 0; j < primary.length; j++) {
                    if (primary[j].classList.contains('gh-portal-btn-text')) continue;
                    primary[j].style.backgroundColor = color;
                    primary[j].style.borderColor = color;
                }
            } catch (e) {
                /* cross-origin iframe — ignore */
            }
        }
    }

    function initPortalAccent() {
        stylePortalAccent();

        /* Portal mounts asynchronously after ghost_foot scripts run */
        var tries = 0;
        var timer = window.setInterval(function () {
            stylePortalAccent();
            tries += 1;
            if (tries > 40) window.clearInterval(timer);
        }, 250);

        if (window.MutationObserver) {
            var observer = new MutationObserver(function () {
                stylePortalAccent();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    /* Mobile hamburger menu */
    function initMobileNav() {
        var header = document.querySelector('.gc-header');
        var toggle = document.getElementById('gc-nav-toggle');
        var nav = document.getElementById('gc-nav');
        if (!header || !toggle || !nav) return;

        function setOpen(open) {
            header.classList.toggle('is-nav-open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        }

        toggle.addEventListener('click', function () {
            setOpen(!header.classList.contains('is-nav-open'));
        });

        nav.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setOpen(false);
        });

        window.addEventListener('resize', function () {
            if (window.matchMedia('(min-width: 641px)').matches) setOpen(false);
        });
    }

    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        initToggle();
        initSystemSync();
        initParallax();
        initLoadMore();
        initTransparentHeader();
        initMobileNav();
        initPortalAccent();
    });
})();
