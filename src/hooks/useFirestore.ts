import { useState, useEffect, useCallback } from 'react';
import { FirestoreService } from '../services/firebaseService';
import { QueryConstraint } from 'firebase/firestore';

/**
 * Firestore koleksiyonları için React hook
 */
export function useFirestoreCollection<T>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.getCollection<T>(collectionName);
    
    if (result.success) {
      setData(result.data || []);
    } else {
      setError(result.error || 'Veri yüklenirken hata oluştu');
    }
    
    setLoading(false);
  }, [collectionName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    reload: loadData,
  };
}

/**
 * Firestore doküman için React hook
 */
export function useFirestoreDocument<T>(collectionName: string, documentId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!documentId) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.getDocument<T>(collectionName, documentId);
    
    if (result.success) {
      setData(result.data || null);
    } else {
      setError(result.error || 'Veri yüklenirken hata oluştu');
    }
    
    setLoading(false);
  }, [collectionName, documentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    reload: loadData,
  };
}

/**
 * Firestore query için React hook
 */
export function useFirestoreQuery<T>(
  collectionName: string, 
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.queryCollection<T>(collectionName, constraints);
    
    if (result.success) {
      setData(result.data || []);
    } else {
      setError(result.error || 'Veri yüklenirken hata oluştu');
    }
    
    setLoading(false);
  }, [collectionName, constraints]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    error,
    reload: loadData,
  };
}

/**
 * Firestore CRUD işlemleri için React hook
 */
export function useFirestoreCrud<T>(collectionName: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const add = useCallback(async (data: Omit<T, 'id'>): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.addDocument<T>(collectionName, data);
    
    setLoading(false);
    
    if (result.success) {
      return result.data || null;
    } else {
      setError(result.error || 'Ekleme işlemi başarısız');
      return null;
    }
  }, [collectionName]);

  const update = useCallback(async (documentId: string, data: Partial<T>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.updateDocument(collectionName, documentId, data);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Güncelleme işlemi başarısız');
      return false;
    }
  }, [collectionName]);

  const remove = useCallback(async (documentId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const result = await FirestoreService.deleteDocument(collectionName, documentId);
    
    setLoading(false);
    
    if (result.success) {
      return true;
    } else {
      setError(result.error || 'Silme işlemi başarısız');
      return false;
    }
  }, [collectionName]);

  return {
    add,
    update,
    remove,
    loading,
    error,
  };
}

export default {
  useFirestoreCollection,
  useFirestoreDocument,
  useFirestoreQuery,
  useFirestoreCrud,
};