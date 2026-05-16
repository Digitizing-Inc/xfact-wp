/**
 * xFact Support Channels — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function channelControls(channels, i, set) {
        const ch = channels[i];
        function update(key, value) {
            const arr = channels.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ channels: arr });
        }
        function remove() {
            const arr = channels.slice();
            arr.splice(i, 1);
            set({ channels: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = channels.slice();
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
            set({ channels: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: channels.length,
                    label: `Channel ${i + 1}`,
                    titleText:
                        ch.title || ch.name || ch.label || ch.heading || '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: ch.iconName,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: ch.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `desc-${i}`,
                    label: 'Description',
                    value: ch.description || '',
                    onChange: (v) => {
                        update('description', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    ch.iconName || '',
                    (v) => {
                        update('iconName', v);
                    },
                    `icon-${i}`,
                ),
                h.imageControl(
                    'Channel Image',
                    ch.imageUrl || '',
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

    wp.blocks.registerBlockType('xfact/support-channels', {
        edit: h.createEdit(
            'xfact/support-channels',
            'Support Channels Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const channels = attr.channels || [];

                let controls = [];

                /* Per-channel controls */
                if (channels.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'channels-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'channels-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Channels (${channels.length})`,
                        ),
                    );
                    channels.forEach((_ch, i) => {
                        controls = controls.concat(
                            channelControls(channels, i, set),
                        );
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-ch',
                            onClick: () => {
                                set({
                                    channels: channels.concat([
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
                        '+ Add Channel',
                    ),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
