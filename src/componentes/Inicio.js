import React from 'react';
import { withApollo, Query } from 'react-apollo';
import { compose } from 'recompose';
import { CURRENT_USER_QUERY } from '../graphql/auth';
import { useAuth } from '8base-react-sdk';
import Task from './Task';

const Inicio = compose(
  withApollo,
)(({ client }) => {

  const auth = useAuth();
  const logout = async () => {
    await client.clearStore();

    auth.authClient.logout();
  };

  return (
    //El CURRENT_USER_QUERY se encarga de comprobar los datos del 
    //Usuario logeado
    <Query query={CURRENT_USER_QUERY}>
      { ({ loading, data }) => {
        if (loading) {
          return <p>Loading...</p>
        }
        return (
          //Task es un componente donde estan alojadas las funciones
          //Y llamadas a los componente hijos
          <>
            <Task logoutFunction={logout} />
          </>
        );
      }}
    </Query>
  )
});

export default Inicio;