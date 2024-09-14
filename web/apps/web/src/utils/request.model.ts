import { createId } from '@paralleldrive/cuid2';
import { AxiosResponse, CanceledError } from 'axios';
import { injectable } from 'inversify';
import { action, makeObservable, observable, runInAction } from 'mobx';

// start-RequestModelConfig
export interface RequestModelConfig {
  /**
   * 是否支持并发请求
   * todo 目前支持并发的请求都是 sse 目前 RequestModel 还不支持 SSE
   *
   * @default false 不支持并发, 即新调用 request() 会将上一个请求 abort
   */
  requestId?: true;
}
// stop-RequestModelConfig

// start-RequestModelHandlers
/**
 * 目前仅支持 callback style
 */
export interface RequestModelHandlers<TResponse> {
  requestFunc: (
    requestId: string,
    abortController: AbortController,
  ) => Promise<AxiosResponse<TResponse>>;
  onsuccess: (data: TResponse) => void;
  onerror: (error: Error) => void;
}
// stop-RequestModelHandlers

const FALLBACK_REQUEST_ID = 'FALLBACK_REQUEST_ID';

@injectable()
export class RequestModel<TResponse> {
  config: RequestModelConfig = {};
  @observable loadingMap = new Map<string, boolean>();
  @observable loading = false;
  private abortControllerMap = new Map<string, AbortController>();
  handlers: RequestModelHandlers<TResponse> = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestFunc: requestId => {
      throw new Error('Not implemented');
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onsuccess: data => {
      throw new Error('Not implemented');
    },
    onerror: () => {
      throw new Error('Not implemented');
    },
  };

  constructor() {
    makeObservable(this);
  }

  getAbortController(requestId?: string) {
    if (this.config.requestId) {
      if (requestId == null)
        throw new Error('config.requestId === true, requestId is needed');
      return this.abortControllerMap.get(requestId);
    }
    return this.abortControllerMap.get(FALLBACK_REQUEST_ID);
  }

  @action.bound
  async request() {
    let requestId: string = FALLBACK_REQUEST_ID;
    if (this.config?.requestId) {
      requestId = createId();
      // 不用取消
    } else if (this.abortControllerMap.has(FALLBACK_REQUEST_ID)) {
      this.abortControllerMap.get(FALLBACK_REQUEST_ID)!.abort();
    } else {
      // noop
    }

    this.abortControllerMap.set(requestId, new AbortController());

    try {
      runInAction(() => {
        this.loading = true;
        if (this.config?.requestId) {
          this.loadingMap.set(requestId!, true);
        }
      });
      const res = await this.handlers.requestFunc(
        requestId,
        this.abortControllerMap.get(requestId)!,
      );
      this.loading = false;
      this.loadingMap.set(requestId, false);
      this.handlers.onsuccess(res.data);
    } catch (e) {
      if (e instanceof CanceledError) {
        this.abortControllerMap.delete(requestId);
      } else {
        if (e instanceof Error) {
          this.handlers.onerror(e);
        } else {
          // todo: typescript error 类型会走到这个 branch 吗
          this.handlers.onerror(e as unknown as Error);
        }
        runInAction(() => {
          this.loading = false;
          this.loadingMap.delete(requestId);
        });
      }
    }
  }
}
