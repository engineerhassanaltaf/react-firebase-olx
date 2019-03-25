// import { database } from '../../config/firebase';

const SORT_BY_VALUE = ["Newest first", "Oldest first", "Lowest Price", "Highest Price"];

const setAdFilters = (params) => {
  return {
    type: 'SET_AD_FILTERS',
    data: params
  }
}

const updateAdList = (ads) => {
  return {
    type: 'UPDATE_ADS',
    data: ads
  }
}

// const getAds = (filterParams) => {
//   return dispatch => {
//     var adRef = database.collection("ads");
//     appendFilterParams(adRef, filterParams).onSnapshot((querySnapshot) => {
//       var ads = [];
//       querySnapshot.forEach(function (doc) {
//         const data = doc.data();
//         ads.push({
//           category: data.category,
//           createdAt: data.createdAt,
//           description: data.description,
//           images: data.images,
//           price: data.price,
//           title: data.title
//         });
//       });

//       if (filterParams.sortByValue) {
//         ads.sort(adSorter(filterParams.sortByValue));
//       }

//       dispatch({
//         type: 'UPDATE_ADS',
//         data: ads
//       });
//     });
//   }
// }

// function adSorter(sortByValue) {
//   if (sortByValue === SORT_BY_VALUE[1]) { // Oldest first
//     return function (a, b) {
//       return a['createdAt'] - b['createdAt'];
//     };
//   }
//   if (sortByValue === SORT_BY_VALUE[2]) { // Lowest Price
//     return function (a, b) {
//       return a['price'] - b['price'];
//     };
//   }
//   if (sortByValue === SORT_BY_VALUE[3]) { // Highest Price
//     return function (a, b) {
//       return b['price'] - a['price'];
//     };
//   }

//   return function (a, b) { // Newest first, its default order
//     return b['createdAt'] - a['createdAt'];
//   };
// }

// function appendFilterParams(adRef, filterParams) {
//   if (filterParams.title) {
//     adRef = adRef.where("title", "==", filterParams.title);
//   }
//   if (filterParams.category && filterParams.category !== 'All Categories') {
//     adRef = adRef.where("category", "==", filterParams.category);
//   }
//   if (filterParams.location) {
//     adRef = adRef.where("location", "==", filterParams.location);
//   }
//   if (filterParams.minPrice) {
//     adRef = adRef.where("price", ">=", parseInt(filterParams.minPrice));
//   }
//   if (filterParams.maxPrice) {
//     adRef = adRef.where("price", "<=", parseInt(filterParams.maxPrice));
//   }
//   return adRef;
// }

export {
  SORT_BY_VALUE,
  setAdFilters,
  updateAdList
}