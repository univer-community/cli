import type { Dependency } from '@univerjs/core';
import { Inject, Injector, Plugin, registerDependencies, UniverInstanceType } from '@univerjs/core';
import { fromModule, IRPCChannelService } from '@univerjs/rpc';
import { {{WORKER_CHANNEL_CONSTANT}}, {{FEATURE_PASCAL}}WorkerService } from './{{FEATURE_SLUG}}.worker.service';

export class {{WORKER_CLASS}} extends Plugin {
  static override pluginName = '{{WORKER_PLUGIN_CONSTANT}}';
  static override packageName = '{{PACKAGE_NAME}}';
  static override type = {{INSTANCE_TYPE}};

  constructor(
    private readonly _config: unknown,
    @Inject(Injector) protected readonly _injector: Injector,
    @IRPCChannelService private readonly _rpcChannelService: IRPCChannelService
  ) {
    super();
  }

  override onStarting(): void {
    registerDependencies(this._injector, [
      [{{FEATURE_PASCAL}}WorkerService],
    ] as Dependency[]);
  }

  override onReady(): void {
    this._rpcChannelService.registerChannel(
      {{WORKER_CHANNEL_CONSTANT}},
      fromModule(this._injector.get({{FEATURE_PASCAL}}WorkerService))
    );
  }
}
