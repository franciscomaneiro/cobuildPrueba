import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  TextField,
  MenuItem
} from '@material-ui/core';
import { Formik } from 'formik';
import Modal from '@material-ui/core/Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'relative',
    width: 250,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2, 4, 3),
    top: '25vh',
    left: '40vw',
    outline: 'none'
  },
}));

export default function ModalItem(props) {
  const classes = useStyles();
  //Function prop para usar el EDIT_TASK
  const onSubmit = (values) => {
    //Genero los objetos para enviar
    //Inicio
    let data = {
      content: values.tareaInput,
      userAsigned: {
        connect: {
          email: values.usuario
        }
      }
    }
    let filter = {
      id: values.id,
    }
    //Fin
    //sendDataEdit prop fuction para utilizar el mutation del padre
    props.sendDataEdit({
      variables: { data, filter },
    }).then((res) => {
      props.handleCloseFunction()
      props.refetchFun(true);
    }).catch(err => {
      props.handleCloseFunction()
      console.log(err)
    });
  };
  //Genero el initialValue para que los valores inicien con los datos de props
  const initialValues = {
    tareaInput: props.datosForm.content,
    id: props.datosForm.id,
    usuario: props.datosForm.userAsigned !== undefined && props.datosForm.userAsigned !== null ? props.datosForm.userAsigned.email : ''
  }
  // Utilizo formik para el manejo de formularios
  //Asigno en una constante body los que ira dentro del modal
  // Para posteriormente usarlo dentro de el componente modal 
  const body = (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        await onSubmit(values)
        actions.resetForm({
          values: {
            tareaInput: '',
            id: '',
            usuario: ''
          },
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Card className={classes.paper}>
            <CardContent>

              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <Typography variant="h5">
                    Editar Tarea
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                >
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      required
                      fullWidth
                      name="tareaInput"
                      id="tareaInput"
                      label="Tarea"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.tareaInput}
                    />
                    {errors.tareaInput && touched.tareaInput && errors.tareaInput}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                  >
                    <TextField
                      required
                      id="userInput"
                      label="Usuario"
                      select
                      name="usuario"
                      fullWidth
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.usuario}
                    >
                      {!!props.data && (props.data.map((option) => (
                        <MenuItem key={`sucursal_${option.value}`} value={option.value}>
                          {option.label}
                        </MenuItem >
                      )))}
                    </TextField>
                    {errors.usuario && touched.usuario && errors.usuario}
                  </Grid>

                </Grid>
              </Grid >
              <Box
                display="flex"
                justifyContent="flex-end"
                pt={3}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  type="submit"
                >
                  Aceptar
                </Button>
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={props.handleCloseFunction}
                >
                  Cerrar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>

  );
  //retorno a la vista task el componente modal
  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleCloseFunction}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}