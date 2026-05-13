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
			$show = isset( $_POST['xfact_show_floating_logo'] ) ? true : false;
			update_option( 'xfact_show_floating_logo', $show );

			$editor_dark_mode = isset( $_POST['xfact_editor_dark_mode'] ) ? true : false;
			update_option( 'xfact_editor_dark_mode', $editor_dark_mode );

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

	$floating_logo_url  = get_option( 'xfact_floating_logo_url', '' );
	$show_floating_logo = (bool) get_option( 'xfact_show_floating_logo', false );
	$editor_dark_mode   = (bool) get_option( 'xfact_editor_dark_mode', false );
	$default_float_logo = get_theme_file_uri( 'assets/images/xfact-icon.svg' );
	$edit_header_url    = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Fheader&canvas=edit' );
	$edit_footer_url    = admin_url( 'site-editor.php?p=%2Fwp_template_part%2Fxfact%2F%2Ffooter&canvas=edit' );
	?>
	<div class="wrap xfact-admin-settings">
		<h1>xFact Branding & Settings</h1>
		<form method="post" style="margin-top: 24px;">
			<?php wp_nonce_field( 'xfact_save_settings', 'xfact_settings_nonce' ); ?>

			<!-- Theme Colors -->
			<div class="xfact-admin-card">
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
									<td><input type="text" name="xfact_color_bg" id="xfact_color_bg" value="<?php echo esc_attr( $c_bg ); ?>" class="xfact-color-picker" data-default-color="#f5f7fa" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_bg_alt">Surface / Cards</label></th>
									<td><input type="text" name="xfact_color_bg_alt" id="xfact_color_bg_alt" value="<?php echo esc_attr( $c_bg_alt ); ?>" class="xfact-color-picker" data-default-color="#ffffff" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_text">Primary Text</label></th>
									<td><input type="text" name="xfact_color_text" id="xfact_color_text" value="<?php echo esc_attr( $c_text ); ?>" class="xfact-color-picker" data-default-color="#1a202c" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_text_secondary">Secondary Text</label></th>
									<td><input type="text" name="xfact_color_text_secondary" id="xfact_color_text_secondary" value="<?php echo esc_attr( $c_text_secondary ); ?>" class="xfact-color-picker" data-default-color="#4a5568" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_accent">Accent Color</label></th>
									<td><input type="text" name="xfact_color_accent" id="xfact_color_accent" value="<?php echo esc_attr( $c_accent ); ?>" class="xfact-color-picker" data-default-color="#5c8ae6" /></td>
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
									<td><input type="text" name="xfact_color_dark_bg" id="xfact_color_dark_bg" value="<?php echo esc_attr( $c_dark_bg ); ?>" class="xfact-color-picker" data-default-color="#09172f" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_dark_bg_alt">Surface / Cards</label></th>
									<td><input type="text" name="xfact_color_dark_bg_alt" id="xfact_color_dark_bg_alt" value="<?php echo esc_attr( $c_dark_bg_alt ); ?>" class="xfact-color-picker" data-default-color="#022038" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_dark_text">Primary Text</label></th>
									<td><input type="text" name="xfact_color_dark_text" id="xfact_color_dark_text" value="<?php echo esc_attr( $c_dark_text ); ?>" class="xfact-color-picker" data-default-color="#ffffff" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_dark_text_secondary">Secondary Text</label></th>
									<td><input type="text" name="xfact_color_dark_text_secondary" id="xfact_color_dark_text_secondary" value="<?php echo esc_attr( $c_dark_text_secondary ); ?>" class="xfact-color-picker" data-default-color="#b3b3b3" /></td>
								</tr>
								<tr>
									<th scope="row"><label for="xfact_color_dark_accent">Accent Color</label></th>
									<td><input type="text" name="xfact_color_dark_accent" id="xfact_color_dark_accent" value="<?php echo esc_attr( $c_dark_accent ); ?>" class="xfact-color-picker" data-default-color="#5c8ae6" /></td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<!-- Floating Logo -->
			<div class="xfact-admin-card">
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
					<button type="button" class="button button-secondary xfact-admin-reset-btn" data-target="#xfact_floating_logo_url" data-preview="#xfact-floating-logo-preview img" data-default="<?php echo esc_url( $default_float_logo ); ?>">
						Reset to Default
					</button>
				</div>
			</div>

			<!-- Editor Dark Mode -->
			<div class="xfact-admin-card">
				<h2>Editor Dark Mode Preview</h2>
				<p class="description">Toggle dark mode rendering inside the Gutenberg block editor canvas by default.</p>
				<div class="xfact-admin-toggle">
					<label for="xfact_editor_dark_mode">
						<input type="checkbox" name="xfact_editor_dark_mode" id="xfact_editor_dark_mode" value="1" <?php checked( $editor_dark_mode ); ?> />
						Enable Dark Mode in Editor
					</label>
					<span class="description">You can also toggle this instantly via the Gutenberg toolbar icon.</span>
				</div>
			</div>
			<div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end;">
				<?php submit_button( 'Save Settings', 'primary', 'submit', false, array( 'class' => 'button-primary' ) ); ?>
			</div>
		</form>

		<!-- Quick Links -->
		<div class="xfact-admin-card" style="margin-top: 40px;">
			<h2>Quick Links</h2>
			<p class="description">Open the Site Editor to edit header or footer template parts.</p>
			<div class="xfact-admin-quick-links">
				<a href="<?php echo esc_url( $edit_header_url ); ?>" class="button button-secondary">Edit Header</a>
				<a href="<?php echo esc_url( $edit_footer_url ); ?>" class="button button-secondary">Edit Footer</a>
			</div>
		</div>

		<!-- Reset Theme Styles -->
		<div class="xfact-admin-card xfact-danger-card">
			<h2>Reset Theme Styles</h2>
			<p class="description">Revert <strong>all</strong> Gutenberg Site Editor customizations (colors, typography, spacing) back to the theme defaults defined in <code>theme.json</code>. This cannot be undone.</p>
			<form method="post" onsubmit="return confirm('Are you sure? This will reset ALL Gutenberg style customizations (colors, fonts, spacing) back to the theme defaults. This action cannot be undone.');">
				<?php wp_nonce_field( 'xfact_save_settings', 'xfact_settings_nonce' ); ?>
				<input type="hidden" name="xfact_reset_global_styles" value="1" />
				<button type="submit" class="xfact-btn-danger">Reset to Theme Defaults</button>
			</form>
		</div>
	</div>
	<?php
}
