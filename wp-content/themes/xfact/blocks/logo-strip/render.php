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
	array(
		'class' => 'xfact-logo-strip xfact-section-border',
	)
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in" style="text-align: center;">
			<?php if ( $heading ) : ?>
				<p class="xfact-logo-strip__heading"><?php echo esc_html( $heading ); ?></p>
			<?php endif; ?>

			<div class="xfact-logo-strip__logos">
				<?php foreach ( $logos as $logo ) : ?>
					<span class="xfact-logo-strip__logo" aria-label="<?php echo esc_attr( $logo['name'] ?? '' ); ?>">
						<?php if ( ! empty( $logo['imageUrl'] ) ) : ?>
							<img src="<?php echo esc_url( $logo['imageUrl'] ); ?>" alt="<?php echo esc_attr( $logo['name'] ?? '' ); ?>" class="xfact-logo-strip__logo-img" loading="lazy" />
						<?php else : ?>
							<?php echo esc_html( $logo['text'] ?? ( $logo['name'] ?? '' ) ); ?>
						<?php endif; ?>
					</span>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
