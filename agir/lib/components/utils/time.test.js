import { DateTime, Interval } from "luxon";

import I18N from "@agir/lib/i18n";

import { displayHumanDate, displayInterval } from "./time";

const date = (s) =>
  DateTime.fromFormat(s, "d/M H:mm", { zone: I18N.timezone })
    .set({ year: 2021 })
    .setLocale(I18N.locale);

test("displayDate des dates relatives pour des dates proches", () => {
  const relativeTo = date("20/3 12:00"); // sábado 20 marzo 2021, 12:00

  expect(displayHumanDate(date("21/3 10:30"), relativeTo)).toEqual(
    "mañana a las 10:30",
  );

  expect(displayHumanDate(date("22/3 16:14"), relativeTo)).toEqual(
    "pasado mañana a las 16:14",
  );

  expect(displayHumanDate(date("20/3 12:30"), relativeTo)).toEqual(
    "hoy a las 12:30",
  );

  expect(displayHumanDate(date("19/3 9:30"), relativeTo)).toEqual(
    "ayer a las 9:30",
  );

  expect(displayHumanDate(date("18/3 23:59"), relativeTo)).toEqual(
    "anteayer a las 23:59",
  );
});

test("displayDate utilise le jour de la semaine pour une date proche", () => {
  const relativeTo = date("20/3 12:00"); // sábado 20 marzo 2021, 12:00

  // LIMITES INFERIEURES
  expect(displayHumanDate(date("23/3 08:01"), relativeTo)).toEqual(
    "martes proximo a las 8:01",
  );

  expect(displayHumanDate(date("17/3 13:01"), relativeTo)).toEqual(
    "miércoles pasado a las 13:01",
  );

  // LIMITES SUPERIEURES
  // les deux jours limites, en prenant des jours écartés de plus de 24 * 7 heures
  expect(displayHumanDate(date("27/3 13:01"), relativeTo)).toEqual(
    "sábado proximo a las 13:01",
  );
  expect(displayHumanDate(date("13/3 11:32"), relativeTo)).toEqual(
    "sábado pasado a las 11:32",
  );
});

test("displayDate renvoie une date complète pour une date plus lointaine", () => {
  const relativeTo = date("20/3 12:00"); // sábado 20 marzo 2021, 12:00

  expect(displayHumanDate(date("28/3 08:01"), relativeTo)).toEqual(
    "domingo, 28 de marzo a las 8:01",
  );

  expect(displayHumanDate(date("12/3 13:01"), relativeTo)).toEqual(
    "viernes, 12 de marzo a las 13:01",
  );

  expect(displayHumanDate(date("30/12 10:12"), relativeTo)).toEqual(
    "30 de diciembre de 2021 a las 10:12",
  );
});

test("displayInterval renvoie des valeurs correctes pour deux horaires le même jour", () => {
  const relativeTo = date("20/3 12:00"); // sábado 20 marzo 2021, 12:00

  expect(
    displayInterval(
      Interval.fromDateTimes(date("21/3 10:00"), date("21/3 12:00")),
      relativeTo,
    ),
  ).toEqual("domingo, 21 de marzo, de 10:00 a 12:00");

  expect(
    displayInterval(
      Interval.fromDateTimes(date("21/9 19:00"), date("22/9 12:00")),
      relativeTo,
    ),
  ).toEqual(
    "de martes, 21 de septiembre de 2021 a las 19:00 hasta miércoles, 22 de septiembre a las 12:00",
  );
});

test("displayHumanDate n'a pas de problème quand on franchit la fin d'un mois", () => {
  expect(displayHumanDate(date("01/07 20:00"), date("29/06 20:00"))).toEqual(
    "pasado mañana a las 20:00",
  );
});

test("displayHumanDate gère correctement les cas ambigus", () => {
  const relativeTo = date("17/3 12:00"); // miércoles 17 marzo 2021

  expect(displayHumanDate(date("20/3 12:00"), relativeTo)).toEqual(
    "sábado a las 12:00",
  );

  expect(displayHumanDate(date("23/3 12:00"), relativeTo)).toEqual(
    "martes proximo a las 12:00",
  );

  expect(displayHumanDate(date("14/3 12:00"), relativeTo)).toEqual(
    "domingo pasado a las 12:00",
  );
});
