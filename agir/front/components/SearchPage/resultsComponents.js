import PropTypes from "prop-types";
import React from "react";

import { Interval } from "luxon";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";
import { ResponsiveLayout } from "@agir/front/genericComponents/grid";
import EventCard from "@agir/front/genericComponents/EventCard";
import GroupSuggestionCard from "@agir/groups/groupPage/GroupSuggestionCard";
import { GroupSuggestionCarousel } from "@agir/groups/groupPage/GroupSuggestions";

const StyledGroupsDesktop = styled.div`
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;

  > div {
    width: 100%;
    max-width: 310px;
    margin-bottom: 10px;
  }
`;

const GroupsDesktop = ({ groups }) => (
  <StyledGroupsDesktop>
    {groups.map((group) => (
      <div key={group.id}>
        <GroupSuggestionCard {...group} />
      </div>
    ))}
  </StyledGroupsDesktop>
);

export const GroupList = ({ groups }) => (
  <div>
    <ResponsiveLayout
      MobileLayout={GroupSuggestionCarousel}
      DesktopLayout={GroupsDesktop}
      groups={groups}
    />
  </div>
);
GroupList.PropTypes = {
  groups: PropTypes.array,
};

export const EventList = ({ events }) => (
  <>
    {events.map((event) => {
      return (
        <>
          <EventCard
            key={event.id}
            {...event}
            schedule={Interval.fromISO(`${event.startTime}/${event.endTime}`)}
          />
          <Spacer size="1rem" />
        </>
      );
    })}
  </>
);
EventList.PropTypes = {
  events: PropTypes.array,
};

export const ListTitle = ({ name, list, isShowMore, onShowMore }) => {
  if (!list.length) {
    return null;
  }

  return (
    <h2>
      <div>
        {name} <span>{list.length}</span>
      </div>
      {isShowMore && (
        <Button color="primary" small onClick={onShowMore}>
          Voir tout
        </Button>
      )}
    </h2>
  );
};
ListTitle.PropTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
  onShowMore: PropTypes.func,
  isShowMore: PropTypes.bool,
};