<?php
/**
 * Standalone admin settings page for xFact theme.
 *
 * Mirrors every setting available in the Site Editor sidebar
 * so admins can manage branding without entering the editor.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the admin menu page under Appearance.
 */
function xfact_register_admin_settings_page(): void {
	add_theme_page(
		'xFact Settings',
		'xFact Settings',
		'manage_options',
		'xfact-settings',
		'xfact_render_admin_settings_page'
	);
}
add_action( 'admin_menu', 'xfact_register_admin_settings_page' );

/**
 * Enqueue media uploader on the settings page.
 *
 * @param string $hook Current admin page hook.
 */
function xfact_admin_settings_enqueue( string $hook ): void {
	if ( 'appearance_page_xfact-settings' !== $hook ) {
		return;
	}
	wp_enqueue_media();
	wp_enqueue_style( 'wp-color-picker' );
	wp_enqueue_style(
		'xfact-admin-settings',
		get_theme_file_uri( 'assets/css/admin-settings.css' ),
		array(),
		wp_get_theme()->get( 'Version' )
	);
	wp_enqueue_script(
		'xfact-admin-settings',
		get_theme_file_uri( 'assets/js/admin-settings.js' ),
		array( 'jquery', 'wp-color-picker' ),
		wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'admin_enqueue_scripts', 'xfact_admin_settings_enqueue' );

/**
 * Render the admin settings page.
 */
function xfact_render_admin_settings_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	/* Handle form submission */
	if ( isset( $_POST['xfact_settings_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['xfact_settings_nonce'] ) ), 'xfact_save_settings' ) ) {

		/* Reset Global Styles to theme.json defaults */
		if ( isset( $_POST['xfact_reset_global_styles'] ) ) {
			$global_styles = get_posts(
				array(
					'post_type'   => 'wp_global_styles',
					'post_status' => array( 'publish', 'draft' ),
					'numberposts' => 1,
				)
			);
			if ( ! empty( $global_styles ) ) {
				wp_delete_post( $global_styles[0]->ID, true );
				echo '<div class="notice notice-success is-dismissible"><p>Theme styles reset to defaults. All Gutenberg color, typography, and spacing customizations have been reverted.</p></div>';
			} else {
				echo '<div class="notice notice-info is-dismissible"><p>Theme styles are already at defaults — nothing to reset.</p></div>';
			}
		} else {
			/* Normal settings save */
			$colors = array(
				'bg',
				'bg_alt',
				'text',
				'text_secondary',
				'accent',
				'dark_bg',
				'dark_bg_alt',
				'dark_text',
				'dark_text_secondary',
				'dark_accent',
			);
			foreach ( $colors as $color ) {
				$key = 'xfact_color_' . $color;
				if ( isset( $_POST[ $key ] ) ) {
					update_option( $key, sanitize_hex_color( wp_unslash( $_POST[ $key ] ) ) );
				}
			}

			if ( isset( $_POST['xfact_floating_logo_url'] ) ) {
				update_option( 'xfact_floating_logo_url', esc_url_raw( wp_unslash( $_POST['xfact_floating_logo_url'] ) ) );
			}
			if ( isset( $_POST['xfact_primary_logo_url'] ) ) {
				update_option( 'xfact_primary_logo_url', esc_url_raw( wp_unslash( $_POST['xfact_primary_logo_url'] ) ) );
			}
			if ( isset( $_POST['xfact_favicon_url'] ) ) {
				update_option( 'xfact_favicon_url', esc_url_raw( wp_unslash( $_POST['xfact_favicon_url'] ) ) );
			}
			$show = isset( $_POST['xfact_show_floating_logo'] ) ? true : false;
			update_option( 'xfact_show_floating_logo', $show );

			// Typography.
			if ( isset( $_POST['xfact_font_heading'] ) ) {
				update_option( 'xfact_font_heading', sanitize_text_field( wp_unslash( $_POST['xfact_font_heading'] ) ) );
			}
			if ( isset( $_POST['xfact_font_body'] ) ) {
				update_option( 'xfact_font_body', sanitize_text_field( wp_unslash( $_POST['xfact_font_body'] ) ) );
			}

			// Process custom fonts.
			if ( isset( $_POST['xfact_custom_fonts'] ) && is_array( $_POST['xfact_custom_fonts'] ) ) {
				$sanitized_fonts = array();
				// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- We sanitize individual fields below.
				foreach ( wp_unslash( $_POST['xfact_custom_fonts'] ) as $font ) {
					if ( empty( $font['name'] ) || empty( $font['url'] ) ) {
						continue;
					}
					$slug              = sanitize_title( $font['name'] );
					$sanitized_fonts[] = array(
						'name'       => sanitize_text_field( $font['name'] ),
						'slug'       => $slug,
						'url'        => esc_url_raw( $font['url'] ),
						'weight'     => sanitize_text_field( $font['weight'] ?? '400' ),
						'fontFamily' => sanitize_text_field( $font['fontFamily'] ?? $font['name'] ),
					);
				}
				update_option( 'xfact_custom_fonts', $sanitized_fonts );
			} else {
				// If submitted but empty, clear it.
				update_option( 'xfact_custom_fonts', array() );
			}

			echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
		}
	}

	// Fetch color settings.
	$c_bg             = get_option( 'xfact_color_bg', '#f5f7fa' );
	$c_bg_alt         = get_option( 'xfact_color_bg_alt', '#ffffff' );
	$c_text           = get_option( 'xfact_color_text', '#1a202c' );
	$c_text_secondary = get_option( 'xfact_color_text_secondary', '#4a5568' );
	$c_accent         = get_option( 'xfact_color_accent', '#5c8ae6' );

	$c_dark_bg             = get_option( 'xfact_color_dark_bg', '#09172f' );
	$c_dark_bg_alt         = get_option( 'xfact_color_dark_bg_alt', '#022038' );
	$c_dark_text           = get_option( 'xfact_color_dark_text', '#ffffff' );
	$c_dark_text_secondary = get_option( 'xfact_color_dark_text_secondary', '#b3b3b3' );
	$c_dark_accent         = get_option( 'xfact_color_dark_accent', '#5c8ae6' );

	$floating_logo_url = get_option( 'xfact_floating_logo_url', '' );
	$primary_logo_url  = get_option( 'xfact_primary_logo_url', '' );
	$favicon_url       = get_option( 'xfact_favicon_url', '' );

	$show_floating_logo = (bool) get_option( 'xfact_show_floating_logo', false );

	$font_heading = xfact_get_font_heading();
	$font_body    = xfact_get_font_body();
	$custom_fonts = xfact_get_custom_fonts();

	$default_float_logo   = get_theme_file_uri( 'assets/images/brand/xfact-logomark.png' );
	$default_primary_logo = get_theme_file_uri( 'assets/images/brand/xfact-wordmark-white.png' );
	$default_favicon      = get_theme_file_uri( 'assets/images/brand/favicon.ico' );

	$edit_header_url = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Fheader&canvas=edit' );
	$edit_footer_url = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Ffooter&canvas=edit' );
	?>
	<div class="wrap xfact-admin-settings">
		<h1>xFact Branding & Settings</h1>
		
		<form method="post" id="xfact-settings-form">
			<?php wp_nonce_field( 'xfact_save_settings', 'xfact_settings_nonce' ); ?>
			
			<div class="xfact-settings-container">
				<div class="xfact-settings-header-bar">
					<div class="xfact-tabs" id="xfact-tabs">
						<a href="#tab-branding" class="xfact-tab xfact-active-tab">Branding</a>
						<a href="#tab-colors" class="xfact-tab">Colors</a>
						<a href="#tab-typography" class="xfact-tab">Typography</a>
						<a href="#tab-tools" class="xfact-tab">Tools</a>
					</div>
					<div class="xfact-save-actions">
						<button type="button" class="button button-secondary" id="xfact-jump-to-preview" style="margin-right: 12px;">Jump to Live Preview ↓</button>
						<?php submit_button( 'Save Settings', 'primary', 'submit', false, array( 'class' => 'button-primary' ) ); ?>
					</div>
				</div>
				<div class="xfact-settings-body">

					<!-- TAB: BRANDING -->
					<div class="xfact-tab-content xfact-active-tab-content" id="tab-branding">
						
						<!-- Primary Brand Assets -->
						<div class="xfact-settings-section">
							<h2>Primary Brand Assets</h2>
							<p class="description">Configure the primary logo used in headers/footers, and the site favicon.</p>
							
							<!-- Primary Logo -->
							<div style="margin-bottom: 24px;">
								<h3>Primary Logo</h3>
								<div class="xfact-admin-logo-preview" id="xfact-primary-logo-preview" style="background:#09172f; padding: 20px;">
									<img src="<?php echo esc_url( $primary_logo_url ? $primary_logo_url : $default_primary_logo ); ?>" alt="Primary logo" style="max-width: 200px; height: auto;" />
								</div>
								<input type="hidden" name="xfact_primary_logo_url" id="xfact_primary_logo_url" value="<?php echo esc_attr( $primary_logo_url ); ?>" />
								<div class="xfact-btn-group" style="margin-top: 12px;">
									<button type="button" class="button button-secondary xfact-admin-upload-btn" data-target="#xfact_primary_logo_url" data-preview="#xfact-primary-logo-preview img">
										Replace Primary Logo
									</button>
									<button type="button" class="button button-secondary xfact-admin-reset-btn" style="padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; height: 30px;" data-target="#xfact_primary_logo_url" data-preview="#xfact-primary-logo-preview img" data-default="<?php echo esc_url( $default_primary_logo ); ?>" title="Reset to Default" aria-label="Reset to Default">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
									</button>
								</div>
							</div>

							<!-- Favicon -->
							<div>
								<h3>Favicon</h3>
								<div class="xfact-admin-logo-preview" id="xfact-favicon-preview" style="padding: 20px;">
									<img src="<?php echo esc_url( $favicon_url ? $favicon_url : $default_favicon ); ?>" alt="Favicon" style="max-width: 64px; height: auto; padding: 8px;" />
								</div>
								<input type="hidden" name="xfact_favicon_url" id="xfact_favicon_url" value="<?php echo esc_attr( $favicon_url ); ?>" />
								<div class="xfact-btn-group" style="margin-top: 12px;">
									<button type="button" class="button button-secondary xfact-admin-upload-btn" data-target="#xfact_favicon_url" data-preview="#xfact-favicon-preview img">
										Replace Favicon
									</button>
									<button type="button" class="button button-secondary xfact-admin-reset-btn" style="padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; height: 30px;" data-target="#xfact_favicon_url" data-preview="#xfact-favicon-preview img" data-default="<?php echo esc_url( $default_favicon ); ?>" title="Reset to Default" aria-label="Reset to Default">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
									</button>
								</div>
							</div>
						</div> <!-- End Primary Brand Assets -->

						<hr class="xfact-section-divider" />

						<!-- Floating Logo -->
						<div class="xfact-settings-section">
							<h2>Floating Logo</h2>
							<p class="description">This logo appears as a watermark globally across all compatible blocks.</p>
							<div class="xfact-admin-toggle">
								<label for="xfact_show_floating_logo">
									<input type="checkbox" name="xfact_show_floating_logo" id="xfact_show_floating_logo" value="1" <?php checked( $show_floating_logo ); ?> />
									Show Floating Logo
								</label>
								<span class="description">Enable or disable the floating watermark globally across the entire site.</span>
							</div>
							<div class="xfact-admin-logo-preview" id="xfact-floating-logo-preview">
								<img src="<?php echo esc_url( $floating_logo_url ? $floating_logo_url : $default_float_logo ); ?>" alt="Floating logo" />
							</div>
							<input type="hidden" name="xfact_floating_logo_url" id="xfact_floating_logo_url" value="<?php echo esc_attr( $floating_logo_url ); ?>" />
							<div class="xfact-btn-group">
								<button type="button" class="button button-secondary xfact-admin-upload-btn" data-target="#xfact_floating_logo_url" data-preview="#xfact-floating-logo-preview img">
									Replace Floating Logo
								</button>
								<button type="button" class="button button-secondary xfact-admin-reset-btn" style="padding: 0 8px; display: inline-flex; align-items: center; justify-content: center; height: 30px;" data-target="#xfact_floating_logo_url" data-preview="#xfact-floating-logo-preview img" data-default="<?php echo esc_url( $default_float_logo ); ?>" title="Reset to Default" aria-label="Reset to Default">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
								</button>
							</div>
						</div> <!-- End Floating Logo -->

					</div> <!-- End TAB: BRANDING -->

					<!-- TAB: COLORS -->
					<div class="xfact-tab-content" id="tab-colors" style="display: none;">
						<div class="xfact-settings-section">
							<h2>Theme Colors</h2>
							<p class="description">Configure the primary branding colors for both Light and Dark modes. These variables power all Gutenberg blocks globally.</p>
							
							<div class="xfact-palette-container">
								<!-- Light Mode Palette -->
								<div class="xfact-palette">
									<h3>Light Mode</h3>
									<table class="form-table" role="presentation">
										<tbody>
											<tr>
												<th scope="row"><label for="xfact_color_bg">Background</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_bg" id="xfact_color_bg" value="<?php echo esc_attr( $c_bg ); ?>" class="xfact-color-picker" data-default-color="#f5f7fa" />
														<button type="button" data-target="xfact_color_bg" data-default="#f5f7fa" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_bg_alt">Surface / Cards</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_bg_alt" id="xfact_color_bg_alt" value="<?php echo esc_attr( $c_bg_alt ); ?>" class="xfact-color-picker" data-default-color="#ffffff" />
														<button type="button" data-target="xfact_color_bg_alt" data-default="#ffffff" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_text">Primary Text</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_text" id="xfact_color_text" value="<?php echo esc_attr( $c_text ); ?>" class="xfact-color-picker" data-default-color="#1a202c" />
														<button type="button" data-target="xfact_color_text" data-default="#1a202c" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_text_secondary">Secondary Text</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_text_secondary" id="xfact_color_text_secondary" value="<?php echo esc_attr( $c_text_secondary ); ?>" class="xfact-color-picker" data-default-color="#4a5568" />
														<button type="button" data-target="xfact_color_text_secondary" data-default="#4a5568" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_accent">Accent Color</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_accent" id="xfact_color_accent" value="<?php echo esc_attr( $c_accent ); ?>" class="xfact-color-picker" data-default-color="#5c8ae6" />
														<button type="button" data-target="xfact_color_accent" data-default="#5c8ae6" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>

								<!-- Dark Mode Palette -->
								<div class="xfact-palette dark-mode">
									<h3>Dark Mode</h3>
									<table class="form-table" role="presentation">
										<tbody>
											<tr>
												<th scope="row"><label for="xfact_color_dark_bg">Background</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_dark_bg" id="xfact_color_dark_bg" value="<?php echo esc_attr( $c_dark_bg ); ?>" class="xfact-color-picker" data-default-color="#09172f" />
														<button type="button" data-target="xfact_color_dark_bg" data-default="#09172f" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_dark_bg_alt">Surface / Cards</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_dark_bg_alt" id="xfact_color_dark_bg_alt" value="<?php echo esc_attr( $c_dark_bg_alt ); ?>" class="xfact-color-picker" data-default-color="#022038" />
														<button type="button" data-target="xfact_color_dark_bg_alt" data-default="#022038" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_dark_text">Primary Text</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_dark_text" id="xfact_color_dark_text" value="<?php echo esc_attr( $c_dark_text ); ?>" class="xfact-color-picker" data-default-color="#ffffff" />
														<button type="button" data-target="xfact_color_dark_text" data-default="#ffffff" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_dark_text_secondary">Secondary Text</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_dark_text_secondary" id="xfact_color_dark_text_secondary" value="<?php echo esc_attr( $c_dark_text_secondary ); ?>" class="xfact-color-picker" data-default-color="#b3b3b3" />
														<button type="button" data-target="xfact_color_dark_text_secondary" data-default="#b3b3b3" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
											<tr>
												<th scope="row"><label for="xfact_color_dark_accent">Accent Color</label></th>
												<td>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="text" name="xfact_color_dark_accent" id="xfact_color_dark_accent" value="<?php echo esc_attr( $c_dark_accent ); ?>" class="xfact-color-picker" data-default-color="#5c8ae6" />
														<button type="button" data-target="xfact_color_dark_accent" data-default="#5c8ae6" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div> <!-- End Palette Container -->
						</div> <!-- End Theme Colors -->
					</div> <!-- End TAB: COLORS -->

					<!-- TAB: TYPOGRAPHY -->
					<div class="xfact-tab-content" id="tab-typography" style="display: none;">
						<div class="xfact-settings-section">
							<h2>Typography Settings</h2>
							<p class="description">Select the font families for headings and body text. You can also upload custom fonts below.</p>
							
							<table class="form-table" role="presentation">
								<tbody>
									<tr>
										<th scope="row"><label for="xfact_font_heading">Heading Font</label></th>
										<td>
											<div style="display: flex; align-items: center; gap: 8px;">
												<select name="xfact_font_heading" id="xfact_font_heading">
													<option value="inter" <?php selected( $font_heading, 'inter' ); ?>>Inter (Default)</option>
													<option value="ibm-plex-mono" <?php selected( $font_heading, 'ibm-plex-mono' ); ?>>IBM Plex Mono</option>
													<?php foreach ( $custom_fonts as $font ) : ?>
														<option value="<?php echo esc_attr( $font['slug'] ); ?>" <?php selected( $font_heading, $font['slug'] ); ?>><?php echo esc_html( $font['name'] ); ?></option>
													<?php endforeach; ?>
												</select>
												<button type="button" class="button button-secondary xfact-reset-font-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default" data-target="xfact_font_heading" data-default="inter"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
											</div>
										</td>
									</tr>
									<tr>
										<th scope="row"><label for="xfact_font_body">Body Font</label></th>
										<td>
											<div style="display: flex; align-items: center; gap: 8px;">
												<select name="xfact_font_body" id="xfact_font_body">
													<option value="inter" <?php selected( $font_body, 'inter' ); ?>>Inter</option>
													<option value="ibm-plex-mono" <?php selected( $font_body, 'ibm-plex-mono' ); ?>>IBM Plex Mono (Default)</option>
													<?php foreach ( $custom_fonts as $font ) : ?>
														<option value="<?php echo esc_attr( $font['slug'] ); ?>" <?php selected( $font_body, $font['slug'] ); ?>><?php echo esc_html( $font['name'] ); ?></option>
													<?php endforeach; ?>
												</select>
												<button type="button" class="button button-secondary xfact-reset-font-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default" data-target="xfact_font_body" data-default="ibm-plex-mono"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
							<hr style="margin: 24px 0; border: 0; border-top: 1px solid #e2e8f0;" />
							
							<h3>Custom Fonts Manager</h3>
							<p class="description">Upload .woff2 files to register custom fonts. They will appear in the dropdowns above after saving.</p>

							<div id="xfact-custom-fonts-container">
								<?php foreach ( $custom_fonts as $index => $font ) : ?>
									<div class="xfact-custom-font-row" data-index="<?php echo esc_attr( (string) $index ); ?>">
										<input type="text" name="xfact_custom_fonts[<?php echo esc_attr( (string) $index ); ?>][name]" value="<?php echo esc_attr( $font['name'] ); ?>" placeholder="Font Name (e.g. Comic Sans)" required />
										<input type="text" name="xfact_custom_fonts[<?php echo esc_attr( (string) $index ); ?>][fontFamily]" value="<?php echo esc_attr( $font['fontFamily'] ); ?>" placeholder="CSS font-family value" required />
										<input type="text" name="xfact_custom_fonts[<?php echo esc_attr( (string) $index ); ?>][weight]" value="<?php echo esc_attr( $font['weight'] ); ?>" placeholder="Weight (e.g. 400)" />
										<input type="text" name="xfact_custom_fonts[<?php echo esc_attr( (string) $index ); ?>][url]" class="xfact-font-url" value="<?php echo esc_attr( $font['url'] ); ?>" placeholder="URL to .woff2 file" required readonly style="width: 300px;" />
										<button type="button" class="button button-secondary xfact-upload-font-btn">Upload .woff2</button>
										<button type="button" class="button xfact-btn-danger xfact-remove-font-btn">Remove</button>
									</div>
								<?php endforeach; ?>
							</div>
							<button type="button" class="button button-secondary" id="xfact-add-font-btn" style="margin-top: 12px;">+ Add Custom Font</button>
						</div> <!-- End Typography Settings -->
					</div> <!-- End TAB: TYPOGRAPHY -->

					<!-- TAB: TOOLS -->
					<div class="xfact-tab-content" id="tab-tools" style="display: none;">
						<!-- Quick Links -->
						<div class="xfact-settings-section">
							<h2>Quick Links</h2>
							<p class="description">Open the Site Editor to edit header or footer template parts.</p>
							<div class="xfact-admin-quick-links">
								<a href="<?php echo esc_url( $edit_header_url ); ?>" class="button button-secondary">Edit Header</a>
								<a href="<?php echo esc_url( $edit_footer_url ); ?>" class="button button-secondary">Edit Footer</a>
							</div>
						</div> <!-- End Quick Links -->

						<hr class="xfact-section-divider" />

						<!-- Reset Theme Styles -->
						<div class="xfact-settings-section xfact-danger-section">
							<h2>Reset Theme Styles</h2>
							<p class="description">Revert <strong>all</strong> Gutenberg Site Editor customizations (colors, typography, spacing) back to the theme defaults defined in <code>theme.json</code>. This cannot be undone.</p>
							<div style="margin-top: 12px;">
								<input type="hidden" name="xfact_reset_global_styles" value="1" id="xfact_reset_global_styles_input" disabled />
								<button type="submit" class="xfact-btn-danger" onclick="if(confirm('Are you sure? This will reset ALL customizations. This action cannot be undone.')){ document.getElementById('xfact_reset_global_styles_input').disabled = false; return true; } return false;">Reset to Theme Defaults</button>
							</div>
						</div> <!-- End Reset Theme Styles -->
					</div> <!-- End TAB: TOOLS -->

				</div> <!-- End xfact-settings-body -->
			</div> <!-- End xfact-settings-container -->

			<!-- LIVE PREVIEW SECTION -->
			<div class="xfact-live-preview-section" id="xfact-live-preview-section" style="margin-top: 40px;">
				<div class="xfact-preview-header">
					<h2>Live Preview</h2>
					<div class="xfact-preview-controls">
						<button type="button" class="button button-secondary" id="xfact-back-to-settings" style="margin-right: 12px;">Back to Settings ↑</button>
						<div class="xfact-preview-theme-toggle">
							<button type="button" class="xfact-theme-btn active" data-theme="light">Light</button>
							<button type="button" class="xfact-theme-btn" data-theme="dark">Dark</button>
						</div>
					</div>
				</div>
				<div class="xfact-preview-canvas">
					<iframe id="xfact-live-preview-iframe" src="<?php echo esc_url( home_url( '/?xfact_preview=1' ) ); ?>" frameborder="0" title="Live Site Preview"></iframe>
				</div>
			</div>
		</form>
	</div>
	<?php
}
