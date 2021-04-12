import axios from "axios";
import { ActionEnum, API_URL } from "./GlobalConsts";
import {LOAD_PLANTS, LOAD_PLANTS_WAIT} from "./Actions";
 function getPlants() {
    return dispatch => {
        dispatch(LOAD_PLANTS_WAIT());
        axios.get(API_URL + "/Plants/GetPlantListFromJson").then((result) => {
        //plants = result.data;
        dispatch(LOAD_PLANTS(result.data));
        return result.data;
        })
    }
}

export default getPlants;