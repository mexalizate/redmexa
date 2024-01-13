import React from "react";
import PropTypes from "prop-types";

class NavSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { choices: [], selectedValue: null, error: false };
  }

  setChoice(choice) {
    return (e) => {
      e.preventDefault();

      // Si el valor seleccionado es diferente al actual, actualiza el estado
      if (this.state.selectedValue !== choice.value) {
        this.setState({ selectedValue: choice.value });
        this.props.onChange([choice.value]);
      } else {
        // Si el valor seleccionado es el mismo, deselecciónalo
        this.setState({ selectedValue: null });
        this.props.onChange([]);
      }
    };
  }

  render() {
    const { choices, value } = this.props;

    return (
      <div>
        <ul className="nav nav-pills">
          {choices.map((choice) => (
            <li
              key={choice.value}
              className={
                this.state.selectedValue === choice.value ? "active" : ""
              }
            >
              <a href="#" onClick={this.setChoice(choice)}>
                <i
                  className={
                    "fa " +
                    (this.state.selectedValue === choice.value
                      ? "fa-check-circle"
                      : "fa-circle-o")
                  }
                />
                &nbsp;{choice.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

NavSelect.propTypes = {
  choices: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default NavSelect;