import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Box,
  Button
} from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import LoadingSpiner from './LoadingSpiner';


import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_TASK, CREATE_TASK, DEL_TASK, EDIT_TASK, CHANGE_STATE } from '../graphql/task';
import { GET_USER } from '../graphql/user';

import NuevaTask from './Form/NuevaTask';
import ComplexGrid from './Cards';
import TabPanel from './TabPanel';
import Modal from './Modal';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
    backgroundColor: '#96919173',
    marginTop: '1%'
  },
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function Task(props) {
  //Get task, se encarga de traer los datos de la tabla task
  //El refetch se utiliza para llamarla de nuevo una vez
  //Ocurra un insertar/editar/eliminar
  const { loading: LoadingTask, error, data, refetch } = useQuery(GET_TASK, {
    fecthPolicy: "no-cache",
  });
  //Get Users, Lo utilizo para llenar el selector de usuarios
  const { loading: LoadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER, {
    fecthPolicy: "no-cache",
  });
  //Mutation para insertar task
  const [newTask] = useMutation(CREATE_TASK, {
    onCompleted: data => {
      setLoading(false);
    }
  });
  //Mutation para Borrar task
  const [delTask] = useMutation(DEL_TASK, {
    onCompleted: data => {
      setLoading(false);
    }
  });
  //Mutation para editar task
  const [ediTask] = useMutation(EDIT_TASK, {
    onCompleted: data => {
      setLoading(false);
    }
  });
  //Mutation custom para editar el estado de la task
  const [changeStateTask] = useMutation(CHANGE_STATE, {
    onCompleted: data => {
      setLoading(false);
    }
  });
  //Constante para manejar el estado de loading
  const [loading, setLoading] = useState(false);
  //Constantes para alojar los datos de task y taskcompletadas
  const [task, setTask] = useState([]);
  const [taskC, setTaskC] = useState([]);
  //Fin
  //Constante para los datos del selector
  const [userData, setUserData] = useState([]);
  //Constante para pasar los datos de editar al modal
  const [dataModal, setDataModal] = useState([]);
  //Value de las tabs
  const [value, setValue] = useState(0);
  //Constante para manejar el refect en el useEffect
  const [isRefetch, setIsRefetch] = useState(false);
  //Constante para manejar el estado del modal
  const [openModal, setOpenModal] = useState(false);
  const classes = useStyles();
  //Manejo de estado de las tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  //Manejo del abrir y cerrado del modal
  const handleClose = (data) => {
    if (data && data.id) {
      setDataModal(data)
    }
    setOpenModal(!openModal);
  }
  useEffect(() => {
    //Asignacion de los datos de task a sus respectivas variables
    if (data && data.tasksList) {
      let tasks = data.tasksList.items;
      let tasksC = [];
      let tasksU = [];
      tasks.map((item) => {
        if (item.state === true) {
          tasksC.push(item);
        } else {
          tasksU.push(item);
        }
        return item;
      });
      setTask(tasksU);
      setTaskC(tasksC);
    }
    //Asignacion de los datos de usuario para sus variables
    if (dataUser && dataUser.usersList) {
      let userArray = dataUser.usersList.items
      let userFix = [];
      userArray.map((item) => {
        return userFix.push({ label: item.email, value: item.email })
      })
      setUserData(userFix);
    }
    //Comprobando si el estado de isRefect es true para llamarlo
    if (isRefetch) {
      refetch()
      setIsRefetch(false)
    }
    //Comprobando estado loading
    if (LoadingTask || LoadingUser) {
      return <h1>Cargando</h1>
    }
    //Comprobando estado Error
    if (error || errorUser) {
      return <h1>Ocurrio un error de conexion, actualiza la pagina</h1>
    }
  }, [LoadingTask, data, error, isRefetch, LoadingUser, errorUser, dataUser, refetch]);
  return (
    <div>
      <Grid container spacing={2}>
        <Grid
          item
          md={4}
        >
          <Typography
            variant="h4"
            component="h4"
            align="center"
          >
            Nueva tarea
      		</Typography>
          {/* NuevaTask es el formulario de insertar task */}
          <NuevaTask newTask={newTask} logoutFun={props.logoutFunction} loadingState={setLoading} refetchFun={setIsRefetch} />
        </Grid>
        <Grid
          item
          md={8}
        >
          <Paper>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Tareas" />
              <Tab label="Completadas" />
            </Tabs>
            <TabPanel value={value} index={0}>
              {/* Mapeo de task no completada para mostrar en el front */}
              {!!task && task.map((item, i) => {
                return (
                  <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                      <ComplexGrid
                        item={item}
                        editFun={setOpenModal}
                        handleCloseFunction={handleClose}
                        refetchFun={setIsRefetch}
                        funDel={delTask}
                        ifButtonOn={true}
                        stateFunction={changeStateTask}
                        key={i} />
                    </Grid>
                  </Paper>
                )
              })}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {/* Mapeo de task completadas para mostrar en el front */}
              {!!taskC && taskC.map((item, i) => {
                return (
                  <Paper className={classes.paper}>
                    <Grid container spacing={2}>
                      <ComplexGrid
                        item={item}
                        refetchFun={setIsRefetch}
                        funDel={delTask}
                        ifButtonOn={false}
                        key={i} />
                    </Grid>
                  </Paper>
                )
              })}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      {/* Loading spinner para comprobar tiempos de carga */}
      <LoadingSpiner estado={loading} />
      {/* Modal para editar */}
      <Modal data={userData} sendDataEdit={ediTask} refetchFun={setIsRefetch} open={openModal} datosForm={dataModal} handleCloseFunction={handleClose} />
    </div>
  );
}
