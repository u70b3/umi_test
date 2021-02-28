import React, { useEffect, useState, useRef } from 'react';

import * as THREE from 'three';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import GLTFModel from './GLTFModel';

import style from './style.less';

import Line from './Line';

const BaseDemo: React.FC<null> = () => {
  const mount: any = useRef(null);

  const [isAnimating, setAnimating] = useState(true);

  const controls: any = useRef(null);

  // 创建性能监视器
  const stats = Stats();

  useEffect(() => {
    let frameId: any;
    const mountIns = mount.current;
    // 获取渲染窗口的长和宽
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    // 建立场景、相机和渲染器
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const camera = new THREE.PerspectiveCamera(
      75, // 视野角度（FOV）
      width / height, // 长宽比（aspect ratio）
      0.1, // 近截面（near）
      1000, // 远截面（far）
    );
    camera.position.set(1, 2, -3);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = -2;
    dirLight.shadow.camera.left = -2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 40;
    scene.add(dirLight);

    // controls
    // Orbit controls（轨道控制器）可以使得相机围绕目标进行轨道运动。

    const _orbitControls = new OrbitControls(camera, renderer.domElement);
    _orbitControls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    _orbitControls.dampingFactor = 0.05;
    _orbitControls.screenSpacePanning = false;
    _orbitControls.minDistance = 0;
    _orbitControls.maxDistance = 500;
    _orbitControls.maxPolarAngle = Math.PI;

    // const line_01 = new Line();
    // scene.add(line_01.line);

    // 渲染场景
    const renderScene = () => {
      renderer.render(scene, camera);
    };

    // 动画循环
    const animate = () => {
      renderScene();
      stats.update();
      frameId = window.requestAnimationFrame(animate);
    };
    // 开始渲染
    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const Model_01 = new GLTFModel('/GLTFModels/Soldier.glb');
    Model_01.load(scene, animate);

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderScene();
    };

    // 结束渲染
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    };

    window.addEventListener('resize', handleResize);
    mount.current.appendChild(renderer.domElement);

    stats.domElement.style.position = 'absolute';
    mount.current.appendChild(stats.dom);
    start();

    controls.current = { start, stop };

    return () => {
      stop();
      window.removeEventListener('resize', handleResize);
      mountIns.removeChild(renderer.domElement);

      // scene.remove(line_01.line);
      // line_01.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAnimating) {
      controls.current.start();
    } else {
      controls.current.stop();
    }
  }, [isAnimating]);

  return (
    <>
      <div className={style.info}>绘制一个模型</div>
      <div
        className={style.vis}
        ref={mount}
        onClick={() => {
          setAnimating(!isAnimating);
        }}
      />
    </>
  );
};

export default BaseDemo;
