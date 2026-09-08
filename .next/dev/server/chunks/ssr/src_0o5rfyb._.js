module.exports = [
"[project]/src/lib/categories.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "CATEGORY_ORDER",
    ()=>CATEGORY_ORDER,
    "GENDERS",
    ()=>GENDERS,
    "isCategory",
    ()=>isCategory,
    "primaryRegion",
    ()=>primaryRegion,
    "regionValue",
    ()=>regionValue,
    "rowPrimaryLabel",
    ()=>rowPrimaryLabel
]);
const CATEGORY_ORDER = [
    "sneakers",
    "slides",
    "tshirt",
    "trousers"
];
const CATEGORIES = {
    sneakers: {
        id: "sneakers",
        label: "Sneakers",
        nav: "SNEAKERS",
        tagline: "Sports shoes, runners & training silhouettes.",
        anchorLabel: "FOOT LENGTH",
        anchorUnit: "CM",
        anchorHint: "Heel to longest toe, standing, in cm.",
        anchorMin: 22,
        anchorMax: 31,
        anchorStep: 0.5,
        fitNote: "Independent charts — sneaker lasts run true-to-sport.",
        regions: [
            {
                key: "uk",
                label: "UK / IND",
                primary: true
            },
            {
                key: "us",
                label: "US"
            },
            {
                key: "eu",
                label: "EU"
            },
            {
                key: "jpn",
                label: "JPN (CM)"
            }
        ]
    },
    slides: {
        id: "slides",
        label: "Slides & Sandals",
        nav: "SLIDES",
        tagline: "Slides, sandals & open-fit footwear.",
        anchorLabel: "FOOT LENGTH",
        anchorUnit: "CM",
        anchorHint: "Heel to longest toe, standing, in cm.",
        anchorMin: 21,
        anchorMax: 31,
        anchorStep: 0.5,
        fitNote: "Slides fit roomier than sneakers — never convert across the two.",
        regions: [
            {
                key: "uk",
                label: "UK / IND",
                primary: true
            },
            {
                key: "us",
                label: "US"
            },
            {
                key: "eu",
                label: "EU"
            },
            {
                key: "jpn",
                label: "JPN (CM)"
            }
        ]
    },
    tshirt: {
        id: "tshirt",
        label: "T-Shirts",
        nav: "T-SHIRTS",
        tagline: "Tees, polos & casual tops.",
        anchorLabel: "CHEST",
        anchorUnit: "CM",
        anchorHint: "Around the fullest part of your chest.",
        anchorMin: 74,
        anchorMax: 140,
        anchorStep: 1,
        fitNote: "Anchored to chest width — alpha sizes differ wildly by brand.",
        regions: [
            {
                key: "label",
                label: "ALPHA SIZE",
                primary: true
            },
            {
                key: "ind",
                label: "CHEST (IN)"
            }
        ]
    },
    trousers: {
        id: "trousers",
        label: "Trousers & Jeans",
        nav: "TROUSERS",
        tagline: "Jeans, chinos & formal trousers.",
        anchorLabel: "WAIST",
        anchorUnit: "CM",
        anchorHint: "Natural waist, where the waistband sits.",
        anchorMin: 60,
        anchorMax: 130,
        anchorStep: 1,
        fitNote: "Waist drives the size; inseam (L30/32/34) picks freely afterwards.",
        regions: [
            {
                key: "ind",
                label: "WAIST (IN)",
                primary: true
            },
            {
                key: "eu",
                label: "EU"
            },
            {
                key: "label",
                label: "TAG SIZE"
            }
        ]
    }
};
const GENDERS = [
    {
        id: "men",
        label: "MEN"
    },
    {
        id: "women",
        label: "WOMEN"
    }
];
function isCategory(v) {
    return v in CATEGORIES;
}
function primaryRegion(cat) {
    return CATEGORIES[cat].regions.find((r)=>r.primary) ?? CATEGORIES[cat].regions[0];
}
function regionValue(row, key) {
    const v = row[key];
    if (v && v.trim() !== "") return v;
    if (key === "label" && row.uk) return `UK ${row.uk}`;
    return "—";
}
function rowPrimaryLabel(cat, row) {
    const key = primaryRegion(cat).key;
    let v = regionValue(row, key);
    if (v !== "—" && (key === "uk" || key === "us")) v = `${key.toUpperCase()} ${v}`;
    return v;
}
}),
"[project]/src/components/hero/tape/FootOutline.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>FootOutline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
const BONE = "#f5f5f0";
const FROST = "#8cb8dd";
function FootOutline({ scale }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
        style: {
            scale,
            transformOrigin: "330px 315px"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].path, {
                d: "M 118 236 C 92 258, 78 292, 84 328 C 90 372, 112 408, 152 420 C 200 434, 248 424, 282 392 C 306 370, 314 344, 306 316 C 298 282, 306 250, 336 230 C 376 202, 430 192, 470 206 C 504 218, 524 252, 516 292 C 510 326, 486 350, 448 358 C 396 370, 338 366, 292 344 C 252 326, 222 300, 196 268 C 176 244, 150 236, 130 232 C 124 231, 120 233, 118 236 Z",
                fill: "none",
                stroke: BONE,
                strokeOpacity: 0.85,
                strokeWidth: 2.4,
                strokeLinecap: "round",
                initial: {
                    pathLength: 0,
                    opacity: 0
                },
                animate: {
                    pathLength: 1,
                    opacity: 1
                },
                transition: {
                    duration: 0.6,
                    delay: 0.1,
                    ease: [
                        0.4,
                        0,
                        0.2,
                        1
                    ]
                }
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    duration: 0.4,
                    delay: 0.75
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 76,
                        y1: 352,
                        x2: 556,
                        y2: 352,
                        stroke: BONE,
                        strokeOpacity: 0.3,
                        strokeWidth: 1,
                        strokeDasharray: "3 6"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 48,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M 556 348 L 566 352 L 556 356 Z",
                        fill: BONE,
                        fillOpacity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 76,
                        y: 344,
                        fontSize: 7.5,
                        letterSpacing: 2,
                        fill: BONE,
                        fillOpacity: 0.35,
                        children: "AXIS — HEEL → TOE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 432,
                        y1: 206,
                        x2: 432,
                        y2: 368,
                        stroke: BONE,
                        strokeOpacity: 0.28,
                        strokeWidth: 1,
                        strokeDasharray: "2 5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 424,
                        y1: 206,
                        x2: 440,
                        y2: 206,
                        stroke: BONE,
                        strokeOpacity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 424,
                        y1: 368,
                        x2: 440,
                        y2: 368,
                        stroke: BONE,
                        strokeOpacity: 0.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 446,
                        y: 210,
                        fontSize: 7.5,
                        letterSpacing: 2,
                        fill: BONE,
                        fillOpacity: 0.35,
                        children: "BALL"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 83,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 510,
                        cy: 258,
                        r: 9,
                        fill: "none",
                        stroke: FROST,
                        strokeOpacity: 0.5,
                        strokeWidth: 1
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 95,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 510,
                        y1: 244,
                        x2: 510,
                        y2: 272,
                        stroke: FROST,
                        strokeOpacity: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 96,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: 496,
                        y1: 258,
                        x2: 524,
                        y2: 258,
                        stroke: FROST,
                        strokeOpacity: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    duration: 0.5,
                    delay: 1.0
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 84,
                        y: 470,
                        fontSize: 8,
                        letterSpacing: 3,
                        fill: BONE,
                        fillOpacity: 0.45,
                        children: "FIG. 01 — TOP-DOWN INSOLE"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 84,
                        y: 486,
                        fontSize: 8,
                        letterSpacing: 3,
                        fill: BONE,
                        fillOpacity: 0.3,
                        children: "SCALE 1:1 · 16 UNITS / CM"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 84,
                        y: 214,
                        fontSize: 8,
                        letterSpacing: 3,
                        fill: FROST,
                        fillOpacity: 0.55,
                        children: "FOOT LENGTH"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                        lineNumber: 126,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
                lineNumber: 101,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/tape/FootOutline.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/hero/tape/TapeMeasure.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ANCHOR_X",
    ()=>ANCHOR_X,
    "PPC",
    ()=>PPC,
    "TAPE_Y",
    ()=>TAPE_Y,
    "default",
    ()=>TapeMeasure,
    "xOf",
    ()=>xOf
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
const BONE = "#f5f5f0";
const PPC = 16; // viewBox units per centimeter
const ANCHOR_X = 100; // x of 0 cm (heel anchor)
const TAPE_Y = 300; // tape axis
const xOf = (cm)=>ANCHOR_X + cm * PPC;
function TapeMeasure({ maxCm }) {
    const ticks = [];
    for(let cm = 0; cm <= maxCm + 1; cm += 0.5){
        ticks.push({
            cm,
            x: xOf(cm),
            major: Number.isInteger(cm)
        });
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                initial: {
                    x: -560
                },
                animate: {
                    x: 0
                },
                transition: {
                    duration: 0.5,
                    delay: 0.28,
                    ease: [
                        0.22,
                        1,
                        0.36,
                        1
                    ]
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].rect, {
                        x: ANCHOR_X,
                        y: TAPE_Y - 13,
                        height: 26,
                        width: xOf(maxCm + 1) - ANCHOR_X,
                        fill: BONE,
                        fillOpacity: 0.07,
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        transition: {
                            delay: 0.5,
                            duration: 0.3
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 39,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: ANCHOR_X,
                        y1: TAPE_Y - 13,
                        x2: xOf(maxCm + 1),
                        y2: TAPE_Y - 13,
                        stroke: BONE,
                        strokeOpacity: 0.35
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                        x1: ANCHOR_X,
                        y1: TAPE_Y + 13,
                        x2: xOf(maxCm + 1),
                        y2: TAPE_Y + 13,
                        stroke: BONE,
                        strokeOpacity: 0.35
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 58,
                        columnNumber: 9
                    }, this),
                    ticks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            transition: {
                                delay: 0.55 + t.cm * 0.02,
                                duration: 0.2
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: t.x,
                                    y1: TAPE_Y - 12,
                                    x2: t.x,
                                    y2: TAPE_Y - (t.major ? 3 : -2),
                                    stroke: BONE,
                                    strokeOpacity: t.major ? 0.55 : 0.3,
                                    strokeWidth: t.major ? 1.2 : 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                                    lineNumber: 75,
                                    columnNumber: 13
                                }, this),
                                t.major && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                    x: t.x - (t.cm >= 10 ? 0 : 0),
                                    y: TAPE_Y + 9.5,
                                    fontSize: 7.5,
                                    textAnchor: "middle",
                                    letterSpacing: 0.5,
                                    fill: BONE,
                                    fillOpacity: 0.55,
                                    children: t.cm
                                }, void 0, false, {
                                    fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                                    lineNumber: 85,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, t.cm, true, {
                            fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                transition: {
                    delay: 0.3,
                    duration: 0.3
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 52,
                        y: 272,
                        width: 40,
                        height: 56,
                        rx: 7,
                        fill: "#0a0a0a",
                        stroke: BONE,
                        strokeOpacity: 0.55,
                        strokeWidth: 1.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 72,
                        cy: 300,
                        r: 10,
                        fill: "none",
                        stroke: BONE,
                        strokeOpacity: 0.45,
                        strokeWidth: 1.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: 72,
                        cy: 300,
                        r: 2.5,
                        fill: BONE,
                        fillOpacity: 0.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                        x: 90,
                        y: 290,
                        width: 5,
                        height: 20,
                        fill: BONE,
                        fillOpacity: 0.25
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/TapeMeasure.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/src/components/hero/tape/MeasurementMarker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MeasurementMarker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/TapeMeasure.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
const FROST = "#8cb8dd";
const SIGNAL = "#2c5f87";
const BONE = "#f5f5f0";
function MeasurementMarker({ x, value, engaged, onDown, onMove, onUp }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
        style: {
            x
        },
        cursor: engaged ? "grabbing" : "grab",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: 0,
                y1: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 40,
                x2: 0,
                y2: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] + 44,
                stroke: FROST,
                strokeWidth: 1.25,
                strokeOpacity: 0.9
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 33,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -21,
                y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 66,
                width: 42,
                height: 17,
                fill: engaged ? SIGNAL : "#0a0a0a",
                stroke: FROST,
                strokeOpacity: 0.6
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 44,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                x: 0,
                y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 53.5,
                fontSize: 9.5,
                textAnchor: "middle",
                letterSpacing: 1,
                fill: engaged ? BONE : FROST,
                children: value
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: `M -9 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 32} L 0 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 44} L 9 ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 32} Z`,
                fill: SIGNAL
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -6.5,
                y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 16,
                width: 13,
                height: 32,
                fill: SIGNAL,
                stroke: FROST,
                strokeOpacity: 0.35
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 71,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: -2,
                y1: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 12,
                x2: -2,
                y2: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] + 12,
                stroke: BONE,
                strokeOpacity: 0.4
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: 2,
                y1: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 12,
                x2: 2,
                y2: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] + 12,
                stroke: BONE,
                strokeOpacity: 0.4
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: 0,
                cy: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"],
                r: 3,
                fill: "#0a0a0a",
                stroke: BONE,
                strokeOpacity: 0.7
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: -9,
                y1: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"],
                x2: 9,
                y2: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"],
                stroke: BONE,
                strokeOpacity: 0.5,
                strokeWidth: 0.75
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: -28,
                y: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TAPE_Y"] - 70,
                width: 56,
                height: 120,
                fill: "transparent",
                style: {
                    touchAction: "none"
                },
                onPointerDown: onDown,
                onPointerMove: onMove,
                onPointerUp: onUp,
                onPointerCancel: onUp
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/tape/MeasurementMarker.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/hero/tape/MatchFound.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MatchFound
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
const LABELS = {
    exact: "MATCH FOUND",
    nearest: "CLOSEST MATCH",
    estimate: "ESTIMATE — NO CHART"
};
function MatchFound({ kind, pulse }) {
    if (!kind) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.72
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            type: "spring",
            stiffness: 380,
            damping: 20
        },
        className: "mt-2 flex items-center justify-end gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: kind === "exact" ? "inline-block h-2 w-2 bg-signal" : kind === "nearest" ? "inline-block h-2 w-2 border border-frost" : "inline-block h-2 w-2 border border-dashed border-frost/70"
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MatchFound.tsx",
                lineNumber: 29,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "font-mono text-[10px] tracking-[0.28em] text-frost",
                children: LABELS[kind]
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/MatchFound.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this)
        ]
    }, `${pulse}-${kind}`, true, {
        fileName: "[project]/src/components/hero/tape/MatchFound.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/hero/tape/MeasurementValue.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>MeasurementValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MatchFound$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/MatchFound.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function MeasurementValue({ display, anchorLabel, verdict, kind, pulse, converting, yShift }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        style: {
            y: yShift
        },
        className: "pointer-events-none absolute top-10 right-0 z-0 text-right md:top-14",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-mono text-[9px] tracking-[0.3em] text-fog",
                children: [
                    anchorLabel,
                    " — REFERENCE · DRAG TO RE-MEASURE"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "font-display text-[clamp(4.5rem,11vw,10rem)] leading-[0.9] tracking-tight text-bone tabular-nums",
                children: [
                    display.toFixed(1),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ml-2 text-[0.32em] text-frost",
                        children: "CM"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 min-h-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        mode: "wait",
                        children: verdict && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                            initial: {
                                opacity: 0,
                                y: 14
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                y: -10
                            },
                            transition: {
                                duration: 0.22,
                                ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1
                                ]
                            },
                            className: "font-display text-2xl tracking-wide text-bone uppercase md:text-3xl",
                            children: verdict
                        }, verdict, false, {
                            fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                            lineNumber: 43,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                        lineNumber: 41,
                        columnNumber: 9
                    }, this),
                    converting && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-mono text-[9px] tracking-[0.3em] text-fog",
                        children: "CONVERTING…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MatchFound$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        kind: kind,
                        pulse: pulse
                    }, void 0, false, {
                        fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/tape/MeasurementValue.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/lib/format.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn,
    "formatAnchor",
    ()=>formatAnchor,
    "inr",
    ()=>inr,
    "slugify",
    ()=>slugify
]);
function cn(...parts) {
    return parts.filter(Boolean).join(" ");
}
function inr(n) {
    if (n == null) return null;
    return "\u20B9" + n.toLocaleString("en-IN");
}
function formatAnchor(value, unit) {
    const v = Math.round(value * 10) / 10;
    return `${v} ${unit.toLowerCase()}`;
}
function slugify(name) {
    return name.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
}),
"[project]/src/components/hero/tape/BrandSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/format.ts [app-ssr] (ecmascript)");
"use client";
;
;
function BrandSelector({ brands, active, onSelect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "pointer-events-auto z-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mb-2 text-right font-mono text-[9px] tracking-[0.3em] text-fog",
                children: "BRAND — SIZE LABEL"
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/BrandSelector.tsx",
                lineNumber: 25,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap justify-end gap-1.5",
                children: brands.map((b)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onSelect(b.slug),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$format$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("border px-3 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-200", active === b.slug ? "border-signal bg-signal text-bone" : "border-bone/25 text-fog hover:border-bone/50 hover:text-bone"),
                        children: b.name
                    }, b.slug, false, {
                        fileName: "[project]/src/components/hero/tape/BrandSelector.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/hero/tape/BrandSelector.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/tape/BrandSelector.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/hero/TapeHero.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TapeHero
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/animation/animate/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-motion-value.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$motion$2d$value$2d$event$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/utils/use-motion-value-event.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-spring.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/value/use-transform.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/categories.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$FootOutline$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/FootOutline.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/TapeMeasure.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MeasurementMarker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/MeasurementMarker.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MeasurementValue$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/MeasurementValue.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$BrandSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/hero/tape/BrandSelector.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
const FOOT_CONFIG = {
    category: "sneakers",
    anchorLabel: "FOOT LENGTH",
    min: 23,
    max: 31,
    initial: 26,
    snap: 0.5
};
const INK = "#0a0a0a";
function TapeHero({ brands, config = FOOT_CONFIG }) {
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const engagedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const introDone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const convertId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const previewTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const markerX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(config.min));
    const smooth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$spring$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSpring"])(markerX, {
        stiffness: 420,
        damping: 38,
        mass: 0.5
    });
    const [displayV, setDisplayV] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(config.min);
    const [committed, setCommitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(config.initial);
    const [brand, setBrand] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(brands[0]?.slug ?? "");
    const [verdict, setVerdict] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [kind, setKind] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [pulse, setPulse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [engaged, setEngaged] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [converting, setConverting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$utils$2f$use$2d$motion$2d$value$2d$event$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValueEvent"])(smooth, "change", (x)=>{
        const v = (x - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_X"]) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PPC"];
        const c = Math.min(config.max, Math.max(config.min, v));
        setDisplayV(Math.round(c * 10) / 10);
    });
    /* -------- conversion — the existing anchor-measurement engine -------- */ const runConvert = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((cm, slug, final)=>{
        if (!slug) return;
        const id = ++convertId.current;
        setConverting(true);
        fetch("/api/convert", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                category: config.category,
                gender: "men",
                anchorValue: cm,
                brandSlug: slug
            })
        }).then((r)=>r.json()).then((d)=>{
            if (convertId.current !== id) return;
            const row = d.status === "estimate" ? d.estimate : d.row;
            if (row) {
                const primary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["rowPrimaryLabel"])(config.category, row);
                const name = brands.find((b)=>b.slug === slug)?.name.toUpperCase() ?? slug.toUpperCase();
                setVerdict(`${name} · ${primary}`);
                setKind(d.status === "empty" ? null : d.status);
                if (final) setPulse((p)=>p + 1);
            } else {
                setVerdict(null);
                setKind(null);
            }
            setConverting(false);
        }).catch(()=>{
            if (convertId.current === id) setConverting(false);
        });
    }, [
        brands,
        config.category
    ]);
    const settle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((v)=>{
        const snapped = Math.round(v / config.snap) * config.snap;
        const c = Math.min(config.max, Math.max(config.min, snapped));
        setCommitted(c);
        runConvert(c, brand, true);
    }, [
        brand,
        config,
        runConvert
    ]);
    /* -------- intro: settle at the reference measurement -------- */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (introDone.current) return;
        introDone.current = true;
        const t = setTimeout(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(markerX, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(config.initial), {
                duration: 0.55,
                ease: [
                    0.22,
                    1,
                    0.36,
                    1
                ],
                onComplete: ()=>settle(config.initial)
            });
        }, 850);
        return ()=>clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* -------- drag physics -------- */ const svgPointX = (clientX)=>{
        const el = svgRef.current;
        if (!el) return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_X"];
        const rect = el.getBoundingClientRect();
        const s = Math.min(rect.width / 640, rect.height / 600);
        const drawnW = 640 * s;
        const offX = rect.left + (rect.width - drawnW) / 2;
        return (clientX - offX) / s;
    };
    /** rubber-band resistance past the range ends */ const resist = (v)=>{
        if (v < config.min) return config.min - (config.min - v) * 0.4;
        if (v > config.max) return config.max + (v - config.max) * 0.4;
        return v;
    };
    const minX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(config.min) - 8;
    const maxX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(config.max) + 12;
    const preview = (clientX)=>{
        const px = svgPointX(clientX);
        const v = (px - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_X"]) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PPC"];
        markerX.set(Math.min(maxX, Math.max(minX, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(resist(v)))));
        if (previewTimer.current) clearTimeout(previewTimer.current);
        previewTimer.current = setTimeout(()=>{
            const snapped = Math.min(config.max, Math.max(config.min, Math.round(v / config.snap) * config.snap));
            runConvert(snapped, brand, false);
        }, 180);
    };
    const onDown = (e)=>{
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        engagedRef.current = true;
        setEngaged(true);
        markerX.stop();
        preview(e.clientX);
    };
    const onMove = (e)=>{
        if (!engagedRef.current) return;
        preview(e.clientX);
    };
    const onUp = (e)=>{
        if (!engagedRef.current) return;
        engagedRef.current = false;
        setEngaged(false);
        if (previewTimer.current) clearTimeout(previewTimer.current);
        const px = svgPointX(e.clientX);
        const v = (px - __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ANCHOR_X"]) / __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PPC"];
        const snapped = Math.round(Math.min(config.max, Math.max(config.min, v)) / config.snap) * config.snap;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$animation$2f$animate$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["animate"])(markerX, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["xOf"])(snapped), {
            type: "spring",
            stiffness: 420,
            damping: 32,
            onComplete: ()=>settle(snapped)
        });
    };
    /* -------- restrained scroll response -------- */ const scrollP = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$motion$2d$value$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMotionValue"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const onScroll = ()=>scrollP.set(Math.min(1, window.scrollY / Math.max(1, window.innerHeight)));
        onScroll();
        window.addEventListener("scroll", onScroll, {
            passive: true
        });
        return ()=>window.removeEventListener("scroll", onScroll);
    }, [
        scrollP
    ]);
    const footScale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollP, [
        0,
        1
    ], [
        1,
        0.94
    ]);
    const svgY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollP, [
        0,
        1
    ], [
        0,
        30
    ]);
    const numY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollP, [
        0,
        1
    ], [
        0,
        -20
    ]);
    const annoY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$value$2f$use$2d$transform$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTransform"])(scrollP, [
        0,
        1
    ], [
        0,
        -34
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 opacity-70 md:opacity-100",
                style: {
                    backgroundImage: "linear-gradient(rgba(140,184,221,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(140,184,221,0.05) 1px, transparent 1px)",
                    backgroundSize: "64px 64px"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/hero/TapeHero.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MeasurementValue$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                display: displayV,
                anchorLabel: config.anchorLabel,
                verdict: verdict,
                kind: kind,
                pulse: pulse,
                converting: converting,
                yShift: numY
            }, void 0, false, {
                fileName: "[project]/src/components/hero/TapeHero.tsx",
                lineNumber: 234,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                style: {
                    y: svgY
                },
                className: "absolute inset-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    ref: svgRef,
                    viewBox: "0 0 640 600",
                    className: "h-full w-full select-none opacity-60 md:opacity-100",
                    preserveAspectRatio: "xMidYMid meet",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$TapeMeasure$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            maxCm: config.max
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/TapeHero.tsx",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].g, {
                            style: {
                                x: smooth
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                x: 7,
                                y: 240,
                                width: 640,
                                height: 140,
                                fill: INK
                            }, void 0, false, {
                                fileName: "[project]/src/components/hero/TapeHero.tsx",
                                lineNumber: 255,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/TapeHero.tsx",
                            lineNumber: 254,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$FootOutline$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            scale: footScale
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/TapeHero.tsx",
                            lineNumber: 258,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$MeasurementMarker$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            x: smooth,
                            value: displayV.toFixed(1),
                            engaged: engaged,
                            onDown: onDown,
                            onMove: onMove,
                            onUp: onUp
                        }, void 0, false, {
                            fileName: "[project]/src/components/hero/TapeHero.tsx",
                            lineNumber: 259,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/hero/TapeHero.tsx",
                    lineNumber: 245,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero/TapeHero.tsx",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].p, {
                style: {
                    y: annoY
                },
                className: "pointer-events-none absolute bottom-16 left-0 hidden font-mono text-[9px] tracking-[0.3em] text-fog/70 md:block",
                children: "DRAG THE TANG — SNAPS EVERY 0.5 CM"
            }, void 0, false, {
                fileName: "[project]/src/components/hero/TapeHero.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                initial: {
                    opacity: 0,
                    y: 12
                },
                animate: {
                    opacity: 1,
                    y: 0
                },
                transition: {
                    delay: 1.35,
                    duration: 0.4
                },
                className: "absolute right-0 bottom-2 left-0 md:left-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hero$2f$tape$2f$BrandSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    brands: brands,
                    active: brand,
                    onSelect: (s)=>{
                        setBrand(s);
                        runConvert(committed, s, true);
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/hero/TapeHero.tsx",
                    lineNumber: 283,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/hero/TapeHero.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/hero/TapeHero.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/motion.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClipReveal",
    ()=>ClipReveal,
    "FadeUp",
    ()=>FadeUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function FadeUp({ children, className, delay = 0, y = 28 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: className,
        initial: {
            opacity: 0,
            y
        },
        whileInView: {
            opacity: 1,
            y: 0
        },
        viewport: {
            once: true,
            margin: "-80px"
        },
        transition: {
            duration: 0.7,
            delay,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/motion.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
function ClipReveal({ children, className, delay = 0 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: className,
        initial: {
            clipPath: "inset(0 100% 0 0)"
        },
        whileInView: {
            clipPath: "inset(0 0% 0 0)"
        },
        viewport: {
            once: true,
            margin: "-60px"
        },
        transition: {
            duration: 0.9,
            delay,
            ease: [
                0.22,
                1,
                0.36,
                1
            ]
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/motion.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=src_0o5rfyb._.js.map