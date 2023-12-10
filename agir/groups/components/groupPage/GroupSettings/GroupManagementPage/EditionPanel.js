import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import GroupMemberList from "@agir/groups/groupPage/GroupSettings/GroupMemberList";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import SelectField from "@agir/front/formComponents/SelectField";
import Button from "@agir/front/genericComponents/Button";
import BackButton from "@agir/front/genericComponents/ObjectManagement/BackButton";
import StaticToast from "@agir/front/genericComponents/StaticToast";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

const StyledList = styled.div`
  display: flex;
  align-items: center;
  div {
    display: inline-flex;
    width: 0.5rem;
    height: 0.5rem;
    background-color: ${style.primary500};
    border-radius: 2rem;
    margin-right: 0.5rem;
  }
`;

const EditionPanel = (props) => {
  const {
    members,
    onBack,
    onSubmit,
    selectMember,
    selectedMember,
    selectedMembershipType,
    errors,
    isLoading,
  } = props;

  const candidates = useMemo(
    () =>
      members && selectedMembershipType
        ? members.filter((m) =>
            selectedMembershipType === MEMBERSHIP_TYPES.REFERENT
              ? [MEMBERSHIP_TYPES.MEMBER, MEMBERSHIP_TYPES.MANAGER].includes(
                  m.membershipType,
                )
              : m.membershipType === MEMBERSHIP_TYPES.MEMBER,
          )
        : [],
    [members, selectedMembershipType],
  );

  return (
    <>
      <BackButton onClick={onBack} />
      <StyledTitle>
        {selectedMembershipType === MEMBERSHIP_TYPES.REFERENT
          ? "Ajouter un binôme animateur"
          : "Agregar un gestor"}
      </StyledTitle>
      <Spacer size="1rem" />
      {members.length === 1 ? (
        <span style={{ color: style.black700 }}>
         {"Debes tener más participantes para poder darles el rol de gestores."}
        </span>
      ) : candidates.length === 0 ? (
        <span style={{ color: style.black700 }}>
          {_("Tous vos membres sont déjà tous gestionnaires ou animateur·ices.")}
        </span>
      ) : (
        <>
          <Spacer size="1rem" />
          <SelectField
            label={_("Choisir un membre")}
            placeholder={_("Sélection")}
            options={candidates.map((candidate) => ({
              label: `${candidate.displayName} (${candidate.email})`,
              value: candidate,
            }))}
            onChange={selectMember}
          />
        </>
      )}
      {selectedMember && (
        <>
          <Spacer size="1rem" />
          <GroupMemberList members={[selectedMember]} />
          <Spacer size="1rem" />
          <div>
            {_("Ce membre pourra :")}
            <Spacer size="0.5rem" />
            {selectedMembershipType === MEMBERSHIP_TYPES.REFERENT && (
              <StyledList>
                <div />
                {_("Modifier les permissions des gestionnaires")}
              </StyledList>
            )}
            <StyledList>
              <div />
              {_("Voir la liste des membres")}
            </StyledList>
            <StyledList>
              <div />
              {_("Modifier les informations du groupe")}
            </StyledList>
            <StyledList>
              <div />
              {_("Créer des événements au nom du groupe")}
            </StyledList>
          </div>
          {errors?.membershipType && (
            <StaticToast>{_("Erreur")} : {errors.membershipType}</StaticToast>
          )}
          <Spacer size="1rem" />
          <Button color="secondary" onClick={onSubmit} disabled={isLoading}>
            {_("Confirmer")}
          </Button>
        </>
      )}
    </>
  );
};

EditionPanel.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
  onBack: PropTypes.func,
  selectMember: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedMember: PropTypes.object,
  selectedMembershipType: PropTypes.oneOf([
    MEMBERSHIP_TYPES.REFERENT,
    MEMBERSHIP_TYPES.MANAGER,
    MEMBERSHIP_TYPES.MEMBER,
    MEMBERSHIP_TYPES.FOLLOWER,
  ]),
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default EditionPanel;
