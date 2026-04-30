/**
 * xFact Case Study Page — editor script.
 */
(function () {
    "use strict";

    var h = window.xfactBlockHelpers;
    var el = h.el;

    function listControls(items, i, set, attrKey, labelPrefix) {
        var item = items[i];
        function update(v) {
            var arr = items.slice();
            arr[i] = v;
            set(Object.fromEntries([[attrKey, arr]]));
        }
        function remove() {
            var arr = items.slice();
            arr.splice(i, 1);
            set(Object.fromEntries([[attrKey, arr]]));
        }

        return [
            el(
                "div",
                {
                    key: attrKey + "-item-" + i,
                    style: {
                        display: "flex",
                        gap: "4px",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                    },
                },
                el(h.TextControl, {
                    label: labelPrefix + " " + (i + 1),
                    value: item || "",
                    onChange: update,
                    style: { flex: 1 },
                }),
                el(
                    h.Button,
                    {
                        onClick: remove,
                        variant: "link",
                        isDestructive: true,
                        style: { marginTop: "24px", fontSize: "12px" },
                    },
                    "✕",
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType("xfact/case-study-details", {
        edit: h.createEdit(
            "xfact/case-study-details",
            "Case Study Content Settings",
            function (props) {
                var attr = props.attributes;
                var set = props.setAttributes;

                var challenge = attr.challenge || [];
                var services = attr.services || [];
                var outcomes = attr.outcomes || [];

                var controls = [
                    el(h.TextControl, {
                        key: "client",
                        label: "Client",
                        value: attr.client || "",
                        onChange: function (v) {
                            set({ client: v });
                        },
                    }),
                ];

                /* Challenge Section */
                controls.push(
                    el("hr", {
                        key: "sep-challenge",
                        style: { margin: "24px 0", opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        "strong",
                        {
                            key: "hdr-challenge",
                            style: { display: "block", marginBottom: "8px" },
                        },
                        "Challenge Items (" + challenge.length + ")",
                    ),
                );
                challenge.forEach(function (_item, i) {
                    controls = controls.concat(
                        listControls(challenge, i, set, "challenge", "Item"),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: "add-challenge",
                            onClick: function () {
                                set({ challenge: challenge.concat([""]) });
                            },
                            variant: "secondary",
                            style: {
                                width: "100%",
                                justifyContent: "center",
                                marginTop: "8px",
                            },
                        },
                        "+ Add Challenge Item",
                    ),
                );

                /* Services Section */
                controls.push(
                    el("hr", {
                        key: "sep-services",
                        style: { margin: "24px 0", opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        "strong",
                        {
                            key: "hdr-services",
                            style: { display: "block", marginBottom: "8px" },
                        },
                        "Services Items (" + services.length + ")",
                    ),
                );
                services.forEach(function (_item, i) {
                    controls = controls.concat(
                        listControls(services, i, set, "services", "Item"),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: "add-services",
                            onClick: function () {
                                set({ services: services.concat([""]) });
                            },
                            variant: "secondary",
                            style: {
                                width: "100%",
                                justifyContent: "center",
                                marginTop: "8px",
                            },
                        },
                        "+ Add Service Item",
                    ),
                );

                /* Outcomes Section */
                controls.push(
                    el("hr", {
                        key: "sep-outcomes",
                        style: { margin: "24px 0", opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(
                        "strong",
                        {
                            key: "hdr-outcomes",
                            style: { display: "block", marginBottom: "8px" },
                        },
                        "Outcomes Items (" + outcomes.length + ")",
                    ),
                );
                outcomes.forEach(function (_item, i) {
                    controls = controls.concat(
                        listControls(outcomes, i, set, "outcomes", "Item"),
                    );
                });
                controls.push(
                    el(
                        h.Button,
                        {
                            key: "add-outcomes",
                            onClick: function () {
                                set({ outcomes: outcomes.concat([""]) });
                            },
                            variant: "secondary",
                            style: {
                                width: "100%",
                                justifyContent: "center",
                                marginTop: "8px",
                            },
                        },
                        "+ Add Outcome Item",
                    ),
                );

                /* Narrative Section */
                controls.push(
                    el("hr", {
                        key: "sep-narrative",
                        style: { margin: "24px 0", opacity: 0.3 },
                    }),
                );
                controls.push(
                    el(h.TextareaControl, {
                        key: "narrative",
                        label: "Narrative",
                        value: attr.narrative || "",
                        rows: 5,
                        onChange: function (v) {
                            set({ narrative: v });
                        },
                    }),
                );

                return controls;
            },
        ),
        save: function () {
            return null;
        },
    });
})();
