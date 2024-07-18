import { Outlet, createFileRoute, Link, useLocation, redirect } from '@tanstack/react-router';

import { KeySquare, Route as RouteIcon, ArrowLeftRight, Binary, UsersRound } from 'lucide-react';

import { useEffect, useState } from 'react';

import { Logo, ModeToggle, Profile, Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@/components';

export const Route = createFileRoute('/user/_user')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  const [route, setRoute] = useState<string>('/user/_user');
  const { pathname } = useLocation();

  useEffect(() => {
    setRoute(pathname);
  }, [pathname]);

  const highlightRoute = (path: string) => {
    if (path === route) {
      return 'bg-accent text-accent-foreground';
    }
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            to="/user/access-keys"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold md:h-8 md:w-8 md:text-base"
          >
            <Logo className="transition-all group-hover:scale-110" />
            <span className="sr-only">SPV Wallet</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/user/access-keys"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/access-keys')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <KeySquare className="h-5 w-5" />
                <span className="sr-only">Access Keys</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Access Keys</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/destinations')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <RouteIcon className="h-5 w-5" />
                <span className="sr-only">Destinations</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Destinations</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/user/transactions"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/transactions')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <ArrowLeftRight className="h-5 w-5" />
                <span className="sr-only">Transactions</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Transactions</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/utxos')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Binary className="h-5 w-5" />
                <span className="sr-only">Utxos</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Utxos</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/contacts')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <UsersRound className="h-5 w-5" />
                <span className="sr-only">Contacts</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Contacts</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <h1>SPV Wallet Admin</h1>
          </Sheet>
          <ModeToggle />
          <Profile />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
