import React from "react";
import { Formik } from 'formik';
import { TextField, Button, Grid, Box } from '@material-ui/core';

export default function NuevaTask(props) {
  //Paso via props el mutation CREATE TASK
  const onSubmit = (values) => {
    //Armo el objeto a enviar
    let data = {
      content: values.tareaInput,
      state: false
    }
    props.newTask({
      variables: { data },
    }).then((res) => {
      props.refetchFun(true);
    }).catch(err => {
      console.log(err)
    });
  };

  return (
    <Grid
      container
      justify="center"
      alignItems="center"
    >
      {/* Utilizo formik para manejar los formularios de manera agil */}
      <Formik
        initialValues={{ tareaInput: '' }}
        onSubmit={async (values, actions) => {
          await onSubmit(values)
          actions.resetForm({
            values: {
              tareaInput: ''
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
            <Grid
              item
              xs={12}
            >
              <TextField
                required
                id="tareaInput"
                label="Tarea"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.Tarea}
              />
              {errors.email && touched.email && errors.email}
            </Grid>
            <Grid
              item
              xs={12}
            >
              <Box
                display="flex"
                justifyContent="flex-end"
                pt={3}
              >
                <Button variant="contained" type="submit" color="primary">
                  Guardar
                </Button>
              </Box>
            </Grid>

          </form>
        )}
      </Formik>
    </Grid>
  );
}