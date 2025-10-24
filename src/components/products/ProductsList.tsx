"use client";

import React, { useState, useEffect } from "react";
// FIX: Used type-only import to prevent module resolution errors.
import type { Product } from "@/types";
import AddProductForm from "../AddProductForm";
import EditProductForm from "../EditProductForm";
import Modal from "../ui/Modal";
import { Plus, Edit, Trash2, Loader2, AlertCircle, Share } from 'lucide-react';
import ShareToGroupModal from "../../components/groups/ShareToGroupModel";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProductsList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productToShare, setProductToShare] = useState<Product | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Failed to fetch products.");
            const data: Product[] = await res.json();
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId: string) => {
        try {
            const res = await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete product.");
            }
            setProducts(products.filter(p => p.id !== productId));
            setProductToDelete(null);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="p-8 text-center flex items-center justify-center h-full"><LoadingSpinner /></div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                    <Plus size={16} className="mr-2" /> Add Product
                </button>
            </div>
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-3" />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-700">&times;</button>
                </div>
            )}
            <div className="bg-white shadow rounded-lg border">
                <div className="grid grid-cols-5 font-semibold text-sm text-gray-600 px-4 py-3 border-b">
                    <div className="col-span-2">Product</div>
                    <div>Price</div>
                    <div>Stock</div>
                    <div>Actions</div>
                </div>
                {products.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No products found.</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="grid grid-cols-5 items-center px-4 py-3 border-b last:border-b-0">
                            <div className="col-span-2 flex items-center">
                                <img src={product.images?.[0]?.url || 'https://i.imgur.com/vJkrA4g.png'} alt={product.name} className="w-12 h-12 object-cover rounded-md mr-4" />
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.category || 'Uncategorized'}</p>
                                </div>
                            </div>
                            <div>₹{product.price.toLocaleString('en-IN')}</div>
                            <div>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => setProductToShare(product)} className="p-2 text-gray-500 hover:text-green-600 hover:bg-gray-100 rounded-md" title="Share to Group">
                                    <Share size={16} />
                                </button>
                                <button onClick={() => setProductToEdit(product)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-md" title="Edit Product">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => setProductToDelete(product)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-md" title="Delete Product">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add Product Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
                <AddProductForm
                    onSuccess={() => { setIsAddModalOpen(false); fetchProducts(); }}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {/* Edit Product Modal */}
            {productToEdit && (
                <Modal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} title="Edit Product">
                    <EditProductForm
                        product={productToEdit}
                        onSuccess={() => { setProductToEdit(null); fetchProducts(); }}
                        onCancel={() => setProductToEdit(null)}
                    />
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            {productToDelete && (
                <Modal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} title="Confirm Deletion">
                    <p>Are you sure you want to delete the product: <strong>{productToDelete.name}</strong>?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={() => setProductToDelete(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                        <button onClick={() => handleDelete(productToDelete.id)} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                    </div>
                </Modal>
            )}

            {/* Share to Group Modal */}
            <ShareToGroupModal
                isOpen={!!productToShare}
                product={productToShare}
                onClose={() => setProductToShare(null)}
            />
        </div>
    );
};

export default ProductsList;