<?php
/**
 * Text Section block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label       = $attributes['sectionLabel'] ?? '';
$heading     = $attributes['heading'] ?? '';
$body        = $attributes['body'] ?? '';
$badge_text  = $attributes['badgeText'] ?? '';
$tags        = $attributes['tags'] ?? array();
$use_alt_bg  = $attributes['useAltBackground'] ?? false;
$is_centered = ! empty( $attributes['isCenteredCard'] );

$bg_class     = $use_alt_bg ? 'has-surface-alt-background-color' : 'has-surface-background-color';
$card_class   = $is_centered ? ' xfact-text-section--centered-card' : '';
$wrapper_args = array( 'class' => "xfact-text-section {$bg_class}{$card_class} xfact-section xfact-section-border" );

$anchor = $attributes['anchor'] ?? '';
if ( $anchor ) {
	$wrapper_args['id'] = $anchor;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php
			$key_messages = $attributes['keyMessages'] ?? array();
			?>
			<div class="<?php echo ! empty( $key_messages ) ? 'xfact-text-section__grid' : ''; ?>">
				<div class="xfact-text-section__main<?php echo $is_centered ? ' xfact-card' : ''; ?>">
					<?php
					$section_icon = $attributes['sectionIcon'] ?? '';
					if ( $section_icon ) {
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
						echo '<div class="xfact-text-section__icon">' . xfact_get_icon( $section_icon, 'xfact-text-section__section-icon' ) . '</div>';
					}
					?>
					<?php if ( $label ) : ?>
						<p class="xfact-section-label"><?php echo esc_html( $label ); ?></p>
					<?php endif; ?>

					<?php if ( $heading ) : ?>
						<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
					<?php endif; ?>

					<?php if ( $badge_text ) : ?>
						<div class="xfact-text-section__badge">
							<span><?php echo esc_html( $badge_text ); ?></span>
						</div>
					<?php endif; ?>

					<?php if ( $body ) : ?>
						<p class="xfact-text-section__body xfact-text-secondary"><?php echo esc_html( $body ); ?></p>
					<?php endif; ?>

					<?php if ( ! empty( $tags ) ) : ?>
						<div class="xfact-text-section__tags">
							<?php foreach ( $tags as $tag_item ) : ?>
								<span class="xfact-text-section__tag xfact-card xfact-text-secondary">
									<?php
									$tag_icon = $tag_item['iconName'] ?? '';
									if ( $tag_icon ) {
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
										echo xfact_get_icon( $tag_icon, 'xfact-text-section__tag-icon' );
									}
									?>
									<?php echo esc_html( $tag_item['label'] ?? '' ); ?>
								</span>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>

					<?php
					$buttons = $attributes['buttons'] ?? array();
					if ( ! empty( $buttons ) ) :
						?>
						<div class="xfact-text-section__action xfact-text-section__action--button">
							<?php
							foreach ( $buttons as $btn ) :
								$btn_label   = $btn['label'] ?? '';
								$btn_url     = $btn['url'] ?? '';
								$btn_variant = $btn['variant'] ?? 'primary';

								$link_class = 'xfact-text-section__link';
								if ( 'primary' === $btn_variant ) {
									$link_class = 'xfact-gradient-button wp-block-button__link wp-element-button xfact-btn-lg';
								} elseif ( 'secondary' === $btn_variant ) {
									$link_class = 'xfact-btn-secondary xfact-btn-lg'; }

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

				<?php if ( ! empty( $key_messages ) ) : ?>
					<aside class="xfact-text-section__aside xfact-card">
						<?php
						$aside_heading = $attributes['keyMessagesHeading'] ?? 'Why xFact';
						?>
						<h2 class="xfact-text-section__aside-heading xfact-section-label" style="margin-bottom: 1rem;"><?php echo esc_html( $aside_heading ); ?></h2>
						<ul class="xfact-text-section__aside-list">
							<?php foreach ( $key_messages as $msg ) : ?>
								<?php if ( trim( $msg ) ) : ?>
									<li>
										<?php
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
										echo xfact_get_icon( 'ChevronRight', 'xfact-text-section__aside-icon' );
										?>
										<span class="xfact-text-secondary"><?php echo esc_html( $msg ); ?></span>
									</li>
								<?php endif; ?>
							<?php endforeach; ?>
						</ul>
					</aside>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
