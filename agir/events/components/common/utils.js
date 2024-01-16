import _ from "gettext";
import { DateTime, Interval } from "luxon";

import I18N from "@agir/lib/i18n";

export const DOOR2DOOR_EVENT_SUBTYPE_LABEL = "porte-a-porte";

export const EVENT_DEFAULT_DURATIONS = [
  {
    value: 60,
    label: "1h",
  },
  {
    value: 90,
    label: "1h30",
  },
  {
    value: 120,
    label: "2h",
  },
  {
    value: 180,
    label: "3h",
  },
  {
    value: null,
    label: "Personalizada",
  },
];

export const EVENT_TYPES = {
  A: {
    label: "Claudiactivación",
    description:
"Una acción de grupo(s) que busca llegar a gente nueva, como un brigadeo, una charla, un concierto, una caravana…"  },
  M: {
    label: "Actividad pública",
    description:
"Una serie de acciones coordinadas entre muchos grupos, en una fecha específica y con una agenda en común…"  },
  G: {
    label: "Reunión de grupo",
    description:
"Una acción interna de un grupo, como la reunión semanal o una reunión de trabajo…"  },
  O: {
    label: "Otra acción",
    description:
      _("Tout autre type d'événement qui ne rentre pas dans les autres catégories"),
  },
};

export const PRIVATE_EVENT_SUBTYPE_INFO =
  _("Seuls les membres des groupes organisateurs pourront participer à l'événement.");

export const FOR_GROUP_TYPE_EVENT_SUBTYPE_INFO =
  _("Ce type d'événement est reservé aux groupes du type « :type ».");

export const FOR_GROUPS_EVENT_SUBTYPE_INFO =
  _("Ce type d'événement est reservé aux groupes suivants : ");

export const getEventSubtypeInfo = (subtype) => {
  let info = "";
  if (!subtype) {
    return info;
  }
  if (subtype.isPrivate) {
    info += PRIVATE_EVENT_SUBTYPE_INFO;
  }
  if (subtype.forGroupType) {
    info += `\n${FOR_GROUP_TYPE_EVENT_SUBTYPE_INFO.replace(
      ":type",
      subtype.forGroupType,
    )}`;
  }
  if (subtype.forGroups && subtype.forGroups.length > 0) {
    info += `\n${FOR_GROUPS_EVENT_SUBTYPE_INFO}`;
    subtype.forGroups.forEach((group) => {
      info += `\n— ${group.name}`;
    });
  }
  return info.trim();
};

export const formatEvent = (event) => {
  if (!event) {
    return null;
  }

  if (!event.startTime || !event.endTime) {
    return event;
  }

  try {
    const startDateTime = DateTime.fromJSDate(
      new Date(event.startTime),
    ).setLocale(I18N.locale);
    const endDateTime = DateTime.fromJSDate(new Date(event.endTime)).setLocale(
      I18N.locale,
    );
    return {
      ...event,
      schedule: Interval.fromDateTimes(startDateTime, endDateTime),
    };
  } catch (e) {
    return event;
  }
};
