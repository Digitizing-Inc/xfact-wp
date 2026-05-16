/**
 * xFact Capabilities Pipeline — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function itemControls(items, i, set, attrKey) {
        const item = items[i];
        function update(key, value) {
            const arr = items.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set(Object.fromEntries([[attrKey, arr]]));
        }
        function remove() {
            const arr = items.slice();
            arr.splice(i, 1);
            set(Object.fromEntries([[attrKey, arr]]));
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
            set(Object.fromEntries([[attrKey, arr]]));
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: items.length,
                    label: `Step ${i + 1}`,
                    titleText:
                        item.title ||
                        item.name ||
                        item.label ||
                        item.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: item.iconName,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: item.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `desc-${i}`,
                    label: 'Description',
                    value: item.description || '',
                    onChange: (v) => {
                        update('description', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    item.iconName || '',
                    (v) => {
                        update('iconName', v);
                    },
                    `icon-${i}`,
                ),
                h.imageControl(
                    'Image',
                    item.imageUrl || '',
                    (media) => {
                        update('imageUrl', media.url);
                    },
                    () => {
                        update('imageUrl', '');
                    },
                    `img-${i}`,
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/capabilities-pipeline', {
        edit: h.createEdit(
            'xfact/capabilities-pipeline',
            'Pipeline Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const caps = attr.capabilities || [];

                let controls = [
                    el(h.TextControl, {
                        key: 'sectionLabel',
                        label: 'Pre-Title Label',
                        value: attr.sectionLabel,
                        onChange: (v) => {
                            set({ sectionLabel: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Title',
                        value: attr.heading,
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'subtitle',
                        label: 'Description',
                        value: attr.subtitle,
                        onChange: (v) => {
                            set({ subtitle: v });
                        },
                    }),
                ];

                if (caps.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'caps-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'caps-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Steps (${caps.length})`,
                        ),
                    );
                    caps.forEach((_cap, i) => {
                        controls = controls.concat(
                            itemControls(caps, i, set, 'capabilities'),
                        );
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add',
                            onClick: () => {
                                set({
                                    capabilities: caps.concat([
                                        {
                                            title: '',
                                            description: '',
                                            iconName: 'Circle',
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
                        '+ Add Step',
                    ),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
