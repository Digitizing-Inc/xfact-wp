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
			$has_iframe = strpos( $code, '<iframe' ) !== false;
			if ( $has_iframe ) {
				// Inject loading="lazy" if not present to prevent blocking page load.
				if ( strpos( $code, 'loading=' ) === false ) {
					$code = str_replace( '<iframe', '<iframe loading="lazy"', $code );
				}

				echo '<div class="xfact-code-embed__loader" style="display: flex; justify-content: center; padding: 4rem 0;">';
				echo '<svg class="xfact-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 3rem; height: 3rem; color: var(--xfact-semantic-primary); animation: xfact-spin 1s linear infinite;">';
				echo '<style>@keyframes xfact-spin { 100% { transform: rotate(360deg); } }</style>';
				echo '<path d="M21 12a9 9 0 1 1-6.219-8.56"></path>';
				echo '</svg>';
				echo '</div>';

				echo '<div class="xfact-code-embed__iframe-wrapper" style="opacity: 0; transition: opacity 0.3s ease;">';
				echo $code; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '</div>';
			} else {
				echo $code; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			?>
		</div>
	</div>
	<script>
		(function() {
			const wrappers = document.querySelectorAll('.xfact-code-embed__inner');
			wrappers.forEach(wrapper => {
				const iframe = wrapper.querySelector('iframe');
				if (!iframe) return;
				
				const loader = wrapper.querySelector('.xfact-code-embed__loader');
				const iframeWrapper = wrapper.querySelector('.xfact-code-embed__iframe-wrapper');
				
				const showIframe = () => {
					if (loader) loader.style.display = 'none';
					if (iframeWrapper) iframeWrapper.style.opacity = '1';
				};
				
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

				iframe.addEventListener('load', () => {
					showIframe();
					adjustHeight();
				});
				
				// Fallback in case load event was missed
				setTimeout(showIframe, 3000);

				// Also adjust on resize
				window.addEventListener('resize', adjustHeight);
				// Initial adjust
				setTimeout(adjustHeight, 100);
			});
		})();
	</script>
</section>
