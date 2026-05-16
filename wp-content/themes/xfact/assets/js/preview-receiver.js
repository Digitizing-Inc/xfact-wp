/**
 * Live Preview Receiver
 * Listens for postMessage from the admin settings page to update live CSS variables.
 */
(() => {
    // Create or get the style block for dynamic overrides
    let styleEl = document.getElementById('xfact-live-preview-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'xfact-live-preview-styles';
        document.head.appendChild(styleEl);
    }

    let currentStyles = { vars: {}, darkVars: {} };
    let currentTheme = 'light';

    window.addEventListener('message', (event) => {
        // Basic security check - in production you might check origin,
        // but since both are on the same domain, we trust it.
        if (!event.data || typeof event.data !== 'object') {
            return;
        }

        if (event.data.type === 'theme') {
            currentTheme = event.data.value;
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('xfact-dark-section');
            } else {
                document.documentElement.removeAttribute('data-theme');
                document.body.classList.remove('xfact-dark-section');
            }
            renderStyles();
        }

        if (event.data.type === 'styles') {
            currentStyles = event.data;
            renderStyles();
        }

        if (event.data.disableDarkMode !== undefined) {
            const toggles = document.querySelectorAll(
                '.xfact-theme-toggle, .xfact-footer__theme-label, .xfact-mobile-nav__theme',
            );
            toggles.forEach((el) => {
                el.style.display = event.data.disableDarkMode ? 'none' : '';
            });
        }
    });

    function renderStyles() {
        let css = ':root, html, body {';

        // 1. Primitive Colors
        if (currentStyles.primitives) {
            for (const [key, value] of Object.entries(
                currentStyles.primitives,
            )) {
                css += `\n\t--xfact-primitive-${key}: ${value} !important;`;
            }
        }

        // 2. Semantic Colors
        if (currentStyles.semantics) {
            for (const [key, value] of Object.entries(
                currentStyles.semantics,
            )) {
                css += `
	--wp--preset--color--${key}: var(--xfact-primitive-${value}) !important;`;
                css += `
	--xfact-semantic-${key}: var(--xfact-primitive-${value}) !important;`;
            }
        }

        // 3. Gradients
        if (currentStyles.gradients) {
            for (const [key, gradient] of Object.entries(
                currentStyles.gradients,
            )) {
                const angle = parseInt(gradient.angle || '90', 10);
                css += `\n\t--wp--preset--gradient--${key}: linear-gradient(${angle}deg, var(--xfact-primitive-${gradient.start}) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;
                css += `\n\t--xfact-gradient-${key}: linear-gradient(${angle}deg, var(--xfact-primitive-${gradient.start}) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;

                let horizontal_angle = (angle - 90) % 360;
                if (horizontal_angle < 0) {
                    horizontal_angle += 360;
                }
                css += `\n\t--xfact-gradient-${key}-horizontal: linear-gradient(${horizontal_angle}deg, var(--xfact-primitive-${gradient.start}) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;

                if (key === 'primary-2') {
                    css += `\n\t--xfact-btn-angle: ${angle}deg !important;`;
                    css += `\n\t--xfact-btn-from: var(--xfact-primitive-${gradient.start}) !important;`;
                    css += `\n\t--xfact-btn-to: var(--xfact-primitive-${gradient.end}) !important;`;
                }
                if (key === 'secondary-2') {
                    css += `\n\t--xfact-btn-hover-angle: ${angle}deg !important;`;
                    css += `\n\t--xfact-btn-hover-from: var(--xfact-primitive-${gradient.start}) !important;`;
                    css += `\n\t--xfact-btn-hover-to: var(--xfact-primitive-${gradient.end}) !important;`;
                }
            }
        }

        // 4. Typography / legacy vars
        if (currentStyles.vars) {
            for (const [key, value] of Object.entries(currentStyles.vars)) {
                if (
                    key &&
                    value &&
                    typeof key === 'string' &&
                    key.indexOf('--wp--preset--font') === 0
                ) {
                    if (value.includes('!important')) {
                        css += `\n\t${key}: ${value};`;
                    } else {
                        css += `\n\t${key}: ${value} !important;`;
                    }
                }
            }
        }

        css += '\n}';

        // Dark Mode Semantic Colors
        if (currentStyles.darkSemantics) {
            css += `\nhtml[data-theme="dark"] body {`;
            for (const [key, value] of Object.entries(
                currentStyles.darkSemantics,
            )) {
                css += `\n\t--wp--preset--color--${key}: var(--xfact-primitive-${value}) !important;`;
                css += `\n\t--xfact-semantic-${key}: var(--xfact-primitive-${value}) !important;`;
            }

            // Make dark mode gradients darker by setting the start color to black.
            if (currentStyles.gradients) {
                for (const [key, gradient] of Object.entries(
                    currentStyles.gradients,
                )) {
                    const angle = gradient.angle || '90';
                    css += `\n\t--xfact-gradient-${key}: linear-gradient(${angle}deg, var(--xfact-primitive-black) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;
                }
            }

            css += '\n}';
        }

        if (currentStyles.vars?.['--wp--preset--font-family--body']) {
            css += `\nbody { \n\t--wp--preset--font-family--body: ${currentStyles.vars['--wp--preset--font-family--body']}; \n}`;
        }

        styleEl.textContent = css;
    }

    // Keep iframe navigation in preview mode
    if (window.parent !== window) {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            // Only intercept local links that aren't admin links or jump links
            if (
                link?.href?.startsWith(window.location.origin) &&
                !link.href.includes('wp-admin') &&
                !link.href.includes('#')
            ) {
                e.preventDefault();
                try {
                    const url = new URL(link.href);
                    url.searchParams.set('xfact_preview', '1');
                    window.location.href = url.toString();
                } catch (_err) {
                    window.location.href = link.href;
                }
            }
        });
    }
})();
