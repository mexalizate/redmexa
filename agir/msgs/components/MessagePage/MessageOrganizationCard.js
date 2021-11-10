import React from "react";
import PropTypes from "prop-types";

import {
  StyledHeader,
  StyledSubject,
  StyledMessage,
  StyledWrapper,
} from "@agir/front/genericComponents/MessageCard";
import CommentField from "@agir/front/formComponents/CommentField";
import Avatar from "@agir/front/genericComponents/Avatar";
import Link from "@agir/front/app/Link";
import style from "@agir/front/genericComponents/_variables.scss";

const MessageOrganizationCard = (props) => {
  const { isLoading, user, group } = props;

  const handleCreateOrganizationMessage = (message) => {
    console.log("message create orga : ", message);
  };

  return (
    <StyledWrapper>
      <StyledMessage>
        <StyledSubject style={{ textAlign: "center" }}>
          <Avatar {...group.referents[0]} />
          {group.referents.length > 1 && <Avatar {...group.referents[1]} />}
          <br />
          Entrez en contact avec {group.referents[0].displayName}
          {group.referents.length > 1 && (
            <>&nbsp;et {group.referents[1].displayName}</>
          )}
          &nbsp;!
        </StyledSubject>
        <StyledHeader style={{ justifyContent: "center", marginTop: 0 }}>
          Animateur·ices du groupe&nbsp;
          <Link route="fullGroup" routeParams={{ groupPk: group.id }}>
            {group.name}
          </Link>
        </StyledHeader>

        <div
          style={{
            padding: "20px",
            backgroundColor: style.primary50,
            marginBottom: "1rem",
            borderRadius: style.borderRadius,
          }}
        >
          Vous souhaitez rejoindre ce groupe ou bien recevoir des informations ?
          Entamez votre discussion ici ! Vous recevrez leur réponse{" "}
          <strong>par notification et sur votre e-mail</strong> (
          <span style={{ color: style.primary500 }}>{user.email}</span>)
        </div>

        <CommentField
          isLoading={isLoading}
          user={user}
          placeholder="Ecrire un message"
          onSend={handleCreateOrganizationMessage}
        />
      </StyledMessage>
    </StyledWrapper>
  );
};

MessageOrganizationCard.propTypes = {
  isLoading: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    displayName: PropTypes.string,
  }),
  group: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    referents: PropTypes.array,
  }),
};

export default MessageOrganizationCard;
