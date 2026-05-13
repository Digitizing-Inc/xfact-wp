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
			set( Object.fromEntries( [ [ attrKey, arr ] ] ) );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: items.length,
				label: 'Step ' + ( i + 1 ),
				titleText: item.title || item.name || item.label || item.heading || '',
				onRemove: remove,
				onMoveItem: moveItem,
				iconName: item.iconName
			},
				el( h.TextControl, { key: 'title-' + i, label: 'Title', value: item.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextareaControl, { key: 'desc-' + i, label: 'Description', value: item.description || '', onChange: function ( v ) { update( 'description', v ); } } ),
				h.iconControl( 'Icon (Lucide)', item.iconName || '', function ( v ) { update( 'iconName', v ); }, 'icon-' + i ),
				h.imageControl(
					'Image',
					item.imageUrl || '',
					function ( media ) { update( 'imageUrl', media.url ); },
					function () { update( 'imageUrl', '' ); },
					'img-' + i
				)
			) ];
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

			if ( caps.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'caps-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'caps-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Steps (' + caps.length + ')' )
				);
				caps.forEach( function ( _cap, i ) {
					controls = controls.concat( itemControls( caps, i, set, 'capabilities' ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { capabilities: caps.concat( [ { title: '', description: '', iconName: 'Circle' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Step' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
