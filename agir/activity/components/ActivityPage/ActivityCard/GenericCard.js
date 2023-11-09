import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

import { CHANGED_DATA_LABEL } from "@agir/activity/common/helpers";
import { dateFromISOString } from "@agir/lib/utils/time";

import { getGenderedWord } from "@agir/lib/utils/display";
import { routeConfig } from "@agir/front/app/routes.config";
import useCopyToClipboard from "@agir/front/genericComponents/useCopyToClipboard";

import Link from "@agir/front/app/Link";
import GenericCardContainer from "./GenericCardContainer";

const GenericCard = (props) => {
  const { type, meta, event, group, individual } = props;
  const [_, copyEmail] = useCopyToClipboard(
    meta?.email,
    2000,
    "L'adresse e-mail a été copié.",
  );

  const { Event, SupportGroup, Individual } = useMemo(
    () => ({
      Event: event && (
        <Link
          route="eventDetails"
          routeParams={{ eventPk: event.id }}
          backLink="activities"
        >
          {event.name}
        </Link>
      ),
      SupportGroup: group && (
        <Link
          route="groupDetails"
          routeParams={{ groupPk: group.id }}
          backLink="activities"
        >
          {group.name}
        </Link>
      ),
      Individual: individual && <strong>{individual.displayName}</strong>,
    }),
    [event, group, individual],
  );

  const changedDataLabel = useMemo(() => {
    let changedDataLabel = "";
    if (meta && Array.isArray(meta.changed_data)) {
      const labels = [];
      meta.changed_data.forEach((field) => {
        if (
          !!CHANGED_DATA_LABEL[field] &&
          !labels.includes(CHANGED_DATA_LABEL[field])
        ) {
          labels.push(CHANGED_DATA_LABEL[field]);
        }
      });
      changedDataLabel = labels
        .map((label, i) => {
          if (i === 0) {
            return ` de ${label}`;
          }
          if (i === labels.length - 1) {
            return ` et de ${label}`;
          }
          return `, de ${label}`;
        })
        .join("");
    }
    return changedDataLabel;
  }, [meta]);

  switch (type) {
    case "waiting-payment": {
      return (
        <GenericCardContainer {...props}>
          {_("Vous n'avez pas encore réglé votre place pour l'événément")} {Event}
        </GenericCardContainer>
      );
    }
    case "group-invitation": {
      return (
        <GenericCardContainer {...props}>
          {_("Vous avez été invité⋅e à rejoindre")} {SupportGroup}
        </GenericCardContainer>
      );
    }
    case "new-follower": {
      return (
        <GenericCardContainer {...props}>
          {Individual || "Quelqu'un"}{" "}
          {meta?.email && (
            <button onClick={copyEmail}>&lt;{meta.email}&gt;</button>
          )}{" "}
          {_("suit désormais votre groupe")} {SupportGroup}.
        </GenericCardContainer>
      );
    }
    case "new-member": {
      return (
        <GenericCardContainer {...props}>
          {Individual || "Quelqu'un"}{" "}
          {meta?.email && (
            <button onClick={copyEmail}>&lt;{meta.email}&gt;</button>
          )}{" "}
          {_("a rejoint")} {SupportGroup}{_(". Prenez le temps de l’accueillir&nbsp;!")}
        </GenericCardContainer>
      );
    }
    case "member-status-changed": {
      return (
        <GenericCardContainer {...props}>
          <strong>
            {_("Vous n’êtes plus membre actif du groupe")} {SupportGroup}
          </strong>
          <br />
          {_("Vous avez été indiqué comme \"abonné·e\" par les gestionnaires de ce groupe.")}
          <br />
          {_("Vous continuerez de recevoir la plupart des informations du groupe, sauf les messages destinés uniquement aux membres actifs.")}
        </GenericCardContainer>
      );
    }
    case "waiting-location-group": {
      return (
        <GenericCardContainer {...props}>
          {_("Précisez la localisation de")} {SupportGroup}
        </GenericCardContainer>
      );
    }
    case "waiting-location-event": {
      return (
        <GenericCardContainer {...props}>
          {_("Précisez la localisation de votre événement&nbsp;:")} {Event}
        </GenericCardContainer>
      );
    }
    case "new-event-speaker-request": {
      return (
        <GenericCardContainer {...props}>
          {_("Une nouvelle demande d'événement à été créée pour un de vos thèmes d'intervention.")}
          <br />
          {_("Indiquez si vous êtes ou pas disponible pour une ou plusieurs des dates demandées.")}
        </GenericCardContainer>
      );
    }
    case "group-coorganization-invite": {
      return (
        <GenericCardContainer {...props}>
          {Individual || "Quelqu'un"} {_("a proposé à")} {SupportGroup} {_("de co-organiser")}{" "}
          {Event}
        </GenericCardContainer>
      );
    }
    case "group-coorganization-accepted":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("a accepté de co-organiser votre événement")} {Event}
        </GenericCardContainer>
      );
    case "group-coorganization-accepted-from":
      return (
        <GenericCardContainer {...props}>
          Le groupe {SupportGroup} {_("a accepté de co-organiser votre événement")}{" "}
          {Event}
        </GenericCardContainer>
      );
    case "group-coorganization-accepted-to":
      return (
        <GenericCardContainer {...props}>
          Votre groupe {SupportGroup} {_("a accepté de co-organiser l'événement")}{" "}
          {Event}
        </GenericCardContainer>
      );
    case "group-info-update":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("a été mis à jour")}
        </GenericCardContainer>
      );
    case "accepted-invitation-member":
      return (
        <GenericCardContainer {...props}>
          {Individual || "Quelqu'un"} {_("a rejoint")} {SupportGroup} {_("en acceptant une")}
          invitation.
        </GenericCardContainer>
      );
    case "new-attendee":
      return (
        <GenericCardContainer {...props}>
          <strong>
            {(individual && individual.displayName) || "Quelqu'un"}
          </strong>{" "}
          {_("s'est")} {getGenderedWord(individual && individual.gender, "inscrit·e")}{" "}
          {_("à votre événement")} {Event}
        </GenericCardContainer>
      );
    case "new-group-attendee":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("s'est inscrit à votre événement")} {Event}
        </GenericCardContainer>
      );
    case "event-update": {
      return (
        <GenericCardContainer {...props}>
          {_("Mise à jour : l'événement")} {Event} {_("auquel vous participez a changé")}
          {changedDataLabel}.
        </GenericCardContainer>
      );
    }
    case "new-event-mygroups":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup || Individual || _("Quelqu'un")} {_("a publié un nouvel événement")}
        </GenericCardContainer>
      );
    case "new-event-participation-mygroups":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("participe à l'événement")} {Event}
        </GenericCardContainer>
      );
    case "new-report":
      return (
        <GenericCardContainer {...props}>
          {_("Le compte rendu de l'événement")} {Event} {_("a été ajouté par les organisateurs")}
        </GenericCardContainer>
      );
    case "event-suggestion":
      return (
        <GenericCardContainer {...props}>
          Ce{" "}
          {dateFromISOString(event.startTime).toLocaleString({
            weekday: "long",
          })}
          {" : "}
          {event.name} de {SupportGroup || Individual}
        </GenericCardContainer>
      );
    case "group-coorganization-info":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("a rejoint l'organisation de l'événement")} {Event}
        </GenericCardContainer>
      );
    case "cancelled-event":
      return (
        <GenericCardContainer {...props}>
          {_("L'événement")} {Event} {_("a été annulé.")}
        </GenericCardContainer>
      );
    case "transferred-group-member":
      return (
        <GenericCardContainer {...props}>
          {_("Vous avez été transféré·e de")} &laquo;&nbsp;{meta && meta.oldGroup}
          &nbsp;&raquo; {_("et avez rejoint")} {SupportGroup}.<br />
          {_("Votre nouveau groupe vous attend !")}
        </GenericCardContainer>
      );
    case "new-members-through-transfer":
      return (
        <GenericCardContainer {...props}>
          {meta && meta.transferredMemberships} {_("membre")}
          {meta && meta.transferredMemberships > 0 ? "s" : ""} {_("ont rejoint")}{" "}
          <Link
            to={routeConfig.groupSettings.getLink({ groupPk: group.id })}
            backLink="activities"
          >
            {group.name}
          </Link>{" "}
          {_("suite à un transfert depuis")} &laquo;&nbsp;
          {meta && meta.oldGroup}&nbsp;&raquo;.
        </GenericCardContainer>
      );
    case "group-creation-confirmation": {
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {_("est en ligne !")}<br />
          {_("En tant qu'animateur·ice, vous pouvez gérer")} {SupportGroup} {_("à tout moment depuis le bouton &laquo;&nbsp;Gestion&nbsp;&raquo; ou bien en cliquant sur")}{" "}
          <Link
            to={routeConfig.groupSettings.getLink({ groupPk: group.id })}
            backLink="activities"
          >
            {_("ce lien")}
          </Link>
          .<br />
          {_("Nous vous conseillons de lire ces conseils à destination des nouveaux animateur·ice·s.")}
        </GenericCardContainer>
      );
    }
    default:
      return null;
  }
};
GenericCard.propTypes = {
  type: PropTypes.string,
  event: PropTypes.object,
  group: PropTypes.object,
  individual: PropTypes.object,
  routes: PropTypes.object,
  meta: PropTypes.object,
  announcement: PropTypes.object,
};

export default GenericCard;
