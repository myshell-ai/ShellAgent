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
import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useShallow } from 'zustand/react/shallow';

import {
  COMFYUI_API,
  DEFAULT_COMFYUI_API,
} from '@/components/app/plugins/comfyui/constant';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { SettingsModel } from '@/components/settings/settings.model';
import { saveApp } from '@/services/app';
import { editItem } from '@/services/home';
import { useAppStore } from '@/stores/app/app-provider';
import { useAppState } from '@/stores/app/use-app-state';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { validateAutomata } from '@/stores/app/utils/date-validate';

import { ExtraActions } from './extra-action';
import Publish from './publish';
import { ExportDialog } from '../export-dialog';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const Header: React.FC = observer(() => {
  const model = useInjection(SettingsModel);
  const appBuilderChatModel = useInjection(AppBuilderChatModel);
  const params = useSearchParams();
  const version_name = params.get('version_name') as string;

  const id = params.get('id') as string;
  const { metadata, flowInstance, nodeData, config, loading, updateMetadata } =
    useAppStore(
      useShallow(state => ({
        config: state.config,
        metadata: state.metadata,
        nodeData: state.nodeData,
        flowInstance: state.flowInstance,
        loading: state.loading,
        updateMetadata: state.updateMetadata,
      })),
    );

  const comfyui_api = useMemo(() => {
    if (settingsDisabled) {
      return DEFAULT_COMFYUI_API;
    }
    return model.envs.get(COMFYUI_API) || '';
  }, [model.envs.get(COMFYUI_API), settingsDisabled]);

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

  const handleRun = useCallback(async () => {
    const reactflow = flowInstance?.toObject() as IFlow;
    const automata = genAutomata(reactflow, nodeData, comfyui_api);

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
  }, [flowInstance, appBuilderChatModel, nodeData, comfyui_api]);

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
        <Publish
          app_id={id}
          version_name={version_name}
          config={config}
          nodeData={nodeData}
          flowInstance={flowInstance}
          metadata={metadata}
          loading={loading.getAutomata || loading.getReactFlow}
        />
        <ExtraActions />
      </div>
    </div>
  );
});
