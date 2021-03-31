import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Typography,
  Grid,
  Button,
  Checkbox
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
}));

export default function ComplexGrid(props) {
  const classes = useStyles();
  //Constante para el manejo de estado
  const [checked, setChecked] = React.useState(false);
  //Manejo de cambio de estado del checkbox.
  //Compruebo que tengo un usuario asignado para
  //Terminar la tarea
  const handleChange = (event,item) => {
    if (item.userAsigned !== null){
      setChecked(event.target.checked);
      stateChanger(item.id)
    } else {
      alert('No se puede cambiar a completada sin un usuario asignado')
    }
  };
  //Props function de delete_task
  const deleteTask = ({item}) => {
    //Armo objeto a enviar
    let filter = {
      id: {
        equals: item.id
      }
    }
    props.funDel({
      variables: { filter },
    }).then((res) => {
      props.refetchFun(true);
    }).catch(err => {
      console.log(err)
    });
  }
  //Prop Function para cambiar estado
  //Esta es la fuction custom de 8base
  const stateChanger = (item) => {
    props.stateFunction({
      variables: { id: item },
    }).then((res) => {
      props.refetchFun(true);
    }).catch(err => {
      console.log(err)
    });
  }
  return (
    <div className={classes.root}>

      <Grid item xs={6} sm container>
        <Grid item xs container direction="column" spacing={2}>
          <Grid item xs>
            <Typography variant="h6" gutterBottom>
              {props.item.content}
            </Typography>
            {/* Compruebo que el usuario exista en el objeto que llega
                para poder mostrarlo
            */}
            {!!props.item.userAsigned !== null && (
              <Typography variant="subtitle1" gutterBottom>
                Usuario: {props.item.userAsigned !== null ? props.item.userAsigned.email : 'No asignado'}
              </Typography>
            )}
          </Grid>
          {/* 
              Mando un parametro via props para mostrar los botones
              este caso se usa cuando ya la task esta lista
          */}
          {!!props.ifButtonOn && (
            <Grid item>
              <Button onClick={() => props.handleCloseFunction(props.item)} color="primary">Editar</Button>
              <Button onClick={() => deleteTask(props)} color="secondary">Eliminar</Button>
              <Checkbox
                checked={checked}
                onChange={(e) => handleChange(e,props.item)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

    </div>
  );
}
