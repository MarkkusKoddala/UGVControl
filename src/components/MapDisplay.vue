<template>
  <div class="map-container" tabindex="0">
    <l-map ref="mapRef" :center="initialCenter" :zoom="zoom" style="height: 100%; width: 100%"
           @mousedown="handleMouseDown"
           @mouseleave="handleMouseUp"
           @mouseup="handleMouseUp">
      <l-tile-layer :url="urlTemplate"></l-tile-layer>
      <l-marker v-for="waypoint in waypoints" :key="waypoint.id" :ref="el => addMarkerRef(el, waypoint)"
                :lat-lng="waypoint.latlng">
      </l-marker>
      <l-marker :icon="icon" :lat-lng="ugvLocation">
        <l-popup>UGV is here!</l-popup>
      </l-marker>
    </l-map>
    <WaypointsList :waypoints="savedWaypoints"
                   @delete="discardWaypoint"
                   @rename="updateWaypointName"
                   @drive-to="driveTo"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, nextTick, onMounted, onUnmounted, Ref, ref} from 'vue';
import {LMap, LMarker, LPopup, LTileLayer} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import {icon, LatLngExpression, LeafletMouseEvent} from 'leaflet';
import WaypointsList from "@/components/WaypointsList.vue";
import {UGVPoint, Waypoint} from "@/utilies/types";


export default defineComponent({
  props: {
    engineRunning: {
      type: Boolean,
      required: true
    }
  },
  components: {
    WaypointsList,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      icon: icon({
        iconUrl: require('@/assets/car2.png'),
        iconSize: [50, 50],
        iconAnchor: [25, 25],
        popupAnchor: [-3, -76]
      })
    }
  },
  setup(props) {
    const initialCenter: Ref<LatLngExpression> = ref([51.505, -0.09]);
    const zoom = ref(13);
    const urlTemplate = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const ugvLocation: Ref<UGVPoint> = ref({lat: 51.505, lng: -0.09});
    const waypoints = ref<Waypoint[]>([]);
    const savedWaypoints = ref<Waypoint[]>([]);
    let pressTimer: number | null = null;
    let openLast = false;
    const mapRefs: Ref<{ [key: number]: any }> = ref({});


    const addMarkerRef = (el: any, waypoint: Waypoint) => {
      if (el && waypoint) {
        if (waypoint.id === waypoints.value[waypoints.value.length - 1].id && openLast) {
          mapRefs.value[waypoint.id] = el;
          nextTick(() => {
            const popupContent = document.createElement('div');
            popupContent.innerHTML = createPopupContent(waypoint);
            const popupOptions = {closeOnClick: false};
            el.leafletObject.bindPopup(popupContent, popupOptions).openPopup();
            openLast = false;
            addEventListeners(waypoint.id);
          });
        }
      }
    };

    function updateWaypointName(waypointId: number, newName: string) {
      const waypointIndex = waypoints.value.findIndex(w => w.id === waypointId);
      if (waypointIndex !== -1) {
        waypoints.value[waypointIndex].name = newName;
        refreshPopup(waypoints.value[waypointIndex]);
      }
    }

    const refreshPopup = (waypoint: Waypoint) => {
      const marker = mapRefs.value[waypoint.id];
      if (marker && marker.leafletObject) {
        nextTick(() => marker.leafletObject.setPopupContent(createPopupContent(waypoint)));
      }
    };

    const handleMouseDown = (event: LeafletMouseEvent) => {
      pressTimer = setTimeout(() => addMarker(event.latlng), 300);
    };

    const handleMouseUp = () => {
      if (pressTimer) clearTimeout(pressTimer);
    };

    const addMarker = (latLng: LatLngExpression) => {
      waypoints.value.push({
        id: Date.now(), latlng: latLng, name: `Waypoint ${new Date().toLocaleTimeString()}`, editing: false
      });
      openLast = true;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        if (!props.engineRunning) {
          alert("Start the engine first!");
          return;
        }

        switch (event.key) {
          case 'ArrowUp':
            ugvLocation.value = {...ugvLocation.value, lat: ugvLocation.value.lat + 0.0001};
            break;
          case 'ArrowDown':
            ugvLocation.value = {...ugvLocation.value, lat: ugvLocation.value.lat - 0.0001};
            break;
          case 'ArrowLeft':
            ugvLocation.value = {...ugvLocation.value, lng: ugvLocation.value.lng - 0.0001};
            break;
          case 'ArrowRight':
            ugvLocation.value = {...ugvLocation.value, lng: ugvLocation.value.lng + 0.0001};
            break;
        }
      }
    };

    const driveTo = (id: number) => {
      if (!props.engineRunning) {
        alert("Start the engine first!");
        return;
      }
      const waypoint = waypoints.value.find(w => w.id === id);
      if (waypoint && waypoint.latlng) {
        if (Array.isArray(waypoint.latlng)) {
          ugvLocation.value = {...ugvLocation.value, lat: waypoint.latlng[0], lng: waypoint.latlng[1]};
        } else {
          ugvLocation.value = {...ugvLocation.value, lat: waypoint.latlng.lat, lng: waypoint.latlng.lng};
        }
      }
    };

    const saveWaypoint = (id: number) => {
      const waypoint = waypoints.value.find(w => w.id === id);
      if (waypoint) {
        if(!savedWaypoints.value.some(w => w.id === id))
          savedWaypoints.value.push(waypoint);
      }
    };

    const discardWaypoint = (id: number) => {
      waypoints.value = waypoints.value.filter(w => w.id !== id);
      savedWaypoints.value = savedWaypoints.value.filter(w => w.id !== id);

    };

    const createPopupContent = (waypoint: Waypoint): string => {
      return `
        <div>
          <p>${waypoint.name}</p>
          <button id="driveButton_${waypoint.id}">Drive</button>
          <button id="saveButton_${waypoint.id}">Save</button>
          <button id="discardButton_${waypoint.id}">Discard</button>
        </div>
      `;
    }


    const addEventListeners = (waypointId: number) => {
      nextTick(() => {
        const driveButton = document.getElementById(`driveButton_${waypointId}`);
        if (driveButton) {
          driveButton.onclick = () => driveTo(waypointId); // Changed to direct assignment
        }

        const saveButton = document.getElementById(`saveButton_${waypointId}`);
        if (saveButton) {
          saveButton.onclick = () => saveWaypoint(waypointId); // Changed to direct assignment
        }

        const discardButton = document.getElementById(`discardButton_${waypointId}`);
        if (discardButton) {
          discardButton.onclick = () => discardWaypoint(waypointId); // Changed to direct assignment
        }
      });
    };

    onMounted(() => window.addEventListener('keydown', handleKeyDown));
    onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));

    return {
      initialCenter, zoom, urlTemplate, ugvLocation, waypoints, driveTo, saveWaypoint, discardWaypoint,
      addMarker, handleMouseDown, handleMouseUp, addMarkerRef, savedWaypoints, updateWaypointName, mapRefs
    };
  }
});
</script>

<style scoped>
.map-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 100vw;
}
</style>