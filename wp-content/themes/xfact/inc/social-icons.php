<?php
/**
 * Social icons helper.
 *
 * Returns an inline SVG string for the given social icon name.
 *
 * @package xfact
 */

declare(strict_types=1);

/**
 * Get an inline SVG social icon by type.
 *
 * @param string $type    Social type (e.g. 'linkedin', 'twitter', 'website').
 * @param string $classes Extra CSS classes for the <svg> element.
 * @return string SVG markup or empty string if icon not found.
 */
function xfact_get_social_icon( string $type, string $classes = '' ): string {
	$icons = array(
		'linkedin' => '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
		'twitter'  => '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
		'x'        => '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
		'telegram' => '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
		'email'    => '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
		'website'  => '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>',
	);

	$type = strtolower( $type );
	// Default to website if unknown type is provided, but typically we want it handled gracefully.
	if ( ! isset( $icons[ $type ] ) ) {
		$type = 'website';
	}

	$class_attr = $classes ? ' class="' . esc_attr( $classes ) . '"' : '';

	return sprintf(
		'<svg%s xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">%s</svg>',
		$class_attr,
		$icons[ $type ]
	);
}
