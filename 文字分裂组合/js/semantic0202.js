var root = 'http://47.105.62.63:5000';
//x的值相对于文档的左边缘。y的值相对于文档的上缘 //x,y是全局变量;
var x, y;
// 提交结果的参数 设备 位置 状态 危害
// 数组去重
var unique = function (arr) {
	var newArr = [arr[0]];
	for (var i = 1; i < arr.length; i++) {
		if (newArr.indexOf(arr[i]) == -1) {
			newArr.push(arr[i]);
		}
	}
	return newArr;
}
// 分析结果
var mCSB_2_container = $('#mCSB_2_container');
var timer = null;
// 拖拽节点到设备， 位置, 状态， 危害 生成新的标签
// 删除节点
$('.get_text').on('mousedown', 'li', function (e) {
	if ($(this).attr('type') === '添加词') {
		$(this).remove();
		return
	}
	$(this).remove();
	e.preventDefault();
});
var addToGettext = function (boxName) {
	var selecteds = mCSB_2_container.find('.stress')
	// 枚举可遍历参数
	var Ob_names = Object.keys(selecteds);
	var new_Ob_names = Ob_names.splice(0, Ob_names.length - 4);
	if (new_Ob_names.length <= 0) return;
	new_Ob_names.forEach(function (val) {
		// 添加节点并删除多余的类
		$(boxName).append(selecteds[val]).find('li').removeClass('stress, normal, ui-state-default').removeAttr('data-index').removeAttr('option-data');
		mCSB_2_container.find('li').removeClass('stress').addClass('normal');
	})
	ajaxFun($('#input_sec1').val().trim());
}
// 获取同类型的词
var select_type = function (el) {
	var type = $(el).html();
	$('.mod_result_content .current').removeClass('current');
	$(el).addClass('current');
	$('.select_type').removeClass('select_type').addClass('normal');
	$('[option-data="' + type + '"]').removeClass('normal').addClass('select_type');
}
$('#input_sec1').limitTextarea({
	maxNumber: 500, //最大字数
	position: 'bottom',
	//输入后，字数未超出时调用的函数
	onOk: function () {
		$('.txt_warm').fadeOut();
	},
	//输入后，字数超出时调用的函数，这里把文本区域的背景变为粉红色
	onOver: function () {
		$('.txt_warm').fadeIn();
		$('#input_sec1').val($('#input_sec1').val().substring(0, 110) + "...");
	}
});
//阻止浏览器默认右键点击事件
mCSB_2_container.bind("contextmenu", 'li', function () {
	return false;
})
mCSB_2_container.on("mousedown", 'li', function (event) {
	if (event.which == 3) {
		$(this).removeClass('stress').addClass('normal');
	} else if (event.which == 1) {
		var self = $(this)
		clearTimeout(timer)
		timer = setTimeout(function () {
			var hasStress = self.hasClass("stress");
			if (!hasStress) {
				self.removeClass("normal").addClass("stress");
			}
			// 判断前面节点是否选中
			if (self.prev().hasClass('stress') && !self.next().hasClass('stress')) {
				self.after(`<li class="ui-state-default txt_bor stress" option_type="joined"}>${self.prev('.stress').text()}${self.text()}</li>`);
				self.prev('.stress').remove()
				self.remove();
			} else if (!self.prev().hasClass('stress') && self.next().hasClass('stress')) {
				self.before(`<li class="ui-state-default txt_bor stress" option_type="joined"}>${self.text()}${self.next('.stress').text()}</li>`);
				self.next('.stress').remove()
				self.remove();
			}
		}, 200)
	}
});
mCSB_2_container.on('dblclick', 'li', function () {
	clearTimeout(timer);
	var hasStress = $(this).hasClass("stress");
	var $text = $(this);
	var getText = $text.text();
	var str_len = getText.length;
	if (hasStress) {
		$(this).removeClass("stress").addClass("normal");
	}
	if (str_len > 1) {
		$(this).before(`<li class="ui-state-default txt_bor stress" option-data=${$(this).attr('option-data')}>${getText.substring(0, Math.floor(str_len / 2))}</li>`)
		$(this).after(`<li class="ui-state-default txt_bor stress" option-data=${$(this).attr('option-data')}>${getText.substring(Math.floor(str_len / 2), str_len)}</li>`)
		$(this).remove()
	}
})
$(document).mouseup(function (e) {
	x = e.pageX;
	y = e.pageY;
	//判断鼠标是否在设备框中
	var device = $('.device'),//获取你想要的DIV
		y1 = device.offset().top,  //div上面两个的点的y值
		y2 = y1 + device.height(),//div下面两个点的y值
		x1 = device.offset().left,  //div左边两个的点的x值
		x2 = x1 + device.width();  //div右边两个点的x的值
	//判断鼠标是否在位置框中
	var Location = $('.Location'),//获取你想要的DIV
		l_y1 = Location.offset().top, //div上面两个的点的y值
		l_y2 = l_y1 + Location.height(),//div下面两个点的y值
		l_x1 = Location.offset().left,//div左边两个的点的x值
		l_x2 = l_x1 + Location.width();  //div右边两个点的x的值
	//判断鼠标是否在状态框中
	var Status = $('.status'),//获取你想要的DIV
		s_y1 = Status.offset().top,  //div上面两个的点的y值
		s_y2 = s_y1 + Status.height(),//div下面两个点的y值
		s_x1 = Status.offset().left, //div左边两个的点的x值
		s_x2 = s_x1 + Status.width();  //div右边两个点的x的值
	//判断鼠标是否在危害框中
	var danger = $('.danger'),//获取你想要的DIV
		d_y1 = danger.offset().top,  //div上面两个的点的y值
		d_y2 = d_y1 + danger.height(),//div下面两个点的y值
		d_x1 = danger.offset().left, //div左边两个的点的x值
		d_x2 = d_x1 + danger.width();  //div右边两个点的x的值
	//判断鼠标是否在某危害框中
	if (!(x < x1 || x > x2 || y < y1 || y > y2)) {

		addToGettext('.device')
	} else if (!(x < l_x1 || x > l_x2 || y < l_y1 || y > l_y2)) {
		addToGettext('.Location')
	} else if (!(x < s_x1 || x > s_x2 || y < s_y1 || y > s_y2)) {
		addToGettext('.status')
	} else if (!(x < d_x1 || x > d_x2 || y < d_y1 || y > d_y2)) {
		addToGettext('.danger')
	}
});
// 危害输入框添加新词
$('#addToDanger').keydown(function (e) {
	if (e.keyCode == 13) {
		$('.danger').append(`<li class="txt_bor" type="添加词">${$(this).val()}</li>`);
		$(this).val('');
	}
});
// 文字输入发送请求
function ajaxFun(val) {
	return $.ajax({
		type: "POST",
		url: `${root}/api/getsentence`,
		data: {
			text: val
		},
		dataType: "json",
		success: function (data) {
			var $a = data.a;
			if ($a.length > 0) {
				$('#mCSB_2_container').html('');
				$('#wtype_ret').html('');
				var types = $a.map(val => val.type),
					words = $a.map(val => val.word);
				words.forEach(function (val, index) {
					$('#mCSB_2_container').append(`<li class="ui-state-default txt_bor normal" data-index=${index} option-data=${types[index]}>${val}</li>`)
				})
				unique(types).forEach(function (val) {
					$('#wtype_ret').append(`<a href="javascript:void(0)" onclick="select_type(this)" title="${val}">${val}</a>`)
				})
			}
		}
	})
}
ajaxFun($('#input_sec1').val().trim());
$('#input_sec1').bind('input propertychange', 'textarea', function () {
	ajaxFun($(this).val().trim())
});
var getChildren = function (ParentName) {
	var createArray = [];
	var childs = $(ParentName).children();
	var len = childs.length;
	for (let i = len - 1; i >= 0; i--) {
		var get_type = childs[i].attributes.option_type;
		createArray[i] = {
			text: childs[i].innerHTML,
			type: get_type ? get_type.nodeValue : 'nojoined'
		}
	}
	return createArray
}
// 点击提交按钮
$('.submit').click(function () {
	var textarea = $('#input_sec1').val().trim();
	$('#addToDanger').val('');
	var deviceChilds = getChildren('.device'),
		locationChilds = getChildren('.Location'),
		statusChilds = getChildren('.status'),
		dangerChilds = getChildren('.danger');
	var data = {
		text: textarea,
		device_text: deviceChilds,
		location_text: locationChilds,
		status_text: statusChilds,
		danger_text: dangerChilds,
	}
	// console.log(data)
	// 防止空表单提交
	if (!(textarea && data.device_text !== "[]" || textarea && data.location_text !== "[]" || textarea && data.status_text !== "[]" || textarea && data.danger_text !== "[]")) {
		alert('请填写参数信息');
		return
	}
	return Submit(data)
});
var clearFun = function () {
	var clearTimer = null;
	clearTimeout(clearTimer);
	clearTimer = setTimeout(function () {
		$("#loadingDivBack").hide();
		$("#loadingDiv").hide();
		$('.device').html('')
		$('.Location').html('')
		$('.status').html('')
		$('.danger').html('')
		$('#loadingDiv').text('正在提交，请等待...')
	}, 1000)
}
// 提交
function Submit($data) {
	return $.ajax({
		type: "POST",
		url: `${root}/api/insertdata`,
		data: JSON.stringify($data),
		success: function (data) {
			showLoading();
			var flag_timer = null;
			clearTimeout(flag_timer);
			flag_timer = setTimeout(function () {
				if (data.flag === 1) {
					ajaxFun($('#input_sec1').val().trim());
					$('#loadingDiv').text('提交成功');
					clearFun();
				} else {
					$('#loadingDiv').text('提交失败');
					clearFun()
				}
			}, 2000)
		}
	})
}
// 显示loading
function showLoading() {
	var _PageHeight = $(document).height();//document.documentElement.clientHeight,
	_PageWidth = document.documentElement.clientWidth;
	//计算loading框距离顶部和左部的距离（loading框的宽度为215px，高度为61px）
	var _LoadingTop = $(document).scrollTop() + document.documentElement.clientHeight / 2;//折叠高度+1/2浏览器高度得到当前视图中间
	_LoadingLeft = _PageWidth > 215 ? (_PageWidth - 215) / 2 : 0;
	$("#loadingDivBack").height(_PageHeight);
	$("#loadingDiv").css("left", _LoadingLeft + "px");
	$("#loadingDiv").css("top", _LoadingTop + "px");
	$("#loadingDivBack").show();
	$("#loadingDiv").show();
}