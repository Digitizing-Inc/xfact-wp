/**
 * xFact — Header Scroll Effect
 *
 * Toggles `.xfact-header--scrolled` on the site header when the user
 * scrolls past 20px, matching the source template's transparent-to-opaque
 * header transition.
 *
 * Also handles the WP admin bar on mobile (≤782px): the admin bar becomes
 * position:absolute after scrolling, so we adjust the header's top offset
 * to prevent a gap.
 *
 * @package xfact
 */

(() => {
    const SCROLL_THRESHOLD = 20;
    const ADMIN_BAR_HEIGHT = 46; /* WP admin bar height on mobile */
    const ADMIN_BAR_DESKTOP = 32; /* WP admin bar height on desktop */
    const MOBILE_BREAKPOINT = 782;

    document.addEventListener('DOMContentLoaded', () => {
        const header = document.querySelector('.xfact-header');
        if (!header) {
            return;
        }

        const isAdminBar = document.body.classList.contains('admin-bar');

        /* Active Navigation State logic */
        let currentPath = window.location.pathname.replace(/\/+$/, '');
        if (currentPath === '') currentPath = '/';

        const navLinks = header.querySelectorAll('nav.wp-block-navigation a');
        navLinks.forEach((link) => {
            try {
                let linkPath = new URL(
                    link.href,
                    window.location.origin,
                ).pathname.replace(/\/+$/, '');
                if (linkPath === '') linkPath = '/';

                // Highlight if it's an exact match
                if (linkPath === currentPath) {
                    link.setAttribute('aria-current', 'page');

                    // Also mark parent if it's a submenu
                    const parentMenuItem = link.closest(
                        '.wp-block-navigation-item.has-child',
                    );
                    if (parentMenuItem) {
                        parentMenuItem.classList.add('current-menu-ancestor');
                    }
                }
            } catch (_e) {}
        });

        function onScroll() {
            const scrollY = window.scrollY;

            /* Toggle scrolled state */
            if (scrollY > SCROLL_THRESHOLD) {
                header.classList.add('xfact-header--scrolled');
            } else {
                header.classList.remove('xfact-header--scrolled');
            }

            /* Admin bar offset on mobile: the admin bar starts as position:fixed
			   but becomes position:absolute after scrolling past its height.
			   Adjust the header top to compensate. */
            if (isAdminBar) {
                const wpadminbar = document.getElementById('wpadminbar');
                let adminBarHeight = ADMIN_BAR_DESKTOP;
                if (window.innerWidth <= MOBILE_BREAKPOINT) {
                    adminBarHeight = ADMIN_BAR_HEIGHT;
                }

                if (wpadminbar) {
                    const adminBarPos =
                        window.getComputedStyle(wpadminbar).position;
                    if (adminBarPos === 'absolute') {
                        // Admin bar scrolls away, so we need to decrease top offset
                        const offset = Math.max(0, adminBarHeight - scrollY);
                        header.style.top = `${offset}px`;
                    } else {
                        // Admin bar is fixed, always keep the offset
                        header.style.top = `${adminBarHeight}px`;
                    }
                } else {
                    // Fallback if element not found but class exists
                    header.style.top = `${adminBarHeight}px`;
                }
            } else {
                header.style.top = '0px';
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        /* Run once on load in case page loads mid-scroll. */
        onScroll();
    });
})();
