import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;

class LayerPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'LayerPlugin';
  static apis = ['up', 'upTop', 'down', 'downTop'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  _getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace');
  }

  _workspaceSendToBack() {
    const workspace = this._getWorkspace();
    workspace && workspace.sendToBack();
  }

  up() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      this.canvas.renderAll();
      console.log(this);
      this._workspaceSendToBack();
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [
        {
          text: 'Layer management',
          hotkey: '❯',
          subitems: [
            {
              text: 'Move back',
              hotkey: 'key',
              onclick: () => this.up(),
            },
            {
              text: 'Move up',
              hotkey: 'key',
              onclick: () => this.down(),
            },
            {
              text: 'Front',
              hotkey: 'key',
              onclick: () => this.upTop(),
            },
            {
              text: 'Back',
              hotkey: 'key',
              onclick: () => this.downTop(),
            },
          ],
        },
      ];
      //return [{ text: 'Copy', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default LayerPlugin;
