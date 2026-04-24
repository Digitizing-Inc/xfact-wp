<?php
/**
 * Section List block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$intro_text   = $attributes['introText'] ?? '';
$show_numbers = $attributes['showNumbers'] ?? true;
$sections     = $attributes['sections'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-section-list xfact-bg xfact-section' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container xfact-container--narrow">
		<?php if ( $intro_text ) : ?>
			<p class="xfact-text-secondary xfact-section-list__intro xfact-fade-in">
				<?php echo esc_html( $intro_text ); ?>
			</p>
		<?php endif; ?>

		<?php if ( ! empty( $sections ) ) : ?>
			<div class="xfact-section-list__items">
				<?php foreach ( $sections as $index => $section ) : ?>
					<?php
					$title   = $section['title'] ?? '';
					$content = $section['content'] ?? '';
					if ( ! $title && ! $content ) {
						continue;
					}

					$display_title = $title;
					if ( $show_numbers && $title ) {
						$num           = $index + 1;
						$display_title = "{$num}. {$title}";
					}
					?>
					<div class="xfact-section-list__item xfact-fade-in">
						<?php if ( $title ) : ?>
							<h2 class="xfact-section-list__title xfact-text"><?php echo esc_html( $display_title ); ?></h2>
						<?php endif; ?>
						
						<?php if ( $content ) : ?>
							<p class="xfact-section-list__content xfact-text-secondary"><?php echo esc_html( $content ); ?></p>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
</section>
