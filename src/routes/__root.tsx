import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  loader: () => getThemeServerFn(),

  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div>
      <h1>404 - Page Not Found</h1>
      <a href="/">Go Home</a>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()

  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className='min-h-screen antialiased'>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
        <Toaster />
      </body>
    </html>
  )
}
