/*
 * @Descripttion: 生成模型
 * @Author: linkenzone
 * @Date: 2021-01-19 16:59:29
 */

import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class GLTFModel {
  resource_URL: string;
  constructor(resource_URL: string) {
    this.resource_URL = resource_URL;
  }

  public load(scene: THREE.Scene, renderScene: () => void) {
    // Instantiate a loader
    const loader = new GLTFLoader();

    console.log('加载模型');

    // Load a glTF resource
    loader.load(
      // resource URL
      this.resource_URL,
      // called when the resource is loaded
      (gltf: any) => {
        // scene.add(gltf.scene);

        const model = gltf.scene;
        scene.add(model);

        renderScene();
      },
      // called while loading is progressing
      xhr => {
        // console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);

        console.log(xhr);

        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(`model ${Math.round(percentComplete)}% downloaded`);
        }

        // console.log(`xhr.loaded: ${xhr.loaded} , xhr.total: ${xhr.total}`);
      },
      // called when loading has errors
      error => {
        console.log(`An error happened: ${error.message}`);
      },
    );
  }
}
