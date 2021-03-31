import React, { useEffect } from 'react';
import { withApollo, } from 'react-apollo';
import { useAuth } from '8base-react-sdk';
import { compose } from 'recompose';
import { CURRENT_USER_QUERY,USER_SIGN_UP_MUTATION } from '../graphql/auth';
import Inicio from './Inicio';
// withAuth passes authorization state and utilities through auth prop.
const Authorization = compose(
    withApollo,
)(({ client }) => {
    //Se asigna el valor del useAuth() que contiene funciones
    //Especificas para generar login
    const auth = useAuth();
    //Si no se asigna ningun valor a esta variable se requerira login
    //Mantendra el login persistente si el auth.isAuthorized existe
    const shouldProcessAuthorizationResult = !auth.isAuthorized &&
        document.location.hash.includes('access_token');

    useEffect(() => {
        //Esta funcion se encarga de hacer el login con 8base
        const processAuthorizationResult = async () => {
            const { idToken, email } = await auth.authClient.getAuthorizedData();

            const context = { headers: { authorization: `Bearer ${idToken}` } };

            // Check if user exists, if not it'll return an error
            await client.query({
                query: CURRENT_USER_QUERY,
                context,
            })
                // If user is not found - sign them up
                .catch(() => client.mutate({
                    mutation: USER_SIGN_UP_MUTATION,
                    variables: {
                        user: { email },
                        authProfileId: process.env.REACT_APP_8BASE_PROFILE_ID,
                    },
                    context,
                }));

            // After succesfull signup store token in local storage
            // After that token will be added to a request headers automatically
            auth.authClient.setState({
                token: idToken,
            });
        };

        if (shouldProcessAuthorizationResult) {
            processAuthorizationResult();
        }
    }, [shouldProcessAuthorizationResult, auth, client]);

    if (auth.isAuthorized) {
        //Inicio se encarga de pasar los datos del usuario logeado a los demas
        //Componentes necesarios para el flujo del sistema
        return <Inicio />;
    }

    const authorize = () => {
        auth.authClient.authorize();
    }

    // Check if we didn't return from auth0
    if (!document.location.hash.includes('access_token')) {
        authorize()
    }

    return <p>Authorizing...</p>
});

export default Authorization;