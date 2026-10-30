import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext(null);
const STORAGE_KEY = '@katalogku/favorites';

function toggleId(ids, id) {
  return ids.includes(id) ? ids.filter((savedId) => savedId !== id) : [...ids, id];
}

export function FavoritesProvider({ children }) {
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);
  const idsRef = useRef([]);
  const readyRef = useRef(false);
  const pendingToggles = useRef([]);
  const writeQueue = useRef(Promise.resolve());

  const persist = useCallback((nextIds) => {
    writeQueue.current = writeQueue.current
      .catch(() => {})
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        let loadedIds = [];
        try {
          const parsed = stored ? JSON.parse(stored) : [];
          if (Array.isArray(parsed)) loadedIds = parsed.filter((id) => typeof id === 'string');
        } catch {
          loadedIds = [];
        }
        const queued = pendingToggles.current;
        queued.forEach((id) => { loadedIds = toggleId(loadedIds, id); });
        pendingToggles.current = [];
        idsRef.current = loadedIds;
        setIds(loadedIds);
        readyRef.current = true;
        setReady(true);
        if (queued.length) persist(loadedIds);
      })
      .catch(() => {
        if (!active) return;
        const queued = pendingToggles.current;
        let loadedIds = [];
        queued.forEach((id) => { loadedIds = toggleId(loadedIds, id); });
        pendingToggles.current = [];
        idsRef.current = loadedIds;
        setIds(loadedIds);
        readyRef.current = true;
        setReady(true);
        if (queued.length) persist(loadedIds);
      });
    return () => { active = false; };
  }, [persist]);

  const toggle = useCallback((id) => {
    const nextIds = toggleId(idsRef.current, id);
    idsRef.current = nextIds;
    setIds(nextIds);
    if (readyRef.current) persist(nextIds);
    else pendingToggles.current.push(id);
  }, [persist]);

  const value = useMemo(
    () => ({ ids, ready, toggle, isFavorite: (id) => ids.includes(id) }),
    [ids, ready, toggle]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
