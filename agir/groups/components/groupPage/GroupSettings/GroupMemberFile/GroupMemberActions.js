import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

const StyledWrapper = styled.div`
  padding: 0;
  margin: 0;
  list-style-position: inside;

  h4 {
    font-size: 1rem;
    margin: 0;
    line-height: 1.5;
    font-weight: 600;
  }

  p {
    margin: 0;

    ${Button} {
      margin: 0.5rem 0.5rem 0 0;
    }
  }

  p + p {
    color: ${(props) => props.theme.black700};
    font-size: 0.813rem;
    margin-top: 0.5rem;
  }
`;

const GroupMemberActions = (props) => {
  const {
    isReferent,
    isGroupFull,
    onChangeMembershipType,
    currentMembershipType,
  } = props;

  if (!onChangeMembershipType) {
    return null;
  }

  if (currentMembershipType == MEMBERSHIP_TYPES.FOLLOWER) {
    const handleClick = () => {
      onChangeMembershipType(MEMBERSHIP_TYPES.MEMBER);
    };

    return (
      <StyledWrapper>
        <h4>{"Modificar accesos"}</h4>
        <p>
          <Button disabled={isGroupFull} onClick={handleClick}>
            {"Convertir en participante activ@"}
          </Button>
        </p>
        {isGroupFull && (
          <p>
            <strong>{_("No se puede convertir este contacto en miembro activo")}</strong>{_(" car le groupe a atteint la limite de membres actifs. Passez des membres actifs en contact ou divisez votre groupe pour renforcer le réseau d'action")}
          </p>
        )}
      </StyledWrapper>
    );
  }

  if (currentMembershipType == MEMBERSHIP_TYPES.MEMBER) {
    const setAsFollower = () => {
      onChangeMembershipType(MEMBERSHIP_TYPES.FOLLOWER);
    };
    const setAsManager = () => {
      onChangeMembershipType(MEMBERSHIP_TYPES.MANAGER);
    };
    return (
      <StyledWrapper>
        <h4>{"Modificar accesos"}</h4>
        <p>
          <Button onClick={setAsFollower}>{"Convertir en seguidor(a)"}</Button>
          {isReferent && (
            <Button onClick={setAsManager}>{"Hacerl@ gestor(a)"}</Button>
          )}
        </p>
      </StyledWrapper>
    );
  }

  if (isReferent && currentMembershipType == MEMBERSHIP_TYPES.MANAGER) {
    const handleClick = () => {
      onChangeMembershipType(MEMBERSHIP_TYPES.MEMBER);
    };

    return (
      <StyledWrapper>
        <h4>{"Modificar accesos"}</h4>
        <p>
          <Button onClick={handleClick}>
            {"Quitar el permiso de gestión"}
          </Button>
        </p>
      </StyledWrapper>
    );
  }

  return null;
};

GroupMemberActions.propTypes = {
  currentMembershipType: PropTypes.oneOf(Object.values(MEMBERSHIP_TYPES)),
  onChangeMembershipType: PropTypes.func,
  isReferent: PropTypes.bool,
  isGroupFull: PropTypes.bool,
};

export default GroupMemberActions;
