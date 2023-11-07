/* eslint-disable react/no-unknown-property */
import _ from "gettext";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Link from "@agir/front/app/Link";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

const StyledCardItem = styled(Link)`
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: ${({ theme }) => theme.cardShadow};
  background-color: white;

  @media (max-width: ${({ theme }) => theme.collapse}px) {
    align-items: flex-start;
    padding: 1.5rem 1rem;
  }

  &,
  &:hover,
  &:focus,
  &:active {
    text-decoration: none;
    color: inherit;
  }

  & > i {
    width: 3rem;
    height: 3rem;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0;
    font-size: 0;
  }

  & > i,
  & > ${RawFeatherIcon} {
    flex: 0 0 auto;

    @media (max-width: 360px) {
      display: none;
    }
  }

  & > span {
    flex: 1 1 auto;
    display: flex;
    flex-flow: column nowrap;
    gap: 0.25rem;

    & > strong {
      font-weight: 500;
      font-size: 1rem;
      line-height: 1.5;
    }

    & > span {
      font-size: 0.875rem;
      line-height: 1.5;
      color: ${({ theme }) => theme.black700};
    }
  }
`;
const StyledCard = styled.ul`
  box-shadow: ${({ theme }) => theme.cardShadow};
  border-radius: ${({ theme }) => theme.borderRadius};
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

export const ActionTools = () => {
  return (
    <StyledCard>
      <StyledCardItem as="span">
        <i
          aria-hidden="true"
          css={`
            background-color: ${({ theme }) => theme.primary500};
            color: ${({ theme }) => theme.white};
          `}
        >
          <RawFeatherIcon name="calendar" />
        </i>
        <span>
          <strong>{_("Organiser une action")}</strong>
          <span>
           {_(" Porte-à-porte, tractage, caravane... Des fiches pratiques sont à votre disposition vour vous aider dans l'organisation de vos actions.")}
          </span>
          <span
            css={`
              display: inline-flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 0.25rem;
            `}
          >
            <Button small link route="createEvent">
              {_("Créer un événement")}
            </Button>
            <Button small link route="helpIndex">
              {_("Voir les fiches pratiques")}
            </Button>
          </span>
        </span>
      </StyledCardItem>
      <StyledCardItem route="materiel">
        <i
          aria-hidden="true"
          css={`
            background-color: ${({ theme }) => theme.secondary500};
            color: ${({ theme }) => theme.black1000};
          `}
        >
          <RawFeatherIcon name="shopping-bag" />
        </i>
        <span>
          <strong>{_("Commander du matériel")}</strong>
          <span>
           {_(" Commandez et recevez chez vous des tracts, des affiches et des objets des campagnes du mouvement.")}
          </span>
        </span>
        <RawFeatherIcon aria-hidden="true" name="chevron-right" />
      </StyledCardItem>
      <StyledCardItem route="cafePopulaireRequest">
        <i
          aria-hidden="true"
          css={`
            background-color: #00b171;
            color: ${({ theme }) => theme.white};
          `}
        >
          <RawFeatherIcon name="coffee" />
        </i>
        <span>
          <strong>{_("Organiser un café populaire")}</strong>
          <span>
            {_("Le café populaire est un exercice d’éducation populaire, de débat d’idées, et de formation politique mis en place par la France insoumise et organisé par l’Institut La Boétie, qui fournit un catalogue de thèmes et d'intervenant·es. Les cafés populaires peuvent être organisés partout en France et sont ouvert à tou·tes les citoyen·nes.")}
          </span>
          <span
            css={`
              display: inline-flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin-top: 0.25rem;
            `}
          ></span>
        </span>
        <RawFeatherIcon aria-hidden="true" name="chevron-right" />
      </StyledCardItem>
      <StyledCardItem route="createContact">
        <i
          aria-hidden="true"
          css={`
            background-color: #4d26b9;
            color: ${({ theme }) => theme.white};
          `}
        >
          <RawFeatherIcon name="user-plus" />
        </i>
        <span>
          <strong>{_("Ajouter un contact")}</strong>
          <span>
           {_(" Ajoutez un nouveau soutien à Action Populaire et à votre groupe d’action en quelques clics.")}
          </span>
        </span>
        <RawFeatherIcon aria-hidden="true" name="chevron-right" />
      </StyledCardItem>
    </StyledCard>
  );
};

export default ActionTools;
