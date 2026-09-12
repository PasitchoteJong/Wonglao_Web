import { mainApi } from "../assets/axios";



export const createBill = async (data) => {
    const response = await mainApi.post(`/bills`, data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export async function processBillOCR(billId){
    const response = await mainApi.post(`/ocr/bill/${billId}`);
    return response.data;
}


// Get bill detail with items
export async function getBillById(billId) {
    const response = await mainApi.get(`/bills/${billId}`);

    return response.data;
}

// Update bill items
export async function updateBillItems(billId, items) {
    const response = await mainApi.put(`/bills/${billId}/items`, {
        items: items.map(item => ({
            name: item.Name,
            price: parseFloat(item.Price) || 0,
            quantity: parseInt(item.Quantity) || 1
        }))
    });

    return response.data;
}

// Verify general bill details
export async function verifyBill(billId, formData) {
    const response = await mainApi.put(
        `/bills/${billId}/verify`,
        formData
    );

    return response.data;
}