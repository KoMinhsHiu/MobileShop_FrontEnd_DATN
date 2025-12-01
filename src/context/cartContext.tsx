import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { CartAPI } from "@/const/endPoint";
import { CartTransformer } from "@/utils/api/transformer/cart";
import { getData } from "@/utils/api/fetchData/apiCall";
import { CartContextType, AddToCartItem, AddToCartApiItem, RemoveFromCart } from "@/utils/type";
import { cartAPI, AddToCartRequest, CartApiError } from "@/utils/api/cart";
import { useAuth } from "./authContext";
import { useFetchCart } from "@/utils/hooks/api/useFetchCart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Removed mock data - use real API data only

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with null - wait for API data
  const [cart, setCart] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Fetch cart data from API when authenticated
  const { data: apiCartData, isLoading: isApiLoading, refetch: refetchCart } = useFetchCart();

  // Update cart when API data changes
  useEffect(() => {
    if (apiCartData && isAuthenticated && typeof apiCartData === 'object' && apiCartData !== null && 'items' in apiCartData) {
      // Transform API cart data to match existing cart structure
      const transformedCart = {
        totalProduct: (apiCartData as any).items.length,
        products: (apiCartData as any).items.map((item: any) => ({
          id: item.variant.id.toString(),
          itemId: item.id,
          productAttributeId: item.variant.id,
          quantity: item.quantity,
          name: `${item.variant.name} ${item.variant.variantName}`,
          image: item.variant.imageUrl || "/images/brands/Apple.jpg",
          colorId: item.variant.colorId,
          price: `${item.price.toLocaleString('vi-VN')}₫`,
          discount: item.discount ? `${item.discount.toLocaleString('vi-VN')}₫` : undefined,
          attributes: {
            "Màu sắc": item.variant.color,
            "Số lượng": item.quantity.toString()
          }
        }))
      };
      setCart(transformedCart);
    } else if (isAuthenticated && apiCartData && (apiCartData as any).items?.length === 0) {
      // Empty cart from API
      setCart({ totalProduct: 0, products: [] });
    }
  }, [apiCartData, isAuthenticated]);

  const addToCartApi = useCallback(async (item: AddToCartApiItem) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await cartAPI.addToCart(item);
      
      if (response.status === 200) {
        toast.success(response.message || "Đã thêm vào giỏ hàng thành công");
        // Refresh cart data from API
        refetchCart();
      } else {
        toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    } catch (error: any) {
      console.error('Add to cart error:', error);
      console.log('Error details:', {
        status: error.status,
        statusCode: error.statusCode,
        message: error.message,
        response: error.response
      });
      
      if (error.status === 404 || error.statusCode === 404) {
        // API endpoint not implemented yet - use fallback
        console.log('Cart API not implemented, using fallback logic');
        toast.success("Đã thêm vào giỏ hàng (Demo mode - API chưa được implement)");
        
        // Simulate adding to cart with mock data
        if (cart?.products) {
          const mockCartItem = {
            id: item.variantId.toString(),
            productAttributeId: item.variantId,
            quantity: item.quantity,
            name: `Phone Variant ${item.variantId}`,
            image: "/images/brands/Apple.jpg",
            price: `${item.price.toLocaleString('vi-VN')}₫`,
            attributes: {
              "Màu sắc": `Color ID: ${item.colorId}`,
              "Số lượng": item.quantity.toString()
            }
          };
          
          setCart({
            ...cart,
            products: [...cart.products, mockCartItem],
            totalProduct: cart.products.length + 1
          });
        }
      } else if (error.status === 401 || error.statusCode === 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        // TODO: Redirect to login
      } else if (error.status === 400 || error.statusCode === 400) {
        const errorMessage = error.message || "Dữ liệu không hợp lệ";
        toast.error(errorMessage);
      } else if (error.status === 503 || error.statusCode === 503) {
        toast.error("Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau");
      } else {
        toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, cart, refetchCart]);

  const updateQuantityApi = useCallback(async (item: AddToCartItem, action: "up" | "down") => {
    setIsLoading(true);
    try {
      // Gọi API updateQuantity
      const newQuantity = action === "up" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      await cartAPI.updateQuantity({ itemId: item.itemId, quantity: newQuantity });
      toast.success("Đã cập nhật số lượng");
      refetchCart();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    } finally {
      setIsLoading(false);
    }
  }, [refetchCart]);
  
  // Xóa nhiều item khỏi giỏ hàng bằng API
  const deleteCartItemsApi = useCallback(async (itemIds: number[]) => {
    setIsLoading(true);
    try {
      await cartAPI.deleteCartItems(itemIds);
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      refetchCart();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa sản phẩm");
    } finally {
      setIsLoading(false);
    }
  }, [refetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCartApi,
        updateQuantityApi,
        deleteCartItemsApi,
        isLoading: isLoading || isApiLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
