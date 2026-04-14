<?php
/**
 * Title: Hero Section
 * Slug: starter-theme/hero
 * Categories: featured
 * Keywords: hero, banner, header, cta
 * Description: A full-width hero section with heading, description, and call-to-action buttons.
 *
 * @package starter-theme
 */

?>

<!-- wp:cover {"overlayColor":"primary","isUserOverlayColor":true,"minHeight":500,"align":"full","layout":{"type":"constrained"}} -->
<div class="wp-block-cover alignfull" style="min-height:500px">
	<span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim-100 has-background-dim"></span>
	<div class="wp-block-cover__inner-container">

		<!-- wp:heading {"textAlign":"center","level":1,"style":{"typography":{"fontSize":"clamp(2rem, 5vw, 3.5rem)"}},"textColor":"surface"} -->
		<h1 class="wp-block-heading has-text-align-center has-surface-color has-text-color" style="font-size:clamp(2rem, 5vw, 3.5rem)">Welcome to Your Site</h1>
		<!-- /wp:heading -->

		<!-- wp:paragraph {"align":"center","textColor":"surface","style":{"typography":{"fontSize":"1.2rem"},"spacing":{"margin":{"top":"var:preset|spacing|20","bottom":"var:preset|spacing|40"}}}} -->
		<p class="has-text-align-center has-surface-color has-text-color" style="font-size:1.2rem;margin-top:var(--wp--preset--spacing--20);margin-bottom:var(--wp--preset--spacing--40)">A modern WordPress template built with best practices. Customize everything through the Site Editor.</p>
		<!-- /wp:paragraph -->

		<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"blockGap":"var:preset|spacing|20"}}} -->
		<div class="wp-block-buttons">
			<!-- wp:button {"backgroundColor":"surface","textColor":"primary","style":{"border":{"radius":"var:preset|border-radius|medium"}}} -->
			<div class="wp-block-button"><a class="wp-block-button__link has-primary-color has-surface-background-color has-text-color has-background" style="border-radius:var(--wp--preset--border-radius--medium)">Get Started</a></div>
			<!-- /wp:button -->

			<!-- wp:button {"className":"is-style-outline","style":{"border":{"radius":"var:preset|border-radius|medium"},"elements":{"link":{"color":{"text":"var:preset|color|surface"}}}},"textColor":"surface"} -->
			<div class="wp-block-button is-style-outline"><a class="wp-block-button__link has-surface-color has-text-color has-link-color" style="border-radius:var(--wp--preset--border-radius--medium)">Learn More</a></div>
			<!-- /wp:button -->
		</div>
		<!-- /wp:buttons -->

	</div>
</div>
<!-- /wp:cover -->
