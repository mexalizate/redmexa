import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useSelector } from "@agir/front/globalContext/GlobalContext";
import { getHasRouter, getRoutes } from "@agir/front/globalContext/reducers";
import { routeConfig, getRouteByPathname } from "@agir/front/app/routes.config";

import { addQueryStringParams } from "@agir/lib/utils/url";

const ExternalLink = (props) => {
  const { component, params, ...rest } = props;
  let href = props.href;
  if (params) {
    href = addQueryStringParams(href, params);
  }
  if (component) {
    const Component = component;
    return <Component {...rest} href={href} />;
  }

  return <a {...rest} href={href} />;
};
ExternalLink.propTypes = {
  href: PropTypes.string.isRequired,
  component: PropTypes.elementType,
  params: PropTypes.object,
};

const InternalLink = (props) => {
  const { to, params, state, ...rest } = props;

  let pathname = to;

  if (params) {
    pathname = addQueryStringParams(pathname, params, true);
  }

  const next = state ? { pathname, state } : pathname;

  return <RouterLink {...rest} to={next} />;
};
InternalLink.propTypes = {
  to: PropTypes.string.isRequired,
  state: PropTypes.object,
  params: PropTypes.object,
};

const RouteLink = (props) => {
  const { route, routeParams, ...rest } = props;
  const routes = useSelector(getRoutes);
  const hasRouter = useSelector(getHasRouter);

  const { url, isInternal = false } = useMemo(() => {
    if (routes[route]) {
      return {
        url: routes[route],
        isInternal: !!getRouteByPathname(routes[route]),
      };
    }
    if (routeConfig[route]) {
      return {
        url: routeParams
          ? routeConfig[route].getLink(routeParams)
          : routeConfig[route].getLink(),
        isInternal: true,
      };
    }
    return {
      url: route,
    };
  }, [routes, route, routeParams]);

  return hasRouter && isInternal ? (
    <InternalLink {...rest} to={url} />
  ) : (
    <ExternalLink {...rest} href={url} />
  );
};
RouteLink.propTypes = {
  route: PropTypes.string.isRequired,
  routeParams: PropTypes.object,
};

const Link = (props) => {
  const { route, href, to } = props;
  if (route) {
    return <RouteLink {...props} />;
  }
  if (to) {
    return <RouterLink to={to} {...props} />;
  }
  if (href) {
    return <ExternalLink {...props} />;
  }

  return null;
};
Link.propTypes = {
  route: PropTypes.string,
  href: PropTypes.string,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]),
};
export default Link;
