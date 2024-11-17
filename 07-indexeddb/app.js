
// indexedDB

const request = window.indexedDB.open('myDatabase', 1);

request.onupgradeneeded = (event) => {
  console.log('Upgrade needed');
  const db = event.target.result;

  let objectStore = db.createObjectStore('heroes', { keyPath: 'id' });
}


request.onerror = (event) => {
  console.log('DB Error', event.target.error);
}

request.onsuccess = (event) => {
  const db = event.target.result;

  const heroesData = [
    { id: '1', name: 'Spiderman', message: 'Hello, I am Spiderman' },
    { id: '2', name: 'Ironman', message: 'Hello, I am Ironman' }
  ];

  const transaction = db.transaction('heroes', 'readwrite');

  transaction.onerror = (event) => {
    console.log('Transaction error', event.target.error);
  }

  transaction.oncomplete = (event) => {
    console.log('Transaction completed', event);
  }

  const heroesStore = transaction.objectStore('heroes');

  heroesData.forEach(hero => {
    heroesStore.add(hero);
  });

  transaction.onsuccess = (event) => {
    console.log('Data added successfully');
  }
}