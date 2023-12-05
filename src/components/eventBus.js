import { ref } from 'vue';

const eventBus = {
  reloadImportTmpl: ref(0), // Initialize as a ref
  emitReloadEvent() {
    this.reloadImportTmpl.value++; // Increment the value
  },
};

export default eventBus;
