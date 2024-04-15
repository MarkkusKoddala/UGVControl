<template>
  <div id="">
    <main>
      <EngineButton :engineRunning="engineRunning" @toggle-engine="toggleEngine"/>
      <MapDisplay :engineRunning="engineRunning"/>
    </main>
  </div>

</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import MapDisplay from '../components/MapDisplay.vue';
import EngineButton from '../components/EngineButton.vue';


export default defineComponent({
  components: {
    MapDisplay,
    EngineButton
  },
  setup() {
    const engineRunning = ref(false);

    const toggleEngine = (newValue: boolean) => {
      console.log(newValue)
      engineRunning.value = newValue;
    }

    return {
      engineRunning,
      toggleEngine
    };
  }
});
</script>

<style scoped>
#app {
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
