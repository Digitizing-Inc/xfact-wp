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
			var buttons = attr.buttons || [];

			var controls = [
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

				h.imageControl(
					'Background Image',
					attr.backgroundImage,
					function ( media ) { set( { backgroundImage: media.url } ); },
					function () { set( { backgroundImage: '' } ); },
					'backgroundImage'
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
				el( h.SelectControl, {
					key: 'variant',
					label: 'Theme Variant',
					value: attr.variant || 'dark',
					options: [
						{ label: 'Dark (Default)', value: 'dark' },
						{ label: 'Light', value: 'light' },
						{ label: 'Transparent', value: 'default' },
					],
					onChange: function ( v ) { 
						var updates = { variant: v };
						if ( v === 'light' ) {
							updates.backgroundColor = 'surface-alt';
						} else if ( v === 'default' ) {
							updates.backgroundColor = '';
						} else {
							updates.backgroundColor = 'dark-section';
						}
						set( updates ); 
					},
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
