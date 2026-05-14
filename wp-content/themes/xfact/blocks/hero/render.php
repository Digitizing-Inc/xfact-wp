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

$hero_variant = $attributes['heroVariant'] ?? 'standard';

if ( 'media' === $hero_variant || 'front-page' === $hero_variant ) {
	$hero_title   = $attributes['title'] ?? '';
	$subtitle     = $attributes['subtitle'] ?? '';
	$buttons      = $attributes['buttons'] ?? array();
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
			'/\*(.*?)\*/',
			'<span class="xfact-hero__accent">$1</span>',
			$hero_title
		)
	);

	$wrapper_attributes = get_block_wrapper_attributes(
		array( 'class' => 'xfact-hero xfact-dark-section' )
	);
	?>

	<section <?php echo wp_kses_post( $wrapper_attributes ); ?> data-xfact-slideshow>

		<?php
		foreach ( $slides as $index => $slide ) :
			$slide_url = $slide['src'] ?? ( $slide['url'] ?? '' );
			?>
			<img
				class="xfact-hero-slide xfact-hero__bg-image"
				src="<?php echo esc_url( $slide_url ); ?>"
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
					<?php if ( ! empty( $buttons ) ) : ?>
						<div class="xfact-hero__cta">
							<?php
							foreach ( $buttons as $btn ) :
								$btn_label   = $btn['label'] ?? '';
								$btn_url     = $btn['url'] ?? '';
								$btn_variant = $btn['variant'] ?? 'primary';

								$link_class = 'xfact-btn-link';
								if ( 'primary' === $btn_variant ) {
									$link_class = 'xfact-btn-primary xfact-btn-lg';
								} elseif ( 'secondary' === $btn_variant ) {
									$link_class = 'xfact-btn-secondary xfact-btn-lg'; }

								if ( $btn_label ) :
									?>
								<a href="<?php echo esc_url( $btn_url ); ?>" class="<?php echo esc_attr( $link_class ); ?>">
									<?php echo esc_html( $btn_label ); ?>
								</a>
									<?php
								endif;
							endforeach;
							?>
						</div>
					<?php endif; ?>
				</div>

				<?php if ( xfact_should_show_floating_logo() ) : ?>
					<div class="xfact-hero__icon" aria-hidden="true">
						<img
							src="<?php echo esc_url( xfact_get_floating_logo_url() ); ?>"
							alt=""
							class="xfact-icon-float"
						/>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<div class="xfact-hero__scroll-indicator" aria-hidden="true">
			<svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
			</svg>
		</div>

	</section>
	<?php
} else {
	// Inner page variant.
	$section_label           = $attributes['sectionLabel'] ?? '';
	$use_breadcrumbs         = ! empty( $attributes['useBreadcrumbs'] );
	$breadcrumb_parent_label = $attributes['breadcrumbParentLabel'] ?? 'Solutions';
	$breadcrumb_parent_href  = $attributes['breadcrumbParentHref'] ?? '/solutions';
	$badge_text              = $attributes['badgeText'] ?? '';
	$heading                 = $attributes['title'] ?? '';
	$subtitle                = $attributes['subtitle'] ?? '';
	$background_image        = $attributes['backgroundImage'] ?? '';
	$image_alt               = $attributes['imageAlt'] ?? '';
	$body_text               = $attributes['bodyText'] ?? '';

	$focal_points = array(
		'hero-careers.jpg'   => 'center 30%',
		'hero-support.jpg'   => '70% 30%',
		'hero-solutions.jpg' => '65% 30%',
		'hero-contact.jpg'   => 'center 35%',
	);

	$filename    = basename( $background_image );
	$focal_point = $focal_points[ $filename ] ?? 'center';

	$wrapper_attributes = get_block_wrapper_attributes(
		array( 'class' => 'xfact-page-hero xfact-fade-in' )
	);
	?>

	<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>

		<?php if ( $background_image ) : ?>
			<img
				class="xfact-page-hero__bg xfact-ken-burns"
				src="<?php echo esc_url( $background_image ); ?>"
				alt="<?php echo esc_attr( $image_alt ); ?>"
				style="object-position: <?php echo esc_attr( $focal_point ); ?>;"
				fetchpriority="high"
			/>
		<?php endif; ?>

		<div class="xfact-page-hero__overlay" aria-hidden="true"></div>
		<div class="xfact-page-hero__text-gradient" aria-hidden="true"></div>

		<div class="xfact-page-hero__content xfact-container">
			<div class="xfact-page-hero__text">
				<?php if ( $use_breadcrumbs ) : ?>
					<nav aria-label="Breadcrumb" class="xfact-breadcrumb">
						<ol>
							<?php if ( $breadcrumb_parent_label && $breadcrumb_parent_href ) : ?>
								<li>
									<a href="<?php echo esc_url( home_url( $breadcrumb_parent_href ) ); ?>"><?php echo esc_html( $breadcrumb_parent_label ); ?></a>
								</li>
								<li aria-hidden="true" class="xfact-breadcrumb-separator">/</li>
							<?php endif; ?>
							<li aria-current="page"><?php echo esc_html( get_the_title() ); ?></li>
						</ol>
					</nav>
				<?php elseif ( $section_label ) : ?>
					<span class="xfact-section-label"><?php echo esc_html( $section_label ); ?></span>
				<?php endif; ?>

				<?php if ( $badge_text ) : ?>
					<span class="xfact-hero-badge"><?php echo esc_html( $badge_text ); ?></span>
				<?php endif; ?>
				<?php
				if ( $heading ) :
					$rendered_heading = wp_kses_post( preg_replace( '/\*(.*?)\*/', '<span class="xfact-hero__accent">$1</span>', $heading ) );
					?>
					<h1 class="xfact-page-hero__heading"><?php echo wp_kses_post( $rendered_heading ); ?></h1>
				<?php endif; ?>
				<?php if ( $subtitle ) : ?>
					<p class="xfact-page-hero__subtitle"><?php echo esc_html( $subtitle ); ?></p>
				<?php endif; ?>
				<?php if ( $body_text ) : ?>
					<p class="xfact-page-hero__body"><?php echo esc_html( $body_text ); ?></p>
				<?php endif; ?>
			</div>
		</div>

	</section>
	<?php
}
