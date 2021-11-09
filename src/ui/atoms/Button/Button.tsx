import React from 'react';
import { CircularProgress } from '@material-ui/core';
import MaterialButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: any) => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  progress: {
    // color: '#00695c',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

type ButtonProps = {
  text: string;
  color?: 'inherit' | 'primary' | 'secondary';
  variant?: 'text' | 'outlined' | 'contained' | undefined;
  progressColor?: 'primary' | 'secondary' | 'inherit' | undefined;
  disabled?: boolean;
  onClick?(): any;
  isLoading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: any;
};

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  const classes = useStyles();
  const { text, color, variant, progressColor, isLoading, ...rest } = props;

  return (
    <div className={classes.wrapper}>
      <MaterialButton variant={variant} color={color} {...rest}>
        {text}
      </MaterialButton>
      {isLoading && <CircularProgress color={progressColor} size={24} className={classes.progress} />}
    </div>
  );
};

Button.defaultProps = {
  progressColor: 'primary'
};
export default Button;
