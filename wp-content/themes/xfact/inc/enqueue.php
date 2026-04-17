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
		array( 'xfact-style' ),
		$theme_version
	);

	/* Dark mode overrides */
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

	/* Scroll fade-in — safe to defer to footer */
	wp_enqueue_script(
		'xfact-fade-in',
		get_theme_file_uri( 'assets/js/fade-in.js' ),
		array(),
		$theme_version,
		true
	);

	/* Hero slideshow — loads in footer */
	wp_enqueue_script(
		'xfact-hero-slideshow',
		get_theme_file_uri( 'assets/js/hero-slideshow.js' ),
		array(),
		$theme_version,
		true
	);

	/* Header scroll — transparent → opaque on scroll */
	wp_enqueue_script(
		'xfact-header-scroll',
		get_theme_file_uri( 'assets/js/header-scroll.js' ),
		array(),
		$theme_version,
		true
	);

	/* Mobile menu toggle */
	wp_enqueue_script(
		'xfact-mobile-menu',
		get_theme_file_uri( 'assets/js/mobile-menu.js' ),
		array(),
		$theme_version,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'xfact_enqueue_assets' );

/**
 * Output the branded SVG favicon, replacing WP's default site-icon output.
 *
 * Modern browsers support SVG favicons via <link rel="icon" type="image/svg+xml">.
 * The SVG lives in assets/images/favicon.svg (dark-blue rounded rect + white mark)
 * and matches the source site's src/app/icon.svg exactly.
 */
function xfact_favicon(): void {
	$icon_url = get_theme_file_uri( 'assets/images/favicon.svg' );
	echo '<link rel="icon" type="image/svg+xml" href="' . esc_url( $icon_url ) . '">' . "\n";
}
add_action( 'wp_head', 'xfact_favicon', 1 );

/**
 * Remove WordPress's default site-icon meta so it doesn't conflict
 * with our SVG favicon.
 */
remove_action( 'wp_head', 'wp_site_icon', 99 );

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
		$theme_version,
		true
	);
}
add_action( 'init', 'xfact_register_editor_helpers', 5 );

/**
 * Enqueue the shared editor helpers script in the block editor.
 */
function xfact_enqueue_editor_assets(): void {
	wp_enqueue_script( 'xfact-editor-helpers' );
}
add_action( 'enqueue_block_editor_assets', 'xfact_enqueue_editor_assets' );
