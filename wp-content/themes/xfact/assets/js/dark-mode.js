/**
 * xFact — Dark Mode Toggle
 *
 * Reads preference from localStorage; falls back to system preference.
 * Loaded in <head> to prevent flash of wrong theme.
 *
 * @package xfact
 */

(() => {
    const STORAGE_KEY = 'xfact-theme';
    const config = window.xfactThemeConfig || {
        themeMode: 'light',
        disableDarkMode: false,
    };

    function getPreference() {
        if (config.disableDarkMode) {
            return 'light';
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'dark' || stored === 'light') {
            return stored;
        }
        if (config.themeMode === 'light' || config.themeMode === 'dark') {
            return config.themeMode;
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    }

    function apply(theme, isExplicit = true) {
        const isDark = theme === 'dark';

        /* Temporarily disable transitions to avoid color fading during theme swap */
        const css = document.createElement('style');
        css.appendChild(
            document.createTextNode(
                '* { -webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; -ms-transition: none !important; transition: none !important; }',
            ),
        );
        document.head.appendChild(css);

        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute(
            'data-xfact-dark',
            String(isDark),
        );

        function updateBodyClass() {
            if (isDark) {
                document.body.classList.add('xfact-dark-section');
            } else {
                document.body.classList.remove('xfact-dark-section');
            }
        }

        if (document.body) {
            updateBodyClass();
        } else {
            document.addEventListener('DOMContentLoaded', updateBodyClass);
        }

        /* Force reflow before removing the disabled transitions */
        const _ = window.getComputedStyle(css).opacity;
        document.head.removeChild(css);

        if (isExplicit) {
            localStorage.setItem(STORAGE_KEY, theme);
        }

        /* Update all toggle buttons' aria-label */
        const toggles = document.querySelectorAll(
            '.xfact-dark-mode-toggle, .xfact-theme-toggle',
        );
        for (let i = 0; i < toggles.length; i++) {
            toggles[i].setAttribute(
                'aria-label',
                isDark ? 'Switch to light mode' : 'Switch to dark mode',
            );
        }
        /* Sync with parent frame if in iframe (e.g. Theme Settings Live Preview) */
        if (window !== window.parent) {
            window.parent.postMessage(
                { type: 'xfact_theme_changed', value: theme },
                '*',
            );
        }
    }

    /* Apply immediately (runs in <head> so no FOUC), don't set explicit storage */
    apply(getPreference(), false);

    /* Bind toggle buttons after DOM ready */
    document.addEventListener('DOMContentLoaded', () => {
        const toggles = document.querySelectorAll(
            '.xfact-dark-mode-toggle, .xfact-theme-toggle',
        );
        if (config.disableDarkMode) {
            for (let i = 0; i < toggles.length; i++) {
                toggles[i].style.display = 'none';
            }
            return;
        }
        for (let i = 0; i < toggles.length; i++) {
            toggles[i].addEventListener('click', () => {
                const current =
                    document.documentElement.getAttribute('data-theme');
                apply(current === 'dark' ? 'light' : 'dark');
            });
        }
    });

    /* Listen for system preference changes */
    window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', (e) => {
            if (config.disableDarkMode) {
                return;
            }
            if (
                !localStorage.getItem(STORAGE_KEY) &&
                config.themeMode === 'system'
            ) {
                apply(e.matches ? 'dark' : 'light', false);
            }
        });
})();
