var $plant = document.querySelector('#wrap');
var stateInterval = 2500; // 2500ms 更换一种状态
var plantInterval = stateInterval*3; // 更换植物的间隔
var plantList = [
  'baohuayulan',
  'boleshu',
  'changruimulan',
  'chiguoyoushu',
  'ezhangqiu',
  'gongtong',
  'hongdoushan',
  'houmianbaoshu',
  'jinhuacha',
  'putuoeerli',
  'shuiqingshu',
  'shuishan',
  'suoluo',
  'xishu',
  'yinshan'
];
var index = 0;

setInterval(function(){
  $plant.classList.toggle('state-two');
}, stateInterval);

setInterval(function(){
  $plant.className = 'wrap'; // 清除类
  index = (++index === plantList.length) ? 0 : index;
  $plant.classList.add(plantList[index]);
}, plantInterval);
