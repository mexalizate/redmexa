import React from "react";
import countries from "localized-countries/data/es_MX";

import I18N from "@agir/lib/i18n";

const countriesFirst = [
  "MX",
  "US",
  "FR",
  "PT",
  "DZ",
  "MA",
  "TR",
  "IT",
  "GB",
  "ES",
];

const fullCountryList = countriesFirst
  .map((code) => ({ code, label: countries[code], key: `${code}1` }))
  .concat(
    Object.keys(countries)
      .map((code) => ({ code, label: countries[code], key: `${code}2` }))
      .sort(({ label: label1 }, { label: label2 }) =>
        label1.localeCompare(label2),
      ),
  );

import FormStep from "./FormStep";

const requiredFields = [
  "locationName",
  "locationAddress1",
  "locationCity",
  "locationCountryCode",
];

export default class LocationStep extends FormStep {
  constructor(props) {
    props.fields.locationCountryCode =
      props.fields.locationCountryCode || I18N.country;
    super(props);
  }

  isValidated() {
    const { fields } = this.props;
    this.resetErrors();

    for (let f of requiredFields) {
      if (!fields[f] || fields[f].trim() === "") {
        this.setError(f, "Campo obligatorio.");
      }
    }

    if (fields.locationCountryCode === I18N.country) {
      if (!fields.locationZip) {
        this.setError("locationZip", "Campo obligatorio.");
      } else if (!fields.locationZip.match("^[0-9]{5}$")) {
        this.setError("locationZip", "Ce code postal est incorrect.");
      }
    }

    return !this.hasErrors();
  }

  render() {
    const { fields, helpText } = this.props;
    return (
      <div className="row padtopmore padbottommore">
        <div className="col-md-6">
          <h4>Lugar de reunión</h4>
          <p>
            Por favor indica una dirección exacta, con calle y número, para que
            aparezca en el mapa de grupos. Si se trata de una dirección personal
            y no quieres que aparezca, indica la dirección de un lugar muy
            cercano que sirva de referencia.
          </p>
          {helpText ? <p>{helpText}</p> : null}
        </div>
        <div className="col-md-6">
          <div
            className={
              "form-group" + (this.hasError("locationName") ? " has-error" : "")
            }
          >
            <label>Nombre o tipo de lugar</label>
            <input
              name="locationName"
              onChange={this.handleInputChange}
              value={fields.locationName || ""}
              placeholder="Ejemplo : café Péndulo, centro cultural Raíz…"
              className="form-control"
              type="text"
              required
            />
            {this.showError("locationName")}
          </div>
          <div
            className={
              "form-group" +
              (this.hasError("locationAddress1") ? " has-error" : "")
            }
          >
            <label className="control-label">Dirección </label>
            <input
              name="locationAddress1"
              onChange={this.handleInputChange}
              value={fields.locationAddress1 || ""}
              placeholder="Calle y número"
              className="form-control"
              type="text"
              required
            />
            <input
              name="locationAddress2"
              onChange={this.handleInputChange}
              value={fields.locationAddress2 || ""}
              placeholder="Más dirección (colonia, municipio)"
              className="form-control"
              type="text"
            />
            {this.showError("locationAddress1")}
          </div>
          <div className="row">
            <div className="col-md-4">
              <div
                className={
                  "form-group" +
                  (this.hasError("locationZip") ? " has-error" : "")
                }
              >
                <label className="control-label">Código Postal/ZIP</label>
                <input
                  name="locationZip"
                  onChange={this.handleInputChange}
                  value={fields.locationZip || ""}
                  className="form-control"
                  type="text"
                  required
                />
                {this.showError("locationZip")}
              </div>
            </div>
            <div className="col-md-8">
              <div
                className={
                  "form-group" +
                  (this.hasError("locationCity") ? " has-error" : "")
                }
              >
                <label className="control-label">Ciudad</label>
                <input
                  name="locationCity"
                  onChange={this.handleInputChange}
                  value={fields.locationCity || ""}
                  className="form-control"
                  type="text"
                  required
                />
                {this.showError("locationCity")}
              </div>
            </div>
          </div>
          <div
            className={
              "form-group" +
              (this.hasError("locationCountryCode") ? " has-error" : "")
            }
          >
            <label className="control-label">País</label>
            <select
              name="locationCountryCode"
              onChange={this.handleInputChange}
              value={fields.locationCountryCode || ""}
              className="form-control"
              required
            >
              {fullCountryList.map((country) => (
                <option value={country.code} key={country.key}>
                  {country.label}
                </option>
              ))}
            </select>
            {this.showError("locationCountryCode")}
          </div>
        </div>
      </div>
    );
  }
}
