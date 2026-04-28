<?php
/**
 * Support Channels block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$channels     = $attributes['channels'] ?? array();
$ec_heading   = $attributes['existingClientHeading'] ?? '';
$ec_desc      = $attributes['existingClientDescription'] ?? '';
$ec_btn_label = $attributes['existingClientButtonLabel'] ?? '';
$ec_btn_href  = $attributes['existingClientButtonHref'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-support-channels xfact-section xfact-section-border' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( ! empty( $channels ) ) : ?>
				<div class="xfact-support-channels__grid">
					<?php foreach ( $channels as $channel ) : ?>
						<div class="xfact-support-channels__card xfact-card-interactive">
							<?php
							$ch_icon = $channel['iconName'] ?? '';
							if ( $ch_icon ) :
								?>
								<div class="xfact-support-channels__icon-badge">
									<?php
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
									echo xfact_get_icon( $ch_icon, 'xfact-support-channels__icon' );
									?>
								</div>
							<?php endif; ?>
							<h3 class="xfact-support-channels__title"><?php echo esc_html( $channel['title'] ?? '' ); ?></h3>
							<p class="xfact-support-channels__desc"><?php echo esc_html( $channel['description'] ?? '' ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php if ( $ec_heading ) : ?>
				</div>
			</div>
		</section>
		<section class="xfact-support-channels__existing-section xfact-section xfact-section-border">
			<div class="xfact-container">
				<div class="xfact-fade-in xfact-support-channels__existing-inner">
					<h2 class="xfact-support-channels__existing-heading"><?php echo esc_html( $ec_heading ); ?></h2>
					<p class="xfact-support-channels__existing-desc"><?php echo esc_html( $ec_desc ); ?></p>
					<?php if ( $ec_btn_label ) : ?>
						<div class="xfact-support-channels__existing-cta">
							<a href="<?php echo esc_url( $ec_btn_href ); ?>" class="xfact-gradient-button xfact-btn-lg">
								<?php echo esc_html( $ec_btn_label ); ?>
							</a>
						</div>
					<?php endif; ?>
				</div>
			</div>

				<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</section>
			<?php else : ?>
				<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
			<?php endif; ?>
