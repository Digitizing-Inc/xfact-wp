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
	wp_enqueue_style(
		'xfact-admin-settings',
		get_theme_file_uri( 'assets/css/admin-settings.css' ),
		array(),
		wp_get_theme()->get( 'Version' )
	);
	wp_enqueue_script(
		'xfact-admin-settings',
		get_theme_file_uri( 'assets/js/admin-settings.js' ),
		array( 'jquery' ),
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
		if ( isset( $_POST['xfact_site_logo_url'] ) ) {
			update_option( 'xfact_site_logo_url', esc_url_raw( wp_unslash( $_POST['xfact_site_logo_url'] ) ) );
		}
		if ( isset( $_POST['xfact_floating_logo_url'] ) ) {
			update_option( 'xfact_floating_logo_url', esc_url_raw( wp_unslash( $_POST['xfact_floating_logo_url'] ) ) );
		}
		$show = isset( $_POST['xfact_show_floating_logo'] ) ? true : false;
		update_option( 'xfact_show_floating_logo', $show );

		echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
	}

	$site_logo_url      = get_option( 'xfact_site_logo_url', '' );
	$floating_logo_url  = get_option( 'xfact_floating_logo_url', '' );
	$show_floating_logo = (bool) get_option( 'xfact_show_floating_logo', false );
	$default_site_logo  = get_theme_file_uri( 'assets/images/xfact-wordmark-white.png' );
	$default_float_logo = get_theme_file_uri( 'assets/images/xfact-icon.svg' );
	$edit_header_url    = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Fheader&canvas=edit' );
	$edit_footer_url    = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Ffooter&canvas=edit' );
	?>
	<div class="wrap xfact-admin-settings">
		<h1>xFact Settings</h1>
		<form method="post">
			<?php wp_nonce_field( 'xfact_save_settings', 'xfact_settings_nonce' ); ?>

			<!-- Site Logo -->
			<div class="xfact-admin-card">
				<h2>Site Logo</h2>
				<p class="description">The wordmark logo used in the header and footer. Upload a replacement to apply it globally. Edit a template part directly for a per-pattern override.</p>
				<div class="xfact-admin-logo-preview" id="xfact-site-logo-preview">
					<img src="<?php echo esc_url( $site_logo_url ? $site_logo_url : $default_site_logo ); ?>" alt="Site logo" />
				</div>
				<input type="hidden" name="xfact_site_logo_url" id="xfact_site_logo_url" value="<?php echo esc_attr( $site_logo_url ); ?>" />
				<button type="button" class="button xfact-admin-upload-btn" data-target="#xfact_site_logo_url" data-preview="#xfact-site-logo-preview img">
					Replace Site Logo
				</button>
			</div>

			<!-- Floating Logo -->
			<div class="xfact-admin-card">
				<h2>Floating Logo</h2>
				<p class="description">This logo appears as a watermark in all blocks that have "Show Floating Logo" enabled.</p>
				<div class="xfact-admin-toggle">
					<label for="xfact_show_floating_logo">
						<input type="checkbox" name="xfact_show_floating_logo" id="xfact_show_floating_logo" value="1" <?php checked( $show_floating_logo ); ?> />
						Show Floating Logo
					</label>
					<span class="description">Visible on all blocks unless overridden per-block.</span>
				</div>
				<div class="xfact-admin-logo-preview" id="xfact-floating-logo-preview">
					<img src="<?php echo esc_url( $floating_logo_url ? $floating_logo_url : $default_float_logo ); ?>" alt="Floating logo" />
				</div>
				<input type="hidden" name="xfact_floating_logo_url" id="xfact_floating_logo_url" value="<?php echo esc_attr( $floating_logo_url ); ?>" />
				<button type="button" class="button xfact-admin-upload-btn" data-target="#xfact_floating_logo_url" data-preview="#xfact-floating-logo-preview img">
					Replace Floating Logo
				</button>
				<button type="button" class="button xfact-admin-reset-btn" data-target="#xfact_floating_logo_url" data-preview="#xfact-floating-logo-preview img" data-default="<?php echo esc_url( $default_float_logo ); ?>">
					Reset to Default
				</button>
			</div>

			<?php submit_button( 'Save Settings' ); ?>
		</form>

		<!-- Quick Links -->
		<div class="xfact-admin-card">
			<h2>Quick Links</h2>
			<p class="description">Open the Site Editor to edit header or footer template parts.</p>
			<div class="xfact-admin-quick-links">
				<a href="<?php echo esc_url( $edit_header_url ); ?>" class="button">Edit Header</a>
				<a href="<?php echo esc_url( $edit_footer_url ); ?>" class="button">Edit Footer</a>
			</div>
		</div>
	</div>
	<?php
}
