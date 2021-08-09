// require dependencies
const express = require('express')

const passport = require('passport')

// create an express router object
const router = express.Router()
// require event model
const Vocab = require('../models/vocab')
// require custom error handlers
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const requireToken = passport.authenticate('bearer', { session: false })

// Index: GET /events return all the events
router.get('/vocabs', requireToken, (req, res, next) => {
	// fetch all the events from mongodb
	Vocab.find({ owner: req.user.id })
		// use mongoose toObject on each event to include virtuals
		.then((vocabs) => vocabs.map((vocab) => vocab.toObject()))
		// send response 200 with events to client
		.then((vocabs) => res.json({ vocabs: vocabs }))
		// on error run next middleware
		.catch(next)
})

// Create: POST /events save the event data
router.post('/vocabs', requireToken, (req, res, next) => {
	// get event data from request
	const vocab = req.body.vocab

	// Attach the owner using the `req.user.id`
	vocab.owner = req.user.id

	// save event to mongodb
	Vocab.create(vocab)
		// if successful respond with 201 and event json
		.then((vocab) => res.status(201).json({ vocab: vocab.toObject() }))
		// on error respond with 500 and error message
		.catch(next)
})

// Show: GET /events/100 return a event
router.get('/vocabs/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// fetching event by its id
	// Event.findById(id)
	Vocab.findOne({ owner: req.user.id, _id: id })
		// handle 404 error if no event found
		.then(handle404)
		// respond with json of the event
		// use mongoose toObject on event to include virtuals
		.then((vocab) => res.json({ vocab: vocab.toObject() }))
		// on error continue to error handling middleware
		.catch(next)
})

// Destroy: DELETE /events/:id delete the event
router.delete('/vocabs/:id', requireToken, (req, res, next) => {
	const id = req.params.id
	Vocab.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((vocab) => requireOwnership(req, vocab))
		// delete event from mongodb
		.then((vocab) => {
			vocab.deleteOne()
		})
		// send 204 if successful
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

// Update: PATCH /events/:id
router.patch('/vocabs/:id', requireToken, (req, res, next) => {
	// get id of event from params
	const id = req.params.id
	// get event data from request
	const vocabData = req.body.vocab
	// fetching event by its id
	Vocab.findById(id)
		// handle 404 error if no event found
		.then(handle404)
		.then((vocab) => requireOwnership(req, vocab))
		// update event
		.then((vocab) => {
			// updating event object
			// with eventData
			Object.assign(vocab, vocabData)
			// save event to mongodb
			return vocab.save()
		})
		// if successful return 204
		.then(() => res.sendStatus(204))
		// on error go to next middleware
		.catch(next)
})

module.exports = router
