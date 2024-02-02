import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Login from './components/Pages/Login'
import { GlobalStyle } from './styles.css'
// import * as serviceWorker from './serviceWorker';
// import Amplify from 'aws-amplify'
// import config from 'config'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';

//FIXME: remove identity pool or configure
// Amplify.configure({
//   Auth: {
//     mandatorySignIn: true,
//     region: config.cognito.REGION,
//     userPoolId: config.cognito.USER_POOL_ID,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID,
//     userPoolWebClientId: config.cognito.APP_CLIENT_ID
//   },
//   Storage: {
//     region: config.s3.REGION,
//     bucket: config.s3.BUCKET,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID
//   },
//   API: {
//     endpoints: [...config.apiGateway.ENDPOINTS]
//   }
// })

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/:route/:companyId/:memberKey" component={App} />
        <Route path="/:route/:companyId" component={App} />
        <Route path="/:route" component={App} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
