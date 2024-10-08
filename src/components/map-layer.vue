<template>
  <ol-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="height: 100vh; width: 100vw;"
  >
    <ol-view
      ref="view"
      :center="[-23.01, -45.53]"
      :zoom="11"
      projection="EPSG:4326"
    />
    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>

    <ol-vector-layer>
      <ol-source-vector>
        <ol-feature>
          <ol-geom-point :coordinates="[-23.01, -45.53]"></ol-geom-point>
          <ol-style>
            <ol-style-text
              :text="String.fromCodePoint(0xf041)"
              font="900 18px 'Font Awesome 5 Free'"
              textBaseline="bottom"
            >
              <ol-style-fill color="red" />
            </ol-style-text>
          </ol-style>
        </ol-feature>
      </ol-source-vector>
    </ol-vector-layer>
  </ol-map>
</template>

<script setup lang="ts">
</script>
