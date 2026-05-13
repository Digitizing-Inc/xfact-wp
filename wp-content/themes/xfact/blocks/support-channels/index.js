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
				onMoveItem: moveItem
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

			var controls = [];

			/* Per-channel controls */
			channels.forEach( function ( _ch, i ) {
				controls = controls.concat( channelControls( channels, i, set ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add-ch',
					onClick: function () { set( { channels: channels.concat( [ { title: '', description: '', iconName: 'Circle' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Channel' )
			);

			/* Existing client section */
			controls.push(
				el( 'hr', { key: 'client-sep', style: { margin: '24px 0', borderTopWidth: '2px' } } ),
				el( 'strong', { key: 'client-hdr', style: { display: 'block', marginBottom: '12px', fontSize: '13px' } }, '📋 Existing Client Panel' ),
				el( h.TextControl, { key: 'ecHeading', label: 'Existing Client Heading', value: attr.existingClientHeading, onChange: function ( v ) { set( { existingClientHeading: v } ); } } ),
				el( h.TextareaControl, { key: 'ecDesc', label: 'Existing Client Description', value: attr.existingClientDescription, onChange: function ( v ) { set( { existingClientDescription: v } ); } } ),
				el( h.TextControl, { key: 'ecBtnLabel', label: 'Existing Client Button Label', value: attr.existingClientButtonLabel, onChange: function ( v ) { set( { existingClientButtonLabel: v } ); } } ),
				el( h.TextControl, { key: 'ecBtnHref', label: 'Existing Client Button Link', value: attr.existingClientButtonHref, onChange: function ( v ) { set( { existingClientButtonHref: v } ); } } ),
				h.imageControl( 'Section Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
