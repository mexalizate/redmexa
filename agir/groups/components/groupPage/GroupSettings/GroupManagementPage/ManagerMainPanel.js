import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

export const ManagerMainPanel = (props) => {
  const { group } = props;

  return (
    <>
      <StyledTitle>{_("Gestion et animation")}</StyledTitle>
      <span>
        {_("Vous êtes gestionnaire du groupe")} <strong>{group.name}</strong>.
      </span>

      <>
        <Spacer size="1.5rem" />
        <span>
          <strong>{_("Quel est mon rôle en tant que gestionnaire ?")}</strong>
          <Spacer size="0.5rem" />
          {_("Votre rôle et d’aider les animateur·ices à faire vivre votre groupe sur Action Populaire.")}
          <Spacer size="0.5rem" />
          {_("En tant que gestionnaire, vous avez accès à la liste des membres. Vous pouvez modifier les informations du groupe, et créer des événements du du groupe.")}
        </span>
      </>

      <>
        <Spacer size="1.5rem" />
        <span>
          <strong>{_("Je souhaite quitter la gestion de ce groupe")}</strong>
          <Spacer size="0.5rem" />
          {_("En tant que gestionnaire, vous ne pouvez pas modifier le rôle d’un membre, y compris le vôtre.")}
          <Spacer size="0.5rem" />
          {_("Pour quitter la gestion de ce groupe, demandez à un·e des animateur·ices de vous retirer de la liste des gestionnaires.")}
        </span>
      </>
    </>
  );
};

ManagerMainPanel.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
};

export default ManagerMainPanel;
