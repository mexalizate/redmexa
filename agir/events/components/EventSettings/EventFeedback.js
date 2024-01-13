import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import useSWR from "swr";

import { useToast } from "@agir/front/globalContext/hooks.js";
import * as api from "@agir/events/common/api";

import I18N from "@agir/lib/i18n";
import style from "@agir/front/genericComponents/_variables.scss";

import ImageField from "@agir/front/formComponents/ImageField";
import Button from "@agir/front/genericComponents/Button";
import RichTextField from "@agir/front/formComponents/RichText/RichTextField.js";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import CheckboxField from "@agir/front/formComponents/CheckboxField";

import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents.js";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel.js";

const EventFeedback = (props) => {
  const { eventPk, onBack, illustration } = props;
  const sendToast = useToast();
  const { data: event, mutate } = useSWR(
    api.getEventEndpoint("getEvent", { eventPk }),
  );

  const [formData, setFormData] = useState({
    compteRendu: "",
    compteRenduPhoto: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const originalImage = useMemo(() => event?.image, [event]);
  const [imageHasChanged, setImageHasChanged] = useState(false);
  const [hasCheckedImageLicence, setHasCheckedImageLicence] = useState(false);

  const handleChange = (name, value) => {
    // setErrors((errors) => ({ ...errors, [name]: null }));
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleChangeImage = useCallback(
    (value) => {
      setErrors((errors) => ({ ...errors, image: null }));
      setImageHasChanged(value !== originalImage);
      value && value !== originalImage && setHasCheckedImageLicence(false);
      setFormData((formData) => ({ ...formData, compteRenduPhoto: value }));
    },
    [originalImage],
  );

  const handleCheckImageLicence = useCallback((event) => {
    setHasCheckedImageLicence(event.target.checked);
    setErrors((errors) => ({ ...errors, image: null }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setIsLoading(true);

    if (
      formData.compteRenduPhoto &&
      imageHasChanged &&
      !hasCheckedImageLicence
    ) {
      setErrors((errors) => ({
        ...errors,
        image:
          _("Vous devez acceptez les licences pour envoyer votre image en conformité."),
      }));
      setIsLoading(false);
      return;
    }

    const res = await api.updateEvent(eventPk, {
      compteRendu: formData.compteRendu,
      compteRenduPhoto: imageHasChanged ? formData.compteRenduPhoto : undefined,
    });
    setIsLoading(false);
    if (res.error) {
      setErrors(res.error);
      return;
    }
    sendToast("Información actualizada", "SUCCESS", { autoClose: true });
    mutate((event) => {
      return { ...event, ...res.data };
    });
  };

  useEffect(() => {
    setImageHasChanged(false);
    setFormData({
      compteRendu: event.compteRendu,
      compteRenduPhoto: event.compteRenduMainPhoto?.image,
    });
  }, [event]);

  const isDisabled = !event || !event.isEditable || isLoading;

  return (
    <form onSubmit={handleSubmit}>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{_("Compte rendu")}</StyledTitle>

      <Spacer size="1rem" />
      <RichTextField
        id="feedback"
        name="compteRendu"
        label={"Escribir un resumen*"}
        placeholder=""
        onChange={(e) => handleChange("compteRendu", e)}
        value={formData.compteRendu}
        error={errors?.compteRendu}
        disabled={isDisabled}
      />

      <Spacer size="1rem" />

      <h4>
        {!formData.compteRenduPhoto || imageHasChanged
          ? _("Ajouter une photo")
          : _("Photo")}
      </h4>
      <span style={{ color: style.black700 }}>
        {_(
          "Cette image apparaîtra en tête de votre compte rendu, et dans les partages que vous ferez du compte rendu sur les réseaux sociaux.",
        )}
      </span>
      <Spacer size="0.5rem" />
      <ImageField
        name="compteRenduPhoto"
        value={formData.compteRenduPhoto}
        onChange={handleChangeImage}
        error={errors?.image}
        accept=".jpg,.jpeg,.gif,.png"
        disabled={isDisabled}
      />

      {formData.compteRenduPhoto && imageHasChanged && (
        <>
          <Spacer size="0.5rem" />
          <CheckboxField
            value={hasCheckedImageLicence}
            label={
              <span style={{ color: style.black700 }}>
                {
                  "Al cargar una imagen, declaro ser propietario de sus derechos y acepto compartirla bajo licencia libre "
                }{" "}
                <a href={I18N.ccLicenseLink}>{"Creative Commons CC-BY-NC 3.0"}</a>.
              </span>
            }
            onChange={handleCheckImageLicence}
            disabled={isDisabled}
          />
        </>
      )}

      {formData.compteRenduPhoto && !imageHasChanged && (
        <>
          <Spacer size="0.5rem" />
          <Button link small href={event?.routes.addPhoto}>
            {"Agregar más fotos"}
          </Button>
        </>
      )}

      <Spacer size="2rem" />
      <Button color="secondary" wrap disabled={isDisabled} type="submit">
        {_("Enregistrer les informations")}
      </Button>
    </form>
  );
};
EventFeedback.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  eventPk: PropTypes.string,
};
export default EventFeedback;
