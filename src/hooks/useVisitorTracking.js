import { useState, useEffect, useRef } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp, get } from 'firebase/database';
import { database } from '../config/firebase';

export const useVisitorTracking = () => {
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const visitorIdRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Her ziyaretçi için benzersiz ID oluştur
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

    // Aktif kullanıcılar referansı
    const activeUsersRef = ref(database, 'activeUsers');
    const visitorRef = ref(database, `activeUsers/${visitorId}`);

    // Ziyaretçiyi aktif kullanıcılar listesine ekle
    const addActiveUser = async () => {
      try {
        await set(visitorRef, {
          timestamp: serverTimestamp(),
          lastSeen: Date.now()
        });

        // Kullanıcı sayfadan ayrıldığında listeden çıkar
        onDisconnect(visitorRef).remove();
      } catch (error) {
        console.error('Aktif kullanıcı eklenirken hata:', error);
      }
    };

    // Toplam ziyaretçi sayısını kontrol et ve artır
    const updateTotalVisitors = async () => {
      try {
        const totalVisitorsRef = ref(database, 'totalVisitors');
        const snapshot = await get(totalVisitorsRef);
        
        if (!snapshot.exists()) {
          // İlk ziyaretçi
          await set(totalVisitorsRef, 1);
        } else {
          // Yeni ziyaretçi kontrolü (localStorage ile)
          const lastVisitDate = localStorage.getItem('lastVisitDate');
          const today = new Date().toDateString();
          
          if (lastVisitDate !== today) {
            // Bugün ilk ziyareti
            const currentTotal = snapshot.val();
            await set(totalVisitorsRef, currentTotal + 1);
            localStorage.setItem('lastVisitDate', today);
          }
        }
      } catch (error) {
        console.error('Toplam ziyaretçi güncellenirken hata:', error);
      }
    };

    // Aktif kullanıcıları dinle
    const unsubscribeActiveUsers = onValue(activeUsersRef, (snapshot) => {
      if (snapshot.exists()) {
        const activeUsersData = snapshot.val();
        const activeUsersList = Object.keys(activeUsersData);
        
        // 30 saniyeden eski kullanıcıları temizle
        const now = Date.now();
        const validActiveUsers = activeUsersList.filter(userId => {
          const userData = activeUsersData[userId];
          // lastSeen değerini kontrol et (timestamp server-side olduğu için lastSeen kullanıyoruz)
          const lastSeen = userData?.lastSeen;
          if (!lastSeen) return false;
          return (now - lastSeen) < 30000; // 30 saniye
        });
        
        setActiveUsers(validActiveUsers.length);
      } else {
        setActiveUsers(0);
      }
    });

    // Toplam ziyaretçi sayısını dinle
    const totalVisitorsRef = ref(database, 'totalVisitors');
    const unsubscribeTotalVisitors = onValue(totalVisitorsRef, (snapshot) => {
      if (snapshot.exists()) {
        setTotalVisitors(snapshot.val());
      }
    });

    // İlk yüklemede aktif kullanıcı ekle ve toplam ziyaretçiyi güncelle
    if (!isInitializedRef.current) {
      addActiveUser();
      updateTotalVisitors();
      isInitializedRef.current = true;
    }

    // Her 10 saniyede bir aktif kullanıcı durumunu güncelle
    const heartbeatInterval = setInterval(() => {
      if (visitorIdRef.current) {
        set(ref(database, `activeUsers/${visitorIdRef.current}`), {
          timestamp: serverTimestamp(),
          lastSeen: Date.now()
        });
      }
    }, 10000);

    // Cleanup
    return () => {
      unsubscribeActiveUsers();
      unsubscribeTotalVisitors();
      clearInterval(heartbeatInterval);
      
      // Sayfadan ayrılırken aktif kullanıcı listesinden çıkar
      if (visitorIdRef.current) {
        set(ref(database, `activeUsers/${visitorIdRef.current}`), null).catch(() => {});
      }
    };
  }, []);

  return { totalVisitors, activeUsers };
};

