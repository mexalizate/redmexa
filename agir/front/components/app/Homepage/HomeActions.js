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
    max-width: 1156px !important;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-content: space-between;
    align-items: FLEX-START;
    justify-content: center;
  }

  ${StyledArticle} {
    text-align: center;
    padding: 0 1rem;
    color: ${style.black1000};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    flex 1;

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
    imageHomeAction{
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
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
          className="imagenAc"
          src={meetImage}
          height="716"
          width="424"
          alt={_("manifestation")}
        />
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Rencontrez")*/} ORGANÍZATE</h4>
        <p className="textCard primaryTextColorPurple">
          {/*_("d'autres membres")*/} Actívate junto a otras 

          <br />
          {/*_("et agissez ensemble !")*/} personas de tu zona
        </p>
        <Button color="secondaryPurple">{/*_("Voir les groupes")*/} VER GRUPOS</Button>
      </StyledArticle>
      <StyledArticle route="eventMap">
        <img
          className="imagenAc"
          src={actImage}
          height="716 !important"
          width="424 !important"
          alt={_("distribution de tracts")}
        />
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Agissez concrètement")*/}ACTÚA</h4>
        <p className="textCard primaryTextColorPurple" >{/*_("formez-vous et convainquez des gens près de chez vous !")*/} Crea acciones para que más gente se active</p>
        <Button color="secondaryPurple">{/*_("Lire les fiches pratiques")*/} VER ACCIONES </Button>
      </StyledArticle>
      <StyledArticle route="login">
        <img 
          className="imagenAc"
          src={organizeImage}
          height="716 !important"
          width="424 !important"
          alt={_("le premier cahier du programme l'Avenir en Commun")}
        />
        <h4 className="secondaryTextColorLightRed tittleCard">{/*_("Organisez")*/}CONVENCE</h4>
        <p className="textCard primaryTextColorPurple">
          {/*_(
            "Créez un groupe d'action, commandez du matériel, tracts et affiches !",
          )*/}
          Con tus grupos y acciones, hagamos historia
        </p>
        <Button color="secondaryPurple">{/*_("Passer à l'action")*/} PASA A LA ACCIÓN</Button>
      </StyledArticle>
    </StyledActions>
  );
};

export default HomeActions;
