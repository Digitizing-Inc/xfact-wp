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
				el( h.TextControl, {
					key: 'sectionLabel',
					label: 'Pre-Title Label',
					value: attr.sectionLabel,
					onChange: function ( v ) { set( { sectionLabel: v } ); },
				} ),
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

			/* Settings section */
			controls.push(
				el( 'hr', { key: 'settings-sep', style: { margin: '24px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'settings-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Settings' ),
				el( h.ToggleControl, {
					key: 'useBreadcrumbs',
					label: 'Render Pre-Title Label as Breadcrumb',
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
				} )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
