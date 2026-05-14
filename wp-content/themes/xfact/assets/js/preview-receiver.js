/**
 * Live Preview Receiver
 * Listens for postMessage from the admin settings page to update live CSS variables.
 */
(function() {
	'use strict';

	// Create or get the style block for dynamic overrides
	let styleEl = document.getElementById('xfact-live-preview-styles');
	if (!styleEl) {
		styleEl = document.createElement('style');
		styleEl.id = 'xfact-live-preview-styles';
		document.head.appendChild(styleEl);
	}

	let currentStyles = { vars: {}, darkVars: {} };
	let currentTheme = 'light';

	window.addEventListener('message', function(event) {
		// Basic security check - in production you might check origin,
		// but since both are on the same domain, we trust it.
		if (!event.data || typeof event.data !== 'object') {
			return;
		}

		if (event.data.type === 'theme') {
			currentTheme = event.data.value;
			if (currentTheme === 'dark') {
				document.documentElement.setAttribute('data-theme', 'dark');
			} else {
				document.documentElement.removeAttribute('data-theme');
			}
			renderStyles();
		}

		if (event.data.type === 'styles') {
			currentStyles = event.data;
			renderStyles();
		}
	});

		function renderStyles() {
		let css = ':root, html, body {';
		
		// 1. Primitive Colors
		if (currentStyles.primitives) {
			for (const [key, value] of Object.entries(currentStyles.primitives)) {
				css += `\n\t--xfact-primitive-${key}: ${value} !important;`;
			}
		}

		// 2. Semantic Colors
		if (currentStyles.semantics) {
			for (const [key, value] of Object.entries(currentStyles.semantics)) {
				css += `
	--wp--preset--color--${key}: var(--xfact-primitive-${value}) !important;`;
				css += `
	--xfact-semantic-${key}: var(--xfact-primitive-${value}) !important;`;
			}
		}

		// Dark Mode Semantic Colors
		if (currentStyles.darkSemantics) {
			css += `\n}\nhtml[data-theme="dark"] body {`;
			for (const [key, value] of Object.entries(currentStyles.darkSemantics)) {
				css += `
	--wp--preset--color--${key}: var(--xfact-primitive-${value}) !important;`;
				css += `
	--xfact-semantic-${key}: var(--xfact-primitive-${value}) !important;`;
			}
		}

		// 3. Gradients
		if (currentStyles.gradients) {
			for (const [key, gradient] of Object.entries(currentStyles.gradients)) {
				css += `\n\t--wp--preset--gradient--${key}: linear-gradient(90deg, var(--xfact-primitive-${gradient.start}) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;
				css += `\n\t--xfact-gradient-${key}: linear-gradient(90deg, var(--xfact-primitive-${gradient.start}) 0%, var(--xfact-primitive-${gradient.end}) 100%) !important;`;
			}
		}

		// 4. Typography / legacy vars
		if (currentStyles.vars) {
			for (const [key, value] of Object.entries(currentStyles.vars)) {
				if (key && value && typeof key === 'string' && key.indexOf('--wp--preset--font') === 0) {
					if (value.includes('!important')) {
						css += `\n\t${key}: ${value};`;
					} else {
						css += `\n\t${key}: ${value} !important;`;
					}
				}
			}
		}
		css += '\n}';

		if (currentStyles.vars && currentStyles.vars['--wp--preset--font-family--body']) {
			css += `\nbody { \n\t--wp--preset--font-family--body: ${currentStyles.vars['--wp--preset--font-family--body']}; \n}`;
		}

		styleEl.textContent = css;
	}

	// Keep iframe navigation in preview mode
	if (window.parent !== window) {
		document.addEventListener('click', function(e) {
			const link = e.target.closest('a');
			// Only intercept local links that aren't admin links or jump links
			if (link && link.href && link.href.startsWith(window.location.origin) && !link.href.includes('wp-admin') && !link.href.includes('#')) {
				e.preventDefault();
				try {
					const url = new URL(link.href);
					url.searchParams.set('xfact_preview', '1');
					window.location.href = url.toString();
				} catch (err) {
					window.location.href = link.href;
				}
			}
		});
	}

})();
