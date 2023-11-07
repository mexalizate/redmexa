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
            <h3>{_("Quitter le groupe ")}{groupName}&nbsp;?</h3>
          ) : (
            <h3>{_("Ne plus suivre le groupe")} {groupName}&nbsp;?</h3>
          )}
        </header>
        <article>
          {isActiveMember ? (
            <p>
             {_(" Voulez-vous vraiment quitter le groupe&nbsp;? Vous ne recevrez plus aucune actualité de ce groupe.")}
              <Spacer size=".5rem" />
              {_("Vous pourrez rejoindre le groupe à nouveau à tout moment.")}
            </p>
          ) : (
            <p>
              {_("Vous ne recevrez plus les actualités de ce groupe.")}
              <Spacer size=".5rem" />
              {_("Vous pouvez suivre ce groupe à nouveau à tout moment.")}
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
            {isActiveMember ? "Quitter le groupe" : "Ne plus suivre"}
          </Button>
          <Button onClick={onClose} disabled={isLoading}>
            {_("Annuler")}
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
