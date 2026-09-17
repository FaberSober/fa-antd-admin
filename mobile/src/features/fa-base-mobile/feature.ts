export interface MobileFeatureDefinition {
  id: string;
  pages: readonly string[];
}

export const MOBILE_PAGE_ROUTES = {
  login: '/features/fa-base-mobile/pages/login/index',
  workbench: '/features/fa-base-mobile/pages/home/index',
  messages: '/features/fa-base-mobile/pages/messages/index',
  contacts: '/features/fa-base-mobile/pages/contacts/index',
  mine: '/features/fa-base-mobile/pages/mine/index',
  filePreview: '/features/fa-base-mobile/pages/file-preview/index',
} as const;

export const MOBILE_TAB_ROUTES = {
  messages: MOBILE_PAGE_ROUTES.messages,
  workbench: MOBILE_PAGE_ROUTES.workbench,
  contacts: MOBILE_PAGE_ROUTES.contacts,
  mine: MOBILE_PAGE_ROUTES.mine,
} as const;

export type MobileTabKey = keyof typeof MOBILE_TAB_ROUTES;

const baseMobileFeature: MobileFeatureDefinition = {
  id: 'fa-base-mobile',
  pages: [
    'features/fa-base-mobile/pages/login/index',
    'features/fa-base-mobile/pages/home/index',
    'features/fa-base-mobile/pages/messages/index',
    'features/fa-base-mobile/pages/contacts/index',
    'features/fa-base-mobile/pages/mine/index',
    'features/fa-base-mobile/pages/file-preview/index',
  ],
};

export default baseMobileFeature;
