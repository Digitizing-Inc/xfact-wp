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
					key: 'sectionLabel',
					label: 'Section Label',
					value: attr.sectionLabel,
					onChange: function ( v ) { set( { sectionLabel: v } ); },
				} ),
				el( h.ToggleControl, {
					key: 'useBreadcrumbs',
					label: 'Render Section Label as Breadcrumb',
					checked: attr.useBreadcrumbs,
					onChange: function ( v ) { set( { useBreadcrumbs: v } ); },
				} ),
				el( h.TextControl, {
					key: 'breadcrumbParentLabel',
					label: 'Breadcrumb Parent Label (Optional)',
					value: attr.breadcrumbParentLabel,
					onChange: function ( v ) { set( { breadcrumbParentLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'breadcrumbParentHref',
					label: 'Breadcrumb Parent URL (Optional)',
					value: attr.breadcrumbParentHref,
					onChange: function ( v ) { set( { breadcrumbParentHref: v } ); },
				} ),
				el( h.TextControl, {
					key: 'badgeText',
					label: 'Badge Text',
					value: attr.badgeText,
					onChange: function ( v ) { set( { badgeText: v } ); },
				} ),
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
