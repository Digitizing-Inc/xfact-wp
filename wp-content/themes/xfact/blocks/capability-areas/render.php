<?php
/**
 * Capability Areas block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$areas = $attributes['areas'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-capability-areas' )
);
?>

<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<?php foreach ( $areas as $index => $area ) : ?>
		<?php
		$bg_class = ( 0 === $index % 2 ) ? 'xfact-bg-alt' : 'xfact-bg';
		$number   = str_pad( (string) ( $index + 1 ), 2, '0', STR_PAD_LEFT );
		$total    = count( $areas );
		?>
		<section id="<?php echo esc_attr( $area['anchor'] ?? '' ); ?>" class="xfact-capability-area xfact-section-border <?php echo esc_attr( $bg_class ); ?>">
			<div class="xfact-container">
				<div class="xfact-fade-in xfact-capability-area__grid">
					<div class="xfact-capability-area__left">
						<?php
						$icon_name = $area['iconName'] ?? '';
						if ( $icon_name ) {
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo xfact_get_icon( $icon_name, 'xfact-capability-area__icon' );
						}
						?>
						<span class="xfact-capability-area__number"><?php echo esc_html( "{$number} / {$total}" ); ?></span>
						<h2 class="xfact-capability-area__title"><?php echo esc_html( $area['title'] ?? '' ); ?></h2>
					</div>
					<div class="xfact-capability-area__right">
						<p class="xfact-capability-area__headline"><?php echo esc_html( $area['headline'] ?? '' ); ?></p>
						<p class="xfact-capability-area__body"><?php echo esc_html( $area['body'] ?? '' ); ?></p>
						
						<?php if ( ! empty( $area['services'] ) ) : ?>
							<div class="xfact-capability-area__services-wrapper">
								<h3 class="xfact-capability-area__services-label"><?php esc_html_e( 'Services', 'xfact' ); ?></h3>
								<ul class="xfact-capability-area__services-list">
									<?php foreach ( $area['services'] as $service ) : ?>
										<li class="xfact-capability-area__service-tag"><?php echo esc_html( $service ); ?></li>
									<?php endforeach; ?>
								</ul>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</section>
	<?php endforeach; ?>
</div>
