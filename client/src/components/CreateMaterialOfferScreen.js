import React from "react";
import PropTypes from "prop-types";
import withLanguage from "./LanguageContext";
import Texts from "../Constants/Texts";
import BackNavigation from "./BackNavigation";
import CreateMaterialOfferStepper from "./CreateMaterialOfferStepper";

const CreateMaterialOfferScreen = ({ language, history }) => {
  const texts = Texts[language].createMaterialOfferScreen;
  return (
    <div id="createActivityContainer">
      <BackNavigation
        title={texts.backNavTitle}
        onClick={() => history.goBack()}
      />
      <CreateMaterialOfferStepper />
    </div>
  );
};

CreateMaterialOfferScreen.propTypes = {
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withLanguage(CreateMaterialOfferScreen);
