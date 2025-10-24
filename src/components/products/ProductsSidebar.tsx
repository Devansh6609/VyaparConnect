import React from 'react';
import type { Product } from '../../types';
import Icon from '@/components/ui/Icon';
import { motion } from 'framer-motion';

interface ProductsSidebarProps {
  products: Product[];
  onShareProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const WorkflowBadge: React.FC<{ workflow: Product['workflow'] }> = ({ workflow }) => {
  const config = {
    QUOTATION_FOCUSED: { label: 'Q', color: 'bg-green-100 text-green-800', title: 'Quotation Specific' },
    ORDER_FOCUSED: { label: 'O', color: 'bg-orange-100 text-orange-800', title: 'Order Specific' },
    HYBRID: { label: 'H', color: 'bg-blue-100 text-blue-800', title: 'Hybrid' },
  }[workflow];

  if (!config) return null;

  return (
    <span
      title={config.title}
      className={`text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ml-2 flex-shrink-0 ${config.color}`}
    >
      {config.label}
    </span>
  );
};


const ProductsSidebar: React.FC<ProductsSidebarProps> = ({
  products,
  onShareProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  if (products.length === 0) {
    return <p className="p-4 text-center text-gray-500">No products found for this workspace.</p>
  }

  return (
    <div
      className="p-2"
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="p-2 mb-2 border dark:border-gray-700 rounded-lg flex items-center hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-3 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <h3 className="font-semibold text-sm truncate">{product.name}</h3>
              <WorkflowBadge workflow={product.workflow} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">₹{product.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={() => onShareProduct(product)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
              title="Share Product"
            >
              <Icon name="share2" size={16} />
            </button>
            <button
              onClick={() => onEditProduct(product)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
              title="Edit Product"
            >
              <Icon name="edit" size={16} />
            </button>
            <button
              onClick={() => onDeleteProduct(product)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
              title="Delete Product"
            >
              <Icon name="trash2" size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsSidebar;