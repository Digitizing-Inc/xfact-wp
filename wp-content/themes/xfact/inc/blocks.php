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
