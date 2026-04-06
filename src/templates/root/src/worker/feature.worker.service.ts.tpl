export const {{WORKER_CHANNEL_CONSTANT}} = '{{FEATURE_SLUG}}.worker.channel';

export class {{FEATURE_PASCAL}}WorkerService {
  ping(): string {
    return 'pong';
  }
}
