import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { checkPlant, checkPlants } from "./Actions";
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
  }

  checkPlantHandler(plantId) {
    this.props.checkPlantAction(plantId);
  }
  checkAllPlantsHandler(canWaterDateTime) {
      console.log("checking all plants");
    this.props.checkAllPlantsAction(canWaterDateTime);
  }
  onStateFieldChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
      console.log("rendered");
    var waterDate = "";
    var dateClass = "";
    var isCheckboxDisabled = false;
    // setup the comparison dates
    const needToWaterDateTime = new Date();
    needToWaterDateTime.setHours(needToWaterDateTime.getHours() - 6);
    const canWaterDateTime = new Date();
    canWaterDateTime.setSeconds(canWaterDateTime.getSeconds() - 30);
    return (
        <>
      <Table striped hover variant="dark">
        <thead>
          <tr>
            <th>
              <Form.Check className="text-center" onClick={()=> {this.checkAllPlantsHandler(canWaterDateTime)}} onChange={this.onStateFieldChange}></Form.Check>
            </th>
            <th>Name</th>
            <th>Last Watered</th>
            <th>Watering Progress</th>
          </tr>
        </thead>
        <tbody>
          {this.props.plants.map((plant) => {
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
                <td>
                  <Form.Check
                    name={plant.plantId}
                    className="text-center"
                    disabled={isCheckboxDisabled}
                    onChange={this.onStateFieldChange}
                    checked={plant.isChecked}
                    onClick={() => {
                      this.checkPlantHandler(plant.plantId);
                    }}
                  ></Form.Check>
                </td>
                <td>{plant.plantName}</td>
                <td className={dateClass}>{waterDate.toLocaleTimeString()}</td>
                <td>{plant.isWatering.toString()}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <Button variant="primary">
          Water Plants
      </Button>
      </>
    );
  }
}
export default withRouter(
  connect(mapstateToProps, mapDispatchToProps)(PlantList)
);
