var notesController = require('../controllers/notes');
var statsController = require('../controllers/stats');

module.exports = function (app) {
    // define a generic route that logs API requests
    app.all('/:var(note*|notes)?', function (req, res, next) {
        statsController.log(req, res, app.get("model"), function() {
	    // done logging, now exec request
	    next();
	});
    });

    app.get('/', function (req, res) {
        app.get("model").getNotes(function (success, result) {
            res.render('index', {
                notes: result
            });
        });
    });

    app.get('/notes', function (req, res) {
        notesController.getNotes(req, res, app.get("model"));
    });

    app.get('/note/:id', function (req, res) {
        notesController.getNote(req, res, app.get("model"));
    });

    app.post('/notes', function (req, res) {
        notesController.createNote(req, res, app.get("model"));
    });

    app.post('/note/:id', function (req, res) {
        notesController.updateNote(req, res, app.get("model"));
    });

    app.put('/note/:id', function (req, res) {
        notesController.updateNoteMessage(req, res, app.get("model"));
    });

    app.delete('/note/:id', function (req, res) {
        notesController.deleteNote(req, res, app.get("model"));
    });

    app.get('/stats', function (req, res) {
        statsController.getStats(req, res, app.get("model"));
    });

    app.get('/admin', function(req, res) {
	res.redirect('/admin/index.html');
    });

    app.get('/admin/index.html', function(req, res) {
	statsController.getAdminStats(req, res, app.get("model"), function(stats) {
	    res.render('admin', {data: stats});
	});
    });

    app.get('/admin/notes.html', function(req, res) {
	    notesController.getOrderedNotes(req, res, app.get("model"), function (success, result) {
            res.render('notes', {notes: result});
        });
    });

    app.get('/admin/logs.html', function(req, res) {
        statsController.getLastLog(req, res, app.get("model"), function(log) {
            res.render('logs', {data: log});
        });
    });

};

//      API:
//
//      GET     /               Homepage
//      GET     /notes          All notes in JSON
//      POST    /notes          Create new note
//      GET     /note/:id       Get note in JSON by ID
//      POST    /note/:id       Update note position
//      DELETE  /note/:id       Delete note
//	PUT	/note/:id	Update note message
//	GET	/stats		Get notes, views, browsers, cpu, memory and db size
//
