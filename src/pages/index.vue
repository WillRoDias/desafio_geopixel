<template>
  <div class="maplayer">
    <MapLayer/>
  </div>
  <div class="sidebar">
    <SideBar/>
  </div>
</template>

<script setup lang="ts">
import MapLayer from '../components/map-layer.vue'
import SideBar from '../components/sidebar.vue'
</script>

<style scoped lang="scss">
.sidebar {
  position: absolute;

  @media (max-width: 600px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
  }
}

.maplayer{
  position: absolute;
  height: 100vh;
  width: 100vw;
}

</style>
