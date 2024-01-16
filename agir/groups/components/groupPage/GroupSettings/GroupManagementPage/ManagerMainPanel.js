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
      Eres gestor(a) del grupo <strong>{group.name}</strong>.
      </span>

      <>
        <Spacer size="1.5rem" />
        <span>
          <strong>{_("Quel est mon rôle en tant que gestionnaire ?")}</strong>
          <Spacer size="0.5rem" />
          {_("Votre rôle et d’aider les animateur·ices à faire vivre votre groupe sur Action Populaire.")}
          <Spacer size="0.5rem" />
          {"Como gestor(a): tienes acceso a la lista de miembros, puedes modificar la información del grupo y puedes crear acciones a nombre del grupo"}
        </span>
      </>

      <>
        <Spacer size="1.5rem" />
        <span>
          <strong>{_("Je souhaite quitter la gestion de ce groupe")}</strong>
          <Spacer size="0.5rem" />
          {_("En tant que gestionnaire, vous ne pouvez pas modifier le rôle d’un membre, y compris le vôtre.")}
          <Spacer size="0.5rem" />
          {"Para dejar de ser gestor(a) del grupo, pide a l@s facilitadores que te eliminen de la lista de gestores."}
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
