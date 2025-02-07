import { Store, useStore } from '@tanstack/react-store';
import { SpvWalletAdminClientExtended, SpvWalletUserClientExtended } from '@/contexts';

interface ClientState {
  adminClient: SpvWalletAdminClientExtended | null;
  userClient: SpvWalletUserClientExtended | null;
}

const defaultState: ClientState = {
  adminClient: null,
  userClient: null,
};

// Create the store instance
export const clientStore = new Store(defaultState);

// Direct store access functions
export const getAdminApi = () => {
  const adminClient = clientStore.state.adminClient;
  if (!adminClient) throw new Error('Admin client not initialized');
  return adminClient;
};

export const getUserApi = () => {
  const userClient = clientStore.state.userClient;
  if (!userClient) throw new Error('User client not initialized');
  return userClient;
};

// React hooks for accessing clients
export const useAdminApi = () => {
  const adminClient = useStore(clientStore, (state) => state.adminClient);
  if (!adminClient) throw new Error('Admin client not initialized');
  return adminClient;
};

export const useUserApi = () => {
  const userClient = useStore(clientStore, (state) => state.userClient);
  if (!userClient) throw new Error('User client not initialized');
  return userClient;
};

// Action to update clients
export const updateClient = (
  role: 'adminClient' | 'userClient',
  client: SpvWalletAdminClientExtended | SpvWalletUserClientExtended | null,
) => {
  clientStore.setState((state) => ({
    ...state,
    [role]: client,
  }));
};

// Action to clear clients
export const clearClients = () => {
  clientStore.setState(() => ({
    adminClient: null,
    userClient: null,
  }));
};

export const clearAdminClient = () => {
  clientStore.setState((state) => ({
    ...state,
    adminClient: null,
  }));
};

export const clearUserClient = () => {
  clientStore.setState((state) => ({
    ...state,
    userClient: null,
  }));
};

export const disconnectAdmin = () => clearAdminClient();
export const disconnectUser = () => clearUserClient();
