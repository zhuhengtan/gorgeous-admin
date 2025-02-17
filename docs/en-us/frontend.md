# Front end

## Basic

* basic init with [create-react-app](https://github.com/facebook/create-react-app)
* set `webpack` config with [craco](https://github.com/gsoft-inc/craco)
* control env config with [env-cmd](https://github.com/toddbluhm/env-cmd)
* use [ant-design](https://ant.design/docs/react/introduce-cn) as UI components libruary
* control statement with `context`
* hooks lib: [ahooks](https://ahooks.js.org/zh-CN)

## Auth in front end

The back-end obtains the permissions according to the requested user, and returns to the front-end a list of all the page permissions of the user and all the operation permissions of the corresponding page, and each operation permission has a corresponding key. The front-end displays the sidebar by comparing the pages that need to be authenticated in the local routing file and the page list given by the back-end. This function is in `src/components/layout`. By judging whether the key in the page module exists in the backend, it is used to judge whether to render the corresponding component from the list of operation permissions in the given page. This function is implemented by the `AuthFragment` component in `src/components/auth-fragment`.


## Specification

### Code specification

- The code has eslint checking for spaces, newlines and some basic code styles
- Folder and file names should be named with `kebab-case`
- Components、types、interfaces should be named with `PascalCase`
- Variabilities、functions should be named with `camelCase`
- Constants should be named with `CONSTANT_VALUE`

### Development specification

- Avoid using `any` in `ts/tsx`
- When generating nodes in a loop, a key must be added onto the loop node
- Forbid circular references, destructure data structures and extract common types to separate files
- `for-of` is suggested to be used instead of `for-in` and `forEach`
- Avoid useing style in line
- To avoid the abuse of console for debugging, debugging by browsers is suggested
- Avoid submit annotated code

### Submit specification

- feat: new features
- fix: fix bug
- docs: documentation
- style: style changes, no logic changes
- refactor: refactor codes or prettier code style
- test: add test
- chore: change build or compile. eg. change webpack configs

### Version specification

All project applications involving version release must strictly follow the Semantic Versioning 2.0.0 Semantic Versioning Specification.

Version format: major version number, minor version number, revision number. The version number increment rules are as follows：

1. Major version number: When you make incompatible API changes,
2. Minor version number: When you add functionality that is backward compatible,
3. Revision number: When you make a correction for backward compatibility issues.

For example, if the version code is x.y.z, then:

- Publish a revision by modifying z when a critical bug appears and is fixed（eg. 15.6.2 to 15.6.3）
- When a new feature is released or a non-critical bug is fixed, a minor version is released by modifying y（eg. 15.6.2 to 15.7.0）
- Release a major version by modifying x when a breaking update is released（eg. 15.6.2 to 16.0.0）

## Structure

```
├── LICENSE
├── README.md
├── craco.config.js                   craco config
├── docs                              documentation
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── app.tsx
│   ├── components
│   │   ├── auth-fragment
│   │   │   └── index.tsx
│   │   └── layout
│   │       ├── avatar.tsx
│   │       ├── global-lan.tsx
│   │       ├── index.less
│   │       ├── index.tsx
│   │       ├── logo.tsx
│   │       └── second-layout.tsx
│   ├── context
│   │   ├── auth-context-provider.ts
│   │   └── user-info-provider.ts
│   ├── images
│   │   └── login.jpeg
│   ├── index.less
│   ├── index.tsx
│   ├── lang                            languages
│   │   ├── en-us.json
│   │   ├── i18n.tsx
│   │   └── zh-cn.json
│   ├── pages
│   │   ├── access-deny
│   │   │   └── index.tsx
│   │   ├── admin-info                  page of admin info
│   │   │   ├── index.less
│   │   │   └── index.tsx
│   │   ├── auth                        page of authentication
│   │   │   ├── admin
│   │   │   │   ├── add-admin-form.tsx
│   │   │   │   ├── index.less
│   │   │   │   └── index.tsx
│   │   │   ├── page
│   │   │   │   ├── index.tsx
│   │   │   │   └── operation.tsx
│   │   │   ├── role
│   │   │   │   ├── index.tsx
│   │   │   │   └── role-detail-drawer.tsx
│   │   │   └── types.ts
│   │   ├── login
│   │   │   ├── index.less
│   │   │   ├── index.tsx
│   │   │   ├── mobile.tsx
│   │   │   └── pc.tsx
│   │   └── not-found
│   │       ├── index.less
│   │       └── index.tsx
│   ├── react-app-env.d.ts
│   ├── routes
│   │   ├── index.tsx
│   │   └── render-routes.tsx
│   ├── service
│   │   ├── api.ts
│   │   ├── axios.ts
│   │   ├── index.ts
│   │   └── type.ts
│   ├── type.ts
│   └── utils
│       ├── cookie.ts
│       └── index.tsx
└── tsconfig.json
```