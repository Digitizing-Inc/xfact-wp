<?php
/**
 * Navigation Cards block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$wrapper_args = array( 'class' => 'xfact-navigation-cards xfact-section xfact-separator' );

$anchor = $attributes['anchor'] ?? '';
if ( $anchor ) {
	$wrapper_args['id'] = $anchor;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
$heading            = $attributes['heading'] ?? '';
$section_label      = $attributes['sectionLabel'] ?? '';
$items              = $attributes['items'] ?? array();
$buttons            = $attributes['buttons'] ?? array();
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( $section_label ) : ?>
				<h3 class="xfact-section-label" style="margin-bottom: 0.5rem;"><?php echo esc_html( $section_label ); ?></h3>
			<?php endif; ?>
			<?php if ( $heading ) : ?>
				<h2 class="xfact-navigation-cards__heading xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>
			
			<div class="xfact-navigation-cards__grid">
				<?php foreach ( $items as $item ) : ?>
					<?php
					$card_classes = 'xfact-nav-card xfact-card-interactive';
					?>
					<a href="<?php echo esc_url( $item['href'] ?? '#' ); ?>" class="<?php echo esc_attr( $card_classes ); ?>">
						<?php if ( ! empty( $item['icon'] ) ) : ?>
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
							echo xfact_get_icon( $item['icon'], 'xfact-nav-card__icon' );
							?>
						<?php endif; ?>
						<div class="xfact-nav-card__content">
							<h3 class="xfact-nav-card__title xfact-text">
								<?php echo esc_html( $item['title'] ?? '' ); ?>
							</h3>
							<?php if ( ! empty( $item['subtitle'] ) ) : ?>
								<p class="xfact-nav-card__subtitle xfact-text-secondary">
									<?php echo esc_html( $item['subtitle'] ); ?>
								</p>
							<?php endif; ?>
						</div>
						<div class="xfact-nav-card__arrow">
							<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
							echo xfact_get_icon( 'ArrowRight', 'xfact-nav-card__arrow-icon' );
							?>
						</div>
					</a>
				<?php endforeach; ?>
			</div>

			<?php if ( ! empty( $buttons ) ) : ?>
				<div class="xfact-navigation-cards__cta" style="margin-top: 3rem;">
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
