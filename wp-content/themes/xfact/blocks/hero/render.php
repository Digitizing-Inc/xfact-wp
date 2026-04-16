<?php
/**
 * Hero block — server-side render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 * @var string   $content    Block inner content (unused — dynamic block).
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

$hero_title   = $attributes['title'] ?? '';
$subtitle     = $attributes['subtitle'] ?? '';
$cta_label    = $attributes['ctaLabel'] ?? '';
$cta_href     = $attributes['ctaHref'] ?? '/contact';
$video_url    = $attributes['videoUrl'] ?? '';
$poster_image = $attributes['posterImage'] ?? '';
$slides       = $attributes['slides'] ?? array();

/* Fallback slides if none configured */
if ( empty( $slides ) ) {
	$slides = array(
		array(
			'src'      => esc_url( get_theme_file_uri( 'assets/images/hero-solutions.jpg' ) ),
			'alt'      => esc_attr__( 'Healthcare workers collaborating', 'xfact' ),
			'position' => '65% 30%',
		),
		array(
			'src'      => esc_url( get_theme_file_uri( 'assets/images/hero-contact.jpg' ) ),
			'alt'      => esc_attr__( 'Students using technology', 'xfact' ),
			'position' => 'center 35%',
		),
		array(
			'src'      => esc_url( get_theme_file_uri( 'assets/images/hero-careers.jpg' ) ),
			'alt'      => esc_attr__( 'Volunteers working together', 'xfact' ),
			'position' => 'center 30%',
		),
		array(
			'src'      => esc_url( get_theme_file_uri( 'assets/images/hero-support.jpg' ) ),
			'alt'      => esc_attr__( 'Police officer on duty', 'xfact' ),
			'position' => '70% 30%',
		),
	);
}

/* Fallback video */
if ( empty( $video_url ) ) {
	$video_url = get_theme_file_uri( 'assets/images/xfact-hero.mp4' );
}
if ( empty( $poster_image ) ) {
	$poster_image = get_theme_file_uri( 'assets/images/xfact-hero-poster.png' );
}

/* Process title accent tags — preg_replace first, THEN kses (span is allowed). */
$rendered_title = wp_kses_post(
	preg_replace(
		'/<accent>(.*?)<\/accent>/',
		'<span class="xfact-hero__accent">$1</span>',
		$hero_title
	)
);

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-hero' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?> data-xfact-slideshow>

	<?php foreach ( $slides as $index => $slide ) : ?>
		<img
			class="xfact-hero-slide xfact-hero__bg-image"
			src="<?php echo esc_url( $slide['src'] ); ?>"
			alt="<?php echo esc_attr( $slide['alt'] ?? '' ); ?>"
			style="object-position: <?php echo esc_attr( $slide['position'] ?? 'center' ); ?>; opacity: <?php echo 0 === $index ? '1' : '0'; ?>;"
			<?php echo 0 === $index ? 'fetchpriority="high"' : 'loading="lazy"'; ?>
		/>
	<?php endforeach; ?>

	<video
		class="xfact-hero__video"
		autoplay muted loop playsinline
		poster="<?php echo esc_url( $poster_image ); ?>"
		aria-hidden="true"
	>
		<source src="<?php echo esc_url( $video_url ); ?>" type="video/mp4" />
	</video>

	<div class="xfact-hero__overlay" aria-hidden="true"></div>
	<div class="xfact-hero__text-gradient" aria-hidden="true"></div>

	<div class="xfact-hero__content xfact-container">
		<div class="xfact-hero__layout">
			<div class="xfact-hero__text">
				<h1 class="xfact-hero__title"><?php echo wp_kses_post( $rendered_title ); ?></h1>
				<p class="xfact-hero__subtitle"><?php echo esc_html( $subtitle ); ?></p>
				<?php if ( $cta_label ) : ?>
					<div class="xfact-hero__cta">
						<a href="<?php echo esc_url( $cta_href ); ?>" class="xfact-gradient-button xfact-btn-lg">
							<?php echo esc_html( $cta_label ); ?>
						</a>
					</div>
				<?php endif; ?>
			</div>

			<div class="xfact-hero__icon" aria-hidden="true">
				<svg viewBox="0 0 354 351" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="xfact-icon-float">
					<path d="M312.76 63.0249L237.37 138.919C257.341 158.76 299.596 199.681 309.764 212.333C322.475 228.147 313.494 251.375 297.606 264.026C281.717 276.678 254.574 276.678 241.863 264.026C229.153 251.375 94.2357 112.209 84.7028 105.883C78.8848 101.192 74.3914 108.633 77.1037 111.637L169.968 208.364C156.488 221.261 126.532 251.024 65.621 312.037C114.55 352.712 224.389 383.466 313.259 287.235C386.287 208.158 345.212 96.2595 312.76 63.0249Z" />
					<path d="M46.5708 55.2778C-29.6929 128.656 2.15512 246.14 40.1578 286.739L118.543 206.38C102.655 190.566 66.8937 156.631 51.6409 138.919C32.575 116.779 40.2155 99.5578 52.9269 83.7435C65.6383 67.9292 91.0589 67.9292 110.125 83.7435C129.191 99.5578 259.475 229.235 269.008 238.723C274.815 244.504 279.309 239.43 279.309 234.159L184.947 139.415C205.416 117.589 255.344 69.4734 285.799 38.2229C257.201 6.59435 141.901 -36.445 46.5708 55.2778Z" />
				</svg>
			</div>
		</div>
	</div>

	<div class="xfact-hero__scroll-indicator" aria-hidden="true">
		<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
		</svg>
	</div>

</section>
