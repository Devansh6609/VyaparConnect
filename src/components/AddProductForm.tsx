"use client";

import React, { useState } from "react";
import ImageUploader from "./ImageUploader";
// FIX: Changed path alias to relative path to resolve module resolution error.
import type { WorkflowType } from "../types";

interface AddProductFormProps {
    // We no longer need the userId prop for creation
    onSuccess: () => void;
    onCancel: () => void;
}

export default function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [stockQuantity, setStockQuantity] = useState("0");
    const [inStock, setInStock] = useState(true);
    const [workflow, setWorkflow] = useState<WorkflowType>('HYBRID');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    price,
                    description,
                    category,
                    inStock,
                    stockQuantity,
                    images,
                    workflow,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Failed to add product");
            }

            await res.json();
            onSuccess();
        } catch (err: any) {
            console.error("AddProductForm error:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Add New Product</h3>
            {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Usage / Workflow<span className="text-red-500">*</span>
                </label>
                <select
                    required
                    value={workflow}
                    onChange={(e) => setWorkflow(e.target.value as WorkflowType)}
                    className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="QUOTATION_FOCUSED">Quotation Specific</option>
                    <option value="ORDER_FOCUSED">Order Specific</option>
                    <option value="HYBRID">Hybrid (for both)</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name<span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Price (₹)<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Stock Quantity
                    </label>
                    <input
                        type="number"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>


            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-3">
                <ImageUploader onChange={setImages} />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">In Stock</label>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Adding..." : "Add Product"}
                </button>
            </div>
        </form>
    );
}