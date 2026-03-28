import { getDatabase, ref, push, set, update, remove, onValue, off } from 'firebase/database';

const db = () => getDatabase();

export const saveOrder = async (orderData) => {
  const ordersRef = ref(db(), 'orders');
  const newRef = push(ordersRef);
  await set(newRef, { ...orderData, firebaseKey: newRef.key });
  return newRef.key;
};

export const updateOrder = async (firebaseKey, patch) => {
  await update(ref(db(), `orders/${firebaseKey}`), patch);
};

export const deleteOrder = async (firebaseKey) => {
  await remove(ref(db(), `orders/${firebaseKey}`));
};

export const listenOrders = (callback) => {
  const ordersRef = ref(db(), 'orders');
  const handler = (snapshot) => {
    const data = snapshot.val();
    if (!data) { callback([]); return; }
    const list = Object.entries(data).map(([key, val]) => ({ ...val, firebaseKey: key }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  };
  onValue(ordersRef, handler);
  return () => off(ordersRef, 'value', handler);
};

export const listenOrder = (firebaseKey, callback) => {
  const orderRef = ref(db(), `orders/${firebaseKey}`);
  const handler = (snapshot) => callback(snapshot.val());
  onValue(orderRef, handler);
  return () => off(orderRef, 'value', handler);
};
