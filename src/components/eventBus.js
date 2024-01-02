import { ref } from 'vue';

const eventBus = {
  reloadImportTmpl: ref(0),
  reloadUserUpoload: ref(0),
  // Initialize as a ref
  ReloadTemplate(value) {
    if (value === "userTemp") {
      this.reloadImportTmpl.value++;
    }
    if (value === "userUploads") {
      this.reloadUserUpoload.value++;
    }
  },
};

export default eventBus;
