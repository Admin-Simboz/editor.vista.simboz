import { ref } from 'vue';

const eventBus = {
  reloadImportTmpl: ref(0),
  reloadUserUploadTmpl: ref(0), // Initialize as a ref
  ReloadTemplate() {
    this.reloadImportTmpl.value++; // Increment the value
  },
  ReloadUserImages() {
    this.reloadUserUploadTmpl.value++; // Increment the value
  },
};

export default eventBus;
