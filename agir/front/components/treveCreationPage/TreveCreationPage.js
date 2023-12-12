import _ from "gettext";
import React from "react";
import styled from "styled-components";

import background from "@agir/front/genericComponents/images/illustration-404.svg";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: calc(100vh - 74px);
  position: relative;
  overflow: auto;
  background-image: url("${background}");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 28px 14px;

  > span {
    max-width: 680px;
  }
`;

const PageStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InlineBlock = styled.span`
  display: inline-block;
`;

export const TreveCreationPage = () => {
  return (
    <PageStyle>
      <Container>
        <h1 style={{ textAlign: "center", fontSize: "26px" }}>
         {_(" Trève électorale")}
        </h1>
        <span>
          {_("Le week-end du 1er tour de l’élection présidentielle, la loi nous oblige à ne pas mettre à jour les sites de la campagne&nbsp;présidentielle.")}
          <Spacer size="1rem" />
          {_("Jusqu’à dimanche à 20h, vous ne pouvez pas créer d’événement ou de groupe.")}
          <Spacer size="1rem" />
         {_(" Ce dimanche, soyons nombreux et nombreuses à voter pour")}{" "}
          <InlineBlock>{_("Jean-Luc Mélenchon !")}</InlineBlock>
        </span>
        <Button
          style={{ maxWidth: 450, marginTop: "2rem" }}
          color="primary"
          block
          link
          href="https://www.service-public.fr/particuliers/vosdroits/services-en-ligne-et-formulaires/ISE"
        >
          {_("Je trouve mon bureau de vote")}
        </Button>
        <Button
          style={{ maxWidth: 450, marginTop: "1rem" }}
          block
          link
          wrap
          href="https://info.preprod.redmexa.com/2022/04/08/treve-electorale/"
        >
          {_("Agir durant le week-end des élections")}
        </Button>
      </Container>
    </PageStyle>
  );
};

export default TreveCreationPage;
