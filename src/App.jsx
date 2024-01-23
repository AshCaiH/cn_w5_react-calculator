import { useState } from 'react';
import './App.css'

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const commands = [".","+","-","*","/","=","C"];
const displaySize = 12;

function App() {
  const [display, setDisplay] = useState("0");
  const [working, setWorking] = useState(0);
  const [nextCalc, setNextCalc] = useState("");
  const [numpad, setNumpad] = useState(nums);

  const inputNum = (num) => {
    // If the display starts with a 0, replace it with the
    // number the user has input.
    if (display === "0") setDisplay(num.toString());
    // If we don't turn result into a string before adding
    // the next number, it will just output the sum.
    else setDisplay(display.toString() + num);

    // If the nextCalc hasn't been set, clear out the working
    // variable and treat this as a new calculation.
    if (!nextCalc) setWorking(0);
  }

  // Use this regularly to address floating point errors.
  const round = (num) => {
    let factor = Math.pow(10, displaySize);
    return Math.round(num * factor) / factor;
  }

  const calculate = () => {
    if (working == 0) setWorking(display);

    switch (nextCalc) {
      case "+":
        setWorking(parseFloat(working) + parseFloat(display)); 
        break;
      case "-":
        setWorking(parseFloat(working) - parseFloat(display));
        break;
      case "*":
        setWorking(parseFloat(working) * parseFloat(display));
        break;
      case "/":
        setWorking(parseFloat(working) / parseFloat(display));
        break;
      default:
        break;
    }

    setDisplay("0");
  }

  const inputCommand = (e) => {
    const command = commands[e];

    switch (command) {
      case "C": 
        setDisplay("0");
        setWorking(0);
        setNextCalc("");
        break;
      case ".":
        setDisplay(display + ".");
        break;
      case "=":
        calculate();
        setNextCalc("");
        break;
      default:
        // User can change calc function after picking one.
        if (display != 0) calculate();
        setNextCalc(command);
    }
  }

  return (
    <>
      <h1>Calculator</h1>


      <p className="working">{parseFloat(round(working))}</p>
      <p className="calcType">{nextCalc}</p>
      <p className="display">{display}</p>

      <div className="numpad">
        {nums.map((num, index) => {
          return <button onClick={() => inputNum(index)} key={index}>{num}</button>
        })}
      </div>
      
      <div className="commands">
        {commands.map((command, index) => {
          return <button onClick={() => inputCommand(index)} key={index}>{command}</button>
        })}
      </div>
    </>
  )
}

export default App
