import _ from "gettext";
import PropTypes from "prop-types";
import React from "react";

import Link from "@agir/front/app/Link";

import GenericCardContainer from "./GenericCardContainer";

const ReferralUpdateCard = (props) => {
  const {
    id,
    individual,
    routes,
    meta: { totalReferrals },
  } = props;

  if (totalReferrals < 5) {
    return (
      <GenericCardContainer {...props}>
        {_("Grâce à vous,")} <strong>{individual?.displayName}</strong> {_("a rejoint")}{" "}
        <em>{_("Action populaire")}</em>.
        <br />
        {_("Merci beaucoup, continuez à partager !")} 👍
      </GenericCardContainer>
    );
  }
  if (totalReferrals === 5) {
    return (
      <GenericCardContainer {...props}>
        {_("5 personnes ont rejoint <em>Action populaire</em> grâce à vous !  Continuez d'inviter vos amis à partager leur lien personnalisé à leur tour !")}
      </GenericCardContainer>
    );
  }
  if (totalReferrals < 10) {
    return (
      <GenericCardContainer {...props}>
        {_("Encore un !")} <strong>{individual?.displayName}</strong> {_("a rejoint")}{" "}
        <em>{_("Action populaire")}</em>.
        <br />
        {_("C'est super, vous avez fait rejoindre")} {totalReferrals} {_("personnes")}&nbsp;!
        {_("Continuez comme ça")}&nbsp;! 😀
      </GenericCardContainer>
    );
  }
  if (totalReferrals === 10) {
    return (
      <GenericCardContainer {...props}>
        {_("Vous avez convaincu 10 personnes de rejoindre")} <em>{_("Action populaire")}</em>
        &nbsp;! {_("Quel est votre secret")}&nbsp;?!
        <br />
        {_("Si vous n'y aviez pas encore songé, il est peut-être temps de")}{" "}
        <Link
          href={`/activite/${id}/lien/`}
          params={{ next: routes.createGroup }}
        >
          {_("créer un groupe d'action dans votre commune")}
        </Link>{" "}
        ;)
      </GenericCardContainer>
    );
  }
  if (totalReferrals === 20) {
    return (
      <GenericCardContainer {...props}>
        {_("Grâce à vous, 20 personnes ont rejoint")} <em>{_("Action populaire")}</em>&nbsp;!
        <br />
        {_("Beau travail")}&nbsp;! {_("Prochaine étape")}&nbsp;:{" "}
        <Link route="createEvent">{_("organiser un événement en ligne")}</Link>&nbsp;!
      </GenericCardContainer>
    );
  }
  return (
    <GenericCardContainer {...props}>
      {_("Et de")} {totalReferrals}&nbsp;! <strong>{individual?.displayName}</strong> {_("a rejoint")} <em>{_("Action populaire")}</em>. {_("Génial")}&nbsp;! 😍
    </GenericCardContainer>
  );
};
ReferralUpdateCard.propTypes = {
  id: PropTypes.number.isRequired,
  individual: PropTypes.shape({
    displayName: PropTypes.string,
  }),
  meta: PropTypes.shape({
    totalReferrals: PropTypes.number.isRequired,
  }).isRequired,
  routes: PropTypes.shape({
    createGroup: PropTypes.string,
  }),
};

export default ReferralUpdateCard;
