<?php
/**
 * Shared image rendering helpers for xFact blocks.
 *
 * @package xfact
 */

declare(strict_types=1);

/**
 * Render a section image if one is set.
 *
 * Outputs a figure element with the image inside a container div.
 * Call this inside the xfact-container div of any block.
 *
 * @param string $url       Image URL.
 * @param string $alt       Image alt text.
 * @param string $css_class Optional extra CSS class.
 */
function xfact_render_section_image( string $url, string $alt = '', string $css_class = '' ): void {
	if ( empty( $url ) ) {
		return;
	}

	$class = 'xfact-section-image';
	if ( $css_class ) {
		$class .= ' ' . $css_class;
	}

	printf(
		'<figure class="%s"><img src="%s" alt="%s" loading="lazy" /></figure>',
		esc_attr( $class ),
		esc_url( $url ),
		esc_attr( $alt )
	);
}
