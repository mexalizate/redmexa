import _ from "gettext";
import PropTypes from "prop-types";
import React, { useState } from "react";

import Button from "@agir/front/genericComponents/Button";
import ModalConfirmation from "@agir/front/genericComponents/ModalConfirmation";
import ShareLink from "@agir/front/genericComponents/ShareLink";
import Spacer from "@agir/front/genericComponents/Spacer";
import StyledDialog from "./StyledDialog";
import { RawFeatherIcon } from "@agir/front/genericComponents/FeatherIcon";

export const JoinGroup = (props) => {
  const {
    id,
    step,
    isLoading,
    groupName,
    groupReferents,
    groupContact,
    personName,
    personalInfoConsent,
    onJoin,
    onUpdate,
    onClose,
    openMessageModal,
  } = props;

  switch (step) {
    case 1:
      return (
        <StyledDialog>
          <header>
            <h3>{_("Rejoindre")} {groupName}</h3>
          </header>
          <article>
            {_("Les animateur·ices seront informé·es de votre arrivée et vous pourrez rencontrer les membres du groupe&nbsp;!")}
          </article>
          <footer>
            <Button
              disabled={isLoading}
              loading={isLoading}
              onClick={onJoin}
              color="primary"
              block
              wrap
            >
              Unirme
            </Button>
            <Button disabled={isLoading} onClick={onClose} block wrap>
              Regresar
            </Button>
          </footer>
        </StyledDialog>
      );
    case 2: {
      let referentNames = groupReferents
        .map((referent, i) => {
          if (i === 0) {
            return referent.displayName;
          }
          if (i === groupReferents.length - 1) {
            return " et " + referent.displayName;
          }
          return ", " + referent.displayName;
        })
        .join("");

      const givePersonalInfoConsent = () =>
        onUpdate({ personalInfoConsent: true });

      const denyPersonalInfoConsent = () =>
        onUpdate({ personalInfoConsent: false });

      return (
        <StyledDialog>
          <header>
            <h3>Te damos la bienvenida  {personName}&nbsp;!&nbsp;👍</h3>
          </header>
          <article>
            <strong>
              Conoce a {referentNames} responsables de facilitar este grupo.
            </strong>
            <Spacer size=".5rem" />
            Comparte tus datos (nombre, teléfono, dirección) para que puedan contactarte.
            <Spacer size=".5rem" />
            {_("Vous pourrez retirer cette autorisation à tout moment. C'est maintenant que tout se joue&nbsp;!")}
          </article>
          <footer>
            <Button
              disabled={isLoading}
              loading={isLoading}
              onClick={givePersonalInfoConsent}
              block
              wrap
            >
              Compartir mis datos de contacto con {referentNames}
            </Button>
            <Button
              disabled={isLoading}
              onClick={denyPersonalInfoConsent}
              block
              wrap
            >
              {_("Passer cette étape")}
            </Button>
          </footer>
        </StyledDialog>
      );
    }
    case 3: {
      return (
        <StyledDialog>
          <header>
            <h3>Puedes presentarte</h3>
          </header>
          <article>
            <strong>
              {personalInfoConsent
                ? ("Listo, l@s facilitadores del grupo podrán contactarte por la mensajería de Claudialízate, por email o por teléfono.")
                : ("Listo, l@s facilitadores del grupo podrán contactarte por la mensajería de Claudialízate  o por email.")}
            </strong>
            <Spacer size=".5rem" />
              ¡Envíales un mensaje para presentarte!
            <Spacer size="1rem" />
            <footer>
              {openMessageModal ? (
                <Button
                  color="primary"
                  block
                  wrap
                  onClick={openMessageModal}
                  icon="mail"
                >
                  {_("Je me présente&nbsp;!")}
                </Button>
              ) : (
                <ShareLink
                  label="Copier"
                  color="primary"
                  url={groupContact.email}
                  $wrap
                />
              )}
              <Button disabled={isLoading} onClick={onClose} block wrap>
                {_("Plus tard")}
              </Button>
            </footer>
          </article>
        </StyledDialog>
      );
    }
    default:
      return null;
  }
};

JoinGroup.propTypes = {
  step: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  personName: PropTypes.string.isRequired,
  groupName: PropTypes.string.isRequired,
  groupReferents: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  personalInfoConsent: PropTypes.bool,
  onJoin: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  openMessageModal: PropTypes.func,
};

const JoinGroupDialog = (props) => {
  const { step, isLoading, onClose } = props;

  return (
    <ModalConfirmation
      shouldShow={step > 0}
      onClose={!isLoading ? onClose : undefined}
      shouldDismissOnClick={false}
    >
      <JoinGroup {...props} />
    </ModalConfirmation>
  );
};

JoinGroupDialog.propTypes = {
  step: PropTypes.number.isRequired,
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default JoinGroupDialog;
