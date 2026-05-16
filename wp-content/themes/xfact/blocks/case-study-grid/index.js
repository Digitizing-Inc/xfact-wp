/**
 * xFact Case Study Grid — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function itemControls(items, i, set, caseStudies) {
        const item = items[i];
        function update(key, value) {
            const arr = items.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ items: arr });
        }
        function remove() {
            const arr = items.slice();
            arr.splice(i, 1);
            set({ items: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = items.slice();
            if (intent === 'swap') {
                const temp = arr[fromIndex];
                arr[fromIndex] = arr[toIndex];
                arr[toIndex] = temp;
            } else {
                let insertAt =
                    intent === 'shift-bottom' ? toIndex + 1 : toIndex;
                if (insertAt > fromIndex) insertAt--;
                const itm = arr.splice(fromIndex, 1)[0];
                arr.splice(insertAt, 0, itm);
            }
            set({ items: arr });
        }

        const options = [];
        if (caseStudies) {
            caseStudies.forEach((cs) => {
                const title = cs.title.rendered || 'Untitled';
                const txt = document.createElement('textarea');
                txt.innerHTML = title;
                options.push({ label: txt.value, value: cs.id });
            });
        }

        // Handle legacy items: if postId is missing but linkUrl exists, try to match it
        let currentPostId = item.postId;
        if (!currentPostId && item.linkUrl && caseStudies) {
            const matched = caseStudies.find((cs) => {
                // Match if link ends with the same path, or exact match
                return (
                    cs.link === item.linkUrl ||
                    cs.link.indexOf(item.linkUrl) > -1
                );
            });
            if (matched) {
                currentPostId = matched.id;
            }
        }

        function onSelectCaseStudy(postId) {
            if (!postId) {
                update('postId', '');
                return;
            }
            const selected = caseStudies.find(
                (cs) => cs.id === parseInt(postId, 10),
            );
            if (selected) {
                const arr = items.slice();
                arr[i] = Object.assign({}, arr[i]);
                arr[i].postId = selected.id;

                const txt = document.createElement('textarea');
                txt.innerHTML = selected.title.rendered;
                arr[i].title = txt.value;

                arr[i].linkUrl = selected.link;

                // Try to extract summary and source from the case-study-details block
                let detailsSummary = '';
                let detailsSource = '';
                if (selected.content?.raw && wp.blocks?.parse) {
                    const parsedBlocks = wp.blocks.parse(selected.content.raw);
                    const detailsBlock = parsedBlocks.find(
                        (b) => b.name === 'xfact/case-study-details',
                    );
                    if (detailsBlock?.attributes) {
                        detailsSummary = detailsBlock.attributes.summary || '';
                        detailsSource = detailsBlock.attributes.source || '';
                    }
                }

                if (detailsSummary) {
                    arr[i].summary = detailsSummary;
                } else if (selected.excerpt) {
                    // Fallback to excerpt
                    const tmp = document.createElement('DIV');
                    tmp.innerHTML = selected.excerpt.rendered;
                    arr[i].summary = tmp.textContent || tmp.innerText || '';
                } else {
                    arr[i].summary = '';
                }

                arr[i].source = detailsSource;

                set({ items: arr });
            } else {
                update('postId', postId);
            }
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: 'item-',
                    index: i,
                    total: items.length,
                    label: `Case Study ${i + 1}`,
                    titleText:
                        item.title ||
                        item.name ||
                        item.label ||
                        item.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(h.ComboboxControl, {
                    label: 'Select Case Study',
                    value: currentPostId || '',
                    options: options,
                    onChange: onSelectCaseStudy,
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/case-study-grid', {
        edit: h.createEdit(
            'xfact/case-study-grid',
            'Case Study Grid Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const items = attr.items || [];

                const caseStudies = h.useSelect
                    ? h.useSelect(
                          (select) =>
                              select('core').getEntityRecords(
                                  'postType',
                                  'case_study',
                                  { per_page: -1 },
                              ),
                          [],
                      )
                    : [];

                let controls = [
                    el(h.TextControl, {
                        key: 'sectionLabel',
                        label: 'Pre-Title Label',
                        value: attr.sectionLabel || '',
                        onChange: (v) => {
                            set({ sectionLabel: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Title',
                        value: attr.heading || '',
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'description',
                        label: 'Description',
                        value: attr.description || '',
                        onChange: (v) => {
                            set({ description: v });
                        },
                    }),
                ];

                if (items.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'items-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'items-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Case Studies (${items.length})`,
                        ),
                    );
                    items.forEach((_item, i) => {
                        controls = controls.concat(
                            itemControls(items, i, set, caseStudies),
                        );
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-item',
                            onClick: () => {
                                set({
                                    items: items.concat([
                                        {
                                            title: '',
                                            summary: '',
                                            source: '',
                                            postId: '',
                                        },
                                    ]),
                                });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '15px',
                            },
                        },
                        '+ Add Case Study',
                    ),
                );

                /* Settings section */
                controls.push(
                    el('hr', {
                        key: 'settings-sep',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                    el(
                        'strong',
                        {
                            key: 'settings-hdr',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        'Settings',
                    ),
                    el(h.TextControl, {
                        key: 'anchor',
                        label: 'HTML Anchor (ID)',
                        value: attr.anchor || '',
                        onChange: (v) => {
                            set({ anchor: v });
                        },
                    }),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
