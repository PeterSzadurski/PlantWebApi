import {
  LOAD_PLANTS_SUCCESS,
  CHECK_PLANTS,
  CHECK_PLANT,
  REFRESH_PLANTS_SUCCESS,
} from "./Actions";
import { Plant } from "./Plant";
const initialState = {
  waiting: false,
  plants: [],
  responseCode: -1,
};


export function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_PLANTS_SUCCESS: {
      const plants = [];
      for (var x = 0; x < action.payload.plants.data.length; x++) {
        const plant = new Plant();
        plant.plantId = action.payload.plants.data[x].plantId;
        plant.plantName = action.payload.plants.data[x].plantName;
        plant.timeSinceLastWater =
          action.payload.plants.data[x].timeSinceLastWater;
        plant.isWatering = action.payload.plants.data[x].isWatering;
        plant.isChecked = false;
        plant.startTimeOfCurrentWater =
          action.payload.plants.data[x].startTimeOfCurrentWater;
        plants.push(plant);
      }
      return Object.assign({}, state, {
        plants: plants,
        responseCode: action.payload.plants.status,
      });
    }
    case REFRESH_PLANTS_SUCCESS: {
      const plants = [];
      for (var i = 0; i < action.payload.plants.data.length; i++) {
        const plant = new Plant();
        plant.plantId = action.payload.plants.data[i].plantId;
        plant.plantName = action.payload.plants.data[i].plantName;
        plant.timeSinceLastWater =
          action.payload.plants.data[i].timeSinceLastWater;
        plant.startTimeOfCurrentWater =
          action.payload.plants.data[i].startTimeOfCurrentWater;
        plant.isWatering = action.payload.plants.data[i].isWatering;
        plant.isChecked = action.oldPlants[i].isChecked;

        plants.push(plant);
      }
      return Object.assign({}, state, {
        plants: plants,
        responseCode: action.payload.plants.status,
      });
    }
    case CHECK_PLANT:
      if (state.plants.length > 0) {
        for (var n = 0; n < state.plants.length; n++) {
          if (state.plants[n].plantId === action.payload) {
            state.plants[n].isChecked = !state.plants[n].isChecked;
          }
        }
        return state;
      }
      break;
    case CHECK_PLANTS:
      for (var y = 0; y < state.plants.length; y++) {
        const waterDate = new Date(state.plants[y].timeSinceLastWater);
        if (action.payload >= waterDate) {
          state.plants[y].isChecked = !state.plants[y].isChecked;
        }
      }
      return state;

    default:
      return state;
  }
}
