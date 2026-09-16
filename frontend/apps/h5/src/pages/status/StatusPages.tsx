import { Button } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { StatePage } from '@/shared/components/StatePage';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';

function BackToPlatformButton() {
  const navigate = useNavigate();
  return (
    <Button color="primary" onClick={() => navigate('/app', { replace: true })}>
      返回平台首页
    </Button>
  );
}

export function ForbiddenPage() {
  useDocumentTitle('无权访问');
  return (
    <StatePage eyebrow="403 FORBIDDEN" title="暂无访问权限" description="当前账号不能访问该移动管理页面，请联系管理员检查应用资格和业务权限。">
      <BackToPlatformButton />
    </StatePage>
  );
}

export function UnauthorizedPage() {
  const navigate = useNavigate();
  useDocumentTitle('会话已失效');
  return (
    <StatePage eyebrow="401 UNAUTHORIZED" title="登录状态已失效" description="当前会话不存在或已经过期，请重新登录后继续访问移动管理平台。">
      <Button color="primary" onClick={() => navigate('/login', { replace: true })}>
        前往登录
      </Button>
    </StatePage>
  );
}

export function NetworkErrorPage() {
  useDocumentTitle('网络异常');
  return (
    <StatePage eyebrow="NETWORK ERROR" title="网络连接异常" description="未能连接到服务，请确认网络与开发代理配置后重试。">
      <Button color="primary" onClick={() => window.location.reload()}>
        重新加载
      </Button>
    </StatePage>
  );
}

export function NotFoundPage() {
  useDocumentTitle('页面不存在');
  return (
    <StatePage eyebrow="404 NOT FOUND" title="页面不存在" description="地址可能已变更，或者对应业务模块尚未在当前项目中启用。">
      <BackToPlatformButton />
    </StatePage>
  );
}
