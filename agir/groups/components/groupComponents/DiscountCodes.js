import PropTypes from "prop-types";
import React, { useMemo } from "react";
import styled from "styled-components";

import { parseDiscountCodes } from "@agir/groups/groupPage/utils";

import ShareLink from "@agir/front/genericComponents/ShareLink";

const StyledDiscountWarning = styled.p`
  background-color: ${(props) => props.theme.primary100};
  border-radius: ${(props) => props.theme.borderRadius};
  color: ${(props) => props.theme.black1000};
  font-size: 0.875rem;
  padding: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem;
`;

const StyledSection = styled.section`
  margin: 1.5rem 0 0;

  & > * {
    color: ${(props) => props.theme.black1000};
    margin: 0.5rem 0;
  }

  ul {
    padding: 0;
  }

  li {
    list-style: none;

    span {
      font-weight: 400;
    }

    em {
      font-size: 0.875rem;
      padding-top: 0.25rem;
    }
  }
`;

const DiscountCodes = ({ discountCodes, ...rest }) => {
  const codes = useMemo(
    () => parseDiscountCodes(discountCodes),
    [discountCodes]
  );

  if (!Array.isArray(codes) || codes.length === 0) {
    return null;
  }

  return (
    <StyledSection {...rest}>
      <h5>Codes matériels</h5>
      <ul>
        {codes.map(({ code, date }) => (
          <li key={code}>
            <ShareLink
              color="secondary"
              url={code}
              label="Copier"
              $wrap={400}
            />
            <em>Expiration&nbsp;: {date}</em>
          </li>
        ))}
      </ul>
    </StyledSection>
  );
};

DiscountCodes.propTypes = {
  discountCodes: PropTypes.array,
};

export default DiscountCodes;
