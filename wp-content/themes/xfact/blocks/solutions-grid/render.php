<?php
/**
 * Solutions Grid block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label        = $attributes['sectionLabel'] ?? '';
$heading      = $attributes['heading'] ?? '';
$subtitle     = $attributes['subtitle'] ?? '';
$sectors      = $attributes['sectors'] ?? array();
$button_label = $attributes['buttonLabel'] ?? '';
$button_href  = $attributes['buttonHref'] ?? '/solutions';

/* Default sectors if none configured */
if ( empty( $sectors ) ) {
	$sectors = array(
		array(
			'title'       => __( 'Public safety & justice', 'xfact' ),
			'description' => __( 'Law enforcement, courts, corrections, 911 systems', 'xfact' ),
			'href'        => '/solutions#public-safety',
			'iconName'    => 'Shield',
		),
		array(
			'title'       => __( 'Government & municipal', 'xfact' ),
			'description' => __( 'State, county, and local agencies', 'xfact' ),
			'href'        => '/solutions#government',
			'iconName'    => 'Landmark',
		),
		array(
			'title'       => __( 'Education', 'xfact' ),
			'description' => __( 'K-12 districts and higher education', 'xfact' ),
			'href'        => '/solutions#education',
			'iconName'    => 'GraduationCap',
		),
		array(
			'title'       => __( 'Health & human services', 'xfact' ),
			'description' => __( 'Healthcare, behavioral health, social services', 'xfact' ),
			'href'        => '/solutions#hhs',
			'iconName'    => 'HeartPulse',
		),
		array(
			'title'       => __( 'Infrastructure & managed services', 'xfact' ),
			'description' => __( 'DataServ, an xFact solution', 'xfact' ),
			'href'        => '/solutions#infrastructure',
			'iconName'    => 'ServerCog',
		),
	);
}

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-solutions-grid xfact-section xfact-section-border' )
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

			<div class="xfact-solutions-grid__grid">
				<?php foreach ( $sectors as $sector ) : ?>
					<a href="<?php echo esc_url( $sector['href'] ?? '#' ); ?>" class="xfact-solutions-grid__card">
						<?php
						$icon_name = $sector['iconName'] ?? '';
						if ( $icon_name ) {
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
							echo xfact_get_icon( $icon_name, 'xfact-solutions-grid__icon' );
						}
						?>
						<h3 class="xfact-solutions-grid__title"><?php echo esc_html( $sector['title'] ?? '' ); ?></h3>
						<p class="xfact-solutions-grid__desc"><?php echo esc_html( $sector['description'] ?? '' ); ?></p>
						<span class="xfact-solutions-grid__link"><?php esc_html_e( 'Learn more →', 'xfact' ); ?></span>
					</a>
				<?php endforeach; ?>
			</div>

			<?php if ( $button_label ) : ?>
				<div class="xfact-solutions-grid__cta">
					<a href="<?php echo esc_url( $button_href ); ?>" class="xfact-btn-secondary xfact-btn-default">
						<?php echo esc_html( $button_label ); ?>
					</a>
				</div>
			<?php endif; ?>

			<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
