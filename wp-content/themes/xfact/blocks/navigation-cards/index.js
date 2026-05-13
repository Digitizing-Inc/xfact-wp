/**
 * xFact Navigation Cards — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function cardControls( items, i, set ) {
		var item = items[ i ];
		function update( key, value ) {
			var arr = items.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { items: arr } );
		}
		function remove() {
			var arr = items.slice();
			arr.splice( i, 1 );
			set( { items: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = items.slice();
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
			set( { items: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: items.length,
				label: 'Card ' + ( i + 1 ),
				titleText: item.title || item.name || item.label || item.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, { label: 'Title', value: item.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextControl, { label: 'Subtitle', value: item.subtitle || '', onChange: function ( v ) { update( 'subtitle', v ); } } ),
				h.iconControl( 'Icon (Lucide name)', item.icon || '', function ( v ) { update( 'icon', v ); } ),
				el( h.TextControl, { label: 'Link URL', value: item.href || '', onChange: function ( v ) { update( 'href', v ); } } )
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/navigation-cards', {
		edit: h.createEdit( 'xfact/navigation-cards', 'Navigation Cards Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var items = attr.items || [];
			var buttons = attr.buttons || [];

			var controls = [
				el( h.TextControl, { key: 'anchor', label: 'Section ID (HTML Anchor)', value: attr.anchor || '', onChange: function ( v ) { set( { anchor: v } ); } } ),
				el( 'hr', { key: 'sep1', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.TextControl, { key: 'heading', label: 'Section Heading', value: attr.heading || '', onChange: function ( v ) { set( { heading: v } ); } } ),
			];

			if ( items.length > 0 ) {
				controls.push( el( 'strong', { key: 'items-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Cards (' + items.length + ')' ) );
				items.forEach( function ( _item, i ) {
					controls = controls.concat( cardControls( items, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-card',
					onClick: function () { set( { items: items.concat( [ { title: '', subtitle: '', icon: '', href: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '8px' },
				}, '+ Add Navigation Card' )
			);

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
}() );
