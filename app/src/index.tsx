import * as React from 'react';
import { render } from 'react-dom';

import { Provider as FirebaseProvider } from './providers/Firebase';
import { Provider as ThemeProvider } from './providers/Theme';

import { App } from './App';

import firebaseConfig from './config.json';
import style from './style.json';

const mount = document.getElementById('app');
render(
  <ThemeProvider theme={style}>
    <FirebaseProvider config={firebaseConfig}>
      <App />
    </FirebaseProvider>
  </ThemeProvider>,
  mount
);
