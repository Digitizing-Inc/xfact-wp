<?php
/**
 * XFact theme functions and definitions.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Theme setup — register support for WordPress features.
 */
function xfact_setup(): void {
	/* Block themes handle most features via theme.json, but these are still useful: */
	add_theme_support( 'wp-block-styles' );

	/* Enqueue editor styles to match the frontend. */
	add_editor_style( 'style.css' );
	add_editor_style( 'assets/css/global.css' );
	add_editor_style( 'assets/css/dark-mode.css' );
}
add_action( 'after_setup_theme', 'xfact_setup' );

/*
 * Load modular includes.
 */
require_once get_template_directory() . '/inc/enqueue.php';
require_once get_template_directory() . '/inc/icons.php';
require_once get_template_directory() . '/inc/images.php';
require_once get_template_directory() . '/inc/blocks.php';
require_once get_template_directory() . '/inc/template-parts.php';
require_once get_template_directory() . '/inc/settings.php';
