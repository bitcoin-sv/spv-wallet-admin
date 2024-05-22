import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { QuestionMarkCircleIcon as Question } from '@heroicons/react/24/outline';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React, { useContext, useState } from 'react';
import { Toaster } from '@/components/ui/sonner.tsx';
import { toast } from 'sonner';
import { Role, SpvWalletContext } from '@/contexts/SpvWalletContext.tsx';
import { useConfig } from '@4chain-ag/react-configuration';
import { useServerUrl } from '@/hooks/useServerUrl.tsx';
import { checkKey } from '@/utils/checkKey.ts';
import logger from '@/logger/intex.ts';
import { SpvWalletClient } from '@bsv/spv-wallet-js-client';

export function LoginForm() {
  const [role, setRole] = useState<Role>('admin');
  const [key, setKey] = useState('');
  const [serverUrlField, setServerUrlField] = useState('');
  const { setServerUrl } = useServerUrl();
  const { setSpvWalletClient } = useContext(SpvWalletContext);

  const { config } = useConfig();
  const { serverUrl, editableServerUrl = false } = config;

  const handleSelect = (value: Role) => {
    setRole(value);
  };

  const onChangeKey = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  };

  const onChangeServerUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerUrlField(e.target.value);
  };

  const handleSignIn = async () => {
    console.log('Hello');
    setServerUrl(serverUrlField);

    try {
      const client = await checkKey(role, key);
      console.log('Client', client);
      setSpvWalletClient(client);
    } catch (error) {
      logger.error(error);
      console.log(error);
      toast.error('xPriv or Access Key is invalid');
    }
    // createSpvWalletClient;
  };
  return (
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
            <SelectContent defaultValue={'admin'}>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
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
                  <p>Sign in with Access Key available only for users</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <Input id="key" value={key} type="text" placeholder="" onChange={onChangeKey} />
          {editableServerUrl && (
            <>
              <Label htmlFor="server-url" className="flex items-center">
                Server Url
              </Label>
              <Input id="server-url" value={serverUrlField} onChange={onChangeServerUrl} type="text" placeholder="" />
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
  );
}
