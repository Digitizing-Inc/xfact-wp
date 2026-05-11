<?php
/**
 * Team Grid block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$label   = $attributes['sectionLabel'] ?? '';
$heading = $attributes['heading'] ?? '';
$members = $attributes['teamMembers'] ?? array();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-team-grid xfact-section' )
);

?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-fade-in">
			<?php if ( $label ) : ?>
				<p class="xfact-section-label"><?php echo esc_html( $label ); ?></p>
			<?php endif; ?>
			<?php if ( $heading ) : ?>
				<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
			<?php endif; ?>

			<?php if ( ! empty( $members ) ) : ?>
				<div class="xfact-team-grid__grid">
					<?php foreach ( $members as $member ) : ?>
						<div class="xfact-team-grid__card">
							<?php if ( ! empty( $member['imageUrl'] ) ) : ?>
								<div class="xfact-team-grid__image-wrapper">
									<img src="<?php echo esc_url( $member['imageUrl'] ); ?>" alt="<?php echo esc_attr( $member['name'] ?? '' ); ?>" class="xfact-team-grid__image" loading="lazy" />
								</div>
							<?php endif; ?>
							
							<div class="xfact-team-grid__content">
								<h3 class="xfact-team-grid__name xfact-text"><?php echo esc_html( $member['name'] ?? '' ); ?></h3>
								
								<?php if ( ! empty( $member['title'] ) ) : ?>
									<p class="xfact-team-grid__title xfact-text-secondary"><?php echo esc_html( $member['title'] ); ?></p>
								<?php endif; ?>

								<?php if ( ! empty( $member['socialLinks'] ) ) : ?>
									<div class="xfact-team-grid__socials">
										<?php foreach ( $member['socialLinks'] as $social_link ) : ?>
											<?php if ( ! empty( $social_link['url'] ) ) : ?>
												<a href="<?php echo esc_url( $social_link['url'] ); ?>" class="xfact-team-grid__social-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $social_link['type'] ?? 'website' ); ?>">
													<?php
													// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in social-icons.php.
													echo xfact_get_social_icon( $social_link['type'] ?? 'website', 'xfact-team-grid__social-icon' );
													?>
												</a>
											<?php endif; ?>
										<?php endforeach; ?>
									</div>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
