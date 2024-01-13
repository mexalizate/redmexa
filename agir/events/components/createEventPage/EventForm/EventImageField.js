import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback } from "react";

import I18N from "@agir/lib/i18n";

import CheckboxField from "@agir/front/formComponents/CheckboxField";
import ImageField from "@agir/front/formComponents/ImageField";
import Spacer from "@agir/front/genericComponents/Spacer";

const EventImageField = (props) => {
  const { onChange, value, name, error, required, disabled } = props;

  const handleChange = useCallback(
    (file) => {
      onChange(name, file && { file, hasLicense: false });
    },
    [name, onChange],
  );

  const handleChangeLicense = useCallback(
    (e) => {
      onChange(name, { ...value, hasLicense: e.target.checked });
    },
    [name, value, onChange],
  );

  return (
    <>
      <strong
        css={`
          font-weight: 600;
          padding: 4px 0;
          font-size: 1rem;
          line-height: 1.5;
          margin-bottom: 5px;
        `}
      >
        {_("Image de couverture")}
      </strong>
      <br />
      <span
        css={`
          line-height: 1.5;
        `}
      >
        {!required && <em>{"Opcional. "}</em>}
        La imagen aparecerá en la página y en redes sociales. Tamaño recomendado: 1200 x 630 px o más.
       {/*_(" L'image apparaîtra sur la page et sur les réseaux sociaux. Taille conseillée&nbsp;: 1200x630&nbsp;px ou plus.")*/}
      </span>
      <ImageField
        name={name}
        value={value?.file || null}
        onChange={handleChange}
        accept=".jpg,.jpeg,.gif,.png"
        disabled={disabled}
        required={required}
        error={error}
      />
      {!!value?.file && (
        <>
          <Spacer size="0.5rem" />
          <CheckboxField
            value={value?.hasLicense || false}
            label={
              <span>
               {_(" Al cargar una imagen, declaro ser propietario de sus derechos y acepto compartirla bajo licencia libre")}{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={I18N.ccLicenseLink}
                >
                  {_("Creative Commons CC-BY-NC 3.0")}
                </a>
                .
              </span>
            }
            onChange={handleChangeLicense}
            disabled={!value || disabled}
            error={error}
            required
          />
        </>
      )}
    </>
  );
};
EventImageField.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  value: PropTypes.object,
  error: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};
export default EventImageField;
