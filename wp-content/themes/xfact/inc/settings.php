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
	return get_theme_file_uri( 'assets/images/xfact-icon.svg' );
}

/**
 * Determine whether a block should display the floating logo.
 *
 * Resolution order:
 *   1. Per-block override ('show' or 'hide') takes precedence.
 *   2. Otherwise ('global' or empty) falls back to the global option.
 *
 * @param array<string, mixed> $attributes Block attributes containing 'showFloatingLogo'.
 * @return bool Whether to render the floating logo.
 */
function xfact_should_show_floating_logo( array $attributes ): bool {
	$value = $attributes['showFloatingLogo'] ?? 'global';

	if ( 'show' === $value ) {
		return true;
	}
	if ( 'hide' === $value ) {
		return false;
	}

	/* 'global' or any unrecognised value → fall back to global option. */
	return (bool) get_option( 'xfact_show_floating_logo', false );
}
