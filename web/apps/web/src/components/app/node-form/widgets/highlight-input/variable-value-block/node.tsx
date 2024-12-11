import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from 'lexical';
import { $applyNodeReplacement, TextNode } from 'lexical';

export class VariableValueBlockNode extends TextNode {
  static getType(): string {
    return 'variable-value-block';
  }

  static clone(node: VariableValueBlockNode): VariableValueBlockNode {
    return new VariableValueBlockNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    element.classList.add(
      'inline-flex',
      'items-center',
      'px-0.5',
      'h-[22px]',
      'rounded-[5px]',
      'align-middle',
    );
    element.style.position = 'relative';
    element.style.padding = '4px';
    element.style.borderRadius = '8px';
    element.style.color = 'rgb(255, 99, 71)';
    element.style.backgroundColor = '#f5f5f5';

    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): TextNode {
    const node = $createVariableValueBlockNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTextNode {
    return {
      detail: this.getDetail(),
      format: this.getFormat(),
      mode: this.getMode(),
      style: this.getStyle(),
      text: this.getTextContent(),
      type: 'variable-value-block',
      version: 1,
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }
}

export function $createVariableValueBlockNode(
  text = '',
): VariableValueBlockNode {
  return $applyNodeReplacement(new VariableValueBlockNode(text));
}

export function $isVariableValueNodeBlock(
  node: LexicalNode | null | undefined,
): node is VariableValueBlockNode {
  return node instanceof VariableValueBlockNode;
}
