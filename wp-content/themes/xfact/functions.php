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
	add_theme_support( 'editor-styles' );

	/* Enqueue editor styles to match the frontend. */
	add_editor_style( 'style.css' );
	add_editor_style( 'assets/css/global.css' );
	add_editor_style( 'assets/css/parts/header.css' );
	add_editor_style( 'assets/css/parts/footer.css' );
	add_editor_style( 'assets/css/blocks/core-button.css' );
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
require_once get_template_directory() . '/inc/admin-settings-page.php';
require_once get_template_directory() . '/inc/dynamic-styles.php';

/**
 * Show a prominent warning on the Theme/Plugin File Editor pages.
 */
function xfact_theme_editor_warning(): void {
	$screen = get_current_screen();
	if ( ! $screen || ! in_array( $screen->id, array( 'theme-editor', 'plugin-editor' ), true ) ) {
		return;
	}

	echo '<div class="notice notice-error" style="border-left-color:#dc3545;background:#fff5f5;padding:12px 16px;margin:15px 0;">';
	echo '<p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#dc3545;">⚠️ Danger Zone — Direct File Editing</p>';
	echo '<p style="margin:0;color:#4a5568;">Editing theme files directly is <strong>strongly discouraged</strong>. ';
	echo 'This theme uses custom Gutenberg blocks, template parts, and PHP rendering logic that are tightly coupled. ';
	echo 'A misplaced character can <strong>break the entire site layout, blocks, or admin panel</strong>. ';
	echo 'Use the <a href="' . esc_url( admin_url( 'site-editor.php' ) ) . '">Site Editor</a> or ';
	echo '<a href="' . esc_url( admin_url( 'themes.php?page=xfact-settings' ) ) . '">xFact Settings</a> instead.</p>';
	echo '</div>';
}
add_action( 'admin_notices', 'xfact_theme_editor_warning' );

/**
 * Add body classes based on page content.
 *
 * @param array<string> $classes Classes for the body element.
 * @return array<string> Modified body classes.
 */
function xfact_body_classes( array $classes ): array {
	if ( is_singular() ) {
		$post = get_post();
		if ( $post && ( has_block( 'xfact/hero', $post ) || has_block( 'xfact/page-hero', $post ) ) ) {
			// Check if it's the very first block.
			$blocks = parse_blocks( $post->post_content );
			if ( ! empty( $blocks[0]['blockName'] ) && in_array( $blocks[0]['blockName'], array( 'xfact/hero', 'xfact/page-hero' ), true ) ) {
				$classes[] = 'has-hero-header';
			}
		}
	}
	return $classes;
}
add_filter( 'body_class', 'xfact_body_classes' );
