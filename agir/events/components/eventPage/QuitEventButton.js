import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { ResponsiveLayout } from "@agir/front/genericComponents/grid";
import Button from "@agir/front/genericComponents/Button";
import Modal from "@agir/front/genericComponents/Modal";
import BottomSheet from "@agir/front/genericComponents/BottomSheet";
import Spacer from "@agir/front/genericComponents/Spacer";

import * as api from "@agir/events/common/api";
import { mutate } from "swr";

import logger from "@agir/lib/utils/logger";
const log = logger(__filename);

const StyledDialog = styled.div`
  max-width: 415px;
  margin: 40px auto;
  background-color: ${(props) => props.theme.white};
  border-radius: ${(props) => props.theme.borderRadius};
  padding: 1rem;

  @media (max-width: ${(props) => props.theme.collapse}px) {
    margin: 0;
    border-radius: 0;
    max-width: 100%;
  }

  main {
    h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1rem;
      font-weight: 600;
      line-height: 1.5;
    }

    p {
      margin: 0;
      padding: 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }
  }
  footer {
    display: flex;
    margin-top: 1.5rem;
    flex-flow: column nowrap;

    ${Button} {
      flex: 1 1 auto;
      transition: opacity 250ms ease-in-out;
    }

    ${Button} + ${Button} {
      margin: 0.5rem 0 0;
    }
  }
`;
const StyledWrapper = styled.div`
  font-size: 1rem;
  font-weight: 600;
  font-color: ${(props) => props.theme.black500};
  white-space: nowrap;
`;

const QuitEventButton = ({ eventPk, group, isOpen, setIsOpen }) => {
  const [isQuitting, setIsQuitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const groupPk = group?.id;

  const handleQuit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      let error = "";
      try {
        const response = await api.quitEvent(eventPk, groupPk);
        if (response.error) {
          error = response.error;
        }
      } catch (err) {
        error = err.message;
      }
      setIsLoading(false);
      setIsQuitting(false);
      setIsOpen && setIsOpen(false);
      if (error) {
        log.error(error);
        return;
      }
      if (!groupPk) {
        mutate(api.getEventEndpoint("getEvent", { eventPk }), (event) => ({
          ...event,
          rsvped: false,
        }));
        return;
      }
      mutate(api.getEventEndpoint("getEvent", { eventPk }));
    },
    [eventPk],
  );

  const openDialog = useCallback((e) => {
    if (e) {
      e.preventDefault();
    }
    setIsQuitting(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsQuitting(false);
    setIsOpen && setIsOpen(false);
  }, []);

  return (
    <StyledWrapper>
      {!setIsOpen && (
        <a href="" onClick={openDialog}>
          Cancelar
        </a>
      )}
      <ResponsiveLayout
        DesktopLayout={Modal}
        MobileLayout={BottomSheet}
        shouldShow={isOpen || isQuitting}
        isOpen={isOpen || isQuitting}
        onClose={closeDialog}
        onDismiss={closeDialog}
        shouldDismissOnClick
        noScroll
      >
        <StyledDialog>
          <main>
            <h4>
              {!groupPk ? (
                "Cancelar mi participación en la acción"
              ) : (
                <>{"Cancelar la participación del grupo en la acción"}</>
              )}
            </h4>
            <p>
              {!groupPk ? (
                <>
                  {"¿Estás segur@ de no querer participar en la acción?"}
                </>
              ) : (
                <>
                  <b>{group.name}</b> {" dejará de aparecer como participante en la acción."}
                  <Spacer size="1rem" />
                  {"El evento será retirado de la agenda del grupo "}
                </>
              )}
            </p>
          </main>
          <footer>
            <Button
              color="danger"
              onClick={handleQuit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              {!groupPk ? "Cancelar mi participación" : "Cancelar participación"}
            </Button>
            <Button color="default" onClick={closeDialog} disabled={isLoading}>
              {"Regresar"}
            </Button>
          </footer>
        </StyledDialog>
      </ResponsiveLayout>
    </StyledWrapper>
  );
};
QuitEventButton.propTypes = {
  eventPk: PropTypes.string.isRequired,
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
};
export default QuitEventButton;
