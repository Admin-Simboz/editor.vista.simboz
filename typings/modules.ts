/*
 * @Description: Declarations for node modules.
 */

declare module 'view-ui-plus/dist/locale/zh-CN';
declare module 'view-ui-plus/dist/locale/en-US';

declare module '@/components/eventBus.js' {
    // Define the module structure if needed
    // For example:
    const eventBus: {
      // Your module structure
      reloadImportTmpl: boolean;
      emitReloadEvent: () => void;
      // ...other properties or methods
    };
    export default eventBus;
  }
