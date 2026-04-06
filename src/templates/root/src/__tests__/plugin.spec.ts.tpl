import { describe, expect, it } from 'vitest';
import { {{TEST_PLUGIN_CLASS}} } from '../plugin';

describe('{{TEST_PLUGIN_CLASS}}', () => {
  it('exposes a stable plugin name', () => {
    expect({{TEST_PLUGIN_CLASS}}.pluginName).toBe('{{TEST_PLUGIN_CONSTANT}}');
  });
});
