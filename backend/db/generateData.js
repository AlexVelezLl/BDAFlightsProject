const random_name = require('node-random-name');
const uuid = require('uuid');
const fs = require('fs');

function generatePassengers() {
  const passengers = [];
  for (let i = 0; i < 1000; i++) {
    const id = uuid.v4();
    const name = random_name({ random: Math.random });
    const email = `${name.split(' ')[0]}@gmail.com`;
    const dob = new Date(
      Math.floor(Math.random() * (new Date().getFullYear() - 1900 + 1)) + 1900,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28)
    );
    passengers.push({ id, name, email, dob });
  }
  fs.writeFileSync('db/data/passengers.json', JSON.stringify(passengers));
}

function generateFlights() {
  const flights = [];
  const cities = JSON.parse(fs.readFileSync('db/data/cities.json'));
  for (let i = 0; i < 1000; i++) {
    const id = uuid.v4();
    const source = cities[Math.floor(Math.random() * cities.length)].name.slice(0,20);
    const dest = cities[Math.floor(Math.random() * cities.length)].name.slice(0,20);
    //Make variable arrivalDate between 1 and 30 days from now
    const date = new Date(
      new Date().getTime() +
        Math.floor(Math.random() * (30 * 24 * 60 * 60 * 1000))
    );
    // Make variable seat and cost a random choice between 100, 200, 300, 400, 500, 600
    const seat = Math.floor(Math.random() * 5) * 100 + 100;
    const cost = Math.floor(Math.random() * 5) * 100 + 100;
    flights.push({ id, source, dest, date, seat, cost });
  }
  fs.writeFileSync('db/data/flights.json', JSON.stringify(flights));
}

const generateBookings = () => {
  const bookings = [];
  const passengers = JSON.parse(fs.readFileSync('db/data/passengers.json'));
  const flights = JSON.parse(fs.readFileSync('db/data/flights.json'));
  for (let i = 0; i < 1000; i++) {
    const id = uuid.v4();
    const numberPassengers = Math.floor(Math.random() * 10) + 1;
    const flight = flights[Math.floor(Math.random() * flights.length)].id;
    const date = new Date(
      new Date().getTime() -
        Math.floor(Math.random() * (30 * 24 * 60 * 60 * 1000)) // Random between 1 and 30 days ago
    );
    const passengerIDs = new Set();
    for (let j = 0; j < numberPassengers; j++) {
      const passenger =
        passengers[Math.floor(Math.random() * passengers.length)].id;
      passengerIDs.add(passenger);
    }
    bookings.push({ id, passengerIDs: [...passengerIDs], date, flight });
  }
  fs.writeFileSync('db/data/bookings.json', JSON.stringify(bookings));
};

generateBookings();
