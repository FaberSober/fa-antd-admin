# pnpm+vite

> ts+pnpm+vite+react+antd+tailwindcss+changesets+eslint+husky+prettier

## What's inside?

### Apps and Packages

#### apps

- `admin`: admin manage web page
- `portal`: portal web page

- `ui`: a stub component & utility library shared by both `web` and `docs` applications
- `tailwind-config`: tailwind configurations
- `eslint-config-custom`: shared `eslint` configurations
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

| pkg         | website                                          |
| ----------- | ------------------------------------------------ |
| turbo       | https://turbo.build/repo/docs                    |
| tailwindcss | https://tailwindcss.com/docs/                    |
| antd        | https://ant-design.gitee.io/docs/react/introduce |
| Prettier    |                                                  |
| eslint      |                                                  |
| husky       |                                                  |
| vite        |                                                  |
| changeset   |                                                  |
| ncu         |                                                  |
| postcss     | https://postcss.org/                             |
| sass        | https://sass-lang.com/                           |

## Using this example

Run the following command:

```sh
npx degit FaberSober/fa-pnpm-vite fa-pnpm-vite
cd fa-pnpm-vite
pnpm install
git init . && git add . && git commit -m "Init"
```

### 如何使用 changesets

```
# 1-1 进行了一些开发...
# 1-2 提交变更集
pnpm changeset

# 1-3 提升版本
# changeset version
pnpm version-packages

# 1-4 发包(如果是public的话)
# pnpm build && pnpm changeset publish --registry=...
pnpm release
```
