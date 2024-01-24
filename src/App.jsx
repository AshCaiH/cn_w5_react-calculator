import { useState, useEffect } from 'react';
import { FaDivide, FaPlus, FaX, FaMinus, FaC, FaEquals, FaSuperscript,
         FaSquareRootVariable,FaArrowLeft} from "react-icons/fa6";
import { GoDotFill, } from "react-icons/go";
import './App.css'

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reverse();
const rightKeys = [
  {name:"/", class:"Divide",icon:<FaDivide/>},
  {name:"*", class:"Mult",  icon:<FaX/>},
  {name:"+", class:"Plus",  icon:<FaPlus/>},
  {name:"=", class:"Eq",    icon:<FaEquals/>}
];
const bottomKeys = [
  {name:"-", class:"Minus", icon:<FaMinus/>},
  {name:".", class:"Dot",   icon:<GoDotFill/>},
];
const leftKeys = [
  {name:"Pow",  class:"Pow",  icon:<FaSuperscript/>},
  {name:"Sqrt", class:"Sqrt", icon:<FaSquareRootVariable/>},
  {name:"BkSp", class:"BkSp", icon:<FaArrowLeft/>},
  {name:"C",    class:"C",    icon:<FaC/>}
]
// Get one list of all function keys.
const allKeys = [].concat(rightKeys,leftKeys,bottomKeys).map((k) => { return k.name })
const displaySize = 12; // How many characters can appear on the display.

const print = console.log // Remove this later

function App() {
  const [display, setDisplay] = useState("0");
  const [working, setWorking] = useState(0);
  const [nextCalc, setNextCalc] = useState("");
  // When the user presses equals, we want to show the result
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
    
    else {
      // Make sure the screen isn't already full.
      if (display.length < displaySize) {
        // Add the next input to the end of the string.
        setDisplay(display.toString() + num);
      }
    }

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

    // If the answer is too long, try rounding it in case it's a
    // floating point error, and if it's still too long, convert
    // it to exponential format.
    if (answer.toString().length > 12) {
      answer = round(answer);
      if (answer.toString().length > 12) {
        answer = answer.toExponential(8);
      }
    }

    if (result) {
      setDisplay(answer);
      setTemp(true);
    } else {
      setDisplay("0");
    }
  }

  const keyPressEvent = (e) => {
    // If pressed key is between 0 and 9, add it to the input.
    if ([...Array(9).keys()].includes(parseInt(e.key))) inputNum(parseInt(e.key))
    else if (e.key == "Delete" || e.key == "Backspace") inputCommand("BkSp");
    else if (e.key == "Enter" ) inputCommand("=");
    else {
      if (allKeys.includes(e.key)) inputCommand(e.key);
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
        if (tempResult) setDisplay("0.".toString());
        else setDisplay(display.toString() + ".");
        break;
      case "=":
        calculate(true);
        setNextCalc("");
        break;
      case "BkSp":
        if (display.length > 1) setDisplay(display.slice(0, -1));
        else setDisplay("0");
        break;
      default:
        // User can change calc function after picking one.
        if (display != 0 && tempResult == false) calculate();
        setNextCalc(command);
    }
  }

  const makeButton = (command, index) => {
    return <button 
      className={"btn"+command.class} 
      onClick={() => inputCommand(command.name)} 
      key={index}>{command.icon ? (command.icon) : (command.name)}
    </button>
  }

  // Adding keyboard event listeners outside of the useEffect function
  // causes them to run twice each time.
  useEffect(() => {
    document.addEventListener("keydown", keyPressEvent);

    // Removes the existing event listener whenever the page rerenders.
    return () => document.removeEventListener("keydown", keyPressEvent);
  });

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
            return makeButton(command,index);
          })}
        </div>
        <div className="numpad">
          {nums.map((num, index) => {
            return <button className={"numBtn btn"+num} onClick={() => inputNum(num)} key={index}>{num}</button>
          })}
          {bottomKeys.map((command, index) => {
            return makeButton(command,index);
          })}
        </div>
        <div className="commands">
          {rightKeys.map((command, index) => {
            return makeButton(command, index);
          })}
        </div>
      </div>
    </>
  )
}

export default App
