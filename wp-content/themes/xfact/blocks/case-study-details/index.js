/**
 * xFact Case Study Page — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function listControls(items, i, set, attrKey, labelPrefix) {
        const item = items[i];
        function update(v) {
            const arr = items.slice();
            arr[i] = v;
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
                    key: `${attrKey}-item-${i}`,
                    index: i,
                    total: items.length,
                    label: `${labelPrefix} ${i + 1}`,
                    titleText: item || '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(h.TextControl, {
                    value: item || '',
                    onChange: update,
                    style: { marginBottom: 0 },
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/case-study-details', {
        edit: h.createEdit(
            'xfact/case-study-details',
            'Case Study Content Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;

                const challenge = attr.challenge || [];
                const services = attr.services || [];
                const outcomes = attr.outcomes || [];

                let controls = [
                    el(
                        'div',
                        {
                            key: 'group-grid-cards',
                            style: {
                                border: '1px solid #ddd',
                                padding: '12px',
                                borderRadius: '4px',
                                backgroundColor:
                                    'var(--xfact-semantic-surface)',
                                marginBottom: '24px',
                            },
                        },
                        el(
                            'strong',
                            {
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                    fontSize: '13px',
                                },
                            },
                            'Grid Card Appearance',
                        ),
                        el(
                            'p',
                            {
                                style: {
                                    fontSize: '12px',
                                    color: 'var(--xfact-semantic-text-primary)',
                                    marginBottom: '16px',
                                    marginTop: '0',
                                },
                            },
                            'These fields control how this case study appears when selected in a Case Study Grid block.',
                        ),
                        el(h.TextareaControl, {
                            key: 'summary',
                            label: 'Summary',
                            value: attr.summary || '',
                            rows: 3,
                            onChange: (v) => {
                                set({ summary: v });
                            },
                        }),
                        el(h.TextControl, {
                            key: 'source',
                            label: 'Source (e.g. xFact)',
                            value: attr.source || '',
                            onChange: (v) => {
                                set({ source: v });
                            },
                        }),
                    ),
                    el(
                        'strong',
                        {
                            key: 'hdr-content',
                            style: {
                                display: 'block',
                                marginBottom: '16px',
                                fontSize: '14px',
                                borderBottom: '1px solid #ddd',
                                paddingBottom: '8px',
                            },
                        },
                        'Case Study Page Content',
                    ),
                    el(h.TextControl, {
                        key: 'client',
                        label: 'Client',
                        value: attr.client || '',
                        onChange: (v) => {
                            set({ client: v });
                        },
                    }),
                ];

                /* Challenge Section */
                controls.push(
                    el('hr', {
                        key: 'sep-challenge',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        'strong',
                        {
                            key: 'hdr-challenge',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Challenge Items (${challenge.length})`,
                    ),
                );
                challenge.forEach((_item, i) => {
                    controls = controls.concat(
                        listControls(challenge, i, set, 'challenge', 'Item'),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-challenge',
                            onClick: () => {
                                set({ challenge: challenge.concat(['']) });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '8px',
                            },
                        },
                        '+ Add Challenge Item',
                    ),
                );

                /* Services Section */
                controls.push(
                    el('hr', {
                        key: 'sep-services',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        'strong',
                        {
                            key: 'hdr-services',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Services Items (${services.length})`,
                    ),
                );
                services.forEach((_item, i) => {
                    controls = controls.concat(
                        listControls(services, i, set, 'services', 'Item'),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-services',
                            onClick: () => {
                                set({ services: services.concat(['']) });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '8px',
                            },
                        },
                        '+ Add Service Item',
                    ),
                );

                /* Outcomes Section */
                controls.push(
                    el('hr', {
                        key: 'sep-outcomes',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        'strong',
                        {
                            key: 'hdr-outcomes',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Outcomes Items (${outcomes.length})`,
                    ),
                );
                outcomes.forEach((_item, i) => {
                    controls = controls.concat(
                        listControls(outcomes, i, set, 'outcomes', 'Item'),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-outcomes',
                            onClick: () => {
                                set({ outcomes: outcomes.concat(['']) });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '8px',
                            },
                        },
                        '+ Add Outcome Item',
                    ),
                );

                /* Narrative Section */
                controls.push(
                    el('hr', {
                        key: 'sep-narrative',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(h.TextareaControl, {
                        key: 'narrative',
                        label: 'Narrative',
                        value: attr.narrative || '',
                        rows: 5,
                        onChange: (v) => {
                            set({ narrative: v });
                        },
                    }),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
