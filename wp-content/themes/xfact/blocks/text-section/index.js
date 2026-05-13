/**
 * xFact Text Section — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function tagControls( tags, i, set ) {
		var tag = tags[ i ];
		function update( key, value ) {
			var arr = tags.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { tags: arr } );
		}
		function remove() {
			var arr = tags.slice();
			arr.splice( i, 1 );
			set( { tags: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = tags.slice();
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
			set( { tags: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'tag-' + i,
				index: i,
				total: tags.length,
				label: 'Tag ' + ( i + 1 ),
				titleText: tag.title || tag.name || tag.label || tag.heading || '',
				onRemove: remove,
				onMoveItem: moveItem,
				iconName: tag.iconName
			},
				el( h.TextControl, {
					key: 'label-' + i,
					label: 'Tag ' + ( i + 1 ) + ' Label',
					value: tag.label || '',
					onChange: function ( v ) { update( 'label', v ); }
				} ),
				h.iconControl( 'Icon (Lucide)', tag.iconName || '', function ( v ) { update( 'iconName', v ); }, 'icon-' + i )
			),
		];
	}

	function keyMessageControls( messages, i, set ) {
		var msg = messages[ i ];
		function update( v ) {
			var arr = messages.slice();
			arr[ i ] = v;
			set( { keyMessages: arr } );
		}
		function remove() {
			var arr = messages.slice();
			arr.splice( i, 1 );
			set( { keyMessages: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = messages.slice();
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
			set( { keyMessages: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'msg-' + i,
				index: i,
				total: messages.length,
				label: 'Message ' + ( i + 1 ),
				titleText: msg || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( 'div', { style: { display: 'flex', gap: '4px', alignItems: 'flex-start' } },
				el( h.TextControl, {
					label: 'Key Message ' + ( i + 1 ),
					value: msg || '',
					onChange: update,
					style: { flex: 1 },
				} ),
				)
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/text-section', {
		edit: h.createEdit( 'xfact/text-section', 'Text Section Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var tags = attr.tags || [];
			var keyMessages = attr.keyMessages || [];
			var buttons = attr.buttons || [];

			var controls = [
				el( h.TextControl, { key: 'sectionLabel', label: 'Pre-Title Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'badgeText', label: 'Badge Text', value: attr.badgeText, onChange: function ( v ) { set( { badgeText: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Title', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'body', label: 'Description', value: attr.body, rows: 5, onChange: function ( v ) { set( { body: v } ); } } ),
				h.iconControl( 'Icon', attr.sectionIcon || '', function ( v ) { set( { sectionIcon: v } ); }, 'sectionIcon' ),
				h.imageControl( 'Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
				attr.sectionImage
					? el( h.TextControl, { key: 'sectionImageAlt', label: 'Image Alt Text', value: attr.sectionImageAlt, onChange: function ( v ) { set( { sectionImageAlt: v } ); } } )
					: null,
			];

			/* Buttons section */
			controls.push(
				el( 'hr', { key: 'buttons-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'buttons-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Buttons (' + buttons.length + ')' )
			);
			controls = controls.concat( h.buttonArrayControls( buttons, set, 'buttons' ) );

			/* Tags section */
			if ( tags.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'tags-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'tags-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Tags (' + tags.length + ')' )
				);
				tags.forEach( function ( _tag, i ) {
					controls = controls.concat( tagControls( tags, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-tag',
					onClick: function () { set( { tags: tags.concat( [ { label: '', iconName: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Tag' )
			);

			/* Key Messages section */
			if ( keyMessages.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'msg-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( h.TextControl, { key: 'keyMessagesHeading', label: 'Aside Heading', value: attr.keyMessagesHeading, onChange: function ( v ) { set( { keyMessagesHeading: v } ); } } ),
					el( 'strong', { key: 'msg-hdr', style: { display: 'block', marginBottom: '8px' } }, 'List Items (' + keyMessages.length + ')' )
				);
				keyMessages.forEach( function ( _msg, i ) {
					controls = controls.concat( keyMessageControls( keyMessages, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-msg',
					onClick: function () { set( { keyMessages: keyMessages.concat( [ '' ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Key Message' )
			);

			/* Settings section */
			controls.push(
				el( 'hr', { key: 'settings-sep', style: { margin: '24px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'settings-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Settings' ),
				el( h.ToggleControl, { key: 'useAltBackground', label: 'Use Alternate Background Color', checked: attr.useAltBackground, onChange: function ( v ) { set( { useAltBackground: v } ); } } ),
				el( h.ToggleControl, { key: 'isCenteredCard', label: 'Style as Centered Card (Empty State)', checked: attr.isCenteredCard, onChange: function ( v ) { set( { isCenteredCard: v } ); } } ),
				el( h.TextControl, { key: 'anchor', label: 'HTML Anchor (ID)', value: attr.anchor || '', onChange: function ( v ) { set( { anchor: v } ); }, help: 'Used for deep links, e.g. /solutions#public-safety' } )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
