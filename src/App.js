import React, {useState} from 'react';
import './App.css';

//                 0          1           2       3          4        5           6        7      8         9    10       11
const Attackers = ["Sledge", "Thatcher", "Ash", "Thermite", "Twitch", "Montagne", "Glaz", "Fuze", "Blitz", "IQ", "Buck", "Blackbeard",
//12        13        14        15      16      17          18      19        20          21       22          23     24
"Capitão", "Hibana", "Jackal", "Ying", "Zofia", "Dokkaebi", "Lion", "Finka", "Maverick", "Nomad", "Gridlock", "Nøkk", "Amaru"]
//                  0       1       2         3         4      5       6         7           8        9         10      11
const Defenders = ["Smoke", "Mute", "Castle", "Pulse", "Doc", "Rook", "Kapkan", "Tachanka", "Jäger", "Bandit", "Frost", "Valkyrie",
//12        13      14      15        16    17        18        19       20       21       22        23       24
"Caveira", "Echo", "Mira", "Lesion", "Ela", "Vigil", "Maestro", "Alibi", "Clash", "Kaid", "Mozzie", "Warden", "Goy"]

let AttackNumber = Array(24).fill(0)
let DefendNumber = Array(24).fill(0)
let AttackQueue = []
let DefendQueue = []

//Utility toggle categories
const SoftBreach = [0, 2, 10, 16]
const HardBreach = [3, 13]
const ShieldAttack = [5, 8]
const ShieldDefend = [7, 20, 24]
const Camera = [11,13,18, 22]
const Electric = [9, 21]

//Speed toggle categories
const AttackFast = [2, 9, 12, 13, 20]
const AttackMedium = [0, 1, 3, 4, 6, 8, 10, 11, 14, 15, 16, 17, 18, 19, 21, 23, 24]
const AttackHeavy = [5, 7, 22]
const DefendFast = [3, 8, 9, 12, 16, 17, 19]
const DefendMedium = [0, 1, 2, 6, 10, 11, 15, 22, 24]
const DefendHeavy = [4, 5, 7, 13, 14, 18, 20, 21, 23]

//Attack gadget categories
const FragGrenades = [0, 6, 10, 17, 19]
const StunGrenades = [0, 2, 3, 5, 10, 11, 12, 13, 18, 20, 21]
const Claymore = [1, 3, 4, 9, 12, 15, 16, 18, 20, 23, 24]
const BreachCharge = [1, 2, 4, 7, 8, 9, 11, 13, 14, 15, 16, 19, 21, 22, 23, 24]
const SmokeGrenades = [5, 6, 7, 8, 14, 17, 22]

//Defend gadget categories
const DeployableShield = [0, 7, 10, 11, 13, 16, 19, 23]
const BarbedWire = [0, 3, 4, 5, 7, 8, 9, 13, 14, 16, 18, 20, 22, 23]
const NitroCell = [1, 3, 6, 9, 11, 14, 21, 22, 24]
const BulletproofCamera = [1, 2, 4, 8, 10, 12, 15, 17]
const ImpactGrenades = [2, 5, 6, 12, 15, 17, 18, 19, 20, 21, 24]

let exclude = 0
let high = 0
let utilityCount = 0
let utilityFlag = 0
let speedCount = 0
let speedFlag = 0
let recruit = 0
let extremeRecruit = 0

function R6SRando() {
  //variable shown as the name of who you're playing
  let [Op, setOp] = useState("? ? ?") 

  //Toggles flag linked with "Ensure All Toggled Tiers" button
  const AllOptionsToggle = () => { 
    const button = document.getElementById("AllOptionsButton")
          if (button.value === "OFF"){
            exclude = 1
            specialToggle(button)
          }
          else {
            exclude = 0
            specialToggle(button)
          }
  }
  /*Toggles flag linked with "Recruit Roulette" button; 
  mutually exclusive with "Extreme Recruit Roulette"*/
  const RecruitRoulette = () => { 
    const button = document.getElementById("RecruitRoulette")
    if (button.value === "OFF"){
      specialToggle(button)
      recruit = 1
      //for mutual exclusion
      const otherButton = document.getElementById("ExtremeRecruitRoulette") 
      if (otherButton.value === "ON") {
        specialToggle(otherButton)
        extremeRecruit = 0
      }
    }
    else {
      specialToggle(button)
      recruit = 0
    }
  }
  /*Toggles flag linked with "Extreme Recruit Roulette" button; 
  mutually exclusive with "Recruit Roulette"*/
  const button = document.getElementById("ExtremeRecruitRoulette")
  const ExtremeRecruitRoulette = () => { 
    if (button.value === "OFF") {
      specialToggle(button)
      extremeRecruit = 1
      //for mutual exclusion
      const otherButton = document.getElementById("RecruitRoulette")  
      if (otherButton.value === "ON") {
        specialToggle(otherButton)
        recruit = 0
      }
    }
    else {
      specialToggle(button)
      extremeRecruit = 1
    }
  }

  //extra settings connected to similarly named buttons
        const SoftBreachToggle = () => {  //Attack
          const button = document.getElementById("SoftBreachersButton")
          if (button.value === "OFF"){
            SoftBreach.forEach(function(element){
              AttackNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            utilityToggle(button)
          }
          else {
            SoftBreach.forEach(function(element){
              AttackNumber[element]--
            })
            console.log("Attack: " + AttackNumber)
            utilityToggle(button)
          }
        }

        //Attack
        const HardBreachToggle = () => {  
          const button = document.getElementById("HardBreachersButton")
          if (button.value === "OFF"){
            HardBreach.forEach(function(element){
              AttackNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            utilityToggle(button)
          }
          else {
            HardBreach.forEach(function(element){
              AttackNumber[element]--
            })
            console.log("Attack: " + AttackNumber)
            utilityToggle(button)
          }
        }

        //Attack and Defense
        const ShieldToggle = () => {  
          const button = document.getElementById("ShieldButton")
          if (button.value === "OFF"){
            ShieldAttack.forEach(function(element){
              AttackNumber[element]++
            })
            ShieldDefend.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            console.log("Defend: "+ DefendNumber)
            utilityToggle(button)
          }
          else {
            ShieldAttack.forEach(function(element){
              AttackNumber[element]--
            })
            ShieldDefend.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Attack: "+AttackNumber)
            console.log("Defend: "+ DefendNumber)
            utilityToggle(button)
          }
        }
        //Defense
        const CameraToggle = () => {  
          const button = document.getElementById("CameraButton")
          if (button.value === "OFF"){
            Camera.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Defend: " + DefendNumber)
            utilityToggle(button)
          }
          else {
            Camera.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Defend: " + DefendNumber)
            utilityToggle(button)
          }
        }
        //Defense
        const ElectricToggle = () => {  
          const button = document.getElementById("ElectricButton")
          if (button.value === "OFF"){
            Electric.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Defend: " + DefendNumber)
            utilityToggle(button)
            
          }
          else {
            Electric.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Defend: " + DefendNumber)
            utilityToggle(button)
          }
        }
        const AttackHeavyToggle = () => {
          const button = document.getElementById("AttackHeavyButton")
          if (button.value === "OFF"){
            AttackHeavy.forEach(function(element){
              AttackNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
          else {
            AttackHeavy.forEach(function(element){
              AttackNumber[element]--
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
        }
        const AttackMediumToggle = () => {
          const button = document.getElementById("AttackMediumButton")
          if (button.value === "OFF"){
            AttackMedium.forEach(function(element){
              AttackNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
          else {
            AttackMedium.forEach(function(element){
              AttackNumber[element]--
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
        }
        const AttackFastToggle = () => {
          const button = document.getElementById("AttackFastButton")
          if (button.value === "OFF"){
            AttackFast.forEach(function(element){
              AttackNumber[element]++
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
          else {
            AttackFast.forEach(function(element){
              AttackNumber[element]--
            })
            console.log("Attack: " + AttackNumber)
            speedToggle(button)
          }
        }
        const DefendHeavyToggle = () => {
          const button = document.getElementById("DefendHeavyButton")
          if (button.value === "OFF"){
            DefendHeavy.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
          else {
            DefendHeavy.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
        }
        const DefendMediumToggle = () => {
          const button = document.getElementById("DefendMediumButton")
          if (button.value === "OFF"){
            DefendMedium.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
          else {
            DefendMedium.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
        }
        const DefendFastToggle = () => {
          const button = document.getElementById("DefendFastButton")
          if (button.value === "OFF"){
            DefendFast.forEach(function(element){
              DefendNumber[element]++
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
          else {
            DefendFast.forEach(function(element){
              DefendNumber[element]--
            })
            console.log("Defend: " + DefendNumber)
            speedToggle(button)
          }
        }

  //called when ATTACK with extra settings button is pressed
  const DoExtraAttack = () => { 
    for (var i = 0; i < AttackNumber.length; i++){
      high = 0
      if (exclude === 1){ //for "Ensure All Toggled Tiers"
        high--
        if (utilityFlag === 1)
          high++
        if (speedFlag === 1)
          high++
      }
      console.log(AttackNumber[i])
      if(AttackNumber[i] > high) {
        AttackQueue.push(Attackers[i])
      }
    }
    if (recruit === 1 && AttackQueue.length !== 0){ //for "Recruit Roulette"
      let divide = Math.floor(AttackQueue.length / 6)
      if (divide === 0) { //ensure at least 1 recruit
        divide = 1
      }
      for (var j = 0; j < divide; j++){
        AttackQueue.push("RECRUIT")
      }
    }
    if (extremeRecruit === 1 && AttackQueue.length !== 0) { //for "EXTREME Recruit Roulette"
    let multi = (AttackQueue.length * 5)
    for (var k = 0; k < multi; k++) {
      AttackQueue.push("RECRUIT")
    }
  }
    setOp(AttackQueue[Math.floor(Math.random() * AttackQueue.length)])
    if(AttackQueue.length === 0){
      setOp("Fix ya settings ya dingus")
    }
    console.log(AttackQueue)
    AttackQueue = []
  }
  //called when DEFEND with extra settings button is pressed
  const DoExtraDefend = () => { 
    high = 0
    if (exclude === 1){ //for "Ensure All Toggled Tiers"
      high--
      if (utilityFlag === 1)
        high++
      if (speedFlag === 1)
        high++
    }
    for (var i = 0; i < DefendNumber.length; i++){
      console.log(DefendNumber[i])
      if(DefendNumber[i] > high) {
        DefendQueue.push(Defenders[i])
      }
    }
    if (recruit === 1 && DefendQueue.length !== 0){ //for "Recruit Roulette"
      let divide = Math.floor(DefendQueue.length / 6)
      if (divide === 0) //ensure at least 1 recruit
       divide = 1
      for (var j = 0; j < divide; j++){
        DefendQueue.push("RECRUIT")
      }
    }
    if (extremeRecruit === 1 && DefendQueue.length !== 0) { //for "EXTREME Recruit Roulette"
      let multi = (DefendQueue.length * 5)
      for (var k = 0; k < multi; k++) {
        DefendQueue.push("RECRUIT")
      }
    }
    setOp(DefendQueue[Math.floor(Math.random() * DefendQueue.length)])
    if(DefendQueue.length === 0){
      setOp("Fix ya settings ya dingus")
    }
    console.log(DefendQueue)
    DefendQueue = []
  }

  const speedToggle = (button) => { //Gray or color
    if (button.value === "OFF"){
      button.value= "ON"
      button.style.backgroundColor = "#A2C5FE"
      button.style.color = "#e7e7e7"
      speedCount++
    }
    else {
      button.value = "OFF"
      button.style.backgroundColor = "#727A87"
      button.style.color = "#9DA9B1"
      speedCount--
    }
    if (speedCount === 0)
      speedFlag = 0
    else
      speedFlag = 1
  }
  const utilityToggle = (button) => { //Gray or color
    if (button.value === "OFF"){
      button.value= "ON"
      button.style.backgroundColor = "#A2C5FE"
      button.style.color = "#e7e7e7"
      utilityCount++
    }
    else {
      button.value = "OFF"
      button.style.backgroundColor = "#727A87"
      button.style.color = "#9DA9B1"
      utilityCount--
    }
    if (utilityCount === 0)
      utilityFlag = 0
    else
      utilityFlag = 1
  }
  const specialToggle = (button) => {
    if (button.value === "OFF"){
      button.value= "ON"
      button.style.backgroundColor = "#A2C5FE"
      button.style.color = "#e7e7e7"
    }
    else {
      button.value = "OFF"
      button.style.backgroundColor = "#727A87"
      button.style.color = "#9DA9B1"
    }
  }

  // const testfunction = (button) => {  //linked to test button
  //   console.log("extremeRecruit: " + extremeRecruit)
  // }



  return (
    <div className="App-header">
        <h2>Toggle Options to include or exclude below!</h2>
        <div className = "WrapperCenter">
          <div className = "ToggleDefault">
            <div className = "special">
              <button id="AllOptionsButton" value = "OFF" onClick={AllOptionsToggle}>ENSURE ALL TOGGLED TIERS</button>
              <button id="RecruitRoulette" value = "OFF" onClick={RecruitRoulette}>RECRUIT ROULETTE</button>
              <button id="ExtremeRecruitRoulette" value = "OFF" onClick={ExtremeRecruitRoulette}>EXTREME RECRUIT ROULETTE</button>
            </div>
            <h3>Utility</h3>
            <div className = "extrautility">
              <button id='SoftBreachersButton' value = "OFF" onClick={SoftBreachToggle}>SOFT BREACHERS</button>
              <button id="HardBreachersButton" value = "OFF" onClick={HardBreachToggle}>HARD BREACHERS</button>
              <button id="ShieldButton" value = "OFF" onClick={ShieldToggle}>SHIELDS</button>
              <button id="CameraButton" value = "OFF" onClick={CameraToggle}>EXTRA CAMERAS</button>
              <button id="ElectricButton" value = "OFF" onClick={ElectricToggle}>ELECTRIC</button>
            </div>
            <h3>Speed</h3>
            <div className = "extraattackarmorspeed">
              <button id="AttackHeavyButton" value = "OFF" onClick={AttackHeavyToggle}>ATTACK HEAVY</button>
              <button id="AttackMediumButton" value = "OFF" onClick={AttackMediumToggle}>ATTACK MEDIUM</button>
              <button id="AttackFastButton" value = "OFF" onClick={AttackFastToggle}>ATTACK FAST</button>
            </div>
            <div className = "extradefendarmorspeed">
              <button id="DefendHeavyButton" value = "OFF" onClick={DefendHeavyToggle}>DEFEND HEAVY</button>
              <button id="DefendMediumButton" value = "OFF" onClick={DefendMediumToggle}>DEFEND MEDIUM</button>
              <button id="DefendFastButton" value = "OFF" onClick={DefendFastToggle}>DEFEND FAST</button>
            </div>
          </div>
        </div>
        <div>
          <h1> </h1>
        </div>
        <div>
          <button id = "ExtraAttack" onClick={DoExtraAttack}>ATTACK</button>
          <button id = "ExtraDefend" onClick={DoExtraDefend}>DEFEND</button>
        </div>
        <h3>You are using: {Op}</h3>
        {/*<button onClick={testfunction}>TEST</button> {/*take out when done*/}
    </div>
    
  );
}

export default R6SRando;
