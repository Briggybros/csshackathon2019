import * as React from 'react';
import { auth } from 'firebase';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';

export default () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: 'fit-content',
      height: 'fit-content',
      alignSelf: 'center',
      marginTop: 'auto',
      marginBottom: 'auto',
    }}
  >
    <FirebaseAuth
      uiConfig={{
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [auth.GoogleAuthProvider.PROVIDER_ID],
      }}
      firebaseAuth={auth()}
    />
  </div>
);
