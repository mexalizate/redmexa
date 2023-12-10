import axios from "../utils/axios";
import React from "react";
import "react-stepzilla/src/css/main.css";
import { Transition } from "react-transition-group";
import qs from "querystring-es3";

import NavSelect from "../utils/navSelect";

import MultiStepForm from "./MultiStepForm";
import FormStep from "./steps/FormStep";
import ContactStep from "./steps/ContactStep";
import LocationStep from "./steps/LocationStep";

import "./style.css";
import PropTypes from "prop-types";
import { captureMessage } from "@sentry/react";

class CreateGroupForm extends React.Component {
  constructor(props) {
    super(props);
    this.setFields = this.setFields.bind(this);

    let state = {
      fields: props.initial || {},
      skipType: false,
      types: props.types,
    };

    if (
      !state.disabled &&
      state.types.length === 1 &&
      !state.types[0].disabled
    ) {
      state.fields.type = state.types[0].id;

      const subtypes = this.props.subtypes.filter(
        (s) => s.type === state.types[0].id,
      );

      if (subtypes.length < 2) {
        state.fields.subtypes = subtypes.map((s) => s.label);
        state.skipType = true;
      }
    }

    this.state = state;
  }

  setFields(fields) {
    this.setState({ fields: Object.assign({}, this.state.fields, fields) });
  }

  render() {
    let steps = [
      {
        name: "Datos de contacto",
        component: (
          <ContactStep setFields={this.setFields} fields={this.state.fields} />
        ),
      },
      {
        name: "Lugar",
        component: (
          <LocationStep setFields={this.setFields} fields={this.state.fields} />
        ),
      },
      {
        name: "Nombre y validación",
        component: (
          <ValidateStep fields={this.state.fields} types={this.state.types} />
        ),
      },
    ];

    let typeStep = {
      name: "¿Un grupo para qué?",
      component: (
        <GroupTypeStep
          disabled={this.props.disabled}
          disabledMessage={this.props.disabledMessage}
          setFields={this.setFields}
          fields={this.state.fields}
          subtypes={this.props.subtypes}
          types={this.state.types}
        />
      ),
    };

    if (!this.state.skipType) {
      steps.unshift(typeStep);
    }

    return <MultiStepForm steps={steps} />;
  }
}
CreateGroupForm.propTypes = {
  initial: PropTypes.object,
  subtypes: PropTypes.array,
  types: PropTypes.array,
  disabled: PropTypes.bool,
  disabledMessage: PropTypes.string,
};

class GroupTypeStep extends FormStep {
  constructor(props) {
    super(props);
    this.groupRefs = props.types.map(() => React.createRef());
    this.state = {
      hasError: false,
    };
  }

  isValidated() {
    const { subtypes } = this.props.fields;
    if (!!subtypes && subtypes.length !== 0) {
      return true;
    } else {
      this.setState({ hasError: true });
      return false;
    }
  }

  subtypesFor(type) {
    return this.props.subtypes.filter((s) => s.type === type);
  }

  setType(type) {
    return () => {
      this.setState({ hasError: false });

      if (type !== this.state.type) {
        this.props.setFields({ type, subtypes: [] });
      }
      const subtypes = this.subtypesFor(type);

      if (subtypes.length < 2) {
        this.props.setFields({ type, subtypes: subtypes.map((s) => s.label) });
      }
    };
  }

  render() {
    const { fields, disabled, disabledMessage } = this.props;

    return (
      <div className="row padtopmore padbottommore">
        {disabled && disabledMessage && (
          <div className="col-xs-12 alert alert-danger text-center">
            {disabledMessage || "Vous ne pouvez plus créer de groupe !"}
          </div>
        )}
        <div className="col-sm-4">
          <h3>¿Para qué crear un grupo?&nbsp;?</h3>
          <p>
          Toda persona puede formar un nuevo grupo y puede unirse a otros grupos creados por otras personas.
          </p>
          <p>
          Los grupos necesitan tener una dirección exacta, pues aparecen en el mapa, permitiendo que las personas de esa zona se conozcan y actúen juntas, lo que hace todo más valioso y divertido.
          </p>
          <p>
          Es muy importante mantener una actitud de respeto y tolerancia hacia las demás personas y los demás grupos. Por eso, al crear un grupo te comprometes a respetar los Principios de Grupos.
          </p>
        </div>

        <div className="col-sm-8 padbottom type-selectors">
          {this.props.types.map((type) => (
            <div
              key={type.id}
              className="type-selector"
              style={{
                flex: type.fullWidth ? "0 0 100%" : undefined,
              }}
            >
              <button
                className={`btn btn-default ${
                  fields.type === type.id ? "active" : ""
                }`.trim()}
                style={{
                  whiteSpace: "normal",
                  backgroundColor: type.disabled ? "transparent" : undefined,
                  opacity: type.disabled ? ".5" : undefined,
                }}
                onClick={type.disabled ? undefined : this.setType(type.id)}
                disabled={type.disabled}
              >
                <strong>{type.label}</strong>
                {type.description}
                {type.disabledDescription ? (
                  <>
                    <br />
                    <br />
                    {type.disabledDescription}
                  </>
                ) : null}
              </button>
            </div>
          ))}
          {this.props.types.map((type, i) => (
            <Transition
              key={"subtype__" + type.id}
              in={
                fields.type === type.id && this.subtypesFor(type.id).length > 1
              }
              timeout={1000}
              mountOnEnter
              unmountOnExit
              onEntering={() => {
                const subtype = document.querySelector(".subtype-selector");
                if (subtype && subtype.scrollIntoView) {
                  subtype.scrollIntoView({
                    behavior: "smooth",
                  });
                }
              }}
            >
              {(state) => {
                const show =
                  this.groupRefs[i] &&
                  fields.type === type.id &&
                  this.subtypesFor(type.id).length > 1;
                return (
                  <div
                    className="subtype-selector"
                    ref={this.groupRefs[i]}
                    style={{
                      height: show
                        ? "entering" === state
                          ? this.groupRefs[i].current.scrollHeight + "px"
                          : "auto"
                        : "2px",
                    }}
                  >
                    <div>
                      <em>Precisa el tipo de tu grupo</em>
                      <NavSelect
                        choices={this.subtypesFor(type.id).map((s) => ({
                          value: s.label,
                          label: s.description,
                        }))}
                        value={fields.subtypes || []}
                        max={3}
                        onChange={(subtypes) =>
                          this.props.setFields({ subtypes })
                        }
                      />
                    </div>
                  </div>
                );
              }}
            </Transition>
          ))}
          {this.state.hasError && (
            <div className="alert alert-warning margintopless marginbottomless">
              Elija un tipo de grupo antes de continuar.
            </div>
          )}
        </div>
      </div>
    );
  }
}

class ValidateStep extends FormStep {
  constructor(props) {
    super(props);
    this.post = this.post.bind(this);
    this.toggleMaySubmit = this.toggleMaySubmit.bind(this);
    this.state = {
      maySubmit: false,
      processing: false,
    };
  }

  toggleMaySubmit(e) {
    this.setState({
      maySubmit: e.target.checked,
    });
  }

  async post(e) {
    e.preventDefault();
    this.setState({ processing: true });

    const { fields } = this.props;
    let data = qs.stringify({
      name: this.groupName.value,
      contact_name: fields.name || null,
      contact_email: fields.email,
      contact_phone: fields.phone,
      contact_hide_phone: fields.hidePhone,
      location_name: fields.locationName,
      location_address1: fields.locationAddress1,
      location_address2: fields.locationAddress2 || null,
      location_zip: fields.locationZip,
      location_city: fields.locationCity,
      location_country: fields.locationCountryCode,
      type: fields.type,
      subtypes: fields.subtypes,
    });

    try {
      let res = await axios.post("form/", data);
      location.href = res.data.url;
    } catch (e) {
      this.setState({ error: e, processing: false });
    }
  }

  render() {
    const { fields, types } = this.props;
    const groupType = types.find((t) => t.id === fields.type) || {};

    return (
      <div className="row padtopmore padbottommore">
        <div className="col-md-6">
          <p>Verifica la información para tu grupo:&nbsp;:</p>
          <dl className="well confirmation-data-list">
            <dt>Tipo&nbsp;:</dt> <dd>{groupType.label}</dd>
            <dt>Número de celular&nbsp;:</dt>
            <dd>
              {fields.phone}&ensp;
              <small>({fields.hidePhone ? "caché" : "public"})</small>
            </dd>
            {fields.name && (
              <>
                <dt>Nombre del contacto&nbsp;:</dt>
                <dd>{fields.name}</dd>
              </>
            )}
            <dt>Dirección email&nbsp;:</dt>
            <dd>{fields.email}</dd>
            <dt>Lugar &nbsp;:</dt>
            <dd>{fields.locationAddress1}</dd>
            {fields.locationAddress2 ? (
              <dd>{fields.locationAddress2}</dd>
            ) : null}
            <dd>
              {fields.locationZip}, {fields.locationCity}
            </dd>
          </dl>
        </div>
        <div className="col-md-6">
          <p>
          Para terminar, ponle nombre a tu grupo (por ejemplo: ‘Barrio La Angostura’, ‘Cancha Fut Teotitlán’, ‘Facultad FyL’…).
          </p>
          <form onSubmit={this.post}>
            <div className="form-group">
              <input
                className="form-control"
                ref={(i) => (this.groupName = i)}
                type="text"
                placeholder="Nombre de mi grupo"
                required
              />
            </div>
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              disabled={!this.state.maySubmit || this.state.processing}
            >
              Crear grupo
            </button>
          </form>
          <form>
            <div className="checkbox">
              <label>
                <input onChange={this.toggleMaySubmit} type="checkbox" />
                Me comprometo a respetar los{" "}
                <a
                  href="https://infos.preprod.redmexa.com/charte-des-groupes-action-populaire/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Principios de Grupos
                </a>
              </label>
            </div>
          </form>
          {this.state.error && (
            <div className="alert alert-warning margintopless">
              {this.state.error.response.status === 400 &&
              this.state.error.response.data.errors ? (
                <ul>
                  {Object.entries(this.state.error.response.data.errors).map(
                    ([field, msg]) => {
                      captureMessage(`ValidationError: ${field} ${msg}`);
                      return <li key={field}>{msg}</li>;
                    },
                  )}
                </ul>
              ) : (
                "Se ha producido un error. Gracias, inténtalo de nuevo más tarde."
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CreateGroupForm;
