var mongoose = require('mongoose');

// Connecting the MongoDB Server using the fields from .env document
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true});
const database = mongoose.connection

// Connection Checking !!!
if (!database) {
    console.log("Database connection didn't work!");
    process.exit(1);
}
database.once('open', function () {
  console.log('Database connection success')
})

module.exports = database