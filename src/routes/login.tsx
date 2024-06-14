import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionMarkCircleIcon as Question } from '@heroicons/react/24/outline';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner.tsx';
import { toast } from 'sonner';
import { Role, useAuth, useSpvWalletClient } from '@/contexts';
import { useConfig } from '@4chain-ag/react-configuration';
import { createClient } from '@/utils/createClient.ts';
import logger from '@/logger';
import { ModeToggle } from '@/components/ModeToggle/ModeToggle.tsx';

export const Route = createFileRoute('/login')({
  component: LoginForm,
});

export function LoginForm() {
  const [role, setRole] = useState<Role>(Role.Admin);
  const [key, setKey] = useState('');
  const { setSpvWalletClient, serverUrl, setServerUrl, spvWalletClient } = useSpvWalletClient();

  const { isAdmin } = useAuth();

  const { config } = useConfig();
  const { configureServerUrl = false } = config;
  const navigate = Route.useNavigate();

  useEffect(() => {
    (async () => {
      if (isAdmin) {
        await navigate({ to: '/xpub' });
      }
    })();
  }, [spvWalletClient]);

  const handleSelect = (value: string) => {
    setRole(value as Role);
  };

  const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const onChangeServerUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerUrl(e.target.value);
  };

  const handleSignIn = async () => {
    setServerUrl(serverUrl);

    try {
      const client = await createClient(role, key);
      setSpvWalletClient(client);

      if (isAdmin) {
        await navigate({ to: '/xpub' });
      }
    } catch (error) {
      logger.error(error);
      toast.error('xPriv or Access Key is invalid');
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-8 right-8">
        <ModeToggle />
      </div>
      <div className="grid grid-cols-2 h-screen">
        <div className="flex flex-col items-center justify-center border-r">
          <h1 className="text-2xl font-bold mb-16">SPV Wallet Admin</h1>
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={handleSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Admin" />
                  </SelectTrigger>
                  <SelectContent defaultValue={role}>
                    <SelectItem value={Role.Admin}>Admin</SelectItem>
                    <SelectItem value={Role.User}>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="key" className="flex items-center">
                  xPriv or Access Key
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Question className="size-4 ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign in with Access Key available only for Role 'User'</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input id="key" value={key} type="text" placeholder="" onChange={onChangeKey} />
                {configureServerUrl && (
                  <>
                    <Label htmlFor="server-url" className="flex items-center">
                      Server Url
                    </Label>
                    <Input id="server-url" value={serverUrl} onChange={onChangeServerUrl} type="text" placeholder="" />
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignIn} className="w-full">
                Sign in
              </Button>
            </CardFooter>
            <Toaster position="bottom-center" />
          </Card>
        </div>
        <div className="flex justify-center">
          <img className="object-contain max-w-[765px]" src="/bsv-login.png" alt="login" />
        </div>
      </div>
    </div>
  );
}
