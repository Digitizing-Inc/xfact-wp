<?php
/**
 * Script to seed Yoast SEO data for the xFact WordPress site.
 *
 * @package xFact
 */

$seo_data = array(
	'home'         => array(
		'title' => 'Your Partner Behind Mission-Critical Systems',
		'desc'  => 'xFact partners with public institutions to design, integrate, secure, and sustain mission-critical technology systems.',
	),
	'solutions'    => array(
		'title' => 'Solutions',
		'desc'  => 'xFact supports mission-critical systems across complex public-sector environments.',
	),
	'contact'      => array(
		'title' => 'Contact & Assessments',
		'desc'  => 'Evaluate your systems and identify next steps.',
	),
	'careers'      => array(
		'title' => 'Careers',
		'desc'  => 'Work behind the systems communities rely on.',
	),
	'support'      => array(
		'title' => 'Support',
		'desc'  => 'Access assistance for your systems and services.',
	),
	'privacy'      => array(
		'title' => 'Privacy Policy',
		'desc'  => 'How xFact collects, uses, and protects your information.',
	),
	'terms'        => array(
		'title' => 'Terms of Service',
		'desc'  => 'Terms and conditions governing use of the xFact website.',
	),
	'about'        => array(
		'title' => 'About',
		'desc'  => 'A 25+ year partner behind mission-critical public-sector systems — integrating infrastructure, security, applications, and strategy under one accountable team.',
	),
	'capabilities' => array(
		'title' => 'Capabilities',
		'desc'  => 'Coordinated infrastructure, cybersecurity, applications, data, and strategy — delivered as one integrated capability for public-sector environments.',
	),
	'news'         => array(
		'title' => 'News & Insights',
		'desc'  => 'Field-level perspectives on public-sector technology — covering public safety, government, education, and human services.',
	),
);

foreach ( $seo_data as $slug => $meta ) {
	$args = array(
		'name'        => $slug,
		'post_type'   => 'page',
		'post_status' => 'publish',
		'numberposts' => 1,
	);

	$found_pages = get_posts( $args );

	// Fallbacks if slugs differ slightly.
	if ( empty( $found_pages ) && 'news' === $slug ) {
		$args['name'] = 'news-insights';
		$found_pages  = get_posts( $args );
	}

	if ( ! empty( $found_pages ) ) {
		$page_id = $found_pages[0]->ID;
		update_post_meta( $page_id, '_yoast_wpseo_title', $meta['title'] . ' %%sep%% %%sitename%%' );
		update_post_meta( $page_id, '_yoast_wpseo_metadesc', $meta['desc'] );
		echo '✅ Updated SEO for page: ' . esc_html( $slug ) . ' (ID: ' . esc_html( $page_id ) . ")\n";
	} else {
		echo '⚠️  Page not found for slug: ' . esc_html( $slug ) . "\n";
	}
}
