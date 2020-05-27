import React, {useState} from 'react';
import ApiService from '../../service/ApiService';
import StreamingService from '../../service/StreamingService';

let videoTag;

export default function StudentSession({studentSession, onStudentSessionChanged}) {


  if (ApiService.isHost()) {
    return (
      <p>Loading as host...</p>
    )
  }


  // very not react way, please don't do this
  setTimeout(() => {
    if(videoTag == null) {
      videoTag = document.querySelector('video');
    }
    videoTag.srcObject = StreamingService.remoteStream;
  }, 500);

  return (
    <div>
      <div>Loading video</div>
      <div>Video holder</div>
      <video autoPlay style={{
        width: '65vw',
        top: 0,
        left: '33vw',
        position: 'absolute'
      }} onMouseMove={onMouseMove} onMouseDown={onMouseDown} onMouseUp={onMouseUp}/>
    </div>
  );

  function onMouseMove (evt) {
    evt.preventDefault();
    StreamingService.sendInput({
      type: 'mouseMove',
      x: evt.clientX - videoTag.offsetLeft,
      y: evt.clientY - videoTag.offsetTop
    });
  }

  function onMouseDown(evt) {
    evt.preventDefault();
    StreamingService.sendInput({
      type: 'mouseDown',
      x: evt.clientX - videoTag.offsetLeft,
      y: evt.clientY - videoTag.offsetTop
    });
  }

  function onMouseUp(evt) {
    evt.preventDefault();
    StreamingService.sendInput({
      type: 'mouseUp',
      x: evt.clientX - videoTag.offsetLeft,
      y: evt.clientY - videoTag.offsetTop
    });
  }
}
