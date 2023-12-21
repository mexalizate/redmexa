import _ from "gettext";
import _sortBy from "lodash/sortBy";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";

import { useGroup } from "@agir/groups/groupPage/hooks/group.js";

const GroupMaterielPage = (props) => {
  const { onBack, illustration, groupPk } = props;
  const group = useGroup(groupPk);

  const ordersURL = useMemo(() => group?.routes?.orders || "", [group]);
  return (
    <>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{_("Matériel")}</StyledTitle>
      <span style={{ color: style.black700 }}>
        Accede al sitio de material para poner a disposición de tu grupo todos los materiales que necesitan (flyers, posters, etiquetas…)     
       </span>
      {ordersURL && (
        <>
          <Spacer size=".5rem" />
          <span style={{ color: style.black700 }}>
            {_("Pour utiliser vos codes, accédez au site matériel :")}
          </span>
          <Spacer size="1.5rem" />
          <p style={{ textAlign: "center" }}>
            <Button
              icon="external-link"
              color="primary"
              link
              href={ordersURL}
              target="_blank"
              rel="noopener noreferrer"
              wrap
            >
              {_("Site d’achat de matériel")}
            </Button>
          </p>
        </>
      )}
    </>
  );
};
GroupMaterielPage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  groupPk: PropTypes.string,
};
export default GroupMaterielPage;
