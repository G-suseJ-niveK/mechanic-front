import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  item: {
    '&:hover': {
      backgroundColor: '#96C262'
    }
  },
  root: {
    '& .MuiInputLabel-root': {
      transform: 'translate(1px, 10px) scale(1)'
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(1px, -6px) scale(0.75) !important'
    }
  },
  label: {
    color: 'rgba(0, 0, 0, 0.65)'
  },
  selected: {
    backgroundColor: '#96C262 !important'
  },
  error: {
    '& .MuiInputBase-input': {
      color: '#f44336',
      borderBottom: '2px solid #f44336'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
      borderBottom: '2px solid #f44336'
    },
    '& .MuiInput-underline:before': {
      borderBottom: '2px solid #f44336'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#f44336'
    },
    '& .MuiInput-underline.Mui-error:after': {
      borderBottomColor: '#f44336'
    },
    '& label': {
      color: '#f44336'
    },
    '& label.Mui-focused': {
      color: '#f44336'
    },
    // background: 'white',
    borderRadius: '5px'
  }
}));

export default useStyles;
