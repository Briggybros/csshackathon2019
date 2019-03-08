import * as React from 'react';
import * as firebase from 'firebase';

const UserContext = React.createContext<firebase.User | null>(null);

let app: firebase.app.App | null = null;

interface Props {
  config: Object;
  children: any;
}

export const Provider = ({ config, children }: Props) => {
  const [user, setUser] = React.useState<firebase.User | null>(null);

  if (!app) {
    app = firebase.initializeApp(config);
    firebase.functions();

    app.auth().onAuthStateChanged(updatedUser => {
      setUser(updatedUser ? updatedUser : null);
    });
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export function useUser(Component: any) {
  return (props: { [key: string]: any }) => (
    <UserContext.Consumer>
      {user => <Component user={user} {...props} />}
    </UserContext.Consumer>
  );
}
