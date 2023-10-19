import _ from "gettext";

const config = {
  menuLinks : [
    {
      "id": "events",
      "icon": "calendar",
      "title": _("Événements"),
      "route": "events",
      "desktop": true,
      "mobile": true
    },
    {
      "id": "actionTools",
      "icon": "flag",
      "title": _("Agir"),
      "route": "actionTools",
      "desktop": false,
      "mobile": true,
      "external": false
    },
    {
      "id": "groups",
      "icon": "users",
      "title": _("Groupes"),
      "route": "groups",
      "desktop": true,
      "mobile": true,
      "secondaryLinks": "userGroups"
    },
    {
      "id": "messages",
      "icon": "mail",
      "title": _("Messages"),
      "route": "messages",
      "unreadMessageBadge": true,
      "desktop": true,
      "mobile": true
    },
    {
      "id": "activities",
      "icon": "bell",
      "title": _("Notifications"),
      "route": "activities",
      "unreadActivityBadge": true,
      "desktop": true,
      "mobile": true
    },
    {
      "id": "settings",
      "icon": "settings",
      "title": _("Paramètres"),
      "route": "personalInformation",
      "desktop": true,
      "mobile": false
    }
  ],
  "secondaryLinks": [
    {
      "id": "news",
      "title": _("Actualité de la France insoumise"),
      "route": "news"
    },
    {
      "id": "eventMap",
      "title": _("Carte des événements"),
      "route": "eventMap"
    },
    {
      "id": "groupMap",
      "title": _("Carte des groupes"),
      "route": "groupMap"
    },
    {
      "id": "donations",
      "title": _("Faire un don"),
      "route": "donations"
    },
    {
      "id": "help",
      "title": _("Besoin d'aide ?"),
      "route": "help"
    },
    {
      "id": "contact",
      "title": _("Contact"),
      "route": "contact"
    },
    {
      "id": "logout",
      "title": _("Déconnexion"),
      "route": "logout"
    }
  ]
}

export default config;
