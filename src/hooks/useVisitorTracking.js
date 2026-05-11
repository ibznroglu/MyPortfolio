import { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp, get } from 'firebase/database';
import { database } from '../config/firebase';

export const useVisitorTracking = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const visitorIdRef = useRef(null);

  useEffect(() => {
    const getOrCreateVisitorId = () => {
      let visitorId = localStorage.getItem('visitorId');
      if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('visitorId', visitorId);
      }
      return visitorId;
    };

    const visitorId = getOrCreateVisitorId();
    visitorIdRef.current = visitorId;

    const activeUsersRef = ref(database, 'activeUsers');
    const visitorRef = ref(database, `activeUsers/${visitorId}`);
    const totalVisitorsRef = ref(database, 'totalVisitors');

    // Listener'ları ÖNCE kur
    const unsubscribeActiveUsers = onValue(activeUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const activeUsersData = snapshot.val();
        const now = Date.now();
        const validActiveUsers = Object.keys(activeUsersData).filter(userId => {
          const lastSeen = activeUsersData[userId]?.lastSeen;
          if (!lastSeen) return false;
          return (now - lastSeen) < 30000;
        });
        setActiveUsers(validActiveUsers.length);
      } else {
        setActiveUsers(0);
      }
    });

    const unsubscribeTotalVisitors = onValue(totalVisitorsRef, (snapshot) => {
      if (snapshot.exists()) {
        setTotalVisitors(snapshot.val());
      }
    });

    // SONRA yazma işlemlerini yap
    const init = async () => {
      try {
        // Aktif kullanıcı ekle
        await set(visitorRef, {
          timestamp: serverTimestamp(),
          lastSeen: Date.now()
        });
        onDisconnect(visitorRef).remove();

        // Toplam ziyaretçi güncelle
        const snapshot = await get(totalVisitorsRef);
        if (!snapshot.exists()) {
          await set(totalVisitorsRef, 1);
          localStorage.setItem('lastVisitDate', new Date().toDateString());
        } else {
          const lastVisitDate = localStorage.getItem('lastVisitDate');
          const today = new Date().toDateString();
          if (lastVisitDate !== today) {
            await set(totalVisitorsRef, snapshot.val() + 1);
            localStorage.setItem('lastVisitDate', today);
          }
        }
      } catch (error) {
        console.error('Visitor tracking error:', error);
      }
    };

    init();

    const heartbeatInterval = setInterval(() => {
      if (visitorIdRef.current) {
        set(ref(database, `activeUsers/${visitorIdRef.current}`), {
          timestamp: serverTimestamp(),
          lastSeen: Date.now()
        });
      }
    }, 10000);

    return () => {
      unsubscribeActiveUsers();
      unsubscribeTotalVisitors();
      clearInterval(heartbeatInterval);
      if (visitorIdRef.current) {
        set(ref(database, `activeUsers/${visitorIdRef.current}`), null).catch(() => {});
      }
    };
  }, []); // isInitializedRef kaldırıldı

  return { totalVisitors, activeUsers };
};