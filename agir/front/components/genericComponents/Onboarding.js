import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import { useResponsiveMemo } from "@agir/front/genericComponents/grid";

import style from "@agir/front/genericComponents/_variables.scss";

import onboardingEventImage from "./images/onboarding__event.jpg";
import onboardingActionImage from "./images/onboarding__action.jpg";

const ONBOARDING_TYPE = {
  event: {
    img: onboardingEventImage,
    title: <>{_("Organisez un événement près de chez vous !")}</>,
    body: (
      <>
       {_(" Agissez et organisez un événement, tel qu’une action de solidarité, une réunion en ligne pour discuter du programme, une écoute collective... Organisez-vous avec d’autres personnes pour soutenir et faire vivre le mouvement près de chez vous !")}
      </>
    ),
    primaryLink: {
      label: _("Créer un événement"),
      route: "createEvent",
    },
  },
  group__suggestions: {
    title: _("Rejoignez un groupe proche de chez vous"),
    body: (
      <>
        <p>
          {_("Les groupes d'action permettent aux militants de s’organiser dans leur quartier ou dans leur commune.")}
        </p>
        <p>
          {_("Rejoignez un groupe, agissez sur le terrain et organisez des moments de réflexions politiques !")}
        </p>
      </>
    ),
    mapIframe: "groupsMap",
    primaryLink: {
      label: _("Voir les groupes dans ma commune"),
      route: "groupMap",
    },
  },
  group__creation: {
    title: <>{_("Ou bien créez votre groupe !")}</>,
    body: (
      <>
        <p>
          {_("Commencez dès aujourd’hui à organiser des actions pour soutenir les propositions de la France insoumise et de la")} <em>{_("NUPES")}</em>.
        </p>
        <p>
         {_(" Besoin d’inspiration pour animer votre groupe ?")}{" "}
          <a
            href="https://infos.actionpopulaire.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {_("Voici quelques pistes")}
          </a>
          .
        </p>
      </>
    ),
    primaryLink: {
      label: _("Créer un groupe"),
      route: "createGroup",
    },
  },
  fullGroup__creation: {
    title: <>{_("Ou bien animez votre propre groupe et invitez-y vos amis !")}</>,
    body: ({ routes }) => [
      <span key="text">
        {_("Créez votre groupe en quelques clics, et commencez dès aujourd’hui à organiser des actions pour soutenir les propositions de la France insoumise et de la")} <em>{_("NUPES")}</em>{_(". Besoin d’inspiration pour animer votre groupe ?")}{" "}
      </span>,
      routes.newGroupHelp && (
        <a key="link" href={routes.newGroupHelp}>
         {_("Voici quelques pistes.")}
        </a>
      ),
    ],
    primaryLink: {
      label: _("Créer un groupe d'action"),
      route: "createGroup",
    },
  },
  group__action: {
    img: onboardingActionImage,
    title:
      _("Rejoignez un groupe d’action de votre commune pour militer localement"),
    body: (
      <>
        {_("Les groupes d’actions permettent aux militants de s’organiser dans leur quartier ou dans leur commune. Rejoignez un groupe, agissez sur le terrain et organisez des moments de réflexions politiques !")}
      </>
    ),
    primaryLink: {
      label: _("Rejoindre un groupe"),
      route: "groupMap",
    },
    secondaryLink: {
      href: "groupes/creer/",
      label: _("Créer un groupe"),
    },
  },
};

const Map = styled.iframe`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 338px;
  border: none;
  overflow: hidden;

  @media (max-width: ${style.collapse}px) {
    display: none;
  }
`;

const StyledBlock = styled.section`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  justify-content: space-between;
  padding: 0;

  @media (max-width: ${style.collapse}px) {
    padding: 0;
  }

  header {
    div {
      display: block;
      margin-bottom: 28px;
      width: 100%;
      height: 233px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
      border-radius: ${style.borderRadius};

      @media (max-width: ${style.collapse}px) {
        height: 138px;
        margin-bottom: 24px;
      }
    }
  }

  article {
    margin: 0 0 0.5rem;

    a {
      font-weight: 700;
      text-decoration: underline;
    }
  }

  footer {
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
    gap: 11px;

    @media (max-width: ${style.collapse}px) {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

const Onboarding = (props) => {
  const { type, routes } = props;

  const mapIframe = useResponsiveMemo(
    null,
    type && ONBOARDING_TYPE[type]?.mapIframe,
  );

  if (!type || !ONBOARDING_TYPE[type]) {
    return null;
  }

  const { img, title, body, primaryLink, secondaryLink } =
    ONBOARDING_TYPE[type];

  return (
    <StyledBlock>
      <header>
        {img && <div style={{ backgroundImage: `url(${img})` }} />}
        {mapIframe && routes[mapIframe] && <Map src={routes[mapIframe]} />}
        <h3>{title}</h3>
      </header>
      <article>
        <p>{typeof body === "function" ? body(props) : body}</p>
      </article>
      <footer>
        {primaryLink && (
          <Button link color="secondary" route={primaryLink.route}>
            {primaryLink.label || "Créer"}
          </Button>
        )}
        {secondaryLink && (
          <Button link href={secondaryLink.href}>
            {secondaryLink.label || "Voir la carte"}
          </Button>
        )}
      </footer>
    </StyledBlock>
  );
};

Onboarding.propTypes = {
  type: PropTypes.oneOf(Object.keys(ONBOARDING_TYPE)),
  routes: PropTypes.shape({
    createGroup: PropTypes.string,
    newGroupHelp: PropTypes.string,
  }),
};

export default Onboarding;
