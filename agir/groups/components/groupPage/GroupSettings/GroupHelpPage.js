import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import style from "@agir/front/genericComponents/_variables.scss";

import FileCard from "@agir/front/genericComponents/FileCard";
import HelpCenterCard from "@agir/front/genericComponents/HelpCenterCard";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";
import Spacer from "@agir/front/genericComponents/Spacer";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

const GroupHelpPage = (props) => {
  const { onBack, illustration } = props;

  return (
    <div>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{"Información útil"}</StyledTitle>
      <Spacer size="1rem" />
      <span style={{ color: style.black700 }}>
      La siguiente información te ayudará a mejorar la facilitación y gestión de tu grupo.      </span>
      <Spacer size="1rem" />
      <StyledTitle>Centro de ayuda</StyledTitle>
      <Spacer size=".5rem" />
      <HelpCenterCard type="group" />
      <Spacer size="1rem" />
      <StyledTitle>{_("Documents")}</StyledTitle>
      <Spacer size=".5rem" />
      <FileCard
        title="Guía de acción para facilitadores/gestores"
        text="Guía con instrucciones y consejos para facilitadores y gestores de grupo"
        icon="file-text"
        route="attestationAssurance"
        downloadLabel="Bajar la guía"
      />
      <Spacer size="1rem" />
      <FileCard
        title="Centro de Ayuda para grupos"
        text="Consulta toda la información que preparamos para ayudar a los participantes de grupos a organizarse mejor."
        icon="file-text"
        route="charteEquipes"
        downloadLabel="Centro de Ayuda"
        downloadIcon="eye"
      />
      <Spacer size="1rem" />
      <FileCard
        title="Principios de Grupos"
        text="Consulta los Principios de Grupos que tod@s nos comprometemos a respetar al formar parte de un grupo."
        icon="file-text"
        route="livretAnimateurice"
        downloadLabel="Bajar Principios"
      />
      <Spacer size="2rem" />
    </div>
  );
};
GroupHelpPage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
};
export default GroupHelpPage;
