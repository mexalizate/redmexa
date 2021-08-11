import { DateTime } from "luxon";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import hrefs from "@agir/front/globalContext/nonReactRoutes.config";
import { routeConfig } from "@agir/front/app/routes.config";

import CheckboxField from "@agir/front/formComponents/CheckboxField";
import Link from "@agir/front/app/Link";

const StyledCampaignFundingField = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.black50};
  border-radius: ${(props) => props.theme.borderRadius};

  p:not(:last-child) > a:last-child {
    display: none;
  }
`;

const DOCUMENT_SENDING_DELAY = 15; //days

const CampaignFundingField = (props) => {
  const {
    onChange,
    needsDocuments,
    isPrivate,
    isCertified,
    groupPk,
    disabled,
    endTime,
  } = props;

  const [noSpending, setNoSpending] = useState(false);
  const [willSendDocuments, setWillSendDocuments] = useState(
    needsDocuments ? false : true
  );

  const limitDate = useMemo(() => {
    if (!needsDocuments || !endTime) {
      return "";
    }
    const end = DateTime.fromJSDate(new Date(endTime));
    return end.plus({ days: 15 }).toFormat("dd/LL/yyyy");
  }, [needsDocuments, endTime]);

  useEffect(() => {
    onChange(noSpending && willSendDocuments);
  }, [onChange, noSpending, willSendDocuments]);

  useEffect(() => {
    setWillSendDocuments(needsDocuments ? false : true);
  }, [needsDocuments]);

  return (
    <StyledCampaignFundingField>
      <div style={{ paddingBottom: ".5rem" }}>
        <p>
          À l’exception des réunions internes, la loi vous interdit d'engager
          des frais personnels dans le cadre de la campagne présidentielle.{" "}
          <a href={hrefs.campaignEventDocumentHelp}>En savoir plus</a>
        </p>
        {isCertified && (
          <p>
            Mais votre groupe d’action certifié peut utiliser{" "}
            <Link
              to={routeConfig.groupSettings.getLink({
                groupPk,
                activePanel: "finance",
              })}
            >
              les demandes de dépense
            </Link>{" "}
            de la France insoumise.{" "}
            <a href={hrefs.campaignEventDocumentHelp}>En savoir plus</a>
          </p>
        )}
        {needsDocuments && (
          <p>
            Tout prêt de matériel ou de lieu doit être justifié d’une
            attestation à télécharger sur Action Populaire d’ici à{" "}
            {DOCUMENT_SENDING_DELAY} jours après la fin de l’événement.{" "}
            <a href={hrefs.campaignEventDocumentHelp}>En savoir plus</a>
          </p>
        )}
      </div>
      <CheckboxField
        style={{ fontWeight: 600 }}
        label={
          isPrivate
            ? "J'ai compris"
            : "Je n’engagerai aucune dépense personnelle pour cet événement"
        }
        onChange={(evt) => setNoSpending(!!evt.target.checked)}
        value={noSpending}
        disabled={disabled}
      />
      {needsDocuments && (
        <CheckboxField
          style={{ fontWeight: 600 }}
          label={
            limitDate
              ? `J’envoie toutes les attestations le cas échéant avant le ${limitDate}`
              : "J’envoie toutes les attestations le cas échéant avant la date limite"
          }
          onChange={(evt) => setWillSendDocuments(!!evt.target.checked)}
          value={willSendDocuments}
          disabled={disabled}
        />
      )}
    </StyledCampaignFundingField>
  );
};
CampaignFundingField.propTypes = {
  onChange: PropTypes.func.isRequired,
  groupPk: PropTypes.string,
  isPrivate: PropTypes.bool,
  isCertified: PropTypes.bool,
  needsDocuments: PropTypes.bool,
  disabled: PropTypes.bool,
  endTime: PropTypes.string,
};
export default CampaignFundingField;