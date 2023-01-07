import React from 'react';
import Die from "./components/Die"
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {

  const [dice, setDice] = React.useState(createAllNewDice())

  const[numberOfRolls, setNumberOfRolls] = React.useState(0)

  const [tenzies, setTenzies] = React.useState(false)
  
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }
  },[dice])

  function createAllNewDice() {
    const newDiceArray = []
    for (let i = 0; i < 10; i++) {
      newDiceArray.push(generateNewDie())
    }
    return newDiceArray
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function rollDice() {
    if (!tenzies) {
      setNumberOfRolls (prevNumberOfRolls => prevNumberOfRolls + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld? die : generateNewDie()
      }))
    }
    else {
      // Handle scenario to restart game after winning
      setTenzies(false)
      setDice(createAllNewDice)
      setNumberOfRolls(0)
    }    
  }

  function holdDice(id) {  
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {...die, isHeld:!die.isHeld} :die
    }))
  }

  const diceElements = dice.map(die => <Die key={die.id}  value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}></Die>)

  return (
    <main>
      {tenzies && <Confetti />}
      <h1>TENZI Dice Game</h1>
      <div className="dice-container">
        {diceElements}
      </div>
        <button disabled className="dice-roll-count">Number of Rolls: {numberOfRolls}</button>
        <button className="dice-roll" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      <p>
      <h2>Rules:</h2>
        You get 10 dice. Click 'Roll' to roll all dice simultaneously. Then inspect the dice and determine which number you will shoot for. Then, in rapid succession, continue rolling the remaining dice until they all display the same number.
      </p>
    </main>
  )
}