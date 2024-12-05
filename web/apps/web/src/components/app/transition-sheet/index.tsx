'use client';

import {
  useReactFlowStore,
  getColor,
  NodeTypeEnum,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { Drawer } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { useMemo, useCallback, memo } from 'react';

import { ICondition, ICustomEdge, EdgeTypeEnum } from '@/components/app/edges';
import NodeForm from '@/components/app/node-form';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { SchemaProvider } from '@/stores/app/schema-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { transitionConfigSchema } from '@/stores/app/utils/schema';
import { generateUUID } from '@/utils/common-helper';

import { form2EdgeData, edgeData2Form } from './utils';

const TransitionSheet: React.FC<{}> = () => {
  const appBuilderChatModel = useInjection(AppBuilderChatModel);
  const { edges, onConnect, setEdges } = useReactFlowStore(state => ({
    edges: state.edges,
    onConnect: state.onConnect,
    setEdges: state.setEdges,
  }));

  const {
    sourceHandle,
    source,
    currentEdegData,
    transitionSheetOpen,
    setTransitionSheetOpen,
    runDrawerWidth,
  } = useAppState(state => ({
    sourceHandle: state.currentTransitionSourceHandle,
    source: state.currentTransitionSource,
    transitionSheetOpen: state.transitionSheetOpen,
    setTransitionSheetOpen: state.setTransitionSheetOpen,
    currentEdegData: state.currentEdegData,
    runDrawerWidth: state.runDrawerWidth,
  }));

  const handleClose = useCallback(() => {
    setTransitionSheetOpen({ open: false, source: '', sourceHandle: '' });
  }, [setTransitionSheetOpen]);

  const handleChange = useCallback(
    (values: TValues) => {
      const transitions = (values?.transitions || []) as ICondition[];
      const { edgesToAdd, edgesToDelete, edgesToModify } = form2EdgeData({
        edges: edges as ICustomEdge[],
        values: transitions.map(transition => ({
          ...transition,
          target_inputs: transition.target_inputs || {}, // 确保 target_inputs 存在
        })),
        sourceHandle,
      });

      edgesToAdd.forEach(newEdge => {
        onConnect({
          connect: {
            target: newEdge.target,
            source: newEdge.source,
            sourceHandle,
            targetHandle: newEdge.target,
          },
          edge: {
            type: EdgeTypeEnum.custom,
            data: {
              id: generateUUID(),
              custom: true,
              event_key: currentEdegData.event_key,
              type: currentEdegData.type,
              source: newEdge.source,
              target: newEdge.target,
              conditions: [
                {
                  condition: newEdge.condition,
                  target_inputs: newEdge.target_inputs,
                },
              ],
            },
            style: {
              stroke:
                `custom_${source}` === sourceHandle
                  ? '#B6BABF'
                  : getColor(sourceHandle),
            },
          },
        });
      });

      setEdges(prevEdges =>
        prevEdges.filter(
          edge => !edgesToDelete.some(deleteEdge => deleteEdge.id === edge.id),
        ),
      );

      setEdges(prevEdges =>
        prevEdges.map(edge => {
          const modifyItem = edgesToModify.find(
            item => item.edge.id === edge.id,
          );
          if (modifyItem) {
            return {
              ...edge,
              data: {
                ...edge.data,
                conditions: [
                  {
                    condition: modifyItem.newData.condition,
                    target_inputs: modifyItem.newData.target_inputs,
                  },
                ],
              },
            };
          }
          return edge;
        }),
      );
    },
    [edges, onConnect, setEdges, sourceHandle],
  );

  const values = useMemo(() => {
    const transitions = edgeData2Form(edges as ICustomEdge[], sourceHandle);
    return { transitions };
  }, [edges, sourceHandle]);

  return (
    <Drawer
      style={{
        transform: `translateX(${
          appBuilderChatModel.runOpen ? `-${runDrawerWidth + 24}px` : '-12px'
        }) translateY(12px)`,
        height: 'calc(100% - 24px)',
      }}
      className="rounded-lg translate-x-[-12px] translate-y-3"
      width={375}
      placement="right"
      mask={false}
      getContainer={false}
      title="Edit Transition"
      open={transitionSheetOpen}
      autoFocus={false}
      keyboard={false}
      onClose={handleClose}
      push={false}>
      <SchemaProvider
        id={source}
        type={NodeTypeEnum.state}
        name=""
        display_name="">
        <NodeForm
          key={sourceHandle}
          schema={transitionConfigSchema}
          values={values}
          onChange={handleChange}
        />
      </SchemaProvider>
    </Drawer>
  );
};

export default memo(TransitionSheet, () => true);
