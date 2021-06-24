import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import useSWR from "swr";

import style from "@agir/front/genericComponents/_variables.scss";

import Button from "@agir/front/genericComponents/Button";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import ShareLink from "@agir/front/genericComponents/ShareLink.js";
import Spacer from "@agir/front/genericComponents/Spacer.js";
import HeaderPanel from "./HeaderPanel";
import SpendingRequests from "./SpendingRequests";

import { StyledTitle } from "./styledComponents.js";

import { getGroupPageEndpoint } from "@agir/groups/groupPage/api.js";
import { useGroup } from "@agir/groups/groupPage/hooks/group.js";
import { useGroupWord } from "@agir/groups/utils/group";

const DonationSkeleton = styled.p`
  height: 36px;
  margin-bottom: 10px;
  width: 50%;
  background-color: ${style.black50};
`;

const GroupFinancePage = (props) => {
  const { onBack, illustration, groupPk } = props;

  const group = useGroup(groupPk);
  const withGroupWord = useGroupWord(group);
  const { data } = useSWR(getGroupPageEndpoint("getFinance", { groupPk }));

  return (
    <>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle
        style={{ fontSize: "1.25rem" }}
      >{withGroupWord`Dons alloués à mon groupe`}</StyledTitle>
      <PageFadeIn ready={!!data} wait={<DonationSkeleton />}>
        <p style={{ fontSize: "2rem", margin: 0 }}>
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(data?.donation / 100)}
        </p>
        <Spacer size=".5rem" />
        {data?.donation === 0 && (
          <p style={{ color: style.black700 }}>
            Personne n'a encore alloué de dons à vos actions.
          </p>
        )}
      </PageFadeIn>
      <p style={{ color: style.black700 }}>
        Vous pouvez allouer des dons à vos actions sur la{" "}
        <a href="/dons/">page de dons</a>.
      </p>
      <p>
        <Button as="a" href={group?.routes?.donations} color="secondary">
          Allouer un don
        </Button>
      </p>

      <PageFadeIn ready={!!data}>
        <Spacer size="2rem" />
        <StyledTitle style={{ fontSize: "1.25rem" }}>
          Demandes de dépense
        </StyledTitle>
        <p style={{ color: style.black700 }}>
          Vous pouvez déjà créer une demande, mais vous ne pourrez la faire
          valider que lorsque votre allocation sera suffisante.
        </p>
        <Spacer size=".5rem" />
        <SpendingRequests
          spendingRequests={data?.spendingRequests}
          newSpendingRequestLink={group?.routes?.createSpendingRequest}
        />
      </PageFadeIn>

      <Spacer size="3rem" />

      <StyledTitle style={{ fontSize: "1.25rem" }}>
        {withGroupWord`Solliciter des dons pour mon groupe`}
      </StyledTitle>

      <p style={{ color: style.black700 }}>
        {withGroupWord`Partagez ce lien pour solliciter des dons pour votre groupe :`}
      </p>

      <ShareLink
        color="primary"
        label="Copier le lien"
        url={group?.routes?.donations}
        $wrap={400}
      />
    </>
  );
};
GroupFinancePage.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  groupPk: PropTypes.string,
};
export default GroupFinancePage;
