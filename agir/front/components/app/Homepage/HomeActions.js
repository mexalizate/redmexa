import _ from "gettext";
import React from "react";

import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import Link from "@agir/front/app/Link";

import actImage from "./images/act.jpg";
import meetImage from "./images/meet.jpg";
import organizeImage from "./images/organize.jpg";

const StyledArticle = styled(Link)``;

const StyledActions = styled.main`
  display: grid;
  grid-gap: 3.5rem 2.5rem;

  @media (min-width: ${style.collapse}px) {
    max-width: 1156px;
    margin: 0 auto;
    grid-template-columns: 1fr 1fr 1fr;
  }

  ${StyledArticle} {
    text-align: center;
    padding: 0 1rem;
    color: ${style.black1000};

    @media (min-width: ${style.collapse}px) {
      padding: 0;
    }

    &:hover {
      text-decoration: none;
    }

    & > * {
      margin: 0;
    }

    h4 {
      padding: 1rem 0 0;
      line-height: 1;

      @media (min-width: ${style.collapse}px) {
        padding-top: 2rem;
      }
    }

    p {
      padding: 0.5rem 0 1rem;
      line-height: 1.5;

      @media (min-width: ${style.collapse}px) {
        padding-bottom: 1.25rem;
      }
    }
  }
`;

const HomeActions = () => {
  return (
    <StyledActions>
      <StyledArticle route="groupMap">
        <img
          src={meetImage}
          height="716"
          width="424"
          alt={_("manifestation")}
        />
        <h4>{_("Rencontrez")}</h4>
        <p>
          {_("d'autres membres")}
          <br />
          {_("et agissez ensemble !")}
        </p>
        <Button color="secondary">{_("Voir les groupes")}</Button>
      </StyledArticle>
      <StyledArticle route="help">
        <img
          src={actImage}
          height="716"
          width="424"
          alt={_("distribution de tracts")}
        />
        <h4>{_("Agissez concrètement")}</h4>
        <p>{_("formez-vous et convainquez des gens près de chez vous !")}</p>
        <Button color="secondary">{_("Lire les fiches pratiques")}</Button>
      </StyledArticle>
      <StyledArticle route="login">
        <img
          src={organizeImage}
          height="716"
          width="424"
          alt={_("le premier cahier du programme l'Avenir en Commun")}
        />
        <h4>{_("Organisez")}</h4>
        <p>
          {_(
            "Créez un groupe d'action, commandez du matériel, tracts et affiches !",
          )}
        </p>
        <Button color="secondary">{_("Passer à l'action")}</Button>
      </StyledArticle>
    </StyledActions>
  );
};

export default HomeActions;
