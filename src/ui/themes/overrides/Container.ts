import { Theme } from '@material-ui/core/styles';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Container(theme: Theme) {
  return {
    MuiContainer: {
      styleOverrides: {
        root: {}
      }
    }
  };
}
