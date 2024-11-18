import {
  ArrowLeftIcon,
  PencilSquareIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { IFlow } from '@shellagent/flow-engine';
import { Button, Heading, IconButton, Input, Text } from '@shellagent/ui';
import { useRequest } from 'ahooks';
import { useInjection } from 'inversify-react';
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';

import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { editItem } from '@/services/home';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { useAppState } from '@/stores/app/use-app-state';
import { genAutomata } from '@/stores/app/utils/data-transformer';
import { validateAutomata } from '@/stores/app/utils/date-validate';
import { SettingsModel } from '@/components/settings/settings.model';
import {
  COMFYUI_API,
  DEFAULT_COMFYUI_API,
} from '@/components/app/plugins/comfyui/constant';

import { ExtraActions } from './extra-action';
import Publish from './publish';
import { ExportDialog } from '../export-dialog';

const settingsDisabled = process.env.NEXT_PUBLIC_DISABLE_SETTING === 'yes';

export const Header: React.FC = observer(() => {
  const model = useInjection(SettingsModel);
  const appBuilderChatModel = useInjection(AppBuilderChatModel);
  const appBuilder = useInjection<AppBuilderModel>('AppBuilderModel');
  const params = useSearchParams();
  const version_name = params.get('version_name') as string;

  const id = params.get('id') as string;

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
    const reactflow = appBuilder.flowInstance?.toObject() as IFlow;
    const automata = genAutomata(reactflow, appBuilder.nodeData, comfyui_api);

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
  }, [
    appBuilder.flowInstance,
    appBuilderChatModel,
    appBuilder.nodeData,
    comfyui_api,
  ]);

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
              value={appBuilder.metadata?.name}
              rounded="lg"
              onChange={e => {
                appBuilder.updateMetadata({
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
                  ...appBuilder.metadata,
                });
              }}
            />
          ) : (
            <>
              <Text size="lg" weight="medium">
                {appBuilder.metadata?.name}
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
        <ExportDialog id={id} name={appBuilder.metadata?.name} />
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
          loading={
            appBuilder.getAutomataLoading || appBuilder.getReactFlowLoading
          }
        />
        <ExtraActions />
      </div>
    </div>
  );
});
