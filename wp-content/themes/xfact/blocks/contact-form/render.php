<?php
/**
 * Contact Form block render.
 *
 * @package xfact
 *
 * @var array<string, mixed> $attributes Block attributes.
 */

declare(strict_types=1);

$heading          = $attributes['heading'] ?? '';
$subtitle         = $attributes['subtitle'] ?? '';
$recipient_email  = $attributes['recipientEmail'] ?? 'info@xfact.com';
$assess_label     = $attributes['assessmentLabel'] ?? '';
$assess_heading   = $attributes['assessmentHeading'] ?? '';
$assess_desc      = $attributes['assessmentDescription'] ?? '';
$assess_checklist = $attributes['assessmentChecklist'] ?? array();
$assess_btn_label = $attributes['assessmentButtonLabel'] ?? '';
$assess_btn_href  = $attributes['assessmentButtonHref'] ?? '#';

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'xfact-contact-form xfact-bg xfact-section xfact-section-border' )
);
?>

<section <?php echo wp_kses_post( $wrapper_attributes ); ?>>
	<div class="xfact-container">
		<div class="xfact-contact-form__layout">
			<div class="xfact-fade-in xfact-contact-form__left">
				<?php if ( $heading ) : ?>
					<h2 class="xfact-section-heading"><?php echo esc_html( $heading ); ?></h2>
				<?php endif; ?>
				<?php if ( $subtitle ) : ?>
					<p class="xfact-section-subtitle"><?php echo esc_html( $subtitle ); ?></p>
				<?php endif; ?>

				<form class="xfact-contact-form__form" action="mailto:<?php echo esc_attr( $recipient_email ); ?>" method="post" enctype="text/plain">
					<div class="xfact-contact-form__row">
						<div class="xfact-contact-form__field">
							<label for="xfact-firstname" class="xfact-contact-form__label"><?php esc_html_e( 'First Name', 'xfact' ); ?> <span class="xfact-contact-form__required">*</span></label>
							<input type="text" id="xfact-firstname" name="firstName" required class="xfact-contact-form__input" />
						</div>
						<div class="xfact-contact-form__field">
							<label for="xfact-lastname" class="xfact-contact-form__label"><?php esc_html_e( 'Last Name', 'xfact' ); ?> <span class="xfact-contact-form__required">*</span></label>
							<input type="text" id="xfact-lastname" name="lastName" required class="xfact-contact-form__input" />
						</div>
					</div>
					<div class="xfact-contact-form__field">
						<label for="xfact-email" class="xfact-contact-form__label"><?php esc_html_e( 'Email', 'xfact' ); ?> <span class="xfact-contact-form__required">*</span></label>
						<input type="email" id="xfact-email" name="email" required class="xfact-contact-form__input" />
					</div>
					<div class="xfact-contact-form__field">
						<label for="xfact-org" class="xfact-contact-form__label"><?php esc_html_e( 'Organization', 'xfact' ); ?></label>
						<input type="text" id="xfact-org" name="organization" class="xfact-contact-form__input" />
					</div>
					<div class="xfact-contact-form__field">
						<label for="xfact-message" class="xfact-contact-form__label"><?php esc_html_e( 'How can we help?', 'xfact' ); ?> <span class="xfact-contact-form__required">*</span></label>
						<textarea id="xfact-message" name="message" rows="4" required class="xfact-contact-form__textarea"></textarea>
					</div>
					<button type="submit" class="xfact-gradient-button xfact-btn-default">
						<?php esc_html_e( 'Send Message', 'xfact' ); ?>
					</button>
				</form>
			</div>

			<?php if ( $assess_heading ) : ?>
				<div class="xfact-fade-in xfact-contact-form__right">
					<div id="assessment" class="xfact-contact-form__assessment xfact-card">
						<?php if ( $assess_label ) : ?>
							<p class="xfact-section-label"><?php echo esc_html( $assess_label ); ?></p>
						<?php endif; ?>
						<h3 class="xfact-contact-form__assess-heading"><?php echo esc_html( $assess_heading ); ?></h3>
						<p class="xfact-contact-form__assess-desc"><?php echo esc_html( $assess_desc ); ?></p>

						<?php if ( ! empty( $assess_checklist ) ) : ?>
							<ul class="xfact-contact-form__checklist">
								<?php foreach ( $assess_checklist as $item ) : ?>
									<li class="xfact-contact-form__checklist-item">
										<?php
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- SVG is hardcoded in icons.php.
										echo xfact_get_icon( 'CheckCircle', 'xfact-contact-form__check-icon' );
										?>
										<span><?php echo esc_html( $item['text'] ?? '' ); ?></span>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>

						<?php if ( $assess_btn_label ) : ?>
							<a href="<?php echo esc_url( $assess_btn_href ); ?>" class="xfact-btn-secondary xfact-btn-default xfact-contact-form__assess-btn">
								<?php echo esc_html( $assess_btn_label ); ?>
							</a>
						<?php endif; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</section>
