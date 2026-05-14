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
 * Helper function for rendering swatch pickers.
 *
 * @param string               $name        The field name.
 * @param string               $current_val The current value.
 * @param array<string,string> $primitives  The available primitive colors.
 * @param string               $default_val The default value.
 * @param bool                 $is_dark     Whether it's a dark mode semantic.
 */
function xfact_render_swatch_picker( string $name, string $current_val, array $primitives, string $default_val, bool $is_dark = false ): void {
	echo '<div style="display: flex; align-items: center; gap: 12px;">';
	echo '<div class="xfact-swatch-picker" data-target="' . esc_attr( $name ) . '" data-default="' . esc_attr( $default_val ) . '" style="position: relative;">';

	$input_class = $is_dark ? 'xfact-dark-semantic-input' : 'xfact-semantic-input';
	if ( strpos( $name, 'xfact_gradient_' ) === 0 ) {
		$input_class = 'xfact-gradient-input';
	}
	echo '<input type="hidden" name="' . esc_attr( $name ) . '" id="' . esc_attr( $name ) . '" value="' . esc_attr( $current_val ) . '" class="' . esc_attr( $input_class ) . '" />';

	$current_hex = isset( $primitives[ $current_val ] ) ? $primitives[ $current_val ] : '#000000';
	echo '<button type="button" class="xfact-swatch-trigger" style="display: flex; align-items: center; gap: 8px; padding: 4px 10px; background: #fff; border: 1px solid #c3c4c7; border-radius: 4px; cursor: pointer; height: 32px; width: 140px; justify-content: flex-start;">';
	echo '<span class="xfact-swatch-preview" style="width: 16px; height: 16px; border-radius: 50%; background-color: ' . esc_attr( $current_hex ) . '; border: 1px solid #cbd5e1; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1); flex-shrink: 0;"></span>';
	echo '<span class="xfact-swatch-label" style="font-size: 13px; font-family: monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; flex-grow: 1;">' . esc_html( $current_val ) . '</span>';
	echo '</button>';

	echo '<div class="xfact-swatch-popover" style="display: none; position: absolute; top: 100%; left: 0; margin-top: 6px; padding: 12px; background: #fff; border: 1px solid #c3c4c7; border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); z-index: 100; min-width: 320px;">';
	echo '<div class="xfact-swatches" style="display: flex; flex-wrap: wrap; gap: 12px;">';
	foreach ( $primitives as $slug => $hex ) {
		$active = ( $slug === $current_val ) ? ' active' : '';
		// Wrapper for circle + text.
		echo '<button type="button" class="xfact-swatch-popover-item' . esc_attr( $active ) . '" data-value="' . esc_attr( $slug ) . '" data-hex="' . esc_attr( $hex ) . '" style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; border: 1px solid transparent; background: transparent; cursor: pointer; padding: 4px; border-radius: 6px; flex: 0 0 auto; width: 68px;">';
		echo '<span style="width: 24px; height: 24px; border-radius: 50%; background-color: ' . esc_attr( $hex ) . '; border: 1px solid #cbd5e1; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);"></span>';
		echo '<span style="font-size: 10px; font-family: monospace; color: #475569; text-align: center;">' . esc_html( $slug ) . '</span>';
		echo '</button>';
	}
	echo '</div></div></div>';
	echo '<button type="button" data-target="' . esc_attr( $name ) . '" data-default="' . esc_attr( $default_val ) . '" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 32px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>';
	echo '</div>';
}

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
			/*
			Normal settings save.
			*/
			// Save legacy colors just in case.
			$colors = array( 'bg', 'bg_alt', 'text', 'text_secondary', 'accent', 'dark_bg', 'dark_bg_alt', 'dark_text', 'dark_text_secondary', 'dark_accent' );
			foreach ( $colors as $color ) {
				$key = 'xfact_color_' . $color;
				if ( isset( $_POST[ $key ] ) ) {
					update_option( $key, sanitize_hex_color( wp_unslash( $_POST[ $key ] ) ) );
				}
			}

			// Save new dynamic colors.
			foreach ( $_POST as $key => $val ) {
				if ( strpos( $key, 'xfact_primitive_' ) === 0 || strpos( $key, 'xfact_semantic_' ) === 0 || strpos( $key, 'xfact_dark_semantic_' ) === 0 || strpos( $key, 'xfact_gradient_' ) === 0 ) {
					// validate if it's a hex or a string slug.
					if ( strpos( $val, '#' ) === 0 ) {
						update_option( $key, sanitize_hex_color( wp_unslash( $val ) ) );
					} else {
						update_option( $key, sanitize_text_field( wp_unslash( $val ) ) );
					}
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

			echo '<div class="notice notice-success is-dismissible xfact-toast"><p>Settings saved.</p></div>';
		}
	}

	// Fetch Primitives.
				$prim_defs  = array(
					'blue-900'   => '#14419F',
					'blue-500'   => '#007AFF',
					'blue-300'   => '#83CBFF',
					'navy-900'   => '#182849',
					'red-500'    => '#CD163F',
					'orange-500' => '#FF9300',
					'green-500'  => '#379B53',
					'black'      => '#000000',
					'white'      => '#ffffff',
				);
				$primitives = array();
				foreach ( $prim_defs as $slug => $hex ) {
					$primitives[ $slug ] = get_option( 'xfact_primitive_' . str_replace( '-', '_', $slug ), $hex );
				}

				// Fetch Semantics.
				$sem_defs  = array(
					'primary'        => 'blue-500',
					'primary-dark'   => 'blue-900',
					'primary-light'  => 'blue-300',
					'text-primary'   => 'black',
					'text-secondary' => 'navy-900',
					'surface'        => 'white',
					'surface-alt'    => 'white',
					'success'        => 'green-500',
					'warning'        => 'orange-500',
					'danger'         => 'red-500',
				);
				$semantics = array();
				foreach ( $sem_defs as $k => $v ) {
					$semantics[ $k ] = get_option( 'xfact_semantic_' . str_replace( '-', '_', $k ), $v );
				}

				// Fetch Dark Semantics.
					$dark_sem_defs  = array(
						'primary'        => 'blue-300',
						'primary-dark'   => 'white',
						'primary-light'  => 'navy-900',
						'text-primary'   => 'white',
						'text-secondary' => 'white',
						'surface'        => 'black',
						'surface-alt'    => 'navy-900',
						'success'        => 'green-500',
						'warning'        => 'orange-500',
						'danger'         => 'red-500',
					);
					$dark_semantics = array();
					foreach ( $dark_sem_defs as $k => $v ) {
						$dark_semantics[ $k ] = get_option( 'xfact_dark_semantic_' . str_replace( '-', '_', $k ), $v );
					}

					// Fetch Gradients.
					$grad_defs = array(
						'primary-1'   => array(
							'start' => 'blue-500',
							'end'   => 'blue-500',
							'angle' => '90',
						),
						'primary-2'   => array(
							'start' => 'blue-900',
							'end'   => 'blue-300',
							'angle' => '90',
						),
						'secondary-1' => array(
							'start' => 'navy-900',
							'end'   => 'navy-900',
							'angle' => '90',
						),
						'secondary-2' => array(
							'start' => 'navy-900',
							'end'   => 'orange-500',
							'angle' => '90',
						),
						'secondary-3' => array(
							'start' => 'navy-900',
							'end'   => 'red-500',
							'angle' => '90',
						),
						'secondary-4' => array(
							'start' => 'navy-900',
							'end'   => 'green-500',
							'angle' => '90',
						),
					);
					$gradients = array();
					foreach ( $grad_defs as $k => $v ) {
						$gradients[ $k ] = array(
							'start' => get_option( 'xfact_gradient_' . str_replace( '-', '_', $k ) . '_start', $v['start'] ),
							'end'   => get_option( 'xfact_gradient_' . str_replace( '-', '_', $k ) . '_end', $v['end'] ),
							'angle' => get_option( 'xfact_gradient_' . str_replace( '-', '_', $k ) . '_angle', $v['angle'] ),
						);
					}

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
						
						<!-- PRIMITIVE COLORS -->
						<div class="xfact-settings-section">
							<h2>Primitive Colors</h2>
							<p class="description">The foundational hex codes from the design guide. Change these to update all semantic colors referencing them.</p>
							
							<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-top: 20px;">
								<?php
								foreach ( $prim_defs as $slug => $default_hex ) :
									$key   = 'xfact_primitive_' . str_replace( '-', '_', $slug );
									$val   = $primitives[ $slug ];
									$label = $slug;
									?>
									<div class="xfact-primitive-item" style="display: flex; flex-direction: column; gap: 8px;">
										<label for="<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $label ); ?></strong></label>
										<div style="display: flex; align-items: center; gap: 8px;">
											<input type="text" name="<?php echo esc_attr( $key ); ?>" id="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $val ); ?>" class="xfact-color-picker xfact-primitive-input" data-default-color="<?php echo esc_attr( $default_hex ); ?>" data-slug="<?php echo esc_attr( $slug ); ?>" />
											<button type="button" data-target="<?php echo esc_attr( $key ); ?>" data-default="<?php echo esc_attr( $default_hex ); ?>" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 30px;" title="Reset to Default" aria-label="Reset to Default"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
										</div>
									</div>
								<?php endforeach; ?>
							</div>
						</div>

						<hr class="xfact-section-divider" />

						<!-- SEMANTIC COLORS -->
						<div class="xfact-settings-section">
							<h2>Semantic Colors</h2>
							<p class="description">Map your functional tokens to Primitive Colors. Configure both Light and Dark mode mappings side-by-side.</p>
							
							<table class="form-table" role="presentation">
								<thead>
									<tr>
										<th scope="col" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0;"><strong>Token</strong></th>
										<th scope="col" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; width: 35%;"><strong>Light Mode</strong></th>
										<th scope="col" style="padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; width: 35%; background: #f1f5f9; padding-left: 16px; border-radius: 8px 8px 0 0;"><strong>Dark Mode</strong></th>
									</tr>
								</thead>
								<tbody>
									<?php
									$sem_descriptions = array(
										'primary'        => 'Main brand color. Used for primary buttons, active links, and focus rings.',
										'primary-dark'   => 'Dark brand accent. Used for Header/Hero backgrounds, button hover states, and dark sections.',
										'primary-light'  => 'Light brand accent. Reserved for subtle highlights and accents.',
										'text-primary'   => 'Main text color for body paragraphs and headings.',
										'text-secondary' => 'Muted text color for captions, list items, borders, and footer links.',
										'surface'        => 'Main background color. Used for the default page background and Feature Cards.',
										'surface-alt'    => 'Secondary background. Used for the Footer, Contact form, Cards, and alternating sections.',
										'success'        => 'Reserved for future use (e.g., success messages and positive indicators).',
										'warning'        => 'Reserved for future use (e.g., warning alerts and pending statuses).',
										'danger'         => 'Reserved for future use (e.g., error messages and destructive actions).',
									);
									foreach ( $sem_defs as $slug => $default_val ) :
										$key_light = 'xfact_semantic_' . str_replace( '-', '_', $slug );
										$val_light = $semantics[ $slug ];
										$label     = ucwords( str_replace( '-', ' ', $slug ) );
										$desc      = $sem_descriptions[ $slug ];

										$key_dark         = 'xfact_dark_semantic_' . str_replace( '-', '_', $slug );
										$val_dark         = $dark_semantics[ $slug ];
										$default_val_dark = $dark_sem_defs[ $slug ];
										?>
									<tr>
										<th scope="row" style="border-bottom: none; vertical-align: top; padding-top: 20px;">
											<label style="font-weight: 600; font-size: 14px; display: block; margin-bottom: 4px;"><?php echo esc_html( $label ); ?></label>
											<p class="description" style="font-size: 12px; margin: 0; line-height: 1.4; max-width: 250px;"><?php echo esc_html( $desc ); ?></p>
										</th>
										<td style="border-bottom: none; vertical-align: top; padding-top: 20px;">
											<?php xfact_render_swatch_picker( $key_light, $val_light, $primitives, $default_val ); ?>
										</td>
										<td style="background: #f1f5f9; padding-left: 16px; border-bottom: none; vertical-align: top; padding-top: 20px;">
											<?php xfact_render_swatch_picker( $key_dark, $val_dark, $primitives, $default_val_dark, true ); ?>
										</td>
									</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						</div>

						<hr class="xfact-section-divider" />

						<!-- GRADIENTS -->
						<div class="xfact-settings-section">
							<h2>Gradients</h2>
							<p class="description">Select Start and End primitive colors for the theme's gradients.</p>
							
							<table class="form-table" role="presentation">
								<tbody>
									<?php
									foreach ( $grad_defs as $slug => $default_vals ) :
										$key_start = 'xfact_gradient_' . str_replace( '-', '_', $slug ) . '_start';
										$val_start = $gradients[ $slug ]['start'];
										$key_end   = 'xfact_gradient_' . str_replace( '-', '_', $slug ) . '_end';
										$val_end   = $gradients[ $slug ]['end'];
										$key_angle = 'xfact_gradient_' . str_replace( '-', '_', $slug ) . '_angle';
										$val_angle = $gradients[ $slug ]['angle'];
										$label     = ucwords( str_replace( '-', ' ', $slug ) );
										?>
									<tr>
										<th scope="row"><label><?php echo esc_html( $label ); ?></label></th>
										<td>
											<div style="display: flex; align-items: center; gap: 16px;">
												<div>
													<span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Start</span>
													<?php xfact_render_swatch_picker( $key_start, $val_start, $primitives, $default_vals['start'] ); ?>
												</div>
												<div>
													<span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">End</span>
													<?php xfact_render_swatch_picker( $key_end, $val_end, $primitives, $default_vals['end'] ); ?>
												</div>
												<div>
													<span style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Angle (deg)</span>
													<div style="display: flex; align-items: center; gap: 8px;">
														<input type="number" name="<?php echo esc_attr( $key_angle ); ?>" id="<?php echo esc_attr( $key_angle ); ?>" value="<?php echo esc_attr( $val_angle ); ?>" style="width: 70px; height: 32px;" />
														<button type="button" class="button button-secondary xfact-reset-color-btn" style="padding: 0 8px; display: flex; align-items: center; justify-content: center; height: 32px;" title="Reset to Default" aria-label="Reset to Default" data-target="<?php echo esc_attr( $key_angle ); ?>" data-default="<?php echo esc_attr( $default_vals['angle'] ); ?>"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></button>
													</div>
												</div>
											</div>
										</td>
									</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						</div>
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
							<button type="button" class="xfact-theme-btn" data-theme="light">Light</button>
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
