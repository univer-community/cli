import type { {{UI_CONFIG_INTERFACE}} } from './config/ui-config';
import { DependentOn, IConfigService, Inject, Injector, merge, Plugin, registerDependencies, touchDependencies, UniverInstanceType } from '@univerjs/core';
import { {{LOGIC_CLASS}} } from './plugin';
import { defaultPluginConfig, {{UI_CONFIG_KEY}} } from './config/ui-config';
import { {{CONTROLLER_CLASS}} } from './controllers/{{FEATURE_SLUG}}.controller';

@DependentOn({{LOGIC_CLASS}})
export class {{MOBILE_CLASS}} extends Plugin {
  static override pluginName = '{{MOBILE_PLUGIN_CONSTANT}}';
  static override packageName = '{{PACKAGE_NAME}}';
  static override type = {{INSTANCE_TYPE}};

  constructor(
    private readonly _config: Partial<{{UI_CONFIG_INTERFACE}}> = defaultPluginConfig,
    @Inject(Injector) protected readonly _injector: Injector,
    @IConfigService private readonly _configService: IConfigService
  ) {
    super();

    const config = merge({}, defaultPluginConfig, this._config);
    this._configService.setConfig({{UI_CONFIG_KEY}}, config);
  }

  override onStarting(): void {
    registerDependencies(this._injector, [
      [{{CONTROLLER_CLASS}}],
    ]);
  }

  override onRendered(): void {
    touchDependencies(this._injector, [
      [{{CONTROLLER_CLASS}}],
    ]);
  }
}
