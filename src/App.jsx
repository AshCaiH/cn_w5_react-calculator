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

function App() {
  const [mainDisplay, setMainDisp] = useState("0");
  const [memDisplay, setMemDisp] = useState(0); 
  const [nextCalc, setNextCalc] = useState("");
  // When the user presses equals, we want to show the result
  // in the main display. However, it should be overwritten
  // by whatever the user presses next. This keeps track of
  // whether the main text should be overwritten or not.
  const [tempResult, setTemp] = useState(false);

  const inputNum = (num) => {
    if (nextCalc == "Eq" || nextCalc == "Sqrt") setNextCalc("");

    // If the input region is 0 or the tempResult flag is set,
    // overwrite with the user's input.
    if (mainDisplay === "0" || tempResult) {
      setMainDisp(num.toString());
      tempResult;
      setTemp(false);
    }
    
    else {
      // Make sure the screen isn't already full.
      if (mainDisplay.length < displaySize) {
        // Add the next input to the end of the string.
        setMainDisp(mainDisplay.toString() + num);
      }
    }

    // If the nextCalc hasn't been set, clear out the working
    // variable and treat this as a new calculation.
    if (!nextCalc) setMemDisp(0);
  }

  // Use this regularly to address floating point errors.
  const round = (num) => {
    let factor = Math.pow(10, displaySize);
    return Math.round(num * factor) / factor;
  }

  const calculate = (isResult) => {
    let answer = 0;
    let num1 = parseFloat(memDisplay); // Number in memory
    let num2 = parseFloat(mainDisplay); // Number entered by user

    // Check the stored calculation.
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
      case "Pow":
        answer = Math.pow(num1,num2); 
        break;
      default:
        answer = num2;
        break;
    }

    setMemDisp(answer);

    // If the answer is too long, try rounding it in case it's a
    // floating point error, and if it's still too long, convert
    // it to exponential format.
    if (answer.toString().length > 12) {
      answer = round(answer);
      if (answer.toString().length > 12) {
        answer = answer.toExponential(8);
      }
    }

    // Shows the answer on the main display instead of just on the 
    // memory display under certain circumstances.
    if (isResult) {
      setMainDisp(answer);
      setTemp(true);
    } else {
      setMainDisp("0");
    }
  }

  const keyPressEvent = (e) => {    
    // Prevents default browser behaviours that interfere with the calculator keyboard inputs.
    if (e.key == "Backspace" || e.key == "/") e.preventDefault();

    // If pressed key is between 0 and 9, add it to the input.
    if ([...Array(10).keys()].includes(parseInt(e.key))) inputNum(parseInt(e.key))
    else if (e.key == "Delete" || e.key == "Backspace") inputCommand("BkSp");
    else if (e.key == "Enter" ) inputCommand("=");
    else if (e.key == "C" || e.key == "c" ) inputCommand("C");
    else if (e.key == "P" || e.key == "p" ) inputCommand("Pow");
    else if (e.key == "S" || e.key == "s" ) inputCommand("Sqrt");
    else {
      // Catches anything left over.   
      if (allKeys.includes(e.key)) {
        inputCommand(e.key);
      }
    }
  }

  const inputCommand = (command) => {
    switch (command) {
      case "C": 
        setMainDisp("0");
        setMemDisp(0);
        setNextCalc("");
        break;
      case ".":
        if (tempResult) {
          setMainDisp("0.".toString());
          setMemDisp(0);
          setNextCalc("");
          setTemp(false);
        }
        else setMainDisp(mainDisplay.toString() + ".");
        break;
      case "=":
        calculate(true);
        setNextCalc("Eq");
        break;
      case "BkSp":
        if (mainDisplay.length > 1) setMainDisp(mainDisplay.slice(0, -1));
        else setMainDisp("0");
        break;
      case "Sqrt":
        setMainDisp(Math.sqrt(parseFloat(mainDisplay)));
        setNextCalc("Sqrt");
        setTemp(true);
        break;
      default:
        // User can change calc function after picking one without losing
        // the working number.
        if (mainDisplay != 0 && tempResult == false) calculate();

        // Move result back to the working number and reset the main display.
        else if (tempResult == true) {
          setMemDisp(mainDisplay);
          setMainDisp("0");
          setTemp(false);
        }
        
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
      <p className="logo">Calco 3000</p>

      <div className="display">
        <div className="displayRow top">
          <p className="working">{parseFloat(round(memDisplay))}</p>
          <p className="calcType">{nextCalc}</p>
        </div>
        <div className="displayRow bottom">
          <p className="maindisplay">{mainDisplay}</p>
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
