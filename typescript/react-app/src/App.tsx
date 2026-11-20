import "./App.css";
import { Calendar } from "@typescript-calendar-lib/react";
import "@typescript-calendar-lib/react/calendar.css"; // required — component styles

function App() {
  return (
    <>
      <Calendar year={2026} month={9} colorScheme="ocean" theme="modern" />
    </>
  );
}

export default App;
