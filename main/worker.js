const fs = require('fs');
const addon = require('../dependencies/processingmodule');
const net = require('net');

const CONNECTED = 0x4;
const PFOUND = 0x2;
const QPOP = 0x1;
const threshold = 0.01;

var mobile_connection = false;
var enable_click = false;
var mobile_socket = null;

process.on('message', (msg) =>
{
	if(msg['exit'])
	{
		if(mobile_socket != null)
		{
			mobile_socket.end(() =>
				{
					console.log("ending connection");
				});
			mobile_socket.destroy();
			mobile_socket = null;
		}
		server.close();
	}
});

// start server
const server = net.createServer((mobileConnection) => {
	mobileConnection.on('end', () => {
		//mobile_socket = null;
		console.log("connction ended");
		//mobile_connection = false;
	});

	mobileConnection.on('close', ()=>{
		console.log("client disconnected");
		//mobile_socket = null;
	});

	mobileConnection.on('data', (buffer) => {
		if(buffer[0] == 1 && enable_click)
			addon.clickProcess('LeagueClientUx.exe', 555, 532);
	});

	mobileConnection.on('error', (buffer) =>
	{
		console.log("error: " + buffer);
		mobile_socket = null;
	});

	mobileConnection.on('timeout', (buffer)=>
	{
		console.log('timeout: ' + buffer);
	});
});

server.on('connection', (mobileConnection) =>{
	mobile_socket = mobileConnection;
	console.log('server connected');
	console.log("connection to :" + mobileConnection.remoteAddress + " : " + mobileConnection.remotePort);
});

server.on('error', (buffer) =>
{
	console.log('server error' + buffer);
});

server.on('close', ()=>
{
	console.log('server disconnected');
});

server.listen(7767, true, () =>{
	console.log("server started");
});

let counter = 0;

console.log('setting default image');
addon.startGDIPlus();
//console.log("image found?" + addon.setDefaultImage('assets/accept.bmp'));
console.log(addon.setDefaultImage('resources\\app.asar.unpacked\\assets\\accept.bmp'));
var testCount = 0;

setInterval(() => {
	//console.log("server listening: " + server.listening);
	server.getConnections((err, count)=>
		{
			if(count > 0)
				mobile_connection = true;
			else
				mobile_connection = false;
		});
	//console.log("mobile_connection detected: " + mobile_connection);
	testCount++;
	var processing_img = false;
	var queue_popped = false;
	var process_running = addon.processRunning('LeagueClientUx.exe');
	if(mobile_connection)
	{
		let message = 0x0;
		message |= CONNECTED;
		if(process_running)
		{
			message |= PFOUND;
			let result = 1;
			result = addon.screenshotAndCompare('LeagueClientUx.exe', 550, 527);
			if(result != 1)
				processing_img = true;
			if(result <= threshold)
			{
				message |= QPOP;
				queue_popped = true;
				enable_click = true;
			}
			else
				enable_click = false;

			//console.log("comparison result: " + result);

			// delete after testing
			/*if(testCount > 10 && testCount < 20)
			{
				queue_popped = true;
				message |= QPOP;
				enable_click = true;
			}
			else
				enable_click = false;*/
			// ----------------------
		}
		let buf = new Buffer([message]);
		try
		{
			if(mobile_socket.bufferSize < 4)
				mobile_socket.write(buf);
		}
		catch(err){
			console.log(err);
		}
	}
  	process.send({ 'p-detected': process_running , 
  		'processing-img': processing_img, 'mobile-detected': mobile_connection, 'queue-popped': queue_popped});
}, 500);