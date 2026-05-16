<?php
/**
 * Template-part render filters.
 *
 * Injects functional HTML (mobile nav, footer bottom bar) into
 * template parts at render time.  This keeps the block markup in
 * parts/header.html and parts/footer.html free of wp:html blocks
 * so that the Site Editor shows clean, visually-editable content.
 *
 * @package xfact
 */

defined( 'ABSPATH' ) || exit;

/**
 * Inject mobile toggle + mobile-nav overlay into the header template part.
 *
 * Inserted just before </header> so the toggle can be absolutely positioned
 * inside the sticky header via CSS.
 */
add_filter(
	'render_block_core/template-part',
	function ( $content, $block ) {
		static $header_done = false;
		if ( ! $header_done && isset( $block['attrs']['slug'] ) && 'header' === $block['attrs']['slug'] && false !== strpos( $content, '</header>' ) ) {
			$header_done = true;
			$mobile_html = xfact_get_mobile_toggle_html() . xfact_get_mobile_nav_html();
			$pos         = strpos( $content, '</header>' );
			$content     = substr_replace( $content, $mobile_html . '</header>', $pos, strlen( '</header>' ) );
		}
		return $content;
	},
	10,
	2
);

/**
 * Inject theme toggle button into the footer bottom bar.
 *
 * The bottom bar is now in footer.html as blocks.  We inject the
 * toggle button after the "Theme" label since it requires interactive
 * HTML that can't be a pure block.
 */
add_filter(
	'render_block_core/template-part',
	function ( $content, $block ) {
		static $footer_done = false;
		if ( ! $footer_done && isset( $block['attrs']['slug'] ) && 'footer' === $block['attrs']['slug'] && false !== strpos( $content, 'xfact-footer__theme-label' ) ) {
			$footer_done = true;

			/* Inject theme toggle button after the Theme label paragraph, or remove label if disabled */
			if ( get_option( 'xfact_disable_dark_mode', false ) ) {
				$content = preg_replace(
					'/<p class="xfact-footer__theme-label">Theme<\/p>/',
					'',
					$content
				);
			} else {
				$toggle_html = xfact_get_theme_toggle_html();
				$needle      = 'class="xfact-footer__theme-label">Theme</p>';
				$content     = str_replace(
					$needle,
					$needle . $toggle_html,
					$content
				);
			}

			/* Replace hardcoded year with dynamic year */
			$content = preg_replace(
				'/© \d{4} xFact/',
				'© ' . gmdate( 'Y' ) . ' xFact',
				$content
			);
		}
		return $content;
	},
	10,
	2
);

/*
================================================================
 * HTML helpers
 * =============================================================
 */

/**
 * Mobile hamburger / close button.
 *
 * @return string
 */
function xfact_get_mobile_toggle_html(): string {
	ob_start();
	?>
	<button
		class="xfact-mobile-toggle"
		type="button"
		aria-label="Toggle menu"
		aria-expanded="false"
	>
		<svg
			class="xfact-mobile-toggle__icon-open"
			width="24" height="24" fill="none" viewBox="0 0 24 24"
			stroke-width="1.5" stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
		</svg>
		<svg
			class="xfact-mobile-toggle__icon-close"
			width="24" height="24" fill="none" viewBox="0 0 24 24"
			stroke-width="1.5" stroke="currentColor"
		>
			<path stroke-linecap="round" stroke-linejoin="round"
				d="M6 18L18 6M6 6l12 12"/>
		</svg>
	</button>
	<?php
	return ob_get_clean();
}

/**
 * Full-screen mobile navigation overlay.
 *
 * @return string
 */
function xfact_get_mobile_nav_html(): string {
	$disable_dark = get_option( 'xfact_disable_dark_mode', false );
	ob_start();
	?>
	<nav class="xfact-mobile-nav" aria-label="Mobile navigation">
		<div class="xfact-mobile-nav__links">
			<!-- Populated dynamically from the desktop wp:navigation block by mobile-menu.js -->
		</div>
		<div class="xfact-mobile-nav__bottom">
			<a href="/contact" class="xfact-mobile-nav__cta" data-xfact-mobile-cta>Contact</a>
			<?php if ( ! $disable_dark ) : ?>
			<div class="xfact-mobile-nav__theme">
				<span class="xfact-mobile-nav__theme-label">Theme</span>
				<?php echo xfact_get_theme_toggle_html(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Trusted HTML component. ?>
			</div>
			<?php endif; ?>
		</div>
	</nav>
	<?php
	return ob_get_clean();
}

/**
 * Theme toggle button HTML (used in both footer and mobile nav).
 *
 * @return string
 */
function xfact_get_theme_toggle_html(): string {
	ob_start();
	?>
	<button class="xfact-theme-toggle xfact-theme-toggle--icon-only" type="button" aria-label="Switch theme">
		<svg class="xfact-theme-toggle__icon-moon" viewBox="0 0 20 20" fill="currentColor">
			<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
		</svg>
		<svg class="xfact-theme-toggle__icon-sun" viewBox="0 0 20 20" fill="currentColor">
			<path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
		</svg>
	</button>
	<?php
	return ob_get_clean();
}

