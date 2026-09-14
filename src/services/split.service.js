import { mainApi } from "../assets/axios";

export const selectSplitMethod = async (billId, splitMethod) => {
    const response = await mainApi.patch(
        `/split/${billId}/split-method`,
        { splitMethod });

    return response.data;
};

export const calculateEqualSplit = async (billId) => {
    const response = await mainApi.post(`/split/${billId}/equal`);

    return response.data;

}