import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import GroupMemberList from "@agir/groups/groupPage/GroupSettings/GroupMemberList";

import Link from "@agir/front/app/Link";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import ShareLink from "@agir/front/genericComponents/ShareLink";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { MEMBERSHIP_TYPES } from "@agir/groups/utils/group";

const FullGroupWarning = () => (
  <div
    css={`
      font-size: 0.875rem;
      color: ${style.black700};
      background-color: ${style.black100};
      border-radius: 0.5rem;
      padding: 1rem;
      margin: 1rem 0;

      strong {
        font-weight: 600;
      }
    `}
  >
    <strong>
      {_("Action requise&nbsp;: votre groupe ne respecte plus la charte des groupes d'action.")}
    </strong>{" "}
   {_(" Il est maintenant impossible que de nouvelles personnes la rejoignent. Divisez votre groupe en groupes plus petits maintenant pour renforcer le réseau d’action.")}
  </div>
);

const GroupMemberMainPanel = (props) => {
  const { members, group, onClickMember, routes } = props;

  const activeMembers = useMemo(() => {
    if (!Array.isArray(members)) {
      return [];
    }
    return members.filter(
      (member) => member.membershipType >= MEMBERSHIP_TYPES.MEMBER,
    );
  }, [members]);

  const emails = useMemo(
    () =>
      activeMembers
        .filter(
          ({ hasGroupNotifications, email }) => email && hasGroupNotifications,
        )
        .map(({ email }) => email)
        .join(", "),
    [activeMembers],
  );

  return (
    <>
      <StyledTitle>
        {activeMembers.length}&nbsp;
        {activeMembers.length > 1 ? "Participantes activ@s" : "Participante activ@"}
      </StyledTitle>
      <p style={{ color: style.black700, margin: 0 }}>
        {"Los participantes activos, es decir, que se unieron a tu grupo."}
      </p>
      <Spacer size="1rem" />
      <ShareLink
        label={"Copiar sus emails"}
        color="primary"
        url={emails}
        $wrap
      />
      <Spacer size=".75rem" />
      {group?.isFull && <FullGroupWarning />}
      <Spacer size=".75rem" />
      <GroupMemberList
        sortable
        searchable
        members={activeMembers}
        onClickMember={onClickMember}
      />
      <Spacer size="2.5rem" />
      <Link
        href={routes?.downloadMemberList}
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <RawFeatherIcon
          name="download"
          width="1rem"
          height="1rem"
          style={{ paddingTop: "3px" }}
        />
        <Spacer size="0.5rem" />
        {"Bajar la lista de participantes y seguidores en formato CSV"}
      </Link>
      <Spacer size="0.5rem" />
      <Link
        href={routes?.membershipTransfer}
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <RawFeatherIcon
          name="arrow-right"
          width="1rem"
          height="1rem"
          style={{ paddingTop: "3px" }}
        />
        <Spacer size="0.5rem" />
        {"Transferir algunos participantes a otro grupo"}
      </Link>
    </>
  );
};
GroupMemberMainPanel.propTypes = {
  routes: PropTypes.object,
  members: PropTypes.arrayOf(PropTypes.object),
  group: PropTypes.object,
  onClickMember: PropTypes.func,
};
export default GroupMemberMainPanel;
