import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute("/_admin/xpub")({
  loader: async () =>({
    xpubs: () => []
  }),
  component: Xpub
})

export function Xpub() {

  return <div>Hello</div>
}
