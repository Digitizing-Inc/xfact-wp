<?php
/**
 * Capabilities Pipeline block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label        = $attributes['sectionLabel'] ?? '';
$heading      = $attributes['heading'] ?? '';
$subtitle     = $attributes['subtitle'] ?? '';
$capabilities = $attributes['capabilities'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-capabilities xfact-section xfact-section-border' )
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
			<?php if ( $subtitle ) : ?>
				<p class="xfact-section-subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>

			<div class="xfact-capabilities__pipeline">
				<?php foreach ( $capabilities as $i => $cap ) : ?>
					<div class="xfact-capabilities__item">
						<div class="xfact-capabilities__card xfact-card-interactive">
							<?php
							$cap_icon = $cap['iconName'] ?? '';
							if ( $cap_icon ) {
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
								echo xfact_get_icon( $cap_icon, 'xfact-capabilities__icon' );
							}
							?>
							<h3 class="xfact-capabilities__title"><?php echo esc_html( $cap['title'] ?? '' ); ?></h3>
							<p class="xfact-capabilities__desc"><?php echo esc_html( $cap['description'] ?? '' ); ?></p>
						</div>
						<?php if ( $i < count( $capabilities ) - 1 ) : ?>
							<div class="xfact-capabilities__arrow" aria-hidden="true">
								<svg class="xfact-capabilities__arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M5 12h14M12 5l7 7-7 7"/>
								</svg>
								<div class="xfact-capabilities__divider-mobile xfact-gradient-divider"></div>
							</div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>

			<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
