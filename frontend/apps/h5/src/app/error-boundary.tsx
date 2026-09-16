import { Button } from 'antd-mobile';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StatePage } from '@/shared/components/StatePage';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('H5 render error', error, info);
    }
  }

  private reload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <StatePage eyebrow="APPLICATION ERROR" title="页面暂时无法显示" description="移动管理平台遇到了未处理的异常，请刷新后重试。">
        <Button color="primary" onClick={this.reload}>
          刷新页面
        </Button>
      </StatePage>
    );
  }
}
