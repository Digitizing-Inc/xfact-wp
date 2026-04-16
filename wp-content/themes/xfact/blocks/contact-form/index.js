/**
 * xFact Contact Form — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/contact-form', {
		edit: h.createEdit( 'xfact/contact-form', 'Contact Form Settings', function ( props ) {
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
				el( h.TextControl, {
					key: 'recipientEmail',
					label: 'Recipient Email',
					value: attr.recipientEmail,
					onChange: function ( v ) { set( { recipientEmail: v } ); },
				} ),
				h.imageControl(
					'Section Image',
					attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); },
					'sectionImage'
				),
			];
		} ),
		save: function () { return null; },
	} );
} )();
