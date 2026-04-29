<?php
/**
 * Case Study Page block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$wrapper_args = array( 'class' => 'xfact-case-study-page xfact-section' );

$anchor = $attributes['anchor'] ?? '';
if ( $anchor ) {
	$wrapper_args['id'] = $anchor;
}

$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

$source      = $attributes['source'] ?? '';
$study_title = $attributes['title'] ?? '';
$summary     = $attributes['summary'] ?? '';
$client      = $attributes['client'] ?? '';
$challenge   = $attributes['challenge'] ?? array();
$services    = $attributes['services'] ?? array();
$outcomes    = $attributes['outcomes'] ?? array();
$narrative   = $attributes['narrative'] ?? '';

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
		<div class="xfact-case-study-page__section">
			<h3 class="xfact-case-study-page__section-title">
				<?php echo esc_html( $section_title ); ?>
			</h3>
			<ul class="xfact-case-study-page__list">
				<?php foreach ( $items as $item ) : ?>
					<li class="xfact-case-study-page__list-item">
						<span class="xfact-case-study-page__list-bullet" aria-hidden="true"></span>
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
		<div class="xfact-fade-in xfact-case-study-page__inner">
			<div class="xfact-case-study-page__content xfact-card">
				
				<?php if ( $source ) : ?>
					<span class="xfact-case-study-page__source">
						<?php echo esc_html( $source ); ?>
					</span>
				<?php endif; ?>

				<?php if ( $study_title ) : ?>
					<h1 class="xfact-case-study-page__title">
						<?php echo esc_html( $study_title ); ?>
					</h1>
				<?php endif; ?>

				<?php if ( $summary ) : ?>
					<p class="xfact-case-study-page__summary">
						<?php echo esc_html( $summary ); ?>
					</p>
				<?php endif; ?>

				<?php if ( $client ) : ?>
					<div class="xfact-case-study-page__client-box">
						<span class="xfact-case-study-page__client-label">
							Client
						</span>
						<p class="xfact-case-study-page__client-name">
							<?php echo esc_html( $client ); ?>
						</p>
					</div>
				<?php endif; ?>

				<?php xfact_render_case_study_section( 'Challenge', $challenge ); ?>
				<?php xfact_render_case_study_section( 'xFact Solution / Services', $services ); ?>
				<?php xfact_render_case_study_section( 'Outcomes & Success Story', $outcomes ); ?>

				<?php if ( $narrative ) : ?>
					<p class="xfact-case-study-page__narrative">
						<?php echo esc_html( $narrative ); ?>
					</p>
				<?php endif; ?>

			</div>
		</div>
	</div>
</section>
