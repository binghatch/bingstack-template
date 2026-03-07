import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { ROUTES } from 'routes'
import { getSession } from '@/lib/session'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session) {
      throw redirect({ to: ROUTES.SIGN_IN })
    }
    return { session }
  },
  component: () => <Outlet />,
})
