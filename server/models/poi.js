const mongoose = require('mongoose');

const poiSchema = new mongoose.Schema({
    name: String,
    description: String,
    address: String,
    category: String
  }, { collection: 'poi' });

const POI = mongoose.model('POI', poiSchema);

module.exports = POI;
