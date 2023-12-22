
import { v4 as uuid } from 'uuid';
import { selectFiles, clipboardText } from '@/utils/utils';
// import { clipboardText } from '@/utils/utils.ts';
import { fabric } from 'fabric';
import Editor from '../core';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { ref, Ref } from 'vue';
import eventBus from '@/components/eventBus.js';
import { sharedState } from '@/components/sharedState.js';

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
  private frontTempJson: string | undefined;
  private backTempJson: string | undefined;
  private frontSaveOptions: string = ''; // Initialize with an empty string or with a default value
  private backSaveOptions: string = '';
  private currentTemp: 'front' | 'back' = 'front';
  private sharedState:any;  
  
  
 

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
    'toggleTemplate',
    'updateValues'
  ];
  

  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor,sharedState: any) {
    this.canvas = canvas;
    this.editor = editor;
    this.initHiddenButtonRef();
    this.sharedState= sharedState;
    this.currentTemp="front";
    this.waitForSharedState();
  }


  private waitForSharedState() {
    const interval = setInterval(() => {
      // Check if sharedState values are not empty strings
      if (sharedState.front !== '' && sharedState.back !== '') {
        // Assign the values to Serve class properties
        this.frontTempJson = sharedState.front;
        this.backTempJson = sharedState.back;
        // Stop the interval as values are now available
        clearInterval(interval);
        // Proceed with further initialization or actions here
      }
    }, 500); // Adjust the interval duration as needed
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


  insertSvgFile(jsonFile:string) {
    //console.log(jsonFile); 
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

  updateValues(){
    this.frontTempJson = sharedState.front;
    //console.log(this.frontTempJson);
    this.backTempJson = sharedState.back;
  }
  
  toggleTemplate(value: 'front' | 'back') {
   // console.log('inside toggle temp');
    if (value === this.currentTemp) {
      //console.log('inside return');
      return; // Skip if the value is already the current one
    }
    if (value === 'front') {
      //console.log('inside front');
      this.backTempJson = JSON.stringify(this.getJson());
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      this.backSaveOptions = this.canvas.toDataURL(option);
      //console.log(this.frontTempJson);
      this.insertSvgFile(this.frontTempJson);
      this.currentTemp = 'front';
    }

    if (value === 'back') {
      this.frontTempJson = JSON.stringify(this.getJson());
      const option = this._getSaveOption();
      this.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      this.frontSaveOptions = this.canvas.toDataURL(option);
      //console.log(this.backTempJson);
      this.insertSvgFile(this.backTempJson);
      this.currentTemp = 'back';
    }
  }

  

  async saveTemplate() {
    let frontJson = this.frontTempJson; 
    let backJson = this.backTempJson;

    
    const formData = new FormData();
    
    formData.append('frontJsonData', frontJson);
    formData.append('backJsonData', backJson);

    
    formData.append('frontImage', this.frontSaveOptions);
    formData.append('backImage', this.backSaveOptions);

    if (this.hiddenButtonRef.value) {
      this.hiddenButtonRef.value.click();
    }else{
      //console.log('hiddenButtonRef empty');
    }
    
   /*  Spin.show({
      render: (h) => h('div', 'Saving Template'),
    }); */
    try {
     
      const response = await axios.post('https://vista.simboz.website/api/template/storeTemp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      /* Spin.hide(); */
      //console.log('Server Response:', response.data);

      eventBus.emitReloadEvent();
    } 
    
    catch (error) {
      //console.error('Error:', error);
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
        downFile(dataUrl, 'jpg');
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
