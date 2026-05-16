/**
 * xFact Capability Areas — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function areaControls(areas, i, set) {
        const area = areas[i];
        function update(key, value) {
            const arr = areas.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ areas: arr });
        }
        function remove() {
            const arr = areas.slice();
            arr.splice(i, 1);
            set({ areas: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = areas.slice();
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
            set({ areas: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: areas.length,
                    label: `Area ${i + 1}`,
                    titleText:
                        area.title ||
                        area.name ||
                        area.label ||
                        area.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: area.iconName,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: area.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextControl, {
                    key: `headline-${i}`,
                    label: 'Headline',
                    value: area.headline || '',
                    onChange: (v) => {
                        update('headline', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `body-${i}`,
                    label: 'Body',
                    value: area.body || '',
                    onChange: (v) => {
                        update('body', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    area.iconName || '',
                    (v) => {
                        update('iconName', v);
                    },
                    `iconName-${i}`,
                ),
                el(h.TextControl, {
                    key: `anchor-${i}`,
                    label: 'HTML Anchor (ID)',
                    value: area.anchor || '',
                    onChange: (v) => {
                        update('anchor', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `services-${i}`,
                    label: 'Services (comma separated)',
                    value: (area.services || []).join(', '),
                    onChange: (v) => {
                        update(
                            'services',
                            v
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                        );
                    },
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/capability-areas', {
        edit: h.createEdit(
            'xfact/capability-areas',
            'Capability Areas',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const areas = attr.areas || [];

                let controls = [];

                if (areas.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'areas-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'areas-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Areas (${areas.length})`,
                        ),
                    );
                    areas.forEach((_area, i) => {
                        controls = controls.concat(areaControls(areas, i, set));
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add',
                            onClick: () => {
                                set({
                                    areas: areas.concat([
                                        {
                                            title: '',
                                            headline: '',
                                            body: '',
                                            iconName: 'Circle',
                                            anchor: '',
                                            services: [],
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
                        '+ Add Area',
                    ),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
