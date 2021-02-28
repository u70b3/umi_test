/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-01-21 14:00:09
 */
import { GUI } from 'dat.gui';
import React, { useEffect, useState, useRef } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Stats from 'three/examples/jsm/libs/stats.module.js';

import { PetLoader } from './util/PetLoader';

import { TransferFunction, TransferFunctionAlpha } from './util/transferFunctions';

import { VolumeRenderShader1 } from './util/VolumeShader';

import style from './style.less';

const VolumeDemo: React.FC<null> = () => {
  const mount: any = useRef(null);

  // const controls: any = useRef(null);

  const [scene, setScene] = useState(new THREE.Scene());

  // const [material, setMaterial] = useState<THREE.ShaderMaterial>();

  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer());

  // 创建性能监视器
  const stats = Stats();

  useEffect(() => {
    let material: THREE.ShaderMaterial;
    const mountIns = mount.current;
    // 获取渲染窗口的长和宽
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    let aspect = width / height;

    // 创建 scene
    // const scene = new THREE.Scene();

    // 创建 renderer
    renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比例
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1.0); // 0x000000,0xFFFFFF
    setRenderer(renderer);
    mount.current.appendChild(renderer.domElement);

    // 创建 camera
    const h = 400; // frustum height
    const camera = new THREE.OrthographicCamera(
      (-h * aspect) / 2,
      (h * aspect) / 2,
      h / 2,
      -h / 2,
      0.1, // 近截面（near）
      1000, // 远截面（far）
    );
    camera.position.set(0, 0, 0);
    camera.up.set(0, 1, 0);

    const render = () => {
      renderer.render(scene, camera);
      stats.update();
    };

    // 动画循环
    const animate = () => {
      // Render loop
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      requestAnimationFrame(animate);
      render();
    };

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    // 物体中心
    controls.target.set(80, 80, 100);
    controls.minZoom = 0.05;
    controls.maxZoom = 500;
    controls.update();

    // 调试GUI
    const volconfig = {
      clim1: 0.0,
      clim2: 1.0,
      renderThreshold: 1.0,
      transparency: 80,
      maxSteps: 400,
      relativeStepSize: 0.5,
    };
    const updateUniforms = () => {
      if (material) {
        material.uniforms.u_clim.value.set(volconfig.clim1, volconfig.clim2);
        material.uniforms.u_renderThreshold.value = volconfig.renderThreshold;
        material.uniforms.u_transparency.value = volconfig.transparency;
        material.uniforms.u_maxSteps.value = volconfig.maxSteps;
        material.uniforms.relative_step_size.value = volconfig.relativeStepSize;
      }
      renderer.render(scene, camera);
    };
    const gui = new GUI();
    gui.add(volconfig, 'clim1', 0, 1, 0.001).onChange(updateUniforms);
    gui.add(volconfig, 'clim2', 0, 2, 0.001).onChange(updateUniforms);
    gui.add(volconfig, 'renderThreshold', 0, 1, 0.001).onChange(updateUniforms);
    gui.add(volconfig, 'transparency', 1, 400, 1).onChange(updateUniforms);
    gui.add(volconfig, 'maxSteps', 0, 2000, 1).onChange(updateUniforms);
    gui.add(volconfig, 'relativeStepSize', 0.1, 1, 0.001).onChange(updateUniforms);
    gui.domElement.style.marginTop = '72px';

    new PetLoader().load('/pet_raw.bytes', volume => {
      volume.erodeData();
      const maxCoord = Math.max(Math.max(volume.xLength, volume.yLength), volume.zLength);
      const texture = new THREE.DataTexture3D(
        volume.data,
        volume.xLength,
        volume.yLength,
        volume.zLength,
      );
      texture.format = THREE.RedFormat;
      texture.type = THREE.FloatType;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.repeat.set(0, 0);
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      // texture.wrapR = THREE.ClampToEdgeWrapping;
      texture.unpackAlignment = 1;

      const size = 256;
      const data = new Float32Array(4 * size);
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < size; i++) {
        const stride = i * 4;
        const r = TransferFunction(i, 'r');
        const g = TransferFunction(i, 'g');
        const b = TransferFunction(i, 'b');
        const a = TransferFunctionAlpha(i);
        data[stride] = r;
        data[stride + 1] = g;
        data[stride + 2] = b;
        data[stride + 3] = a;
      }
      const transferTexture = new THREE.DataTexture(
        data,
        1,
        size,
        THREE.RGBAFormat,
        THREE.FloatType,
      );
      // 材质
      const shader = VolumeRenderShader1;
      // 全局uniform
      const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

      uniforms.u_data.value = texture;
      uniforms.u_transferTexture.value = transferTexture;
      uniforms.u_size.value.set(volume.xLength, volume.yLength, volume.zLength);
      uniforms.u_clim.value.set(volconfig.clim1, volconfig.clim2);
      uniforms.u_renderThreshold.value = volconfig.renderThreshold;
      uniforms.u_transparency.value = volconfig.transparency;
      uniforms.u_maxSteps.value = volconfig.maxSteps;
      uniforms.relative_step_size.value = volconfig.relativeStepSize;

      material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        side: THREE.BackSide, // The volume shader uses the backface as its "reference point"
      });

      // THREE.Mesh
      const geometry = new THREE.BoxBufferGeometry(volume.xLength, volume.yLength, volume.zLength);
      // var geometry = new THREE.BoxBufferGeometry( maxCoord, maxCoord, maxCoord );
      // 这里转换了坐标
      geometry.translate(
        volume.xLength / 2 - 0.5,
        volume.yLength / 2 - 0.5,
        volume.zLength / 2 - 0.5,
      );

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      render();
    });

    // 设定性能监视器
    stats.domElement.style.position = 'absolute';
    mount.current.appendChild(stats.dom);

    /**
     * @description: 重置渲染窗口的尺寸
     */
    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      aspect = width / height;
      // camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    animate();

    // controls.current = { start, stop };

    return () => {
      window.removeEventListener('resize', handleResize);
      mountIns.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={style.info}>绘制小鼠模型</div>
      <div
        className={style.vis}
        ref={mount}
        // onClick={() => {
        //   setAnimating(!isAnimating);
        // }}
      />
    </>
  );
};

export default VolumeDemo;
