import axios from "axios";
import { API_URL } from "./GlobalConsts";
export const WATER_PLANTS = 0;
export const LOAD_PLANTS = 1;
export const LOAD_PLANTS_WAIT = 2;
export const LOAD_PLANTS_SUCCESS = 3;
export const CHECK_PLANT = 4;
export const CHECK_PLANTS = 6;
export const REFRESH_PLANTS = 7;
export const REFRESH_PLANTS_SUCCESS = 8;

const fetchPlantsSuccess = (plants) => ({
  type: LOAD_PLANTS_SUCCESS,
  payload: { plants },
});

const refreshPlantsSuccess = (oldPlants,plants) => (
    {
    type: REFRESH_PLANTS_SUCCESS,
    payload: { plants },
    oldPlants: oldPlants
  });
  

const checkPlantSucess = (plantId) => ({
  type: CHECK_PLANT,
  payload: plantId,
});
const checkPlantsSucess = (canWaterDateTime) => ({
  type: CHECK_PLANTS,
  payload: canWaterDateTime,
});


export const fetchPlants = () => {
  return async (dispatch) => {
    let plants = await axios.get(API_URL + "/Plants/GetPlantListFromJson");
    dispatch(fetchPlantsSuccess(plants));
  };
};

export const refreshPlants = (oldPlants) => {
    return async (dispatch) => {
      let plants = await axios.get(API_URL + "/Plants/GetPlantListFromJson");
      dispatch(refreshPlantsSuccess(oldPlants,plants));
    };
  };

export const patchWaterPlants = (plants) => {
  const requestData = [];
  for (var i = 0; i < plants.length; i++) {
    if (plants[i].isChecked) {
      var data = {};
      data.op = "add";
      data.path = "water";
      data.value = plants[i].plantId;
      requestData.push(data);
    }
  }
  return async (dispatch) => {
    let outputPlants = await axios.patch(
      API_URL + "/Plants/PatchWaterPlants",
      requestData,
      {
        headers: {
          "Content-Type": "application/json-patch+json",
          "Accept": "application/json",
        },
      }
    );
    dispatch(fetchPlantsSuccess(outputPlants));
  };
};

export const putInitPlants = () => {
  return async (dispatch) => {
    let plants = await axios.put(API_URL + "/Plants/PutDemoPlants");
    dispatch(fetchPlantsSuccess(plants));
  };
};

export const checkPlant = (plantId) => {
  return (dispatch) => {
    dispatch(checkPlantSucess(plantId));
  };
};

export const checkPlants = (canWaterDateTime) => {
  return (dispatch) => {
    dispatch(checkPlantsSucess(canWaterDateTime));
  };
};
