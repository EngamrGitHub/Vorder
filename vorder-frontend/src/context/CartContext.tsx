import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cartApi } from '../api/cart';
import { useAuth } from './AuthContext';

interface CartContextValue {
  count: number;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) {
      setCount(0);
      return;
    }
    const res = await cartApi.getMyCart();
    setCount(res.isSuccess && res.result ? res.result.length : 0);
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(() => ({ count, refresh }), [count, refresh]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
