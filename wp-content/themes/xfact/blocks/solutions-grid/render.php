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
			'headline'    => __( 'Law enforcement, courts, corrections, 911 systems', 'xfact' ),
			'description' => __( 'Mission-critical systems that require continuous availability and uncompromising security.', 'xfact' ),
			'href'        => '/solutions#public-safety',
			'iconName'    => 'Shield',
		),
		array(
			'title'       => __( 'Government & municipal', 'xfact' ),
			'headline'    => __( 'State, county, and local agencies', 'xfact' ),
			'description' => __( 'Integrated systems that support public works, digital services, and civic infrastructure.', 'xfact' ),
			'href'        => '/solutions#government',
			'iconName'    => 'Landmark',
		),
		array(
			'title'       => __( 'Education', 'xfact' ),
			'headline'    => __( 'K-12 districts and higher education', 'xfact' ),
			'description' => __( 'Secure infrastructure that protects student data and supports continuous learning.', 'xfact' ),
			'href'        => '/solutions#education',
			'iconName'    => 'GraduationCap',
		),
		array(
			'title'       => __( 'Health & human services', 'xfact' ),
			'headline'    => __( 'Healthcare, behavioral health, social services', 'xfact' ),
			'description' => __( 'Compliant environments that balance accessibility with strict privacy requirements.', 'xfact' ),
			'href'        => '/solutions#hhs',
			'iconName'    => 'HeartPulse',
		),
		array(
			'title'       => __( 'Infrastructure & managed services', 'xfact' ),
			'headline'    => __( 'DataServ, an xFact solution', 'xfact' ),
			'description' => __( 'Hosted platforms and managed network operations that ensure operational stability.', 'xfact' ),
			'href'        => '/solutions#infrastructure',
			'iconName'    => 'ServerCog',
			'badge'       => 'DataServ',
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
						<div class="xfact-solutions-grid__card-header">
							<?php
							$icon_name = $sector['iconName'] ?? '';
							if ( $icon_name ) {
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
								echo xfact_get_icon( $icon_name, 'xfact-solutions-grid__icon' );
							}
							?>
							<?php if ( ! empty( $sector['badge'] ) ) : ?>
								<span class="xfact-solutions-grid__badge"><?php echo esc_html( $sector['badge'] ); ?></span>
							<?php endif; ?>
						</div>
						
						<?php if ( ! empty( $sector['title'] ) ) : ?>
							<span class="xfact-section-label"><?php echo esc_html( $sector['title'] ); ?></span>
						<?php endif; ?>
						
						<?php if ( ! empty( $sector['headline'] ) ) : ?>
							<h3 class="xfact-solutions-grid__title"><?php echo esc_html( $sector['headline'] ); ?></h3>
						<?php endif; ?>
						
						<?php if ( ! empty( $sector['description'] ) ) : ?>
							<p class="xfact-solutions-grid__desc"><?php echo esc_html( $sector['description'] ); ?></p>
						<?php endif; ?>
						
						<div class="xfact-solutions-grid__link">
							<?php
							// Extract the first part of the title before " & " for the Explore link.
							$explore_title = explode( ' & ', $sector['title'] ?? '' )[0];
							?>
							<span><?php /* translators: %s: Industry name */ echo esc_html( sprintf( __( 'Explore %s', 'xfact' ), $explore_title ) ); ?></span>
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo xfact_get_icon( 'ArrowRight', 'xfact-solutions-grid__link-arrow' );
							?>
						</div>
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
