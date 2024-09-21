'use client';

import {
  NodeId,
  useReactFlowStore,
  NodeTypeEnum,
} from '@shellagent/flow-engine';
import { TValues, TFieldMode } from '@shellagent/form-engine';
import { FormRef, Drawer } from '@shellagent/ui';
import { useInjection } from 'inversify-react';
import { isEqual, isNumber } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import { useMemo, useRef, useCallback, useState } from 'react';

import { ButtonConfig } from '@/components/app/config-form/button-config';
import { WidgetConfig } from '@/components/app/config-form/widget-config';
import { WorkflowConfig } from '@/components/app/config-form/workflow-config';
import { EditableTitle } from '@/components/app/editable-title';
import NodeForm from '@/components/app/node-form';
import {
  IWorkflowTask,
  IWidgetTask,
} from '@/components/app/node-form/widgets/tasks-config';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { useAppStore } from '@/stores/app/app-provider';
import { SchemaProvider } from '@/stores/app/schema-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { stateConfigSchema } from '@/stores/app/utils/schema';
import { VariableProvider } from '@/stores/app/variable-provider';

import emitter, { EventType, useEventEmitter } from '../emitter';
import { IButtonType } from '../node-form/widgets';

const StateConfigSheet: React.FC<{}> = () => {
  const appBuilderChatModel = useInjection(AppBuilderChatModel);

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

  const { loading, nodeData, setNodeData, setFieldsModeMap, fieldsModeMap } =
    useAppStore(state => ({
      loading: state.loading,
      nodeData: state.nodeData,
      setNodeData: state.setNodeData,
      setFieldsModeMap: state.setFieldsModeMap,
      fieldsModeMap: state.config?.fieldsModeMap,
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
    const commonProps = {
      onChange: (value: TValues) => {
        nodeFormRef.current?.setValue(`blocks.${currentTaskIndex}`, value);
      },
      onTitleChange: (value: string) => {
        nodeFormRef.current?.setValue(
          `blocks.${currentTaskIndex}.display_name`,
          value,
        );
      },
    };

    if (insideSheetMode === 'button') {
      const buttonIdx = (
        nodeData[currentStateId]?.render?.buttons || []
      ).findIndex((button: IButtonType) => button.id === currentButtonId);
      const values = nodeData[currentStateId]?.render?.buttons?.[buttonIdx];
      return {
        children: (
          <ButtonConfig
            id={currentStateId}
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
      const workflow: IWorkflowTask = isNumber(currentTaskIndex)
        ? nodeData[currentStateId]?.blocks?.[currentTaskIndex]
        : {};

      return {
        children: (
          <WorkflowConfig
            id={currentStateId}
            key={`workflow-config-${currentTaskIndex}`}
            parent={`blocks.${currentTaskIndex}`}
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
      const widget: IWidgetTask = isNumber(currentTaskIndex)
        ? nodeData[currentStateId]?.blocks?.[currentTaskIndex]
        : {};
      return {
        children: (
          <WidgetConfig
            id={currentStateId}
            key={`widget-config-${currentTaskIndex}`}
            parent={`blocks.${currentTaskIndex}`}
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
    nodeData,
    currentStateId,
    currentTaskIndex,
    insideSheetOpen,
  ]);

  const stateTitle = useMemo(() => {
    const title =
      nodes.find(node => node.id === currentStateId)?.data.display_name ||
      'State';
    const handleChangeTitle = (value: string) => {
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
      setNodeData(newData);
      emitter.emit(EventType.STATE_FORM_CHANGE, {
        id: currentStateId as NodeId,
        data: `${new Date().valueOf()}`,
        type: 'StateConfigSheet',
      });
    },
    [currentStateId, setNodeData],
  );

  useEventEmitter(EventType.STATE_FORM_CHANGE, eventData => {
    const currentFormData = nodeFormRef.current?.getValues();
    if (
      eventData.id === currentStateId &&
      eventData.type === 'StateCard' &&
      !isEqual(currentFormData, eventData.data)
    ) {
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

  const onModeChange = useCallback(
    (name: string, mode: TFieldMode) => {
      setFieldsModeMap({ id: selectedNode?.id || '', name, mode });
    },
    [selectedNode?.id, setFieldsModeMap],
  );

  return (
    <Drawer
      key={currentStateId}
      placement="right"
      width={375}
      style={{
        transform: `translateX(${appBuilderChatModel.runOpen ? `-${runDrawerWidth + 24}px` : '-12px'}) translateY(12px)`,
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
      <VariableProvider id={currentStateId}>
        <SchemaProvider
          type={NodeTypeEnum.state}
          display_name={selectedNode?.data.display_name}
          name={selectedNode?.data.name}
          id={currentStateId}>
          <NodeForm
            key={formKey}
            loading={loading.getAutomata || loading.getReactFlow}
            schema={stateConfigSchema}
            values={nodeData[currentStateId]}
            onChange={onChange}
            onModeChange={onModeChange}
            ref={nodeFormRef}
            modeMap={fieldsModeMap?.[currentStateId] || {}}
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
      </VariableProvider>
    </Drawer>
  );
};

export default observer(StateConfigSheet);
