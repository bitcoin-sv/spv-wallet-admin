import {createContext, useContext, useReducer} from 'react';

const CredentialsContext = createContext(null);

const CredentialsDispatchContext = createContext(null);

export function CredentialsProvider({children}) {
  const [credentials, dispatch] = useReducer(
    credentialsReducer,
    initialCredentials
  );

  return (
    <CredentialsContext.Provider value={credentials}>
      <CredentialsDispatchContext.Provider value={dispatch}>
        {children}
      </CredentialsDispatchContext.Provider>
    </CredentialsContext.Provider>
  );
}

export function useCredentials() {
  const context = useContext(CredentialsContext);
  if (context == null) {
    throw new Error("<CredentialsProvider></CredentialsProvider> must be used before useCredentials() can be called.")
  }
  return context;
}

export function useCredentialsDispatch() {
  const context = useContext(CredentialsDispatchContext);
  if (context == null) {
    throw new Error("<CredentialsProvider></CredentialsProvider> must be used before useCredentialsDispatch() can be called.")
  }
  return context;
}

export function useModifyCredentials() {
  const dispatch = useCredentialsDispatch()
  return {
    setXPrivString: (value) => dispatch({type: 'setXPrivString', value}),
    setXPubString: (value) => dispatch({type: 'setXPubString', value}),
    setAccessKeyString: (value) => dispatch({type: 'setAccessKeyString', value}),
    setServer: (value) => dispatch({type: 'setServer', value}),
    setAdminKey: (value) => dispatch({type: 'setAdminKey', value}),
  }
}

function credentialsReducer(credentials, action) {
  switch (action.type) {
    case 'setXPrivString':
      return {
        ...credentials,
        xPrivString: action.value
      }
    case 'setXPubString':
      return {
        ...credentials,
        xPubString: action.value
      }
    case 'setAccessKeyString':
      return {
        ...credentials,
        accessKeyString: action.value
      }
    case 'setServer':
      return {
        ...credentials,
        server: action.value
      }
    case 'setAdminKey':
      return {
        ...credentials,
        adminKeyString: action.value
      }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialCredentials = {
  xPrivString: null,
  xPubString: null,
  accessKeyString: null,
  server: null,
  adminKeyString: null,
}
