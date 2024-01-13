import _ from "gettext";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import ModalWrapper from "@agir/front/genericComponents/Modal";

const StyledModalBody = styled.div`
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

    strong {
      font-weight: 600;
    }
  }

  p + p {
    margin-top: 0.25rem;
  }
`;
const StyledModalFooter = styled.footer`
  display: flex;
  margin-top: 1.5rem;
  flex-flow: ${({ $inline }) => ($inline ? "row nowrap" : "column nowrap")};

  ${Button} {
    flex: 1 1 auto;
    transition: opacity 250ms ease-in-out;
  }

  ${Button} + ${Button} {
    margin: ${({ $inline }) => ($inline ? "0 0 0 .5rem" : ".5rem 0 0")};
  }
`;
const StyledModalContent = styled.div`
  max-width: 415px;
  margin: 40px auto;
  background-color: ${style.white};
  border-radius: ${style.borderRadius};
  padding: 1rem;

  @media (max-width: ${style.collapse}px) {
    margin: 0;
    border-radius: 0;
    max-width: 100%;
    min-height: 100vh;
  }
`;

const Steps = {
  delete: [
    ({ isLoading, onClose, onDelete }) => (
      <>
        <StyledModalBody>
          <h4>{_("Supprimer ce message ?")}</h4>
          <p>
            Este mensaje <strong>desaparecerá</strong> {_("de la discussion et plus personne ne pourra le voir.")}
          </p>
          <p>
            {_("Il n'est pas possible d'annuler cette opération. Tout abus sera sanctionné.")}
          </p>
        </StyledModalBody>
        <StyledModalFooter $inline>
          <Button color="default" onClick={onClose} disabled={isLoading}>
              Cancelar
          </Button>
          <Button
            color="danger"
            icon="trash-2"
            onClick={onDelete}
            disabled={isLoading}
          >
            Eliminar
          </Button>
        </StyledModalFooter>
      </>
    ),
    ({ isLoading, onClose, onReport }) => (
      <>
        <StyledModalBody>
          <h4>{"Se suprimió el mensaje"}</h4>
          {onReport ? (
            <p>
              {_("Ce compte enfreint les règles de Action Populaire ?")}
              <br />
              {_("Notre équipe sera notifiée de votre signalement.")}
            </p>
          ) : null}
        </StyledModalBody>
        <StyledModalFooter>
          {onReport ? (
            <Button
              color="danger"
              icon="flag"
              onClick={onReport}
              disabled={isLoading}
            >
             {_(" Signaler")}
            </Button>
          ) : null}
          <Button color="default" onClick={onClose} disabled={isLoading}>
            {onReport ? "No, gracias" : "Finalizar"}
          </Button>
        </StyledModalFooter>
      </>
    ),
    ({ onClose }) => (
      <>
        <StyledModalBody>
          <h4>{_("Notre équipe a reçu votre signalement")}</h4>
        </StyledModalBody>
        <StyledModalFooter>
          <Button color="default" onClick={onClose}>
            Terminer
          </Button>
        </StyledModalFooter>
      </>
    ),
  ],
  report: [
    ({ isLoading, onClose, onReport }) => (
      <>
        <StyledModalBody>
          <h4>{"¿Señalar este mensaje?"}</h4>
          <p>
            <strong>{"Nuestro equipo será notificado"}</strong> {"de tu señalamiento."}
          </p>
          <p>
            {_("Il n'est pas possible d'annuler cette opération. Tout abus sera sanctionné.")}
          </p>
        </StyledModalBody>
        <StyledModalFooter $inline>
          <Button color="default" onClick={onClose} disabled={isLoading}>
              Cancelar
          </Button>
          <Button
            color="danger"
            icon="flag"
            onClick={onReport}
            disabled={isLoading}
          >
            {_("Signaler")}
          </Button>
        </StyledModalFooter>
      </>
    ),
    ({ isLoading, onClose, onDelete }) => (
      <>
        <StyledModalBody>
          <h4>{_("Notre équipe a reçu votre signalement")}</h4>
          <p>
            {"Si constatamos que este mensaje viola las reglas de Claudialízate, tomaremos las medidas necesarias."}
          </p>
          {onDelete ? (
            <p>
              <strong>
                {"Mientras tanto, como administrador del grupo puedes eliminar el mensaje."}
              </strong>{" "}
              {" que desaparecerá y ya nadie podrá verlo."}
            </p>
          ) : null}
        </StyledModalBody>
        <StyledModalFooter>
          {onDelete ? (
            <Button
              color="danger"
              icon="trash-2"
              onClick={onDelete}
              disabled={isLoading}
            >
             Eliminar
            </Button>
          ) : null}
          <Button color="default" onClick={onClose} disabled={isLoading}>
            {onDelete ? "no gracias" : "Cerrar"}
          </Button>
        </StyledModalFooter>
      </>
    ),
    ({ onClose }) => (
      <>
        <StyledModalBody>
          <h4>{"Se suprimió el mensaje"}</h4>
        </StyledModalBody>
        <StyledModalFooter>
          <Button color="default" onClick={onClose}>
            {_("Terminer")}
          </Button>
        </StyledModalFooter>
      </>
    ),
  ],
};

const MessageActionModal = (props) => {
  const { action, shouldShow, onClose, onDelete, onReport, isLoading, error } =
    props;
  const [step, setStep] = useState(0);
  const Step = action && Steps[action] ? Steps[action][step] : null;

  useEffect(() => {
    if (!isLoading && !error) {
      setStep((state) => state + 1);
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (shouldShow) {
      setStep(0);
    }
  }, [shouldShow]);

  useEffect(() => {
    if (shouldShow && !Step) {
      onClose();
    }
  }, [shouldShow, Step, onClose]);

  return (
    <ModalWrapper
      shouldShow={shouldShow && !!Step}
      onClose={isLoading ? undefined : onClose}
      noScroll
    >
      <StyledModalContent $isLoading={isLoading}>
        {Step ? (
          <Step
            onClose={onClose}
            onDelete={onDelete}
            onReport={onReport}
            isLoading={isLoading}
          />
        ) : null}
      </StyledModalContent>
    </ModalWrapper>
  );
};
MessageActionModal.propTypes = {
  action: PropTypes.oneOf(Object.keys(Steps)),
  error: PropTypes.string,
  isLoading: PropTypes.bool,
  shouldShow: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
};
export default MessageActionModal;
