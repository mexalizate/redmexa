import PropTypes from "prop-types";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import style from "@agir/front/genericComponents/_variables.scss";
import { getGroupTypeWithLocation } from "./utils";

import Map from "@agir/carte/common/Map";
import Modal from "@agir/front/genericComponents/Modal";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";
import GroupLocation from "@agir/groups/groupPage/GroupLocation";

import bannerMapBackground from "@agir/groups/groupPage/images/banner-map-background.svg";

const StyledModalBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-items: stretch;
  max-width: 600px;
  padding: 0;
  margin: 100px auto 0;
  background-color: white;
  box-shadow: ${style.elaborateShadow};
  border-radius: 8px;

  @media (max-width: ${style.collapse}px) {
    max-width: calc(100% - 20px);
    margin: 10px auto 0;
    padding-bottom: 10px;
  }

  && > * {
    border: none;
    box-shadow: none;
    margin: 0;
  }

  && > button {
    display: inline-flex;
    width: 2.5rem;
    height: 2.5rem;
    flex: 0 0 2.5rem;
    align-self: flex-end;
    background: none;
    cursor: pointer;
    color: ${style.black1000};

    &:hover {
      opacity: 0.75;
    }
  }

  && > button + * {
    padding-top: 0;
    padding-bottom: 2.5rem;
  }
`;
const StyledMap = styled.div``;
const StyledBanner = styled.div`
  display: flex;
  flex-flow: row-reverse nowrap;
  background-color: ${style.secondary500};
  margin: 0 auto;

  @media (max-width: ${style.collapse}px) {
    max-width: 100%;
    flex-flow: column nowrap;
    background-color: white;
  }

  header {
    flex: 1 1 auto;
    padding: 2.25rem;

    @media (max-width: ${style.collapse}px) {
      padding: 1.5rem 1.5rem 1.25rem;
      text-align: center;
    }
  }

  h2,
  h4 {
    margin: 0;
    &::first-letter {
      text-transform: uppercase;
    }
  }

  h2 {
    font-weight: 700;
    font-size: 1.75rem;
    line-height: 1.419;
    margin-bottom: 0.5rem;

    @media (max-width: ${style.collapse}px) {
      font-size: 1.25rem;
      line-height: 1.519;
    }
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1.5;

    @media (max-width: ${style.collapse}px) {
      font-size: 0.875rem;
    }

    button {
      background-color: transparent;
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      padding: 0;
      margin: 0;
      outline: none;
      border: none;
      cursor: pointer;
    }
  }

  ${StyledMap} {
    flex: 0 0 424px;
    clip-path: polygon(100% 0%, 100% 100%, 0% 100%, 11% 0%);
    cursor: pointer;

    @media (max-width: ${style.collapse}px) {
      clip-path: none;
      width: 100%;
      flex-basis: 155px;
      background-image: url(${bannerMapBackground});
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }
`;

const GroupBanner = (props) => {
  const { name, type, location, commune, iconConfiguration } = props;
  const [shouldShowModal, setShouldShowModal] = useState();

  const subtitle = useMemo(
    () => getGroupTypeWithLocation(type, location, commune),
    [type, location, commune]
  );

  const openModal = useCallback(() => {
    setShouldShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShouldShowModal(false);
  }, []);

  const hasMap =
    location.coordinates && Array.isArray(location.coordinates.coordinates);

  return (
    <StyledBanner>
      <StyledMap onClick={hasMap ? openModal : undefined}>
        {hasMap && (
          <Map
            zoom={11}
            center={location.coordinates.coordinates}
            iconConfiguration={iconConfiguration}
            isStatic
          />
        )}
      </StyledMap>
      {hasMap && (
        <Modal shouldShow={shouldShowModal} onClose={closeModal} noScroll>
          <StyledModalBody>
            <button onClick={closeModal} aria-label="Fermer">
              <RawFeatherIcon name="x" width="1.5rem" heigth="1.5rem" />
            </button>
            <GroupLocation {...props} />
          </StyledModalBody>
        </Modal>
      )}
      <header>
        <h2>{name}</h2>
        <h4>
          {hasMap ? <button onClick={openModal}>{subtitle}</button> : subtitle}
        </h4>
      </header>
    </StyledBanner>
  );
};
GroupBanner.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  iconConfiguration: PropTypes.object,
  location: PropTypes.shape({
    name: PropTypes.string,
    address1: PropTypes.string,
    address2: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    state: PropTypes.string,
    country: PropTypes.string,
    coordinates: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
  }).isRequired,
  commune: PropTypes.shape({
    nameOf: PropTypes.string,
  }),
};
export default GroupBanner;
