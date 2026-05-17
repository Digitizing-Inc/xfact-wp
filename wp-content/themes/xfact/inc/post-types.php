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

	$requested_title = isset( $_REQUEST['post_title'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['post_title'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

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
		'template'           => array(
			array(
				'xfact/hero',
				array(
					'sectionLabel' => 'Case Studies',
					'title'        => $requested_title,
					'subtitle'     => 'Optional subtitle. Select the Case Study Details block below and use the settings sidebar to enter your content.',
					'align'        => 'full',
				),
			),
			array( 'xfact/case-study-details' ),
			array(
				'xfact/cta-section',
				array(
					'align'    => 'full',
					'title'    => 'Ready to strengthen your systems?',
					'subtitle' => 'Schedule an assessment to understand your current environment and identify a path forward.',
					'buttons'  => array(
						array(
							'label'   => 'Contact Us',
							'url'     => '/contact',
							'variant' => 'primary',
						),
					),
				),
			),
		),
	);

	register_post_type( 'case_study', $args );
}
add_action( 'init', 'xfact_register_post_types' );

/**
 * Assign default block templates to core post types.
 */
function xfact_add_page_template(): void {
	$page_object = get_post_type_object( 'page' );
	if ( $page_object ) {
		$requested_title = isset( $_REQUEST['post_title'] ) ? sanitize_text_field( wp_unslash( $_REQUEST['post_title'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		$page_object->template = array(
			array(
				'xfact/hero',
				array(
					'title'    => $requested_title,
					'subtitle' => 'Select this block and use the Block Settings sidebar to configure the title, subtitle, and layout.',
					'align'    => 'full',
				),
			),
			array( 'core/paragraph' ),
		);
	}
}
add_action( 'init', 'xfact_add_page_template', 20 );

/**
 * Force save the requested title to the auto-draft in the database.
 * This ensures that ServerSideRender blocks (like Hero) can read the correct title
 * via the REST API before the user manually saves the draft.
 *
 * @param string  $title The post title.
 * @param WP_Post $post  The post object.
 * @return string The modified or original title.
 */
function xfact_persist_auto_draft_title( string $title, WP_Post $post ): string {
	if ( 'auto-draft' === $post->post_status && isset( $_REQUEST['post_title'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$requested_title = sanitize_text_field( wp_unslash( $_REQUEST['post_title'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( $requested_title ) {
			// Unhook to prevent infinite loops during wp_update_post.
			remove_filter( 'default_title', 'xfact_persist_auto_draft_title', 10 );
			wp_update_post(
				array(
					'ID'         => $post->ID,
					'post_title' => $requested_title,
				)
			);
			add_filter( 'default_title', 'xfact_persist_auto_draft_title', 10, 2 );
			return $requested_title;
		}
	}
	return $title;
}
add_filter( 'default_title', 'xfact_persist_auto_draft_title', 10, 2 );
