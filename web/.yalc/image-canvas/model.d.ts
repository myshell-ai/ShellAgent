import * as mitt from 'mitt';
import { MenuProps } from 'antd';
import { fabric } from 'fabric';

declare class Editor {
    canvas: fabric.Canvas;
    private _options;
    private _template;
    sketch: fabric.Rect;
    private _resizeObserver;
    private _pan;
    fhistory: any;
    autoSave: any;
    constructor(options: any);
    init(): Promise<void>;
    private _initObject;
    private _initCanvas;
    private _initGuidelines;
    private _initSketch;
    setSketchSize(size: any): void;
    private _initResizeObserver;
    private _adjustSketch2Canvas;
    private _initEvents;
    private _editTextInGroup;
    switchEnablePan(): any;
    getIfPanEnable(): any;
    fireCustomModifiedEvent(data?: any): void;
    private _scrollSketch;
    destroy(): void;
    export2Img(options: any): string;
    export2Svg(): string;
    canvas2Json(): {
        version: string;
        objects: fabric.Object[];
    };
    loadFromJSON(json: any, errorToast?: boolean): Promise<unknown>;
    clearCanvas(): Promise<void>;
}

declare class ImageCanvasModel {
    emitter: mitt.Emitter<{
        loadFromJSON: unknown;
    }>;
    variables: MenuProps["items"];
    isRefSelectOpen: boolean;
    private isEditorReadyPromiseResolve;
    private isEditorReadyPromise;
    private editor;
    constructor();
    myPreDestroyMethod(): void;
    setEditor(editor: Editor): void;
    canvas2Json(): Promise<unknown>;
    loadFromJSON(json: any): Promise<void>;
    setVariables(variables: any[]): void;
    convertValueFieldToRef(value: string): string[];
    getRefSelectDisplay(keyPath: string[]): string;
    processWorkflowRunnerOutput(keyPath: string[]): string;
    openRefSelect(): void;
    closeRefSelect(): void;
    toggleRefSelect(): void;
}

export { ImageCanvasModel };
