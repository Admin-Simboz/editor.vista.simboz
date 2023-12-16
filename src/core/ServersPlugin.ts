
import { v4 as uuid } from 'uuid';
import { selectFiles, clipboardText } from '@/utils/utils';
// import { clipboardText } from '@/utils/utils.ts';
import { fabric } from 'fabric';
import Editor from '../core';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { ref, Ref } from 'vue';
import eventBus from '@/components/eventBus.js';



type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

function transformText(objects) {
  if (!objects) return;
  objects.forEach((item) => {
    if (item.objects) {
      transformText(item.objects);
    } else {
      item.type === 'text' && (item.type = 'textbox');
    }
  });
}


class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'ServersPlugin';
  private hiddenButtonRef: Ref<HTMLButtonElement | null> = ref(null);
  static apis = [
    'insert',
    'insertSvgFile',
    'getJson',
    'dragAddItem',
    'clipboard',
    'saveJson',
    'saveTemplate',
    'saveSvg',
    'saveImg',
    'clear',
    'preview',
    'getUserTemplate',
  ];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.initHiddenButtonRef();
  }
  private initHiddenButtonRef() {
    // Assuming this is called within a Vue component
    // Get the reference to the hidden button
    this.hiddenButtonRef = ref(document.querySelector('#hiddenButton'));
  }


  insert() {
    selectFiles({ accept: '.json' }).then((files) => {
      const [file] = files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.insertSvgFile(reader.result);
      };
    });
  }

  insertSvgFile(jsonFile) {
    // preload hook
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      this.canvas.loadFromJSON(jsonFile, () => {
        this.canvas.renderAll();
        // post load hook
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          this.canvas.renderAll();
        });
      });
    });
  }

  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
  }

  /**
   * @description: Drag and drop to add to canvas
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }

  clipboard() {
    const jsonStr = this.getJson();
    clipboardText(JSON.stringify(jsonStr, null, '\t'));
  }

  async saveJson() {
    const dataUrl = this.getJson();
    //Convert text to textgroup so that the import can be edited
    //console.log(dataUrl);
    await transformText(dataUrl.objects);
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, 'json');
  }

  async saveTemplate() {
    let dataUrl = this.getJson(); // Assuming getJson() returns the data you need
    let jsonData = JSON.stringify(dataUrl); // Convert data to a string
  
    const option = this._getSaveOption();
    this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    const dataUrl2 = this.canvas.toDataURL(option);
  
    const formData = new FormData();
    formData.append('jsonData', jsonData);
    formData.append('image', dataUrl2);

    if (this.hiddenButtonRef.value) {
      this.hiddenButtonRef.value.click();
    }else{
      //console.log('hiddenButtonRef empty');
    }
    
    Spin.show({
      render: (h) => h('div', 'Saving Template'),
    });
    try {
     
      const response = await axios.post('https://vista.simboz.website/api/template/storeTemp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Spin.hide();
      //console.log('Server Response:', response.data);

      eventBus.emitReloadEvent();
    } 
    
    catch (error) {
      //console.error('Error:', error);
    }
  }

  
  
  async getUserTemplate (value :string){
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      let idFromURL = id; // Set idFromURL if id exists in URL
      try {
         const response = await axios.get(
          
          `https://vista.simboz.website/api/template/storeTemp/${idFromURL}/${value}`, 
        {
          headers: {
            Accept: 'application/json',
          },
        });
        Spin.hide();
        //console.log('Server Response:', response.data);
  
        eventBus.emitReloadEvent();
      } 
      
      catch (error) {
        //console.error('Error:', error);
      }
    }
  }
  
  saveSvg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveSvgOption();
      const dataUrl = this.canvas.toSVG(option);
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
      this.editor.hooksEntity.hookSaveAfter.callAsync(fileStr, () => {
        downFile(fileStr, 'svg');
      });
    });
  }

  saveImg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.toDataURL(option);
      this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
        downFile(dataUrl, 'png');
      });
    });
  }

  preview() {
    return new Promise((resolve, reject) => {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveOption();
        this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
        this.canvas.renderAll();
        const dataUrl = this.canvas.toDataURL(option);
        this.editor.hooksEntity.hookSaveAfter.callAsync(dataUrl, () => {
          resolve(dataUrl);
        });
      });
    });
  }

  _getSaveSvgOption() {
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    const { left, top, width, height } = workspace;
    return {
      width,
      height,
      viewBox: {
        x: left,
        y: top,
        width,
        height,
      },
    };
  }

  _getSaveOption() {
    const workspace = this.canvas
      .getObjects()
      .find((item: fabric.Object) => item.id === 'workspace');
    const { left, top, width, height } = workspace as fabric.Object;
    const option = {
      name: 'New Image',
      format: 'png',
      quality: 1,
      width,
      height,
      left,
      top,
    };
    return option;
  }

  clear() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj.id !== 'workspace') {
        this.canvas.remove(obj);
      }
    });
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ServersPlugin;
