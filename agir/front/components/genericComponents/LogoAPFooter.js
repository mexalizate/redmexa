import isPropValid from "@emotion/is-prop-valid";
import PropTypes from "prop-types";
import styled from "styled-components";

import "@agir/front/genericComponents/_variables.scss";

import svgLogo from "@agir/front/genericComponents/logos/LogoFooter.svg";
import svgLogoSmall from "@agir/front/genericComponents/logos/action-populaire_small.svg";

const LogoAP = styled.img
  .withConfig({
    shouldForwardProp: isPropValid,
  })
  .attrs(({ small }) => ({
    src: small ? svgLogoSmall : svgLogo,
    width: small ? "182px" : "100%",
    height: small ? "35" : "120",
  }))`
  font-size: 0;
  color: transparent;
  height: ${(props) => props.height + "px !important" || "auto"};
  width: ${(props) => props.width + " !important" || "auto"};
  vertical-align: unset;
`;

LogoAP.propTypes = {
  small: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alt: PropTypes.string,
};
LogoAP.defaultProps = {
  small: false,
  alt: "Claudializate",
};

export default LogoAP;
