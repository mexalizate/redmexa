/* eslint-disable react/display-name */
import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { mutate } from "swr";
import useSWRImmutable from "swr/immutable";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Spacer from "@agir/front/genericComponents/Spacer";

import { useIsDesktop } from "@agir/front/genericComponents/grid";
import { useToast } from "@agir/front/globalContext/hooks";

import { updateMessageLock, getGroupEndpoint } from "@agir/groups/utils/api";

const StyledButton = styled.button`
  background-color: transparent;
  padding: 0;
  margin: 0;
  border: none;
  cursor: pointer;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  ${RawFeatherIcon} {
    ${({ $isLocked }) => $isLocked && `color: ${style.redNSP};`}
  }
`;

const ButtonLockMessage = ({ message }) => {
  const sendToast = useToast();
  const isDesktop = useIsDesktop();
  const [isLockedLoading, setIsLockedLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const messagePk = message?.id;
  const {
    data: isLocked,
    mutate: mutateLocked,
    isLoading,
  } = useSWRImmutable(getGroupEndpoint("messageLocked", { messagePk }), {
    fallbackData: !!message?.isLocked,
  });

  const switchLockedMessage = useCallback(async () => {
    setIsLockedLoading(true);
    const { data: locked } = await updateMessageLock(messagePk, !isLocked);
    setIsLockedLoading(false);
    setIsModalOpen(false);

    mutateLocked(() => locked, false);
    mutate(`/api/groupes/messages/${messagePk}/`);
    sendToast(
      locked
        ? "La conversación fue pausada"
        : "Se reactivó la conversación",
      "INFO",
      { autoClose: true },
    );
  }, [isLocked, messagePk, mutateLocked, sendToast]);

  const loading = isLoading || isLockedLoading;

  return (
    <>
      {isDesktop ? (
        <Button
          small
          color="choose"
          icon={`${isLocked ? "un" : ""}lock`}
          disabled={loading}
          loading={loading}
          onClick={() => !loading && setIsModalOpen(true)}
        >
          {isLocked ? "Reactivar" : "Pausar"}
        </Button>
      ) : (
        <StyledButton
          $isLocked={isLocked}
          disabled={loading}
          onClick={() => !loading && setIsModalOpen(true)}
        >
          <RawFeatherIcon name={`${!isLocked ? "un" : ""}lock`} />
        </StyledButton>
      )}

      <ModalConfirmation
        title="¿Pausar esta conversación?"
        confirmationLabel={!isLocked ? "Pausar " : "reactivar"} 
        dismissLabel="Regresar"
        shouldShow={isModalOpen}
        onConfirm={switchLockedMessage}
        onClose={() => setIsModalOpen(false)}
        shouldDismissOnClick={false}
      >
        <Spacer size="1rem" />
        {!isLocked ? (
          <>
            Nadie más podrá escribir en ella.
            <Spacer size="0.5rem" />
            {_("Les gestionnaires du groupe pourront déverrouiller la conversation n'importe quand.")}
          </>
        ) : (
          "Más participantes podrán escribir en ella"
        )}
      </ModalConfirmation>
    </>
  );
};

ButtonLockMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isLocked: PropTypes.bool,
  }).isRequired,
};

export default ButtonLockMessage;
