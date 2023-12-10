import React from "react";
import parsePhoneNumber from "libphonenumber-js";
import Cleave from "cleave.js/react";

import "@agir/lib/i18n/cleave";

import I18N from "@agir/lib/i18n";

import FormStep from "./FormStep";

class ContactStep extends FormStep {
  constructor(props) {
    super(props);
    this.emailInputRef = React.createRef();
  }
  
  isValidated() {
    return [
      this.validateName(),
      this.validateEmail(),
      this.validatePhone(),
    ].every((c) => c);
  }

  validateName() {
    const { name } = this.props.fields;

    if (!name || name === "") {
      this.setError("name", "Obligatorio: indica la menos el nombre");
      return false;
    }

    this.clearError("name");
    return true;
  }

  validateEmail() {
    const { email } = this.props.fields;

    if (!email || email === "") {
      this.setError(
        "email",
        "Email obligatorio, para que las personas puedan contactarte",
      );
      return false;
    }

    if (!this.emailInputRef.current.validity.valid) {
      this.setError("email", "Cette adresse email n'est pas valide.");
      return false;
    }

    this.clearError("email");
    return true;
  }

  validatePhone() {
    const { phone } = this.props.fields;

    if (!phone || phone === "") {
      this.setError("phone", "Número obligatorio");
      return false;
    }

    let phoneNumber;

    try {
      phoneNumber = parsePhoneNumber(phone, I18N.country);
    } catch (e) {
      this.setError("phone", "Ce numéro de téléphone n'est pas valide");
      return false;
    }

    if (!phoneNumber.isValid()) {
      this.setError("phone", "Ce numéro de téléphone n'est pas valide");
      return false;
    }

    this.setField("phone")(phoneNumber.number);
    this.clearError("phone");
    return true;
  }

  render() {
    const { name, email, phone, hidePhone } = this.props.fields;
    const { errors } = this.state;

    return (
      <div className="row padtopmore padbottommore">
        <div className={"col-md-6" + (this.hasErrors() ? " has-error" : "")}>
          <h4>Información de contacto</h4>
          <p>
            Esta información es vital para que otras personas puedan contactar a 
            tu grupo. El email no tiene que ser personal, puede ser uno creado 
            para el grupo y compartido, pero asegúrate de que una persona esté 
            siempre a cargo de responder. El número de celular nos permitirá 
            contactarte directamente.
          </p>
          <p>
            La información (excepto el número, si así lo indicas) será publicada 
            en la página del grupo y podrá aparecer en motores de búsqueda.
          </p>
          <p className={errors.phone ? "help-block" : ""}>
            Puedes no hacer público tu número, pero es obligatorio indicarlo 
            para que podamos contactarte desde Claudialízate.
          </p>
        </div>
        <div className="col-md-6">
          <div className={"form-group" + (errors.name ? " has-error" : "")}>
            <label>Nombre de la persona de contacto</label>
            <input
              className="form-control"
              name="name"
              type="text"
              value={name || ""}
              onChange={this.handleInputChange}
              required
            />
            {this.showError("name")}
          </div>
          <div className={"form-group" + (errors.email ? " has-error" : "")}>
            <label>Email de contacto del grupo</label>
            <input
              className="form-control"
              name="email"
              type="email"
              value={email || ""}
              onChange={this.handleInputChange}
              required
              ref={this.emailInputRef}
            />
            {this.showError("email")}
          </div>
          <label> Número de celular del grupo</label>
          <div className="row">
            <div className="col-md-6">
              <div
                className={"form-group" + (errors.phone ? " has-error" : "")}
              >
                <Cleave
                  options={{ phone: true, phoneRegionCode: I18N.country }}
                  className="form-control"
                  name="phone"
                  value={phone || ""}
                  onChange={this.handleInputChange}
                  onInit={(owner) => {
                    owner.lastInputValue = phone || "";
                  }}
                />
                {this.showError("phone")}
              </div>
            </div>
            <div className="col-md-6">
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="hidePhone"
                    checked={hidePhone || false}
                    onChange={this.handleInputChange}
                  />{" "}
                  No publicar mi número
                </label>
              </div>
            </div>
          </div>
          {/*<div className="row padtopmore">
            <p className="col-xs-12">
              Ces informations seront <strong>visibles par tous</strong> et{" "}
              <strong>indexées par les moteurs de recherche.</strong>
            </p>
                </div>*/}
        </div>
      </div>
    );
  }
}

export default ContactStep;
