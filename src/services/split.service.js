import { mainApi } from "../assets/axios";

export const selectSplitMethod = async(billId,splitMethod)=>{
const response = await mainApi.patch(`/split/${billId}/split-method`,{splitMethod});

return response.data
}