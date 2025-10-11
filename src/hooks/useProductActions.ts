import { useState, useCallback } from 'react';
import { Product, getPurchaseAction, getDefaultVariantId } from '@/types/product';

export type ButtonIconType = 'external' | null;

export function useProductActions(
  addItem: (variantId: string, quantity: number) => Promise<void>,
  cartLoading: boolean
) {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const handleAddToCart = useCallback(async (productId: string, variantId: string) => {
    setAddingToCart(productId);
    try {
      await addItem(variantId, 1);
      // Optional: Show success message
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optional: Show error message
    } finally {
      setAddingToCart(null);
    }
  }, [addItem]);

  const handleProductAction = useCallback((product: Product) => {
    const action = getPurchaseAction(product);
    
    switch (action.type) {
      case 'add_to_cart':
        const variantId = getDefaultVariantId(product);
        if (variantId) {
          handleAddToCart(product.id, variantId);
        }
        break;
      case 'external_link':
        if (action.data?.url) {
          window.open(action.data.url, '_blank', 'noopener,noreferrer');
        }
        break;
      case 'contact':
        if (action.data?.email) {
          window.location.href = `mailto:${action.data.email}?subject=Consulta sobre ${product.name}`;
        }
        break;
      default:
        console.log('Custom action:', action);
    }
  }, [handleAddToCart]);

  const getActionButton = useCallback((product: Product) => {
    const action = getPurchaseAction(product);
    const isAddingThis = addingToCart === product.id;
    
    if (action.type === 'add_to_cart') {
      return {
        text: isAddingThis ? 'Agregando...' : !product.availableForSale ? 'Agotado' : 'Agregar al carrito',
        disabled: !product.availableForSale || isAddingThis || cartLoading,
        iconType: null as ButtonIconType,
      };
    }
    
    if (action.type === 'external_link') {
      return {
        text: action.data?.buttonText || 'Ver Producto',
        disabled: false,
        iconType: 'external' as ButtonIconType,
      };
    }
    
    if (action.type === 'contact') {
      return {
        text: action.data?.buttonText || 'Contactar',
        disabled: false,
        iconType: null as ButtonIconType,
      };
    }
    
    return {
      text: 'Ver Detalles',
      disabled: false,
      iconType: null as ButtonIconType,
    };
  }, [addingToCart, cartLoading]);

  return {
    addingToCart,
    handleProductAction,
    getActionButton,
  };
}

