import _ from "gettext";
const attAssTemplate = "https://infos.preprod.redmexa.com/assurance.pdf";

export const EVENT_DOCUMENT_TYPES = {
  "ATT-ASS": {
    type: "ATT-ASS",
    name: "Attestation d'assurance",
    templateLink: attAssTemplate,
    templateLinkLabel: _("Télécharger l'attesation"),
    description:
      _("Attestation d'assurance de la France insoumise, que vous pourrez utiliser, si besoin, en cas de réservation d'une salle pour votre événement public"),
  },
};

export const EVENT_PROJECT_STATUS = {};
