<template>
  <footer>
    <h2 style="margin: 0px">Controls:</h2>
    <div class="controls">
      <ul>
        <li>Arrow keys to move</li>
        <li>
          To rotate:
          <ul>
            <li>W/S for Y axis</li>
            <li>A/D for X axis</li>
            <li>Q/E for Z axis</li>
          </ul>
        </li>
        <li>I/O to scale</li>
      </ul>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.controls {
  text-align: left;
  justify-items: center;
  display: grid;
}
</style>
