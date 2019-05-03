import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import BackNavigation from "./BackNavigation";
import SignUpForm from "./SignUpForm";
import Texts from "../Constants/Texts";
import withLanguage from "./LanguageContext";
import LoadingSpinner from "./LoadingSpinner";

class SignUpScreen extends React.Component {
  render() {
    const { signingUp } = this.props;
    const texts = Texts[this.props.language].signUpScreen;
    return (
      <React.Fragment>
        {signingUp ? <LoadingSpinner /> : <div />}
        <BackNavigation
          title={texts.backNavTitle}
          onClick={() => this.props.history.goBack()}
        />
        <div id="signUpContainer">
          <div className="row no-gutters" id="accountQuestion">
            <div className="center">
              <h1>{texts.accountQuestion}</h1>
              <Link to="/login" id="alreadyHaveAccount">
                {texts.logIn}
              </Link>
            </div>
          </div>
          <SignUpForm />
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { signingUp } = state.registration;
  return {
    signingUp
  };
}

export default connect(mapStateToProps)(withLanguage(SignUpScreen));
