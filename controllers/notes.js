var controller = module.exports;

controller.getNotes = function (req, res, model) {
    model.getNotes(function (success, result) {
        if (success) res.json(result);
        else res.end({
            status: 'Error'
        });
    });
}

controller.getNote = function (req, res, model) {
    model.getNoteByID(req.params.id, function (success, result) {
        if (success) res.json(result);
        else res.end({
            status: 'Error'
        });
    });
}

controller.createNote = function (req, res, model) {
    model.getNewId(function (success, result) {
        if (success) {
            var note = new Object();
            note.id = 'note' + result;
            note.title = 'Note ' + result;
            note.message = req.body.message;
            note.xpos = 0;
            note.ypos = 0;
            model.saveNote(note, function (success, result) {
                if (success) res.json({
                    status: 'OK',
                    id: note.id,
                    title: note.title
                });
                else res.end({
                    status: 'Error'
                });
            });
        }
    });
}

controller.updateNote = function (req, res, model) {
    var note = new Object();
    note.id = req.params.id;
    note.xpos = req.body.xpos;
    note.ypos = req.body.ypos;
    model.updateNote(note, function (success, result) {
        if (success) res.json({
            status: 'OK'
        });
        else res.end({
            status: 'Error'
        });
    });
}

controller.deleteNote = function (req, res, model) {
    model.deleteNoteByID(req.params.id, function (success, result) {
        if (success) res.json({
            status: 'OK'
        });
        else res.end({
            status: 'Error'
        });
    });
}
