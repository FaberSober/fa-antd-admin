export interface MobileFeatureDefinition {
  id: string;
  pages: readonly string[];
}

const baseMobileFeature: MobileFeatureDefinition = {
  id: 'fa-base-mobile',
  pages: [
    'features/fa-base-mobile/pages/login/index',
    'features/fa-base-mobile/pages/home/index',
    'features/fa-base-mobile/pages/file-preview/index',
  ],
};

export default baseMobileFeature;
