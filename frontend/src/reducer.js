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
  console.log("reducer");

  switch (action.type) {
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
    case REFRESH_PLANTS_SUCCESS: {
      const plants = [];
      for (var i = 0; i < action.payload.plants.data.length; i++) {
        const plant = new Plant();
        plant.plantId = action.payload.plants.data[i].plantId;
        plant.plantName = action.payload.plants.data[i].plantName;
        plant.timeSinceLastWater =
          action.payload.plants.data[i].timeSinceLastWater;
        plant.isWatering = action.payload.plants.data[i].isWatering;
        console.log(action.oldPlants[i].isChecked);
        const checkTrue = (action.oldPlants[i].isChecked == 'true');
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
        for (var i = 0; i < state.plants.length; i++) {
          if (state.plants[i].plantId === action.payload) {
            state.plants[i].isChecked = !state.plants[i].isChecked;
          }
        }
        return state;
      }
    case CHECK_PLANTS:
      for (var i = 0; i < state.plants.length; i++) {
        const waterDate = new Date(state.plants[i].timeSinceLastWater);
        if (action.payload >= waterDate) {
          state.plants[i].isChecked = !state.plants[i].isChecked;
        }
      }
      return state;

    default:
      return state;
  }
}
