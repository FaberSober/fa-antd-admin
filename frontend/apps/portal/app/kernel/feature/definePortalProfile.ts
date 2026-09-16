import type { PortalProfile } from './types';

export function definePortalProfile<const T extends PortalProfile>(profile: T): T {
  return Object.freeze({
    ...profile,
    site: Object.freeze({ ...profile.site }),
    features: Object.freeze([...profile.features]),
    featureMigrations: profile.featureMigrations
      ? Object.freeze(profile.featureMigrations.map((migration) => Object.freeze({ ...migration })))
      : undefined,
  }) as T;
}
