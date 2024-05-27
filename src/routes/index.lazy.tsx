import { createLazyFileRoute } from '@tanstack/react-router';
import { LoginForm } from '@/components/Login/login.tsx';

export const Route = createLazyFileRoute('/')({
  component: LoginForm,
});

function Index() {
  // if not logged in redirect to login page, if spvWallet != null
  // const [_, setServerUrl] = useLocalStorage('login.serverUrl', '');
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold mb-16">SPV Wallet Admin</h1>
      XPub page
      <LoginForm />
    </div>
  );
}
