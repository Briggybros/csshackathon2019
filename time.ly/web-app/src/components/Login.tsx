import * as React from 'react';
import * as firebase from 'firebase';
import styled from 'styled-components';

const LoginButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: white;
  border-radius: 25px;
  border: 2px solid lightgray;
`;

const GoogleLogo = styled.img`
  height: 1rem;
  margin-right: 0.5rem;
`;

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

        setTimeout(() => {
          firebase
            .functions()
            .httpsCallable('storeAuthTokens')(credentials)
            .catch(console.error);
        }, 3000);
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
    <LoginButton onClick={logIn}>
      <GoogleLogo src="https://developers.google.com/identity/images/g-logo.png" />
      Sign in with Google
    </LoginButton>
  </div>
);
