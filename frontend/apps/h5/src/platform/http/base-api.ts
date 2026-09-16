import { type ApiClient, apiClient } from './client';
import type { Page, PageRequest, Ret } from './types';

function joinPath(...parts: string[]): string {
  return parts
    .map((part, index) => (index === 0 ? part.replace(/\/+$/, '') : part.replace(/^\/+|\/+$/g, '')))
    .filter(Boolean)
    .join('/');
}

export class BaseApi<Entity, Key, PageEntity = Entity> {
  protected readonly resourcePath: string;

  constructor(
    apiPrefix: string,
    resource: string,
    protected readonly client: ApiClient = apiClient,
  ) {
    this.resourcePath = joinPath(apiPrefix, resource);
  }

  save(params: Partial<Entity>): Promise<Ret<Entity>> {
    return this.client.post<Entity>(joinPath(this.resourcePath, 'save'), params);
  }

  getById(id: Key): Promise<Ret<Entity>> {
    return this.client.get<Entity>(joinPath(this.resourcePath, `getById/${String(id)}`));
  }

  update(id: Key, params: Partial<Entity>): Promise<Ret<boolean>> {
    return this.client.post<boolean>(joinPath(this.resourcePath, 'update'), { id, ...params });
  }

  remove(id: Key): Promise<Ret<boolean>> {
    return this.client.delete<boolean>(joinPath(this.resourcePath, `remove/${String(id)}`));
  }

  list(params: Record<string, unknown> = {}): Promise<Ret<Entity[]>> {
    return this.client.post<Entity[]>(joinPath(this.resourcePath, 'list'), params);
  }

  page(params: PageRequest): Promise<Ret<Page<PageEntity>>> {
    return this.client.post<Page<PageEntity>>(joinPath(this.resourcePath, 'page'), params);
  }
}
