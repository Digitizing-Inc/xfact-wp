<?php
/**
 * Case Study Details block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$wrapper_args = array( 'class' => 'xfact-case-study-details xfact-section' );

$anchor = $attributes['anchor'] ?? '';
if ( $anchor ) {
	$wrapper_args['id'] = $anchor;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

$client    = $attributes['client'] ?? '';
$challenge = $attributes['challenge'] ?? array();
$services  = $attributes['services'] ?? array();
$outcomes  = $attributes['outcomes'] ?? array();
$narrative = $attributes['narrative'] ?? '';

// Helper to render sections.
if ( ! function_exists( 'xfact_render_case_study_section' ) ) {
	/**
	 * Render a case study section.
	 *
	 * @param string             $section_title The title of the section.
	 * @param array<int, string> $items         Items to render.
	 */
	function xfact_render_case_study_section( string $section_title, array $items ): void {
		if ( empty( $items ) ) {
			return;
		}
		// Filter out empty items.
		$items = array_filter(
			$items,
			function ( $item ) {
				return trim( (string) $item ) !== '';
			}
		);

		if ( empty( $items ) ) {
			return;
		}
		?>
		<div class="xfact-case-study-details__section">
			<h3 class="xfact-case-study-details__section-title xfact-section-heading">
				<?php echo esc_html( $section_title ); ?>
			</h3>
			<ul class="xfact-case-study-details__list">
				<?php foreach ( $items as $item ) : ?>
					<li class="xfact-case-study-details__list-item xfact-text-secondary">
						<span class="xfact-case-study-details__list-bullet" aria-hidden="true"></span>
						<?php echo esc_html( $item ); ?>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<?php
	}
}
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-case-study-details__grid xfact-fade-in">
			
			<div class="xfact-case-study-details__main">
				<?php if ( $client ) : ?>
					<div class="xfact-case-study-details__client-box xfact-card">
						<span class="xfact-case-study-details__client-label xfact-section-label">
							Client
						</span>
						<p class="xfact-case-study-details__client-name xfact-text">
							<?php echo esc_html( $client ); ?>
						</p>
					</div>
				<?php endif; ?>

				<?php if ( $narrative ) : ?>
					<div class="xfact-case-study-details__narrative xfact-text-secondary">
						<?php echo esc_html( $narrative ); ?>
					</div>
				<?php endif; ?>
			</div>

			<div class="xfact-case-study-details__sidebar">
				<?php xfact_render_case_study_section( 'Challenge', $challenge ); ?>
				<?php xfact_render_case_study_section( 'Services', $services ); ?>
				<?php xfact_render_case_study_section( 'Outcomes', $outcomes ); ?>
			</div>

		</div>
	</div>
</section>
