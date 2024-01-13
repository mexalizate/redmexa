import _ from "gettext";

const config = {
  menuLinks: [
    {
      id: "events",
      icon: "calendar",
      title: "Acciones",
      route: "events",
      desktop: true,
      mobile: true,
    },
    {
      id: "actionTools",
      icon: "flag",
      title: _("Agir"),
      route: "actionTools",
      desktop: false,
      mobile: true,
      external: false,
    },
    {
      id: "groups",
      icon: "users",
      title: "Grupos",
      route: "groups",
      desktop: true,
      mobile: true,
      secondaryLinks: "userGroups",
    },
    {
      id: "messages",
      icon: "mail",
      title: "Mensajes",
      route: "messages",
      unreadMessageBadge: true,
      desktop: true,
      mobile: true,
    },
    {
      id: "activities",
      icon: "bell",
      title: _("Notifications"),
      route: "activities",
      unreadActivityBadge: true,
      desktop: true,
      mobile: true,
    },
    {
      id: "settings",
      icon: "settings",
      title: _("Paramètres"),
      route: "personalInformation",
      desktop: true,
      mobile: false,
    },
  ],
  secondaryLinks: [
    {
      id: "eventMap",
      title: _("Carte des événements"),
      route: "eventMap",
    },
    {
      id: "groupMap",
      title: _("Carte des groupes"),
      route: "groupMap",
    },
    {
      id: "help",
      title: "¿Necesitas ayuda?",
      route: "help",
    },
    {
      id: "contact",
      title: _("Contact"),
      route: "contact",
    },
    {
      id: "logout",
      title: "Desconectarse",
      route: "logout",
    },
  ],
};

export default config;
