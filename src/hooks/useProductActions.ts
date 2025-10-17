import { useState, useCallback } from 'react';
import { Product, getDefaultVariantId } from '@/types/product';

export function useProductActions(
  addItem: (variantId: string, quantity: number) => Promise<void>,
  cartLoading: boolean
) {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = useCallback(async (productId: string, variantId: string) => {
    setAddingToCart(productId);
    try {
      await addItem(variantId, 1);
    } catch (error) {
      // Error handled by cart context
    } finally {
      setAddingToCart(null);
    }
  }, [addItem]);

  const handleProductAction = useCallback((product: Product) => {
    const variantId = getDefaultVariantId(product);
    if (variantId) {
      handleAddToCart(product.id, variantId);
    }
  }, [handleAddToCart]);

  const getActionButton = useCallback((product: Product) => {
    const isAddingThis = addingToCart === product.id;
    
    return {
      text: isAddingThis ? 'Agregando...' : !product.availableForSale ? 'Agotado' : 'Agregar al carrito',
      disabled: !product.availableForSale || isAddingThis || cartLoading,
    };
  }, [addingToCart, cartLoading]);

  return {
    addingToCart,
    handleProductAction,
    getActionButton,
  };
}

