import type { Dependency } from '@univerjs/core';
import type { {{CONFIG_INTERFACE}} } from './config/config';
import {
{{LOGIC_DEPENDENCY_DECORATOR_IMPORT}}  IConfigService,
  Inject,
  Injector,
  merge,
  Plugin,
  registerDependencies,
  touchDependencies,
  UniverInstanceType,
} from '@univerjs/core';
{{LOGIC_DEPENDENCY_IMPORT}}import { defaultPluginConfig, {{CONFIG_KEY}} } from './config/config';
import { {{CONTROLLER_CLASS}} } from './controllers/{{FEATURE_SLUG}}.controller';
import { {{SERVICE_CLASS}} } from './services/{{FEATURE_SLUG}}.service';

{{LOGIC_DEPENDENCY_DECORATOR}}export class {{LOGIC_CLASS}} extends Plugin {
  static override pluginName = '{{LOGIC_PLUGIN_CONSTANT}}';
  static override packageName = '{{PACKAGE_NAME}}';
  static override type = {{INSTANCE_TYPE}};

  constructor(
    private readonly _config: Partial<{{CONFIG_INTERFACE}}> = defaultPluginConfig,
    @Inject(Injector) protected readonly _injector: Injector,
    @IConfigService private readonly _configService: IConfigService
  ) {
    super();

    const config = merge({}, defaultPluginConfig, this._config);
    this._configService.setConfig({{CONFIG_KEY}}, config);
  }

  override onStarting(): void {
    registerDependencies(this._injector, [
      [{{SERVICE_CLASS}}],
      [{{CONTROLLER_CLASS}}],
    ] as Dependency[]);
  }

  override onReady(): void {
    touchDependencies(this._injector, [
      [{{CONTROLLER_CLASS}}],
    ]);
  }
}
