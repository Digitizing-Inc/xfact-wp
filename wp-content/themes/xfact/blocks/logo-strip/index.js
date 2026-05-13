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
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = logos.slice();
			if ( intent === 'swap' ) {
				var temp = arr[fromIndex];
				arr[fromIndex] = arr[toIndex];
				arr[toIndex] = temp;
			} else {
				var insertAt = intent === 'shift-bottom' ? toIndex + 1 : toIndex;
				if ( insertAt > fromIndex ) insertAt--;
				var itm = arr.splice( fromIndex, 1 )[ 0 ];
				arr.splice( insertAt, 0, itm );
			}
			set( { logos: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: logos.length,
				label: 'Logo ' + ( i + 1 ),
				titleText: logo.title || logo.name || logo.label || logo.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, { key: 'name-' + i, label: 'Name', value: logo.name || '', onChange: function ( v ) { update( 'name', v ); } } ),
				h.imageControl(
					'Logo Image',
					logo.imageUrl || '',
					function ( media ) { update( 'imageUrl', media.url ); },
					function () { update( 'imageUrl', '' ); },
					'img-' + i
				)
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/logo-strip', {
		edit: h.createEdit( 'xfact/logo-strip', 'Logo Strip Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var logos = attr.logos || [];

			var controls = [
				el( h.TextControl, { key: 'heading', label: 'Title', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
			];

			if ( logos.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'logos-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'logos-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Logos (' + logos.length + ')' )
				);
				logos.forEach( function ( _logo, i ) {
					controls = controls.concat( logoControls( logos, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { logos: logos.concat( [ { name: '', imageUrl: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Logo' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
