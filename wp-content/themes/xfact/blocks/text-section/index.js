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

		return [
			el( 'div', {
				key: 'tag-' + i,
				style: { display: 'flex', gap: '4px', alignItems: 'flex-start', marginBottom: '8px' },
			},
				el( h.TextControl, {
					label: 'Tag ' + ( i + 1 ) + ' Label',
					value: tag.label || '',
					onChange: function ( v ) { update( 'label', v ); },
					style: { flex: 1 },
				} ),
				el( h.TextControl, {
					label: 'Icon',
					value: tag.iconName || '',
					onChange: function ( v ) { update( 'iconName', v ); },
					style: { width: '90px' },
				} ),
				el( h.Button, {
					onClick: remove,
					variant: 'link',
					isDestructive: true,
					style: { marginTop: '24px', fontSize: '12px' },
				}, '✕' )
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

		return [
			el( 'div', {
				key: 'msg-' + i,
				style: { display: 'flex', gap: '4px', alignItems: 'flex-start', marginBottom: '8px' },
			},
				el( h.TextControl, {
					label: 'Key Message ' + ( i + 1 ),
					value: msg || '',
					onChange: update,
					style: { flex: 1 },
				} ),
				el( h.Button, {
					onClick: remove,
					variant: 'link',
					isDestructive: true,
					style: { marginTop: '24px', fontSize: '12px' },
				}, '✕' )
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/text-section', {
		edit: h.createEdit( 'xfact/text-section', 'Text Section Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var tags = attr.tags || [];
			var keyMessages = attr.keyMessages || [];

			var controls = [
				el( h.TextControl, { key: 'anchor', label: 'Section ID (HTML Anchor)', value: attr.anchor || '', onChange: function ( v ) { set( { anchor: v } ); }, help: 'Used for deep links, e.g. /solutions#public-safety' } ),
				el( 'hr', { key: 'anchor-sep', style: { margin: '12px 0', opacity: 0.15 } } ),
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				h.iconControl( 'Section Icon (Lucide)', attr.sectionIcon || '', function ( v ) { set( { sectionIcon: v } ); }, 'sectionIcon' ),
				el( h.ToggleControl, { key: 'useAltBackground', label: 'Use Alternate Background Color', checked: attr.useAltBackground, onChange: function ( v ) { set( { useAltBackground: v } ); } } ),
				el( h.ToggleControl, { key: 'isCenteredCard', label: 'Style as Centered Card (Empty State)', checked: attr.isCenteredCard, onChange: function ( v ) { set( { isCenteredCard: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'subtitle', label: 'Subtitle / Headline', value: attr.subtitle || '', rows: 2, onChange: function ( v ) { set( { subtitle: v } ); } } ),
				el( h.TextareaControl, { key: 'body', label: 'Body Text', value: attr.body, rows: 5, onChange: function ( v ) { set( { body: v } ); } } ),
				el( h.TextControl, { key: 'badgeText', label: 'Badge Text', value: attr.badgeText, onChange: function ( v ) { set( { badgeText: v } ); } } ),
				h.imageControl( 'Section Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
				attr.sectionImage
					? el( h.TextControl, { key: 'sectionImageAlt', label: 'Section Image Alt Text', value: attr.sectionImageAlt, onChange: function ( v ) { set( { sectionImageAlt: v } ); } } )
					: null,
				el( h.TextControl, { key: 'linkText', label: 'Link Text', value: attr.linkText || '', onChange: function ( v ) { set( { linkText: v } ); } } ),
				el( h.TextControl, { key: 'linkUrl', label: 'Link URL', value: attr.linkUrl || '', onChange: function ( v ) { set( { linkUrl: v } ); } } ),
				el( h.ToggleControl, { key: 'linkIsButton', label: 'Style Link as Button', checked: attr.linkIsButton, onChange: function ( v ) { set( { linkIsButton: v } ); } } ),
			];

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
					style: { width: '100%', justifyContent: 'center', marginTop: '8px' },
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
					style: { width: '100%', justifyContent: 'center', marginTop: '8px' },
				}, '+ Add Key Message' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
