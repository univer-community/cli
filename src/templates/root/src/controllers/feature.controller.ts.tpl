import { Inject, Injector } from '@univerjs/core';
import { {{SERVICE_CLASS}} } from '../services/{{FEATURE_SLUG}}.service';

export class {{CONTROLLER_CLASS}} {
  constructor(@Inject(Injector) private readonly _injector: Injector) {}

  getFeatureKey(): string {
    const service = this._injector.get({{SERVICE_CLASS}}) as {{SERVICE_CLASS}};
    return service.getFeatureKey();
  }
}
