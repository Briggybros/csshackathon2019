import * as React from 'react';
import { auth } from 'firebase';
import * as firebase from 'firebase';

{
  /* <FirebaseAuth
      uiConfig={{
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
          {
            provider: auth.GoogleAuthProvider.PROVIDER_ID,
            scopes: [
              'https://www.googleapis.com/auth/calendar',
              'https://www.googleapis.com/auth/calendar.events',
            ],
          },
        ],
      }}
      firebaseAuth={auth()}
    /> */
}

function logIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar');
  provider.addScope('https://www.googleapis.com/auth/calendar.events');

  firebase
    .auth()
    .signInWithPopup(provider)
    .then(result => {
      // @ts-ignore
      if (result.user) {
        const credentials = {
          ...result.credential,
          refreshToken: result.user.refreshToken,
        };
        firebase
          .functions()
          .httpsCallable('storeAuthTokens')(credentials)
          .catch(console.error);
      }
    })
    .catch(console.error);
}

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
    <button onClick={logIn}>Log in with Google</button>
  </div>
);
