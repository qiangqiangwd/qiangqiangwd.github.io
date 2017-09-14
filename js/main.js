/**
 * Created by Administrator on 2017/9/13 0013.
 */

//返回顶部
(function(){
    $(document).scroll(function(){
        var st = document.body.scrollTop;
        if(st > 60){
            $('#returnTop').css('opacity','1');
        }else{
            $('#returnTop').css('opacity','0');
        }
    });
})();
function rT(e){
    //获取点击时的滚动条高度
    var st = document.body.scrollTop ,time;
    if($(e).attr('move') !== 'true' && st>0){
        $(e).attr('move','true');//添加正在进行中的标识，防止重复点击
        time= setInterval(function(){
            document.body.scrollTop -= 30;
            //有两种情况下会停止，向下滚动滚动条和到达顶部时
            if(st<=10 || st<document.body.scrollTop){
                clearInterval(time);
                $(e).attr('move','false');
            }
            st = document.body.scrollTop;
        },10);
    }
}

//走廊效果js
(function($){
    var dirs = ['top','right','bottom','left'];
    var imgDirs,moveInF,moveInC,time;
    var imgMOve = {
        //初始化插件，并获取初始值
        init:function(opt){
            var opts = opt || {};
            moveInF = opts.moveInF;
            moveInC = opts.moveInC;
            time = opts.time || 250; //运动的速度（默认250ms）
            this.giveAnimate();
        },
        checkDire : function(element,e){

            var x1,y1,x0,y0,x2,y2;

            //这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。分别表示元素各边与页面上边和左边的距离。
            var rect = element.getBoundingClientRect();

            //当检测不到rect.width时，给它赋值
            if(!rect.width){
                rect.width = rect.right - rect.left;
            }
            //当检测不到rect.height时，给它赋值
            if(!rect.height){
                rect.height =  rect.bottom - rect.top;
            }

            //检测左上角的坐标
            x1 = rect.left;
            y1 = -rect.top;
            //检测右下角的坐标
            x2 = rect.left + rect.width;
            y2 = -(rect.top + rect.height);

            //中心点的位置（）
            x0 = rect.left + rect.width/2;
            y0 = -(rect.top + rect.height/2);

            //计算对角线斜率
            var k = (y1 - y2) / (x1 - x2);  //表示斜率（左上和右下）
            var range = [k,-k];

            var x = e.clientX; //窗口距鼠标的x轴位置
            var y = -e.clientY;//窗口距鼠标的y轴位置

            //鼠标和中心点所构成的斜率
            var mk = (y - y0)/(x - x0);

            //如果斜率在range范围内，则鼠标是从左右方向移入移出的
            if (isFinite(mk) && range[0] < mk && mk < range[1]) {
                //根据x与x0判断左右,并返回值
                return x > x0 ? 1 : 3;
            } else {
                //根据y与y0判断上下,并返回值
                return y > y0 ? 0 : 2;
            }


        },
        //根据判断给动画
        giveAnimate : function(){
            moveInF.on('mouseenter',function(){
                var e = window.event||arguments[0];
                var _that = this;

                //判断方向
                imgDirs = imgMOve.checkDire(_that,e);
                //调用动画
                imgMOve.setAnimate(_that,'in',dirs[imgDirs]);
            }).on('mouseleave',function(){
                var e = window.event||arguments[0];
                var _that = this;

                //判断方向
                imgDirs = imgMOve.checkDire(_that,e);
                //调用动画
                imgMOve.setAnimate(_that,'out',dirs[imgDirs]);
            });
        },
        //动画
        setAnimate : function(_that,which,dirs){
            var inOutMove ={
                left:{
                    left:'-100%',
                    top:'0%'
                },
                right:{
                    left:'100%',
                    top:'0%'
                },
                top:{
                    top:'-100%',
                    left:'0'
                },
                bottom:{
                    top:'100%',
                    left:'0'
                }
            };
            var num;

            //判断当前是哪一个图片
            moveInF.each(function(index){
                if(moveInF.get(index) == _that){
                    num = index;
                }
            });

            if(which == 'in'){
                if(dirs=='left'||dirs=='right'){
                    moveInC.eq(num).css(inOutMove[dirs]).animate({
                        left:'0%'
                    },time);
                }else{
                    moveInC.eq(num).css(inOutMove[dirs]).animate({
                        top:'0%'
                    },time);
                }
            }else{
                moveInC.eq(num).css({top:'0%',left:'0%'}).animate(inOutMove[dirs],time);
            }
        }
    };
    window.imgMOve = imgMOve;
})(jQuery);

//瀑布流布局
function waterfall(opt){
    var opts = opt || {},
        _boxs = opts.boxC, //每一个内容层节点
        _boxF = opts.boxF, //总的盒子
        w = _boxs.eq(0).outerWidth(), //内容层的宽度（每一个内容层的宽度需保持一致）
        cols = Math.floor(_boxF.width() / w); //总的盒子宽度 / 内容层的宽度 = 一行中内容层的个数
    var hArr = []; //用于保存第一行每一个内容层的高度
    _boxs.each(function(index,value){
        var h = _boxs.eq(index).outerHeight();
        if(index < cols){
            hArr[index] = h;
        }else{
            var minH = Math.min.apply(null , hArr);  //找出hArr中最小的高度
            var minHIndex = $.inArray(minH , hArr); //利用jquery方法找出数组元素对应的序号
            $(value).css({
                'position' : 'absolute',
                'top' : minH + 'px',
                'left' : minHIndex*w + 'px'
            });
            console.log();
            hArr[minHIndex] += h; //新增的内容层的高度 + hArr中最小的高度
            _boxF.css('height',Math.max.apply(null , hArr) + 'px');//为总的盒子添加一个最大的高度
        }
    });
}