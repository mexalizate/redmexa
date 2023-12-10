import _ from "gettext";
import React from "react";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import styled from "styled-components";
import style from "@agir/front/genericComponents/_variables.scss";
import { useLocation } from "react-router-dom";

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
    font-weight: 700;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 0px;
    margin-top: 1rem;
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
  const location = useLocation();
  return (
    <Container>
      <RawFeatherIcon name="mail" width="41px" height="41px" />
      <h1>
        Sólo un paso más para <br />
        {_("rejoindre l’action !")}
      </h1>
      <div style={{ marginTop: "2rem" }}>
        <p>
            Haz clic en el enlace que te enviamos a{" "}
          <strong>{location.state?.email}</strong> para validar tu registro
        </p>
        <p style={{ marginBottom: "0" }}>
          Si no reconocemos tu email, te invitaremos a registrarte.
        </p>
      </div>
    </Container>
  );
};

export default CodeSignup;
