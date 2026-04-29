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
	} );
} )( jQuery );
