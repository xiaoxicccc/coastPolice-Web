<template>

  <div
    class="demo-map"
    id="demo-map">
  </div>

</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'demo-map',
  data () {
    return {
      map: null,
      source: {
        point: null
      }
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMDA4MzNkZi0yNjZhLTRmNmEtYmRkNi1mZDgwZmZlZDIxNzIiLCJpZCI6Nzg2NDQsImlhdCI6MTY0MTQzMjQ5NX0.62_70vBdMM6yGXiuSziQMoyOWQAJuyIB5X7jBsHTyLA'
      // 初始化map
      this.map = new Cesium.Viewer('demo-map', {
        animation: false, // 是否创建动画小器件，左下角仪表
        baseLayerPicker: false, // 是否显示图层选择器
        geocoder: false,
        infoBox: false,
        navigationHelpButton: false, // 是否显示右上角的帮助按钮
        // skyAtmosphere: false, // 未生效-地球蓝光关闭
        sceneMode: Cesium.SceneMode.SCENE3D,
        timeline: false
        // imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
        //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=ebf64362215c081f8317203220f133eb",
        //   layer: 'tdtBasicLayer',
        //   style: 'default',
        //   format: "tiles",
        //   tileMatrixSetID: "GoogleMapsCompatible",
        //   show: true,
        //   maximumLevel: 18
        // })
        // terrainProvider: Cesium.createWorldTerrain()
      })

      this.map.cesiumWidget.creditContainer.style.display = 'none' // cesium 版权
      this.map.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)

      // 设置地图初始化位置
      this.map.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.20, 40.55, 3 * 10000 * 200)
      })

      // const buildingTileset = this.map.scene.primitives.add(Cesium.createOsmBuildings())

      // console.log(buildingTileset)

      // this.map.camera.flyTo({
      //   destination : Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      //   orientation : {
      //     heading : Cesium.Math.toRadians(0.0),
      //     pitch : Cesium.Math.toRadians(-15.0)
      //   }
      // })

      // const iframe = document.getElementsByClassName('cesium-infoBox-iframe')[0]
      // iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms')
      // 叠加marker
      this.initPoint()
    },
    initPoint () {
      this.source.point = new Cesium.CustomDataSource('point')
      this.map.dataSources.add(this.source.point)

      const points = [
        [121, 36],
        [118, 30],
        [123, 34]
      ]

      points.forEach((item, i) => {
        this.source.point.entities.add({
          id: `point_${i}`,
          label: {
            font: '14pt',
            pixelOffset: new Cesium.Cartesian2(0, 10), // 偏移
            text: `point_${i}`
            // verticalOrigin: Cesium.VerticalOrigin.BOTTOM // 底部对齐
          },
          name: `point_${i}`,
          show: true, // 显示
          position: Cesium.Cartesian3.fromDegrees(item[0], item[1], 0.0),
          point: {
            color: Cesium.Color.RED, // 颜色
            pixelSize: 5 // 点大小
          }
        })
      })
    }
  }
}
</script>

<style scoped>
.demo-map {
  height: 100%;
  width: 100%;
}
</style>
