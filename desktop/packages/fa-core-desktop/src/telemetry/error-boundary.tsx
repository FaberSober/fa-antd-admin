import { Component, type ErrorInfo, type ReactNode } from "react";
import type { TelemetryClient } from "./client";

export interface TelemetryErrorBoundaryProps {
  client: TelemetryClient;
  children: ReactNode;
  fallback: ReactNode;
}

interface TelemetryErrorBoundaryState {
  hasError: boolean;
}

export class TelemetryErrorBoundary extends Component<TelemetryErrorBoundaryProps, TelemetryErrorBoundaryState> {
  state: TelemetryErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): TelemetryErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.client.captureException(error, { react: { componentStack: info.componentStack } });
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
