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
				el( h.TextareaControl, { key: 'subtitle', label: 'Description', value: attr.subtitle, onChange: function ( v ) { set( { subtitle: v } ); } } ),
			];

			/* Buttons section */
			controls.push(
				el( 'hr', { key: 'buttons-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'buttons-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Buttons (' + buttons.length + ')' )
			);
			controls = controls.concat( h.buttonArrayControls( buttons, set, 'buttons' ) );

			/* Settings section */
			controls.push(
				el( 'hr', { key: 'settings-sep', style: { margin: '24px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'settings-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Settings' ),
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
				} )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
