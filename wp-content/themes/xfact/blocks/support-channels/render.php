<?php
/**
 * Support Channels block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$heading  = $attributes['heading'] ?? '';
$channels = $attributes['channels'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-support-channels xfact-section xfact-section-border' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( $heading ) : ?>
				<h2 class="xfact-section-heading" style="margin-bottom: 3rem;"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>
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
							<h3 class="xfact-support-channels__title xfact-text"><?php echo esc_html( $channel['title'] ?? '' ); ?></h3>
							<p class="xfact-support-channels__desc xfact-text-secondary"><?php echo esc_html( $channel['description'] ?? '' ); ?></p>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
