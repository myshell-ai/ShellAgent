'use strict';

var mobx = require('mobx');
var inversify = require('inversify');
var mitt = require('mitt');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var mitt__default = /*#__PURE__*/_interopDefault(mitt);

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


function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const WORKFLOW_RUNNER = 'Workflow Runner';
exports.ImageCanvasModel = class ImageCanvasModel {
    constructor() {
        this.emitter = mitt__default.default();
        this.variables = [];
        mobx.makeObservable(this);
        this.isEditorReadyPromise = new Promise((resolve) => {
            this.isEditorReadyPromiseResolve = resolve;
        });
    }
    myPreDestroyMethod() {
        this.emitter.all.clear();
    }
    setEditor(editor) {
        this.editor = editor;
        this.isEditorReadyPromiseResolve("");
    }
    async canvas2Json() {
        await this.isEditorReadyPromise;
        const rawJson = this.editor.canvas2Json();
        rawJson.objects.forEach((object) => {
            if (object.ref) {
                if (object.type === 'f-image') {
                    object.objects.forEach(o => {
                        if (o.type === 'image') {
                            o._src = object.src;
                            o.src = object.ref;
                        }
                    });
                }
                if (object.type === 'f-text') {
                    object._text = object.text;
                    object.text = object.ref;
                }
            }
        });
        return rawJson;
    }
    async loadFromJSON(json) {
        await this.isEditorReadyPromise;
        json.objects.forEach((object) => {
            if (object.type === 'f-text' && object._text) {
                object.ref = object.text;
                object.text = object._text;
            }
            if (object.type === 'f-image') {
                object.objects.forEach(o => {
                    if (o.type === 'image') {
                        object.ref = object._src;
                        object.src = object.ref;
                    }
                });
            }
        });
        this.emitter.emit("loadFromJSON", json);
    }
    setVariables(variables) {
        this.variables = transformVariables(variables);
    }
    specialProcessKeyPath(value) {
        let keyPath = [];
        if (value == null) {
            keyPath = [];
        }
        else if (typeof value === 'string' && value.endsWith('[0]')) {
            keyPath = [value.replace('[0]', '')];
        }
        else {
            keyPath = [value];
        }
        return keyPath;
    }
    getRefSelectDisplay(keyPath) {
        if (keyPath.length === 0)
            return undefined;
        const path = findPathByValue(this.variables, keyPath[0]);
        path.shift();
        return path.join('/');
    }
    specialProcessWorkflowRunnerOutput(keyPath) {
        keyPath = keyPath.slice(0);
        if (keyPath[keyPath.length - 1] === WORKFLOW_RUNNER) {
            return keyPath[0] + '[0]';
        }
        return keyPath[0];
    }
};
__decorate([
    mobx.observable,
    __metadata("design:type", Object)
], exports.ImageCanvasModel.prototype, "variables", void 0);
__decorate([
    inversify.preDestroy(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], exports.ImageCanvasModel.prototype, "myPreDestroyMethod", null);
__decorate([
    mobx.action.bound,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], exports.ImageCanvasModel.prototype, "setVariables", null);
exports.ImageCanvasModel = __decorate([
    inversify.injectable(),
    __metadata("design:paramtypes", [])
], exports.ImageCanvasModel);
function transformVariables(source) {
    return source.map((item) => ({
        label: item.label,
        key: item.children == null ? item.value : item.label,
        type: item.value == null ? "group" : undefined,
        children: item.children ? transformVariables(item.children) : undefined,
    }));
}
function findPathByValue(variables, targetValue) {
    for (const item of variables) {
        if (item.key === targetValue) {
            return [item.label];
        }
        if (item.children) {
            const foundPath = findPathByValue(item.children, targetValue);
            if (foundPath) {
                return [item.label, ...foundPath];
            }
        }
    }
    return null;
}
