import React from "react";

import I18N from "@agir/lib/i18n";

import LocationItem from "./LocationItem";

export default {
  component: LocationItem,
  title: "LocationField/LocationItem",
  argTypes: {
    onChange: { action: "onChange" },
  },
  parameters: {
    layout: "padded",
  },
};

const Template = (args) => {
  return <LocationItem {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: "location",
  locationData: {
    name: "Café du Croissant",
    address1: "142 rue de Montmartre",
    address2: "au fond à gauche",
    city: "Paris",
    zip: "75002",
    country: I18N.country,
  },
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Default.args,
  disabled: true,
};
