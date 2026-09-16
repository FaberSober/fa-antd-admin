import type { TelemetryBreadcrumb, TelemetryBreadcrumbType } from './types';

export class TelemetryBreadcrumbBuffer {
  private readonly items: TelemetryBreadcrumb[] = [];

  constructor(private readonly maxSize = 30) {}

  add(type: TelemetryBreadcrumbType, data?: Record<string, unknown>): void {
    this.items.push({ type, data, time: new Date().toISOString() });
    if (this.items.length > this.maxSize) {
      this.items.splice(0, this.items.length - this.maxSize);
    }
  }

  snapshot(): TelemetryBreadcrumb[] {
    return this.items.map((item) => ({
      ...item,
      data: item.data ? { ...item.data } : undefined,
    }));
  }
}
