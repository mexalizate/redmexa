import _ from "gettext";
import React from "react";

import RequiredDocumentModal from "./RequiredDocumentModal";

export default {
  component: RequiredDocumentModal,
  title: "Event Required Documents/RequiredDocumentModal",
};

const Template = (args) => <RequiredDocumentModal {...args} />;

export const Default = Template.bind({});
Default.args = {
  type: "ABC",
  shouldShow: true,
  isLoading: false,
  errors: null,
};

export const WithErrors = Template.bind({});
WithErrors.args = {
  ...Default.args,
  errors: {
    file: _("Ce quoi ce fichier ?"),
    name: "Nope !",
    description: _("Cette description ne va pas du tout!"),
  },
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  isLoading: true,
};
