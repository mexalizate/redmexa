import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import routes, { BASE_PATH, routeConfig } from "./routes.config";
import Page from "./Page";
import NotFoundPage from "@agir/front/offline/NotFoundPage";

import { useAuthentication } from "@agir/front/authentication/hooks";

import logger from "@agir/lib/utils/logger";

const log = logger(__filename);

export const ProtectedComponent = ({ Component, route, ...rest }) => {
  const location = useLocation();
  const isAuthorized = useAuthentication(route);

  useEffect(() => {
    if (isAuthorized === null) {
      return;
    }
    const loader = document.getElementById("app_loader");
    if (!loader) {
      return;
    }
    loader.style.opacity = "0";
    loader.addEventListener("transitionend", () => {
      const loader = document.getElementById("app_loader");
      loader && loader.remove();
    });
  }, [isAuthorized]);

  useEffect(() => {
    if (typeof Component.preload === "function") {
      log.debug("Preloading", Component);
      Component.preload();
    }
  }, [Component]);

  if (isAuthorized === null) {
    return null;
  }

  if (isAuthorized === true) {
    return <Page Component={Component} routeConfig={route} {...rest} />;
  }

  return (
    <Redirect
      to={{ pathname: routeConfig.login.getLink(), state: { from: location } }}
    />
  );
};
ProtectedComponent.propTypes = {
  Component: PropTypes.elementType.isRequired,
  route: PropTypes.object.isRequired,
};

const Router = ({ children }) => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      {routes.map((route) => (
        <Route key={route.id} path={route.path} exact={!!route.exact}>
          <ProtectedComponent Component={route.Component} route={route} />
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
