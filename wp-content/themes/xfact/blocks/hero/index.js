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

			return [
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
				el( h.TextControl, {
					key: 'ctaLabel',
					label: 'CTA Button Label',
					value: attr.ctaLabel,
					onChange: function ( v ) { set( { ctaLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'ctaHref',
					label: 'CTA Button Link',
					value: attr.ctaHref,
					onChange: function ( v ) { set( { ctaHref: v } ); },
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
				el( h.ToggleControl, {
					key: 'showXLogo',
					label: 'Show X Logo',
					checked: attr.showXLogo !== false,
					onChange: function ( v ) { set( { showXLogo: v } ); },
				} ),
			];
		} ),
		save: function () { return null; },
	} );
} )();
