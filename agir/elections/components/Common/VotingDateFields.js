import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";

import CheckboxField from "@agir/front/formComponents/CheckboxField";

const StyledLabel = styled.p``;
const StyledHelpText = styled.p``;
const StyledField = styled.p``;
const StyledError = styled.p``;
const StyledFieldset = styled.fieldset`
  display: flex;
  flex-flow: column nowrap;
  gap: 4px;
  margin: 0;

  && > * {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
  }

  ${StyledLabel} {
    display: block;
    font-weight: 600;
  }

  ${StyledError} {
    color: ${style.redNSP};
  }
`;

const VotingDateFields = (props) => {
  const { name, value, onChange, options, error, label, helpText } = props;

  const handleChange = useCallback(
    ({ target }) => {
      onChange(
        target.checked
          ? [...value, target.value]
          : value.filter((item) => item !== target.value),
      );
    },
    [onChange, value],
  );

  const activeOptions = useMemo(
    () =>
      options.filter(
        (option) =>
          new Date(option.value).toISOString() > new Date().toISOString(),
      ),
    [options],
  );

  return (
    <StyledFieldset>
      {label && <StyledLabel>{label}</StyledLabel>}
      {helpText && <StyledHelpText>{helpText}</StyledHelpText>}
      <StyledField>
        {activeOptions.map((option) => (
          <CheckboxField
            key={option.value}
            name={name}
            label={option.label}
            value={value.includes(option.value)}
            onChange={handleChange}
            inputValue={option.value}
          />
        ))}
      </StyledField>
      {error && <StyledError>{error}</StyledError>}
    </StyledFieldset>
  );
};

VotingDateFields.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    }),
  ).isRequired,
  id: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  label: PropTypes.node,
  helpText: PropTypes.node,
};

export default VotingDateFields;
