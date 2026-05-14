<?php
/**
 * Case Study Grid block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$wrapper_args = array( 'class' => 'xfact-case-study-grid xfact-section has-surface-alt-background-color' );

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
					$card_post_id = ! empty( $item['postId'] ) ? intval( $item['postId'] ) : 0;
					$card_title   = $item['title'] ?? '';
					$summary      = $item['summary'] ?? '';
					$source       = $item['source'] ?? '';
					$link_url     = $item['linkUrl'] ?? '';

					// If we do not have a post_id but have a linkUrl, try to find the post.
					if ( ! $card_post_id && $link_url ) {
						$card_post_id = url_to_postid( $link_url );
					}

					if ( $card_post_id && ( empty( $summary ) || empty( $source ) ) ) {
						$cs_post = get_post( $card_post_id );
						if ( $cs_post ) {
							$card_title = $card_title ? $card_title : get_the_title( $cs_post );
							$link_url   = $link_url ? $link_url : get_permalink( $cs_post );

							$blocks        = parse_blocks( $cs_post->post_content );
							$found_summary = '';
							$found_source  = '';
							foreach ( $blocks as $block ) {
								if ( 'xfact/case-study-details' === $block['blockName'] ) {
									$found_summary = $block['attrs']['summary'] ?? '';
									$found_source  = $block['attrs']['source'] ?? '';
									break;
								}
							}

							$summary = $summary ? $summary : ( $found_summary ? $found_summary : wp_strip_all_tags( get_the_excerpt( $cs_post ) ) );
							$source  = $source ? $source : $found_source;
						}
					}

					$has_link    = ! empty( $link_url );
					$wrapper_tag = $has_link ? 'a' : 'article';
					$href        = $has_link ? ' href="' . esc_url( $link_url ) . '" target="_blank" rel="noopener noreferrer"' : '';
					$classes     = 'xfact-case-study-card xfact-card';
					if ( $has_link ) {
						$classes .= ' xfact-card-interactive';
					}
					?>
					<<?php echo esc_html( $wrapper_tag ); ?> class="<?php echo esc_attr( $classes ); ?>"<?php echo $href; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
						<div class="xfact-case-study-card__content">
							<?php if ( ! empty( $source ) ) : ?>
								<p class="xfact-case-study-card__source">
									<?php echo esc_html( $source ); ?>
								</p>
							<?php endif; ?>
							<h3 class="xfact-case-study-card__title xfact-text">
								<?php echo esc_html( $card_title ); ?>
							</h3>
							<p class="xfact-case-study-card__summary xfact-text-secondary">
								<?php echo esc_html( $summary ); ?>
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
