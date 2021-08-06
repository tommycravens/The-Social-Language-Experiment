const { version } = require('mongoose');
const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema(
	{
		pronunciation: {
			type: String,
			required: true,
		},
		definition: {
			type: String,
			required: true,
		},
        sentence: {
            type: String,
            required: true,
        },
        comfort_level: {
            type: Number,
            required: true,
            min: [1, 'That is okay! You can only go up from here!'],
            max: [5, 'Outstanding! You must be ready to delete this card from your set.']

        },
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Word', wordSchema)
