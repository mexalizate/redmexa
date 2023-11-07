import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import Button from "@agir/front/genericComponents/Button";
import Card from "@agir/front/genericComponents/Card";
import Spacer from "@agir/front/genericComponents/Spacer";

const HelpCenterCard = (props) => {
  const { type } = props;

  const route =
    type === "group" ? "groupHelp" : type === "event" ? "eventHelp" : "help";

  return (
    <Card>
      <p>
        {_("Un centre d'aide est à votre disposition avec des fiches pratiques et les réponses aux questions le plus fréquemment posées.")}
      </p>
      <p>
       {_(" Un page de contact est également disponible pour des questions plus spécifiques.")}
      </p>
      <Spacer size="0.5rem" />
      <Button link small route={route} color="secondary">
        {_("Acceder au centre d'aide")}
      </Button>
      <Spacer size="0.5rem" />
      <Button link small route="helpIndex" color="secondary">
        {_("Voir les fiches pratiques")}
      </Button>
      <Spacer size="0.5rem" />
      <Button link small route="contact" color="default">
        {_("Nous contacter")}
      </Button>
    </Card>
  );
};
HelpCenterCard.propTypes = {
  type: PropTypes.oneOf(["group", "event"]),
};
export default HelpCenterCard;
