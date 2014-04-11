var controller = module.exports;
var parser = require('ua-parser');
var usage = require('usage');
var os = require('os');

controller.getStats = function (req, res, model) {
    var stats = new Object();
    model.getNotesNum(function (success, result) {
        if (!success) res.end({status: 'Error'});
        else {
	    stats.notes = result.now;
	    stats.total_notes = result.total;
	    model.getViewCount(function(success2, result2) {
		if (!success2) res.end({status: 'Error'});
		else {
		    stats.views = result2.views;
		    stats.requests = result2.requests;
		    model.getBrowsers(function(success3, result3) {
			parseBrowsers(result3, function(result4) {
			    stats.browsers = result4;
			    getUsage(function(result5) {
				stats.cpu = Math.round(result5.cpu);
				stats.memory = Math.round(result5.memory);
				model.getSize(function(result6) {
				    stats.db = (result6/1048576).toFixed(1);
				    res.json(stats);
				});
			    });
			});
		    });
		}
	    });
	}
    });
}

controller.getAdminStats = function (req, res, model, done) {
    var stats = new Object();
    model.getNotesNum(function (success, result) {
        if (!success) res.end({status: 'Error'});
        else {
            stats.notes = result.now;
            stats.total_notes = result.total;
            model.getViewCount(function(success2, result2) {
                if (!success2) res.end({status: 'Error'});
                else {
                    stats.views = result2.views;
                    stats.requests = result2.requests;
                    model.getBrowsers(function(success3, result3) {
                        parseBrowsers(result3, function(result4) {
                            stats.browsers = result4;
                            getUsage(function(result5) {
                                stats.cpu = Math.round(result5.cpu);
                                stats.memory = Math.round(result5.memory);
                                model.getSize(function(result6) {
                                    stats.db = (result6/1048576).toFixed(1);
                                    done(stats);
                                });
                            });
                        });
                    });
                }
            });
        }
    });
}

controller.log = function (req, res, model, done) {
    var logString = "[" + req.ip + " " + new Date().toISOString() + "] " + req.route.method.toUpperCase() + "\t" + req.path;
    browser = parser.parse(req.headers['user-agent']).family;
    model.logRequest(logString, browser, function(success, result) {
	if(req.path == '/') {
	    model.logView(function(success2, result2) {
	        // OK Node, I've finished
		done();
	    });
	}
	else {
	    done();
	}
    });
}

function parseBrowsers(input, done) {
    var total = 0;
    var result = [];
    var counter = 0;
    for (var i=0;i<input.length;i+=2) {
	result.push({label: input[i]});
	total+=parseInt(input[i+1]);
    }
    for (var i in result) {
	result[i]['data'] = Math.round((input[(i*2)+1] / total)*100);
    }
    done(result);
}

function getUsage(done) {
    var pid = process.pid;
    usage.lookup(pid, function(err, result) {
	var res = new Object();
	res.cpu = result.cpu;
	res.memory = (result.memory / os.totalmem()) * 100;
        done(res);
    });
}

controller.getLastLog = function (req, res, model, done) {
     model.getLog(function (success, result) {
	done(result);
    });
}
