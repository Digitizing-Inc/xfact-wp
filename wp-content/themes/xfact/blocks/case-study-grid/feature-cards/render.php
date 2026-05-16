<?php
/**
 * Feature Cards block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label   = $attributes['sectionLabel'] ?? '';
$heading = $attributes['heading'] ?? '';
$cards   = $attributes['cards'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-feature-cards has-surface-background-color xfact-section xfact-separator' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( $label ) : ?>
				<p class="xfact-section-label"><?php echo esc_html( $label ); ?></p>
			<?php endif; ?>
			<?php if ( $heading ) : ?>
				<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>

			<?php if ( ! empty( $cards ) ) : ?>
				<div class="xfact-feature-cards__grid">
					<?php foreach ( $cards as $card ) : ?>
						<div class="xfact-feature-cards__card xfact-card-interactive">
							<?php
							$fc_icon = $card['iconName'] ?? '';
							if ( $fc_icon ) {
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
								echo xfact_get_icon( $fc_icon, 'xfact-feature-cards__icon' );
							}
							?>
							<h3 class="xfact-feature-cards__title"><?php echo esc_html( $card['title'] ?? '' ); ?></h3>
							<p class="xfact-feature-cards__desc"><?php echo esc_html( $card['description'] ?? '' ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
