import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {
  checkPlant,
  checkPlants,
  patchWaterPlants,
  refreshPlants,
  cancelWater
} from "./Actions";
import { bindActionCreators } from "redux";
import "./PlantList.css";

function mapstateToProps(state) {
  if (state.plants !== undefined) {
    return {
      plants: state.plants,
    };
  } else {
    return {
      plants: [],
      selectPlants: [],
    };
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      checkPlantAction: checkPlant,
      checkAllPlantsAction: checkPlants,
      waterPlantsAction: patchWaterPlants,
      refreshPlantsAction: refreshPlants,
      cancelWaterAction: cancelWater
    },
    dispatch
  );
class PlantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlants: [],
    };
    this.checkPlantHandler = this.checkPlantHandler.bind(this);
    this.checkAllPlantsHandler = this.checkAllPlantsHandler.bind(this);
    this.onStateFieldChange = this.onStateFieldChange.bind(this);
    this.waterPlantsHandler = this.waterPlantsHandler.bind(this);
    this.cancelWaterHandler = this.cancelWaterHandler.bind(this);
  }

  componentDidMount() {
    // refesh the plants every second, pass the plants to keep the checkboxes
    this.refreshTimer = setInterval(
      () => this.props.refreshPlantsAction(this.props.plants),
      1000
    );
  }
  componentWillUnmount() {
    clearInterval(this.refreshTimer);
    this.refreshTimer = null;
  }

  checkPlantHandler(plantId) {
    this.props.checkPlantAction(plantId);
  }
  checkAllPlantsHandler(canWaterDateTime) {
    this.props.checkAllPlantsAction(canWaterDateTime);
  }
  waterPlantsHandler() {
    this.props.waterPlantsAction(this.props.plants);
  }
  cancelWaterHandler(plantId) {
    this.props.cancelWaterAction(this.props.plants, plantId);
  }
  onStateFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    var waterDate = "";
    var dateClass = "";
    var isCheckboxDisabled = false;
    // setup the comparison dates
    const needToWaterDateTime = new Date();
    needToWaterDateTime.setHours(needToWaterDateTime.getHours() - 6);
    const canWaterDateTime = new Date();
    canWaterDateTime.setSeconds(canWaterDateTime.getSeconds() - 30);
    const currentDateTime = new Date();

    return (
      <>
        <Container className="plantContainer" fluid>
          <Row className="plantHead">
            <Col xs="auto">
              <Form.Check
                onClick={() => {
                  this.checkAllPlantsHandler(canWaterDateTime);
                }}
              ></Form.Check>
            </Col>
            <Col>Plant Name</Col>
            <Col xs="auto">Time Last Watered</Col>
            <Col className="float-left">Watering Progress</Col>
          </Row>
          {this.props.plants.map((plant) => {
            // setup the progress bar
            var waterPercent = 0;
            if (plant.isWatering) {
              var timeSinceLastWater = new Date(plant.startTimeOfCurrentWater);
              waterPercent =
                Math.abs(
                  currentDateTime.getTime() - timeSinceLastWater.getTime()
                ) * 0.01;
            }
            waterDate = new Date(plant.timeSinceLastWater);
            isCheckboxDisabled = false;
            if (needToWaterDateTime >= waterDate) {
              dateClass = "urgentWater";
            }
            else if ((waterDate > canWaterDateTime) || plant.isWatering) {
              dateClass = "cannotWater";
              isCheckboxDisabled = true;
            }
            else if (canWaterDateTime >= waterDate) {
              dateClass = "canWater";
            } 
            return (
              <Row className="plantRow" key={plant.plantId}>
                <Col>
                  <Form.Check
                    name={plant.plantId}
                    disabled={isCheckboxDisabled}
                    onChange={this.onStateFieldChange}
                    checked={plant.isChecked}
                    onClick={() => {
                      this.checkPlantHandler(plant.plantId);
                    }}
                  ></Form.Check>
                </Col>
                <Col>{plant.plantName}</Col>
                <Col xs="auto" className={dateClass + " text-left"}>
                  {waterDate.toLocaleTimeString()}
                </Col>
                <Row>
                  <Col xs={9} className="progressBarOuter">
                    <div
                      className="progressBar"
                      style={{ width: waterPercent + "%" }}
                    ></div>
                  </Col>
                  <Col xs={3} hidden={!plant.isWatering}>
                    <Button variant="danger" size="sm" onClick={() => this.cancelWaterHandler(plant.plantId)}>Cancel Watering</Button>
                  </Col>
                </Row>
              </Row>
            );
          })}
          <Button variant="light" onClick={() => this.waterPlantsHandler()}>
            Water Plants
          </Button>
        </Container>
      </>
    );
  }
}
export default withRouter(
  connect(mapstateToProps, mapDispatchToProps)(PlantList)
);
