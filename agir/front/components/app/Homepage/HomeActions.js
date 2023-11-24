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
  padding-top: 0px;
  

  @media (min-width: ${style.collapse}px) {
    max-width: 1156px;
    margin: 0 auto !important;
    padding-top: 0px;
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
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Rencontrez")*/} ORGANÍZATE</h4>
        <p className="textCard primaryTextColorPurple">
          {/*_("d'autres membres")*/} Otros miembros
          <br />
          {/*_("et agissez ensemble !")*/} actúan juntos
        </p>
        <Button color="secondaryPurple">{/*_("Voir les groupes")*/} VER GRUPOS</Button>
      </StyledArticle>
      <StyledArticle route="help">
        <img
          src={actImage}
          height="716"
          width="424"
          alt={_("distribution de tracts")}
        />
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Agissez concrètement")*/}ACTÚA</h4>
        <p className="textCard primaryTextColorPurple" >{/*_("formez-vous et convainquez des gens près de chez vous !")*/} Entérate y convence a las personas cercanas a ti</p>
        <Button color="secondaryPurple">{/*_("Lire les fiches pratiques")*/} LEER LAS FICHAS PRÁCTICAS </Button>
      </StyledArticle>
      <StyledArticle route="login">
        <img
          src={organizeImage}
          height="716"
          width="424"
          alt={_("le premier cahier du programme l'Avenir en Commun")}
        />
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Organisez")*/}ENCONTRARSE</h4>
        <p className="textCard primaryTextColorPurple">
          {/*_(
            "Créez un groupe d'action, commandez du matériel, tracts et affiches !",
          )*/}
          Crear un grupo de acción pide materiales folletos y carteles
        </p>
        <Button color="secondaryPurple">{/*_("Passer à l'action")*/} PASA A LA ACCIÓN</Button>
      </StyledArticle>
    </StyledActions>
  );
};

export default HomeActions;
