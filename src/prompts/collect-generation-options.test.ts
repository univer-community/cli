import { describe, expect, it } from 'vitest';
import type { PromptSession } from './collect-generation-options';
import { collectGenerationOptions, confirmOverwriteExistingFiles } from './collect-generation-options';

class MockPromptSession implements PromptSession {
  constructor(private readonly answers: string[]) {}

  async question(): Promise<string> {
    const answer = this.answers.shift();
    if (answer == null) {
      throw new Error('No more mock answers available.');
    }

    return answer;
  }

  close(): void {}
}

describe('prompt flow', () => {
  it('can reuse one prompt session for generation options and overwrite confirmation', async () => {
    const promptSession = new MockPromptSession([
      'tmp/repro-x',
      'smart-filter',
      '@univerjs/univer-smart-filter-plugin',
      '0.19.0',
      '1',
      '2',
      'n',
      'n',
      'n',
      'y',
    ]);

    const options = await collectGenerationOptions(undefined, promptSession);
    const confirmed = await confirmOverwriteExistingFiles('/tmp/repro-x', ['/tmp/repro-x/.gitignore'], promptSession);

    expect(options.targetDir).toBe('tmp/repro-x');
    expect(options.pluginSlug).toBe('smart-filter');
    expect(options.packageName).toBe('@univerjs/univer-smart-filter-plugin');
    expect(options.surface).toBe('sheets');
    expect(options.shape).toBe('logic-ui');
    expect(confirmed).toBe(true);
  });
});
