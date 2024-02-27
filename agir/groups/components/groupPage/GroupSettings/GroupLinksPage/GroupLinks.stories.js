import React from "react";

import GroupLinks from "./GroupLinks.js";

export default {
  component: GroupLinks,
  title: "GroupSettings/GroupLinks/LinkList",
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => <GroupLinks {...args} />;

export const Default = Template.bind({});
Default.args = {
  links: [
    {
      id: 1,
      label: "Présentation sur Youtube",
      url: "https://ap.fr",
    },
    { id: 2, label: "Groupe Facebook", url: "https://claudializate.com" },
    { id: 3, label: "Boucle Telegram", url: "https://claudializate.com" },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  links: [],
};
