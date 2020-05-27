import React, {useState} from 'react';

export default function StudentSession ({studentSession, onStudentSessionChanged}) {
  return (
    <div>
      {JSON.stringify(studentSession)}
    </div>
  );
}
