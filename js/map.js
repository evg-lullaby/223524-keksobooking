'use strict';

var OFFERS_NUMBER = 8;

var HOUSE_TYPES = {
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  flat: 'Квартира'
};

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_AMOUNT = 8;
var AVATAR_PATH = 'img/avatars/user';
var AVATAR_EXP = '.png';
var AVATAR = [];
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var GUESTS_MIN = 1;
var GUESTS_MAX = 15;
var LOCATION_X_MIN = 300;
var LOCATION_X_MAX = 900;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var map = document.querySelector('.map');
var template = document.querySelector('template');
var pins = document.querySelector('.map__pins');
var templatePin = template.content.querySelector('.map__pin');

var makeAvatarArray = function () {
  for (var i = 0; i < AVATAR_AMOUNT; i++) {
    AVATAR[i] = (i + 1);
  }
  return AVATAR;
};

var getRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomArray = function (array) {
  var sourceArray = array.slice().sort();
  var randomArray = [];
  var randomLength = getRandomValue(1, (array.length - 1));
  for (var i = 0; i <= randomLength; i++) {
    randomArray[i] = getUniqueValueFromArray(sourceArray);
  }
  return randomArray;
};

var getRandomValueFromArray = function (array) {
  return array[getRandomValue(0, array.length - 1)];
};

var getUniqueValueFromArray = function (array) {
  return array.splice(Math.floor(Math.random() * array.length), 1).toString();
};


var getShuffledArray = function (array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var x = array[i];
    array[i] = array[j];
    array[j] = x;
  }
  return array;
};

var getAvatarPath = function (avatarNumber) {
  return avatarNumber >= 9 ? AVATAR_PATH : AVATAR_PATH + '0';
};

var renderFeatures = function (arrFeatures) {
  var fragmentFeatures = document.createDocumentFragment();
  var newFeatureElement;

  for (var i = 0; i < arrFeatures.length; i++) {
    newFeatureElement = document.createElement('li');
    newFeatureElement.className = 'popup__feature popup__feature--' + arrFeatures[i];
    fragmentFeatures.appendChild(newFeatureElement);
  }
  return fragmentFeatures;
};

var renderPhotos = function (photos) {
  var photosContainer = document.createDocumentFragment();
  var templatePhoto = template.content.querySelector('.popup__photo');
  photos.forEach(function (el) {
    var photoElement = templatePhoto.cloneNode(true);
    photoElement.src = photos[i];
    photosContainer.appendChild(photoElement);
  });
  return photosContainer;
};

var roomsText = function (renderObj) {
  if (renderObj.offer.rooms === 1) {
    return ' комната для ';
  } 
  if (renderObj.offer.rooms === 5) {
    return ' комнат для ';
  } 
  return ' комнаты для ';
};

var renderCard = function (renderObj) {
  var card = templateCard.cloneNode(true);
  card.querySelector('.popup__title').textContent = renderObj.offer.title;
  card.querySelector('.popup__text--address').textContent = renderObj.offer.address;
  card.querySelector('.popup__text--price').textContent = renderObj.offer.price + ' ₽/ночь';
  card.querySelector('.popup__type').textContent = HOUSE_TYPES[renderObj.offer.type];
  card.querySelector('.popup__text--capacity').textContent = renderObj.offer.rooms + roomsText(renderObj) + renderObj.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + renderObj.offer.checkin + ', выезд до ' + renderObj.offer.checkout;
  card.querySelector('.popup__features').innerHTML = '';
  card.querySelector('.popup__features').appendChild(renderFeatures(renderObj.offer.features));
  card.querySelector('.popup__description').textContent = renderObj.offer.description;
  card.querySelector('.popup__photos').innerHTML = '';
  card.querySelector('.popup__photos').appendChild(renderPhotos(renderObj.offer.photos));
  card.querySelector('.popup__avatar').src = renderObj.author.avatar;
  return card;
};

var createObjects = function (quantity) {
  var objects = [];

  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomValue(LOCATION_X_MIN, LOCATION_X_MAX);
    var locationY = getRandomValue(LOCATION_Y_MIN, LOCATION_Y_MAX);
    var avatarNumber = getUniqueValueFromArray(AVATAR);
    var avatarPath = getAvatarPath(avatarNumber);
    var offer = {
      author: {
        avatar: avatarPath + avatarNumber + AVATAR_EXP
      },
      offer: {
        title: getUniqueValueFromArray(TITLES),
        address: locationX + ', ' + locationY,
        price: getRandomValue(PRICE_MIN, PRICE_MAX),
        type: getRandomValueFromArray(TYPES),
        rooms: getRandomValue(ROOMS_MIN, ROOMS_MAX),
        guests: getRandomValue(GUESTS_MIN, GUESTS_MAX),
        checkin: getRandomValueFromArray(TIMES),
        checkout: getRandomValueFromArray(TIMES),
        features: getRandomArray(FEATURES),
        description: '',
        photos: getShuffledArray(PHOTOS)
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    objects.push(offer);
  }
  return objects;
};

var renderPin = function (pin) {
  var pinElement = templatePin.cloneNode(true);
  pinElement.style.left = pin.location.x - MAP_PIN_WIDTH / 2 + 'px';
  pinElement.style.top = pin.location.y - MAP_PIN_HEIGHT + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;
  return pinElement;
};

map.classList.remove('map--faded');
makeAvatarArray();

var offers = createObjects(OFFERS_NUMBER);

var paintPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < offers.length; i++) {
    fragmentPin.appendChild(renderPin(offers[i]));
  }
  pins.appendChild(fragmentPin);
};

var templateCard = template.content.querySelector('.map__card');
var mapFiltersContainer = document.querySelector('.map__filters-container');

paintPins();
map.insertBefore(renderCard(offers[0]), mapFiltersContainer);
