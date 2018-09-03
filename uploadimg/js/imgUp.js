$(function () {
	var imglength = 10
	var defaults = {
		fileType: ["jpg", "png", "bmp", "jpeg"],   // 上传文件的类型
		fileSize: 1024 * 1024 * 10                  // 上传文件的大小 10M
	};
	/*点击图片的文本框*/
	$(".file").change(function () {
		var idFile = $(this).attr("id");
		var file = document.getElementById(idFile);
		var imgContainer = $(".z_photo"); //存放图片的父亲元素
		var fileList = file.files; //获取的图片文件
		// var input = $(this).parent();//文本框的父亲元素
		var imgArr = [];
		//遍历得到的图片文件
		var numUp = imgContainer.find(".up-section").length;
		var totalNum = numUp + fileList.length;  //总的数量
		if (fileList.length > imglength || totalNum > imglength) {
			alert(`上传图片数目不可以超过${imglength}个，请重新选择`);  //一次选择上传超过5个 或者是已经上传和这次上传的到的总数也不可以超过5个
		}
		else if (numUp < imglength) {
			fileList = validateUp(fileList);
			var swiper = new Swiper('.swiper-container2', {
				slidesPerView: imglength,
				spaceBetween: 10,
				freeMode: true,
			});
			imgContainer.find('.up-section').remove();
			for (var i = 0; i < fileList.length; i++) {
				var imgUrl = window.URL.createObjectURL(fileList[i]);
				imgArr.push(imgUrl);
				var $section = $("<section class='up-section loading'>");
				imgContainer.append($section);
				var $img0 = $("<img class='close-upimg'>").on("click", function (event) {
					event.preventDefault();
					event.stopPropagation();
					$(".works-mask").show();
					delParent = $(this).parent();
				});
				$img0.attr("src", "images/a7.png").appendTo($section);
				var $img = $("<img class='up-img'>");
				$img.attr("src", imgArr[i]);
				$img.appendTo($section);
				var $p = $("<p class='img-name-p'>");
				$p.html(fileList[i].name).appendTo($section);
				var $input = $("<input id='taglocation' name='taglocation' value='' type='hidden'>");
				$input.appendTo($section);
				var $input2 = $("<input id='tags' name='tags' value='' type='hidden'/>");
				$input2.appendTo($section);
			}
		}
		setTimeout(function () {
			$(".up-section").removeClass("loading");

		}, 450);
		// numUp = imgContainer.find(".up-section").length;
		// if (numUp >= imglength) {
		// 	$(this).parent().hide();
		// }
		console.log(imgArr)
		uploadGenerator(imgArr)
	});

	function validateUp(files) {
		var arrFiles = [];//替换的文件数组
		for (var i = 0, file; file = files[i]; i++) {
			//获取文件上传的后缀名
			var newStr = file.name.split("").reverse().join("");
			if (newStr.split(".")[0] != null) {
				var type = newStr.split(".")[0].split("").reverse().join("");
				console.log(type + "===type===");
				if (jQuery.inArray(type, defaults.fileType) > -1) {
					// 类型符合，可以上传
					if (file.size >= defaults.fileSize) {
						alert(file.size);
						alert('您这个"' + file.name + '"文件大小过大');
					} else {
						// 在这里需要判断当前所有文件中
						arrFiles.push(file);
					}
				} else {
					alert('您这个"' + file.name + '"上传类型不符合');
				}
			} else {
				alert('您这个"' + file.name + '"没有类型, 无法识别');
			}
		}
		return arrFiles;
	}
	function uploadGenerator(uploadQueue) {
		$('.swiper-container1 .swiper-wrapper').html('');
		if (uploadQueue.length > 0) {
			$.ajax({
				type: "POST",
				url: '/img_list',
				data: { img_list: uploadQueue },
				success: function (response) {
					console.log(response)
				}
			})
			var imgAnalysis = $(".swiper-container1 .swiper-wrapper"); //存放图片的父亲元素
			for (let i = 0; i < uploadQueue.length; i++) {
				var $analysis = $("<div class='swiper-slide'>");
				imgAnalysis.append($analysis);
				var $analysis_img = $("<img class='uplod-img'>");
				$analysis_img.attr('src', uploadQueue[i]);
				$analysis_img.appendTo($analysis)
			}
			var mySwiper = new Swiper('.swiper-container1');
			mySwiper.on('slideChangeTransitionEnd', function () {
				$('.up-section').css('opacity', '0.2');
				$('.up-section').eq(mySwiper.activeIndex).css('opacity', '1');
				console.log(mySwiper.activeIndex)
			});
		}
	}
})