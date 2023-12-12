import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { timeAgo } from "@agir/lib/utils/time";

import Card from "./GroupPageCard";

import AddToCalendarWidget from "@agir/front/genericComponents/AddToCalendarWidget";
import FeatherIcon from "@agir/front/genericComponents/FeatherIcon";

const StyledList = styled.ul`
  display: inline-flex;
  flex-flow: column wrap;
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  font-weight: 400;

  @media (max-width: ${(props) => props.theme.collapse}px) {
    display: block;
  }

  li {
    display: flex;
    min-width: 160px;
    align-items: baseline;
    min-height: 26px;

    span + span {
      padding-left: 0.5rem;
    }
  }
`;

const GroupFacts = (props) => {
  const { facts, name, routes, subtypes } = props;

  if (
    (!Array.isArray(subtypes) || subtypes.length === 0) &&
    (!facts || Object.values(facts).filter(Boolean).length === 0)
  ) {
    return null;
  }

  const {
    eventCount,
    activeMemberCount,
    isCertified,
    creationDate,
    lastActivityDate,
  } = facts;

  return (
    <Card title="Más información">
      <StyledList>
        {!!eventCount && (
          <li>
            <FeatherIcon name="calendar" small inline />
            <span>
              {eventCount} {_("événement")}{eventCount > 1 && "s"}
            </span>
          </li>
        )}
        {!!activeMemberCount && (
          <li>
            <FeatherIcon name="users" small inline />
            <span>
              {activeMemberCount}{" "}
              {activeMemberCount > 1 ? "Participantes activos" : "Participante activo"}
            </span>
          </li>
        )}
        {!!isCertified && (
          <li>
            <FeatherIcon name="check-circle" small inline />
            <span>{_("Groupe certifié")}</span>
          </li>
        )}
        {!!creationDate && (
          <li>
            <FeatherIcon name="clock" small inline />
            <span>Creado {timeAgo(creationDate)}</span>
          </li>
        )}
        {!!lastActivityDate && (
          <li>
            <FeatherIcon name="rss" small inline />
            <span>{_("Dernière activité&nbsp;:")} {timeAgo(lastActivityDate)}</span>
          </li>
        )}
        {Array.isArray(subtypes) && subtypes.length > 0 && (
          <li>
            <FeatherIcon name="folder" small inline />
            <span>{subtypes.join(", ")}</span>
          </li>
        )}
        {routes && (
          <li style={{ marginTop: "1rem" }}>
            <AddToCalendarWidget routes={routes} name={name}>
              <span>{_("Télécharger l'agenda du groupe")}</span>
            </AddToCalendarWidget>
          </li>
        )}
      </StyledList>
    </Card>
  );
};

GroupFacts.propTypes = {
  name: PropTypes.string.isRequired,
  facts: PropTypes.shape({
    eventCount: PropTypes.number,
    activeMemberCount: PropTypes.number,
    isCertified: PropTypes.bool,
    creationDate: PropTypes.string,
    lastActivityDate: PropTypes.string,
  }),
  subtypes: PropTypes.arrayOf(PropTypes.string),
  routes: PropTypes.object,
};
export default GroupFacts;
