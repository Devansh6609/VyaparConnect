// src/components/RightPanel.tsx
"use client";

import React, { useState, useEffect } from "react";
import type { Contact, Product, Quotation, Order, Message } from "../types";
import { X, ArrowLeft, Plus, Package, FileText, UserCheck, Loader2, Lightbulb } from 'lucide-react';
import ProductsSidebar from "@/components/products/ProductsSidebar";
import QuotationHistory from "@/components/quotations/QuotationHistory";
import BillingForm from "@/components/quotations/BillingForm";
import QuotationForm from "@/components/QuotationForm";
import ReminderForm from "@/components/reminders/ReminderForm";
import OrderForm from "@/components/orders/OrderForm";
import OrderHistory from "@/components/orders/OrderHistory";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderBillingForm from "@/components/orders/OrderBillingForm";
import MasterCustomerDetails from "@/components/customers/MasterCustomerDetails";
import { Socket } from "socket.io-client";
import Modal from "./ui/Modal";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import QuotationPreviewModal from "@/components/QuotationPreviewModal";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface RightPanelProps {
    activeContact: Contact | null;
    messages: Message[];
    onShareProduct: (product: Product) => void;
    initialViewId?: 'main_menu' | 'products' | 'quotations' | 'master_customer_details' | 'order_history';
    socket: Socket | null;
    newAddressForOrder?: string | null;
}

type ViewId = 'main_menu' | 'products' | 'quotations' | 'new_quotation' | 'billing' | 'master_customer_details' | 'order_history' | 'new_order' | 'order_summary' | 'order_billing' | 'new_reminder';

// FIX: Removed `ease` property from transitions to resolve TypeScript type inference errors with framer-motion.
// The animation will use the default easing.
const viewTransitionVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const menuContainerVariants = {
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};
const menuItemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const RightPanel: React.FC<RightPanelProps> = ({
    activeContact,
    messages,
    onShareProduct,
    initialViewId = 'main_menu',
    socket,
    newAddressForOrder,
}) => {
    const { data: session } = useSession();
    const [view, setView] = useState<ViewId>(initialViewId);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
    const [quotationForReminder, setQuotationForReminder] = useState<Quotation | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [orderForSummary, setOrderForSummary] = useState<Order | null>(null);

    const [quotationToPreview, setQuotationToPreview] = useState<Quotation | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [sendError, setSendError] = useState<string | null>(null);
    const [refreshQuotationsKey, setRefreshQuotationsKey] = useState(0);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [productError, setProductError] = useState<string | null>(null);

    // AI Product Suggestion State
    const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
    const [isSuggesting, setIsSuggesting] = useState(false);

    const fetchProducts = async () => {
        try {
            setProductError(null);
            const res = await fetch('/api/products');
            if (!res.ok) throw new Error("Failed to fetch products");
            const data = await res.json();
            const productData = data.map((p: Product) => ({ ...p, imageUrl: p.images?.[0]?.url || 'https://i.imgur.com/vJkrA4g.png' }));
            setProducts(productData);
            return productData;
        } catch (error: any) {
            console.error("Failed to fetch products:", error);
            setProductError(error.message);
            return [];
        }
    };

    const handleSuggestProducts = async () => {
        if (!messages || messages.length === 0) return;

        setIsSuggesting(true);
        setSuggestedProducts([]);
        setProductError(null);
        setView('products'); // Switch view immediately to show loading state

        try {
            // Ensure products are loaded before trying to filter them
            const productCatalog = products.length > 0 ? products : await fetchProducts();

            const recentHistory = messages
                .slice(-10) // Get last 10 messages
                .map(msg => `${msg.from === 'business' ? 'Business' : 'Customer'}: ${msg.text || '[attachment]'}`)
                .join('\n');

            const res = await fetch('/api/ai/suggest-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: recentHistory }),
            });

            if (!res.ok) {
                let errorMessage = "Failed to get AI suggestions.";
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (jsonError) {
                    // The response was not JSON, which indicates a server crash.
                    console.error("Server returned a non-JSON error response for AI suggestions.");
                    errorMessage = "An unexpected error occurred on the server. Please try again later.";
                }
                throw new Error(errorMessage);
            }

            const { query } = await res.json();

            if (query) {
                const lowerCaseQuery = query.toLowerCase();
                const suggestions = productCatalog.filter(p =>
                    p.name.toLowerCase().includes(lowerCaseQuery) ||
                    p.description?.toLowerCase().includes(lowerCaseQuery) ||
                    p.category?.toLowerCase().includes(lowerCaseQuery)
                );
                setSuggestedProducts(suggestions);
                if (suggestions.length === 0) {
                    setProductError(`AI suggested searching for "${query}", but no products matched.`);
                }
            } else {
                setProductError("AI couldn't determine a product suggestion from the chat.");
            }
        } catch (err: any) {
            setProductError(err.message || "An error occurred while getting suggestions.");
        } finally {
            setIsSuggesting(false);
        }
    };


    useEffect(() => {
        if (initialViewId) {
            setView(initialViewId);
        }
    }, [initialViewId]);

    useEffect(() => {
        if (view === 'products' && products.length === 0 && !isSuggesting) {
            fetchProducts();
        }
    }, [view, isSuggesting, products.length]);

    const handleDeleteProduct = async () => {
        if (!productToDelete) return;
        setProductError(null);
        try {
            const res = await fetch(`/api/products/${productToDelete.id}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to delete product.");
            }
            fetchProducts(); // Refetch to get updated list
            setProductToDelete(null);
        } catch (err: any) {
            setProductError(err.message);
        }
    };

    const handleBack = () => {
        // Clear any product-specific state when going back
        setProductError(null);
        setSuggestedProducts([]);

        if (view === 'order_billing' || view === 'new_order' || view === 'order_summary') {
            setView('order_history');
        } else if (view === 'billing' || view === 'new_quotation' || view === 'new_reminder') {
            setView('quotations');
        }
        else {
            setView('main_menu');
        }
        setOrderForSummary(null); // Clear summary view on back
    };

    const handlePromoted = () => {
        setView('main_menu');
    };

    const handleQuotationCreated = (newQuotation: Quotation) => {
        setView('quotations');
        setQuotationToPreview(newQuotation);
        setRefreshQuotationsKey(k => k + 1);
    }

    const handleOrderCreated = (newOrder: Order) => {
        setOrderForSummary(newOrder);
        setView('order_summary');
    };

    const handleSendQuotation = async (quotationId: string) => {
        setIsSending(true);
        setSendError(null);
        try {
            const res = await fetch(`/api/quotations/${quotationId}/send-as-image`, { method: 'POST' });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to send quotation image.");
            }
            setQuotationToPreview(null);
            setRefreshQuotationsKey(k => k + 1);
        } catch (err: any) {
            setSendError(err.message);
        } finally {
            setIsSending(false);
        }
    };


    const renderHeader = () => {
        const titleMap: Record<ViewId, string> = {
            main_menu: "Contact Actions",
            products: "Products",
            quotations: "Quotations",
            new_quotation: "New Quotation",
            new_reminder: "Set Follow-up Reminder",
            billing: `Bill for #${selectedQuotation?.id.substring(0, 6)}`,
            master_customer_details: "Customer Details",
            order_history: "Orders",
            new_order: "New Order",
            order_summary: "Order Summary",
            order_billing: `Bill for #${selectedOrder?.id.substring(0, 6)}`,
        };
        return (
            <div className="p-4 border-b border-gray-200 dark:border-[var(--card-border)] flex items-center justify-between">
                <div className="flex items-center">
                    {view !== 'main_menu' && (
                        <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h2 className="text-xl font-bold">{titleMap[view]}</h2>
                </div>
                <div className="flex items-center space-x-2">
                    {view === 'products' && (
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm font-semibold hover:bg-blue-700"
                        >
                            <Plus size={16} className="mr-1" /> Add New
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (!activeContact) {
            return <p className="p-4 text-center text-gray-500 dark:text-gray-400">Please select a contact.</p>;
        }

        let content;
        switch (view) {
            case 'products':
                content = (
                    <div>
                        {isSuggesting && (
                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                <Loader2 className="animate-spin inline-block mr-2" />
                                Analyzing chat for suggestions...
                            </div>
                        )}
                        {suggestedProducts.length > 0 && (
                            <div className="p-2 border-b-2 border-dashed dark:border-gray-700">
                                <div className="flex justify-between items-center mb-2 px-2">
                                    <h4 className="font-bold text-blue-600 dark:text-blue-400">AI Suggestions</h4>
                                    <button onClick={() => setSuggestedProducts([])} className="text-xs text-gray-500 hover:underline">Clear</button>
                                </div>
                                <ProductsSidebar
                                    products={suggestedProducts}
                                    onShareProduct={onShareProduct}
                                    onEditProduct={(p) => setProductToEdit(p)}
                                    onDeleteProduct={(p) => setProductToDelete(p)}
                                />
                            </div>
                        )}
                        <ProductsSidebar
                            products={products}
                            onShareProduct={onShareProduct}
                            onEditProduct={(p) => setProductToEdit(p)}
                            onDeleteProduct={(p) => setProductToDelete(p)}
                        />
                    </div>
                );
                break;
            case 'quotations':
                content = <QuotationHistory
                    key={refreshQuotationsKey}
                    contactId={activeContact.id}
                    onNewQuote={() => setView('new_quotation')}
                    onBillQuote={(q) => { setSelectedQuotation(q); setView('billing'); }}
                    onSendDraft={(q) => setQuotationToPreview(q)}
                    onSetFollowUp={(q) => { setQuotationForReminder(q); setView('new_reminder'); }}
                />;
                break;
            case 'new_quotation':
                content = <QuotationForm
                    contact={activeContact}
                    onCancel={() => setView('quotations')}
                    onQuotationCreated={handleQuotationCreated}
                />;
                break;
            case 'new_reminder':
                if (!quotationForReminder) return null;
                content = <ReminderForm
                    quotation={quotationForReminder}
                    onCancel={() => setView('quotations')}
                    onSuccess={() => setView('quotations')}
                />;
                break;
            case 'order_history':
                content = (
                    <OrderHistory
                        contactId={activeContact.id}
                        onNewOrder={() => setView('new_order')}
                        onManagePayments={(order) => { setSelectedOrder(order); setView('order_billing'); }}
                    />
                );
                break;
            case 'new_order':
                content = (
                    <OrderForm
                        contact={activeContact}
                        onCancel={() => setView('order_history')}
                        onOrderCreated={handleOrderCreated}
                        suggestedAddress={newAddressForOrder}
                    />
                );
                break;
            case 'order_summary':
                if (!orderForSummary) return null;
                content = <OrderSummary
                    order={orderForSummary}
                    onDone={handleBack}
                />;
                break;
            case 'billing':
                if (!selectedQuotation) return null;
                content = <BillingForm
                    quotation={selectedQuotation}
                    onBack={() => setView('quotations')}
                    onFinalized={() => { /* maybe refresh data */ }}
                    socket={socket}
                />;
                break;
            case 'order_billing':
                if (!selectedOrder) return null;
                content = <OrderBillingForm
                    order={selectedOrder}
                    onBack={() => setView('order_history')}
                    onFinalized={() => { /* maybe refresh data */ }}
                    socket={socket}
                />;
                break;
            case 'master_customer_details':
                content = <MasterCustomerDetails contact={activeContact} onPromoted={handlePromoted} />;
                break;
            case 'main_menu':
            default:
                const workflow = session?.user?.primaryWorkflow;
                const isOrdersDisabled = workflow === 'QUOTATION_FOCUSED';
                const isQuotationsDisabled = workflow === 'ORDER_FOCUSED';

                const workflowButtons = [
                    {
                        id: 'orders',
                        label: 'Manage Orders',
                        icon: <Package className={`mr-3 ${isOrdersDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-blue-600 dark:text-blue-400'}`} />,
                        action: () => setView('order_history'),
                        disabled: isOrdersDisabled
                    },
                    {
                        id: 'quotations',
                        label: 'Manage Quotations',
                        icon: <FileText className={`mr-3 ${isQuotationsDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-green-600 dark:text-green-400'}`} />,
                        action: () => setView('quotations'),
                        disabled: isQuotationsDisabled
                    }
                ];

                if (workflow === 'QUOTATION_FOCUSED') {
                    workflowButtons.reverse();
                }

                content = (
                    <motion.div
                        className="p-4 space-y-3"
                        variants={menuContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {workflowButtons.map(btn => (
                            <motion.button
                                key={btn.id}
                                variants={menuItemVariants}
                                onClick={btn.action}
                                disabled={btn.disabled}
                                className={`w-full flex items-center p-3 text-left rounded-lg transition-colors ${btn.disabled
                                    ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-[var(--input-background)] dark:hover:bg-gray-700'
                                    }`}
                                title={btn.disabled ? `${btn.label} (Disabled in this workspace)` : btn.label}
                            >
                                {btn.icon} {btn.label}
                            </motion.button>
                        ))}
                        <motion.button variants={menuItemVariants} onClick={handleSuggestProducts} className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 dark:bg-[var(--input-background)] dark:hover:bg-gray-700 rounded-lg">
                            <Lightbulb className="mr-3 text-yellow-500 dark:text-yellow-400" /> Suggest Products
                        </motion.button>
                        <motion.button variants={menuItemVariants} onClick={() => setView('products')} className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 dark:bg-[var(--input-background)] dark:hover:bg-gray-700 rounded-lg">
                            <Package className="mr-3 text-orange-600 dark:text-orange-400" /> Share Product
                        </motion.button>
                        <motion.button variants={menuItemVariants} onClick={() => setView('master_customer_details')} className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 dark:bg-[var(--input-background)] dark:hover:bg-gray-700 rounded-lg">
                            <UserCheck className="mr-3 text-purple-600 dark:text-purple-400" /> Customer Details
                        </motion.button>
                    </motion.div>
                );
                break;
        }

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={view}
                    variants={viewTransitionVariants}
                    initial="initial"
                    animate="enter"
                    exit="exit"
                >
                    {content}
                </motion.div>
            </AnimatePresence>
        );
    };

    return (
        <aside className="w-[30%] min-w-[350px] max-w-[450px] bg-white dark:bg-[var(--header-background)] border-l border-gray-200 dark:border-[var(--card-border)] flex flex-col flex-shrink-0">
            {renderHeader()}
            <div className="flex-1 overflow-y-auto">
                {productError && <div className="p-4 m-2 bg-red-50 text-red-700 rounded-md text-sm">{productError}</div>}
                {renderContent()}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Product">
                <AddProductForm
                    onSuccess={() => { setIsAddModalOpen(false); fetchProducts(); }}
                    onCancel={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {productToEdit && (
                <Modal isOpen={!!productToEdit} onClose={() => setProductToEdit(null)} title="Edit Product">
                    <EditProductForm
                        product={productToEdit}
                        onSuccess={() => { setProductToEdit(null); fetchProducts(); }}
                        onCancel={() => setProductToEdit(null)}
                    />
                </Modal>
            )}

            {productToDelete && (
                <Modal isOpen={!!productToDelete} onClose={() => setProductToDelete(null)} title="Confirm Deletion">
                    <p>Are you sure you want to delete the product: <strong>{productToDelete.name}</strong>?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button onClick={() => setProductToDelete(null)} className="px-4 py-2 border rounded-md">Cancel</button>
                        <button onClick={handleDeleteProduct} className="px-4 py-2 bg-red-600 text-white rounded-md">Delete</button>
                    </div>
                </Modal>
            )}

            {quotationToPreview && (
                <QuotationPreviewModal
                    quotation={quotationToPreview}
                    onClose={() => { setQuotationToPreview(null); setSendError(null); }}
                    onSend={handleSendQuotation}
                    isSending={isSending}
                    error={sendError}
                />
            )}
        </aside>
    );
};

export default RightPanel;