import * as firebase from 'firebase';
import { SORT_BY_VALUE } from '../store/actions/adAction';
import { store } from '../store/store';

var config = {
  // apiKey: "AIzaSyCQ7s6wLxDOSbYLHZ4JYWfm6RlltRoFViY",
  // authDomain: "saylani-8099b.firebaseapp.com",
  // databaseURL: "https://saylani-8099b.firebaseio.com",
  // projectId: "saylani-8099b",
  // storageBucket: "saylani-8099b.appspot.com",
  // messagingSenderId: "1028251352751"

  apiKey: "AIzaSyCAzCOxNFY8WCGXtR-8W6dhw-Nu_hN06p0",
  authDomain: "fir-demo-22537.firebaseapp.com",
  databaseURL: "https://fir-demo-22537.firebaseio.com",
  projectId: "fir-demo-22537",
  storageBucket: "fir-demo-22537.appspot.com",
  messagingSenderId: "751005805346"
};
firebase.initializeApp(config);

//When ever the user authentication state changes write the user to vuex.
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch({
      type: 'SET_FIREBASE_USER',
      data: user.uid
    });
  } else {
    store.dispatch({
      type: 'SET_FIREBASE_USER',
      data: null
    });
  }
});

export const database = firebase.firestore();

export const register = (email, password, name, age) => {
  return new Promise((resolve, reject) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (res) {
        addUser(res.user.uid, email, name, age);
        resolve();
      })
      .catch(function (error) {
        alert(error.message);
        reject(error.message);
      })
  });
}

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (res) {
        resolve(res.user.uid);
      })
      .catch(function (error) {
        alert(error.message);
        reject();
      })
  });
}

export const loginWithGoogle = () => {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    var token = result.credential.accessToken;
    var user = result.user;
    console.log(user);
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;
    var credential = error.credential;
  });
}

export const changePassword = (newPassword) => {
  const firebaseUser = firebase.auth().currentUser;
  if (!firebaseUser) {
    return;
  }
  firebaseUser.updatePassword(newPassword).then(function () {
    alert("Password Changed successfully");
  }).catch(function (error) {
    alert(error);
  });
}

export const forgotPassword = (emailAddress) => {
  return new Promise((resolve, reject) => {
    var auth = firebase.auth();
    auth.sendPasswordResetEmail(emailAddress).then(function () {
      resolve();
    }).catch(function (error) {
      reject(error);
    });
  });
}

export const updateCurrentUser = (email, name, age) => {
  const firebaseUser = firebase.auth().currentUser;
  if (!firebaseUser) {
    return;
  }
  return new Promise((resolve, reject) => {
    database.collection("users").doc(firebaseUser.uid).set({ email, name, age })
      .then(async () => {
        const user = await getUserData(firebaseUser.uid);
        resolve(user);
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        reject(error);
      });
  });
}

export const getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    var docRef = database.collection("users").doc(userId);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        resolve(doc.data());
      }
    }).catch(function (error) {
      reject(`"Error getting document:" ${error}`);
    });
  });
}

export const getCategories = () => {
  return new Promise((resolve, reject) => {
    database.collection("categories").get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        resolve(doc.data().categories);
      });
    }).catch(function (error) {
      reject(`"Error getting document:" ${error}`);
    });
  });
}

export const getLocations = () => {
  return new Promise((resolve, reject) => {
    database.collection("addresses").get().then(function (querySnapshot) {
      const addresses = [];
      querySnapshot.forEach(function (doc) {
        addresses.push(doc.data());
      });
      resolve(addresses);
    }).catch(function (error) {
      reject(`"Error getting document:" ${error}`);
    });
  });
}

export const getAds = (filterParams, adsLimit) => {
  return new Promise((resolve, reject) => {
    var adRef = database.collection("ads");
    appendFilterParams(adRef, filterParams).limit(adsLimit).get()
      .then((querySnapshot) => {
        var ads = [];
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          ads.push({
            adId: doc.id,
            category: data.category,
            createdAt: data.createdAt,
            description: data.description,
            images: data.images,
            price: data.price,
            title: data.title
          });
        });

        if (filterParams.sortByValue) {
          ads.sort(adSorter(filterParams.sortByValue));
        }

        resolve(ads);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export const getAdDetails = (adId) => {
  return new Promise((resolve, reject) => {
    var adDetails = null;
    var docRef = database.collection("ads").doc(adId);
    docRef.get().then(function (doc) {
      if (doc.exists) {
        const data = doc.data();
        adDetails = {
          adId: doc.id,
          postedByUserId: data.user.id,
          category: data.category,
          createdAt: data.createdAt,
          description: data.description,
          images: data.images,
          price: data.price,
          title: data.title,
          location: data.location
        };

        if (data.user) {
          data.user.get()
            .then(res => {
              adDetails = { ...adDetails, postedByUserName: res.data().name };
              resolve(adDetails);
            })
        }
      }
    }).catch(function (error) {
      reject(`"Error getting document:" ${error}`);
    });
  });
}

export const getLocationDetails = (locationName) => {
  return new Promise((resolve, reject) => {
    database.collection("addresses").where('name', '==', locationName).get()
      .then((querySnapshot) => {
        var locations = {};
        querySnapshot.forEach(function (doc) {
          const data = doc.data();
          locations = {
            name: data.name,
            longitude: data.longitude,
            latitude: data.latitude,
            zoom: data.zoom
          };
        });

        resolve(locations);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export const getChatRoomId = (adId, viewerUserId) => {
  return new Promise((resolve, reject) => {
    database.collection("chatrooms")
      .where('adId', '==', adId)
      .where('viewerUserId', '==', viewerUserId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(function (doc) {
          resolve(doc.id);
        });
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export const getChatRoomDetails = (adId) => {
  return new Promise((resolve, reject) => {
    database.collection("chatrooms").where('adId', '==', adId).get().then((querySnapshot) => {
      const chatrooms = [];
      querySnapshot.forEach(function (doc) {
        chatrooms.push({
          id: doc.id,
          ...doc.data()
        });
      });

      addUserNameToRooms(chatrooms)
        .then(updatedChatrooms => {
          resolve(updatedChatrooms);
        })
    })
      .catch(function (error) {
        reject(error);
      });
  });
}

export const getChatMessages = (chatroomId, onMessageUpdate) => {
  var chatroomRef = database.collection("chatrooms").doc(chatroomId);
  chatroomRef.get().then(function (doc) {
    if (doc.exists) {
      doc.ref.collection('messages').orderBy("createdAt").onSnapshot(querySnapshot => onMessageUpdate(querySnapshot));
    }
  })
}

export const createChatRoom = (adId, loggedInUserId) => {
  var chatroomRef = database.collection("chatrooms").doc();
  chatroomRef.set({
    adId: adId,
    lastMessage: "",
    viewerUserId: loggedInUserId,
  }).then(function (docRef) {
    console.log("Document has written");
  }).catch(function (error) {
    console.error("Error adding document: ", error);
  });
  return chatroomRef.id;
}

export const addMessageToChatroom = (chatRoomId, loggedInUserId, message) => {
  const currentTime = Date.now();
  var chatroomRef = database.collection('chatrooms').doc(chatRoomId);
  chatroomRef.set({
    lastMessage: message,
    lastMessageSentAt: currentTime
  }, { merge: true }).catch(function (error) {
    console.error("Error adding document: ", error);
  });

  var messageRef = chatroomRef.collection('messages').doc();
  messageRef.set({
    createdAt: currentTime,
    text: message,
    userId: loggedInUserId
  }).catch(function (error) {
    console.error("Error adding document: ", error);
  });
}

export const uploadImagesToFirebase = async (files) => {
  if (!firebase.auth().currentUser) {
    return;
  }
  return new Promise(async (resolve, reject) => {
    var storageRef = firebase.storage().ref();
    const downloadUrls = [];
    for (let i = 0; i < files.length; i++) {
      const rawName = files[i].name;
      const indexOfDot = rawName.lastIndexOf('.');
      const fileName = `${rawName.substring(0, indexOfDot)}_${Date.now()}${rawName.substring(indexOfDot)}`;
      const imageRef = storageRef.child(`adImages/${fileName}`);

      try {
        const imageSnapshot = await imageRef.put(files[i]);
        const downloadURL = await imageSnapshot.ref.getDownloadURL();
        downloadUrls.push(downloadURL);
      } catch (e) {
        reject(e);
      }
    };

    resolve(downloadUrls);
  });
}

export const addAdItem = (title, description, price, category, location, images) => {
  const firebaseUser = firebase.auth().currentUser;
  if (!firebaseUser) {
    return;
  }
  const itemToAdd = {
    title,
    description,
    price,
    createdAt: Date.now(),
    user: database.doc('users/' + firebaseUser.uid),
    category,
    location,
    images
  }
  database.collection("ads").add(itemToAdd)
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

export const logOutUser = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().signOut().then(function () {
      resolve();
    }).catch(function (error) {
      reject(error);
    });
  });
}

function adSorter(sortByValue) {
  if (sortByValue === SORT_BY_VALUE[1]) { // Oldest first
    return function (a, b) {
      return a['createdAt'] - b['createdAt'];
    };
  }
  if (sortByValue === SORT_BY_VALUE[2]) { // Lowest Price
    return function (a, b) {
      return a['price'] - b['price'];
    };
  }
  if (sortByValue === SORT_BY_VALUE[3]) { // Highest Price
    return function (a, b) {
      return b['price'] - a['price'];
    };
  }

  return function (a, b) { // Newest first, its default order
    return b['createdAt'] - a['createdAt'];
  };
}

function appendFilterParams(adRef, filterParams) {
  if (filterParams.title) {
    adRef = adRef.where("title", "==", filterParams.title);
  }
  if (filterParams.category && filterParams.category !== 'All Categories') {
    adRef = adRef.where("category", "==", filterParams.category);
  }
  if (filterParams.location) {
    adRef = adRef.where("location", "==", filterParams.location);
  }
  if (filterParams.minPrice) {
    adRef = adRef.where("price", ">=", parseInt(filterParams.minPrice));
  }
  if (filterParams.maxPrice) {
    adRef = adRef.where("price", "<=", parseInt(filterParams.maxPrice));
  }
  return adRef;
}

function addUser(userId, email, name, age) {
  database.collection("users").doc(userId).set({ email, name, age })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

function addUserNameToRooms(chatrooms) {
  return new Promise(async resolve => {
    for (var i = 0; i < chatrooms.length; i++) {
      var userData = await getUserData(chatrooms[i].viewerUserId);
      chatrooms[i].viewerUserName = userData.name;
    }
    resolve(chatrooms);
  })
}