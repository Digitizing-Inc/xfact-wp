/**
 * xFact Text Section — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function tagControls(tags, i, set) {
        const tag = tags[i];
        function update(key, value) {
            const arr = tags.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ tags: arr });
        }
        function remove() {
            const arr = tags.slice();
            arr.splice(i, 1);
            set({ tags: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = tags.slice();
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
            set({ tags: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `tag-${i}`,
                    index: i,
                    total: tags.length,
                    label: `Tag ${i + 1}`,
                    titleText:
                        tag.title || tag.name || tag.label || tag.heading || '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: tag.iconName,
                },
                el(h.TextControl, {
                    key: `label-${i}`,
                    label: `Tag ${i + 1} Label`,
                    value: tag.label || '',
                    onChange: (v) => {
                        update('label', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    tag.iconName || '',
                    (v) => {
                        update('iconName', v);
                    },
                    `icon-${i}`,
                ),
            ),
        ];
    }

    function keyMessageControls(messages, i, set) {
        const msg = messages[i];
        function update(v) {
            const arr = messages.slice();
            arr[i] = v;
            set({ keyMessages: arr });
        }
        function remove() {
            const arr = messages.slice();
            arr.splice(i, 1);
            set({ keyMessages: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = messages.slice();
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
            set({ keyMessages: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `msg-${i}`,
                    index: i,
                    total: messages.length,
                    label: `Message ${i + 1}`,
                    titleText: msg || '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            gap: '4px',
                            alignItems: 'flex-start',
                        },
                    },
                    el(h.TextControl, {
                        label: `Key Message ${i + 1}`,
                        value: msg || '',
                        onChange: update,
                        style: { flex: 1 },
                    }),
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/text-section', {
        edit: h.createEdit(
            'xfact/text-section',
            'Text Section Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const tags = attr.tags || [];
                const keyMessages = attr.keyMessages || [];
                const buttons = attr.buttons || [];

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
                        key: 'badgeText',
                        label: 'Badge Text',
                        value: attr.badgeText,
                        onChange: (v) => {
                            set({ badgeText: v });
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
                        key: 'body',
                        label: 'Description',
                        value: attr.body,
                        rows: 5,
                        onChange: (v) => {
                            set({ body: v });
                        },
                    }),
                    h.iconControl(
                        'Icon',
                        attr.sectionIcon || '',
                        (v) => {
                            set({ sectionIcon: v });
                        },
                        'sectionIcon',
                    ),
                ];

                /* Buttons section */
                controls.push(
                    el('hr', {
                        key: 'buttons-sep',
                        style: { margin: '16px 0', opacity: 0.3 },
                    }),
                    el(
                        'strong',
                        {
                            key: 'buttons-hdr',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Buttons (${buttons.length})`,
                    ),
                );
                controls = controls.concat(
                    h.buttonArrayControls(buttons, set, 'buttons'),
                );

                /* Tags section */
                if (tags.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'tags-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'tags-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Tags (${tags.length})`,
                        ),
                    );
                    tags.forEach((_tag, i) => {
                        controls = controls.concat(tagControls(tags, i, set));
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-tag',
                            onClick: () => {
                                set({
                                    tags: tags.concat([
                                        { label: '', iconName: '' },
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
                        '+ Add Tag',
                    ),
                );

                /* Key Messages section */
                if (keyMessages.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'msg-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(h.TextControl, {
                            key: 'keyMessagesHeading',
                            label: 'Aside Heading',
                            value: attr.keyMessagesHeading,
                            onChange: (v) => {
                                set({ keyMessagesHeading: v });
                            },
                        }),
                        el(
                            'strong',
                            {
                                key: 'msg-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `List Items (${keyMessages.length})`,
                        ),
                    );
                    keyMessages.forEach((_msg, i) => {
                        controls = controls.concat(
                            keyMessageControls(keyMessages, i, set),
                        );
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-msg',
                            onClick: () => {
                                set({ keyMessages: keyMessages.concat(['']) });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '15px',
                            },
                        },
                        '+ Add Key Message',
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
                    el(h.ToggleControl, {
                        key: 'useAltBackground',
                        label: 'Use Alternate Background Color',
                        checked: attr.useAltBackground,
                        onChange: (v) => {
                            set({ useAltBackground: v });
                        },
                    }),
                    el(h.ToggleControl, {
                        key: 'isCenteredCard',
                        label: 'Style as Centered Card (Empty State)',
                        checked: attr.isCenteredCard,
                        onChange: (v) => {
                            set({ isCenteredCard: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'anchor',
                        label: 'HTML Anchor (ID)',
                        value: attr.anchor || '',
                        onChange: (v) => {
                            set({ anchor: v });
                        },
                        help: 'Used for deep links, e.g. /solutions#public-safety',
                    }),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
