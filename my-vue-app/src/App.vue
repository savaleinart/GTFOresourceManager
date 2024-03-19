<script setup>

import Zone from './components/Zone.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onUnmounted } from 'vue'
import wsConfig from '../../server/wsConfig.json'



const zones = ref([])
const zoneData = ref([])
const selectedId = ref(0)
const zoneText = ref("")
const increment = ref(1)
const checked = ref("false")
const objectID = ref("")
const importedString = ref("")

const ws = ref(null);



// Attempt to establish a WebSocket connection
onMounted(() => {
  const zoneTextInputElement = document.getElementById('zoneTextInput');
  const zoneTextButtonElement = document.getElementById('zoneTextButton');
  zoneTextInputElement.addEventListener('keypress', (event) => {
    if (event.key == "Enter") {
      zoneTextButtonElement.click()
    }
  })

  try {
    ws.value = new WebSocket(wsConfig.tunnelUrl);
    // Event listener for successful connection
    ws.value.onopen = () => console.log("WebSocket connection established");
    //message reception from server
    ws.value.onmessage = (event) => {
      event.data.text().then(txt => {

        let d = JSON.parse(txt)
        //console.log(d)
        zones.value = d[0]
        zoneData.value = d[1]
      })
    }
  } catch (error) {
    // Log error if connection fails
    console.error("Failed to establish WebSocket connection:", error);
  }
});

// Proper WebSocket closure within the onUnmounted lifecycle hook
onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
    console.log("WebSocket connection closed");
  }
});

// Define sendMessage: verifies the connection is open before sending
const sendMessage = (message) => {
  if (ws.value && ws.value.readyState === WebSocket.OPEN) {
    ws.value.send(JSON.stringify(message)); // Messages must be stringified
  } else {
    // Error handling if the WebSocket connection is not open
    console.error("WebSocket connection is not open.");
  }
};





function add(nb) {
  if (zones.value.includes(nb)) {
    selectedId.value = zones.value.indexOf(nb)
  }
  else {
    zones.value.push(nb)
    zones.value.sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
    zoneData.value.push({
      zoneNumber: nb,
      zoneFolded: false,
      ammoPack: 0,
      medPack: 0,
      toolRefill: 0,
      disinfectionPack: 0,
      fogRepeller: 0,
      tripMine: 0,
      cTripMine: 0,
      grenade: 0,
      IIXSyringe: 0,
      LPSyringe: 0,
      powerCell: 0,
      generator: 0,
      keyCard: 0,
      bulkHeadKey: 0,
      objective: 0,
      fogTurbine: 0,
      keyCardColors: [],
      IDs: {
        powerCell: [],
        generator: [],
        keyCard: [],
        bulkHeadKey: [],
        objective: [],
        fogTurbine: []
      }
    })
    zoneData.value.sort((a, b) => Number.parseInt(a.zoneNumber) - Number.parseInt(b.zoneNumber))
    zoneText.value = ""
    selectedId.value = zones.value.indexOf(nb)
    checked.value = "false"
    increment.value = 1

    sendMessage([zones.value, zoneData.value])
  }

}

function toggleFoldForZones(startId, endId) {
  for (let i = startId; i < endId + 1; i++) {
    zoneData.value[i].zoneFolded = !zoneData.value[i].zoneFolded
  }
}

function updateCount(x) {

  let data = zoneData.value[selectedId.value]

  switch (x) {
    case 0:
      data.ammoPack = Math.max(0, data.ammoPack + increment.value)

      break;
    case 1:
      data.medPack = Math.max(0, data.medPack + increment.value)

      break;
    case 2:
      data.toolRefill = Math.max(0, data.toolRefill + increment.value)

      break;
    case 3:
      data.disinfectionPack = Math.max(0, data.disinfectionPack + increment.value)

      break;
    case 4:
      data.fogRepeller = Math.max(0, data.fogRepeller + increment.value)

      break;
    case 5:
      data.tripMine = Math.max(0, data.tripMine + increment.value)

      break;
    case 6:
      data.cTripMine = Math.max(0, data.cTripMine + increment.value)

      break;
    case 7:
      data.grenade = Math.max(0, data.grenade + increment.value)

      break;
    case 8:
      data.IIXSyringe = Math.max(0, data.IIXSyringe + increment.value)

      break;
    case 9:
      data.LPSyringe = Math.max(0, data.LPSyringe + increment.value)

      break;
    case 10:
      data.powerCell = Math.max(0, data.powerCell + increment.value)
      if (objectID.value != "" && increment.value > 0) {
        data.IDs.powerCell.push(objectID.value)

      }
      if (increment.value < 0) {
        data.IDs.powerCell = data.IDs.powerCell.filter(e => e != objectID.value)
      }

      break;
    case 11:
      data.generator = Math.max(0, data.generator + increment.value)
      if (objectID.value != "" && increment.value > 0) {
        data.IDs.generator.push(objectID.value)

      }
      if (increment.value < 0) {
        data.IDs.generator = data.IDs.generator.filter(e => e != objectID.value)
      }

      break;

    case 12:
      data.keyCard = Math.max(0, data.keyCard + increment.value)
      if (objectID.value != "" && increment.value > 0) {

        let regexMatch = objectID.value.match(/([a-zA-Z]*)_?\s?(.*)/)
        data.IDs.keyCard.push([regexMatch[2], regexMatch[1].toLowerCase()])
        data.IDs.keyCard.sort((a, b) => Number.parseInt(a[0]) - Number.parseInt(b[0]))

      }
      if (increment.value < 0) {
        let regexMatch = objectID.value.match(/([a-zA-Z]*)_?\s?(.*)/)

        data.IDs.keyCard = data.IDs.keyCard.filter(e => e[0] != regexMatch[2])

      }

      break;

    case 13:
      data.bulkHeadKey = Math.max(0, data.bulkHeadKey + increment.value)
      if (objectID.value != "" && increment.value > 0) {
        data.IDs.bulkHeadKey.push(objectID.value)

      }
      if (increment.value < 0) {
        data.IDs.bulkHeadKey = data.IDs.bulkHeadKey.filter(e => e != objectID.value)
      }

      break;

    case 14:
      data.objective = Math.max(0, data.objective + increment.value)
      if (objectID.value != "" && increment.value > 0) {
        data.IDs.objective.push(objectID.value)

      }
      if (increment.value < 0) {
        data.IDs.objective = data.IDs.objective.filter(e => e != objectID.value)
      }

      break;

    case 15:
      data.fogTurbine = Math.max(0, data.fogTurbine + increment.value)
      if (objectID.value != "" && increment.value > 0) {
        data.IDs.fogTurbine.push(objectID.value)

      }
      if (increment.value < 0) {
        data.IDs.fogTurbine = data.IDs.fogTurbine.filter(e => e != objectID.value)
      }

      break;


  }

  objectID.value = ""

  sendMessage([zones.value, zoneData.value])
}

function getQuantityOfItemsInZone(nb) {
  let data = zoneData.value[nb]
  let total = 0
  for (const [key, value] of Object.entries(data)) {
    if (!["IDs", "keyCardColors", "zoneNumber", "zoneFolded"].includes(key)) {
      total += Number.parseInt(value)
    }

  }

  return total
}

function deleteZone(index) {

  zones.value.splice(index, 1)
  zoneData.value.splice(index, 1)

  sendMessage([zones.value, zoneData.value])
}

function copyAsText() {
  navigator.clipboard.writeText(JSON.stringify([zones.value, zoneData.value]))
}

function importFromClipBoard() {
  let data = JSON.parse(importedString.value)
  importedString.value = ""
  zones.value = data[0]
  zoneData.value = data[1]
}


</script>

<template>
  <div class="grid-container">

    <div class="zones">
      <div :class="zoneData[i].zoneFolded ? 'zone-folded' : 'zone'" v-for="(z, i) in zones" @click="selectedId = i">

        <div class="zoneHeader">
          <button class="delete-button" @click="deleteZone(i)">
            <svg class="delete-icon" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
            </svg>
          </button>
          <Zone :zoneNumber="z" :key="i" :class="i == selectedId ? 'selected' : ''" />
          <span class="resourceCountHeader" v-show="zoneData[i].zoneFolded">({{ getQuantityOfItemsInZone(i) }})</span>
          <button v-if="i % 5 == 4" class="fold-button" @click="toggleFoldForZones(i - 4, i)">
            <svg width="24px" height="20px" viewBox="0 0 16 16" fill="#888888" class="bi bi-three-dots-vertical">
              <path
                d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
          </button>


        </div>


        <div class="resourceList" v-show="!zoneData[i].zoneFolded">
          <div class="resBloc" v-if="zoneData[i].ammoPack > 0"><img src="../src/assets/AmmoPack.png" class="AmmoPack"
              width="32" height="32">{{ zoneData[i].ammoPack }} </div>
          <div class="resBloc" v-if="zoneData[i].medPack > 0"><img src="../src/assets/MedPack.png" class="MedPack"
              width="32" height="32">{{ zoneData[i].medPack }} </div>
          <div class="resBloc" v-if="zoneData[i].toolRefill > 0"><img src="../src/assets/ToolRefill.png"
              class="ToolRefill" width="32" height="32">{{ zoneData[i].toolRefill }} </div>
          <div class="resBloc" v-if="zoneData[i].disinfectionPack > 0"><img src="../src/assets/DisinfectionPack.png"
              class="DisinfectionPack" width="32" height="32">{{ zoneData[i].disinfectionPack }} </div>
          <div class="resBloc" v-if="zoneData[i].fogRepeller > 0"><img src="../src/assets/FogRepeller.png"
              class="FogRepeller" width="32" height="32">{{ zoneData[i].fogRepeller }} </div>
          <div class="resBloc" v-if="zoneData[i].tripMine > 0"><img src="../src/assets/TripMine.png" class="TripMine"
              width="32" height="32">{{ zoneData[i].tripMine }} </div>
          <div class="resBloc" v-if="zoneData[i].cTripMine > 0"><img src="../src/assets/CTripMine.png" class="CTripMine"
              width="32" height="32">{{ zoneData[i].cTripMine }} </div>
          <div class="resBloc" v-if="zoneData[i].grenade > 0"><img src="../src/assets/Grenade.png" class="Grenade"
              width="32" height="32">{{ zoneData[i].grenade }} </div>
          <div class="resBloc" v-if="zoneData[i].IIXSyringe > 0"><img src="../src/assets/IIXSyringe.png"
              class="IIXSyringe" width="32" height="32">{{ zoneData[i].IIXSyringe }} </div>
          <div class="resBloc" v-if="zoneData[i].LPSyringe > 0"><img src="../src/assets/LPSyringe.png" class="LPSyringe"
              width="32" height="32">{{ zoneData[i].LPSyringe }} </div>
          <div class="resBloc" v-if="zoneData[i].powerCell > 0"><img src="../src/assets/PowerCell.png" class="PowerCell"
              width="32" height="32"><span>{{ zoneData[i].IDs.powerCell }}</span></div>
          <div class="resBloc" v-if="zoneData[i].generator > 0"><img src="../src/assets/Generator.png" class="PowerCell"
              width="32" height="32"><span>{{ zoneData[i].IDs.generator }}</span></div>
          <div class="resBloc" v-if="zoneData[i].keyCard > 0"><img src="../src/assets/KeyCard.png" class="KeyCard"
              width="32" height="32"><span><span v-for="(keyCardData, index) in zoneData[i].IDs.keyCard"
                :class="keyCardData[1]">{{
        keyCardData[0] }}</span></span></div>
          <div class="resBloc" v-if="zoneData[i].bulkHeadKey > 0"><img src="../src/assets/BulkHeadKey.png"
              class="BulkHeadKey" width="32" height="32">{{ zoneData[i].bulkHeadKey }} <span>{{
        zoneData[i].IDs.bulkHeadKey }}</span></div>
          <div class="resBloc" v-if="zoneData[i].objective > 0"><img src="../src/assets/Objective.png" class="Objective"
              width="32" height="32">{{ zoneData[i].objective }} <span>{{ zoneData[i].IDs.objective }}</span></div>
          <div class="resBloc" v-if="zoneData[i].fogTurbine > 0"><img src="../src/assets/FogTurbine.png" width="32"
              height="32"><span>{{ zoneData[i].IDs.fogTurbine
              }}</span></div>

        </div>
      </div>
    </div>



    <div class="commandPanel">
      <button @click="updateCount(0)">
        <img src="../src/assets/AmmoPack.png" class="AmmoPack" width="48" height="48">
      </button>
      <button @click="updateCount(1)">
        <img src="../src/assets/MedPack.png" class="MedPack" width="48" height="48">
      </button>
      <button @click="updateCount(2)">
        <img src="../src/assets/ToolRefill.png" class="ToolRefill" width="48" height="48">
      </button>
      <button @click="updateCount(3)">
        <img src="../src/assets/DisinfectionPack.png" class="DisinfectionPack" width="48" height="48">
      </button>
      <button @click="updateCount(4)">
        <img src="../src/assets/FogRepeller.png" width="48" height="48">
      </button>
      <button @click="updateCount(5)">
        <img src="../src/assets/TripMine.png" width="48" height="48">
      </button>
      <button @click="updateCount(6)">
        <img src="../src/assets/CTripMine.png" width="48" height="48">
      </button>
      <button @click="updateCount(7)">
        <img src="../src/assets/Grenade.png" width="48" height="48">
      </button>
      <button @click="updateCount(8)">
        <img src="../src/assets/IIXSyringe.png" class="IIXSyringe" width="48" height="48">
      </button>
      <button @click="updateCount(9)">
        <img src="../src/assets/LPSyringe.png" class="MedPack" width="48" height="48">
      </button>
      <button @click="updateCount(10)">
        <img src="../src/assets/PowerCell.png" class="PowerCell" width="48" height="48">
      </button>
      <button @click="updateCount(11)">
        <img src="../src/assets/Generator.png" class="PowerCell" width="48" height="48">
      </button>
      <button @click="updateCount(12)">
        <img src="../src/assets/KeyCard.png" class="Key" width="48" height="48">
      </button>
      <button @click="updateCount(13)">
        <img src="../src/assets/BulkHeadKey.png" class="BulkHeadKey" width="48" height="48">
      </button>
      <button @click="updateCount(14)">
        <img src="../src/assets/Objective.png" class="Objective" width="48" height="48">
      </button>
      <button @click="updateCount(15)">
        <img src="../src/assets/FogTurbine.png" width="48" height="48">
      </button>

      <div class="sub-panel">

        <div>
          <input type="text" v-model="objectID" placeholder="object ID">
        </div>

        <div class="mode-slider">
          <label>Add </label>
          <label class="switch">
            <input type="checkbox" v-model="checked" @click="increment = increment * -1">
            <span class="slider round"></span>
          </label>
          <label> Remove</label>
        </div>



      </div>
      <div>
          <input id="zoneTextInput" type="text" v-model="zoneText">
          <button id="zoneTextButton" @click="add(zoneText)">add zone</button>
        </div>
      <div class="sub-panel">
        
        <button @click="copyAsText"> copy as text</button>
        <div>
          <input type="text" v-model="importedString" placeholder="paste import string here">
          <button @click="importFromClipBoard"> import from share text</button>
        </div>
      </div>




    </div>
  </div>

</template>

<style scoped>
.sub-panel {
  border: 1px solid #444444;
  padding-top: 4px;
  padding-bottom: 4px;
}

.mode-slider {
  grid-template-columns: 33% 33% 33%;
}

.resBloc {
  font-size: 4ch;
  vertical-align: bottom;
  border-bottom: 1px solid rgb(247, 247, 247);
  border-radius: 12px;
  display: inline-block;
  margin-right: 4px;
}

.resourceCountHeader {
  font-size: 1.5rem;
  color: #c4a600;
}

span {
  span {
    border-radius: 8px;
    margin-left: 1px;
    margin-right: 1px;
  }

  .white {
    background-color: #ebebeb;
    color: #1b1b1b;
  }

  .red {
    background-color: #b40101;
  }

  .blue {
    background-color: #1c01b4;
  }

  .grey {
    background-color: #4d4d4d;
  }

  .purple {
    background-color: #6c009e;
  }

  .yellow {
    background-color: #c4a600;
  }

  .green {
    background-color: #009e1a;
  }

  .orange {
    background-color: #cf6b0d;
  }

  .black {
    background-color: #000000;
  }
}


.resourceList {
  max-height: 80%;
}

div>img {
  position: relative;
  top: 4px;
}

.zone {
  min-height: 10vmin;
  border: 2px solid;
  border-color: #353535;
  background-color: #1a1a1a;
  border-radius: 8px;
  margin: 2px;
  padding-right: 2px;
  padding-left: 2px;
}

.zone-folded {
  min-height: 0vmin;
  max-height: 5vmin;
  border: 2px solid;
  border-color: #353535;
  background-color: #1a1a1a;
  border-radius: 8px;
  margin: 2px;
  padding-right: 2px;
  padding-left: 2px;
}

.zoneHeader {
  background-color: #333333;
  border-radius: 4px;
  margin-top: 1px;
}

.selected {
  color: coral;
}

.bulletless {
  list-style-type: none;
}

.zones {
  display: grid;
  grid-template-columns: auto auto auto auto auto;
  outline: #333333 solid;
  border-radius: 8px;
  margin-right: 0.5vmin;
}

.panel {
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid transparent;
  margin: 4px;
  padding-right: 10px;
  padding-left: 10px;
}

.commandPanel {
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid transparent;
  margin: 4px;
  padding-right: 10px;
  padding-left: 10px;
}

.grid-container {

  display: grid;
  grid-template-columns: auto 20%;
}

.delete-button:hover {
  border-radius: 8px;
  width: auto;
  margin: 0px;
  padding: 4px;
  border-color: #ff0000;
}

.fold-button {

  width: auto;
  margin: 0px;
  padding: 0px;
  border: 1px solid transparent;
  background-color: transparent;
}

.delete-button {
  border-radius: 8px;
  width: auto;
  margin: 0px;
  padding: 4px;
  border: 1px solid transparent;
  background-color: transparent;
  cursor: pointer;

}

.delete-button:hover .delete-icon {
  fill: #ff0000;
  transition: fill 0.5s;
}

.delete-icon {
  fill: #888888
}


.AmmoPack {
  filter: invert(56%) sepia(64%) saturate(394%) hue-rotate(35deg) brightness(97%) contrast(93%);
}

.MedPack {
  filter: invert(86%) sepia(95%) saturate(6148%) hue-rotate(349deg) brightness(93%) contrast(94%);
}

.ToolRefill {
  filter: invert(73%) sepia(42%) saturate(7489%) hue-rotate(221deg) brightness(96%) contrast(93%);
}

.DisinfectionPack {
  filter: invert(32%) sepia(29%) saturate(2696%) hue-rotate(145deg) brightness(110%) contrast(86%);
}

.IIXSyringe {
  filter: invert(14%) sepia(67%) saturate(3033%) hue-rotate(7deg) brightness(101%) contrast(97%);
}

.LPSyringe {
  filter: invert(86%) sepia(95%) saturate(6148%) hue-rotate(349deg) brightness(93%) contrast(94%);
}

.PowerCell {
  filter: invert(26%) sepia(57%) saturate(3225%) hue-rotate(360deg) brightness(109%) contrast(106%);
}

.KeyCard {
  filter: brightness(100%);
}

.BulkHeadKey {
  filter: invert(86%) sepia(79%) saturate(6973%) hue-rotate(344deg) brightness(97%) contrast(109%);
}

.Objective {
  filter: invert(48%) sepia(23%) saturate(6659%) hue-rotate(56deg) brightness(97%) contrast(101%);
}
</style>
