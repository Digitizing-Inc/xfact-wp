<?php
/**
 * Plugin Name:  Starter MU-Plugin
 * Description:  Security hardening, performance tweaks, and housekeeping. Always active as a must-use plugin.
 * Version:      1.0.0
 * Author:       seyLu
 * License:      GPL-2.0-or-later
 *
 * @package starter-mu-plugin
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ============================================================
// SECURITY HARDENING
// ============================================================

/**
 * Disable XML-RPC entirely.
 *
 * XML-RPC is a legacy API that is frequently targeted by brute-force
 * attacks. Modern WordPress uses the REST API instead.
 */
add_filter( 'xmlrpc_enabled', '__return_false' );

/**
 * Remove the XML-RPC discovery link from the HTML head.
 */
remove_action( 'wp_head', 'rsd_link' );

/**
 * Remove the Windows Live Writer manifest link.
 */
remove_action( 'wp_head', 'wlwmanifest_link' );

/**
 * Hide the WordPress version from the frontend HTML.
 *
 * Exposing the exact version helps attackers target known vulnerabilities.
 */
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );

/**
 * Remove WordPress version from RSS feeds.
 */
add_filter(
	'the_generator',
	static function (): string {
		return '';
	}
);

/**
 * Disable REST API user enumeration for unauthenticated requests.
 *
 * Prevents attackers from discovering valid usernames via /wp-json/wp/v2/users.
 *
 * @param array<string, mixed> $endpoints The registered REST API endpoints.
 * @return array<string, mixed> Modified endpoints.
 */
add_filter(
	'rest_endpoints',
	static function ( array $endpoints ): array {
		if ( ! is_user_logged_in() ) {
			unset( $endpoints['/wp/v2/users'] );
			unset( $endpoints['/wp/v2/users/(?P<id>[\\d]+)'] );
		}
		return $endpoints;
	}
);

/**
 * Add security headers via PHP (in case Nginx is bypassed or not used).
 */
add_action(
	'send_headers',
	static function (): void {
		if ( ! is_admin() ) {
			header( 'X-Content-Type-Options: nosniff' );
			header( 'X-Frame-Options: SAMEORIGIN' );
			header( 'Referrer-Policy: strict-origin-when-cross-origin' );
		}
	}
);

// ============================================================
// PERFORMANCE OPTIMIZATIONS
// ============================================================

/**
 * Remove emoji scripts and styles.
 *
 * WordPress loads emoji rendering scripts on every page by default.
 * Unless you specifically need the emoji renderer, removing it
 * saves ~50KB of assets per page load.
 */
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );
remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
remove_action( 'admin_print_styles', 'print_emoji_styles' );

/**
 * Remove emoji DNS prefetch.
 *
 * @param array<int, string> $urls          Array of URLs to print for resource hints.
 * @param string             $relation_type The relation type the URLs are printed for.
 * @return array<int, string> Modified URLs array.
 */
add_filter(
	'wp_resource_hints',
	static function ( array $urls, string $relation_type ): array {
		if ( 'dns-prefetch' === $relation_type ) {
			$urls = array_filter(
				$urls,
				static function ( string $url ): bool {
					return ! str_contains( $url, 'svgcdn' ) && ! str_contains( $url, 's.w.org' );
				}
			);
		}
		return $urls;
	},
	10,
	2
);

/**
 * Disable oEmbed auto-discovery on the frontend.
 *
 * Reduces HTTP requests and prevents external sites from auto-embedding
 * your content. Does not affect the editor's embed blocks.
 */
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'wp_head', 'wp_oembed_add_host_js' );

/**
 * Remove the REST API link from the HTML head.
 *
 * The API is still accessible; this just removes the discovery link.
 */
remove_action( 'wp_head', 'rest_output_link_wp_head' );

/**
 * Remove the shortlink meta tag.
 */
remove_action( 'wp_head', 'wp_shortlink_wp_head' );

/**
 * Remove adjacent post rel links.
 */
remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );

/**
 * Limit post revisions to a sane default.
 *
 * This can also be set via WP_POST_REVISIONS constant.
 * The mu-plugin default serves as a fallback.
 */
if ( ! defined( 'WP_POST_REVISIONS' ) ) {
	define( 'WP_POST_REVISIONS', 5 );
}

// ============================================================
// HOUSEKEEPING
// ============================================================

/**
 * Set default image quality.
 *
 * WordPress defaults to 82. Increasing to 90 provides noticeably
 * better quality with a small filesize increase.
 */
add_filter( 'wp_editor_set_quality', static fn(): int => 90 );

/**
 * Disable WordPress auto-updates in Docker environments.
 *
 * Updates are managed by rebuilding the Docker image with a new
 * WordPress version. Auto-updates inside a container would be lost
 * on restart and can cause state inconsistency.
 */
if ( getenv( 'WORDPRESS_DB_HOST' ) ) {
	add_filter( 'automatic_updater_disabled', '__return_true' );
	add_filter( 'auto_update_plugin', '__return_false' );
	add_filter( 'auto_update_theme', '__return_false' );
	add_filter( 'auto_update_core', '__return_false' );
}
