"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface FinalBillFormProps {
  quotation: any; 
  onSuccess: (finalBill: any) => void;
  onCancel: () => void;
}

const FinalBillForm: React.FC<FinalBillFormProps> = ({ quotation, onSuccess, onCancel }) => {
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0); // e.g., 18 for 18%
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = quotation.total;
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const grandTotal = subtotal - discount + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/quotations/${quotation.id}/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discount,
          taxRate,
          taxAmount,
          finalAmount: grandTotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to finalize bill.");
      }

      const finalBill = await res.json();
      onSuccess(finalBill);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg border shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Finalize Bill for Quotation #{quotation.id.substring(0, 6)}</h3>
        <button type="button" onClick={onCancel}><X className="w-5 h-5 text-gray-500" /></button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md mb-4">{error}</p>}

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="discount" className="text-gray-600">Discount (₹)</label>
          <input
            id="discount"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-28 border rounded-md px-2 py-1 text-sm text-right"
          />
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="tax" className="text-gray-600">Tax (%)</label>
          <input
            id="tax"
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
            className="w-28 border rounded-md px-2 py-1 text-sm text-right"
          />
        </div>
         <div className="flex justify-between items-center border-t pt-2">
          <span className="text-gray-600">Tax Amount</span>
          <span className="font-medium">₹{taxAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
          <span>Grand Total</span>
          <span>₹{grandTotal.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-6">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border rounded-md text-gray-600 hover:bg-gray-100">
            Cancel
        </button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Finalizing..." : "Finalize & Generate Bill"}
        </button>
      </div>
    </form>
  );
};

export default FinalBillForm;
