import selectedProject from '@project';
import { composeH5Project } from './compose';

export const h5Registry = composeH5Project(selectedProject);

if (import.meta.env.DEV) {
  for (const warning of h5Registry.lifecycleWarnings) {
    console.warn(warning);
  }
}
