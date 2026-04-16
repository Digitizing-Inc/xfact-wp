<?php
/**
 * Page Hero block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 * @var string   $content    Inner content.
 * @var WP_Block $block      Block instance.
 */

declare(strict_types=1);

$heading          = $attributes['heading'] ?? '';
$subtitle         = $attributes['subtitle'] ?? '';
$background_image = $attributes['backgroundImage'] ?? '';
$image_alt        = $attributes['imageAlt'] ?? '';

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
			<?php if ( $heading ) : ?>
				<h1 class="xfact-page-hero__heading"><?php echo esc_html( $heading ); ?></h1>
			<?php endif; ?>
			<?php if ( $subtitle ) : ?>
				<p class="xfact-page-hero__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>
		</div>
	</div>

</section>
