import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import VariableValueBlockComponent from './component';
type SerializedVariableValueBlockNode = SerializedLexicalNode & {
  text: string;
};

export class VariableValueBlockNode extends DecoratorNode<JSX.Element> {
  __text: string;

  static getType(): string {
    return 'variable-value-block';
  }

  static clone(node: VariableValueBlockNode): VariableValueBlockNode {
    return new VariableValueBlockNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.classList.add('inline-flex', 'items-center', 'align-middle');
    return div;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <VariableValueBlockComponent nodeKey={this.getKey()} text={this.__text} />
    );
  }

  isInline(): boolean {
    return true;
  }

  static importJSON(
    serializedNode: SerializedVariableValueBlockNode,
  ): VariableValueBlockNode {
    return $createVariableValueBlockNode(serializedNode.text);
  }

  exportJSON(): SerializedVariableValueBlockNode {
    return {
      text: this.getText(),
      type: 'variable-value-block',
      version: 1,
    };
  }

  getText(): string {
    return this.__text;
  }

  getTextContent(): string {
    return this.getText();
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
