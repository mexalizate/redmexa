import PropTypes from "prop-types";
import React from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import routes, { routeConfig, BASE_PATH } from "./routes.config";
import Page from "./Page";
import NotFoundPage from "@agir/front/offline/NotFoundPage";

import { useAuthentication } from "@agir/front/authentication/hooks";

export const ProtectedComponent = (props) => {
  const location = useLocation();
  const isAuthorized = useAuthentication(props.routeConfig);
  if (isAuthorized === null) {
    return null;
  }
  if (isAuthorized === true) {
    return <Page {...props} />;
  }
  return (
    <Redirect
      to={{ pathname: routeConfig.login.pathname, state: { from: location } }}
    />
  );
};
ProtectedComponent.propTypes = {
  routeConfig: PropTypes.object,
};

const Router = ({ children }) => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      {routes.map((route) => (
        <Route key={route.id} path={route.pathname} exact={!!route.exact}>
          <ProtectedComponent Component={route.Component} routeConfig={route} />
        </Route>
      ))}
      <Route key="not-found">
        <NotFoundPage />
      </Route>
    </Switch>
    {children}
  </BrowserRouter>
);
Router.propTypes = {
  children: PropTypes.node,
};
export default Router;
