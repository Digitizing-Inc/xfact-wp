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
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = sections.slice();
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
			set( { sections: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: sections.length,
				label: 'Section ' + ( i + 1 ),
				titleText: section.title || section.name || section.label || section.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, { key: 'title-' + i, label: 'Title', value: section.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( h.TextareaControl, { key: 'content-' + i, label: 'Content', value: section.content || '', onChange: function ( v ) { update( 'content', v ); } } )
			) ];
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

			if ( sections.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'sections-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'sections-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Sections (' + sections.length + ')' )
				);
				sections.forEach( function ( _sec, i ) {
					controls = controls.concat( sectionControls( sections, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { sections: sections.concat( [ { title: '', content: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Section' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
