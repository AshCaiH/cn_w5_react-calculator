import { useState } from 'react';
import './App.css'

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
const commands = ["/","*","-","+"];
const bottomKeys = ["=", "."];
const leftKeys = ["ANS", "C"]
const displaySize = 12;

const print = console.log // Remove this later

function App() {
  const [display, setDisplay] = useState("0");
  const [working, setWorking] = useState(0);
  const [nextCalc, setNextCalc] = useState("");
  const [numpad, setNumpad] = useState(nums);
  // When the user presses equals, I want to show the result
  // in the main display. However, it should be overwritten
  // by whatever the user presses next. This keeps track of
  // whether the main text should be overwritten or not.
  const [tempResult, setTemp] = useState(false);

  const inputNum = (num) => {
    // If the input region is 0 or the tempResult flag is set,
    // overwrite with the user's input.
    if (display === "0" || tempResult) {
      setDisplay(num.toString());
      tempResult;
      setTemp(false);
    }

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

  const calculate = (result) => {
    
    let answer = 0;
    let num1 = parseFloat(working); // Number in memory
    let num2 = parseFloat(display); // Number entered by user
    
    // if (working == 0) setWorking(display);

    switch (nextCalc) {
      case "+":
        answer = num1 + num2; 
        break;
      case "-":
        answer = num1 - num2; 
        break;
      case "*":
        answer = num1 * num2; 
        break;
      case "/":
        answer = num1 / num2; 
        break;
      default:
        answer = num2;
        break;
    }

    setWorking(answer);

    if (answer.toString().length > 12) answer = answer.toExponential(9);

    if (result) {
      setDisplay(answer);
      setTemp(true);
    } else {
      setDisplay("0");
    }
  }

  const inputCommand = (command) => {
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
        calculate(true);
        setNextCalc("");
        break;
      default:
        // User can change calc function after picking one.
        if (display != 0 && tempResult == false) calculate();
        setNextCalc(command);
    }
  }

  return (
    <>
      <h1>Calculator</h1>


      <div className="display">
        <div className="displayRow top">
          <p className="working">{parseFloat(round(working))}</p>
          <p className="calcType">{nextCalc}</p>
        </div>
        <div className="displayRow bottom">
          <p className="maindisplay">{display}</p>
        </div>
      </div>

      <div className="mainKeys">
        <div className="commands leftKeys">
          {leftKeys.map((command, index) => {
            return <button onClick={() => inputCommand(command)} key={index}>{command}</button>
          })}
        </div>
        <div className="numpad">
          {nums.map((num, index) => {
            return <button className={"mainBtn btn"+num} onClick={() => inputNum(num)} key={index}>{num}</button>
          })}
          {bottomKeys.map((command, index) => {
            return <button  className="mainBtn" onClick={() => inputCommand(command)} key={index}>{command}</button>
          })}
        </div>
        <div className="commands">
          {commands.map((command, index) => {
            return <button onClick={() => inputCommand(command)} key={index}>{command}</button>
          })}
        </div>
      </div>
      
      <div className="commands">
        
      </div>
    </>
  )
}

export default App
