'use client';

import './reflect-metadata-client-side';

import { ChatNewModel } from '@shellagent/ui';
import { ImageCanvasModel } from 'image-canvas/model';
import { Container, interfaces } from 'inversify';
import { toJS } from 'mobx';
import { toast } from 'react-toastify';

import { AssistantModel } from '@/components/assistant/model';
import { AppBuilderChatModel } from '@/components/chat/app-builder-chat.model';
import { DownloadModel } from '@/components/download/download.model';
import { OpenImageCanvasModel } from '@/components/image-canvas/open-image-canvas.model';
import { ModelsCommonModel } from '@/components/manager/manager-content/models/models-common.model';
import { ModelsInstalledModel } from '@/components/manager/manager-content/models/models-installed.model';
import { ModelsMarketplaceModel } from '@/components/manager/manager-content/models/models-marketplace.model';
import { WidgetsCommonModel } from '@/components/manager/manager-content/widgets/widgets-common.model';
import { WidgetsInstalledModel } from '@/components/manager/manager-content/widgets/widgets-installed.model';
import { WidgetsMarketplaceModel } from '@/components/manager/manager-content/widgets/widgets-marketplace.model';
import { SettingsModel } from '@/components/settings/settings.model';
import { AppBuilderModel } from '@/stores/app/models/app-builder.model';
import { EmitterModel } from '@/utils/emitter.model';
import { ModalModel } from '@/utils/modal.model';
import { RequestModel } from '@/utils/request.model';

if (typeof window !== 'undefined') {
  // Client-side-only code
  (window as any).toJS = toJS;
}

export const container = new Container();

// ui
container.bind(ChatNewModel).toSelf().inTransientScope();
container.bind(RequestModel).toSelf().inTransientScope();

// common
container.bind(ModalModel).toSelf().inTransientScope();
container
  .bind(EmitterModel)
  .toSelf()
  .inSingletonScope()
  .onActivation((_ctx: interfaces.Context, model: EmitterModel) => {
    model.emitter.on('message.success', msg => {
      toast.success(msg, {
        position: 'top-center',
        autoClose: 1000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    });
    model.emitter.on('message.error', msg => {
      toast.error(msg, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: true,
        closeButton: false,
      });
    });
    return model;
  });

// manager
container.bind(WidgetsCommonModel).toSelf().inSingletonScope();
container.bind(WidgetsMarketplaceModel).toSelf().inSingletonScope();
container.bind(WidgetsInstalledModel).toSelf().inSingletonScope();
container.bind(ModelsCommonModel).toSelf().inSingletonScope();
container.bind(ModelsMarketplaceModel).toSelf().inSingletonScope();
container.bind(ModelsInstalledModel).toSelf().inSingletonScope();

// settings
container.bind(SettingsModel).toSelf().inSingletonScope();

// app builder chat
container.bind(AppBuilderChatModel).toSelf().inSingletonScope();

// download
container.bind(DownloadModel).toSelf().inSingletonScope();

// image canvas
container.bind('ImageCanvasModel').to(ImageCanvasModel).inSingletonScope();
container.bind(OpenImageCanvasModel).toSelf().inSingletonScope();

// refactor app builder
container
  .bind<AppBuilderModel>('AppBuilderModel')
  .to(AppBuilderModel)
  .inSingletonScope()
  .onActivation((_ctx: interfaces.Context, model: AppBuilderModel) => {
    if (typeof window !== 'undefined') {
      /* eslint-disable no-underscore-dangle, func-names */
      (window as any)._get_app_builder_refs = function () {
        return model.refs;
      };
      /* eslint-disable no-underscore-dangle, func-names */
      (window as any)._get_app_builder_node_data = function () {
        return model.nodeData;
      };
      /* eslint-disable no-underscore-dangle, func-names */
      (window as any)._get_app_builder_scopes = function () {
        return model.scopes;
      };
    }
    return model;
  });
// assistant
container.bind(AssistantModel).toSelf().inSingletonScope();
