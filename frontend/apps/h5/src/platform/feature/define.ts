import type { H5Feature, H5Project } from './types';

function freezeArray<T>(items: readonly T[] | undefined): readonly T[] | undefined {
  return items ? Object.freeze([...items]) : undefined;
}

export function defineH5Feature<const T extends H5Feature>(feature: T): T {
  const routes = feature.routes.map((route) => Object.freeze({ ...route }));
  const navItems = feature.navItems?.map((item) => Object.freeze({ ...item }));
  const homeEntries = feature.homeEntries?.map((item) => Object.freeze({ ...item }));

  return Object.freeze({
    ...feature,
    dependsOn: freezeArray(feature.dependsOn),
    routes: Object.freeze(routes),
    navItems: navItems ? Object.freeze(navItems) : undefined,
    homeEntries: homeEntries ? Object.freeze(homeEntries) : undefined,
    lifecycle: feature.lifecycle ? Object.freeze({ ...feature.lifecycle }) : undefined,
  }) as T;
}

export function defineH5Project<const T extends H5Project>(project: T): T {
  return Object.freeze({
    ...project,
    features: Object.freeze([...project.features]),
    featureMigrations: project.featureMigrations ? Object.freeze(project.featureMigrations.map((migration) => Object.freeze({ ...migration }))) : undefined,
  }) as T;
}
