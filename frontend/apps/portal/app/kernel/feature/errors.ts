export class PortalFeatureConfigurationError extends Error {
  constructor(message: string) {
    super(`[Portal Feature] ${message}`);
    this.name = 'PortalFeatureConfigurationError';
  }
}
