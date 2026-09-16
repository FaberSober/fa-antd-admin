import selectedProfile from '../.portal/selected-profile';
import { composePortalProfile } from './kernel/feature';
import { portalKernelNavigation, portalKernelRoutes } from './kernel/portalKernel';

export const portalComposition = composePortalProfile(selectedProfile, {
  kernelRoutes: portalKernelRoutes,
  kernelNavigation: portalKernelNavigation,
});

export const portalProfile = portalComposition.profile;
