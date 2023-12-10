import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Accordion from "@agir/front/genericComponents/Accordion";
import Button from "@agir/front/genericComponents/Button";
import { PageFadeIn } from "@agir/front/genericComponents/PageFadeIn";
import Panel, { StyledBackButton } from "@agir/front/genericComponents/Panel";
import Link from "@agir/front/app/Link";

import NotificationSettingItem from "./NotificationSettingItem";

import { useSelector } from "@agir/front/globalContext/GlobalContext";
import { getUser } from "@agir/front/globalContext/reducers";

import { useMobileApp } from "@agir/front/app/hooks";
import { usePush } from "@agir/notifications/push/subscriptions";

const StyledGroupName = styled.div`
  display: grid;
  grid-template-columns: 1fr 70px;
  grid-auto-flow: column;
  grid-gap: 0 0.5rem;
  align-items: center;

  span {
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  small {
    font-size: 0.688rem;
    line-height: 1;
    text-align: right;
  }
`;

const StyledGroup = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 1rem 0;

  & + & {
    padding-top: 1.5rem;

    ${StyledGroupName} {
      small {
        display: none;
      }
    }
  }
`;

const AccordionContent = styled.div`
  padding: 1.5rem;
`;

const StyledPushNotificationControls = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  border-radius: ${style.borderRadius};
  background-color: ${style.black50};
  width: calc(100% - 3rem);
  margin: 0 auto 1.5rem;
  gap: 1rem;

  p {
    flex: 1 1 auto;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
    padding: 0;
    font-weight: 400;
  }
`;

const StyledPanel = styled(Panel)`
  padding-left: 0;
  padding-right: 0;

  ${StyledBackButton} {
    margin-left: 1.5rem;
    padding-bottom: 0;
  }

  & > p {
    padding: 0 1.5rem 0.5rem;
    display: inline-block;
  }
`;

const InlineBlock = styled.span`
  display: inline-block;
`;

const PushNotificationControls = () => {
  const { isMobileApp } = useMobileApp();

  const { ready, available, isSubscribed, subscribe } = usePush();

  if (isMobileApp && ready && !available) {
    return (
      <StyledPushNotificationControls>
        <p>Installez l'application pour recevoir des notifications</p>
      </StyledPushNotificationControls>
    );
  }

  if (isMobileApp && ready && available && !isSubscribed && subscribe) {
    return (
      <StyledPushNotificationControls
        css={`
          background-color: ${(props) => props.theme.primary100};
        `}
      >
        <p>
          <strong>Notifications désactivées</strong>
          <br />
          Autorisez les notifications sur cet appareil
        </p>
        <Button onClick={subscribe} color="primary">
          Activer
        </Button>
      </StyledPushNotificationControls>
    );
  }

  return null;
};

const NotificationSettingPanel = (props) => {
  const {
    isOpen,
    close,
    notifications,
    activeNotifications,
    onChange,
    disabled,
    ready,
  } = props;

  const user = useSelector(getUser);

  const [byType, icons] = useMemo(() => {
    const result = {};
    const icons = {};
    notifications.forEach((notification) => {
      icons[notification.type] = notification.icon;
      if (!result[notification.type]) {
        result[notification.type] = {};
      }
      if (!result[notification.type][notification.subtype]) {
        result[notification.type][notification.subtype] = [];
      }

      result[notification.type][notification.subtype].push(notification.id);
    });

    return [result, icons];
  }, [notifications]);

  const byId = useMemo(
    () =>
      notifications.reduce(
        (byId, notification) => ({ ...byId, [notification.id]: notification }),
        {},
      ),
    [notifications],
  );

  return (
    <StyledPanel shouldShow={isOpen} onClose={close} onBack={close} noScroll>
      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          padding: "0 1.5rem 0.5rem",
        }}
      >
        Configuración de emails &nbsp;<InlineBlock>y notificaciones</InlineBlock>
      </h3>
      <p> Configura los emails y notificaciones que recibes en tu teléfono. Recibirás los emails en tu dirección email: <u>{user.email}</u>&nbsp;
        <Link route="personalInformation">(modificarla)</Link>
      </p>
      <div style={{ marginLeft: "20px", marginBottom: "20px" }}>
        <Button small link route="contactConfiguration">
        Configuración de contacto
        </Button>
      </div>
      <PageFadeIn ready={ready}>
        <PushNotificationControls />
        {Object.keys(byType).map((type) => (
          <Accordion key={type} name={type} icon={icons[type] || "settings"}>
            <AccordionContent>
              {Object.keys(byType[type]).map((subtype) => (
                <StyledGroup key={subtype}>
                  <StyledGroupName>
                    <span>{subtype}</span>
                    <small>Teléfono</small>
                    <small>Email</small>
                  </StyledGroupName>
                  {byType[type][subtype].map((notificationId) => (
                    <NotificationSettingItem
                      key={notificationId}
                      notification={byId[notificationId]}
                      onChange={onChange}
                      disabled={disabled}
                      email={
                        activeNotifications[notificationId]?.email || false
                      }
                      push={activeNotifications[notificationId]?.push || false}
                    />
                  ))}
                </StyledGroup>
              ))}
            </AccordionContent>
          </Accordion>
        ))}
      </PageFadeIn>
    </StyledPanel>
  );
};
NotificationSettingPanel.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      label: PropTypes.string.isRequired,
      push: PropTypes.bool,
      email: PropTypes.bool,
      type: PropTypes.string,
      subtype: PropTypes.string,
      icon: PropTypes.string,
    }).isRequired,
  ),
  activeNotifications: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  ready: PropTypes.bool,
};
export default NotificationSettingPanel;
