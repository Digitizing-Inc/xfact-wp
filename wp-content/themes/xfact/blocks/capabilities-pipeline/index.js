/**
 * xFact Capabilities Pipeline — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function itemControls( items, i, set, attrKey ) {
		var item = items[ i ];
		function update( key, value ) {
			var arr = items.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( Object.fromEntries( [ [ attrKey, arr ] ] ) );
		}
		function remove() {
			var arr = items.slice();
			arr.splice( i, 1 );
			set( Object.fromEntries( [ [ attrKey, arr ] ] ) );
		}

		return [
			el( 'hr', { key: 'sep-' + i, style: { margin: '16px 0', opacity: 0.3 } } ),
			el( 'div', {
				key: 'hdr-' + i,
				style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
			},
				el( 'strong', null, 'Step ' + ( i + 1 ) ),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true, style: { fontSize: '12px' } }, '✕ Remove' )
			),
			el( h.TextControl, { key: 'title-' + i, label: 'Title', value: item.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
			el( h.TextareaControl, { key: 'desc-' + i, label: 'Description', value: item.description || '', onChange: function ( v ) { update( 'description', v ); } } ),
			h.iconControl( 'Icon (Lucide)', item.iconName || '', function ( v ) { update( 'iconName', v ); }, 'icon-' + i ),
			h.imageControl(
				'Image',
				item.imageUrl || '',
				function ( media ) { update( 'imageUrl', media.url ); },
				function () { update( 'imageUrl', '' ); },
				'img-' + i
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/capabilities-pipeline', {
		edit: h.createEdit( 'xfact/capabilities-pipeline', 'Pipeline Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var caps = attr.capabilities || [];

			var controls = [
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'subtitle', label: 'Subtitle', value: attr.subtitle, onChange: function ( v ) { set( { subtitle: v } ); } } ),
				h.imageControl( 'Section Image', attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); }, 'sectionImage' ),
			];

			caps.forEach( function ( _cap, i ) {
				controls = controls.concat( itemControls( caps, i, set, 'capabilities' ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { capabilities: caps.concat( [ { title: '', description: '', iconName: 'Circle' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Step' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
