'use strict';

var classNames = require('classnames');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');
var antd = require('antd');
var icons = require('@ant-design/icons');
var i18n = require('i18next');
var reactI18next = require('react-i18next');
var inversifyReact = require('inversify-react');
var FontFaceObserver = require('fontfaceobserver');
var uuid$1 = require('uuid');
var googleFonts = require('google-fonts');
var reactSystem = require('react-system');
var universalEnv = require('universal-env');
var RcInputNumber = require('rc-input-number');
var RcInput = require('rc-input');
var mobx = require('mobx');
var mobxReactLite = require('mobx-react-lite');
var ahooks = require('ahooks');
var Cropper = require('cropperjs');
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
var Cropper__default = /*#__PURE__*/_interopDefault(Cropper);
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
		local: "Image Box",
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
		width: "Width",
		height: "Height"
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
        label: jsxRuntime.jsx("div", Object.assign({ style: {
                fontSize: 30,
                fontFamily: 'Roboto',
                fontWeight: 'bold'
            } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_title" }) })),
        key: 'title',
        config: {
            fontFamily: 'Roboto',
            fontWeight: 'bold',
            fontSize: 120,
            text: () => translate('panel.text.add_title'),
            top: 100
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: {
                fontSize: 24,
                fontFamily: 'Open Sans'
            } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_subtitle" }) })),
        key: 'sub-title',
        config: {
            fontFamily: 'Open Sans',
            fontWeight: 'bold',
            fontSize: 100,
            text: () => translate('panel.text.add_subtitle'),
            top: 400
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: {
                fontSize: 16,
                fontFamily: 'Open Sans'
            } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_body_text" }) })),
        key: 'content',
        config: {
            fontFamily: 'Open Sans',
            fontSize: 75,
            text: () => translate('panel.text.add_body_text'),
        }
    },
    {
        label: jsxRuntime.jsx("div", Object.assign({ style: {
                fontSize: 26,
                fontFamily: 'Open Sans',
                color: '#ffffff',
                WebkitTextStroke: '1px rgb(255, 87, 87)'
            } }, { children: jsxRuntime.jsx(reactI18next.Trans, { i18nKey: "panel.text.add_text_border" }) })),
        key: 'content_border',
        config: {
            fontFamily: 'Open Sans',
            fontSize: 90,
            text: () => translate('panel.text.add_text_border'),
            fill: '#fdf5f5',
            stroke: '#ff5757',
            strokeWidth: 10
        }
    }
];
function PresetFontPanel(props) {
    inversifyReact.useInjection('ImageCanvasModel');
    const { addTextBox } = props;
    const { t } = reactI18next.useTranslation();
    const handleClick = (item) => {
        addTextBox === null || addTextBox === void 0 ? void 0 : addTextBox(item.config);
    };
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ vertical: true, gap: 8, style: { marginTop: 16 } }, { children: [jsxRuntime.jsx(Title$1, { children: t('panel.text.presets') }), PRESET_FONT_LIST.map(item => (jsxRuntime.jsx(antd.Card, Object.assign({ hoverable: true, onClick: () => {
                    handleClick(item);
                }, bodyStyle: {
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
    fontFamily: 'Roboto',
    width: 500,
    splitByGrapheme: false
};
[
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: 'SmileySans',
                fontSize: 16
            } }, { children: "\u5F97\u610F\u9ED1" })),
        value: 'SmileySans'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '霞鹜新晰黑',
                fontSize: 16
            } }, { children: "\u971E\u9E5C\u65B0\u6670\u9ED1" })),
        value: '霞鹜新晰黑'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '霞鹜文楷',
                fontSize: 16
            } }, { children: "\u971E\u9E5C\u6587\u6977" })),
        value: '霞鹜文楷'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '小赖字体',
                fontSize: 16
            } }, { children: "\u5C0F\u8D56\u5B57\u4F53" })),
        value: '小赖字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '悠哉字体',
                fontSize: 16
            } }, { children: "\u60A0\u54C9\u5B57\u4F53" })),
        value: '悠哉字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: 'AlibabaPuHuiTi',
                fontSize: 16
            } }, { children: "\u963F\u91CC\u5DF4\u5DF4\u666E\u60E0\u4F53" })),
        value: 'AlibabaPuHuiTi'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '霞鹜尚智黑',
                fontSize: 16
            } }, { children: "\u971E\u9E5C\u5C1A\u667A\u9ED1" })),
        value: '霞鹜尚智黑'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: 'SourceHanSans',
                fontSize: 16
            } }, { children: "\u601D\u6E90\u9ED1\u4F53" })),
        value: 'SourceHanSans'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: 'SourceHanSerif',
                fontSize: 16
            } }, { children: "\u601D\u6E90\u5B8B\u4F53" })),
        value: 'SourceHanSerif'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '方正楷体',
                fontSize: 16
            } }, { children: "\u65B9\u6B63\u6977\u4F53" })),
        value: '方正楷体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '包图小白体',
                fontSize: 16
            } }, { children: "\u5305\u56FE\u5C0F\u767D\u4F53" })),
        value: '包图小白体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '手写杂字体',
                fontSize: 16
            } }, { children: "\u624B\u5199\u6742\u5B57\u4F53" })),
        value: '手写杂字体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '胡晓波男神体',
                fontSize: 16
            } }, { children: "\u80E1\u6653\u6CE2\u7537\u795E\u4F53" })),
        value: '胡晓波男神体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '胡晓波骚包体',
                fontSize: 16
            } }, { children: "\u80E1\u6653\u6CE2\u9A9A\u5305\u4F53" })),
        value: '胡晓波骚包体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '站酷快乐体',
                fontSize: 16
            } }, { children: "\u7AD9\u9177\u5FEB\u4E50\u4F53" })),
        value: '站酷快乐体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '站酷文艺体',
                fontSize: 16
            } }, { children: "\u7AD9\u9177\u6587\u827A\u4F53" })),
        value: '站酷文艺体'
    },
    {
        label: jsxRuntime.jsx("span", Object.assign({ style: {
                fontFamily: '站酷小薇LOGO体',
                fontSize: 16
            } }, { children: "\u7AD9\u9177\u5C0F\u8587LOGO\u4F53" })),
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
    'hasRef',
    'fontScale',
    'objectFit'
];
const CUSTOM_FONTS = [
    'Caveat-Regular',
    'KronaOne-Regular',
    'NotoSansTC-Regular',
    'Oswald-Bold',
    'Oswald-Regular',
    'Geizer-2'
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
const FONT_PRESET_FAMILY_LIST_GOOGLE_FONT = CUSTOM_FONTS.concat(COMPLETE_GOOGLE_FONTS).map(f => ({
    label: jsxRuntime.jsx("span", Object.assign({ style: {
            fontFamily: f,
            fontSize: 16
        } }, { children: f })),
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
    if (!v || typeof v === 'string' || v instanceof fabric.Pattern) {
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
    const path = new fabric.Path(`M 0 0 Q ${width / 2} ${width / 2 * offset / 100} ${width} 0`, {
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
    const textBox = new fabric.FText(text || translate('panel.text.add'), Object.assign(Object.assign(Object.assign({}, TEXTBOX_DEFAULT_CONFIG), rest), { fontFamily, pathAlign: 'center', id: uuid(), objectCaching: false, splitByGrapheme: false }));
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
    const model = inversifyReact.useInjection('ImageCanvasModel');
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleAddText = async (options) => {
        await createTextbox(Object.assign(Object.assign({}, options), { canvas: editor.canvas }));
    };
    return (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: [jsxRuntime.jsx(reactSystem.Box, Object.assign({ mb: 2 }, { children: jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, onClick: () => {
                        handleAddText({});
                    }, size: "large" }, { children: t('panel.text.add') })) })), jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", block: true, onClick: () => {
                    handleAddText({
                        ref: null,
                        fontFamily: 'Roboto',
                        fontSize: 50,
                        text: 'Text ref placeholder',
                        width: 600,
                        opacity: 0.5,
                        color: "#6D7175",
                        top: 400
                    });
                    setTimeout(() => model.openRefSelect(), 300);
                }, size: "large" }, { children: "Text Ref Box" })), jsxRuntime.jsx(PresetFontPanel, { addTextBox: handleAddText })] })));
}

const loadImageDom = async (url) => {
    return new Promise((resolve, reject) => {
        fabric.util.loadImage(url, (img) => {
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
            fabric.Image.fromURL(imageSource, (img) => {
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
    return Promise.resolve(new fabric.Image(imageSource));
};
const createFImage = async (options) => {
    const { imageSource, canvas, hasRef } = options || {};
    let img;
    try {
        img = await loadImage(imageSource);
    }
    catch (e) {
        console.log(e);
    }
    if (!img)
        return;
    const fimg = new fabric.FImage({
        image: img,
        id: uuid(),
        hasRef,
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
    const { title, onChange } = props, rest = __rest(props, ["title", "onChange"]);
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
    return (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(antd.Button, Object.assign({ type: "primary", size: "large", block: true, onClick: handleClick }, rest, { children: title || t('panel.image.local') })), jsxRuntime.jsx(LocalFileSelector$1, { accept: "image/*", ref: localFileSelectorRef, onChange: handleFileChange })] }));
}

function ImageSelector(props) {
    const { onChange } = props, rest = __rest(props, ["onChange"]);
    return (jsxRuntime.jsx(LocalImageSelector, Object.assign({}, rest, { onChange: onChange })));
}

function ImagePanel() {
    const model = inversifyReact.useInjection('ImageCanvasModel');
    const { editor } = React.useContext(GlobalStateContext);
    const addImage = async (url) => {
        await createFImage({
            imageSource: url,
            canvas: editor.canvas
        });
    };
    const addRefImage = async (url) => {
        await createFImage({
            imageSource: url,
            canvas: editor.canvas,
            hasRef: true
        });
        setTimeout(() => model.openRefSelect(), 300);
    };
    return (jsxRuntime.jsxs("div", Object.assign({ className: "fabritor-panel-wrapper" }, { children: [jsxRuntime.jsx(reactSystem.Box, Object.assign({ mb: 2 }, { children: jsxRuntime.jsx(ImageSelector, { onChange: addImage }) })), jsxRuntime.jsx(ImageSelector, { title: "Image Ref Box", onChange: addRefImage })] })));
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
const DRAG_ICON = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4941" width="22" height="22"><path d="M630.57970569 637.6867208l110.35938764 236.66748681c6.20083831 13.29490805 0.44014302 29.08827497-12.84181964 35.28911328l-96.26186588 44.88164187c-13.29490805 6.20083831-29.08827497 0.45308839-35.28911329-12.84181965l-112.87079191-242.05276602-138.77450271 138.77450272c-10.36925155 10.36925155-27.17235831 10.36925155-37.54160987 0.01294537a26.56392533 26.56392533 0 0 1-7.78017501-18.78375032V147.18616969c0-14.66711861 11.88386133-26.55097995 26.55097995-26.55097996 6.60214518 0 12.97127348 2.45962272 17.86462814 6.89988899l494.18998519 449.26950715c10.84823072 9.86438163 11.65084445 26.65454302 1.78646281 37.50277374a26.56004172 26.56004172 0 0 1-17.6057205 8.6086795L630.57970569 637.6867208z" p-id="4942" fill="#2c2c2c"></path></svg>';

const controlsUtils$2 = fabric.controlsUtils;
const initRectControl = () => {
    const objectControls = fabric.Object.prototype.controls;
    if (fabric.Rect) {
        const rectControls = fabric.Rect.prototype.controls = {};
        rectControls.tr = objectControls.tr;
        rectControls.br = objectControls.br;
        rectControls.tl = objectControls.tl;
        rectControls.bl = objectControls.bl;
        rectControls.mt = objectControls.mt;
        rectControls.mb = objectControls.mb;
        rectControls.mtr = objectControls.mtr;
        rectControls.copy = objectControls.copy;
        rectControls.del = objectControls.del;
        rectControls.ml = new fabric.Control({
            x: -0.5,
            y: 0,
            actionHandler: controlsUtils$2.changeWidth,
            cursorStyleHandler: objectControls.ml.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.ml.render
        });
        rectControls.mr = new fabric.Control({
            x: 0.5,
            y: 0,
            actionHandler: controlsUtils$2.changeWidth,
            cursorStyleHandler: objectControls.mr.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mr.render
        });
        rectControls.mt = new fabric.Control({
            x: 0,
            y: -0.5,
            offsetY: -1,
            actionHandler: changeHeight,
            cursorStyleHandler: objectControls.mt.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.mt.render
        });
        rectControls.mb = new fabric.Control({
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
            const localPoint = new fabric.Point(points[x], points[y]);
            const point = fabric.util.transformPoint(localPoint, fabric.util.multiplyTransformMatrices(fabricObject.canvas.viewportTransform, fabricObject.calcTransformMatrix()));
            return point;
        }
        else {
            return new fabric.Point(0, 0);
        }
    };
};
const initLineControl = () => {
    const objectControls = fabric.Object.prototype.controls;
    if (fabric.Line) {
        const lineControls = fabric.Line.prototype.controls = {};
        lineControls.copy = objectControls.copy;
        lineControls.del = objectControls.del;
        lineControls.l1 = new fabric.Control({
            positionHandler: linePositionHandler('x1', 'y1'),
            actionHandler: changeLineStart,
            cursorStyleHandler: () => 'crosshair',
            actionName: 'line-points-change',
            render: objectControls.br.render
        });
        lineControls.l2 = new fabric.Control({
            positionHandler: linePositionHandler('x2', 'y2'),
            actionHandler: changeLineEnd,
            cursorStyleHandler: () => 'crosshair',
            actionName: 'line-points-change',
            render: objectControls.br.render
        });
    }
};

const controlsUtils$1 = fabric.controlsUtils;
const initFTextControl = () => {
    const objectControls = fabric.Object.prototype.controls;
    if (fabric.Rect) {
        const ftextControl = fabric.FText.prototype.controls = {};
        ftextControl.tr = objectControls.tr;
        ftextControl.br = objectControls.br;
        ftextControl.tl = objectControls.tl;
        ftextControl.bl = objectControls.bl;
        ftextControl.mtr = objectControls.mtr;
        ftextControl.copy = objectControls.copy;
        ftextControl.del = objectControls.del;
        ftextControl.ml = new fabric.Control({
            x: -0.5,
            y: 0,
            offsetX: -1,
            actionHandler: controlsUtils$1.changeWidth,
            cursorStyleHandler: objectControls.ml.cursorStyleHandler,
            actionName: 'resizing',
            render: objectControls.ml.render
        });
        ftextControl.mr = new fabric.Control({
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
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
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
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
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
        fabric.Object.prototype.controls.mt[key] = mtConfig[key];
    });
    const mbConfig = {
        x: 0,
        y: 0.5,
        offsetY: 1,
        render: renderTBIcon
    };
    Object.keys(mbConfig).forEach(key => {
        fabric.Object.prototype.controls.mb[key] = mbConfig[key];
    });
    const mlConfig = {
        x: -0.5,
        y: 0,
        offsetX: -1,
        render: renderLRIcon
    };
    Object.keys(mlConfig).forEach(key => {
        fabric.Object.prototype.controls.ml[key] = mlConfig[key];
    });
    const mrConfig = {
        x: 0.5,
        y: 0,
        offsetX: 1,
        render: renderLRIcon
    };
    Object.keys(mrConfig).forEach(key => {
        fabric.Object.prototype.controls.mr[key] = mrConfig[key];
    });
    const tlConfig = {
        x: -0.5,
        y: -0.5,
        render: renderVertexIcon
    };
    Object.keys(tlConfig).forEach(key => {
        fabric.Object.prototype.controls.tl[key] = tlConfig[key];
    });
    const trConfig = {
        x: 0.5,
        y: -0.5,
        render: renderVertexIcon
    };
    Object.keys(trConfig).forEach(key => {
        fabric.Object.prototype.controls.tr[key] = trConfig[key];
    });
    const blConfig = {
        x: -0.5,
        y: 0.5,
        render: renderVertexIcon
    };
    Object.keys(blConfig).forEach(key => {
        fabric.Object.prototype.controls.bl[key] = blConfig[key];
    });
    const brConfig = {
        x: 0.5,
        y: 0.5,
        render: renderVertexIcon
    };
    Object.keys(brConfig).forEach(key => {
        fabric.Object.prototype.controls.br[key] = brConfig[key];
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
        fabric.Object.prototype.controls.mtr[key] = mtrConfig[key];
    });
};
const renderToolBarController = () => {
    const copyControl = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetX: -24,
        offsetY: -26,
        cursorStyle: 'pointer',
        mouseUpHandler: handleCopyObject,
        render: renderSvgIcon(COPY_IMG)
    });
    fabric.Object.prototype.controls.copy = copyControl;
    const delControl = new fabric.Control({
        x: 0,
        y: -0.5,
        offsetX: 24,
        offsetY: -26,
        cursorStyle: 'pointer',
        mouseUpHandler: handleDelObject,
        render: renderSvgIcon(DEL_IMG)
    });
    fabric.Object.prototype.controls.del = delControl;
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

const controlsUtils = fabric.controlsUtils;
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
    var target = transform.target, control = target.controls[transform.corner], zoom = target.canvas.getZoom(), padding = target.padding / zoom, localPoint = target.toLocalPoint(new fabric.Point(x, y), originX, originY);
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
		left: 221,
		top: 176.27,
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
		splitByGrapheme: false,
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
		top: 371.69,
		width: 1102.41,
		height: 406.8,
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
		fontFamily: "Zilla Slab Highlight",
		fontWeight: "normal",
		fontSize: 100,
		text: "MyShell \nBuild, Share, Own\nAI Agents",
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
		splitByGrapheme: false,
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

const MAX_HISTORY_LENGTH = 100;
const PANEL_WIDTH = 360;
const SETTER_WIDTH = 290;

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
                    } }, { children: renderTrigger() })) })), jsxRuntime.jsx("svg", Object.assign({ style: { width: 0, height: 0, position: 'absolute' }, "aria-hidden": "true", focusable: "false" }, { children: jsxRuntime.jsx("linearGradient", Object.assign({ id: "colorsetter-icon-gradient", x2: "1", y2: "1" }, { children: (_a = value === null || value === void 0 ? void 0 : value.gradient) === null || _a === void 0 ? void 0 : _a.colorStops.map(stop => (jsxRuntime.jsx("stop", { offset: `${stop.offset * 100}%`, stopColor: stop.color }, `${stop.color}-${stop.offset}`))) })) }))] }));
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

const { Item: FormItem$c } = antd.Form;
function SketchSetter() {
    const [form] = antd.Form.useForm();
    const { editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const handleFill = (_fill) => {
        const { sketch, canvas } = editor;
        let fill = transformColors2Fill(_fill);
        if (typeof fill !== 'string') {
            fill = new fabric.Gradient(fill);
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ layout: "vertical", colon: false, form: form, onValuesChange: handleValuesChange }, { children: [jsxRuntime.jsx(FormItem$c, Object.assign({ label: t('setter.sketch.size'), name: "size" }, { children: jsxRuntime.jsx(SizeSetter, {}) })), jsxRuntime.jsx(FormItem$c, Object.assign({ label: t('setter.sketch.fill'), name: "fill" }, { children: jsxRuntime.jsx(ColorSetter, { type: "sketch" }) }))] })));
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

function SliderInputNumber(props) {
    const { min = 1, max = 100, step = 1, style, sliderProps, inputProps, onChange, onChangeComplete, value } = props;
    return (jsxRuntime.jsxs(antd.Flex, Object.assign({ gap: 6, style: style }, { children: [jsxRuntime.jsx(antd.Slider, Object.assign({ style: { flex: 1 }, min: min, max: max, step: step, onChange: onChange, onAfterChange: onChangeComplete, value: value }, sliderProps)), jsxRuntime.jsx(antd.InputNumber, Object.assign({ min: min, max: max, step: step, onChange: onChange, value: value, style: { width: 56 }, controls: false }, inputProps))] })));
}

function Center(props) {
    const { children, height = 46, style } = props, rest = __rest(props, ["children", "height", "style"]);
    return (jsxRuntime.jsx(antd.Flex, Object.assign({ justify: "center", align: "center" }, rest, { style: Object.assign({ height }, style) }, { children: children })));
}
const CenterV = (props) => {
    return (jsxRuntime.jsx(Center, Object.assign({ justify: "normal" }, props)));
};

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

const { Item: FormItem$b } = antd.Form;
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$b, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.shadow') })) }), jsxRuntime.jsx(FormItem$b, Object.assign({ label: t('common.color'), name: "color" }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$b, Object.assign({ label: t('common.blur'), name: "blur" }, { children: jsxRuntime.jsx(antd.Slider, { min: 0, max: 20 }) })), jsxRuntime.jsx(FormItem$b, Object.assign({ label: t('common.offset'), name: "offset" }, { children: jsxRuntime.jsx(antd.Slider, { min: -180, max: 180 }) }))] })));
}

const { Item: FormItem$a } = antd.Form;
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 16 }, { children: [jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$a, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('setter.text.fx.text_path') })) }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$a, Object.assign({ name: "enable", valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, {}) })) })] })), jsxRuntime.jsx(FormItem$a, Object.assign({ label: t('common.offset'), name: "offset" }, { children: jsxRuntime.jsx(antd.Slider, { min: -100, max: 100 }) }))] })));
}

const { Item: FormItem$9 } = antd.Form;
function TextPattern(props) {
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleChange, colon: false }, { children: [jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 16 }, { children: [jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$9, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('setter.text.fx.fill_image') })) }) }), jsxRuntime.jsx(antd.Col, { children: jsxRuntime.jsx(FormItem$9, Object.assign({ name: "enable", valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, {}) })) })] })), jsxRuntime.jsx(FormItem$9, Object.assign({ name: "url" }, { children: jsxRuntime.jsx(ImageSelector, { size: "middle", type: "default", title: "Local Image" }) }))] })));
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
            if (object.fill instanceof fabric.Pattern) {
                object.set('fill', '#000000');
            }
            return Promise.resolve();
        }
        try {
            const img = await loadImageDom(pattern.url);
            object.set('fill', new fabric.Pattern({
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
            stroke = new fabric.Gradient(stroke);
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
                enable: fill instanceof fabric.Pattern,
                url: (_d = fill === null || fill === void 0 ? void 0 : fill.source) === null || _d === void 0 ? void 0 : _d.src
            }
        });
    };
    React.useEffect(() => {
        if (object && object.type === 'f-text') {
            initObjectFx();
        }
    }, [object]);
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleFxValueChange, colon: false, style: { marginTop: 24 } }, { children: [jsxRuntime.jsx(FormItem$8, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.stroke') })) }), jsxRuntime.jsx(FormItem$8, Object.assign({ label: t('common.stroke_color'), name: "stroke" }, { children: jsxRuntime.jsx(ColorSetter, {}) })), jsxRuntime.jsx(FormItem$8, Object.assign({ label: t('common.stroke_width'), name: "strokeWidth" }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 20 }) })), jsxRuntime.jsx(FormItem$8, Object.assign({ name: "shadow", style: { marginBottom: 0 } }, { children: jsxRuntime.jsx(TextShadow, {}) })), jsxRuntime.jsx(FormItem$8, Object.assign({ name: "path", style: { marginBottom: 0 } }, { children: jsxRuntime.jsx(TextPath, {}) })), jsxRuntime.jsx(FormItem$8, Object.assign({ name: "pattern" }, { children: jsxRuntime.jsx(TextPattern, {}) }))] })));
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
const RefSelect = mobxReactLite.observer((props) => {
    const model = inversifyReact.useInjection('ImageCanvasModel');
    const keyPath = model.convertValueFieldToRef(props.value);
    const variables = mobx.toJS(model.variables);
    const ref = React.useRef(null);
    ahooks.useClickAway(() => {
        if (model.isRefSelectOpen) {
            model.closeRefSelect();
        }
    }, ref);
    return (jsxRuntime.jsx(antd.Dropdown, Object.assign({ open: model.isRefSelectOpen, menu: {
            onClick: (info) => {
                props.onChange(model.processWorkflowRunnerOutput(info.keyPath));
                model.closeRefSelect();
            },
            selectedKeys: keyPath,
            items: variables
        }, placement: "bottomRight", overlayStyle: {} }, { children: jsxRuntime.jsx("div", Object.assign({ ref: ref, className: 'x-ref-select' }, { children: jsxRuntime.jsx(antd.Select, { onClick: () => model.toggleRefSelect(), options: [], dropdownRender: (originNode) => null, dropdownStyle: { display: 'none' }, value: model.getRefSelectDisplay(keyPath), placeholder: "Please select variable", onClear: () => props.onChange(undefined), allowClear: true }) })) })));
});

const { Item: FormItem$7 } = antd.Form;
function TextSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const [form] = antd.Form.useForm();
    const [openFx, setOpenFx] = React.useState(false);
    const [fontScale, setFontScale] = React.useState(false);
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
            fill = new fabric.Gradient(fill);
        }
        object.set({ fill });
    };
    const handleValuesChange = async (values) => {
        const keys = Object.keys(values);
        if (!(keys === null || keys === void 0 ? void 0 : keys.length))
            return;
        for (let key of keys) {
            if (key === 'fontScale') {
                object.set(key, values[key]);
                form.setFieldValue('maxFontSize', form.getFieldValue('fontSize'));
                setFontScale(values[key]);
            }
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
        setFontScale(object.fontScale);
        form.setFieldsValue({
            ref: object.ref,
            text: object.text,
            fontFamily: object.fontFamily,
            fontSize: object.fontSize,
            fontScale: object.fontScale,
            fill: transformFill2Colors(object.fill),
            textAlign: object.textAlign,
            lineHeight: object.lineHeight,
            charSpacing: object.charSpacing,
            fontStyles: {
                bold: object.fontWeight === 'bold',
                italic: object.fontStyle === 'italic',
                underline: object.underline,
                linethrough: object.linethrough,
            }
        });
    }, [object]);
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [object.ref !== undefined ? jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(antd.Form.Item, Object.assign({ name: "ref", help: RefHelp, label: jsxRuntime.jsx(RefLabel, {}) }, { children: jsxRuntime.jsx(RefSelect, { id: 'ref', objId: object['id'], value: form.getFieldValue('ref'), onChange: (val) => {
                                        form.setFieldValue('ref', val);
                                        object.set('ref', val);
                                    } }) })), jsxRuntime.jsx(antd.Form.Item, Object.assign({ label: "Placeholder", name: "text" }, { children: jsxRuntime.jsx(antd.Input.TextArea, { placeholder: 'ref placeholder', onChange: e => {
                                        form.setFieldValue('text', e.target.value);
                                        object.set('text', e.target.value);
                                    } }) }))] }) : null, jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontFamily", label: t('setter.text.font_family') }, { children: jsxRuntime.jsx(antd.Select, { showSearch: true, options: FONT_PRESET_FAMILY_LIST_GOOGLE_FONT, onDropdownVisibleChange: open => {
                                if (open) {
                                    void loadPresetGoogleFonts();
                                }
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ label: 'Font scale', name: "fontScale", valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, { id: 'fontScale', checked: form.getFieldValue('fontScale'), onChange: (checked) => {
                                form.setFieldValue('fontScale', checked);
                                object.set('fontScale', checked);
                            } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontSize", label: t('setter.text.font_size') }, { children: jsxRuntime.jsx(SliderInputNumber, { max: 400, onChangeComplete: () => {
                                editor.fireCustomModifiedEvent();
                            }, inputProps: { disabled: fontScale }, sliderProps: { disabled: fontScale } }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fill", label: t('setter.text.fill') }, { children: jsxRuntime.jsx(ColorSetter, { type: "fontColor", defaultColor: "#000000" }) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "textAlign", label: t('setter.text.text_align') }, { children: jsxRuntime.jsx(AlignSetter, {}) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "fontStyles", label: t('setter.text.font_styles') }, { children: jsxRuntime.jsx(FontStylePanel, {}) })), jsxRuntime.jsx(FormItem$7, Object.assign({ name: "charSpacing", label: t('setter.text.char_spacing') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: -200, max: 800, onChangeComplete: () => {
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
    const { onChange } = props, rest = __rest(props, ["onChange"]);
    return (jsxRuntime.jsx(ImageSelector, Object.assign({ size: "middle", onChange: onChange, title: t('setter.image.replace') }, rest)));
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
function BorderSetter$1(props) {
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

function ClipSetter(props) {
    const { t } = reactI18next.useTranslation();
    const { object } = props;
    const imgRef = React.useRef();
    const cropperRef = React.useRef(null);
    const [showCrop, setShowCrop] = React.useState(false);
    const [imgInfo, setImgInfo] = React.useState({});
    const startCrop = () => {
        setShowCrop(true);
        const boundingRect = object.getBoundingRect();
        setImgInfo({
            src: object.getSrc(),
            width: boundingRect.width,
            height: boundingRect.height,
            left: boundingRect.left + PANEL_WIDTH,
            top: boundingRect.top + 50
        });
        setTimeout(() => {
            cropperRef.current = new Cropper__default.default(imgRef.current, {
                scalable: false,
                autoCropArea: 1,
                viewMode: 3,
                toggleDragModeOnDblclick: false
            });
            object.set('hasControls', false);
            object.canvas.requestRenderAll();
        }, 66);
    };
    const handleCrop = () => {
        if (cropperRef.current) {
            const newImage = cropperRef.current.getCroppedCanvas().toDataURL();
            object.setSrc(newImage, () => {
                object.set('hasControls', true);
                if (object.group) {
                    object.group.addWithUpdate();
                }
                object.canvas.requestRenderAll();
                object.setCoords();
            });
            setShowCrop(false);
        }
    };
    const changeRatio = (r) => {
        if (cropperRef.current) {
            cropperRef.current.setAspectRatio(r);
        }
    };
    const cancel = () => {
        setShowCrop(false);
        object.set('hasControls', true);
        object.canvas.requestRenderAll();
    };
    React.useEffect(() => {
        return () => {
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }
        };
    }, []);
    return (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx(antd.Button, Object.assign({ block: true, icon: jsxRuntime.jsx(icons.ExpandOutlined, {}), onClick: startCrop }, { children: t('setter.image.crop') })), showCrop ?
                jsxRuntime.jsxs("div", Object.assign({ style: {
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,.65)',
                        zIndex: 1000
                    }, className: "fabritor-crop-wrapper" }, { children: [jsxRuntime.jsx("div", Object.assign({ style: {
                                position: 'absolute',
                                zIndex: 1001,
                                left: imgInfo.left,
                                top: imgInfo.top - 38
                            } }, { children: jsxRuntime.jsxs(antd.Space.Compact, Object.assign({ block: true }, { children: [jsxRuntime.jsx(antd.Button, Object.assign({ onClick: () => { changeRatio(1 / 1); } }, { children: "1:1" })), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: () => { changeRatio(4 / 3); } }, { children: "4:3" })), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: () => { changeRatio(3 / 4); } }, { children: "3:4" })), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: () => { changeRatio(16 / 9); } }, { children: "16:9" })), jsxRuntime.jsx(antd.Button, Object.assign({ onClick: () => { changeRatio(9 / 16); } }, { children: "9:16" })), jsxRuntime.jsx(antd.Button, { icon: jsxRuntime.jsx(icons.CloseOutlined, {}), onClick: cancel }), jsxRuntime.jsx(antd.Button, { icon: jsxRuntime.jsx(icons.CheckOutlined, {}), onClick: handleCrop })] })) })), jsxRuntime.jsx("div", Object.assign({ style: {
                                width: imgInfo.width,
                                height: imgInfo.height,
                                position: 'absolute',
                                zIndex: 1001,
                                left: imgInfo.left,
                                top: imgInfo.top
                            }, onDoubleClick: handleCrop }, { children: jsxRuntime.jsx("img", { ref: imgRef, src: imgInfo.src, style: { display: 'block', maxWidth: '100%' } }) }))] })) : null] }));
}

function BorderSetter(props) {
    const { value, onChange } = props;
    const [showMore, setShowMore] = React.useState(false);
    const { t } = reactI18next.useTranslation();
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(antd.Button, Object.assign({ block: true, icon: jsxRuntime.jsx(icons.BorderOutlined, {}), onClick: () => { setShowMore(true); } }, { children: t('common.border') })), jsxRuntime.jsx(MoreConfigWrapper, Object.assign({ open: showMore, setOpen: setShowMore, title: t('common.border') }, { children: jsxRuntime.jsx("div", Object.assign({ style: { marginTop: 24 } }, { children: jsxRuntime.jsx(BorderSetter$1, { value: value, onChange: onChange }) })) }))] }));
}

const { Item: FormItem$5 } = antd.Form;
function ImageSetter() {
    const { object, editor } = React.useContext(GlobalStateContext);
    const { t } = reactI18next.useTranslation();
    const [form] = antd.Form.useForm();
    const [openFx, setOpenFx] = React.useState(false);
    [
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
        const keys = Object.keys(values);
        if (!(keys === null || keys === void 0 ? void 0 : keys.length))
            return;
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
        if (values.objectFit) {
            object.set('objectFit', values.objectFit);
        }
    };
    React.useEffect(() => {
        if (object) {
            const border = object.getBorder();
            form.setFieldsValue({
                border: Object.assign(Object.assign({ type: getObjectBorderType(border) }, border), { stroke: border.stroke || '#000000' }),
                opacity: object.opacity,
                ref: object.ref,
                objectFit: object.objectFit
            });
        }
    }, [object]);
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [object.hasRef ? jsxRuntime.jsx(antd.Form.Item, Object.assign({ name: "ref", help: RefHelp, label: jsxRuntime.jsx(RefLabel, {}) }, { children: jsxRuntime.jsx(RefSelect, { id: 'ref', objId: object['id'], value: form.getFieldValue('ref'), onChange: (val) => {
                            form.setFieldValue('ref', val);
                            object.set('ref', val);
                        } }) })) : null, jsxRuntime.jsx(FormItem$5, Object.assign({ name: "img" }, { children: jsxRuntime.jsx(ReplaceSetter, {}) })), jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 8 }, { children: [jsxRuntime.jsx(antd.Col, Object.assign({ span: 12 }, { children: jsxRuntime.jsx(FormItem$5, { children: jsxRuntime.jsx(ClipSetter, { object: object }) }) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 12 }, { children: jsxRuntime.jsx(FormItem$5, Object.assign({ name: "border" }, { children: jsxRuntime.jsx(BorderSetter, {}) })) }))] })), jsxRuntime.jsx(antd.Divider, { style: { margin: '16px 0' } }), jsxRuntime.jsx("span", Object.assign({ style: { fontWeight: 'bold', display: 'inline-block', marginBottom: 16 } }, { children: "Object Fit" })), jsxRuntime.jsx(FormItem$5, Object.assign({ name: "objectFit", label: "" }, { children: jsxRuntime.jsxs(antd.Radio.Group, Object.assign({ defaultValue: "fill" }, { children: [jsxRuntime.jsx(antd.Radio.Button, Object.assign({ value: "fill" }, { children: "Fill" })), jsxRuntime.jsx(antd.Radio.Button, Object.assign({ value: "cover" }, { children: "Cover" }))] })) }))] })) }));
}

const { Item: FormItem$4 } = antd.Form;
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$4, Object.assign({ name: "stroke", label: t('common.stroke_color') }, { children: jsxRuntime.jsx(SolidColorSetter, {}) })), jsxRuntime.jsx(FormItem$4, Object.assign({ name: "type", label: t('common.style'), labelCol: { span: 24 } }, { children: jsxRuntime.jsx(antd.Radio.Group, { children: LINE_BORDER_TYPES.map(item => (jsxRuntime.jsx(antd.Radio.Button, Object.assign({ value: item.key }, { children: jsxRuntime.jsx("span", { dangerouslySetInnerHTML: { __html: item.svg }, style: {
                                display: 'inline-flex',
                                alignItems: 'center',
                                marginTop: 6
                            } }) }), item.key))) }) })), jsxRuntime.jsx(FormItem$4, Object.assign({ name: "strokeWidth", label: t('common.stroke_width') }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 1, max: 50, onChangeComplete: () => { editor.fireCustomModifiedEvent(); } }) })), jsxRuntime.jsx(FormItem$4, Object.assign({ name: "round", label: t('common.round'), valuePropName: "checked" }, { children: jsxRuntime.jsx(antd.Switch, {}) }))] })));
}

const { Item: FormItem$3 } = antd.Form;
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
                fill = new fabric.Gradient(fill);
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: handleValuesChange, colon: false }, { children: [jsxRuntime.jsx(FormItem$3, Object.assign({ name: "fill", label: t('common.color') }, { children: jsxRuntime.jsx(ColorSetter, { defaultColor: "#000000" }) })), jsxRuntime.jsx(FormItem$3, Object.assign({ name: "border", label: jsxRuntime.jsx("span", Object.assign({ style: { fontWeight: 'bold', fontSize: 15 } }, { children: t('common.border') })), labelCol: { span: 24 } }, { children: jsxRuntime.jsx(BorderSetter$1, {}) }))] })));
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
    return (jsxRuntime.jsx(antd.Dropdown, Object.assign({ placement: "bottom", trigger: ["click"], menu: { items: items$1, onClick }, arrow: true }, { children: jsxRuntime.jsx("span", { children: jsxRuntime.jsxs("svg", Object.assign({ width: "22", height: "22", viewBox: "0 0 48 48", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, { children: [jsxRuntime.jsx("path", { d: "M30 10H40C41.8856 10 42.8284 10 43.4142 10.5858C44 11.1716 44 12.1144 44 14V34C44 35.8856 44 36.8284 43.4142 37.4142C42.8284 38 41.8856 38 40 38H30", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", strokeLinejoin: "miter" }), jsxRuntime.jsx("path", { d: "M18 10H8C6.11438 10 5.17157 10 4.58579 10.5858C4 11.1716 4 12.1144 4 14V34C4 35.8856 4 36.8284 4.58579 37.4142C5.17157 38 6.11438 38 8 38H18", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", "stroke-linejoin": "miter" }), jsxRuntime.jsx("path", { d: "M24 6V42", stroke: "currentColor", "stroke-width": "4", "stroke-linecap": "square", "stroke-linejoin": "miter" })] })) }) })));
}

const { Item: FormItem$2 } = antd.Form;
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
    return (jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(antd.Button, Object.assign({ block: true, onClick: () => { setShowMore(true); } }, { children: t('setter.common.adjust_position') })), jsxRuntime.jsx(MoreConfigWrapper, Object.assign({ open: showMore, setOpen: setShowMore, title: t('setter.common.adjust_position') }, { children: jsxRuntime.jsx("div", Object.assign({ style: { marginTop: 24 } }, { children: jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, layout: "vertical", colon: false, onValuesChange: handleChange }, { children: [jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 8 }, { children: [jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$2, Object.assign({ label: `${t('setter.size.width')}(${t('setter.common.px')})`, name: "width" }, { children: jsxRuntime.jsx(PxInputNumber, { min: 1 }) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$2, Object.assign({ label: `${t('setter.size.height')}(${t('setter.common.px')})`, name: "height" }, { children: jsxRuntime.jsx(PxInputNumber, { min: 1 }) })) }))] })), jsxRuntime.jsxs(antd.Row, Object.assign({ gutter: 8 }, { children: [jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$2, Object.assign({ label: `X(${t('setter.common.px')})`, name: "left" }, { children: jsxRuntime.jsx(PxInputNumber, {}) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$2, Object.assign({ label: `Y(${t('setter.common.px')})`, name: "top" }, { children: jsxRuntime.jsx(PxInputNumber, {}) })) })), jsxRuntime.jsx(antd.Col, Object.assign({ span: 8 }, { children: jsxRuntime.jsx(FormItem$2, Object.assign({ label: `${t('setter.common.rotate')}(°)`, name: "angle" }, { children: jsxRuntime.jsx(PxInputNumber, { min: -360, max: 360, precision: 0 }) })) }))] }))] })) })) }))] }));
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

const { Item: FormItem$1 } = antd.Form;
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
    return (jsxRuntime.jsxs(antd.Form, Object.assign({ form: form, onValuesChange: onChange, style: { marginBottom: 0, marginTop: 16 }, colon: false }, { children: [showPenTip ? jsxRuntime.jsx(FormItem$1, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('panel.paint.title') })) }) : null, jsxRuntime.jsx(FormItem$1, Object.assign({ label: showFillConfig ? t('common.stroke') : t('common.stroke_color'), name: "color" }, { children: jsxRuntime.jsx(SolidColorSetter, { onChange: fireEvent }) })), jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('common.line_width'), name: "width" }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 1, max: 100, onChangeComplete: fireEvent }) })), showFillConfig ?
                jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('common.fill'), name: "fill" }, { children: jsxRuntime.jsx(ColorSetter, { onChange: fireEvent }) })) : null, jsxRuntime.jsx(FormItem$1, { label: jsxRuntime.jsx("span", Object.assign({ style: { fontSize: 15, fontWeight: 'bold' } }, { children: t('common.shadow') })) }), jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('common.color'), name: ['shadow', 'color'] }, { children: jsxRuntime.jsx(SolidColorSetter, { onChange: fireEvent }) })), jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('common.width'), name: ['shadow', 'width'] }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 50, onChangeComplete: fireEvent }) })), jsxRuntime.jsx(FormItem$1, Object.assign({ label: t('common.offset'), name: ['shadow', 'offset'] }, { children: jsxRuntime.jsx(SliderInputNumber, { min: 0, max: 20, onChangeComplete: fireEvent }) }))] })));
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
                fill = new fabric.Gradient(fill);
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
            object.set('shadow', new fabric.Shadow(newShadowObject));
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
        fabric.Image.prototype.needsItsOwnCache = () => false;
        fabric.perfLimitSizeTotal = 16777216;
    }
    Object.keys(OBJECT_DEFAULT_CONFIG).forEach(key => {
        fabric.Object.prototype[key] = OBJECT_DEFAULT_CONFIG[key];
    });
    const asConfig = {
        borderColor: '#cccddd',
        borderDashArray: [7, 10],
        borderScaleFactor: 3,
        padding: 10
    };
    Object.keys(asConfig).forEach(key => {
        fabric.ActiveSelection.prototype[key] = asConfig[key];
        fabric.Group.prototype[key] = asConfig[key];
    });
    fabric.Group.prototype.subTargetCheck = true;
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
    const group = new fabric.Group(items, Object.assign({ id: uuid() }, rest));
    canvas.add(group);
    return group;
};

const clone = fabric.util.object.clone;
const additionalProps = ('fontFamily fontWeight fontSize text underline overline linethrough' +
    ' textAlign fontStyle lineHeight textBackgroundColor charSpacing styles' +
    ' direction path pathStartOffset pathSide pathAlign minWidth splitByGrapheme').split(' ');
const createFTextClass = () => {
    fabric.FText = fabric.util.createClass(fabric.Textbox, {
        type: 'f-text',
        padding: 0,
        paintFirst: 'stroke',
        objectCaching: false,
        needsItsOwnCache: function () {
            return false;
        },
        initDimensions: function () {
            if (this.__skipDimension) {
                return;
            }
            this.isEditing && this.initDelayedCursor();
            this.clearContextTop();
            this._clearCache();
            if (this.fontScale) {
                const width = this._measureWord(this.text, 0, 0);
                if (width !== 0) {
                    const fontSize = this.fontSize * this.width / (width + 1);
                    if (width > this.width || fontSize < this.maxFontSize) {
                        const fontSize = this.fontSize * this.width / (width + 1);
                        this._set('fontSize', fontSize);
                    }
                }
                else {
                    this._set('fontSize', this.maxFontSize);
                }
            }
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
            obj.styles = fabric.util.stylesToArray(this.styles, this.text);
            if (obj.path) {
                obj.path = this.path.toObject();
            }
            return obj;
        },
    });
    fabric.FText.fromObject = function (object, callback) {
        const objectCopy = clone(object), path = object.path;
        delete objectCopy.path;
        return fabric.Object._fromObject('FText', objectCopy, function (textInstance) {
            textInstance.styles = fabric.util.stylesFromArray(object.styles, object.text);
            textInstance.set('maxFontSize', object.fontSize);
            if (path) {
                fabric.Object._fromObject('Path', path, function (pathInstance) {
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
    fabric.FImage = fabric.util.createClass(fabric.Group, {
        type: 'f-image',
        initialize(options, alreayGrouped = false) {
            const { image, imageBorder = {} } = options, rest = __rest(options, ["image", "imageBorder"]);
            image.set({
                originX: 'center',
                originY: 'center'
            });
            this.img = image;
            this.img.parent = this;
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
            return new fabric.Rect(options);
        },
        _createClipPath() {
            const width = this.img.width;
            const height = this.img.height;
            return new fabric.Rect({
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
    fabric.FImage.fromObject = (object, callback) => {
        const { objects } = object, options = __rest(object, ["objects"]);
        const imgJson = Object.assign({}, objects[0]);
        fabric.Image.fromObject(imgJson, (img) => {
            callback(new fabric.FImage(Object.assign({ image: img }, options), true));
        });
    };
};

const extend$1 = fabric.util.object.extend;
const createFLineClass = () => {
    fabric.FLine = fabric.util.createClass(fabric.Line, {
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
    fabric.FLine.fromObject = (object, callback) => {
        function _callback(instance) {
            delete instance.points;
            callback && callback(instance);
        }
        const options = Object.assign({}, object);
        options.points = [object.x1, object.y1, object.x2, object.y2];
        fabric.Object._fromObject('FLine', options, _callback, 'points');
    };
};

const extend = fabric.util.object.extend;
const createFArrowClass = () => {
    fabric.FArrow = fabric.util.createClass(fabric.Line, {
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
    fabric.FArrow.fromObject = function (object, callback) {
        callback && callback(new fabric.FArrow([object.x1, object.y1, object.x2, object.y2], object));
    };
};
const createFTriArrowClass = () => {
    fabric.FTriArrow = fabric.util.createClass(fabric.Line, {
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
    fabric.FTriArrow.fromObject = function (object, callback) {
        callback && callback(new fabric.FTriArrow([object.x1, object.y1, object.x2, object.y2], object));
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
        this.canvas = new fabric.Canvas(canvasEl, {
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
        const sketch = new fabric.Rect({
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
        this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomLevel - 0.04);
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
