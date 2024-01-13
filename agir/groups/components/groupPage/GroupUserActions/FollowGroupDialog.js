import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";
import Spacer from "@agir/front/genericComponents/Spacer";
import StyledDialog from "./StyledDialog";

const ConnectedUserActions = (props) => {
  const { shouldShow, onClose, groupName } = props;

  return (
    <ModalConfirmation shouldShow={shouldShow} onClose={onClose}>
      <StyledDialog>
        <header>
          <h3>{_("Vous suivez")} {groupName} ! 👋</h3>
        </header>
        <article>
         {_(" Vous recevrez l’actualité de ce groupe.")}
          <Spacer size="0.5rem" />
         {"También puedes unirte como miembro y recibir mensajes destinados a participantes del grupo."}
        </article>
      </StyledDialog>
    </ModalConfirmation>
  );
};

ConnectedUserActions.propTypes = {
  shouldShow: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  groupName: PropTypes.string.isRequired,
};

export default ConnectedUserActions;
