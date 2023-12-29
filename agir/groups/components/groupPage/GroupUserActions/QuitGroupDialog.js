import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";
import Spacer from "@agir/front/genericComponents/Spacer";
import StyledDialog from "./StyledDialog";

const QuitGroupDialog = (props) => {
  const { shouldShow, isLoading, isActiveMember, groupName, onQuit, onClose } =
    props;

  return (
    <ModalConfirmation
      shouldShow={shouldShow}
      onClose={!isLoading ? onClose : undefined}
      shouldDismissOnClick={false}
    >
      <StyledDialog>
        <header>
          {isActiveMember ? (
            <h3>Salir del grupo {groupName}&nbsp;?</h3>
          ) : (
            <h3>Dejar de seguir el grupo {groupName}&nbsp;?</h3>
          )}
        </header>
        <article>
          {isActiveMember ? (
            <p>
              ¿Estás segur@ de salir? Ya no recibirás noticias del grupo
              <Spacer size=".5rem" />
              Puedes volver a seguir este grupo en cualquier momento
            </p>
          ) : (
            <p>
              Ya no recibirás noticias de este grupo.
              <Spacer size=".5rem" />
              Puedes volver a seguir este grupo en cualquier momento.
            </p>
          )}
        </article>
        <footer>
          <Button
            color="danger"
            onClick={onQuit}
            disabled={isLoading}
            loading={isLoading}
          >
            {isActiveMember ? "Salir del grupo" : "No seguir más"}
          </Button>
          <Button onClick={onClose} disabled={isLoading}>
            Regresar
          </Button>
        </footer>
      </StyledDialog>
    </ModalConfirmation>
  );
};

QuitGroupDialog.propTypes = {
  shouldShow: PropTypes.bool,
  isLoading: PropTypes.bool,
  isActiveMember: PropTypes.bool,
  groupName: PropTypes.string.isRequired,
  onQuit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default QuitGroupDialog;
