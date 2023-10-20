import React from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

const ACTIONS = {
  createEvent: {
    key: "createEvent",
    route: "createEvent",
    label: ["Créer événement", "Créer un événement"],
    color: style.primary500,
    icon: (
      <span style={{ backgroundColor: style.primary500 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          stroke={style.white}
          strokeWidth={1.33}
          strokeLinecap="round"
          strokeLinejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14 8.99999V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H8.66667" />
          <path d="M10.6667 1.33334V4.00001" />
          <path d="M5.33331 1.33334V4.00001" />
          <path d="M2 6.66666H14" />
          <path d="M12.6667 11.3333V15.3333" />
          <path d="M14.6667 13.3333H10.6667" />
        </svg>
      </span>
    ),
  },
  materiel: {
    key: "materiel",
    route: "materiel",
    label: "Matériel",
    icon: "shopping-bag",
    color: style.secondary500,
    textColor: style.black1000,
  },
  createContact: {
    key: "createContact",
    route: "createContact",
    label: ["Ajouter contact", "Ajouter un contact"],
    icon: "user-plus",
    color: "#4D26B9",
  },
  actionTools: {
    key: "actionTools",
    route: "actionTools",
    label: "Voir tout",
    icon: (
      <RawFeatherIcon
        style={{
          backgroundColor: "transparent",
          border: `1px solid ${style.black200}`,
          color: style.black1000,
        }}
        name="arrow-right"
      />
    ),
  },
  help: {
    key: "help",
    route: "help",
    label: ["Aide", "Centre d'aide"],
    icon: "help-circle",
    color: style.black100,
    textColor: style.black1000,
  },
  cafePopulaireRequest: {
    key: "cafePopulaireRequest",
    route: "cafePopulaireRequest",
    label: ["Café populaire", "Organiser un café populaire"],
    icon: "coffee",
    color: "#00B171",
  },
};

const DEFAULT_ACTION_ORDER = [
  "createEvent",
  "materiel",
  "createContact",
  "help",
  "actionTools",
];

const GROUP_MANAGER_ACTION_ORDER = [
  "createEvent",
  "materiel",
  "cafePopulaireRequest",
  "createContact",
  "help",
  "actionTools",
];

export const getActionsForUser = (user) => {
  let actions = DEFAULT_ACTION_ORDER;

  if (!!user?.groups?.some((group) => group.isManager)) {
    actions = GROUP_MANAGER_ACTION_ORDER;
  }

  return actions
    .map((key) =>
      typeof ACTIONS[key] === "function" ? ACTIONS[key](user) : ACTIONS[key],
    )
    .filter(Boolean);
};

export default ACTIONS;
