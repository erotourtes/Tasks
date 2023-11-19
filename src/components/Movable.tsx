import { useState } from "react";

function Movable() {
  const [list, setList] = useState([
    "first", "second", "third", "fourth", "fifth"
  ]);

  return (
    <div className="ms-5 space-y-2">
      {list.map((item, index) => (
        <div key={index} className="flex justify-between">
          <div className="bg-gray-600 w-80 p-2">{item}</div>
        </div>
      ))}
    </div>
  );
}

export default Movable;
