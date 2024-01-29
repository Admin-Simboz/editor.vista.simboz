
import { v4 as uuid } from 'uuid';
import { selectFiles, clipboardText } from '@/utils/utils';
// import { clipboardText } from '@/utils/utils.ts';
import { fabric } from 'fabric';
import Editor from '../core';
import axios,{ AxiosResponse } from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { ref, Ref } from 'vue';
import eventBus from '@/components/eventBus.js';
import { sharedState } from '@/components/sharedState.js';
import { useStore } from 'vuex';




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

  private store = useStore();
  private apiToken= ref(this.store.state.token);
  private product_id= ref(this.store.state.product_id);
  private userId= ref(this.store.state.userId);
  private template_width= ref(this.store.state.template_width);
  private template_height= ref(this.store.state.template_height);
  private role= ref(this.store.state.role);

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
    'waitForSharedState',
    'getUserUploads',
    'uploadImage',
    'insertSvgString',
    'saveExit',
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
        this.currentTemp = sharedState.position;
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

  insertSvgString (svgString: string) {
    fabric.loadSVGFromString(svgString, (objects, options) => {
        const item = fabric.util.groupSVGElements(objects, {
            ...options,
            name: 'SVG  ',
            id: uuid(),
        });
        
        this.canvas.add(item)
        this.canvas.renderAll();
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

  toggleTemplate(value: 'front' | 'back') {
    
   // console.log('inside toggle temp');
    if (value === this.currentTemp) {
      //console.log('inside return');
      return; // Skip if the value is already the current one
    }
    if (value === 'front') {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveSvgOption();
        this.backSaveOptions = this.canvas.toSVG(option);
        
      });
      
      //console.log(this.frontSaveOptions);
      
      //console.log(this.frontSaveOptions);
      this.insertSvgString(this.frontSaveOptions);
      this.currentTemp = 'front';
    }

    if (value === 'back') {
      this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
        const option = this._getSaveSvgOption();
        this.frontSaveOptions = this.canvas.toSVG(option);
      });
      //console.log(this.backSaveOptions);
      
      this.insertSvgString(this.backSaveOptions);
      
      this.currentTemp = 'back';
    }
  }

  async saveExit(){
    let frontJson = this.frontTempJson; 
    let backJson = this.backTempJson;
    const formData = new FormData();
    
    /* formData.append('frontJsonData', frontJson);
    formData.append('backJsonData', backJson); */

    
    formData.append('frontImage', this.frontSaveOptions);
    formData.append('backImage', this.backSaveOptions);
    formData.append('userId', String(this.userId));
    formData.append('product_id', String(this.product_id));
    formData.append('templateHeight', String(this.template_height));
    formData.append('templateWidth', String(this.template_width));
    formData.append('role', String(this.role));
 

    if (this.hiddenButtonRef.value) {
      this.hiddenButtonRef.value.click();
    }else{
      //console.log('hiddenButtonRef empty');
    }
   

   /*   Spin.show({
      render: (h) => h('div', 'Saving Template'),
    });  */
    try {
      
      const response = await axios.post(`http://127.0.0.1:8000/api/template/saveExit/`, formData, {
        
      headers: {
          'Content-Type': 'application/json', // Set appropriate content type
          'Authorization': `Bearer ${this.apiToken.value}`,
        }
      }).then(response => { 
        console.log('Data sent successfully:', response.data);

        // Redirect to Laravel home page
        window.location.href = '/';
      });
     /*   Spin.hide(); 
      //console.log('Server Response:', response.data);
 */
      eventBus.ReloadTemplate("userTemp");
    } 
    
    catch (error) {
      //console.error('Error:', error);
    }
  }

  async saveTemplate() {
    let frontJson = this.frontTempJson; 
    let backJson = this.backTempJson;
    const formData = new FormData();
    
    /* formData.append('frontJsonData', frontJson);
    formData.append('backJsonData', backJson); */

    
    formData.append('frontImage', this.frontSaveOptions);
    formData.append('backImage', this.backSaveOptions);

    if (this.hiddenButtonRef.value) {
      this.hiddenButtonRef.value.click();
    }else{
      //console.log('hiddenButtonRef empty');
    }
   

   /*   Spin.show({
      render: (h) => h('div', 'Saving Template'),
    });  */
    try {
      
      const response = await axios.post('http://127.0.0.1:8000/api/template/storeTemp', formData, {
        headers: {
          'Content-Type': 'application/json', // Set appropriate content type
          'Authorization': `Bearer ${this.apiToken.value}`,
        },
      });
     /*   Spin.hide(); 
      //console.log('Server Response:', response.data);
 */
      eventBus.ReloadTemplate("userTemp");
    } 
    
    catch (error) {
      //console.error('Error:', error);
    }
  }

  
  
  saveSvg() {
    this.editor.hooksEntity.hookSaveBefore.callAsync('', () => {
      const option = this._getSaveSvgOption();
      const dataUrl = this.canvas.toSVG(option);
      //console.log(dataUrl);
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

  //get the urls for the user uploaded images 

  


  async getUserUploads(id: number): Promise<any[]> {
    try {
      axios.defaults.headers.common['X-CSRF-TOKEN'] = this.apiToken;
  
      const response: AxiosResponse<any> = await axios.get(` /api/template/loadUserImages/${id}`);
  
      // Check if the response is successful (status code 200)
      if (response.status === 200) {
        // Extract the 'data' property from the Axios response
        const data = response.data.data;
        
        // Reload the div containing images
        eventBus.ReloadTemplate("userUploads");
  
        // Hide the loading spinner
        Spin.hide();
  
        return data; // Assuming response.data is an object with a 'data' property holding the array
      } else {
        // Handle other response status codes if needed
        // console.error('Non-200 status code:', response.status);
        return []; // or throw an error or return a specific value
      }
    } catch (error) {
      // Handle error, throw, or return a specific value if needed
      // console.error('Error:', error);
      return []; // or throw an error or return a specific value
    }
  }

async uploadImage(file: string, name: string) {

  const formData = new FormData();
  formData.append('image', file);
  formData.append('user_id', '12');

  /* Spin.show({
      render: (h) => h('div', 'Uploading...'),
  }); */

  try {
      const response = await axios.post('http://127.0.0.1:8000/template/uploadImage', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${this.apiToken.value}`,
          },
      });

      eventBus.ReloadTemplate("userUploads");
      /* Spin.hide(); */
      // Handle the response if needed
  } catch (error) {
     // console.error('Error:', error);
      // Handle error, throw, or return a specific value if needed
  }
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
      format: 'svg',
      quality: 1,
      /* width:3072,
      height:6912, */
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
    //console.log('pluginDestroy');
  }
}

export default ServersPlugin;
