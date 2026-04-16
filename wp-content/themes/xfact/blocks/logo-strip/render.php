<?php
/**
 * Logo Strip block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$heading = $attributes['heading'] ?? '';
$logos   = $attributes['logos'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-logo-strip xfact-bg-alt xfact-section-border' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?> style="padding: 2.5rem 0 4rem;">
	<div class="xfact-container">
		<div class="xfact-fade-in" style="text-align: center;">
			<?php if ( $heading ) : ?>
				<p class="xfact-logo-strip__heading"><?php echo esc_html( $heading ); ?></p>
			<?php endif; ?>

			<div class="xfact-logo-strip__logos">
				<?php foreach ( $logos as $logo ) : ?>
					<span class="xfact-logo-strip__logo" aria-label="<?php echo esc_attr( $logo['name'] ?? '' ); ?>">
						<?php if ( ! empty( $logo['svgContent'] ) ) : ?>
							<?php
							$svg = $logo['svgContent'];
							/* Add styling class to the SVG element */
							$svg = str_replace( '<svg', '<svg class="xfact-logo-strip__logo-svg"', $svg );
							echo wp_kses(
								$svg,
								array(
									'svg'  => array( 'class' => true, 'viewbox' => true, 'xmlns' => true, 'width' => true, 'height' => true, 'aria-label' => true, 'role' => true, 'fill' => true ),
									'text' => array( 'x' => true, 'y' => true, 'font-family' => true, 'font-weight' => true, 'font-size' => true, 'fill' => true, 'letter-spacing' => true ),
									'path' => array( 'd' => true, 'fill' => true, 'stroke' => true ),
									'g'    => array( 'class' => true, 'transform' => true ),
								)
							);
							?>
						<?php elseif ( ! empty( $logo['imageUrl'] ) ) : ?>
							<img src="<?php echo esc_url( $logo['imageUrl'] ); ?>" alt="<?php echo esc_attr( $logo['name'] ?? '' ); ?>" class="xfact-logo-strip__logo-img" loading="lazy" />
						<?php else : ?>
							<?php echo esc_html( $logo['text'] ?? $logo['name'] ?? '' ); ?>
						<?php endif; ?>
					</span>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
