import { createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { z } from 'zod'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

export const Route = createFileRoute('/_auth/reset-password')({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { token } = Route.useSearch()

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Acme.inc
      </a>
      <ResetPasswordForm token={token ?? ""} />
    </div>
  )
}
