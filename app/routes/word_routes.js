// require dependencies
const express = require('express')

const passport = require('passport')

// create an express router object
const router = express.Router()
// require event model
const Word = require('./../models/word')
// require custom error handlers
const customErrors = require('./../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

// Index: GET /events return all the events
router.get('/words', requireToken, (req, res, next) => {
	// fetch all the events from mongodb
	Word.find({ owner: req.user.id })
		// use mongoose toObject on each event to include virtuals
		.then((words) => words.map((word) => word.toObject()))
		// send response 200 with events to client
		.then((words) => res.json({ words: words }))
		// on error run next middleware
		.catch(next)
})

// Create: POST /events save the event data
router.post('/words', requireToken, (req, res, next) => {
	// get event data from request
	const word = req.body.word

	// Attach the owner using the `req.user.id`
	word.owner = req.user.id

	// save event to mongodb
	Word.create(word)
		// if successful respond with 201 and event json
		.then((word) => res.status(201).json({ word: word.toObject() }))
		// on error respond with 500 and error message
		.catch(next)
})

// Show: GET /events/100 return a event
router.get('/words/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// fetching event by its id
	// Event.findById(id)
	Word.find({ owner: req.user.id, id: id })
		// handle 404 error if no event found
		.then(handle404)
		// respond with json of the event
		// use mongoose toObject on event to include virtuals
		.then((word) => res.json({ word: word.toObject() }))
		// on error continue to error handling middleware
		.catch(next)
})

// Destroy: DELETE /events/:id delete the event
router.delete('/words/:id', requireToken, (req, res, next) => {
	const id = req.params.id
	Word.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((word) => requireOwnership(req, word))
		// delete event from mongodb
		.then((word) => {
			word.deleteOne()
		})
		// send 204 if successful
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

// Update: PATCH /events/:id
router.patch('/events/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// get event data from request
	const wordData = req.body.word
	// fetching event by its id
	Word.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((word) => requireOwnership(req, word))
		// update event
		.then((word) => {
			// updating event object
			// with eventData
			Object.assign(word, wordData)
			// save event to mongodb
			return word.save()
		})
		// if successful return 204
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

module.exports = router
