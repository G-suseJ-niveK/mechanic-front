import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexShrink: 0,
    marginBottom: theme.spacing(0),
    marginLeft: '20px',
    marginTop: theme.spacing(0)
  }
}));

export default useStyles;
