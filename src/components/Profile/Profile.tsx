import { Link, useRouter } from '@tanstack/react-router';
import { Check, Copy, UserRound } from 'lucide-react';
import { useState } from 'react';

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
import { toast } from 'sonner';
import { clearClients, useIsUser, useUserApi } from '@/store/clientStore';

export const Profile = () => {
  const { loginKey } = useAuth();
  const { serverUrl, setSpvWalletClient } = useSpvWalletClient();
  const router = useRouter();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleLogout = async () => {
    setSpvWalletClient(null);
    clearClients();
    await router.invalidate();
  };

  const shortenId = (id: string) => {
    if (!id) {
      return '';
    }
    if (id.length <= 12) {
      return id;
    }
    return `${id.slice(0, 6)}...${id.slice(-6)}`;
  };

  const copyToClipboard = async (text: string, item: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(item);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      toast.error(`Failed to copy ${err}`);
    }
  };

  const shortLoginKey = shortenId(loginKey);
  const isUserClient = useIsUser();
  const userId = isUserClient ? useUserApi().userId : null;
  const shortUserId = userId ? shortenId(userId) : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="overflow-hidden rounded-full relative group">
          <UserRound />
          {shortLoginKey && (
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {shortLoginKey}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex justify-between items-center cursor-pointer"
          onClick={() => copyToClipboard(loginKey, 'xpriv')}
        >
          <span className="mr-4">xPriv: {shortLoginKey}</span>
          {copiedItem === 'xpriv' ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </DropdownMenuItem>
        {shortUserId && (
          <DropdownMenuItem
            className="flex justify-between items-center cursor-pointer"
            onClick={() => userId && copyToClipboard(userId, 'userId')}
          >
            <span className="mr-4">User ID: {shortUserId}</span>
            {copiedItem === 'userId' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-muted-foreground" />
            )}
          </DropdownMenuItem>
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
