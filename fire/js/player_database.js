var myPlaylist = new jPlayerPlaylist({
	jPlayer: "#jquery_jplayer_N",
	cssSelectorAncestor: "#jp_container_N"
}, musicList, {
	playlistOptions: {
		enableRemoveControls: true
	},
	swfPath: "js/",
	supplied: "webmv, ogv, m4v, oga, mp3",
	useStateClassSkin: true,
	autoBlur: false,
	smoothPlayBar: true,
	keyEnabled: true,
	audioFullScreen: true
});

// 更新歌曲标题
function updateTitle() {
    var playList = myPlaylist.playlist;
    for (var i = 0; i < playList.length; i++) {
        if (i === myPlaylist.current) {
            $(".jp-music-title").html(playList[i].title + " - " + playList[i].artist);
        }
    }
	try {
		if (typeof localStorage === 'object') {
			localStorage.setItem('mid', myPlaylist.current);
		}
	} catch (err) {
		console.log(err)
	}
    
}

// 初始化标题
updateTitle();

// 清空播放列表，只做本地音乐不需要
/*$("#listRemove").click(function() {
	myPlaylist.remove();
    updateTitle();
});*/
$("#playlist-option-autoPlay-true").click(function() {
	myPlaylist.option("autoPlay", true);
});
$("#playlist-option-autoPlay-false").click(function() {
	myPlaylist.option("autoPlay", false);
});
var $bar = $(".bar");
var $scrollBar = $(".scrollBar");
var $maxH = $scrollBar.innerHeight() - $bar.outerHeight();
var $ul = $(".jp-playlist ul");
var $li = $(".jp-playlist ul li");
var disY = 0;
var iScale = 0;
var iSpeed = 0;
$ul.height(1000);
$bar.mousedown(function(event) {
	var event = event || window.event;
	disY = event.clientY - $(this).position().top;
	$(document).bind("mousemove", function(event) {
		var event = event || window.event;
		var iH = event.clientY - disY;
		iH <= 0 && (iH = 0);
		iH >= $maxH && (iH = $maxH);
		$bar.css({
			top: iH + "px"
		});
		iScale = -iH / $maxH;
		$ul.css({
			top: iScale * ($ul.height() - $(".jp-playlist-box").height()) + "px"
		});
		return false;
	});
	$(document).bind("mouseup", function() {
		$(document).unbind("mousemove");
		$(document).unbind("mouseup");
	});
	return false;
});
$(".jp-playlist-box").mouseover(function() {
	addHandler(this, "mousewheel", mouseWheel);
	addHandler(this, "DOMMouseScroll", mouseWheel);
	return false;
});

function addHandler(element, type, handler) {
	return element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler, false)
}

function mouseWheel(event) {
	var event = event || window.event;
	if (event.wheelDelta) {
		iSpeed = event.wheelDelta > 0 ? -3 : 3;
	} else if (event.detail) {
		iSpeed = event.detail < 0 ? -3 : 3;
	}
	move();
	if (event.preventDefault) {
		event.preventDefault();
	}
};

function move() {
	var iH = $bar.position().top;
	iH = iH + iSpeed;
	iH <= 0 && (iH = 0);
	iH >= $maxH && (iH = $maxH);
	$bar.css({
		top: iH + "px"
	});
	iScale = -iH / $maxH;
	$ul.css({
		top: iScale * ($ul.height() - $(".jp-playlist-box").height()) + "px"
	});
	return false;
};

// 隐藏页面加载时的动画
var fold = true;
$(".jp-video").css("left", "-480px");
slideIn($(".jp-video"));
$(".jp-video").animate({
	left: 0
}, "slow", function() {
	slideOut($(this));
}).delay(2000).animate({
	left: "-480px"
}, 350, function() {
	slideIn($(this));
});

	

$("#btnfold").click(function() {
	if (fold) {
		$(".jp-video").animate({
			left: "-480px"
		}, 350, function() {
			slideIn($(this));
		});
	} else {
		$(".jp-video").animate({
			left: 0
		}, 350, function() {
			slideOut($(this));
		});
	}
});

function slideOut(obj) {
	$("#btnfold").attr({
		"title": "点击收缩"
	});
	obj.find("span").css({
		"transform": "rotate(180deg)"
	});
	obj.find("span").css({
		"MozTransform": "rotate(180deg) translateX(2px)"
	});
	obj.find("span").css({
		"WebkitTransform": "rotate(180deg)"
	});
	fold = true;
};

function slideIn(obj) {
	$("#btnfold").attr({
		"title": "点击展开"
	});
	obj.find("span").css({
		"transform": "rotate(0deg)"
	});
	obj.find("span").css({
		"MozTransform": "rotate(0deg) translateX(-2px)"
	});
	obj.find("span").css({
		"WebkitTransform": "rotate(0deg)"
	});
	fold = false;
};
var iOpen = false;
$("#listClose").click(function() {
	if (iOpen) {
		$(".jp-playlist-box").animate({
			height: 0
		}, 100);
		$("#btnfold").css({
			top: "5px"
		});
		$("#listRemove").css({
			display: "none"
		});
		$(".scrollBar").css({
			display: "none"
		});
		$(".jp-video").animate({
			height: "94px",
			bottom: "20px"
		}, 100);
		iOpen = false;
	} else {
		$(".jp-playlist-box").animate({
			height: "80px"
		}, 100);
		$("#btnfold").css({
			top: "52px"
		});
		$("#listRemove").css({
			display: "block"
		});
		$(".scrollBar").css({
			display: "block"
		});
		$(".jp-video").animate({
			height: "175px",
			bottom: "20px"
		}, 100);
		iOpen = true;
	}
});