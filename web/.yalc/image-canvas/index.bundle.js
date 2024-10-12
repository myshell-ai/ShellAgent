'use strict';

var classNames = require('classnames');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');
var antd = require('antd');
var icons = require('@ant-design/icons');
var i18n = require('i18next');
var reactI18next = require('react-i18next');
var fabric$1 = require('fabric');
var FontFaceObserver = require('fontfaceobserver');
var uuid$1 = require('uuid');
var googleFonts = require('google-fonts');
var universalEnv = require('universal-env');
var RcInputNumber = require('rc-input-number');
var RcInput = require('rc-input');
var data = require('@emoji-mart/data');
var Picker$1 = require('@emoji-mart/react');
var inversifyReact = require('inversify-react');
var mobx = require('mobx');
var reactSystem = require('react-system');
var lodashEs = require('lodash-es');
var hotkeys = require('hotkeys-js');
var rough = require('roughjs');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var classNames__default = /*#__PURE__*/_interopDefault(classNames);
var React__namespace = /*#__PURE__*/_interopNamespace(React);
var i18n__default = /*#__PURE__*/_interopDefault(i18n);
var FontFaceObserver__default = /*#__PURE__*/_interopDefault(FontFaceObserver);
var googleFonts__default = /*#__PURE__*/_interopDefault(googleFonts);
var RcInputNumber__default = /*#__PURE__*/_interopDefault(RcInputNumber);
var RcInput__default = /*#__PURE__*/_interopDefault(RcInput);
var data__default = /*#__PURE__*/_interopDefault(data);
var Picker__default = /*#__PURE__*/_interopDefault(Picker$1);
var hotkeys__default = /*#__PURE__*/_interopDefault(hotkeys);
var rough__default = /*#__PURE__*/_interopDefault(rough);

function Title$1 (props) {
    const { children } = props;
    return (jsxRuntime.jsx(antd.Divider, { children: children }));
}

var common = {
	ok: "OK",
	shadow: "Shadow",
	color: "Color",
	line_width: "LineWidth",
	width: "Width",
	offset: "Offset",
	operate: "Operate",
	text: "Text",
	size: "Size",
	background_color: "BackgroundColor",
	fill: "Fill",
	stroke: "Stroke",
	stroke_color: "Color",
	stroke_width: "StrokeWidth",
	blur: "Blur",
	border: "Border",
	style: "Style",
	round: "Round"
};
var header = {
	fabritor_desc: "Image canvas",
	"export": {
		jpg: "Export as JPG",
		png: "Export as PNG",
		svg: "Export as SVG",
		json: "Export as JSON",
		clipboard: "Copy to Clipboard",
		load: "Load",
		"export": "Export",
		copy_success: "Copied successfully",
		copy_failed: "Copy failed, please choose to export to local"
	},
	toolbar: {
		undo: "Undo",
		redo: "Redo",
		select: "Select",
		pan: "Pan",
		clear: "Clear",
		clear_confirm: "Confirm to clear the canvas and clear the historical operation records?"
	}
};
var panel = {
	design: {
		title: "Design",
		start: "Start with your creativity",
		start_demo: "Or start with a simple DEMO"
	},
	text: {
		title: "Text",
		add: "Text Box",
		add_title: "Title",
		add_subtitle: "Subtitle",
		add_body_text: "a body of text",
		add_text_border: "Text border",
		presets: "Presets"
	},
	image: {
		title: "Image",
		local: "Local Image",
		remote: "Remote Image",
		remote_placeholder: "Remote Image Url"
	},
	material: {
		title: "Material",
		line: "Line",
		shape: "Shape",
		hand_drawn: "Hand-Drawn"
	},
	paint: {
		title: "Paint",
		stop: "Stop Drawing",
		start: "Start Drawing",
		pencil: "Pencil",
		marker_pen: "Marker Pen"
	},
	app: {
		title: "App",
		qrcode: "QRCode",
		emoji: "Emoji",
		error_level: "Error Level",
		image: "Image",
		image_size: "Image Size",
		only_image_url: "Only Support Image Url",
		add: "Add",
		more: "More Config"
	}
};
var setter = {
	size: {
		width: "W",
		height: "H"
	},
	sketch: {
		title: "Canvas",
		size: "Canvas Size",
		fill: "Canvas Background Color"
	},
	text: {
		font_family: "Font",
		font_size: "Font Size",
		fill: "Color",
		text_align: "Alignment",
		font_styles: "Style",
		char_spacing: "Char Space",
		line_height: "Line Height",
		fx: {
			title: "Effects",
			fill_image: "Fill Image",
			text_path: "Wavy Text"
		}
	},
	image: {
		filter: "Filter",
		replace: "Replace Image",
		crop: "Crop"
	},
	group: {
		title: "Group",
		g: "Group",
		ung: "UnGroup"
	},
	common: {
		align: "Align",
		center: "Center",
		align_left: "Align Left",
		center_h: "Horizontal Center",
		align_right: "Align Right",
		align_top: "Align Top",
		center_v: "Vertical Center",
		align_bottom: "Align Bottom",
		lock: "Lock",
		unlock: "UnLock",
		opacity: "Opacity",
		copy: "Copy",
		paste: "Paste",
		create_a_copy: "Create a copy",
		del: "Delete",
		flip: "Flip",
		flip_x: "Flip X",
		flip_y: "Flip Y",
		adjust_position: "Adjust Position",
		px: "PX",
		lock_ratio: "Lock Ratio",
		rotate: "Rotate",
		layer: "Layer",
		layer_up: "Move Up",
		layer_top: "Move to Top",
		layer_down: "Move Down",
		layer_bottom: "Move to Bottom"
	}
};
var translationEN = {
	common: common,
	header: header,
	panel: panel,
	setter: setter
};

const resources = {
    en: {
        translation: translationEN
    }
};
i18n__default.default
    .use(reactI18next.initReactI18next)
    .init({
    resources,
    fallbackLng: 'en-US',
    debug: true,
    interpolation: {
        escapeValue: false,
    }
});

const translate = (key) => {
    return i18n__default.default.t(key);
};

const PRESET_FONT_LIST = [
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: { fontSize: 30, fontFamily: 'SmileySans', fontWeight: 'bold' } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_title" }) })),
        key: 'title',
        config: {
            fontFamily: 'SmileySans',
            fontWeight: 'bold',
            fontSize: 120,
            text: () => translate('panel.text.add_title'),
            top: 100
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: { fontSize: 24, fontFamily: 'AlibabaPuHuiTi' } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_subtitle" }) })),
        key: 'sub-title',
        config: {
            fontFamily: 'AlibabaPuHuiTi',
            fontWeight: 'bold',
            fontSize: 100,
            text: () => translate('panel.text.add_subtitle'),
            top: 400
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: { fontSize: 16, fontFamily: 'SourceHanSerif' } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_body_text" }) })),
        key: 'content',
        config: {
            fontFamily: 'SourceHanSerif',
            fontSize: 80,
            text: () => translate('panel.text.add_body_text'),
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: { fontSize: 26, fontFamily: '霞鹜文楷', color: '#ffffff', WebkitTextStroke: '1px rgb(255, 87, 87)' } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_text_border" }) })),
        key: 'content',
        config: {
            fontFamily: '霞鹜文楷',
            fontSize: 100,
            text: () => translate('panel.text.add_text_border'),
            fill: '#ffffff',
            stroke: '#ff5757',
            strokeWidth: 12
        }
    }
];
function PresetFontPanel(props) {
    const { addTextBox } = props;
    const { t } = reactI18next.useTranslation();
    const handleClick = (item) => {
        addTextBox === null || addTextBox === void 0 ? void 0 : addTextBox(item.config);
    };
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ vertical: true, gap: 8, style: { marginTop: 16 } }, { children: [jsxRuntime.jsx(Title$1, { children: t('panel.text.presets') }), PRESET_FONT_LIST.map(item => (jsxRuntime.jsx(antd.Card, Object.assign({ hoverable: true, onClick: () => { handleClick(item); }, bodyStyle: {
                    padding: '12px 30px',
                    userSelect: 'none'
                } }, { children: item.label }), item.key)))] })));
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const APP_NAME = 'fabritor';
const SCHEMA_VERSION = 3.1;
const SCHEMA_VERSION_KEY = 'fabritor_schema_version';
const LOG_PREFIX = `${APP_NAME}_log：`;
const OBJECT_DEFAULT_CONFIG = {
    borderColor: '#FF2222',
    borderScaleFactor: 2,
    cornerStrokeColor: '#2222',
    cornerColor: '#FF2222',
    cornerSize: 12,
    cornerStyle: 'circle',
    transparentCorners: false,
    padding: 0,
    centeredScaling: false,
    strokeUniform: true,
    paintFirst: 'stroke'
};
const TEXTBOX_DEFAULT_CONFIG = {
    fill: '#000000',
    fontWeight: 'normal',
    fontSize: 50,
    lineHeight: 1.30,
    textAlign: 'center',
    fontFamily: 'AlibabaPuHuiTi',
    width: 500,
    splitByGrapheme: true
};
[
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: 'SmileySans', fontSize: 16 } }, { children: "\u5F97\u610F\u9ED1" })),
        value: 'SmileySans'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '霞鹜新晰黑', fontSize: 16 } }, { children: "\u971E\u9E5C\u65B0\u6670\u9ED1" })),
        value: '霞鹜新晰黑'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '霞鹜文楷', fontSize: 16 } }, { children: "\u971E\u9E5C\u6587\u6977" })),
        value: '霞鹜文楷'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '小赖字体', fontSize: 16 } }, { children: "\u5C0F\u8D56\u5B57\u4F53" })),
        value: '小赖字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '悠哉字体', fontSize: 16 } }, { children: "\u60A0\u54C9\u5B57\u4F53" })),
        value: '悠哉字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: 'AlibabaPuHuiTi', fontSize: 16 } }, { children: "\u963F\u91CC\u5DF4\u5DF4\u666E\u60E0\u4F53" })),
        value: 'AlibabaPuHuiTi'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '霞鹜尚智黑', fontSize: 16 } }, { children: "\u971E\u9E5C\u5C1A\u667A\u9ED1" })),
        value: '霞鹜尚智黑'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: 'SourceHanSans', fontSize: 16 } }, { children: "\u601D\u6E90\u9ED1\u4F53" })),
        value: 'SourceHanSans'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: 'SourceHanSerif', fontSize: 16 } }, { children: "\u601D\u6E90\u5B8B\u4F53" })),
        value: 'SourceHanSerif'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '方正楷体', fontSize: 16 } }, { children: "\u65B9\u6B63\u6977\u4F53" })),
        value: '方正楷体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '包图小白体', fontSize: 16 } }, { children: "\u5305\u56FE\u5C0F\u767D\u4F53" })),
        value: '包图小白体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '手写杂字体', fontSize: 16 } }, { children: "\u624B\u5199\u6742\u5B57\u4F53" })),
        value: '手写杂字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '胡晓波男神体', fontSize: 16 } }, { children: "\u80E1\u6653\u6CE2\u7537\u795E\u4F53" })),
        value: '胡晓波男神体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '胡晓波骚包体', fontSize: 16 } }, { children: "\u80E1\u6653\u6CE2\u9A9A\u5305\u4F53" })),
        value: '胡晓波骚包体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '站酷快乐体', fontSize: 16 } }, { children: "\u7AD9\u9177\u5FEB\u4E50\u4F53" })),
        value: '站酷快乐体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '站酷文艺体', fontSize: 16 } }, { children: "\u7AD9\u9177\u6587\u827A\u4F53" })),
        value: '站酷文艺体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: '站酷小薇LOGO体', fontSize: 16 } }, { children: "\u7AD9\u9177\u5C0F\u8587LOGO\u4F53" })),
        value: '站酷小薇LOGO体'
    }
];
const SKETCH_ID = 'fabritor-sketch';
const FABRITOR_CUSTOM_PROPS = [
    'id',
    'fabritor_desc',
    'selectable',
    'hasControls',
    'sub_type',
    'imageSource',
    'imageBorder',
    'oldArrowInfo',
    'ref',
];
const COMPLETE_GOOGLE_FONTS = [
    'Roboto',
    'Zilla Slab Highlight',
    'Open Sans',
    'Spectral',
    'Slabo 27px',
    'Lato',
    'Roboto Condensed',
    'Oswald',
    'Source Sans Pro',
    'Raleway',
    'Zilla Slab',
    'Montserrat',
    'PT Sans',
    'Roboto Slab',
    'Merriweather',
    'Saira Condensed',
    'Saira',
    'Open Sans Condensed',
    'Saira Semi Condensed',
    'Saira Extra Condensed',
    'Julee',
    'Archivo',
    'Ubuntu',
    'Lora',
    'Manuale',
    'Asap Condensed',
    'Faustina',
    'Cairo',
    'Playfair Display',
    'Droid Serif',
    'Noto Sans',
    'PT Serif',
    'Droid Sans',
    'Arimo',
    'Poppins',
    'Sedgwick Ave Display',
    'Titillium Web',
    'Muli',
    'Sedgwick Ave',
    'Indie Flower',
    'Mada',
    'PT Sans Narrow',
    'Noto Serif',
    'Bitter',
    'Dosis',
    'Josefin Sans',
    'Inconsolata',
    'Bowlby One SC',
    'Oxygen',
    'Arvo',
    'Hind',
    'Cabin',
    'Fjalla One',
    'Anton',
    'Cairo',
    'Playfair Display',
    'Droid Serif',
    'Noto Sans',
    'PT Serif',
    'Droid Sans',
    'Arimo',
    'Poppins',
    'Sedgwick Ave Display',
    'Titillium Web',
    'Muli',
    'Sedgwick Ave',
    'Indie Flower',
    'Mada',
    'PT Sans Narrow',
    'Noto Serif',
    'Bitter',
    'Dosis',
    'Josefin Sans',
    'Inconsolata',
    'Bowlby One SC',
    'Oxygen',
    'Arvo',
    'Hind',
    'Cabin',
    'Fjalla One',
    'Anton',
    'Acme',
    'Archivo Narrow',
    'Mukta Vaani',
    'Play',
    'Cuprum',
    'Maven Pro',
    'EB Garamond',
    'Passion One',
    'Ropa Sans',
    'Francois One',
    'Archivo Black',
    'Pathway Gothic One',
    'Exo',
    'Vollkorn',
    'Libre Franklin',
    'Crete Round',
    'Alegreya',
    'PT Sans Caption',
    'Alegreya Sans',
    'Source Code Pro',
];
const FONT_PRESET_FAMILY_LIST_GOOGLE_FONT = COMPLETE_GOOGLE_FONTS.map(f => ({
    label: jsxRuntime.jsx("span", Object.assign({ style: { fontFamily: f, fontSize: 16 } }, { children: f })),
    value: f
}));

const loadPresetGoogleFonts = async () => {
    googleFonts__default.default.add(COMPLETE_GOOGLE_FONTS.reduce((acc, f) => {
        acc[f] = true;
        return acc;
    }, {}));
    const observers = [];
    Object.keys(COMPLETE_GOOGLE_FONTS).forEach(function (family) {
        const obs = new FontFaceObserver__default.default(family);
        observers.push(obs.load(null, 1000 * 100));
    });
    Promise.all(observers).catch((e) => {
        console.error(LOG_PREFIX, e);
    });
};
const loadFont = async (f) => {
    if (!f)
        return Promise.resolve();
    const item = FONT_PRESET_FAMILY_LIST_GOOGLE_FONT.find(_item => _item.value === f);
    if (!item)
        return Promise.resolve();
    googleFonts__default.default.add({
        [item.value]: true
    });
    const font = new FontFaceObserver__default.default(f);
    return font.load(null, 1000 * 100).catch((e) => {
        console.error(LOG_PREFIX, e);
    });
};
const uuid = () => {
    return uuid$1.v4();
};
const downloadFile = (content, type, name) => {
    const link = document.createElement('a');
    link.href = content;
    link.download = `${name || uuid()}.${type}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
const AngleCoordsMap = {
    45: JSON.stringify({ x1: 0, y1: 1, x2: 1, y2: 0 }),
    90: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 0 }),
    135: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 1 }),
    180: JSON.stringify({ x1: 0, y1: 0, x2: 0, y2: 1 }),
    225: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 1 }),
    270: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 0 }),
    315: JSON.stringify({ x1: 1, y1: 1, x2: 0, y2: 0 }),
    0: JSON.stringify({ x1: 0, y1: 1, x2: 0, y2: 0 })
};
const transformAngle2Coords = (angle) => {
    angle = angle % 360;
    return JSON.parse(AngleCoordsMap[angle] || AngleCoordsMap[90]);
};
const transformCoords2Angel = (coords) => {
    const keys = Object.keys(AngleCoordsMap);
    for (let key of keys) {
        let _coords = Object.assign({}, coords);
        _coords = {
            x1: coords.x1 > 1 ? 1 : 0,
            y1: coords.y1 > 1 ? 1 : 0,
            x2: coords.x2 > 1 ? 1 : 0,
            y2: coords.y2 > 1 ? 1 : 0
        };
        if (JSON.stringify(_coords) === AngleCoordsMap[key]) {
            return Number(key);
        }
    }
    return 90;
};
const transformFill2Colors = (v) => {
    if (!v || typeof v === 'string' || v instanceof fabric$1.fabric.Pattern) {
        return { type: 'solid', color: v || '#ffffff' };
    }
    return {
        type: v.type,
        gradient: {
            colorStops: v.colorStops,
            angle: transformCoords2Angel(v.coords)
        }
    };
};
const transformColors2Fill = (v) => {
    let fill;
    switch (v === null || v === void 0 ? void 0 : v.type) {
        case 'solid':
            fill = v.color;
            break;
        case 'linear':
            fill = {
                type: 'linear',
                gradientUnits: 'percentage',
                coords: transformAngle2Coords(v.gradient.angle),
                colorStops: v.gradient.colorStops
            };
            break;
        case 'radial':
            fill = {
                type: 'radial',
                gradientUnits: 'percentage',
                coords: { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 1 },
                colorStops: v.gradient.colorStops
            };
    }
    return fill;
};
const getType = (type) => {
    if (type.indexOf('text') === 0) {
        return 'text';
    }
    if (type.indexOf('image/') === 0) {
        return 'image';
    }
    return '';
};
const readBlob = async (blob, blobType) => {
    const type = getType(blobType);
    if (!type)
        return Promise.resolve(null);
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            var _a;
            resolve({ type, result: (_a = e.target) === null || _a === void 0 ? void 0 : _a.result });
        };
        reader.onerror = (e) => {
            console.log(e);
            resolve(null);
        };
        if (type === 'text') {
            reader.readAsText(blob);
        }
        else if (type === 'image') {
            reader.readAsDataURL(blob);
        }
    });
};
const getSystemClipboard = async () => {
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                const result = await readBlob(await clipboardItem.getType(type), type);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }
    catch (err) {
        console.error(err.name, err.message);
        return null;
    }
};
const base64ToBlob = async (base64Data) => {
    return fetch(base64Data).then((res) => {
        return res.blob();
    });
};

const getTextboxWidth = (textbox) => {
    const textLines = textbox.textLines || [];
    if (!textLines || !textLines.length)
        return 0;
    let width = 0;
    for (let i = 0; i < textLines.length; i++) {
        width += textbox.measureLine(i).width;
    }
    return width + 4;
};
const getPathOffset = (textbox) => {
    if (!textbox.path) {
        return 100;
    }
    const path = textbox.path.path;
    const offset = Math.ceil(path[1][2] / (getTextboxWidth(textbox) / 2) * 100);
    return offset > 100 ? 100 : offset;
};
const drawTextPath = (textbox, offset) => {
    if (textbox.isEditing)
        return;
    const width = getTextboxWidth(textbox);
    const path = new fabric$1.fabric.Path(`M 0 0 Q ${width / 2} ${width / 2 * offset / 100} ${width} 0`, {
        visible: false,
        stroke: '#000000',
        fill: '#00000000'
    });
    textbox.set({
        path,
        width
    });
    textbox.canvas.requestRenderAll();
};
const removeTextPath = (textbox) => {
    textbox.set({
        path: null
    });
    textbox.canvas.requestRenderAll();
};
const createTextbox = async (options) => {
    let _a = options || {}, { text = '', fontFamily = TEXTBOX_DEFAULT_CONFIG.fontFamily, canvas } = _a, rest = __rest(_a, ["text", "fontFamily", "canvas"]);
    if (typeof text === 'function') {
        text = text();
    }
    let tmpPathInfo = { hasPath: false, offset: 100 };
    const textBox = new fabric$1.fabric.FText(text || translate('panel.text.add'), Object.assign(Object.assign(Object.assign({}, TEXTBOX_DEFAULT_CONFIG), rest), { fontFamily, pathAlign: 'center', id: uuid() }));
    textBox.on('editing:entered', () => {
        if (textBox.path) {
            tmpPathInfo.hasPath = true;
            tmpPathInfo.offset = getPathOffset(textBox);
            textBox.set('path', null);
            textBox.initDimensions();
            canvas.requestRenderAll();
        }
        else {
            tmpPathInfo.hasPath = false;
        }
    });
    textBox.on('editing:exited', () => {
        if (tmpPathInfo.hasPath) {
            drawTextPath(textBox, tmpPathInfo.offset);
            canvas.requestRenderAll();
        }
    });
    if (options.left == null && options.top == null) {
        canvas.viewportCenterObject(textBox);
    }
    else if (options.left == null) {
        canvas.viewportCenterObjectH(textBox);
    }
    canvas.add(textBox);
    canvas.setActiveObject(textBox);
    canvas.requestRenderAll();
    if (fontFamily) {
        try {
            await loadFont(fontFamily);
        }
        finally {
            textBox.set('fontFamily', fontFamily);
            canvas.requestRenderAll();
        }
    }
    return textBox;
};

const GlobalStateContext = React.createContext(null);

function TextPanel() {
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleAddText = async (options) => {
        await createTextbox(Object.assign(Object.assign({}, options), { canvas: editor.canvas }));
    };
    return (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: [jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, onClick: () => { handleAddText({}); }, size: "large" }, { children: t('panel.text.add') })), jsxRuntime.jsx(PresetFontPanel, { addTextBox: handleAddText })] })));
}

const loadImageDom = async (url) => {
    return new Promise((resolve, reject) => {
        fabric$1.fabric.util.loadImage(url, (img) => {
            if (img) {
                return resolve(img);
            }
            antd.message.error('加载图片失败');
            return reject();
        }, null, 'anonymous');
    });
};
const loadImage = async (imageSource) => {
    if (typeof imageSource === 'string') {
        return new Promise((resolve, reject) => {
            fabric$1.fabric.Image.fromURL(imageSource, (img) => {
                if (!img) {
                    antd.message.error('加载图片失败');
                    reject();
                    return;
                }
                resolve(img);
            }, {
                crossOrigin: 'anonymous'
            });
        });
    }
    return Promise.resolve(new fabric$1.fabric.Image(imageSource));
};
const createImage = async (options) => {
    const _a = options || {}, { imageSource, canvas } = _a, rest = __rest(_a, ["imageSource", "canvas"]);
    let img;
    try {
        img = await loadImage(imageSource);
    }
    catch (e) {
        console.log(e);
    }
    if (!img)
        return;
    img.set(Object.assign(Object.assign({}, rest), { paintFirst: 'fill', id: uuid() }));
    canvas.viewportCenterObject(img);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.requestRenderAll();
    return img;
};
const createFImage = async (options) => {
    const { imageSource, canvas } = options || {};
    let img;
    try {
        img = await loadImage(imageSource);
    }
    catch (e) {
        console.log(e);
    }
    if (!img)
        return;
    const fimg = new fabric$1.fabric.FImage({
        image: img,
        id: uuid()
    });
    canvas.viewportCenterObject(fimg);
    canvas.add(fimg);
    canvas.setActiveObject(fimg);
    canvas.requestRenderAll();
};

function LocalFileSelector(props, ref) {
    const { onChange, accept } = props;
    const formRef = React.useRef(null);
    const inputRef = React.useRef(null);
    const handleFileChange = (evt) => {
        var _a, _b;
        const file = evt.target.files[0];
        if (!file)
            return;
        onChange && onChange(evt.target.files[0]);
        (_b = (_a = formRef.current) === null || _a === void 0 ? void 0 : _a.reset) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    React.useImperativeHandle(ref, () => ({
        start: () => {
            var _a, _b;
            (_b = (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.click) === null || _b === void 0 ? void 0 : _b.call(_a);
        },
        reset: () => {
            var _a, _b;
            (_b = (_a = formRef.current) === null || _a === void 0 ? void 0 : _a.reset) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }));
    return (jsxRuntime.jsx("form", Object.assign({ style: { display: 'none' }, ref: formRef }, { children: jsxRuntime.jsx("input", { type: "file", accept: accept || 'image/*', ref: inputRef, onChange: handleFileChange }) })));
}
var LocalFileSelector$1 = React.forwardRef(LocalFileSelector);

function LocalImageSelector(props) {
    const { onChange } = props, rest = __rest(props, ["onChange"]);
    const localFileSelectorRef = React.useRef();
    const { t } = reactI18next.useTranslation();
    const handleClick = () => {
        var _a, _b;
        (_b = (_a = localFileSelectorRef.current) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const handleFileChange = (file) => {
        if (file.type === 'image/svg+xml') {
            return;
        }
        const reader = new FileReader();
        reader.onload = (revt) => {
            onChange === null || onChange === void 0 ? void 0 : onChange(revt.target.result);
        };
        reader.readAsDataURL(file);
    };
    return (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", size: "large", onClick: handleClick }, rest, { children: t('panel.image.local') })), jsxRuntime.jsx(LocalFileSelector$1, { accept: "image/*", ref: localFileSelectorRef, onChange: handleFileChange })] }));
}

function RemoteImageSelector(props) {
    const { onChange } = props, rest = __rest(props, ["onChange"]);
    const [url, setUrl] = React.useState('');
    const { t } = reactI18next.useTranslation();
    const handleClick = () => {
        if (url) {
            onChange === null || onChange === void 0 ? void 0 : onChange(url);
        }
    };
    return (jsxRuntime.jsx(antd.Popover, Object.assign({ content: jsxRuntime.jsxs(antd.Space.Compact, { children: [jsxRuntime.jsx(antd.Input, { value: url, onChange: (e) => { setUrl(e.target.value); }, style: { width: 260 } }), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: handleClick }, { children: t('common.ok') }))] }), title: t('panel.image.remote_placeholder'), trigger: "click" }, { children: jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", size: "large" }, rest, { children: t('panel.image.remote') })) })));
}

function ImageSelector(props) {
    const { onChange } = props, rest = __rest(props, ["onChange"]);
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ gap: 10, justify: "space-around" }, { children: [jsxRuntime.jsx(LocalImageSelector, Object.assign({}, rest, { onChange: onChange })), jsxRuntime.jsx(RemoteImageSelector, Object.assign({}, rest, { onChange: onChange }))] })));
}

function ImagePanel() {
    const { editor } = React.useContext(GlobalStateContext);
    const addImage = async (url) => {
        await createFImage({
            imageSource: url,
            canvas: editor.canvas
        });
    };
    return (jsxRuntime.jsx("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: jsxRuntime.jsx(ImageSelector, { onChange: addImage }) })));
}

var LineTypeList = [
    {
        key: 'line',
        type: 'f-line',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" stroke="rgb(44, 44, 44)" fill="rgb(44, 44, 44)" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" stroke-linecap="butt" fill="none"></line></svg>'
    },
    {
        key: 'dash-line',
        type: 'f-line',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" stroke="rgb(44, 44, 44)" fill="rgb(44, 44, 44)" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.5" stroke-dasharray="3,1" stroke-linecap="butt" fill="none"></line></svg>`,
        options: {
            strokeDashArray: [8, 8]
        }
    },
    {
        key: 'arrow-line-1',
        type: 'f-arrow',
        svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 40" stroke="rgb(44, 44, 44)" fill="rgb(44, 44, 44)">
    <line x1="0" x2="51" y1="20" y2="20" stroke-linecap="butt" fill="none" strokeWidth="4" />
    <path d="M 51 20 V 23 L 56 20 L 51 17 Z"></path></svg>`
    },
    {
        key: 'arrow-line-2',
        type: 'f-tri-arrow',
        svg: '<svg xmlns="http://www.w3.org/2000/svg" stroke="rgb(44, 44, 44)" fill="rgb(44, 44, 44)" viewBox="0 -0.5 33 1"><line x1="0.5" x2="32.25" stroke-linecap="butt" fill="none"></line><g transform="translate(33)"><path fill="none" stroke-linecap="round" stroke-linejoin="round" d="M -2.5,-1.5,-0.5,0,-2.5,1.5"></path></g></svg>'
    },
];

const degree2Radian = (d) => {
    return Math.PI * d / 180;
};
const getRightPolygonPoints = (num, radius = 100) => {
    const d = 360 / num;
    const points = [];
    for (let i = 0; i < num; i++) {
        const y = radius * Math.cos(degree2Radian(i * d));
        const x = radius * Math.sin(degree2Radian(i * d));
        points.push({ x: -x, y: -y });
    }
    return points;
};
var ShapeTypeList = [
    {
        key: 'rect',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M42 6H6V42H42V6Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Rect,
        options: { width: 200, height: 200, fill: '#555555' }
    },
    {
        key: 'rect-r',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M39 6H9C7.34315 6 6 7.34315 6 9V39C6 40.6569 7.34315 42 9 42H39C40.6569 42 42 40.6569 42 39V9C42 7.34315 40.6569 6 39 6Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Rect,
        options: { width: 200, height: 200, rx: 20, ry: 20, fill: '#555555' }
    },
    {
        key: 'circle',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="20" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Circle,
        options: { radius: 100, fill: '#555555' }
    },
    {
        key: 'ellipse',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="24" rx="14" ry="20" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Ellipse,
        options: { rx: 120, ry: 200, fill: '#555555' }
    },
    {
        key: 'triangle',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2692 6.98965C23.0395 5.65908 24.9565 5.65908 25.7309 6.98965L44.262 38.9979C45.0339 40.3313 44.0718 42 42.5311 42H5.4689C3.92823 42 2.96611 40.3313 3.73804 38.9979L22.2692 6.98965Z" fill="#555" stroke="#555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        shape: fabric$1.fabric.Triangle,
        options: { width: 200, height: 180, fill: '#555555' }
    },
    {
        key: 'right-angle',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 9.1153C8 7.29468 10.2347 6.42094 11.4696 7.75874L40.9016 39.6434C42.0842 40.9246 41.1755 43 39.432 43H10C8.89543 43 8 42.1046 8 41V9.1153Z" fill="#555" stroke="#555" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/></svg>',
        shape: fabric$1.fabric.Polygon,
        options: { points: [{ x: 0, y: 0 }, { x: 0, y: 200 }, { x: 200, y: 200 }], fill: '#555555' }
    },
    {
        key: 'diamond',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.41421 22.5858L22.5858 5.41421C23.3668 4.63317 24.6332 4.63316 25.4142 5.41421L42.5858 22.5858C43.3668 23.3668 43.3668 24.6332 42.5858 25.4142L25.4142 42.5858C24.6332 43.3668 23.3668 43.3668 22.5858 42.5858L5.41421 25.4142C4.63317 24.6332 4.63316 23.3668 5.41421 22.5858Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Polygon,
        options: { points: [{ x: 0, y: 100 }, { x: 100, y: 200 }, { x: 200, y: 100 }, { x: 100, y: 0 }], fill: '#555555' }
    },
    {
        key: 'parallelgram',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41.2796 8H15.4704C14.5956 8 13.8223 8.5685 13.5614 9.40345L4.81142 37.4035C4.40897 38.6913 5.3711 40 6.72038 40H32.5296C33.4044 40 34.1777 39.4315 34.4386 38.5965L43.1886 10.5965C43.591 9.30869 42.6289 8 41.2796 8Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Polygon,
        options: { points: [{ x: 50, y: 0 }, { x: 0, y: 100 }, { x: 200, y: 100 }, { x: 250, y: 0 }], fill: '#555555' }
    },
    {
        key: 'pentagon',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M25.2296 4.95843L42.8601 18.7012C43.5405 19.2316 43.8041 20.1385 43.5141 20.951L36.4739 40.6724C36.1897 41.4685 35.4357 42 34.5903 42H13.4097C12.5643 42 11.8103 41.4685 11.5261 40.6724L4.48593 20.951C4.19588 20.1385 4.45953 19.2315 5.13995 18.7012L22.7704 4.95843C23.4933 4.39496 24.5067 4.39496 25.2296 4.95843Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Polygon,
        options: { points: getRightPolygonPoints(5), fill: '#555555' }
    },
    {
        key: 'hexagon',
        elem: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.0287 43.4604L7.02871 34.5715C6.39378 34.2188 6 33.5495 6 32.8232V15.1768C6 14.4505 6.39378 13.7812 7.02872 13.4285L23.0287 4.5396C23.6328 4.20402 24.3672 4.20402 24.9713 4.5396L40.9713 13.4285C41.6062 13.7812 42 14.4505 42 15.1768V32.8232C42 33.5495 41.6062 34.2188 40.9713 34.5715L24.9713 43.4604C24.3672 43.796 23.6328 43.796 23.0287 43.4604Z" fill="#555" stroke="#555" stroke-width="4"/></svg>',
        shape: fabric$1.fabric.Polygon,
        options: { points: getRightPolygonPoints(6), fill: '#555555' }
    },
    {
        key: 'star',
        elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9986 5L17.8856 17.4776L4 19.4911L14.0589 29.3251L11.6544 43L23.9986 36.4192L36.3454 43L33.9586 29.3251L44 19.4911L30.1913 17.4776L23.9986 5Z" fill="#ffffff" stroke="#555555" stroke-width="4" stroke-linejoin="round"/></svg>'
    },
    {
        key: 'heart',
        elem: '<svg width="200" height="200" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="#ffffff" stroke="#555555" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    }
];

var img$5 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZwAAAGbCAYAAADwRCaBAAAAAXNSR0IArs4c6QAAIABJREFUeF7svV2sJdd1JlZ17r19u9VsmZI5nNgDmaQUDxyb4mCieYgkshXSGnleBhjS0GAEW3Esvcii8pYgQMRm/5EBgnkJEnGEPJCCQhmKMVHHDwYiiTJblMyZYMZIYopGnDhkU5biiBzSdjxskn1/ToWnzq06VefUXuv7vlr73G7p3geC3ff0Pnuvv+9ba6+9d1l0fn70uY/fMa32pz/72KXvd//+6P+PJHAkgSMJHEngSAJjJVB2B3j1M/ffV03Kh8uiuHtl4LK8UhTVn638fVW+VE0H/r4oinJSXak2NlfAa3e6/9IRqI1VXfy/f/MPfuXeqpg+XBXl3qQoL5y4+xvfjf+WoxGPJHAkgZ9UCawATjkpz1ZFcTohkGro78uiHPz7qhj866Isimp4oDhQ687zCOB8837zmY/dUWwU56qi+mT96ap4uiwn51XQmYHXtJj+R5Oi/NaJu7/52/4MDucT9br39qYnfvnpLFn9bPz9svrIxmTygirLw5HM+G+d2UBRFHs/aeseL7kf3xF6gPPag7/6qaqqHi6K4rZDXHIIqHXnnwS45UWmsrhDFMY6v3pyavre4kR1+8F3VsUbkxenr5dSIJ7cNL2jeEd1ezFjHW+WL05fn6xmx8biyqq4vVqDHTYOMEyNxkt/Nn5VFuUB98r1NeMnmmeE3OLNM+ujUSMkcLkoqidnFa4u4W8BZ7Z/s1VN/+Oqqn7jkAEnYrFjxvhJCwpL2LwiOlUePTJT50zcz/K/5/710aePJHAkgcOUwMzfa5+viuryRrVx/t1f/B+/2zr1QXZzpiiKhuEe5mSPvvtIAkcSOJLAkQR+HCRQFk9Pi+L8rY9d+k4NOLPsZnN//3xRFvP6/dHPkQSOJHAkgSMJHEkgRALlExtldeFdj136/gJwqv3zRXUEOCHyPRrkSAJHEjiSwJEEagmURfn4pKwuHgHOkUEcSeBIAkcSOJJAVglwgFMWX9qfFo/c+uoG3K109bN/fe9kc9btVt3TX0l5pSqKL+9e23/yp/67d0Pjpcfqjlxe2f/R5pevPXMyeW5k8z1v3bHxnv3fKI9Nl+Y0H6e6Nrm89/2tJ/f//Jg5r+l0/46yLH9uSEPlu/bu2Pwb+6fLreK26uqkqK7Ot8iqN8orVpdWWRa3V9WhdgZmNbijwY8kcCSBn1wJUIDT/TAisvrwYDU9W5T1WZ5up9GVspqc+69+/xtfOXeumCJjzT5z9dmPXiyr8vNLYy3/8ytlVZw9fs9TX0mN+8azH7tQVlVinPLy/u70wk3/4bee6c14aLCqKM6fP7fSQfWf3vfsvZNJ+XBRVctnmK6UxeTc8d//YHJu//yP/7j8+MB3eWD7Nkh9aXdn+sjOpXdPJpNiEASXh9268817N969/8liUrWt79MaHCdzcNwtr+y/svGd6V/5BKMLsN3vcceYVneUZXq+k3dWt5fHp8nWfA/Al9fsjdd8nh23+z2p7/hxHzO17vJkVZQnp5Q9NfJM2RVrn8t2kBq33K6uVDvll3f/+IR00HnrA298auPU/q8tf9/0rydf2vlfTyb93oqBQ35aTIsr+69tfvmt5449ySQAzfdY8aSsioeP/7c3/5doXK5j80Fisf/yxj27zx8rpq9sDP7zbIDjgc3xu7/xZNmcSABWdnDy/VyRPog6G6UGMmvsN5/9ld+cny9qz5h0vr28vF9NL9x097eeYebWnX70umdjG2MefHV5uZxW50+cfuqZ2hH74D4o3bee+djt1aQ6XxTFJ1eAddbAWM6Ad3Lhpmf+g+/MPmT9GAA7O9X78Due/vCjqTHOGgO/dd//cm9VTs+uZsdtOLq8vzefI2BCxbV7vnPHdHvjXFEVv+59vizKJ4o3ikeO/8sPQdl3M156ziU11+780vPWx4yep6srwp6atVt2Vdu5Y1uWjv+zX/4XF8qiJp29n9mY//Tppx49O7MS8ueN737sN8uyOLMaW+b+efz0U5Cddr/29Wc+du/GRnX27cPXp7t+WhXFw//0W089yhD2ZlwrnsyI62Rz48KJD379JXT53fH2X94sd7+3ZsBZOqm+ktlIYDOcKVFgUQtmFsCq4iOrwgwAm/4J/dHrRsFGAck3/+DvX6iK4qHhbBGXhaHrWUCgjRdxivln8DkuxrTWvLCIOluclhdv/sg3r6BO5+jqyrSanDtJkix73vz6fdlqYyKEiLVRy64OwEa3rQTpHG2vg7FFk6llT6PmmY5Rtb+ydr+s+/2XNwsKcGYLffWz9z9SFHXpqveDltQSwczNPoac2zM8NPg4TjEqINTG8czH7phuTM+VRTlrJ++V2WZs5B0ffuoRNmvK4cj1XAOzvKvf/dinyklxpqiWM8Z+1hUUuA+G4Z3YXnN3dtq8c2S2aV3x6/fBppB8APBPady0Xc3JRjejp20rAQyjxhwkxDn0pK99DmIp0sWPO2Tz1euTYve5Y8XeS1uDalkpqc0+9dqDD1ysqpr9LiPOmVseu/SIpeCEY0tgM/se2/DmxuexJy9wq4DQlUNqniob8eaMrHsQwAOzvHTG6OskZUN+AOPHtjPbPth4tsSSojG2NfOlopqeebu55o7F9/LrR8DGK0Un9WVmyn6JO7eNdsdP+1QOmY4YM5mF6GPaRJMfN+WnoYAzrYozt34xDTjDDqIZ3RyNrRIYCDZGCjkbQQWEniEPBob52GyK2q7bLiFKrNEGMc7ocjivzcBqidPr9oG70SS3/n4gG2aNY2wrYfv0+gGwmW1WaBm4mSnPtgGrJ4qdvYsn7v22tB+wWu4do6NUA1OOMXk79e1Jn6cdS7VxU5mSBzhFWbRJS+dqm+EMxwKclIPozCnZ4XagG0xQ3l6Fmkb3HHkgRc8INlKAsDMHTJZ+8OLGWWa3XtmLDYw42OgBIj1nvkThyZddfzueU7dnN4kRMqjYfyQhOrzMpm7akQA8nYWM9Ktkt7A2ruWn1euTKzt/eHyy/+cbg52lXQyRASdhKHIZLaqsYne2acJGDVkBMiRAqqzZqt0yZSRrr2LcxridzbLrRmR5oEvdTpMZuG5bqXmz6++CTWpvUd0L8WXLg22uPVargUm112yNMsOVEjmrdaol0rhO1enK/ssbX772+yf/3aKoBjtBRwNO0kHGoHxAB1UutuSx0FF7K04nnsIaI2u3pqON0refzTIA7hOWBW1Q2WiOkmJ63nwAr/VuNLLks1MebB19yYTAKtGqerfLvpqerIxx3Dztc5DR3cKzub7+tVO/vbFTzJrKB+/iHAU40WysFXwxTZy3wYz5xxFsRrHRoHbNZN32Bm5/lstJ0V1JSXDAbH6lPJkDbJz9UBXErMYgZR+oJYU52p+T+1aanqwsRM1qG7LReURxdNesl9U2c/3/fvtUuWncxSkDjsXwGDaKlahmn8IVatxIIKWRvTkGd5B4ipx/N752UJ60HLLsVWQIYN4+0EI+GhvNUaJJs2ZN7x4LZ0qofXuKObu1YqOJs3FqRm/vMWl6byoFq12Dun/aJa8R87SOaAjk0ItRXT3Vrw1EA46V+uvGbJVVcMczN7RGlH3sEgU+PxAQOh8Txw48hJqj/dkOipoT+12NjVg1mRpzHlf2GWbNNCnwmL1KXJpgG31Dh1eJiCeuY/Se2mMcMWYweW30H3k2zi9PrwJj6hznbH5ShjNcWskheC7wWAFnTHpqK1Jbt8caxmQ2kYExx15Fy+ySpVO+awyTJ2dPXXJgBd1RZZ/hxgMZwBJHE2bT1wHMPp4gjeuBTTxx1fzUzkJGyDS4hNolG5FZmNflO6Sn5DlOFnCqonj8+N9/64cbf2PvN/r3BenKnAnKQmTU8DwDVtmSo0jN2dxSUv2t0thGYKSDWNaONKNBgt0oXQvYJILu6LLPgBxUADPARm7V9WTL6soJ4HL52CtPoXFkhWSkLyCWZZqOeePiaHQlQr2RJAxwNv7W3ovHPnBtUt407T49LQfG1khGbmpHnjFZNjhjjnQAr8cyN3MX3644cuRco+/Da4HbcODZZ9hM1E/5W5nKdrrO/UoVwHJk9y7YKPsBJtnSA26OvTVr/aydduNK6oC82qadA2zt8rStpzDA2XzvbrH1/mvF7Lrx5kcNjJFCijpjkgSbVRYqgY1R6up9tWrMCQeR5pqSqcq+fWY7+wS3UYqCdw1k4v5djpJiNIDlyO49IFeB0ehI0wlBjnsMHWBUKyapQK7aZ2QcBUmhq6cU4JTl7A206uwtj116svb25gtT/2DzfbvF1p0LwFEDY6SQagUO7wW4ghkCmB4TSbBxNegiHVSqI4eCjdH6KTuaW0bk2a1/z95cm6qdZgGb4I1iD2z0UpLdkabYgZmFiYTAInGy3jO0lFsxT52nQ+Kk+OdmtYCesgCOGhibstJwjzgXdMyUFxCMBTipsdV1W/X1xTw4hu8xEgUYo+vAzRy923/ZwIjJk8+aWpkGA8NCV0OBnLN7T+/z32tj1v4ZeJs4MtdRATcHOTJuVGbt1F+/5vN2HNUyehdswBJqBsAp9OvB0+yBQuRc9VUPEKOZXRdsFGOOLM/kYPQtCwt8h8iuL3dphB50EwBJ2egyoUndpK7U7vNlNvFvRnlzVXzKtitd7wbYyrrP51dxl8Z6JVSm3B0KOJu/sHO5eue+/CpmypHZSz7Thzt1xrB+Ftp8o+YgkYYcORZSljz4DO3EHgsbC+ANwx9qLR1dZx+65FXIxL0ArhAXpzwjZ0zrn6vmSw4xkvZBPfKq6snKQuUKTMB1Yo3vvfbZBz49uxX67bn0LvAc3MOxTopObq4ul+/ZvXDzZ35PeoI5VQZhHTm9b6MbWws2gym6Ni4WHKPH5scz5kkDAgE29PX1mDxHlpOM9mflGhwrkCulJEcGsr5yAEOu7tEc5Mhav1KatsmrfuTBy+yUbDG6hPrKZx/49KSYPbU9EnCKsnxio6guvOuxS9Q775aQWKfLYWxdsIl68AoMjlKAiASIbBdyAu8QMW8F+Sl/C3WSTD1gYOaKgS6fiXsyYIlba/e2rkbIM/26pMruI23f31/R37QyshA5W7KzUJ5o5ih3z8YMAxz0iemV2nWi24tN/3IYW8/oVkoeI5To3Pw8O9jJlhG9socScKJfKnWY3cGvhWBrvyzZmpwiA8+RFdbojckGXK8FnCVufVBMd6TJ8kw3HugAFnhdEwI2zL7FYMwbKKGOy5ZiH5HLlS0fKuBEdnul9m1Up3CMTnIMMLOhy0l2PfigjDStzp86/dQzy8af+rPVkaYGWYPZtWBDB1vnZclmfWrQzXI3YGCXGwI2cgZmyFaWp3EVzhhfjT4blqOM6BEN1a+iKzse2ChkuFn7tee2zu6/uPmR6o1JL/TQezhshhPeQTVw3kZ1Co/hKI7hlTy6gZENENFvm0QbsJ0pNr/lM0amI0135rhW5YYYDD96xq9/7sTxZ2K8cgpbffD8afb7Mb6a2meQ55nrxoPg1zUdoqmRYq/cLTSydIF278Wt07vPb5fV1d6rCAUNOEVZPD0tivO3PnbpOx6LjgxokcDVLyUMp6iKY3gsdPG9fDnJDjp8EIvUDSLPg8/QzoFmi/FnTniZduUQ2VIdvaGLAINaSrL0pQKDDYyiL9nXS9F26stUtycjrmgleedqLSX2LWd1ey9slbvPbxfLgFMVxeXNsjj3rgP8qOHIfM8ABJzIgBY5Vi84GiUPhSnbLFRn+E6JinaObPK070ijnWMtYJO4qVk5F9MGneFngqWrdezDrSOCmKkrbVyvI03xKa88xZZmGx1Zh5CVyoadhWjyXIDYcHar7gV5B7AVPS3rfu+FrWIIcJYTlhDAiQ5ow/s2I5UYfDU4cmWNysIjbwDOccGhk/LXfsM6x9rAZqCxQw04FhNXWKNdStTt3wMGNYjnuM8wOpY05G34+v6RJb/hsidNCHuk2HixlC3JeyVUNT4NVV/WBjjRm6+1wa3u24xS4kxAwyivOTF2xYo4trX5Cl4z0S95xbIlj4XNfs+WUtB9sFHPNxhdk9FnbZTylLehOyoDy3FtyxqfXR6td+PGC4XdWxWIHORFsSc7U6wp4WWZaAzofv/lzWL3e8eK6Ssb3fAzu62ztyUzKsOJZiPJ7jZxQ8sueWgCBze0JYD0OmhY54jedO3K03oJkp7nIbU/s8DYB/K4dlUvuxsVxHK0KqdJkWT3TsZMl2b9/ZXxAXfwVgqBEPpzHRGnksc0tDGtbDE74KwNbEYo0UgpJcfwAsOB8UgO4oENy0aytT+bL0HyhoyVJvXSh5WBs8CYIzh4NqWU5nrzHGb3ko06rFkf09jUZkuzvo5Ggk3S/rVmBlumvD/5mY1+44FBtq/s/l/HvrP3h8feWxXlPb0UJyLDMZxECuR1yevZj14sq/Lz3ScT1FTSMzqFMXqBofnO+LF5o4smA548578X55ksd3TNdowzx7c/R9x6DgQGujSJZWDarcLefBW7X9hV+kJKed8iB7vP0f4cPKZTntZJgfMK6ptfPfkvymrycFUUp0MBxwKbMQeHVvdt+ACGOJzCGNE9Bmlsp9OLrd0fDtjwrAkFcAXI7NLfWLsaDI400fLXPwZkU+W+HJmiPmZTohkuz2rr9wIu608+2dLtKUdDj9U5myNbbGLe1S+feG85Kc+GAo7Zcy/uswyPqSvRS1HZMkrOszZe0GFZYw4DruUZfGjMW/eCOOh2MJz+6+NZwZHWk/Pk9iiQzfZqZfqONNan/JKfpifPV1k9tfMMvEGiT4qHyYtM3J0bJHJki43uX/3M/feFAs6pT1zdqBJpqsLsDWCg2WJPicHGgb0wyTuIH3TLy/v0tTWJ0oRIBrySx+z3rO79dTffysvUYaPj7CroRmkPvMeAzdynMlyeudaOtDF6N+6HE/eCrUOYarYUSV588J6XuxVSwOwrhwLO1l0739n6xWv3vt3iNqvP9e4uUDt9Uo6nshA7OGpGjHWk8WPnCDpWR5ra9muXPHhD9tfdUgcZHHJ0OlplSsaRPQY+GmxyAcPgPhtv91nLU86LpYyegCxEOtTbLfVGdrkxwNDbXzH+wJ7dCgOc8uS0OnbXTrVxx+4MaELAJs3EeFbfM44b4F2bHEHnhulIO8T2ZxV0o/bEfL3z+2Are5Y3AjCky4njSEbg67L2HiCf1aN6UkAxB9gomXIKcKqivFJOiodv+cLXvlJT1Nl/Zh+uJuXZcrnDYPaBk9Ni666dYvOO3R4eqplNmjXrjKktz60anWTEWNlHm693KaPU/jxY6tTm57PQeWZDz/OQbn8eZaeBHUTONUhy95BRmpb0BOhf8ql6nsb+klrZyBdwU89ua+WpHHrKtnbh7NZrD/7qp+bNH8ADbMl0KAE4o504CBg851CMGAMbjY16Z07Ksjxz/EPffLQsZxm7/xPFvpe/KdqQsdIkX6LzSx/XR3Dw9V49UezsXTxx77df8rXe/0SOIwo5gMFizew+oOf389/zpMgf9/oZM1s3XuJewJlsrHhKvYfDAM5osBlg42q7nsUaFCMG9xgkNupdh8PON/pKodbZgl+CBAF8XIAILKU6TJxm94jele4hb55qp1MOYEhXNXSS4dgVracbCWwsHXnAYBEaixh68SkL4OQAG7WDwktRtXqo9QbJAW8qeTbqM3yeiSdKNLKjLRwu7iXItYDNYPeYzkTNgEt2++XQu5/V8Ren9sY0Gg8Un2r9NHB/ybMrpbLhxRO2hOwTON1GrYzZA4YU4HhVDU/34YCzcfvul+KZ2AihB7c/e2WPmjlUBS0DzzmU1D811zGZos1C+Y1Sf92N6Y+wgcE9Fn08SwasI/vrzzdP2U+Na1vkgBu4D+ZkdbVBsXrygUErnzsETiaGNonhiasNtPMMFNF9KOBsvG//8vYvvnX+BPGUcRdJU2dZ2D0Ln91hwllGeZ+Jaql/jqBzWB1pHsPp6cY5KNr57DjHWy3PyuN5TJxaf8aDnZHz7PtT3GWki2CbY8xcL6HG36qePKpAZsq+PHFgGIx9AdcAxQFOWV6pJtNzP/3f/E9PopvZK4Y8kE6rTMRgoVKw8UFBU6Y/Lg+ON06TgF+anF05r+4zrPusDcLwsKCg2dKNCQzJ63UkP/UycJSJD5WUctyqniKGatzzSl6MjWK2ysWnWMApqrO3PHbpySFlWX9nBUiGMQIAJgUvHxS0AAGMSzvdDQM2YPuzWv5Lgo14ktwuKXBOl0Pv2cEmnY3SNgqUp+QDk1lfQk3sL42KUUMP/Qkl+aiS10pmE9wcdOiAkyNApsZUghcQHOD6JVtOYud7OB1pXLC1Sz19c1f2wurxg58IXzfYqBmdt3aF3S5YbvB9XsZTA6PYfY6DncH7S549KQDGnvhHkwLrXJjSdHGogGMJSd23icyWsPZnIeAazrYwBG5jL9ddTnPnSJa+aHaLAfg8Y1QcLz1fXk8AE6fWj9iT4sT97Cb2mQWrRDVmrum7BzW9H7U/x/loa/fOJZ/KrRwpwJl/Z/nQLf/sa4/W/zf7j3kOZ7aHQ5bUzAsEyQspPdagsDvn1PfsK6mA47DFTtzgg2PKgccEBSvYzH7Hjs2AjaKv9Hx5eXbBZroxPVcW5SeXr2xiMlDgyhq5c8oJEJKNLmx1+CS9moU0Ohq6I0zdX/HsitFTH7wz7C8Fd81G+2jXloZ1NI4MWoAzrYozt37x0iNZACfdXqwFh+hyEtT+LHSR+OPy64/eePSCTQ025F6IFxS6mZ0MNus8a0PW2X3yojF7T1csKcACrj5Xq3tS0btnV/FlWZ5o+eSF93lP74qPImOqpKBJCK49t3V2/8XNj1RvTLqmVv8/BTjzf71IiVZG6/xFtNHNFxNXSkDan9mA2wi8Ml+u5A0vsoSIBRue4SClpAP7gXr5h2wrIYdx7D7ocGMOkoHoSrHRXtAJvnsver/WtysNGK1sdIxME1UI2Ua9jjSlJO2NqZCCNvZV07N7L26d3n1+u6yu9u531gCni1ApwLEWJO/bDAcGSZEeY2qYA3toDhiXnm+0A/vBZg42rNH57L7+Znr93nxHs/uAU+/elTWKPFGwYW20y8Sjnsf2dKTq3S9R8nbazDV6f6kOuMN3j0lds90APvQUjGpTucFmNtfd57bL3eePDcIDneF4gOMuSN23GTq/o5S73IN4PLv3jWMuezY4ZgMb5yVIGmzA9md2/V4gG8NEo2TrZ8p6ULTtSmP2C5nGVQs8+9f1bh/sZO20XXvyUkpdV8mStxCjPHnmAZsRZHApnuw+t12sDXCuPvvRi2VVfn558zVaSEqw8dNzld2n341vjJydb64noufGHPcSpB9wD8CW3A/ywGZch1vMRnGOjLaX2WTYfG6Y+Pz6+Or2zvfp2af11ICqd5vE6HNd45U9rM/72acWn2qdBz8N38/A+/FkbYBj1LElA4neu/CfiOYZDhB0pPbf1IWcY85vGMFm9itaR9jatYzRdhJeTz6AcbcdAGuXSyl22Udfe8ucg6oFdrY0Qu9JUKi/UZZrVFbbD7bpK3uU/RWbEPI+2vhRqgtz9nsVGFPxZC2AYzFdJaWONg6fifOO7LGGuWEK4ybYndr62Qu2iYYGVkdAwD34Wn79diAbMZ7B8hjZImtn5dkNYmlg0Nfejpk49a6ct7AJjDZXT7aMnjBg0IK4JU/F51ubNx48U8mm99CjDozD7fTZASd63ya8/dndt1Gdw7snjB/X6u5TDcN2Dp7heEFh4ej8+m3HGzGec+od3XxH1j6GMRq6ojNQLODqe0GWrSr7K75stbla46rEIDpGWdlnTVuFp1BsQqCR4R55TXQ4Xvvu8c39H2zes0yi6myqKB7fLYuLP/vYpe+7Bz9n/2C5acAFm2p64aa7v/UMc9ln5PsuvhFrDMdvg+XHjc7qfOOYGx0DZFhWN9KYE90+02py7uTd35Aujo3oSsLWzslzMLMZuPlaZbfZmHjwVTC+n2pkw3yxVNxfmst0jU0X5HkwpKIxKgtLE/iaFL311Zv+dlFUs338lZ+yKB+flNXFdymAk+Nun8hrvIEAIdWD/fLcj3FHWvoKnK5xyWw8utunYXljT737LbrjQNYseYmdTvWYGRoPDHCQ9J4LbNLAwBOtXrYY/aqsWYHRCEyORMCplLSx9C8+98CFqioeggDntQd/9VPzDpbitqF/0M1wjE143fACny/wzoYoaarvHEKJKkNQWLCcwI60G7X9eeRZm7WATcIGxpbnhn1UyxacgEO3/duA2FjwiLkah3qVkl+7/lV7kuKdJ081C3FilD5XqxuxQ4pee/CBizDg2BevLUpqFsuPDeQiwjvBUbkOAwEbtkRlsDDZMFqwCXQ4JKura7RimSIlW0VPQCmRkm2O7sYeY07uL2m239X/QGZHrX15nsOHRcfo3dwH1ee6zvZnMQPNUiFy9qvVPSsrW1z2+XDAOfVrV5+tjJfhmD2BHDVmPzjyjoyCDcucIkuIveCQbi2lnRhbu16msPauWFtCwIbZD8l9i0DakXVmbzFxZu0YKI7Qu0cK1UAevL9kljtFguWV+9g44mdLOimoxyaugAoFnI2f23t6+8NvbkRdtxC9Ue4HR96R/THnTscaSXK/YoQRe4bHMhxs7dr67ZIKL08AbKhuH5+48I0hy2XqYUfW127pX6k8NPO1mi5Yu28CWPqmYj04Ru8veWCDdjdieq8/RRNC24+ab+ZJds+fiLJ0KOBsvm+32rrzWlGerJZuZuOdJPo0vR8cQ+fYsSFhXIOFqazeBRsSyHx5LoxZCTo52L3XlYQGCGTtLHivBJ0sN18PH0QcVZoMvgrGB3ItOK67/Vn1U2v9qk15Z210/0wfbE2NGQ04xQHg9PxHuZQzJSSFifkdaTwo2Glvu3yakURndS0Tce5IYxzEl2cA2AReyNqwvPSJajyIQWBDgvcg2Ay0P49p/c72CirBbpfXCa57FHnzGL68r2jsrcUH8BE6JbQUAAAgAElEQVRZnVma1OKeTV7tMbMDjqJQpiboGbEPDJrQgbM2dGdOjjbVReob2JGWu/05+GbdmQwiyj4I2CiNIV0bTn2HQrT6467tbAhNsrzse74O0U/N13VxorEKjmuTZ91sg2bfPZ0ns09dnmPA5kef+/gdm9X++aIqZo8ZrvysnMPxutQ237e7lOHwCk1vxIoGlwHh/c1ijZFEHmpdNryBCxklJ0aAdvbdevqfeGFS3CSuHSSg7IOCjcpuPUdmMtCV4Li+syH62bVko9HY4BhHtFrytj550oevFwRz2I8Ofi+RAidbdMfMDDg8QKTrl/xYrQOnHzxzBTSEwn6NeQ42LCNJBHLJgVcYc1DZA1l7DTZiSclqf5bv8wroyDtssBkNYiv61/zJy0SULAwoz0p+2hCNKKLlBHJ9jsHPgXg6GkUG09kiFKc8wHm72ezpaVGcv/WxS9+pmwDwDKfQurKGWY6kTO+Ak9ICigYelo2mArniwCtgEyRTbO0a2OZi91ZXEqp/ICBKmWJPT5kO9ybWL/mTw241kmWWu+YSis6U1dKcYaNQsB0ir/MxYzMwz09VMjiba6osjeooHHAmN1eXN++69uTWz+x9+/jpb76E3pEW3UHiCV0J5N6Yc4PimaPF6tksCQQb2omxtc/Xz4KtBzYqu7fmzOjfu5FC0fly8Im+e8uSKRochrP7dHBU9O4dmlWD4zrbnxlbWtF74OFrJLNR/bPJFoda1RkdhQNOUZZP7G7tX/yZ//p3X0oh+qqzpR8oYxbTprzeY0JKucu9UToWbMYYBsJEmfIUAzYKOORolDAJDKF/YL9KzhZaew3uxrP0r/iTM0+JZFkBbBEfosnLyGwp8XSDSgqN8rRkU34mzpPhVveJsjS7dRAOON0uAwRw7GCmGZzNmvgxfUXGg40SuPvZTQwTxdaurb8JjMOtyiOcI6j9G2oMGdHIYLLGEeOm73bjbd8LOGp25+8Favr3iAZDtHwCO1KeiSYJNQM9jLM2bFZ7qICT7a6gZJOAasTeuzb86d8crD4HE/XLSfW3Soxs9g8T5EAez75IE9e/HxD1xggviI/JQtIyxddOVCAkPfkZszZXL56wwXGhp/W2P0ugmKET1y7RaTo6XMBZ62aZJiCgpELvh8wVOQhikgP3M5tUKyS/fmTto570TbQqqwzPkCtV9vED4jyjUwOY58ijxh2UKa/7Higmmk7QposV+zxqfz6buvpL0b2TicsxJe0Huj391Rf/4X3T72+enf51eXqwAsZ2qaElNSOYSQLySnNKiSoXy816IWfilT12/cjaZwajgkNq/DHsPsKmULBh5YkFXd2RWxC7ntuf/X1Qyfeb0uR62p91HXkZmGJTnp/K/pmha3I21/2/LM/u/cnW6b0rW0tXnx14SA7AsRBZEVA2RZpMTGO5OQKtzZj5chcWdPWSksWcFIaXDrbzch/KxLF16wHHy2yUgONkInoAt942IZou/H2QBRQrvt+ATeKiT339w+AojxeVfWPEZf6pUeQt04ul1Rvl6d0/2i73XtoaTHDoczhehmMhsiqgdfexzyXFB54cgdYBGzoDwYKuBra5Am5E+zO2bl7nvQCRDuIjA1niQk6x8cDbB2NJAfJAne77ydP0MNFYjnwJW5DHy5GB+faql3xTB9DVe/y6c61en5S7zx0r1gI4XtmLNWRbkTyz94L3wjD5wJOjHlrP12GizAakb8SNBPj1HwbYoC2bWCeetuYuw09dHKoye0umagCfjRlx51yfiXtNN1pwjCAaINjQxG0lExluZJKIhu+nuq0mEgIZbJd9q3p9UoQCTjclwtM/TUBGtiQJKFfgydmRZgUHBsCxtWuZnQ2Mmu59coAFMYR9j+nCawEn0SAzBhiy3P4ccOdcz+/dZ8c1/Xvtz8rZmJQ8R+kovW+VKUZp8rT8aczB1uX4tBbAcRA5HOVVxui3AGvKzHGKvDWQgDvSwKArlREbsEmwe0n3XmbHlDu9k+6z71LtqQUb4jXEZcZt/TnartIETrV78/JI3Z7M5gOMaKxkNhme8TZBUS13mre0a3ryMmUFvFPxyQOcqiivlJPi4Vu+8LWvQHepLWc4XvqnOLPHbpgykh8UWtOUgmN0PXTBmPmHj1LBCwm6Y1h+qgUc3czHgwOXgUEHO8VLSHt6CiAFKzJY323Fmt27HWlacMzRIDQPjjf6WRttC8GuFGjgbQKYU1Iry/JKVVRnb3ns0pM14Lz64AMXi6p4KMm8Om1tHtjUTHRanT91+qlnUGbn7VkoaOy1FjKdTkjtVgFZrDzJOzESdMew/Bwt4EYmCgdHQOfSZZS59OTbFa97n7xo2Z3v92OCY+xFl3VwjAbvoJsuejo337XR9GRXCjLZ0+uTKzt/eHyy/+cbtw3F/BXAsV5rqwc4AJxTn7i6UWU44JUKNugG8QpTdJlYQb1z7znxmHqwzUZ4J0aCbg02IsvP0QJunbVBMyYgIGY82MnrCQAxGGgZ+1f0jshWJVwR56wG1x94dimdLXHZt08wFp9Q9LSIU8GZnQO21/5s88n9PzhxX1FUvx4GOBs/t/ffH//wW/dVRTV71W3ggI+GnvGvgKYvDW2EoQBZtvZnqyONrAkjgWEuAy2tziEDCyDRjU1s3Zp9emRDzZS9ceUAHszEEdmqwdHSvbz+QbI5Uvc32O3Pq4dlR67fuT3m2u+cmlTT8mxZFIM3DdAZTnlqemX7771VTH5m//ZhsNEYXviGpnOjtBpsc7U/W8yJdWIkMDTrVw4j5pCBt2+HlFKxdY91uDSJQUFxiPml5s7qvs+c48pTWJdjNHkZmX2vVmDkTLGtPgTu1/n2qtvqcDzVx0uXJmuLa+X62m/df285Kc9WUYAz+Zv7xdb7rxUbt+4P+Y3U8RMdwLCuLF74Odufk3sh5KlvLDCMTP+DrtfxmD1DCnzn1dfczjM4Y/DH1QK4HRx4u7fLSM0q1HGtKoS2/iR4k1WClbJX0EOHLXhl2JIwxs4Etv2bPl79zP33hQLOxgHgTAYBR2gSSO6xaAY8E7jflaWNHd3p0gu4CebEnrVJHT7sswNx/ZnuX0rvBWLzBEF2lMPZQReb5yBDy9VBFcnED+GsDdP63gOGhI2OyxSToHijnLWR5okQwuVy5xoBh3e6HBmD35XFz9NgjAFB7MZofzayRlkGdlaC6QnLZvUun9bpgmv39rjY2pnSnNr2ns2fnGxRKvWu+ayNWkJ1zgOG+5M6Ty8TGwLxNQGO5iDRGYPflaXOc/iAm7qZ6TMHfp5+YJjXWtFOr+VgluOsTbFRnEs0nsBO5x/m1fcBuqAwfHkkr6ceGx9uhYXXvqoj42VdoZzk+5O4X5sEhnFlz/B4EnzBqV3qnGtTjSnWLQrI/ucgeRHWvw7AkRwk+sAkUMPX5pko+Y1J0WvDC7zoEQgMtT2pTCe1v6SOZ5encFBE3vNRuhBXaveB92R5ZVQ54Bjt/4qtAv4kB0ej5C35aDqQjyQERkcWU+r2icsB2KjHEzJkdl4JObX+7ICjBJ1EgBzBvt32Z2nsHK2/i4Az/EAbm4EggaFmTmTzgRsYxfE8lofaEway2qazn4HqTNQqUyjA4JAXqe0dsSl5rsYBx1FgG33WJriE6turbqvDAD4SbMX1ZwYcXkgJY5YAwXc2PU3Nsb/UZTpDj0mhwRYJiP0UmdeTFRjVszsN2CTeNoFBEQmI6qYzIls12GaTaeDLuqhsJYY/y8ISz8OrMk3FE/Wq/VZHkU0X7uFzHRyGS+n6eGPXnxFwppfZjb2UMbOBtg0KZi14ZJoafPdSdMaABYa6kEbryQuMrN69tc9/j4Eitm5tzQjYoPPsA/78T9Ht/3a2yMsA6/bjx7XXjut+WabR5DWHjnx71eSZBgZ9vIj1e4Bz4OsP3fLPvvZofWOAd7VNedO02Hjv/uWNX3rzwk13f+uZspyVcv0f62CbuqnltT/LZaTgu5f8QIYF2y7QGhvuHWVoxpclMDo3ACMg5juvDrCYbDV51o6co6U8+qkB86ZiXbYR3Ygg2Mj7lA4oSntLvr2OsKcctygYTy2gGSMCONOqOHPrFy89ggHOyWkxOVWcufnM7z56mGCTqyaa2l9CBZ6C3sggjnRmXXeZTfKQG+Z0vvPWkpcCQxds0ueYsHmm9R98p1W6PCXJwG/A0Na/TrBRCaaXgSl7S0C2KOnJmKs8nk2I8Cae2TjxgNO5XtrPa2xmp9SBPeM4SNlCy0iKwXVlEwo27iE8PfBGds75WR0+T8B568HG6ilH91Rtr8M6kwOEFcQVGQAt9dJcczw1kOVRusBXdRd2b76Cqu9Zp7pmhbb3fowani9rT4cKOOlDeRpbOhSwEVsV/RINLwM/q5t/K2skjpPozmHfZwePi2R06qZzu/YM3VOtvQ5sQMv7ljnanxMb+Y1sgu1pVCYafdZmrqNEsBU7Mb1sMVr3EbY/1MSkjHtogPPjADZjNoi9IM6W6MCSkv7UQCJzkp3DaehAx/WctwZYMTD0srDg7imLHKnz9TIGtmKA2JQSdIysbhwhyrC3muWGegPA43XP7f8uV6XSJFYb9/AAJ7jLyy+r8BmDXbvUxuulqYkgzjJGJDA0pUQ26DTBYahVWXWO2ZhWQwc6LlDqgbvblh0NK/lpTmdn4tqY9hU+vK1iNiXO1coWxYrB9db+O2RPvkxFeRoHO5FmG972eXtqvuNQACe6Zm2lvQcLlWrM6XF1gXusmWWMvhE336jNOZrhWADGgCJWPtTWjIKN6syRe3ZOpiy1vWM2pcnW1psYcIcbJGSf9wiBondfppo80+RNHy/H+psxd7+/cXb/T7dO77+yMfBO2tyauS41p2kgxUpZVo9kCg3YsKfzWyfOkKJ7ymQyED+rCwCbHE8NJEsKmJP4zjtbNzYWz+7GjZ2r/Xmoxq7IALMpTbZr7UgbsUkeTQh8e9XkmSZv+nj1mDla9A/G3H958smd722X01c2Uq4XBzhJsBHT6DZ4p2ui8Mbz8uqP2p/jbqmOzBh85x0HCDYhGDd2thu1g+5yw27W1oLZWsFmbDxZ67s2eqt+jhiVZW+9U/Lbf3mz3P3esSI74KTr7Voa7QeGEZdRDnf6yODlB1zeiZHNcvXcSTTD83WFrR8DG92BbXZXa3FUmSa1b6Vm99Htz95BaXX96wSbMY08Vnan6AjIFuWYkpKpMs8u2U7YwCi773b57b+8WWQHHGsfQKmH+gFM70xKKRLtmkqWaALTVGz/gjuQ1YJi4C3VPtDiQRxw3nqwsQ5ntViPGTs6uzfBRmD4SAOGsn5Hb1Igy1HymceUdPvzZHPjwokPfv2lZB1o4Bdeu74aU5JgI+i9O+1UxqRuSTQlv265d++FrWL3+e2iuprcwhlXUsvClu3zG3IbrKVI9XqdRdAdvv05V/uzbswxt1QDAAYDBFbqiXnXZngvZNzY0Y0XXsbA7AMCZem5nsRglgPAs5y1MW4/ZuU5FGiX8QjtxBws9Sf2VZV5eqRQIRntmAPdiFkBJxfY2M8kayW6HCeUu4IfPDhFbmyCJSUdcNd81gYNYh5TnMtZ03vP4YxmBtWZo33AO2vDVgwwm9Jka5V9Ud2vBNwMjTzRFRi/AiHKM3moFytJJ6svGd70SskgG+Cc/MTVHw6/RT9OOHadWR87B2uy2CPrcFhg0AOvVfJRszsbKDCnw/aqdL375Vl97Giwsco+Ukeaey3+3J5YEPOzJkz3Q2AzcB5MKst5zH7UupP3Ao6QZ2BJfqWMFpwxGbHqys5z23+2/8fHbn87/t2WAsCqKB7fLYuL2OWdZXll8vM7397+wFvvLcri9MxiFwNrxouyUMUx0unvuLnagYxzOHT/YpSTJN73kJm9eacbJlufKeoO7AeccWNbTseWUb1MWdE7RmAwPeFlH12mWfYXgjMGX6aaPNNEQx+vHjMDiHmNLG989dT/W1bFQ0WRBpyyKB+flBUIOCenxdZdO9XmHbu1dYWCzcgbhYcQddiQxynSAxsWGNGSEjtu9DwjiYHvvHrwwsBG70izLjlVN2AN8KUZPkZgNB/w9pcibVTdp3SyWlqefpY8zlZzHJTPAWJII8u/ffIdvzwpijPRgFMcAE7j25ISscCgOYZhJKPmGh3Ec5aU8pR8rOe8MV1dB2AzqtstRRDUAGllSyyAgQ0Ykg+sE2zUTXeb2Yd3do6OfzkOyueo6ni6byolr3z2gU/DgPOjz338js1q/3xRFZ9M1d9mf79117Vi686dVtisU3TH9haiMCYLFMZ0ZUSnqVhJSWPi6wcbbJ4Y2GBjpWzUY/js/lrPXlP344kXiFryUAAMOGsjga2jt2AA40rSqyW/mKv2G3+3m5j0Vv2U/4+xzzb2rZTQMTKYrBKB1afcgCMfbHKYyOzXkhGbYCO2fvYBcr3tzwpAHsK7NlAQ84CgkbOyZkBHBx/Rg5nV7aTshXklCraZAzprI/iApzdFXzn2F9LMXm/79gBcBYeU7sdkdjmqOmzXZFbAURgYGBhkIDuE9md6riDLl85GWNerqJmoN1/E6cBSj7RmJAOZfyYHy9PG9ByZBTAsW9bA1jxrIwLYcNagybJXmg9sjvEBXJVn+lopVu9ItUghBH52N6yrbICz+Us7X2IZGBgY6ADug9g4Q06nqfz1Ol7wblm+WKJJMTKVHHjsFj0fgzZGjHI441r86w1sIp+yxmxK8wF7j1ELuMM2qs2vBzaBF9H6AK7NN0epO1dVx/DZZPUpC+CUt+x/aeOX37x480e+eSVVR7f+3lKmisbpdFozDIg5kKDgB+/mWzVHPoyzNsgeW87GCJ/d5sps9JJvukzD22pWsBl+FqAtTSK6X44DCRuVy+dWsFVJhi9TXk9NxlBsFOeqoprtkcd1+BrtzyqBM3zWTAiyAE5RFmdueezSIzLYJDagkNJM6jsPo/2ZVSbK8iVHTgYHDbysejhTnvKZ4jhAsANOPVM5mEVf9tjIdOixOyU4+oFRl22OZp7kJjl5IwdCBhV5ArYkl2Vz3CS+IFtD+8oaKNo26ld0sgBO84AOCzjRm6ROOi0Hmhxpek6WnyNNt+vXmDHnDIi+juafUDNma89JJUYG+NK2CmbL9Lh+0MV0v5LZ5LheJfgiWsBeJXnOZRp7h2Fr/8FXAZnVJ6Cic90AjskWgYWYmc1qxjRqHyg6/c3J8rOAjVlKwTIGwHlltgiDjbChbbPGecbAZrZeEGdBEW7AEDKHH4P2Z8n3EQBn9WSDgk6GuuOuZssaIfBsFLX76wdwEleDowsZApyUc6gb5P1UPSZNxQIvFsRR1qiWE3yjw5wk55pbZ3NuFB9lV8bNwnK5M7CMjJRmlSzMC7pKwM1BiJqyz9CFuarvezJV5Nn600DnnDpej2ytjjsiAxt/oHs2t+sCcNLlpBFonAg4Y/vYDWOmlQkGXqnscyhnbYCMwQtajcMowasLNt6N4gowWAFCBXFvL4TNltDSLD1u59XG/ob2QWkS0P0KIcpwl5cXxJXOWV+m0VmtNp6X2as+5dko40uHDjjpctI4sEn18bOONpg1DDESsjwBg43oyImAK5UTkMwGyRjgUo+wZj/7bD4xwq6iL3s0szB+nnlLs8On8+dS5QNk2hb4dfd1H3uGxZepNt9smV3wXlgk2Bx6hpNL6Dn6+K2gy6a/KMtXHHk+z+HgIJcTgPIUwnK8soQavHoBx7ylWitNOoBLZ7YLJpoK4nwQwwgMP65Vnmr0heh+lbjF3MiBgo02R6uMNAfa2HG18bzMRo4jtt9Ldn9oGU4usBnunhqnSDvgCOwuuV/VdR9tzqn0Xy0l+lkJNk+/LKE7cM/hko+oaRczetmdXKYI3AfKCjaZztoM7K/I2bfnn7GgMC5Tzhb3gsuTnt+rdn8ogJNN6IPOgQXEZQaWiznlDLxWeVItJUY8eOeXJYLAxnj4Kkd2x2a2ADDSrBEDGy2ziy6ntMAwQApU/dRjRgdb/2E6Wk/2PDX9tPaU3F/TY1/0dUXNXBHAefsdtaenRXG+RG+Lts7hRBuHk05KhtEDm0Bjzhl4c4C4c1cUJFssIOqO4WUgY8t0acfjM1tvrixrREuz7LjePNXDsilbULPvJoin9iuVh+4QmSrynMs07pbqPiGO6ZhtY6nzeKJKXmfjv3buH10sXi8eqt6YpDl+JOAkGDMUvFIzTBoyuZG/PH7kxmbOwJsFbJyzNshFn9iaR7I7l43qYBbdPWnJg82WvJJHY8vsuADYaF2TRsPFmACWysAVUEBkqsizlqnxbMVkc+PCiQ9+/SWrypKMfcPjyvHUJsW6LzV2de2Pjp3bf2nzdHW1c3PP8uKiACexmCy1W9UwfObAB8icgTcb2IwsT6FrRoAr6WxBzQxD46ezO83pvPIUG3RzNWB4DF/xqxw22gTxoWuAlDnOxvOeGpA335OXxmpZcjcTGVq/Wp70bFTZC1uuQO29uHV69/ntMjvg5MhCLENmHXglu0kxEjJrAgOvxhqDr+6A2C1w64MXtFr2TcpyudR5w5y1iW5/tjvxDsTEA6PP8PkAmQ1sgu8GRJ4aUAKuta+qjNcL4IkDo9JZI7NSwNtSn7gvuv32Xtgqd5/fLkIBpyqKx3fL4uLPPnbp+1YQU5lIU7vNcbNqO9+A079w4BXOnRzGuzYow0PY9xjdW/XwA0MfV1IYzu6kMe0gzjtyzn3AiAaRZVKQw0ejQcyXKa8nm7xp4y1nC29vrp9evlVaIdoOKZbsPjXXvRe2inDAKYvy8UlZXXzXY5e+n2OjMB1wxinSA0eWOaCBlx3XCrhK7RrJbNAzB2gXnuIY3VLC0LUlYzMnc49FzMZumKcGMrwVlLqQUtnMR4KtkjH4FQgtpkSD4mGtX40nqZiSFXCO/+PXJ0MMZ0xXSlO7XQ04mmGkUr+xzCFn4I3egPQzMUy2flliJm1srOUSp1dKaMFGyBY9wFWzMUMeNGv0A2MtAXpcK6Ofy1TTV9JGReDOUdUAZKrLMzBLPjSwEX3J0lU+wHn/ta8ce/9bv1kW5cpjQmPZ7cBGmWQYKNiwzMlP0Uc4cnDt2sqWmICTc82+wzWf4PcY7EA215Nir5Y8WNYIBMZaAOy4HtBGA5gK3I2OIp+dBmQqNTPleCPJsVEp9nkkc0xSYJWR8wDOT02f3r7nrY3JO/dXaoxs8F4BhYEbUMd0OkUzJ8CQddYYfJdXOltspQ4Zc841M2Cj2pZ11kYZM7r9eXgfpJ8DKsHc01ssgGnAvdB/3FU4XrCtaUZZPVHs7F08ce+34XblHG8k2WArkgznIlaVZDW6svYCswDO5vt2q607rxXlySrumdREsFUMowdigad0PQdmMoZ+OJkdGktfSqgExZbdpq+CgRgztmat1LMWsAm8YsbPGLig63eN6Zmdp7dYANPKcq3+gzpGHfBqXU5l99Z+nZIlewFc0dFszOjmkF48NfcCiyIX4BQHgHMwl5EGZ9yAqmy4dwUUdRDVc+CD74QyhrWBjXHWBjFmcM0QcC2veS1gY5QnFRCPPseANJ0oeyw+w+eA0QbaAN8P6Bj1wGthf/zam0pB1NPgWACPnmed10mXkfZ81SCws/Gv/avtH05f2Dr9dny5LeXz9NU2m+/b7QKOFGT9gKMJHFEmW0rwHXj+rey4uRzZBwpftvCaM2w8dnQo25YhA2lMWx68I6NNJyww+lmTMNcM2bdn+0rG4O8z8mu3KwXaeH4A18a116+N6cfpRRY+s9Wd33nn+6ppcaYoMgGOEmT9RYwTjmUkCLNfzUCst0IOwEYIvIfxiBrKchD2rZYmFvq35araVo7258h9ID8w6mw0upySw0Y9sGFB1h6vHxBvuvtbz5TljBtiPzlK3Yewfolk+XG6lWE7/r958IFPTYpMgFO8o/qSek9Qrks+PWWyzAlhomrgjb7sD8lsEGdG1jx249H7DoUYeIFHHjN98p92ZF9HtRPT49ZrX+NZmzGNPNFB3JepRmCjs2Q/gIfPU668+HNdgE3XFl598IGLRVU8ZMI5e5farKS2+Qs7lzdOTc+fOP3UMxhX6H9qONhqAu+OHGnM6LkTFsSa4DB0uFEOikH3juVk360ROxuPKph5ZS9JT+lLTum2Wj8wHmTLwlkWR28ygA3Z6JhGnmiiCchUW3v6Khha71h8EkmGc7mtGk/qGOXGlNVthNcefOBiFQ04k5ury+V7di/c/Jnfo9LTbsAZeqBpzAllL7NBmP2KYZgbZHrZIxUc5EzJbYPEjBlw3rVsPLK6apwjffeaRmQsebBBF5NtUSgBwhtbKU2myJZqowvGvN72Z2ntRqBl9Q6CTfD+76KMqJAs358OiNHANkIWwCnK8omNorowu9qGzW6ShiywOkyZfLDxHHj+vfy4HiiqxuHdgos4Xc414+m5JtPZ+JFXzNh6moMC0z2JMMXGplgb8PQmA9gg2fKbTax4kCijShmD3xwhgrdB3li99+KTAWKSjtzsQ/eluf07+6sJH8gCON271BjAsZi9uhfkpH50Ou05cC6wUVh9U5obbtdMs5BlnWFrxrKklD3436E7yPX81AASGFWbQmQaB2C6floAD3wJ1CNZclk2GWhHgm3guL5NjdSVe1t5WhbXDeBYeyusU6wGzOE0nd3YBJkoDWJeZiODjf2IGnRtC7hmKeXHMxsdzIy9C01P0U8NOExRBpsMDDdy/xOpPqgZg7+3qgXc6Af5WvsPP3xsZR/a2nu+6py1seLVdQE4uQy5YfiDm+9kic5nDbVKtPQ/wzkGhN0iQOalzrNFKyl/a8BuYNTOL7llL1L/C4dLOTPvyF4n3hiwiX4rKJePRhNNv6mF15OVgaml8y7YRB4YdWxKIlk4MfRliwBOVZRXyknxcPmjz338js1q/3xRFbMLOZM/TEktlyFb5SQlQPopun7/UuKuLNk4wsDGTZ1nUs5VSsBLfj5JLqwAACAASURBVEOGaMlA0b9FXpSg4wfGOYFRGmWOztosvxPTWIgfEDlb0sbzswVtXK8Tka3oIFno4jPYnBHAKcvySlVUZ8MBJyvYBN6q7Kfo/Eaxw5ilTMlj9QxjxgIiZmQpZuIzfA3MbMAVx0y3atOg4BOCA7AVsjDHVum5zm1qOKtDmk2Suk9mtppNATIV1566w1AjA0C2ED3P+itH6cpprWYI16EBTnawGbwnjDdmNPAq+0ypgKu2VgL7LZAxA84rd+H5pYSRbDR4j8Uup/COjMlWK1N6tqoEnei3l2yixfsnRrJ4PXnjKrIEwEYCBs+m1Izek8HBeqCY0qydApxXP3P/fdWkPFsWdcqa/PFKarmuw7AFxBuzp0gmY1gWltWRx7TUtkYMnLVBUuqca/ZLCePAxmLjDAvr6iqyNIfJdvbtfBbmja0EHau7TyFYXbIRdc4OIFnSHmOk3nPZEwYIvC11Y4rzNAZViZnJ9K3vbp/b/8GmjR9NSW0GOOWkPFuNABzzzQihhIAp8zoEm0QGpjqyt7mPMDIvaCmMZhBojVuqVWConS+82ydZTqFBAQmMKoHx9cYHnXS2xPvSio8O3f4s+r5n9xJ4O1my7KPB4yJ6RxqDUpmDJ1skpixndbvf2z69+/yxzrM1q9/e7uGggNNcL33rY5e+sxpwEvVg4XLLniGnlUmlfHXgAjqn1MCYo5To7YUg7BZbs9aFt2x0b9vH0sN8rSZpXXVZc+K8kTSmtw/EODLY4SiVKXMEnRw2arFxxD6HgqJn97qPxnUiYhUIHsR9f+XH7MVTp2GI0Vl3rrvPbZe7zx9LYVz992GAYzFQlTU0AJFoA6VSPmesjpA0ZeZwZK9ujzI8j83MDYF/BZEAG6l+3QayxNkAhoVhpQRe94hsleCYI+jksFEPbKQSMnDGjCEFXeIydIxC0U83qkbedOETGN5Gl8HGOiyOxpSF7y8AfPe57WItgBN92rufpg8zEiVAAu3PwYxZN44oduszRb0LD80YGca0UqJJlOj0MeMYLiJbpf05R9Ax7EmyeZ9s8KU+C7wWdqH5VK4YFT2uQ2DG62rEwc6VitZSprQWwMlVD66NL/X8LHmfVTOWjexit0tguc934uYTmNP5GVKd21xWM1A/MOrje2UvZc4GQNCOjMlWsymHGPFzNWwUaTZJ1UhuqNufhwMtLcsVQhQ4rnewc5SuAtufU/E0O+DkStFtgOADJBIcghkzXe7LAjbmBv4cDJTSRDNXP2PUxvfARpmzZQNsac7PPucSUmzKOxdGz9XocFSqBN3S5HCpO4fO62+VfMrsSBObGbxMjNVRO56RfShjRseU3ngDc80KOKc+cXWjCjoPs5KqBb5HjwSHMfc6RVyt03Vir1UROZ2OrHks2HiBUR3fe9dGBpug0hwmWy2z84iRAmApUqDavE02RLABGnmUgPvj0v6s6D0r2CR8KRvgbN21852tX7x270BH0qgU1WYOvDFjwYHPmKwMTDUOpDyFOB26ZiVwewxnQRx4XS3Gjttj8ZgoW07EZKtljv7YvJ3mPGszUJ6Wfd9rvFB8ysuSlZJstD3542nEJZrAouCVBXA2/p39auvOnWpy696s37rXc40ExOVspvvnyBKd78BaYLDTXz4o+IEWL8/4nU3z0gSSJaX0BMhVHj9yj8V3Zg4UQdlKZUpfptxcPRvNQTZU3/cbL3ifypElR9uTP54en+qxgw6Lo2Aziys7//r4ZO9Pt26zYjzdFr3xN/eLrfdfKya37vfGVVgIBjZ8gMSCA+/E0RlYq0z3Ik3M6TymOPs+NTBgDqKPH7nH0jhcujzJ6R5w3gNVcuNiMo0ckx8L8VHV970SolyWNd6fUcE2GsRykIyurrz9VSYO+HOdH6t483++6dj0Lya/vgbAwQKiwpoZwaDZgm7IqdPpuiNHOZ3PFLVNbILhSJvkXtDVg1lcac5z3gMZ0ZmdT4x4u4qsEiBgw5YlcXvi117bUvCNFH5M4eeZQ+89XaUvo60/xviUP9fFsYq93zn56aIoP58ZcHiB94QT/fyqmy3wGVO2zCaoVdEHrXl6LtetgU1ddfwctfbI0pzfHFFbM91BBWRNPICl7YkeCwUbJWPwGbMWUwxdjVt/OqbQ4+bQ+4qurG434kgJMNdeXKEv70TuUuuX1DTDaFlD8BviQOClA4NdntHXH+V0/jhzsFECQ7N2+8EvfXwPbJQ5R5bmAHuqTVlpL/ayJjazt5goOxZGCDWbAuyVDuItIUyciRl9fiXwpgvvjNXouTp3GTKk0y/R920gM+BM5SCGpKmMYLyyTPN9quMlBC85BjZXzJkB5x0FNvO5Wk/ajgCbXE8NrLn9WWkv9rImpuThkQJ2rOVyyLD+MftcGQvIlBUftfxAIQNI2U+Rq6v3TOeC5uvhdOaX6FfHywY4mz+/e7l4z86Fm+7+1jNlOduH5n8ia61I4FUMpHbm1G0HonEAc4WADBiHNrKVAOGWJzkjRjJb1jHQ4MDc6YXJdu7EEjFyrhdhx7Tu8mLH6mU3w/qH7HMIbLxMWfFR76wNo/fe2s1yd7zelbUjtq+CjXff2lD1IQvgTE5Nr5Tv2jt383/+e0+OAZuot76R4KCw0AZshuapGge0AQcAGTJOSPuzGRi1vTAna9KCWWBwQOxJceLIzHYZFKJ8aSXgrupfKknPxvVKiDJ4J0tIPChgAZwnWb5NjZirmzVy8/XLyOnxsgBOVRSXN8vi3LsGnidA8pz0gjjBNKUE52S+xELb4DD0tgex6YaVJxafQoHML3Pxm9g4u5t/Uil9WBmjOmZkuyoI5FLmiAQdds8q0pcQ/Y/RucKYrXgSqXdk7dcTycAqBfWnKALn26g9XhbAsd7D8QDHWBAlmAUTybS/kGTMI5gIUJ5Cyh9+bVXbxMbY3QHYiO8bmRv6wph2Fw1HYLCOHN6Js2U2ho2ywIUEXJQMrZKsX7m3CryhuCGa6fIcp/fe2oP3Ff0Ars91bldm/KOyUX+uPsm8rgDHrLUCZaQVQwYCuOJ4Oc4xjElTV4KBXeaqe+zz1K2bmWig63WkIWBLZIw0gfFLPnOwYbuIgKyJnms0cfPJRg6dz75VC7iR78+A2QKvo+BSFxv/mGwUAhuAEF43gONt7E02Ny6c+ODXX/IypJ5jBLMmm4lqjhHJbhGjUOrgXYdDypOxIK4HHeusDQ0KzkG5RkaME/tM/CBbJMmWBTbsujF2r9k+YK90EK9lmtaVNF4jA4twZND7qLl6BJbJRgE9wST2ugAcD2xYNg4ISFJm9NsehwE2ChiggVFlo15mo8zZLM0pAdzJGmcyYpwYCWLKmFa2NKb9N12eyQc2CjhG6r0HtgbhUPQeWepazepTt50cEBiiwgFk39Qe+KEDjhds2DIKAjaKIRv1UAm8MLDBNvSANculiUXGmGkvLLgm7smVDQ6YbOdZGG2rbtbEjWntMY0pozZZw+ozGyLYuKUkbY/RI65slQSrlnA6SstyARtsttQDRuBmEtROsT1LzgYOFXCiu0iQ4KAqM1Geoev1PSO2Hz+DxsYYCAZcqXIl0IQgga5j0NqYN1L7c3DJN9tZm+G3pyT9GMStNT8FHKOJK+anXLBtyZBzrcwoYHRuEWCqBf6eJb/+QwOcyO6hpuTj7S+w7LY1ugQTlcErkOGtpf3Za0IgS1RIOUmRrRd0GGdDyMt8HbzT+WMLYyazJX4sgDFDZGiIwPjkRcgYHJLB6B1Y+8FHeLkiekezD7aMxtqpd+MBO14z38MDnODrwb3Aq7Ami5Go4BXJ8Hzn9dsUU1mNV5pq/p0qB8uglTEjs2Uwa7x+wCbw9Vsk4Kp7Qd5GthLEIvWOrP16IhktIXYJLAeOOfTUxJO3vrt9bv8Hm6etuEO/h1MV5ZVyUjx8yxe+9hWS5Uhpuh94edZkB1xtvHpMoFUbYTm+UWib2FgpofmUJgd77uqYcU8NeOTlYPW0rfoMly995mjRt2x/FHELLPc0VY31n7WJ1NHCj9QsDCCwlJ3msNGuPe1+b/v07vPHeo9yDoNP+VD56mfuvw+5LbpBqFseu/TkSupndXsIpRk/8HLo7gdcbTwrW1rICBsbMAppE9tfe1eb2Fy51F8cM/JqeJcQzFfElvyQrIkeM9dTA0nGrJIBu2tKyWxmOjD2GKgg28tsnFcwA3V08LWazbe+atsrVfpE4gq7/mXysvvcdrn7/DErwal/N62KM6MBx2xZBA4NccFr9mlNmTlYo69MbK7+OPq6G9bo7YXFy1Wfc2QbrF+3PgAb0laRbh+2jGh2ZAnErQ1gyYCL2Sfvo3zGUNtpMHFdkK10NyatI7fUpa29CzbWdUAMOCBxhV3/UDzZfW67WAvgeC2L8WdtRAcx2J2a9vrKxOaKsGQVDBrj8G7rVceP3NBHMjHWOfxMuflWnuV73T5smcp814YEw2WAGJ4rZp8rYOMHXDpTbBlz6v2ZEeu3y9283rOftQnqdvPj05wQIqX+VcLRB/C1AI4XbNiF+ALSHGRuzEMMZ8x4XjkBYzkIS1bBAGF3B5+RShUOUGpj3ijtz2s8a6MGBZsxj7F9++wWSwqWyzOzKNgPcFpQ9EBM8Stvr5bJPtiskSEwOUnskAyyA44HNmzWAAhICmBNmr56uA0DhKGiJDJX9BCqx5LZW19XjBjYu1CdxGB6VI0ZyWzY4OCTl0VmQ9tqsntMHzPHHWFGwI32pY7Z8eAQHUty2JNX7pv9XgFabK5cJpKTxKYqBlkB5+Qnrv6wMt6iYB04nYG0diwFMIvhyEHW2XysTaOsnih29i6euPfb5h1xSLlHnafP7uayVZ3EYnrKnCPbYLODTXRX1nrP2kjlLsye+KzphgEbgGSwFR0GbJiY6ndj8nrystBsgDP5+Z1vb3/grfe+/VTBrOd6JfVlBNNN+QcykBZtlABmCUgNsgAwwpfdIUFx3Dzdkh8816GsKbWpqcw58rAwkH02y6FZPqAzbczBmr0WFLwgpujHCzbz7+TnG0kyujbq6EnTUTDJaPXk7odxcvVKfoqeEP3nAZyT02Lrrp1q847d2sKWAhGtSIQ1RTsIUwcdCrQWMKK1diBwyZt5iHE0AUJhZDnO2kS2wfrs7iCzIzu+AJ3RWbgxpuRLHtig9rli98A9XizRzHH9EWD7kTo6EBMHCD1gdKsl3NhAxUSyK5/ElZevfff45v4PNu9Ztp3lP3Nt0XPAKQ4ApzsWrUjAOHQGnuMRNSClRpwOCFwSW/SDTVddnCFjY4tjGlfOo/tg7fyA/arZZ1kS4zscXkZFZKlm9LVPBXdjAvYqBTGLZLB6R7MFtNSN6EjN6rpe6OzfUnIF9DSilGo/9jatJufe+upNf7soqs+vBXBYRSJgE8/GtICIzhUCGzd9rhPHy8hYQ4pFAqM6fo5au8XIWJsC2F0tMjbDRTZg6TGNjIEFw9VsJK4bE7AnjWgaHX6s3nsZg/EKJq0j11d1P61jit3lSMkVAhuxrdwr0TXk6C8+98CFqioeyg44rCIjA/iKswWzu+i5+uUe3YiRwHjdgU2iLs7aFOJwDSNly4iIzpgxvX0LZqwV+x/M8EbYlP2MMdwc0weF9LPTrN5745rZLdc5B/gSlX2skgL76W0mw8Vsn1t/L8MDzwQhl3fOxh1ZUuMX4rOmaAcZM5678Q4bnscURrc/O8FBHf8n/ayNt2fHZKORzRFYEBth+055UgEHL0tWwdbbV2R0NJOrd1SBAYRBPRkNCEyGi4INu36UaHf1tQbA0YzZZozamE2Ker2etUHKPaOMGNi7UMe39KWM6QUdxjkwh9PKlL7OeFvNetZmNYjBZAgDr+6nBKJ5ozw14BzoZQCBBRtmG8En7prdo2Cz7KeZAWdP2mfwrphggg2QplN10N54bvcIvkmMBMXRRuy9a5OhfqvM2SsnMfrHHE5zOl9nPNika/b8WCu2P8CYFTKgBhuvbh9JMpC1N+VTxp7atTslJPaqrl55Kqi1Gij5yXvBvl8N22s2wNl43/7ljV9688JNd3/rmbKcNT5gPw5jHMfGAh0OSqnBt8P9wDUPiKNKCfbrovL49qamNud0tsQFXczharuk7QrQmTbmcCCjx0ICrkIGsoFNhqfGgbnScvX1rtl8PdfgBgRkX5EF2wUwWh1paT/NBjiTU8WZm8/87qM02KQDo56JJNJ01eGa0px1UysKEL6RaewbZ0z6+NE18Uauif0QITjYd3k1MmJZvh90hOcLjKcG1PZfO4hpgdFfO0cKmjkal8bSekdtP17v/NrbubrVEm7snHvBztimvvIATlleqYrq7NB7OKk8xzNk1jh8o9McDkmpmS6vvCzEbWbQU+oMtXYLwFj9Aw5XmwhLOhCCQI9ptT+TB097mU30UwMuA+czRa9SwOq9G8CtZzYidTT/Tg4QluNg5J418syGLFfnnKE37nUBOJ4Ts8aBgI2eSnpBHDc8PyjiY60YsB8cZCfJUWu3xmT172/kN9LiSAdWoiPHzHjWJvqpAe/pCi/YDJHN6KfG0ZIPU5724tNosHEeUZsdmDx59zeeRKpFiO2z/uTH0/knkHEPHXA8J1baKr1SwnUBNu6NBBpbBEoUjf1IpYp1gw1amkSdYhH0eDCPzka95ggmKK4QjsEuKn7NzbhuC7DQcOKVZNX1RzYdefFJ2f/rZaF2HKC2EbwqUQMKSkODPzZGtA4dcGxDxhYxyJyu03dt2pKcs4mvsEWM3R2wEaFUcxhnbRhy4DvFIrNhxq115raUc8F8/WdtRhCY4Dd9fB/gZNkL4OZc+XG9a2VG7a85d88xtylgtq/F08gM71ABx+twYoNCG3CjT1L75SmYiSCGgaSmQyCLBUYs9cVBPBeAccEBket8pty4bXA0W8r5Mdd91kYNjH6Jhl97jizZ15MwTwdoGUBYyUAdsGEqO5jt8+vHCCw+7myeb313+9z+DzZnLwiYP9xNA0DTgJdOy2AznKJK5SNM4LFnbdgSEpGe1x9lDHmZOaZO0ysAGcnwfQbWroS2A8CZ+THX/K6NGhj9tePBZuFL1h4oPx42Lp/deUCr+pGf3c1JEVpOxGx/hFydq4DQON3Y0u73tk/vPn9s+QWBFfAJBZysDCf4rI1XSkENL7thuFfDc4aMAxnuHN0xo54aAGrs7deyZUo/4Irtz2s+a5OrZo8GmxYU7EoBDdwg2NC3H/t612weBRtUrpjtjwAbZ38JbWboynP3ue1y9/ljXoJD3qVmZDhrBxthM7NnyE4pBWYi7h1mIw0DONiJGvIK2ES/2mqUKlhQ8Dazm7WwWZgfdPjSpNmJJ+yp+YFcC4wAOZLAIfr6IySAx+t9hJ+6pXlubL+Jhc/sQBDHtxCW1pznAbYE4HhdOUpAtIwOzT6G4NYPOLhxeFmSsq8AGsbBx/C5ZgcbgzXRwcHdzG5WwwVeX/d8thjZ9r1sr8OBR9S5ewCxgINNzpJs7fdAAEcJIQJeY/x0Pr52On8wPrlNLHz2jcYUpkS7vOa1AY6T/kmMyTY6LsjggXYebFBw9GrBY9oqfYfj5orLAF8/OiZLDgC5SmCbQ6ZeVs8ExRWwiW6QyfHUgNM5pq4/NIAD4IX6vAAQVPyDDnaKlR3P/hk/HSLaawOcXC/3DR9G0wJiNMtBmDJbQuqWUbyDeCqYOfOmnANjTRw5QOQ6/17eDvwyBTdmrqy+tdWVki83PzQLmX2OCTY9vSfL0rnmyo/r6F2y+VYG0Y+oAZfwKvt2SBaGkoMUKK4FcMzTxGNq19FnbVyWg9dEkaDIlpC6wQHZu1DAzDtro7TXegyfYY6IXGWwccsUkYGMHwvIFuXA6GeMHCnwyZu+/ujjFN7dYIrNY4DLlb0w2+f11AXG9LtOuL4sW8oOONaXjwm4w0aCC2Uw7bXLCXDt2ktLm4CIsoWhMop9cSi/ob1wkHSdmanddjOx9J1WnL4wh6u/mQ68fsAVxkwCGLfuFf2nLqMVyZsvV36+kSRjBWjTDJ/Xu/eujShTH3A5H/V1pGX0GDDi+vfmmRVwTn7i6g+roOeBAaOjjY0qJxCGF12WAda+FJM0lmMxPaWcYqfouBHX4/jZZyMDmBj0nM3u8uPHTAeycXYafPO5FyC0sqR536C8fq/Uy2YiHskYRYjdYwq4j/o6CgCbgE5UYJ5Xdv718cnen27dNkT4u39Hn8OZ/PzOt7c/8NZ7i7KYnSpdOuiDCxtkd3RAYII4Y3g3dEeaUWtXsjFDFnTQ8UF8rlG2jAg4ScFmdkYgG2enSdDV/MlfO0cKAGIgr9+ba7zeNZkimQ0D4hjR4vUEki3YTz39NL755ldPHS+q4r8IB5ytv/dmufnzuzMkWwEbpma/AgzRBzujmYi9oQcrEATalcxGkW2O8odZSiWyxdqB3b2VA7AhO3MgJwEf0UMcmAWunu3fIE8NWMRAXb+nJ4YQRgPCip+6mTgODtjBTr7U29qqM1cUxBFQbHT0xlfe8emqKh4KBZzZYFt3XSu27twJCYiWkbDGhgDY4jOEcbjAxbNvJIgpc8VlgK8fHZPVl1f26K6fycK8IDYfl2O51phqSbJZX+RTA3N/sh+nQ4NNT+8GMVDX7wezOB01OldI28JXA8/auIfF9Zji2QDjp54tdf0oy+Wdw4CjBa9aMMGlhGiWgwQvRoHLzNZ6SGqMk2TLbIx6cDwozIGBCRJ+EBPGdB6kY9a9wpqDnxrwMkbFVm1iwIFCn7wEBvDA7GOIoYc+iwBk9YqeWmB07khD7dWzpWXfXBPgcAFhOeCGn7UJNDw0eKEKxNbeM3epTOdtwKL3JKGZDQ0KQMaogi3CyOIATLf9lhhFnrVx32HiwSEHcanXHnRxZI7sAyMF7acoH8Wyel5PCzn8yr1VwNkof56rtr8GwBnncNGlBC+V5AOjXZpgx+sa8iGdtaE33u0sNDpb6EqIty2WkQ0x2ZVgkyx98PMDAJwKXsB4nY/w880JNunWf2Gega9qrurfCuDcVUBItWRMTInSFzDPQTvNDTiyczQMZ9XoeGPrOV2g4eUIXt2U9zDO2ihp+g311EBwU0faBkba6dFZm7NFVXxkAPDpmOIxcWW/qpctGC31TKMEEMTp8jFOOHB7ReaZkmk+wPmF3SvH/u7OuePgW9wYa8CFMlhjdcoJjOF5RjyahTjXV7Ab2tG1274hJ7M8KjiAXTn1VzO6aktTwa+sGifeqXUP2v5QNybZhYcGRcVWc5RkET1F610hWKhcmUYJJIgremrnGvQ0BDJPS6bZAGdmGLc8dumRspzFBu4nsagsTtzMjDE8QOjyXIGxZZbjbewy+xYIgLHBASkh1mBDBl5EptKYCVLArrsH3sENMsAeI22r3pjq+j09SToySAYDCCgpWHwO32Px1n0wJq0nkBTC5M3T+/z77HVnA5zZSdFbv3jpEQ5qZu2aw6eUVSOGWBNx1gIxDnWuyNgqy4mq3a6k6Kmgy4IC+NQAGyRQmTJNHV7782Rz48KJD379Jdb257Y6lC3qmb13KSV7Oj89x/lqWVBAswUvkOUEhJWx1950xO0DrczXaVdH7BWrPvh2+tpnH/h0URZn3rYT87YB6qaB2YIVwEmCDRm8VoKiWUohmIhraDkdbs4epCzEadmNHlMCBbeE6LMnPujwMvWAmwEuLDBoOq+BwWmtVYiR1zmmrN9nzpwMosdbzkDtW9rxuWJBnC8fM6QQvVXarz5g637lsw98elIUZ4rikAEnZSRs8MLKE82nMCEtWJjfkZbH4fjACDJHKU2PDLpYBsKv3w86wpgZgLunpzW2PyuZSI6SrJcxsSTLD+Kczy+TAjvwcmP7QVwnsH5lhyDafvUBjiPXD+AkSglKAMcAgjMOjy2yjtFnIR6QaddXeBu7WjnFupiRlOnRWZvaDKL3LH0Qx4MNRlw4vfds/yf1rI0fxN39kGUwxCs7uL785iguA7suACfLUwOBhuwLHVcgVkbpf0oqfTjlP6Zdsw065picDPygqGWhSClJe74gRQq4dYNlv2yXXCrEyMtolZJsoyej9R9mza19Bh55GNST8SwCQ978eMJn33hlB7dXxEfZTPnQAWe4tRQXyhDKOwqlDBkQOjXeMrs7rLM2aO0Wy8Q4fWHlrvqbadkCz+/SwTzy1muEhSpkwC+haEHMy5KVGynauQYF8BzjIXpqPsMQQiCeyHu1fmUH91N0nmwF6rVz/+hi8XrxUPXGxErQ6h6A8tXP3H9fOSnPVkX95ID7D7wutWFgwIWSBJt0kwAVbBChM8a2YsSZnorNsrGbZo88KACXEs5kxcoWYY5sMLfGZOeHsFB1z9IHcd6vvDHV9Xt+xY7rjcfqnAIboqHJm+f8e3k9LZPYxKudsJ/mmucsLu38H5sP7/2fx26vri49IrAUzMMBJ7pujTA8xpA9Z6sDImFsjBE3hseyB5/pacYc+US4vxc2Xz0rW8RJ2GCeq/05vbHN7634rLb+BBxs2vGSzyFo+lnM03ycLVzvrM45P8X1hdinoieUxKKxD4l7Cig2xG33/976yN7z28VaAScFNkwddDm78QTFBzBvIx83Ns6IdZaTo9ZuMnwScJEMRAFbzJk5fXmyVMhAYwfR9wN6II4Gm76dpu1fDeK+niJ1NPcjVU9ePGGCrr/uAxAn34lC4woT+/yLbQXy0mkO2nthq9xdJ+CkhD8q7XXYGGt4ngMzxoYaxeJzYhaSoWU3MuiiTsfKFhuXk6m3bnWTvM5Ao58a8K5rIklBM8dEWUYO4pEBvJ6jeyaO03nPT4F4gtqAP89xGaNf2cFB1497Ypm7s8Wx98JWsTbAyXHWZibwyN54n4VrhowZnji23V5Ml1MQI0Ydzh+r6+rc+nPINCvYDIIDt2aGwCiZiG3/Y+Ya967N3KZix0OzO54QeZWSeflYaeLxgRfXlx/3hDL3AClYG+DkqFu3wSzgbQcsrX1KogAAIABJREFUMOIKXCn5+RvlGYCBZyS+HDgZYBkIX0b0D/hpY6Yfu+PWvar/wb0LSee+jrRyUi6w9ZpYGPKCZGDseD2wiTxOATyixlZf8EwMt1fMR/FMqZnjEClYG+BE1619p8MF7o9Vi1APDoDhSXV2701ypZwSedbGLXu07kPLFjilTY9psGZ6LCQTUXSO2Spn+8CY8vqdNnV63OjxVvRktGozLeBAe/7ojrS0D+D6R8GGBfEUyVgL4ETXrX0HwQXup6Vzk1T3mBDDYzb10NRfTdOjgi6WgcyBnG0WgWRKbsBaZ23Y+UFgI5ABzFY52/d9idfPguGaD5NFt73TdoToqfkMQw6Q8hRbmlvJmNM3FcAgng1sjH3F7IAzLHzeKQjjgAVupX7d79ODt+1ws++Qxw56kxwsJ9DODHS71F/NOHIbHIHzS8gNuEhgVImGDQ58eQKzVd6vvH0wVj89mTpPA9A6ssYjCQYRT6hW7VxBHM3EUH15ej+g2fRlwd76swLOqV+7+my1aiQ0IPSE7TwkxLJRvzNDCw6e4BuFKm2bOTZ2rTHZoOvLdL56NrPLIVNrTJUM2ODAg0I7XvDVLV4WyuqHARtmk9zTuzpPILujuvK8eR7IZ1z8MxqEUDl4elfn6a+/vHztX23/cPrC1unw5wk2fm7v6e0Pv7lRlPWtBO2xUhSBl1NIhOHRgdFpKVXTXl/ws9VogSfHxm5k0MXKCfP1M2CbQ6aeLJn5DZU8VluLNZ0jmZ3iV153p7J+X0/ReufGI8gr5aP+ug9IVqZMjCFHwP4nvYXgZ0xz29/5nXe+r5pmeJ5g6+9cq7Z+aaeOLI2SUQROgo3zkFAka8oDCM3KtMDjBUh2Y89neJwzo07HyhYbl5NpDlnaJTpufrlKPt1sKX2PnzZXNOjcdPe3nkFeAo4ebxlsIt+1SXc3Lr51TPyzZYH7KbL/yZLBeRzB2tT/zYMPfCrLezhbd10rtu6sAefgBxfKEOB4ZSSGjQEBTEp7fQfJldloHXSRQReQaWsHDDDmkKnnvMz8VjKbwZKHFsB9QsBnin62NGauWNBBwIYJYuh4fRCPmStYnqIzehwccX1h1Qd8vC55SR8U7sembLdF9wGHXwTO8LixkQCmlCd8B6lXpAGZc7CT3beq5xrZ/pzpXRvQmSmZ2mNytoSBjaZzFGxYcIwkGT0fDTy/Uq89eLxcc0XKU2xGv2xX13X7s3fTxVIJcQ2Ak8WJJbaMgIKa9gIb5XSnlw8MfJdXM2a6nMDpCwHwA2VRwDD7N4Az0zI1xqTnh5Aimby4Z5g4PQEAJq/fYc70uNHjrejpBjprky6B4frHqg/4eG1m4xDNoViaGXB26ba65VQy8uS3Dwpa2Q9JVeXAY9RGVXCMDLpg+zMNDEitmW4SMV5ZVPVjkQJVP35mlyE4iJvZXjBj5eqMR9sRQgqazzBzRXx+bGZjfAcM4p5+VDLojZtqYsgGOBu37V3e/NAbF9ANwuU00s5GRIczz2/wYwKssV6WHHgynbVJbRYzDueXPRYapYHB7R7kzy9ZAULVj50tauQFyOzgYNMy0Qw3UiC2z8rVDWIiKEbP1ZunGsRRcET9FK0+oOOh9mQ1HWQDnKIszvz0Fy49qmzoOcGMdzh3jyEf2CgdH836w7uIjEAuBQfnAGYDtrHdg7NRuWDu7VswDSfLxGg4w9Psyde7durf6yBS1u8H3Ugd6aQNBRvURv111xaSLRNj/BSpPjDjLUppesNFNsCZvdjmvfg5lNW0BjIczGhFAgZCAxhixPO1aYHH68hjN4q9+TI9/N5YfZ3GBh1Fph7YKLJsHW8wA9V07th9/ZUsE3WI2zj7NE79s3bvM3HOjtBMobEnFHCBWCLrCcsecDn42wc8cYuwp+sOcCylsqWZmYCuPvvRi2VVfr57HqhrkJITuxnTSLBJOrMWzLygizocCzZMMMecmVu/t25mfquZzdC1Rdz8mMCoMVHraiVtrgg4sHL1MjB2PCx4cz7qr3v+rYqeuvONaObJtb8UQYSvK8CxAgTLwn001owDMzzRmQ/hETXGmTFQ4By51pPbkRU9pqafNjAM60nKlDEQx5mtM8eDX+vrjwaHrO3P4GFEr+zvN3E0Uuf11CUd1337czqrhW3/ugEc71wIw8KR8gS7D7BwZO9BJc2Zve4c5mp0jOFx88RAQQMG+8R3vRrYoAE90WMBmQhd6sV0xMsTADB5/U6Zhh43gjEvZ56tXAPP8SB7IWwZcSVjTnZQ4n4KEkJNT0EXp14/gJNkI7jAMXanOTGSMSmBEWH4StlvHnhS4MjJFGd4ocDQ+iS7fiswsmMBYEPfO4WVUDQ79YiLckgYIHA04K6/3Nlqkgq46F4IUylYAZt0Mw88VxBs6H1Ab1y2hHhdAE5aqVxgBNjduI1SuyuLdjqAjcs1Yet9FzZbAg5g1kthgznizKxB52x/HjoTppR6G717l2eyQczLQpU9UMSn2HE9UGTtEyEFzWcYG821F4LOF52rp/d27eQbTP64fAnx0AEnrVQBbPy9AJgxoEahGHJv7MALSbvlhMizNun27MVKIoGh6yBou6oXGMcAQzpb5B0O0ZGSKXtZqLp+hOFG6UghLYyfMjbqrfvge6V4siCag8+Oz8kbCA6e3hfy4W01er9uNpdDBZy0UnmwSQeFjsjL6oliZ+/iiXu//dJyWpv6M2J4qHGspNLGyXd9jyndmcTOE2N44iFMs612JinOQbwSDbsH6JMCzUZbYDSuV1HKXl5wUNbv2z6po0wHUD2y0QRwFBj9ddfWIVc06vkasmDIAVZ94G01VzPHoQGOoVSJNfjlGc45ECOeByV+XD/o8Abiz5ebJ+h09Pqxcbn1e2DDlqaWwWY1w+Pmx7BwtjxV6z1wg7xl3261gJOBx8SZILtC3NxjCrjtY/apPznfgI3V/oySA+T6J6WZIWczx6EAjoHuEmvwmTjnHB4D6aapSjDLESAjx0SdjjVmbFxOV5HrHgxkK5kINz8GbJSgmyM4eODA6n0mA2+/Cg2yKzoKBEbMPvmMfnnOYe3P/k0fNHnPvb927bmts/svbn6kemNiFplmFweUr37m/vvKSXm2KupXPN1/kLppIJX+o5tkjBMrzuE73DyzOQKbKXxXnr8BycvUa6VX9NMy/OizNkBgZINuLrD1wIGVq83ENT9a6Em/ZqUXR1z9NJ/Gs6WhALm+25/5kp8HNkqpd9mf9l7cOr37/HZZXW3f5RzEkTDAqRdVTM8VS6DF7i/4JSQ+gDUr9+uimpN4ClW6cyKDLgYKvFwxAA9tqaaZHUJiFELkl1B4eQK2L6/fKdPQ4+bIwNogFlhKXMtZm2T7Mx5P0CyMLc16vs+Ol/KnvRe2yt3nt4u1AI7VJECzO5+R0M5RO7K5ka8FhyboGM/QSqXEeeCJOWtjj9UjIbRcEWdmg/m6z9oohAgjMHiwcbKvVkmsLHvjGmUadtxcGRjgp5SN+vu/ut8DOoPnioKNsq9s+ahS6k2te++FrWItgHPDdKQ5Z23ULMQ6Tc86MsDwYCMGxuqhDTtXxJnZYG6xZnYsrKyil1Giy0keE1XX7wUzdtwc2XwOYPT3f7OCDXx2zdP7wo4FApPhGZRUFr4WwEkLixdOu5CBslxX6HTG5Ha68DVRhOGyjow4HQ0KwPszs+9l54o6M6MrjzUzY/WQNJktajba2mnQ65ILvdt7Fsr6EbBBW4pTgaYjazmbB8ambNRb98GcafKGkRjOn5AqgbKvnKvkmYr56wGcwbKP5si+kfDj+mPyp+i7mYP1rk10gJBAwT0Tw3fmIDJlHcQDG3YzuxcYcjw1EHT/FJaF8naPBHC2POMx8ai9gKHb35nSD2afut/Xsn3mY3dEtT9XVfVwUVS3L5OkUZlNhsuCvXXv/cn2ld3/7djkbV3dll5LUchNA8MllXzOwQYdxPDYII5kIWywTdVE+0rjSj/I2ufj5xiXs4GsYDOY4XHz64GX8Na75Xy1EzuHhFm7bwKDsa8odWKuay9gVV64jaJ2r/q9X9nAbQurEigNN+lbDtTY5IHNTJ5v/f7J/6d6ZfLJosgAOKd+7eqz1WpJQUpRASOhx/XYWFNGYsoJKDBIASKQkQDyPFgK7hwYY54DGLP+yE685UCVkANtS5jeefBuZZoszXGy7ANjTEsxmoEp2Xw0MDJ2r87XJgi4vtC50iV0u+FKt30go7v6Oyc3q6o8WxblPaEZzsbP7T29/eE3N4qyPrPTNF3L9dvoh9SwVl2cNeEMFze43pimkXBjIkDbZDYUMPj7YBLYGA0XsnMY4CjbqC9XTk8AgMvrj76dINdewFwGMcDo66fxOF5PK/4/SBDwcWGwAe9cQ4kGC14t2XDApokjr/3W/fciZznpktrW37lWbf3STk3pmknJizG7KLjNNz/dHWd0OUo/Xi2YAQXfgbX1g85MB0jrTJRqT1YgHzdmTGAEsyUdGO3Wf1pHOWwezZoY28+18Q6STViuKNiwpe4m80rtB6klRCY+oZcH8IBz17Vi684acOofeTFuBxWfhRzWWRulpdoGCJwxYQ7cqgt2jkVw9B6m4zdgLT2p9lTLM5Etjhoz8BAikNnob/A4/sQCbm6wMW4qp2wUac9nS71doHF0BpMDkLjRlYJ2fkZpVikhMmAzm8NaAIfpHgHZwsHHhIALABjDmrCUUm+pjnzXBtyAhM8GMCDGBnOvRKM4RwM2wyU6nrj0MpHAPRYv6OTyJ0lHAc8OLwduPzhy/gTaPQVgK2BjlLyZzrxcWVgOYsCCzZoAR3NkP60UwcZsAebHRBg+Y3ArgJsIZLFMdPGtUtBxLxHkbCCHczQrHC7RjdG71e3Ddw/ZGe3st5wse6Do2D4D4g4owow+CTbGXBl/8uNIPYNx8zX2LxhygGVhvE3l8icDHJPgnTnD2aW6kbrZgt2uGS30udHJJa8cj6gZG/ASKBydtUm0FmcDGzpTrMEmuDSHlOeUUpLZ/lwUD7/jw089UpYzEXA/HkBQARxqYuFLvcsrsm5/RkEczMJom8oGNmk7NcE7G+Bs3LZ3efNDb8C3CfeZvb0fwDAczOF0o8tR+vGMBDVidO1z2XPM2QsMzZhMedJbNzPWSsnjRjhrY5Z7NWD0ynMS2DgEa7K5ceHEB78OP3KYIwvD7FPfW27nnGzAwPWVa65eFjqGYCf21txMMRvgFGVx5qe/cOlRluXUwg+8tsZ3ON3ocgTIyDGRtccDQ+OKuMPVwJjpbIABunpG614cy4G3Tww4WeLkjR83B8EC9E9tkqMBnCVZGImZkzeUHOWcq9Hh6QJDKi+1GnmQRCAb4Mza2lLv4SQX46bAuCIXrMnOlpgUve/I8Sd1Iw84YueMOOfwA2MrITqYW/XgiHc4ls6D0aWJ7EE8w+a7sycg6Cje5jE/xf0+F8kaBJtBnRFzdeOdRt5qPzVa3xFgGIrRFtlA4+h1Azg+0uOK7Ka79h1EPBP1gy4/z4bhWfcuoYypWbv/po8ANi6zr7+dZk9WYFSdw9ITuwfWA5vgPRbP7tnmkEUA/5V7B275aH7N6yjwlouV4B0o01xdXiDZhEE8JzBGAAMOsPM4gpb5EcApy/JKVVRnw178XFmMH8hgRYIOR6W9PWPLVPqJeHa2C7TG+YU26LA1XMSZ2QCZwzkaAB9qPEGZGMvwmDJKqyfH7lVgjAaxyDLvENjcUGdtDJ2htp+r+oCQYRQYQICl4+j1ATjm1RX8hr7ncEpw8LMQntkDAJEBaOOzkGYdbID0ApniHAvCMVRKxZkYx/D4Dkc/6Ghz9Wyf1lEmgtUGR+P5BqaUCnZ50f60TDZTVQhGrlj1QbCpDFmo56NM5WU21u73N87u/+nW6f1XNpJvTGfNcLzec0aRPsLzZaQ+0qf3g1B2MxjI1nzWhi1T+TczcGm1ryetLNkF8NVSqj6mE8Tp8tRsnnbQ0ebqgQ1T+rCBWyMtOGsuqJsU/HWPn6+lMyZrxnxJINmBdy32qkTJvUXORpsS4v7Lk0/ufG+7nL6yMVREqP8uG+D4rIRjeb7hcULqOUiGVlBrvvFAO18N4xwACz0QESfXSNaEATg3PyYwKkTjhnlqwLL5G+ysDUuyVuzKaH9GM3E/3i18lG0tj3xqPgchbOa3//Jmufu9Y8XaAScaHPzx+BS1h/SpLKQqvpTj+QLUiGvj8PfAWmCgxoW6aLhgHtmJNwg2K4yMm18PbDLssXhtxUyJorVP86beefbJjuvtrbEBEWPNXKYM+LxEsjASw8kVnauUhRqHMNl92ixg05nf/subxdoBxxc+5yBAwJXKHojwmQCOOR2/duP6/o7vkONmApt1PzWgONxCT7HPOXulOXWu0eU5LwNVbB4jRriNAj4vkSyMxOQDm1BiIGSh0efhlrP5tQMOYihlWZ45/qFvwodGve4ppeyBgA1rHL7T4Q6HBcXmU9y4PiHgHK6ZxQ311EBgq65vS1kaTmZfS2+Se2Cj2Dxmq7iN+g0Xmt3fkGCT2GNhS/JNbLIIIdPE0dr8UmVo7YDjdWiwgopuOsiRhWClD9zh2vGcd4Lmn+PGRQiBFMiMg2iszruBIRUgR48Zefuzky2q+wvOngCd1WcFm0AA92KIYvcrYJMup8IgDvpSFmLAZqEeiLOkPWVL2QCnKorHd8vi4s8+dun7vSBu3iwsNAkY47Eb5DnBZjZ26Fkb95mFejWwc2AsdP4pyfiC3+Gws0XOjhAAU4OYF3Ty2CjX5WXLkictK8E78ME3rMuLI1lDYJNsfybKVF7lpfle2p+ydKQZHbjkq6IWcckGOGVRPj4pq4vvOgAcv0zDGQkyHovyvuPxAbybjaQuvGNr9/7a52BDp8BAxsRmDllZ8+D5Lc6OcLDRdO89jyzZqJMxKSAW3eUEkkzKRsEuL5pkLQNOihgytu9VXlqwIYN5HaOS5xY127fmytqSF5vWAjjeJOiyj7uhrQneViYfwBGno9mNu3YxC7FZ6MFSuMwhK9gMguMYvdvv2rDgXdtSYBkJy77n2QgLYpGP/BEATmXKfgzRSBaejeFyBYExWFea7Xst+owtITrKDjjH//HrE+dtm9lBH7hJwF+UJngvQIyqswdt7PlrPwAbkjVhDsLJNSvYRD814LQ/K7rP1f5s+xKnoznBSt+5xpIhCmwIG0XtXtHTypwHS7+4XNG5siTb0ZWU1UXaqFc6bkrSu89tf3fv+c17q6K8Zxnsmz9LBz+bktrxT/zbT1dF8dAMzoe+gEpT3fMmuGHgzIY/LImwUTpVddfeqotiuJiDcHKNbq0EApnkcAs92fVr9pxVLrD1ynNsB5k1T8YvV3zJzcLJbCHD44H4nHHbx3xpnoWG6orYV0JikzY/+1b+Zsxr/8NNG2U1ebgqitPhgLN1z5t/sPme3d8skoMThpfhcBtS8lJKFC0bMa6FYFJVp9TX0RtnyJiDcGN6c83Amql9gCGikb5RHLdPzJG1fSAv+9YChP3UAGuf7fpdYoTbE8aa5wFcna/tq8RcXZBdEMJQsCEyRcxG8TW34/l7vy0hfO237r+3nJRnwwFn42/tvbj9gWtlcdP09uHshluY0/EhM9wcbDT6ND22AcnK09yzOLAlbkwvMOZgzWPKKJElBZ9k8N19GCHiQSyHzSPZIguMWJcXb6O9jPkGbn9mqyS+jfKyRLoGuyQz223Rm+/dLbbef60oTw49a84tzHtIStnQzSH8ekwzE+PW3c7RbCXnU3SQOdIg7gVwlYWm5qs4XDaWl+EaHN9GeRCLJkO94B3YJJGDZK1kt2lfpbJmDBjjdcX6k1PRCPb3ubSXSWY+wHnfbrF15yDgUAtzNrQpw+g5R4arvGfjh5+1cevXCoh59VbBOTLJMw3gehklmuF7h+bUko9X8lQyxuiW2m5ZJexdG+iMGW/3y4CTbH8m9kQwYNSesY/UlQc2LGn3bHMu61Uf/avPffyOven0QlFUv76sj7boqDzAtpkAHKYE4i2KGQtMo6UNPcDpKJBFmO3Bd/Lj+vXWFVaSMoxc2UL3+4aDgh5sPMdjz0TZJIPPPjGZDjuzq6fgSx57c41818YlWXwZcSW7SRwDYEAc6+6M1hVv+15Fg91X9eJyAzZDe1U/+tzH79is9s8XVfHJNQAOzkq9RanlFIeN0gEccDo6C/PW3nwnbSg34FmbVdbMO1yrI6/sRTBbgGTI5MULEOxeSEtghkGBtk+8UsBlyqDdj5qvLYu4+LSQEW+vBpDR8cnLvhmAxYlwes1rBBxc8L7h4YaBptHKyXyEjbJZmB9s5t8qGcp694Jo51gJZCvzxW1oiD1ZtXZWnk4Ql8FmPq59S3VklxNrnxTYEB1Uvs8f8OayeqLY2bt44t5vv+RldMM2kGqWwW0LnatMDIYzPAloPZtnWv7B2GT6/ZoAh1BmYFslmkbXSa9oyN5ZBkahfrBZgA0zLuYguI4WQJsMjJJzOAA+DsCcB/QYeQJMT55r9O0E0faJkKympIJuaoOBjH48cMX/k/uMuO1jvlRHlMM/a+M0caD6Afy9+Yjr9+sAHNj5vPRPUWLPQa7jR9TqIAbsr7Ab0JiDCM5hzFUFbyuQs+VDP1tqPsFny94+ELsBi9iodhHrjXHWBn3PiQ2QWDaG2z4KjJKuDKJ9PWTfSGxC/J4CHKTDoFFy0zQwuWkKp8DRD0lhbIwPOHVgDL6xFduAxJ0DYOEH4uHG9EpJ6t6aCTZEaQZntfEsNFemrJR7o+2zH7zjSn43ylMDaPVh9jmFHFkdaSzQhndhAl2DqN9TgIN8uAs4m7+wc3nj1PT8idNPPbMcCFYCg7mhzQdFFGzYengDNmlWxs81RxYCsjE4+0TlyTpHO24SwDVC4AOuoCev6SDLc+PxAUyx+VZPwWdtjFZqmRD1wDHqrA1UfeD3Vu3KhmCjwccT0NiE+j2CIe1dasiHG2VPbq4ul+/ZvXDzZ37vmbKcgX76xzswqDpINNI3Kzg6a1Pfg7R0Nx7vHD5r1sfMoXtvMx91OqzUM/+UVE5JBkddnl5my5a7c2T0QxEm5atI+adHstyGm3nGzNpAWg68rqJtHgUbJj4jGCIBTlGWT2wU1YXmPZwU3Hj1cOVcRA5222V4w6ws2kBaifFZCMDG2EAWbcy9oBv91ICdidDytFnoPNAwTudndc0nIgPYuLMrkX6KBbJx8210NuSraPnHjyNdK+ZtIC2HyLHqOdI2j+mIn2c2wFl+gG0IcDwjljdfg/dXAKbDK9TtxpsbCisD6G4jsvSTdz9g6Hp83pD9bOkgY1DO2pg1bG2uORpkzI40Yd09uzcOYzJ7Flgg4+1+Ob5YmQOahYBzlQiHMXZ0LOFjCBiblGTg0ADHUyZjxKvGltrU1IKDx3SUuSL3L7HjomUK1OHqddu3dNPO0QeGwS6qcWM67c+TzY0LJz74dfgMR67MLrpBxmt/ZtcNgw3R0OH5fJvXiUcU/Dnj/o/OVcluo4mBedZGIBpAbKJBrNHNoQCOt6HNlnv88oyWVvoGHF1jX6yElQHmILjDNTOxAiMLiAjYsBndypjJWrtYnkozexkYvVcW2fKcB4oMwQB01H6EKk1hrPn6OGsDzlUqVUW3P0cTLKAcz+x/LScDf/XFf3jf9PubZ6d/XSbfw6mK4vJmWZwrEXRqWUpRPj4pq4tDeziRp1+XwSbR9SIjssccpQOD7gYkFxxzgY0VGFlARALZGEP2gm5sENc6x9pM2bh3jC1T5Cp3eqSQ3SAHWLO06Y7YFZOF+KXODikUsger4YglBl6zVex4ByVpshy/rJ/9vyzP7v3J1um9K1uDD3LWny+Lp6dFcT4EcLyT1KyQellIwpHVQOY5MzvXHMCQY0w/MHKAiAQFhi0P1uuNx+5osAHan5USVY49y8gbhft6ijtrgxwaZEBhWf9N6Tfx/DaViWLngvTKxnoajvhKBhpH2JjX1dXVZz96sXh98vndP9ou917aGlLj/O+iACe6lICWvNgspDHgo7M2se3PaQCPB7ADy9W6x5y7zBSn8xxaIUXpQM4HnOVKgfUKKgPg6L4iM+YK4Qg8a+OfC6oj4lH7cxouBn/T2Gr1enn77nPHiuyA46V/qsF5pRQlOMwZflzjgRds1OAIlCnoUqInT1VPaZnqwdHLQJW5ehm4NCaQMbGkyPAnitEPZovGPhiz/lx2vzrnYV9lQBwDxjnYMDJoqwWDGXjkWNFz60qZn+dKVePApqrXJ0V2wMkVxLKNG3hwzq+Fi4YCbO6xm/q55Fk7XYazNsYdXFLQzZGB+3sCIlsOvFEYqRSwG+QY2PDnQ1bAJuEHTIkWnGsw2PBrj/bPXLHJKqFnA5yiLM7c8tilR6KF1DrHDXDWxs6UWrXQwRE9a8PsMzjGR88xxXAWfz+ONUV3z+XKwNfZ/sww+sHMxujIY7oHwQBOZ994NoaDODhXDWysjjSy4SCHfyIVEraJpef3A+vPBjjTqjhz6teuPlsFbuZ2wSZyfwVgeJJzAJul9LhY6o873GLt6U1iNlOyGM7B78YBmHHvntI9523mq04XnTFFd0wCdl9/hAEyjDXrXX7+nHEig86Vze48n9JsNPYpECA2SZeQ9n1/dc7V65MrO394fLL/5xu3LROI9s9K08DGu/ceP/4P3tqqimr2lOhyC9yogBN5l5lvwJpzIMDAOLJdCx5Xb7WMT3EOT6ajAWyNZ20YZu9ndc0n8KCIZvTyXmXw/hLAmqX74QASQ2Uhfqlz8Y2KvVoNHayuTP8kM6U2jjhHM8b4ffsdxfRcUdSNRwc/5eVrf7b55P4fnLivKKpfDwWcrbuuVVt37tQEaWlgmtX3jC3Jbnkn9gLj7PeK4JE0nakxZwUb49oWdo5IUFDkiehJ2sz1gq3gzICuJLKVhWTZt0jQ3VgIa1Y6vBC7YvWftf056VN8jLKIq+JLSGzKo6ORc4nrAAAgAElEQVT52t+49M4/29gpzhVVMUtEhn+UDGfrrmvFAeD0BlXYQi/gJN5ll8sezl4QzUbM68EXSM+MixpJXPdMzRPo1k+fjY8YM/radSfYKs4MgI1UpkiX5vgA1g/egWdtgDdTWFBYjkaGH1AgjuyBzr+bt9f0HHldRZdQc8URgBC0+nn5P/n47ZvV/vm1AI7qxI4jyxmTnVbHGkg3rWSAAaszR8+VH68LNsP7a+PGTBzqo8ooTLBlCAGWgY3IlgdJli7P2p8i37UBSRZj9ytgkyaGlP8jpe4GbNj5rgtsJCCErusZaVMJO+gmGdBtNREZTo7yTM1BRlz0F3rWJpNCgZo4xe58Fj7O6IZLFfqYOS4PjQy2flanZbUeyVIz+nbcn9SzNsat1yopjNZVjs5eP47oPmqtfyjJePWz9z9SFOXnUxU16aaBfkmNT00R1jgKxALP2swFbpUn5uk5zZhynLXJ1E7esObVk9r8uruGaNTaKWbbs6egYMtkTLTujaxhdFk6qHN0HSUaKxtj/B+bq+inQdlXvdYM/gnsrdGktWf75Gu9rz34wMWqKh7KBDh6wPGQXil72AxPm6uvUH5cJPVXSpQGMI4zuuEa/rgxrfZnYUPfsycWFFoQCyxPeUFH0TlC3tjWX6zUyx9uXCmlGRvwqP+Dc519tWSvKZ9Sqi/RzSFQHBF8qZvZsyX0jICzS7N6rETBB3DA6URjG3pArOc29LgIG2PYHRIYM7BmKQNBMhEl6GY7axP8OJu3r4gG2cHAHfSIGpbRa8cJ+lnj4HtJVLXgsNqfJf8M7G5zynytmBVfAioQZszLAjgbt+1d3vzQGxduuvtbz5TlrDmH+4ncX0HARjlvAQEDyR6QMaVNQ6f9mbmVAAkKCrsD9BTcOTT/RhVsc2RM0QzXy5jq9ROPqNXjIaVeckwcIDmyeVjtzywxiOrAw3yo+ZS+1dHYweAT3k7MywI4s6ttfvoLlx6VwCZ4f8VDeyXgIMBAO3Kmbh8vMLLO4Rm1wu68Mee/54JNjmCLzVMtzaSyZX7d7TyB9m/m4lCoRDPizRTbVzk5/Fi0P5OEFbF51ZdWiObAXigS87IAzuxqm1u/eOkRLq+Zs6eoNyOQ4IAICGdfi0+yQRcBMCngBp9f6Qay4VZlnTV5wKjsseR47M/TVSyB4YLssq16d7kxZMNbdxPImDEJ36JK0wgwqoF3Xe3PSmyaA3Z8A9MK2CRuv0Z0f90ATtpIdKezNgxZUGDYAyJ4P3h31czLIEcAX4D4kFHzc8RkoI3rtT8zOsLmyZennOybCrIrwdtoumDJCwo2CikAZEvtB2Jzjc6YeRuNjk21LbnlTn6eKNigur8uACe6hmkHxrmxSQEnA3vwGQlfosnRXtnKNPipAYeVSUHXZri609m64m3KsntlX7GX1Qe1f2MBXJep56vMfiA2Vw1sDDsVbTT95pYWm7wGpnE6isrsDh1wsjld8F5QDvbgj1lQ7M5zXrX10w5kIw05zcrEtae6m/RA47NHXgYmwxVq9z0dRZ21yXSgeSgbG3pllKlCZG9/Tr29I+gq+rVWAGglUERsqizLM8c/9E1ov36moze/eeL89C830nepFeUTG2V1oYSuJTiYIbqHYwmKYTZ4OYEPDG3Zw7xhlR8XqTNL+wFGWq2M5xjdeENOyFXRf64yYo6MKZUtqbV7pzw3+zWtK6DLix6T8VWU6Wdvf050eSq6it46AMBG7sSsbcp614fsRpzZ0+4fbp/Z+9Ot25ftoPlzWZSPT8rqYjjgeAthumdW6oyB90/5ChXBxrlmI9aYtf0Fj+FkALD6Kxlm683x4PdyYMwBYpHX16PrZ0t0QJeXlIHm8FUAGFu7Yo8AWKUkFBB9HfExxAOD5juVONLXUUzprwHanf99+yN7f3wshTdFFsA5hANuUsDxwYZnjcCYGQIuv7/gOckYQ/aCOO3IN9BTA9EMFwk8LDHIlX2vgE2i2wndgG5KncOdrf2YFktieICI2gPBwKDNF6S96tb3g7YlumvffW673H1+3YCT3HznFekFxlkpgWV3QHlizpjI+i0CNkpDgxfAGQdGgwILCoCe5LM26Rdg9czO0VWwTel2P7dV48VWsuyB2OgYsmH7FicHBBjndscTrkiAMKo5EhFugHZo32vhv5wsl1OOyCMqV5/96MWyqi/sLHef2y7WCjjRG2YeOLCggDDGGmxYR860AZsNbIxL+WQAy3A5YeRZkxYUHV3F7i+NDwypwMOyegRslOCNkRiuWoDNdQ42rL2mAYIfyyIESmxq413wnvKKjoLeHluO92sFnHWXE1hQWLBw+/AU7cju64rRjqGN56frmsP5ctXGtfcZtDGRjIHdX7Q6MUc9NeCctWGyUKzLS5epQ+SojDEn2Bj6l7KRFMHWY5PVhRnh9+nxWaI1FO/XBjiRKWqXiabKKSwotGMCh6cYR/YCWJPysyzMGVdyDlsGI4ON0f6sBN0cnWN+qUIozVhdPmRJFmShGqvPcMZspUyT+A4mkGHAqAfeJEAIukrZqByb/Ouvxvm9czMJE/dS8X4tgJMDbOyAyweGXKkqctZGCrjB51cWWcjgAbLxhpxI0eP313RgzAFi629/5tfv2yg/5tCewNizNhh5q79ZslcLIA6zu83JDhtRU1niKhmIPb/W3bfpfld2wMlZThiuXWvO4afp/LjApqZkJNa4al24BdyBzqEcY9YcVHix1dvMV8DbWvuoDNTo8mHY4kpmE3SwMxfJGgKb1B2JjBx8YJx/s2KvFilm5mjbEh9DGll6rd/KmluSGby3WsuymJ4riuL0si3AgDP7h+7zoAejNwc/LbBRmK3DwqVSgh9stPTcB7Box+AbGZBAptaaPbkqZQWnnCKBtzdPZdPZDuR60IluEAFsVMoUVuwq4FwcQN7mYEM280QDRHTDAUIKlDV3wSbd5cnbqmej1757fHP/B5v3LANR8+f2HM7sL9x7cDqAc+qfvP7bwzcKa4G2BzYB/fv+eK0I+C4Xv9Ya7BhzUGSZmC+DHGNqc/VOkyvZkg82I0ozgTZaz9PunKOBAQGbMaQwMpADcz0wZd5eo8v9w5kIH7h931zEJ9Xv5zpKNkgF29RcBte++lMfLYpq1iI9+CMBzsa79x4/9g/e2CqLcnZnTtkdeRQaJwO5plBgAzJY6HNJSOz+EJ4aUBoZ/OAo6so5a8J2jvnz1IhRdABbBJ50YGCBAQngKoD7gZLTPzLX+Xdy49r658dqAXY1m6NjiC9DnQx3Y7FVolT0n9q36ermLx584FOz99LejoG3DSGOBDib/97Oi8f+/Z1JUVW9O3OUQAsIf4RCzfZnukQDAJiUieS6/TmdNWgO5wdHbdwcTw047E7LQDOcXarnGXg/HmKjY/zUyRopX80JNob+qTk68YmOIe147rk9zZd68zVuFGezpvS+TX+er3z2gU9PiuJMUQQCztZd14qtO3eWAIxPdxGwYdldO6bT/qwgvP/UgGYkOZ7cnskhOv23g6O6duvadW1ML4ir5cmEnqQAhgQGpVqA2CgbbHqsOR0oqeCLAKOa2Rj6p+boxadRG/lmm7pu9w4h0DJFovK0JsDRBZTjGndvA1JheH4HjSYDY9xxgWz40OC4MRO36o5qUw3syEKCuFKasQBsXNCxW1VZYMhlo11WnjwXR55j8YGx/lbJXlP+L5HMBMAqZAAkw9KaPXBUwZttklgD4GiBtnZi44S+qlA/TeczMf9mXU0GWdufB2rNarbosSYl6HrdLvL+Uoa9sMjzG9kCQ5oMHHylZqPd7CbVusv6qg+Mc7BR7DVlVxLJTMYnPoZgZEhbM2ZTKnhzr/96gDPb37nlsUuP1Bv/aJfaoqQ2zogtA5Y2id3uMX6+XrY0ioUl2D3rwL2SR0IGCrtDDFmZ6w111sYoJ7AZCCJPJQNDSJYK4F1WHnLWxgXG+TfGkhgNIIazMD6GYHrX1gyOrYG38PqvBzjNkRoBcHbpduJeYEzeE6UaR/wdRL4ja4zEY/fRgUxhd4ghK+N6tXsl0HgZWDwpGBF0chzCM99e0ufqs3JubMCf5mBzyGdt0iVUbr0IEWw+o6y51U+Oy2gH47O//jyA8wu7Vzb+7s65k3d/48mynJER7iedNfgLGvomL4jlYY0aI/HARmWikSepMUNWiUHcVfvYPKNJgWajdRAzL3nlx/XtXiujYIGSmy8KNkpDB7vP4EWr4fjErXf5O9ItxbNPar60IARWNy4/dmILAdpbygI4MxZa1+FUsIk+NBfc8YE4h8JIcrY/Dx/CHeck0d1zZvtvVXxJKaPOnM66FkQpJUYHsCYwpOep6cnZeJfKKIcNNgrhiix9JXwfCrYpIPPa/pU1d0ud6XdzeLtK7VejlYcsgNPU4TymsPz7HIfmnA1I2lAA1igd7JyXfdLPuY4yusFxeWNbLnmG32UXeC6g63CpFyGVkp+hJ9qWluWZmKc0rrfxjgaIZJAkWmGtOID40/zfa/aakIMm01z7n4bdj/J75/kKdmzzUbZpdf7U6aee8WL+dQM4WcDG3oCUGJ7frsmnqHUQC76+32Y4mvMuUvTU2Rht3KxlxGAQi7y+3pfniHKf8UCXkn33wNE4a8Nenur70wiwSfi/ArZZStIZOiYBm5LAO2qb47oAHCPgSExkzkLtJgHJ6IC3cljW0M418Pp+x+hkmTpylcbNCjbBZ3jW3f4s2ahn9yNKk7X+raMK7Fkb159Ggs3QzefXQcMBEJ8kX+r5fbpRhB47Mhk4dMCx3vtW+uwBZepdLhmedbUCrhJwPKPLMebsO5VxbziwSewtRncN1vIMDYyNVWjZdy+7SZR92fkCxwlmX0sHR9v/+fXn2K/zLmJV4x4U+1hSYBCYsizPHP/QNx9l9uoPH3BSBkwKxgu0ze+Vur2XLcn1ZUOZrAP3g8Jwdvf/t3c1P3Ic172qZ5crinQCgxQPAWxyZeSkwD75YlgUVkjkUw4ywBwCyTHsS+Iof0FEcSlZ/0BgRqcoCZRDECH0OR8Q9REHAXIyTQG5OLtSEsCKKMR2uJTE3ekyu2d7tnu66r16v3pvd0XMAgZkzkx19fv6va96ZbEmbByVpx/P+a/cVswZMCSi5QzDcZLRgVwlIhLpfnl9mj1V14lB073RuioEhB0tqSYW5J0ltk9ykRzrEGbWbfoydKSAo37fd8bAO6k3yisHKsi6Y0t4oZN7dzlGXGpsDvZJtD+jzgbZVqzvLcNgw4CiWEYz5B7dK5OeFbfs8vq0DzZIhKc8PPWQ63VQVJujo7PvyPSfBZtQv3j66//8liS6aXZxZICTbK8ryDHTBUg5MGQoB+TpfJban7mzIVLj2Hr31PRjwNBYeY4W6ZRZdKPbjUjfBimX+75HqhnhZejT/qNlxpF2YrD3p+yTJErIyTwggDBYl3a0xE0CVmBzZIBDdTwgBowzYkjKK6ddEw1/tQ1O+/7EXKcS71b/bAg9/RnmP9GRiKYSE+8OORlzo0hcO43wiZ7jhxnbPCMpWztHnzrDi9Ih0qYP8crEPhl2pGk6HJxTgNRtjjSlptnxwIf7s1BSKsDc7ZLNqqgRS3v38n32GWl11UBqPpaUprSnjPFpwH+iIw0BsdIDbotRwvz9Fa5bzpN7LIVoATbNmrRR7J6K6UACIMBjD6lUN7a3zhlM3X6M2KcBjxTP2nBg0+4VqNvM5fWtp9Y/+fe1q/XPJs+Gu1VMRRw0Sy118NMMbJTbXznlwOsWSe8e8sT6XnMEGMrWTEYMmOJZhekW6x5u+7MFPbHzO3lgIwcyfpo67nCk+I9kHyyOZ9Bgi/HewuHIAhuwbtPPwEx/euLZ3VtrPuwMLoKei54a4Bw+2MgVo0vNpU6mdyE/5DFTHWlgkZzymhGFy4gYIBCzAAWriImSU4Tv9D4xg8MZhxLeMx65OGrIa3/WpQOSfTA9nqAY1WboaPsViQzw6U6MP/3Iprsnae+nq3731pozBRyL4qtFLzuvHBjhSWEuKJInvTuDNaVC3Be2dDoBcwqs0hSH7BRh4M10pCHGdhDZEAVo6dw5Dhj3n4vRQfFaCLaJB0wjWUVMHF0lMpBRPoD4EwObpr4x/WDF7f7khKv/dzJKqXnvt4ILV85eu/6a6HqCfkqNeCH4RTgiSRWD95b1Q/6SaInzmvU9caxmxfBJ7C0PUz7JtmpIrg7ZKYLfnevERHl/4DnH6SpNI3NGsQMb5JCjNq9MmngsMxrMdRMSGeBGCyG2NAU2zb/bA068BRRWODonOjOM0qnCvHKAkY3BIUQObJBifk7EIBHiTuDMDrgRc+cQAzajqe4BP80RMHMFJkfBYDI6AHGig07Cfz5Fs+9u+fCqu7f30smNN7dH7i7xD6rTn5W7BjldkkQfiyTg6SqTAW7Aq/TsTk6kbAo4JgenmK4MiWJYRjaEEYM65/gUlUzYRsKsfDaEKhQXKR3V/gzWwkzkVGkEzEHkQbeTo45GH8y0OhI5r7l5JuIYtjoF3DKZwi5CRqEomYsSLQz4wbvJ9J9v5JCtlwM28gjne9/8bnPn9H1hOU95JE1K7XPP7PxPTICtjA3SXsh7DAU1BgPPKQ1iuHCklbj5BFuXroVhh/o45wCVK5OONKURMAOwUe7EHBgIxY5E3mueyZXUMZzzf1yAh8CBklFJwX3suH1jI7h60zl3cfgZpkvdGupnbQzmQnbRXdcg0DB6kQa7N9fe2bu1shGcf3yRdqMaDjeWoFtg8sW9N9Ye/3jignuivyjq1XDGBjeM1E14eGspdXCsxBPVvNuD95wxBTmqjjTYgFkM5Ex0JenuEXcIRmCjdOEh33SD7zkhV1BqnpVR9SYBTJf46FNOT758UOBkZ9xY++nfnp74UL0QRoDsHAw4q1/5NKw+dq+lRj/kQxTODGyY0eiol2PamRIxZOg+abpiCsIqMtjHb7Hu4XakgfQ0qgFmRE7iqCHDkJVFzBFQRAraFrJkoUu8Q9h+Q8SnHB4hNM2JbDpH+6M/enrDV/6KLuB8+VO3+lst4Oz/YQrXvYj2KV3OEytKzyRSHxbAgO6TAXGREM8Vw8g4si2rAIhpdzlZGRyiFgLxKC+ykUf2OYYMz0KkJ5/rNgdZ2Ch8Td7RFp61Ye5JmslGQaozM+V7+w+fftIYcEqJrjvokFMONO1HGUYbYMCEgxNkBBi59mfpLZBDw6jMf4OZcybRkkEnXkZkIzowyMlSqcNJOQbSbAl3bs9ARoucghw7lTtElFurAxsk3S+NGI0BpxBslK9d5gmPGXGLicpmXjMRiaDASBQ0oRz73DAq879ZV3sgp1m0lCjqoimPnEhUyv+Mphtx2od3NjCbQnXOIU7WALwjTQLFayqdtcnjEUpT+oqVGIAZAs6ueGjmKORXvHY5B2wQhCeMGJyzplOJmHAcKEg6YpB6je0+iTb1EuNo0UWU7EgD26lnTkGMnjiPKDlFo+8+2FAdRFL+czMHmxoDfC5Kuf05Mkn6IN2v3CQgBe6B3VO824g7IN89F5kALY1sumeZAM7k/N6Nla/dhS7o4cJ0xIjxKF9gIJIGt2BNg7RPBw5xxcP2SoICcAA3K+UDju1JKUiRcVA0ipzco/n1vjHTvGqCP8fRdB2BBzujOgXKqOI05ZFDrN3hqH6vDdmF274OIv8o2DTPowAnOHdjxbvNz1+7/nbbbZbbFt2c1Tnzg+uiu65zjY20UJj2Quf4DkdiVu3P2mmfuTFTHCLICZ3UW87hP2p0qRpL0T6VzoTQEW3zKWZsBwZS0THimm46Q4bpavSAK1QPofeJ09QijUpnSuQyYHUeiskUsXyiAMd590bt3NVzUsBJXU/QV4DYf1sYMZrwBUKX7vpgiU7RweweFqWzFjmeOJqaNOlII4Y8wvuMrwmnj2inCJfRAYgrORt8anpmHBEgT6wN0bXUMJI6qpxG7bIP6Sn1MhnIcQgQJ4ajaU769NgAjpmxSZ+ohYGBIDykHJxhQMLejIgBen/OKYCNeMahMekd6haeqKZRnPPIaCoF7RzIjBjvaJRlDFJyhaTlOFBE1qR5JaflKD2nZKe4d589V75fDbBpnnx8AEd7lhfddw4DAwWMRYKsOG49B2xyvJFFL8/CKeieoVlfOHh/5YGcCR4VdyQpRR8jfilG4XwdFDNkFJAhTRK8wcWir/k+R7ySG+8R2KQ70kR2in/39sliR5NbVyL/xwJwtK9d1iTQWIl1xrfnCR0uzOS5ILAry+ogosUQRe2BnCZNB4qAIAAb8VkbOuVXGNkku7LkwMCDYoE+JdKoZed3qLZiWdMFZ/M6LknAISeqlWZfjhxwtAvvHOGlBBoAg9L4dmuwoQwE+v5ELUzkhUUNo2L7e9oTxTpytD1wq+gzT6YwGvAF6BJDrtdWzt0VBKd7rSJb4qyNJLrjgXYmHVLdz7Gl0saQIwUcqnsIEQ6O8BIm5hvGAmUjvDvk/efGTBkYqSKkTRpR5t3lGVu5x0x7eNh67ZrpsxZF4M2sDV0JwBegC+Rfsa2cA0XkrAlFT6nxHshoxlkbSdNFznUQ0kYODmyk63Xvrw44/Ymfi0Y7zzDIc4ydYKQPtTXfKDAQBp1ORBQizrEuRmFa95pwIXUxgKfmzoFneA7PgcGNLBV9loA3rwNy+eeNDqar6SgUoysHikXgkOhIkwDC2HmlzsfIaMAB7ezZwjXZuWuy9frv//NXfvfJ+r2VK/Uv/cL1De2oZ3lbdA7gWHh4mvdF5AEjTvRW4VJ3poD1lbQSywVuHimRgic3YPN1mUGfiDJrd6SlT2kb8R0E2aGs6s2dywEbpPGEcGIgR4vfZ4GcKkZgfPZBrqcc0B43sGn2O/0/f2XvP1Yv7m2tLtyVYwQ41LgF1MOjTz3jBoJqfy4uFsauGgBP0XOpHyQ9Z9X+THn4Uk+MN7YY783AJnHRWUmkyBsyOQ241HRrGtEpAopnmHLABpH9ziEcZwrktBw5r8n2Z9na/Lu3TxaBOL+mbI8xxz3c9Rd3f7zm97ZXFwM/mwgnFYmgSkejfAGBqCGXpVGI9kgM5W4ny/Zn7Y5EIloUKVs/+kqkZqH1+GgR98D7YKObRqVHohTpakT2pZ1TtIM1t2MwvxI2BV6P36/MTvHAMKOBhK78mrI9prJE4U7ld2+ecIcCOOlIBFO6o/DCy/LBqTbIAmYaFKDTRUh8nxYpP2pNibJlgI1IeRddN+3aUqbXDBlIviYA6mpCThF9yonAEP5TwICux4ONMAphGw72wUaQLTkssGkC43CncocCOIfc/gwpW056AqkvWKS82jWJ0/moglDtz8VpxHiTAMwr7bMxVPSde/fICGyMOhEZQwZ1u/E1AczhoFKUUn3Km4Dsb0yBCdDa8pQBNmJHJqcjTRKB8mAjA8RUZNPd/kwCjvOv3r9/+sXPX7v+XvbwzljTgLaHx12mhBYzzbxwI6OjbSApg4MCGKd06LqUTEmNWJeWS6WlkPUOUml650w4Ze4+R2jKGx4MbGb816MBb3CxfWrLU+cQpm8rBs/FRO7eGTo5+REoz/OC6yVSZ5eICMc7/xeVDy/NAef2c08/GWq36Z1/fNGT6/7/IuBYgA3V/owo24FxsEl5mdQEiOm/iIGkhA9Je/A0lSscvyZobBQnKQ9AwaDLiQVwQSqFp+dcq/GJ6oo0yEn3IU0C2h2OXPah+VwShXA8P5C5fPnPABtx9JUjT1SEMwYc4j7qGOBYMJJqf7YxjPlMjIFwMgopbTxQnL/FgY30NPFc8D4L7c9WYBPtSCuTJd7w5Hu3OcZh9h18z/GaLbYen+4rSf3oRWAdXbljGhKnMAccJHzKWQ+1pVz2qf5o8va9f3vo0foX1ShoKQccxVCaTnvIPYaBJ2qU8kpeNQB4obyBKFDk5IgNuQHr09ViIKfmXUFUEwviKTM8gmtVuQAu3TNffMdkag6MSoMuswwk6MAloqYiXmke0+B5JHMKcteTAOLAliaHMM/Sc7/8u5M/mkwnm86FZxYd9CLAOfX7OyuR2yVhRnLtzzCB0oV3eK9phZsJB7xX5YkH1u3Pmq26lMOBpFEJeSrn+xjAoSL+olNEXQ8tBZtmbeaKaJgOCYCA1ssBm9a7R5sEIpkC9IwRrfcyYMiLlNpvZdM1u+Ei1NBtzTnzFj/4k0sXVsL0qgvuWTXAqX7z3ptrX/3kURfcE71FYaWzbH82S3kpXnjGpFKyBW6RwQ9E+zMQLZIpRNBTpnhUYsB4w4NFIUyKSl1XYaeAGHBZkvIzaRJgJnNInYKMNGJ2ncUcbBKHmhtA7Ddx/ey5S+u6gHOqdqtfvhdW1ndbSO8UBhE4xtAW5ZdJjxkwYlYpr3afFmdtjC79Iox5ATCmmzmk0SJXr4Lbnw3uM5rLlHKdiYka9MEG0Kfc1I/UiNM2BQNvCzuVE9nl1lkOBWwSRx4WO4atAMftA06rM7mEGXngTNEZEbYBMCQK71IjZgk2M2GOn/xGPedDTifNZACMHDS7HLlI+bjxnUnRQADOGbIimYpNEQBmxOUZyGa8jr/80Nf+8WXvG/HK+9OUJ17vZSmv+XoZhztzu9wyaQnJEpd5iR1PMQecXMLEwEY7Z80LSIGHQ0QhRQcmU0M+AUXmPDEUFJgozMDhkPOJAxvUebHoxOTlFDsfwYFNia7Gz5tg9UqmtgQ7sVSmANVRLhJDdIp//zy6ZoIN7gwCmRdjwMkjTMw3IYgOo7FVOE1FIYjAWUVhVukk6v3LmiR02lUtwcbijBXnGCBRCGsYUQcm2XQjdwra906mD/tWArMrqUxBmY6m584hmR2+bpNPV/6QLJ59ariR6hilDt5TgOO8u3z22vXvN2u3tRjy8px9efCzGo5bWd8rOiwW73DCPDs+VM1nYgwck1cNALlr3rvF9sqBDXrWpjMSkY7EohqbVrvqEYAN7DHyvMfb/zXPhfR1IL5ugYwmp9/20g8AAAk1SURBVCl3TwXXJjIFcN0uWQfF+MRFoKKzNsTeDviHAffcIRrziq3/UYBTB3f53CsA4Ey+NL0xeexjrLUu3e2goMhRb6Q8YjrmtSCu/RmtXRCCVwY2qTH+wjoQVxxH0yiEdwenD3PABo0WuSMFcDoxGo2AgMBe+tVSCNLV9PurG9zO7YaOPuz86Ldf8sH/ab/Zqg8OuXzKjRJz11t0slN6lRMp6gOO91uhqjfP/NkPX5MU87g0AhKe9gmV8piL564dWvszpshcugsVOqv0ZFKYhdEiBzZFfFceK8RH4G2SAcoYmEV4cacABwS2/RlrPDn8JoECPiXnpOWveWRgk6mfNoDjwpWz166/Fks/pf7NNOWj5DEPAEz5EGZrwA0aDyzun2GcA8jocAAmicK41ARSA5mDgnKLch9stJtkTMFG6XArx6uOPojD+ZkCG2LaR65TaA42xBUTuSn5YwE45imfRLsmnLs1ABsiEmHzoiSIK85cy0j74HtVGi/EGTC0E8sqfXhAU73roblsARotUevmpFNGqZmM9t/Zb+Spr8M9D4ZHoM0v06k0QWRDlCJ6dIedwbR9kvHmyAGHbt3LJ3jM6FIejsRjHkQ2BlFIy8xEkQ/1xi0UjonC4GuHKWHO9e54I4sZrhyQLakFUbxHgYFz4CQ0zYnqkeiDcLAWVFluA6j3R4CRk3u0tjSX2XgqLRscOCdrHiUKa6AD3itO/b79vae/71xbqxr8YU0DTQ1HkFKzGPBIGx+5AA+VLu6JooI832skEkG9cTI9WSB0rTf2zlPf8ZW77EK40KcLulfC4GYrXC7YaBvaFsJ8eNXd23vp5Mab2zGnh/s3Ig0iev/+cyyOFGg7b/xVA+0bQTRItj9n1hliPCNajPGonrgaPrfGmA02Je+u2Byy8y+/8+Luj088v/fu2nwKTUdvc8Axm9arlJ5ZFLzDbn9GojCuFoamETtg0L6kLNFBJFJiXulwJ4OrgyA8GkRNiTZg1IEhOtJENM2JbOAILC/9A3WlUjVLlFcUOKJ8ap23eFdaNp94ue+4KEt7LUY2EZ0HHYFvbARXb+7eXLu4e+vECNdHgPPz5y6t79X1i7HR0vNXy4xwqFZF1BPt9qB5NoA3DgXMVK4FcakUVOGoKAw1OlRUIokaeKWzA5sSObVwDKg0aq7HPHKylJ03nl8HRlI6AdrCplAt5WgqcS7741SaCdggctqWOir3B5UP3wrOrQ+yGWCW5ON/feo7oQ4v7N5cO58FOOQp0f0dxa6YHgmxsqG1QuQB2Czbn6847y4OzwhYGPN8AM8wXpAnxqfo8Pfm1kZTkxZp1HR9FXv/DH51VkTcAn4UHWmoA5fYqwHYgCnJ/ekRla+eCSFUA7ABU3MdcIf/90/s/mTN7W2t8hGOBuBYFbMJLzybkfHcrc2106nZU4g30qW7tE/7M8YRN+YKXnOO8ULTHeythaHaPPX1fxCfM+PABunG4tYs88J1RgtxexzqnRzMjgJsYD1NONu5spoj9x09c9fMS58238p3BlNrhjuV3715wu1tHwLgWIzZ56IQhOjcmkVpJIML3yxSCa2RAIbzxUB7IHwKs7e6fdU77tl6pxoVH9vnfVLd2Puvlb/e++81UTE/TKfrq+d3v139erjowsH1Gt071L+obuy9v/K2q/MnFHe/rc5ML0zO1U+4XXchtu9w12+5nZWtEGqOjIPPq9P1unu4beIY0+Ju9Z/1HS+iQbe4/1z9qD+50Bxiscfe2yA0iL1/dap2bs+/sTvjleiv45NfCxcaGfCna9eM7GpN7tRtTT9a/at7t9bebjpGYgvv1tPt37h2/b3Fz0hgzLhATgQ2wkikS6F5H77lnIvIUtoRaAKRiXdfjNFi5QufrE++sPft+7y42IBNveNd/cGKCztjUR3VcHIinP2HNtyZMcP7LefC++1/nq7X/YJiNIIR9jyrxL4KW2GyMmJis273UpMz04v+4XBwB4+Q6IuGMR6FYGFqt7bGhW99Bnfv7h8aGkhKMRqj6mt3ntPClfXdjUXD2whM+HCyVd+ZbLcTo4A/79yjYSbUB3+hlZfuf+SqDYODc5XzEQPb/fJgPWCH7cpxIAsueBc3NNyD2p/GQGH4Q4Sm8b32qcttLv55al2LPQ6lQbbf5D4RXs35lFjVO18HQvR9WjE6uWpXbkDMnwqOBNngt0M9s5/VI9MLk0emG371QHf7YNiRrNP93Zur7wdCz33lLrh9oGhsc/WwO9+m0Hrv3QBD2KkahUvq574+UjJ4oE+E5JQAzqK4dI+BBWP2vowdWjQSM8mpR7/sgWB0xeC3J+fvfSnm5cY83D7juE223tjJsN4wdc7MmRWqQ8ZLtoI6M7h9WkYNJKUYlK3u2ezxugfEZBlC0IIzkBwZl58vKfCgUSCpTx1ockDYJ0in+4xPNrQhR0xRTcA54leJwwq7qRi3Ih7uviCwy+1/YWlscym1/N6SAksKPMgUuBG8f8fVYd1Xvg51/ZePvPLDtzqn2jWpnCrUG965882XqspdvF+UZFMzDzLFlu+2pMCSAksKLCkgo0DbzRzqzR+c+8rfXOl+urnZZKTaSK9fF/FXr2765z68tRHC9Ip3/nHZo5bfXlJgSYElBZYUWFLAP3/2z//+5RgdRmmgpoZw+4+/+d3KueeXUc5SdJYUWFJgSYElBQQUuBFCuNql0BZ/F607hOD86793qXry7HQj+PDCMtoRkHv51SUFlhRYUgCgwCwdFd6vfi1ccE3l407VdrGNjLZ3F45tMODd5TPXrr/cpdCyAKf7Us7V0wBdi37SMUW8iPfbwblo+/VorabYleg/557rj7MwcJtffr6kwANAAdhGNO8usRP7tAp1vV0ljnb0yTmdTrfP3Z4kbdDrzrlLjz0WXn/33TYQaP47xo7m80uRDz58xDX199G5mbqernvvx+dpInau1H71O9KiYEnJVzNjbRrqjbppJiD+cgm+uATHgCixCUZwunKV+8L+5/NiV+b3+19LCYNkqZTg5KyRFK6cH3ffKQBcyWO0v1uqLNr76a9XZAQtN7a4NmBwLWxDsyZiH5rfdYYbJVuunejWv7K5mXWUIOX1o/uM/W7hWMXsK/f/sanPL34/Zudi9mvRHpEAVrl/oi7p/BWe3Cpe4QrmcgAAAABJRU5ErkJggg==";

var img$4 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATYAAAAMCAYAAADoKpHWAAAAAXNSR0IArs4c6QAAAjFJREFUaEPtm7Fu01AYhc+5TqiUIFVi6FCJ4jwDCyuPACKoS5Z2YYCNGTHBIyBZQBELggoJlRdgRuwsSHUFgg4MIJRCk/gepkooTS2HOr1x/GeMr3P+892bc23rNzHh82Xj5lUQa5OOHX0nISaxnDdmlsckdYBw+rP0lssdTB3xI5T+JN0M2ovAoDXJKx018DMEl2Vi90KyHUQ7hN8qaHK8yG+31uPhwD8EdCXPAIG2gGZAk22G1Q9lvS9gGEp8ki6B8DUJfUcMAnEJ7z+Q8XmQJbHVirDz7+ZyLNg+b3ZvU7gr4NI8FG01GAEjYATy72J0r9FoPlpNXnw/Gnc82Da6zwWs1/RqyFaQETACFSMgFAm2ze5rCNcr5s3KNQJGoKYELNhqOvFm2wgsMgELtkWeXfNmBGpKQOAWqQcXn2x/OvkZm92K1nR5mG0jUE0Cgl55F92PH7/8aMFWzTm0qo2AERgjUOlgE5ByFo2pYkqFaeys6woVFeOMm7sldFjDhu6FXmPCOzo+y0bZh+bSYHc1eXuQ0+5x4w7lLhcBIvqUbroueC+Xuv8IElF9uvIbMA8P3UHLMVRjZxHMizemyXaG0Zk2d2cZzkdg6Zp0PlaJgSmPDuVKeaOnjA1knjeESVdqJwbbfu/aiqKlVqF/E7P+Hw2n6oKPz630mSRTnVOoFhtkBAIQ2O/12r+jX6UFZsM32w0XlfN7JWwgp90QThv8eUHvnX8PDd6sPd35Oj71fwE3zdMN1O33QQAAAABJRU5ErkJggg==";

var img$3 = "data:image/png;base64,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";

var img$2 = "data:image/png;base64,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";

var img$1 = "data:image/png;base64,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";

var img = "data:image/png;base64,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";

const DEFAULT_ROUGH_CONFIG = {
    hachureGap: 16,
    fillWeight: 4,
    strokeWidth: 8,
    roughness: 1.6,
    bowing: 1,
};
var RoughTypeList = [
    {
        key: 'rough-line',
        elem: img$4,
        options: Object.assign({ stroke: '#E36255' }, DEFAULT_ROUGH_CONFIG)
    },
    {
        key: 'rough-rect',
        elem: img$5,
        options: Object.assign({ fill: '#F6C445', stroke: '#EC6A52' }, DEFAULT_ROUGH_CONFIG)
    },
    {
        key: 'rough-circle',
        elem: img$3,
        options: Object.assign({ fill: '#F6C445', stroke: '#EC6A52' }, DEFAULT_ROUGH_CONFIG)
    },
    {
        key: 'rough-ellipse',
        elem: img$2,
        options: Object.assign({ fill: '#F6C445', stroke: '#EC6A52' }, DEFAULT_ROUGH_CONFIG)
    },
    {
        key: 'rough-right-angle',
        elem: img$1,
        options: Object.assign({ fill: '#F6C445', stroke: '#EC6A52' }, DEFAULT_ROUGH_CONFIG)
    },
    {
        key: 'rough-diamond',
        elem: img,
        options: Object.assign({ fill: '#F6C445', stroke: '#EC6A52' }, DEFAULT_ROUGH_CONFIG)
    }
];

const drawLine = (options) => {
    const { points, canvas } = options, rest = __rest(options, ["points", "canvas"]);
    const line = new fabric$1.fabric.FLine(points || [0, 0, 300, 0], Object.assign({ strokeWidth: 4, stroke: '#000000', strokeLineJoin: 'round', strokeLineCap: 'round', borderColor: '#00000000', id: uuid() }, rest));
    canvas.viewportCenterObject(line);
    line.set({
        x1: line.left,
        y1: line.top,
        x2: line.left + 300,
        y2: line.top
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.requestRenderAll();
    return line;
};
const drawArrowLine = (options) => {
    const { points, canvas } = options, rest = __rest(options, ["points", "canvas"]);
    const arrow = new fabric$1.fabric.FArrow(points || [0, 0, 300, 0], Object.assign({ strokeWidth: 4, stroke: '#000000', fill: '#000000', strokeLineJoin: 'round', strokeLineCap: 'round', borderColor: '#00000000' }, rest));
    canvas.viewportCenterObject(arrow);
    arrow.set({
        x1: arrow.left,
        y1: arrow.top,
        x2: arrow.left + 300,
        y2: arrow.top
    });
    canvas.add(arrow);
    canvas.setActiveObject(arrow);
    canvas.requestRenderAll();
    return arrow;
};
const drawTriArrowLine = (options) => {
    const { points, canvas } = options, rest = __rest(options, ["points", "canvas"]);
    const arrow = new fabric$1.fabric.FTriArrow(points || [0, 0, 300, 0], Object.assign({ strokeWidth: 4, stroke: '#000000', fill: '#000000', strokeLineJoin: 'round', strokeLineCap: 'round', borderColor: '#00000000' }, rest));
    canvas.viewportCenterObject(arrow);
    arrow.set({
        x1: arrow.left,
        y1: arrow.top,
        x2: arrow.left + 300,
        y2: arrow.top
    });
    canvas.add(arrow);
    canvas.setActiveObject(arrow);
    canvas.requestRenderAll();
    return arrow;
};

function createRect(options) {
    const _a = options || {}, { canvas } = _a, rest = __rest(_a, ["canvas"]);
    const rect = new fabric$1.fabric.Rect(Object.assign({ id: uuid(), width: 200, height: 200 }, rest));
    canvas.viewportCenterObject(rect);
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.requestRenderAll();
    return rect;
}

function createShape(ShapeClass, options) {
    const _a = options || {}, { points, canvas } = _a, rest = __rest(_a, ["points", "canvas"]);
    let object;
    if (ShapeClass === fabric$1.fabric.Polygon) {
        object = new fabric$1.fabric.Polygon(points, Object.assign({ id: uuid() }, rest));
    }
    else {
        object = new ShapeClass(Object.assign({ id: uuid() }, rest));
    }
    canvas.viewportCenterObject(object);
    canvas.add(object);
    canvas.setActiveObject(object);
    canvas.requestRenderAll();
    return object;
}

const loadSvgFromString = async (string) => {
    return new Promise((resolve) => {
        fabric$1.fabric.loadSVGFromString(string, (objects, options) => {
            const svg = fabric$1.fabric.util.groupSVGElements(objects, options);
            resolve(svg);
        });
    });
};
const createPathFromSvg = async (options) => {
    const _a = options || {}, { svgString, canvas } = _a, rest = __rest(_a, ["svgString", "canvas"]);
    const svg = await loadSvgFromString(svgString);
    svg.set(Object.assign(Object.assign({}, rest), { id: uuid() }));
    canvas.viewportCenterObject(svg);
    canvas.add(svg);
    canvas.setActiveObject(svg);
    canvas.requestRenderAll();
    return svg;
};

function Center(props) {
    const { children, height = 46, style } = props, rest = __rest(props, ["children", "height", "style"]);
    return (jsxRuntime.jsx(antd.Flex, Object.assign({ justify: "center", align: "center" }, rest, { style: Object.assign({ height }, style) }, { children: children })));
}
const CenterV = (props) => {
    return (jsxRuntime.jsx(Center, Object.assign({ justify: "normal" }, props)));
};

function ShapePanel() {
    const { editor, roughSvg } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const addLine = (item) => {
        const { type, options = {} } = item;
        const canvas = editor.canvas;
        switch (type) {
            case 'f-line':
                drawLine(Object.assign(Object.assign({}, options), { canvas }));
                break;
            case 'f-arrow':
                drawArrowLine(Object.assign(Object.assign({}, options), { canvas }));
                break;
            case 'f-tri-arrow':
                drawTriArrowLine(Object.assign(Object.assign({}, options), { canvas }));
                break;
        }
    };
    const addShape = (item) => {
        const { key, elem, options } = item;
        const canvas = editor.canvas;
        switch (key) {
            case 'rect':
            case 'rect-r':
                createRect(Object.assign(Object.assign({}, options), { canvas }));
                break;
            case 'star':
            case 'heart':
                createPathFromSvg({ svgString: elem, canvas, sub_type: key, strokeWidth: 20 });
                break;
            default:
                createShape(item.shape, Object.assign(Object.assign({}, options), { canvas }));
                break;
        }
    };
    const addRough = (item) => {
        const { key, options } = item;
        const canvas = editor.canvas;
        let svg;
        switch (key) {
            case 'rough-line':
                svg = roughSvg.line(0, 0, 300, 0, options);
                break;
            case 'rough-rect':
                svg = roughSvg.rectangle(0, 0, 400, 400, options);
                break;
            case 'rough-circle':
                svg = roughSvg.circle(0, 0, 300, options);
                break;
            case 'rough-ellipse':
                svg = roughSvg.ellipse(0, 0, 300, 150, options);
                break;
            case 'rough-right-angle':
                svg = roughSvg.polygon([[0, 0], [0, 300], [300, 300]], options);
                break;
            case 'rough-diamond':
                svg = roughSvg.polygon([[0, 150], [150, 300], [300, 150], [150, 0]], options);
        }
        console.log(svg);
        const svgString = `<svg fill="none" xmlns="http://www.w3.org/2000/svg">${svg.innerHTML}</svg>`;
        createPathFromSvg({ svgString, canvas, sub_type: 'rough' });
    };
    return (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: [jsxRuntime.jsx(Title$1, { children: t('panel.material.line') }), jsxRuntime.jsx(antd.Flex, Object.assign({ gap: 10, wrap: "wrap", justify: "space-around" }, { children: LineTypeList.map(item => (jsxRuntime.jsx("div", Object.assign({ onClick: () => { addLine(item); }, className: "fabritor-panel-shape-item" }, { children: jsxRuntime.jsx("img", { src: `data:image/svg+xml,${encodeURIComponent(item.svg)}`, alt: "", style: { width: 48, height: 48 } }) }), item.key))) })), jsxRuntime.jsx(Title$1, { children: t('panel.material.shape') }), jsxRuntime.jsx(antd.Flex, Object.assign({ gap: 10, wrap: "wrap", justify: "space-around" }, { children: ShapeTypeList.map(item => (jsxRuntime.jsx("div", Object.assign({ onClick: () => { addShape(item); }, className: "fabritor-panel-shape-item" }, { children: jsxRuntime.jsx("img", { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`, style: { width: 64, height: 64 } }) }), item.key))) })), jsxRuntime.jsx(Title$1, { children: jsxRuntime.jsx("div", Object.assign({ style: { position: 'relative' } }, { children: jsxRuntime.jsx("span", { children: t('panel.material.hand_drawn') }) })) }), jsxRuntime.jsx(antd.Flex, Object.assign({ gap: 10, wrap: "wrap", justify: "space-around" }, { children: RoughTypeList.map(item => (jsxRuntime.jsx("div", Object.assign({ onClick: () => { addRough(item); }, className: "fabritor-panel-shape-item" }, { children: jsxRuntime.jsx(Center, Object.assign({ style: { width: 64, height: 64 } }, { children: jsxRuntime.jsx("img", { src: item.elem, style: { width: 64 } }) })) }), item.key))) }))] })));
}

const ROTATE_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1699434105329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6530" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M508.018 995.557c-269.887 0-488.675-218.785-488.675-488.675S238.13 18.206 508.018 18.206s488.676 218.787 488.676 488.676c0 269.89-218.788 488.675-488.676 488.675z m0-885.723c-219.283 0-397.048 177.763-397.048 397.048 0 219.284 177.765 397.05 397.048 397.05 219.285 0 397.049-177.766 397.049-397.05 0-219.285-177.764-397.048-397.049-397.048z m206.72 336.247h-87.822c-11.193 0-20.267-9.074-20.267-20.267s9.074-20.267 20.267-20.267h34.905c-31.736-44.89-83.812-74.31-142.994-74.31-97.007 0-175.645 78.638-175.645 175.643 0 11.194-9.074 20.267-20.267 20.267-11.192 0-20.266-9.073-20.266-20.267 0-119.391 96.786-216.177 216.178-216.177 72.505 0 136.49 35.795 175.644 90.603v-36.56c0-11.192 9.073-20.265 20.267-20.265s20.266 9.073 20.266 20.266v81.066c0 11.194-9.073 20.268-20.266 20.268z m-391.822 121.6h87.822c11.193 0 20.266 9.073 20.266 20.266 0 11.193-9.073 20.267-20.266 20.267h-35.18c31.76 44.942 84.035 74.31 143.269 74.31 97.005 0 175.644-78.638 175.644-175.644 0-11.193 9.073-20.266 20.267-20.266s20.266 9.073 20.266 20.266c0 119.392-96.786 216.179-216.177 216.179-72.597 0-136.54-35.95-175.645-90.892v36.847c0 11.193-9.074 20.267-20.267 20.267-11.192 0-20.267-9.074-20.267-20.267v-81.067c0-11.193 9.075-20.266 20.268-20.266z" fill="#515151" p-id="6531"></path></svg>')}`;
const ROTATE_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1699434105329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6530" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M508.018 995.557c-269.887 0-488.675-218.785-488.675-488.675S238.13 18.206 508.018 18.206s488.676 218.787 488.676 488.676c0 269.89-218.788 488.675-488.676 488.675z m0-885.723c-219.283 0-397.048 177.763-397.048 397.048 0 219.284 177.765 397.05 397.048 397.05 219.285 0 397.049-177.766 397.049-397.05 0-219.285-177.764-397.048-397.049-397.048z m206.72 336.247h-87.822c-11.193 0-20.267-9.074-20.267-20.267s9.074-20.267 20.267-20.267h34.905c-31.736-44.89-83.812-74.31-142.994-74.31-97.007 0-175.645 78.638-175.645 175.643 0 11.194-9.074 20.267-20.267 20.267-11.192 0-20.266-9.073-20.266-20.267 0-119.391 96.786-216.177 216.178-216.177 72.505 0 136.49 35.795 175.644 90.603v-36.56c0-11.192 9.073-20.265 20.267-20.265s20.266 9.073 20.266 20.266v81.066c0 11.194-9.073 20.268-20.266 20.268z m-391.822 121.6h87.822c11.193 0 20.266 9.073 20.266 20.266 0 11.193-9.073 20.267-20.266 20.267h-35.18c31.76 44.942 84.035 74.31 143.269 74.31 97.005 0 175.644-78.638 175.644-175.644 0-11.193 9.073-20.266 20.267-20.266s20.266 9.073 20.266 20.266c0 119.392-96.786 216.179-216.177 216.179-72.597 0-136.54-35.95-175.645-90.892v36.847c0 11.193-9.074 20.267-20.267 20.267-11.192 0-20.267-9.074-20.267-20.267v-81.067c0-11.193 9.075-20.266 20.268-20.266z" fill="#F50909" p-id="6531"></path></svg>')}`;
const ROTATE_CURSOR = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24' height='24'>
  <defs>
    <filter id='a' width='266.7%' height='156.2%' x='-75%' y='-21.9%' filterUnits='objectBoundingBox'>
      <feOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/>
      <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='1'/>
      <feColorMatrix in='shadowBlurOuter1' result='shadowMatrixOuter1' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/>
      <feMerge>
        <feMergeNode in='shadowMatrixOuter1'/>
        <feMergeNode in='SourceGraphic'/>
      </feMerge>
    </filter>
    <path id='b' d='M1.67 12.67a7.7 7.7 0 0 0 0-9.34L0 5V0h5L3.24 1.76a9.9 9.9 0 0 1 0 12.48L5 16H0v-5l1.67 1.67z'/>
  </defs>
  <g fill='none' fill-rule='evenodd'><path d='M0 24V0h24v24z'/>
    <g fill-rule='nonzero' filter='url(#a)' transform='rotate(90 5.25 14.75)'>
      <use fill='#000' fill-rule='evenodd' xlink:href='#b'/>
      <path stroke='#FFF' d='M1.6 11.9a7.21 7.21 0 0 0 0-7.8L-.5 6.2V-.5h6.7L3.9 1.8a10.4 10.4 0 0 1 0 12.4l2.3 2.3H-.5V9.8l2.1 2.1z'/>
    </g>
  </g>
</svg>`);
const COPY_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138272519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16833" width="32" height="32"><path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v512a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v85.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h426.666667z m-384 554.666667H341.333333a42.666667 42.666667 0 0 0-4.992 85.034667L341.333333 725.333333h85.333334a42.666667 42.666667 0 0 0 4.992-85.034666L426.666667 640z m384-469.333333H384v85.333333h256a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334h85.333334V170.666667z m-298.666667 298.666666H341.333333a42.666667 42.666667 0 1 0 0 85.333334h170.666667a42.666667 42.666667 0 1 0 0-85.333334z" p-id="16834" fill="#515151"></path></svg>')}`;
const COPY_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138272519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16833" width="32" height="32"><path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v512a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v85.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h426.666667z m-384 554.666667H341.333333a42.666667 42.666667 0 0 0-4.992 85.034667L341.333333 725.333333h85.333334a42.666667 42.666667 0 0 0 4.992-85.034666L426.666667 640z m384-469.333333H384v85.333333h256a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334h85.333334V170.666667z m-298.666667 298.666666H341.333333a42.666667 42.666667 0 1 0 0 85.333334h170.666667a42.666667 42.666667 0 1 0 0-85.333334z" p-id="16834" fill="#d81e06"></path></svg>')}`;
const DEL_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138440243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19137" width="32" height="32"><path d="M853.333333 192v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-640a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333H384V128a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667h192a21.333333 21.333333 0 0 1 21.333333 21.333333zM250.453333 859.306667a85.333333 85.333333 0 0 0 85.333334 79.36h353.28a85.333333 85.333333 0 0 0 85.333333-79.36L810.666667 341.333333H213.333333z" p-id="19138" fill="#515151"></path></svg>')}`;
const DEL_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138440243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19137" width="32" height="32"><path d="M853.333333 192v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-640a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333H384V128a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667h192a21.333333 21.333333 0 0 1 21.333333 21.333333zM250.453333 859.306667a85.333333 85.333333 0 0 0 85.333334 79.36h353.28a85.333333 85.333333 0 0 0 85.333333-79.36L810.666667 341.333333H213.333333z" p-id="19138" fill="#d81e06"></path></svg>')}`;
const DRAW_MODE_CURSOR = '<svg t="1701336130548" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="46063" width="16" height="16"><path d="M666.112 549.568l116.032-116.8-241.856-244.16-115.2 116.928-104.64 105.152-94.912 94.784A5667.84 5667.84 0 0 0 154.88 577.536c-19.456 19.456-30.784 31.744-36.48 36.992-10.304 10.048-19.584 21.12-27.52 32.96a198.272 198.272 0 0 0-17.088 33.088 208.64 208.64 0 0 0-17.088 42.88c-7.296 20.8-13.824 43.52-21.12 68.16-7.296 24.704-14.592 48.64-21.12 71.424a411.968 411.968 0 0 0-12.16 52.48 61.184 61.184 0 0 0 6.528 48.064 50.56 50.56 0 0 0 46.272 10.368c11.264-1.792 28.352-5.696 51.136-11.648a1664.32 1664.32 0 0 0 145.28-46.784c18.112-6.272 35.584-13.632 52.8-22.016 12.544-5.248 24.32-12.288 34.944-20.8 11.328-8.704 21.12-16.896 30.08-24.32a520.96 520.96 0 0 0 32.384-31.168l68.16-69.44c27.52-28.16 58.432-59.136 93.248-92.8l103.04-105.408z m232.064-232.384c5.632-6.08 12.928-12.992 21.12-20.8 8.128-7.808 17.856-16.896 27.52-27.328 8.96-9.472 16-20.48 21.12-32.448 4.16-10.752 6.336-22.208 6.528-33.728a202.24 202.24 0 0 0-3.2-32.448 119.872 119.872 0 0 0-8.96-27.328 272.512 272.512 0 0 0-50.304-74.56 255.04 255.04 0 0 0-60.096-49.92 205.952 205.952 0 0 0-30.784-11.648 141.568 141.568 0 0 0-35.712-5.888 112.768 112.768 0 0 0-38.08 5.248 115.52 115.52 0 0 0-38.08 20.096c-8.96 8.192-21.12 18.432-34.944 31.808-13.824 13.376-26.816 24.832-37.376 34.304l241.92 242.816c5.632-5.12 12.032-11.2 19.328-18.176z" fill="#2c2c2c" p-id="46064"></path></svg>';
const DRAG_ICON = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4941" width="22" height="22"><path d="M630.57970569 637.6867208l110.35938764 236.66748681c6.20083831 13.29490805 0.44014302 29.08827497-12.84181964 35.28911328l-96.26186588 44.88164187c-13.29490805 6.20083831-29.08827497 0.45308839-35.28911329-12.84181965l-112.87079191-242.05276602-138.77450271 138.77450272c-10.36925155 10.36925155-27.17235831 10.36925155-37.54160987 0.01294537a26.56392533 26.56392533 0 0 1-7.78017501-18.78375032V147.18616969c0-14.66711861 11.88386133-26.55097995 26.55097995-26.55097996 6.60214518 0 12.97127348 2.45962272 17.86462814 6.89988899l494.18998519 449.26950715c10.84823072 9.86438163 11.65084445 26.65454302 1.78646281 37.50277374a26.56004172 26.56004172 0 0 1-17.6057205 8.6086795L630.57970569 637.6867208z" p-id="4942" fill="#2c2c2c"></path></svg>';

var BrushList = [
    {
        key: 'p-1',
        svg: '<svg t="1701335273782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="44143" width="32" height="32"><path d="M910.607 339.457c31.267-31.267 31.267-81.96 0-113.227l-113.21-113.193c-31.266-31.267-81.959-31.267-113.208 0l-28.315 28.298 226.436 226.42 28.297-28.298z m6.696 561.183H349.441L854.01 396.054l-226.434-226.42L89.81 707.4l0.231 0.231h-0.099v208.261c-0.051 0.537-0.082 1.082-0.082 1.634s0.031 1.096 0.082 1.635v14.491h11.778c1.587 0.494 3.275 0.76 5.026 0.76h810.557c9.317 0 16.887-7.552 16.887-16.886-0.001-9.335-7.57-16.886-16.887-16.886z" fill="#1296db" p-id="44144"></path></svg>',
        title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.paint.pencil" }),
        options: {
            color: '#1296db',
            width: 4,
            strokeLineCap: 'round',
        }
    },
    {
        key: 'p-2',
        svg: '<svg t="1701335152027" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="39748" width="32" height="32"><path d="M1002.644 893.774H142.004c-11.782 0-21.312 9.562-21.312 21.344v42.656c0 11.782 9.532 21.344 21.312 21.344h860.64c11.782 0 21.342-9.562 21.342-21.344v-42.656c0-11.782-9.56-21.344-21.342-21.344z" fill="#FF0000" p-id="39749"></path><path d="M368.282 731.496l-90.5-90.496c-8.344-8.344-21.842-8.344-30.156 0L6.256 882.34a21.42 21.42 0 0 0-5.968 18.528 21.298 21.298 0 0 0 11.532 15.656l120.654 60.344a21.552 21.552 0 0 0 9.532 2.25c5.532 0 11-2.156 15.094-6.25l211.184-211.184c4-4 6.25-9.438 6.25-15.094s-2.252-11.094-6.252-15.094z" fill="#FF0000" p-id="39750"></path><path d="M459.874 702.434l-150.84-150.84c-8.312-8.344-21.844-8.344-30.156 0l-181.028 180.996c-4 4-6.25 9.438-6.25 15.094s2.25 11.094 6.25 15.094l150.84 150.84a21.356 21.356 0 0 0 30.186 0l180.998-181.028c4-4 6.25-9.438 6.25-15.094s-2.25-11.062-6.25-15.062z" fill="#FF0000" p-id="39751"></path><path d="M947.866 184.288l-120.688-120.684c-12.094-12.062-28.156-18.718-45.25-18.718s-33.154 6.656-45.248 18.718L173.286 627a21.332 21.332 0 0 0 0 30.188l180.996 180.996c4 4 9.438 6.25 15.094 6.25s11.094-2.25 15.094-6.25l563.396-563.398c12.092-12.062 18.748-28.156 18.748-45.248 0-17.094-6.656-33.158-18.748-45.25z" fill="#FF0000" p-id="39752"></path><path d="M947.866 274.786c12.092-12.062 18.748-28.156 18.748-45.248 0-17.094-6.656-33.156-18.748-45.25l-120.688-120.684 90.5 90.53c12.094 12.062 18.75 28.156 18.75 45.25s-6.656 33.156-18.75 45.25L354.282 808.028c-4 4-9.406 6.25-15.062 6.25a21.36 21.36 0 0 1-15.094-6.25l30.156 30.156c4 4 9.438 6.25 15.094 6.25s11.094-2.25 15.094-6.25l563.396-563.398z" fill="#FF0000" opacity=".2" p-id="39753"></path></svg>',
        title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.paint.marker_pen" }),
        options: {
            color: '#FF0000',
            width: 36,
            strokeLineCap: 'square',
        }
    }
];

function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}

function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;

    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;

    try {
        for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally {
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally {
            if (_d) throw _e;
        }
    }

    return _arr;
}

function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
}

function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);

    var n = Object.prototype.toString.call(o).slice(8, -1);

    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}

function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}

var RPX_REG = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;

var __rpx_coefficient__;

var __viewport_width__; // convertUnit method targetPlatform


var targetPlatform = universalEnv.isWeb ? 'web' : universalEnv.isWeex ? 'weex' : universalEnv.isNode ? 'node' : ''; // Init toFixed method

var unitPrecision = 4;

var toFixed = function toFixed(number, precision) {
  var multiplier = Math.pow(10, precision + 1);
  var wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
}; // Dedault decimal px transformer.


var decimalPixelTransformer = function decimalPixelTransformer(rpx, $1) {
  return $1 ? parseFloat(rpx) * getRpx() + 'px' : rpx;
}; // Default decimal vw transformer.


var decimalVWTransformer = function decimalVWTransformer(rpx, $1) {
  return $1 ? toFixed(parseFloat(rpx) / (getViewportWidth() / 100), unitPrecision) + 'vw' : rpx;
}; // Default 1 rpx to 1 px


if (getRpx() === undefined) {
  setRpx(1);
} // Viewport width, default to 750.


if (getViewportWidth() === undefined) {
  setViewportWidth(750);
}

var CustomMap = /*#__PURE__*/function () {
  function CustomMap() {
    this.__store = {};
  }

  var _proto = CustomMap.prototype;

  _proto.set = function set(key, value) {
    this.__store[key + "_" + typeof key] = value;
  };

  _proto.get = function get(key) {
    return this.__store[key + "_" + typeof key];
  };

  _proto.has = function has(key) {
    return Object.prototype.hasOwnProperty.call(this.__store, key + "_" + typeof key);
  };

  return CustomMap;
}();
/**
 * Is string contains rpx
 * note: rpx is an alias to rpx
 * @param {String} str
 * @returns {Boolean}
 */


function isRpx(str) {
  return typeof str === 'string' && RPX_REG.test(str);
}
/**
 * Calculate rpx
 * @param {String} str
 * @returns {String}
 */

function calcRpx(str) {
  if (targetPlatform === 'web' || targetPlatform === 'node') {
    // In Web convert rpx to 'vw', same as driver-dom and driver-universal.
    // In Node is same as web for SSR.
    // '375rpx' => '50vw'
    return str.replace(RPX_REG, decimalVWTransformer);
  } else if (targetPlatform === 'weex') {
    // In Weex convert rpx to 'px'.
    // '375rpx' => 375 * px
    return str.replace(RPX_REG, decimalPixelTransformer);
  } else {
    // Other platform return original value, like Mini-App and WX Mini-Program ...
    // '375rpx' => '375rpx'
    return str;
  }
}
function getRpx() {
  return __rpx_coefficient__;
}
function setRpx(rpx) {
  __rpx_coefficient__ = rpx;
}
function getViewportWidth() {
  return __viewport_width__;
}
function setViewportWidth(viewport) {
  __viewport_width__ = viewport;
}
/**
 * Create a cached version of a pure function.
 * Use the first params as cache key.
 */

function cached(fn) {
  var cache = new CustomMap();
  return function cachedFn() {
    var key = arguments.length <= 0 ? undefined : arguments[0];
    if (!cache.has(key)) cache.set(key, fn.apply(void 0, arguments));
    return cache.get(key);
  };
}
function setTargetPlatform(platform) {
  targetPlatform = platform;
}
/**
 * Convert rpx.
 * @param value
 * @param prop
 * @param platform
 * @return {String} Transformed value.
 */

var convertUnit = cached(function (value, prop, platform) {
  if (platform) {
    setTargetPlatform(platform);
  }

  return isRpx(value) ? calcRpx(value) : value;
});

// @ts-ignore
var STYLE = "style";
/**
 * https://github.com/reactjs/rfcs/pull/107
 * @param {*} type
 * @param {object} props
 * @param {string} maybeKey
 * @param {object} source
 * @param {any} self
 */ function jsx(type, props, maybeKey, source, self) {
    return jsxRuntime.jsx(type, hijackElementProps(props), maybeKey, source, self);
}
// Same as jsx method, special case jsxs internally to take advantage of static children.
// // for now we can ship identical prod functions.
function jsxs(type, props, maybeKey, source, self) {
    return jsxRuntime.jsxs(type, hijackElementProps(props), maybeKey, source, self);
}
function isObject(obj) {
    return typeof obj === "object";
}
// Support rpx unit.
function hijackElementProps(props) {
    if (props && STYLE in props) {
        var style = props.style;
        if (isObject(style)) {
            var result = Object.assign({}, props);
            var convertedStyle = {};
            for(var prop in style)// @ts-ignore
            convertedStyle[prop] = typeof style[prop] === "string" ? convertUnit(style[prop]) : style[prop];
            result["style"] = convertedStyle;
            return result;
        }
    }
    return props;
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function ownKeys$1(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys$1(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
function bound01(n, max) {
    if (isOnePointZero(n)) {
        n = '100%';
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    // Automatically convert percentage into number
    if (isPercent) {
        n = parseInt(String(n * max), 10) / 100;
    }
    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }
    // Convert into [0, 1] range if it isn't already
    if (max === 360) {
        // If n is a hue given in degrees,
        // wrap around out-of-range values into [0, 360] range
        // then convert into [0, 1].
        n = (n < 0 ? (n % max) + max : n % max) / parseFloat(String(max));
    }
    else {
        // If n not a hue given in degrees
        // Convert into [0, 1] range if it isn't already.
        n = (n % max) / parseFloat(String(max));
    }
    return n;
}
/**
 * Force a number between 0 and 1
 * @hidden
 */
function clamp01(val) {
    return Math.min(1, Math.max(0, val));
}
/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
function isOnePointZero(n) {
    return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}
/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') !== -1;
}
/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
        a = 1;
    }
    return a;
}
/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
function convertToPercentage(n) {
    if (n <= 1) {
        return "".concat(Number(n) * 100, "%");
    }
    return n;
}
/**
 * Force a hex value to have 2 characters
 * @hidden
 */
function pad2(c) {
    return c.length === 1 ? '0' + c : String(c);
}

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>
/**
 * Handle bounds / percentage checking to conform to CSS color spec
 * <http://www.w3.org/TR/css3-color/>
 * *Assumes:* r, g, b in [0, 255] or [0, 1]
 * *Returns:* { r, g, b } in [0, 255]
 */
function rgbToRgb(r, g, b) {
    return {
        r: bound01(r, 255) * 255,
        g: bound01(g, 255) * 255,
        b: bound01(b, 255) * 255,
    };
}
/**
 * Converts an RGB color value to HSL.
 * *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
 * *Returns:* { h, s, l } in [0,1]
 */
function rgbToHsl(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var s = 0;
    var l = (max + min) / 2;
    if (max === min) {
        s = 0;
        h = 0; // achromatic
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, l: l };
}
function hue2rgb(p, q, t) {
    if (t < 0) {
        t += 1;
    }
    if (t > 1) {
        t -= 1;
    }
    if (t < 1 / 6) {
        return p + (q - p) * (6 * t);
    }
    if (t < 1 / 2) {
        return q;
    }
    if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
    }
    return p;
}
/**
 * Converts an HSL color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hslToRgb(h, s, l) {
    var r;
    var g;
    var b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    if (s === 0) {
        // achromatic
        g = l;
        b = l;
        r = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color value to HSV
 *
 * *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
 * *Returns:* { h, s, v } in [0,1]
 */
function rgbToHsv(r, g, b) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b = bound01(b, 255);
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h = 0;
    var v = max;
    var d = max - min;
    var s = max === 0 ? 0 : d / max;
    if (max === min) {
        h = 0; // achromatic
    }
    else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h, s: s, v: v };
}
/**
 * Converts an HSV color value to RGB.
 *
 * *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
 * *Returns:* { r, g, b } in the set [0, 255]
 */
function hsvToRgb(h, s, v) {
    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);
    var i = Math.floor(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v, q, p, p, t, v][mod];
    var g = [t, v, v, q, p, p][mod];
    var b = [p, p, t, v, v, q][mod];
    return { r: r * 255, g: g * 255, b: b * 255 };
}
/**
 * Converts an RGB color to hex
 *
 * Assumes r, g, and b are contained in the set [0, 255]
 * Returns a 3 or 6 character hex
 */
function rgbToHex(r, g, b, allow3Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
    ];
    // Return a 3 character hex if possible
    if (allow3Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }
    return hex.join('');
}
/**
 * Converts an RGBA color plus alpha transparency to hex
 *
 * Assumes r, g, b are contained in the set [0, 255] and
 * a in [0, 1]. Returns a 4 or 8 character rgba hex
 */
// eslint-disable-next-line max-params
function rgbaToHex(r, g, b, a, allow4Char) {
    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16)),
        pad2(convertDecimalToHex(a)),
    ];
    // Return a 4 character hex if possible
    if (allow4Char &&
        hex[0].startsWith(hex[0].charAt(1)) &&
        hex[1].startsWith(hex[1].charAt(1)) &&
        hex[2].startsWith(hex[2].charAt(1)) &&
        hex[3].startsWith(hex[3].charAt(1))) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
    }
    return hex.join('');
}
/** Converts a decimal to a hex value */
function convertDecimalToHex(d) {
    return Math.round(parseFloat(d) * 255).toString(16);
}
/** Converts a hex value to a decimal */
function convertHexToDecimal(h) {
    return parseIntFromHex(h) / 255;
}
/** Parse a base-16 hex value into a base-10 integer */
function parseIntFromHex(val) {
    return parseInt(val, 16);
}
function numberInputToObject(color) {
    return {
        r: color >> 16,
        g: (color & 0xff00) >> 8,
        b: color & 0xff,
    };
}

// https://github.com/bahamas10/css-color-names/blob/master/css-color-names.json
/**
 * @hidden
 */
var names = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    goldenrod: '#daa520',
    gold: '#ffd700',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavenderblush: '#fff0f5',
    lavender: '#e6e6fa',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32',
};

/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/**
 * Given a string or object, convert that input to RGB
 *
 * Possible string inputs:
 * ```
 * "red"
 * "#f00" or "f00"
 * "#ff0000" or "ff0000"
 * "#ff000000" or "ff000000"
 * "rgb 255 0 0" or "rgb (255, 0, 0)"
 * "rgb 1.0 0 0" or "rgb (1, 0, 0)"
 * "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
 * "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
 * "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
 * "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
 * "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
 * ```
 */
function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v = null;
    var l = null;
    var ok = false;
    var format = false;
    if (typeof color === 'string') {
        color = stringInputToObject(color);
    }
    if (typeof color === 'object') {
        if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
            rgb = rgbToRgb(color.r, color.g, color.b);
            ok = true;
            format = String(color.r).substr(-1) === '%' ? 'prgb' : 'rgb';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
            s = convertToPercentage(color.s);
            v = convertToPercentage(color.v);
            rgb = hsvToRgb(color.h, s, v);
            ok = true;
            format = 'hsv';
        }
        else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
            s = convertToPercentage(color.s);
            l = convertToPercentage(color.l);
            rgb = hslToRgb(color.h, s, l);
            ok = true;
            format = 'hsl';
        }
        if (Object.prototype.hasOwnProperty.call(color, 'a')) {
            a = color.a;
        }
    }
    a = boundAlpha(a);
    return {
        ok: ok,
        format: color.format || format,
        r: Math.min(255, Math.max(rgb.r, 0)),
        g: Math.min(255, Math.max(rgb.g, 0)),
        b: Math.min(255, Math.max(rgb.b, 0)),
        a: a,
    };
}
// <http://www.w3.org/TR/css3-values/#integers>
var CSS_INTEGER = '[-\\+]?\\d+%?';
// <http://www.w3.org/TR/css3-values/#number-value>
var CSS_NUMBER = '[-\\+]?\\d*\\.\\d+%?';
// Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
// Actual matching.
// Parentheses and commas are optional, but not required.
// Whitespace can take the place of commas or opening paren
var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp('rgb' + PERMISSIVE_MATCH3),
    rgba: new RegExp('rgba' + PERMISSIVE_MATCH4),
    hsl: new RegExp('hsl' + PERMISSIVE_MATCH3),
    hsla: new RegExp('hsla' + PERMISSIVE_MATCH4),
    hsv: new RegExp('hsv' + PERMISSIVE_MATCH3),
    hsva: new RegExp('hsva' + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
};
/**
 * Permissive string parsing.  Take in a number of formats, and output an object
 * based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
 */
function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
        return false;
    }
    var named = false;
    if (names[color]) {
        color = names[color];
        named = true;
    }
    else if (color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0, format: 'name' };
    }
    // Try to match string input using regular expressions.
    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
    // Just return an object and let the conversion functions handle that.
    // This way the result will be the same whether the tinycolor is initialized with string or object.
    var match = matchers.rgb.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
        return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
        return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
        return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            a: convertHexToDecimal(match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex6.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1]),
            g: parseIntFromHex(match[2]),
            b: parseIntFromHex(match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    match = matchers.hex4.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            a: convertHexToDecimal(match[4] + match[4]),
            format: named ? 'name' : 'hex8',
        };
    }
    match = matchers.hex3.exec(color);
    if (match) {
        return {
            r: parseIntFromHex(match[1] + match[1]),
            g: parseIntFromHex(match[2] + match[2]),
            b: parseIntFromHex(match[3] + match[3]),
            format: named ? 'name' : 'hex',
        };
    }
    return false;
}
/**
 * Check to see if it looks like a CSS unit
 * (see `matchers` above for definition).
 */
function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
}

var TinyColor = /** @class */ (function () {
    function TinyColor(color, opts) {
        if (color === void 0) { color = ''; }
        if (opts === void 0) { opts = {}; }
        var _a;
        // If input is already a tinycolor, return itself
        if (color instanceof TinyColor) {
            // eslint-disable-next-line no-constructor-return
            return color;
        }
        if (typeof color === 'number') {
            color = numberInputToObject(color);
        }
        this.originalInput = color;
        var rgb = inputToRGB(color);
        this.originalInput = color;
        this.r = rgb.r;
        this.g = rgb.g;
        this.b = rgb.b;
        this.a = rgb.a;
        this.roundA = Math.round(100 * this.a) / 100;
        this.format = (_a = opts.format) !== null && _a !== void 0 ? _a : rgb.format;
        this.gradientType = opts.gradientType;
        // Don't let the range of [0,255] come back in [0,1].
        // Potentially lose a little bit of precision here, but will fix issues where
        // .5 gets interpreted as half of the total, instead of half of 1
        // If it was supposed to be 128, this was already taken care of by `inputToRgb`
        if (this.r < 1) {
            this.r = Math.round(this.r);
        }
        if (this.g < 1) {
            this.g = Math.round(this.g);
        }
        if (this.b < 1) {
            this.b = Math.round(this.b);
        }
        this.isValid = rgb.ok;
    }
    TinyColor.prototype.isDark = function () {
        return this.getBrightness() < 128;
    };
    TinyColor.prototype.isLight = function () {
        return !this.isDark();
    };
    /**
     * Returns the perceived brightness of the color, from 0-255.
     */
    TinyColor.prototype.getBrightness = function () {
        // http://www.w3.org/TR/AERT#color-contrast
        var rgb = this.toRgb();
        return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    };
    /**
     * Returns the perceived luminance of a color, from 0-1.
     */
    TinyColor.prototype.getLuminance = function () {
        // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var rgb = this.toRgb();
        var R;
        var G;
        var B;
        var RsRGB = rgb.r / 255;
        var GsRGB = rgb.g / 255;
        var BsRGB = rgb.b / 255;
        if (RsRGB <= 0.03928) {
            R = RsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        }
        if (GsRGB <= 0.03928) {
            G = GsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        }
        if (BsRGB <= 0.03928) {
            B = BsRGB / 12.92;
        }
        else {
            // eslint-disable-next-line prefer-exponentiation-operator
            B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    };
    /**
     * Returns the alpha value of a color, from 0-1.
     */
    TinyColor.prototype.getAlpha = function () {
        return this.a;
    };
    /**
     * Sets the alpha value on the current color.
     *
     * @param alpha - The new alpha value. The accepted range is 0-1.
     */
    TinyColor.prototype.setAlpha = function (alpha) {
        this.a = boundAlpha(alpha);
        this.roundA = Math.round(100 * this.a) / 100;
        return this;
    };
    /**
     * Returns whether the color is monochrome.
     */
    TinyColor.prototype.isMonochrome = function () {
        var s = this.toHsl().s;
        return s === 0;
    };
    /**
     * Returns the object as a HSVA object.
     */
    TinyColor.prototype.toHsv = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
    };
    /**
     * Returns the hsva values interpolated into a string with the following format:
     * "hsva(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toHsvString = function () {
        var hsv = rgbToHsv(this.r, this.g, this.b);
        var h = Math.round(hsv.h * 360);
        var s = Math.round(hsv.s * 100);
        var v = Math.round(hsv.v * 100);
        return this.a === 1 ? "hsv(".concat(h, ", ").concat(s, "%, ").concat(v, "%)") : "hsva(".concat(h, ", ").concat(s, "%, ").concat(v, "%, ").concat(this.roundA, ")");
    };
    /**
     * Returns the object as a HSLA object.
     */
    TinyColor.prototype.toHsl = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
    };
    /**
     * Returns the hsla values interpolated into a string with the following format:
     * "hsla(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toHslString = function () {
        var hsl = rgbToHsl(this.r, this.g, this.b);
        var h = Math.round(hsl.h * 360);
        var s = Math.round(hsl.s * 100);
        var l = Math.round(hsl.l * 100);
        return this.a === 1 ? "hsl(".concat(h, ", ").concat(s, "%, ").concat(l, "%)") : "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(this.roundA, ")");
    };
    /**
     * Returns the hex value of the color.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    TinyColor.prototype.toHex = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return rgbToHex(this.r, this.g, this.b, allow3Char);
    };
    /**
     * Returns the hex value of the color -with a # prefixed.
     * @param allow3Char will shorten hex value to 3 char if possible
     */
    TinyColor.prototype.toHexString = function (allow3Char) {
        if (allow3Char === void 0) { allow3Char = false; }
        return '#' + this.toHex(allow3Char);
    };
    /**
     * Returns the hex 8 value of the color.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    TinyColor.prototype.toHex8 = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
    };
    /**
     * Returns the hex 8 value of the color -with a # prefixed.
     * @param allow4Char will shorten hex value to 4 char if possible
     */
    TinyColor.prototype.toHex8String = function (allow4Char) {
        if (allow4Char === void 0) { allow4Char = false; }
        return '#' + this.toHex8(allow4Char);
    };
    /**
     * Returns the shorter hex value of the color depends on its alpha -with a # prefixed.
     * @param allowShortChar will shorten hex value to 3 or 4 char if possible
     */
    TinyColor.prototype.toHexShortString = function (allowShortChar) {
        if (allowShortChar === void 0) { allowShortChar = false; }
        return this.a === 1 ? this.toHexString(allowShortChar) : this.toHex8String(allowShortChar);
    };
    /**
     * Returns the object as a RGBA object.
     */
    TinyColor.prototype.toRgb = function () {
        return {
            r: Math.round(this.r),
            g: Math.round(this.g),
            b: Math.round(this.b),
            a: this.a,
        };
    };
    /**
     * Returns the RGBA values interpolated into a string with the following format:
     * "RGBA(xxx, xxx, xxx, xx)".
     */
    TinyColor.prototype.toRgbString = function () {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);
        return this.a === 1 ? "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")") : "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(this.roundA, ")");
    };
    /**
     * Returns the object as a RGBA object.
     */
    TinyColor.prototype.toPercentageRgb = function () {
        var fmt = function (x) { return "".concat(Math.round(bound01(x, 255) * 100), "%"); };
        return {
            r: fmt(this.r),
            g: fmt(this.g),
            b: fmt(this.b),
            a: this.a,
        };
    };
    /**
     * Returns the RGBA relative values interpolated into a string
     */
    TinyColor.prototype.toPercentageRgbString = function () {
        var rnd = function (x) { return Math.round(bound01(x, 255) * 100); };
        return this.a === 1
            ? "rgb(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%)")
            : "rgba(".concat(rnd(this.r), "%, ").concat(rnd(this.g), "%, ").concat(rnd(this.b), "%, ").concat(this.roundA, ")");
    };
    /**
     * The 'real' name of the color -if there is one.
     */
    TinyColor.prototype.toName = function () {
        if (this.a === 0) {
            return 'transparent';
        }
        if (this.a < 1) {
            return false;
        }
        var hex = '#' + rgbToHex(this.r, this.g, this.b, false);
        for (var _i = 0, _a = Object.entries(names); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (hex === value) {
                return key;
            }
        }
        return false;
    };
    TinyColor.prototype.toString = function (format) {
        var formatSet = Boolean(format);
        format = format !== null && format !== void 0 ? format : this.format;
        var formattedString = false;
        var hasAlpha = this.a < 1 && this.a >= 0;
        var needsAlphaFormat = !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');
        if (needsAlphaFormat) {
            // Special case for "transparent", all other non-alpha formats
            // will return rgba when there is transparency.
            if (format === 'name' && this.a === 0) {
                return this.toName();
            }
            return this.toRgbString();
        }
        if (format === 'rgb') {
            formattedString = this.toRgbString();
        }
        if (format === 'prgb') {
            formattedString = this.toPercentageRgbString();
        }
        if (format === 'hex' || format === 'hex6') {
            formattedString = this.toHexString();
        }
        if (format === 'hex3') {
            formattedString = this.toHexString(true);
        }
        if (format === 'hex4') {
            formattedString = this.toHex8String(true);
        }
        if (format === 'hex8') {
            formattedString = this.toHex8String();
        }
        if (format === 'name') {
            formattedString = this.toName();
        }
        if (format === 'hsl') {
            formattedString = this.toHslString();
        }
        if (format === 'hsv') {
            formattedString = this.toHsvString();
        }
        return formattedString || this.toHexString();
    };
    TinyColor.prototype.toNumber = function () {
        return (Math.round(this.r) << 16) + (Math.round(this.g) << 8) + Math.round(this.b);
    };
    TinyColor.prototype.clone = function () {
        return new TinyColor(this.toString());
    };
    /**
     * Lighten the color a given amount. Providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.lighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l += amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    /**
     * Brighten the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.brighten = function (amount) {
        if (amount === void 0) { amount = 10; }
        var rgb = this.toRgb();
        rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
        rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
        rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
        return new TinyColor(rgb);
    };
    /**
     * Darken the color a given amount, from 0 to 100.
     * Providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.darken = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.l -= amount / 100;
        hsl.l = clamp01(hsl.l);
        return new TinyColor(hsl);
    };
    /**
     * Mix the color with pure white, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return white.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.tint = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('white', amount);
    };
    /**
     * Mix the color with pure black, from 0 to 100.
     * Providing 0 will do nothing, providing 100 will always return black.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.shade = function (amount) {
        if (amount === void 0) { amount = 10; }
        return this.mix('black', amount);
    };
    /**
     * Desaturate the color a given amount, from 0 to 100.
     * Providing 100 will is the same as calling greyscale
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.desaturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s -= amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    /**
     * Saturate the color a given amount, from 0 to 100.
     * @param amount - valid between 1-100
     */
    TinyColor.prototype.saturate = function (amount) {
        if (amount === void 0) { amount = 10; }
        var hsl = this.toHsl();
        hsl.s += amount / 100;
        hsl.s = clamp01(hsl.s);
        return new TinyColor(hsl);
    };
    /**
     * Completely desaturates a color into greyscale.
     * Same as calling `desaturate(100)`
     */
    TinyColor.prototype.greyscale = function () {
        return this.desaturate(100);
    };
    /**
     * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
     * Values outside of this range will be wrapped into this range.
     */
    TinyColor.prototype.spin = function (amount) {
        var hsl = this.toHsl();
        var hue = (hsl.h + amount) % 360;
        hsl.h = hue < 0 ? 360 + hue : hue;
        return new TinyColor(hsl);
    };
    /**
     * Mix the current color a given amount with another color, from 0 to 100.
     * 0 means no mixing (return current color).
     */
    TinyColor.prototype.mix = function (color, amount) {
        if (amount === void 0) { amount = 50; }
        var rgb1 = this.toRgb();
        var rgb2 = new TinyColor(color).toRgb();
        var p = amount / 100;
        var rgba = {
            r: (rgb2.r - rgb1.r) * p + rgb1.r,
            g: (rgb2.g - rgb1.g) * p + rgb1.g,
            b: (rgb2.b - rgb1.b) * p + rgb1.b,
            a: (rgb2.a - rgb1.a) * p + rgb1.a,
        };
        return new TinyColor(rgba);
    };
    TinyColor.prototype.analogous = function (results, slices) {
        if (results === void 0) { results = 6; }
        if (slices === void 0) { slices = 30; }
        var hsl = this.toHsl();
        var part = 360 / slices;
        var ret = [this];
        for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results;) {
            hsl.h = (hsl.h + part) % 360;
            ret.push(new TinyColor(hsl));
        }
        return ret;
    };
    /**
     * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
     */
    TinyColor.prototype.complement = function () {
        var hsl = this.toHsl();
        hsl.h = (hsl.h + 180) % 360;
        return new TinyColor(hsl);
    };
    TinyColor.prototype.monochromatic = function (results) {
        if (results === void 0) { results = 6; }
        var hsv = this.toHsv();
        var h = hsv.h;
        var s = hsv.s;
        var v = hsv.v;
        var res = [];
        var modification = 1 / results;
        while (results--) {
            res.push(new TinyColor({ h: h, s: s, v: v }));
            v = (v + modification) % 1;
        }
        return res;
    };
    TinyColor.prototype.splitcomplement = function () {
        var hsl = this.toHsl();
        var h = hsl.h;
        return [
            this,
            new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
            new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
        ];
    };
    /**
     * Compute how the color would appear on a background
     */
    TinyColor.prototype.onBackground = function (background) {
        var fg = this.toRgb();
        var bg = new TinyColor(background).toRgb();
        var alpha = fg.a + bg.a * (1 - fg.a);
        return new TinyColor({
            r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
            g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
            b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
            a: alpha,
        });
    };
    /**
     * Alias for `polyad(3)`
     */
    TinyColor.prototype.triad = function () {
        return this.polyad(3);
    };
    /**
     * Alias for `polyad(4)`
     */
    TinyColor.prototype.tetrad = function () {
        return this.polyad(4);
    };
    /**
     * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
     * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
     */
    TinyColor.prototype.polyad = function (n) {
        var hsl = this.toHsl();
        var h = hsl.h;
        var result = [this];
        var increment = 360 / n;
        for (var i = 1; i < n; i++) {
            result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
        }
        return result;
    };
    /**
     * compare color vs current color
     */
    TinyColor.prototype.equals = function (color) {
        return this.toRgbString() === new TinyColor(color).toRgbString();
    };
    return TinyColor;
}());

var _excluded = ["b"],
  _excluded2 = ["v"];
var getRoundNumber = function getRoundNumber(value) {
  return Math.round(Number(value || 0));
};
var convertHsb2Hsv = function convertHsb2Hsv(color) {
  if (color && _typeof(color) === 'object' && 'h' in color && 'b' in color) {
    var _ref = color,
      b = _ref.b,
      resets = _objectWithoutProperties(_ref, _excluded);
    return _objectSpread2(_objectSpread2({}, resets), {}, {
      v: b
    });
  }
  if (typeof color === 'string' && /hsb/.test(color)) {
    return color.replace(/hsb/, 'hsv');
  }
  return color;
};
var Color = /*#__PURE__*/function (_TinyColor) {
  _inherits(Color, _TinyColor);
  var _super = _createSuper(Color);
  function Color(color) {
    _classCallCheck(this, Color);
    return _super.call(this, convertHsb2Hsv(color));
  }
  _createClass(Color, [{
    key: "toHsbString",
    value: function toHsbString() {
      var hsb = this.toHsb();
      var saturation = getRoundNumber(hsb.s * 100);
      var lightness = getRoundNumber(hsb.b * 100);
      var hue = getRoundNumber(hsb.h);
      var alpha = hsb.a;
      var hsbString = "hsb(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%)");
      var hsbaString = "hsba(".concat(hue, ", ").concat(saturation, "%, ").concat(lightness, "%, ").concat(alpha.toFixed(alpha === 0 ? 0 : 2), ")");
      return alpha === 1 ? hsbString : hsbaString;
    }
  }, {
    key: "toHsb",
    value: function toHsb() {
      var hsv = this.toHsv();
      if (_typeof(this.originalInput) === 'object' && this.originalInput) {
        if ('h' in this.originalInput) {
          hsv = this.originalInput;
        }
      }
      var _hsv = hsv;
        _hsv.v;
        var resets = _objectWithoutProperties(_hsv, _excluded2);
      return _objectSpread2(_objectSpread2({}, resets), {}, {
        b: hsv.v
      });
    }
  }]);
  return Color;
}(TinyColor);

var ColorPickerPrefixCls = 'rc-color-picker';
var generateColor = function generateColor(color) {
  if (color instanceof Color) {
    return color;
  }
  return new Color(color);
};
var defaultColor = generateColor('#1677ff');
var calculateColor = function calculateColor(props) {
  var offset = props.offset,
    targetRef = props.targetRef,
    containerRef = props.containerRef,
    color = props.color,
    type = props.type;
  var _containerRef$current = containerRef.current.getBoundingClientRect(),
    width = _containerRef$current.width,
    height = _containerRef$current.height;
  var _targetRef$current$ge = targetRef.current.getBoundingClientRect(),
    targetWidth = _targetRef$current$ge.width,
    targetHeight = _targetRef$current$ge.height;
  var centerOffsetX = targetWidth / 2;
  var centerOffsetY = targetHeight / 2;
  var saturation = (offset.x + centerOffsetX) / width;
  var bright = 1 - (offset.y + centerOffsetY) / height;
  var hsb = color.toHsb();
  var alphaOffset = saturation;
  var hueOffset = (offset.x + centerOffsetX) / width * 360;
  if (type) {
    switch (type) {
      case 'hue':
        return generateColor(_objectSpread2(_objectSpread2({}, hsb), {}, {
          h: hueOffset <= 0 ? 0 : hueOffset
        }));
      case 'alpha':
        return generateColor(_objectSpread2(_objectSpread2({}, hsb), {}, {
          a: alphaOffset <= 0 ? 0 : alphaOffset
        }));
    }
  }
  return generateColor({
    h: hsb.h,
    s: saturation <= 0 ? 0 : saturation,
    b: bright >= 1 ? 1 : bright,
    a: hsb.a
  });
};
var calculateOffset = function calculateOffset(containerRef, targetRef, color, type) {
  var _containerRef$current2 = containerRef.current.getBoundingClientRect(),
    width = _containerRef$current2.width,
    height = _containerRef$current2.height;
  var _targetRef$current$ge2 = targetRef.current.getBoundingClientRect(),
    targetWidth = _targetRef$current$ge2.width,
    targetHeight = _targetRef$current$ge2.height;
  var centerOffsetX = targetWidth / 2;
  var centerOffsetY = targetHeight / 2;
  var hsb = color.toHsb();

  // Exclusion of boundary cases
  if (targetWidth === 0 && targetHeight === 0 || targetWidth !== targetHeight) {
    return;
  }
  if (type) {
    switch (type) {
      case 'hue':
        return {
          x: hsb.h / 360 * width - centerOffsetX,
          y: -centerOffsetY / 3
        };
      case 'alpha':
        return {
          x: hsb.a / 1 * width - centerOffsetX,
          y: -centerOffsetY / 3
        };
    }
  }
  return {
    x: hsb.s * width - centerOffsetX,
    y: (1 - hsb.b) * height - centerOffsetY
  };
};

var ColorBlock = function ColorBlock(_ref) {
  var color = _ref.color,
    prefixCls = _ref.prefixCls,
    className = _ref.className,
    style = _ref.style,
    onClick = _ref.onClick;
  var colorBlockCls = "".concat(prefixCls, "-color-block");
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    className: classNames__default.default(colorBlockCls, className),
    style: style,
    onClick: onClick
  }, /*#__PURE__*/React__namespace.default.createElement("div", {
    className: "".concat(colorBlockCls, "-inner"),
    style: {
      background: color
    }
  }));
};

function getPosition(e) {
  var obj = 'touches' in e ? e.touches[0] : e;
  var scrollXOffset = document.documentElement.scrollLeft || document.body.scrollLeft || window.pageXOffset;
  var scrollYOffset = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
  return {
    pageX: obj.pageX - scrollXOffset,
    pageY: obj.pageY - scrollYOffset
  };
}
function useColorDrag(props) {
  var offset = props.offset,
    targetRef = props.targetRef,
    containerRef = props.containerRef,
    direction = props.direction,
    onDragChange = props.onDragChange,
    onDragChangeComplete = props.onDragChangeComplete,
    calculate = props.calculate,
    color = props.color,
    disabledDrag = props.disabledDrag;
  var _useState = React.useState(offset || {
      x: 0,
      y: 0
    }),
    _useState2 = _slicedToArray(_useState, 2),
    offsetValue = _useState2[0],
    setOffsetValue = _useState2[1];
  var mouseMoveRef = React.useRef(null);
  var mouseUpRef = React.useRef(null);
  var dragRef = React.useRef({
    flag: false
  });
  React.useEffect(function () {
    if (dragRef.current.flag === false) {
      var calcOffset = calculate === null || calculate === void 0 ? void 0 : calculate(containerRef);
      if (calcOffset) {
        setOffsetValue(calcOffset);
      }
    }
  }, [color, containerRef]);
  React.useEffect(function () {
    return function () {
      document.removeEventListener('mousemove', mouseMoveRef.current);
      document.removeEventListener('mouseup', mouseUpRef.current);
      document.removeEventListener('touchmove', mouseMoveRef.current);
      document.removeEventListener('touchend', mouseUpRef.current);
      mouseMoveRef.current = null;
      mouseUpRef.current = null;
    };
  }, []);
  var updateOffset = function updateOffset(e) {
    var _getPosition = getPosition(e),
      pageX = _getPosition.pageX,
      pageY = _getPosition.pageY;
    var _containerRef$current = containerRef.current.getBoundingClientRect(),
      rectX = _containerRef$current.x,
      rectY = _containerRef$current.y,
      width = _containerRef$current.width,
      height = _containerRef$current.height;
    var _targetRef$current$ge = targetRef.current.getBoundingClientRect(),
      targetWidth = _targetRef$current$ge.width,
      targetHeight = _targetRef$current$ge.height;
    var centerOffsetX = targetWidth / 2;
    var centerOffsetY = targetHeight / 2;
    var offsetX = Math.max(0, Math.min(pageX - rectX, width)) - centerOffsetX;
    var offsetY = Math.max(0, Math.min(pageY - rectY, height)) - centerOffsetY;
    var calcOffset = {
      x: offsetX,
      y: direction === 'x' ? offsetValue.y : offsetY
    };

    // Exclusion of boundary cases
    if (targetWidth === 0 && targetHeight === 0 || targetWidth !== targetHeight) {
      return false;
    }
    setOffsetValue(calcOffset);
    onDragChange === null || onDragChange === void 0 ? void 0 : onDragChange(calcOffset);
  };
  var onDragMove = function onDragMove(e) {
    e.preventDefault();
    updateOffset(e);
  };
  var onDragStop = function onDragStop(e) {
    e.preventDefault();
    dragRef.current.flag = false;
    document.removeEventListener('mousemove', mouseMoveRef.current);
    document.removeEventListener('mouseup', mouseUpRef.current);
    document.removeEventListener('touchmove', mouseMoveRef.current);
    document.removeEventListener('touchend', mouseUpRef.current);
    mouseMoveRef.current = null;
    mouseUpRef.current = null;
    onDragChangeComplete === null || onDragChangeComplete === void 0 ? void 0 : onDragChangeComplete();
  };
  var onDragStart = function onDragStart(e) {
    // https://github.com/ant-design/ant-design/issues/43529
    document.removeEventListener('mousemove', mouseMoveRef.current);
    document.removeEventListener('mouseup', mouseUpRef.current);
    if (disabledDrag) {
      return;
    }
    updateOffset(e);
    dragRef.current.flag = true;
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragStop);
    document.addEventListener('touchmove', onDragMove);
    document.addEventListener('touchend', onDragStop);
    mouseMoveRef.current = onDragMove;
    mouseUpRef.current = onDragStop;
  };
  return [offsetValue, onDragStart];
}

var Handler = function Handler(_ref) {
  var _ref$size = _ref.size,
    size = _ref$size === void 0 ? 'default' : _ref$size,
    color = _ref.color,
    prefixCls = _ref.prefixCls;
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    className: classNames__default.default("".concat(prefixCls, "-handler"), _defineProperty({}, "".concat(prefixCls, "-handler-sm"), size === 'small')),
    style: {
      backgroundColor: color
    }
  });
};

var Palette = function Palette(_ref) {
  var children = _ref.children,
    style = _ref.style,
    prefixCls = _ref.prefixCls;
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    className: "".concat(prefixCls, "-palette"),
    style: _objectSpread2({
      position: 'relative'
    }, style)
  }, children);
};

var Transform = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var children = props.children,
    offset = props.offset;
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    ref: ref,
    style: {
      position: 'absolute',
      left: offset.x,
      top: offset.y,
      zIndex: 1
    }
  }, children);
});

var Picker = function Picker(_ref) {
  var color = _ref.color,
    onChange = _ref.onChange,
    prefixCls = _ref.prefixCls,
    onChangeComplete = _ref.onChangeComplete,
    disabled = _ref.disabled;
  var pickerRef = React.useRef();
  var transformRef = React.useRef();
  var colorRef = React.useRef(color);
  var _useColorDrag = useColorDrag({
      color: color,
      containerRef: pickerRef,
      targetRef: transformRef,
      calculate: function calculate(containerRef) {
        return calculateOffset(containerRef, transformRef, color);
      },
      onDragChange: function onDragChange(offsetValue) {
        var calcColor = calculateColor({
          offset: offsetValue,
          targetRef: transformRef,
          containerRef: pickerRef,
          color: color
        });
        colorRef.current = calcColor;
        onChange(calcColor);
      },
      onDragChangeComplete: function onDragChangeComplete() {
        return onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(colorRef.current);
      },
      disabledDrag: disabled
    }),
    _useColorDrag2 = _slicedToArray(_useColorDrag, 2),
    offset = _useColorDrag2[0],
    dragStartHandle = _useColorDrag2[1];
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    ref: pickerRef,
    className: "".concat(prefixCls, "-select"),
    onMouseDown: dragStartHandle,
    onTouchStart: dragStartHandle
  }, /*#__PURE__*/React__namespace.default.createElement(Palette, {
    prefixCls: prefixCls
  }, /*#__PURE__*/React__namespace.default.createElement(Transform, {
    offset: offset,
    ref: transformRef
  }, /*#__PURE__*/React__namespace.default.createElement(Handler, {
    color: color.toRgbString(),
    prefixCls: prefixCls
  })), /*#__PURE__*/React__namespace.default.createElement("div", {
    className: "".concat(prefixCls, "-saturation"),
    style: {
      backgroundColor: "hsl(".concat(color.toHsb().h, ",100%, 50%)"),
      backgroundImage: 'linear-gradient(0deg, #000, transparent),linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0))'
    }
  })));
};

var Gradient = function Gradient(_ref) {
  var colors = _ref.colors,
    children = _ref.children,
    _ref$direction = _ref.direction,
    direction = _ref$direction === void 0 ? 'to right' : _ref$direction,
    type = _ref.type,
    prefixCls = _ref.prefixCls;
  var gradientColors = React.useMemo(function () {
    return colors.map(function (color, idx) {
      var result = generateColor(color);
      if (type === 'alpha' && idx === colors.length - 1) {
        result.setAlpha(1);
      }
      return result.toRgbString();
    }).join(',');
  }, [colors, type]);
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    className: "".concat(prefixCls, "-gradient"),
    style: {
      position: 'absolute',
      inset: 0,
      background: "linear-gradient(".concat(direction, ", ").concat(gradientColors, ")")
    }
  }, children);
};

var Slider = function Slider(_ref) {
  var gradientColors = _ref.gradientColors,
    direction = _ref.direction,
    _ref$type = _ref.type,
    type = _ref$type === void 0 ? 'hue' : _ref$type,
    color = _ref.color,
    value = _ref.value,
    onChange = _ref.onChange,
    onChangeComplete = _ref.onChangeComplete,
    disabled = _ref.disabled,
    prefixCls = _ref.prefixCls;
  var sliderRef = React.useRef();
  var transformRef = React.useRef();
  var colorRef = React.useRef(color);
  var _useColorDrag = useColorDrag({
      color: color,
      targetRef: transformRef,
      containerRef: sliderRef,
      calculate: function calculate(containerRef) {
        return calculateOffset(containerRef, transformRef, color, type);
      },
      onDragChange: function onDragChange(offsetValue) {
        var calcColor = calculateColor({
          offset: offsetValue,
          targetRef: transformRef,
          containerRef: sliderRef,
          color: color,
          type: type
        });
        colorRef.current = calcColor;
        onChange(calcColor);
      },
      onDragChangeComplete: function onDragChangeComplete() {
        onChangeComplete === null || onChangeComplete === void 0 ? void 0 : onChangeComplete(colorRef.current, type);
      },
      direction: 'x',
      disabledDrag: disabled
    }),
    _useColorDrag2 = _slicedToArray(_useColorDrag, 2),
    offset = _useColorDrag2[0],
    dragStartHandle = _useColorDrag2[1];
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    ref: sliderRef,
    className: classNames__default.default("".concat(prefixCls, "-slider"), "".concat(prefixCls, "-slider-").concat(type)),
    onMouseDown: dragStartHandle,
    onTouchStart: dragStartHandle
  }, /*#__PURE__*/React__namespace.default.createElement(Palette, {
    prefixCls: prefixCls
  }, /*#__PURE__*/React__namespace.default.createElement(Transform, {
    offset: offset,
    ref: transformRef
  }, /*#__PURE__*/React__namespace.default.createElement(Handler, {
    size: "small",
    color: value,
    prefixCls: prefixCls
  })), /*#__PURE__*/React__namespace.default.createElement(Gradient, {
    colors: gradientColors,
    direction: direction,
    type: type,
    prefixCls: prefixCls
  })));
};

function hasValue$1(value) {
  return value !== undefined;
}
var useColorState = function useColorState(defaultStateValue, option) {
  var defaultValue = option.defaultValue,
    value = option.value;
  var _useState = React.useState(function () {
      var mergeState;
      if (hasValue$1(value)) {
        mergeState = value;
      } else if (hasValue$1(defaultValue)) {
        mergeState = defaultValue;
      } else {
        mergeState = defaultStateValue;
      }
      return generateColor(mergeState);
    }),
    _useState2 = _slicedToArray(_useState, 2),
    colorValue = _useState2[0],
    setColorValue = _useState2[1];
  React.useEffect(function () {
    if (value) {
      setColorValue(generateColor(value));
    }
  }, [value]);
  return [colorValue, setColorValue];
};

var hueColor = ['rgb(255, 0, 0) 0%', 'rgb(255, 255, 0) 17%', 'rgb(0, 255, 0) 33%', 'rgb(0, 255, 255) 50%', 'rgb(0, 0, 255) 67%', 'rgb(255, 0, 255) 83%', 'rgb(255, 0, 0) 100%'];
var ColorPicker = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var value = props.value,
    defaultValue = props.defaultValue,
    _props$prefixCls = props.prefixCls,
    prefixCls = _props$prefixCls === void 0 ? ColorPickerPrefixCls : _props$prefixCls,
    onChange = props.onChange,
    onChangeComplete = props.onChangeComplete,
    className = props.className,
    style = props.style,
    panelRender = props.panelRender,
    _props$disabledAlpha = props.disabledAlpha,
    disabledAlpha = _props$disabledAlpha === void 0 ? false : _props$disabledAlpha,
    _props$disabled = props.disabled,
    disabled = _props$disabled === void 0 ? false : _props$disabled;
  var _useColorState = useColorState(defaultColor, {
      value: value,
      defaultValue: defaultValue
    }),
    _useColorState2 = _slicedToArray(_useColorState, 2),
    colorValue = _useColorState2[0],
    setColorValue = _useColorState2[1];
  var alphaColor = React.useMemo(function () {
    var rgb = generateColor(colorValue.toRgbString());
    // alpha color need equal 1 for base color
    rgb.setAlpha(1);
    return rgb.toRgbString();
  }, [colorValue]);
  var mergeCls = classNames__default.default("".concat(prefixCls, "-panel"), className, _defineProperty({}, "".concat(prefixCls, "-panel-disabled"), disabled));
  var basicProps = {
    prefixCls: prefixCls,
    onChangeComplete: onChangeComplete,
    disabled: disabled
  };
  var handleChange = function handleChange(data, type) {
    if (!value) {
      setColorValue(data);
    }
    onChange === null || onChange === void 0 ? void 0 : onChange(data, type);
  };
  var defaultPanel = /*#__PURE__*/React__namespace.default.createElement(React__namespace.default.Fragment, null, /*#__PURE__*/React__namespace.default.createElement(Picker, _extends({
    color: colorValue,
    onChange: handleChange
  }, basicProps)), /*#__PURE__*/React__namespace.default.createElement("div", {
    className: "".concat(prefixCls, "-slider-container")
  }, /*#__PURE__*/React__namespace.default.createElement("div", {
    className: classNames__default.default("".concat(prefixCls, "-slider-group"), _defineProperty({}, "".concat(prefixCls, "-slider-group-disabled-alpha"), disabledAlpha))
  }, /*#__PURE__*/React__namespace.default.createElement(Slider, _extends({
    gradientColors: hueColor,
    color: colorValue,
    value: "hsl(".concat(colorValue.toHsb().h, ",100%, 50%)"),
    onChange: function onChange(color) {
      return handleChange(color, 'hue');
    }
  }, basicProps)), !disabledAlpha && /*#__PURE__*/React__namespace.default.createElement(Slider, _extends({
    type: "alpha",
    gradientColors: ['rgba(255, 0, 4, 0) 0%', alphaColor],
    color: colorValue,
    value: colorValue.toRgbString(),
    onChange: function onChange(color) {
      return handleChange(color, 'alpha');
    }
  }, basicProps))), /*#__PURE__*/React__namespace.default.createElement(ColorBlock, {
    color: colorValue.toRgbString(),
    prefixCls: prefixCls
  })));
  return /*#__PURE__*/React__namespace.default.createElement("div", {
    className: mergeCls,
    style: style,
    ref: ref
  }, typeof panelRender === 'function' ? panelRender(defaultPanel) : defaultPanel);
});

var getIntColorValue = function(v) {
    var isPercent = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (!v) {
        return v;
    }
    if (!isPercent) {
        return Math.round(v);
    }
    return Math.round(v * 100);
};
var getColorStringByFormat = function(color, format) {
    if (!color) return "";
    if (format === "hex") {
        if (color.getAlpha() === 1) return color.toHexString();
        return color.toHex8String();
    }
    if (format === "rgb") {
        return color.toRgbString();
    }
    return "";
};
var hasValue = function(v) {
    return v !== undefined;
};
var getOffset = function(num) {
    if (num >= 1) num = 1;
    if (num <= 0) num = 0;
    return Math.round(num * 100) / 100;
};

function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else obj[key] = value;

    return obj;
}

function _object_spread(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);

        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(
                Object.getOwnPropertySymbols(source).filter(function(sym) {
                    return Object.getOwnPropertyDescriptor(source, sym).enumerable;
                })
            );
        }

        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }

    return target;
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        keys.push.apply(keys, symbols);
    }

    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};

    if (Object.getOwnPropertyDescriptors) Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }

    return target;
}

var ColorTypeOptions = [
    {
        value: "HEX",
        label: "HEX"
    },
    {
        value: "RGB",
        label: "RGB"
    }
];
function ColorTypeSelect(props) {
    var value = props.value, onChange = props.onChange;
    var _useState = _sliced_to_array(React.useState(false), 2), open = _useState[0], setOpen = _useState[1];
    var optionsRef = React.useRef(null);
    var handleTrigger = function() {
        setOpen(!open);
    };
    var changeType = function(t) {
        setOpen(false);
        onChange && onChange(t);
    };
    var clickHander = function(e) {
        if (optionsRef.current && !optionsRef.current.contains(e.target)) {
            setOpen(false);
        }
    };
    var initClickOutSide = function() {
        document.addEventListener("click", clickHander);
        return function() {
            document.removeEventListener("click", clickHander);
        };
    };
    React.useEffect(function() {
        initClickOutSide();
    }, []);
    return /*#__PURE__*/ jsxs("div", {
        className: "rcs-panel-type-select",
        onClick: handleTrigger,
        ref: optionsRef,
        children: [
            /*#__PURE__*/ jsxs("div", {
                className: "rcs-panel-type-select-trigger",
                children: [
                    /*#__PURE__*/ jsx("span", {
                        className: "rcs-panel-type-select-item",
                        children: value
                    }),
                    /*#__PURE__*/ jsx("span", {
                        className: "rcs-panel-type-select-arrow",
                        children: /*#__PURE__*/ jsx("svg", {
                            viewBox: "64 64 896 896",
                            focusable: "false",
                            "data-icon": "down",
                            width: "1em",
                            height: "1em",
                            fill: "currentColor",
                            "aria-hidden": "true",
                            children: /*#__PURE__*/ jsx("path", {
                                d: "M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"
                            })
                        })
                    })
                ]
            }),
            open ? /*#__PURE__*/ jsx("div", {
                className: "rcs-panel-type-select-options",
                children: ColorTypeOptions.map(function(option) {
                    return /*#__PURE__*/ jsx("span", {
                        className: "rcs-panel-type-select-item",
                        style: {
                            fontWeight: option.value === value ? "bold" : "normal"
                        },
                        onClick: function() {
                            changeType(option.value);
                        },
                        children: option.label
                    });
                })
            }) : null
        ]
    });
}

var InputNumber = function(props) {
    return /*#__PURE__*/ jsx(RcInputNumber__default.default, _object_spread({
        prefixCls: "rc-input-number",
        controls: false
    }, props));
};
var Input = function(props) {
    return /*#__PURE__*/ jsx(RcInput__default.default, _object_spread({
        prefixCls: "rc-input"
    }, props));
};

function ColorInput(props) {
    var format = props.format, value = props.value, onChange = props.onChange;
    var _useState = _sliced_to_array(React.useState(format.toUpperCase()), 2), colorType = _useState[0], setColorType = _useState[1];
    var _useState1 = _sliced_to_array(React.useState(""), 2), hexValue = _useState1[0], setHexValue = _useState1[1];
    var _useState2 = _sliced_to_array(React.useState(), 2), rgbValue = _useState2[0], setRgbValue = _useState2[1];
    var _useState3 = _sliced_to_array(React.useState(), 2), hsbValue = _useState3[0], setHsbValue = _useState3[1];
    var handleColorTypeChange = function(t) {
        setColorType(t);
    };
    var handleHexChange = function(e) {
        var v = e.target.value;
        setHexValue(v);
        if ((v === null || v === void 0 ? void 0 : v.length) === 6) {
            var color = new Color(v);
            if (color.isValid) {
                onChange && onChange(color);
            }
        }
    };
    var renderHexInput = function() {
        if (colorType === "HEX") {
            return /*#__PURE__*/ jsx("div", {
                className: "rcs-panel-input-type rcs-panel-input-hex",
                children: /*#__PURE__*/ jsx(Input, {
                    value: hexValue,
                    prefix: "#",
                    onChange: handleHexChange
                })
            });
        }
        return null;
    };
    var handleRgbChange = function(v, key) {
        var rgb = _object_spread_props(_object_spread({}, rgbValue), _define_property({}, key, v));
        var color = new Color(rgb);
        if (color.isValid) {
            onChange === null || onChange === void 0 ? void 0 : onChange(color);
        }
    };
    var renderRGBInput = function() {
        if (colorType === "RGB") {
            return /*#__PURE__*/ jsxs("div", {
                className: "rcs-panel-input-type rcs-panel-input-rgb",
                children: [
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: rgbValue === null || rgbValue === void 0 ? void 0 : rgbValue.r,
                        min: 0,
                        max: 255,
                        onChange: function(v) {
                            handleRgbChange(v, "r");
                        }
                    }),
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: rgbValue === null || rgbValue === void 0 ? void 0 : rgbValue.g,
                        min: 0,
                        max: 255,
                        onChange: function(v) {
                            handleRgbChange(v, "g");
                        }
                    }),
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: rgbValue === null || rgbValue === void 0 ? void 0 : rgbValue.b,
                        min: 0,
                        max: 255,
                        onChange: function(v) {
                            handleRgbChange(v, "b");
                        }
                    })
                ]
            });
        }
        return null;
    };
    var handleHsbChange = function(v, key) {
        var hsb = _object_spread_props(_object_spread({}, hsbValue), _define_property({}, key, v));
        hsb.b = hsb.b / 100;
        hsb.s = hsb.s / 100;
        var color = new Color(hsb);
        if (color.isValid) {
            onChange && onChange(color);
        }
    };
    var renderHSBInput = function() {
        if (colorType === "HSB") {
            return /*#__PURE__*/ jsxs("div", {
                className: "rcs-panel-input-type rcs-panel-input-hsb",
                children: [
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: hsbValue.h,
                        min: 0,
                        max: 360,
                        className: "rc-input-number-affix-wrapper",
                        onChange: function(v) {
                            handleHsbChange(v, "h");
                        }
                    }),
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: hsbValue.s,
                        min: 0,
                        max: 100,
                        suffix: "%",
                        onChange: function(v) {
                            handleHsbChange(v, "s");
                        }
                    }),
                    /*#__PURE__*/ jsx(InputNumber, {
                        value: hsbValue.b,
                        min: 0,
                        max: 100,
                        suffix: "%",
                        onChange: function(v) {
                            handleHsbChange(v, "b");
                        }
                    })
                ]
            });
        }
        return null;
    };
    var renderAlpha = function() {
        var alpha = value === null || value === void 0 ? void 0 : value.roundA;
        return /*#__PURE__*/ jsx("div", {
            className: "rcs-panel-input-alpha",
            children: /*#__PURE__*/ jsx(InputNumber, {
                suffix: "%",
                style: {
                    width: 48
                },
                min: 0,
                max: 100,
                value: alpha * 100
            })
        });
    };
    React.useEffect(function() {
        if (value) {
            setHexValue(value.toHexString().replace("#", ""));
            setRgbValue(value.toRgb());
            var hsb = value.toHsb();
            setHsbValue({
                h: getIntColorValue(hsb.h),
                s: getIntColorValue(hsb.s, true),
                b: getIntColorValue(hsb.b, true)
            });
        }
    }, [
        value
    ]);
    return /*#__PURE__*/ jsxs("div", {
        className: "rcs-panel-input",
        children: [
            /*#__PURE__*/ jsx(ColorTypeSelect, {
                value: colorType,
                onChange: handleColorTypeChange
            }),
            /*#__PURE__*/ jsxs("div", {
                className: "rcs-panel-input-types",
                children: [
                    renderHexInput(),
                    renderRGBInput(),
                    renderHSBInput()
                ]
            }),
            renderAlpha()
        ]
    });
}

var colors = [
    "#9AC1F0",
    "#72FA93",
    "#A0E548",
    "#E45F2B",
    "#F6C445",
    "#93AEC1",
    "#9DBDBA",
    "#F8B042",
    "#EC6A52",
    "#F3B7AD",
    "#BD9E84",
    "#C5DFDF",
    "#E68815",
    "#A71666",
    "#D31638",
    "#45496A",
    "#7D8BAE",
    "#E5857B",
    "#F1B2B2",
    "#E8CCC7",
    "#F8A57F",
    "#FAD4A6",
    "#FBE7AB",
    "#45958E",
    "#B7BDA0",
    "#8B86BE",
    "#86ABBA"
];
function PresetColors(props) {
    var value = props.value, onChange = props.onChange, _props_presetColors = props.presetColors, presetColors = _props_presetColors === void 0 ? colors : _props_presetColors;
    var c = value ? new Color(value) : null;
    return /*#__PURE__*/ jsx("div", {
        className: "rcs-preset-colors",
        children: presetColors.map(function(color) {
            var _c_toHexString, _c_toHexString_call, _c_toHexString_call_toUpperCase;
             return jsx("div", {
                className: "rsc-preset-color",
                style: {
                    background: color,
                    borderColor: color === (c === null || c === void 0 ? void 0 : (_c_toHexString = c.toHexString) === null || _c_toHexString === void 0 ? void 0 : (_c_toHexString_call = _c_toHexString.call(c)) === null || _c_toHexString_call === void 0 ? void 0 : (_c_toHexString_call_toUpperCase = _c_toHexString_call.toUpperCase) === null || _c_toHexString_call_toUpperCase === void 0 ? void 0 : _c_toHexString_call_toUpperCase.call(_c_toHexString_call)) ? "rgba(0,0,0,.25)" : "transparent"
                },
                onClick: function() {
                    onChange === null || onChange === void 0 ? void 0 : onChange(color);
                }
            });
        })
    });
}

var handleColor = function(c) {
    if (typeof c === "string") return new Color(c);
    return c;
};
function Base(props) {
    var _props_format = props.format, format = _props_format === void 0 ? "rgb" : _props_format, value = props.value, onChange = props.onChange, panelRender = props.panelRender;
    var _useState = _sliced_to_array(React.useState(), 2), color = _useState[0], setColor = _useState[1];
    var handleChange = function(v) {
        onChange && onChange(getColorStringByFormat(v, format));
    };
    var handlePresetChange = function(v) {
        var c = new Color(v);
        onChange && onChange(getColorStringByFormat(c, format));
    };
    React.useEffect(function() {
        if (hasValue(value)) {
            setColor(handleColor(value));
        }
    }, [
        value
    ]);
    return /*#__PURE__*/ jsx(ColorPicker, {
        value: color,
        onChange: handleChange,
        panelRender: function(innerPanel) {
            var panel = /*#__PURE__*/ jsxs("div", {
                className: "rcs-panel rcs",
                children: [
                    innerPanel,
                    /*#__PURE__*/ jsx(ColorInput, {
                        format: format,
                        value: color,
                        onChange: handleChange
                    }),
                    /*#__PURE__*/ jsx(PresetColors, {
                        value: value,
                        onChange: handlePresetChange
                    })
                ]
            });
            if (typeof panelRender === "function") {
                return panelRender(panel);
            }
            return panel;
        }
    });
}

function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}

function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) {
        return Array.from(iter);
    }
}

function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}

function ColorStopSlider(props) {
    var colorStop = props.colorStop, colorStops = props.colorStops, colorStopAdd = props.colorStopAdd, colorStopUpdate = props.colorStopUpdate, onColorStopChange = props.onColorStopChange;
    var colorStopDragRef = React.useRef({
        enable: false,
        lastX: 0
    });
    var calcStopStyle = function(stop) {
        var style = {
            left: "".concat(stop.offset * 100, "%"),
            backgroundColor: stop.color
        };
        if (stop.offset === 0) {
            style.transform = "translate(-1px, -50%)";
        }
        if (stop.offset === 1) {
            style.transform = "translate(calc(-100% + 1px), -50%)";
        }
        if (stop === colorStop) {
            style.width = "13px";
            style.height = "13px";
        }
        return style;
    };
    var handleMainClick = function(e) {
        if (colorStopDragRef.current.enable) return;
        var offset = e.nativeEvent.offsetX / e.target.clientWidth;
        colorStopAdd === null || colorStopAdd === void 0 ? void 0 : colorStopAdd({
            color: "#ff2222",
            offset: getOffset(offset)
        });
    };
    var handleStopMouseDown = function(stop, e) {
        e.stopPropagation();
        colorStopDragRef.current.enable = true;
        colorStopDragRef.current.lastX = e.clientX;
        onColorStopChange(stop);
    };
    var handleStopMouseMove = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (colorStopDragRef.current.enable) {
            // @ts-ignore
            var offset = colorStop.offset + (e.clientX - colorStopDragRef.current.lastX) / e.target.parentNode.clientWidth;
            colorStopDragRef.current.lastX = e.clientX;
            colorStopUpdate(_object_spread_props(_object_spread({}, colorStop), {
                offset: offset
            }));
        }
    };
    var handleStopMouseUp = function() {
        colorStopDragRef.current.enable = false;
    };
    var mainStyle = React.useMemo(function() {
        return {
            background: "linear-gradient(90deg, ".concat(colorStops.map(function(stop) {
                return "".concat(stop.color, " ").concat(stop.offset * 100, "%");
            }), ")")
        };
    }, [
        colorStops
    ]);
    React.useEffect(function() {
        document.addEventListener("mouseup", handleStopMouseUp);
        document.addEventListener("mousemove", handleStopMouseMove);
        return function() {
            document.removeEventListener("mouseup", handleStopMouseUp);
            document.removeEventListener("mousemove", handleStopMouseMove);
        };
    }, [
        colorStop,
        colorStops
    ]);
    return /*#__PURE__*/ jsx("div", {
        className: "rcs-slider",
        children: /*#__PURE__*/ jsx("div", {
            className: "rcs-slider-main",
            style: mainStyle,
            onClick: handleMainClick,
            children: colorStops.map(function(stop) {
                return /*#__PURE__*/ jsx("div", {
                    className: "rcs-slider-stop",
                    style: calcStopStyle(stop),
                    onClick: function(e) {
                        e.stopPropagation();
                    },
                    onMouseDown: function(e) {
                        handleStopMouseDown(stop, e);
                    }
                });
            })
        })
    });
}

function GradientAngel(props) {
    var angle = props.angle, onChange = props.onChange;
    var rotateAngle = function(newAngle) {
        onChange === null || onChange === void 0 ? void 0 : onChange(newAngle);
    };
    return /*#__PURE__*/ jsx("div", {
        className: "rcs-angle",
        title: "顺时针旋转渐变, 步长为10",
        children: /*#__PURE__*/ jsx(InputNumber, {
            min: 0,
            max: 360,
            suffix: "\xb0",
            style: {
                width: 48
            },
            value: angle,
            onChange: rotateAngle
        })
    });
}

function GradientAngelRotate(props) {
    var angle = props.angle, onChange = props.onChange, _props_defaultRotation = props.defaultRotation, defaultRotation = _props_defaultRotation === void 0 ? 45 : _props_defaultRotation;
    var rotateAngle = function() {
        var newAngle = angle + 45;
        if (newAngle > 360) newAngle = newAngle % 360;
        onChange === null || onChange === void 0 ? void 0 : onChange(newAngle);
    };
    return /*#__PURE__*/ jsx("div", {
        className: "rcs-angle",
        onClick: rotateAngle,
        title: "顺时针旋转渐变, 步长为".concat(defaultRotation),
        children: /*#__PURE__*/ jsxs("svg", {
            width: "24",
            height: "24",
            viewBox: "0 0 48 48",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            children: [
                /*#__PURE__*/ jsx("path", {
                    d: "M10 15C10 22.2989 14.103 28.5832 20 31.4081C22.1347 32.4307 24.5046 33 27 33C36.3888 33 44 24.9411 44 15",
                    stroke: "#ff2222",
                    "stroke-width": "4",
                    "stroke-linecap": "square",
                    "stroke-linejoin": "miter"
                }),
                /*#__PURE__*/ jsx("path", {
                    d: "M18 20L10 15L4 23",
                    stroke: "#ff2222",
                    "stroke-width": "4",
                    "stroke-linecap": "square",
                    "stroke-linejoin": "miter"
                })
            ]
        })
    });
}

var getDefaultLinearGradientValue = function(format) {
    return {
        colorStops: [
            {
                color: format === "rgb" ? "rgb(212, 22, 22)" : "#ff0000",
                offset: 0
            },
            {
                color: format === "rgb" ? "rgb(255, 255, 255)" : "#ffffff",
                offset: 1
            }
        ],
        angle: 90
    };
};
var sortListByOffset = function(list) {
    list.sort(function(a, b) {
        if (a.offset > b.offset) {
            return 1;
        }
        if (a.offset < b.offset) {
            return -1;
        }
        return 0;
    });
};
var handleStopOffset = function(offset) {
    if (offset <= 0) return 0;
    if (offset >= 1) return 1;
    return offset;
};
function LinearGradient(props) {
    var _props_angleType = props.angleType, angleType = _props_angleType === void 0 ? "rotate" : _props_angleType, _props_format = props.format, format = _props_format === void 0 ? "rgb" : _props_format, value = props.value, _props_type = props.type, type = _props_type === void 0 ? "linear" : _props_type, onChange = props.onChange, _props_defaultRotation = props.defaultRotation, defaultRotation = _props_defaultRotation === void 0 ? 45 : _props_defaultRotation;
    var defaultValue = getDefaultLinearGradientValue(format);
    var _useState = _sliced_to_array(React.useState(defaultValue), 2), gradient = _useState[0], setGradient = _useState[1];
    var _useState1 = _sliced_to_array(React.useState(defaultValue.colorStops[0]), 2), activeColorStop = _useState1[0], setActiveColorStop = _useState1[1];
    var handleColorStopAdd = function(stop) {
        var colorStops = _to_consumable_array(gradient.colorStops);
        colorStops.push(stop);
        sortListByOffset(colorStops);
        onChange === null || onChange === void 0 ? void 0 : onChange(_object_spread_props(_object_spread({}, gradient), {
            colorStops: colorStops
        }));
        setActiveColorStop(stop);
    };
    var handleColorStopUpdate = function(stop) {
        var _stop = _object_spread_props(_object_spread({}, stop), {
            offset: handleStopOffset(stop.offset)
        });
        var colorStops = _to_consumable_array(gradient.colorStops);
        var index = gradient.colorStops.findIndex(function(item) {
            return item === activeColorStop;
        });
        if (index !== -1) {
            colorStops.splice(index, 1, _stop);
            sortListByOffset(colorStops);
            onChange === null || onChange === void 0 ? void 0 : onChange(_object_spread_props(_object_spread({}, gradient), {
                colorStops: colorStops
            }));
            setActiveColorStop(_stop);
        }
    };
    var handleColorStopRemove = function() {
        if (gradient.colorStops.length <= 2) return;
        var index = gradient.colorStops.findIndex(function(item) {
            return item === activeColorStop;
        });
        if (index !== -1) {
            var colorStops = _to_consumable_array(gradient.colorStops);
            colorStops.splice(index, 1);
            onChange === null || onChange === void 0 ? void 0 : onChange(_object_spread_props(_object_spread({}, gradient), {
                colorStops: colorStops
            }));
        }
    };
    var handleColorChange = function(color) {
        var index = gradient.colorStops.findIndex(function(item) {
            return item === activeColorStop;
        });
        var colorStop = _object_spread_props(_object_spread({}, activeColorStop), {
            color: color
        });
        if (index !== -1) {
            var colorStops = _to_consumable_array(gradient.colorStops);
            colorStops.splice(index, 1, colorStop);
            onChange === null || onChange === void 0 ? void 0 : onChange(_object_spread_props(_object_spread({}, gradient), {
                colorStops: colorStops
            }));
            setActiveColorStop(colorStop);
        }
    };
    var handleAngleChange = function(angle) {
        onChange === null || onChange === void 0 ? void 0 : onChange(_object_spread_props(_object_spread({}, gradient), {
            angle: angle
        }));
    };
    var renderAngleInput = function() {
        if (angleType === "input") {
            return /*#__PURE__*/ jsx(GradientAngel, {
                angle: gradient === null || gradient === void 0 ? void 0 : gradient.angle,
                onChange: handleAngleChange
            });
        }
        if (angleType === "rotate") {
            return /*#__PURE__*/ jsx(GradientAngelRotate, {
                angle: gradient === null || gradient === void 0 ? void 0 : gradient.angle,
                onChange: handleAngleChange,
                defaultRotation: defaultRotation
            });
        }
        return null;
    };
    React.useEffect(function() {
        var active = gradient.colorStops.find(function(item) {
            return item === activeColorStop;
        });
        if (!active) setActiveColorStop(gradient.colorStops[0]);
    }, [
        gradient
    ]);
    React.useEffect(function() {
        if (value) {
            setGradient(value);
        } else {
            setGradient(defaultValue);
        }
    }, [
        value
    ]);
    return /*#__PURE__*/ jsx(Base, {
        format: format,
        value: activeColorStop === null || activeColorStop === void 0 ? void 0 : activeColorStop.color,
        onChange: handleColorChange,
        panelRender: function(innerPanel) {
             return jsxs("div", {
                className: "rcs-gradient rcs",
                children: [
                    /*#__PURE__*/ jsxs("div", {
                        className: "rcs-gradient-header",
                        children: [
                            /*#__PURE__*/ jsx(ColorStopSlider, {
                                colorStop: activeColorStop,
                                colorStops: gradient === null || gradient === void 0 ? void 0 : gradient.colorStops,
                                colorStopAdd: handleColorStopAdd,
                                colorStopRemove: handleColorStopRemove,
                                onColorStopChange: setActiveColorStop,
                                colorStopUpdate: handleColorStopUpdate
                            }),
                            type === "linear" ? renderAngleInput() : null
                        ]
                    }),
                    /*#__PURE__*/ jsxs("div", {
                        className: "rcs-stop-info",
                        children: [
                            /*#__PURE__*/ jsxs("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center"
                                },
                                title: "色标偏移",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        style: {
                                            lineHeight: 0
                                        },
                                        children: /*#__PURE__*/ jsx("svg", {
                                            viewBox: "0 0 1024 1024",
                                            version: "1.1",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            "p-id": "3861",
                                            width: "14",
                                            height: "14",
                                            children: /*#__PURE__*/ jsx("path", {
                                                d: "M866.432 175.232a42.666667 42.666667 0 0 0-60.330667-60.330667l-691.2 691.2a42.666667 42.666667 0 1 0 60.330667 60.330667l691.2-691.2zM878.933333 281.6h-85.333333v85.333333h85.333333v-85.333333zM281.6 793.6h85.333333v85.333333h-85.333333v-85.333333zM878.933333 452.266667h-85.333333v85.333333h85.333333v-85.333333zM793.6 622.933333h85.333333v85.333334h-85.333333v-85.333334zM878.933333 793.6h-85.333333v85.333333h85.333333v-85.333333zM622.933333 793.6h85.333334v85.333333h-85.333334v-85.333333zM537.6 793.6h-85.333333v85.333333h85.333333v-85.333333z",
                                                fill: "#707070"
                                            })
                                        })
                                    }),
                                    /*#__PURE__*/ jsxs("span", {
                                        style: {
                                            lineHeight: 0,
                                            marginLeft: 2
                                        },
                                        children: [
                                            Math.round(((activeColorStop === null || activeColorStop === void 0 ? void 0 : activeColorStop.offset) || 0) * 100),
                                            "%"
                                        ]
                                    })
                                ]
                            }),
                            type === "linear" && angleType === "rotate" ? /*#__PURE__*/ jsxs("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center"
                                },
                                title: "渐变角度",
                                children: [
                                    /*#__PURE__*/ jsx("span", {
                                        style: {
                                            lineHeight: 0
                                        },
                                        children: /*#__PURE__*/ jsx("svg", {
                                            viewBox: "0 0 1024 1024",
                                            version: "1.1",
                                            xmlns: "http://www.w3.org/2000/svg",
                                            "p-id": "6894",
                                            width: "14px",
                                            height: "14px",
                                            children: /*#__PURE__*/ jsx("path", {
                                                d: "M526.048 866.88c2.432-49.92-8.224-91.552-31.552-125.952-24.896-36.704-63.264-63.68-116.224-80.96L203.2 866.88H526.08z m64.064 0h338.56v64H65.344L771.52 96l48.864 41.344-398.08 470.56c54.048 21.792 96 54.144 125.12 97.056 31.008 45.664 45.12 99.936 42.656 161.856z",
                                                fill: "#707070"
                                            })
                                        })
                                    }),
                                    /*#__PURE__*/ jsxs("span", {
                                        style: {
                                            lineHeight: 0,
                                            marginLeft: 2
                                        },
                                        children: [
                                            gradient === null || gradient === void 0 ? void 0 : gradient.angle,
                                            "\xb0"
                                        ]
                                    })
                                ]
                            }) : null,
                            /*#__PURE__*/ jsx("span", {
                                className: "rcs-stop-info-del",
                                onClick: handleColorStopRemove,
                                children: /*#__PURE__*/ jsx("svg", {
                                    viewBox: "64 64 896 896",
                                    focusable: "false",
                                    width: "14px",
                                    height: "14px",
                                    fill: "#707070",
                                    "aria-hidden": "true",
                                    children: /*#__PURE__*/ jsx("path", {
                                        d: "M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"
                                    })
                                })
                            })
                        ]
                    }),
                    innerPanel
                ]
            });
        }
    });
}

var Types = [
    {
        label: "纯色",
        value: "solid"
    },
    {
        label: "线性渐变",
        value: "linear"
    },
    {
        label: "径向渐变",
        value: "radial"
    }
];
function Colors(props) {
    var _props_angleType = props.angleType, angleType = _props_angleType === void 0 ? "rotate" : _props_angleType, _props_format = props.format, format = _props_format === void 0 ? "rgb" : _props_format, value = props.value, onChange = props.onChange, defaultRotation = props.defaultRotation;
    var handleSolidChange = function(color) {
        var v = {
            type: "solid",
            color: color
        };
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    var handleGradientChange = function(gradient, type) {
        var v = {
            type: type,
            gradient: gradient
        };
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    var handleTypeChange = function(type) {
        var v = _object_spread_props(_object_spread({}, value), {
            type: type
        });
        if (type !== "solid") {
            if (!v.gradient) v.gradient = getDefaultLinearGradientValue(format);
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    return /*#__PURE__*/ jsxs("div", {
        className: "rcs-all rcs",
        children: [
            /*#__PURE__*/ jsx("div", {
                className: "rcs-all-tab",
                children: Types.map(function(item) {
                     return jsx("div", {
                        className: "rcs-all-type ".concat(item.value, " ").concat((value === null || value === void 0 ? void 0 : value.type) === item.value ? "active" : ""),
                        title: item.label,
                        onClick: function() {
                            handleTypeChange(item.value);
                        }
                    });
                })
            }),
            (value === null || value === void 0 ? void 0 : value.type) === "solid" ? /*#__PURE__*/ jsx(Base, {
                format: format,
                value: value === null || value === void 0 ? void 0 : value.color,
                onChange: handleSolidChange
            }) : null,
            (value === null || value === void 0 ? void 0 : value.type) === "linear" ? /*#__PURE__*/ jsx(LinearGradient, {
                angleType: angleType,
                format: format,
                type: "linear",
                value: value === null || value === void 0 ? void 0 : value.gradient,
                onChange: function(v) {
                    handleGradientChange(v, "linear");
                }
            }) : null,
            (value === null || value === void 0 ? void 0 : value.type) === "radial" ? /*#__PURE__*/ jsx(LinearGradient, {
                defaultRotation: defaultRotation,
                format: format,
                type: "radial",
                value: value === null || value === void 0 ? void 0 : value.gradient,
                onChange: function(v) {
                    handleGradientChange(v, "radial");
                }
            }) : null
        ]
    });
}

function SolidColorSetter(props) {
    const { value, onChange, trigger } = props;
    const handleChange = (v) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    const calcTriggerBg = () => {
        const c = new Color(value);
        if (c.toHexString() === '#ffffff') {
            return 'rgba(103,103,103,0.24)';
        }
        return null;
    };
    const renderTrigger = () => {
        if (trigger)
            return trigger;
        return (jsxRuntime.jsx("svg", Object.assign({ width: 22, height: 22, viewBox: "64 64 896 896", focusable: "false", fill: value, "aria-hidden": "true" }, { children: jsxRuntime.jsx("path", { d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) })));
    };
    return (jsxRuntime.jsx(antd.Popover, Object.assign({ content: jsxRuntime.jsx(Base, { value: value, onChange: handleChange, format: "hex" }) }, { children: jsxRuntime.jsx("div", Object.assign({ className: "fabritor-toolbar-item", style: {
                borderRadius: 4,
                backgroundColor: calcTriggerBg()
            } }, { children: renderTrigger() })) })));
}

function ColorSetter(props) {
    var _a;
    const { defaultColor = '#ffffff', trigger, type, value, onChange } = props;
    const handleChange = (v) => {
        if (!v)
            return;
        if (!v.color)
            v.color = defaultColor;
        onChange === null || onChange === void 0 ? void 0 : onChange(v);
    };
    const calcIconFill = () => {
        switch (value === null || value === void 0 ? void 0 : value.type) {
            case 'solid':
                return value.color;
            case 'linear':
            case 'radial':
                return `url(#colorsetter-icon-gradient) ${value.color || 'rgba(0, 0, 0, 0.88)'}`;
            default:
                return 'rgba(0, 0, 0, 0.88)';
        }
    };
    const calcTriggerBg = () => {
        if ((value === null || value === void 0 ? void 0 : value.type) === 'solid') {
            const c = new Color(value.color);
            if (c.toHexString() === '#ffffff') {
                return 'rgba(103,103,103,0.24)';
            }
        }
        return null;
    };
    const renderTrigger = () => {
        if (trigger)
            return trigger;
        if (type === 'fontColor') {
            return (jsxRuntime.jsx("svg", Object.assign({ viewBox: "64 64 896 896", focusable: "false", width: 22, height: 22, fill: calcIconFill(), "aria-hidden": "true" }, { children: jsxRuntime.jsx("path", { d: "M904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-650.3-80h85c4.2 0 8-2.7 9.3-6.8l53.7-166h219.2l53.2 166c1.3 4 5 6.8 9.3 6.8h89.1c1.1 0 2.2-.2 3.2-.5a9.7 9.7 0 006-12.4L573.6 118.6a9.9 9.9 0 00-9.2-6.6H462.1c-4.2 0-7.9 2.6-9.2 6.6L244.5 723.1c-.4 1-.5 2.1-.5 3.2-.1 5.3 4.3 9.7 9.7 9.7zm255.9-516.1h4.1l83.8 263.8H424.9l84.7-263.8z" }) })));
        }
        return (jsxRuntime.jsx("svg", Object.assign({ width: 22, height: 22, viewBox: "64 64 896 896", focusable: "false", fill: calcIconFill(), "aria-hidden": "true" }, { children: jsxRuntime.jsx("path", { d: "M766.4 744.3c43.7 0 79.4-36.2 79.4-80.5 0-53.5-79.4-140.8-79.4-140.8S687 610.3 687 663.8c0 44.3 35.7 80.5 79.4 80.5zm-377.1-44.1c7.1 7.1 18.6 7.1 25.6 0l256.1-256c7.1-7.1 7.1-18.6 0-25.6l-256-256c-.6-.6-1.3-1.2-2-1.7l-78.2-78.2a9.11 9.11 0 00-12.8 0l-48 48a9.11 9.11 0 000 12.8l67.2 67.2-207.8 207.9c-7.1 7.1-7.1 18.6 0 25.6l255.9 256zm12.9-448.6l178.9 178.9H223.4l178.8-178.9zM904 816H120c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" }) })));
    };
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(antd.Popover, Object.assign({ content: jsxRuntime.jsx("div", Object.assign({ className: "fabritor-color-setter" }, { children: jsxRuntime.jsx(Colors, { value: value, onChange: handleChange, format: "hex", angleType: "rotate" }) })), trigger: "click" }, { children: jsxRuntime.jsx("div", Object.assign({ className: "fabritor-toolbar-item", style: {
                        borderRadius: 4,
                        backgroundColor: calcTriggerBg()
                    } }, { children: renderTrigger() })) })), jsxRuntime.jsx("svg", Object.assign({ style: { width: 0, height: 0, position: 'absolute' }, "aria-hidden": "true", focusable: "false" }, { children: jsxRuntime.jsx("linearGradient", Object.assign({ id: "colorsetter-icon-gradient", x2: "1", y2: "1" }, { children: (_a = value === null || value === void 0 ? void 0 : value.gradient) === null || _a === void 0 ? void 0 : _a.colorStops.map(stop => (jsxRuntime.jsx("stop", { offset: `${stop.offset * 100}%`, "stop-color": stop.color }))) })) }))] }));
}

function SliderInputNumber(props) {
    const { min = 1, max = 100, step = 1, style, sliderProps, inputProps, onChange, onChangeComplete, value } = props;
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ gap: 6, style: style }, { children: [jsxRuntime.jsx(antd.Slider, Object.assign({ style: { flex: 1 }, min: min, max: max, step: step, onChange: onChange, onAfterChange: onChangeComplete, value: value }, sliderProps)), jsxRuntime.jsx(antd.InputNumber, Object.assign({ min: min, max: max, step: step, onChange: onChange, value: value, style: { width: 56 }, controls: false }, inputProps))] })));
}

const { Item: FormItem$d } = antd.Form;
function PathSetterForm(props) {
    const { value, onChange, shouldFireEvent, showPenTip, showFillConfig } = props;
    const [form] = antd.Form.useForm();
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const fireEvent = () => {
        if (shouldFireEvent) {
            editor.fireCustomModifiedEvent();
        }
    };
    React.useEffect(() => {
        form.setFieldsValue(value);
    }, [value]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: onChange, style: { marginBottom: 0, marginTop: 16 }, colon: false }, { children: [showPenTip ? jsxRuntime.jsx(FormItem$d, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('panel.paint.title') })) }) : null, jsxRuntime.jsx(FormItem$d, Object.assign({ label: showFillConfig ? t('common.stroke') : t('common.stroke_color'), name: "color" }, { children: jsxRuntime.jsx(SolidColorSetter, { onChange: fireEvent }) })), jsxRuntime.jsx(FormItem$d, Object.assign({ label: t('common.line_width'), name: "width" }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 1, max: 100, onChangeComplete: fireEvent }) })), showFillConfig ?
                jsxRuntime.jsx(FormItem$d, Object.assign({ label: t('common.fill'), name: "fill" }, { children: jsxRuntime.jsx(ColorSetter, { onChange: fireEvent }) })) : null, jsxRuntime.jsx(FormItem$d, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.shadow') })) }), jsxRuntime.jsx(FormItem$d, Object.assign({ label: t('common.color'), name: ['shadow', 'color'] }, { children: jsxRuntime.jsx(SolidColorSetter, { onChange: fireEvent }) })), jsxRuntime.jsx(FormItem$d, Object.assign({ label: t('common.width'), name: ['shadow', 'width'] }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 50, onChangeComplete: fireEvent }) })), jsxRuntime.jsx(FormItem$d, Object.assign({ label: t('common.offset'), name: ['shadow', 'offset'] }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 20, onChangeComplete: fireEvent }) }))] })));
}

function PaintPanel() {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isDrawingMode, setIsDrawingMode] = React.useState(true);
    const { editor } = React.useContext(GlobalStateContext);
    const [penFormValues, setPenFormValues] = React.useState({});
    const { t } = reactI18next.useTranslation();
    const handleBrushChange = (options) => {
        if (options.color) {
            editor.canvas.freeDrawingBrush.color = options.color;
        }
        if (options.width) {
            editor.canvas.freeDrawingBrush.width = options.width;
        }
        if (options.strokeLineCap) {
            editor.canvas.freeDrawingBrush.strokeLineCap = options.strokeLineCap;
        }
        if (options.shadow) {
            const shadow = editor.canvas.freeDrawingBrush.shadow;
            const originalShadowObject = shadow ? shadow.toObject() : {};
            const newShadowObject = {
                blur: options.shadow.width || originalShadowObject.blur,
                offsetX: options.shadow.offset || originalShadowObject.offsetX,
                offsetY: options.shadow.offset || originalShadowObject.offsetY,
                affectStroke: true,
                color: options.shadow.color || originalShadowObject.color,
            };
            editor.canvas.freeDrawingBrush.shadow = new fabric$1.fabric.Shadow(newShadowObject);
        }
    };
    const stopFreeDrawMode = () => {
        editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
        setIsDrawingMode(!isDrawingMode);
    };
    const initBrush = () => {
        if (editor) {
            editor.canvas.isDrawingMode = true;
            editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAW_MODE_CURSOR)}") 4 12, crosshair`;
            const freeDrawingBrush = new fabric$1.fabric.PencilBrush(editor.canvas);
            editor.canvas.freeDrawingBrush = freeDrawingBrush;
            const { color, width } = BrushList[0].options;
            freeDrawingBrush.color = color;
            freeDrawingBrush.width = width;
            freeDrawingBrush.shadow = new fabric$1.fabric.Shadow({
                blur: 0,
                offsetX: 0,
                offsetY: 0,
                affectStroke: true,
                color: '#000000',
            });
            setPenFormValues({
                color,
                width,
                shadow: {
                    color: '#000000',
                    width: 0,
                    offset: 0
                }
            });
        }
        return () => {
            if (editor === null || editor === void 0 ? void 0 : editor.canvas) {
                editor.canvas.isDrawingMode = false;
            }
        };
    };
    React.useEffect(() => {
        return initBrush();
    }, []);
    return (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: [jsxRuntime.jsx(antd.Flex, Object.assign({ wrap: "wrap", justify: "space-around" }, { children: BrushList.map((item, index) => (jsxRuntime.jsx(antd.Tooltip, Object.assign({ trigger: "hover", title: item.title }, { children: jsxRuntime.jsx("div", Object.assign({ className: "fabritor-panel-shape-item", onClick: () => {
                            handleBrushChange(item.options);
                            setActiveIndex(index);
                            setPenFormValues(Object.assign(Object.assign({}, penFormValues), item.options));
                        }, style: {
                            padding: '4px 8px',
                            backgroundColor: activeIndex === index ? '#eeeeee' : 'rgba(0,0,0,0)',
                            borderRadius: 8
                        } }, { children: jsxRuntime.jsx("img", { src: `data:image/svg+xml,${encodeURIComponent(item.svg)}`, alt: "", style: { width: 56, height: 56 } }) }), item.key) })))) })), jsxRuntime.jsx(PathSetterForm, { onChange: handleBrushChange, value: penFormValues, showPenTip: true }), jsxRuntime.jsx(Title$1, { children: t('common.operate') }), jsxRuntime.jsx(antd.Flex, Object.assign({ wrap: "wrap", justify: "space-around" }, { children: jsxRuntime.jsx(antd.Button, Object.assign({ style: { width: 64 }, onClick: stopFreeDrawMode, type: isDrawingMode ? 'default' : 'primary', title: isDrawingMode ? t('panel.paint.stop') : t('panel.paint.start') }, { children: jsxRuntime.jsx("img", { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAG_ICON)}`, style: { width: 22, height: 22 } }) })) }))] })));
}

const controlsUtils$2 = fabric$1.fabric.controlsUtils;
const initRectControl = () => {
    const objectControls = fabric$1.fabric.Object.prototype.controls;
    if (fabric$1.fabric.Rect) {
        const rectControls = fabric$1.fabric.Rect.prototype.controls = {};
        rectControls.tr = objectControls.tr;
        rectControls.br = objectControls.br;
        rectControls.tl = objectControls.tl;
        rectControls.bl = objectControls.bl;
        rectControls.mt = objectControls.mt;
        rectControls.mb = objectControls.mb;
        rectControls.mtr = objectControls.mtr;
        rectControls.copy = objectControls.copy;
        rectControls.del = objectControls.del;
        rectControls.ml = new fabric$1.fabric.Control({
            x: -0.5,
            y: 0,
            actionHandler: controlsUtils$2.changeWidth,
            cursorStyleHandler: objectControls.ml.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.ml.render
        });
        rectControls.mr = new fabric$1.fabric.Control({
            x: 0.5,
            y: 0,
            actionHandler: controlsUtils$2.changeWidth,
            cursorStyleHandler: objectControls.mr.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mr.render
        });
        rectControls.mt = new fabric$1.fabric.Control({
            x: 0,
            y: -0.5,
            offsetY: -1,
            actionHandler: changeHeight,
            cursorStyleHandler: objectControls.mt.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mt.render
        });
        rectControls.mb = new fabric$1.fabric.Control({
            x: 0,
            y: 0.5,
            offsetY: 1,
            actionHandler: changeHeight,
            cursorStyleHandler: objectControls.mb.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mb.render
        });
    }
};

const changeLineEnd = (eventData, transform, x, y) => {
    const { target } = transform;
    target.set({ x2: x, y2: y });
    return true;
};
const changeLineStart = (eventData, transform, x, y) => {
    const { target } = transform;
    target.set({ x1: x, y1: y });
    return true;
};
const linePositionHandler = (x, y) => {
    return (dim, finalMatrix, fabricObject) => {
        if (fabricObject === null || fabricObject === void 0 ? void 0 : fabricObject.canvas) {
            const points = fabricObject.calcLinePoints();
            const localPoint = new fabric$1.fabric.Point(points[x], points[y]);
            const point = fabric$1.fabric.util.transformPoint(localPoint, fabric$1.fabric.util.multiplyTransformMatrices(fabricObject.canvas.viewportTransform, fabricObject.calcTransformMatrix()));
            return point;
        }
        else {
            return new fabric$1.fabric.Point(0, 0);
        }
    };
};
const initLineControl = () => {
    const objectControls = fabric$1.fabric.Object.prototype.controls;
    if (fabric$1.fabric.Line) {
        const lineControls = fabric$1.fabric.Line.prototype.controls = {};
        lineControls.copy = objectControls.copy;
        lineControls.del = objectControls.del;
        lineControls.l1 = new fabric$1.fabric.Control({
            positionHandler: linePositionHandler('x1', 'y1'),
            actionHandler: changeLineStart,
            cursorStyleHandler: () => 'crosshair',
            actionName: 'line-points-change',
            render: objectControls.br.render
        });
        lineControls.l2 = new fabric$1.fabric.Control({
            positionHandler: linePositionHandler('x2', 'y2'),
            actionHandler: changeLineEnd,
            cursorStyleHandler: () => 'crosshair',
            actionName: 'line-points-change',
            render: objectControls.br.render
        });
    }
};

const controlsUtils$1 = fabric$1.fabric.controlsUtils;
const initFTextControl = () => {
    const objectControls = fabric$1.fabric.Object.prototype.controls;
    if (fabric$1.fabric.Rect) {
        const ftextControl = fabric$1.fabric.FText.prototype.controls = {};
        ftextControl.tr = objectControls.tr;
        ftextControl.br = objectControls.br;
        ftextControl.tl = objectControls.tl;
        ftextControl.bl = objectControls.bl;
        ftextControl.mtr = objectControls.mtr;
        ftextControl.copy = objectControls.copy;
        ftextControl.del = objectControls.del;
        ftextControl.ml = new fabric$1.fabric.Control({
            x: -0.5,
            y: 0,
            offsetX: -1,
            actionHandler: controlsUtils$1.changeWidth,
            cursorStyleHandler: objectControls.ml.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.ml.render
        });
        ftextControl.mr = new fabric$1.fabric.Control({
            x: 0.5,
            y: 0,
            offsetX: 1,
            actionHandler: controlsUtils$1.changeWidth,
            cursorStyleHandler: objectControls.mr.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mr.render
        });
    }
};

const ROTATE_IMG = document.createElement('img');
ROTATE_IMG.src = ROTATE_SVG;
const ROTATE_IMG_ACTIVE = document.createElement('img');
ROTATE_IMG_ACTIVE.src = ROTATE_SVG_ACTIVE;
const COPY_IMG = document.createElement('img');
COPY_IMG.src = COPY_SVG;
const COPY_IMG_ACTIVE = document.createElement('img');
COPY_IMG_ACTIVE.src = COPY_SVG_ACTIVE;
const DEL_IMG = document.createElement('img');
DEL_IMG.src = DEL_SVG;
const DEL_IMG_ACTIVE = document.createElement('img');
DEL_IMG_ACTIVE.src = DEL_SVG_ACTIVE;
const renderSizeIcon = (ctx, left, top, styleOverride, fabricObject, TBorLR) => {
    const xSize = TBorLR === 'TB' ? 20 : 6;
    const ySize = TBorLR === 'TB' ? 6 : 20;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#bbbbbb';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = '#dddddd';
    ctx.translate(left, top);
    ctx.rotate(fabric$1.fabric.util.degreesToRadians(fabricObject.angle));
    ctx.beginPath();
    ctx.roundRect(-xSize / 2, -ySize / 2, xSize, ySize, 10);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
};
const renderLRIcon = (ctx, left, top, styleOverride, fabricObject) => {
    renderSizeIcon(ctx, left, top, styleOverride, fabricObject, 'LR');
};
const renderTBIcon = (ctx, left, top, styleOverride, fabricObject) => {
    renderSizeIcon(ctx, left, top, styleOverride, fabricObject, 'TB');
};
const renderVertexIcon = (ctx, left, top, styleOverride, fabricObject) => {
    const size = 12;
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#bbbbbb';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 2;
    ctx.shadowColor = '#dddddd';
    ctx.beginPath();
    ctx.arc(left, top, size / 2, 0, 2 * Math.PI, false);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
};
function renderSvgIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        const size = 28;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric$1.fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    };
}
const handleCopyObject = async (eventData, transform) => {
    const target = transform.target;
    const canvas = target.canvas;
    await copyObject(canvas, target);
    pasteObject(canvas);
    return true;
};
const handleDelObject = (eventData, transform) => {
    const target = transform.target;
    const canvas = target.canvas;
    removeObject(target, canvas);
    return true;
};
const renderController = () => {
    const mtConfig = {
        x: 0,
        y: -0.5,
        offsetY: -1,
        render: renderTBIcon
    };
    Object.keys(mtConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.mt[key] = mtConfig[key];
    });
    const mbConfig = {
        x: 0,
        y: 0.5,
        offsetY: 1,
        render: renderTBIcon
    };
    Object.keys(mbConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.mb[key] = mbConfig[key];
    });
    const mlConfig = {
        x: -0.5,
        y: 0,
        offsetX: -1,
        render: renderLRIcon
    };
    Object.keys(mlConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.ml[key] = mlConfig[key];
    });
    const mrConfig = {
        x: 0.5,
        y: 0,
        offsetX: 1,
        render: renderLRIcon
    };
    Object.keys(mrConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.mr[key] = mrConfig[key];
    });
    const tlConfig = {
        x: -0.5,
        y: -0.5,
        render: renderVertexIcon
    };
    Object.keys(tlConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.tl[key] = tlConfig[key];
    });
    const trConfig = {
        x: 0.5,
        y: -0.5,
        render: renderVertexIcon
    };
    Object.keys(trConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.tr[key] = trConfig[key];
    });
    const blConfig = {
        x: -0.5,
        y: 0.5,
        render: renderVertexIcon
    };
    Object.keys(blConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.bl[key] = blConfig[key];
    });
    const brConfig = {
        x: 0.5,
        y: 0.5,
        render: renderVertexIcon
    };
    Object.keys(brConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.br[key] = brConfig[key];
    });
};
const renderRotateController = () => {
    const mtrConfig = {
        x: 0,
        y: 0.5,
        offsetY: 38,
        cursorStyleHandler: () => `url("data:image/svg+xml;charset=utf-8,${ROTATE_CURSOR}") 12 12, crosshair`,
        render: renderSvgIcon(ROTATE_IMG),
        withConnection: false
    };
    Object.keys(mtrConfig).forEach(key => {
        fabric$1.fabric.Object.prototype.controls.mtr[key] = mtrConfig[key];
    });
};
const renderToolBarController = () => {
    const copyControl = new fabric$1.fabric.Control({
        x: 0,
        y: -0.5,
        offsetX: -24,
        offsetY: -26,
        cursorStyle: 'pointer',
        mouseUpHandler: handleCopyObject,
        render: renderSvgIcon(COPY_IMG)
    });
    fabric$1.fabric.Object.prototype.controls.copy = copyControl;
    const delControl = new fabric$1.fabric.Control({
        x: 0,
        y: -0.5,
        offsetX: 24,
        offsetY: -26,
        cursorStyle: 'pointer',
        mouseUpHandler: handleDelObject,
        render: renderSvgIcon(DEL_IMG)
    });
    fabric$1.fabric.Object.prototype.controls.del = delControl;
};
const handleMouseOverCorner = (corner, target) => {
    if (corner === 'mtr') {
        target.controls[corner].render = renderSvgIcon(ROTATE_IMG_ACTIVE);
    }
    if (corner === 'copy') {
        target.controls[corner].render = renderSvgIcon(COPY_IMG_ACTIVE);
    }
    if (corner === 'del') {
        target.controls[corner].render = renderSvgIcon(DEL_IMG_ACTIVE);
    }
    target.canvas.requestRenderAll();
};
const handleMouseOutCorner = (target) => {
    var _a, _b, _c;
    if (!target)
        return;
    if ((_a = target.controls) === null || _a === void 0 ? void 0 : _a.mtr) {
        target.controls.mtr.render = renderSvgIcon(ROTATE_IMG);
    }
    if ((_b = target.controls) === null || _b === void 0 ? void 0 : _b.copy) {
        target.controls.copy.render = renderSvgIcon(COPY_IMG);
    }
    if ((_c = target.controls) === null || _c === void 0 ? void 0 : _c.del) {
        target.controls.del.render = renderSvgIcon(DEL_IMG);
    }
};
function initControl() {
    renderController();
    renderRotateController();
    renderToolBarController();
    initRectControl();
    initLineControl();
    initFTextControl();
}

const controlsUtils = fabric$1.fabric.controlsUtils;
const calcCanvasZoomLevel = (containerSize, sketchSize) => {
    if (sketchSize.width < containerSize.width && sketchSize.height <= containerSize.height) {
        return 1;
    }
    let level = 1;
    if (containerSize.width / containerSize.height < sketchSize.width / sketchSize.height) {
        level = containerSize.width / sketchSize.width;
    }
    else {
        level = containerSize.height / sketchSize.height;
    }
    level = Number(level.toFixed(2));
    return level;
};
let _clipboard;
const copyObject = async (canvas, target) => {
    return new Promise((resolve) => {
        if (!target) {
            target = canvas.getActiveObject();
        }
        if (!target)
            return Promise.resolve(false);
        navigator.clipboard.writeText('');
        return target.clone(cloned => {
            _clipboard = cloned;
            return resolve(true);
        }, FABRITOR_CUSTOM_PROPS);
    });
};
const pasteObject = async (canvas) => {
    try {
        const { type, result } = (await getSystemClipboard()) || {};
        if (result) {
            if (type === 'text') {
                createTextbox({ text: result, canvas });
            }
            else if (type === 'image') {
                createFImage({ imageSource: result, canvas });
            }
            return;
        }
    }
    catch (err) {
        console.error('Failed to read clipboard contents: ', err);
    }
    _clipboard.clone((cloned) => {
        canvas.discardActiveObject();
        cloned.set({
            left: cloned.left + 50,
            top: cloned.top + 50,
            evented: true,
        });
        if (cloned.type === 'f-line' || cloned.type === 'f-arrow' || cloned.type === 'f-tri-arrow') {
            handleFLinePointsWhenMoving({ target: cloned, transform: { original: { left: cloned.left - 50, top: cloned.top - 50 } } });
        }
        if (cloned.type === 'activeSelection') {
            cloned.canvas = canvas;
            cloned.forEachObject((obj) => {
                canvas.add(obj);
            });
            cloned.setCoords();
        }
        else {
            canvas.add(cloned);
        }
        canvas.setActiveObject(cloned);
        canvas.requestRenderAll();
        canvas.fire('fabritor:clone', { target: cloned });
    }, FABRITOR_CUSTOM_PROPS);
};
const removeObject = (target, canvas) => {
    if (!target) {
        target = canvas.getActiveObject();
    }
    if (!target)
        return;
    if (target.type === 'activeSelection') {
        target.getObjects().forEach((obj) => {
            canvas.remove(obj);
        });
        canvas.discardActiveObject();
    }
    else {
        canvas.remove(target);
    }
    handleMouseOutCorner(target);
    canvas.requestRenderAll();
    canvas.fire('fabritor:del', { target: null });
    return true;
};
const groupSelection = (canvas, target) => {
    if (!target) {
        target = canvas.getActiveObject();
    }
    if (!target || target.type !== 'activeSelection') {
        return;
    }
    canvas.getActiveObjects().forEach((o) => {
        if (o.type === 'f-image') {
            o.img.clipPath = null;
        }
    });
    target.toGroup();
    canvas.requestRenderAll();
    canvas.fire('fabritor:group');
};
const ungroup = (canvas, target) => {
    if (!target) {
        target = canvas.getActiveObject();
    }
    if (!target || target.type !== 'group') {
        return;
    }
    target.getObjects().forEach((obj) => {
        obj.set({
            lockMovementX: false,
            lockMovementY: false,
            hasControls: true,
            selectable: true
        });
    });
    target.toActiveSelection();
    canvas.requestRenderAll();
    canvas.fire('fabritor:ungroup');
};
const changeLayerLevel = (level, editor, target) => {
    if (!target) {
        target = editor.canvas.getActiveObject();
    }
    if (!target || target.type === 'activeSelection') {
        return;
    }
    switch (level) {
        case 'layer-up':
            target.bringForward();
            break;
        case 'layer-top':
            target.bringToFront();
            break;
        case 'layer-down':
            target.sendBackwards();
            break;
        case 'layer-bottom':
            target.sendToBack();
            break;
    }
    editor.sketch.sendToBack();
    editor.canvas.requestRenderAll();
    editor.fireCustomModifiedEvent();
};
const getLocalPoint = (transform, originX, originY, x, y) => {
    var target = transform.target, control = target.controls[transform.corner], zoom = target.canvas.getZoom(), padding = target.padding / zoom, localPoint = target.toLocalPoint(new fabric$1.fabric.Point(x, y), originX, originY);
    if (localPoint.x >= padding) {
        localPoint.x -= padding;
    }
    if (localPoint.x <= -padding) {
        localPoint.x += padding;
    }
    if (localPoint.y >= padding) {
        localPoint.y -= padding;
    }
    if (localPoint.y <= padding) {
        localPoint.y += padding;
    }
    localPoint.x -= control.offsetX;
    localPoint.y -= control.offsetY;
    return localPoint;
};
function isTransformCentered(transform) {
    return transform.originX === 'center' && transform.originY === 'center';
}
const _changeHeight = (eventData, transform, x, y) => {
    const target = transform.target, localPoint = getLocalPoint(transform, transform.originX, transform.originY, x, y), strokePadding = target.strokeWidth / (target.strokeUniform ? target.scaleX : 1), multiplier = isTransformCentered(transform) ? 2 : 1, oldHeight = target.height, newHeight = Math.abs(localPoint.y * multiplier / target.scaleY) - strokePadding;
    target.set('height', Math.max(newHeight, 0));
    return oldHeight !== newHeight;
};
const changeHeight = controlsUtils.wrapWithFireEvent('resizing', controlsUtils.wrapWithFixedAnchor(_changeHeight));
const handleFLinePointsWhenMoving = (opt) => {
    const { target, transform, action } = opt;
    if (action === 'line-points-change')
        return;
    const { original } = transform;
    const deltaLeft = target.left - original.left;
    const deltaTop = target.top - original.top;
    target.set({
        x1: target.x1 + deltaLeft,
        y1: target.y1 + deltaTop,
        x2: target.x2 + deltaLeft,
        y2: target.y2 + deltaTop
    });
};

const ContextMenuItem = (props) => {
    const { label, keyboard, cmdKey = false } = props;
    reactI18next.useTranslation();
    const isMac = navigator.userAgent.indexOf('Mac OS X') > -1;
    const getCmdkey = () => {
        if (cmdKey) {
            if (isMac)
                return '⌘';
            return 'Ctrl';
        }
        return '';
    };
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ gap: 68, justify: "space-between" }, { children: [jsxRuntime.jsx("span", { children: label }), jsxRuntime.jsx("span", { children: `${getCmdkey()} ${keyboard}` })] })));
};
const ContextMenu = (props, ref) => {
    const { object, noCareOpen } = props;
    const [open, setOpen] = React.useState(false);
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const renderMenuItems = () => {
        if (!object || object.id === SKETCH_ID) {
            return [
                {
                    label: jsxRuntime.jsx(ContextMenuItem, { label: t('setter.common.paste'), keyboard: "V", cmdKey: true }),
                    key: 'paste',
                }
            ];
        }
        const menuItems = [
            {
                label: jsxRuntime.jsx(ContextMenuItem, { label: t('setter.common.copy'), keyboard: "C", cmdKey: true }),
                key: 'copy',
            },
            {
                label: jsxRuntime.jsx(ContextMenuItem, { label: t('setter.common.paste'), keyboard: "V", cmdKey: true }),
                key: 'paste',
            },
            {
                label: jsxRuntime.jsx("span", { children: t('setter.common.create_a_copy') }),
                key: 'copy&paste',
            },
            {
                label: jsxRuntime.jsx(ContextMenuItem, { label: t('setter.common.del'), keyboard: "DEL" }),
                key: 'del',
            },
        ];
        if (object.type === 'activeSelection') {
            menuItems.push({
                type: 'divider',
            });
            menuItems.push({
                label: t('setter.group.g'),
                key: 'group',
            });
        }
        if (object.type === 'group' && !object.sub_type) {
            menuItems.push({
                type: 'divider',
            });
            menuItems.push({
                label: t('setter.group.ung'),
                key: 'ungroup',
            });
        }
        if (object.type !== 'activeSelection') {
            menuItems.push({
                type: 'divider',
            });
            menuItems.push({
                label: t('setter.common.layer'),
                key: 'layer',
                children: [
                    {
                        label: t('setter.common.layer_up'),
                        key: 'layer-up',
                    },
                    {
                        label: t('setter.common.layer_top'),
                        key: 'layer-top',
                    },
                    {
                        label: t('setter.common.layer_down'),
                        key: 'layer-down',
                    },
                    {
                        label: t('setter.common.layer_bottom'),
                        key: 'layer-bottom'
                    }
                ]
            });
        }
        return menuItems;
    };
    const handleClick = async ({ key }) => {
        switch (key) {
            case 'copy':
                await copyObject(editor.canvas, object);
                break;
            case 'paste':
                pasteObject(editor.canvas);
                break;
            case 'copy&paste':
                await copyObject(editor.canvas, object);
                await pasteObject(editor.canvas);
                break;
            case 'del':
                removeObject(object, editor.canvas);
                break;
            case 'group':
                groupSelection(editor.canvas, object);
                break;
            case 'ungroup':
                ungroup(editor.canvas, object);
                break;
            case 'layer-up':
            case 'layer-top':
            case 'layer-down':
            case 'layer-bottom':
                changeLayerLevel(key, editor, object);
        }
        setOpen(false);
    };
    React.useImperativeHandle(ref, () => ({
        show: () => setOpen(true),
        hide: () => setOpen(false),
    }));
    return (jsxRuntime.jsx(antd.Dropdown, Object.assign({ menu: { items: renderMenuItems(), onClick: handleClick }, trigger: ['contextMenu'], open: noCareOpen ? undefined : open }, { children: props.children })));
};
var ContextMenu$1 = React.forwardRef(ContextMenu);

var version = "5.3.0";
var objects = [
	{
		type: "rect",
		version: "5.3.0",
		originX: "left",
		originY: "top",
		left: 0,
		top: 0,
		width: 1242,
		height: 1660,
		fill: "#ffffff",
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: "butt",
		strokeDashOffset: 0,
		strokeLineJoin: "miter",
		strokeUniform: true,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: null,
		visible: true,
		backgroundColor: "",
		fillRule: "nonzero",
		paintFirst: "stroke",
		globalCompositeOperation: "source-over",
		skewX: 0,
		skewY: 0,
		rx: 0,
		ry: 0,
		id: "fabritor-sketch",
		fabritor_desc: "Image canvas",
		selectable: false,
		hasControls: false
	},
	{
		type: "f-image",
		version: "5.3.0",
		originX: "left",
		originY: "top",
		left: 323,
		top: 767.49,
		width: 597,
		height: 893.51,
		fill: "rgb(0,0,0)",
		stroke: null,
		strokeWidth: 0,
		strokeDashArray: null,
		strokeLineCap: "butt",
		strokeDashOffset: 0,
		strokeLineJoin: "miter",
		strokeUniform: true,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: null,
		visible: true,
		backgroundColor: "",
		fillRule: "nonzero",
		paintFirst: "stroke",
		globalCompositeOperation: "source-over",
		skewX: 0,
		skewY: 0,
		id: "838bb981-f378-43d8-af4d-d2e283d6d767",
		selectable: true,
		hasControls: true,
		imageBorder: {
		},
		objects: [
			{
				type: "image",
				version: "5.3.0",
				originX: "center",
				originY: "center",
				left: 0,
				top: 0,
				width: 400,
				height: 599,
				fill: "rgb(0,0,0)",
				stroke: null,
				strokeWidth: 0,
				strokeDashArray: null,
				strokeLineCap: "butt",
				strokeDashOffset: 0,
				strokeLineJoin: "miter",
				strokeUniform: true,
				strokeMiterLimit: 4,
				scaleX: 1.49,
				scaleY: 1.49,
				angle: 0,
				flipX: false,
				flipY: false,
				opacity: 1,
				shadow: null,
				visible: true,
				backgroundColor: "",
				fillRule: "nonzero",
				paintFirst: "stroke",
				globalCompositeOperation: "source-over",
				skewX: 0,
				skewY: 0,
				clipPath: {
					type: "rect",
					version: "5.3.0",
					originX: "center",
					originY: "center",
					left: 0,
					top: 0,
					width: 400,
					height: 599,
					fill: "rgb(0,0,0)",
					stroke: null,
					strokeWidth: 1,
					strokeDashArray: null,
					strokeLineCap: "butt",
					strokeDashOffset: 0,
					strokeLineJoin: "miter",
					strokeUniform: true,
					strokeMiterLimit: 4,
					scaleX: 1,
					scaleY: 1,
					angle: 0,
					flipX: false,
					flipY: false,
					opacity: 1,
					shadow: null,
					visible: true,
					backgroundColor: "",
					fillRule: "nonzero",
					paintFirst: "stroke",
					globalCompositeOperation: "source-over",
					skewX: 0,
					skewY: 0,
					rx: 0,
					ry: 0,
					selectable: true,
					hasControls: true,
					inverted: false,
					absolutePositioned: false
				},
				cropX: 0,
				cropY: 0,
				selectable: true,
				hasControls: true,
				src: "https://framerusercontent.com/images/S8LzTBsTv7aFWaPYWqvxt86vOHk.png",
				crossOrigin: "anonymous",
				filters: [
				]
			},
			{
				type: "rect",
				version: "5.3.0",
				originX: "center",
				originY: "center",
				left: 0,
				top: 0,
				width: 596,
				height: 892.51,
				fill: "#00000000",
				stroke: null,
				strokeWidth: 1,
				strokeDashArray: null,
				strokeLineCap: "butt",
				strokeDashOffset: 0,
				strokeLineJoin: "miter",
				strokeUniform: true,
				strokeMiterLimit: 4,
				scaleX: 1,
				scaleY: 1,
				angle: 0,
				flipX: false,
				flipY: false,
				opacity: 1,
				shadow: null,
				visible: true,
				backgroundColor: "",
				fillRule: "nonzero",
				paintFirst: "fill",
				globalCompositeOperation: "source-over",
				skewX: 0,
				skewY: 0,
				rx: 0,
				ry: 0,
				selectable: true,
				hasControls: true
			}
		]
	},
	{
		type: "f-text",
		version: "5.3.0",
		originX: "left",
		originY: "top",
		left: 220,
		top: 188.86,
		width: 800,
		height: 135.6,
		fill: {
			type: "linear",
			coords: {
				x1: 0,
				y1: 0,
				x2: 500,
				y2: 0
			},
			colorStops: [
				{
					color: "#e45f2b",
					offset: 0
				},
				{
					color: "#9dbdba",
					offset: 0.47
				},
				{
					color: "#7d8bae",
					offset: 1
				}
			],
			offsetX: 0,
			offsetY: 0,
			gradientUnits: "pixels",
			gradientTransform: null
		},
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: "butt",
		strokeDashOffset: 0,
		strokeLineJoin: "miter",
		strokeUniform: true,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: null,
		visible: true,
		backgroundColor: "",
		fillRule: "nonzero",
		paintFirst: "stroke",
		globalCompositeOperation: "source-over",
		skewX: 0,
		skewY: 0,
		fontFamily: "Open Sans",
		fontWeight: "bold",
		fontSize: 120,
		text: "ShellAgent",
		underline: false,
		overline: false,
		linethrough: false,
		textAlign: "center",
		fontStyle: "normal",
		lineHeight: 1.3,
		textBackgroundColor: "",
		charSpacing: 59,
		styles: [
		],
		direction: "ltr",
		path: null,
		pathStartOffset: 0,
		pathSide: "left",
		pathAlign: "center",
		minWidth: 20,
		splitByGrapheme: true,
		id: "ad9d6314-5b03-4886-a101-eb0df5f64153",
		selectable: true,
		hasControls: true
	},
	{
		type: "f-text",
		version: "5.3.0",
		originX: "left",
		originY: "top",
		left: 69.79,
		top: 464.87,
		width: 1102.41,
		height: 207.92,
		fill: "#45496a",
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: "butt",
		strokeDashOffset: 0,
		strokeLineJoin: "miter",
		strokeUniform: true,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: null,
		visible: true,
		backgroundColor: "",
		fillRule: "nonzero",
		paintFirst: "stroke",
		globalCompositeOperation: "source-over",
		skewX: 0,
		skewY: 0,
		fontFamily: "Sedgwick Ave Display",
		fontWeight: "normal",
		fontSize: 80,
		text: "MyShell - Build, Share, and\n Own AI Chat.",
		underline: false,
		overline: false,
		linethrough: false,
		textAlign: "center",
		fontStyle: "normal",
		lineHeight: 1.3,
		textBackgroundColor: "",
		charSpacing: 0,
		styles: [
		],
		direction: "ltr",
		path: null,
		pathStartOffset: 0,
		pathSide: "left",
		pathAlign: "center",
		minWidth: 20,
		splitByGrapheme: true,
		id: "1a6b8d18-1037-486f-be5f-693bd50f8d60",
		selectable: true,
		hasControls: true
	}
];
var clipPath = {
	type: "rect",
	version: "5.3.0",
	originX: "left",
	originY: "top",
	left: 0,
	top: 0,
	width: 1242,
	height: 1660,
	fill: "#ffffff",
	stroke: null,
	strokeWidth: 1,
	strokeDashArray: null,
	strokeLineCap: "butt",
	strokeDashOffset: 0,
	strokeLineJoin: "miter",
	strokeUniform: true,
	strokeMiterLimit: 4,
	scaleX: 1,
	scaleY: 1,
	angle: 0,
	flipX: false,
	flipY: false,
	opacity: 1,
	shadow: null,
	visible: true,
	backgroundColor: "",
	fillRule: "nonzero",
	paintFirst: "stroke",
	globalCompositeOperation: "source-over",
	skewX: 0,
	skewY: 0,
	rx: 0,
	ry: 0,
	selectable: true,
	hasControls: true
};
var background = "#ddd";
var fabritor_schema_version = 3.1;
var DEMOJSON = {
	version: version,
	objects: objects,
	clipPath: clipPath,
	background: background,
	fabritor_schema_version: fabritor_schema_version
};

function Layer() {
    const { isReady, setReady, object: activeObject, setActiveObject, editor } = React.useContext(GlobalStateContext);
    const [layers, setLayers] = React.useState([]);
    const { t } = reactI18next.useTranslation();
    const getCanvasLayers = (objects) => {
        const _layers = [];
        const length = objects.length;
        if (!length) {
            setLayers([]);
            return;
        }
        const activeObject = editor === null || editor === void 0 ? void 0 : editor.canvas.getActiveObject();
        for (let i = length - 1; i >= 0; i--) {
            let object = objects[i];
            if (object && object.id !== SKETCH_ID) {
                if (activeObject === object) {
                    object.__cover = object.toDataURL();
                }
                else {
                    if (!object.__cover) {
                        object.__cover = object.toDataURL();
                    }
                }
                _layers.push({
                    cover: object.__cover,
                    group: object.type === 'group',
                    object
                });
            }
        }
        setLayers(_layers);
    };
    const loadDemo = async () => {
        setReady(false);
        await editor.loadFromJSON(DEMOJSON, true);
        editor.fhistory.reset();
        setReady(true);
        setActiveObject(null);
        editor.fireCustomModifiedEvent();
    };
    const handleItemClick = (item) => {
        editor.canvas.discardActiveObject();
        editor.canvas.setActiveObject(item.object);
        editor.canvas.requestRenderAll();
    };
    React.useEffect(() => {
        let canvas;
        const initCanvasLayers = () => { getCanvasLayers(canvas.getObjects()); };
        if (isReady) {
            setLayers([]);
            canvas = editor === null || editor === void 0 ? void 0 : editor.canvas;
            initCanvasLayers();
            canvas.on({
                'object:added': initCanvasLayers,
                'object:removed': initCanvasLayers,
                'object:modified': initCanvasLayers,
                'object:skewing': initCanvasLayers,
                'fabritor:object:modified': initCanvasLayers
            });
        }
        return () => {
            if (canvas) {
                canvas.off({
                    'object:added': initCanvasLayers,
                    'object:removed': initCanvasLayers,
                    'object:modified': initCanvasLayers,
                    'object:skewing': initCanvasLayers,
                    'fabritor:object:modified': initCanvasLayers
                });
            }
        };
    }, [isReady]);
    return (jsxRuntime.jsx("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: layers.length ?
            jsxRuntime.jsx(antd.List, { dataSource: layers, renderItem: (item) => (jsxRuntime.jsx(ContextMenu$1, Object.assign({ object: item.object, noCareOpen: true }, { children: jsxRuntime.jsx(antd.List.Item, Object.assign({ className: "fabritor-list-item", style: {
                            border: activeObject === item.object ? ' 2px solid #ff2222' : '2px solid transparent',
                            padding: '10px 16px'
                        }, onClick: () => { handleItemClick(item); } }, { children: jsxRuntime.jsxs(antd.Flex, Object.assign({ justify: "space-between", align: "center", style: { width: '100%', height: 40 } }, { children: [jsxRuntime.jsx("img", { src: item.cover, style: { maxWidth: 200, maxHeight: 34 } }), item.group ?
                                    jsxRuntime.jsx(icons.GroupOutlined, { style: { fontSize: 18, color: 'rgba(17, 23, 29, 0.6)' } }) : null] })) })) }))) }) :
            jsxRuntime.jsx(antd.Empty, { image: null, description: jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(icons.HeartTwoTone, { twoToneColor: "#eb2f96", style: { fontSize: 40 } }), jsxRuntime.jsx("p", Object.assign({ style: { color: '#aaa', fontSize: 16 } }, { children: t('panel.design.start') })), jsxRuntime.jsx(antd.Divider, {}), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: loadDemo }, { children: t('panel.design.start_demo') }))] }) }) })));
}

function AppSubPanel(props) {
    const { title, children, back } = props;
    const back2AppList = () => {
        back === null || back === void 0 ? void 0 : back();
    };
    return (jsxRuntime.jsx(antd.Card, Object.assign({ bordered: false, style: { marginLeft: -24, boxShadow: 'none' }, bodyStyle: { padding: 12 }, title: jsxRuntime.jsxs(antd.Flex, Object.assign({ justify: "space-between" }, { children: [jsxRuntime.jsx(icons.LeftOutlined, { onClick: back2AppList }), jsxRuntime.jsx("p", { children: title })] })) }, { children: children })));
}

const { Item: FormItem$c } = antd.Form;
function QRCodePanel(props) {
    const { back } = props;
    const [form] = antd.Form.useForm();
    const [form2] = antd.Form.useForm();
    const [QRCodeConfig, setQRCodeConfig] = React.useState({ value: 'https://myshell.ai/' });
    const qrRef = React.useRef(null);
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleValuesChange = (values) => {
        setQRCodeConfig(Object.assign(Object.assign({}, QRCodeConfig), values));
    };
    const add2Canvas = () => {
        if (!QRCodeConfig.value || !qrRef.current)
            return;
        const canvasEl = qrRef.current.querySelector('canvas');
        if (!canvasEl)
            return;
        const img = new Image();
        img.onload = () => {
            createImage({
                imageSource: img,
                canvas: editor.canvas
            });
        };
        img.src = canvasEl.toDataURL();
    };
    React.useEffect(() => {
        form.setFieldsValue({
            value: 'https://myshell.ai/',
            size: 160
        });
        form2.setFieldsValue({
            color: '#000000',
            bgColor: '#00000000',
            iconSize: 40,
            errorLevel: 'M'
        });
    }, []);
    return (jsxRuntime.jsxs(AppSubPanel, Object.assign({ title: t('panel.app.qrcode'), back: back }, { children: [jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange }, { children: [jsxRuntime.jsx(FormItem$c, Object.assign({ name: "value", label: t('common.text') }, { children: jsxRuntime.jsx(antd.Input, {}) })), jsxRuntime.jsx(FormItem$c, Object.assign({ name: "size", label: t('common.size') }, { children: jsxRuntime.jsx(antd.InputNumber, {}) }))] })), jsxRuntime.jsx(antd.Collapse, { items: [
                    {
                        key: '1',
                        label: t('panel.app.more'),
                        children: (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form2, onValuesChange: handleValuesChange }, { children: [jsxRuntime.jsx(FormItem$c, Object.assign({ name: "color", label: t('common.color') }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$c, Object.assign({ name: "bgColor", label: t('common.background_color') }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$c, Object.assign({ name: "errorLevel", label: t('panel.app.error_level') }, { children: jsxRuntime.jsx(antd.Radio.Group, { options: ['L', 'M', 'Q', 'H'] }) })), jsxRuntime.jsx(FormItem$c, Object.assign({ name: "icon", label: t('panel.app.image') }, { children: jsxRuntime.jsx(antd.Input, { placeholder: t('panel.app.only_image_url') }) })), jsxRuntime.jsx(FormItem$c, Object.assign({ name: "iconSize", label: t('panel.app.image_size') }, { children: jsxRuntime.jsx(antd.InputNumber, {}) }))] })))
                    }
                ] }), QRCodeConfig.value ?
                jsxRuntime.jsxs(antd.Flex, Object.assign({ vertical: true, align: "center", gap: 10, style: { marginTop: 16 }, ref: qrRef }, { children: [jsxRuntime.jsx(antd.QRCode, Object.assign({ type: "canvas" }, QRCodeConfig, { style: { maxWidth: 200 } })), jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", onClick: add2Canvas }, { children: t('panel.app.add') }))] })) : null] })));
}

function EmojiPanel(props) {
    const { back } = props;
    const { editor } = React.useContext(GlobalStateContext);
    const lng = 'en-US';
    const [emojiLocale, setEmojiLocale] = React.useState('en');
    const handleEmojiSelect = async (emoji) => {
        const object = editor.canvas.getActiveObject();
        if (object && object.type === 'textbox') {
            object.set('text', `${object.text}${emoji.native}`);
            editor.canvas.requestRenderAll();
        }
        else {
            const canvas = new fabric$1.fabric.Canvas('canvas');
            const text = new fabric$1.fabric.Text(emoji.native, {
                fontFamily: 'Arial',
                fontSize: 100
            });
            canvas.add(text);
            canvas.setWidth(100);
            canvas.setHeight(100);
            const img = new Image();
            img.onload = () => {
                createImage({
                    imageSource: img,
                    canvas: editor.canvas
                });
            };
            img.src = canvas.toDataURL();
        }
    };
    React.useEffect(() => {
        if ((lng.indexOf('en')) === 0) {
            setEmojiLocale('en');
        }
        else if ((lng.indexOf('zh')) === 0) {
            setEmojiLocale('zh');
        }
        else {
            setEmojiLocale(lng);
        }
    }, [lng]);
    return (jsxRuntime.jsx(AppSubPanel, Object.assign({ title: "Emoji", back: back }, { children: jsxRuntime.jsx(Picker__default.default, { data: data__default.default, perLine: 8, set: "native", locale: emojiLocale, emojiButtonSize: 30, emojiSize: 22, onEmojiSelect: handleEmojiSelect }) })));
}

const APP_LIST = [
    {
        title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.app.qrcode" }),
        key: 'qrcode',
        icon: jsxRuntime.jsx(icons.QrcodeOutlined, { style: { fontSize: 30 } })
    },
    {
        title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.app.emoji" }),
        key: 'emoji',
        icon: jsxRuntime.jsx(icons.SmileOutlined, { style: { fontSize: 30 } })
    }
];
function AppPanel() {
    const [app, setApp] = React.useState('');
    const handleAppClick = (item) => {
        setApp(item.key);
    };
    const back2List = () => { setApp(''); };
    const renderAppList = () => {
        return (jsxRuntime.jsx(antd.Flex, Object.assign({ wrap: "wrap", gap: 12, justify: "space-around", style: { padding: '16px 16px 16px 0', marginLeft: -8 } }, { children: APP_LIST.map(item => (jsxRuntime.jsx(antd.Card, Object.assign({ hoverable: true, style: { width: 120, paddingTop: 12 }, cover: item.icon, bodyStyle: { padding: 12 }, onClick: () => { handleAppClick(item); } }, { children: jsxRuntime.jsx(antd.Card.Meta, { description: item.title, style: { textAlign: 'center' } }) }), item.key))) })));
    };
    const renderApp = () => {
        if (app === 'qrcode') {
            return jsxRuntime.jsx(QRCodePanel, { back: back2List });
        }
        if (app === 'emoji') {
            return jsxRuntime.jsx(EmojiPanel, { back: back2List });
        }
        return null;
    };
    return (jsxRuntime.jsx("div", { children: app ? renderApp() : renderAppList() }));
}

const MAX_HISTORY_LENGTH = 100;
const PANEL_WIDTH = 360;
const SETTER_WIDTH = 280;

const { Sider: Sider$1 } = antd.Layout;
const siderStyle$1 = {
    position: 'relative',
    backgroundColor: '#fff',
    borderRight: '1px solid #e8e8e8'
};
const iconStyle = { fontSize: 18, marginRight: 0 };
const OBJECT_TYPES = [
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.design.title" }),
        value: 'design',
        icon: jsxRuntime.jsx(icons.AlertOutlined, { style: iconStyle })
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.title" }),
        value: 'text',
        icon: jsxRuntime.jsx(icons.FileTextOutlined, { style: iconStyle })
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.image.title" }),
        value: 'image',
        icon: jsxRuntime.jsx(icons.PictureOutlined, { style: iconStyle })
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.material.title" }),
        value: 'shape',
        icon: jsxRuntime.jsx(icons.BorderOutlined, { style: iconStyle })
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.paint.title" }),
        value: 'paint',
        icon: jsxRuntime.jsx(icons.BulbOutlined, { style: iconStyle })
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.app.title" }),
        value: 'app',
        icon: jsxRuntime.jsx(icons.AppstoreOutlined, { style: iconStyle })
    }
];
function Panel() {
    const { editor } = React.useContext(GlobalStateContext);
    const renderPanel = (value) => {
        if (value === 'design') {
            return jsxRuntime.jsx(Layer, {});
        }
        if (value === 'text') {
            return jsxRuntime.jsx(TextPanel, {});
        }
        if (value === 'image') {
            return jsxRuntime.jsx(ImagePanel, {});
        }
        if (value === 'shape') {
            return jsxRuntime.jsx(ShapePanel, {});
        }
        if (value === 'paint') {
            return jsxRuntime.jsx(PaintPanel, {});
        }
        if (value === 'app') {
            return jsxRuntime.jsx(AppPanel, {});
        }
        return null;
    };
    const renderLabel = (item) => {
        return (jsxRuntime.jsxs(antd.Flex, Object.assign({ vertical: true, justify: "center" }, { children: [jsxRuntime.jsx("div", { children: item.icon }), jsxRuntime.jsx("div", { children: item.label })] })));
    };
    const handleTabChange = (k) => {
        if (editor === null || editor === void 0 ? void 0 : editor.canvas) {
            if (k === 'paint') {
                editor.canvas.isDrawingMode = true;
            }
            else {
                editor.canvas.isDrawingMode = false;
            }
        }
    };
    return (jsxRuntime.jsx(Sider$1, Object.assign({ style: siderStyle$1, width: PANEL_WIDTH, className: "fabritor-sider" }, { children: jsxRuntime.jsx(antd.Tabs, { tabPosition: "left", style: { flex: 1, overflow: 'auto' }, size: "small", onChange: handleTabChange, items: OBJECT_TYPES.map((item) => {
                return {
                    label: renderLabel(item),
                    key: item.value,
                    children: renderPanel(item.value)
                };
            }) }) })));
}

const SizeInput = (props) => {
    const { t } = reactI18next.useTranslation();
    const { prefixText } = props, rest = __rest(props, ["prefixText"]);
    return (jsxRuntime.jsx(antd.InputNumber, Object.assign({ prefix: jsxRuntime.jsx("span", Object.assign({ style: { color: 'rgba(0, 0, 0, 0.5)', marginRight: 4 } }, { children: prefixText || t('setter.size.width') })), controls: false, changeOnBlur: true, min: 50, max: 8000, style: { flex: 1 } }, rest)));
};
function SizeSetter(props) {
    const { t } = reactI18next.useTranslation();
    const { value, onChange } = props;
    const [innerValue, setInnerValue] = React.useState([]);
    const handleChange = (v, index) => {
        const _innerValue = [...innerValue];
        _innerValue[index] = v;
        onChange === null || onChange === void 0 ? void 0 : onChange(_innerValue);
    };
    React.useEffect(() => {
        setInnerValue(value);
    }, [value]);
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ gap: 8 }, { children: [jsxRuntime.jsx(SizeInput, { value: innerValue === null || innerValue === void 0 ? void 0 : innerValue[0], onChange: (v) => { handleChange(v, 0); } }), jsxRuntime.jsx(SizeInput, { prefixText: t('setter.size.height'), value: innerValue === null || innerValue === void 0 ? void 0 : innerValue[1], onChange: (v) => { handleChange(v, 1); } })] })));
}

const { Item: FormItem$b } = antd.Form;
function SketchSetter() {
    const [form] = antd.Form.useForm();
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleFill = (_fill) => {
        const { sketch, canvas } = editor;
        let fill = transformColors2Fill(_fill);
        if (typeof fill !== 'string') {
            fill = new fabric$1.fabric.Gradient(fill);
        }
        sketch.set('fill', fill);
        canvas.requestRenderAll();
    };
    const handleValuesChange = (values) => {
        Object.keys(values).forEach((key) => {
            if (key === 'size') {
                editor.setSketchSize({ width: values[key][0], height: values[key][1] });
            }
            else if (key === 'fill') {
                handleFill(values[key]);
            }
        });
        editor.fireCustomModifiedEvent();
    };
    React.useEffect(() => {
        if (!editor)
            return;
        const { sketch } = editor;
        form.setFieldsValue({
            size: [sketch.width, sketch.height],
            fill: transformFill2Colors(sketch.fill)
        });
    }, [editor]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ layout: "vertical", colon: false, form: form, onValuesChange: handleValuesChange }, { children: [jsxRuntime.jsx(FormItem$b, Object.assign({ label: t('setter.sketch.size'), name: "size" }, { children: jsxRuntime.jsx(SizeSetter, {}) })), jsxRuntime.jsx(FormItem$b, Object.assign({ label: t('setter.sketch.fill'), name: "fill" }, { children: jsxRuntime.jsx(ColorSetter, { type: "sketch" }) }))] })));
}

const FONT_STYLES = [
    {
        icon: icons.BoldOutlined,
        value: 'bold'
    },
    {
        icon: icons.ItalicOutlined,
        value: 'italic'
    },
    {
        icon: icons.UnderlineOutlined,
        value: 'underline'
    },
    {
        icon: icons.StrikethroughOutlined,
        value: 'linethrough'
    }
];
function FontStylePanel(props) {
    const { value, onChange } = props;
    const handleClick = (v) => {
        onChange && onChange(Object.assign(Object.assign({}, value), { [v]: !value[v] }));
    };
    return (jsxRuntime.jsx(antd.Space.Compact, Object.assign({ block: true }, { children: FONT_STYLES.map(FONT_STYLE => (jsxRuntime.jsx(antd.Button, { style: { width: 46 }, icon: jsxRuntime.jsx(FONT_STYLE.icon, { style: {
                    color: (value === null || value === void 0 ? void 0 : value[FONT_STYLE.value]) ? '#1677ff' : ''
                } }), onClick: () => { handleClick(FONT_STYLE.value); } }, FONT_STYLE.value))) })));
}

const TEXT_ALIGN_LIST = [
    { label: jsxRuntime.jsx(icons.AlignLeftOutlined, {}), value: 'left' },
    { label: jsxRuntime.jsx(icons.AlignCenterOutlined, {}), value: 'center' },
    { label: jsxRuntime.jsx(icons.AlignRightOutlined, {}), value: 'right' }
];
function AlignSetter(props) {
    const { value } = props, rest = __rest(props, ["value"]);
    return (jsxRuntime.jsx(antd.Radio.Group, Object.assign({ value: value }, rest, { options: TEXT_ALIGN_LIST, optionType: "button", buttonStyle: "solid" })));
}

function FList(props) {
    const { dataSource, renderItemChildren } = props, rest = __rest(props, ["dataSource", "renderItemChildren"]);
    return (jsxRuntime.jsx(antd.List, Object.assign({ dataSource: dataSource, renderItem: (item) => (jsxRuntime.jsx(antd.List.Item, Object.assign({ className: "fabritor-list-item", style: {
                border: '2px solid transparent',
                padding: '10px 16px'
            }, onClick: () => { var _a; (_a = item === null || item === void 0 ? void 0 : item.onClick) === null || _a === void 0 ? void 0 : _a.call(item, item); } }, { children: jsxRuntime.jsx(Center, Object.assign({ style: { height: 40 } }, { children: renderItemChildren(item) })) }))) }, rest)));
}

function MoreConfigWrapper(props) {
    const { open, setOpen, title = '', children } = props, rest = __rest(props, ["open", "setOpen", "title", "children"]);
    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            document.body.scrollTop = 0;
        }
        else {
            document.body.style.overflow = 'auto';
        }
    }, [open]);
    return (jsxRuntime.jsx(antd.Drawer, Object.assign({ title: null, placement: "right", open: open, mask: false, maskClosable: false, width: SETTER_WIDTH, rootStyle: { top: 50, outline: 'none', }, contentWrapperStyle: { boxShadow: 'none' }, bodyStyle: { padding: 16 }, closeIcon: null }, rest, { children: jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(antd.Button, Object.assign({ type: "link", href: "javascript:void(0);", size: "small", onClick: () => { setOpen(false); }, icon: jsxRuntime.jsx(icons.LeftOutlined, {}), style: { marginLeft: -10 } }, { children: title })), children] }) })));
}

const { Item: FormItem$a } = antd.Form;
function TextShadow(props) {
    const [form] = antd.Form.useForm();
    const { value, onChange } = props;
    const { t } = reactI18next.useTranslation();
    const handleChange = (v) => {
        onChange && onChange(Object.assign(Object.assign({}, value), v));
    };
    React.useEffect(() => {
        if (value) {
            form.setFieldsValue(value);
        }
    }, [value]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$a, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.shadow') })) }), jsxRuntime.jsx(FormItem$a, Object.assign({ label: t('common.color'), name: "color" }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$a, Object.assign({ label: t('common.blur'), name: "blur" }, { children: jsxRuntime.jsx(antd.Slider, { min: 0, max: 20 }) })), jsxRuntime.jsx(FormItem$a, Object.assign({ label: t('common.offset'), name: "offset" }, { children: jsxRuntime.jsx(antd.Slider, { min: -180, max: 180 }) }))] })));
}

const { Item: FormItem$9 } = antd.Form;
function TextPath(props) {
    const [form] = antd.Form.useForm();
    const { value, onChange } = props;
    const { t } = reactI18next.useTranslation();
    const handleChange = (v) => {
        onChange && onChange(Object.assign(Object.assign({}, value), v));
    };
    React.useEffect(() => {
        if (value) {
            form.setFieldsValue(value);
        }
    }, [value]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 16 }, { children: [jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$9, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('setter.text.fx.text_path') })) }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$9, Object.assign({ name: "enable", valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, {}) })) })] })), jsxRuntime.jsx(FormItem$9, Object.assign({ label: t('common.offset'), name: "offset" }, { children: jsxRuntime.jsx(antd.Slider, { min: -100, max: 100 }) }))] })));
}

const { Item: FormItem$8 } = antd.Form;
function TextFx() {
    const [form] = antd.Form.useForm();
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleTextPattern = async (pattern) => {
        if (!object)
            return;
        if (!pattern.enable || !pattern.url) {
            if (object.fill instanceof fabric$1.fabric.Pattern) {
                object.set('fill', '#000000');
            }
            return Promise.resolve();
        }
        try {
            const img = await loadImageDom(pattern.url);
            object.set('fill', new fabric$1.fabric.Pattern({
                source: img,
                repeat: 'repeat'
            }));
        }
        catch (e) {
            console.log(e);
        }
    };
    const handleStroke = (_stroke) => {
        let stroke = transformColors2Fill(_stroke);
        if (typeof stroke !== 'string') {
            stroke = new fabric$1.fabric.Gradient(stroke);
        }
        object.set('stroke', stroke);
    };
    const handleFxValueChange = async (values) => {
        if (!object || !editor)
            return;
        const keys = Object.keys(values);
        for (let key of keys) {
            const v = values[key];
            if (key === 'shadow') {
                object.shadow = {
                    color: v.color,
                    blur: v.blur,
                    offsetX: v.offset,
                    offsetY: v.offset
                };
            }
            else if (key === 'path') {
                if (v.enable) {
                    drawTextPath(object, v.offset);
                }
                else {
                    removeTextPath(object);
                }
            }
            else if (key === 'pattern') {
                await handleTextPattern(v);
            }
            else if (key === 'stroke') {
                handleStroke(v);
            }
            else {
                object.set(key, v);
            }
        }
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
    };
    const initObjectFx = () => {
        var _a, _b, _c, _d;
        const fill = object.fill;
        form.setFieldsValue({
            stroke: transformFill2Colors(object.stroke),
            strokeWidth: object.strokeWidth || 0,
            textBackgroundColor: object.textBackgroundColor,
            shadow: {
                color: ((_a = object.shadow) === null || _a === void 0 ? void 0 : _a.color) || object.stroke || '#000000',
                blur: ((_b = object.shadow) === null || _b === void 0 ? void 0 : _b.blur) || 0,
                offset: ((_c = object.shadow) === null || _c === void 0 ? void 0 : _c.offsetX) || 0
            },
            path: {
                enable: !!object.path,
                offset: getPathOffset(object)
            },
            pattern: {
                enable: fill instanceof fabric$1.fabric.Pattern,
                url: (_d = fill === null || fill === void 0 ? void 0 : fill.source) === null || _d === void 0 ? void 0 : _d.src
            }
        });
    };
    React.useEffect(() => {
        if (object && object.type === 'f-text') {
            initObjectFx();
        }
    }, [object]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleFxValueChange, colon: false, style: { marginTop: 24 } }, { children: [jsxRuntime.jsx(FormItem$8, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.stroke') })) }), jsxRuntime.jsx(FormItem$8, Object.assign({ label: t('common.stroke_color'), name: "stroke" }, { children: jsxRuntime.jsx(ColorSetter, {}) })), jsxRuntime.jsx(FormItem$8, Object.assign({ label: t('common.stroke_width'), name: "strokeWidth" }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 20 }) })), jsxRuntime.jsx(FormItem$8, Object.assign({ name: "shadow", style: { marginBottom: 0 } }, { children: jsxRuntime.jsx(TextShadow, {}) })), jsxRuntime.jsx(FormItem$8, Object.assign({ name: "path", style: { marginBottom: 0 } }, { children: jsxRuntime.jsx(TextPath, {}) }))] })));
}

function Square3Stack3DIcon({
  title,
  titleId,
  ...props
}, svgRef) {
  return /*#__PURE__*/React__namespace.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    "aria-hidden": "true",
    "data-slot": "icon",
    ref: svgRef,
    "aria-labelledby": titleId
  }, props), title ? /*#__PURE__*/React__namespace.createElement("title", {
    id: titleId
  }, title) : null, /*#__PURE__*/React__namespace.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3"
  }));
}
const ForwardRef = /*#__PURE__*/ React__namespace.forwardRef(Square3Stack3DIcon);

const RefHelp = 'Will be replaced in Chat';
function RefLabel() {
    return (jsxRuntime.jsx(antd.Tooltip, Object.assign({ title: "In edit status, the canvas show your uploaded image and edited text. If you click Run, these will be replaced with the referenced variables in Chat." }, { children: jsxRuntime.jsxs(reactSystem.Flex, { children: [jsxRuntime.jsx(ForwardRef, { style: {
                        width: 18,
                        marginRight: 2
                    } }), "Ref"] }) })));
}
function RefSelect(props) {
    const model = inversifyReact.useInjection('ImageCanvasModel');
    const keyPath = model.convertValueFieldToRef(props.value);
    const variables = mobx.toJS(model.variables);
    return (jsxRuntime.jsx(antd.Dropdown, Object.assign({ menu: {
            onClick: (info) => {
                props.onChange(model.processWorkflowRunnerOutput(info.keyPath));
            },
            selectedKeys: keyPath,
            items: variables
        }, placement: "bottomRight", overlayStyle: {} }, { children: jsxRuntime.jsx(antd.Select, { options: [], dropdownRender: (originNode) => null, dropdownStyle: { display: 'none' }, value: model.getRefSelectDisplay(keyPath), placeholder: "Please select variable", onClear: () => props.onChange(undefined), allowClear: true }) })));
}

const { Item: FormItem$7 } = antd.Form;
function TextSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const [form] = antd.Form.useForm();
    const [openFx, setOpenFx] = React.useState(false);
    const { t } = reactI18next.useTranslation();
    const TEXT_ADVANCE_CONFIG = [
        {
            icon: jsxRuntime.jsx(icons.FunctionOutlined, { style: { fontSize: 22 } }),
            label: t('setter.text.fx.title'),
            key: 'fx',
            onClick: () => {
                setOpenFx(true);
            }
        }
    ];
    const handleFontStyles = (styles) => {
        object.set({
            fontWeight: (styles === null || styles === void 0 ? void 0 : styles.bold) ? 'bold' : 'normal',
            fontStyle: (styles === null || styles === void 0 ? void 0 : styles.italic) ? 'italic' : 'normal',
            underline: !!styles.underline,
            linethrough: !!styles.linethrough
        });
    };
    const handleFill = (_fill) => {
        let fill = transformColors2Fill(_fill);
        if (typeof fill !== 'string') {
            fill.gradientUnits = 'pixels';
            const { coords } = fill;
            fill.coords = {
                x1: coords.x1 === 1 ? object.width : 0,
                y1: coords.y1 === 1 ? object.height : 0,
                x2: coords.x2 === 1 ? object.width : 0,
                y2: coords.y2 === 1 ? object.height : 0,
                r1: 0,
                r2: object.width > object.height ? object.width / 2 : object.height
            };
        }
        if (typeof fill !== 'string') {
            fill = new fabric$1.fabric.Gradient(fill);
        }
        object.set({ fill });
    };
    const handleValuesChange = async (values) => {
        const keys = Object.keys(values);
        if (!(keys === null || keys === void 0 ? void 0 : keys.length))
            return;
        for (let key of keys) {
            if (key === 'fontStyles') {
                handleFontStyles(values[key]);
            }
            else if (key === 'fontFamily') {
                try {
                    await loadFont(values[key]);
                }
                finally {
                    object.set(key, values[key]);
                }
            }
            else if (key === 'fill') {
                handleFill(values[key]);
            }
            else {
                const selectedText = object.getSelectedText();
                if (selectedText && key === 'fill') {
                    object.setSelectionStyles({ fill: values[key] });
                }
                else {
                    object.set('styles', {});
                    object.set(key, values[key]);
                }
            }
            if (key !== 'fontSize' && key !== 'lineHeight' && key !== 'charSpacing') {
                editor.fireCustomModifiedEvent();
            }
        }
        editor.canvas.requestRenderAll();
    };
    React.useEffect(() => {
        form.setFieldsValue({
            ref: object.ref,
            fontFamily: object.fontFamily,
            fontSize: object.fontSize,
            fill: transformFill2Colors(object.fill),
            textAlign: object.textAlign,
            lineHeight: object.lineHeight,
            charSpacing: object.charSpacing,
            fontStyles: {
                bold: object.fontWeight === 'bold',
                italic: object.fontStyle === 'italic',
                underline: object.underline,
                linethrough: object.linethrough
            }
        });
    }, [object]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(antd.Form.Item, Object.assign({ name: "ref", help: RefHelp, label: jsxRuntime.jsx(RefLabel, {}) }, { children: jsxRuntime.jsx(RefSelect, { id: 'ref', objId: object['id'], value: form.getFieldValue('ref'), onChange: (val) => {
                                form.setFieldValue('ref', val);
                                object.set('ref', val);
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontFamily", label: t('setter.text.font_family') }, { children: jsxRuntime.jsx(antd.Select, { options: FONT_PRESET_FAMILY_LIST_GOOGLE_FONT, onDropdownVisibleChange: open => {
                                if (open) {
                                    void loadPresetGoogleFonts();
                                }
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontSize", label: t('setter.text.font_size') }, { children: jsxRuntime.jsx(SliderInputNumber, { max: 400, onChangeComplete: () => {
                                editor.fireCustomModifiedEvent();
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fill", label: t('setter.text.fill') }, { children: jsxRuntime.jsx(ColorSetter, { type: "fontColor", defaultColor: "#000000" }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "textAlign", label: t('setter.text.text_align') }, { children: jsxRuntime.jsx(AlignSetter, {}) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontStyles", label: t('setter.text.font_styles') }, { children: jsxRuntime.jsx(FontStylePanel, {}) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "charSpacing", label: t('setter.text.char_spacing') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: -200, max: 800, onChangeComplete: () => {
                                editor.fireCustomModifiedEvent();
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "lineHeight", label: t('setter.text.line_height') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0.5, max: 2.5, step: 0.01, onChangeComplete: () => {
                                editor.fireCustomModifiedEvent();
                            } }) }))] })), jsxRuntime.jsx(FList, { dataSource: TEXT_ADVANCE_CONFIG, renderItemChildren: (item) => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [item.icon, jsxRuntime.jsx("span", Object.assign({ style: {
                                fontSize: 16,
                                fontWeight: 'bold',
                                margin: '0 6px 0 10px'
                            } }, { children: item.label })), jsxRuntime.jsx(icons.RightOutlined, {})] })) }), jsxRuntime.jsx(MoreConfigWrapper, Object.assign({ open: openFx, setOpen: setOpenFx, title: `${t('panel.text.title')} ${t('setter.text.fx.title')}` }, { children: jsxRuntime.jsx(TextFx, {}) }))] }));
}

function ReplaceSetter(props) {
    const { t } = reactI18next.useTranslation();
    const { onChange } = props;
    return (jsxRuntime.jsx(antd.Popover, Object.assign({ content: jsxRuntime.jsx(ImageSelector, { size: "middle", type: "default", onChange: onChange }), placement: "top", trigger: "click" }, { children: jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, icon: jsxRuntime.jsx(icons.FileImageOutlined, {}) }, { children: t('setter.image.replace') })) })));
}

const { Item: FormItem$6 } = antd.Form;
const getObjectBorderType = ({ stroke, strokeWidth, strokeDashArray }) => {
    if (!stroke) {
        return 'none';
    }
    if (strokeDashArray === null || strokeDashArray === void 0 ? void 0 : strokeDashArray.length) {
        let [d1, d2] = strokeDashArray;
        d1 = d1 / (strokeWidth / 2 > 1 ? strokeWidth / 2 : strokeWidth);
        d2 = d2 / (strokeWidth / 4 > 1 ? strokeWidth / 4 : strokeWidth);
        return [d1, d2].join(',');
    }
    return 'line';
};
const getStrokeDashArray = ({ type, strokeWidth }) => {
    if (!type)
        return null;
    if (type !== 'line') {
        const dashArray = type.split(',');
        dashArray[0] = dashArray[0] * (strokeWidth / 2 > 1 ? strokeWidth / 2 : strokeWidth);
        dashArray[1] = dashArray[1] * (strokeWidth / 4 > 1 ? strokeWidth / 4 : strokeWidth);
        return dashArray;
    }
    return null;
};
const BORDER_TYPES = [
    {
        key: 'none',
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.071 19.071c-3.905 3.905-10.237 3.905-14.142 0-3.905-3.905-3.905-10.237 0-14.142 3.905-3.905 10.237-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142ZM5.482 17.457 17.457 5.482A8.5 8.5 0 0 0 5.482 17.457Zm1.06 1.06A8.501 8.501 0 0 0 18.519 6.544L6.543 18.518Z" fill="currentColor"></path></svg>'
    },
    {
        key: 'line',
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x2="24" y1="50%" y2="50%" stroke="currentColor" stroke-width="2" shape-rendering="crispEdges"></line></svg>'
    },
    {
        key: '12,2',
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="-1" x2="25" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="12 2" stroke-width="2" shape-rendering="crispEdges"></line></svg>'
    },
    {
        key: '6,2',
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="6 2" stroke-width="2" shape-rendering="crispEdges"></line></svg>'
    },
    {
        key: '2,2',
        svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="2 2" stroke-width="2" shape-rendering="crispEdges"></line></svg>'
    }
];
function BorderSetter(props) {
    const { value, onChange } = props;
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [form] = antd.Form.useForm();
    const handleChange = (v) => {
        onChange && onChange(Object.assign(Object.assign({}, value), v));
    };
    const fireEvent = () => {
        editor.fireCustomModifiedEvent();
    };
    React.useEffect(() => {
        form.setFieldsValue(value);
    }, [value]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$6, Object.assign({ name: "type", label: t('common.style'), labelCol: { span: 24 } }, { children: jsxRuntime.jsx(antd.Radio.Group, Object.assign({ onChange: fireEvent }, { children: BORDER_TYPES.map(item => (jsxRuntime.jsx(antd.Radio.Button, Object.assign({ value: item.key }, { children: jsxRuntime.jsx("span", { dangerouslySetInnerHTML: { __html: item.svg }, style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginTop: 6
                            } }) }), item.key))) })) })), jsxRuntime.jsx(FormItem$6, Object.assign({ name: "stroke", label: t('common.stroke_color') }, { children: jsxRuntime.jsx(SolidColorSetter, { onChange: fireEvent }) })), jsxRuntime.jsx(FormItem$6, Object.assign({ name: "strokeWidth", label: t('common.stroke_width') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 1, max: 100, onChangeComplete: fireEvent }) })), jsxRuntime.jsx(FormItem$6, Object.assign({ name: "borderRadius", label: t('common.round') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 200, onChangeComplete: fireEvent }) }))] })));
}

const COLOR_FILTER_LIST = [
    {
        label: '无',
        value: 'none',
        src: 'https://cdn.pixabay.com/photo/2017/02/15/13/18/girl-2068638_1280.jpg'
    },
    {
        label: '复古',
        value: 'Sepia',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/复古.png'
    },
    {
        label: '胶片',
        value: 'Kodachrome',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/胶片.png'
    },
    {
        label: '老照片',
        value: 'Vintage',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/老照片.png'
    },
    {
        label: '宝丽来',
        value: 'Polaroid',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/宝丽来.png'
    },
    {
        label: '模糊',
        value: 'Blur',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/模糊.png'
    },
    {
        label: '浮雕',
        value: 'Emboss',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/浮雕.png'
    },
    {
        label: '像素',
        value: 'Pixelate',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/像素.png'
    },
    {
        label: '黑白',
        value: 'Grayscale',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/黑白.png'
    },
    {
        label: '调色',
        value: 'HueRotation',
        src: 'https://raw.githubusercontent.com/sleepy-zone/fabritor-assets/main/images/调色.png'
    }
];
function RadioImageGroup(props) {
    const { value, onChange } = props;
    const handleChange = (v, key) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(Object.assign(Object.assign({}, value), { [key]: v }));
    };
    return (jsxRuntime.jsx("div", Object.assign({ className: "fabritor-radio-image-group" }, { children: COLOR_FILTER_LIST.map(option => (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-radio-image-group-item", onClick: () => { handleChange(option.value, 'type'); } }, { children: [jsxRuntime.jsx("div", Object.assign({ className: "fabritor-radio-image-group-img", style: { borderColor: (value === null || value === void 0 ? void 0 : value.type) === option.value ? '#ff2222' : '#eeeeee' } }, { children: jsxRuntime.jsx("img", { src: option.src }) })), jsxRuntime.jsx("span", { children: option.label }), option.value === 'Blur' && (value === null || value === void 0 ? void 0 : value.type) === 'Blur' ?
                    jsxRuntime.jsx(antd.Slider, { min: 0, max: 1, step: 0.01, value: (value === null || value === void 0 ? void 0 : value.param) == undefined ? 0.2 : value === null || value === void 0 ? void 0 : value.param, onChange: (v) => { handleChange(v, 'param'); } }) : null, option.value === 'Pixelate' && (value === null || value === void 0 ? void 0 : value.type) === 'Pixelate' ?
                    jsxRuntime.jsx(antd.Slider, { min: 2, max: 20, step: 0.01, value: (value === null || value === void 0 ? void 0 : value.param) == undefined ? 4 : value === null || value === void 0 ? void 0 : value.param, onChange: (v) => { handleChange(v, 'param'); } }) : null, option.value === 'HueRotation' && (value === null || value === void 0 ? void 0 : value.type) === 'HueRotation' ?
                    jsxRuntime.jsx(antd.Slider, { min: -2, max: 2, step: 0.002, value: (value === null || value === void 0 ? void 0 : value.param) == undefined ? 0 : value === null || value === void 0 ? void 0 : value.param, onChange: (v) => { handleChange(v, 'param'); } }) : null] })))) })));
}

const { Item: FormItem$5 } = antd.Form;
const handleFilterValue = (filter) => {
    if (!filter)
        return { type: 'none' };
    const { type } = filter;
    if (type === 'Blur') {
        return { type, param: filter.blur };
    }
    if (type === 'Pixelate') {
        return { type, param: filter.blocksize };
    }
    if (type === 'HueRotation') {
        return { type, param: filter.rotation };
    }
    return { type };
};
function ImageFx() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const [form] = antd.Form.useForm();
    const handleFxValueChange = (values) => {
        if (values.filter) {
            const { type, param } = values.filter;
            let filter;
            if (type === 'Emboss') {
                filter = new fabric$1.fabric.Image.filters.Convolute({
                    matrix: [1, 1, 1,
                        1, 0.7, -1,
                        -1, -1, -1]
                });
            }
            else if (type === 'none') {
                filter = null;
            }
            else {
                filter = new fabric$1.fabric.Image.filters[type]();
            }
            if (type === 'Blur') {
                filter.blur = param == undefined ? 0.2 : param;
            }
            if (type === 'Pixelate') {
                filter.blocksize = param == undefined ? 4 : param;
            }
            if (type === 'HueRotation') {
                filter.rotation = param == undefined ? 0 : param;
            }
            object.applyFilter(filter);
            object.canvas.requestRenderAll();
            editor.fireCustomModifiedEvent();
        }
    };
    const initImageFx = () => {
        const filter = object.getFilter();
        console.log(filter);
        form.setFieldsValue({
            filter: handleFilterValue(filter)
        });
    };
    React.useEffect(() => {
        if (object && object.type === 'f-image') {
            initImageFx();
        }
    }, [object]);
    return (jsxRuntime.jsx(antd.Form, Object.assign({ form: form, onValuesChange: handleFxValueChange }, { children: jsxRuntime.jsx(FormItem$5, Object.assign({ name: "filter" }, { children: jsxRuntime.jsx(RadioImageGroup, {}) })) })));
}

const { Item: FormItem$4 } = antd.Form;
function ImageSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [form] = antd.Form.useForm();
    const [openFx, setOpenFx] = React.useState(false);
    const IMAGE_ADVANCE_CONFIG = [
        {
            icon: jsxRuntime.jsx(icons.FunctionOutlined, { style: { fontSize: 22 } }),
            label: t('setter.image.filter'),
            key: 'fx',
            onClick: () => {
                setOpenFx(true);
            }
        }
    ];
    const handleImageReplace = (base64) => {
        if (base64) {
            object.setSrc(base64, () => {
                editor.canvas.requestRenderAll();
                editor.fireCustomModifiedEvent();
            });
        }
    };
    const handleBorder = (border) => {
        const { type, stroke = '#000000', strokeWidth, borderRadius } = border || {};
        if (type === 'none') {
            object.setBorder({
                stroke: null,
                borderRadius
            });
        }
        else {
            object.setBorder({
                stroke,
                strokeWidth,
                borderRadius,
                strokeDashArray: getStrokeDashArray(border)
            });
        }
        editor.canvas.requestRenderAll();
    };
    const handleValuesChange = (values) => {
        if (values.img) {
            handleImageReplace(values.img);
        }
        if (values.flip) {
            object.set(values.flip, !object[values.flip]);
            editor.canvas.requestRenderAll();
            editor.fireCustomModifiedEvent();
        }
        if (values.border) {
            handleBorder(values.border);
        }
    };
    React.useEffect(() => {
        if (object) {
            const border = object.getBorder();
            form.setFieldsValue({
                border: Object.assign(Object.assign({ type: getObjectBorderType(border) }, border), { stroke: border.stroke || '#000000' }),
                opacity: object.opacity,
                ref: object.ref,
            });
        }
    }, [object]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(antd.Form.Item, Object.assign({ name: "ref", help: RefHelp, label: jsxRuntime.jsx(RefLabel, {}) }, { children: jsxRuntime.jsx(RefSelect, { id: 'ref', objId: object['id'], value: form.getFieldValue('ref'), onChange: (val) => {
                                form.setFieldValue('ref', val);
                                object.set('ref', val);
                            } }) })), jsxRuntime.jsx(FormItem$4, Object.assign({ name: "img" }, { children: jsxRuntime.jsx(ReplaceSetter, {}) }))] })), jsxRuntime.jsx(FList, { dataSource: IMAGE_ADVANCE_CONFIG, renderItemChildren: (item) => (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [item.icon, jsxRuntime.jsx("span", Object.assign({ style: {
                                fontSize: 16,
                                fontWeight: 'bold',
                                margin: '0 6px 0 10px'
                            } }, { children: item.label })), jsxRuntime.jsx(icons.RightOutlined, {})] })) }), jsxRuntime.jsx(MoreConfigWrapper, Object.assign({ open: openFx, setOpen: setOpenFx, title: t('setter.image.filter') }, { children: jsxRuntime.jsx(ImageFx, {}) }))] }));
}

const { Item: FormItem$3 } = antd.Form;
const LINE_BORDER_TYPES = BORDER_TYPES.slice(1);
function LineSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [form] = antd.Form.useForm();
    const handleValuesChange = (values) => {
        const keys = Object.keys(values);
        if (!(keys === null || keys === void 0 ? void 0 : keys.length))
            return;
        for (let key of keys) {
            switch (key) {
                case 'stroke':
                    object.set('stroke', values[key]);
                    editor.fireCustomModifiedEvent();
                    break;
                case 'strokeWidth':
                    object.setStrokeWidth(values[key]);
                    break;
                case 'round':
                    object.set('strokeLineCap', values[key] ? 'round' : 'butt');
                    editor.fireCustomModifiedEvent();
                    break;
                case 'type':
                    object.set('strokeDashArray', getStrokeDashArray({ type: values[key], strokeWidth: object.strokeWidth }));
                    editor.fireCustomModifiedEvent();
                    break;
            }
        }
        object.setCoords();
        editor.canvas.requestRenderAll();
    };
    React.useEffect(() => {
        form.setFieldsValue({
            stroke: object.stroke || '#000000',
            type: getObjectBorderType(object),
            strokeWidth: object.strokeWidth,
            round: object.strokeLineCap === 'round'
        });
    }, [object]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$3, Object.assign({ name: "stroke", label: t('common.stroke_color') }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$3, Object.assign({ name: "type", label: t('common.style'), labelCol: { span: 24 } }, { children: jsxRuntime.jsx(antd.Radio.Group, { children: LINE_BORDER_TYPES.map(item => (jsxRuntime.jsx(antd.Radio.Button, Object.assign({ value: item.key }, { children: jsxRuntime.jsx("span", { dangerouslySetInnerHTML: { __html: item.svg }, style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginTop: 6
                            } }) }), item.key))) }) })), jsxRuntime.jsx(FormItem$3, Object.assign({ name: "strokeWidth", label: t('common.stroke_width') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 1, max: 50, onChangeComplete: () => { editor.fireCustomModifiedEvent(); } }) })), jsxRuntime.jsx(FormItem$3, Object.assign({ name: "round", label: t('common.round'), valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, {}) }))] })));
}

const { Item: FormItem$2 } = antd.Form;
function ShapeSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [form] = antd.Form.useForm();
    const handleBorder = (border) => {
        const { type, stroke = '#000', strokeWidth, borderRadius } = border || {};
        if (type === 'none') {
            object.set({ stroke: null, strokeWidth: 1 });
        }
        else {
            object.set({
                stroke,
                strokeWidth,
                strokeDashArray: getStrokeDashArray({ type, strokeWidth })
            });
        }
        if (object.type === 'rect') {
            object.set({
                rx: borderRadius,
                ry: borderRadius
            });
        }
        else {
            object.set('strokeLineJoin', borderRadius > 0 ? 'round' : 'miter');
        }
        object.setCoords();
        editor.canvas.requestRenderAll();
    };
    const handleValuesChange = (values) => {
        if (values.fill) {
            let fill = transformColors2Fill(values.fill);
            if (typeof fill !== 'string') {
                fill = new fabric$1.fabric.Gradient(fill);
            }
            object.set('fill', fill);
            editor.canvas.requestRenderAll();
        }
        if (values.border) {
            handleBorder(values.border);
        }
    };
    React.useEffect(() => {
        if (object) {
            form.setFieldsValue({
                border: {
                    type: getObjectBorderType(object),
                    stroke: object.stroke || '#000000',
                    strokeWidth: object.strokeWidth || 1,
                    borderRadius: object.rx || object.ry || (object.strokeLineJoin === 'round' ? 100 : 0)
                },
                fill: transformFill2Colors(object.fill)
            });
        }
    }, [object]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$2, Object.assign({ name: "fill", label: t('common.color') }, { children: jsxRuntime.jsx(ColorSetter, { defaultColor: "#000000" }) })), jsxRuntime.jsx(FormItem$2, Object.assign({ name: "border", label: jsxRuntime.jsx("span", Object.assign({ style: { fontWeight: 'bold', fontSize: 15 } }, { children: t('common.border') })), labelCol: { span: 24 } }, { children: jsxRuntime.jsx(BorderSetter, {}) }))] })));
}

function OpacitySetter(props) {
    const { value, onChange, onChangeComplete } = props;
    return (jsxRuntime.jsx(antd.Popover, Object.assign({ content: jsxRuntime.jsx(SliderInputNumber, { style: { width: 200 }, min: 0, max: 1, step: 0.01, value: value, onChange: onChange, onChangeComplete: onChangeComplete }), placement: "bottom", trigger: "click" }, { children: jsxRuntime.jsx("span", { children: jsxRuntime.jsx("svg", Object.assign({ xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", viewBox: "0 0 24 24" }, { children: jsxRuntime.jsxs("g", Object.assign({ fill: "currentColor", fillRule: "evenodd" }, { children: [jsxRuntime.jsx("path", { d: "M3 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z" }), jsxRuntime.jsx("path", { d: "M11 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z", opacity: ".45" }), jsxRuntime.jsx("path", { d: "M19 2h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z", opacity: ".15" }), jsxRuntime.jsx("path", { d: "M7 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z", opacity: ".7" }), jsxRuntime.jsx("path", { d: "M15 6h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z", opacity: ".3" })] })) })) }) })));
}

function ToolbarItem(props) {
    const { onClick, title, disabled, tooltipProps, children } = props;
    const handleClick = () => {
        if (!disabled) {
            onClick === null || onClick === void 0 ? void 0 : onClick();
        }
    };
    return (jsxRuntime.jsx(antd.Tooltip, Object.assign({ placement: "bottom", title: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 12 } }, { children: title })) }, tooltipProps, { children: jsxRuntime.jsx("span", Object.assign({ className: "fabritor-toolbar-item", style: {
                color: disabled ? '#cccccc' : 'rgba(0, 0, 0, 0.88)'
            }, onClick: handleClick }, { children: children })) })));
}

const items$1 = [
    {
        key: 'flipX',
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.flip_x" })
    },
    {
        key: 'flipY',
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.flip_y" })
    }
];
function FlipSetter(props) {
    const { onChange } = props;
    const onClick = ({ key }) => {
        onChange === null || onChange === void 0 ? void 0 : onChange(key);
    };
    return (jsxRuntime.jsx(antd.Dropdown, Object.assign({ placement: "bottom", trigger: ["click"], menu: { items: items$1, onClick }, arrow: true }, { children: jsxRuntime.jsx("span", { children: jsxRuntime.jsxs("svg", Object.assign({ width: "22", height: "22", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [jsxRuntime.jsx("path", { d: "M30 10H40C41.8856 10 42.8284 10 43.4142 10.5858C44 11.1716 44 12.1144 44 14V34C44 35.8856 44 36.8284 43.4142 37.4142C42.8284 38 41.8856 38 40 38H30", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", "stroke-linejoin": "miter" }), jsxRuntime.jsx("path", { d: "M18 10H8C6.11438 10 5.17157 10 4.58579 10.5858C4 11.1716 4 12.1144 4 14V34C4 35.8856 4 36.8284 4.58579 37.4142C5.17157 38 6.11438 38 8 38H18", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", "stroke-linejoin": "miter" }), jsxRuntime.jsx("path", { d: "M24 6V42", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", "stroke-linejoin": "miter" })] })) }) })));
}

const { Item: FormItem$1 } = antd.Form;
const PxInputNumber = (props) => {
    const { value, onChange } = props, rest = __rest(props, ["value", "onChange"]);
    const [innerValue, setInnerValue] = React.useState(value);
    React.useEffect(() => {
        setInnerValue(value);
    }, [value]);
    return (jsxRuntime.jsx(antd.InputNumber, Object.assign({ style: { width: '100%' }, controls: false, step: 1, precision: 2, changeOnBlur: true, value: innerValue, onChange: setInnerValue, onPressEnter: () => { onChange === null || onChange === void 0 ? void 0 : onChange(innerValue); } }, rest)));
};
const noScaledSizeTypes = ['textbox', 'f-text', 'rect'];
function PositionSetter() {
    const { editor, object } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [showMore, setShowMore] = React.useState(false);
    const isNoScaledSizeTypeRef = React.useRef(false);
    const [form] = antd.Form.useForm();
    const handleSize = (key, value) => {
        const realValue = value - object.strokeWidth;
        if (key === 'width') {
            if (isNoScaledSizeTypeRef.current) {
                object.set({
                    width: realValue,
                    scaleX: 1,
                    scaleY: 1
                });
            }
            else {
                object.scaleToWidth(realValue, true);
            }
        }
        else if (key === 'height') {
            if (isNoScaledSizeTypeRef.current) {
                object.set({
                    height: realValue,
                    scaleX: 1,
                    scaleY: 1
                });
            }
            else {
                object.scaleToHeight(realValue, true);
            }
        }
    };
    const handleChange = (values) => {
        Object.keys(values).forEach(key => {
            const value = values[key];
            if (key === 'width' || key === 'height') {
                handleSize(key, value);
                setFormData();
            }
            else {
                object.set(key, value);
            }
        });
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
    };
    const setFormData = () => {
        form.setFieldsValue({
            width: object.getScaledWidth(),
            height: object.getScaledHeight(),
            lockRatio: true,
            left: object.left,
            top: object.top,
            angle: object.angle
        });
    };
    const handleModified = () => {
        setFormData();
    };
    const init = () => {
        isNoScaledSizeTypeRef.current = noScaledSizeTypes.includes(object.type);
        setFormData();
        object.on('modified', handleModified);
        return () => {
            object.off('modified', handleModified);
        };
    };
    React.useEffect(() => {
        if (showMore && object && !object.group || object.type !== 'activeSelection') {
            init();
        }
    }, [object, showMore]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(antd.Button, Object.assign({ block: true, onClick: () => { setShowMore(true); } }, { children: t('setter.common.adjust_position') })), jsxRuntime.jsx(MoreConfigWrapper, Object.assign({ open: showMore, setOpen: setShowMore, title: t('setter.common.adjust_position') }, { children: jsxRuntime.jsx("div", Object.assign({ style: { marginTop: 24 } }, { children: jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, layout: "vertical", colon: false, onValuesChange: handleChange }, { children: [jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 8 }, { children: [jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: `${t('setter.size.width')}(${t('setter.common.px')})`, name: "width" }, { children: jsxRuntime.jsx(PxInputNumber, { min: 1 }) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: `${t('setter.size.height')}(${t('setter.common.px')})`, name: "height" }, { children: jsxRuntime.jsx(PxInputNumber, { min: 1 }) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('setter.common.lock_ratio'), name: "lockRatio", valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, { disabled: true }) })) }))] })), jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 8 }, { children: [jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: `X(${t('setter.common.px')})`, name: "left" }, { children: jsxRuntime.jsx(PxInputNumber, {}) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: `Y(${t('setter.common.px')})`, name: "top" }, { children: jsxRuntime.jsx(PxInputNumber, {}) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$1, Object.assign({ label: `${t('setter.common.rotate')}(°)`, name: "angle" }, { children: jsxRuntime.jsx(PxInputNumber, { min: -360, max: 360, precision: 0 }) })) }))] }))] })) })) }))] }));
}

const ALIGH_TYPES = [
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.center" }),
        icon: icons.PicCenterOutlined,
        key: 'center'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.align_left" }),
        icon: icons.AlignLeftOutlined,
        key: 'left'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.center_h" }),
        icon: icons.AlignCenterOutlined,
        key: 'centerH'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.align_right" }),
        icon: icons.AlignRightOutlined,
        key: 'right'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.align_top" }),
        icon: icons.VerticalAlignTopOutlined,
        key: 'top'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.center_v" }),
        icon: icons.VerticalAlignMiddleOutlined,
        key: 'centerV'
    },
    {
        label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "setter.common.align_bottom" }),
        icon: icons.VerticalAlignBottomOutlined,
        key: 'bottom'
    }
];
function CommonSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [lock, setLock] = React.useState(false);
    const [opacity, setOpacity] = React.useState(1);
    const handleLock = () => {
        object.set({
            lockMovementX: !lock,
            lockMovementY: !lock,
            hasControls: !!lock
        });
        editor.canvas.requestRenderAll();
        setLock(!lock);
        editor.fireCustomModifiedEvent();
    };
    const handleOpacity = (v) => {
        object.set('opacity', v);
        setOpacity(v);
        editor.canvas.requestRenderAll();
    };
    const handleFlip = (key) => {
        object.set(key, !object[key]);
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
    };
    const alignObject = (alignType) => {
        switch (alignType) {
            case 'center':
                editor.canvas.viewportCenterObject(object);
                object.setCoords();
                break;
            case 'left':
                object.set('left', 0);
                break;
            case 'centerH':
                editor.canvas.viewportCenterObjectH(object);
                object.setCoords();
                break;
            case 'right':
                object.set('left', editor.sketch.width - object.width);
                break;
            case 'top':
                object.set('top', 0);
                break;
            case 'centerV':
                editor.canvas.viewportCenterObjectV(object);
                object.setCoords();
                break;
            case 'bottom':
                object.set('top', editor.sketch.height - object.height);
                break;
        }
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
    };
    React.useEffect(() => {
        if (object) {
            setLock(object.lockMovementX);
            setOpacity(object.opacity);
        }
    }, [object]);
    if (!object || object.id === SKETCH_ID)
        return null;
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(CenterV, Object.assign({ height: 30, gap: 8, justify: "space-between" }, { children: [jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, onClick: handleLock, title: lock ? t('setter.common.unlock') : t('setter.common.lock') }, { children: lock ?
                            jsxRuntime.jsx(icons.UnlockOutlined, { style: { fontSize: 20 } }) :
                            jsxRuntime.jsx(icons.LockOutlined, { style: { fontSize: 20 } }) })), jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, title: t('setter.common.opacity') }, { children: jsxRuntime.jsx(OpacitySetter, { value: opacity, onChange: handleOpacity, onChangeComplete: () => { editor.fireCustomModifiedEvent(); } }) })), jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, title: t('setter.common.create_a_copy'), onClick: async () => {
                            await copyObject(editor.canvas, object);
                            await pasteObject(editor.canvas);
                        } }, { children: jsxRuntime.jsx(icons.CopyOutlined, { style: { fontSize: 20 } }) })), jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, title: t('setter.common.del'), onClick: () => { removeObject(null, editor.canvas); } }, { children: jsxRuntime.jsx(icons.DeleteOutlined, { style: { fontSize: 20 } }) })), object.type === 'f-image' ?
                        jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, title: t('setter.common.flip') }, { children: jsxRuntime.jsx(FlipSetter, { onChange: handleFlip }) })) : null] })), jsxRuntime.jsx(antd.Divider, { style: { margin: '16px 0' } }), jsxRuntime.jsx("span", Object.assign({ style: { fontWeight: 'bold' } }, { children: t('setter.common.align') })), jsxRuntime.jsx(CenterV, Object.assign({ height: 30, gap: 8, justify: "space-between", style: { marginTop: 16 } }, { children: ALIGH_TYPES.map(item => (jsxRuntime.jsx(ToolbarItem, Object.assign({ tooltipProps: { placement: 'top' }, title: item.label, onClick: () => { alignObject(item.key); } }, { children: jsxRuntime.jsx(item.icon, { style: { fontSize: 20 } }) }), item.key))) })), jsxRuntime.jsx(antd.Divider, { style: { margin: '16px 0' } }), jsxRuntime.jsx(PositionSetter, {})] }));
}

function GroupSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    if (!object || (object.type !== 'group' && object.type !== 'activeSelection'))
        return null;
    return (jsxRuntime.jsx("div", { children: object.type === 'group' ?
            jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, onClick: () => { ungroup(editor.canvas, object); } }, { children: t('setter.group.ung') })) :
            jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, onClick: () => { groupSelection(editor.canvas, object); } }, { children: t('setter.group.g') })) }));
}

function PathSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const [value, setValue] = React.useState({});
    const handleChange = (values) => {
        if (values.color) {
            object.set('stroke', values.color);
        }
        if (values.width) {
            object.set('strokeWidth', values.width);
        }
        if (values.fill) {
            let fill = transformColors2Fill(values.fill);
            if (typeof fill !== 'string') {
                fill = new fabric$1.fabric.Gradient(fill);
            }
            object.set('fill', fill);
        }
        if (values.shadow) {
            const shadow = object.shadow;
            const originalShadowObject = shadow ? shadow.toObject() : {};
            const newShadowObject = {
                blur: values.shadow.width || originalShadowObject.blur,
                offsetX: values.shadow.offset || originalShadowObject.offsetX,
                offsetY: values.shadow.offset || originalShadowObject.offsetY,
                affectStroke: true,
                color: values.shadow.color || originalShadowObject.color || '#000000',
            };
            object.set('shadow', new fabric$1.fabric.Shadow(newShadowObject));
        }
        editor.canvas.requestRenderAll();
    };
    React.useEffect(() => {
        if (object) {
            const shadow = object.shadow;
            setValue({
                color: object.stroke,
                width: object.strokeWidth,
                fill: transformFill2Colors(object.fill || '#ffffff'),
                shadow: {
                    color: (shadow === null || shadow === void 0 ? void 0 : shadow.color) || '#000000',
                    width: (shadow === null || shadow === void 0 ? void 0 : shadow.blur) || 0,
                    offset: (shadow === null || shadow === void 0 ? void 0 : shadow.offsetX) || 0
                }
            });
        }
    }, [object]);
    if (!object || object.type !== 'path')
        return null;
    return (jsxRuntime.jsx(PathSetterForm, { showFillConfig: object === null || object === void 0 ? void 0 : object.sub_type, shouldFireEvent: true, value: value, onChange: handleChange }));
}

const { Item: FormItem } = antd.Form;
function RoughSetter() {
    const [form] = antd.Form.useForm();
    const { editor, object } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleValuesChange = (values) => {
        Object.keys(values).forEach((key) => {
            if (object.type === 'path') {
                object.set('stroke', values[key]);
            }
            else {
                const _objects = object.getObjects();
                if (key === 'stroke') {
                    _objects[1].set('stroke', values[key]);
                }
                else if (key === 'fill') {
                    _objects[0].set('stroke', values[key]);
                }
            }
        });
        editor.canvas.requestRenderAll();
        editor.fireCustomModifiedEvent();
    };
    React.useEffect(() => {
        if (object === null || object === void 0 ? void 0 : object.sub_type) {
            if (object.type === 'path') {
                form.setFieldsValue({
                    stroke: object.stroke
                });
            }
            else {
                const _objects = object.getObjects();
                form.setFieldsValue({
                    stroke: _objects[1].stroke,
                    fill: _objects[0].stroke
                });
            }
        }
    }, [editor]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ colon: false, form: form, onValuesChange: handleValuesChange }, { children: [jsxRuntime.jsx(FormItem, Object.assign({ label: t('common.stroke'), name: "stroke" }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), (object === null || object === void 0 ? void 0 : object.type) === 'group' ?
                jsxRuntime.jsx(FormItem, Object.assign({ label: t('common.fill'), name: "fill" }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })) : null] })));
}

function ToolbarDivider() {
    return (jsxRuntime.jsx(antd.Divider, { type: "vertical", style: { height: 32 } }));
}

const i18nKeySuffix$1 = 'header.export';
const items = ['jpg', 'png', 'svg', 'json', 'divider', 'clipboard']
    .map(item => item === 'divider' ? ({ type: 'divider' }) : ({
    key: item,
    label: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix$1}.${item}` })
}));
function ExportModify() {
    inversifyReact.useInjection('ImageCanvasModel');
    const { editor, setReady, setActiveObject } = React.useContext(GlobalStateContext);
    const localFileSelectorRef = React.useRef();
    const { t } = reactI18next.useTranslation();
    const selectJsonFile = () => {
        var _a, _b;
        (_b = (_a = localFileSelectorRef.current) === null || _a === void 0 ? void 0 : _a.start) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const handleFileChange = (file) => {
        setReady(false);
        const reader = new FileReader();
        reader.onload = (async (evt) => {
            var _a;
            const json = (_a = evt.target) === null || _a === void 0 ? void 0 : _a.result;
            if (json) {
                await editor.loadFromJSON(json, true);
                editor.fhistory.reset();
                setReady(true);
                setActiveObject(null);
                editor.fireCustomModifiedEvent();
            }
        });
        reader.readAsText(file);
    };
    const copyImage = async () => {
        try {
            const png = editor.export2Img({ format: 'png' });
            const blob = await base64ToBlob(png);
            await navigator.clipboard.write([
                new ClipboardItem({
                    'image/png': blob
                })
            ]);
            antd.message.success(t(`${i18nKeySuffix$1}.copy_success`));
        }
        catch (e) {
            antd.message.error(t(`${i18nKeySuffix$1}.copy_fail`));
        }
    };
    const handleClick = ({ key }) => {
        const { sketch } = editor;
        const name = sketch.fabritor_desc;
        switch (key) {
            case 'png':
                const png = editor.export2Img({ format: 'png' });
                downloadFile(png, 'png', name);
                break;
            case 'jpg':
                const jpg = editor.export2Img({ format: 'jpeg' });
                downloadFile(jpg, 'jpg', name);
                break;
            case 'svg':
                const svg = editor.export2Svg();
                downloadFile(svg, 'svg', name);
                break;
            case 'json':
                const json = editor.canvas2Json();
                downloadFile(`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json, null, 2))}`, 'json', name);
                break;
            case 'clipboard':
                copyImage();
                break;
        }
    };
    return (jsxRuntime.jsxs(CenterV, Object.assign({ justify: "flex-end", gap: 16, style: {
            paddingRight: 16
        } }, { children: [jsxRuntime.jsx(icons.FileOutlined, { style: { fontSize: 18 }, onClick: selectJsonFile }), jsxRuntime.jsx(antd.Dropdown, Object.assign({ menu: {
                    items,
                    onClick: handleClick
                }, arrow: { pointAtCenter: true }, placement: "bottom" }, { children: jsxRuntime.jsx(icons.ExportOutlined, { style: { fontSize: 18 } }) })), jsxRuntime.jsx(LocalFileSelector$1, { accept: "application/json", ref: localFileSelectorRef, onChange: handleFileChange })] })));
}

const i18nKeySuffix = 'header.toolbar';
function Toolbar() {
    const { setActiveObject, editor } = React.useContext(GlobalStateContext);
    const [panEnable, setPanEnable] = React.useState(false);
    const [canUndo, setCanUndo] = React.useState(false);
    const [canRedo, setCanRedo] = React.useState(false);
    const clearCanvas = () => {
        antd.Modal.confirm({
            title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.clear_confirm` }),
            icon: jsxRuntime.jsx(icons.ExclamationCircleFilled, {}),
            async onOk() {
                await editor.clearCanvas();
                setActiveObject(editor.sketch);
                editor.fireCustomModifiedEvent();
            }
        });
    };
    const enablePan = () => {
        const enable = editor.switchEnablePan();
        setPanEnable(enable);
    };
    React.useEffect(() => {
        if (editor) {
            setCanUndo(editor.fhistory.canUndo());
            setCanRedo(editor.fhistory.canRedo());
        }
    });
    return (jsxRuntime.jsxs(CenterV, Object.assign({ gap: 4, style: {
            borderBottom: '1px solid #e8e8e8',
            padding: 12
        } }, { children: [jsxRuntime.jsx(ToolbarItem, Object.assign({ disabled: !canUndo, title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.undo` }), onClick: () => {
                    editor.fhistory.undo();
                } }, { children: jsxRuntime.jsx(icons.UndoOutlined, { style: { fontSize: 20 } }) })), jsxRuntime.jsx(ToolbarItem, Object.assign({ disabled: !canRedo, title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.redo` }), onClick: () => {
                    editor.fhistory.redo();
                } }, { children: jsxRuntime.jsx(icons.RedoOutlined, { style: { fontSize: 20 } }) })), jsxRuntime.jsx(ToolbarDivider, {}), jsxRuntime.jsx(ToolbarItem, Object.assign({ onClick: enablePan, title: panEnable ? jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.select` }) : jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.pan` }) }, { children: panEnable ?
                    jsxRuntime.jsx(icons.DragOutlined, { style: {
                            fontSize: 22,
                            color: panEnable ? '#000' : '#ccc'
                        } }) :
                    jsxRuntime.jsx("img", { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAG_ICON)}`, style: {
                            width: 22,
                            height: 22
                        } }) })), jsxRuntime.jsx(ToolbarItem, Object.assign({ onClick: clearCanvas, title: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: `${i18nKeySuffix}.clear` }) }, { children: jsxRuntime.jsx(icons.ClearOutlined, { style: { fontSize: 20 } }) })), jsxRuntime.jsx(ToolbarDivider, {}), jsxRuntime.jsx(ExportModify, {})] })));
}

const { Sider } = antd.Layout;
const { Title } = antd.Typography;
const siderStyle = {
    position: 'relative',
    backgroundColor: '#fff',
    borderLeft: '1px solid #e8e8e8'
};
function Setter() {
    var _a;
    const { object, isReady } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const objectType = ((_a = object === null || object === void 0 ? void 0 : object.get) === null || _a === void 0 ? void 0 : _a.call(object, 'type')) || '';
    const getRenderSetter = () => {
        if (!isReady)
            return null;
        if (!object || object.id === SKETCH_ID)
            return jsxRuntime.jsx(SketchSetter, {});
        switch (objectType) {
            case 'textbox':
            case 'f-text':
                return jsxRuntime.jsx(TextSetter, {});
            case 'rect':
            case 'circle':
            case 'triangle':
            case 'polygon':
            case 'ellipse':
                return jsxRuntime.jsx(ShapeSetter, {});
            case 'f-line':
            case 'f-arrow':
            case 'f-tri-arrow':
                return jsxRuntime.jsx(LineSetter, {});
            case 'f-image':
                return jsxRuntime.jsx(ImageSetter, {});
            case 'path':
                if ((object === null || object === void 0 ? void 0 : object.sub_type) === 'rough') {
                    return jsxRuntime.jsx(RoughSetter, {});
                }
                return jsxRuntime.jsx(PathSetter, {});
            case 'group':
                if ((object === null || object === void 0 ? void 0 : object.sub_type) === 'rough') {
                    return jsxRuntime.jsx(RoughSetter, {});
                }
                return jsxRuntime.jsx(GroupSetter, {});
            case 'activeSelection':
                return jsxRuntime.jsx(GroupSetter, {});
            default:
                return null;
        }
    };
    const renderSetter = () => {
        const Setter = getRenderSetter();
        if (Setter) {
            return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [Setter, jsxRuntime.jsx(antd.Divider, {})] }));
        }
        return null;
    };
    const getSetterTitle = () => {
        if (!isReady)
            return null;
        if (!object || object.id === SKETCH_ID)
            return t('setter.sketch.title');
        switch (objectType) {
            case 'textbox':
            case 'f-text':
                return t('panel.text.title');
            case 'rect':
            case 'circle':
            case 'triangle':
            case 'polygon':
            case 'ellipse':
                return t('panel.material.shape');
            case 'line':
            case 'f-line':
            case 'f-arrow':
            case 'f-tri-arrow':
                return t('panel.material.line');
            case 'f-image':
            case 'image':
                return t('panel.image.title');
            case 'path':
                if (object === null || object === void 0 ? void 0 : object.sub_type) {
                    if ((object === null || object === void 0 ? void 0 : object.sub_type) === 'rough') {
                        return t('panel.material.hand_drawn');
                    }
                    return t('panel.material.shape');
                }
                return t('panel.paint.title');
            case 'group':
                if ((object === null || object === void 0 ? void 0 : object.sub_type) === 'rough') {
                    return t('panel.material.hand_drawn');
                }
                return t('setter.group.title');
            case 'activeSelection':
                return t('setter.group.title');
            default:
                return t('setter.sketch.title');
        }
    };
    const renderSetterTitle = () => {
        const title = getSetterTitle();
        if (!title) {
            return null;
        }
        return (jsxRuntime.jsx(CenterV, Object.assign({ style: {
                borderBottom: '1px solid #e8e8e8',
                paddingLeft: 16
            } }, { children: jsxRuntime.jsx(Title, Object.assign({ level: 5 }, { children: getSetterTitle() })) })));
    };
    return (jsxRuntime.jsxs(Sider, Object.assign({ style: siderStyle, width: SETTER_WIDTH, className: "fabritor-sider" }, { children: [jsxRuntime.jsx(Toolbar, {}), renderSetterTitle(), jsxRuntime.jsxs("div", Object.assign({ style: {
                    padding: 16,
                    overflow: 'auto'
                } }, { children: [renderSetter(), jsxRuntime.jsx(CommonSetter, {})] }))] })));
}

const initObjectPrototype = () => {
    {
        fabric$1.fabric.Image.prototype.needsItsOwnCache = () => false;
        fabric$1.fabric.perfLimitSizeTotal = 16777216;
    }
    Object.keys(OBJECT_DEFAULT_CONFIG).forEach(key => {
        fabric$1.fabric.Object.prototype[key] = OBJECT_DEFAULT_CONFIG[key];
    });
    const asConfig = {
        borderColor: '#cccddd',
        borderDashArray: [7, 10],
        borderScaleFactor: 3,
        padding: 10
    };
    Object.keys(asConfig).forEach(key => {
        fabric$1.fabric.ActiveSelection.prototype[key] = asConfig[key];
        fabric$1.fabric.Group.prototype[key] = asConfig[key];
    });
    fabric$1.fabric.Group.prototype.subTargetCheck = true;
};

function initAligningGuidelines(canvas) {
    var ctx = canvas.getSelectionContext(), aligningLineOffset = 5, aligningLineMargin = 4, aligningLineWidth = 1, aligningLineColor = 'rgb(0,255,0)', viewportTransform, zoom = 1;
    function drawVerticalLine(coords) {
        drawLine(coords.x + 0.5, coords.y1 > coords.y2 ? coords.y2 : coords.y1, coords.x + 0.5, coords.y2 > coords.y1 ? coords.y2 : coords.y1);
    }
    function drawHorizontalLine(coords) {
        drawLine(coords.x1 > coords.x2 ? coords.x2 : coords.x1, coords.y + 0.5, coords.x2 > coords.x1 ? coords.x2 : coords.x1, coords.y + 0.5);
    }
    function drawLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.lineWidth = aligningLineWidth;
        ctx.strokeStyle = aligningLineColor;
        ctx.beginPath();
        ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
        ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
        ctx.stroke();
        ctx.restore();
    }
    function isInRange(value1, value2) {
        value1 = Math.round(value1);
        value2 = Math.round(value2);
        for (var i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
            if (i === value2) {
                return true;
            }
        }
        return false;
    }
    var verticalLines = [], horizontalLines = [];
    canvas.on('mouse:down', function () {
        viewportTransform = canvas.viewportTransform;
        zoom = canvas.getZoom();
    });
    canvas.on('object:moving', function (e) {
        var activeObject = e.target, canvasObjects = canvas.getObjects(), activeObjectCenter = activeObject.getCenterPoint(), activeObjectLeft = activeObjectCenter.x, activeObjectTop = activeObjectCenter.y, activeObjectBoundingRect = activeObject.getBoundingRect(), activeObjectHeight = activeObjectBoundingRect.height / viewportTransform[3], activeObjectWidth = activeObjectBoundingRect.width / viewportTransform[0], horizontalInTheRange = false, verticalInTheRange = false, transform = canvas._currentTransform;
        if (!transform)
            return;
        for (var i = canvasObjects.length; i--;) {
            if (canvasObjects[i] === activeObject)
                continue;
            var objectCenter = canvasObjects[i].getCenterPoint(), objectLeft = objectCenter.x, objectTop = objectCenter.y, objectBoundingRect = canvasObjects[i].getBoundingRect(), objectHeight = objectBoundingRect.height / viewportTransform[3], objectWidth = objectBoundingRect.width / viewportTransform[0];
            if (isInRange(objectLeft, activeObjectLeft)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft, activeObjectTop), 'center', 'center');
            }
            if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft - objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft - objectWidth / 2 + activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }
            if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
                verticalInTheRange = true;
                verticalLines.push({
                    x: objectLeft + objectWidth / 2,
                    y1: (objectTop < activeObjectTop)
                        ? (objectTop - objectHeight / 2 - aligningLineOffset)
                        : (objectTop + objectHeight / 2 + aligningLineOffset),
                    y2: (activeObjectTop > objectTop)
                        ? (activeObjectTop + activeObjectHeight / 2 + aligningLineOffset)
                        : (activeObjectTop - activeObjectHeight / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(objectLeft + objectWidth / 2 - activeObjectWidth / 2, activeObjectTop), 'center', 'center');
            }
            if (isInRange(objectTop, activeObjectTop)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop), 'center', 'center');
            }
            if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop - objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop - objectHeight / 2 + activeObjectHeight / 2), 'center', 'center');
            }
            if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
                horizontalInTheRange = true;
                horizontalLines.push({
                    y: objectTop + objectHeight / 2,
                    x1: (objectLeft < activeObjectLeft)
                        ? (objectLeft - objectWidth / 2 - aligningLineOffset)
                        : (objectLeft + objectWidth / 2 + aligningLineOffset),
                    x2: (activeObjectLeft > objectLeft)
                        ? (activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset)
                        : (activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset)
                });
                activeObject.setPositionByOrigin(new fabric.Point(activeObjectLeft, objectTop + objectHeight / 2 - activeObjectHeight / 2), 'center', 'center');
            }
        }
        if (!horizontalInTheRange) {
            horizontalLines.length = 0;
        }
        if (!verticalInTheRange) {
            verticalLines.length = 0;
        }
    });
    canvas.on('before:render', function () {
        const ct = canvas.contextTop;
        if (ct)
            canvas.clearContext(canvas.contextTop);
    });
    canvas.on('after:render', function () {
        for (var i = verticalLines.length; i--;) {
            drawVerticalLine(verticalLines[i]);
        }
        for (var i = horizontalLines.length; i--;) {
            drawHorizontalLine(horizontalLines[i]);
        }
        verticalLines.length = horizontalLines.length = 0;
    });
    canvas.on('mouse:up', function () {
        verticalLines.length = horizontalLines.length = 0;
        canvas.renderAll();
    });
}

function initCenteringGuidelines(canvas) {
    var canvasWidth = canvas.getWidth(), canvasHeight = canvas.getHeight(), canvasWidthCenter = canvasWidth / 2, canvasHeightCenter = canvasHeight / 2, canvasWidthCenterMap = {}, canvasHeightCenterMap = {}, centerLineMargin = 4, centerLineColor = 'rgba(255,0,241,0.5)', centerLineWidth = 1, ctx = canvas.getSelectionContext(), viewportTransform;
    for (var i = canvasWidthCenter - centerLineMargin, len = canvasWidthCenter + centerLineMargin; i <= len; i++) {
        canvasWidthCenterMap[Math.round(i)] = true;
    }
    for (var i = canvasHeightCenter - centerLineMargin, len = canvasHeightCenter + centerLineMargin; i <= len; i++) {
        canvasHeightCenterMap[Math.round(i)] = true;
    }
    function showVerticalCenterLine() {
        showCenterLine(canvasWidthCenter + 0.5, 0, canvasWidthCenter + 0.5, canvasHeight);
    }
    function showHorizontalCenterLine() {
        showCenterLine(0, canvasHeightCenter + 0.5, canvasWidth, canvasHeightCenter + 0.5);
    }
    function showCenterLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.strokeStyle = centerLineColor;
        ctx.lineWidth = centerLineWidth;
        ctx.beginPath();
        ctx.moveTo(x1 * viewportTransform[0], y1 * viewportTransform[3]);
        ctx.lineTo(x2 * viewportTransform[0], y2 * viewportTransform[3]);
        ctx.stroke();
        ctx.restore();
    }
    var isInVerticalCenter, isInHorizontalCenter;
    canvas.on('mouse:down', function () {
        viewportTransform = canvas.viewportTransform;
    });
    canvas.on('object:moving', function (e) {
        var object = e.target, objectCenter = object.getCenterPoint(), transform = canvas._currentTransform;
        if (!transform)
            return;
        isInVerticalCenter = Math.round(objectCenter.x) in canvasWidthCenterMap,
            isInHorizontalCenter = Math.round(objectCenter.y) in canvasHeightCenterMap;
        if (isInHorizontalCenter || isInVerticalCenter) {
            object.setPositionByOrigin(new fabric.Point((isInVerticalCenter ? canvasWidthCenter : objectCenter.x), (isInHorizontalCenter ? canvasHeightCenter : objectCenter.y)), 'center', 'center');
        }
    });
    canvas.on('before:render', function () {
        const ct = canvas.contextTop;
        if (ct)
            canvas.clearContext(canvas.contextTop);
    });
    canvas.on('after:render', function () {
        if (isInVerticalCenter) {
            showVerticalCenterLine();
        }
        if (isInHorizontalCenter) {
            showHorizontalCenterLine();
        }
    });
    canvas.on('mouse:up', function () {
        isInVerticalCenter = isInHorizontalCenter = null;
        canvas.renderAll();
    });
}

function initHotKey(canvas, fhistory) {
    hotkeys__default.default('ctrl+c,command+c', async (event) => {
        await copyObject(canvas, null);
    });
    hotkeys__default.default('ctrl+v,command+v', (event) => {
        pasteObject(canvas);
    });
    hotkeys__default.default('delete,del,backspace', (event) => {
        event.preventDefault();
        removeObject(null, canvas);
    });
    hotkeys__default.default('ctrl+z,command+z', (event) => {
        event.preventDefault();
        fhistory.undo();
    });
    hotkeys__default.default('ctrl+shift+z,command+shift+z', (event) => {
        event.preventDefault();
        fhistory.redo();
    });
    hotkeys__default.default('up, right, down, left', (event, handler) => {
        const activeObject = canvas.getActiveObject();
        if (!activeObject)
            return;
        if (activeObject.type === 'f-text' && activeObject.isEditing)
            return;
        event.preventDefault();
        switch (handler.key) {
            case 'up':
                activeObject.set('top', activeObject.top - 1);
                break;
            case 'right':
                activeObject.set('left', activeObject.left + 1);
                break;
            case 'down':
                activeObject.set('top', activeObject.top + 1);
                break;
            case 'left':
                activeObject.set('left', activeObject.left - 1);
                break;
        }
        if (activeObject.group) {
            activeObject.addWithUpdate();
        }
        canvas.requestRenderAll();
    });
}

class FabricHistory {
    constructor(editor) {
        this.historyUndo = [];
        this.historyRedo = [];
        this.canvas = editor.canvas;
        this.editor = editor;
        this.saving = false;
        this.doing = false;
        this.currentState = this._getJSON();
        this.init();
    }
    _checkHistoryUndoLength() {
        if (this.historyUndo.length > MAX_HISTORY_LENGTH) {
            this.historyUndo.shift();
        }
    }
    _checkHistoryRedoLength() {
        if (this.historyRedo.length > MAX_HISTORY_LENGTH) {
            this.historyRedo.shift();
        }
    }
    _historySaveAction() {
        if (this.doing || this.saving)
            return;
        this.saving = true;
        const json = this.currentState;
        this.historyUndo.push(json);
        this._checkHistoryUndoLength();
        this.currentState = this._getJSON();
        this.saving = false;
    }
    _getJSON() {
        return JSON.stringify(this.editor.canvas2Json());
    }
    _historyEvents() {
        return {
            'object:added': this._historySaveAction.bind(this),
            'object:removed': this._historySaveAction.bind(this),
            'object:modified': this._historySaveAction.bind(this),
            'object:skewing': this._historySaveAction.bind(this),
            'fabritor:object:modified': this._historySaveAction.bind(this)
        };
    }
    init() {
        this.canvas.on(this._historyEvents());
    }
    dispose() {
        this.canvas.off(this._historyEvents());
    }
    async undo() {
        const _history = this.historyUndo.pop();
        if (_history) {
            this.doing = true;
            this.historyRedo.push(this.currentState);
            this._checkHistoryRedoLength();
            this.currentState = _history;
            await this.editor.loadFromJSON(_history);
            this.doing = false;
            this.canvas.fire('fabritor:history:undo');
        }
    }
    async redo() {
        const _history = this.historyRedo.pop();
        if (_history) {
            this.doing = true;
            this.historyUndo.push(this.currentState);
            this._checkHistoryUndoLength();
            this.currentState = _history;
            await this.editor.loadFromJSON(_history);
            this.doing = false;
            this.canvas.fire('fabritor:history:redo');
        }
    }
    canUndo() {
        return this.historyUndo.length > 0;
    }
    canRedo() {
        return this.historyRedo.length > 0;
    }
    reset() {
        this.historyRedo = [];
        this.historyUndo = [];
        this.saving = false;
        this.doing = false;
        this.currentState = this._getJSON();
    }
}

class AutoSave {
    constructor(editor) {
        this.canvas = editor.canvas;
        this.editor = editor;
        this.saving = false;
        this.canSave = true;
        this.init();
    }
    init() {
    }
    dispose() {
    }
    setCanSave(can) {
        this.canSave = can;
    }
    autoSaveAction() {
        if (this.saving)
            return;
        this.saving = true;
        try {
            if (this.canSave) {
                localStorage.setItem('fabritor_web_json', this._getJSON());
            }
        }
        catch (e) {
            console.log(e);
        }
        this.saving = false;
    }
    _getJSON() {
        return JSON.stringify(this.editor.canvas2Json());
    }
    initAutoSaveEvents() {
        return {
            'object:added': this.autoSaveAction.bind(this),
            'object:removed': this.autoSaveAction.bind(this),
            'object:modified': this.autoSaveAction.bind(this),
            'object:skewing': this.autoSaveAction.bind(this),
            'fabritor:object:modified': this.autoSaveAction.bind(this)
        };
    }
    async loadFromLocal() {
    }
}

const createGroup = (options) => {
    const { items, canvas } = options, rest = __rest(options, ["items", "canvas"]);
    const group = new fabric$1.fabric.Group(items, Object.assign({ id: uuid() }, rest));
    canvas.add(group);
    return group;
};

const clone = fabric$1.fabric.util.object.clone;
const additionalProps = ('fontFamily fontWeight fontSize text underline overline linethrough' +
    ' textAlign fontStyle lineHeight textBackgroundColor charSpacing styles' +
    ' direction path pathStartOffset pathSide pathAlign minWidth splitByGrapheme').split(' ');
const createFTextClass = () => {
    fabric$1.fabric.FText = fabric$1.fabric.util.createClass(fabric$1.fabric.Textbox, {
        type: 'f-text',
        padding: 0,
        paintFirst: 'stroke',
        initDimensions: function () {
            if (this.__skipDimension) {
                return;
            }
            this.isEditing && this.initDelayedCursor();
            this.clearContextTop();
            this._clearCache();
            this.dynamicMinWidth = 0;
            this._styleMap = this._generateStyleMap(this._splitText());
            if (this.dynamicMinWidth > this.width) {
                this._set('width', this.dynamicMinWidth);
            }
            if (this.textAlign.indexOf('justify') !== -1) {
                this.enlargeSpaces();
            }
            const height = this.calcTextHeight();
            if (!this.path) {
                this.height = height;
            }
            else {
                this.height = this.path.height > height ? this.path.height : height;
            }
            this.saveState({ propertySet: '_dimensionAffectingProps' });
        },
        toObject: function (propertiesToInclude) {
            const allProperties = additionalProps.concat(propertiesToInclude);
            const obj = this.callSuper('toObject', allProperties);
            obj.styles = fabric$1.fabric.util.stylesToArray(this.styles, this.text);
            if (obj.path) {
                obj.path = this.path.toObject();
            }
            return obj;
        },
    });
    fabric$1.fabric.FText.fromObject = function (object, callback) {
        const objectCopy = clone(object), path = object.path;
        delete objectCopy.path;
        return fabric$1.fabric.Object._fromObject('FText', objectCopy, function (textInstance) {
            textInstance.styles = fabric$1.fabric.util.stylesFromArray(object.styles, object.text);
            if (path) {
                fabric$1.fabric.Object._fromObject('Path', path, function (pathInstance) {
                    textInstance.set('path', pathInstance);
                    callback(textInstance);
                }, 'path');
            }
            else {
                callback(textInstance);
            }
        }, 'text');
    };
};

const createFImageClass = () => {
    fabric$1.fabric.FImage = fabric$1.fabric.util.createClass(fabric$1.fabric.Group, {
        type: 'f-image',
        initialize(options, alreayGrouped = false) {
            const { image, imageBorder = {} } = options, rest = __rest(options, ["image", "imageBorder"]);
            image.set({
                originX: 'center',
                originY: 'center'
            });
            this.img = image;
            this.borderRect = this._createBorderRect(imageBorder);
            this.img.clipPath = this._createClipPath();
            this.callSuper('initialize', [this.img, this.borderRect], Object.assign({ borderColor: '#FF2222', borderDashArray: null, borderScaleFactor: 2, padding: 0, subTargetCheck: false, imageBorder }, rest), alreayGrouped);
        },
        _createBorderRect({ stroke, strokeWidth, borderRadius }) {
            const width = this.img.getScaledWidth();
            const height = this.img.getScaledHeight();
            const options = {
                width,
                height,
                rx: borderRadius || 0,
                ry: borderRadius || 0,
                originX: 'center',
                originY: 'center',
                fill: '#00000000',
                paintFirst: 'fill'
            };
            if (stroke)
                options.stroke = stroke;
            if (strokeWidth)
                options.strokeWidth = strokeWidth;
            return new fabric$1.fabric.Rect(options);
        },
        _createClipPath() {
            const width = this.img.width;
            const height = this.img.height;
            return new fabric$1.fabric.Rect({
                originX: 'center',
                originY: 'center',
                width,
                height,
                rx: this.borderRect.rx || 0,
                ry: this.borderRect.ry || 0
            });
        },
        setSrc(src, callback) {
            this.img.setSrc(src, () => {
                const width = this.img.getScaledWidth();
                const height = this.img.getScaledHeight();
                this.img.setCoords();
                this.borderRect.set({ width, height, dirty: true });
                this.img.set({
                    clipPath: this._createClipPath(),
                    dirty: true
                });
                this.addWithUpdate();
                callback && callback();
            });
        },
        getSrc() {
            return this.img.getSrc();
        },
        setBorder(b) {
            this.borderRect.set({
                stroke: b.stroke || null,
                strokeWidth: b.strokeWidth || 1,
                rx: b.borderRadius || 0,
                ry: b.borderRadius || 0,
                strokeDashArray: b.strokeDashArray || null
            });
            this.img.setCoords();
            this.img.set({
                clipPath: this._createClipPath(),
                dirty: true
            });
            this.imageBorder = Object.assign({}, b);
            this.addWithUpdate();
        },
        getBorder() {
            return this.imageBorder;
        },
        applyFilter(filter) {
            try {
                this.img.filters = filter ? [filter] : [];
                this.img.applyFilters();
            }
            catch (e) {
                console.log(e);
            }
        },
        applyFilterValue(prop, value) {
            const filter = this.getFilter();
            if (filter) {
                filter[prop] = value;
                this.img.filters = [filter];
                this.img.applyFilters();
            }
        },
        getFilter() {
            return this.img.filters[0];
        }
    });
    fabric$1.fabric.FImage.fromObject = (object, callback) => {
        const { objects } = object, options = __rest(object, ["objects"]);
        const imgJson = Object.assign({}, objects[0]);
        fabric$1.fabric.Image.fromObject(imgJson, (img) => {
            callback(new fabric$1.fabric.FImage(Object.assign({ image: img }, options), true));
        });
    };
};

const extend$1 = fabric$1.fabric.util.object.extend;
const createFLineClass = () => {
    fabric$1.fabric.FLine = fabric$1.fabric.util.createClass(fabric$1.fabric.Line, {
        type: 'f-line',
        padding: 6,
        borderColor: '#00000000',
        setStrokeWidth(w) {
            this.set('strokeWidth', w);
        },
        setStrokeDashArray(dashArray) {
            this.set('strokeDashArray', dashArray);
        },
        setStrokeLineCap(isRound) {
            this.set('strokeLineCap', isRound ? 'round' : 'butt');
        },
        toObject(propertiesToInclude) {
            return extend$1(this.callSuper('toObject', propertiesToInclude), { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 });
        },
    });
    fabric$1.fabric.FLine.fromObject = (object, callback) => {
        function _callback(instance) {
            delete instance.points;
            callback && callback(instance);
        }
        const options = Object.assign({}, object);
        options.points = [object.x1, object.y1, object.x2, object.y2];
        fabric$1.fabric.Object._fromObject('FLine', options, _callback, 'points');
    };
};

const extend = fabric$1.fabric.util.object.extend;
const createFArrowClass = () => {
    fabric$1.fabric.FArrow = fabric$1.fabric.util.createClass(fabric$1.fabric.Line, {
        type: 'f-arrow',
        borderColor: '#00000000',
        _render: function (ctx) {
            this.callSuper('_render', ctx);
            ctx.save();
            if (!this.oldArrowInfo) {
                this.oldArrowInfo = {
                    left: -28,
                    top: -15,
                    bottom: 15,
                    strokeWidth: this.strokeWidth
                };
            }
            var xDiff = this.x2 - this.x1;
            var yDiff = this.y2 - this.y1;
            var angle = Math.atan2(yDiff, xDiff);
            ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
            ctx.rotate(angle);
            const delta = this.strokeWidth - this.oldArrowInfo.strokeWidth;
            ctx.lineJoin = this.strokeLineJoin;
            ctx.lineCap = this.strokeLineCap;
            ctx.strokeStyle = this.stroke;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.bottom + delta);
            ctx.lineTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.top - delta);
            ctx.closePath();
            ctx.fillStyle = this.stroke;
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },
        setStrokeWidth(w) {
            this.set('strokeWidth', w);
        },
        setStrokeDashArray(dashArray) {
            this.set('strokeDashArray', dashArray);
        },
        setStrokeLineCap(isRound) {
            this.set('strokeLineCap', isRound ? 'round' : 'butt');
            this.set('strokeLineJoin', isRound ? 'round' : 'miter');
        },
        toObject(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 });
        },
    });
    fabric$1.fabric.FArrow.fromObject = function (object, callback) {
        callback && callback(new fabric$1.fabric.FArrow([object.x1, object.y1, object.x2, object.y2], object));
    };
};
const createFTriArrowClass = () => {
    fabric$1.fabric.FTriArrow = fabric$1.fabric.util.createClass(fabric$1.fabric.Line, {
        type: 'f-tri-arrow',
        borderColor: '#00000000',
        _render: function (ctx) {
            this.callSuper('_render', ctx);
            ctx.save();
            if (!this.oldArrowInfo) {
                this.oldArrowInfo = {
                    left: -24,
                    top: -16,
                    bottom: 16,
                    strokeWidth: this.strokeWidth
                };
            }
            var xDiff = this.x2 - this.x1;
            var yDiff = this.y2 - this.y1;
            var angle = Math.atan2(yDiff, xDiff);
            ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
            ctx.rotate(angle);
            const delta = this.strokeWidth - this.oldArrowInfo.strokeWidth;
            ctx.lineJoin = this.strokeLineJoin;
            ctx.lineCap = this.strokeLineCap;
            ctx.strokeStyle = this.stroke;
            ctx.beginPath();
            ctx.moveTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.bottom + delta);
            ctx.lineTo(0, 0);
            ctx.lineTo(this.oldArrowInfo.left - delta, this.oldArrowInfo.top - delta);
            ctx.fillStyle = '#00000000';
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        },
        setStrokeWidth(w) {
            this.set('strokeWidth', w);
        },
        setStrokeDashArray(dashArray) {
            this.set('strokeDashArray', dashArray);
        },
        setStrokeLineCap(isRound) {
            this.set('strokeLineCap', isRound ? 'round' : 'butt');
            this.set('strokeLineJoin', isRound ? 'round' : 'miter');
        },
        toObject(propertiesToInclude) {
            return extend(this.callSuper('toObject', propertiesToInclude), { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 });
        },
    });
    fabric$1.fabric.FTriArrow.fromObject = function (object, callback) {
        callback && callback(new fabric$1.fabric.FTriArrow([object.x1, object.y1, object.x2, object.y2], object));
    };
};

function createCustomClass () {
    createFTextClass();
    createFImageClass();
    createFLineClass();
    createFArrowClass();
    createFTriArrowClass();
}

class Editor {
    constructor(options) {
        const { template } = options, rest = __rest(options, ["template"]);
        this._options = rest;
        this._template = template;
        this._pan = {
            enable: false,
            isDragging: false,
            lastPosX: 0,
            lastPosY: 0
        };
    }
    async init() {
        this._initObject();
        this._initCanvas();
        this._initEvents();
        this._initSketch();
        this._initGuidelines();
        this.autoSave = new AutoSave(this);
        await this.autoSave.loadFromLocal();
        this.fhistory = new FabricHistory(this);
        initHotKey(this.canvas, this.fhistory);
        this.autoSave.init();
    }
    _initObject() {
        initObjectPrototype();
        createCustomClass();
        initControl();
    }
    _initCanvas() {
        const { canvasEl, workspaceEl } = this._options;
        this.canvas = new fabric$1.fabric.Canvas(canvasEl, {
            selection: true,
            containerClass: 'fabritor-canvas',
            enableRetinaScaling: true,
            fireRightClick: true,
            controlsAboveOverlay: true,
            width: workspaceEl.offsetWidth,
            height: workspaceEl.offsetHeight,
            backgroundColor: '#dddddd',
            preserveObjectStacking: true,
            imageSmoothingEnabled: false
        });
    }
    _initGuidelines() {
        initAligningGuidelines(this.canvas);
        initCenteringGuidelines(this.canvas);
    }
    _initSketch() {
        const { width = 1242, height = 1660 } = this._template || {};
        const sketch = new fabric$1.fabric.Rect({
            fill: '#ffffff',
            left: 0,
            top: 0,
            width,
            height,
            selectable: false,
            hasControls: false,
            hoverCursor: 'default',
            id: SKETCH_ID,
            fabritor_desc: translate('header.fabritor_desc'),
        });
        this.canvas.add(sketch);
        this.canvas.requestRenderAll();
        this.sketch = sketch;
        this._initResizeObserver();
        this._adjustSketch2Canvas();
    }
    setSketchSize(size) {
        this.sketch.set(size);
        this._adjustSketch2Canvas();
    }
    _initResizeObserver() {
        const { workspaceEl } = this._options;
        this._resizeObserver = new ResizeObserver(lodashEs.throttle(() => {
            this.canvas.setWidth(workspaceEl.offsetWidth);
            this.canvas.setHeight(workspaceEl.offsetHeight);
            this._adjustSketch2Canvas();
        }, 50));
        this._resizeObserver.observe(workspaceEl);
    }
    _adjustSketch2Canvas() {
        const zoomLevel = calcCanvasZoomLevel({
            width: this.canvas.width,
            height: this.canvas.height
        }, {
            width: this.sketch.width,
            height: this.sketch.height
        });
        const center = this.canvas.getCenter();
        this.canvas.zoomToPoint(new fabric$1.fabric.Point(center.left, center.top), zoomLevel - 0.04);
        const sketchCenter = this.sketch.getCenterPoint();
        const viewportTransform = this.canvas.viewportTransform;
        viewportTransform[4] = this.canvas.width / 2 - sketchCenter.x * viewportTransform[0];
        viewportTransform[5] = this.canvas.height / 2 - sketchCenter.y * viewportTransform[3];
        this.canvas.setViewportTransform(viewportTransform);
        this.canvas.requestRenderAll();
        this.sketch.clone((cloned) => {
            this.canvas.clipPath = cloned;
            this.canvas.requestRenderAll();
        });
    }
    _initEvents() {
        this.canvas.on('mouse:down', (opt) => {
            const evt = opt.e;
            if (this._pan.enable) {
                this._pan = {
                    enable: true,
                    isDragging: true,
                    lastPosX: evt.clientX,
                    lastPosY: evt.clientY
                };
            }
        });
        this.canvas.on('mouse:move', (opt) => {
            if (this._pan.enable && this._pan.isDragging) {
                const { e } = opt;
                const vpt = this.canvas.viewportTransform;
                vpt[4] += e.clientX - this._pan.lastPosX;
                vpt[5] += e.clientY - this._pan.lastPosY;
                this.canvas.requestRenderAll();
                this._pan.lastPosX = e.clientX;
                this._pan.lastPosY = e.clientY;
            }
        });
        this.canvas.on('mouse:over', (opt) => {
            const { target } = opt;
            if (this._pan.enable)
                return;
            {
                const corner = target === null || target === void 0 ? void 0 : target.__corner;
                if (corner) {
                    handleMouseOverCorner(corner, opt.target);
                }
            }
            {
                if (target && target.id !== SKETCH_ID && target !== this.canvas.getActiveObject()) {
                    target._renderControls(this.canvas.contextTop, { hasControls: false });
                }
            }
        });
        this.canvas.on('mouse:out', (opt) => {
            const { target } = opt;
            {
                if (target && target.id !== SKETCH_ID) {
                    handleMouseOutCorner(target);
                    this.canvas.requestRenderAll();
                }
            }
        });
        this.canvas.on('mouse:up', (opt) => {
            if (this._pan.enable) {
                this.canvas.setViewportTransform(this.canvas.viewportTransform);
                this._pan.isDragging = false;
            }
        });
        this.canvas.on('mouse:wheel', this._scrollSketch.bind(this));
        this.canvas.on('mouse:dblclick', (opt) => {
            const { target, subTargets } = opt;
            const subTarget = subTargets === null || subTargets === void 0 ? void 0 : subTargets[0];
            if ((target === null || target === void 0 ? void 0 : target.type) === 'group' && subTarget) {
                if (subTarget.type === 'f-text') {
                    this._editTextInGroup(target, subTarget);
                }
            }
        });
        this.canvas.on('object:modified', (opt) => {
            const { target } = opt;
            if (!target || target.id === SKETCH_ID)
                return;
            const scaledWidth = target.getScaledWidth();
            const scaledHeight = target.getScaledHeight();
            if (target.type !== 'f-line' && target.type !== 'f-image') {
                if (target.type !== 'f-text') {
                    target.setControlVisible('mt', scaledWidth >= 100);
                    target.setControlVisible('mb', scaledWidth >= 100);
                }
                target.setControlVisible('ml', scaledHeight >= 40);
                target.setControlVisible('mr', scaledHeight >= 40);
                this.canvas.requestRenderAll();
            }
            if (target.type === 'f-line' || target.type === 'f-arrow' || target.type === 'f-tri-arrow') {
                handleFLinePointsWhenMoving(opt);
            }
        });
    }
    _editTextInGroup(group, textbox) {
        let items = group.getObjects();
        textbox.on('editing:exited', () => {
            for (let i = 0; i < items.length; i++) {
                this.canvas.remove(items[i]);
            }
            const grp = createGroup({
                items,
                canvas: this.canvas
            });
            this.canvas.renderAll();
            this.canvas.setActiveObject(grp);
            this.canvas.fire('fabritor:group', { target: this.canvas.getActiveObject() });
            textbox.off('editing:exited');
        });
        group._restoreObjectsState();
        this.canvas.remove(group);
        this.canvas.renderAll();
        for (let i = 0; i < items.length; i++) {
            items[i].selectable = false;
            items[i].set('hasControls', false);
            this.canvas.add(items[i]);
        }
        this.canvas.renderAll();
        this.canvas.setActiveObject(textbox);
        textbox.enterEditing();
        textbox.selectAll();
    }
    switchEnablePan() {
        this._pan.enable = !this._pan.enable;
        this.canvas.discardActiveObject();
        this.canvas.hoverCursor = this._pan.enable ? 'grab' : 'move';
        this.canvas.getObjects().forEach((obj) => {
            if (obj.id !== SKETCH_ID) {
                obj.set('selectable', !this._pan.enable);
            }
        });
        this.canvas.selection = !this._pan.enable;
        this.canvas.requestRenderAll();
        return this._pan.enable;
    }
    getIfPanEnable() {
        return this._pan.enable;
    }
    fireCustomModifiedEvent(data = null) {
        this.canvas.fire('fabritor:object:modified', data);
    }
    _scrollSketch(opt) {
        const delta = opt.e.deltaY;
        let zoom = this.canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20)
            zoom = 20;
        if (zoom < 0.01)
            zoom = 0.01;
        const center = this.canvas.getCenter();
        this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    }
    destroy() {
        if (this.canvas) {
            this.canvas.dispose();
            this.canvas = null;
        }
        if (this.fhistory) {
            this.fhistory.dispose();
        }
        if (this.autoSave) {
            this.autoSave.dispose();
        }
        const { workspaceEl } = this._options;
        if (this._resizeObserver) {
            this._resizeObserver.unobserve(workspaceEl);
            this._resizeObserver = null;
        }
    }
    export2Img(options) {
        const transform = this.canvas.viewportTransform;
        const clipPath = this.canvas.clipPath;
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.canvas.setBackgroundColor('#ffffff');
        this.canvas.clipPath = null;
        const { left, top, width, height } = this.sketch;
        const dataURL = this.canvas.toDataURL(Object.assign({ left,
            top,
            width,
            height, format: 'png' }, options));
        this.canvas.setViewportTransform(transform);
        this.canvas.clipPath = clipPath;
        this.canvas.setBackgroundColor('#dddddd', () => {
            this.canvas.requestRenderAll();
        });
        return dataURL;
    }
    export2Svg() {
        const { left, top, width, height } = this.sketch;
        const svg = this.canvas.toSVG({
            width,
            height,
            viewBox: {
                x: left,
                y: top,
                width,
                height
            }
        });
        return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }
    canvas2Json() {
        const json = this.canvas.toJSON(FABRITOR_CUSTOM_PROPS);
        json[SCHEMA_VERSION_KEY] = SCHEMA_VERSION;
        return json;
    }
    async loadFromJSON(json, errorToast = false) {
        if (!json)
            return false;
        if (typeof json === 'string') {
            try {
                json = JSON.parse(json);
                json.objects.forEach((object) => {
                    if (object.type === 'f-image') {
                        object.objects.forEach(o => {
                            if (o.type === 'image') {
                                if (o.src.indexOf('https://') || o.src.indexOf('http://')) {
                                    o.crossOrigin = 'anonymous';
                                }
                            }
                        });
                    }
                });
            }
            catch (e) {
                console.log(e);
                errorToast && antd.message.error('加载本地模板失败，请重试');
                return false;
            }
        }
        if (json[SCHEMA_VERSION_KEY] !== SCHEMA_VERSION) {
            console.warn('此模板已经无法与当前版本兼容，请更换模板');
            return false;
        }
        {
            const { objects } = json;
            for (let item of objects) {
                if (item.type === 'f-text') {
                    await loadFont(item.fontFamily);
                }
            }
        }
        const lastActiveObject = this.canvas.getActiveObject();
        let nowActiveObject;
        this.autoSave.setCanSave(false);
        return new Promise((resolve) => {
            this.canvas.loadFromJSON(json, () => {
                this.canvas.requestRenderAll();
                this.autoSave.setCanSave(true);
                this.canvas.fire('fabritor:load:json', { lastActiveObject: nowActiveObject });
                resolve(true);
            }, (o, obj) => {
                if (obj.id === SKETCH_ID) {
                    this.sketch = obj;
                    this.setSketchSize({ width: obj.width, height: obj.height });
                }
                if (obj.id === (lastActiveObject === null || lastActiveObject === void 0 ? void 0 : lastActiveObject.id)) {
                    nowActiveObject = obj;
                }
            });
        });
    }
    async clearCanvas() {
        const { width, height, fabritor_desc } = this.sketch;
        const originalJson = `{"fabritor_schema_version":3.1,"version":"5.3.0","objects":[{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":${width},"height":${height},"fill":"#ffffff","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"id":"fabritor-sketch","fabritor_desc":"${fabritor_desc}","selectable":false,"hasControls":false}],"clipPath":{"type":"rect","version":"5.3.0","originX":"left","originY":"top","left":0,"top":0,"width":${width},"height":${height},"fill":"#ffffff","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":true,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"stroke","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"selectable":true,"hasControls":true},"backgroundColor":"#dddddd"}`;
        await this.loadFromJSON(originalJson);
        this.fhistory.reset();
    }
}

function ObjectRotateAngleTip() {
    const [pos, setPos] = React.useState({ left: 0, top: 0 });
    const [content, setContent] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const { editor } = React.useContext(GlobalStateContext);
    const rotateHandler = (opt) => {
        const { target, e } = opt;
        setPos({
            left: e.pageX + 16,
            top: e.pageY
        });
        setContent(`${Math.round(target.angle)}°`);
        setOpen(true);
    };
    const mouseupHandler = () => {
        setOpen(false);
    };
    React.useEffect(() => {
        if (editor) {
            editor.canvas.on('object:rotating', rotateHandler);
            editor.canvas.on('mouse:up', mouseupHandler);
        }
    }, [editor]);
    return (jsxRuntime.jsx("div", Object.assign({ style: Object.assign({ fontSize: 12, position: 'fixed', zIndex: 9999, width: 'max-content', display: open ? 'block' : 'none' }, pos) }, { children: jsxRuntime.jsx(antd.Tag, Object.assign({ color: "rgba(0, 0, 0, 0.85)" }, { children: content })) })));
}

const { Content } = antd.Layout;
const workspaceStyle = {
    background: '#ddd',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    flex: 1
};
const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
};
function ImageCanvas() {
    const model = inversifyReact.useInjection('ImageCanvasModel');
    const canvasEl = React.useRef(null);
    const workspaceEl = React.useRef(null);
    const roughSvgEl = React.useRef(null);
    const [editor, setEditor] = React.useState(null);
    const [roughSvg, setRoughSvg] = React.useState();
    const [activeObject, setActiveObject] = React.useState(null);
    const [isReady, setReady] = React.useState(false);
    const contextMenuRef = React.useRef(null);
    const clickHandler = (opt) => {
        var _a, _b;
        const { target } = opt;
        if (editor.getIfPanEnable())
            return;
        if (!target) {
            (_a = contextMenuRef.current) === null || _a === void 0 ? void 0 : _a.hide();
            return;
        }
        if (opt.button === 3) {
            if (target.id !== SKETCH_ID) {
                editor.canvas.setActiveObject(target);
            }
            setTimeout(() => {
                var _a;
                (_a = contextMenuRef.current) === null || _a === void 0 ? void 0 : _a.show();
            }, 50);
        }
        else {
            (_b = contextMenuRef.current) === null || _b === void 0 ? void 0 : _b.hide();
        }
    };
    const selectionHandler = (opt) => {
        const { selected, sketch } = opt;
        if (selected && selected.length) {
            const selection = editor.canvas.getActiveObject();
            setActiveObject(selection);
        }
        else {
            setActiveObject(sketch);
        }
    };
    const groupHandler = () => {
        const selection = editor.canvas.getActiveObject();
        setActiveObject(selection);
    };
    const loadJsonHandler = (opt) => {
        const { lastActiveObject } = opt;
        if (lastActiveObject) {
            editor.canvas.setActiveObject(lastActiveObject);
            setActiveObject(lastActiveObject);
        }
    };
    const initEvent = () => {
        editor.canvas.on('selection:created', selectionHandler);
        editor.canvas.on('selection:updated', selectionHandler);
        editor.canvas.on('selection:cleared', selectionHandler);
        editor.canvas.on('mouse:down', clickHandler);
        editor.canvas.on('fabritor:group', groupHandler);
        editor.canvas.on('fabritor:ungroup', groupHandler);
        editor.canvas.on('fabritor:load:json', loadJsonHandler);
    };
    const initEditor = async () => {
        const _editor = new Editor({
            canvasEl: canvasEl.current,
            workspaceEl: workspaceEl.current,
            sketchEventHandler: {
                groupHandler: () => {
                    setActiveObject(_editor.canvas.getActiveObject());
                }
            }
        });
        await _editor.init();
        setEditor(_editor);
        model.setEditor(_editor);
        setReady(true);
        setActiveObject(_editor.sketch);
        model.emitter.on('loadFromJSON', async (json) => {
            setReady(false);
            await _editor.loadFromJSON(json, true);
            _editor.fhistory.reset();
            setReady(true);
            setActiveObject(null);
            _editor.fireCustomModifiedEvent();
        });
    };
    const initRoughSvg = () => {
        setRoughSvg(rough__default.default.svg(roughSvgEl.current));
    };
    React.useEffect(() => {
        if (editor) {
            initEvent();
            initRoughSvg();
        }
    }, [editor]);
    React.useEffect(() => {
        initEditor();
        return () => {
            if (editor) {
                editor.destroy();
            }
        };
    }, []);
    return (jsxRuntime.jsx(GlobalStateContext.Provider, Object.assign({ value: {
            object: activeObject,
            setActiveObject,
            isReady,
            setReady,
            editor,
            roughSvg
        } }, { children: jsxRuntime.jsxs(antd.Layout, Object.assign({ style: {
                height: '100%',
                overflow: 'hidden'
            }, className: "fabritor-layout" }, { children: [jsxRuntime.jsx(antd.Spin, { spinning: !isReady, fullscreen: true }), jsxRuntime.jsx(ObjectRotateAngleTip, {}), jsxRuntime.jsxs(antd.Layout, { children: [jsxRuntime.jsx(Panel, {}), jsxRuntime.jsx(Content, Object.assign({ style: contentStyle }, { children: jsxRuntime.jsx(ContextMenu$1, Object.assign({ ref: contextMenuRef, object: activeObject }, { children: jsxRuntime.jsx("div", Object.assign({ style: workspaceStyle, ref: workspaceEl, className: "fabritor-workspace" }, { children: jsxRuntime.jsx("canvas", { ref: canvasEl }) })) })) })), jsxRuntime.jsx(Setter, {})] }), jsxRuntime.jsx("svg", { id: "fabritor-rough-svg", ref: roughSvgEl })] })) })));
}

exports.ImageCanvas = ImageCanvas;
