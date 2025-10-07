import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { CardAPI } from "@/const/endPoint";
import { CartTransformer } from "@/utils/api/transformer/cart";
import { getData } from "@/utils/api/fetchData/apiCall";
import { CartContextType, AddToCartItem, RemoveFromCart } from "@/utils/type";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Mock data for testing UI/UX
const mockCartData = {
  totalProduct: 8,
  products: [
    {
      id: "1",
      productAttributeId: "11",
      quantity: 2,
      name: "iPhone 15 Pro Max",
      image: "/images/brands/Apple.jpg",
      price: "29,990,000₫",
      attributes: {
        "Màu sắc": "Titan Tự nhiên",
        "Dung lượng": "256GB"
      }
    },
    {
      id: "2", 
      productAttributeId: "22",
      quantity: 1,
      name: "Samsung Galaxy S24 Ultra",
      image: "/images/brands/Samsung.avif",
      price: "26,990,000₫",
      attributes: {
        "Màu sắc": "Titanium Gray",
        "Dung lượng": "512GB"
      }
    },
    {
      id: "3",
      productAttributeId: "33", 
      quantity: 3,
      name: "Xiaomi 14 Pro",
      image: "/images/brands/Xiaomi.jpg",
      price: "18,990,000₫",
      attributes: {
        "Màu sắc": "Đen",
        "Dung lượng": "256GB"
      }
    },
    {
      id: "4",
      productAttributeId: "44",
      quantity: 1,
      name: "OnePlus 12",
      image: "/images/brands/Oneplus.jpg",
      price: "22,990,000₫",
      attributes: {
        "Màu sắc": "Flowy Emerald",
        "Dung lượng": "512GB",
        "RAM": "16GB"
      }
    },
    {
      id: "5",
      productAttributeId: "55",
      quantity: 4,
      name: "OPPO Find X7",
      image: "/images/brands/Oppo.jpg",
      price: "15,990,000₫",
      attributes: {
        "Màu sắc": "Ocean Blue",
        "Dung lượng": "256GB"
      }
    },
    {
      id: "6",
      productAttributeId: "66",
      quantity: 1,
      name: "Realme GT 5 Pro",
      image: "/images/brands/Realme.jpg",
      price: "12,990,000₫",
      attributes: {
        "Màu sắc": "Snapdragon White",
        "Dung lượng": "256GB",
        "RAM": "12GB"
      }
    },
    {
      id: "7",
      productAttributeId: "77",
      quantity: 2,
      name: "Vivo X100 Pro",
      image: "/images/brands/Vivo.jpg",
      price: "24,990,000₫",
      attributes: {
        "Màu sắc": "Asteroid Black",
        "Dung lượng": "512GB"
      }
    },
    {
      id: "8",
      productAttributeId: "88",
      quantity: 1,
      name: "Huawei Mate 60 Pro",
      image: "/images/brands/Huawei.jpg",
      price: "28,990,000₫",
      attributes: {
        "Màu sắc": "Space Black",
        "Dung lượng": "512GB",
        "Kết nối": "5G"
      }
    }
  ]
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize with mock data immediately
  const [cart, setCart] = useState<any>(mockCartData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with mock data for development
    setCart(mockCartData);
  }, []);

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
      value={{ cart, addToCart, removeFromCart, updateQuantity, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
};
