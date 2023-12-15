import _ from "gettext";
import { DateTime } from "luxon";

import validate from "@agir/lib/utils/validate";

import { COUNTRIES } from "@agir/front/formComponents/CountryField";

let startDate = DateTime.now()
  .setZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  .plus({ days: 1 });
let endDate = startDate.plus({ hours: 1 });

export const DEFAULT_FORM_DATA = {
  name: "",
  organizerGroup: null,
  startTime: startDate.toISO(),
  endTime: endDate.toISO(),
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  subtype: null,
  description: "",
  image: null,
  onlineUrl: "",
  location: {
    name: "",
    address1: "",
    address2: "",
    city: "",
    zip: "",
    country: COUNTRIES[0].value,
    isDefault: true,
  },
  contact: {
    name: "",
    email: "",
    phone: "",
    hidePhone: false,
    isDefault: true,
  },
};

export const FORM_FIELD_CONSTRAINTS = {
  name: {
    presence: {
      allowEmpty: false,
      message: _("Donnez un titre à votre événement"),
    },
    length: {
      minimum: 3,
      maximum: 100,
      tooShort:
        _("Donnez un titre à votre événement d’au moins %{count} caractères"),
      tooLong:
        _("Le titre de votre événement ne peut pas dépasser les %{count} caractères"),
    },
  },
  organizerGroup: {
    presence: {
      allowEmpty: false,
      message: _("Indiquez l'organisateur de votre événement"),
    },
  },
  startTime: {
    presence: {
      allowEmpty: false,
      message: _("Indiquez une date et heure de début"),
    },
    datetime: {
      message:_("Indiquez une date et heure valides"),
    },
  },
  endTime: {
    presence: {
      allowEmpty: false,
      message: _("Indiquez une date et heure de fin"),
    },
    datetime: {
      message:_("Indiquez une date et heure valides"),
    },
  },
  timezone: {
    presence: {
      allowEmpty: false,
      message: _("Indiquez un fuseau horaire"),
    },
  },
  subtype: {
    presence: {
      allowEmpty: false,
      message: _("Choisissez un type parmi les options proposées"),
    },
  },
  onlineUrl: {
    presence: {
      allowEmpty: true,
    },
    optionalUrl: {
      message: _("Indiquez une URL valide"),
    },
  },
  "location.name": {
    presence: {
      allowEmpty: false,
      message: _("Donnez un nom au lieu où se déroule l’événement"),
    },
  },
  "location.address1": {
    presence: {
      allowEmpty: false,
      message: _("Indiquez l’adresse du lieu où se déroule l’évément"),
    },
  },
  "location.city": {
    presence: {
      allowEmpty: false,
      message: _("Indiquez la commune où se déroule l’événement"),
    },
  },
  "location.zip": {
    presence: {
      allowEmpty: false,
      message: "Indica C.P./ZIP",
    },
  },
  "location.country": {
    presence: {
      allowEmpty: false,
      message: _("Indiquez le nom du pays où se déroule l’événement"),
    },
  },
  "contact.name": {
    presence: {
      allowEmpty: false,
      message:
        _("Indiquez le nom de la personne à contacter concernant cet événement"),
    },
  },
  "contact.email": {
    presence: {
      allowEmpty: false,
      message:
        _("Indiquez une adresse e-mail de contact pour les personnes qui souhaiteraient se renseigner"),
    },
    email: {
      message: _("Indiquez une adresse e-mail valide"),
    },
  },
  "contact.phone": {
    presence: {
      allowEmpty: false,
      message: "Corrige el número de teléfono",
    },
    phone: {
      message: _("Indiquez un numéro de téléphone valide"),
    },
  },
};

export const validateData = (data) =>
  validate(data, FORM_FIELD_CONSTRAINTS, {
    format: "cleanMessage",
    fullMessages: false,
  });
