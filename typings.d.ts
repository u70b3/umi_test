/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-01-10 21:59:56
 */
declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.jpg';
declare module '*.glb';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
