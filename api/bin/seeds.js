require("dotenv").config();
require('../config/db.config');
const mongoose = require('mongoose');
const { Faker, es, en } = require('@faker-js/faker');
const Prototype = require('../models/prototype.model');

const faker = new Faker({ locale: [es, en] });
const cities = {
  'madrid': [40.416775, - 3.703790],
  'barcelona': [41.390205, 2.154007]
}
const desiredPrototypes = 200;

function getRandomDate() {
  const from = faker.date.soon();
  const to = faker.date.soon({ refDate: from })
  return faker.date.betweens({ 
    from: from, 
    to: to, 
    count: 2 
  })
}

function getRandomAddress({ city }) {
  const [lat, lng] = faker.location.nearbyGPSCoordinate({ origin: cities[city], isMetric: true })
  return {
    city: city,
    street: faker.location.streetAddress(),
    location: {
      type: 'Point',
      coordinates: [lng, lat]
    }
  }
}

function getRandomPrototype({ seed }) {
  const [startDate, endDate] =  getRandomDate();
  return {
    title: faker.lorem.words({ min: 2, max: 4 }),
    description: faker.lorem.paragraphs({ min: 3, max: 10 }),
    startDate,
    endDate,
    categories: [faker.word.adjective(), faker.word.adjective()],
    poster: `https://picsum.photos/seed/${seed}/800/600`,
    address: getRandomAddress({ city: faker.helpers.arrayElement(Object.keys(cities))})
  }
}

function getRandomPrototypes(size) {
  const prototypes = [];
  for (let i = 0; i < size;i++) {
    prototypes.push(getRandomPrototype({ seed: i }));
  }
  return prototypes;
}

Prototype.collection.drop()
  .then(() => Prototype.create(getRandomPrototypes(desiredPrototypes)))
  .then((prototypes) => console.info(`- Created prototypes: ${prototypes.length}`))
  .catch((error) => console.error(error))
  .finally(() => mongoose.connection.close())

