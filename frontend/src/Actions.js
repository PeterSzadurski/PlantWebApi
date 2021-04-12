import axios from 'axios'
import {API_URL} from './GlobalConsts'
export const WATER_PLANT = 0;  
export const LOAD_PLANTS = 1;
export const LOAD_PLANTS_WAIT = 2;
export const LOAD_PLANTS_SUCCESS = 3;
export const CHECK_PLANT = 4;
export const CHECK_PLANTS = 5;

const fetchPlantsSuccess = plants  => ({
    type: LOAD_PLANTS_SUCCESS,
    payload: {plants}
});

const checkPlantSucess = plantId  => ({
    type: CHECK_PLANT,
    payload: plantId
});
const checkPlantsSucess = canWaterDateTime  => ({
    type: CHECK_PLANTS,
    payload: canWaterDateTime
});

export const fetchPlants  = () => {
    console.log("fetching plants");
    return async dispatch => {
        let plants = await axios.get(API_URL + "/Plants/GetPlantListFromJson");
        dispatch(fetchPlantsSuccess(plants));
    }
}

export const putInitPlants  = () => {
    console.log("setting plants");
    return async dispatch => {
        let plants = await axios.put(API_URL + "/Plants/PutDemoPlants");
        dispatch(fetchPlantsSuccess(plants));
    }
}

export const checkPlant = (plantId) => {
    return  dispatch => {
        dispatch(checkPlantSucess(plantId));
    }
}

export const checkPlants = (canWaterDateTime) => {
    return  dispatch => {
        dispatch(checkPlantsSucess(canWaterDateTime));
    }
}


