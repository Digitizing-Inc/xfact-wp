<?php
/**
 * Case Study Grid block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$wrapper_args = array( 'class' => 'xfact-case-study-grid xfact-section' );

$anchor = $attributes['anchor'] ?? '';
if ( $anchor ) {
	$wrapper_args['id'] = $anchor;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
$items              = $attributes['items'] ?? array();
$section_label      = $attributes['sectionLabel'] ?? '';
$heading            = $attributes['heading'] ?? '';
$description        = $attributes['description'] ?? '';
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( $section_label ) : ?>
				<p class="xfact-section-label"><?php echo esc_html( $section_label ); ?></p>
			<?php endif; ?>
			
			<?php if ( $heading ) : ?>
				<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>
			
			<?php if ( $description ) : ?>
				<p class="xfact-section-subtitle" style="margin-bottom: 3rem; max-width: 48rem;">
					<?php echo esc_html( $description ); ?>
				</p>
			<?php elseif ( ! $heading && ! $section_label ) : ?>
				<h2 class="xfact-section-heading" style="margin-bottom: 2rem;">Related Work</h2>
			<?php endif; ?>
			
			<div class="xfact-case-study-grid__list">
				<?php foreach ( $items as $item ) : ?>
					<?php
					$has_link    = ! empty( $item['linkUrl'] );
					$wrapper_tag = $has_link ? 'a' : 'article';
					$href        = $has_link ? ' href="' . esc_url( $item['linkUrl'] ) . '" target="_blank" rel="noopener noreferrer"' : '';
					$classes     = 'xfact-case-study-card xfact-card';
					if ( $has_link ) {
						$classes .= ' xfact-card-interactive';
					}
					?>
					<<?php echo esc_html( $wrapper_tag ); ?> class="<?php echo esc_attr( $classes ); ?>"<?php echo $href; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
						<div class="xfact-case-study-card__content">
							<?php if ( ! empty( $item['source'] ) ) : ?>
								<p class="xfact-case-study-card__source">
									<?php echo esc_html( $item['source'] ); ?>
								</p>
							<?php endif; ?>
							<h3 class="xfact-case-study-card__title">
								<?php echo esc_html( $item['title'] ?? '' ); ?>
							</h3>
							<p class="xfact-case-study-card__summary">
								<?php echo esc_html( $item['summary'] ?? '' ); ?>
							</p>
						</div>
						<?php if ( $has_link ) : ?>
							<div class="xfact-case-study-card__footer">
								<span class="xfact-case-study-card__link-text">
									Read case study
									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
								</span>
							</div>
						<?php endif; ?>
					</<?php echo esc_html( $wrapper_tag ); ?>>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
