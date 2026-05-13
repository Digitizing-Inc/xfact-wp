/**
 * xFact Section Heading — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/section-heading', {
		edit: h.createEdit( 'xfact/section-heading', 'Section Heading Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;

			return [
				el( h.TextControl, {
					key: 'sectionLabel',
					label: 'Pre-Title Label',
					value: attr.sectionLabel,
					onChange: function ( v ) { set( { sectionLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'heading',
					label: 'Title',
					value: attr.heading,
					onChange: function ( v ) { set( { heading: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'subtitle',
					label: 'Description',
					value: attr.subtitle,
					onChange: function ( v ) { set( { subtitle: v } ); },
				} ),
			];
		} ),
		save: function () { return null; },
	} );
} )();
