<template>
  <button @click="toggleEngine">
    {{ engineRunning ? 'Stop Engine' : 'Start Engine' }}
  </button>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

export default defineComponent({
  props: {
    engineRunning: {
      type: Boolean as PropType<boolean>,
      required: true
    }
  },
  emits: ['toggleEngine'],
  setup(props, {emit}) {
    const toggleEngine = () => {
      emit('toggleEngine', !props.engineRunning);
    };

    return {toggleEngine};
  }
});
</script>

<style scoped>
button {
  position: fixed;
  top: 20px;
  right: 20px;
  border: 2px solid black;
  background-color: gray;
  padding: 10px 20px;
  cursor: pointer;
  opacity: 0.8;
  color: white;
  outline: none;
  z-index: 1000;
}

button:hover {
  opacity: 0.9;
}
</style>
