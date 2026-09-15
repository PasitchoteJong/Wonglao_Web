import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getFoodSelection,
  updateFoodSelection
} from "../services/foodSplitting.service";

const FoodSplitting = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [selections, setSelections] = useState({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFoodSelection(billId);
        setBill(result.data);

        const initialSelections = {};

        result.data.items.forEach((item) => {
          initialSelections[item.id] = item.eating;
        });

        setSelections(initialSelections);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [billId]);

  const handleToggle = (itemId) => {
    setSelections((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSelectAll = () => {
    const allSelected = bill.items.every((item) => selections[item.id]);

    const newSelections = {};

    bill.items.forEach((item) => { newSelections[item.id] = !allSelected; });

    setSelections(newSelections);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const selectionData = bill.items.map((item) => ({
        billItemId: item.id,
        eating: selections[item.id] ?? false
      }));

      await updateFoodSelection(billId, selectionData);

      navigate(`/food-splitting/${billId}/waiting`);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => { navigate(`/join-bill/${billId}`); };

  if (loading) {
    return (
      <div className="flex justify-center">
        Loading...
      </div>
    );
  }

  if (!bill) {
    return (
      <div>
        Bill not found
      </div>
    );
  }

  const allSelected = bill.items.length > 0 && bill.items.every((item) => selections[item.id]);

  return (
    <div className="max-w-2xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-2">
        Food Splitting
      </h1>

      <p className="mb-6">
        {bill.shopName}
      </p>

      <div className="space-y-3">
        {bill.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div>
              <p className="font-semibold">
                {item.name}
              </p>

              <p className="text-sm text-gray-500">
                {item.quantity} x{" "}
                {item.price} ฿
              </p>
            </div>

            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={
                selections[
                item.id
                ] ?? false
              }
              onChange={() =>
                handleToggle(
                  item.id
                )
              }
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button
          className="btn btn-outline w-full"
          onClick={
            handleSelectAll
          }
        >
          {allSelected
            ? "Deselect All"
            : "Select All"}
        </button>
      </div>

      <div className="flex gap-3 mt-6">

        <button
          className="btn btn-ghost flex-1"
          onClick={
            handleCancel
          }
          disabled={submitting}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary flex-1"
          onClick={
            handleSubmit
          }
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : "Submit"}
        </button>

      </div>
    </div>
  );
};

export default FoodSplitting;