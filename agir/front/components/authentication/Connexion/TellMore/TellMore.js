import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import I18N from "@agir/lib/i18n";
import style from "@agir/front/genericComponents/_variables.scss";
import helloDesktop from "@agir/front/genericComponents/images/hello-desktop.svg";

import Link from "@agir/front/app/Link";
import MexicanMunicipioField, {
  formatMexicanMunicipioOption,
} from "@agir/front/formComponents/MexicanMunicipioField";
import PhoneField from "@agir/front/formComponents/PhoneField";
import CountryField from "@agir/front/formComponents/CountryField";
import TextField from "@agir/front/formComponents/TextField";
import Button from "@agir/front/genericComponents/Button";
import LogoAP from "@agir/front/genericComponents/LogoAP";
import Spacer from "@agir/front/genericComponents/Spacer";
import { Hide } from "@agir/front/genericComponents/grid";

import { getProfile, updateProfile } from "@agir/front/authentication/api";
import generateLogger from "@agir/lib/utils/logger";

const logger = generateLogger(__filename);

const LeftBlock = styled.div`
  width: 40%;
  height: 100vh;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-end;

  @media (max-width: ${style.collapse}px) {
    display: none;
  }
`;

const MainBlock = styled.form`
  width: 60%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 13px;
  padding: 2rem;

  @media (max-width: ${style.collapse}px) {
    width: 100%;
    align-items: center;
  }

  h1 {
    margin: 0;
    padding: 0;
    font-weight: 700;
    font-size: 2rem;
    padding-bottom: 0.25rem;
  }

  h2 {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 400;
    padding-bottom: 2rem;
  }
`;

const InputGroup = styled.div`
  display: inline-flex;
  justify-content: space-between;
  width: 100%;

  > div:nth-child(1) {
    width: 155px;
  }

  > div:nth-child(2) {
    width: 346px;
  }

  @media (max-width: ${style.collapse}px) {
    display: block;

    > div:nth-child(1) {
      width: 100%;
    }

    > div:nth-child(2) {
      width: 100%;
    }
  }
`;

const DEFAULT_DATA = {
  displayName: "",
  firstName: "",
  lastName: "",
  contactPhone: "",
  zip: "",
  country: I18N.country,
};

const TellMore = ({ dismiss }) => {
  const [formData, setFormData] = useState(DEFAULT_DATA);
  const [existingData, setExistingData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});

  const getProfileInfos = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getProfile();
    setIsLoading(false);
    if (!data) {
      logger.error(error);
      return;
    }
    setFormData({
      displayName:
        data.displayName?.length > 2
          ? data.displayName
          : DEFAULT_DATA.displayName,
      firstName: data.firstName || DEFAULT_DATA.firstName,
      lastName: data.lastName || DEFAULT_DATA.lastName,
      contactPhone: data.contactPhone || DEFAULT_DATA.contactPhone,
      zip: data.zip || DEFAULT_DATA.zip,
      country: data.country || DEFAULT_DATA.country,
      municipio: data.municipio && formatMexicanMunicipioOption(data.municipio),
    });
    setExistingData({ firstName: !!data.firstName, lastName: !!data.lastName });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  }, []);

  const handleChangePhone = useCallback((e) => {
    const { value } = e.target;
    setFormData((formData) => ({
      ...formData,
      contactPhone: value,
    }));
  }, []);

  const handleChangeMunicipio = useCallback((value) => {
    setFormData((formData) => ({
      ...formData,
      municipio: value,
    }));
  }, []);

  const handleChangeCountry = useCallback((value) => {
    setFormData((formData) => ({
      ...formData,
      country: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      const data = await updateProfile(formData);
      setIsLoading(false);
      if (data.error) {
        setError(data.error);
        return;
      }
      await dismiss();
    },
    [dismiss, formData],
  );

  useEffect(() => {
    getProfileInfos();
    //eslint-disable-next-line
  }, []);

  return (
    <div>
      <Hide $under>
        <div style={{ position: "fixed" }}>
          <Link route="events">
            <LogoAP
              style={{ marginTop: "2rem", paddingLeft: "2rem", width: "200px" }}
            />
          </Link>
        </div>
      </Hide>
      <div style={{ display: "flex" }}>
        <LeftBlock>
          <img
            src={helloDesktop}
            alt={_("Bienvenue")}
            width="217"
            height="227"
            style={{ width: "220px", paddingRight: "60px" }}
          />
        </LeftBlock>
        <MainBlock onSubmit={handleSubmit}>
          <div style={{ width: "100%", maxWidth: "517px" }}>
            <h1>{_("Je complète mon profil")}</h1>
            <h2>{_("Complétez les informations vous concernant")}</h2>
            <TextField
              label="Nom public"
              helpText={_(
                "Le nom que pourront voir les membres avec qui vous interagissez. Indiquez par exemple votre prénom ou un pseudonyme.",
              )}
              error={error && error.displayName}
              name="displayName"
              placeholder="Mathilde P."
              onChange={handleInputChange}
              value={formData.displayName}
              disabled={isLoading}
            />
            <Spacer size="1rem" />
            {!existingData.firstName && (
              <>
                <TextField
                  label={
                    <>
                      {_("Prénom")}{" "}
                      <span style={{ fontWeight: 400 }}>(facultatif)</span>
                    </>
                  }
                  name="firstName"
                  placeholder=""
                  onChange={handleInputChange}
                  value={formData.firstName}
                  disabled={isLoading}
                />
                <Spacer size="1rem" />
              </>
            )}
            {!existingData.lastName && (
              <>
                <TextField
                  label={
                    <>
                      {_("Nom")}{" "}
                      <span style={{ fontWeight: 400 }}>(facultatif)</span>
                    </>
                  }
                  id="lastName"
                  name="lastName"
                  placeholder=""
                  onChange={handleInputChange}
                  value={formData.lastName}
                  disabled={isLoading}
                />
                <Spacer size="1rem" />
              </>
            )}
            <InputGroup>
              <div>
                <TextField
                  label={_("Code postal")}
                  id="zip"
                  error={error && error.zip}
                  name="zip"
                  placeholder=""
                  onChange={handleInputChange}
                  value={formData.zip}
                  disabled={isLoading}
                  required
                />
                <Spacer size="1rem" />
              </div>
              <div>
                <PhoneField
                  label={
                    <>
                      {_("Numéro de téléphone")}{" "}
                      <span style={{ fontWeight: 400 }}>
                        ({_("facultatif")})
                      </span>
                    </>
                  }
                  id="contactPhone"
                  name="contactPhone"
                  error={error && error.contactPhone}
                  onChange={handleChangePhone}
                  value={formData.contactPhone}
                  disabled={isLoading}
                />
                <Spacer size="1rem" />
              </div>
            </InputGroup>
            <CountryField
              label={_("Pays")}
              id="country"
              name="country"
              placeholder=""
              onChange={handleChangeCountry}
              value={formData.country}
              disabled={isLoading}
              required
            />
            <Spacer size="1rem" />
            <MexicanMunicipioField
              label={
                <>
                  {_("Municipalité mexicaine d'origine")}{" "}
                  <span style={{ fontWeight: 400 }}>(facultatif)</span>
                </>
              }
              id="municipio"
              name="municipio"
              placeholder=""
              onChange={handleChangeMunicipio}
              value={formData.municipio}
              disabled={isLoading}
            />
            <Spacer size="1rem" />
            <Button
              type="submit"
              color="primary"
              disabled={isLoading}
              style={{
                width: "356px",
                maxWidth: "100%",
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              {_("Enregistrer")}
            </Button>
            <Hide as={Spacer} $under size="79px" />
          </div>
        </MainBlock>
      </div>
    </div>
  );
};

TellMore.propTypes = {
  dismiss: PropTypes.func.isRequired,
};
export default TellMore;
