import React from 'react';
// FIX: Used type-only import to prevent module resolution errors.
import type { Message, ProductImage } from '../types';
import { format } from 'date-fns';
import { Clock, Check, CheckCheck, X } from 'lucide-react';

interface ProductMessageProps {
    message: Message;
    onImageClick: (images: ProductImage[], startIndex: number) => void;
}

const ProductMessage: React.FC<ProductMessageProps> = ({ message, onImageClick }) => {
    const { product } = message;

    const renderMessageStatusIcon = (status?: Message['status']) => {
        switch (status) {
            case "pending": return <Clock size={16} className="text-white/80 ml-1" />;
            case "sent": return <Check size={16} className="text-white/80 ml-1" />;
            case "delivered": return <CheckCheck size={16} className="text-white/80 ml-1" />;
            case "read": return <CheckCheck size={16} className="text-[#53bdeb] ml-1" />; // WhatsApp's blue tick color
            case "failed": return <X size={16} className="text-red-400 ml-1" />;
            default: return null;
        }
    };

    if (!product || !product.images || product.images.length === 0) {
        return (
            <div className="w-64 p-3 rounded-lg border bg-gray-50">
                <p className="font-semibold text-sm">{product?.name || 'Product'}</p>
                <p className="text-xs text-gray-500">Image not available</p>
                <p className="font-bold text-green-700 mt-1">₹{product?.price.toLocaleString('en-IN')}</p>
            </div>
        );
    }

    const images = product.images;
    const imageCount = images.length;
    const displayedImages = images.slice(0, 4);
    const remainingCount = imageCount - 4;

    const renderGrid = () => {
        if (imageCount === 1) {
            return (
                <div className="aspect-square w-full" onClick={() => onImageClick(images, 0)}>
                    <img src={images[0].url} alt={product.name} className="w-full h-full object-cover" />
                </div>
            );
        }
        if (imageCount === 2) {
            return (
                <div className="grid grid-cols-2 aspect-square w-full gap-1">
                    <img src={images[0].url} alt={`${product.name} 1`} className="w-full h-full object-cover" onClick={() => onImageClick(images, 0)} />
                    <img src={images[1].url} alt={`${product.name} 2`} className="w-full h-full object-cover" onClick={() => onImageClick(images, 1)} />
                </div>
            );
        }
        if (imageCount === 3) {
            return (
                <div className="grid grid-cols-2 grid-rows-2 aspect-square w-full gap-1">
                    <img src={images[0].url} alt={`${product.name} 1`} className="w-full h-full object-cover col-span-1 row-span-2" onClick={() => onImageClick(images, 0)} />
                    <img src={images[1].url} alt={`${product.name} 2`} className="w-full h-full object-cover" onClick={() => onImageClick(images, 1)} />
                    <img src={images[2].url} alt={`${product.name} 3`} className="w-full h-full object-cover" onClick={() => onImageClick(images, 2)} />
                </div>
            );
        }
        // 4 or more images
        return (
            <div className="grid grid-cols-2 grid-rows-2 aspect-square w-full gap-1">
                {displayedImages.map((image, index) => (
                    <div key={image.id} className="relative" onClick={() => onImageClick(images, index)}>
                        <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                        {index === 3 && remainingCount > 0 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">+{remainingCount}</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-64 rounded-lg overflow-hidden relative shadow-md cursor-pointer">
            {renderGrid()}
            <div
                className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none"
            >
                <div>
                    <h4 className="font-bold text-sm text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{product.name}</h4>
                    <p className="font-semibold text-white mt-1 text-base [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="flex justify-end items-center text-xs text-white/80 mt-1 [text-shadow:0_1px_1px_rgba(0,0,0,0.5)]">
                    <span>{format(new Date(message.createdAt), "p")}</span>
                    {message.from === 'business' && renderMessageStatusIcon(message.status)}
                </div>
            </div>
        </div>
    );
};

export default ProductMessage;