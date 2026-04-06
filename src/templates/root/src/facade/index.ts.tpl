import { Injector } from '@univerjs/core';
import { {{SERVICE_CLASS}} } from '../services/{{FEATURE_SLUG}}.service';

export class {{FACADE_CLASS}} {
  constructor(private readonly _injector: Injector) {}

  getFeatureKey(): string {
    const service = this._injector.get({{SERVICE_CLASS}}) as {{SERVICE_CLASS}};
    return service.getFeatureKey();
  }
}
