/**
 * xFact Team Grid — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function memberControls(members, i, set) {
        const member = members[i];
        function update(key, value) {
            const arr = members.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ teamMembers: arr });
        }
        function remove() {
            const arr = members.slice();
            arr.splice(i, 1);
            set({ teamMembers: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = members.slice();
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
            set({ teamMembers: arr });
        }

        // Social links handling
        const socialLinks = member.socialLinks || [];
        function updateSocial(sIdx, key, value) {
            const sArr = socialLinks.slice();
            sArr[sIdx] = Object.assign({}, sArr[sIdx]);
            sArr[sIdx][key] = value;
            update('socialLinks', sArr);
        }
        function addSocial() {
            update(
                'socialLinks',
                socialLinks.concat([{ type: 'linkedin', url: '' }]),
            );
        }
        function removeSocial(sIdx) {
            const sArr = socialLinks.slice();
            sArr.splice(sIdx, 1);
            update('socialLinks', sArr);
        }

        const socialControls = socialLinks.map((link, sIdx) =>
            el(
                'div',
                {
                    key: `social-${sIdx}`,
                    style: {
                        paddingLeft: '10px',
                        borderLeft: '2px solid var(--xfact-glass-border)',
                        marginBottom: '8px',
                    },
                },
                el(h.SelectControl, {
                    label: 'Social Type',
                    value: link.type || 'linkedin',
                    options: [
                        { label: 'LinkedIn', value: 'linkedin' },
                        { label: 'X (Twitter)', value: 'x' },
                        { label: 'Website', value: 'website' },
                        { label: 'Email', value: 'email' },
                        { label: 'Telegram', value: 'telegram' },
                    ],
                    onChange: (v) => {
                        updateSocial(sIdx, 'type', v);
                    },
                }),
                el(h.TextControl, {
                    label: 'URL',
                    value: link.url || '',
                    onChange: (v) => {
                        updateSocial(sIdx, 'url', v);
                    },
                }),
                el(
                    h.Button,
                    {
                        onClick: () => {
                            removeSocial(sIdx);
                        },
                        isDestructive: true,
                        variant: 'link',
                    },
                    'Remove Social',
                ),
            ),
        );

        socialControls.push(
            el(
                h.Button,
                { key: 'add-social', onClick: addSocial, variant: 'secondary' },
                '+ Add Social Link',
            ),
        );
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: members.length,
                    label: `Member ${i + 1}`,
                    titleText:
                        member.title ||
                        member.name ||
                        member.label ||
                        member.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                h.imageControl(
                    'Profile Image',
                    member.imageUrl || '',
                    (media) => {
                        update('imageUrl', media.url);
                    },
                    () => {
                        update('imageUrl', '');
                    },
                    `img-${i}`,
                ),
                el(h.TextControl, {
                    key: `name-${i}`,
                    label: 'Name',
                    value: member.name || '',
                    onChange: (v) => {
                        update('name', v);
                    },
                }),
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: member.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(
                    'div',
                    {
                        key: `socials-${i}`,
                        style: {
                            marginTop: '12px',
                            padding: '10px',
                            background: 'var(--xfact-glass-bg)',
                        },
                    },
                    el(
                        'strong',
                        { style: { display: 'block', marginBottom: '8px' } },
                        'Social Links',
                    ),
                    socialControls,
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/team-grid', {
        edit: h.createEdit('xfact/team-grid', 'Team Grid Settings', (props) => {
            const attr = props.attributes;
            const set = props.setAttributes;
            const members = attr.teamMembers || [];

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
            ];

            if (members.length > 0) {
                controls.push(
                    el('hr', {
                        key: 'members-sep',
                        style: { margin: '16px 0', opacity: 0.3 },
                    }),
                    el(
                        'strong',
                        {
                            key: 'members-hdr',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Members (${members.length})`,
                    ),
                );
                members.forEach((_mem, i) => {
                    controls = controls.concat(memberControls(members, i, set));
                });
            }

            controls.push(
                el(
                    h.Button,
                    {
                        key: 'add',
                        onClick: () => {
                            set({
                                teamMembers: members.concat([
                                    {
                                        name: '',
                                        title: '',
                                        imageUrl: '',
                                        socialLinks: [],
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
                    '+ Add Member',
                ),
            );

            return controls;
        }),
        save: () => null,
    });
})();
