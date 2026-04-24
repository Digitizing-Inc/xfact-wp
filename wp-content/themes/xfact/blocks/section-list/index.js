/**
 * xFact Section List — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function sectionControls( sections, i, set ) {
		var section = sections[ i ];
		function update( key, value ) {
			var arr = sections.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { sections: arr } );
		}
		function remove() {
			var arr = sections.slice();
			arr.splice( i, 1 );
			set( { sections: arr } );
		}

		return [
			el( 'hr', { key: 'sep-' + i, style: { margin: '16px 0', opacity: 0.3 } } ),
			el( 'div', {
				key: 'hdr-' + i,
				style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
			},
				el( 'strong', null, 'Section ' + ( i + 1 ) ),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true, style: { fontSize: '12px' } }, '✕ Remove' )
			),
			el( h.TextControl, { key: 'title-' + i, label: 'Title', value: section.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
			el( h.TextareaControl, { key: 'content-' + i, label: 'Content', value: section.content || '', onChange: function ( v ) { update( 'content', v ); } } ),
		];
	}

	wp.blocks.registerBlockType( 'xfact/section-list', {
		edit: h.createEdit( 'xfact/section-list', 'Section List Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var sections = attr.sections || [];

			var controls = [
				el( wp.components.ToggleControl, { 
					key: 'showNumbers', 
					label: 'Show Numbers', 
					checked: attr.showNumbers !== false,
					onChange: function ( v ) { set( { showNumbers: v } ); } 
				} ),
				el( h.TextareaControl, { key: 'introText', label: 'Introductory Text', value: attr.introText || '', onChange: function ( v ) { set( { introText: v } ); } } ),
			];

			sections.forEach( function ( _sec, i ) {
				controls = controls.concat( sectionControls( sections, i, set ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { sections: sections.concat( [ { title: '', content: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Section' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
