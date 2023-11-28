// Import necessary modules and types

// EventEmitter is a built-in module in Node.js that allows the creation of event-driven architectures
import EventEmitter from 'events';

// 'fabric' is a powerful JavaScript library used for working with HTML5 canvas elements.
// It provides a way to create and manipulate graphical objects on a canvas.
import { fabric } from 'fabric';

// Importing the Canvas type from the 'fabric' library specific to the project implementation
import { Canvas } from 'fabric/fabric-impl';

// Importing custom event types for canvas events
import { SelectEvent } from '@/utils/event/types';

/**
 * Custom event emitter for canvas events
 */
class CanvasEventEmitter extends EventEmitter {
  // Property to hold the canvas handler
  handler: Canvas | undefined;

  // Property to store the current selection mode
  mSelectMode = '';

  /**
   * Initialize the canvas event emitter with the canvas handler
   * @param handler Canvas handler to be initialized
   */
  init(handler: CanvasEventEmitter['handler']) {
    // Assign the provided canvas handler to the class property
    this.handler = handler;

    // Check if the canvas handler is available
    if (this.handler) {
      // Listen for different selection events on the canvas
      this.handler.on('selection:created', () => this.selected());
      this.handler.on('selection:updated', () => this.selected());
      this.handler.on('selection:cleared', () => this.selected());
    }
  }

  /**
   * Handle canvas selection events
   */
  private selected() {
    // Check if the canvas handler is not initialized
    if (!this.handler) {
      throw TypeError('Canvas handler not initialized');
    }

    // Get active objects on the canvas and filter out guide lines
    const actives = this.handler
      .getActiveObjects()
      .filter((item) => !(item instanceof fabric.GuideLine));

    // Check the number of active objects
    if (actives && actives.length === 1) {
      // Emit event for single object selection
      this.emit(SelectEvent.ONE, actives);
    } else if (actives && actives.length > 1) {
      // Set selection mode and emit event for multiple object selection
      this.mSelectMode = 'multiple';
      this.emit(SelectEvent.MULTI, actives);
    } else {
      // Emit event when selection is canceled (no objects selected)
      this.emit(SelectEvent.CANCEL);
    }
  }
}

// Export a new instance of the CanvasEventEmitter
export default new CanvasEventEmitter();
// Export the CanvasEventEmitter class for external usage
export { CanvasEventEmitter };
