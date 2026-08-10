/* Modus — theme toggle, scroll-zoom, load-more (no dependencies) */
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

    /* Transparent header: solid + normal colours after scrolling past the hero */
    function initTransparentHeader() {
        if (!document.body.classList.contains('is-head-transparent')) return;

        var header = document.querySelector('.gc-header');
        var hero = document.querySelector('.gc-home-hero');
        if (!header || !hero) return;

        var ticking = false;

        function update() {
            var threshold = Math.max(hero.offsetHeight - header.offsetHeight, 0);
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
    });
})();
