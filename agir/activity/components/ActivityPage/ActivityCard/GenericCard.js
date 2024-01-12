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
    "Se copió la dirección email.",
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
          {("Vous n'avez pas encore réglé votre place pour l'événément")} {Event}
        </GenericCardContainer>
      );
    }
    case "group-invitation": {
      return (
        <GenericCardContainer {...props}>
          {("Has sido invitado a unirte")} {SupportGroup}
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
          {("ahora sigue a tu grupo")} {SupportGroup} .
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
          {("se unió a")} {SupportGroup}{(". ¡Dile hola!")}
        </GenericCardContainer>
      );
    }
    case "member-status-changed": {
      return (
        <GenericCardContainer {...props}>
          <strong>
            {("Ya no eres un miembro activo del grupo")} {SupportGroup}
          </strong>
          <br />
          {("Los administradores de esté grupo de han etiquetado como  \"suscriptor\" .")}
          <br />
          {("Continuará recibiendo la mayor parte de la información del grupo, excepto los mensajes destinados únicamente a miembros activos.")}
        </GenericCardContainer>
      );
    }
    case "waiting-location-group": {
      return (
        <GenericCardContainer {...props}>
          {("Especifique la ubicación de")} {SupportGroup}
        </GenericCardContainer>
      );
    }
    case "waiting-location-event": {
      return (
        <GenericCardContainer {...props}>
          {("Especifica la ubicación de tu acción :")} {Event}
        </GenericCardContainer>
      );
    }
    case "new-event-speaker-request": {
      return (
        <GenericCardContainer {...props}>
          {("Se ha creado una nueva solicitud de evento para uno de sus temas de intervención.")}
          <br />
          {("Indique si está disponible o no para una o más de las fechas solicitadas.")}
        </GenericCardContainer>
      );
    }
    case "group-coorganization-invite": {
      return (
        <GenericCardContainer {...props}>
          {Individual || "Alguien"} {("propuesta a ")} {SupportGroup} {("de coorganizar")}{" "}
          {Event}
        </GenericCardContainer>
      );
    }
    case "group-coorganization-accepted":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {("a accepté de co-organiser votre événement")} {Event}
        </GenericCardContainer>
      );
    case "group-coorganization-accepted-from":
      return (
        <GenericCardContainer {...props}>
          Le groupe {SupportGroup} {("a accepté de co-organiser votre événement")}{" "}
          {Event}
        </GenericCardContainer>
      );
    case "group-coorganization-accepted-to":
      return (
        <GenericCardContainer {...props}>
          Votre groupe {SupportGroup} {("a accepté de co-organiser l'événement")}{" "}
          {Event}
        </GenericCardContainer>
      );
    case "group-info-update":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {(" fue actualizado ")}
        </GenericCardContainer>
      );
    case "accepted-invitation-member":
      return (
        <GenericCardContainer {...props}>
          {Individual || "Alguien"} {("se a unido ")} {SupportGroup} {("al aceptar una")}
          invitación.
        </GenericCardContainer>
      );
    case "new-attendee":
      return (
        <GenericCardContainer {...props}>
          <strong>
            {(individual && individual.displayName) || "Alguien"}
          </strong>{" "}
          {("se")} {getGenderedWord(individual && individual.gender, "inscribió")}{" "}
          {("en tu acción")} {Event}
        </GenericCardContainer>
      );
    case "new-group-attendee":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {("se inscribió en tu acción")} {Event}
        </GenericCardContainer>
      );
    case "event-update": {
      return (
        <GenericCardContainer {...props}>
          {("Actualización :  cambió la acción ")} {Event} {("en que participas")}
          {changedDataLabel}.
        </GenericCardContainer>
      );
    }
    case "new-event-mygroups":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup || Individual || ("Alguien")} {("publicó una nueva acción")}
        </GenericCardContainer>
      );
    case "new-event-participation-mygroups":
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {("participar en la acción")} {Event}
        </GenericCardContainer>
      );
    case "new-report":
      return (
        <GenericCardContainer {...props}>
          {("El resumen de la acción")} {Event} {(" fue agregado por l@s organizadores ")}
        </GenericCardContainer>
      );
    case "event-suggestion":
      return (
        <GenericCardContainer {...props}>
          Este {" "}
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
          {SupportGroup} {("Se unió a la organización de la acción")} {Event}
        </GenericCardContainer>
      );
    case "cancelled-event":
      return (
        <GenericCardContainer {...props}>
          {("La acción")} {Event} {("ha sido cancelado.")}
        </GenericCardContainer>
      );
    case "transferred-group-member":
      return (
        <GenericCardContainer {...props}>
          {("Has sido transferido de")} &laquo;&nbsp;{meta && meta.oldGroup}
          &nbsp;&raquo; {("y se unió")} {SupportGroup}.<br />
          {("¡Tu nuevo grupo te está esperando!")}
        </GenericCardContainer>
      );
    case "new-members-through-transfer":
      return (
        <GenericCardContainer {...props}>
          {meta && meta.transferredMemberships} {"Participantes"}
          {meta && meta.transferredMemberships > 0 ? "s" : ""} {("nos unimos")}{" "}
          <Link
            to={routeConfig.groupSettings.getLink({ groupPk: group.id })}
            backLink="activities"
          >
            {group.name}
          </Link>{" "}
          {(" tras una transferencia de ")} &laquo;&nbsp;
          {meta && meta.oldGroup}&nbsp;&raquo;.
        </GenericCardContainer>
      );
    case "group-creation-confirmation": {
      return (
        <GenericCardContainer {...props}>
          {SupportGroup} {("ya está en línea")}<br />
          {("Como facilitador(a), puedes gestionar")} {SupportGroup} {("mediante el botón ‘Gestión’ o haciendo ")}{" "}
          <Link
            to={routeConfig.groupSettings.getLink({ groupPk: group.id })}
            backLink="activities"
          >
            {("clic aquí.")}
          </Link>
          .<br />
          {("Te recomendamos leer los consejos destinados a nuev@s facilitadores ")}
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
