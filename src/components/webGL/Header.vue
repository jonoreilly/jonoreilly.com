<template>
  <header>
    <h1>This is my WebGL project</h1>
    <p>By Jon O'Reilly</p>
    <input type="file" id="obj-file" @change="$emit('upload', $event)" />
  </header>
</template>
