const mongoose = require("mongoose")

const remoteDB = "mongodb+srv://adhikansh-atlas:IlShowBgpiOl71JV@cluster0-cy6v9.mongodb.net/budget?retryWrites=true"
mongoose.connect(remoteDB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false
})

const db = mongoose.connection

module.exports = db
