/**
 * xFact Case Study Grid — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function itemControls( items, i, set ) {
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

		return [
			el( 'div', {
				key: 'item-' + i,
				style: { border: '1px solid #ddd', padding: '12px', marginBottom: '12px', borderRadius: '4px' },
			},
				el( h.TextControl, { label: 'Case Study Title', value: item.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextareaControl, { label: 'Summary', value: item.summary || '', rows: 3, onChange: function ( v ) { update( 'summary', v ); } } ),
				el( h.TextControl, { label: 'Source (e.g. xFact)', value: item.source || '', onChange: function ( v ) { update( 'source', v ); } } ),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true }, 'Remove Case Study' )
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/case-study-grid', {
		edit: h.createEdit( 'xfact/case-study-grid', 'Case Study Grid Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var items = attr.items || [];

			var controls = [
				el( h.TextControl, { key: 'anchor', label: 'Section ID (HTML Anchor)', value: attr.anchor || '', onChange: function ( v ) { set( { anchor: v } ); } } ),
				el( 'hr', { key: 'sep1', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel || '', onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Section Heading', value: attr.heading || '', onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'description', label: 'Section Description', value: attr.description || '', onChange: function ( v ) { set( { description: v } ); } } )
			];

			if ( items.length > 0 ) {
				controls.push( el( 'strong', { key: 'items-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Case Studies (' + items.length + ')' ) );
				items.forEach( function ( _item, i ) {
					controls = controls.concat( itemControls( items, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-item',
					onClick: function () { set( { items: items.concat( [ { title: '', summary: '', source: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '8px' },
				}, '+ Add Case Study' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
}() );
