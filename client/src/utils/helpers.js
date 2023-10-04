export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + "s";
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("shop-shop", 1);
    let db, tx, store;
    request.onerror = function (e) {
      console.error("Error opening IndexedDB:", e.target.error);
      reject(new Error("Failed to open IndexedDB."));
    };

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, "readwrite");
      store = tx.objectStore(storeName);
      db.onerror = function (e) {
        console.error("IndexedDB error:", e.target.error);
        reject(new Error("IndexedDB operation failed."));
      };
      switch (method) {
        case "put":
          const putRequest = store.put(object);
          putRequest.onsuccess = () => resolve(object);
          putRequest.onerror = (error) => {
            console.error("IndexedDB put error:", error.target.error);
            reject(new Error("IndexedDB put operation failed."));
          };
          break;
        case "get":
          const getRequest = store.getAll();
          getRequest.onsuccess = () => resolve(getRequest.result);
          getRequest.onerror = (error) => {
            console.error("IndexedDB get error:", error.target.error);
            reject(new Error("IndexedDB get operation failed."));
          };
          break;
        case "delete":
          const deleteRequest = store.delete(object._id);
          deleteRequest.onsuccess = () => resolve();
          deleteRequest.onerror = (error) => {
            console.error("IndexedDB delete error:", error.target.error);
            reject(new Error("IndexedDB delete operation failed."));
          };
          break;
        default:
          console.error("No valid method provided.");
          reject(new Error("Invalid method provided."));
          break;
      }
      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}