import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { CardAPI } from "@/const/endPoint";
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

  const addToCart = useCallback(async (item: AddToCartItem) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const removeFromCart = useCallback(async (item: RemoveFromCart) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      if (cart?.products) {
        const updatedProducts = cart.products.filter((p: any) => 
          !(p.id === item.id && p.productAttributeId === item.productAttributeId)
        );
        
        setCart({
          ...cart,
          products: updatedProducts,
          totalProduct: updatedProducts.length
        });
        
        toast.success("Đã xóa khỏi giỏ hàng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xóa khỏi giỏ hàng");
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (item: AddToCartItem, action: "up" | "down") => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      if (cart?.products) {
        const updatedProducts = cart.products.map((p: any) => {
          if (p.id === item.id && p.productAttributeId === item.productAttributeId) {
            const newQuantity = action === "up" ? p.quantity + 1 : Math.max(1, p.quantity - 1);
            return { ...p, quantity: newQuantity };
          }
          return p;
        });
        
        setCart({
          ...cart,
          products: updatedProducts
        });
        
        toast.success("Đã cập nhật số lượng");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật số lượng");
    } finally {
      setIsLoading(false);
    }
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, addToCartApi, removeFromCart, updateQuantity, isLoading: isLoading || isApiLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};
