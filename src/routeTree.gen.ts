/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginImport } from './routes/login'
import { Route as IndexImport } from './routes/index'
import { Route as UserUserImport } from './routes/user/_user'
import { Route as AdminAdminImport } from './routes/admin/_admin'
import { Route as UserUserXpubImport } from './routes/user/_user.xpub'
import { Route as UserUserDestinationsImport } from './routes/user/_user.destinations'
import { Route as UserUserAccessKeysImport } from './routes/user/_user.access-keys'
import { Route as AdminAdminXpubImport } from './routes/admin/_admin.xpub'
import { Route as AdminAdminTransactionsImport } from './routes/admin/_admin.transactions'
import { Route as AdminAdminPaymailsImport } from './routes/admin/_admin.paymails'
import { Route as AdminAdminDestinationsImport } from './routes/admin/_admin.destinations'
import { Route as AdminAdminContactsImport } from './routes/admin/_admin.contacts'
import { Route as AdminAdminAccessKeysImport } from './routes/admin/_admin.access-keys'

// Create Virtual Routes

const UserImport = createFileRoute('/user')()
const AdminImport = createFileRoute('/admin')()
const AboutLazyImport = createFileRoute('/about')()

// Create/Update Routes

const UserRoute = UserImport.update({
  path: '/user',
  getParentRoute: () => rootRoute,
} as any)

const AdminRoute = AdminImport.update({
  path: '/admin',
  getParentRoute: () => rootRoute,
} as any)

const AboutLazyRoute = AboutLazyImport.update({
  path: '/about',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/about.lazy').then((d) => d.Route))

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const UserUserRoute = UserUserImport.update({
  id: '/_user',
  getParentRoute: () => UserRoute,
} as any)

const AdminAdminRoute = AdminAdminImport.update({
  id: '/_admin',
  getParentRoute: () => AdminRoute,
} as any)

const UserUserXpubRoute = UserUserXpubImport.update({
  path: '/xpub',
  getParentRoute: () => UserUserRoute,
} as any)

const UserUserDestinationsRoute = UserUserDestinationsImport.update({
  path: '/destinations',
  getParentRoute: () => UserUserRoute,
} as any)

const UserUserAccessKeysRoute = UserUserAccessKeysImport.update({
  path: '/access-keys',
  getParentRoute: () => UserUserRoute,
} as any)

const AdminAdminXpubRoute = AdminAdminXpubImport.update({
  path: '/xpub',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminTransactionsRoute = AdminAdminTransactionsImport.update({
  path: '/transactions',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminPaymailsRoute = AdminAdminPaymailsImport.update({
  path: '/paymails',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminDestinationsRoute = AdminAdminDestinationsImport.update({
  path: '/destinations',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminContactsRoute = AdminAdminContactsImport.update({
  path: '/contacts',
  getParentRoute: () => AdminAdminRoute,
} as any)

const AdminAdminAccessKeysRoute = AdminAdminAccessKeysImport.update({
  path: '/access-keys',
  getParentRoute: () => AdminAdminRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutLazyImport
      parentRoute: typeof rootRoute
    }
    '/admin': {
      id: '/admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminImport
      parentRoute: typeof rootRoute
    }
    '/admin/_admin': {
      id: '/admin/_admin'
      path: '/admin'
      fullPath: '/admin'
      preLoaderRoute: typeof AdminAdminImport
      parentRoute: typeof AdminRoute
    }
    '/user': {
      id: '/user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserImport
      parentRoute: typeof rootRoute
    }
    '/user/_user': {
      id: '/user/_user'
      path: '/user'
      fullPath: '/user'
      preLoaderRoute: typeof UserUserImport
      parentRoute: typeof UserRoute
    }
    '/admin/_admin/access-keys': {
      id: '/admin/_admin/access-keys'
      path: '/access-keys'
      fullPath: '/admin/access-keys'
      preLoaderRoute: typeof AdminAdminAccessKeysImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/contacts': {
      id: '/admin/_admin/contacts'
      path: '/contacts'
      fullPath: '/admin/contacts'
      preLoaderRoute: typeof AdminAdminContactsImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/destinations': {
      id: '/admin/_admin/destinations'
      path: '/destinations'
      fullPath: '/admin/destinations'
      preLoaderRoute: typeof AdminAdminDestinationsImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/paymails': {
      id: '/admin/_admin/paymails'
      path: '/paymails'
      fullPath: '/admin/paymails'
      preLoaderRoute: typeof AdminAdminPaymailsImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/transactions': {
      id: '/admin/_admin/transactions'
      path: '/transactions'
      fullPath: '/admin/transactions'
      preLoaderRoute: typeof AdminAdminTransactionsImport
      parentRoute: typeof AdminAdminImport
    }
    '/admin/_admin/xpub': {
      id: '/admin/_admin/xpub'
      path: '/xpub'
      fullPath: '/admin/xpub'
      preLoaderRoute: typeof AdminAdminXpubImport
      parentRoute: typeof AdminAdminImport
    }
    '/user/_user/access-keys': {
      id: '/user/_user/access-keys'
      path: '/access-keys'
      fullPath: '/user/access-keys'
      preLoaderRoute: typeof UserUserAccessKeysImport
      parentRoute: typeof UserUserImport
    }
    '/user/_user/destinations': {
      id: '/user/_user/destinations'
      path: '/destinations'
      fullPath: '/user/destinations'
      preLoaderRoute: typeof UserUserDestinationsImport
      parentRoute: typeof UserUserImport
    }
    '/user/_user/xpub': {
      id: '/user/_user/xpub'
      path: '/xpub'
      fullPath: '/user/xpub'
      preLoaderRoute: typeof UserUserXpubImport
      parentRoute: typeof UserUserImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren({
  IndexRoute,
  LoginRoute,
  AboutLazyRoute,
  AdminRoute: AdminRoute.addChildren({
    AdminAdminRoute: AdminAdminRoute.addChildren({
      AdminAdminAccessKeysRoute,
      AdminAdminContactsRoute,
      AdminAdminDestinationsRoute,
      AdminAdminPaymailsRoute,
      AdminAdminTransactionsRoute,
      AdminAdminXpubRoute,
    }),
  }),
  UserRoute: UserRoute.addChildren({
    UserUserRoute: UserUserRoute.addChildren({
      UserUserAccessKeysRoute,
      UserUserDestinationsRoute,
      UserUserXpubRoute,
    }),
  }),
})

/* prettier-ignore-end */
