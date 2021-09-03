import { init, reactRouterV5Instrumentation } from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { isMatchingPattern } from "@sentry/utils";

import { createBrowserHistory } from "history";
import { matchPath } from "react-router-dom";
import routes from "@agir/front/app/routes.config";
import groupPageRoutes from "@agir/groups/groupPage/GroupPage/routes.config";

const history = createBrowserHistory();

if (process.env.NODE_ENV === "production") {
  init({
    dsn: "https://208ef75bce0a46f6b20b69c2952957d7@erreurs.lafranceinsoumise.fr/4",
    environment: process.env.SENTRY_ENV,
    autoSessionTracking: true,
    release: process.env.SENTRY_RELEASE,
    integrations: [
      new Integrations.BrowserTracing({
        shouldCreateSpanForRequest: (url) => {
          if (isMatchingPattern(url, "/api/session/")) {
            return false;
          }

          return true;
        },
        routingInstrumentation: reactRouterV5Instrumentation(
          history,
          routes.concat(groupPageRoutes),
          matchPath
        ),
      }),
    ],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.1,

    ignoreErrors: [
      // Email link Microsoft Outlook crawler compatibility error
      // cf. https://forum.sentry.io/t/unhandledrejection-non-error-promise-rejection-captured-with-value/14062
      "Non-Error promise rejection captured with value: Object Not Found Matching Id:",
    ],
  });
}
