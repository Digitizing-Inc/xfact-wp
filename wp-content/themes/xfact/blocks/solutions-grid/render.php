<?php
/**
 * Solutions Grid block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label    = $attributes['sectionLabel'] ?? '';
$heading  = $attributes['heading'] ?? '';
$subtitle = $attributes['subtitle'] ?? '';
$sectors  = $attributes['sectors'] ?? array();
$buttons  = $attributes['buttons'] ?? array();

/* Default sectors if none configured */
if ( empty( $sectors ) ) {
	$sectors = array(
		array(
			'title'       => __( 'Public safety & justice', 'xfact' ),
			'headline'    => __( 'Law enforcement, courts, corrections, 911 systems', 'xfact' ),
			'description' => __( 'Mission-critical systems that require continuous availability and uncompromising security.', 'xfact' ),
			'href'        => '/solutions#public-safety',
			'iconName'    => 'Shield',
			'bgColor'     => 'var(--xfact-semantic-primary-dark)',
		),
		array(
			'title'       => __( 'Government & municipal', 'xfact' ),
			'headline'    => __( 'State, county, and local agencies', 'xfact' ),
			'description' => __( 'Integrated systems that support public works, digital services, and civic infrastructure.', 'xfact' ),
			'href'        => '/solutions#government',
			'iconName'    => 'Landmark',
			'bgColor'     => 'var(--xfact-semantic-primary)',
		),
		array(
			'title'       => __( 'Education', 'xfact' ),
			'headline'    => __( 'K-12 districts and higher education', 'xfact' ),
			'description' => __( 'Secure infrastructure that protects student data and supports continuous learning.', 'xfact' ),
			'href'        => '/solutions#education',
			'iconName'    => 'GraduationCap',
			'bgColor'     => 'var(--xfact-semantic-primary-dark)',
		),
		array(
			'title'       => __( 'Health & human services', 'xfact' ),
			'headline'    => __( 'Healthcare, behavioral health, social services', 'xfact' ),
			'description' => __( 'Compliant environments that balance accessibility with strict privacy requirements.', 'xfact' ),
			'href'        => '/solutions#hhs',
			'iconName'    => 'HeartPulse',
			'bgColor'     => 'var(--xfact-semantic-primary)',
		),
		array(
			'title'       => __( 'Infrastructure & managed services', 'xfact' ),
			'headline'    => __( 'DataServ, an xFact solution', 'xfact' ),
			'description' => __( 'Hosted platforms and managed network operations that ensure operational stability.', 'xfact' ),
			'href'        => '/solutions#infrastructure',
			'iconName'    => 'ServerCog',
			'badge'       => 'DataServ',
			'bgColor'     => 'var(--xfact-semantic-primary-dark)',
		),
	);
}

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-solutions-grid xfact-section xfact-separator' )
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
					<?php
					$card_class = 'xfact-solutions-grid__card xfact-card-interactive';
					?>
					<a href="<?php echo esc_url( $sector['href'] ?? '#' ); ?>" class="<?php echo esc_attr( $card_class ); ?>">
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
						<div class="xfact-solutions-grid__card-content">
							<?php if ( ! empty( $sector['title'] ) ) : ?>
								<span class="xfact-section-label"><?php echo esc_html( $sector['title'] ); ?></span>
							<?php endif; ?>
							
							<?php if ( ! empty( $sector['headline'] ) ) : ?>
								<h3 class="xfact-solutions-grid__title xfact-text"><?php echo esc_html( $sector['headline'] ); ?></h3>
							<?php endif; ?>
							
							<?php if ( ! empty( $sector['description'] ) ) : ?>
								<p class="xfact-solutions-grid__desc xfact-text-secondary"><?php echo esc_html( $sector['description'] ); ?></p>
							<?php endif; ?>
						</div>
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

			<?php if ( ! empty( $buttons ) ) : ?>
				<div class="xfact-solutions-grid__cta">
					<?php
					foreach ( $buttons as $btn ) :
						$btn_label   = $btn['label'] ?? '';
						$btn_url     = $btn['url'] ?? '';
						$btn_variant = $btn['variant'] ?? 'secondary';

						$link_class = 'xfact-btn-link';
						if ( 'primary' === $btn_variant ) {
							$link_class = 'xfact-btn-primary xfact-btn-default';
						} elseif ( 'secondary' === $btn_variant ) {
							$link_class = 'xfact-btn-secondary xfact-btn-default'; }

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
