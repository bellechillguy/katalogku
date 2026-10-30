import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProduct } from '../data/products';

const CartContext = createContext(null);
const STORAGE_KEY = '@katalogku/cart';

function makeKey(id, color, size) {
  return JSON.stringify([id, color ?? null, size ?? null]);
}

function stockLimitFor(id) {
  return Math.max(0, Number(getProduct(id)?.demoStock) || 0);
}

function normalizeItems(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item.id === 'string')
    .map((item) => {
      const color = typeof item.color === 'string' ? item.color : null;
      const size = typeof item.size === 'string' ? item.size : null;
      const stockLimit = stockLimitFor(item.id);
      if (!stockLimit) return null;
      const quantity = Math.min(stockLimit, Math.max(1, Math.floor(Number(item.quantity) || 1)));
      return { key: makeKey(item.id, color, size), id: item.id, color, size, quantity };
    })
    .filter(Boolean);
}

function applyAction(items, action) {
  if (action.type === 'add') {
    const stockLimit = stockLimitFor(action.id);
    if (!stockLimit) return items;
    const key = makeKey(action.id, action.color, action.size);
    const existing = items.find((item) => item.key === key);
    if (existing) {
      return items.map((item) => item.key === key
        ? { ...item, quantity: Math.min(stockLimit, item.quantity + 1) }
        : item);
    }
    return [
      ...items,
      {
        key,
        id: action.id,
        color: action.color ?? null,
        size: action.size ?? null,
        quantity: 1,
      },
    ];
  }

  if (action.type === 'quantity') {
    if (action.quantity < 1) return items.filter((item) => item.key !== action.key);
    return items.map((item) => item.key === action.key
      ? { ...item, quantity: Math.min(stockLimitFor(item.id), Math.floor(action.quantity)) }
      : item);
  }

  if (action.type === 'remove') {
    return items.filter((item) => item.key !== action.key);
  }

  if (action.type === 'clear') return [];
  return items;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const itemsRef = useRef([]);
  const readyRef = useRef(false);
  const pendingActions = useRef([]);
  const writeQueue = useRef(Promise.resolve());

  const persist = useCallback((nextItems) => {
    writeQueue.current = writeQueue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        let loadedItems = [];
        try {
          loadedItems = normalizeItems(stored ? JSON.parse(stored) : []);
        } catch {
          loadedItems = [];
        }
        const queued = pendingActions.current;
        queued.forEach((action) => { loadedItems = applyAction(loadedItems, action); });
        pendingActions.current = [];
        itemsRef.current = loadedItems;
        setItems(loadedItems);
        readyRef.current = true;
        setReady(true);
        if (queued.length) persist(loadedItems);
      })
      .catch(() => {
        if (!active) return;
        const queued = pendingActions.current;
        let loadedItems = [];
        queued.forEach((action) => { loadedItems = applyAction(loadedItems, action); });
        pendingActions.current = [];
        itemsRef.current = loadedItems;
        setItems(loadedItems);
        readyRef.current = true;
        setReady(true);
        if (queued.length) persist(loadedItems);
      });
    return () => { active = false; };
  }, [persist]);

  const dispatch = useCallback((action) => {
    if (!readyRef.current) {
      pendingActions.current.push(action);
      return;
    }
    const nextItems = applyAction(itemsRef.current, action);
    itemsRef.current = nextItems;
    setItems(nextItems);
    persist(nextItems);
  }, [persist]);

  const addItem = useCallback((id, options = {}) => {
    dispatch({
      type: 'add',
      id,
      color: typeof options.color === 'string' ? options.color : null,
      size: typeof options.size === 'string' ? options.size : null,
    });
  }, [dispatch]);
  const updateQuantity = useCallback((key, quantity) => {
    dispatch({ type: 'quantity', key, quantity: Math.floor(Number(quantity) || 0) });
  }, [dispatch]);
  const removeItem = useCallback((key) => dispatch({ type: 'remove', key }), [dispatch]);
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [dispatch]);

  const value = useMemo(
    () => ({ items, ready, addItem, updateQuantity, removeItem, clearCart }),
    [items, ready, addItem, updateQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
