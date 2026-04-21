/**
 * xFact Settings — Editor plugin sidebar.
 *
 * Registers a sidebar panel in the Site Editor / Post Editor
 * for managing global theme settings (floating logo).
 */
( function () {
	'use strict';

	var el          = wp.element.createElement;
	var useState    = wp.element.useState;
	var useEffect   = wp.element.useEffect;
	var Fragment    = wp.element.Fragment;
	var registerPlugin = wp.plugins.registerPlugin;
	var PluginSidebar  = wp.editor.PluginSidebar;
	var PanelBody      = wp.components.PanelBody;
	var Button         = wp.components.Button;
	var ToggleControl  = wp.components.ToggleControl;
	var Spinner        = wp.components.Spinner;
	var MediaUpload      = wp.blockEditor.MediaUpload;
	var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
	var apiFetch   = wp.apiFetch;

	var config = window.xfactSettingsConfig || {};

	/**
	 * Sidebar content component.
	 */
	function XFactSettingsSidebar() {
		var _state    = useState( config.currentLogoUrl || '' );
		var logoUrl   = _state[0];
		var setLogoUrl = _state[1];

		var _saving   = useState( false );
		var isSaving  = _saving[0];
		var setIsSaving = _saving[1];

		var _saved    = useState( false );
		var isSaved   = _saved[0];
		var setIsSaved = _saved[1];

		var _showLogo  = useState( !! config.showFloatingLogo );
		var showLogo   = _showLogo[0];
		var setShowLogo = _showLogo[1];

		var displayUrl = logoUrl || config.defaultLogoUrl || '';

		function saveLogo( newUrl ) {
			setLogoUrl( newUrl );
			setIsSaving( true );
			setIsSaved( false );

			apiFetch( {
				path: '/wp/v2/settings',
				method: 'POST',
				data: { xfact_floating_logo_url: newUrl },
			} ).then( function () {
				setIsSaving( false );
				setIsSaved( true );
			} ).catch( function () {
				setIsSaving( false );
			} );
		}

		function saveToggle( newValue ) {
			setShowLogo( newValue );

			/* Use raw fetch instead of wp.apiFetch — the WP middleware
			   chain in the Site Editor can swallow .then() callbacks. */
			fetch( '/wp-json/wp/v2/settings', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.wpApiSettings && window.wpApiSettings.nonce || '',
				},
				body: JSON.stringify( { xfact_show_floating_logo: newValue } ),
			} ).then( function () {
				localStorage.setItem( 'xfact_reopen_sidebar', '1' );
				window.location.reload();
			} );
		}

		/* Auto-clear the "Saved" indicator after 2 seconds */
		useEffect( function () {
			if ( ! isSaved ) {
				return;
			}
			var timer = setTimeout( function () {
				setIsSaved( false );
			}, 2000 );
			return function () {
				clearTimeout( timer );
			};
		}, [ isSaved ] );

		return el(
			Fragment,
			null,
			el(
				PluginSidebar,
				{
					name: 'xfact-theme-settings',
					title: 'xFact Settings',
					icon: 'admin-settings',
				},
				el(
					PanelBody,
					{ title: 'Floating Logo', initialOpen: true },

					/* Global toggle */
					el( ToggleControl, {
						label: 'Show Floating Logo',
						help: showLogo
							? 'Floating logo is visible on all blocks (unless overridden per-block).'
							: 'Floating logo is hidden on all blocks (unless overridden per-block).',
						checked: showLogo,
						onChange: saveToggle,
					} ),

					/* Logo preview */
					el( 'div', {
						style: {
							marginBottom: '12px',
							textAlign: 'center',
						},
					},
						displayUrl
							? el( 'img', {
								src: displayUrl,
								alt: 'Floating logo preview',
								style: {
									maxWidth: '120px',
									height: 'auto',
									border: '1px solid #ddd',
									borderRadius: '8px',
									padding: '12px',
									background: '#1a1a2e',
								},
							} )
							: el( 'p', {
								style: { color: '#757575', fontStyle: 'italic' },
							}, 'No logo set' )
					),

					/* Status indicator */
					isSaving
						? el( 'div', {
							style: {
								display: 'flex',
								alignItems: 'center',
								gap: '6px',
								marginBottom: '8px',
								fontSize: '12px',
								color: '#757575',
							},
						}, el( Spinner ), 'Saving…' )
						: null,

					isSaved
						? el( 'p', {
							style: {
								marginBottom: '8px',
								fontSize: '12px',
								color: '#00a32a',
							},
						}, '✓ Saved' )
						: null,

					/* Upload button */
					el( MediaUploadCheck, null,
						el( MediaUpload, {
							onSelect: function ( media ) {
								saveLogo( media.url );
							},
							allowedTypes: [ 'image' ],
							render: function ( obj ) {
								return el(
									Button,
									{
										onClick: obj.open,
										variant: 'secondary',
										style: { width: '100%', justifyContent: 'center' },
									},
									'Replace Logo'
								);
							},
						} )
					),

					/* Description */
					el( 'p', {
						style: {
							marginTop: '12px',
							fontSize: '12px',
							color: '#757575',
						},
					}, 'This logo appears in all blocks that have "Show Floating Logo" enabled. Upload a replacement to apply it globally.' )
				),

				/* ── Quick Links panel ── */
				el(
					PanelBody,
					{ title: 'Quick Links', initialOpen: true },

					el( Button, {
						variant: 'secondary',
						icon: 'table-row-before',
						href: config.editHeaderUrl || '/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_template_part&categoryId=header',
						style: { width: '100%', justifyContent: 'center', marginBottom: '8px' },
					}, 'Edit Header' ),

					el( Button, {
						variant: 'secondary',
						icon: 'table-row-after',
						href: config.editFooterUrl || '/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_template_part&categoryId=footer',
						style: { width: '100%', justifyContent: 'center' },
					}, 'Edit Footer' ),

					el( 'p', {
						style: {
							marginTop: '12px',
							fontSize: '12px',
							color: '#757575',
						},
					}, 'Opens the Site Editor to edit header or footer template parts.' )
				)
			)
		);
	}

	registerPlugin( 'xfact-theme-settings', {
		icon: 'admin-settings',
		render: XFactSettingsSidebar,
	} );

	/* Re-open the sidebar after a toggle-triggered reload. */
	if ( localStorage.getItem( 'xfact_reopen_sidebar' ) ) {
		localStorage.removeItem( 'xfact_reopen_sidebar' );
		/* Wait for the editor to fully initialise. */
		setTimeout( function () {
			var sidebarName = 'xfact-theme-settings/xfact-theme-settings';
			var iface = wp.data.dispatch( 'core/interface' );
			if ( iface && iface.enableComplementaryArea ) {
				iface.enableComplementaryArea( 'core', sidebarName );
			}
		}, 1000 );
	}
} )();
