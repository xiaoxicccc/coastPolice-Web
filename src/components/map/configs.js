const mapConfig = localStorage.getItem('map-config')
const config = mapConfig ? JSON.parse(mapConfig) : null
// 地图中心点及初始化缩放值
const center = config ? [config.longitude - 0, config.latitude - 0] : [121.397932, 37.60386]
const zoom = config ? config.zoom - 0 : 8

// 侧面积样式
const AreaToolConf = {
  symbol: {
    lineColor: '#1bbc9b',
    lineWidth: 2,
    polygonFill: '#fff',
    polygonOpacity: 0.3
  },
  vertexSymbol: {
    markerType: 'ellipse',
    markerFill: '#34495e',
    markerLineColor: '#1bbc9b',
    markerLineWidth: 3,
    markerWidth: 10,
    markerHeight: 10
  },
  labelOptions: {
    textSymbol: {
      textFaceName: 'monospace',
      textFill: '#fff',
      textLineSpacing: 1,
      textHorizontalAlignment: 'right',
      textDx: 15
    },
    boxStyle: {
      padding: [6, 2],
      symbol: {
        markerType: 'square',
        markerFill: '#000',
        markerFillOpacity: 0.9,
        markerLineColor: '#b4b3b3'
      }
    }
  },
  clearButtonSymbol: [
    {
      markerType: 'square',
      markerFill: '#000',
      markerLineColor: '#b4b3b3',
      markerLineWidth: 2,
      markerWidth: 15,
      markerHeight: 15,
      markerDx: 22
    },
    {
      markerType: 'x',
      markerWidth: 10,
      markerHeight: 10,
      markerLineColor: '#fff',
      markerDx: 22
    }
  ],
  language: 'zh-CN'
}

// marker配色
const colorConfig = {
  trawler: {
    AIS: '#00CC00',
    Beidou: '#3366CC',
    Radar: '#9370DB',
    'Radar-AIS': '#CD60BA'
  }
}

// 测距样式
const DistanceToolConf = {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2
  },
  vertexSymbol: {
    markerType: 'ellipse',
    markerFill: '#1bbc9b',
    markerLineColor: '#000',
    markerLineWidth: 3,
    markerWidth: 10,
    markerHeight: 10
  },
  labelOptions: {
    textSymbol: {
      textFaceName: 'monospace',
      textFill: '#fff',
      textLineSpacing: 1,
      textHorizontalAlignment: 'right',
      textDx: 15,
      markerLineColor: '#b4b3b3',
      markerFill: '#000'
    },
    boxStyle: {
      padding: [6, 2],
      symbol: {
        markerType: 'square',
        markerFill: '#000',
        markerFillOpacity: 0.9,
        markerLineColor: '#b4b3b3'
      }
    }
  },
  clearButtonSymbol: [
    {
      markerType: 'square',
      markerFill: '#000',
      markerLineColor: '#b4b3b3',
      markerLineWidth: 2,
      markerWidth: 15,
      markerHeight: 15,
      markerDx: 20
    },
    {
      markerType: 'x',
      markerWidth: 10,
      markerHeight: 10,
      markerLineColor: '#fff',
      markerDx: 20
    }
  ],
  language: 'zh-CN'
}

// 经纬度换算
const formatPositon = (jd, wd) => {
  const result = {}

  const jdDeg = parseInt(jd)
  const jdMin = Math.floor((jd - jdDeg) * 60)
  const jdSec = (((jd - jdDeg) * 60 - jdMin) * 60).toFixed(3)
  result.jd = `${jdDeg}°${jdMin}′${jdSec}″`
  const wdDeg = parseInt(wd)
  const wdMin = Math.floor((wd - wdDeg) * 60)
  const wdSec = (((wd - wdDeg) * 60 - wdMin) * 60).toFixed(3)
  result.wd = `${wdDeg}°${wdMin}′${wdSec}″`

  return result
}

// 渔船信息重定向
const formartTrawlerInfo = (data, focus, light) => {
  const now = new Date()
  const gap = 1000 * 60 * 60 * 2
  const gpsDate = new Date(data.gpsTime)
  return {
    angle: data.cog ? data.cog - 0 : 0,
    bdId: '',
    departName: data.departName, // 海岸管理单位
    equipment: data.msgType, // 在线设备类型
    focus: !!focus,
    gpsdwsj: data.gpsTime,
    homePort: data.homePortName,
    id: data.id,
    latitude: data.latitude - 0,
    length: data.length || '-',
    light: !!light,
    longitude: data.longitude - 0,
    mmsi: data.mmsi,
    online: now - gpsDate < gap,
    owner: data.ownerName,
    phone: '',
    region: `${data.province}${data.city}${data.county}`,
    shipName: data.boatName,
    shipType: data.typeName,
    speed: data.sog,
    targetId: data.targetId,
    targetLength: data.targetLength,
    type: data.msgType, // 设备类型
    uuid: data.uuid
  }
}

// 渔船报警样式
const getAnalysisSymbol = (type) => {
  const symbol = {
    area: {
      symbol: {
        polygonFill: '#015EEA',
        polygonOpacity: 0.05,
        lineColor: '#015EEA',
        lineWidth: 1,
        lineJoin: 'round',
        lineCap: 'round',
        lineDasharray: [3, 2, 3],
        lineOpacity: 1
      }
    },
    catch: {
      symbol: {
        polygonFill: '#015EEA',
        polygonOpacity: 0.05,
        lineColor: '#015EEA',
        lineWidth: 1,
        lineJoin: 'round',
        lineCap: 'round',
        lineDasharray: [3, 2, 3],
        lineOpacity: 1
      }
    },
    normal: [
      {
        markerFill: '#F00',
        markerHeight: 8,
        markerType: 'ellipse',
        markerWidth: 8
      },
      {
        markerFill: 'transparent',
        markerHeight: 15,
        markerLineColor: '#F00',
        markerLineWidth: 1,
        markerType: 'ellipse',
        markerWidth: 15
      }
    ],
    path: {
      symbol: {
        lineColor: 'white',
        lineWidth: 1,
        lineJoin: 'round',
        lineCap: 'round',
        lineOpacity: 1
      }
    },
    point: {
      symbol: {
        markerType: 'ellipse',
        markerFill: 'greenyellow',
        markerFillOpacity: 1,
        markerLineColor: 'greenyellow',
        markerLineWidth: 1,
        markerLineOpacity: 1,
        markerWidth: 5,
        markerHeight: 5,
        markerDx: 0,
        markerDy: 0,
        markerOpacity: 1
      }
    }
  }
  return symbol[type]
}

// 底图配置
const getbaseLayerConfig = () => {
  return [
    {
      max: 17,
      name: 'vector',
      subdomains: ['0', '1', '2'],
      spatialReference: {
        projection: 'EPSG:4326'
      },
      url: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=e94bdf47aea79c95064a10d5b56cc989'
    },
    {
      max: 17,
      name: 'sea',
      subdomains: ['a', 'b', 'c'],
      spatialReference: {
        projection: 'EPSG:4326'
      },
      // url: 'http://56.80.192.35:7100/seamap/{z}/{y}/{x}.png'
      url: 'http://117.132.5.62:6590/{z}/{y}/{x}.png'
      // url: 'http://inner.qdlimap.cn:7001/wmts/seaMap_dz_1-18/6/3/0.png'
      // url: 'http://inner.qdlimap.cn:7001/wmts/seaMap_dz_1-18/{z}/{y}/{x}.png'
      // url: 'http://www.oceanread.com:213/arcgis/rest/services/chart/chartAll/MapServer/tile/{z}/{y}/{x}'
    },
    {
      max: 17,
      name: 'image',
      spatialReference: {
        projection: 'EPSG:4326'
      },
      // subdomains: ['a', 'b', 'c'],
      // url: 'http://56.80.192.35:7100/arcgisOnline/{z}/{x}/{y}.png'
      // subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      url: 'http://117.132.5.62:6590/satelite/{z}/{y}/{x}.png'
      // url: 'http://192.168.2.201:6071/offlinemap/esri_21/1_15/{z}/{x}/{y}.png'
      // url: 'https://gac-geo.googlecnapps.cn/maps/vt?lyrs=s%40781&hl=zh-CN&gl=CN&x={x}&y={y}&z={z}&src=app&scale=1&from=app'
      // url: 'https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/9812/{z}/{y}/{x}'
      // url: 'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=e94bdf47aea79c95064a10d5b56cc989'
    },
    {
      max: 17,
      name: 'image-arcgis',
      spatialReference: {
        projection: 'EPSG:4326'
      },
      subdomains: ['a', 'b', 'c'],
      url: 'http://56.80.192.35:7100/arcgisOnline/{z}/{x}/{y}.png'
      // url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      // url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    },
    {
      max: 17,
      name: 'dark',
      // spatialReference: {
      //   projection: 'EPSG:4326'
      // },
      subdomains: ['a', 'b', 'c', 'd'],
      url: 'http://56.80.192.35:7100/shense/{z}/{x}/{y}.png'
      // url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
    }
  ]
}

// 轨迹回放颜色配置
const getColorAtlas = () => {
  return [
    'hotpink', 'slateblue',
    'black', 'lime',
    'slategrey', 'orangered',
    'seagreen', 'olivedrab',
    'maroon', 'dodgerblue'
  ]
}

// 摄像头点位样式
const getGuardSymbol = (e, textDy) => {
  let color = ''
  switch (e.duration) {
    case '渔政': {
      color = 'green'
      break
    }
    case '海防': {
      color = 'red'
      break
    }
    default: {
      color = 'blue'
      break
    }
  }
  return [
    {
      markerDy: 0,
      markerFile: '/img/icon-guard.png',
      markerHeight: 71,
      markerLineWidth: 0,
      markerWidth: 28
    },
    {
      textName: e.videoName,
      textSize: {
        stops: [
          [14, 0],
          [15, 14]
        ]
      },
      textDx: 20,
      textDy: textDy,
      textFill: '#FFFFFF',
      textWeight: 400,
      textHorizontalAlignment: 'right',
      textHaloFill: color,
      textHaloRadius: 1
    }
  ]
}

// 定位样式
const getLocationSymbol = () => {
  return [
    {
      markerFile: '/img/icon-focus.png',
      markerWidth: {
        stops: [
          [10, 40],
          [11, 40]
        ]
      },
      markerHeight: {
        stops: [
          [10, 40],
          [11, 40]
        ]
      },
      markerDx: 0,
      markerDy: {
        stops: [
          [10, 20],
          [11, 20]
        ]
      }
    }
  ]
}

// 渔船信息弹窗
const getPopup = (info) => {
  let text = ''
  switch (info.type) {
    case 'Radar':
    case 'Radar-AIS':
      text = `
        <div style="align-items: center; box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
          <div style="color: rgba(171, 177, 200, 1);">目标长度(m)：</div>
          <div style="color: rgba(255, 255, 255, 1);">${info.targetLength || '--'}</div>
        </div>
        <div style="align-items: center; background-color: rgba(2, 22, 67, 1); box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
          <div style="color: rgba(171, 177, 200, 1);">最后定位时间：</div>
          <div style="color: rgba(255, 255, 255, 1);">${info.gpsdwsj || '--'}</div>
        </div>
      `
      break
    default:
      text = `
        <div style="align-items: center; box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
          <div style="color: rgba(171, 177, 200, 1);">最后定位时间：</div>
          <div style="color: rgba(255, 255, 255, 1);">${info.gpsdwsj || '--'}</div>
        </div>
      `
      break
  }
  const content = `
    <div style="background-color: rgba(0, 10, 45, 0.8); box-sizing: border-box; font-size: 14px; padding-bottom: 10px; padding-left: 14px; padding-right: 14px; padding-top: 10px; width: 290px;">
      <div style="align-items: center; box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">船名：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.shipName || '--'}</div>
      </div>
      <div style="align-items: center; background-color: rgba(2, 22, 67, 1); box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">船主姓名：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.owner || '--'}</div>
      </div>
      <div style="align-items: center; box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">联系方式：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.phone || '--'}</div>
      </div>
      <div style="align-items: center; background-color: rgba(2, 22, 67, 1); box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">经度：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.longitude || '--'}</div>
      </div>
      <div style="align-items: center; box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">纬度：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.latitude || '--'}</div>
      </div>
      <div style="align-items: center; background-color: rgba(2, 22, 67, 1); box-sizing: border-box; display: flex; flex-direction: row; height: 24px; padding-left: 10px; width: 100%;">
        <div style="color: rgba(171, 177, 200, 1);">航速：</div>
        <div style="color: rgba(255, 255, 255, 1);">${info.speed || '--'}节</div>
      </div>
      ${text}
    </div>`
  return {
    autoOpenOn: 'click',
    autoCloseOn: 'click',
    single: true,
    width: 183,
    height: 105,
    custom: true,
    dx: -3,
    dy: -12,
    content: content
  }
}

// 渔船报警弹窗
const getPopupAnalysis = (info, type) => {
  // console.log(info, type)
  const analysis = {
    'bad-weather': '<div style="margin-bottom: 5px;">报警类型: 恶劣天气出海</div>',
    beidous: `<div style="margin-bottom: 5px;">其他北斗设备: ${info.name}</div>
      <div style="margin-bottom: 5px;">其他北斗设备定位时间: ${info.time}</div>`,
    crossing: '<div style="margin-bottom: 5px;">报警类型: 围栏越界</div>',
    fishing: '<div style="margin-bottom: 5px;">报警类型: 越界捕捞</div>',
    focus: '<div style="margin-bottom: 5px;">报警类型: 重点关注渔船出海</div>',
    key: '<div style="margin-bottom: 5px;">报警类型: 设备异常</div>',
    reported: '<div style="margin-bottom: 5px;">报警类型: 未报备出海</div>',
    satellite: '<div style="margin-bottom: 5px;">不开机时长: 2h</div>'
  }
  const content = `
    <div style="background-color: rgba(0, 10, 45, 0.8); box-sizing: border-box; color: #FFF; font-size: 14px; padding-bottom: 10px; padding-left: 14px; padding-right: 14px;
    padding-top: 10px; position: relative; text-align: left; width: 300px;">
      <div style="height: 100px; left: -90px; position: absolute; top: 35px; width: 100px;">
        <span style="background-color: rgba(22, 127, 255, 0.7); height: 2px; position: absolute; right: 52px; top: 52px; transform: rotate(-45deg); width: 50px;">
        </span>
        <span style="background-color: rgba(22, 127, 255, 0.7); height: 2px; position: absolute; right: 10px; top: 35px; width: 50px;">
        </span>
      </div>
      <div style="background-image: linear-gradient(90deg, rgba(22, 127, 255, 0) 0%, rgba(22, 127, 255, 0.3) 50%, rgba(22, 127, 255, 0) 100%); font-size: 16px; margin-bottom: 5px; padding-bottom: 5px; padding-top: 5px;">[${info.lastMsgType}]${info.boatName}
      </div>
      <div style="margin-bottom: 5px;">船主姓名: ${info.ownerName || '--'}
      </div>
      <div style="margin-bottom: 5px;">联系方式: ${info.ownerPhone || '--'}
      </div>
      ${analysis[type]}
      <div>最后定位时间: ${info.lastLocationTime || '--'}
      </div>
    </div>
  `
  return {
    autoOpenOn: 'click',
    autoCloseOn: 'click',
    single: true,
    width: 400,
    height: 105,
    custom: true,
    dx: 238,
    dy: 40,
    content: content
  }
}

// 渔船报警弹窗-北斗
const getPopupAnalysisBeidou = (info) => {
  const content = `
    <div style="background-color: rgba(0, 10, 45, 0.8); box-sizing: border-box; color: #FFF; font-size: 14px; padding-bottom: 10px; padding-left: 14px; padding-right: 14px;
    padding-top: 10px; position: relative; text-align: left; width: 300px;">
      <div style="height: 100px; left: -90px; position: absolute; top: 35px; width: 100px;">
        <span style="background-color: rgba(22, 127, 255, 0.7); height: 2px; position: absolute; right: 52px; top: 52px; transform: rotate(-45deg); width: 50px;">
        </span>
        <span style="background-color: rgba(22, 127, 255, 0.7); height: 2px; position: absolute; right: 10px; top: 35px; width: 50px;">
        </span>
      </div>
      <div style="background-image: linear-gradient(90deg, rgba(22, 127, 255, 0) 0%, rgba(22, 127, 255, 0.3) 50%, rgba(22, 127, 255, 0) 100%); font-size: 16px; margin-bottom: 5px; padding-bottom: 5px; padding-top: 5px;">[${info.lastMsgType}]${info.boatName}
      </div>
      <div style="margin-bottom: 5px;">船主姓名: ${info.ownerName || '--'}
      </div>
      <div style="margin-bottom: 5px;">联系方式: ${info.ownerPhone || '--'}
      </div>
      <div style="margin-bottom: 5px;">最后定位时间: ${info.lastLocationTime || '--'}
      </div>
      <div style="margin-bottom: 5px;">北斗设备2: ${info.name2 || '--'}
      </div>
      <div style="margin-bottom: 5px;">最后定位时间: ${info.time2 || '--'}
      </div>
      <div style="margin-bottom: 5px;">北斗设备3: ${info.name3 || '--'}
      </div>
      <div>最后定位时间: ${info.time3 || '--'}
      </div>
    </div>
  `
  return {
    autoOpenOn: 'click',
    autoCloseOn: 'click',
    single: true,
    width: 400,
    height: 105,
    custom: true,
    dx: 240,
    dy: 125,
    content: content
  }
}

// 构造渔港marker
const getPortSymbol = (key) => {
  return [
    {
      markerDy: 10,
      markerFile: '/img/icon-port.png',
      markerHeight: 15,
      markerLineWidth: 0,
      markerWidth: 15
    },
    {
      textName: key,
      textSize: {
        stops: [
          [11, 0],
          [12, 14]
        ]
      },
      textDx: 15,
      textDy: 3,
      textFill: 'white', // #18FFF7
      textWeight: 400,
      textHorizontalAlignment: 'right',
      textHaloFill: '#0e56a8',
      textHaloRadius: 1
    }
  ]
}

// 雷达设备样式
const getRadarEquipmentSymbol = () => {
  const fontHalf = {
    stops: [
      [7, 0],
      [8, 2],
      [9, 10],
      [10, 15],
      [11, 25]
    ]
  }
  const font = {
    stops: [
      [7, 0],
      [8, 4],
      [9, 20],
      [10, 30],
      [11, 32]
    ]
  }
  const sizeHalf = {
    stops: [
      [8, 5],
      [9, 12.5],
      [10, 25],
      [11, 40],
      [12, 60],
      [13, 200],
      [14, 400]
    ]
  }
  const size = {
    stops: [
      [8, 15],
      [9, 30],
      [10, 60],
      [11, 10],
      [12, 120],
      [13, 400],
      [14, 800]
    ]
  }

  return [
    {
      markerDx: 0,
      markerDy: sizeHalf,
      markerFile: '/img/screen/icon-radar-sector.png',
      markerWidth: size,
      markerHeight: size,
      markerRotation: 0
    },
    {
      markerDx: 0,
      markerDy: sizeHalf,
      markerFile: '/img/screen/icon-radar-bg.png',
      markerWidth: size,
      markerHeight: size
    },
    {
      markerDx: 5,
      markerDy: fontHalf,
      markerFile: '/img/screen/icon-radar.png',
      markerWidth: font,
      markerHeight: font
    }
  ]
}

// 渔船轨迹数据格式化
const getTrackFormatted = (data, start, end, bd, mmsi, owner, phone) => {
  const list = []
  const startWhen = new Date(start).getTime()
  const endWhen = new Date(end).getTime() - startWhen
  const startPoint = data[0]
  const endPoint = data[data.length - 1]

  list.push([
    Number(startPoint.longitude),
    Number(startPoint.latitude),
    0,
    (startPoint.zhx ? startPoint.zhx - 0 : 0),
    startPoint.gpsTime,
    startPoint.cm,
    bd,
    mmsi,
    startPoint.sog || 0,
    owner,
    phone
  ])

  data.forEach((item) => {
    // 该段轨迹时长
    const updateDate = new Date(item.gpsTime).getTime()
    const duration = updateDate - startWhen
    // 轨迹点数据: [ 经度, 纬度, 轨迹播放时长, 角度, 上报时间 ]
    list.push([
      Number(item.longitude),
      Number(item.latitude),
      duration,
      (item.zhx ? item.zhx - 0 : 0),
      item.gpsTime,
      item.cm,
      bd,
      mmsi,
      item.sog || 0,
      owner,
      phone
    ])
  })

  list.push([
    Number(endPoint.longitude),
    Number(endPoint.latitude),
    endWhen,
    (endPoint.zhx ? endPoint.zhx - 0 : 0),
    endPoint.gpsTime,
    endPoint.shipName || endPoint.boatName,
    bd,
    mmsi,
    endPoint.sog,
    owner,
    phone
  ])

  return list
}

// 渔船点位样式
const getTrawlerSymbol = (info) => {
  // 渔船随机角度
  info.angle = info.angle - 0
  // const angle = info.angle || (Math.random() * 360).toFixed(0)
  const isRadar = info.type === 'Radar'
  // 渔船配色
  const color = info.light ? '#FFFF00' : info.online ? colorConfig.trawler[info.type] : '#939393'
  const lineColor = info.light ? '#FFFF00' : info.online ? 'black' : colorConfig.trawler[info.type]
  // 重点关注渔船标志配色
  const focusColor = '#FFA500'
  const symbol = [
    {
      markerType: isRadar ? 'ellipse' : 'triangle',
      markerFill: info.location ? '#FF0000' : color,
      markerLineColor: info.location ? '#FF0000' : lineColor,
      markerLineWidth: 1,
      markerWidth: {
        stops: [
          [10, 0],
          [11, isRadar ? 20 : 12]
        ]
      },
      markerHeight: {
        stops: [
          [10, 0],
          [11, isRadar ? 20 : 22]
        ]
      },
      markerRotation: 360 - info.angle
    },
    {
      markerType: 'ellipse',
      markerFill: info.location ? '#FF0000' : color,
      markerLineColor: info.location ? '#FF0000' : lineColor,
      markerLineWidth: 0,
      markerWidth: {
        stops: [
          [10, 8],
          [11, 0]
        ]
      },
      markerHeight: {
        stops: [
          [10, 8],
          [11, 0]
        ]
      }
    },
    {
      markerType: 'ellipse',
      markerFill: 'white',
      markerFillOpacity: 0,
      markerLineColor: focusColor,
      markerLineWidth: 3,
      markerLineOpacity: 1,
      markerWidth: {
        stops: [
          [10, 15],
          [11, 30]
        ]
      },
      markerHeight: {
        stops: [
          [10, 15],
          [11, 30]
        ]
      },
      markerDx: 0,
      markerDy: 0,
      markerOpacity: info.focus ? 1 : 0
    }
    // {
    //   markerType: 'ellipse',
    //   markerFill: 'white',
    //   markerFillOpacity: 0,
    //   markerLineColor: '#FFFF00',
    //   markerLineWidth: 3,
    //   markerLineOpacity: 1,
    //   markerWidth: {
    //     stops: [
    //       [10, 15],
    //       [11, 30]
    //     ]
    //   },
    //   markerHeight: {
    //     stops: [
    //       [10, 15],
    //       [11, 30]
    //     ]
    //   },
    //   markerDx: 0,
    //   markerDy: 0,
    //   markerOpacity: info.light ? 1 : 0
    // }
  ]
  if (isRadar) {
    symbol.push({
      markerDx: 0,
      markerDy: 0,
      markerType: 'bar',
      markerFill: 'black',
      markerLineWidth: 0,
      markerWidth: {
        stops: [
          [10, 0],
          [11, 1]
        ]
      },
      markerHeight: {
        stops: [
          [10, 0],
          [11, 7]
        ]
      },
      markerRotation: 360 - info.angle
    })
  }
  return symbol
}

// 渔船轨迹配置项-业务版
const getTrawlerTrackOptions = (color) => {
  return {
    line: [
      {
        arrowStyle: [2, 3],
        arrowPlacement: 'vertex-last',
        visible: true,
        zIndex: 1,
        symbol: {
          lineColor: color,
          lineWidth: 1,
          lineDasharray: [4, 2, 4],
          ineOpacity: 0.3
        }
      },
      {
        arrowStyle: null,
        visible: true,
        zIndex: 1,
        symbol: {
          lineColor: color,
          lineWidth: 1,
          lineDasharray: [4, 2, 4],
          ineOpacity: 0.3
        }
      }
    ],
    marker: {
      special: {
        visible: true,
        zIndex: 1,
        symbol: [
          {
            markerType: 'ellipse',
            markerFill: 'hotpink',
            // markerFill: 'blue',
            markerLineColor: '#ffffff',
            markerLineWidth: 1,
            markerWidth: 7,
            markerHeight: 7,
            markerOpacity: 0.5
          },
          {
            markerDx: 90,
            markerDy: 180,
            markerFile: '../../../static/img/screen/popup.png',
            markerHeight: 200,
            markerOpacity: 0,
            markerWidth: 150
          },
          {
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 2
          },
          { // 船舶名称
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 22
          },
          { // AIS
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 42
          },
          { // 船东
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 62
          },
          { // 电话
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 82
          },
          { // 经度
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 102
          },
          { // 纬度
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 122
          },
          { // 航向
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 142
          },
          { // 未知
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 162
          }
        ]
      },
      normal: {
        visible: true,
        zIndex: 1,
        symbol: [
          {
            markerType: 'ellipse',
            markerFill: 'hotpink',
            // markerFill: 'green',
            markerLineColor: '#ffffff',
            markerLineWidth: 1,
            markerWidth: 7,
            markerHeight: 7,
            markerOpacity: 0.5
          },
          {
            markerDx: 90,
            markerDy: 170,
            markerFile: '/img/icon-popup.png',
            markerHeight: 200,
            markerOpacity: 0,
            markerWidth: 150
          },
          {
            // 定位时间
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 2
          },
          {
            // 船名
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 22
          },
          {
            // 设备号
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 42
          },
          {
            // 船东
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 62
          },
          { // 联系方式
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 82
          },
          { // 经度
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 102
          },
          { // 纬度
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 122
          },
          { // 航向
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 142
          },
          { // 未知
            textOpacity: 1,
            textFaceName: 'sans-serif',
            textName: null,
            textFill: 'white',
            // textHaloFill: 'white',
            // textHaloRadius: 1,
            textSize: 11,
            textDx: 90,
            textDy: 162
          }
        ]
      },
      focus: {
        visible: true,
        zIndex: 25,
        symbol: {
          markerFile: '/img/icon-focus.png',
          markerWidth: 40,
          markerHeight: 40,
          markerDy: 20
        }
      },
      current: {
        visible: true,
        zIndex: 50,
        symbol: {
          markerType: 'triangle',
          markerFill: '#ff0000',
          markerLineColor: '#ff0000',
          markerWidth: 15,
          markerHeight: 20,
          markerRotation: 0
        }
      }
    },
    route: {
      marker: {
        markerType: 'ellipse',
        markerFill: 'red',
        markerLineColor: 'red',
        markerLineWidth: 10
      },
      line: {
        lineColor: color,
        lineWidth: 1,
        lineDasharray: [4, 2, 4],
        lineOpacity: 0.8
      }
    }
  }
}

// 渔船轨迹配置项-大屏版
const getTrawlerTrackOptionsScreen = () => {
  return {
    desccription: '',
    lineStyle: [
      {
        arrowStyle: [2, 3],
        arrowPlacement: 'vertex-last',
        visible: true,
        zIndex: 1,
        symbol: {
          lineColor: '#99ff00',
          lineWidth: 1,
          lineDasharray: [4, 2, 4],
          ineOpacity: 0.6
        }
      },
      {
        arrowStyle: null,
        visible: true,
        zIndex: 1,
        symbol: {
          lineColor: '#99ff00',
          lineWidth: 1,
          lineDasharray: [4, 2, 4],
          ineOpacity: 0.6
        }
      }
    ],
    markerStyle: {
      normal: {
        visible: true,
        zIndex: 1,
        symbol: [
          {
            markerType: 'ellipse',
            markerFill: '#99ff00',
            markerLineColor: '#ffffff',
            markerLineWidth: 1,
            markerWidth: 7,
            markerHeight: 7
          },
          {
            textFaceName: 'sans-serif',
            textName: null,
            textFill: '#ffffff',
            textSize: {
              stops: [
                [10, 0],
                [11, 10]
              ]
            },
            textDx: 60,
            textDy: 2
          }
        ]
      },
      focus: {
        visible: true,
        zIndex: 25,
        symbol: {
          markerFile: '../../../static/img/screen/focus.png',
          markerWidth: 40,
          markerHeight: 40,
          markerDy: 20
        }
      },
      current: {
        visible: true,
        zIndex: 50,
        symbol: {
          markerType: 'triangle',
          markerFill: '#ff0000',
          markerLineColor: '#ff0000',
          markerWidth: 15,
          markerHeight: 20,
          markerRotation: 0
        }
      }
    },
    routeStyle: {
      marker: {
        markerType: 'ellipse',
        markerFill: 'red',
        markerLineColor: 'pink',
        markerLineWidth: 1,
        markerHeight: 15,
        markerWidth: 15
      },
      line: {
        lineColor: '#ff00ff',
        lineWidth: 1,
        lineDasharray: [4, 2, 4],
        lineOpacity: 0
      }
    }
  }
}

// 获取风力等级
const getWindGrade = (data) => {
  let grade = ''
  if (data > 0.0 && data <= 0.2) {
    grade = 0
  } else if (data > 0.2 && data <= 1.5) {
    grade = 1
  } else if (data > 1.5 && data <= 3.3) {
    grade = 2
  } else if (data > 3.3 && data <= 5.4) {
    grade = 3
  } else if (data > 5.4 && data <= 7.9) {
    grade = 4
  } else if (data > 7.9 && data <= 10.7) {
    grade = 5
  } else if (data > 10.7 && data <= 13.8) {
    grade = 6
  } else if (data > 13.8 && data <= 17.1) {
    grade = 7
  } else if (data > 17.1 && data <= 20.7) {
    grade = 8
  } else if (data > 20.7 && data <= 24.4) {
    grade = 9
  } else if (data > 24.4 && data <= 28.4) {
    grade = 10
  } else if (data > 28.4 && data <= 32.6) {
    grade = 11
  } else if (data > 32.6 && data <= 36.9) {
    grade = 12
  } else if (data > 36.9 && data <= 41.4) {
    grade = 13
  } else if (data > 41.4 && data <= 46.1) {
    grade = 14
  } else if (data > 46.1 && data <= 50.9) {
    grade = 15
  } else if (data > 50.9 && data <= 56.0) {
    grade = 16
  } else if (data > 56.0 && data <= 61.2) {
    grade = 17
  } else if (data >= 61.2 && data < 69.4) {
    grade = 18
  } else if (data >= 69.4) {
    grade = 19
  }
  return grade
}

// 雷达设备坐标配置
const radarCoordinatesPlugins = [
  {
    coordinate: [121.6437405, 37.4824149],
    name: '养马岛'
  },
  {
    coordinate: [121.35070518, 37.58533735],
    name: '站点2'
  }
]

// 图层配置
const layerConfig = (index) => {
  return {
    drawAltitude: false,
    enableAltitude: false,
    zIndex: index || 3
  }
}

// 激活渔港卫士样式
const updateMonitorSymbol = (duration) => {
  let color = ''
  switch (duration) {
    case '渔政': {
      color = 'green'
      break
    }
    case '海防': {
      color = 'red'
      break
    }
    default: {
      color = 'blue'
      break
    }
  }
  return color
}

// 更新定位外的渔船样式配置
const updateTrawlerSymbol = (opt) => {
  // const colorOnline = colorMarker.colorOnline
  // const colorOffline = colorMarker.colorOffline
  // // 渔船点位配色
  // const color = (opt.online ? colorConfig[opt.type] : colorOffline[opt.equipment]) || '#c0c0c0'
  // return [
  //   {
  //     markerFill: color
  //   },
  //   {
  //     markerFill: color
  //   }
  // ]
}

export {
  center,
  zoom,
  AreaToolConf,
  colorConfig,
  DistanceToolConf,

  formatPositon,
  formartTrawlerInfo,
  getAnalysisSymbol,
  getbaseLayerConfig,
  getColorAtlas,
  getGuardSymbol,
  getLocationSymbol,
  getPopup,
  getPopupAnalysis,
  getPopupAnalysisBeidou,
  getPortSymbol,
  getRadarEquipmentSymbol,
  getTrackFormatted,
  getTrawlerSymbol,
  getTrawlerTrackOptions,
  getTrawlerTrackOptionsScreen,
  getWindGrade,
  layerConfig,
  radarCoordinatesPlugins,
  updateMonitorSymbol,
  updateTrawlerSymbol
}
