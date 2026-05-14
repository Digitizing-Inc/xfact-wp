/**
 * xFact Block Editor — shared utilities.
 *
 * Provides helpers used by all xFact block editor scripts.
 * Must be enqueued BEFORE individual block scripts.
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var useRef = wp.element.useRef;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var MediaUpload = wp.blockEditor.MediaUpload;
	var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var Button = wp.components.Button;
	var Disabled = wp.components.Disabled;
	var ToggleControl = wp.components.ToggleControl;
	var SelectControl = wp.components.SelectControl;
	var ComboboxControl = wp.components.ComboboxControl;
	var Modal = wp.components.Modal;
	var useSelect = wp.data ? wp.data.useSelect : null;

	/* ServerSideRender can be a default export in some WP versions */
	var SSR = wp.serverSideRender;
	if ( typeof SSR !== 'function' && SSR && typeof SSR.default === 'function' ) {
		SSR = SSR.default;
	}

	/**
	 * Build a simple edit component for an xFact dynamic block.
	 *
	 * @param {string}   blockName  Fully qualified block name, e.g. "xfact/hero".
	 * @param {string}   panelTitle Panel title shown in the sidebar.
	 * @param {Function} controlsFn A function( props ) returning an array of elements.
	 * @return {Function} React edit component.
	 */
	function createEdit( blockName, panelTitle, controlsFn ) {
		return function EditComponent( props ) {
			var blockProps = useBlockProps();
			var inspectorChildren;

			try {
				inspectorChildren = controlsFn ? controlsFn( props ) : [];
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.error( '[xfact] Error in controls for ' + blockName, e );
				inspectorChildren = [
					el( 'p', { key: 'err', style: { color: 'red' } },
						'Error rendering controls: ' + e.message
					),
				];
			}

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: panelTitle, initialOpen: true },
						inspectorChildren
					)
				),
				el(
					'div',
					blockProps,
					el( Disabled, null,
						el( SSR, {
							block: blockName,
							attributes: props.attributes,
						} )
					)
				)
			);
		};
	}

	/**
	 * Build a single-image upload control for use in InspectorControls.
	 *
	 * @param {string}   label     Label shown above the control.
	 * @param {string}   imageUrl  Current image URL (or empty string).
	 * @param {Function} onSelect  Callback( mediaObject ) when an image is chosen.
	 * @param {Function} onRemove  Callback() when "Remove" is clicked.
	 * @param {string}   [key]     Optional React key.
	 * @return {Object} React element.
	 */
	function imageControl( label, imageUrl, onSelect, onRemove, key ) {
		var children = [
			el( 'label', {
				key: 'lbl',
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, label ),
		];

		if ( imageUrl ) {
			children.push(
				el( 'div', { key: 'preview', style: { marginBottom: '8px' } },
					el( 'img', {
						src: imageUrl,
						alt: label,
						style: {
							maxWidth: '100%',
							height: 'auto',
							borderRadius: '4px',
							border: '1px solid #ddd',
						},
					} )
				)
			);
		}

		children.push(
			el( MediaUploadCheck, { key: 'upload-check' },
				el( MediaUpload, {
					onSelect: onSelect,
					allowedTypes: [ 'image' ],
					render: function ( obj ) {
						return el(
							Button,
							{
								onClick: obj.open,
								variant: imageUrl ? 'secondary' : 'primary',
								style: { marginRight: '8px' },
							},
							imageUrl ? 'Replace Image' : 'Upload Image'
						);
					},
				} )
			)
		);

		if ( imageUrl ) {
			children.push(
				el( Button, {
					key: 'remove',
					onClick: onRemove,
					variant: 'link',
					isDestructive: true,
				}, 'Remove' )
			);
		}

		return el( 'div', {
			key: key || 'img-ctrl-' + label,
			style: { marginBottom: '16px' },
		}, children );
	}

	/**
	 * Build a multi-image gallery control for use in InspectorControls.
	 *
	 * @param {string}   label    Label shown above the control.
	 * @param {Array}    images   Array of { url, id, alt } objects.
	 * @param {Function} onAdd    Callback( mediaObject ) when a new image is added.
	 * @param {Function} onRemove Callback( index ) when an image is removed.
	 * @param {string}   [key]    Optional React key.
	 * @return {Object} React element.
	 */
	function galleryControl( label, images, onAdd, onRemove, key ) {
		var safeImages = images || [];
		var items = safeImages.map( function ( img, i ) {
			return el( 'div', {
				key: 'gi-' + i,
				style: {
					display: 'inline-block',
					position: 'relative',
					marginRight: '8px',
					marginBottom: '8px',
				},
			},
				el( 'img', {
					src: img.url || img.src || '',
					alt: img.alt || '',
					style: {
						width: '80px',
						height: '60px',
						objectFit: 'cover',
						borderRadius: '4px',
						border: '1px solid #ddd',
						display: 'block',
					},
				} ),
				el( Button, {
					onClick: function () { onRemove( i ); },
					variant: 'link',
					isDestructive: true,
					style: { fontSize: '11px', padding: '0', display: 'block' },
				}, '×' )
			);
		} );

		return el( 'div', {
			key: key || 'gallery-ctrl-' + label,
			style: { marginBottom: '16px' },
		},
			el( 'label', {
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, label + ' (' + safeImages.length + ')' ),
			el( 'div', null, items ),
			el( MediaUploadCheck, null,
				el( MediaUpload, {
					onSelect: onAdd,
					allowedTypes: [ 'image' ],
					render: function ( obj ) {
						return el( Button, {
							onClick: obj.open,
							variant: 'secondary',
						}, 'Add Image' );
					},
				} )
			)
		);
	}

	/**
	 * Render an SVG safely with a wrapper.
	 */
	function renderSvg( innerHtml ) {
		if ( ! innerHtml ) {
			return '';
		}
		return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="fill: none; stroke: currentColor;">' + innerHtml + '</svg>';
	}

	/**
	 * Build a visual Icon Picker control for use in InspectorControls.
	 *
	 * @param {string}   label    Label shown above the control.
	 * @param {string}   value    Current icon name (e.g. 'Shield').
	 * @param {Function} onChange Callback( iconName ).
	 * @param {string}   [key]    Optional React key.
	 * @return {Object} React element.
	 */
	function iconControl( label, value, onChange, key ) {
		return el( IconPickerControl, {
			key: key || 'icon-ctrl-' + label,
			label: label,
			value: value,
			onChange: onChange,
		} );
	}

	function IconPickerControl( props ) {
		var isModalOpenState = useState( false );
		var isModalOpen = isModalOpenState[ 0 ];
		var setIsModalOpen = isModalOpenState[ 1 ];

		var searchQueryState = useState( '' );
		var searchQuery = searchQueryState[ 0 ];
		var setSearchQuery = searchQueryState[ 1 ];

		var visibleCountState = useState( 100 );
		var visibleCount = visibleCountState[ 0 ];
		var setVisibleCount = visibleCountState[ 1 ];

		var icons = window.xfactLucideIcons || {};
		var iconNames = Object.keys( icons );

		var filteredIcons = iconNames.filter( function ( name ) {
			return name.toLowerCase().indexOf( searchQuery.toLowerCase() ) !== -1;
		} ).slice( 0, visibleCount );

		var loaderRef = useRef( null );

		useEffect( function () {
			if ( ! isModalOpen ) return;

			var observer = new IntersectionObserver( function ( entries ) {
				if ( entries[ 0 ].isIntersecting ) {
					setVisibleCount( function ( prev ) { return prev + 100; } );
				}
			}, { rootMargin: '200px' } );

			if ( loaderRef.current ) {
				observer.observe( loaderRef.current );
			}

			return function () {
				observer.disconnect();
			};
		}, [ isModalOpen, filteredIcons.length ] );

		// Current selected SVG or a fallback empty placeholder
		var currentSvg = renderSvg( icons[ props.value ] );

		// Button to open modal
		var openButton = el( Button, {
			variant: 'secondary',
			onClick: function () { setIsModalOpen( true ); },
			style: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1', justifyContent: 'flex-start' },
		},
			el( 'div', {
				dangerouslySetInnerHTML: { __html: currentSvg },
				style: { width: '24px', height: '24px', display: 'flex' },
			} ),
			el( 'span', null, props.value || 'Select Icon...' )
		);

		var removeButton = null;
		if ( props.value ) {
			removeButton = el( Button, {
				variant: 'link',
				isDestructive: true,
				onClick: function () { props.onChange( '' ); },
				style: { padding: '0 8px' },
			}, 'Remove' );
		}

		var triggerArea = el( 'div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
			openButton,
			removeButton
		);

		var modal = null;
		if ( isModalOpen ) {
			modal = el( Modal, {
				title: 'Select an Icon',
				onRequestClose: function () { setIsModalOpen( false ); },
				style: { width: '600px', maxWidth: '90vw', height: '80vh', display: 'flex', flexDirection: 'column' },
			},
				el( 'div', { style: { paddingBottom: '16px' } },
					el( TextControl, {
						label: 'Search icons...',
						value: searchQuery,
						onChange: function ( val ) {
							setSearchQuery( val );
							setVisibleCount( 100 );
						},
						placeholder: 'e.g. Shield, User, Arrow...',
					} )
				),
				el( 'div', {
					style: {
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
						gap: '8px',
						overflowY: 'auto',
						flex: '1',
						padding: '4px',
					},
				},
					filteredIcons.map( function ( name ) {
						return el( Button, {
							key: name,
							variant: 'secondary',
							onClick: function () {
								props.onChange( name );
								setIsModalOpen( false );
							},
							style: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '8px',
								height: 'auto',
								padding: '12px 8px',
								justifyContent: 'center',
								background: props.value === name ? '#f0f0f0' : undefined,
								border: props.value === name ? '1px solid #1e1e1e' : undefined,
							},
						},
							el( 'div', {
								dangerouslySetInnerHTML: { __html: renderSvg( icons[ name ] ) },
								style: { width: '24px', height: '24px', display: 'flex' },
							} ),
							el( 'span', {
								style: { fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%', whiteSpace: 'nowrap' },
							}, name )
						);
					} ).concat( [
						el( 'div', {
							key: 'loader',
							ref: loaderRef,
							style: { height: '20px', gridColumn: '1 / -1' }
						} )
					] )
				)
			);
		}

		return el( 'div', { style: { marginBottom: '16px' } },
			el( 'label', {
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, props.label ),
			triggerArea,
			modal
		);
	}

	/**
	 * Build a header for an array item with reordering controls.
	 *
	 * @param {string}   label      Item label (e.g., 'Card 1').
	 * @param {number}   index      Current index of the item.
	 * @param {number}   total      Total number of items in the array.
	 * @param {Function} onMoveItem Callback(fromIndex, toIndex, intent) for drag-and-drop.
	 * @param {boolean}  [isOpen]   Whether the item is currently expanded.
	 * @param {Function} [toggle]   Callback to toggle expansion.
	 * @return {Object} React element.
	 */
	function arrayItemHeader( label, index, total, onMoveItem, isOpen, toggle, customProps ) {
		customProps = customProps || {};
		var icons = window.xfactLucideIcons || {};
		var gripSvg = renderSvg( icons['GripVertical'] || '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>' );
		var chevronSvg = renderSvg( isOpen 
			? ( icons['ChevronUp'] || '<polyline points="18 15 12 9 6 15"></polyline>' ) 
			: ( icons['ChevronDown'] || '<polyline points="6 9 12 15 18 9"></polyline>' ) 
		);

		var iconSvg = null;
		if ( customProps.iconName && icons[customProps.iconName] ) {
			iconSvg = renderSvg( icons[customProps.iconName] );
		} else if ( customProps.itemType === 'button' ) {
			iconSvg = renderSvg( icons['MousePointerClick'] || '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>' );
		}

		var dragProps = {};
		if ( onMoveItem ) {
			dragProps.draggable = true;
			dragProps.onDragStart = function( e ) {
				e.stopPropagation();
				e.dataTransfer.setData( 'text/plain', index );
				e.dataTransfer.effectAllowed = 'move';
				if ( e.target && e.target.parentElement ) {
					var rect = e.target.parentElement.getBoundingClientRect();
					window.__xfactDraggedHeight = rect.height;
				}
				
				// Add dragging style to the original element
				setTimeout(function() {
					if ( e.target && e.target.parentElement ) {
						e.target.parentElement.style.opacity = '0.4';
						e.target.parentElement.style.borderStyle = 'dashed';
					}
				}, 0);
			};
			dragProps.onDragEnd = function( e ) {
				if ( e.target && e.target.parentElement ) {
					e.target.parentElement.style.opacity = '1';
					e.target.parentElement.style.borderStyle = 'solid';
				}
			};
		}

		return el( 'div', Object.assign( {
			style: { 
				display: 'flex', 
				justifyContent: 'space-between', 
				alignItems: 'center', 
				marginBottom: '0',
				paddingBottom: '0',
				borderBottom: 'none'
			}
		}, dragProps ),
			el( 'div', { 
				onClick: toggle,
				style: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1', minWidth: '0', cursor: 'pointer' } 
			},
				el( 'div', {
					dangerouslySetInnerHTML: { __html: gripSvg },
					style: { width: '20px', height: '20px', display: 'flex', color: '#888', alignItems: 'center', justifyContent: 'center', cursor: onMoveItem ? 'grab' : 'default' },
				} ),
				iconSvg ? el( 'div', {
					dangerouslySetInnerHTML: { __html: iconSvg },
					style: { width: '16px', height: '16px', display: 'flex', color: '#007cba', alignItems: 'center', justifyContent: 'center' },
				} ) : null,
				el( 'span', { 
					style: { flex: 1, userSelect: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'normal' } 
				}, label )
			),
			el( 'div', { style: { display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 } },
				toggle ? el( Button, {
					onClick: toggle,
					variant: 'tertiary',
					style: { minWidth: 'auto', padding: '2px', marginLeft: '8px' }, // extra margin to separate chevron from arrows
					title: isOpen ? 'Collapse' : 'Expand'
				}, el( 'div', { dangerouslySetInnerHTML: { __html: chevronSvg }, style: { width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' } } ) ) : null
			)
		);
	}

	/**
	 * Wrapper for array items to handle collapsed state and dynamic titles.
	 */
	function ArrayItemWrapper( props ) {
		var isNewState = useState( function() {
			var t = props.titleText;
			return !t || t === 'New Button' || t === 'New Metric';
		} );
		var isNew = isNewState[0];

		var isOpenState = useState( isNew );
		var isOpen = isOpenState[0];
		var setIsOpen = isOpenState[1];
		
		var dropIntentState = useState( null );
		var dropIntent = dropIntentState[0];
		var setDropIntent = dropIntentState[1];

		var containerRef = wp.element.useRef( null );

		wp.element.useEffect( function() {
			if ( isNew && containerRef.current ) {
				setTimeout( function() {
					if ( containerRef.current ) {
						containerRef.current.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );
						var input = containerRef.current.querySelector('input:not([type="hidden"]), textarea');
						if ( input ) input.focus( { preventScroll: true } );
					}
				}, 100 );
			}
		}, [] );

		function toggle() {
			setIsOpen( ! isOpen );
		}

		var displayTitle = props.titleText ? props.titleText : props.label;

		function handleRemove() {
			if ( window.confirm( 'Are you sure you want to remove item "' + displayTitle + '"?' ) ) {
				props.onRemove();
			}
		}

		var onMoveItem = props.onMoveItem;
		var index = props.index;

		var dragProps = {};
		if ( onMoveItem ) {
			dragProps.onDragOver = function( e ) {
				e.preventDefault();
				e.stopPropagation();
				e.dataTransfer.dropEffect = 'move';
				
				var rect = e.currentTarget.getBoundingClientRect();
				var y = e.clientY - rect.top;
				
				// Calculate bounds of the inner container to prevent flickering
				var placeholderHeight = window.__xfactDraggedHeight || 48;
				var innerTop = (dropIntent === 'shift-top') ? placeholderHeight : 0;
				var innerBottom = (dropIntent === 'shift-bottom') ? rect.height - placeholderHeight : rect.height;
				var innerHeight = innerBottom - innerTop;
				
				var threshold = Math.min( 24, innerHeight * 0.25 ); // 25% of height, max 24px
				var innerY = y - innerTop;
				
				var intent = 'swap';
				if ( innerY < threshold ) intent = 'shift-top';
				else if ( innerY > innerHeight - threshold ) intent = 'shift-bottom';
				
				if ( dropIntent !== intent ) setDropIntent( intent );
			};
			dragProps.onDragEnter = function( e ) {
				e.preventDefault();
				e.stopPropagation();
			};
			dragProps.onDragLeave = function( e ) {
				e.stopPropagation();
				if ( !e.currentTarget.contains(e.relatedTarget) ) {
					setDropIntent( null );
				}
			};
			dragProps.onDrop = function( e ) {
				e.preventDefault();
				e.stopPropagation();
				
				var rect = e.currentTarget.getBoundingClientRect();
				var y = e.clientY - rect.top;
				var placeholderHeight = window.__xfactDraggedHeight || 48;
				var innerTop = (dropIntent === 'shift-top') ? placeholderHeight : 0;
				var innerBottom = (dropIntent === 'shift-bottom') ? rect.height - placeholderHeight : rect.height;
				var innerHeight = innerBottom - innerTop;
				
				var threshold = Math.min( 24, innerHeight * 0.25 );
				var innerY = y - innerTop;
				
				var finalIntent = 'swap';
				if ( innerY < threshold ) finalIntent = 'shift-top';
				else if ( innerY > innerHeight - threshold ) finalIntent = 'shift-bottom';

				setDropIntent( null );

				var draggedIdx = parseInt( e.dataTransfer.getData( 'text/plain' ), 10 );
				if ( ! isNaN( draggedIdx ) && draggedIdx !== index ) {
					onMoveItem( draggedIdx, index, finalIntent );
				}
			};
		}

		return el( 'div', Object.assign({
			style: { position: 'relative' }, // Outer container for drop logic
			ref: containerRef
		}, dragProps),
			dropIntent === 'shift-top' ? el( 'div', { style: { height: window.__xfactDraggedHeight || 48, border: '2px dashed #007cba', margin: '0', borderRadius: '0', background: 'rgba(0,124,186,0.05)', position: 'relative', zIndex: 1 } } ) : null,
			el( 'div', { // Inner visual container
				style: { 
					border: dropIntent === 'swap' ? '2px solid #007cba' : '1px solid #ddd', 
					padding: '8px', 
					marginBottom: '-1px', 
					position: 'relative', 
					borderRadius: '0', 
					transition: 'all 0.2s ease', 
					background: dropIntent === 'swap' ? 'rgba(0,124,186,0.05)' : (isOpen ? '#fff' : '#f8f9fa'),
					transform: dropIntent === 'swap' ? 'scale(1.02)' : 'none',
					boxShadow: dropIntent === 'swap' ? '0 0 0 2px rgba(0,124,186,0.3)' : 'none',
					zIndex: dropIntent === 'swap' ? 2 : 1
				}
			},
				arrayItemHeader( displayTitle, props.index, props.total, props.onMoveItem, isOpen, toggle, { iconName: props.iconName, itemType: props.itemType } ),
				isOpen ? el( 'div', { style: { marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eee' } }, 
					props.children,
					el( 'div', { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #eee', textAlign: 'right' } },
						el( Button, { 
							onClick: handleRemove, 
							variant: 'link', 
							isDestructive: true, 
							style: { fontSize: '13px', padding: '0' }
						}, 'Remove Item' )
					)
				) : null
			),
			dropIntent === 'shift-bottom' ? el( 'div', { style: { height: window.__xfactDraggedHeight || 48, border: '2px dashed #007cba', margin: '0', borderRadius: '0', background: 'rgba(0,124,186,0.05)', position: 'relative', zIndex: 1 } } ) : null
		);
	}

	/**
	 * Build controls for an array of buttons.
	 *
	 * @param {Array}    buttons    The current array of buttons.
	 * @param {Function} set        The setAttributes function.
	 * @param {string}   attributeName The name of the attribute (e.g. 'buttons').
	 * @return {Array} React elements.
	 */
	function buttonArrayControls( buttons, set, attributeName ) {
		var attrName = attributeName || 'buttons';
		var safeButtons = buttons || [];
		
		var controls = [];
		if ( safeButtons.length > 0 ) {
			safeButtons.forEach( function ( btn, i ) {
				function update( key, value ) {
					var arr = safeButtons.slice();
					arr[ i ] = Object.assign( {}, arr[ i ] );
					arr[ i ][ key ] = value;
					var updates = {};
					updates[ attrName ] = arr;
					set( updates );
				}
				function remove() {
					var arr = safeButtons.slice();
					arr.splice( i, 1 );
					var updates = {};
					updates[ attrName ] = arr;
					set( updates );
				}
				function moveItem( fromIndex, toIndex, intent ) {
					var arr = safeButtons.slice();
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
					var updates = {};
					updates[ attrName ] = arr;
					set( updates );
				}
				
				controls.push(
					el( ArrayItemWrapper, {
						key: attrName + '-item-' + i,
						index: i,
						total: safeButtons.length,
						label: 'Button ' + ( i + 1 ),
						titleText: btn.label || 'New Button',
						onRemove: remove,
						onMoveItem: moveItem,
						itemType: 'button'
					},
						el( TextControl, {
							label: 'Label',
							value: btn.label || '',
							onChange: function ( v ) { update( 'label', v ); },
						} ),
						el( TextControl, {
							label: 'URL',
							value: btn.url || '',
							onChange: function ( v ) { update( 'url', v ); },
						} ),
						el( SelectControl, {
							label: 'Variant',
							value: btn.variant || 'primary',
							options: [
								{ label: 'Primary', value: 'primary' },
								{ label: 'Secondary (Outline)', value: 'secondary' },
								{ label: 'Text Link', value: 'link' },
							],
							onChange: function ( v ) { update( 'variant', v ); },
						} )
					)
				);
			} );
		}

		controls.push(
			el( Button, {
				key: attrName + '-add',
				onClick: function () { 
					var arr = safeButtons.slice();
					arr.push( { label: 'New Button', url: '', variant: 'primary' } );
					var updates = {};
					updates[ attrName ] = arr;
					set( updates ); 
				},
				variant: 'secondary',
				style: { width: '100%', justifyContent: 'center', marginTop: '15px' },
			}, '+ Add Button' )
		);

		return controls;
	}

	/**
	 * Build controls for an array of buttons.
	 *
	 * @param {Array}    buttons    The current array of buttons.
	 * @param {Function} set        The setAttributes function.
	 * @param {string}   attributeName The name of the attribute (e.g. 'buttons').
	 * @return {Array} React elements.
	 */

	/**
	 * Build a brand color/gradient control.
	 */
	function brandColorControl( label, value, onChange, key ) {
		var gradients = [
			{ name: 'None (Transparent)', slug: 'transparent', color: '' },
			{ name: 'Primary 1', slug: 'primary-1', color: 'var(--xfact-gradient-primary-1)' },
			{ name: 'Primary 2', slug: 'primary-2', color: 'var(--xfact-gradient-primary-2)' },
			{ name: 'Secondary 1', slug: 'secondary-1', color: 'var(--xfact-gradient-secondary-1)' },
			{ name: 'Secondary 2', slug: 'secondary-2', color: 'var(--xfact-gradient-secondary-2)' },
			{ name: 'Secondary 3', slug: 'secondary-3', color: 'var(--xfact-gradient-secondary-3)' },
			{ name: 'Secondary 4', slug: 'secondary-4', color: 'var(--xfact-gradient-secondary-4)' },
		];

		function renderSwatches( items ) {
			return el( 'div', { style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' } },
				items.map( function ( item ) {
					var isActive = value === item.color;
					return el( wp.components.Button, {
						key: item.slug,
						variant: isActive ? 'primary' : 'secondary',
						onClick: function () { onChange( item.color ); },
						style: {
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-start',
							gap: '12px',
							width: '100%',
							padding: '8px 12px',
							height: 'auto'
						}
					},
						el( 'div', {
							style: {
								width: '24px',
								height: '24px',
								borderRadius: '4px',
								background: item.color || 'transparent',
								border: '1px solid rgba(0,0,0,0.1)',
								flexShrink: 0
							}
						}),
						el( 'span', null, item.name )
					);
				} )
			);
		}

		return el( 'div', { key: key || 'brand-color-' + label, style: { marginBottom: '24px' } },
			el( 'label', {
				style: {
					display: 'block',
					marginBottom: '12px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, label ),
			renderSwatches( gradients ),
			el( wp.components.Button, {
				variant: 'link',
				isDestructive: true,
				onClick: function () { onChange( '' ); },
				style: { fontSize: '12px', padding: 0 }
			}, 'Clear Selection' )
		);
	}

	// Expose to window for use by individual block scripts.
	window.xfactBlockHelpers = {
		el: el,
		createEdit: createEdit,
		imageControl: imageControl,
		galleryControl: galleryControl,
		iconControl: iconControl,
		brandColorControl: brandColorControl,
		arrayItemHeader: arrayItemHeader,
		ArrayItemWrapper: ArrayItemWrapper,
		Fragment: Fragment,
		InspectorControls: InspectorControls,
		MediaUpload: MediaUpload,
		MediaUploadCheck: MediaUploadCheck,
		useBlockProps: useBlockProps,
		PanelBody: PanelBody,
		TextControl: TextControl,
		TextareaControl: TextareaControl,
		Button: Button,
		Disabled: Disabled,
		ToggleControl: ToggleControl,
		SelectControl: SelectControl,
		ComboboxControl: ComboboxControl,
		useSelect: useSelect,
		ServerSideRender: SSR,
		buttonArrayControls: buttonArrayControls,
	};
} )();
