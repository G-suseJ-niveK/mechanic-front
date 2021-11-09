import React, { useMemo } from 'react';
import { Theme as MuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, ThemeOptions, createTheme } from '@material-ui/core/styles';
import StyledEngineProvider from '@material-ui/core/StyledEngineProvider';

import shape from './shape';
import palette from './palette';
import typography from './typography';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';

export type Theme = {
  sidebar: {
    widthFine: number;
    width: number;
    widthCollapsed: number;
    background: string;
    color: string;
    iconColor: string;
    logo: {
      height: string;
      width: string;
      filter: string;
      marginBottom: string;
    };
    textLogo: {
      fontSize: string;
      fontWeight: number;
    };
    textLogoAssociation: {
      color: string;
      fontSize: string;
      fontWeight: number;
    };
  };
  header: {
    app: {
      height: string;
      background: string;
    };
    iconCollapse: {
      color: string;
    };
    toolbarButton: {
      height: string;
      borderTop: string;
      borderBottom: string;
      borderLeft: string;
      borderRadius: string;
    };
    appBarShift: {
      marginLeft: string;
      width: string;
    };
  };
  footer: {
    background: string;
    boxShadow: string;
    title: {
      padding: string;
      paddingXS: string;
      color: string;
      fontSize: string;
      fontSizeXS: string;
      fontSizeSM: string;
    };
    logo: {
      height: string;
      width: string;
    };
  };
} & MuiTheme;

type ThemeConfigProps = {
  children: React.ReactNode;
};

export default function ThemeConfig({ children }: ThemeConfigProps) {
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: { ...palette.light, mode: 'light' },
      shape,
      typography,
      breakpoints,
      // direction: themeDirection,
      shadows: shadows.light,
      customShadows: customShadows.dark
    }),
    []
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
