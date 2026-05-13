<?php
/**
 * Branding and Logo rendering logic.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filter the core/image block to dynamically inject the primary logo
 * if it has the header/footer logo CSS class.
 *
 * @param string               $block_content The block content.
 * @param array<string, mixed> $block         The full block, including name and attributes.
 * @return string Modified block content.
 */
function xfact_render_brand_logo( string $block_content, array $block ): string {
	if ( 'core/image' !== $block['blockName'] || empty( $block['attrs']['className'] ) ) {
		return $block_content;
	}

	$is_logo = false;
	if ( str_contains( $block['attrs']['className'], 'xfact-header__logo-block' ) ||
		str_contains( $block['attrs']['className'], 'xfact-footer__logo-block' ) ) {
		$is_logo = true;
	}

	if ( ! $is_logo ) {
		return $block_content;
	}

	$primary_logo_url = xfact_get_primary_logo_url();

	// Replace the src attribute in the image tag.
	$block_content = preg_replace(
		'/(<img[^>]+src=["\'])([^"\']+)(["\'])/i',
		'${1}' . esc_url( $primary_logo_url ) . '${3}',
		$block_content
	);

	return $block_content;
}
add_filter( 'render_block_core/image', 'xfact_render_brand_logo', 10, 2 );

/**
 * Output the configured favicon to wp_head and admin_head.
 */
function xfact_output_favicon(): void {
	$favicon_url = xfact_get_favicon_url();
	if ( $favicon_url ) {
		echo '<link rel="icon" href="' . esc_url( $favicon_url ) . '" />' . "\n";
	}
}
add_action( 'wp_head', 'xfact_output_favicon', 99 );
add_action( 'admin_head', 'xfact_output_favicon', 99 );
add_action( 'login_head', 'xfact_output_favicon', 99 );

/**
 * Output dynamic typography CSS variables and custom @font-face rules.
 * Uses enqueue_block_assets so it works inside the block editor iframe.
 */
function xfact_enqueue_dynamic_fonts(): void {
	$font_heading = xfact_get_font_heading();
	$font_body    = xfact_get_font_body();
	$custom_fonts = xfact_get_custom_fonts();

	$heading_family = 'var(--wp--preset--font-family--' . esc_attr( $font_heading ) . ', sans-serif)';
	$body_family    = 'var(--wp--preset--font-family--' . esc_attr( $font_body ) . ', sans-serif)';

	$font_family_map = array(
		'inter'         => "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		'ibm-plex-mono' => "'IBM Plex Mono', monospace",
	);

	foreach ( $custom_fonts as $font ) {
		$font_family_map[ $font['slug'] ] = "'" . esc_attr( $font['fontFamily'] ) . "'";
	}

	if ( isset( $font_family_map[ $font_heading ] ) ) {
		$heading_family = $font_family_map[ $font_heading ];
	}
	if ( isset( $font_family_map[ $font_body ] ) ) {
		$body_family = $font_family_map[ $font_body ];
	}

	$css = '';

	// Output @font-face for custom fonts.
	foreach ( $custom_fonts as $font ) {
		$css .= "@font-face {\n";
		$css .= "\tfont-family: '" . esc_attr( $font['fontFamily'] ) . "';\n";
		$css .= "\tsrc: url('" . esc_url( $font['url'] ) . "') format('woff2');\n";
		if ( ! empty( $font['weight'] ) ) {
			$css .= "\tfont-weight: " . esc_attr( $font['weight'] ) . ";\n";
		}
		$css .= "\tfont-display: swap;\n";
		$css .= "}\n";
	}

	$css .= ":root {\n";
	$css .= "\t--wp--preset--font-family--heading: {$heading_family} !important;\n";
	$css .= "\t--wp--preset--font-family--body: {$body_family} !important;\n";
	$css .= "}\n";

	// Ensure editor body gets the font.
	$css .= "body {\n";
	$css .= "\t--wp--preset--font-family--body: {$body_family} !important;\n";
	$css .= "}\n";

	wp_register_style( 'xfact-dynamic-fonts', false, array(), '1.0.0' );
	wp_enqueue_style( 'xfact-dynamic-fonts' );
	wp_add_inline_style( 'xfact-dynamic-fonts', $css );
}
add_action( 'wp_enqueue_scripts', 'xfact_enqueue_dynamic_fonts', 100 );
add_action( 'enqueue_block_assets', 'xfact_enqueue_dynamic_fonts', 100 );
