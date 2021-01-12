/*
 * @Descripttion: 数据接口
 * @Author: linkenzone
 * @Date: 2021-01-11 14:32:28
 */

export interface ImgRegionToolDataType {
  // 画布的大小，尺寸
  StageWidht: number;
  StageHeight: number;
  StageScale: number;

  // 图片的尺寸
  imageWidth: number;
  imageHeight: number;
  // 图片的坐标
  imageX: number;
  imageY: number;

  // 状态
  isDrawing: boolean;
  toolState: string;

  // 选区
  regions: any[];
  maxId: number;
  regionsStrokeWidth: number;
  regionsFontSize: number;
}
