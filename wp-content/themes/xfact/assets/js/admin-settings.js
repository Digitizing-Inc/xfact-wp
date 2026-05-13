/**
 * xFact Admin Settings — Media uploader integration.
 */
( function ( $ ) {
	'use strict';

	$( function () {
		$( '.xfact-admin-upload-btn' ).on( 'click', function ( e ) {
			e.preventDefault();

			var $btn     = $( this );
			var $input   = $( $btn.data( 'target' ) );
			var $preview = $( $btn.data( 'preview' ) );

			var frame = wp.media( {
				title: 'Select Logo',
				button: { text: 'Use this logo' },
				multiple: false,
				library: { type: 'image' },
			} );

			frame.on( 'select', function () {
				var attachment = frame.state().get( 'selection' ).first().toJSON();
				$input.val( attachment.url );
				$preview.attr( 'src', attachment.url );
			} );

			frame.open();
		} );

		$( '.xfact-admin-reset-btn' ).on( 'click', function ( e ) {
			e.preventDefault();

			var $btn        = $( this );
			var $input      = $( $btn.data( 'target' ) );
			var $preview    = $( $btn.data( 'preview' ) );
			var defaultUrl  = $btn.data( 'default' );

			$input.val( '' );
			$preview.attr( 'src', defaultUrl );
		} );

		// Initialize color pickers
		if ( typeof $.fn.wpColorPicker !== 'undefined' ) {
			$( '.xfact-color-picker' ).wpColorPicker();
		}
		// Custom Fonts Manager
		$( '#xfact-add-font-btn' ).on( 'click', function ( e ) {
			e.preventDefault();
			var $container = $( '#xfact-custom-fonts-container' );
			var index = $container.children().length;
			
			var html = '<div class="xfact-custom-font-row" data-index="' + index + '">' +
				'<input type="text" name="xfact_custom_fonts[' + index + '][name]" placeholder="Font Name (e.g. Comic Sans)" required />' +
				'<input type="text" name="xfact_custom_fonts[' + index + '][fontFamily]" placeholder="CSS font-family value" required />' +
				'<input type="text" name="xfact_custom_fonts[' + index + '][weight]" placeholder="Weight (e.g. 400)" />' +
				'<input type="text" name="xfact_custom_fonts[' + index + '][url]" class="xfact-font-url" placeholder="URL to .woff2 file" required readonly style="width: 300px;" />' +
				'<button type="button" class="button button-secondary xfact-upload-font-btn">Upload .woff2</button>' +
				'<button type="button" class="button xfact-btn-danger xfact-remove-font-btn">Remove</button>' +
			'</div>';
			$container.append( html );
		} );

		$( document ).on( 'click', '.xfact-remove-font-btn', function ( e ) {
			e.preventDefault();
			$( this ).closest( '.xfact-custom-font-row' ).remove();
		} );

		$( document ).on( 'click', '.xfact-upload-font-btn', function ( e ) {
			e.preventDefault();
			var $btn   = $( this );
			var $input = $btn.siblings( '.xfact-font-url' );

			var fontFrame = wp.media( {
				title: 'Select Font File',
				button: { text: 'Use this font' },
				multiple: false
			} );

			fontFrame.on( 'select', function () {
				var attachment = fontFrame.state().get( 'selection' ).first().toJSON();
				$input.val( attachment.url );
			} );

			fontFrame.open();
		} );

		// Reset Individual Fonts
		$( '.xfact-reset-font-btn' ).on( 'click', function ( e ) {
			e.preventDefault();
			var targetSelect = $( '#' + $( this ).data( 'target' ) );
			var defaultVal = $( this ).data( 'default' );
			targetSelect.val( defaultVal );
			targetSelect.trigger( 'change' ); // trigger change so live preview updates if applicable
		} );
		// Reset Individual Colors
		$( '.xfact-reset-color-btn' ).on( 'click', function ( e ) {
			e.preventDefault();
			var targetInput = $( '#' + $( this ).data( 'target' ) );
			var defaultVal = $( this ).data( 'default' );
			
			// If wpColorPicker is active, update via its method
			if ( typeof $.fn.wpColorPicker !== 'undefined' && targetInput.hasClass( 'wp-color-picker' ) ) {
				targetInput.wpColorPicker( 'color', defaultVal );
			} else {
				targetInput.val( defaultVal );
			}
			targetInput.trigger( 'change' ); // trigger change so live preview updates if applicable
		} );


		// Tab Switching Logic
		var $tabs = $( '#xfact-tabs .xfact-tab' );
		var $contents = $( '.xfact-tab-content' );

		function activateTab( target ) {
			$tabs.removeClass( 'xfact-active-tab' );
			$tabs.filter( '[href="' + target + '"]' ).addClass( 'xfact-active-tab' );

			$contents.removeClass( 'xfact-active-tab-content' ).hide();
			$( target ).addClass( 'xfact-active-tab-content' ).show();

			// Store active tab in localStorage
			if ( window.localStorage ) {
				localStorage.setItem( 'xfact_active_settings_tab', target );
			}
		}

		$tabs.on( 'click', function ( e ) {
			e.preventDefault();
			var target = $( this ).attr( 'href' );
			activateTab( target );
			// Update URL hash without jumping
			if ( history.pushState ) {
				history.pushState( null, null, target );
			} else {
				window.location.hash = target;
			}
		} );

		// Load active tab on page load
		var hash = window.location.hash;
		if ( hash && $tabs.filter( '[href="' + hash + '"]' ).length ) {
			activateTab( hash );
		} else if ( window.localStorage ) {
			var storedTab = localStorage.getItem( 'xfact_active_settings_tab' );
			if ( storedTab && $tabs.filter( '[href="' + storedTab + '"]' ).length ) {
				activateTab( storedTab );
			}
		}

		// --- LIVE PREVIEW LOGIC ---

		var $previewIframe = $( '#xfact-live-preview-iframe' );
		var $themeBtns     = $( '.xfact-theme-btn' );

		// Jump to preview button
		$( '#xfact-jump-to-preview' ).on( 'click', function ( e ) {
			e.preventDefault();
			$( 'html, body' ).animate( {
				scrollTop: $( '#xfact-live-preview-section' ).offset().top - 40
			}, 500 );
		} );

		// Back to settings button
		$( '#xfact-back-to-settings' ).on( 'click', function ( e ) {
			e.preventDefault();
			$( 'html, body' ).animate( {
				scrollTop: $( '.xfact-settings-container' ).offset().top - 40
			}, 500 );
		} );

		// Toggle Theme
		$themeBtns.on( 'click', function ( e ) {
			e.preventDefault();
			$themeBtns.removeClass( 'active' );
			var $btn = $( this );
			$btn.addClass( 'active' );

			var theme = $btn.data( 'theme' );
			sendPreviewUpdate( { type: 'theme', value: theme } );
		} );

		// Send form state to iframe
		function sendPreviewUpdate( explicitPayload ) {
			if ( ! $previewIframe.length || ! $previewIframe[0].contentWindow ) {
				return;
			}

			var payload = explicitPayload || { type: 'styles', vars: {} };

			if ( ! explicitPayload ) {
				// Gather Colors
				payload.vars['--xfact-bg'] = $( '#xfact_color_bg' ).val();
				payload.vars['--xfact-bg-alt'] = $( '#xfact_color_bg_alt' ).val();
				payload.vars['--xfact-text'] = $( '#xfact_color_text' ).val();
				payload.vars['--xfact-text-secondary'] = $( '#xfact_color_text_secondary' ).val();
				payload.vars['--xfact-accent'] = $( '#xfact_color_accent' ).val();

				// Gather Dark Colors (mapped to same variables when in dark mode)
				payload.darkVars = {
					'--xfact-bg': $( '#xfact_color_dark_bg' ).val(),
					'--xfact-bg-alt': $( '#xfact_color_dark_bg_alt' ).val(),
					'--xfact-text': $( '#xfact_color_dark_text' ).val(),
					'--xfact-text-secondary': $( '#xfact_color_dark_text_secondary' ).val(),
					'--xfact-accent': $( '#xfact_color_dark_accent' ).val()
				};

				// Gather Typography
				var headingFont = $( '#xfact_font_heading' ).val();
				var bodyFont = $( '#xfact_font_body' ).val();

				// Resolve custom fonts
				var fontMap = {
					'inter': "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
					'ibm-plex-mono': "'IBM Plex Mono', monospace"
				};

				// Map any custom font inputs
				$( '.xfact-custom-font-row' ).each( function () {
					var name = $( this ).find( 'input[name$="[name]"]' ).val();
					var family = $( this ).find( 'input[name$="[fontFamily]"]' ).val();
					if ( name && family ) {
						var slug = name.toLowerCase().replace( /[^a-z0-9]+/g, '-' ).replace( /(^-|-$)+/g, '' );
						fontMap[slug] = "'" + family + "'";
					}
				} );

				if ( fontMap[headingFont] ) {
					payload.vars['--wp--preset--font-family--heading'] = fontMap[headingFont] + ' !important';
				}
				if ( fontMap[bodyFont] ) {
					payload.vars['--wp--preset--font-family--body'] = fontMap[bodyFont] + ' !important';
				}
			}

			// Send postMessage
			$previewIframe[0].contentWindow.postMessage( payload, '*' );
		}

		// Listen to all inputs
		var updateTimer;
		$( '#xfact-settings-form' ).on( 'change keyup', 'input, select', function () {
			clearTimeout( updateTimer );
			updateTimer = setTimeout( function () {
				sendPreviewUpdate();
			}, 250 );
		} );
		
		// Color picker change event (wpColorPicker)
		if ( typeof $.fn.wpColorPicker !== 'undefined' ) {
			$( '.xfact-color-picker' ).wpColorPicker( {
				change: function ( event, ui ) {
					hasUnsavedChanges = true;
					clearTimeout( updateTimer );
					updateTimer = setTimeout( function () {
						sendPreviewUpdate();
					}, 50 );
				}
			} );
		}

		// Send initial payload when iframe loads
		$previewIframe.on( 'load', function () {
			sendPreviewUpdate();
			var currentTheme = $themeBtns.filter( '.active' ).data( 'theme' ) || 'light';
			sendPreviewUpdate( { type: 'theme', value: currentTheme } );
		} );

		// Unsaved Changes Warning
		var hasUnsavedChanges = false;
		
		$( '#xfact-settings-form' ).on( 'change input', function() {
			hasUnsavedChanges = true;
		} );

		// Catch reset buttons and media upload triggers
		$( '.xfact-admin-upload-btn, .xfact-admin-reset-btn, .xfact-reset-color-btn, .xfact-reset-font-btn' ).on( 'click', function() {
			hasUnsavedChanges = true;
		} );

		$( window ).on( 'beforeunload', function() {
			if ( hasUnsavedChanges ) {
				return 'You have unsaved changes. Are you sure you want to leave without saving?';
			}
		} );

		$( '#xfact-settings-form' ).on( 'submit', function() {
			hasUnsavedChanges = false;
		} );

	} );
} )( jQuery );
