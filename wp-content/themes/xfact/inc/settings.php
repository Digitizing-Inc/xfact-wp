<?php
/**
 * Theme settings registration for the xFact theme.
 *
 * Registers global options (e.g. floating logo) via the REST API
 * so the Editor plugin sidebar can read/write them.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register theme settings.
 */
function xfact_register_settings(): void {
	register_setting(
		'xfact_settings',
		'xfact_floating_logo_url',
		array(
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_show_floating_logo',
		array(
			'type'              => 'boolean',
			'default'           => false,
			'sanitize_callback' => 'rest_sanitize_boolean',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_editor_dark_mode',
		array(
			'type'              => 'boolean',
			'default'           => false,
			'sanitize_callback' => 'rest_sanitize_boolean',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_theme_mode',
		array(
			'type'              => 'string',
			'default'           => 'light',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_disable_dark_mode',
		array(
			'type'              => 'boolean',
			'default'           => false,
			'sanitize_callback' => 'rest_sanitize_boolean',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_primary_logo_url',
		array(
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_favicon_url',
		array(
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'esc_url_raw',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_font_heading',
		array(
			'type'              => 'string',
			'default'           => 'inter',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);

	register_setting(
		'xfact_settings',
		'xfact_font_body',
		array(
			'type'              => 'string',
			'default'           => 'ibm-plex-mono',
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => true,
		)
	);
}
add_action( 'admin_init', 'xfact_register_settings' );

/**
 * Also register on REST init so the setting is available via
 * GET/PUT /wp-json/wp/v2/settings in the block editor.
 */
add_action( 'rest_api_init', 'xfact_register_settings' );

/**
 * Get the resolved floating logo URL.
 *
 * Returns the admin-configured logo if set, otherwise the
 * bundled default xFact icon SVG.
 *
 * @return string Logo URL (always non-empty).
 */
function xfact_get_floating_logo_url(): string {
	$custom = get_option( 'xfact_floating_logo_url', '' );
	if ( $custom ) {
		return $custom;
	}
	return get_theme_file_uri( 'assets/images/brand/xfact-logomark.png' );
}

/**
 * Determine whether a block should display the floating logo globally.
 *
 * @return bool Whether to render the floating logo.
 */
function xfact_should_show_floating_logo(): bool {
	return (bool) get_option( 'xfact_show_floating_logo', false );
}

/**
 * Get the resolved primary logo URL.
 *
 * @return string Logo URL.
 */
function xfact_get_primary_logo_url(): string {
	$custom = get_option( 'xfact_primary_logo_url', '' );
	if ( $custom ) {
		return $custom;
	}
	return get_theme_file_uri( 'assets/images/brand/xfact-wordmark-white.png' );
}

/**
 * Get the resolved favicon URL.
 *
 * @return string Favicon URL.
 */
function xfact_get_favicon_url(): string {
	$custom = get_option( 'xfact_favicon_url', '' );
	if ( $custom ) {
		return $custom;
	}
	return get_theme_file_uri( 'assets/images/brand/favicon.ico' );
}

/**
 * Get the resolved heading font slug.
 *
 * @return string Font slug.
 */
function xfact_get_font_heading(): string {
	return get_option( 'xfact_font_heading', 'inter' );
}

/**
 * Get the resolved body font slug.
 *
 * @return string Font slug.
 */
function xfact_get_font_body(): string {
	return get_option( 'xfact_font_body', 'ibm-plex-mono' );
}

/**
 * Get custom fonts array.
 *
 * @return array<int, array<string, string>> Array of custom fonts.
 */
function xfact_get_custom_fonts(): array {
	$fonts = get_option( 'xfact_custom_fonts', array() );
	return is_array( $fonts ) ? $fonts : array();
}
