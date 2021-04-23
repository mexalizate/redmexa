import PropTypes from "prop-types";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { useIsDesktop } from "@agir/front/genericComponents/grid";
import style from "@agir/front/genericComponents/_variables.scss";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

const StyledMenuItem = styled.button`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
  align-items: center;
  background-color: transparent;
  text-align: left;
  border: none;
  margin: 0;
  padding: 0;
  font-size: 1rem;
  line-height: 1.1;
  font-weight: 500;
  color: ${({ disabled }) => (disabled ? style.black500 : style.black1000)};
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  & > * {
    margin: 0;
    padding: 0;
  }

  span {
    flex: 1 1 auto;
    color: ${({ active }) => (active ? style.primary500 : "")};
  }

  small {
    font-size: 0.75rem;
  }

  ${RawFeatherIcon} {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background-color: ${({ disabled, active }) => {
      if (disabled) return style.black100;
      if (active) return style.primary500;
      return style.secondary500;
    }};
    color: ${({ disabled, active }) => {
      if (disabled) return style.black500;
      if (active) return "#fff";
      return style.black1000;
    }};
    margin-right: 1rem;
    clip-path: circle(1rem);
    text-align: center;
  }
`;

const StyledMenu = styled.div`
  width: 100%;
  height: 100vh;
  overflow: auto;
  padding: 1.5rem;
  background-color: ${style.black25};
  box-shadow: inset -1px 0px 0px #dfdfdf;
  position: fixed;

  @media (min-width: ${style.collapse}px) {
    width: 360px;
    max-width: 30%;
  }

  h4 {
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1.51;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5rem 0;
    }

    hr {
      border-color: ${style.black200};
      margin: 0.5rem 0;
    }
  }
`;

const ManagementMenuItem = (props) => {
  const { object, item, onClick, active } = props;

  const handleClick = useCallback(() => {
    onClick && onClick(item);
  }, [item, onClick]);

  const disabled = useMemo(
    () =>
      typeof item.disabled === "function"
        ? item.disabled(object)
        : !!item.disabled,
    [object, item]
  );

  const label = useMemo(
    () => (item.labelFunction ? item.labelFunction(object) : item.label),
    [object, item]
  );

  return (
    <StyledMenuItem onClick={handleClick} disabled={disabled} active={!!active}>
      <RawFeatherIcon width="1rem" height="1rem" name={item.icon} />
      <span>
        {label}
        <br />
        {disabled && item.disabledLabel && <small>{item.disabledLabel}</small>}
      </span>
    </StyledMenuItem>
  );
};
ManagementMenuItem.propTypes = {
  object: PropTypes.object,
  item: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    disabledLabel: PropTypes.string,
    icon: PropTypes.string,
    disabled: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  }),
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  component: PropTypes.elementType,
};

const ManagementMenu = (props) => {
  const { object, items, title, selectedItem, onSelect } = props;

  const isDesktop = useIsDesktop();
  const SEPARATOR = 3;

  return (
    <StyledMenu>
      <h4>{title}</h4>
      <ul>
        {Object.values(items).map((item, index) => (
          <>
            {SEPARATOR === index && <hr />}
            <li key={item.id}>
              <ManagementMenuItem
                object={object}
                item={item}
                onClick={() => onSelect(item.id)}
                active={selectedItem === item.id && isDesktop}
              />
            </li>
          </>
        ))}
      </ul>
    </StyledMenu>
  );
};
ManagementMenu.propTypes = {
  title: PropTypes.string,
  object: PropTypes.object,
  items: PropTypes.arrayOf(typeof ManagementMenuItem.item),
};

export default ManagementMenu;
