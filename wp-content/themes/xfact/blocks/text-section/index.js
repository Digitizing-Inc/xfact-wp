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

	wp.blocks.registerBlockType( 'xfact/text-section', {
		edit: h.createEdit( 'xfact/text-section', 'Text Section Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var tags = attr.tags || [];

			var controls = [
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'sectionIcon', label: 'Section Icon (Lucide name)', value: attr.sectionIcon || '', onChange: function ( v ) { set( { sectionIcon: v } ); }, help: 'e.g. Shield, Landmark, GraduationCap, HeartPulse, ServerCog' } ),
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'body', label: 'Body Text', value: attr.body, rows: 5, onChange: function ( v ) { set( { body: v } ); } } ),
				el( h.TextControl, { key: 'badgeText', label: 'Badge Text', value: attr.badgeText, onChange: function ( v ) { set( { badgeText: v } ); } } ),
				h.imageControl( 'Section Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
				attr.sectionImage
					? el( h.TextControl, { key: 'sectionImageAlt', label: 'Section Image Alt Text', value: attr.sectionImageAlt, onChange: function ( v ) { set( { sectionImageAlt: v } ); } } )
					: null,
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

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
