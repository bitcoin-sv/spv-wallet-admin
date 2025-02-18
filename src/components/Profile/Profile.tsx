import { Link, useRouter } from '@tanstack/react-router';
import { UserRound, SquareArrowOutUpRight } from 'lucide-react';

import { Button } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';

import { useAuth, useSpvWalletClient } from '@/contexts';

export const Profile = () => {
  const { loginKey, isUser } = useAuth();
  const { serverUrl, setSpvWalletClient } = useSpvWalletClient();
  const router = useRouter();

  const handleLogout = async () => {
    setSpvWalletClient(null);
    await router.invalidate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
          <UserRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>ID: {loginKey}</DropdownMenuItem>
        {isUser && (
          <Link to="/user/xpub" className="flex w-full">
            <DropdownMenuItem className="cursor-pointer w-full">
              xPub <SquareArrowOutUpRight className="ml-2" size={20} />
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuItem>Server: {serverUrl}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <Link to={'/login'}>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
