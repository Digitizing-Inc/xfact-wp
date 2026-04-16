/**
 * xFact Page Hero — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/page-hero', {
		edit: h.createEdit( 'xfact/page-hero', 'Page Hero Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;

			return [
				el( h.TextControl, {
					key: 'heading',
					label: 'Heading',
					value: attr.heading,
					onChange: function ( v ) { set( { heading: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'subtitle',
					label: 'Subtitle',
					value: attr.subtitle,
					onChange: function ( v ) { set( { subtitle: v } ); },
				} ),
				h.imageControl(
					'Background Image',
					attr.backgroundImage,
					function ( media ) {
						set( { backgroundImage: media.url, imageAlt: media.alt || attr.imageAlt } );
					},
					function () { set( { backgroundImage: '' } ); },
					'backgroundImage'
				),
				el( h.TextControl, {
					key: 'imageAlt',
					label: 'Image Alt Text',
					value: attr.imageAlt,
					onChange: function ( v ) { set( { imageAlt: v } ); },
				} ),
			];
		} ),
		save: function () { return null; },
	} );
} )();
