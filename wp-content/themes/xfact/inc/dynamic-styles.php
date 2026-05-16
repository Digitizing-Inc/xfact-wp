<?php
/**
 * Dynamic Styles Generator
 *
 * Fetches user-configured colors from the xFact Settings page
 * and injects them as CSS variables into the frontend and block editor.
 *
 * @package xfact
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit();
}

/**
 * Generate and output the dynamic CSS variables.
 */
function xfact_output_dynamic_styles(): void {
	$css = xfact_get_dynamic_css(); ?>
	<style id="xfact-dynamic-theme-colors">
		<?php
		echo $css;// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS is generated internally.
		?>
	</style>
	<?php
}

/**
 * Generate the CSS string for dynamic styles.
 *
 * @return string The generated CSS.
 */
function xfact_get_dynamic_css(): string {
	// Fetch Primitive Colors.
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
	foreach ( $prim_defs as $k => $v ) {
		$primitives[ $k ] = get_option(
			'xfact_primitive_' . str_replace( '-', '_', $k ),
			$v,
		);
	}

	// Fetch Semantic Colors.
	$sem_defs  = array(
		'primary'        => 'blue-500',
		'primary-dark'   => 'blue-900',
		'primary-light'  => 'blue-300',
		'text-primary'   => 'black',
		'text-secondary' => 'navy-900',
		'surface'        => 'white',
		'surface-alt'    => 'blue-900',
		'success'        => 'green-500',
		'warning'        => 'orange-500',
		'danger'         => 'red-500',
	);
	$semantics = array();
	foreach ( $sem_defs as $k => $v ) {
		$semantics[ $k ] = get_option( 'xfact_semantic_' . str_replace( '-', '_', $k ), $v );
	}

	// Fetch Dark Semantic Colors.
	$dark_sem_defs  = array(
		'primary'        => 'blue-300',
		'primary-dark'   => 'blue-300',
		'primary-light'  => 'blue-300',
		'text-primary'   => 'white',
		'text-secondary' => 'white',
		'surface'        => 'black',
		'surface-alt'    => 'black',
		'success'        => 'green-500',
		'warning'        => 'orange-500',
		'danger'         => 'red-500',
	);
	$dark_semantics = array();
	foreach ( $dark_sem_defs as $k => $v ) {
		$dark_semantics[ $k ] = get_option(
			'xfact_dark_semantic_' . str_replace( '-', '_', $k ),
			$v,
		);
	}

	$css = ":root, html, body {\n";

	// Output Primitives.
	foreach ( $primitives as $slug => $hex ) {
		$css .= "\t--xfact-primitive-{$slug}: {$hex};\n";
	}

	// Output Semantics mapping to primitives.
	foreach ( $semantics as $slug => $prim_slug ) {
		$css .= "\t--xfact-semantic-{$slug}: var(--xfact-primitive-{$prim_slug});\n";
	}

	// Compatibility overrides for Gutenberg Presets.
	$css .= "\t--wp--preset--color--surface: var(--xfact-semantic-surface);\n";
	$css .= "\t--wp--preset--color--surface-alt: var(--xfact-semantic-surface-alt);\n";
	$css .=
		"\t--wp--preset--color--text-primary: var(--xfact-semantic-text-primary);\n";
	$css .=
		"\t--wp--preset--color--text-secondary: color-mix(in srgb, var(--xfact-semantic-text-secondary) 60%, transparent);\n";

	// Theme custom CSS variable mappings.
	$css .= "\t--has-surface-background-color: var(--xfact-semantic-surface);\n";

	$css .=
		"\t--has-surface-background-color-card: var(--xfact-semantic-surface);\n";
	$css .= "\t--xfact-dark-section: var(--xfact-semantic-primary-dark);\n";
	$css .= "\t--xfact-dark-section-text: var(--xfact-primitive-white);\n";
	$css .= "}\n\n";

	// Output Dark Mode Semantic Overrides.
	$css .=
		"html[data-theme=\"dark\"] body, [data-theme=\"dark\"] .editor-styles-wrapper, .editor-styles-wrapper[data-theme=\"dark\"] {\n";
	foreach ( $dark_semantics as $slug => $prim_slug ) {
		$var_val = "var(--xfact-primitive-{$prim_slug})";

		$css .= "\t--xfact-semantic-{$slug}: {$var_val};\n";

		if ( 'text-secondary' === $slug ) {
			$css .= "\t--wp--preset--color--{$slug}: color-mix(in srgb, var(--xfact-semantic-{$slug}) 60%, transparent);\n";
		} else {
			$css .= "\t--wp--preset--color--{$slug}: {$var_val};\n";
		}
	}
	$css .= "}\n";

	return $css;
}

// Inject into frontend <head> late enough to override global.css.
add_action( 'wp_head', 'xfact_output_dynamic_styles', 100 );

// Inject into block editor iframe <head>.
add_action( 'admin_print_styles', 'xfact_output_dynamic_styles', 5 );
add_action(
	'enqueue_block_editor_assets',
	function () {
		$css = xfact_get_dynamic_css();
		wp_add_inline_style( 'wp-block-library', $css );
	},
	100,
);
