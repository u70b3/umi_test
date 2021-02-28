/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-01-23 19:38:27
 */
import { Vector2, Vector3 } from 'three';

const VolumeRenderShader1 = {
  uniforms: {
    u_size: { value: new Vector3(1, 1, 1) },
    u_renderThreshold: { value: 0.5 },
    u_clim: { value: new Vector2(1, 1) },
    u_data: { value: null },
    u_transferTexture: { value: null },
    u_transparency: { value: 120 },
    u_maxSteps: { value: 400 },
    relative_step_size: { value: 0.5 },
  },
  vertexShader: [
    '		varying vec4 v_nearpos;',
    '		varying vec4 v_farpos;',
    '		varying vec3 v_position;',

    '		mat4 inversemat(mat4 m) {',
    // Taken from https://github.com/stackgl/glsl-inverse/blob/master/index.glsl
    // This function is licenced by the MIT license to Mikola Lysenko
    '				float',
    '				a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],',
    '				a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],',
    '				a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],',
    '				a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],',

    '				b00 = a00 * a11 - a01 * a10,',
    '				b01 = a00 * a12 - a02 * a10,',
    '				b02 = a00 * a13 - a03 * a10,',
    '				b03 = a01 * a12 - a02 * a11,',
    '				b04 = a01 * a13 - a03 * a11,',
    '				b05 = a02 * a13 - a03 * a12,',
    '				b06 = a20 * a31 - a21 * a30,',
    '				b07 = a20 * a32 - a22 * a30,',
    '				b08 = a20 * a33 - a23 * a30,',
    '				b09 = a21 * a32 - a22 * a31,',
    '				b10 = a21 * a33 - a23 * a31,',
    '				b11 = a22 * a33 - a23 * a32,',

    '				det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;',

    '		return mat4(',
    '				a11 * b11 - a12 * b10 + a13 * b09,',
    '				a02 * b10 - a01 * b11 - a03 * b09,',
    '				a31 * b05 - a32 * b04 + a33 * b03,',
    '				a22 * b04 - a21 * b05 - a23 * b03,',
    '				a12 * b08 - a10 * b11 - a13 * b07,',
    '				a00 * b11 - a02 * b08 + a03 * b07,',
    '				a32 * b02 - a30 * b05 - a33 * b01,',
    '				a20 * b05 - a22 * b02 + a23 * b01,',
    '				a10 * b10 - a11 * b08 + a13 * b06,',
    '				a01 * b08 - a00 * b10 - a03 * b06,',
    '				a30 * b04 - a31 * b02 + a33 * b00,',
    '				a21 * b02 - a20 * b04 - a23 * b00,',
    '				a11 * b07 - a10 * b09 - a12 * b06,',
    '				a00 * b09 - a01 * b07 + a02 * b06,',
    '				a31 * b01 - a30 * b03 - a32 * b00,',
    '				a20 * b03 - a21 * b01 + a22 * b00) / det;',
    '		}',

    '		void main() {',
    // Prepare transforms to map to "camera view". See also:
    // https://threejs.org/docs/#api/zh/renderers/webgl/WebGLProgram
    // 需要视图变换
    '				mat4 viewtransformf = viewMatrix;',
    '				mat4 viewtransformi = inversemat(viewMatrix);',

    // Project local vertex coordinate to camera position. Then do a step
    // backward (in cam coords) to the near clipping plane, and project back. Do
    // the same for the far clipping plane. This gives us all the information we
    // need to calculate the ray and truncate it to the viewing cone.
    // 将局部顶点坐标投影到相机位置。 然后向后（在相机坐标）向近裁剪平面后退一步，
    // 然后向后投影。 对远裁剪平面执行相同的操作。 这为我们提供了计算射线并将其截断到视锥所需的所有信息。
    '				vec4 position4 = vec4(position, 1.0);',
    '				vec4 pos_in_cam = viewtransformf * position4;',

    // Intersection of ray and near clipping plane (z = -1 in clip coords)
    '				pos_in_cam.z = -pos_in_cam.w;',
    '				v_nearpos = viewtransformi * pos_in_cam;',

    // Intersection of ray and far clipping plane (z = +1 in clip coords)
    '				pos_in_cam.z = pos_in_cam.w;',
    '				v_farpos = viewtransformi * pos_in_cam;',

    // Set varyings and output pos
    '				v_position = position;',
    '				gl_Position = projectionMatrix * viewMatrix * modelMatrix * position4;',
    '		}',
  ].join('\n'),
  fragmentShader: [
    '		precision highp float;',
    '		precision mediump sampler3D;',

    '		uniform vec3 u_size;',
    '		uniform float u_renderThreshold;',
    '		uniform float u_transparency;',
    '		uniform vec2 u_clim;',
    '		uniform int u_maxSteps;',
    '		uniform sampler3D u_data;',
    '		uniform sampler2D u_transferTexture;',
    '		uniform float relative_step_size;',

    '		varying vec3 v_position;',
    '		varying vec4 v_nearpos;',
    '		varying vec4 v_farpos;',

    '		const int MAX_STEPS = 400;',
    '		const int REFINEMENT_STEPS = 4;',

    '		void rayCast(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray);',

    '		vec4 sample4(vec3 texcoords);',
    '		vec4 add_lighting(float val, vec3 loc, vec3 step, vec3 view_ray);',

    '		void main() {',
    // Normalize clipping plane info
    '				vec3 farpos = v_farpos.xyz / v_farpos.w;',
    '				vec3 nearpos = v_nearpos.xyz / v_nearpos.w;',

    // Calculate unit vector pointing in the view direction through this fragment.
    '				vec3 view_ray = normalize(nearpos.xyz - farpos.xyz);',

    // Compute the (negative) distance to the front surface or near clipping plane.
    // v_position is the back face of the cuboid, so the initial distance calculated in the dot
    // product below is the distance from near clip plane to the back of the cuboid
    // 计算到前表面或剪切平面附近的（负）距离。 v_position是长方体的背面，
    // 因此在下面的点积中计算的初始距离是从近裁剪平面到长方体背面的距离
    '				float distance = dot(nearpos - v_position, view_ray);',

    // 前向面投射起点
    '				vec3 front = v_position + view_ray * distance;',

    // 步数决定
    '				int nsteps = int(-distance / relative_step_size + 0.5);',
    '				if ( nsteps < 1 )',
    '						discard;',

    // Get starting location and step vector in texture coordinates
    '				vec3 step = ((v_position - front) / u_size) / float(nsteps);',
    '				vec3 start_loc = front / u_size;',

    // For testing: show the number of steps. This helps to establish
    // whether the rays are correctly oriented
    // 测试：显示步骤数。 这有助于确定射线是否正确定向
    // 'gl_FragColor = vec4(0.0, 0.0, 0.0, float(nsteps) / 1.0 / u_size.x);',
    // 'return;',
    '				rayCast(start_loc, step, nsteps, view_ray);',

    '				if (gl_FragColor.a < 0.05)',
    '						discard;',
    '		}',

    // 从3D纹理采样，假设是一个强度值（计算的数据全部存在红轴r上）
    // TODO:加上了传递函数的采样
    '		vec4 sample4(vec3 texcoords) {',
    '				float val = texture(u_data, texcoords.xyz).r;',
    // TODO:调整颜色阈值
    '				val = (val - u_clim[0]) / (u_clim[1] - u_clim[0]);',
    '				val = clamp(val,0.0,1.0);',
    '				vec4 color = texture(u_transferTexture, vec2(0,val));',
    '				color.a = color.a / u_transparency;',
    '				return color;',
    '		}',

    // TODO：核心方法
    '		void rayCast(vec3 start_loc, vec3 step, int nsteps, vec3 view_ray) {',

    '				float max_val = -1e6;',
    '				int max_i = 100;',
    '				vec3 loc = start_loc;',
    '				vec4 dst = vec4(0.0, 0.0, 0.0, 0.0);',
    '				vec4 src;',
    '				int iter;',

    '				for (iter=0; iter<u_maxSteps; iter++) {',
    '					if (iter >= nsteps)',
    '							break;',
    // Sample from the 3D texture
    '					src = sample4(loc);',
    '					dst.rgb = dst.rgb + (1.0 - dst.a) * src.rgb;',
    '					dst.a = dst.a + (1.0 - dst.a) * src.a;',
    '					if(dst.a > u_renderThreshold)break;',
    // Advance location deeper into the volume
    '					loc += step;',
    '				}',

    // Refine location, gives crispier images
    // TODO:优化位置，使图像更清晰？
    '				vec3 iloc = start_loc + step * (float(max_i) - 0.5);',
    '				vec3 istep = step / float(REFINEMENT_STEPS);',
    '				for (int i=0; i<REFINEMENT_STEPS; i++) {',
    '						float a1 = dst.a,a2 = sample4(iloc).a;',
    '						float r1 = a1,r2 = a2;',
    '						dst.a=(a1*r1+a2*r2)/(r1+r2);',
    '						//dst.a = dst.a / (sample4(iloc).a + dst.a);',
    '						iloc += istep;',
    '				}',
    // TODO:去除错误光照
    '				dst.a = 1.0;',
    // TODO:输出最终颜色
    '				gl_FragColor = dst;',
    '		}',
    // ——————
    // end of mip
    // ——————
  ].join('\n'),
};

export { VolumeRenderShader1 };
