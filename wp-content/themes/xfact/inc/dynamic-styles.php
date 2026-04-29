<?php
/**
 * Dynamic Styles Generator
 *
 * Fetches user-configured colors from the xFact Settings page
 * and injects them as CSS variables into the frontend and block editor.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Generate and output the dynamic CSS variables.
 */
function xfact_output_dynamic_styles(): void {
	// Light Mode Colors.
	$bg             = get_option( 'xfact_color_bg', '#f5f7fa' );
	$bg_alt         = get_option( 'xfact_color_bg_alt', '#ffffff' );
	$text           = get_option( 'xfact_color_text', '#1a202c' );
	$text_secondary = get_option( 'xfact_color_text_secondary', '#4a5568' );
	$accent         = get_option( 'xfact_color_accent', '#5c8ae6' );

	// Dark Mode Colors.
	$dark_bg             = get_option( 'xfact_color_dark_bg', '#09172f' );
	$dark_bg_alt         = get_option( 'xfact_color_dark_bg_alt', '#022038' );
	$dark_text           = get_option( 'xfact_color_dark_text', '#ffffff' );
	$dark_text_secondary = get_option( 'xfact_color_dark_text_secondary', '#b3b3b3' );
	$dark_accent         = get_option( 'xfact_color_dark_accent', '#5c8ae6' );

	// Output dynamic styles.
	?>
	<style id="xfact-dynamic-theme-colors">
		:root {
			--xfact-bg: <?php echo esc_attr( $bg ); ?>;
			--xfact-bg-alt: <?php echo esc_attr( $bg_alt ); ?>;
			--xfact-bg-card: <?php echo esc_attr( $bg_alt ); ?>;
			--xfact-text: <?php echo esc_attr( $text ); ?>;
			--xfact-text-secondary: <?php echo esc_attr( $text_secondary ); ?>;
			--xfact-accent: <?php echo esc_attr( $accent ); ?>;
			--xfact-surface: <?php echo esc_attr( $bg_alt ); ?>;
			--xfact-surface-alt: <?php echo esc_attr( $bg ); ?>;
		}

		html[data-theme="dark"] {
			--xfact-bg: <?php echo esc_attr( $dark_bg ); ?>;
			--xfact-bg-alt: <?php echo esc_attr( $dark_bg_alt ); ?>;
			--xfact-bg-card: <?php echo esc_attr( $dark_bg_alt ); ?>;
			--xfact-text: <?php echo esc_attr( $dark_text ); ?>;
			--xfact-text-secondary: <?php echo esc_attr( $dark_text_secondary ); ?>;
			--xfact-accent: <?php echo esc_attr( $dark_accent ); ?>;
			--xfact-surface: <?php echo esc_attr( $dark_bg_alt ); ?>;
			--xfact-surface-alt: <?php echo esc_attr( $dark_bg ); ?>;
			--xfact-dark-section: <?php echo esc_attr( $dark_bg ); ?>;
			--xfact-dark-section-text: <?php echo esc_attr( $dark_text ); ?>;

			/* Override native WP presets directly on the element */
			--wp--preset--color--surface: <?php echo esc_attr( $dark_bg ); ?>;
			--wp--preset--color--surface-alt: <?php echo esc_attr( $dark_bg_alt ); ?>;
			--wp--preset--color--text-primary: <?php echo esc_attr( $dark_text ); ?>;
			--wp--preset--color--text-secondary: <?php echo esc_attr( $dark_text_secondary ); ?>;
			--wp--preset--color--accent: <?php echo esc_attr( $dark_accent ); ?>;
			--wp--preset--color--dark-section: <?php echo esc_attr( $dark_bg ); ?>;
		}

		/* Optional: Override native WP presets if they are not mapped in theme.json 
			(This provides a failsafe if theme.json isn't perfectly synced yet) */
		:root {
			--wp--preset--color--surface: var(--xfact-bg);
			--wp--preset--color--surface-alt: var(--xfact-bg-alt);
			--wp--preset--color--text-primary: var(--xfact-text);
			--wp--preset--color--text-secondary: var(--xfact-text-secondary);
			--wp--preset--color--accent: var(--xfact-accent);
			--wp--preset--color--dark-section: var(--xfact-dark-section);
		}
	</style>
	<?php
}

// Inject into frontend <head> late enough to override global.css.
add_action( 'wp_head', 'xfact_output_dynamic_styles', 100 );

// Inject into block editor iframe <head>.
add_action( 'admin_print_styles', 'xfact_output_dynamic_styles', 5 );
add_action(
	'enqueue_block_editor_assets',
	function () {
		// For block themes, sometimes we need to add inline styles to the editor assets.
		// But `admin_print_styles` usually covers the parent document.
		// To inject inside the iframe, we use `wp_add_inline_style`.

		$bg                  = get_option( 'xfact_color_bg', '#f5f7fa' );
		$bg_alt              = get_option( 'xfact_color_bg_alt', '#ffffff' );
		$text                = get_option( 'xfact_color_text', '#1a202c' );
		$text_secondary      = get_option( 'xfact_color_text_secondary', '#4a5568' );
		$accent              = get_option( 'xfact_color_accent', '#5c8ae6' );
		$dark_bg             = get_option( 'xfact_color_dark_bg', '#09172f' );
		$dark_bg_alt         = get_option( 'xfact_color_dark_bg_alt', '#022038' );
		$dark_text           = get_option( 'xfact_color_dark_text', '#ffffff' );
		$dark_text_secondary = get_option( 'xfact_color_dark_text_secondary', '#b3b3b3' );
		$dark_accent         = get_option( 'xfact_color_dark_accent', '#5c8ae6' );

		$css = "
		:root, html, body {
			--xfact-bg: {$bg};
			--xfact-bg-alt: {$bg_alt};
			--xfact-bg-card: {$bg_alt};
			--xfact-text: {$text};
			--xfact-text-secondary: {$text_secondary};
			--xfact-accent: {$accent};
			--xfact-surface: {$bg_alt};
			--xfact-surface-alt: {$bg};
		}
		:root[data-theme=\"dark\"],
		html[data-theme=\"dark\"],
		body[data-theme=\"dark\"] {
			--xfact-bg: {$dark_bg};
			--xfact-bg-alt: {$dark_bg_alt};
			--xfact-bg-card: {$dark_bg_alt};
			--xfact-text: {$dark_text};
			--xfact-text-secondary: {$dark_text_secondary};
			--xfact-accent: {$dark_accent};
			--xfact-surface: {$dark_bg_alt};
			--xfact-surface-alt: {$dark_bg};
			--xfact-dark-section: {$dark_bg};
			--xfact-dark-section-text: {$dark_text};

			/* Override native WP presets directly on the wrapper so they resolve correctly
			   even if the html tag remains in light mode */
			--wp--preset--color--surface: {$dark_bg};
			--wp--preset--color--surface-alt: {$dark_bg_alt};
			--wp--preset--color--text-primary: {$dark_text};
			--wp--preset--color--text-secondary: {$dark_text_secondary};
			--wp--preset--color--accent: {$dark_accent};
			--wp--preset--color--dark-section: {$dark_bg};
		}
	";
		wp_add_inline_style( 'wp-block-library', $css );
	},
	100
);
