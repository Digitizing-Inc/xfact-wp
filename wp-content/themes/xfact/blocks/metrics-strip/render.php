<?php
/**
 * Metrics Strip block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$metrics = $attributes['metrics'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-metrics-strip xfact-dark-section xfact-section' )
);
?>
<?php
$bg_image = $attributes['backgroundImage'] ?? '';
$bg_style = $bg_image ? ' style="background-image: url(' . esc_url( $bg_image ) . '); background-size: cover; background-position: center;"' : '';
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?><?php echo $bg_style; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above. ?>>
	<div class="xfact-container">
		<div class="xfact-metrics-strip__grid">
			<?php foreach ( $metrics as $metric ) : ?>
				<div class="xfact-metrics-strip__card">
					<span class="xfact-metrics-strip__value"><?php echo esc_html( $metric['value'] ?? '' ); ?></span>
					<span class="xfact-metrics-strip__label"><?php echo esc_html( $metric['label'] ?? '' ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
