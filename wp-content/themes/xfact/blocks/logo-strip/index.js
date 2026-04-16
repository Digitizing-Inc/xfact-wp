/**
 * xFact Logo Strip — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function logoControls( logos, i, set ) {
		var logo = logos[ i ];
		function update( key, value ) {
			var arr = logos.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { logos: arr } );
		}
		function remove() {
			var arr = logos.slice();
			arr.splice( i, 1 );
			set( { logos: arr } );
		}

		return [
			el( 'hr', { key: 'sep-' + i, style: { margin: '16px 0', opacity: 0.3 } } ),
			el( 'div', {
				key: 'hdr-' + i,
				style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
			},
				el( 'strong', null, 'Logo ' + ( i + 1 ) ),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true, style: { fontSize: '12px' } }, '✕ Remove' )
			),
			el( h.TextControl, { key: 'name-' + i, label: 'Name', value: logo.name || '', onChange: function ( v ) { update( 'name', v ); } } ),
			el( h.TextControl, { key: 'text-' + i, label: 'Display Text', value: logo.text || '', onChange: function ( v ) { update( 'text', v ); } } ),
			h.imageControl(
				'Logo Image',
				logo.imageUrl || '',
				function ( media ) { update( 'imageUrl', media.url ); },
				function () { update( 'imageUrl', '' ); },
				'img-' + i
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/logo-strip', {
		edit: h.createEdit( 'xfact/logo-strip', 'Logo Strip Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var logos = attr.logos || [];

			var controls = [
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
			];

			logos.forEach( function ( _logo, i ) {
				controls = controls.concat( logoControls( logos, i, set ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { logos: logos.concat( [ { name: '', text: '', imageUrl: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Logo' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
