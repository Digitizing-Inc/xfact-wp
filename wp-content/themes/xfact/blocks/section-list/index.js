/**
 * xFact Section List — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function sectionControls(sections, i, set) {
        const section = sections[i];
        function update(key, value) {
            const arr = sections.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ sections: arr });
        }
        function remove() {
            const arr = sections.slice();
            arr.splice(i, 1);
            set({ sections: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = sections.slice();
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
            set({ sections: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: sections.length,
                    label: `Section ${i + 1}`,
                    titleText:
                        section.title ||
                        section.name ||
                        section.label ||
                        section.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: section.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `content-${i}`,
                    label: 'Content',
                    value: section.content || '',
                    onChange: (v) => {
                        update('content', v);
                    },
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/section-list', {
        edit: h.createEdit(
            'xfact/section-list',
            'Section List Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const sections = attr.sections || [];

                let controls = [
                    el(h.TextareaControl, {
                        key: 'introText',
                        label: 'Description',
                        value: attr.introText || '',
                        onChange: (v) => {
                            set({ introText: v });
                        },
                    }),
                ];

                if (sections.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'sections-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'sections-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Sections (${sections.length})`,
                        ),
                    );
                    sections.forEach((_sec, i) => {
                        controls = controls.concat(
                            sectionControls(sections, i, set),
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
                                    sections: sections.concat([
                                        { title: '', content: '' },
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
                        '+ Add Section',
                    ),
                );

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
                    el(wp.components.ToggleControl, {
                        key: 'showNumbers',
                        label: 'Show Numbers',
                        checked: attr.showNumbers !== false,
                        onChange: (v) => {
                            set({ showNumbers: v });
                        },
                    }),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
