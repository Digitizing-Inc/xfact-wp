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

			var controls = [
				el( h.ToggleControl, {
					key: 'useBreadcrumbs',
					label: 'Replace Pre-Title with Breadcrumb Navigation',
					checked: attr.useBreadcrumbs,
					onChange: function ( v ) { set( { useBreadcrumbs: v } ); },
				} ),
				( ! attr.useBreadcrumbs ) ? el( h.TextControl, {
					key: 'sectionLabel',
					label: 'Pre-Title Label',
					value: attr.sectionLabel,
					onChange: function ( v ) { set( { sectionLabel: v } ); },
				} ) : el( 'div', {
					key: 'breadcrumb-group',
					style: {
						background: '#f8f9fa',
						border: '1px solid #e2e8f0',
						borderRadius: '4px',
						padding: '12px',
						marginBottom: '24px',
						marginTop: '-8px'
					}
				},
					el( h.TextControl, {
						label: 'Breadcrumb Parent Label (Optional)',
						value: attr.breadcrumbParentLabel,
						onChange: function ( v ) { set( { breadcrumbParentLabel: v } ); },
					} ),
					el( h.TextControl, {
						label: 'Breadcrumb Parent URL (Optional)',
						value: attr.breadcrumbParentHref,
						onChange: function ( v ) { set( { breadcrumbParentHref: v } ); },
					} )
				),
				el( h.TextControl, {
					key: 'badgeText',
					label: 'Badge Text',
					value: attr.badgeText,
					onChange: function ( v ) { set( { badgeText: v } ); },
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
				h.imageControl(
					'Image',
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


			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
