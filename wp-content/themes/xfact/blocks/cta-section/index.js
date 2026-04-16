/**
 * xFact CTA Section — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/cta-section', {
		edit: h.createEdit( 'xfact/cta-section', 'CTA Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;

			return [
				el( h.TextControl, {
					key: 'title',
					label: 'Title',
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
					key: 'primaryLabel',
					label: 'Primary Button Label',
					value: attr.primaryLabel,
					onChange: function ( v ) { set( { primaryLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'primaryHref',
					label: 'Primary Button Link',
					value: attr.primaryHref,
					onChange: function ( v ) { set( { primaryHref: v } ); },
				} ),
				el( h.TextControl, {
					key: 'secondaryLabel',
					label: 'Secondary Button Label',
					value: attr.secondaryLabel,
					onChange: function ( v ) { set( { secondaryLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'secondaryHref',
					label: 'Secondary Button Link',
					value: attr.secondaryHref,
					onChange: function ( v ) { set( { secondaryHref: v } ); },
				} ),
				h.imageControl(
					'Background Image',
					attr.backgroundImage,
					function ( media ) { set( { backgroundImage: media.url } ); },
					function () { set( { backgroundImage: '' } ); },
					'backgroundImage'
				),
			];
		} ),
		save: function () { return null; },
	} );
} )();
