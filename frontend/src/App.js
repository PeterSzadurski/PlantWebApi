import logo from "./logo.svg";
//import "./App.css";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import React from "react";
import { bindActionCreators } from "redux";
import PlantList from "./PlantList";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
function mapstateToProps(state) {
  if (state.plants != undefined) {
    return {
      plants: state.plants,
    };
  } else {
    return {
      plants: [],
    };
  }
}
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      // getPlants: getPlantsAction
    },
    dispatch
  );

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Plants: [],
    };
    this.loadPlantHandler = this.loadPlantHandler.bind(this);
  }

  loadPlantHandler() {
    this.props.loadData();
  }

  render() {
    return (
      <Container fluid>
        <div>
          <h1>plan</h1>
            <PlantList plants={this.props.plants}></PlantList>
        </div>
      </Container>
    );
  }
}
//function mapDispatchToProps(dispatch, props) {
//
//  return {
//    loadData: (plants) => {
//      console.log("dispatch");
//      dispatch({
//        type: ActionEnum.LOAD_PLANTS, plants
//      });
//      props.history.push("/");
//    },
//  };
//}

export default withRouter(connect(mapstateToProps, mapDispatchToProps)(App));
