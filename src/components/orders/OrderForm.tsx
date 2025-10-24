"use client";
import React, { useState, useEffect, useReducer } from 'react';
import type { Product, Contact, Order, OrderItem } from '../../types';
import { Plus, Trash2, Loader2 } from 'lucide-react';

interface OrderFormProps {
    contact: Contact;
    onCancel: () => void;
    onOrderCreated: (order: Order) => void;
    suggestedAddress?: string | null;
}

type LineItem = {
    id: number;
    productId?: string;
    productName: string;
    quantity: string;
    price: string;
};

type FormState = {
    customerName: string;
    billingAddress: string;
    shippingAddress: string;
    items: LineItem[];
    discountPercentage: string;
    deliveryCharges: string;
}

type FormAction =
    | { type: 'UPDATE_FIELD'; field: keyof FormState; payload: any }
    | { type: 'ADD_ITEM' }
    | { type: 'REMOVE_ITEM'; id: number }
    | { type: 'UPDATE_ITEM'; id: number; field: keyof LineItem; payload: any };

function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return { ...state, [action.field]: action.payload };
        case 'ADD_ITEM':
            return { ...state, items: [...state.items, { id: Date.now(), productName: '', quantity: '1', price: '0' }] };
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter(item => item.id !== action.id) };
        case 'UPDATE_ITEM':
            return {
                ...state,
                items: state.items.map(item => item.id === action.id ? { ...item, [action.field]: action.payload } : item)
            };
        default:
            return state;
    }
}

const OrderForm: React.FC<OrderFormProps> = ({ contact, onCancel, onOrderCreated, suggestedAddress }) => {

    const initialState: FormState = {
        customerName: contact.name,
        billingAddress: contact.lastBillingAddress || contact.lastAddress || '',
        shippingAddress: contact.lastShippingAddress || contact.shippingAddress || '',
        items: [{ id: Date.now(), productName: '', quantity: '1', price: '0' }],
        discountPercentage: '0',
        deliveryCharges: '0',
    };

    const [state, dispatch] = useReducer(formReducer, initialState);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await fetch('/api/products');
            if (res.ok) setProducts(await res.json());
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (suggestedAddress) {
            dispatch({ type: 'UPDATE_FIELD', field: 'shippingAddress', payload: suggestedAddress });
        }
    }, [suggestedAddress]);

    const handleItemProductChange = (id: number, productName: string) => {
        const selectedProduct = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (selectedProduct) {
            // Found a product in the catalog
            dispatch({ type: 'UPDATE_ITEM', id, field: 'productName', payload: selectedProduct.name });
            dispatch({ type: 'UPDATE_ITEM', id, field: 'productId', payload: selectedProduct.id });
            dispatch({ type: 'UPDATE_ITEM', id, field: 'price', payload: selectedProduct.price.toString() });
        } else {
            // Manual entry
            dispatch({ type: 'UPDATE_ITEM', id, field: 'productName', payload: productName });
            dispatch({ type: 'UPDATE_ITEM', id, field: 'productId', payload: undefined });
        }
    };

    const subtotal = state.items.reduce((sum, item) => sum + ((!isNaN(parseFloat(item.quantity)) ? parseFloat(item.quantity) : 0) * (parseFloat(item.price) || 0)), 0);
    const discountAmount = (subtotal * (parseFloat(state.discountPercentage) || 0)) / 100;
    const total = subtotal - discountAmount + (parseFloat(state.deliveryCharges) || 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const finalItems = state.items.filter(i => i.productName.trim() && parseFloat(i.price) >= 0).map(item => ({
            ...item,
            price: parseFloat(item.price)
        }));

        if (finalItems.length === 0) {
            setError("Please add at least one valid item.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contactId: contact.id,
                    customerName: state.customerName,
                    contactNumber: contact.phone,
                    billingAddress: state.billingAddress,
                    shippingAddress: state.shippingAddress,
                    items: finalItems,
                    subtotal,
                    total,
                    discountPercentage: parseFloat(state.discountPercentage) || 0,
                    deliveryCharges: parseFloat(state.deliveryCharges) || 0,
                })
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create order");
            }
            const newOrder = await res.json();
            onOrderCreated(newOrder);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4">
            {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-2 rounded-md text-sm mb-4">{error}</p>}

            <div className="space-y-3 text-sm">
                <input type="text" value={state.customerName} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'customerName', payload: e.target.value })} placeholder="Customer Name" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
                <textarea value={state.billingAddress} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'billingAddress', payload: e.target.value })} placeholder="Billing Address" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={2} required></textarea>
                <textarea value={state.shippingAddress} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'shippingAddress', payload: e.target.value })} placeholder="Shipping Address" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={2} required></textarea>
            </div>

            <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Items</h4>
                <div className="space-y-3">
                    {state.items.map((item, index) => (
                        <div key={item.id} className="p-3 border rounded-lg dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/30">
                            <div className="flex justify-between items-start mb-2">
                                <input
                                    list="product-list"
                                    type="text"
                                    value={item.productName}
                                    onChange={e => handleItemProductChange(item.id, e.target.value)}
                                    placeholder={`Item #${index + 1} Name`}
                                    className="w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 font-medium"
                                    required
                                />
                                <button type="button" onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })} className="ml-2 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full flex-shrink-0">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="flex flex-wrap items-end gap-2">
                                <div className="flex-1 min-w-[80px]">
                                    <label htmlFor={`quantity-${item.id}`} className="text-xs text-gray-500">Quantity</label>
                                    <input
                                        id={`quantity-${item.id}`}
                                        type="text"
                                        value={item.quantity}
                                        onChange={e => dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'quantity', payload: e.target.value })}
                                        placeholder="e.g., 1 or 250g"
                                        className="w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label htmlFor={`price-${item.id}`} className="text-xs text-gray-500">Price (₹)</label>
                                    <input
                                        id={`price-${item.id}`}
                                        type="number"
                                        value={item.price}
                                        onChange={e => dispatch({ type: 'UPDATE_ITEM', id: item.id, field: 'price', payload: e.target.value })}
                                        placeholder="Unit Price"
                                        step="0.01"
                                        className="w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 mt-1"
                                        required
                                    />
                                </div>
                                <div className="flex-1 min-w-[100px]">
                                    <label className="text-xs text-gray-500 text-right block">Subtotal</label>
                                    <div className="flex items-center justify-end px-2 rounded-md bg-gray-200/70 dark:bg-gray-800/70 h-10 mt-1">
                                        <span className="text-sm font-semibold text-right dark:text-gray-200">
                                            ₹{((!isNaN(parseFloat(item.quantity)) ? parseFloat(item.quantity) : 0) * (parseFloat(item.price) || 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <datalist id="product-list">
                    {products.map(p => <option key={p.id} value={p.name} />)}
                </datalist>

                <button type="button" onClick={() => dispatch({ type: 'ADD_ITEM' })} className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-3"><Plus size={16} className="mr-1" /> Add Item</button>
            </div>

            <div className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs">Discount (%)</label>
                        <input type="number" value={state.discountPercentage} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'discountPercentage', payload: e.target.value })} className="w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                    </div>
                    <div>
                        <label className="text-xs">Delivery (₹)</label>
                        <input type="number" value={state.deliveryCharges} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'deliveryCharges', payload: e.target.value })} className="w-full border rounded-md p-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                    </div>
                </div>
                <div className="text-right font-bold text-lg text-gray-800 dark:text-gray-100">Total: ₹{total.toFixed(2)}</div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin" /> : 'Create & View Bill'}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;