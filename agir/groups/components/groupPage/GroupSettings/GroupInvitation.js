import PropTypes from "prop-types";
import React, { useState } from "react";

import style from "@agir/front/genericComponents/_variables.scss";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Card from "@agir/front/genericComponents/Card";
import { Column, Row } from "@agir/front/genericComponents/grid";

const StyledInput = styled.input`
  min-width: 240px;
  width: 100%;
  height: 32px;
  border: 1px solid ${style.black100};
  border-radius: 8px;
  padding: 8px;
`;

const GroupInvitation = (props) => {
  const { title } = props;

  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleInvitation = (e) => {
    console.log("invite : ", email);
    setEmail("");
  };

  return (
    <Card style={{ padding: "1.5rem" }}>
      <Row gutter={2} style={{ marginBottom: "1rem" }}>
        <Column grow collapse={false}>
          {title}
        </Column>
      </Row>

      <Row gutter={4}>
        <Column grow collapse={false}>
          {" "}
          <StyledInput
            type="text"
            value={email}
            placeholder="Adresse e-mail de l’invité·e"
            onChange={handleChange}
          />
        </Column>
        <Column collapse={false}>
          <Button small onClick={handleInvitation}>
            Envoyer une invitaion
          </Button>
        </Column>
      </Row>
    </Card>
  );
};
GroupInvitation.propTypes = {
  title: PropTypes.string,
};
export default GroupInvitation;
