<?php
/**
 * CTA Section block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$cta_title = $attributes['title'] ?? '';
$subtitle  = $attributes['subtitle'] ?? '';
$buttons   = $attributes['buttons'] ?? array();

$variant  = $attributes['variant'] ?? 'dark';
$is_light = 'light' === $variant;

$classes = array( 'xfact-cta-section', 'xfact-section-lg' );

if ( ! $is_light ) {
	$classes[] = 'xfact-dark-section';
}

if ( $is_light ) {
	$classes[] = 'xfact-border-top';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => implode( ' ', $classes ) )
);
?>
<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>

	<?php if ( ! $is_light && xfact_should_show_floating_logo() ) : ?>
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
			<h2 class="xfact-cta-section__title"><?php echo esc_html( $cta_title ); ?></h2>

			<?php if ( $subtitle ) : ?>
				<p class="xfact-cta-section__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<?php if ( ! empty( $buttons ) ) : ?>
				<div class="xfact-cta-section__buttons">
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
	</div>

</section>
