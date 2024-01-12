import React from "react";

import EmptyContent, {
  MemberEmptyEvents,
  ManagerEmptyEvents,
  EmptyReports,
} from "./EmptyContent";

export default {
  component: EmptyContent,
  title: "Group/EmptyContent",
};

const Template = (args) => {
  return <EmptyContent {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  icon: "calendar",
  children: "Este grupo todavía no crea ninguna acción.",
};

export const EventsForMember = () => <MemberEmptyEvents />;
export const EventsForManager = () => <ManagerEmptyEvents />;
export const Reports = () => <EmptyReports />;
