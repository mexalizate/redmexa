import _ from "gettext";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

import { Button } from "@agir/donations/common/StyledComponents";
import AttachmentList, {
  AttachmentItem,
} from "@agir/donations/spendingRequest/common/AttachmentList";
import CategoryCard from "@agir/donations/spendingRequest/common/CategoryCard";
import Card from "@agir/front/genericComponents/Card";
import Spacer from "@agir/front/genericComponents/Spacer";

import { TIMING_OPTIONS } from "@agir/donations/spendingRequest/common/form.config";
import { displayPrice } from "@agir/lib/utils/display";
import { simpleDate, timeAgo } from "@agir/lib/utils/time";
import SpendingRequestHistory from "../SpendingRequestHistory";
import { ResponsiveSpan } from "@agir/front/genericComponents/grid";

const FlexLine = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;

  & > * {
    flex: 1 1 auto;
  }

  h4& {
    span + span {
      flex: 0 0 auto;
    }
  }
`;

const StyledCard = styled(Card).attrs(() => ({
  bordered: false,
}))`
  display: flex;
  flex-flow: column nowrap;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 400;
  padding: 1.375rem;
  box-shadow: none;
  border-bottom: 1px solid ${(props) => props.theme.black100};
  margin-bottom: 0;

  header {
    display: flex;
    flex-flow: row nowrap;
    gap: 1rem;
    align-items: center;
  }

  h3,
  h4,
  p {
    flex: 1 1 auto;
    font-size: inherit;
    margin: 0;
  }

  h3 {
    font-size: 1.125rem;
    line-height: 1.5;
    font-weight: 700;
  }

  h4 {
    font-weight: 700;
  }

  p + h4 {
    margin-top: 0.5rem;
  }

  p > strong {
    font-weight: 600;
  }

  em,
  small {
    font-size: 0.75rem;
    font-weight: 400;
  }

  em {
    &:before {
      content: "— ";
    }
  }
`;

const SpendingRequestDetails = (props) => {
  const {
    spendingRequest,
    onAttachmentAdd,
    onAttachmentChange,
    onAttachmentDelete,
  } = props;

  const { timing, spendingDate, amount } = spendingRequest;

  const spendingRequestTiming = useMemo(
    () => (timing && TIMING_OPTIONS[timing]?.shortLabel) || "",
    [timing],
  );
  const spendingRequestSpendingDate = useMemo(
    () => (spendingDate ? simpleDate(spendingDate, false) : ""),
    [spendingDate],
  );
  const spendingRequestAmount = useMemo(
    () => (amount ? displayPrice(amount, true) : "— $"),
    [amount],
  );

  return (
    <div>
      <StyledCard>
        <SpendingRequestHistory status={spendingRequest.status} />
        <Spacer size="0" />
        <Button
          link
          route="spendingRequestHistory"
          routeParams={{ spendingRequestPk: spendingRequest.id }}
          icon="arrow-right"
          color="choose"
        >
          {_("Voir le suivi")}
        </Button>
      </StyledCard>
      <StyledCard>
        <header>
          <h3>{_("Détails")}</h3>
        </header>

        <h4 style={{ fontSize: "1rem" }}>
          &laquo;&nbsp;{spendingRequest.title}&nbsp;&raquo;
        </h4>
        <p>
          <small>
            {_("Demande créée")} {timeAgo(spendingRequest.created)}
            {spendingRequest.creator && ` par ${spendingRequest.creator}`}
          </small>
        </p>

        <h4>{_("Type de dépense")}</h4>
        <p>{_("Dépense")} {spendingRequestTiming.toLowerCase()}</p>

        <h4>{_("Motif de l'achat")}</h4>
        <p>{spendingRequest.explanation || <em>{_("Non renseigné")}</em>}</p>

        <h4>{_("Catégorie de dépense")}</h4>
        <p>
          <CategoryCard small category={spendingRequest.category} />
        </p>

        <h4>{_("Date de l'achat")}</h4>
        <p>{spendingRequestSpendingDate || <em>{_("Non renseignée")}</em>}</p>

        <h4>{_("Événement lié à la dépense")}</h4>
        <p>
          {spendingRequest.event?.name || (
            <em>{_("Pas d'évenement lié à cette dépense")}</em>
          )}
        </p>

        <h4>{_("Nom du contact")}</h4>
        <p>{spendingRequest.contact?.name || <em>{_("Non renseigné")}</em>}</p>

        <h4>{_("Numéro de téléphone")}</h4>
        <p>{spendingRequest.contact?.phone || <em>{_("Non renseigné")}</em>}</p>
      </StyledCard>
      <StyledCard>
        <header>
          <h3>
            <ResponsiveSpan
              small="Financement"
              large="Montant et financement"
              breakpoint={360}
            />
          </h3>
        </header>
        <Spacer size="0" />
        <FlexLine as="h4">
          <span>{_("Total de la dépense")}</span>
          <span>{spendingRequestAmount}</span>
        </FlexLine>
        <p style={{ fontSize: "0.875rem" }}>
          {_("Payé par le groupe")}&nbsp;:{" "}
          <strong>{spendingRequest.group.name}</strong>
        </p>
      </StyledCard>
      <StyledCard>
        <header>
          <h3>{_("Paiement")}</h3>
        </header>

        <h4>{_("Mode de paiemen")}t</h4>
        <p>{_("Virement")}</p>

        <h4>{_("Titulaire du compte")}</h4>
        <p>{spendingRequest.bankAccount?.name || <em>{_("Non renseigné")}</em>}</p>

        <h4>{_("IBAN")}</h4>
        <p>{spendingRequest.bankAccount?.iban || <em>{_("Non renseigné")}</em>}</p>

        <h4>{_("BIC")}</h4>
        <p>{spendingRequest.bankAccount?.bic || <em>{_("Non renseigné")}</em>}</p>

        <h4>{_("RIB")}</h4>
        <p>
          {spendingRequest.bankAccount?.rib ? (
            <AttachmentItem
              id={spendingRequest.bankAccount.rib}
              type="RIB"
              title={_("Relevé d'Identité Bancare")}
              file={spendingRequest.bankAccount.rib}
            />
          ) : (
            <em>
              {_("Pour la validation de la demande, vous devrez également joindre le")}{" "}
              <abbr title="Relevé d'Identité Bancaire">{_("RIB")}</abbr> {_("du compte bancaire au format PDF, JPEG ou PNG.")}
            </em>
          )}
        </p>
      </StyledCard>
      <StyledCard>
        <header>
          <h3>
            <ResponsiveSpan
              small="Justificatifs"
              large="Pièces justificatives"
              breakpoint={360}
            />
          </h3>
          <Button small icon="plus" onClick={onAttachmentAdd}>
            {_("Ajouter")}
          </Button>
        </header>
        {Array.isArray(spendingRequest.attachments) &&
        spendingRequest.attachments.length > 0 ? (
          <AttachmentList
            attachments={spendingRequest.attachments}
            onEdit={onAttachmentChange}
            onDelete={onAttachmentDelete}
          />
        ) : (
          <em>{_("Aucune pièce justificative n'a pas encore été ajoutée")}</em>
        )}
      </StyledCard>
    </div>
  );
};

SpendingRequestDetails.propTypes = {
  spendingRequest: PropTypes.object,
  onAttachmentAdd: PropTypes.func,
  onAttachmentChange: PropTypes.func,
  onAttachmentDelete: PropTypes.func,
};

export default SpendingRequestDetails;
