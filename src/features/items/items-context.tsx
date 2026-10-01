import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { itemsRepository } from '@/storage/items-repository';

import type { CampusItem, CreateItemInput, UpdateItemInput } from './item';
import { queryItems } from './item-query';
import { createItemService, type ItemService } from './item-service';

type ItemsContextValue = {
  items: CampusItem[];
  currentUserId: string;
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createItem: ItemService['createItem'];
  updateItem: ItemService['updateItem'];
  markResolved: ItemService['markResolved'];
  deleteItem: ItemService['deleteItem'];
};

const ItemsContext = createContext<ItemsContextValue | null>(null);
const itemService = createItemService(itemsRepository);

export function ItemsProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CampusItem[]>([]);
  const [ready, setReady] = useState(false);
  const [refreshing, setRefreshing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const revision = useRef(0);

  const refresh = useCallback(async () => {
    const currentRequest = ++request.current;
    const currentRevision = revision.current;
    setRefreshing(true);
    setError(null);
    try {
      const result = await itemService.listItems();
      if (currentRequest === request.current && currentRevision === revision.current) {
        setItems(result);
        setReady(true);
      }
    } catch (failure) {
      if (currentRequest === request.current) {
        setError(failure instanceof Error ? failure.message : '无法读取本地数据，请重试');
      }
    } finally {
      if (currentRequest === request.current) {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();
    return () => {
      request.current += 1;
    };
  }, [refresh]);

  const save = useCallback(async (operation: () => Promise<CampusItem>) => {
    const item = await operation();
    revision.current += 1;
    setItems(previous => queryItems([...previous.filter(existing => existing.id !== item.id), item]));
    return item;
  }, []);

  const createItem = useCallback((input: CreateItemInput) => save(() => itemService.createItem(input)), [save]);
  const updateItem = useCallback(
    (id: string, input: UpdateItemInput) => save(() => itemService.updateItem(id, input)),
    [save]
  );
  const markResolved = useCallback((id: string) => save(() => itemService.markResolved(id)), [save]);
  const deleteItem = useCallback(async (id: string) => {
    await itemService.deleteItem(id);
    revision.current += 1;
    setItems(previous => previous.filter(item => item.id !== id));
  }, []);

  const value = useMemo(() => ({
    items,
    currentUserId: itemService.currentUserId,
    refreshing,
    error,
    refresh,
    createItem,
    updateItem,
    markResolved,
    deleteItem,
  }), [items, refreshing, error, refresh, createItem, updateItem, markResolved, deleteItem]);

  return (
    <ItemsContext.Provider value={value}>
      {ready
        ? children
        : (
            <View className="flex-1 items-center justify-center gap-4 bg-[#F8F4ED] px-6">
              {error
                ? (
                    <>
                      <Text className="text-center text-[15px] text-[#9E534F]" accessibilityRole="alert">{error}</Text>
                      <Pressable
                        className="rounded-full bg-[#5F834B] px-6 py-3"
                        onPress={() => void refresh()}
                        accessibilityRole="button"
                        accessibilityLabel="重新读取本地数据"
                      >
                        <Text className="text-[#FFFDF9]">重试</Text>
                      </Pressable>
                    </>
                  )
                : (
                    <>
                      <ActivityIndicator color="#5F834B" />
                      <Text className="text-[15px] text-[#575C56]">正在读取本地数据…</Text>
                    </>
                  )}
            </View>
          )}
    </ItemsContext.Provider>
  );
}

export function useItems(): ItemsContextValue {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems 必须在 ItemsProvider 内使用');
  }
  return context;
}

export function useItem(id: string | string[] | undefined): CampusItem | undefined {
  const { items } = useItems();
  const key = Array.isArray(id) ? id[0] : id;
  return items.find(item => item.id === key);
}
