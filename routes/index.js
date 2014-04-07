var notesController = require('../controllers/notes');

module.exports = function(app) {
    // define routes
    app.get('/test', function(req, res) {
        console.log("[%s %s] GET /test", req.ip, new Date().toISOString());
        notesController.test(req, res, app.get("model"));
    });

    app.get('/', function(req, res) {
        console.log("[%s %s] GET /", req.ip, new Date().toISOString());       
	app.get("model").getNotes(function(success, result) {
	    res.render('index', {notes: result});
        });

    });

    app.get('/notes', function(req, res) {
	notesController.getNotes(req, res, app.get("model"));
    });

    app.get('/note/:id', function(req, res) {
        notesController.getNote(req, res, app.get("model"));
    });

    app.post('/notes', function(req, res) {
        notesController.createNote(req, res, app.get("model"));
    });

    app.post('/note/:id', function(req, res) {
        notesController.updateNote(req, res, app.get("model"));
    });

    app.delete('/note/:id', function(req, res) {
        notesController.deleteNote(req, res, app.get("model"));
    });
}



//	API:
//
//	GET 	/		Homepage
//	GET 	/notes		All notes in JSON
//	GET	/note/:id	Get note in JSON by ID
//	POST	/notes		Create new note
//	POST	/note/:id	Update note
//	DELETE	/note/:id	Delete note
//
