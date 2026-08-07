import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'
import { queryClient } from './query-client'

import type { QueryClient as TSQueryClient } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: TSQueryClient
}

export const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
