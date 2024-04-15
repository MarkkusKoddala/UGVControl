<template>
  <div id="app">
    <ControlDashboard/>
  </div>
</template>

<script>

import ControlDashboard from "@/views/ControlDashboard.vue";

export default {
  name: 'App',
  components: {
    ControlDashboard
  }
};
</script>
<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

</style>