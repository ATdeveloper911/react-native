import { ref, onValue, off, get, set, push, runTransaction, update } from 'firebase/database';
import { database } from '../config/firebase';
import { Bin } from '../types';
import { ALERT_THRESHOLD } from '../utils/constants';

const getStatusFromFillLevel = (fillLevel: number): Bin['status'] => {
  if (fillLevel >= 100) return 'overflow';
  if (fillLevel >= ALERT_THRESHOLD) return 'full';
  if (fillLevel > 0) return 'filling';
  return 'empty';
};

export const binService = {
  // Listen to all bins in real-time
  subscribeToBins(callback: (bins: Bin[]) => void): () => void {
    const binsRef = ref(database, 'bins');
    
    const unsubscribe = onValue(
      binsRef,
      (snapshot) => {
        const binsData = snapshot.val();
        const bins: Bin[] = [];

        if (binsData) {
          Object.keys(binsData).forEach((binId) => {
            bins.push({
              id: binId,
              ...binsData[binId],
            });
          });
        }

        callback(bins);
      },
      (error) => {
        console.error('Failed to subscribe to bins:', error);
        callback([]);
      }
    );

    return () => {
      off(binsRef);
    };
  },

  // Get a single bin
  async getBin(binId: string): Promise<Bin | null> {
    const snapshot = await get(ref(database, `bins/${binId}`));
    if (snapshot.exists()) {
      return {
        id: binId,
        ...snapshot.val(),
      };
    }
    return null;
  },

  async incrementBinFillLevel(binId: string, incrementBy: number = 10): Promise<void> {
    const binRef = ref(database, `bins/${binId}`);

    await runTransaction(binRef, (currentBin: any) => {
      const existing = currentBin ?? {
        name: `Bin ${binId}`,
        fillLevel: 0,
        status: 'empty',
        isOnline: true,
        lastUpdate: Date.now(),
      };

      const newFillLevel = Math.min((existing.fillLevel || 0) + incrementBy, 100);
      let newStatus: Bin['status'] = 'empty';

      if (newFillLevel >= 100) {
        newStatus = 'overflow';
      } else if (newFillLevel >= ALERT_THRESHOLD) {
        newStatus = 'full';
      } else if (newFillLevel > 0) {
        newStatus = 'filling';
      }

      return {
        ...existing,
        fillLevel: newFillLevel,
        status: newStatus,
        updatedAt: Date.now(),
        lastUpdate: Date.now(),
        dumpCount: (existing.dumpCount || 0) + 1,
        lastDumpAt: Date.now(),
      };
    });
  },

  // Listen to a single bin
  subscribeToBin(binId: string, callback: (bin: Bin | null) => void): () => void {
    const binRef = ref(database, `bins/${binId}`);
    
    const unsubscribe = onValue(binRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({
          id: binId,
          ...snapshot.val(),
        });
      } else {
        callback(null);
      }
    });

    return () => {
      off(binRef);
    };
  },

  // Update a bin with new data
  async updateBin(binId: string, updates: Partial<Bin>): Promise<void> {
    const binRef = ref(database, `bins/${binId}`);
    await update(binRef, updates as any);
  },

  // Get all bins once (for one-time operations)
  async getBinsOnce(): Promise<Bin[]> {
    const snapshot = await get(ref(database, 'bins'));
    const bins: Bin[] = [];
    
    if (snapshot.exists()) {
      const binsData = snapshot.val();
      Object.keys(binsData).forEach((binId) => {
        bins.push({
          id: binId,
          ...binsData[binId],
        });
      });
    }
    
    return bins;
  },

  // Create a new bin
  async createBin(binData: Omit<Bin, 'id'>): Promise<string> {
    const binsRef = ref(database, 'bins');
    const newBinRef = push(binsRef);
    const binId = newBinRef.key;
    
    if (!binId) {
      throw new Error('Failed to generate bin ID');
    }

    const newBin: Bin = {
      id: binId,
      ...binData,
    };

    await set(newBinRef, newBin);
    return binId;
  },
};

