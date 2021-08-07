<template>
  <aside class="column">
    <div class="grid">
      <h2>Choose a file:</h2>
      <input type="file" id="obj-file" @change="$emit('upload', $event)" />
      <div class="file-options">
        <label>
          <input type="radio" name="file" />
          Cube
        </label>
        <button>-></button>
        <label>
          <input type="radio" name="file" />
          Lighted cube
        </label>
        <button>-></button>
        <label>
          <input type="radio" name="file" />
          Pyramid
        </label>
        <button>-></button>
        <label>
          <input type="radio" name="file" />
          Teapot
        </label>
        <button>-></button>
      </div>
    </div>
    <div>
      <div class="grid">
        <h2>Controls:</h2>
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
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.grid {
  text-align: left;
  justify-items: center;
  display: grid;
}

.column {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-content: center;
}

.file-options {
  display: grid;
  grid-template-columns: auto auto;
  gap: 5px 15px;
}
</style>
