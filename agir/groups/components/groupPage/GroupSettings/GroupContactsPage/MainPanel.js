import _ from "gettext";
import PropTypes from "prop-types";
import React, { Fragment, useMemo } from "react";

import GroupMemberList from "@agir/groups/groupPage/GroupSettings/GroupMemberList";

import Button from "@agir/front/genericComponents/Button";
import ShareLink from "@agir/front/genericComponents/ShareLink";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

const GroupContactsMainPanel = (props) => {
  const { members, onClickMember } = props;

  const followers = useMemo(() => {
    if (!Array.isArray(members)) {
      return [];
    }
    return members.filter(
      (member) => member.membershipType <= MEMBERSHIP_TYPES.FOLLOWER,
    );
  }, [members]);

  const emails = useMemo(
    () =>
      followers
        .filter(
          ({ hasGroupNotifications, email }) => hasGroupNotifications && email,
        )
        .map(({ email }) => email)
        .join(", "),
    [followers],
  );

  return (
    <>
      <StyledTitle
        css={`
          display: flex;
          align-items: center;
        `}
      >
        {`${followers.length || ""} Seguidor${
          followers.length === 1 ? "" : "es"
        }`.trim()}
      </StyledTitle>
      <p
        css={`
          color: ${({ theme }) => theme.black700};
          margin: 0;
        `}
      >
        {"Son las personas que siguen tu grupo"}
      </p>
      {emails ? (
        <>
          <Spacer size="1rem" />
          <ShareLink
            label={_("Copier les e-mails")}
            color="primary"
            url={emails}
            $wrap
          />
        </>
      ) : null}
      {followers.length > 0 ? (
        <>
          <Spacer size="1.5rem" />
          <GroupMemberList
            searchable
            sortable
            members={followers}
            onClickMember={onClickMember}
          />
        </>
      ) : (
        <>
          <Spacer size="1.5rem" />
          <p>
            {"¡Todavía no tienes seguidores!"}
            <Spacer size="0.5rem" />
            {"Agrega seguidores para difundir las acciones y mensajes de tu grupo. "}
          </p>
          <Spacer size=".5rem" />
          <Button link icon="user-plus" route="createContact" color="secondary">
            {"Agregar seguidor manualmente"}
          </Button>
        </>
      )}
      <Spacer size="2rem" />
      <footer
        css={`
          color: ${({ theme }) => theme.black700};
          font-size: 0.875rem;
        `}
      >
        <p>
          Aquí se muestran l@s seguidores que agregaste manualmente o que dieron clic en ‘Seguir’ en la página del grupo.
        </p>
        <p>
        L@s seguidores recibirán correos y notificaciones de acciones realizadas por tu grupo.        </p>
        <p>L@s seguidores no cuentan como miembros activos del grupo.</p>
      </footer>
    </>
  );
};
GroupContactsMainPanel.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object),
  onClickMember: PropTypes.func,
};
export default GroupContactsMainPanel;
