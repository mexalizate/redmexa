import _ from "gettext";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import Button from "@agir/front/genericComponents/Button";
import Spacer from "@agir/front/genericComponents/Spacer";

import CheckboxField from "@agir/front/formComponents/CheckboxField";
import CountryField from "@agir/front/formComponents/CountryField";
import PhoneField from "@agir/front/formComponents/PhoneField";
import SearchAndSelectField from "@agir/front/formComponents/SearchAndSelectField";
import TextField from "@agir/front/formComponents/TextField";

import HowTo from "./HowTo";
import NoGroupCard from "./NoGroupCard";

import I18N from "@agir/lib/i18n";

import { searchGroups } from "@agir/groups/utils/api";
import { scrollToError } from "@agir/front/app/utils";
import {
  LIAISON_NEWSLETTER,
  getNewsletterOptions,
} from "@agir/front/authentication/common";

const StyledForm = styled.form`
  h2 {
    font-size: 1.625rem;
    font-weight: 700;
    margin: 0 0 1.5rem;

    @media (max-width: ${(props) => props.theme.collapse}px) {
      display: none;
    }
  }

  h3 {
    font-weight: 700;
    font-size: 1.25rem;
    margin: 0;
  }

  h4 {
    font-weight: 600;
    font-size: 1rem;
    margin: 0 0 0.5rem;
  }

  em {
    font-weight: 400;
    font-style: italic;
    font-size: 0.875rem;
  }
`;

const formatGroupOptions = (groups) =>
  Array.isArray(groups) && groups.length > 0
    ? [
        ...groups.map((group) => ({
          ...group,
          icon: "users",
          value: group.id,
          label: group.name,
        })),
        {
          id: null,
          value: "",
          label: _("Ne pas ajouter à un groupe"),
        },
      ]
    : null;

export const ContactForm = (props) => {
  const { initialData, errors, isLoading, onSubmit, groups } = props;
  const newsletterOptions = useMemo(() => getNewsletterOptions(), []);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    zip: "",
    country: I18N.country,
    email: "",
    phone: "",
    isPoliticalSupport: true,
    newsletters: newsletterOptions
      .filter((n) => n.selected)
      .map((n) => n.value),
    ...(initialData || {}),
  });
  const [groupOptions, setGroupOptions] = useState(formatGroupOptions(groups));

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setData((state) => ({
      ...state,
      [name]: value,
    }));
  }, []);

  const handleCheck = useCallback((e) => {
    const { name, checked } = e.target;
    setData((state) => ({
      ...state,
      [name]: checked,
    }));
  }, []);

  const handleCheckisPoliticalSupport = useCallback((e) => {
    const { checked } = e.target;
    setData((state) => ({
      ...state,
      isPoliticalSupport: checked,
      newsletters: checked
        ? state.newsletters
        : state.newsletters.filter((nl) => nl !== LIAISON_NEWSLETTER.value),
      address: checked ? state.address : undefined,
      city: checked ? state.city : undefined,
    }));
  }, []);

  const handleCheckNewsletter = useCallback((e) => {
    const { name, checked } = e.target;
    setData((state) => {
      const newState = { ...state };
      newState["newsletters"] = checked
        ? [...state.newsletters, name]
        : state.newsletters.filter((nl) => nl !== name);
      if (name === LIAISON_NEWSLETTER.value) {
        newState["address"] = checked ? "" : undefined;
        newState["city"] = checked ? "" : undefined;
      }
      return newState;
    });
  }, []);

  const handleSelectGroup = useCallback((group) => {
    setData((state) => ({
      ...state,
      hasGroupNotifications: group?.id
        ? state.hasGroupNotifications
        : undefined,
      group,
    }));
    setGroupOptions(formatGroupOptions(groups));
  }, []);

  const handleSelectCountry = useCallback((country) => {
    setData((state) => ({
      ...state,
      country,
    }));
  }, []);

  const handleSearchGroup = useCallback(
    async (searchTerms) => {
      let results = formatGroupOptions(groups);
      if (!searchTerms) {
        setGroupOptions(results);
        return results;
      }
      if (searchTerms.length < 3) {
        setGroupOptions(null);
        return results;
      }
      setGroupOptions(undefined);
      const response = await searchGroups(searchTerms);
      results = formatGroupOptions(response.data?.results);
      setGroupOptions(results);
      return results;
    },
    [groupOptions],
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmit(data);
    },
    [onSubmit, data],
  );

  useEffect(() => {
    scrollToError(errors, window, 100);
  }, [errors]);

  useEffect(() => {
    !data.group &&
      Array.isArray(groupOptions) &&
      groupOptions.length > 0 &&
      setData((state) => ({
        ...state,
        group: groupOptions[0],
      }));
  }, [groupOptions, data.group]);

  return (
    <StyledForm autoComplete="off" onSubmit={handleSubmit}>
      <h2>{_("Ajouter un contact")}</h2>
      <HowTo />
      <Spacer size="1.5rem" />
      {!groupOptions && (
        <>
          <NoGroupCard />
          <Spacer size="1.5rem" />
        </>
      )}
      <h3>{_("Nouveau contact")}</h3>
      <Spacer size="0.5rem" />
      <em>
        &laquo;&nbsp;{_("Souhaitez-vous nous laisser votre contact")}&nbsp;?&nbsp;&raquo;
      </em>
      <Spacer data-scroll="firstName" size="1.5rem" />
      <TextField
        label={_("Prénom*")}
        name="firstName"
        placeholder=""
        onChange={handleChange}
        value={data.firstName}
        disabled={isLoading}
        error={errors?.firstName}
      />
      <Spacer data-scroll="lastName" size="1rem" />
      <TextField
        label={_("Nom*")}
        name="lastName"
        placeholder=""
        onChange={handleChange}
        value={data.lastName}
        disabled={isLoading}
        error={errors?.lastName}
      />
      <Spacer data-scroll="zip" size="1rem" />
      <TextField
        label={_("Code postal*")}
        id="zip"
        error={errors?.zip}
        name="zip"
        placeholder=""
        onChange={handleChange}
        value={data.zip}
        disabled={isLoading}
      />
      <Spacer data-scroll="country" size="1rem" />
      <CountryField
        label={"País"}
        id="country"
        name="country"
        error={errors?.country}
        placeholder=""
        onChange={handleSelectCountry}
        value={data.country}
        disabled={isLoading}
      />
      <Spacer data-scroll="email" size="1rem" />
      <TextField
        label={_("E-mail")}
        id="email"
        error={errors?.email}
        name="email"
        placeholder=""
        onChange={handleChange}
        value={data.email}
        disabled={isLoading}
        type="email"
      />
      <Spacer data-scroll="phone" size="1rem" />
      <PhoneField
        label={_("Téléphone mobile")}
        id="phone"
        name="phone"
        error={errors?.phone}
        onChange={handleChange}
        value={data.phone}
        disabled={isLoading}
        helpText={<em>{_("Facultatif si une adresse e-mail a été renseignée")}</em>}
      />
      <Spacer data-scroll="newsletters" size="2rem" />
      <h4>
        &laquo;&nbsp;¿Quieres registrarte en Claudialízate?{/*_("Souhaitez-vous rejoindre la France insoumise")*/}&nbsp;&nbsp;&raquo;
      </h4>
      <CheckboxField
        label= "Sí, quiero registrarme"
        onChange={handleCheckisPoliticalSupport}
        value={data.isPoliticalSupport}
        id="isPoliticalSupport"
        name="isPoliticalSupport"
        disabled={isLoading}
      />
      <Spacer data-scroll="newsletters" size="1.5rem" />
      <h4>Quieres recibir :{/*_("Souhaitez-vous recevoir :")*/}</h4>
      {newsletterOptions.map((option) => (
        <React.Fragment key={option.value}>
          <CheckboxField
            label={option.label}
            onChange={handleCheckNewsletter}
            value={data.newsletters.includes(option.value)}
            id={option.value}
            name={option.value}
            disabled={isLoading}
          />
          <Spacer size=".5rem" />
        </React.Fragment>
      ))}
      <Spacer data-scroll="group" size="1.5rem" />
      <SearchAndSelectField
        label= "Grupo al que se agrega un seguidor(a)"
        placeholder= "Selecciona un grupo"
        onChange={handleSelectGroup}
        onSearch={handleSearchGroup}
        isLoading={typeof groupOptions === "undefined"}
        value={data.group}
        id="group"
        name="group"
        defaultOptions={groupOptions}
        error={errors?.group}
        disabled={isLoading}
      />
      {data.group?.id && (
        <>
          <Spacer size=".5rem" />
          <CheckboxField
            label={_("Je veux recevoir les actualités du groupe")}
            onChange={handleCheck}
            value={data.hasGroupNotifications}
            id="hasGroupNotifications"
            name="hasGroupNotifications"
            disabled={isLoading}
          />
        </>
      )}
      {data.isPoliticalSupport && (
        <>
          <Spacer size="1.5rem" />
          <h4>
          ¿Quieres ser corresponsal de tu edificio o tu barrio? {/*("Souhaitez-vous devenir correspondant·e pour votre immeuble ou votre village ?")*/}
          </h4>
          <p>
            <em>
              &laquo;&nbsp;Te enviaremos información para difundir el movimiento y sus acciones entre tus vecin@s&nbsp;&raquo;
            </em>
          </p>
          <Spacer size=".5rem" />
          <CheckboxField
            label={_("Devenir correspondant·e de l'immeuble ou du village")}
            onChange={handleCheckNewsletter}
            value={data.newsletters.includes(LIAISON_NEWSLETTER.value)}
            id={LIAISON_NEWSLETTER.value}
            name={LIAISON_NEWSLETTER.value}
            disabled={isLoading}
          />
        </>
      )}
      {data.newsletters.includes(LIAISON_NEWSLETTER.value) && (
        <>
          <Spacer data-scroll="address" size="1rem" />
          <TextField
            label={"Número y Calle"}
            helpText={
              <em>
                {/*_("Pour pouvoir vous envoyer des informations en tant que correspondant·e")*/}
                Para identificar el lugar y enviarte la información adecuada
              </em>
            }
            id="address"
            name="address"
            error={errors?.address}
            placeholder=""
            onChange={handleChange}
            value={data.address}
            disabled={isLoading}
          />
          <Spacer data-scroll="city" size="1rem" />
          <TextField
            label={_("Nom de la commune")}
            id="city"
            name="city"
            error={errors?.city}
            placeholder=""
            onChange={handleChange}
            value={data.city}
            disabled={isLoading}
          />
          <Spacer size="1rem" />
        </>
      )}
      <Spacer data-scroll="global" size="1.5rem" />
      {errors && errors.global && (
        <p
          css={`
            padding: 0 0 1rem;
            margin: 0;
            font-size: 1rem;
            text-align: center;
            color: ${({ theme }) => theme.redNSP};
          `}
        >
          {errors.global}
        </p>
      )}
      <Button block type="submit" color="primary" disabled={isLoading}>
        {_("Suivant")}
      </Button>
    </StyledForm>
  );
};
ContactForm.propTypes = {
  initialData: PropTypes.object,
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  groups: PropTypes.arrayOf(PropTypes.object),
};

export default ContactForm;
