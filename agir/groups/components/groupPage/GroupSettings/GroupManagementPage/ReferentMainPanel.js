import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import GroupMemberList from "@agir/groups/groupPage/GroupSettings/GroupMemberList";
import { RawFeatherIcon as FeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

export const ReferentMainPanel = (props) => {
  const { routes, addManager, addReferent, isLoading, members, onClickMember } =
    props;

  const referents = useMemo(
    () =>
      members.filter(
        (member) => member.membershipType === MEMBERSHIP_TYPES.REFERENT,
      ),
    [members],
  );

  const managers = useMemo(
    () =>
      members.filter(
        (member) => member.membershipType === MEMBERSHIP_TYPES.MANAGER,
      ),
    [members],
  );

  return (
    <>
      <StyledTitle>{_("Animateurs et animatrices")}</StyledTitle>
      <span style={{ color: style.black700 }}>
        {"L@s facilitadores organizan y dan vida al grupo."}
      </span>
      <Spacer size=".5rem" />
      <span style={{ color: style.black700 }}>
      Para poder certificar el grupo, debemos respetar &nbsp; 
        <a href="https://info.claudializate.com/principios/">
        la paridad de género
        </a>
        con dos facilitadores hombre y mujer.
      </span>
      <Spacer size="1.5rem" />
      <GroupMemberList
        members={referents}
        addButtonLabel={"Agregar co-facilitador"}
        onAdd={
          referents.length < 2 && members.length > 1 ? addReferent : undefined
        }
        isLoading={isLoading}
        onClickMember={onClickMember}
      />
      <Spacer size="1.5rem" />
      {routes?.animationChangeRequest && (
        <a
          href={routes.animationChangeRequest}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <FeatherIcon
            name="arrow-right"
            width="1rem"
            height="1rem"
            style={{ paddingTop: "3px" }}
          />
          <Spacer size="0.5rem" />
          {"Cambiar de facilitadores"}
        </a>
      )}
      {routes?.animationChangeRequest && routes?.referentResignmentRequest && (
        <Spacer size="0.5rem" />
      )}
      {routes?.referentResignmentRequest && (
        <a
          href={routes.referentResignmentRequest}
          style={{ display: "flex", alignItems: "flex-start" }}
        >
          <FeatherIcon
            name="arrow-right"
            width="1rem"
            height="1rem"
            style={{ paddingTop: "3px" }}
          />
          <Spacer size="0.5rem" />
          {"Ya no quiero ser facilitador(a) de mi grupo"}
        </a>
      )}
      {(routes?.animationChangeRequest ||
        routes?.referentResignmentRequest) && <Spacer size="1.5rem" />}
      <StyledTitle>Gestores</StyledTitle>
      <span style={{ color: style.black700 }}>
        {_("Ajoutez des gestionnaires pour vous assister sur Action Populaire.")}
      </span>
      <Spacer size="0.5rem" />
      <span style={{ color: style.black700 }}>
        {_("Ces derniers ont accès à la liste des membres, peuvent modifier les informations et créer des événements au nom du groupe.")}
      </span>
      <Spacer size="1.5rem" />
      <GroupMemberList
        members={managers}
        addButtonLabel="Agregar un gestor"
        onAdd={addManager}
        isLoading={isLoading}
        onClickMember={onClickMember}
      />
      {routes?.deleteGroup && (
        <>
          <hr />
          <a href={routes.deleteGroup} style={{ color: style.redNSP }}>
            {"Eliminar el grupo"}
          </a>
        </>
      )}
    </>
  );
};

ReferentMainPanel.propTypes = {
  routes: PropTypes.object,
  addManager: PropTypes.func,
  addReferent: PropTypes.func,
  isLoading: PropTypes.bool,
  onClickMember: PropTypes.func,
  members: PropTypes.arrayOf(PropTypes.object),
};

export default ReferentMainPanel;
