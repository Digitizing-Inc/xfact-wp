/**
 * xFact Hero — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/hero', {
		edit: h.createEdit( 'xfact/hero', 'Hero Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var slides = attr.slides || [];
			var buttons = attr.buttons || [];

			var controls = [
				el( h.TextControl, {
					key: 'title',
					label: 'Title (use <accent>…</accent> for accent)',
					value: attr.title,
					onChange: function ( v ) { set( { title: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'subtitle',
					label: 'Subtitle',
					value: attr.subtitle,
					onChange: function ( v ) { set( { subtitle: v } ); },
				} ),

				h.imageControl(
					'Video Poster Image',
					attr.posterImage,
					function ( media ) { set( { posterImage: media.url } ); },
					function () { set( { posterImage: '' } ); },
					'posterImage'
				),
				el( h.TextControl, {
					key: 'videoUrl',
					label: 'Video URL',
					value: attr.videoUrl,
					onChange: function ( v ) { set( { videoUrl: v } ); },
				} ),
				h.galleryControl(
					'Slideshow Images',
					slides,
					function ( media ) {
						set( { slides: slides.concat( { url: media.url, id: media.id, alt: media.alt || '' } ) } );
					},
					function ( index ) {
						var updated = slides.slice();
						updated.splice( index, 1 );
						set( { slides: updated } );
					},
					'slides'
				),
				el( h.SelectControl, {
					key: 'showFloatingLogo',
					label: 'Floating Logo',
					value: attr.showFloatingLogo || 'global',
					options: [
						{ label: 'Use Global Setting', value: 'global' },
						{ label: 'Show', value: 'show' },
						{ label: 'Hide', value: 'hide' },
					],
					onChange: function ( v ) { set( { showFloatingLogo: v } ); },
				} ),
			];

			/* Buttons section */
			controls.push(
				el( 'hr', { key: 'buttons-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'buttons-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Buttons (' + buttons.length + ')' )
			);
			controls = controls.concat( h.buttonArrayControls( buttons, set, 'buttons' ) );

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
