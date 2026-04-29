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

$variant = $attributes['variant'] ?? 'dark';

$is_light = 'light' === $variant;

$classes = array( 'xfact-cta-section', 'xfact-section-lg' );
if ( $is_light ) {
	$classes[] = 'xfact-bg-alt';
	$classes[] = 'xfact-border-top';
} else {
	$classes[] = 'xfact-dark-section';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => implode( ' ', $classes ) )
);
?>
<?php
$bg_image = $attributes['backgroundImage'] ?? '';
$bg_style = $bg_image ? ' style="background-image: url(' . esc_url( $bg_image ) . '); background-size: cover; background-position: center;"' : '';
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?><?php echo $bg_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>>

	<?php if ( ! $is_light && xfact_should_show_floating_logo( $attributes ) ) : ?>
		<div class="xfact-cta-section__accents" aria-hidden="true">
			<div class="xfact-cta-section__top-line"></div>
			<img
				src="<?php echo esc_url( xfact_get_floating_logo_url() ); ?>"
				alt=""
				class="xfact-cta-section__watermark"
			/>
		</div>
	<?php endif; ?>

	<div class="xfact-container">
		<div class="xfact-cta-section__inner xfact-fade-in">
			<h2 class="xfact-cta-section__title <?php echo $is_light ? 'xfact-text' : ''; ?>"><?php echo esc_html( $cta_title ); ?></h2>

			<?php if ( $subtitle ) : ?>
				<p class="xfact-cta-section__subtitle <?php echo $is_light ? 'xfact-text-secondary' : ''; ?>"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<div class="xfact-cta-section__buttons">
				<?php if ( $primary_label ) : ?>
					<a href="<?php echo esc_url( $primary_href ); ?>" class="xfact-gradient-button xfact-btn-lg">
						<?php echo esc_html( $primary_label ); ?>
					</a>
				<?php endif; ?>

				<?php if ( $secondary_label ) : ?>
					<a href="<?php echo esc_url( $secondary_href ); ?>" class="<?php echo $is_light ? 'xfact-btn-secondary' : 'xfact-btn-outline-light'; ?> xfact-btn-lg">
						<?php echo esc_html( $secondary_label ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>

</section>
