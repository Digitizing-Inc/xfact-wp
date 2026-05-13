/**
 * xFact Capability Areas — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function areaControls( areas, i, set ) {
		var area = areas[ i ];
		function update( key, value ) {
			var arr = areas.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { areas: arr } );
		}
		function remove() {
			var arr = areas.slice();
			arr.splice( i, 1 );
			set( { areas: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = areas.slice();
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
			set( { areas: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: areas.length,
				label: 'Area ' + ( i + 1 ),
				titleText: area.title || area.name || area.label || area.heading || '',
				onRemove: remove,
				onMoveItem: moveItem,
				iconName: area.iconName
			},
				el( h.TextControl, {
					key: 'title-' + i,
					label: 'Title',
					value: area.title || '',
					onChange: function ( v ) { update( 'title', v ); }
				} ),
				el( h.TextControl, {
					key: 'headline-' + i,
					label: 'Headline',
					value: area.headline || '',
					onChange: function ( v ) { update( 'headline', v ); }
				} ),
				el( h.TextareaControl, {
					key: 'body-' + i,
					label: 'Body',
					value: area.body || '',
					onChange: function ( v ) { update( 'body', v ); }
				} ),
				h.iconControl( 'Icon (Lucide)', area.iconName || '', function ( v ) { update( 'iconName', v ); }, 'iconName-' + i ),
				el( h.TextControl, {
					key: 'anchor-' + i,
					label: 'HTML Anchor (ID)',
					value: area.anchor || '',
					onChange: function ( v ) { update( 'anchor', v ); }
				} ),
				el( h.TextareaControl, {
					key: 'services-' + i,
					label: 'Services (comma separated)',
					value: ( area.services || [] ).join( ', ' ),
					onChange: function ( v ) { update( 'services', v.split( ',' ).map( function ( s ) { return s.trim(); } ).filter( Boolean ) ); }
				} )
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/capability-areas', {
		edit: h.createEdit( 'xfact/capability-areas', 'Capability Areas', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var areas = attr.areas || [];

			var controls = [];

			if ( areas.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'areas-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'areas-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Areas (' + areas.length + ')' )
				);
				areas.forEach( function ( _area, i ) {
					controls = controls.concat( areaControls( areas, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () {
						set( {
							areas: areas.concat( [ {
								title: '',
								headline: '',
								body: '',
								iconName: 'Circle',
								anchor: '',
								services: []
							} ] )
						} );
					},
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Area' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
