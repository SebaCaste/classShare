const io = require('socket.io')(2222);


io.sockets.on('connection', (socket) => {

  socket.once('role', (msg) => {
    if (msg === 'prof') {
      onNewProf(socket);
    } else {
      onNewStudent(socket);
    }
  });


  socket.on('iceOffer', ({hostId, offer}) => {
    io.to(hostId).emit('iceOffer', {
      guestId: socket.id,
      offer
    })
  });

  socket.on('iceAnswer', ({guestId, answer}) =>{
    io.to(guestId).emit('iceAnswer', answer);
  });

  socket.on('iceCandidate', ({to, candidate}) => {
    io.to(to).emit('iceCandidate', {
      from: socket.id,
      candidate
    });
  });

});


const onNewProf = (socket) => {
  console.log(`new prof ${socket.id}`);

  socket.once('createSession', ({sessionId, sessionName}) => {
    const roomId = `session-${sessionId}`;
    socket.join(roomId);

    socket.on('startSession', (startMsg) => {
      socket.to(roomId).emit('startSession', startMsg)
      console.log(`prof started session ${sessionId}`);
    });

    console.log(`prof created session ${sessionId}`);
  });
}

const onNewStudent = (socket) => {
  console.log(`new student ${socket.id}`);

  socket.once('joinSession', ({sessionId, fullname}) => {
    const roomId = `session-${sessionId}`;
    socket.join(roomId);
    socket.to(roomId).emit('studentJoined', {
      fullname,
      studentId: socket.id
    });

    console.log(`student joined session ${sessionId}`);
  });



}

/**
 * {
 *   groups: {
 *     a:[mario, pippo, rossi]
 *  }
 */



/*
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
*/
