var model = module.exports,
    redis = require('redis');

model.setup = function() {
    console.log("[127.0.0.1 %s] Setting up redis...", new Date().toISOString());
}

model.name = "Redis Server Model";

model.getNotes = function(done) {
    client = redis.createClient();
    client.keys("*", function(err, replies) {
	multi = client.multi();
	for (var i in replies) {
	    if(replies[i] != 'counter') multi.hgetall(replies[i]);
	}
	multi.exec(function (err, results) {
	     client.quit();
	     done(!err, results);
	});
    });
}

model.saveNote = function(note, done) {
    client = redis.createClient();
    client.hmset(note.id, "id", note.id, "title", note.title, "message", note.message, "xpos", note.xpos, "ypos", note.ypos, function(err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.updateNote = function(note, done) {
    client = redis.createClient();
    client.hmset(note.id, "xpos", note.xpos, "ypos", note.ypos, function(err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.getNoteByID = function(id, done) {
    client = redis.createClient();
    client.hgetall(id, function(err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.getNewId = function(done) {
    client = redis.createClient();
    client.incr('counter', function(err, reply) {
        client.quit();
        done(!err, reply);
    });
}

model.deleteNoteByID = function(id, done) {
    client = redis.createClient();
    client.del(id, function(err, result) {
        client.quit();
        done(!err, result);
    });
}

