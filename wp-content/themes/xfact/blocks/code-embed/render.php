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
	array( 'class' => 'xfact-code-embed has-surface-background-color xfact-section-lg' )
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
	<script>
		(function() {
			const wrappers = document.querySelectorAll('.xfact-code-embed__inner');
			wrappers.forEach(wrapper => {
				const iframe = wrapper.querySelector('iframe');
				if (!iframe) return;
				
				const adjustHeight = () => {
					const style = window.getComputedStyle(iframe);
					const transform = style.getPropertyValue('transform');
					if (transform && transform !== 'none') {
						const matrix = new DOMMatrixReadOnly(transform);
						const scaleY = matrix.m22;
						if (scaleY && scaleY !== 1) {
							wrapper.style.minHeight = (iframe.offsetHeight * scaleY) + 'px';
						}
					}
				};

				iframe.addEventListener('load', adjustHeight);
				// Also adjust on resize
				window.addEventListener('resize', adjustHeight);
				// Initial adjust
				setTimeout(adjustHeight, 100);
			});
		})();
	</script>
</section>
