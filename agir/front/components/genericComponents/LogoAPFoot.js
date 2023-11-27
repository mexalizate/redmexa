import isPropValid from "@emotion/is-prop-valid";
import PropTypes from "prop-types";
import styled from "styled-components";

import "@agir/front/genericComponents/_variables.scss";

import svgLogo from "@agir/front/genericComponents/logos/action-populaire-logo.svg";
import svgLogoSmall from "@agir/front/genericComponents/logos/action-populaire_small.svg";

const LogoAPFoot = styled.img
  .withConfig({
    shouldForwardProp: isPropValid,
  })
  .attrs(({ small }) => ({
    src: small ? svgLogoSmall : svgLogo,
    width: small ? "182" : "250",
    height: small ? "35" : "160",
  }))`
  font-size: 0;
  color: transparent;
  height: ${(props) => props.height + "px !important" || "auto"};
  width: ${(props) => props.width + "px !important" || "auto"};
  vertical-align: unset;
`;

LogoAPFoot.propTypes = {
  small: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alt: PropTypes.string,
};
LogoAPFoot.defaultProps = {
  small: false,
  alt: "Claudializate",
};

export default LogoAPFoot;
