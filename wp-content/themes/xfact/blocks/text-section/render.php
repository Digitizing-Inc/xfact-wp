<?php
/**
 * Text Section block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label      = $attributes['sectionLabel'] ?? '';
$heading    = $attributes['heading'] ?? '';
$body       = $attributes['body'] ?? '';
$badge_text = $attributes['badgeText'] ?? '';
$tags       = $attributes['tags'] ?? array();

$wrapper_args = array( 'class' => 'xfact-text-section xfact-bg xfact-section xfact-section-border' );

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
				<p class="xfact-text-section__body"><?php echo esc_html( $body ); ?></p>
			<?php endif; ?>

			<?php if ( ! empty( $tags ) ) : ?>
				<div class="xfact-text-section__tags">
					<?php foreach ( $tags as $tag_item ) : ?>
						<span class="xfact-text-section__tag xfact-card">
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
			$link_text = $attributes['linkText'] ?? '';
			$link_url  = $attributes['linkUrl'] ?? '';
			if ( $link_text && $link_url ) :
				?>
				<div class="xfact-text-section__action">
					<a href="<?php echo esc_url( $link_url ); ?>" class="xfact-text-section__link">
						<?php echo esc_html( $link_text ); ?>
					</a>
				</div>
			<?php endif; ?>

			<?php xfact_render_section_image( $attributes['sectionImage'] ?? '', $attributes['sectionImageAlt'] ?? '' ); ?>
		</div>
	</div>
</section>
