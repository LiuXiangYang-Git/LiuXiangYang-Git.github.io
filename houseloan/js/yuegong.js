define(function(require, exports, module) {
	require('jquery');
	alertM = require('alert');
	require('househighcharts');
		
	
	//15年3月1日利率
	/*var lilv_array = new Array;
	lilv_array[31] = new Array;
	lilv_array[31][1] = new Array;
	lilv_array[31][2] = new Array;
	lilv_array[31][1][5] = 0.0575;//商贷 1～5年 5.75%
	lilv_array[31][1][10] = 0.0590;//商贷 5-30年 5.9%
	lilv_array[31][2][5] = 0.0350;//公积金 1～5年 3.5%
	lilv_array[31][2][10] = 0.0400;//公积金 5-30年 4.0%*/



	var lilv_array = new Array;
	lilv_array[31] = new Array;
	lilv_array[31][1] = new Array;
	lilv_array[31][2] = new Array;
	lilv_array[31][1][5] = 0.069;//商贷 1～5年 5.75%
	lilv_array[31][1][10] = 0.0705;//商贷 5-30年 5.9%
	lilv_array[31][2][5] = 0.0350;//公积金 1～5年 3.5%
	lilv_array[31][2][10] = 0.0400;//公积金 5-30年 4.0%
	
	//弹出下拉框
	$(".xf-select").click(function(){
		$(".xf-select").css({zIndex:1});
		$(".xf-select ul").hide();
		$(this).css({zIndex:999});
		if($("ul",this).is(":visible")){
			$("ul",this).hide();
		}else{
			$("ul",this).show();
		}
		return false;
	});
	
	
	
	$("body").click(function(){$(".xf-select ul").hide();});
	
	var junjia,zongjia,anjie,daikuan,shoufu;
	
	
	
	//下拉框选项单击事件
	$(".xf-select ul li").mouseenter(function(){
		$(this).addClass("on");
	}).mouseleave(function(){
		$(this).removeClass("on");
	}).click(function(){
		$(this).parent().prev().find("span").text($(this).text());
		$(this).parent().prev().find("input").val($(this).data("code"));
		$(this).parent().hide();
		
		//贷款总额
		junjia = $("#zongjia").data("junjia");
		zongjia = Math.round($("#housetype").val() * junjia / 10000);
		anjie = $("#val_loanratio").val();

		//填充总价格
		$("#label_price").html("<p><strong>"+ zongjia +"</strong>万元<span>（均价<em>"+ junjia +"</em>元/m²）</span></p>");
		
		daikuan = Math.round(anjie/100*zongjia);
		shoufu = zongjia - daikuan;

		$("#label_totalprice").html("（贷款总额"+daikuan+"万）");
		
		if($("#val_loantype").val() == 3){
			$("#content_scale").removeClass("none");
		}else{
			$("#content_scale").addClass("none");
		}
		return false;
	});
	
	
	
	
	//本息还款的月还款额(参数: 年利率/贷款总额/贷款总月份)
	function getMonthMoney(lilv,total,month){
		var lilv_month = lilv / 12;//月利率
		return total * lilv_month * Math.pow(1 + lilv_month, month) / ( Math.pow(1 + lilv_month, month) -1 );
	}
	
	
	//验证是否为数字
	function reg_Num(str){
		if (str.length==0){return false;}
		var Letters = "1234567890.";
	
		for (i=0;i<str.length;i++){
			var CheckChar = str.charAt(i);
			if (Letters.indexOf(CheckChar) == -1){return false;}
		}
		return true;
	}



	function jisuan(){
		junjia = $("#zongjia").data("junjia");
		zongjia = Math.round($("#housetype").val() * junjia / 10000);
		anjie = $("#val_loanratio").val();

		//填充总价格
		$("#label_price").html("<p><strong>"+ zongjia +"</strong>万元<span>（均价<em>"+ junjia +"</em>元/m²）</span></p>");
		
		daikuan = Math.round(anjie/100*zongjia);
		shoufu = zongjia - daikuan;

		
		//商业贷款、住房公积金贷款、组合贷款
		var loantype = $("#val_loantype").val(); 
		
		
		//贷款年数，5年 | 5年以上
		var years = $("#val_loanmonth").val() < 5 ? 5 : 10;
		
		//还款期数
		var month = $("#val_loanmonth").val() * 12; 
		
		
		var yuehuankuan,lixi;
		if(loantype < 3){
			//商业&公积金贷款

			//月还款
			yuehuankuan = Math.round(getMonthMoney(lilv_array[31][loantype][years],daikuan,month)*10000); //月还款
			
			//应还利息
			lixi = Math.round(yuehuankuan * month / 10000 - daikuan); 
		}else{
			//组合贷款
			
			var lilv_sd = lilv_array[31][1][years]; //得到商贷利率
			var lilv_gjj = lilv_array[31][2][years]; //得到公积金利率
			
			var daikuan_sy = $("#val_loanbussiness").val(); //商业性贷款总额
			var daikuan_gjj = $("#val_loanfund").val(); //公积金贷款总额
			
			if(daikuan_gjj == ""){
				$("#gjjtip").removeClass("none");
				return;
			}else if(daikuan_sy == ""){
				$("#sdtip").removeClass("none");
				return;
			}else if(!reg_Num(daikuan_sy) || !reg_Num(daikuan_gjj)){
				alertM("贷款金额必须为数字",{cName: "error"});
				return;
			}
			
			//金额错误
			
			if(parseInt(daikuan_sy)+parseInt(daikuan_gjj) != daikuan){
				$("#gjjtip span").text("总金额错误").removeClass("none");
				$("#sdtip span").addClass("none");
				$("#gjjtip").removeClass("none");
				return;
			}else{
				$("#gjjtip span").addClass("none");
			}
			
			
			//月还款
			var month_money = getMonthMoney(lilv_sd,daikuan_sy,month) + getMonthMoney(lilv_gjj,daikuan_gjj,month);//调用函数计算
			yuehuankuan = Math.round(month_money*10000);
			
			//还款总额
			var all_total1 = month_money * month;
			//支付利息款
			lixi = Math.round(all_total1 - daikuan);
		}
		
		
		
		//填充内容
		$(".price").text(yuehuankuan);
		$(".legend-pay span").html("参考首付：<b>"+shoufu+"万（"+(100-anjie)/10+"成）</b>");
		$(".legend-price span").html("贷款金额：<b>"+daikuan+"万（"+(anjie/10)+"成）</b>");
		$(".legend-rate span").html("支付利息：<b>"+lixi+"万</b>");
		$(".legend-rate span").html("支付利息：<b>"+lixi+"万</b><br><em>（利率公积金"+Math.round(lilv_array[31][2][years]*10000)/100+"%，商业性"+Math.round(lilv_array[31][1][years]*10000)/100+"%）</em>");
		
		//初始化圆饼图
		initPie(shoufu,daikuan,lixi);
	}
	
	
	//初始化
	jisuan();
	
	
	
	//开始计算按钮
	$("#btn_startup").click(function(){
		jisuan();
	});
		
		
		
	//初始化统计图
	function initPie(shoufu,daikuan,lixi){
		var arrPieData = [{name: "参考首付",y: shoufu,events: {mouseOver: function() {
				$(".legend-pay").addClass("on")
			},mouseOut: function() {
				$(".legend-pay").removeClass("on")
			}}}, {name: "贷款金额",y: daikuan,events: {mouseOver: function() {
				$(".legend-price").addClass("on")
			},mouseOut: function() {
				$(".legend-price").removeClass("on")
			}}}, {name: "支付利息",y:lixi,events: {mouseOver: function() {
				$(".legend-rate").addClass("on")
			},mouseOut: function() {
				$(".legend-rate").removeClass("on")
			}}}];
		
		var a = new Highcharts.Chart({
			colors: ["#2F69BF", "#A2BF2F", "#BF5A2F"],
			chart: {
				type: "pie",
				renderTo: "result-charts",
				backgroundColor: "#f9f9f9"
			},
			title: {
				text: " ",
			},
			credits: {
				enabled: false
			},
			tooltip: {
				enabled: false
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: "pointer",
					borderWidth: 1,
					dataLabels: {
						enabled: false
					},
					innerSize: "40%",
					shadow: false
				}
			},
			series: [{
				type: "pie",
				data: arrPieData
			}]
		});
	}

});