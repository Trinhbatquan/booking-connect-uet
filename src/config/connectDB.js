const  Sequelize  = require('sequelize');



// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('bookingcare-uet', 'root', null, {
  host: 'localhost',
  dialect:'mysql',
  logging: false
});

module.exports = sequelize;