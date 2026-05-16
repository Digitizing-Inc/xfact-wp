/**
 * xFact Contact Form — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function checklistControls(items, i, set) {
        const item = items[i];
        function update(key, value) {
            const arr = items.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ assessmentChecklist: arr });
        }
        function remove() {
            const arr = items.slice();
            arr.splice(i, 1);
            set({ assessmentChecklist: arr });
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
            set({ assessmentChecklist: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: 'wrap-',
                    index: i,
                    total: items.length,
                    label: `Item ${i + 1}`,
                    titleText:
                        item.title ||
                        item.name ||
                        item.label ||
                        item.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(h.TextControl, {
                    key: `text-${i}`,
                    label: 'Text',
                    value: item.text || '',
                    onChange: (v) => {
                        update('text', v);
                    },
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/contact-form', {
        edit: h.createEdit(
            'xfact/contact-form',
            'Contact Form Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const buttons = attr.buttons || [];

                let controls = [
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
                    el('hr', {
                        key: 'form-settings-sep',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                    el(h.TextControl, {
                        key: 'recipientEmail',
                        label: 'Recipient Email (Fallback)',
                        value: attr.recipientEmail,
                        onChange: (v) => {
                            set({ recipientEmail: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'formId',
                        label: 'Gravity Form ID',
                        value: attr.formId,
                        onChange: (v) => {
                            set({ formId: v });
                        },
                    }),
                    el('hr', {
                        key: 'assessment-sep',
                        style: {
                            margin: '24px 0',
                            borderTop: '2px solid #ccc',
                        },
                    }),
                    el(
                        'strong',
                        {
                            key: 'assessment-title',
                            style: {
                                display: 'block',
                                marginBottom: '16px',
                                fontSize: '1.2em',
                            },
                        },
                        'Assessment Card (Right Side)',
                    ),
                    el(h.TextControl, {
                        key: 'assessmentLabel',
                        label: 'Assessment Pre-Title Label',
                        value: attr.assessmentLabel,
                        onChange: (v) => {
                            set({ assessmentLabel: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'assessmentHeading',
                        label: 'Assessment Title',
                        value: attr.assessmentHeading,
                        onChange: (v) => {
                            set({ assessmentHeading: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'assessmentDescription',
                        label: 'Assessment Description',
                        value: attr.assessmentDescription,
                        onChange: (v) => {
                            set({ assessmentDescription: v });
                        },
                    }),
                ];

                const checklist = attr.assessmentChecklist || [];
                if (checklist.length > 0) {
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
                            `Checklist Items (${checklist.length})`,
                        ),
                    );
                    checklist.forEach((_item, i) => {
                        controls = controls.concat(
                            checklistControls(checklist, i, set),
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
                                    assessmentChecklist: checklist.concat([
                                        { text: '' },
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
                        '+ Add Checklist Item',
                    ),
                );

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
                        `Assessment Buttons (${buttons.length})`,
                    ),
                );
                controls = controls.concat(
                    h.buttonArrayControls(buttons, set, 'buttons'),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
