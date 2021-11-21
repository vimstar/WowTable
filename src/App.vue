<template>
  <div id="app">
    <WowTableDemo/>
  </div>
</template>

<script>
import WowTableDemo from './components/WowTableDemo.vue'

export default {
  name: 'App',
  components: {
    WowTableDemo
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
