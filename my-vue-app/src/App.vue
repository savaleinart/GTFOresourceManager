<script setup>

import Zone from './components/Zone.vue'
import RadioButton from '../node_modules/primevue/radiobutton';
import { ref } from 'vue'
import { onMounted } from 'vue'
import { onBeforeUnmount } from 'vue'
import { onUnmounted } from 'vue'


const zones = ref([])
const zoneData = ref([])
const selectedId = ref(0)
const zoneText = ref("")
const inc = ref("1")
const increment = ref(Number.parseInt(inc.value))

const ws = ref(null);

// Attempt to establish a WebSocket connection
onMounted(() => {
  try {
    ws.value = new WebSocket("ws://localhost:8082");
    // Event listener for successful connection
    ws.value.onopen = () => console.log("WebSocket connection established");
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
  zones.value.push(nb)
  zoneData.value.push({
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
    generator: 0
  })
  zoneText.value = ""
  selectedId.value = zones.value.length - 1

  ws.value.send(JSON.stringify([zones.value, zoneData.value]))
}

function updateCount(x) {

  let data = zoneData.value[selectedId.value]
  increment.value = Number.parseInt(inc.value)

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
      break;
    case 11:
      data.generator = Math.max(0, data.generator + increment.value)
      break;

  }

  ws.value.send(JSON.stringify([zones.value, zoneData.value]))
}


</script>

<template>
  <div class="grid-container">

    <div>
      <div class="panel" v-for="(z, i) in zones">
        <button class="delete-button" @click="zones.splice(i, 1); zoneData.splice(i, 1)">
          <svg class="delete-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
          </svg>
        </button>
        <Zone :zoneNumber="z" :key="i" @click="selectedId = i" :class="i == selectedId ? 'selected' : ''" />


        <div>

          <span v-if="zoneData[i].ammoPack > 0"><img src="../src/assets/AmmoPack.png" class="AmmoPack" width="32"
              height="32">{{ zoneData[i].ammoPack }}</span>
          <span v-if="zoneData[i].medPack > 0"><img src="../src/assets/MedPack.png" class="MedPack" width="32"
              height="32">{{ zoneData[i].medPack }}</span>
          <span v-if="zoneData[i].toolRefill > 0"><img src="../src/assets/ToolRefill.png" class="ToolRefill" width="32"
              height="32">{{ zoneData[i].toolRefill }}</span>
          <span v-if="zoneData[i].disinfectionPack > 0"><img src="../src/assets/DisinfectionPack.png"
              class="DisinfectionPack" width="32" height="32">{{ zoneData[i].disinfectionPack }}</span>
          <span v-if="zoneData[i].fogRepeller > 0"><img src="../src/assets/FogRepeller.png" class="FogRepeller"
              width="32" height="32">{{ zoneData[i].fogRepeller }}</span>
          <span v-if="zoneData[i].tripMine > 0"><img src="../src/assets/TripMine.png" class="TripMine" width="32"
              height="32">{{ zoneData[i].tripMine }}</span>
          <span v-if="zoneData[i].cTripMine > 0"><img src="../src/assets/CTripMine.png" class="CTripMine" width="32"
              height="32">{{ zoneData[i].cTripMine }}</span>
          <span v-if="zoneData[i].grenade > 0"><img src="../src/assets/Grenade.png" class="Grenade" width="32"
              height="32">{{ zoneData[i].grenade }}</span>
          <span v-if="zoneData[i].IIXSyringe > 0"><img src="../src/assets/IIXSyringe.png" class="IIXSyringe" width="32"
              height="32">{{ zoneData[i].IIXSyringe }}</span>
          <span v-if="zoneData[i].LPSyringe > 0"><img src="../src/assets/LPSyringe.png" class="LPSyringe" width="32"
              height="32">{{ zoneData[i].LPSyringe }}</span>
          <span v-if="zoneData[i].powerCell > 0"><img src="../src/assets/PowerCell.png" class="PowerCell" width="32"
              height="32">{{ zoneData[i].powerCell }}</span>
          <span v-if="zoneData[i].generator > 0"><img src="../src/assets/Generator.png" class="PowerCell" width="32"
              height="32">{{ zoneData[i].generator }}</span>
        </div>
      </div>
      <div class="panel">
        <input type="text" v-model="zoneText">
        <button @click="add(zoneText)">add zone</button>
      </div>
    </div>

    <div class="panel">

      <button @click="updateCount(0)">
        <img src="../src/assets/AmmoPack.png" class="AmmoPack" width="64" height="64">
      </button>
      <button @click="updateCount(1)">
        <img src="../src/assets/MedPack.png" class="MedPack" width="64" height="64">
      </button>
      <button @click="updateCount(2)">
        <img src="../src/assets/ToolRefill.png" class="ToolRefill" width="64" height="64">
      </button>
      <button @click="updateCount(3)">
        <img src="../src/assets/DisinfectionPack.png" class="DisinfectionPack" width="64" height="64">
      </button>
      <button @click="updateCount(4)">
        <img src="../src/assets/FogRepeller.png" width="64" height="64">
      </button>
      <button @click="updateCount(5)">
        <img src="../src/assets/TripMine.png" width="64" height="64">
      </button>
      <button @click="updateCount(6)">
        <img src="../src/assets/CTripMine.png" width="64" height="64">
      </button>
      <button @click="updateCount(7)">
        <img src="../src/assets/Grenade.png" width="64" height="64">
      </button>
      <button @click="updateCount(8)">
        <img src="../src/assets/IIXSyringe.png" class="IIXSyringe" width="64" height="64">
      </button>
      <button @click="updateCount(9)">
        <img src="../src/assets/LPSyringe.png" class="MedPack" width="64" height="64">
      </button>
      <button @click="updateCount(10)">
        <img src="../src/assets/PowerCell.png" class="PowerCell" width="64" height="64">
      </button>
      <button @click="updateCount(11)">
        <img src="../src/assets/Generator.png" class="PowerCell" width="64" height="64">
      </button>

      <div class="grid-container">
        <button @click="inc = '1'">
          <RadioButton v-model="inc" inputId="0" value="1" />
          <label for="0">add resources</label>
        </button>

        <button @click="inc = '-1'">
          <RadioButton v-model="inc" inputId="1" value="-1" />
          <label for="1">remove resources</label>
        </button>

      </div>




    </div>

  </div>

</template>

<style scoped>
.selected {
  color: coral;
}

.bulletless {
  list-style-type: none;
}

.panel {
  background-color: #1a1a1a;
  border-radius: 8px;
  border: 1px solid transparent;
  margin-top: 4px;
  padding-right: 10px;
  padding-left: 10px;
}

.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 100px;
}

.delete-button:hover {
  border-radius: 8px;
  width: auto;
  margin: 0px;
  padding: 8px;
  border-color: #ff0000;
}

.delete-button {
  border-radius: 8px;
  width: auto;
  margin: 0px;
  padding: 8px;
  border: 1px solid transparent;
  background-color: #1a1a1a;
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
</style>
