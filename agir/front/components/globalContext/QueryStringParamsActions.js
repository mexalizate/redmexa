import { useCallback, useEffect, useRef } from "react";

import { setActivityAsInteracted } from "@agir/activity/common/helpers";
import { parseQueryStringParams } from "@agir/lib/utils/url";
import logger from "@agir/lib/utils/logger";

const log = logger(__filename);

const QueryStringParamsActions = ({ user }) => {
  const params = parseQueryStringParams();

  const fromActivityUpdated = useRef(false);

  const handleFromActivity = useCallback(async (activityId) => {
    fromActivityUpdated.current = true;
    try {
      await setActivityAsInteracted(activityId);
    } catch (e) {
      log.debug(e);
    }
  }, []);

  useEffect(() => {
    if (user && !fromActivityUpdated.current && params?.from_activity) {
      handleFromActivity(params.from_activity);
    }
  }, [user, params, handleFromActivity]);

  return null;
};

export default QueryStringParamsActions;