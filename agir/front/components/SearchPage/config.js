import _ from "gettext";
import React from "react";

export const TABS = {
  all: {
    id: "all",
    label: _("Tout"),
    searchPlaceholder: "Buscar en Claudialízate",
    mapRoute: "eventMap",
    hasFilters: false,
    hasEvents: true,
    hasGroups: true,
  },
  groups: {
    id: "groups",
    label: "Grupos",
    searchPlaceholder: "Buscar un grupo",
    mapRoute: "groupMap",
    hasFilters: "groups",
    hasGroups: true,
    searchType: "groups",
  },
  events: {
    id: "events",
    label: "Acciones",
    searchPlaceholder: "Buscar una acción",
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
  { label: <>Fecha &uarr;</>, value: SORTERS.DATE_ASC },
  { label: <>Fecha &darr;</>, value: SORTERS.DATE_DESC },
  { label: <>Orden alfabético &uarr;</>, value: SORTERS.ALPHA_ASC },
  { label: <>Orden alfabético &darr;</>, value: SORTERS.ALPHA_DESC },
];
export const EventCategory = [
  { label: "Todas las acciones", value: 0 },
  { label: _("Passés"), value: "PAST" },
  { label: _("A venir"), value: "FUTURE" },
];
export const EventType = [
  { label: "Todos los tipos", value: 0 },
  { label: "Reunión de grupo", value: "G" },
  { label: "Actividad pública", value: "M" },
  { label: "Claudiactivación", value: "A" },
  { label: "Otra acción", value: "O" },
];

export const GroupSort = [
  { label: <>Orden alfabético &uarr;</>, value: SORTERS.ALPHA_ASC },
  { label: <>Orden alfabético &darr;</>, value: SORTERS.ALPHA_DESC },
];
export const GroupType = [
  { label: "Todos los grupos", value: 0 },
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
