'use strict';
let express = require("express");
let mongoose = require("mongoose");
let Client = require("./clients");
let Tasks = require("./task");
let Developer = require("./developers");
let Wallet = require("./wallet");
let bodyParser = require("body-parser");
let ObjectId = require('mongoose').Types.ObjectId

let path = require('path');

let app = express();
app.use(express.static(__dirname + '/dist'));  
app.use(bodyParser.json());


app.get('*', function(req, res) {	
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

console.log("App listening on port 3000");

mongoose.connect('mongodb://localhost:27017/freelance');

app.post("/addClient", function(req, res) { 
	let client = Client({
		name: req.body.name
	});

	client.save((err, data) => {
		if (err) throw err;
		if (data) res.json('Client added!!!!');
	});
})

app.post("/addDeveloper", function(req, res) { 
	let developer = Developer({
		name: req.body.name
	});

	developer.save((err, data) => {
		if (err) throw err;

		let wallet = Wallet({
			moneyAmount: 0,
			dev: data._doc._id
		});

		wallet.save((err, data) => {
			if (err) throw err;
		});

		if (data) res.json('Developer added!!!!');
	});
})

app.post("/findDeveloper", function(req, res) {
	Developer.findOne({name: req.body.devName}, (err, data) => {
		if (err) throw err;
		if (data) {
			res.json({ name: data._doc.name });
		} else {
			res.send('Developer not found!!!');
		}
	});
})

app.post("/findClient", function(req, res) {
	Client.findOne({name: req.body.name}, (err, data) => {
		if (err) throw err;
		if (data) {
			res.json({ name: data._doc.name });
		} else {
			res.send('Client not found!!!');
		}
	});
})

app.post("/createTask", function(req, res) {
	Client.findOne({name: req.body.name}, (err, data) => {
		if (err) throw err;
		let task = Tasks({
			description: req.body.description,
			price: req.body.price,
			status: 'NEW',
			client: new ObjectId(data._doc._id)
		});

		task.save((err, data) => {
			if (err) throw err;
			if (data) res.json('Task created!!');
		});
	})
});

app.post("/listAllTasks", function(req, res) { 
	let assignedTasks = [];
	Client.findOne({name: req.body.name}, (err, data) => {
		if (err) throw err;

		Tasks.find({client: data._doc._id}, (err, tasks) => {
			if (err) throw err;
			if (!tasks) res.send('tasks not found');
			tasks.forEach((task) => {
				assignedTasks.push({
					'description': task._doc.description,
					'price': task._doc.price,
					'status': task._doc.status
				});
			});
			if(assignedTasks.length === 0) {
				res.send("No available tasks");
			}
			res.json(assignedTasks);
		});
	});
})

app.post("/finishTask", function(req, res) { 
	let developerName = req.body.developerName;
	Tasks.findOneAndUpdate({description: req.body.description}, {status: 'DONE'}, { upsert:true }, (err, tasks) => {
		if (err) throw err;
		let money = tasks._doc.price;
		Developer.findOne({name: developerName}, (err, dev) => {
			if (err) throw err;
			Wallet.findOne({dev: new ObjectId(dev._doc._id)}, (err, wallet) => {
				if (err) throw err;
				wallet.addMoney(money);
				wallet.save((err, data) => {
					if (err) throw err;
					if (data) return res.send("succesfully finished task");
				});
				
			});
		});
	});
});	

app.post("/startTask", function(req, res) { 
	Tasks.findOneAndUpdate({description: req.body.description}, {status: 'ASSIGNED'}, { upsert:true }, (err, tasks) => {
		if (err) throw err;
		if (tasks) return res.send("succesfully assigned task");
	});
});

app.post("/listAssignedTasks", function(req, res) { 
	let assignedTasks = [];
	Tasks.find({}, (err, tasks) => {
		if (err) throw err;
		if (!tasks) res.send('tasks not found');
		tasks.forEach((task) => {
			if(task._doc.status === 'ASSIGNED') {
				assignedTasks.push({
					'description': task._doc.description,
					'price': task._doc.price,
					'status': task._doc.status
				});
			}
		});
		if(assignedTasks.length === 0) {
			res.send("No available tasks");
		}
		res.json(assignedTasks);
	});
});

app.post("/findFreeTasks", function(req, res) { 
	let freeTasks = [];
	Tasks.find({}, (err, tasks) => {
		tasks.forEach((task) => {
			if(task._doc.status === 'NEW') {
				freeTasks.push({
					'description': task._doc.description,
					'price': task._doc.price,
					'status': task._doc.status
				});
			}
		});
		if(freeTasks.length === 0) {
			res.send("No free tasks");
		}

		res.json(freeTasks);
	});
});	


app.listen(3000);
