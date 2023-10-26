import React, { useCallback, useEffect, useState } from "react";
import { Redirect, useRouteMatch } from "react-router-dom";
import useSWRImmutable from "swr/immutable";

import { useCustomAnnouncement } from "@agir/activity/common/hooks";
import { useMobileApp } from "@agir/front/app/hooks";
import { routeConfig } from "@agir/front/app/routes.config";
import { usePush } from "@agir/notifications/push/subscriptions";

import ChooseNewsletters from "./ChooseNewsletters";
import DeviceNotificationSubscription from "./DeviceNotificationSubscription";
import TellMore from "./TellMore";

const TellMorePage = () => {
  const isTellMorePage = useRouteMatch(routeConfig.tellMore.getLink());

  const { data: session } = useSWRImmutable("/api/session/");
  const { available, isSubscribed, subscribe, ready, errorMessage } = usePush();

  const [hasNewsletters, dismissNewsletters, newslettersAreLoading] =
    useCustomAnnouncement("ChooseNewsletters", false);

  const [hasTellMore, dismissTellMore, tellMoreIsLoading] =
    useCustomAnnouncement("tellMore", false);

  const [
    hasDeviceNotificationSubscription,
    setHasDeviceNotificationSubscription,
  ] = useState(isTellMorePage);

  const dismissDeviceNotificationSubscription = useCallback(() => {
    setHasDeviceNotificationSubscription(false);
  }, []);

  const { isMobileApp } = useMobileApp();

  useEffect(() => {
    let timeout = null;
    // Avoid blocking the user on a blank page if push never becomes ready
    if (isMobileApp && hasDeviceNotificationSubscription && !ready) {
      timeout = setTimeout(() => {
        setHasDeviceNotificationSubscription(false);
      }, 1000);
    }
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [hasDeviceNotificationSubscription, isMobileApp, ready]);

  if (!isTellMorePage && (hasNewsletters || hasTellMore)) {
    return <Redirect to={routeConfig.tellMore.getLink()} />;
  }

  if (!isTellMorePage || tellMoreIsLoading || newslettersAreLoading) {
    return null;
  }

  if (hasNewsletters) {
    return (
      <ChooseNewsletters dismiss={dismissNewsletters} user={session?.user} />
    );
  }

  if (hasTellMore) {
    return <TellMore dismiss={dismissTellMore} />;
  }

  if (isMobileApp && hasDeviceNotificationSubscription && !ready) {
    return null;
  }

  if (
    isMobileApp &&
    hasDeviceNotificationSubscription &&
    available &&
    !isSubscribed
  ) {
    return (
      <DeviceNotificationSubscription
        onSubscribe={subscribe}
        onDismiss={dismissDeviceNotificationSubscription}
        subscriptionError={errorMessage}
      />
    );
  }

  return <Redirect to={routeConfig.events.getLink()} />;
};

export default TellMorePage;
