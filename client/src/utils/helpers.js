export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

// IndexedDB is asynchronous and event driven. 
// we'll use one function that opens the database connection, creates the object store (if it's the first time using it on the machine), and runs whatever transaction we need to have run on a successful connection. So when we call the function, we'll open the connection to the database and then connect to the object store that we pass in as storeName. Then we'll perform a transaction, using the method and object values to help carry it out. We also wrap the whole thing in a Promise, making it a lot easier to work with IndexedDB's asynchronous nature.

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
    // with IndexedDB, the .onupgradeneeded() event only runs if the browser notices that the version number in the .open() method has changed since the last time, or if the browser has never connected to the database before and 1 is the new version. Any other time this code executes and the version is still 1, the .onupgradeneeded() will not run.
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the `_id` of the data
      // we'd like to provide the actual index value we want to use for looking up data. Because that index value will be the MongoDB _id property for each product or category, it makes sense to set the keyPath name to _id.
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function(e) {
      console.log('There was an error');
    };

    // on database open success
  request.onsuccess = function(e) {
  // save a reference of the database to the `db` variable
  // when the database connection opens successfully, we immediately save a reference of the database to the db variable.
  db = request.result;
  // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
  // Then we open a new transaction using the .transaction() method, passing in the object store that we want to interact with and the permissions we want in this transaction.
  tx = db.transaction(storeName, 'readwrite');
  // save a reference to that object store
  // The storeName—one of the three stores we created for the database—will be passed in as an argument in the idbPromise() function when we call it from a component.
  store = tx.objectStore(storeName);

  // if there's any errors, let us know
  db.onerror = function(e) {
    console.log('error', e);
  };

  // Here we use a switch statement to check what the value of the method is. If it's put, then we run the .put() method on the object store, overwriting any data with the matching _id value from the object and adding it if it can't find a match. If it's get, we'll simply get all data from that store and return it. Both the put and get methods will return the data to wherever we call this idbPromise() function.

// If the value is delete, we'll delete that item from the object store. This option will come in handy if users want to remove an item from the shopping cart while offline. 

  switch (method) {
    case 'put':
      store.put(object);
      resolve(object);
      break;
    case 'get':
      const all = store.getAll();
      all.onsuccess = function() {
        resolve(all.result);
      };
      break;
    case 'delete':
      store.delete(object._id);
      break;
    default:
      console.log('No valid method');
      break;
  }
  

  // when the transaction is complete, close the connection
  tx.oncomplete = function() {
    db.close();
  };
};

  });
}