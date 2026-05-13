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

		var _darkMode  = useState( !! config.editorDarkMode );
		var editorDarkMode   = _darkMode[0];
		var setEditorDarkMode = _darkMode[1];

		var _toolbarNode = useState( null );
		var toolbarNode = _toolbarNode[0];
		var setToolbarNode = _toolbarNode[1];

		var displayUrl = logoUrl || config.defaultLogoUrl || '';

		var sunIcon = el( 'svg', { width: '24', height: '24', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
			el( 'path', { d: 'M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-1.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z', fill: 'currentColor' } )
		);

		var moonIcon = el( 'svg', { width: '24', height: '24', viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
			el( 'path', { d: 'M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z', fill: 'currentColor' } )
		);

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

		function saveDarkMode( newValue ) {
			setEditorDarkMode( newValue );

			fetch( '/wp-json/wp/v2/settings', {
				method: 'POST',
				credentials: 'same-origin',
				headers: {
					'Content-Type': 'application/json',
					'X-WP-Nonce': window.wpApiSettings && window.wpApiSettings.nonce || '',
				},
				body: JSON.stringify( { xfact_editor_dark_mode: newValue } ),
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

		/* Apply dark mode class to editor wrapper */
		useEffect( function () {
			var applyTheme = function () {
				var iframes = document.querySelectorAll( 'iframe' );
				var appliedToIframe = false;
				
				if ( iframes.length ) {
					for ( var i = 0; i < iframes.length; i++ ) {
						try {
							var doc = iframes[ i ].contentDocument;
							if ( doc && doc.body && doc.body.classList.contains('editor-styles-wrapper') ) {
								appliedToIframe = true;
								if ( editorDarkMode ) {
									doc.documentElement.setAttribute( 'data-theme', 'dark' );
									doc.body.setAttribute( 'data-theme', 'dark' );
								} else {
									doc.documentElement.removeAttribute( 'data-theme' );
									doc.body.removeAttribute( 'data-theme' );
								}
							}
						} catch ( e ) {}
					}
				}
				
				var wrappers = document.querySelectorAll( '.editor-styles-wrapper' );
				for ( var j = 0; j < wrappers.length; j++ ) {
					if ( editorDarkMode ) {
						wrappers[ j ].setAttribute( 'data-theme', 'dark' );
					} else {
						wrappers[ j ].removeAttribute( 'data-theme' );
					}
				}
				
				if ( ! appliedToIframe && wrappers.length === 0 ) {
					if ( editorDarkMode ) document.body.setAttribute( 'data-theme', 'dark' );
					else document.body.removeAttribute( 'data-theme' );
				}
			};

			applyTheme();
			var interval = setInterval( applyTheme, 1000 );
			return function () { clearInterval( interval ); };
		}, [ editorDarkMode ] );

		/* Inject toolbar button via Portal to prevent disappearing/flickering */
		useEffect( function() {
			var intId = setInterval( function() {
				var node = document.querySelector( '.interface-pinned-items' ) || document.querySelector( '.edit-post-header__toolbar' );
				if ( node && node !== toolbarNode ) {
					setToolbarNode( node );
				}
			}, 500 );
			return function() { clearInterval( intId ); };
		}, [ toolbarNode ] );

		var toolbarButtonPortal = toolbarNode ? wp.element.createPortal(
			el( Button, {
				className: 'components-button has-icon xfact-dark-mode-toggle',
				icon: editorDarkMode ? sunIcon : moonIcon,
				label: editorDarkMode ? 'Disable Dark Mode Preview' : 'Enable Dark Mode Preview',
				onClick: function() { saveDarkMode( !editorDarkMode ); }
			} ),
			toolbarNode
		) : null;

		return toolbarButtonPortal;
	}

	registerPlugin( 'xfact-theme-settings', {
		icon: 'admin-settings',
		render: XFactSettingsSidebar,
	} );


} )();
