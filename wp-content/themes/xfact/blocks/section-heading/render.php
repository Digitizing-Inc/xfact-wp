<?php
/**
 * Section Heading block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label    = $attributes['sectionLabel'] ?? '';
$heading  = $attributes['heading'] ?? '';
$subtitle = $attributes['subtitle'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<?php if ( $label ) : ?>
		<p class="xfact-section-label"><?php echo esc_html( $label ); ?></p>
	<?php endif; ?>
	<?php if ( $heading ) : ?>
		<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
	<?php endif; ?>
	<?php if ( $subtitle ) : ?>
		<p class="xfact-section-subtitle"><?php echo esc_html( $subtitle ); ?></p>
	<?php endif; ?>
</div>
