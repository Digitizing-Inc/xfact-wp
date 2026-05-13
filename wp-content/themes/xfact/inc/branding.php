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
