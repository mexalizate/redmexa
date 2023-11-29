import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";

import JoinAGroupCard from "./JoinAGroupCard";
import ActionTools from "./ActionTools";

const StyledButtons = styled.div`
  display: flex;
  gap: 0.5rem;

  ${Button} {
    flex: 1 1 50%;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1442px;
  margin: 0 auto;
  padding: 0 50px 3rem;
  display: flex;
  gap: 2.5rem;

  h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    margin: 2rem 0 1rem;

    small {
      font-size: 0.813rem;
      color: ${(props) => props.theme.redNSP};
      text-transform: uppercase;
    }
  }

  aside {
    flex: 0 0 373px;
  }

  main {
    flex: 1 1 100%;
  }
`;

const DesktopActionToolsPage = (props) => {
  const { firstName, hasGroups, city, commune } = props;

  return (
    <MainContainer>
      <main>
        <h2>{_("Méthodes d'action")}</h2>
        <ActionTools />
      </main>
      <aside>
        <h2>{/*_("Besoin d'aide ?")*/}¿Necesitas ayuda?</h2>
        <StyledButtons>
          <Button link route="help">
            {/*_("Centre d'aide")*/} Centro ayuda
          </Button>
          <Button link route="contact">
            {/*_("Nous contacter")*/} Contactarnos
          </Button>
        </StyledButtons>
        <PageFadeIn ready={typeof hasGroups !== "undefined"}>
          {!hasGroups && (
            <>
              <h2>{/*_("Conseillé pour")*/} Recomendado para  {firstName || "ti"}</h2>
              <JoinAGroupCard city={city} commune={commune} />
            </>
          )}
        </PageFadeIn>
      </aside>
    </MainContainer>
  );
};
DesktopActionToolsPage.propTypes = {
  firstName: PropTypes.string,
  donationAmount: PropTypes.number,
  hasGroups: PropTypes.bool,
  city: PropTypes.string,
  commune: PropTypes.object,
};
export default DesktopActionToolsPage;
