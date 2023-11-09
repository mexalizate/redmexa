import _ from "gettext";
import React from "react";

import FilterTabs from "./FilterTabs";

export default {
  component: FilterTabs,
  title: "Generic/FilterTabs",
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => <FilterTabs {...args} />;

export const Default = Template.bind({});
Default.args = {
  tabs: [
    _("Tout"),
    _("Autres"),
    _("Le reste"),
    _("Encore plus"),
    _("Toujours plus"),
    _("C'est sans fin"),
  ],
  activeTab: 0,
};
