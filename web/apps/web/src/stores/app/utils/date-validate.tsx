import { IFlow } from '@shellagent/flow-engine';
import { Automata, Button, State } from '@shellagent/pro-config';
import { Text } from '@shellagent/ui';
import { ReactNode } from 'react';

export type CustomError = {
  message: string | ReactNode;
}[];

const getStateDisplayNameById = (id: string, nodes: IFlow['nodes']) => {
  return nodes.find(node => node.id === id)?.data.display_name;
};

const getUnlinkedButtonsErrors = (
  automata: Automata,
  reactflow: IFlow,
  errors: CustomError,
) => {
  const { nodes } = reactflow;
  const buttons = Object.entries(automata.blocks).reduce(
    (
      acc: { button: Button; key: string; transitions: string[] }[],
      [key, block]: [string, State],
    ) => {
      if (block.render?.buttons) {
        acc.push(
          ...(block.render.buttons as Button[]).map(button => ({
            button,
            key,
            transitions: Object.keys(
              (block as any)?.transitions as Record<string, any>,
            ),
          })),
        );
      }
      return acc;
    },
    [],
  );

  buttons.forEach(({ button, key, transitions }) => {
    if (!transitions.includes((button.on_click as any)?.event)) {
      const displayName = getStateDisplayNameById(key, nodes);
      errors.push({
        message: (
          <div>
            Button <Text className="text-brand">{button.content}</Text> is
            unlinked in <Text className="text-brand">{displayName}</Text>
          </div>
        ),
      });
    }
  });
};

export const validateAutomata = (
  automata: Automata,
  reactflow: IFlow,
): Promise<ReactNode | boolean> => {
  // const { edges, nodes } = reactflow;
  const errors: CustomError = [];
  return new Promise((resolve, reject) => {
    // 在这里添加验证逻辑
    // button未连接错误
    getUnlinkedButtonsErrors(automata, reactflow, errors);
    if (errors.length) {
      const errorMsg = <>{errors.map(error => error.message)}</>;
      reject(errorMsg);
    } else {
      resolve(true);
    }
  });
};
