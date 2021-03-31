import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    padding: theme.spacing(2, 4, 3),
    top: '40%',
    left: '45%',
    outline: 'none'
  },
}));

export default function LoaderSpiner(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setOpen(props.estado)
  }, [setOpen, open, props.estado])

  const body = (
    <div className={classes.paper}>
      <CircularProgress />
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        hideBackdrop
      >
        {body}
      </Modal>
    </div>
  );
}
