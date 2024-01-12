import _ from "gettext";
import PropTypes from "prop-types";
import React, { Fragment } from "react";
import useSWRImmutable from "swr/immutable";

import style from "@agir/front/genericComponents/_variables.scss";

import FileCard from "@agir/front/genericComponents/FileCard";
import HelpCenterCard from "@agir/front/genericComponents/HelpCenterCard";
import HeaderPanel from "@agir/front/genericComponents/ObjectManagement/HeaderPanel";
import { StyledTitle } from "@agir/front/genericComponents/ObjectManagement/styledComponents";
import PageFadeIn from "@agir/front/genericComponents/PageFadeIn";
import Skeleton from "@agir/front/genericComponents/Skeleton";
import Spacer from "@agir/front/genericComponents/Spacer";

import { getEventEndpoint } from "@agir/events/common/api";

const EventAssets = (props) => {
  const { onBack, illustration, eventPk } = props;

  const { data: eventAssets, isLoading } = useSWRImmutable(
    getEventEndpoint("getEventAssets", { eventPk }),
  );

  return (
    <div>
      <HeaderPanel onBack={onBack} illustration={illustration} />
      <StyledTitle>{"Información útil"}</StyledTitle>
      <Spacer size="1rem" />
      <span style={{ color: style.black700 }}>
        Encuentra información valiosa para ayudarte a organizar mejor tu acción.
      </span>
      <Spacer size="1rem" />
      <StyledTitle>{"Centro de ayuda"}</StyledTitle>
      <Spacer size=".5rem" />
      <HelpCenterCard type="event" />
      <Spacer size="1rem" />
      <StyledTitle>{_("Documents")}</StyledTitle>
      <Spacer size=".5rem" />
      <PageFadeIn
        ready={!isLoading}
        wait={
          <Skeleton style={{ height: "160px", margin: "0 0 1rem" }} boxes={3} />
        }
      >
        {Array.isArray(eventAssets) &&
          eventAssets.map((eventAsset) => (
            <Fragment key={eventAsset.id}>
              <FileCard
                title={eventAsset.name}
                text={`Format ${eventAsset.format} - ${eventAsset.size}`}
                icon="image"
                route={eventAsset.file}
                downloadLabel={_("Télécharger le visuel")}
              />
              <Spacer size="1rem" />
            </Fragment>
          ))}
        <FileCard
          title={"Guía para la realización de acciones"}
          text={
            "Contiene la información esencial para organizar acciones de todo tipo"
          }
          icon="file-text"
          route="attestationAssuranceEvent"
          downloadLabel={"Bajar la guía"}
        />
      </PageFadeIn>
      <Spacer size="2rem" />
    </div>
  );
};
EventAssets.propTypes = {
  onBack: PropTypes.func,
  illustration: PropTypes.string,
  eventPk: PropTypes.string,
};
export default EventAssets;
