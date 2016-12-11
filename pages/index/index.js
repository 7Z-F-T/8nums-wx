//index.js
//获取应用实例
var app = getApp();

import {eightNums_AStar} from "astar.js";
var astar = new eightNums_AStar();
const DEFAULT = [1,2,3,4,5,6,7,8,0];
/**
 * @description [i][j]，在i位置的元素值与上下左右进行交换后的位置，打表
 */
var CG_TABLE = [[3,-1,1,-1],[4,-1,2,0],[5,-1,-1,1],[6,0,4,-1],[7,1,5,3],[8,2,-1,4],[-1,3,7,-1],[-1,4,8,6],[-1,5,-1,7]];
var UP = 0;
var DOWN = 1;
var LEFT = 2;
var RIGHT = 3;


Page({
  data: {
    curArr: DEFAULT,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    console.log('onLoad')
    this.curArr = DEFAULT.slice(0, DEFAULT.length);
  },

  /**
   * 随机生成序列
   */
  random: function(e) {
    do {
      astar.setRandom();
    } while ( !astar.hasSolution() );
    console.log( "八数码问题-A*启发式搜索" );
    console.log( "原状态 ", astar.getSourceArr() );
    console.log( "目标状态 ", astar.getTargetArr() );
    this.changeState(astar.getSourceArr());
    
  },

  /**
   * 自动分析运行
   */
  autoRun: function(e) {
    var result = astar.getPath();
    var that = this;
    console.log(result);
    showState(result.path, 0)

    function showState(arr, index) {
      if (index >= arr.length) {
        return;
      }
      that.changeState(arr[index]);
      setTimeout(function(e){
        showState(arr, index + 1);
      }, 500);
    }
  },

  /**
   * 显示成功对话框
   */
  showSuccess: function(e) {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },

  /**
   * 改变显示状态, 加成功判断
   */
  changeState: function(arr) {
    this.curArr = arr;
    this.setData({
        curArr: arr,
      });
    console.log(arr.toString())
    console.log(DEFAULT.toString())
    if (arr.toString() == DEFAULT.toString()) {
      this.showSuccess();
    }
  },

  /**
   * 触摸事件
   */
  touchStart: function(e) {
    console.log(e);
    this.downX = e.touches[0].pageX;
    this.downY = e.touches[0].pageY;
  },

  touchEnd: function(e) {
    console.log(e);
    var dx = e.changedTouches[0].pageX - this.downX;
    var dy = e.changedTouches[0].pageY - this.downY;
    if (Math.abs(dy) > Math.abs(dx)) {
      if (dy > 0) {
        console.log('down');
        this.changeByAction(DOWN);
      } else {
        console.log('up');
        this.changeByAction(UP);
      }
    } else {
      if (dx > 0) {
        console.log('right');
        this.changeByAction(RIGHT);
      } else {
        console.log('left');
        this.changeByAction(LEFT);
      }
    }
  },

  /**
   * 上下左右事件来改变状态
   */
  changeByAction: function(action) {
    var arr = this.curArr;
    var blankIndex = this.findBlank(arr);
    var destIndex = CG_TABLE[blankIndex][action];
    if (destIndex < 0) {
      return;
    }
    var tmp = arr[blankIndex];
    arr[blankIndex] = arr[destIndex];
    arr[destIndex] = tmp;
    this.changeState(arr);
  },

  findBlank: function(arr) {
    for(var i=0;i < arr.length;i++) {
      if (arr[i] == 0 ) return i;
    }
  }

})
