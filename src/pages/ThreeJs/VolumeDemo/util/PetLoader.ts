/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable default-case */
/*
 * @Descripttion: Do not edit
 * @Author: linkenzone
 * @Date: 2021-01-21 14:00:23
 */

import { FileLoader, Loader, Matrix4, Vector3 } from 'three';
import { Volume } from './Volume.js';

let PetLoader = function(manager) {
  Loader.call(this, manager);
};

PetLoader.prototype = Object.assign(Object.create(Loader.prototype), {
  constructor: PetLoader,

  load: function(url, onLoad, onProgress, onError) {
    var scope = this;

    var loader = new FileLoader(scope.manager);
    loader.setPath(scope.path);
    loader.setResponseType('arraybuffer');
    loader.load(
      url,
      function(data) {
        onLoad(scope.parse(data));
      },
      onProgress,
      onError,
    );
  },

  parse: function(data) {
    var _data = data;
    var _dataPointer = 0;
    var _nativeLittleEndian = new Int8Array(new Int16Array([1]).buffer)[0] > 0;
    var _littleEndian = true;
    var headerObject = {};

    function scan(type, chunks) {
      if (chunks === undefined || chunks === null) {
        chunks = 1;
      }
      var _chunkSize = 1;
      var _array_type = Uint8Array;

      switch (type) {
        case 'float':
          _array_type = Float32Array;
          _chunkSize = 8;
          break;
      }
      var _bytes = new _array_type(
        _data.slice(_dataPointer, (_dataPointer += chunks * _chunkSize)),
      );
      if (_nativeLittleEndian !== _littleEndian) {
        _bytes = flipEndianness(_bytes, _chunkSize);
      }
      if (chunks === 1) {
        return _bytes[0];
      }
      return _bytes;
    }

    //Flips typed array endianness in-place. Based on https://github.com/kig/DataStream.js/blob/master/DataStream.js.
    function flipEndianness(array, chunkSize) {
      var u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      for (var i = 0; i < array.byteLength; i += chunkSize) {
        for (var j = i + chunkSize - 1, k = i; j > k; j--, k++) {
          var tmp = u8[k];
          u8[k] = u8[j];
          u8[j] = tmp;
        }
      }
      return array;
    }

    function parseHeader() {
      headerObject.encoding = 'hex';
      headerObject.vectors = [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)];
      headerObject.type = Float32Array;
      // headerObject.endian = little;
      headerObject.dimension = 3;
      headerObject.sizes = [160, 160, 200];
      //headerObject.space = '?';
      headerObject.spaceOrigin = [0, 0, 0];
      headerObject.directions = headerObject.vectors;
      headerObject.__array = Float32Array;
      //headerObject.spacings = '?';
    }
    //TODO:FIX THIS FUNCTION
    function parseDataAsText(data, start, end) {
      var number = '';
      start = start || 0;
      end = end || data.length;
      var value;

      var lengthOfTheResult = headerObject.sizes.reduce(function(previous, current) {
        return previous * current;
      });

      var result = new headerObject.__array(lengthOfTheResult);
      var resultIndex = 0;
      var parsingFunction = parseFloat;
      var maxlog = 15.0;
      //TODO:目前是硬编码最小浓度为1000
      var dataMinValue = 1000;
      //TODO:数据的处理不到位?
      for (var i = start; i < end; i++) {
        // In(1000) = 6.907
        // In(400000) = 12.899
        // In(1000000) = 13.816
        // In(2630000) = 14.782
        // In(1000)/InMax = 0.4605
        value = data[i];
        if (value > dataMinValue) {
          //TODO:Unity中的实现用的是pi为底?……
          value = Math.log(value) / (maxlog * Math.log(Math.PI));
          value = Math.max(0.0, Math.min(1.0, value));
          //TODO:过滤噪声
        } else if (value !== 0) {
          value = 0;
        }

        result[resultIndex] = parsingFunction(value);
        resultIndex++;
      }

      return result;
    }

    var _bytes = scan('float', data.byteLength);
    var _length = _bytes.length;
    var _header = null;
    var _data_start = 0;

    // 这里以前有个去掉头信息的代码但现在没了……

    parseHeader();

    _data = _bytes.subarray(_data_start);
    _data = parseDataAsText(_data);
    _data = _data.buffer;

    var volume = new Volume();
    volume.header = headerObject;
    // —————————————————————————————————
    // parse the (unzipped) data to a datastream of the correct type
    // —————————————————————————————————
    volume.data = new headerObject.__array(_data);
    //document.getElementById('volumeBytes').innerHTML = volume.data;
    // get the min and max intensities
    var min_max = volume.computeMinMax();
    var min = min_max[0];
    var max = min_max[1];
    // attach the scalar range to the volume
    volume.windowLow = min;
    volume.windowHigh = max;
    // get the image dimensions
    volume.dimensions = [headerObject.sizes[0], headerObject.sizes[1], headerObject.sizes[2]];
    volume.xLength = volume.dimensions[0];
    volume.yLength = volume.dimensions[1];
    volume.zLength = volume.dimensions[2];
    // spacing
    var spacingX = new Vector3(
      headerObject.vectors[0][0],
      headerObject.vectors[0][1],
      headerObject.vectors[0][2],
    ).length();
    var spacingY = new Vector3(
      headerObject.vectors[1][0],
      headerObject.vectors[1][1],
      headerObject.vectors[1][2],
    ).length();
    var spacingZ = new Vector3(
      headerObject.vectors[2][0],
      headerObject.vectors[2][1],
      headerObject.vectors[2][2],
    ).length();
    volume.spacing = [spacingX, spacingY, spacingZ];
    // Create IJKtoRAS matrix
    volume.matrix = new Matrix4();

    var _spaceX = 1;
    var _spaceY = 1;
    var _spaceZ = 1;

    if (headerObject.space === 'left-posterior-superior') {
      _spaceX = -1;
      _spaceY = -1;
    } else if (headerObject.space === 'left-anterior-superior') {
      _spaceX = -1;
    }

    if (!headerObject.vectors) {
      volume.matrix.set(_spaceX, 0, 0, 0, 0, _spaceY, 0, 0, 0, 0, _spaceZ, 0, 0, 0, 0, 1);
    } else {
      var v = headerObject.vectors;
      volume.matrix.set(
        _spaceX * v[0][0],
        _spaceX * v[1][0],
        _spaceX * v[2][0],
        0,
        _spaceY * v[0][1],
        _spaceY * v[1][1],
        _spaceY * v[2][1],
        0,
        _spaceZ * v[0][2],
        _spaceZ * v[1][2],
        _spaceZ * v[2][2],
        0,
        0,
        0,
        0,
        1,
      );
    }

    volume.inverseMatrix = new Matrix4();
    volume.inverseMatrix.getInverse(volume.matrix);
    volume.RASDimensions = new Vector3(volume.xLength, volume.yLength, volume.zLength)
      .applyMatrix4(volume.matrix)
      .round()
      .toArray()
      .map(Math.abs);

    if (volume.lowerThreshold === -Infinity) {
      volume.lowerThreshold = min;
    }
    if (volume.upperThreshold === Infinity) {
      volume.upperThreshold = max;
    }
    return volume;
  },

  parseChars: function(array, start, end) {
    // without borders, use the whole array
    if (start === undefined) {
      start = 0;
    }
    if (end === undefined) {
      end = array.length;
    }
    var output = '';
    // create and append the chars
    var i = 0;
    for (i = start; i < end; ++i) {
      output += String.fromCharCode(array[i]);
    }
    return output;
  },
});

export { PetLoader };
