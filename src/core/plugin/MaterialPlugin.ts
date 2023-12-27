import { fabric } from 'fabric'; // Importing 'fabric' module

import Editor from '../core'; // Importing Editor from '../core' module

import axios from 'axios'; // Importing Axios for making HTTP requests

// Defining a TypeScript class named MaterialPlugin
class MaterialPlugin {
  public canvas: fabric.Canvas; // Property to store a fabric canvas instance
  public editor: Editor; // Property to store an instance of the Editor class
  static pluginName = 'MaterialPlugin'; // Static property storing the plugin name
  static apis = ['getMaterialType', 'getMaterialList']; // Static property storing supported APIs
  apiMapUrl: { [propName: string]: string }; // Property defining a map of URLs

  // Constructor initializing canvas, editor, and apiMapUrl
  constructor(canvas: fabric.Canvas, editor: Editor) {
    this.canvas = canvas;
    this.editor = editor;

    // Mapping type IDs to corresponding API URLs
    this.apiMapUrl = {
      template: 'https://vista.simboz.website/api/template',
      svg: 'https://nihaojob.github.io/vue-fabric-editor-static/svg/type.json',
    };
  }

  // Async method to fetch material type data based on a type ID
  async getMaterialType(typeId: string) {
    const url = this.apiMapUrl[typeId]; // Get the corresponding URL from the map
    const res = await axios.get(url); // Make an HTTP GET request
    return res.data.data; // Return the fetched data
  }

  // Async method to fetch material information using a type ID as a query parameter
  async getMaterialInfo(typeId: string) {
    const url = this.apiMapUrl[typeId]; // Get the corresponding URL from the map
    const res = await axios.get(url, { params: { typeId } }); // Make an HTTP GET request with a query parameter
    return res.data.data; // Return the fetched data
  }
}

export default MaterialPlugin; // Exporting the MaterialPlugin class as the default export
