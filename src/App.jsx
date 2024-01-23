import { useState } from 'react'
import './App.css'

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const commands = [".","+","-","*","/","=","C"];

function App() {
  const [result, setResult] = useState("0");
  const [working, setWorking] = useState(0);
  const [numpad, setNumpad] = useState(nums);

  const inputNum = (num) => {
    // If the result starts with a 0, replace it with the
    // number the user has input.
    if (result == 0) setResult(num);
    // If we don't turn result into a string before adding
    // the next number, it will just output the sum.
    else setResult(result.toString() + num);
  }

  const inputCommand = (e) => {
    const command = commands[e];

    switch (command) {
      case "C": 
        setResult("0");
        setWorking(0);
        break;
      case "+":
        setWorking(parseFloat(result) + parseFloat(working));
        setResult("0");
        break;
      case "-": 
        setResult("0");
        break;
      case "*": 
        setResult("0");
        break;
      case "/": 
        setResult("0");
        break;
      default: 
        console.log(command)
    }
  }

  return (
    <>
      <h1>Calculator</h1>

      <p className="working">{working}</p>
      <p className="result">{result}</p>

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
