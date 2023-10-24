
import _ from "gettext";
const eventSubtypes = [
  {
    "id": 57,
    "label": _("action-solidarite"),
    "description": _("Action de solidarité"),
    "color": "#C9462C",
    "icon": null,
    "iconName": "handshake-o",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 136,
    "label": _("actions-jeunes"),
    "description": _("actions jeunes"),
    "color": "#c2306c",
    "icon": null,
    "iconName": "exclamation",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 56,
    "label": _("atelier-pancartes"),
    "description": _("Atelier de fabrication de pancartes"),
    "color": "#0098B6",
    "icon": null,
    "iconName": "paint-brush",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 13,
    "label": _("autre-evenement"),
    "description": _("Autre"),
    "color": "#49b37d",
    "icon": null,
    "iconName": "calendar",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 3,
    "label": _("autre action publique"),
    "description": _("Autre type d'action publique"),
    "color": "#C9462C",
    "icon": null,
    "iconName": "exclamation",
    "type": "A",
    "needsDocuments": true,
    "isVisible": true
  },
  {
    "id": 1,
    "label": _("autre reunion groupe"),
    "description": _("Autre type de réunion de groupe"),
    "color": "#00B400",
    "icon": null,
    "iconName": "comments",
    "type": "G",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 2,
    "label": _("autre reunion publique"),
    "description": _("Autre type de réunion publique"),
    "color": "#0098B6",
    "icon": null,
    "iconName": "cutlery",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 12,
    "label": _("collage"),
    "description": _("Collage d'affiches"),
    "color": "#C9462C",
    "icon": null,
    "iconName": "paint-brush",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 14,
    "label": _("covoiturage"),
    "description": _("Covoiturage"),
    "color": "#49b37d",
    "icon": null,
    "iconName": "car",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 132,
    "label": _("depart-commun"),
    "description": _("Départ commun pour une manifestation/un rassemblement"),
    "color": "#F53B3B",
    "icon": null,
    "iconName": "thumb-tack",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 37,
    "label": _("diffusion-programme"),
    "description": _("Diffusion de notre programme"),
    "color": "#00acee",
    "icon": null,
    "iconName": "book",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 6,
    "label": _("diffusion-tracts"),
    "description": _("Diffusion de tracts"),
    "color": "#c2306c",
    "icon": null,
    "iconName": "exclamation",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 31,
    "label": _("ecoute-collective"),
    "description": _("Écoute collective"),
    "color": "#0098B6",
    "icon": null,
    "iconName": "desktop",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 51,
    "label": _("fête-locale"),
    "description": _("Fête locale"),
    "color": "#0098B6",
    "icon": null,
    "iconName": "star-half-o",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 52,
    "label": _("formations"),
    "description": _("Formations"),
    "color": "#3b5998",
    "icon": null,
    "iconName": "book",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 41,
    "label": _("pique-nique"),
    "description": _("Pique-nique, apéro citoyen"),
    "color": "#C9462C",
    "icon": null,
    "iconName": "cutlery",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 5,
    "label": _("inscription-listes"),
    "description": _("Point d'inscriptions sur les listes électorales"),
    "color": "#0098B6",
    "icon": null,
    "iconName": "edit",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 135,
    "label": _("point-infos-retraites"),
    "description": _("Points d'infos retraites"),
    "color": "#390080",
    "icon": null,
    "iconName": "info",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 9,
    "label": _("porte-a-porte"),
    "description": _("Porte-à-porte"),
    "color": "#F53B3B",
    "icon": null,
    "iconName": "building",
    "type": "A",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 54,
    "label": _("projection-debat"),
    "description": _("Projection-débat"),
    "color": "#00b400",
    "icon": null,
    "iconName": "film",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 11,
    "label": _("reunion-publique"),
    "description": _("Réunion publique"),
    "color": "#e14b35",
    "icon": null,
    "iconName": "bullhorn",
    "type": "M",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 7,
    "label": _("reunion-groupe"),
    "description": _("Réunion régulière du groupe"),
    "color": "#4a64ac",
    "icon": null,
    "iconName": "comments",
    "type": "G",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 131,
    "label": _("session-appels-collective"),
    "description": _("Session d’appels collective"),
    "color": "#F4ED0F",
    "icon": null,
    "iconName": "phone",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 22,
    "label": _("soiree-accueil"),
    "description": _("Soirée d'accueil des nouveaux membres"),
    "color": "#4a64ac",
    "icon": null,
    "iconName": "calendar",
    "type": "G",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 43,
    "label": _("soiree-electorale"),
    "description": _("Soirée électorale"),
    "color": "#3b5998",
    "icon": null,
    "iconName": "envelope-open",
    "type": "G",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 16,
    "label": _("soutien"),
    "description": _("Soutien à une manifestation, un rassemblement"),
    "color": "#c9462c",
    "icon": null,
    "iconName": "calendar",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  },
  {
    "id": 4,
    "label": _("autre evenement"),
    "description": _("Tout autre type d'événement"),
    "color": "#49b37d",
    "icon": null,
    "iconName": "calendar",
    "type": "O",
    "needsDocuments": false,
    "isVisible": true
  }
]; 

export default eventSubtypes;
