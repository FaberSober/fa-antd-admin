export class H5FeatureCompositionError extends Error {
  constructor(message: string) {
    super(`[H5 Feature] ${message}`);
    this.name = 'H5FeatureCompositionError';
  }
}
