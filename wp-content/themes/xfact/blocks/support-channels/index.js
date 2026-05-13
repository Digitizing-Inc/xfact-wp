/**
 * xFact Support Channels — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function channelControls( channels, i, set ) {
		var ch = channels[ i ];
		function update( key, value ) {
			var arr = channels.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { channels: arr } );
		}
		function remove() {
			var arr = channels.slice();
			arr.splice( i, 1 );
			set( { channels: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = channels.slice();
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
			set( { channels: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: channels.length,
				label: 'Channel ' + ( i + 1 ),
				titleText: ch.title || ch.name || ch.label || ch.heading || '',
				onRemove: remove,
				onMoveItem: moveItem,
				iconName: ch.iconName
			},
				el( h.TextControl, { key: 'title-' + i, label: 'Title', value: ch.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextareaControl, { key: 'desc-' + i, label: 'Description', value: ch.description || '', onChange: function ( v ) { update( 'description', v ); } } ),
				h.iconControl( 'Icon (Lucide)', ch.iconName || '', function ( v ) { update( 'iconName', v ); }, 'icon-' + i ),
				h.imageControl(
					'Channel Image',
					ch.imageUrl || '',
					function ( media ) { update( 'imageUrl', media.url ); },
					function () { update( 'imageUrl', '' ); },
					'img-' + i
				)
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/support-channels', {
		edit: h.createEdit( 'xfact/support-channels', 'Support Channels Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var channels = attr.channels || [];

			var controls = [
				h.imageControl( 'Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' )
			];

			/* Per-channel controls */
			if ( channels.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'channels-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'channels-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Channels (' + channels.length + ')' )
				);
				channels.forEach( function ( _ch, i ) {
					controls = controls.concat( channelControls( channels, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-ch',
					onClick: function () { set( { channels: channels.concat( [ { title: '', description: '', iconName: 'Circle' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Channel' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
