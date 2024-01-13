import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import BackButton from "@agir/front/genericComponents/ObjectManagement/BackButton";
import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";
import { getGenderedWord } from "@agir/lib/utils/display";

const StyledContent = styled.div`
  p {
    color: ${(props) => props.theme.black700};
    font-size: 1rem;
  }
`;
const StyledFooter = styled.footer`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  grid-gap: 1rem;

  ${Button} {
    margin: 0;
    ${"" /* TODO: remove after Button refactoring merge */}
    justify-content: center;
    border-radius: ${(props) => props.theme.borderRadius};
  }
`;

const ConfirmPanel = (props) => {
  const {
    onBack,
    onConfirm,
    selectedMember,
    selectedMembershipType,
    isLoading,
  } = props;

  if (!selectedMember) {
    return null;
  }

  if (
    selectedMember.membershipType === MEMBERSHIP_TYPES.MEMBER &&
    selectedMembershipType === MEMBERSHIP_TYPES.FOLLOWER
  ) {
    return (
      <>
        <BackButton disabled={isLoading} onClick={onBack} />
        <StyledTitle>
          {"¿Quitar a "} {selectedMember.displayName} {"como participante activ@ ? "}
        </StyledTitle>
        <Spacer size="0.5rem" />
        <StyledContent>
          <p>
            {"Esta persona dejará de aparecer como participante activ@ del grupo."}
          </p>
          <p>
            {getGenderedWord(selectedMember.gender, "Esta persona", "Ella", "Él")}{" "}
            {"ya no recibirá mensajes de Claudialízate destinados a miembros activ@s."}
          </p>
          <p>
            {selectedMember.displayName} {" permanecerá sólo como seguidor(a) de tu grupo."}
          </p>
        </StyledContent>
        <Spacer size="1rem" />
        <StyledFooter>
          <Button disabled={isLoading} color="danger" onClick={onConfirm}>
           {"Convertir en seguidor(a)"}
          </Button>
          <Button disabled={isLoading} onClick={onBack}>
            {"Cancelar"}
          </Button>
        </StyledFooter>
      </>
    );
  }

  if (
    selectedMember.membershipType === MEMBERSHIP_TYPES.FOLLOWER &&
    selectedMembershipType === MEMBERSHIP_TYPES.MEMBER
  ) {
    return (
      <>
        <BackButton disabled={isLoading} onClick={onBack} />
        <StyledTitle>
          ¿Convertir a  {selectedMember.displayName} {"en participante activ@ ?"}
        </StyledTitle>
        <Spacer size="0.5rem" />
        <StyledContent>
          <p>
            Podrá acceder a los mensajes del grupo destinados a participantes
            activos.
          </p>
        </StyledContent>
        <Spacer size="1rem" />
        <StyledFooter>
          <Button disabled={isLoading} color="primary" onClick={onConfirm}>
            {"Convertir en participante activ@"}
          </Button>
          <Button disabled={isLoading} onClick={onBack}>
            {"Cancelar"}
          </Button>
        </StyledFooter>
      </>
    );
  }

  if (
    selectedMember.membershipType === MEMBERSHIP_TYPES.MEMBER &&
    selectedMembershipType === MEMBERSHIP_TYPES.MANAGER
  ) {
    return (
      <>
        <BackButton disabled={isLoading} onClick={onBack} />
        <StyledTitle>
          {" Hacer gestor(a) a "} {selectedMember.displayName} {" ?"}
        </StyledTitle>
        <Spacer size="0.5rem" />
        <StyledContent>
          <p>
            {
              " Este participante podrá acceder a la lista de participantes del grupo, modificar la información del grupo y crear acciones a nombre del grupo."
            }
          </p>
        </StyledContent>
        <Spacer size="1rem" />
        <StyledFooter>
          <Button disabled={isLoading} color="primary" onClick={onConfirm}>
            {"Hacer gestor(a)"}
          </Button>
          <Button disabled={isLoading} onClick={onBack}>
            {"Cancelar"}
          </Button>
        </StyledFooter>
      </>
    );
  }

  if (
    selectedMember.membershipType === MEMBERSHIP_TYPES.MANAGER &&
    selectedMembershipType === MEMBERSHIP_TYPES.MEMBER
  ) {
    return (
      <>
        <BackButton disabled={isLoading} onClick={onBack} />
        <StyledTitle>
         {" ¿Quitar a "}{selectedMember.displayName}{_(" el permiso de gestión ?")}
        </StyledTitle>
        <Spacer size="0.5rem" />
        <StyledContent>
          <p>
           {" No tendrá más acceso a la lista de participantes del grupo, ni modificar la información del grupo, ni crear acciones a nombre del grupo"}
          </p>
          <p>
            {selectedMember.displayName} { "permanecerá entre los miembros activos de su grupo."}
          </p>
        </StyledContent>
        <Spacer size="1rem" />
        <StyledFooter>
          <Button disabled={isLoading} color="danger" onClick={onConfirm}>
            {"Quitar permiso de gestión"}
          </Button>
          <Button disabled={isLoading} onClick={onBack}>
            {"Cancelar"}
          </Button>
        </StyledFooter>
      </>
    );
  }

  return null;
};

ConfirmPanel.propTypes = {
  selectedMember: PropTypes.shape({
    displayName: PropTypes.string,
    gender: PropTypes.string,
    membershipType: PropTypes.oneOf([
      MEMBERSHIP_TYPES.MEMBER,
      MEMBERSHIP_TYPES.FOLLOWER,
      MEMBERSHIP_TYPES.MANAGER,
    ]),
  }),
  selectedMembershipType: PropTypes.oneOf([
    MEMBERSHIP_TYPES.MEMBER,
    MEMBERSHIP_TYPES.FOLLOWER,
    MEMBERSHIP_TYPES.MANAGER,
  ]),
  onBack: PropTypes.func,
  onConfirm: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ConfirmPanel;
