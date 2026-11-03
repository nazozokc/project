import { useEffect, useState } from "react";

function Display(prop: any) {
  const [text, setText] = useState("Loading...");
  useEffect(() => {
    setTimeout(() => {
      setText(`カウント: ${prop.count}`);
    }, 2000);
  });
  return <div>{text}</div>;
}

export default Display;
