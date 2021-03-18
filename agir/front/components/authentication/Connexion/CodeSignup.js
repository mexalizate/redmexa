import React from "react";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;

  h1 {
    font-size: 26px;
    font-weight: 700,
    line-height: 39px;
    text-align: center;
    margin-bottom: 0px;
    margin-top: 16px;
    max-width: 450px;
  }
  p {
    text-align: center;
  }
  @media (max-width: ${style.collapse}px) {
    h1 {
      font-size: 18px;
    }
  }
`;

const CodeSignup = () => {
  return (
    <Container>
      <RawFeatherIcon name="mail" width="41px" height="41px" />
      <h1>
        Plus qu’une étape pour <br />
        rejoindre l’action !
      </h1>
      <div style={{ marginTop: "2rem" }}>
        <p>
          Entrez le code de connexion que nous avons envoyé à{" "}
          <strong>danielle@simonnet.fr</strong>
        </p>
        <p style={{ marginBottom: "0" }}>
          Si l’adresse e-mail n’est pas reconnue, il vous sera proposé de vous
          inscrire.
        </p>
      </div>
    </Container>
  );
};

export default CodeSignup;
