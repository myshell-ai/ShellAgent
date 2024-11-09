import {
  ArrowLeftIcon,
  PencilSquareIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { IFlow } from '@shellagent/flow-engine';
import {
  Button,
  Heading,
  IconButton,
  Input,
  SaveIcon,
  Text,
} from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { useInjection } from 'inversify-react';
import { isEmpty } from 'lodash-es';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { saveApp } from '@/services/app';
import { editItem } from '@/services/home';
import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { validateAutomata } from '@/stores/app/utils/date-validate';

import { ExportDialog } from '../export-dialog';

export const Header: React.FC = observer(() => {
  const appBuilderChatModel = useInjection(AppBuilderChatModel);
  const params = useSearchParams();

  const id = params.get('id') as string;
  const { metadata, flowInstance, updateMetadata, nodeData, config } =
    useAppStore(
      useShallow(state => ({
        config: state.config,
        metadata: state.metadata,
        nodeData: state.nodeData,
        flowInstance: state.flowInstance,
        updateMetadata: state.updateMetadata,
      })),
    );

  const { editing, setEditing } = useAppState(state => state);

  const { run: runEditWorkflow } = useRequest(editItem, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('Save Success!', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const { run: saveData, loading: saveLoading } = useRequest(saveApp, {
    manual: true,
    onSuccess: result => {
      if (result.success) {
        toast.success('App Saved', {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: true,
          pauseOnHover: true,
          closeButton: false,
        });
      }
    },
    onError: error => {
      toast.error(error.message);
    },
  });

  const handleSave = useCallback(() => {
    const reactflow = flowInstance?.toObject() as IFlow;

    if (!isEmpty(reactflow)) {
      saveData({
        app_id: params.get('id') as string,
        reactflow,
        automata: genAutomata(reactflow, nodeData),
        config,
      });
    }
  }, [flowInstance, nodeData, params, saveData, config]);

  const handleRun = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const automata = genAutomata(reactflow, nodeData);

    try {
      // 数据校验
      await validateAutomata(automata, reactflow);
      appBuilderChatModel.initBot(automata);
    } catch (e) {
      toast.error(e, {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
        style: {
          padding: 4,
        },
      });
    }
  }, [flowInstance, appBuilderChatModel, nodeData]);

  return (
    <div className="w-full h-full relative flex items-center justify-between p-3 border-b border-default font-medium">
      <div className="flex items-center gap-x-1">
        <Link href="/app">
          <IconButton
            icon={ArrowLeftIcon}
            color="brand"
            variant="ghost"
            size="md"
          />
        </Link>
        <Heading size="h4" className="flex items-center gap-1">
          {editing ? (
            <Input
              size="xs"
              value={metadata?.name}
              rounded="lg"
              onChange={e => {
                updateMetadata({
                  metadata: {
                    name: e.target.value,
                  },
                });
              }}
              onBlur={() => {
                setEditing(false);
                runEditWorkflow({
                  id,
                  type: 'app',
                  ...metadata,
                });
              }}
            />
          ) : (
            <>
              <Text size="lg" weight="medium">
                {metadata?.name}
              </Text>
              <IconButton
                onClick={() => setEditing(true)}
                icon={PencilSquareIcon}
                color="gray"
                variant="ghost"
                size="sm"
              />
            </>
          )}
        </Heading>
      </div>
      <div className="inline-flex items-center justify-center flex-[0_0_auto]">
        <ExportDialog id={id} name={metadata.name} />
        <Button
          loading={appBuilderChatModel.isInitBotLoading}
          onClick={handleRun}
          className="w-28 px-8 border border-default shadow-button-primary1 ml-3"
          size="md"
          icon={PlayIcon}
          variant="outline">
          Run
        </Button>
        <Button
          onClick={handleSave}
          loading={saveLoading}
          className="w-28 px-8 border border-default shadow-button-primary1 ml-3"
          size="md"
          icon={SaveIcon}>
          Save
        </Button>
      </div>
    </div>
  );
});
