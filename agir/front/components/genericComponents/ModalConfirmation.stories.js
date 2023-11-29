import _ from "gettext";
import React, { useState, useCallback, useEffect } from "react";
import ModalConfirmation from "./ModalConfirmation";

export default {
  component: ModalConfirmation,
  title: "Generic/ModalConfirmation",
};

const Template = ({
  shouldShow,
  title,
  description,
  dismissLabel,
  confirmationLabel,
  confirmationUrl,
}) => {
  const [isOpen, setIsOpen] = useState(shouldShow);

  useEffect(() => {
    setIsOpen(shouldShow);
  }, [shouldShow]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalConfirmation
      shouldShow={isOpen}
      onClose={handleClose}
      title={title}
      dismissLabel={dismissLabel}
      confirmationLabel={confirmationLabel}
      confirmationUrl={confirmationUrl}
    >
      {description}
    </ModalConfirmation>
  );
};

export const Default = Template.bind({});
Default.args = {
  shouldShow: true,
  title: _("Titre de la modale"),
  description: _("Ma description est sacrée !"),
};

export const WithConfirmation = Template.bind({});
WithConfirmation.args = {
  shouldShow: true,
  title: _("Titre de la modale"),
  description: _("Ma description est sacrée :)"),
  dismissLabel: _("Non merci"),
  confirmationLabel: _("Allons à cette étape !"),
  confirmationUrl: "https://preprod.redmexa.com",
};
