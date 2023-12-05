<template>
    <button ref="myButton" @click="buttonClick">Click me</button>
  </template>
  
  <script>
  export default {
    methods: {
      buttonClick() {
        //console.log('Button clicked!');
      },
      emitClickEvent() {
        this.$emit('external-click');
      }
    }
  };
  </script>
  