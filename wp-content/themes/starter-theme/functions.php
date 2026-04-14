<?php
/**
 * Starter Theme functions and definitions.
 *
 * @package starter-theme
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup — register support for WordPress features.
 */
function starter_theme_setup(): void {
	// Add support for block styles.
	add_theme_support( 'wp-block-styles' );

	// Enqueue editor styles to match the frontend.
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'starter_theme_setup' );

/**
 * Enqueue theme styles.
 *
 * Block themes handle most styling via theme.json. This enqueue is
 * only for additional custom CSS beyond what theme.json supports.
 */
function starter_theme_enqueue_styles(): void {
	wp_enqueue_style(
		'starter-theme-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);

	wp_enqueue_style(
		'starter-theme-dark-mode',
		get_theme_file_uri( 'assets/css/dark-mode.css' ),
		array( 'starter-theme-style' ),
		wp_get_theme()->get( 'Version' )
	);

	// Load in header (not footer) to prevent flash of unstyled content.
	wp_enqueue_script(
		'starter-theme-dark-mode',
		get_theme_file_uri( 'assets/js/dark-mode.js' ),
		array(),
		wp_get_theme()->get( 'Version' ),
		false
	);
}
add_action( 'wp_enqueue_scripts', 'starter_theme_enqueue_styles' );
