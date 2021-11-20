import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import axios from "axios";
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import Texts from "../Constants/Texts";
import Log from "./Log";
import withLanguage from "./LanguageContext";
import GroupMaterialsNavbar from "./GroupMaterialsNavbar";
import DisplayText from "./GroupMaterialNotFound";
import GroupMaterialOffersList from "./GroupMaterialOffersList";

const styles = {
  add: {
    position: "absolute",
    right: 0,
    bottom: 0,
    height: "5rem",
    width: "5rem",
    borderRadius: "50%",
    border: "solid 0.5px #999",
    backgroundColor: "#ff6f00",
    zIndex: 100,
    fontSize: "2rem",
  },
};

const getGroup = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return {
        name: "",
        group_id: "",
      };
    });
};

const fetchMaterialOffers = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/materialOffers`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

const fetchMaterialRequests = (groupId) => {
  return axios
    .get(`/api/groups/${groupId}/materialRequests`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      Log.error(error);
      return [];
    });
};

class GroupMaterials extends React.Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    const { groupId } = match.params;

    this.state = {
      groupId,
      showAddOptions: false,
      fetchedData: false,
    };
  }

  async componentDidMount() {
    const { groupId } = this.state;
    const group = await getGroup(groupId);
    const materialOffers = await fetchMaterialOffers(groupId);
    const materialRequests = await fetchMaterialRequests(groupId);
    this.setState({
      group,
      fetchedData: true,
      materialOffers: materialOffers,
      materialRequests: materialRequests,
    });
  }

  add = () => {
    const { history } = this.props;
    const currentPath = history.location.pathname;
    const {
      group: { group_id: groupId },
    } = this.state;
    const parentPath = `/groups/${groupId}`;
    const path =
      currentPath === `${parentPath}/materials/offers`
        ? `${parentPath}/materials/offers/create`
        : `${parentPath}/materials/requests/create`;
    history.push(path);
  };

  render() {
    const { materialOffers, materialRequests, fetchedData } = this.state;
    const { language, history, classes } = this.props;
    const texts = Texts[language].groupMembers;
    const materialsPath = `/groups/${this.state.groupId}/materials`;
    return fetchedData ? (
      <React.Fragment>
        <GroupMaterialsNavbar />
        <div
          className="row no-gutters"
          style={{
            bottom: "4rem",
            right: "7%",
            zIndex: 100,
            position: "fixed",
          }}
        >
          <Fab
            color="primary"
            aria-label="Add"
            className={classes.add}
            onClick={this.add}
          >
            <i className="fas fa-plus" />
          </Fab>
        </div>
        <div id="groupMaterialsContainer">
          <div className="row no-gutters" id="groupMembersHeaderContainer">
            <div className="col-2-10">
              <button
                type="button"
                className="transparentButton center"
                onClick={() => history.goBack()}
              >
                <i className="fas fa-arrow-left" />
              </button>
            </div>
            <div className="col-7-10 ">
              {/*sposta il testo in texts metti group.name?*/}
              <h1 className="verticalCenter">Offerta e richiesta materiali</h1>
            </div>
          </div>
          <Switch>
            <Route
              path={`${materialsPath}/requests`}
              render={(props) => (
                <React.Fragment>
                  {materialRequests.length === 0 ? (
                    <DisplayText
                      text="Non ci sono richieste da mostrare"
                      {...props}
                    />
                  ) : (
                    <Componente />
                  )}
                </React.Fragment>
              )}
            />
            <Route
              path={`${materialsPath}/offers`}
              render={(props) => (
                <React.Fragment>
                  {materialOffers.length === 0 ? (
                    <DisplayText
                      text="Non ci sono offerte da mostrare"
                      {...props}
                    />
                  ) : (
                    <div
                      style={{ top: "11rem" }}
                      id="groupActivitiesContainer"
                      className="horizontalCenter"
                    >
                      <GroupMaterialOffersList
                        materials={materialOffers}
                        group={this.state.groupId}
                      />
                    </div>
                  )}
                </React.Fragment>
              )}
            />
          </Switch>
        </div>
      </React.Fragment>
    ) : (
      <LoadingSpinner />
    );
  }
}

const Componente = () => {
  return <div>testo</div>;
};

GroupMaterials.propTypes = {
  group: PropTypes.object,
  userIsAdmin: PropTypes.bool,
  classes: PropTypes.object,
  language: PropTypes.string,
  history: PropTypes.object,
};

export default withRouter(withLanguage(withStyles(styles)(GroupMaterials)));
