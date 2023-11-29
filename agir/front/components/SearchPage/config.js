import _ from "gettext";
import React from "react";

export const TABS = {
  all: {
    id: "all",
    label: _("Tout"),
    searchPlaceholder: _("Rechercher sur Action Populaire"),
    mapRoute: "eventMap",
    hasFilters: false,
    hasEvents: true,
    hasGroups: true,
  },
  groups: {
    id: "groups",
    label: _("Groupes"),
    searchPlaceholder: _("Rechercher un groupe"),
    mapRoute: "groupMap",
    hasFilters: "groups",
    hasGroups: true,
    searchType: "groups",
  },
  events: {
    id: "events",
    label: "Acciones",
    searchPlaceholder: _("Rechercher un événement"),
    mapRoute: "eventMap",
    hasFilters: "events",
    hasEvents: true,
    searchType: "events",
  },
};

export const SORTERS = {
  DATE_ASC: "DATE_ASC",
  DATE_DESC: "DATE_DESC",
  ALPHA_ASC: "ALPHA_ASC",
  ALPHA_DESC: "ALPHA_DESC",
};

export const EventSort = [
  { label: <>Date &uarr;</>, value: SORTERS.DATE_ASC },
  { label: <>Date &darr;</>, value: SORTERS.DATE_DESC },
  { label: <>Alphabétique &uarr;</>, value: SORTERS.ALPHA_ASC },
  { label: <>Alphabétique &darr;</>, value: SORTERS.ALPHA_DESC },
];
export const EventCategory = [
  { label: _("Tous les événements"), value: 0 },
  { label: _("Passés"), value: "PAST" },
  { label: _("A venir"), value: "FUTURE" },
];
export const EventType = [
  { label: _("Tous les types"), value: 0 },
  { label: _("Réunion privée de groupe"), value: "G" },
  { label: _("Événement public"), value: "M" },
  { label: _("Action publique"), value: "A" },
  { label: _("Autre"), value: "O" },
];

export const GroupSort = [
  { label: <>Alphabétique &uarr;</>, value: SORTERS.ALPHA_ASC },
  { label: <>Alphabétique &darr;</>, value: SORTERS.ALPHA_DESC },
];
export const GroupType = [
  { label: _("Tous les groupes"), value: 0 },
  { label: _("Certifiés"), value: "CERTIFIED" },
  { label: _("Non certifiés"), value: "NOT_CERTIFIED" },
  { label: _("Groupe local"), value: "L" },
  { label: _("Groupe thématique"), value: "B" },
  { label: _("Groupe fonctionnel"), value: "F" },
];

export const OPTIONS = {
  EventSort,
  EventCategory,
  EventType,
  GroupSort,
  GroupType,
};
