import _ from "gettext";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import SearchAndSelectField from "@agir/front/formComponents/SearchAndSelectField";

import { debounce } from "@agir/lib/utils/promises";

import axios from "@agir/lib/utils/axios";

export const SEARCH_ENDPOINT_URL = "/api/geodata/search/mexican_municipio/";

const searchMexicanMunicipio = async (searchTerm) => {
  const result = {
    data: null,
    error: null,
  };
  try {
    const response = await axios.get(SEARCH_ENDPOINT_URL, {
      params: { q: searchTerm },
    });
    result.data = response.data;
  } catch (e) {
    result.error = e.response?.data || { detail: e.message };
  }

  return result;
};

export const formatMexicanMunicipioOption = (option) => ({
  value: option.code,
  label: `${option.name} (${option.state})`,
  icon: "mountain-city:solid",
});

const MexicanMunicipio = (props) => {
  const { onChange, initialValue, value, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const handleSearch = debounce(async (searchTerm) => {
    setIsLoading(true);
    setOptions(undefined);
    const { data, _error } = await searchMexicanMunicipio(searchTerm);
    setIsLoading(false);
    const results = data.map(formatMexicanMunicipioOption);
    setOptions(results);

    return results;
  }, 600);

  useEffect(() => {
    initialValue &&
      onChange &&
      onChange(formatMexicanMunicipioOption(initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  return (
    <SearchAndSelectField
      {...rest}
      isClearable
      minSearchTermLength={1}
      isLoading={isLoading}
      value={value}
      onChange={onChange}
      onSearch={handleSearch}
      defaultOptions={options}
      placeholder={_("Buscar un municipio...")}
    />
  );
};

MexicanMunicipio.propTypes = {
  value: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    icon: PropTypes.string,
  }),
  initialValue: PropTypes.shape({
    code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    state: PropTypes.string,
  }),
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.node,
  helpText: PropTypes.node,
  error: PropTypes.string,
};

export default MexicanMunicipio;
