<?php
/**
 * Block registration for the xFact theme.
 *
 * Auto-registers all blocks that have a block.json file
 * inside the theme's blocks/ directory.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register all custom blocks found in the blocks/ directory.
 */
function xfact_register_blocks(): void {
	$blocks_dir = get_template_directory() . '/blocks';

	if ( ! is_dir( $blocks_dir ) ) {
		return;
	}

	$block_jsons = glob( $blocks_dir . '/*/block.json' );

	if ( empty( $block_jsons ) ) {
		return;
	}

	foreach ( $block_jsons as $block_json ) {
		register_block_type( dirname( $block_json ) );
	}
}
add_action( 'init', 'xfact_register_blocks' );

/**
 * Render xFact hover color for navigation blocks.
 *
 * @param string               $block_content The block content.
 * @param array<string, mixed> $block         The parsed block.
 * @return string Modified block content.
 */
function xfact_render_navigation_hover_color( string $block_content, array $block ): string {
	if ( empty( $block['attrs']['xfactHoverColor'] ) ) {
		return $block_content;
	}

	$color = $block['attrs']['xfactHoverColor'];
	$style = '--xfact-hover-bg: ' . esc_attr( $color ) . ';';

	$tags = new WP_HTML_Tag_Processor( $block_content );
	if ( $tags->next_tag( array( 'tag_name' => 'li' ) ) ) {
		$tags->add_class( 'has-xfact-hover-bg' );
		$existing_style = $tags->get_attribute( 'style' );
		$new_style      = $existing_style ? rtrim( $existing_style, ';' ) . '; ' . $style : $style;
		$tags->set_attribute( 'style', $new_style );
		$block_content = $tags->get_updated_html();
	}

	return $block_content;
}
add_filter( 'render_block_core/navigation-link', 'xfact_render_navigation_hover_color', 10, 2 );
add_filter( 'render_block_core/navigation-submenu', 'xfact_render_navigation_hover_color', 10, 2 );
