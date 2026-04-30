<?php
/**
 * Register Custom Post Types.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register Case Study Custom Post Type.
 */
function xfact_register_post_types(): void {
	$labels = array(
		'name'               => _x( 'Case Studies', 'Post type general name', 'xfact' ),
		'singular_name'      => _x( 'Case Study', 'Post type singular name', 'xfact' ),
		'menu_name'          => _x( 'Case Studies', 'Admin Menu text', 'xfact' ),
		'name_admin_bar'     => _x( 'Case Study', 'Add New on Toolbar', 'xfact' ),
		'add_new'            => __( 'Add New', 'xfact' ),
		'add_new_item'       => __( 'Add New Case Study', 'xfact' ),
		'new_item'           => __( 'New Case Study', 'xfact' ),
		'edit_item'          => __( 'Edit Case Study', 'xfact' ),
		'view_item'          => __( 'View Case Study', 'xfact' ),
		'all_items'          => __( 'All Case Studies', 'xfact' ),
		'search_items'       => __( 'Search Case Studies', 'xfact' ),
		'parent_item_colon'  => __( 'Parent Case Studies:', 'xfact' ),
		'not_found'          => __( 'No case studies found.', 'xfact' ),
		'not_found_in_trash' => __( 'No case studies found in Trash.', 'xfact' ),
	);

	$args = array(
		'labels'             => $labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'case-studies' ),
		'capability_type'    => 'post',
		'has_archive'        => false,
		'hierarchical'       => false,
		'menu_position'      => 20,
		'menu_icon'          => 'dashicons-portfolio',
		'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'custom-fields', 'revisions' ),
		'show_in_rest'       => true, // Essential for Gutenberg.
	);

	register_post_type( 'case_study', $args );
}
add_action( 'init', 'xfact_register_post_types' );
