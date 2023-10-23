import _ from "gettext";
import React from "react";

import FileCard from "./FileCard";

export default {
  component: FileCard,
  title: "Generic/FileCard",
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => <FileCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: _("Fichier super-utile"),
  text: _("Format PDF - 250 Kio"),
  icon: "tv",
  downloadLabel: _("Télécharger le fichier"),
  downloadIcon: "Download",
  route: "attestationAssurance",
};
