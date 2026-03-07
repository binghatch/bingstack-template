import { createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd, MailIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { m } from '@/i18n/messages'
import { z } from 'zod'

export const Route = createFileRoute('/_auth/verify-email')({
  validateSearch: z.object({
    resent: z.boolean().optional(),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { resent } = Route.useSearch()

  const title = resent
    ? m.auth_signin_success_verification_title()
    : m.auth_signup_success_verification_title()

  const description = resent
    ? m.auth_signin_success_verification_description()
    : m.auth_signup_success_verification_description()

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Logistry.app
      </a>
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <MailIcon className="size-6" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  )
}
