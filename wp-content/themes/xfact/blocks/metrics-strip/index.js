/**
 * xFact Metrics Strip — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function metricControls( metrics, i, set ) {
		var m = metrics[ i ];
		function update( key, value ) {
			var arr = metrics.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { metrics: arr } );
		}
		function remove() {
			var arr = metrics.slice();
			arr.splice( i, 1 );
			set( { metrics: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = metrics.slice();
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
			set( { metrics: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: metrics.length,
				label: 'Metric ' + ( i + 1 ),
				titleText: m.title || m.name || m.label || m.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, { key: 'val-' + i, label: 'Value', value: m.value || '', onChange: function ( v ) { update( 'value', v ); } } ),
				el( h.TextControl, { key: 'lbl-' + i, label: 'Label', value: m.label || '', onChange: function ( v ) { update( 'label', v ); } } )
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/metrics-strip', {
		edit: h.createEdit( 'xfact/metrics-strip', 'Metrics Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var metrics = attr.metrics || [];

			var controls = [];

			if ( metrics.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'metrics-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'metrics-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Metrics (' + metrics.length + ')' )
				);
				metrics.forEach( function ( _m, i ) {
					controls = controls.concat( metricControls( metrics, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { metrics: metrics.concat( [ { value: '0', label: 'New Metric' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Metric' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
