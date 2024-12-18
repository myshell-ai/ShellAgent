import type { LexicalNode, TextNode } from 'lexical';
import { $isTextNode } from 'lexical';
import type { EntityMatch } from '@lexical/text';
import { CustomTextNode } from '../custom-text/node';
import { VAR_MARKUP_REGEX } from './const';
import { removeBrackets } from '@shellagent/shared/utils';

export const decoratorTransform = (
  node: CustomTextNode,
  getMatch: (text: string) => null | EntityMatch,
  createNode: (textNode: TextNode) => LexicalNode,
) => {
  if (!node.isSimpleText()) return;

  const prevSibling = node.getPreviousSibling();
  let text = node.getTextContent();
  let currentNode = node;
  let match;

  while (true) {
    match = getMatch(text);
    let nextText = match === null ? '' : text.slice(match.end);
    text = nextText;

    if (nextText === '') {
      const nextSibling = currentNode.getNextSibling();

      if ($isTextNode(nextSibling)) {
        nextText = currentNode.getTextContent() + nextSibling.getTextContent();
        const nextMatch = getMatch(nextText);

        if (nextMatch === null) {
          nextSibling.markDirty();
          return;
        } else if (nextMatch.start !== 0) {
          return;
        }
      }
    } else {
      const nextMatch = getMatch(nextText);

      if (nextMatch !== null && nextMatch.start === 0) return;
    }

    if (match === null) return;

    if (
      match.start === 0 &&
      $isTextNode(prevSibling) &&
      prevSibling.isTextEntity()
    )
      continue;

    let nodeToReplace;

    if (match.start === 0)
      [nodeToReplace, currentNode] = currentNode.splitText(match.end);
    else
      [, nodeToReplace, currentNode] = currentNode.splitText(
        match.start,
        match.end,
      );

    const replacementNode = createNode(nodeToReplace);
    nodeToReplace.replace(replacementNode);

    if (currentNode == null) return;
  }
};

export const extractDisplayAndValue = (text: string) => {
  const match = VAR_MARKUP_REGEX.exec(text);
  if (!match) return null;
  return {
    display: match[1], // __display__
    value: match[2], // __id__
  };
};

export const formatVariableValue2Editor = (label: string, value: string) => {
  return `{{@[${label}](value:${removeBrackets(value)})}}`;
};
