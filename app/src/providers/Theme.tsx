import * as React from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300|Quicksand:300');

    * {
        font-family: 'Open Sans', sans-serif;
    }

    body {
        margin: 0;
    }

    #app {
        display: flex;
        flex-direction: column;
        width: 100vw;
        min-height: 100vh;
    }
`;

interface Props {
  children: any;
  theme?: Object;
}

export const Provider = ({ children, theme = {} }: Props) => {
  return (
    <ThemeProvider theme={theme}>
      <>
        <GlobalStyle />
        {children}
      </>
    </ThemeProvider>
  );
};
