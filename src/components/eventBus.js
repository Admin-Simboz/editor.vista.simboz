import { ref } from 'vue';

const eventBus = {
  reloadImportTmpl: ref(0),
  // Initialize as a ref
  ReloadTemplate(value) {
    if (value === "userTemp") {
      this.reloadImportTmpl.value = "userTemp";
    }
    if (value === "userUploads") {
      this.reloadImportTmpl.value = "userUploads";
    }
  },
};

export default eventBus;
