/*
 * @Descripttion: 画一个线
 * @Author: linkenzone
 * @Date: 2021-01-19 16:42:03
 */

import * as THREE from 'three';

export default class Line {
  private material: THREE.LineBasicMaterial;
  private geometry: THREE.BufferGeometry;
  private points: THREE.Vector3[];
  private _line: THREE.Line<any, any>;

  constructor() {
    // 初始化线条
    this.material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    this.points = [];
    this.points.push(new THREE.Vector3(-10, 0, 0));
    this.points.push(new THREE.Vector3(0, 10, 0));
    this.points.push(new THREE.Vector3(10, 0, 0));
    this.geometry = new THREE.BufferGeometry().setFromPoints(this.points);
    this._line = new THREE.Line(this.geometry, this.material);
  }

  get line(): THREE.Line<any, any> {
    return this._line;
  }

  public destroy() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
