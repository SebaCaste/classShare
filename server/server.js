const io = require('socket.io')(8080);

io.sockets.on('connection', function (socket) {
    console.log('got connection');

    socket.on('ice-offer', function (data) {

        console.log('got message', data);

        socket.broadcast.emit('ice-offer', data);
    });



    socket.on('ice-answer', function (data) {

        console.log('got message', data);

        socket.broadcast.emit('ice-answer', data);
    });


    socket.on('new-ice-candidate', function (data) {

        console.log('got message', data);

        socket.broadcast.emit('new-ice-candidate', data);
    });

    socket.on('mouseEvent', (data) => {
        socket.broadcast.emit('mouseEvent', data);
    });
});
