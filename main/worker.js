const fs = require('fs');
//const addon = require('../dependencies/processingModule');
const addon = require('../dependencies/processingmodule');
const net = require('net');

const CONNECTED = 0x4;
const PFOUND = 0x2;
const QPOP = 0x1;
const threshold = 0.01;

var mobile_connection = false;
var enable_click = false;
var mobile_socket = null;

// start server
const server = net.createServer((mobileConnection) => {
	mobile_connection = true;
	console.log("connection to :" + mobileConnection.remoteAddress + " : " + mobileConnection.remotePort);
	mobile_socket = mobileConnection;
	mobileConnection.on('end', () => {
		mobile_socket = null;
		console.log("connction ended");
		mobile_connection = false;
	});

	mobileConnection.on('close', ()=>{
		console.log("client disconnected");
		mobile_socket = null;
		mobile_connection = false;
	});

	mobileConnection.on('data', (buffer) => {
		if(buffer[0] == 1 && enable_click)
		{
			console.log('should click');
		}
		else
		{
		}
	});

	mobileConnection.on('error', (buffer) =>
	{
		console.log(buffer);
	})
});

server.listen(7767, () =>{
	console.log("server started");
});

let counter = 0;

console.log('setting default image');
addon.startGDIPlus();
//console.log("image found?" + addon.setDefaultImage('assets/accept.bmp'));
console.log(addon.setDefaultImage('resources\\app.asar.unpacked\\assets\\accept.bmp'));
var testCount = 0;

setInterval(() => {
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
			let result = addon.screenshotAndCompare('LeagueClientUx.exe'); // throwing error
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