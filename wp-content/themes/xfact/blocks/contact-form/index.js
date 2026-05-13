/**
 * xFact Contact Form — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function checklistControls( items, i, set ) {
		var item = items[ i ];
		function update( key, value ) {
			var arr = items.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { assessmentChecklist: arr } );
		}
		function remove() {
			var arr = items.slice();
			arr.splice( i, 1 );
			set( { assessmentChecklist: arr } );
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
			set( { assessmentChecklist: arr } );
		}
		return [
			el( h.ArrayItemWrapper, {
				key: 'wrap-',
				index: i,
				total: items.length,
				label: 'Item ' + ( i + 1 ),
				titleText: item.title || item.name || item.label || item.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				el( h.TextControl, {
					key: 'text-' + i,
					label: 'Text',
					value: item.text || '',
					onChange: function ( v ) { update( 'text', v ); }
				} )
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/contact-form', {
		edit: h.createEdit( 'xfact/contact-form', 'Contact Form Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var buttons = attr.buttons || [];

			var controls = [
				el( h.TextControl, {
					key: 'heading',
					label: 'Title',
					value: attr.heading,
					onChange: function ( v ) { set( { heading: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'subtitle',
					label: 'Description',
					value: attr.subtitle,
					onChange: function ( v ) { set( { subtitle: v } ); },
				} ),
				el( 'hr', { key: 'form-settings-sep', style: { margin: '24px 0', opacity: 0.3 } } ),
				el( h.TextControl, {
					key: 'recipientEmail',
					label: 'Recipient Email (Fallback)',
					value: attr.recipientEmail,
					onChange: function ( v ) { set( { recipientEmail: v } ); },
				} ),
				el( h.TextControl, {
					key: 'formId',
					label: 'Gravity Form ID',
					value: attr.formId,
					onChange: function ( v ) { set( { formId: v } ); },
				} ),
				el( 'hr', { key: 'assessment-sep', style: { margin: '24px 0', borderTop: '2px solid #ccc' } } ),
				el( 'strong', { key: 'assessment-title', style: { display: 'block', marginBottom: '16px', fontSize: '1.2em' } }, 'Assessment Card (Right Side)' ),
				el( h.TextControl, {
					key: 'assessmentLabel',
					label: 'Assessment Pre-Title Label',
					value: attr.assessmentLabel,
					onChange: function ( v ) { set( { assessmentLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'assessmentHeading',
					label: 'Assessment Title',
					value: attr.assessmentHeading,
					onChange: function ( v ) { set( { assessmentHeading: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'assessmentDescription',
					label: 'Assessment Description',
					value: attr.assessmentDescription,
					onChange: function ( v ) { set( { assessmentDescription: v } ); },
				} ),
			];

			var checklist = attr.assessmentChecklist || [];
			if ( checklist.length > 0 ) {
				controls.push(
					el( 'hr', { key: 'items-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
					el( 'strong', { key: 'items-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Checklist Items (' + checklist.length + ')' )
				);
				checklist.forEach( function ( _item, i ) {
					controls = controls.concat( checklistControls( checklist, i, set ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { assessmentChecklist: checklist.concat( [ { text: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
				}, '+ Add Checklist Item' )
			);

			/* Buttons section */
			controls.push(
				el( 'hr', { key: 'buttons-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( 'strong', { key: 'buttons-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Assessment Buttons (' + buttons.length + ')' )
			);
			controls = controls.concat( h.buttonArrayControls( buttons, set, 'buttons' ) );

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
