"use client";
import React, { useState, useEffect, useReducer } from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Product, Contact, QuotationItem, Quotation } from '../types';
import { Plus, Trash2, X, Send } from 'lucide-react';

interface QuotationFormProps {
  contact: Contact;
  onCancel: () => void;
  onQuotationCreated: (quotation: Quotation) => void;
}

type FormState = {
  customerName: string;
  contactNumber: string;
  billingAddress: string;
  shippingAddress: string;
  items: Partial<QuotationItem & { name?: string }>[];
}

type FormAction =
  | { type: 'UPDATE_FIELD'; field: keyof Omit<FormState, 'items'>; payload: string }
  | { type: 'UPDATE_ITEM'; index: number; field: keyof QuotationItem; payload: any, product?: Product }
  | { type: 'ADD_ITEM' }
  | { type: 'REMOVE_ITEM'; index: number };


function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.payload };
    case 'UPDATE_ITEM': {
      const newItems = [...state.items];
      (newItems[action.index] as any)[action.field] = action.payload;

      if (action.field === 'productId' && action.product) {
        newItems[action.index].price = action.product.price;
        newItems[action.index].name = action.product.name;
      }
      return { ...state, items: newItems };
    }
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, { productId: '', quantity: 1, price: 0 }] };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((_, i) => i !== action.index) };
    default:
      return state;
  }
}


const QuotationForm: React.FC<QuotationFormProps> = ({ contact, onCancel, onQuotationCreated }) => {

  const initialState: FormState = {
    customerName: contact.name,
    contactNumber: contact.phone,
    billingAddress: contact.lastBillingAddress || contact.lastAddress || '',
    shippingAddress: contact.lastShippingAddress || contact.shippingAddress || '',
    items: [{ productId: '', quantity: 1, price: 0 }]
  };

  const [formState, dispatch] = useReducer(formReducer, initialState);
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

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    let product: Product | undefined;
    if (field === 'productId') {
      product = products.find(p => p.id === value);
    }
    dispatch({ type: 'UPDATE_ITEM', index, field, payload: value, product });
  };

  const addItem = () => dispatch({ type: 'ADD_ITEM' });
  const removeItem = (index: number) => dispatch({ type: 'REMOVE_ITEM', index });

  const subtotal = formState.items.reduce((sum, item) => sum + (item.quantity || 0) * (item.price || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { customerName, contactNumber, billingAddress, shippingAddress, items } = formState;
      // Step 1: Create the quotation with DRAFT status
      const createRes = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: contact.id,
          customerName, contactNumber, billingAddress, shippingAddress,
          items: items.map(({ name, ...rest }) => rest).filter(item => item.productId),
          subtotal,
          total: subtotal, // Initial total, can be finalized later
          status: 'DRAFT',
        })
      });
      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error || "Failed to create quotation");
      }
      const newQuotation = await createRes.json();

      // Step 2: Pass to parent to show preview modal
      onQuotationCreated(newQuotation);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">New Quotation</h3>
        <button type="button" onClick={onCancel} className="text-gray-500 dark:text-gray-300"><X size={20} /></button>
      </div>
      {error && <p className="text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 p-2 rounded-md text-sm mb-4">{error}</p>}

      <div className="space-y-3 text-sm">
        <input type="text" value={formState.customerName} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'customerName', payload: e.target.value })} placeholder="Customer Name" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        <input type="text" value={formState.contactNumber} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'contactNumber', payload: e.target.value })} placeholder="Contact Number" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
        <textarea value={formState.billingAddress} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'billingAddress', payload: e.target.value })} placeholder="Billing Address" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={2} required></textarea>
        <textarea value={formState.shippingAddress} onChange={e => dispatch({ type: 'UPDATE_FIELD', field: 'shippingAddress', payload: e.target.value })} placeholder="Shipping Address" className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" rows={2} required></textarea>
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Products</h4>
        {formState.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <select
              value={item.productId ?? ''} // FIX APPLIED HERE
              onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
              className="w-1/2 border rounded-md p-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              required
            >
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))} min="1" className="w-1/4 border rounded-md p-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
            <span className="w-1/4 text-gray-700 dark:text-gray-300">@ ₹{item.price?.toFixed(2)}</span>
            <button type="button" onClick={() => removeItem(index)}><Trash2 size={16} className="text-red-500 hover:text-red-600" /></button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="flex items-center text-sm text-blue-600 dark:text-blue-400 mt-2"><Plus size={16} className="mr-1" /> Add Item</button>
      </div>

      <div className="mt-4 text-right font-bold text-gray-800 dark:text-gray-100">Subtotal: ₹{subtotal.toFixed(2)}</div>

      <div className="flex justify-end gap-2 mt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm border dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md disabled:opacity-50 flex items-center justify-center">
          {loading ? 'Generating...' : 'Generate & Preview'}
        </button>
      </div>
    </form>
  );
};

export default QuotationForm;
