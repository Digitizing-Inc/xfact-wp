/**
 * xFact Feature Cards — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function cardControls( cards, i, set ) {
		var card = cards[ i ];
		function update( key, value ) {
			var arr = cards.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { cards: arr } );
		}
		function remove() {
			var arr = cards.slice();
			arr.splice( i, 1 );
			set( { cards: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = cards.slice();
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
			set( { cards: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: cards.length,
				label: 'Card ' + ( i + 1 ),
				titleText: card.title || card.name || card.label || card.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, { key: 'title-' + i, label: 'Title', value: card.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextareaControl, { key: 'desc-' + i, label: 'Description', value: card.description || '', onChange: function ( v ) { update( 'description', v ); } } ),
				h.iconControl( 'Icon (Lucide)', card.iconName || '', function ( v ) { update( 'iconName', v ); }, 'icon-' + i ),
				h.imageControl(
					'Card Image',
					card.imageUrl || '',
					function ( media ) { update( 'imageUrl', media.url ); },
					function () { update( 'imageUrl', '' ); },
					'img-' + i
				)
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/feature-cards', {
		edit: h.createEdit( 'xfact/feature-cards', 'Feature Cards Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var cards = attr.cards || [];

			var controls = [
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
				h.imageControl( 'Section Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
			];

			cards.forEach( function ( _card, i ) {
				controls = controls.concat( cardControls( cards, i, set ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { cards: cards.concat( [ { title: '', description: '', iconName: 'Circle' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Card' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
