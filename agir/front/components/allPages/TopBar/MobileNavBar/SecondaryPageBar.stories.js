import React from "react";

import style from "@agir/front/genericComponents/_variables.scss";
import user from "@agir/front/mockData/user";

import SecondaryPageBar from "./SecondaryPageBar";

export default {
  component: SecondaryPageBar,
  title: "TopBar/Mobile/Secondary page",
  parameters: {
    backgrounds: { default: "black50" },
  },
};

const Template = (args, { globals }) => {
  return (
    <div
      style={{
        width: "100%",
        margin: "auto",
        maxWidth: 992,
        height: 54,
        boxShadow: style.elaborateShadow,
      }}
    >
      <SecondaryPageBar
        user={globals.auth === "authenticated" && user}
        {...args}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  title: "Page title !",
  backLink: {
    to: "/",
    label: "Home",
  },
};

export const WithSettingsLink = Template.bind({});
WithSettingsLink.args = {
  title: "Page title !",
  backLink: {
    to: "/",
    label: "Home",
  },
  settingsLink: {
    to: "/",
    label: "Settings",
  },
};
