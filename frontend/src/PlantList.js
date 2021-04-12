import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  checkPlant,
  checkPlants,
  patchWaterPlants,
  refreshPlants,
} from "./Actions";
import { bindActionCreators } from "redux";
import "./PlantList.css";

function mapstateToProps(state) {
  console.log("mapped");
  if (state.plants != undefined) {
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
    console.log("checking all plants");
    this.props.checkAllPlantsAction(canWaterDateTime);
  }
  waterPlantsHandler() {
    this.props.waterPlantsAction(this.props.plants);
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
        <Table striped hover variant="dark" size="sm">
          <thead>
            <tr>
              <th className="text-center">
                <Form.Check
                  onClick={() => {
                    this.checkAllPlantsHandler(canWaterDateTime);
                  }}
                  onChange={this.onStateFieldChange}
                ></Form.Check>
              </th>
              <th className="text-left">Name</th>
              <th className="text-left">Last Watered</th>
              <th>Watering Progress</th>
            </tr>
          </thead>
          <tbody>
            {this.props.plants.map((plant) => {
              // setup the progress bar
              var waterPercent = 0;
              if(plant.isWatering){
                var timeSinceLastWater = new Date(plant.timeSinceLastWater);
                console.log("test date: " + timeSinceLastWater.getSeconds());
                console.log("test date: 2" + currentDateTime.getSeconds());
                waterPercent = (currentDateTime.getSeconds() - timeSinceLastWater.getSeconds()) * 10;
              }

              waterDate = new Date(plant.timeSinceLastWater);
              isCheckboxDisabled = false;
              if (needToWaterDateTime >= waterDate) {
                dateClass = "urgentWater";
              } else if (canWaterDateTime >= waterDate) {
                dateClass = "canWater";
              } else {
                dateClass = "cannotWater";
                isCheckboxDisabled = true;
              }
              return (
                <tr key={plant.plantId}>
                  <td className="text-center">
                    <Form.Check
                      name={plant.plantId}
                      disabled={isCheckboxDisabled}
                      onChange={this.onStateFieldChange}
                      checked={plant.isChecked}
                      onClick={() => {
                        this.checkPlantHandler(plant.plantId);
                      }}
                    ></Form.Check>
                  </td>
                  <td className="text-left">{plant.plantName}</td>
                  <td className={dateClass}>
                    {waterDate.toLocaleTimeString()}
                  </td>
                  <td className="align-middle progressBarOuter">
                    <div
                      className="progressBar"
                      style={{ width: waterPercent + "%" }}
                    ></div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button variant="primary" onClick={() => this.waterPlantsHandler()}>
          Water Plants
        </Button>
      </>
    );
  }
}
export default withRouter(
  connect(mapstateToProps, mapDispatchToProps)(PlantList)
);
