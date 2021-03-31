import React from 'react';
import { AppProvider } from '8base-react-sdk';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import Authorization from './componentes/Authorization';

// // 8base api endpoint REACT_APP_8BASE_API_ENDPOINT_URI
// // Datos de autentincacion 8base REACT_APP_8BASE_CLIENT_DOMAIN
// //Client ID (Client information) REACT_APP_8BASE_CLIENT_ID
// //Id profile auth REACT_APP_8BASE_PROFILE_ID

const REDIRECT_URI = document.location.href.replace(document.location.hash, '');

// Auth0 auth client 
const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.WEB_COGNITO,
  subscribable: true,
}, {
  clientId: process.env.REACT_APP_8BASE_CLIENT_ID,
  domain: process.env.REACT_APP_8BASE_CLIENT_DOMAIN,
  // Don't forget set custom domains in the authentication settings!
  //Si las rutas no existen en tu servidor genera errores al auth.
  //Colocar al principio todos con http://localhost:3000/

  redirectUri: REDIRECT_URI,
  logoutRedirectUri: REDIRECT_URI,
});



const App = () => {
  return (
    //Se coloca la variable de entorno ENDPOINT y el cliente generado
    // AppProvider es un componente obtenido de la dependencia 8basesdk
    <AppProvider uri={process.env.REACT_APP_8BASE_API_ENDPOINT_URI} authClient={authClient}>
      { ({ loading }) => {
        if (loading) {
          return <p>Loading...</p>;
        }

        // Authorization es el HOC para generar login si es necesario
        return (
          <React.Fragment>
            <Authorization />
          </React.Fragment>
        );
      }}
    </AppProvider>
  );
};

export default App;