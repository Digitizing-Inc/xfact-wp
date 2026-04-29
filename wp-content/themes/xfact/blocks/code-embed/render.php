<?php
/**
 * Code Embed block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$code = $attributes['code'] ?? '';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-code-embed xfact-bg xfact-section-lg' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-code-embed__inner xfact-fade-in">
			<?php
			// We intentionally do not escape here because the point of this block
			// is to allow raw HTML, including iframes and script tags.
			// In a production environment, you might want to restrict who can use this block.
			echo $code; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</div>
	</div>
</section>
