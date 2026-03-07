import { createFileRoute } from '@tanstack/react-router'
import { GalleryVerticalEnd } from 'lucide-react'
import { SigninForm } from '@/features/auth/components/signin-form'

export const Route = createFileRoute('/_auth/signin')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <a href="#" className="flex items-center gap-2 self-center font-medium">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Logistry.app
      </a>
      <SigninForm />
    </div>
  )
}
