import { createFileRoute, Link, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { ArrowLeftRight, KeySquare, X, FileText, Mail, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Logo,
  ModeToggle,
  Profile,
  Sheet,
  SheetContent,
  SheetTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { PageRefreshButton } from '@/components/PageRefreshButton';
import { UserBalance } from '@/components/UserBalance';
import { useUserApi } from '@/store/clientStore';

export const Route = createFileRoute('/user/_user')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
  },
  component: LayoutComponent,
});

function LayoutComponent() {
  const [route, setRoute] = useState<string>('/user/access-keys');
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const userClient = useUserApi();

  useEffect(() => {
    setRoute(pathname);
  }, [pathname]);

  const highlightRoute = (path: string) => {
    if (path === route) {
      return 'bg-accent text-accent-foreground';
    }
  };

  const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={`flex flex-col ${isMobile ? 'items-start' : 'items-center'} gap-4 px-2 py-5`}>
      <div className="flex w-full items-center justify-between">
        <Link
          to="/user/access-keys"
          className="group flex h-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold"
        >
          <Logo className="transition-all group-hover:scale-110" />
          {isMobile && <span className="text-lg font-semibold">User</span>}
        </Link>
        {isMobile && (
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Profile />
          </div>
        )}
      </div>

      {isMobile ? (
        // Mobile Navigation with Text
        <div className="flex w-full flex-col gap-4">
          <Link
            to="/user/access-keys"
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${highlightRoute('/user/access-keys')} text-muted-foreground transition-colors hover:text-foreground`}
            onClick={() => setIsOpen(false)}
          >
            <KeySquare className="h-5 w-5" />
            <span>Access Keys</span>
          </Link>
          <Link
            to="/user/transactions"
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${highlightRoute('/user/transactions')} text-muted-foreground transition-colors hover:text-foreground`}
            onClick={() => setIsOpen(false)}
          >
            <ArrowLeftRight className="h-5 w-5" />
            <span>Transactions</span>
          </Link>
          <Link
            to="/user/paymails"
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${highlightRoute('/user/paymails')} text-muted-foreground transition-colors hover:text-foreground`}
            onClick={() => setIsOpen(false)}
          >
            <Mail className="h-5 w-5" />
            <span>Paymails</span>
          </Link>
          <Link
            to="/user/xpub"
            className={`flex items-center gap-3 rounded-lg px-2 py-2 ${highlightRoute('/user/xpub')} text-muted-foreground transition-colors hover:text-foreground`}
            onClick={() => setIsOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span>XPub</span>
          </Link>
        </div>
      ) : (
        // Desktop Navigation with Tooltips
        <>
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
                to="/user/paymails"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/paymails')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Paymails</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Paymails</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/user/xpub"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/xpub')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">XPub</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">XPub</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/user/xpub"
                className={`flex h-9 w-9 items-center justify-center ${highlightRoute('/user/xpub')} text-muted-foreground rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8`}
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">XPub</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">XPub</TooltipContent>
          </Tooltip>
        </>
      )}
    </nav>
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Desktop Navigation */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-14 flex-col border-r bg-background sm:flex">
        <NavigationLinks isMobile={false} />
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center gap-4">
            <Logo className="h-8 w-8 sm:hidden" />
            <div className="flex items-center gap-2">
              <h1 className="sm:ml-0">User</h1>
              <span className="hidden sm:inline text-sm text-muted-foreground">(ID: {userClient.userId})</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <PageRefreshButton />
            <UserBalance />
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              <ModeToggle />
              <Profile />
            </div>
            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="sm:hidden">
                <div className="relative h-6 w-6">
                  <div
                    className={`absolute transition-all duration-300 ${isOpen ? 'rotate-0 opacity-100' : 'rotate-90 opacity-0'}`}
                  >
                    <X className="h-6 w-6" />
                  </div>
                  <div
                    className={`absolute transition-all duration-300 ${isOpen ? '-rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                  >
                    <Menu className="h-6 w-6" />
                  </div>
                </div>
              </SheetTrigger>
              <SheetContent side="top" className="w-full sm:hidden [&>button]:!hidden">
                <NavigationLinks isMobile={true} />
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
