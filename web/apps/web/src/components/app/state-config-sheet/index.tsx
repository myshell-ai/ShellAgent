'use client';

import {
  NodeId,
  NodeTypeEnum,
  useReactFlowStore,
} from '@shellagent/flow-engine';
import { TValues } from '@shellagent/form-engine';
import { Button as IButtonType } from '@shellagent/shared/protocol/render-button';
import { WidgetTask, WorkflowTask } from '@shellagent/shared/protocol/task';
import { getNewKey } from '@shellagent/shared/utils';
import { Drawer, FormRef } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { isNumber } from 'lodash-es';
import { useMemo, useRef, useCallback, useState } from 'react';

import { ButtonConfig } from '@/components/app/config-form/button-config';
import { WidgetConfig } from '@/components/app/config-form/widget-config';
import { WorkflowConfig } from '@/components/app/config-form/workflow-config';
import { EditableTitle } from '@/components/app/editable-title';
import NodeForm from '@/components/app/node-form';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import emitter, {
  EventType,
  useEventEmitter,
} from '@/stores/app/models/emitter';
import { SchemaProvider } from '@/stores/app/schema-provider';
import { useAppState } from '@/stores/app/use-app-state';
import {
  introConfigSchema,
  stateConfigSchema,
} from '@/stores/app/utils/schema';

const StateConfigSheet: React.FC<{}> = () => {
  const appBuilderChatModel = useInjection(AppBuilderChatModel);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');

  const {
    stateConfigSheetOpen,
    setStateConfigSheetOpen,
    currentStateId,
    currentTaskIndex,
    currentButtonId,
    insideSheetOpen,
    setInsideSheetOpen,
    insideSheetMode,
    runDrawerWidth,
    selectedNode,
  } = useAppState(state => ({
    stateConfigSheetOpen: state.stateConfigSheetOpen,
    setStateConfigSheetOpen: state.setStateConfigSheetOpen,
    currentStateId: state.currentStateId,
    currentTaskIndex: state.currentTaskIndex,
    currentButtonId: state.currentButtonId,
    insideSheetOpen: state.insideSheetOpen,
    setInsideSheetOpen: state.setInsideSheetOpen,
    insideSheetMode: state.insideSheetMode,
    runDrawerWidth: state.runDrawerWidth,
    selectedNode: state.selectedNode,
  }));

  const { onChangeNodeData, nodes, setNodes } = useReactFlowStore(state => ({
    onChangeNodeData: state.onChangeNodeData,
    nodes: state.nodes,
    setNodes: state.setNodes,
  }));

  const nodeFormRef = useRef<FormRef>(null);
  const [formKey, setFormKey] = useState(currentStateId);

  const drawerProps = useMemo(() => {
    if (!insideSheetOpen) {
      return {};
    }
    const path = `blocks.${currentTaskIndex}`;

    const commonProps = {
      onChange: (value: TValues) => {
        nodeFormRef.current?.setValue(path, value);
      },
      onTitleChange: (value: string) => {
        const { key: newKey, name: newName } = getNewKey({
          name: value,
          nameKey: 'name',
          values: appBuilder.nodeData[currentStateId]?.blocks,
          prefix: 'Blocks',
        });
        const values = nodeFormRef.current?.getValues(path);
        nodeFormRef.current?.setValue(path, {
          ...values,
          display_name: newName,
          name: newKey,
        });
      },
    };

    if (insideSheetMode === 'button') {
      const buttonIdx = (
        appBuilder.nodeData[currentStateId]?.render?.buttons || []
      ).findIndex((button: IButtonType) => button.id === currentButtonId);
      const values =
        appBuilder.nodeData[currentStateId]?.render?.buttons?.[buttonIdx];
      return {
        children: (
          <ButtonConfig
            values={values}
            onChange={newValue =>
              nodeFormRef.current?.setValue(
                `render.buttons.${buttonIdx}`,
                newValue,
              )
            }
          />
        ),
        title: 'Edit Button',
      };
    }
    if (insideSheetMode === 'workflow') {
      const workflow: WorkflowTask = isNumber(currentTaskIndex)
        ? appBuilder.nodeData[currentStateId]?.blocks?.[currentTaskIndex]
        : {};

      return {
        children: (
          <WorkflowConfig
            key={`workflow-config-${currentTaskIndex}`}
            parent={`blocks.${workflow.name}`}
            values={workflow}
            onChange={commonProps.onChange}
          />
        ),
        title: (
          <EditableTitle
            key={`workflow-config-${currentTaskIndex}`}
            value={workflow?.display_name || 'Workflow'}
            onChange={commonProps.onTitleChange}
          />
        ),
      };
    }
    if (insideSheetMode === 'widget') {
      const widget: WidgetTask = isNumber(currentTaskIndex)
        ? appBuilder.nodeData[currentStateId]?.blocks?.[currentTaskIndex]
        : {};

      return {
        children: (
          <WidgetConfig
            key={`widget-config-${currentTaskIndex}`}
            parent={`blocks.${widget.name}`}
            values={widget}
            onChange={commonProps.onChange}
          />
        ),
        title: (
          <EditableTitle
            key={`widget-config-${currentTaskIndex}`}
            value={widget?.display_name || 'Widget'}
            onChange={commonProps.onTitleChange}
          />
        ),
      };
    }
    return {};
  }, [
    insideSheetMode,
    currentButtonId,
    appBuilder.nodeData,
    currentStateId,
    currentTaskIndex,
    insideSheetOpen,
  ]);

  const stateTitle = useMemo(() => {
    const title =
      nodes.find(node => node.id === currentStateId)?.data.display_name ||
      'State';
    const handleChangeTitle = (value: string) => {
      nodeFormRef.current?.setValue(`name`, value);
      onChangeNodeData(currentStateId as NodeId, {
        ...(selectedNode?.data || {}),
        display_name: value,
      });
    };
    return <EditableTitle value={title} onChange={handleChangeTitle} />;
  }, [nodes, currentStateId, selectedNode, onChangeNodeData]);

  const onChange = useCallback(
    (values: TValues) => {
      const newData = { id: currentStateId as NodeId, data: values };
      appBuilder.setNodeData(newData);
      emitter.emit(EventType.FORM_CHANGE, {
        id: currentStateId as NodeId,
        data: `${new Date().valueOf()}`,
        type: 'StateConfigSheet',
      });
    },
    [currentStateId],
  );

  useEventEmitter(EventType.FORM_CHANGE, eventData => {
    if (eventData.id === currentStateId && eventData.type === 'StateCard') {
      setFormKey(eventData.data);
    }
  });

  const handleClose = useCallback(() => {
    setStateConfigSheetOpen(currentStateId, false);
    setNodes(
      nodes.map(node => {
        if (node.id === currentStateId) {
          return { ...node, selected: false };
        }
        return node;
      }),
    );
  }, [currentStateId, setStateConfigSheetOpen, setNodes, nodes]);

  return (
    <Drawer
      key={currentStateId}
      placement="right"
      width={375}
      style={{
        transform: `translateX(${
          appBuilderChatModel.runOpen ? `-${runDrawerWidth + 24}px` : '-12px'
        }) translateY(12px)`,
        height: 'calc(100% - 24px)',
      }}
      className="rounded-lg translate-x-[-12px] translate-y-3"
      mask={false}
      getContainer={false}
      title={stateTitle}
      onClose={handleClose}
      open={stateConfigSheetOpen}
      autoFocus={false}
      push={false}>
      <SchemaProvider
        type={
          selectedNode?.data?.type === NodeTypeEnum.intro
            ? NodeTypeEnum.intro
            : NodeTypeEnum.state
        }
        display_name={selectedNode?.data.display_name}
        name={selectedNode?.data.name}
        id={currentStateId}>
        <NodeForm
          key={formKey}
          loading={
            appBuilder.getAutomataLoading || appBuilder.getReactFlowLoading
          }
          schema={
            selectedNode?.data?.type === NodeTypeEnum.intro
              ? introConfigSchema
              : stateConfigSchema
          }
          values={appBuilder.nodeData[currentStateId]}
          onChange={onChange}
          ref={nodeFormRef}
        />
        <Drawer
          open={insideSheetOpen}
          height="95%"
          placement="bottom"
          className="rounded-lg"
          closable
          getContainer={false}
          onClose={() =>
            setInsideSheetOpen({ stateId: currentStateId, open: false })
          }
          autoFocus={false}
          {...drawerProps}>
          {drawerProps.children}
        </Drawer>
      </SchemaProvider>
    </Drawer>
  );
};

export default StateConfigSheet;
