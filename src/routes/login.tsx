import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ModeToggle,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Toaster,
} from '@/components';
import { Role, useAuth, useSpvWalletClient } from '@/contexts';

import logger from '@/logger';
import { createClient, getShortXprv } from '@/utils';
import { useConfig } from '@4chain-ag/react-configuration';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router';

import React, { useRef, useState } from 'react';

import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  component: LoginForm,
});

export function LoginForm() {
  const [role, setRole] = useState<Role>(Role.User);
  const [key, setKey] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [userOption, setUserOption] = useState<string>('xPriv');
  const { setSpvWalletClient, serverUrl, setServerUrl } = useSpvWalletClient();

  const { isAuthenticated, setLoginKey, isAdmin, isUser } = useAuth();
  const router = useRouter();
  const search = useSearch({ from: '/login' as const }) as { redirect?: string };

  const { config } = useConfig();
  const { configureServerUrl = false } = config;

  const ShowPasswordIcon = isPasswordVisible ? EyeSlashIcon : EyeIcon;

  const inputRef = useRef<HTMLInputElement>(null);

  React.useLayoutEffect(() => {
    if (isAuthenticated && search?.redirect) {
      router.history.push(search.redirect);
    } else if (isAdmin) {
      router.history.push('/admin/xpub');
    } else if (isUser) {
      router.history.push('/user/access-keys');
    }
  }, [isAuthenticated, search?.redirect]);

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

      setLoginKey(getShortXprv(key));

      await router.invalidate();
    } catch (error) {
      logger.error(error);
      toast.error('xPriv or Access Key is invalid');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
    inputRef.current?.focus();
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
                    <SelectValue placeholder="User" />
                  </SelectTrigger>
                  <SelectContent defaultValue={role}>
                    <SelectItem value={Role.Admin}>Admin</SelectItem>
                    <SelectItem value={Role.User}>User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                {Role.Admin === role ? (
                  <div className="relative">
                    <Label htmlFor="key" className="flex items-center mb-2">
                      Admin Key (xpriv)
                    </Label>
                    <Input
                      id="key"
                      ref={inputRef}
                      value={key}
                      type={isPasswordVisible ? 'text' : 'password'}
                      placeholder="Admin Key"
                      onChange={onChangeKey}
                      className="pr-12"
                    />
                    <ShowPasswordIcon
                      className="size-5 absolute top-8 right-3.5 cursor-pointer"
                      onClick={handleTogglePasswordVisibility}
                    />
                  </div>
                ) : (
                  Role.User === role && (
                    <>
                      <Label className="flex items-center mb-2">Key</Label>
                      <RadioGroup defaultValue={userOption} className="mb-2" onValueChange={setUserOption}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem defaultChecked value="xPriv" content="xPriv" id="xPrivUser" />
                          <Label htmlFor="xPrivUser">xPriv</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Access Key" content="Access Key" id="accessKeyUser" />
                          <Label htmlFor="accessKeyUser">Access Key</Label>
                        </div>
                      </RadioGroup>
                      <div className="relative">
                        <Input
                          value={key}
                          ref={inputRef}
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder={userOption === 'xPriv' ? 'xPriv' : 'Access Key'}
                          onChange={onChangeKey}
                          className="pr-12"
                        />
                        <ShowPasswordIcon
                          className="size-5 absolute top-2.5 right-3.5 cursor-pointer"
                          onClick={handleTogglePasswordVisibility}
                        />
                      </div>
                    </>
                  )
                )}

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
