import _ from "gettext";
import React from "react";

import ButtonAddList from "./ButtonAddList.js";

export default {
  component: ButtonAddList,
  title: "GroupSettings/ButtonAddList",
};

const Template = (args) => <ButtonAddList {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: _("Ajouter votre binôme"),
  onClick: () => {},
};

export const AddOrganizer = Template.bind({});

AddOrganizer.args = {
  label: _("Ajouter un·e gestionnaire"),
  onClick: () => {},
};
