<?php
/**
 * Asset enqueueing for the xFact theme.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue frontend styles and scripts.
 */
function xfact_enqueue_assets(): void {
	$theme_version = wp_get_theme()->get( 'Version' );

	/* Main theme stylesheet (contains only the WP header) */
	wp_enqueue_style(
		'xfact-style',
		get_stylesheet_uri(),
		array(),
		$theme_version
	);

	/* Global custom styles — animations, utilities, buttons */
	wp_enqueue_style(
		'xfact-global',
		get_theme_file_uri( 'assets/css/global.css' ),
		array(),
		$theme_version
	);

	/* Template parts styles */
	wp_enqueue_style(
		'xfact-header',
		get_theme_file_uri( 'assets/css/parts/header.css' ),
		array( 'xfact-global' ),
		$theme_version
	);

	wp_enqueue_style(
		'xfact-footer',
		get_theme_file_uri( 'assets/css/parts/footer.css' ),
		array( 'xfact-global' ),
		$theme_version
	);

	/* Button styles (used by core/button and custom blocks like cta-section). */
	wp_enqueue_style(
		'xfact-core-button',
		get_theme_file_uri( 'assets/css/blocks/core-button.css' ),
		array( 'xfact-global' ),
		$theme_version
	);

	/* Dark mode overrides. */
	wp_enqueue_style(
		'xfact-dark-mode',
		get_theme_file_uri( 'assets/css/dark-mode.css' ),
		array( 'xfact-global' ),
		$theme_version
	);

	/*
	 * Dark mode toggle — loaded in <head> (not footer) to prevent
	 * flash of wrong theme. The `false` arg = load in header.
	 */
	wp_enqueue_script(
		'xfact-dark-mode',
		get_theme_file_uri( 'assets/js/dark-mode.js' ),
		array(),
		$theme_version,
		false
	);

	$theme_mode        = get_option( 'xfact_theme_mode', 'light' );
	$disable_dark_mode = (bool) get_option( 'xfact_disable_dark_mode', false );
	wp_add_inline_script(
		'xfact-dark-mode',
		'window.xfactThemeConfig = ' . wp_json_encode(
			array(
				'themeMode'       => $theme_mode,
				'disableDarkMode' => $disable_dark_mode,
			)
		) . ';',
		'before'
	);

	/* Scroll fade-in — safe to defer to footer. */
	wp_enqueue_script(
		'xfact-fade-in',
		get_theme_file_uri( 'assets/js/fade-in.js' ),
		array(),
		$theme_version,
		true
	);

	/* Hero slideshow — loads in footer. */
	wp_enqueue_script(
		'xfact-hero-slideshow',
		get_theme_file_uri( 'assets/js/hero-slideshow.js' ),
		array(),
		$theme_version,
		true
	);

	/* Header scroll — transparent → opaque on scroll. */
	wp_enqueue_script(
		'xfact-header-scroll',
		get_theme_file_uri( 'assets/js/header-scroll.js' ),
		array(),
		$theme_version,
		true
	);

	/* Mobile menu toggle. */
	wp_enqueue_script(
		'xfact-mobile-menu',
		get_theme_file_uri( 'assets/js/mobile-menu.js' ),
		array(),
		$theme_version,
		true
	);

	/* Live preview receiver (only for admins or preview mode) */
	if ( isset( $_GET['xfact_preview'] ) || current_user_can( 'manage_options' ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		wp_enqueue_script(
			'xfact-preview-receiver',
			get_theme_file_uri( 'assets/js/preview-receiver.js' ),
			array(),
			$theme_version,
			false
		);
	}
}
add_action( 'wp_enqueue_scripts', 'xfact_enqueue_assets' );

if ( isset( $_GET['xfact_preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	add_filter( 'show_admin_bar', '__return_false' );
}



/**
 * Register shared editor helpers script early so blocks can declare
 * it as a dependency in their index.asset.php manifests.
 *
 * Must run BEFORE xfact_register_blocks() (priority 5 vs default 10).
 */
function xfact_register_editor_helpers(): void {
	$theme_version = wp_get_theme()->get( 'Version' );

	wp_register_script(
		'xfact-editor-helpers',
		get_theme_file_uri( 'assets/js/editor-helpers.js' ),
		array( 'wp-blocks', 'wp-element', 'wp-block-editor', 'wp-components', 'wp-server-side-render' ),
		(string) filemtime( get_theme_file_path( 'assets/js/editor-helpers.js' ) ),
		true
	);

	wp_add_inline_script(
		'xfact-editor-helpers',
		'window.xfactLucideIcons = ' . wp_json_encode( xfact_get_all_icons() ) . ';',
		'before'
	);
}
add_action( 'init', 'xfact_register_editor_helpers', 5 );

/**
 * Enqueue the shared editor helpers script in the block editor.
 */
function xfact_enqueue_editor_assets(): void {
	$theme_version = wp_get_theme()->get( 'Version' );

	wp_enqueue_script( 'xfact-editor-helpers' );

	wp_enqueue_style(
		'xfact-core-button-editor',
		get_theme_file_uri( 'assets/css/blocks/core-button.css' ),
		array(),
		$theme_version
	);

	/* Settings sidebar — global theme options panel in the Editor. */
	wp_enqueue_script(
		'xfact-editor-settings-sidebar',
		get_theme_file_uri( 'assets/js/editor-settings-sidebar.js' ),
		array( 'wp-plugins', 'wp-editor', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-api-fetch' ),
		$theme_version,
		true
	);
	wp_localize_script(
		'xfact-editor-settings-sidebar',
		'xfactSettingsConfig',
		array(
			'currentLogoUrl'   => get_option( 'xfact_floating_logo_url', '' ),
			'defaultLogoUrl'   => get_theme_file_uri( 'assets/images/brand/xfact-logomark.png' ),
			'showFloatingLogo' => (bool) get_option( 'xfact_show_floating_logo', false ),
			'editorDarkMode'   => (bool) get_option( 'xfact_editor_dark_mode', false ),
			'editHeaderUrl'    => admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Fheader&canvas=edit' ),
			'editFooterUrl'    => admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Ffooter&canvas=edit' ),
		)
	);
}
add_action( 'enqueue_block_editor_assets', 'xfact_enqueue_editor_assets' );
