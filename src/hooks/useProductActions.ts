import { useCallback } from 'react';
import { Product, getDefaultVariantId } from '@/types/product';

export function useProductActions(
  addItem: (variantId: string, quantity: number) => Promise<void>,
  isAddingItem: (variantId: string) => boolean,
  cartLoading: boolean
) {
  const handleAddToCart = useCallback(async (variantId: string) => {
    try {
      await addItem(variantId, 1);
    } catch (error) {
      // Error handled by cart context
      console.error('Failed to add item to cart:', error);
    }
  }, [addItem]);

  const handleProductAction = useCallback((product: Product) => {
    const variantId = getDefaultVariantId(product);
    if (variantId) {
      handleAddToCart(variantId);
    }
  }, [handleAddToCart]);

  const getActionButton = useCallback((product: Product) => {
    const variantId = getDefaultVariantId(product);
    const isAddingThis = variantId ? isAddingItem(variantId) : false;
    
    return {
      text: isAddingThis ? 'Agregando...' : !product.availableForSale ? 'Agotado' : 'Agregar al carrito',
      disabled: !product.availableForSale || isAddingThis || cartLoading,
      isLoading: isAddingThis,
    };
  }, [isAddingItem, cartLoading]);

  return {
    handleProductAction,
    getActionButton,
  };
}

