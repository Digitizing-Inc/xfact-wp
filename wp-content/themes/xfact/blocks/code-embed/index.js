/**
 * xFact Code Embed — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	wp.blocks.registerBlockType( 'xfact/code-embed', {
		edit: h.createEdit( 'xfact/code-embed', 'Code Embed Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;

			return [
				el( h.TextareaControl, {
					key: 'code',
					label: 'Raw HTML/JS Code',
					value: attr.code,
					onChange: function ( v ) { set( { code: v } ); },
					help: 'Enter raw HTML or scripts. It will be rendered inside the theme container.',
                    rows: 10
				} ),
			];
		} ),
		save: function () { return null; },
	} );
} )();
