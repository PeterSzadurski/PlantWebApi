import {
  LOAD_PLANTS,
  LOAD_PLANTS_SUCCESS,
  CHECK_PLANTS,
  CHECK_PLANT,
  LOAD_PLANTS_WAIT,
  WATER_PLANT,
} from "./Actions";
import { Plant } from "./Plant";
const initialState = {
  waiting: false,
  plants: [],
  responseCode: -1,
};

export function reducer(state = initialState, action) {
  console.log("reducer");

  switch (action.type) {
    case WATER_PLANT:
      return state;
    case LOAD_PLANTS_SUCCESS: {
      const plants = [];
      for (var i = 0; i < action.payload.plants.data.length; i++) {
        const plant = new Plant();
        plant.plantId = action.payload.plants.data[i].plantId;
        plant.plantName = action.payload.plants.data[i].plantName;
        plant.timeSinceLastWater =
          action.payload.plants.data[i].timeSinceLastWater;
        plant.isWatering = action.payload.plants.data[i].isWatering;
        plant.isChecked = false;
        plants.push(plant);
      }
      return Object.assign({}, state, {
        plants: plants,
        responseCode: action.payload.plants.status,
      });
    }
    case CHECK_PLANT:
      if (state.plants.length > 0) {
        for (var i = 0; i < state.plants.length; i++) {
          if (state.plants[i].plantId === action.payload) {
            state.plants[i].isChecked = !state.plants[i].isChecked;
            console.log("changed");
          }
        }
        return state;
      }
    case CHECK_PLANTS:
      console.log("checking plants")
      for (var i = 0; i < state.plants.length; i++) {
          state.plants[i].isChecked = !state.plants[i].isChecked;
        
      }
      return state;

    default:
      return state;
  }
}