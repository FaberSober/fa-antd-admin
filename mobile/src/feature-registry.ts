import baseMobileFeature from './features/fa-base-mobile/feature';
import demoMobileFeature from './features/fa-demo-mobile/feature';

export const enabledFeatures = [baseMobileFeature, demoMobileFeature] as const;

const registeredPages = enabledFeatures.flatMap((feature) => feature.pages);

if (new Set(registeredPages).size !== registeredPages.length) {
  throw new Error('移动端 Feature 页面路径不能重复');
}
