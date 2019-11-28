var baseurl = 'http://mufa.ngdemo.cn/'; //服务器url
var imgurl = 'http://mufa.ngdemo.cn/statics'; //图片url
// var baseurl = 'http://192.168.0.22:8900/'; //服务器url
// var imgurl = 'http://192.168.0.22:8900/statics'; //图片url

//  复制方法
function copy_fun(copy) { //参数copy是要复制的文本内容
	mui.plusReady(function() {
		//判断是安卓还是ios
		if (mui.os.ios) {
			//ios
			var UIPasteboard = plus.ios.importClass("UIPasteboard");
			var generalPasteboard = UIPasteboard.generalPasteboard();
			//设置/获取文本内容:
			generalPasteboard.plusCallMethod({
				setValue: copy,
				forPasteboardType: "public.utf8-plain-text"
			});
			generalPasteboard.plusCallMethod({
				valueForPasteboardType: "public.utf8-plain-text"
			});
			mui.toast("已成功复制到剪贴板");
		} else {
			//安卓
			var context = plus.android.importClass("android.content.Context");
			var main = plus.android.runtimeMainActivity();
			var clip = main.getSystemService(context.CLIPBOARD_SERVICE);
			plus.android.invoke(clip, "setText", copy);
			mui.toast("已成功复制到剪贴板");
		}
	});
}

// // 上传图片
// var page = null;
// var imgArray = [];
// var imgstr = "";
// page = {
// 	imgUp: function(token) {
// 		var m = this;
// 		plus.nativeUI.actionSheet({
// 			cancel: "取消",
// 			buttons: [{
// 					title: "拍照"
// 				},
// 				{
// 					title: "从相册中选择"
// 				}
// 			]
// 		}, function(e) { //1 是拍照  2 从相册中选择  
// 			switch (e.index) {
// 				case 1:
// 					appendByCamera(token);
// 					break;
// 				case 2:
// 					appendByGallery(token);
// 					break;
// 			}
// 		});
// 	}
// 	//摄像头  
// }
// // 拍照添加文件
// function appendByCamera(token) {
// 	plus.camera.getCamera().captureImage(function(e) {
// 		console.log(e);
// 		plus.io.resolveLocalFileSystemURL(e, function(entry) {
// 			var path = entry.toLocalURL();
// 			console.log(path)
// 			var addli = document.getElementById("addimg");
// 			var li = document.createElement("li");
// 			li.innerHTML = '<img src="' + path + '">';
// 			document.getElementById("ulelem").insertBefore(li, addli);
// 			upload(path,token)
// 		}, function(e) {
// 			mui.toast("读取拍照文件错误：" + e.message);
// 		});

// 	});
// }
// // 从相册添加文件
// function appendByGallery(token) {
// 	plus.gallery.pick(function(path) {
// 		var addli = document.getElementById("addimg");
// 		var li = document.createElement("li");
// 		li.innerHTML = '<img src="' + path + '">';
// 		document.getElementById("ulelem").insertBefore(li, addli);
// 		console.log(path)
// 		upload(path,token)
// 	});
// }
// //服务端接口路径
// var server = baseurl + "mffl/uploadimagefile";
// // 上传文件
// function upload(files,token) {
// 	var files = [{
// 		path: files
// 	}];
// 	if (files.length <= 0) {
// 		plus.nativeUI.alert('没有添加上传文件！');
// 		return;
// 	}
// 	mui.toast('开始上传');
// 	var wt = plus.nativeUI.showWaiting();
// 	var task = plus.uploader.createUpload(server, {
// 			method: 'POST'
// 		},
// 		function(t, status) { //上传完成
// 			plus.nativeUI.closeWaiting();
// 			if (status == 200) {
// 				mui.toast('上传成功');
// 				console.log(t.responseText)
// 				var imgUrl = JSON.parse(t.responseText).datas.max
// 				plus.storage.setItem('uploader', t.responseText);
// 				imgArray.push(imgUrl);
// 				console.log(imgArray.join(';'));
// 				imgstr = imgArray.join(';');
// 				console.log(imgstr)

// 			} else {
// 				mui.toast('上传失败');
// 				wt.close();
// 			}
// 		}
// 	);
// 	task.setRequestHeader('token', token);
// 	for (var i = 0; i < files.length; i++) {
// 		var f = files[i];
// 		task.addFile(f.path, {
// 			key: 'file'
// 		});
// 	}
// 	task.start();
// }
// 修改信息
function changeinfo(token, headimgurl, nickname, phone, code, fun) {
	mui.ajax({
		type: 'post',
		url: baseurl + "mffl/updateSysUser",
		dataType: "json",
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader(
				"token", token
			);
		},
		header: {
			'contentType': "application/x-www-form-urlencoded",
			'token': token
		},
		data: {
			'headImgUrl': headimgurl,
			'nickname': nickname,
			'phone': phone,
			'code': code
		},
		success: function(data) {
			console.log(data);
			if (data.errCode == 200) {
				plus.storage.setItem('userinfo', data.datas);
				mui.toast("修改成功！")
				var userinfo = plus.storage.getItem('userinfo');
				console.log(userinfo)
				fun(data);
			} else {
				mui.toast("data.message")
			}
		},
		error: function(err) {
			console.log(err)
		}
	});
}


// 支付回调合同
function paybackht(token, num) {
	mui.ajax({
		type: 'post',
		url: baseurl + "client/mfflContracts/orderquery",
		dataType: "json",
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader(
				"token", token
			);
		},
		headers: {
			'contentType': "application/x-www-form-urlencoded",
			'token': token
		},
		data: {
			'payMerchantNumber': num
		},
		success: function(data) {
			console.log(data)
			if (data.errCode == 200) {

			} else {
				mui.toast(data.message);
				// mui.back();
			}
		},
		error: function(err) {
			console.log(err)
		}
	})
}


// 支付回调律师函
function paybacklsh(token, num) {
	mui.ajax({
		type: 'post',
		url: baseurl + "client/mfflLawyerletters/orderquery",
		dataType: "json",
		beforeSend: function(XMLHttpRequest) {
			XMLHttpRequest.setRequestHeader(
				"token", token
			);
		},
		headers: {
			'contentType': "application/x-www-form-urlencoded",
			'token': token
		},
		data: {
			'payMerchantNumber': num
		},
		success: function(data) {
			console.log(data)
			if (data.errCode == 200) {

			} else {
				mui.toast(data.message);
				// mui.back();
			}
		},
		error: function(err) {
			console.log(err)
		}
	})
}