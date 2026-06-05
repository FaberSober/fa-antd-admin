import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Tn } from '@/types';

class TenantApi extends BaseApi<Tn.Tenant, string> {
}

export default new TenantApi(GATE_APP.tn, 'tenant');
