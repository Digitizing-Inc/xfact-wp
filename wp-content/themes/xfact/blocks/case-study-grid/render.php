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
					<article class="xfact-case-study-card xfact-card">
						<div class="xfact-case-study-card__content">
							<h3 class="xfact-case-study-card__title">
								<?php echo esc_html( $item['title'] ?? '' ); ?>
							</h3>
							<p class="xfact-case-study-card__summary">
								<?php echo esc_html( $item['summary'] ?? '' ); ?>
							</p>
						</div>
						<div class="xfact-case-study-card__footer">
							<p class="xfact-case-study-card__source">
								<span class="xfact-case-study-card__source-label">Source:</span> <?php echo esc_html( $item['source'] ?? '' ); ?>
							</p>
						</div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
