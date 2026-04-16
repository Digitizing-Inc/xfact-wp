<?php
/**
 * Title: 404 Content
 * Slug: xfact/404-content
 * Categories: text
 * Inserter: no
 * Description: Content for the 404 error page.
 *
 * @package xfact
 */

declare(strict_types=1);
?>

<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|70","bottom":"var:preset|spacing|70"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--70);padding-bottom:var(--wp--preset--spacing--70)">

	<!-- wp:group {"layout":{"type":"default"},"style":{"spacing":{"blockGap":"1rem"}}} -->
	<div class="wp-block-group" style="text-align: center;">

		<!-- wp:paragraph {"style":{"typography":{"fontSize":"6rem","fontWeight":"700","letterSpacing":"-0.025em"}},"textColor":"accent"} -->
		<p class="has-accent-color has-text-color" style="font-size:6rem;font-weight:700;letter-spacing:-0.025em">404</p>
		<!-- /wp:paragraph -->

		<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"2.25rem"}}} -->
		<h1 class="wp-block-heading has-text-align-center" style="font-size:2.25rem"><?php esc_html_e( 'Page not found', 'xfact' ); ?></h1>
		<!-- /wp:heading -->

		<!-- wp:paragraph {"align":"center","textColor":"text-secondary"} -->
		<p class="has-text-align-center has-text-secondary-color has-text-color"><?php esc_html_e( "The page you're looking for doesn't exist or has been moved.", 'xfact' ); ?></p>
		<!-- /wp:paragraph -->

		<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2rem"}}}} -->
		<div class="wp-block-buttons" style="margin-top:2rem">
			<!-- wp:button -->
			<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/"><?php esc_html_e( 'Back to home', 'xfact' ); ?></a></div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->

	</div>
	<!-- /wp:group -->

</div>
<!-- /wp:group -->
