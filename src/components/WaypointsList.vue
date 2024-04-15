<template>
  <div class="waypoints-list">
    <ul>
      <li v-for="waypoint in waypoints" :key="waypoint.id" class="waypoint-item">
        <div v-if="!waypoint.editing" class="waypoint-content" @click="toggleWaypoint(waypoint.id)">
          <span class="waypoint-name">{{ waypoint.name }}</span>
          <div v-if="waypoint.id == activeWaypointId" class="button-group">
            <button @click="$emit('drive-to', waypoint.id)">Drive</button>
            <button @click="enableEditing(waypoint)">Rename</button>
            <button @click="$emit('delete', waypoint.id)">Delete</button>
          </div>
        </div>
        <div v-else class="waypoint-edit">
          <input v-model="waypoint.name"
                 autofocus
                 class="waypoint-input"
                 type="text"/>
          <button @click="saveChanges(waypoint)">Save</button>
        </div>
      </li>
    </ul>
  </div>
</template>


<script lang="ts">
import {defineComponent, PropType, ref} from 'vue';
import {Waypoint} from "@/utilies/types";

export default defineComponent({
  props: {
    waypoints: {
      type: Array as PropType<Waypoint[]>,
      required: true
    }
  },
  emits: ['delete', 'drive-to', 'rename'],
  setup(props, {emit}) {
    const activeWaypointId = ref<number | null>(null);

    const enableEditing = (waypoint: Waypoint) => {
      waypoint.editing = true;
    };

    function toggleWaypoint(id: number) {
      activeWaypointId.value = activeWaypointId.value === id ? null : id;
    }

    function saveChanges(waypoint: Waypoint) {
      emit('rename', waypoint.id, waypoint.name);
      waypoint.editing = false;
    }

    return {
      activeWaypointId,
      toggleWaypoint,
      saveChanges,
      enableEditing
    }
  }
});
</script>


<style>
.waypoints-list {
  position: absolute;
  bottom: 10px;
  right: 10px;
  max-height: 80vh;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 10px;
  width: 320px;
  z-index: 1000;
}

.waypoints-list ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.waypoint-item:hover, .waypoint-item:focus {
  background-color: #e9ecef; /* Light gray background on hover/focus */
  outline: none; /* Remove focus outline */
}

.waypoint-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  cursor: pointer;
}

.waypoint-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;
}

.waypoint-name {
  flex-grow: 1;
  margin-right: 10px;
}

.button-group {
  display: flex;
  gap: 5px;
}

.button-group button, .waypoint-edit button {
  background: gray;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.waypoint-input {
  flex-grow: 1;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.waypoint-edit {
  display: flex;
  align-items: center;
  width: 100%;
}


</style>
