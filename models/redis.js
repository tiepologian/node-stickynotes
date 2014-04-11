var model = module.exports,
    redis = require('redis');

model.setup = function () {
    console.log("[127.0.0.1 %s] Setting up redis...", new Date().toISOString());
}

model.name = "Redis Server Model";

model.getNotes = function (done) {
    client = redis.createClient();
    client.keys("*", function (err, replies) {
        multi = client.multi();
        for (var i in replies) {
            if (replies[i] != 'counter') multi.hgetall(replies[i]);
        }
        multi.exec(function (err, results) {
            client.quit();
            done(!err, results);
        });
    });
}

model.saveNote = function (note, done) {
    client = redis.createClient();
    client.hmset(note.id, "id", note.id, "title", note.title, "message", note.message, "xpos", note.xpos, "ypos", note.ypos, function (err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.updateNote = function (note, done) {
    client = redis.createClient();
    client.hmset(note.id, "xpos", note.xpos, "ypos", note.ypos, function (err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.updateNoteMessage = function (note, done) {
    client = redis.createClient();
    client.hmset(note.id, "message", note.message, function (err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.getNoteByID = function (id, done) {
    client = redis.createClient();
    client.hgetall(id, function (err, replies) {
        client.quit();
        done(!err, replies);
    });
}

model.getNewId = function (done) {
    client = redis.createClient();
    client.incr('counter', function (err, reply) {
        client.quit();
        done(!err, reply);
    });
}

model.deleteNoteByID = function (id, done) {
    client = redis.createClient();
    client.del(id, function (err, result) {
        client.quit();
        done(!err, result);
    });
}

model.getNotesNum = function(done) {
    client = redis.createClient();
    var response = new Object();
    client.keys("*", function(err, result) {
	response.now = result.length - 1;
        client.get("counter", function(err, result2) {
	    client.quit();
	    response.total = result2;
	    done(!err, response);
        });
    });    
}

model.logRequest = function(request, browser, done) {
    client = redis.createClient();
    client.select(1, function() {
        client.lpush('requests', request, function(err, result) {
	    client.zincrby("browsers", 1, browser, function(err2, result2) {
		client.quit();
		done(!err, result);
	    });
	});
    });
}

model.logView = function(done) {
    client = redis.createClient();
    client.select(1, function() {
        client.incr('views', function(err, result) {
            client.quit();
	    done(!err, result);
        });
    });
}

model.getViewCount = function(done) {
    var response = new Object();
    client = redis.createClient();
    client.select(1, function() {
        client.get('views', function(err, result) {
	    response.views = result;
	    client.llen('requests', function(err2, result2) {
		response.requests = result2;
		client.quit();
            	done(!err2, response);
	    });
        });
    });
}

model.getBrowsers = function(done) {
    client = redis.createClient();
    client.select(1, function() {
	var params = ['browsers', '-inf', '+inf', 'withscores'];
        client.zrangebyscore(params, function(err, result) {
            client.quit();
            done(!err, result);
        });
    });
}

model.getSize = function(done) {
    client = redis.createClient();
    client.info(function(err, result) {
	done(client.server_info['used_memory']);
    });
}

model.getLog = function(done) {
    client = redis.createClient();
    client.select(1, function() {
        client.lrange('requests', 0, 10, function(err, result) {
            client.quit();
            done(!err, result);
        });
    });
}
