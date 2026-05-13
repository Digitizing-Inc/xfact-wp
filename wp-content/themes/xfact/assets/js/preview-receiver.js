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
		
		// If dark mode is active, use darkVars where available, fallback to light vars
		// If light mode is active, use only light vars
		const activeVars = currentTheme === 'dark' && currentStyles.darkVars 
			? { ...currentStyles.vars, ...currentStyles.darkVars } 
			: currentStyles.vars;

		// We need to map some specific standard CSS variables
		if (activeVars['--xfact-bg']) {
			activeVars['--xfact-surface-alt'] = activeVars['--xfact-bg'];
			activeVars['--wp--preset--color--surface'] = activeVars['--xfact-bg'];
			if (currentTheme === 'dark') {
				activeVars['--xfact-dark-section'] = activeVars['--xfact-bg'];
				activeVars['--wp--preset--color--dark-section'] = activeVars['--xfact-bg'];
			}
		}
		if (activeVars['--xfact-bg-alt']) {
			activeVars['--xfact-surface'] = activeVars['--xfact-bg-alt'];
			activeVars['--xfact-bg-card'] = activeVars['--xfact-bg-alt'];
			activeVars['--wp--preset--color--surface-alt'] = activeVars['--xfact-bg-alt'];
		}
		if (activeVars['--xfact-text']) {
			activeVars['--wp--preset--color--text-primary'] = activeVars['--xfact-text'];
			if (currentTheme === 'dark') {
				activeVars['--xfact-dark-section-text'] = activeVars['--xfact-text'];
			}
		}
		if (activeVars['--xfact-text-secondary']) {
			activeVars['--wp--preset--color--text-secondary'] = activeVars['--xfact-text-secondary'];
		}
		if (activeVars['--xfact-accent']) {
			activeVars['--wp--preset--color--accent'] = activeVars['--xfact-accent'];
		}

		for (const [key, value] of Object.entries(activeVars)) {
			if (value) {
				// Handle important tags for WP preset fonts
				if (value.includes('!important')) {
					css += `\n\t${key}: ${value};`;
				} else {
					css += `\n\t${key}: ${value} !important;`;
				}
			}
		}
		css += '\n}';

		// Make sure body font applies specifically if present
		if (activeVars['--wp--preset--font-family--body']) {
			css += `\nbody { \n\t--wp--preset--font-family--body: ${activeVars['--wp--preset--font-family--body']}; \n}`;
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
