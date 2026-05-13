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

$variant    = $attributes['variant'] ?? 'dark';
$is_light   = 'light' === $variant;
$is_default = 'default' === $variant;

$classes = array( 'xfact-cta-section', 'xfact-section-lg' );

if ( $is_light ) {
	$classes[] = 'xfact-bg-alt';
	$classes[] = 'xfact-border-top';
} elseif ( ! $is_default ) {
	$classes[] = 'xfact-dark-section';
}

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => implode( ' ', $classes ) )
);
?>
<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>

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
			<?php
			$title_class = $is_light ? 'xfact-text' : '';
			if ( $title_class ) {
				$title_class = ' ' . $title_class;
			}
			?>
			<h2 class="xfact-cta-section__title<?php echo esc_attr( $title_class ); ?>"><?php echo esc_html( $cta_title ); ?></h2>

			<?php
			if ( $subtitle ) :
				$subtitle_class = $is_light ? 'xfact-text-secondary' : '';
				if ( $subtitle_class ) {
					$subtitle_class = ' ' . $subtitle_class;
				}
				$subtitle_style = '';
				?>
				<p class="xfact-cta-section__subtitle<?php echo esc_attr( $subtitle_class ); ?>"<?php echo $subtitle_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>><?php echo esc_html( $subtitle ); ?></p>
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
							$link_class = 'xfact-gradient-button xfact-btn-lg';
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
