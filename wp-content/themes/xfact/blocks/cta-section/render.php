<?php
/**
 * CTA Section block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$cta_title       = $attributes['title'] ?? '';
$subtitle        = $attributes['subtitle'] ?? '';
$primary_label   = $attributes['primaryLabel'] ?? '';
$primary_href    = $attributes['primaryHref'] ?? '/contact';
$secondary_label = $attributes['secondaryLabel'] ?? '';
$secondary_href  = $attributes['secondaryHref'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-cta-section xfact-dark-section xfact-section-lg' )
);
?>
<?php
$bg_image = $attributes['backgroundImage'] ?? '';
$bg_style = $bg_image ? ' style="background-image: url(' . esc_url( $bg_image ) . '); background-size: cover; background-position: center;"' : '';
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?><?php echo $bg_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>>

	<?php if ( $attributes['showXLogo'] ?? true ) : ?>
		<div class="xfact-cta-section__accents" aria-hidden="true">
			<div class="xfact-cta-section__top-line"></div>
			<svg class="xfact-cta-section__watermark" viewBox="0 0 354 351" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
				<path d="M312.76 63.0249L237.37 138.919C257.341 158.76 299.596 199.681 309.764 212.333C322.475 228.147 313.494 251.375 297.606 264.026C281.717 276.678 254.574 276.678 241.863 264.026C229.153 251.375 94.2357 112.209 84.7028 105.883C78.8848 101.192 74.3914 108.633 77.1037 111.637L169.968 208.364C156.488 221.261 126.532 251.024 65.621 312.037C114.55 352.712 224.389 383.466 313.259 287.235C386.287 208.158 345.212 96.2595 312.76 63.0249Z" />
				<path d="M46.5708 55.2778C-29.6929 128.656 2.15512 246.14 40.1578 286.739L118.543 206.38C102.655 190.566 66.8937 156.631 51.6409 138.919C32.575 116.779 40.2155 99.5578 52.9269 83.7435C65.6383 67.9292 91.0589 67.9292 110.125 83.7435C129.191 99.5578 259.475 229.235 269.008 238.723C274.815 244.504 279.309 239.43 279.309 234.159L184.947 139.415C205.416 117.589 255.344 69.4734 285.799 38.2229C257.201 6.59435 141.901 -36.445 46.5708 55.2778Z" />
			</svg>
		</div>
	<?php endif; ?>

	<div class="xfact-container">
		<div class="xfact-cta-section__inner xfact-fade-in">
			<h2 class="xfact-cta-section__title"><?php echo esc_html( $cta_title ); ?></h2>

			<?php if ( $subtitle ) : ?>
				<p class="xfact-cta-section__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<div class="xfact-cta-section__buttons">
				<?php if ( $primary_label ) : ?>
					<a href="<?php echo esc_url( $primary_href ); ?>" class="xfact-gradient-button xfact-btn-lg">
						<?php echo esc_html( $primary_label ); ?>
					</a>
				<?php endif; ?>

				<?php if ( $secondary_label ) : ?>
					<a href="<?php echo esc_url( $secondary_href ); ?>" class="xfact-btn-outline-light xfact-btn-lg">
						<?php echo esc_html( $secondary_label ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>

</section>
