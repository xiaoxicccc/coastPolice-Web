/* eslint-disable */
// litugaoke
const base = 'http://ltgkserver:6060/jczd/'
// 内网部署环境
// const base = 'http://56.80.192.35:6060/jczd/'
// 119部署环境
// const base = 'http://119.167.138.11:6060/jczd/'
// const base = 'http://118.190.202.102:6060/jczd/'
// 宋哲本地
// const base = 'http://192.168.2.96:6060/jczd/'
// 尧尧本地
// const base = 'http://192.168.2.117:6060/jczd/'
// const base = 'http://pyyg.qdlimapvediosPlan/save.cn:6071/jczd/'
// const base = 'http://ltgkserver:6060/jczd/'
// const task = 'http://118.190.202.102:6030/jczd-quartz/'
// 内网部署环境
const task = 'http://56.80.192.34:6030/jczd-quartz/'
// 119部署环境
// const task = 'http://119.167.138.11:6030/jczd-quartz/'
const base_rest = base + 'rest/'
const task_rest = task + 'rest/'

const api = {
  base_rest: base_rest,
  baseUrl: base_rest,
  // 119部署环境
  // weather_rest: 'http://119.167.138.11:6485/jxhyb',
  // 内网部署环境
  weather_rest: 'http://56.80.192.34:6485/jxhyb',
  // weather_rest: 'http://118.190.202.102:1082/pngserver',
  // 登录登出
  login: base_rest + 'login',
  logout: base_rest + 'logout',
  // 渔船点位长连接
  // 119部署环境
  // websockerRadarAIS: 'ws://119.167.138.11:6055/jczd-gps-analysis/SowWs',
  // 宋哲本地
  // websockerRadarAIS: 'ws://192.168.2.96:6055/jczd-gps-analysis/SowWs',
  // 内网部署环境
  websockerRadarAIS: 'ws://56.80.192.36:6055/jczd-gps-analysis/SowWs',
  // 雷达长连接
  // 119部署环境
  // websockerGpsRadar: 'ws://119.167.138.11:6045/jczd-radar-analysis/SowWs',
  // 内网部署环境
  websockerGpsRadar: 'ws://56.80.192.34:6045/jczd-radar-analysis/SowWs',
  // 文件
  insertFile: base_rest + 'sysFile/upload', // 新增
  deleteFile: base_rest + 'sysFile/delete', // 删除
  getImgUrl: base_rest + 'sysFile/load?fileId=', //图片路径
  // 组织树结构
  getOrganizeTree: base_rest + 'sysOrg/tree', // 树
  // websocket
  // 119部署环境
  // getWebsocketData: 'ws://119.167.138.11:6060/jczd/SowWs/0', // 获取推送数据
  // 宋哲环境
  // getWebsocketData: 'ws://192.168.2.85:6030/jczd-quartz/SowWs', // 获取推送数据
  // 内网部署环境
  getWebsocketData: 'ws://56.80.192.34:6030/jczd-quartz/SowWs', // 获取推送数据
  // 报警数据
  getTrawlerAlarmNumber: base_rest + 'shipAlarm/selectCount', // 船舶报警数量
  getCarAlarmNumber: base_rest + 'secureCar/selectCount', // 车辆报警数量
  getCarAlarmPage: base_rest + 'secureCar/page', // 车辆报警分页
  getPeopleAlarmNumber: base_rest + 'faceRecognitionRecord/selectCount', // 人像报警数量
  getPeopleAlarmPage: base_rest + 'faceRecognitionRecord/page', // 人像报警分页
  getTrawlerAlarmPage: base_rest + '', // 全景预警数据
  getImsiAlarmNumber: base_rest + 'electronicFence/todayCount', // 电子围栏报警数量
  // 获取渔船点位
  getTrawlerPoint: base_rest + 'dynamicNew/boat-point', // 动态点位
  getTrawlerNumber: base_rest + 'dynamicNew/getBoatNum', // 获取分组渔船数量
  getTrawlerPointByRange: base_rest + 'dynamicNew/boatPointByRange', // 可视范围内动态点位
  getTrawlerPointByGeo: base_rest + 'dynamicNew/boatPointForGeo', // 可视范围内动态点位-最新接口
  // 可视化
  getWeatherInfo: base_rest + 'hf-weather/getWeather', // 和风天气
  getTrawlerTypeOnline: base_rest + 'dynamicNew/total-online', // 获取北斗、AIS在线/总数
  getTrawlerTotal: base_rest + 'boatData/query-allnumm', // 获取船舶总数
  getNewAlarmTotal: base_rest + 'shipAlarm/findNewestAlarm', // 获取最新告警数量
  getAlarmRanking: base_rest + 'shipAlarm/findSortAlarm', // 获取告警排名
  getTrawlerActiveRanking: base_rest + 'dynamicNew/findSailMaxTime', // 渔船活跃状态排名
  getTrawlerTotalOnline: base_rest + 'dynamicNew/total-onlineall', // 获取在线渔船总数
  getPeopleNumber: base_rest + 'boatCrew/getTotalCount', // 获取渔船民的数量
  // 出入港变化趋势
  getTrawlerToPortTrend: base_rest + 'portReport/getFlowInfos',
  // 全局搜索
  fuzzySearchTrawlerByKey: base_rest + 'dynamicNew/getInfoByCache',
  // 渔船分组
  getTrawlerGroupByRegion: base_rest + 'dynamicNew/groupByGeo', // 省市区分组
  getTrawlerGroupByGroup: base_rest + 'dynamicNew/groupByPointType', // 分组渔船
  // 获取船主电话
  getOwnerPhoneByName: base_rest + 'boatOwner/getInfoByName',
  // 获取渔船动态信息
  getTrawlerDynamicByKey: base_rest + 'dynamicNew/getLastByKey',
  // 渔船瓦片服务
  // getTrawlerByPng: 'http://56.80.192.34:6090/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // getTrawlerByPng: 'http://192.168.2.201:8888/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // getTrawlerByPng: 'http://119.167.138.11:6070/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // getTrawlerByPng: 'http://118.190.202.102:6070/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // 119部署环境
  // getTrawlerByPng: 'http://119.167.138.11:6070/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // 内网部署环境
  getTrawlerByPng: 'http://56.80.192.35:6070/service/wmts?layer=jczd%3Ajczd&style=&tilematrixset=EPSG%3A900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng&TileMatrix=EPSG%3A900913%3A{z}&TileCol={x}&TileRow={y}',
  // 调船位
  adjustTrawlerPosition: base_rest + 'dynamicNew/findMovePosition',
  // 筛船
  siftTrawlerList: base_rest + 'dynamicNew/boatPointByLengthAndPower', // 查询
  // 轨迹回放
  getTrawlerTrack: base_rest + 'dynamicHistory/boatTrackWithName', // 通过船名查询轨迹
  getTrawlersTrack: base_rest + 'dynamicHistory/boatsTrackByName', // 船名数组查询轨迹
  exportTrawlerTrack: base_rest + 'dynamicHistory/exportTrackWithName', // 通过船名导出轨迹
  exportTrawlersTrack: base_rest + 'dynamicHistory/exportTracksByName', // 通过船名数组导出轨迹
  // 智能分析
  getAnalysisPage: base_rest + 'shipAlarm/queryPage', // 分页
  getAnalysisDetail: base_rest + 'shipAlarm/queryById', // 详情
  markEndAnalysis: base_rest + 'shipAlarm/disposeAlarm', // 标记结束
  exportAnalysisList: base_rest + 'shipAlarm/export', // 导出
  // 风场
  // 业务版
  // 拉框搜索
  pullBoxSearch: base_rest + 'dynamicNew/queryRangeSearch',
  // 渔港管理
  getPortArchivesPage: base_rest + 'port/page', // 分页
  getPortList: base_rest + 'port/findAllList', // 列表
  updatePortDetail: base_rest + 'port/update', // 修改
  // 渔港划线
  getVideoScribe: base_rest + 'videosCamera/code', // 获取渔港划线信息
  updateVideoScribe: base_rest + 'videosCamera/updateByCode', // 添加渔港划线信息
  // 渔船管理
  getTrawlerArchivesPage: base_rest + 'boatData/page', // 分页接口
  insertTrawlerDetail: base_rest + 'boatData/save', // 新增
  deleteTrawlerDetail: base_rest + 'boatData/delete', // 删除
  handleFocusTrawler: base_rest + 'boatData/addBatchMainShip', // 添加/删除重点关注
  handleDisturbTime: base_rest + 'boatData/addDisturbMainShip', // 设置免打扰
  getCrewPage: base_rest + 'boardPerson/page', // 分页-船上人员
  getTrawlerTerminalDetail: base_rest + 'dynamicNew/getLastByKey', // 获取渔船终端信息
  handleHighLightTrawler: base_rest + 'boatData/updateHighlight', // 标记/取消高亮船只
  getTrawlerDetailByName: base_rest + 'boatData/getByBoatName', // 通过船名获取渔船信息
  // 渔船收藏
  getTrawlerCollectionPage: base_rest + 'userPointBoat/page', // 分页
  addTrawlerCollection: base_rest + 'userPointBoat/save', // 添加
  deleteTrawlerCollection: base_rest + 'userPointBoat/remove', // 删除
  // 渔船作业类型
  getTrawlerTaskType: base_rest + 'dynamicNew/boatUsageNumOnline',
  // 人员管理
  getCrewArchivesPage: base_rest + 'boatCrew/page', // 分页
  getCrewReportList: base_rest + 'boardPerson/getPortReport', // 报备信息list
  exportCrewPage: base_rest + 'boardPerson/export', // 船上人员导出
  // 船东管理
  getBoatOwnerPage: base_rest + 'boatOwner/page', // 分页
  // 重点区域（时空分析）
  getKeyAreaPage: base_rest + 'mainArea/page', // 分页
  insertArea: base_rest + 'mainArea/save', // 新增
  deleteArea: base_rest + 'mainArea/remove', // 删除
  updateArea: base_rest + 'mainArea/update', // 修改
  analyseAreaSituation: base_rest + 'dynamicHistory/queryRangeSearch', // 分析区域内渔船信息
  // 手机点子围栏
  getPhoneFencePage: base_rest + 'electronicFence/page', // 手机电子围栏分页
  // 轨迹回放
  getTrawlerDynamicPage: base_rest + 'dynamicNew/boatInfoList', // 获取渔船最新动态分页
  // 智能分析
  getAnalysisTrendData: base_rest + 'shipAlarm/typeNumTrend', // 趋势
  getAnalysisProportionData: base_rest + 'shipAlarm/getProportion', // 占比
  getAnalysisSwitchStatus: base_rest + 'shipAlarmConfig/valueByType', // 获取状态
  changeAnalysisSwitchStatus: base_rest + 'shipAlarmConfig/updateValue', // 改变状态
  changeAnalysisSwitchStatusList: base_rest + 'shipAlarmConfig/updateValueList', // 改变状态
  // 进出港管理
  getReportPage: base_rest + 'portReport/page', // 分页
  // 自动进出港记录
  getDistinguishPage: base_rest + 'portReport/pageAuto', // 分页
  // 视频监控管理
  getVideoPage: base_rest + 'videosCamera/page', // 分页
  saveVideoDetail: base_rest + 'videosCamera/save', // 新增/修改
  deleteVideoDetail: base_rest + 'videosCamera/delete', // 删除
  getDepartList: base_rest + 'sysOrg/selectByDrop', // 录入单位分页
  exportVideoTemplate: base_rest + 'videosCamera/importDataTemplate', // 模板导出
  exportVideoData: base_rest + 'videosCamera/exportData', // 数据导出
  importVideoTemplate: base_rest + 'videosCamera/importData', // 模板导入数据
  // 视频方案配置
  getVideoSchemePage: base_rest + 'vediosPlan/page', // 分页
  insertVideoScheme: base_rest + 'vediosPlan/save', // 新增
  updateVideoScheme: base_rest + 'vediosPlan/update', // 修改
  deleteVideoScheme: base_rest + 'vediosPlan/delete', // 删除
  // 执法管理
  getLawMangePage: base_rest + 'lawEnforce/page', // 分页
  insertLawDetail: base_rest + 'lawEnforce/save', // 新增
  updateLawDetail: base_rest + 'lawEnforce/update', // 修改
  deleteLawDetail: base_rest + 'lawEnforce/delete', // 删除
  // 单位分类
  getOrganizationTree: base_rest + 'sysOrg/tree', // 结构树
  // 日志管理
  getLogPage: base_rest + 'operateLog/page', // 分页
  // 菜单管理
  getMenuList: base_rest + 'sysPower/tree', // LIST
  insertMenu: base_rest + 'sysPower/add', // 新增
  deleteMenu: base_rest + 'sysPower/delete', // 删除
  updateMenu: base_rest + 'sysPower/edit', // 修改
  // 角色管理
  getRolesPage: base_rest + 'sysRole/page', // 分页
  getRolesList: base_rest + 'sysRole/list', // LIST
  insertRole: base_rest + 'sysRole/save', // 新增
  updateRole: base_rest + 'sysRole/update', // 修改
  deleteRole: base_rest + 'sysRole/delete', // 删除
  // 账号管理
  getAccountPage: base_rest + 'sysAccountInfo/page', // 分页
  getAccountDetail: base_rest + 'sysAccountInfo/detail', // 详情
  insetAccount: base_rest + 'sysAccountInfo/save', // 新增
  updateAccount: base_rest + 'sysAccountInfo/update', // 修改
  deleteAccount: base_rest + 'sysAccountInfo/delete', // 删除
  resetPassword: base_rest + 'sysAccountInfo/resetPwd', // 重置密码
  updatePassword: base_rest + 'sysAccountInfo/editPwd', // 密码修改
  // 字典管理
  getDictionaryPage: base_rest + 'sysDict/page', // 分页
  getDictionaryList: base_rest + 'sysDict/parentNodes', // LIST
  insertDictionary: base_rest + 'sysDict/add', // 新增
  deleteDictionary: base_rest + 'sysDict/delete' ,// 删除
  // 定时任务
  getTimingTasksPage: task_rest + 'job/page', // 分页
  insertTimingTasks: task_rest + 'job/save', // 新增
  deleteTimingTasks: task_rest + 'job/delete', // 删除
  updateTimingTasks: task_rest + 'job/update', // 修改
  toggleTimingTasksStatus: task_rest + 'job/changeStatus', // 切换状态
  // 涉海要素
  getSeaElementPage: base_rest + 'seaElement/page', // 分页
  saveSeaElement: base_rest + 'seaElement/save', // 添加
  deleteSeaElement: base_rest + 'seaElement/delete', // 删除
  updateSeaElement: base_rest + 'seaElement/update', // 编辑
  exportSeaElement: base_rest + 'seaElement/export' ,// 导出
  getSelectedList: base_rest + 'seaElement/getSelectedList', // 获取全部派出所
  getSelectedBoatList: base_rest + 'seaElement/getSelectedBoatList', // 获取渔船列表
  getDetails: base_rest + 'seaElement/getDetails', // 根据id获取详细信息
  // 互动交流
  getCommunicateList: base_rest + 'communicate/page', // 分页
  communicateSave: base_rest + 'communicate/save', // 添加
  communicateUpdate: base_rest + 'communicate/update', // 编辑
  communicateDelete: base_rest + 'communicate/delete', // 删除
  // 随手记
  getNoteTakingList: base_rest + 'noteTaking/getNoteTakingList', // 列表
  // imsi模块
  getImsiPage: base_rest + 'imsiList/page', // 分页
  insertImsi: base_rest + 'imsiList/save', // 新增
  deleteImsi: base_rest + 'imsiList/delete', // 删除
  updateImsi: base_rest + 'imsiList/update', // 修改
  // 短信发送
  getMessagePage: base_rest + 'messageList/page', // 分页
  insertMessageSend: base_rest + 'messageList/save', // 新增
  deleteMessageSend: base_rest + 'messageList/delete', // 删除
  // 分割线-------------------------------------------------------------------------------------
  // 制捕区域
  res_catch: base_rest + 'shipAlarm/areaGeoJson',
  // 获取市区json-未报备出海
  getRegion: '/map/region.json', // 市区json
  // 系统静态资源
  res_agreement_waters: '/map/agreement-waters.json', // 界定水域
  res_fishingArea: '/map/fishing-area.json' // 渔区
  // 分割线-------------------------------------------------------------------------------------
}

export default api
