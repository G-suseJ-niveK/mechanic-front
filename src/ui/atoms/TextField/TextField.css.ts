import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  default: {
    '& .Mui-disabled': {
      '&:hover fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.31) !important'
      },
      color: 'rgba(0, 0, 0, 0.20)'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#02A460'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#02A460'
      },
      '&:hover fieldset': {
        borderColor: '#02A460'
      }
    },
    '& label': {
      color: 'rgba(0, 0, 0, 0.65)'
    },
    '& label.Mui-focused': {
      color: 'green'
    },
    '&:hover label': {
      // color: '#8bf333'
    },
    background: 'white',
    borderRadius: '5px',
    marginTop: '8px'
  },
  root: {
    '& .MuiInputLabel-outlined': {
      transform: 'translate(14px, 10px) scale(1)'
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -6px) scale(0.75)'
    },
    '& .MuiOutlinedInput-input': {
      padding: '9px'
    }
  }
}));

export default useStyles;
