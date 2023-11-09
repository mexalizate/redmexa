import _ from "gettext";
import React from "react";

import { ReportFormCard } from "./ReportFormCard";

export default {
  component: ReportFormCard,
  title: "Events/EventPage/ReportFormCard",
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => <ReportFormCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: _("Comptabiliser nos efforts !"),
  description:
    _("Après avoir terminé votre porte-à-porte indiquez à combien de portes vous avez toqué et de contacts avez-vous obtenus"),
  url: "#formURL",
  submitted: false,
};

export const Submitted = Template.bind({});
Submitted.args = {
  ...Default.args,
  submitted: true,
};
