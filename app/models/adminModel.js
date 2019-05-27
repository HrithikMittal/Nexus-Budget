const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
	id: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	}
})

adminSchema.methods.toJSON = function () {
	const admin = this

	const adminObject = admin.toObject()

	delete adminObject.password

	return adminObject
}

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin