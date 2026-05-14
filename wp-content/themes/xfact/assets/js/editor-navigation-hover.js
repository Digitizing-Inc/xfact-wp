/**
 * Extend native WordPress Navigation Block with xFact hover color.
 */
( function () {
	'use strict';

	var assign = Object.assign;
	var addFilter = wp.hooks.addFilter;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody = wp.components.PanelBody;
	var createHigherOrderComponent = wp.compose.createHigherOrderComponent;
	var h = window.xfactBlockHelpers;

	// Add the new attribute.
	function addHoverColorAttribute( settings, name ) {
		if ( name !== 'core/navigation-link' && name !== 'core/navigation-submenu' ) {
			return settings;
		}

		if ( typeof settings.attributes !== 'undefined' ) {
			settings.attributes = assign( settings.attributes, {
				xfactHoverColor: {
					type: 'string',
					default: '',
				},
			} );
		}

		return settings;
	}
	addFilter(
		'blocks.registerBlockType',
		'xfact/navigation-hover-color/attribute',
		addHoverColorAttribute
	);

	// Add controls to the inspector.
	var withHoverColorControl = createHigherOrderComponent( function ( BlockEdit ) {
		return function ( props ) {
			if ( props.name !== 'core/navigation-link' && props.name !== 'core/navigation-submenu' ) {
				return h.el( BlockEdit, props );
			}

			var value = props.attributes.xfactHoverColor || '';
			// Strip '-horizontal' for the UI so it matches predefined colors in brandColorControl
			var uiValue = value ? value.replace('-horizontal', '') : '';

			return h.el(
				h.Fragment,
				{},
				h.el( BlockEdit, props ),
				h.el(
					InspectorControls,
					{},
					h.el(
						PanelBody,
						{
							title: 'xFact Submenu Settings',
							initialOpen: true,
						},
						h.brandColorControl(
							'Submenu Hover Background',
							uiValue,
							function( newVal ) {
								// Re-append '-horizontal' before saving
								var finalVal = newVal ? newVal.replace(')', '-horizontal)') : '';
								props.setAttributes( { xfactHoverColor: finalVal } );
							}
						)
					)
				)
			);
		};
	}, 'withHoverColorControl' );

	addFilter(
		'editor.BlockEdit',
		'xfact/navigation-hover-color/control',
		withHoverColorControl
	);

	// Apply styles in the editor view to match frontend class structure if needed.
	// Since navigation block handles its own rendering and we are just setting CSS vars on the frontend,
	// we inject the CSS variable to the block wrapper.
	var withHoverColorProp = createHigherOrderComponent( function ( BlockListBlock ) {
		return function ( props ) {
			if ( props.name !== 'core/navigation-link' && props.name !== 'core/navigation-submenu' ) {
				return h.el( BlockListBlock, props );
			}

			var color = props.attributes.xfactHoverColor;
			var wrapperProps = props.wrapperProps || {};
			
			if ( color ) {
				wrapperProps.style = assign( wrapperProps.style || {}, {
					'--xfact-hover-bg': color
				} );
				// Also add a helper class if needed
				wrapperProps.className = (wrapperProps.className ? wrapperProps.className + ' ' : '') + 'has-xfact-hover-bg';
			}

			return h.el( BlockListBlock, assign( {}, props, { wrapperProps: wrapperProps } ) );
		};
	}, 'withHoverColorProp' );

	addFilter(
		'editor.BlockListBlock',
		'xfact/navigation-hover-color/prop',
		withHoverColorProp
	);

} )();
