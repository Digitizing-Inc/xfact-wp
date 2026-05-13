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

		// Reset Typography
		$( '#xfact-reset-typography-btn' ).on( 'click', function ( e ) {
			e.preventDefault();
			$( '#xfact_font_heading' ).val( 'inter' );
			$( '#xfact_font_body' ).val( 'ibm-plex-mono' );
		} );

	} );
} )( jQuery );
