$(function (){
	var stage = {
		today: new Date(),
		codeLength: 6,
		graph: {
			k: {
				dataSource: "http://route.showapi.com/131-52",
				appid: 48192,
				sign: "2910864053214b3ab64fde0632e509b5",
				type: {
					5: "5分钟K线", 
					30: "30分钟K线",
					60: "60分钟K线",
					day: "日K线", 
					week: "周K线",
					month: "月K线"
				},
				element: "kGraph",
				upColor: "#ec0000",
				downColor: "#00da3c"
			},
			time: {
				type: ["1天", "2天", "3天", "4天", "5天"],
				element: "timeGraph",
				upColor: "#ec0000",
				downColor: "#00da3c"
			},
			other: {
				element: "quotation",
				upColor: "#ec0000",
				downColor: "#00da3c"
			}
		},
		getDateNumber: function(date) {
			var getDoubleBit = function (number) {
				return (number > 0 && number < 10) ? "0" + number: number;
			};
			return [date.getYear() + 1900, getDoubleBit(date.getMonth() + 1), getDoubleBit(date.getDate())].join("-");
		},
		getSplitDateStr: function(str) {
			//4位 hh:mm		8位	yyyy-MM-dd	12位 yyyy-MM-dd hh:mm
			return {
				4: [str.substr(0,2), str.substr(2,2)].join(":"),
				8: [str.substr(0,4), str.substr(4,2), str.substr(6,2)].join("-"),
				12: [str.substr(0,4), str.substr(4,2), str.substr(6,2)].join("-") + " " + [str.substr(8,2), str.substr(10,2)].join(":")
			}[str.length];
		},
		setTitle: function (title, code) {
			$("#stockName").text(title + "(" + code + ")");
		}
	};

	var setEcharts = function(nodeName, option) {
		var chart = echarts.init(document.getElementById(nodeName));
		chart && option && chart.setOption(option);
	};

	// 创建K线图
	var createGraphK = function (code) {
		var calculateMA = function(dayCount, data) {
			var result = [];
			for (var i = 0, len = data.length; i < len; i++) {
				if (i < dayCount) {
					result.push('-');
					continue;
				}
				var sum = 0;
				for (var j = 0; j < dayCount; j++) {
					sum += parseFloat(data[i - j][1]);
				}
				result.push((sum / dayCount).toFixed(3));
			}
			return result;
		};

		var createK = function (dates, data, volumn, type) {
			var option = {
		        backgroundColor: '#fff',
		        legend: {
			        data: [type, 'MA5', 'MA10', 'MA20', 'MA30'],
			        inactiveColor: '#777',
			        textStyle: {
			            color: '#21202D'
			        }
			    },
		        tooltip: {
					trigger: 'axis',
					axisPointer: {
						animation: false,
						type: 'cross',
						lineStyle: {
							color: '#376df4',
							width: 2,
							opacity: 1
						}
					},
					formatter: function (param) {
						var dataSource = [];
						for(var index in param)
							dataSource[param[index].seriesIndex] = param[index];

						var open = dataSource[0].data[1], close = dataSource[0].data[2], min = dataSource[0].data[3], max = dataSource[0].data[4];
						var colors = [
							stage.graph.k.upColor,
							stage.graph.k.downColor
						];
                        return [
                            '时间: ' + dataSource[0].name + '</br>',
                            '开盘: <span style="color:'+ colors[0] +'">' + open + '</span><br/>',
                            '收盘: <span style="color:'+ colors[close>= open? 0: 1] +'">' + close + '</span><br/>',
                            '最低: <span style="color:'+ colors[min>= open? 0: 1] +'">' + min + '</span><br/>',
                            '最高: <span style="color:'+ colors[max>= open? 0: 1] +'">' + max + '</span><br/>',
                            'MA5: '  + dataSource[1].data + '<br/>',
                            'MA10: ' + dataSource[2].data + '<br/>',
                            'MA20: ' + dataSource[3].data + '<br/>',
                            'MA30: ' + dataSource[4].data + '<br/>',
                        	'总量: ' + dataSource[5].data[1]
                        ].join('');
                    }
				},
		        axisPointer: {
		            link: {xAxisIndex: 'all'},
		            label: {
		                backgroundColor: '#777'
		            }
		        },
		        toolbox: {
		            feature: {
		                brush: {
		                    type: ['lineX', 'clear']
		                }
		            }
		        },
		        brush: {
		            xAxisIndex: 'all',
		            brushLink: 'all',
		            outOfBrush: {
		                colorAlpha: 0.1
		            }
		        },
		        visualMap: {
		            show: false,
		            seriesIndex: 5,
		            dimension: 2,
		            pieces: [{
		                value: 1,
		                color: stage.graph.k.downColor
		            }, {
		                value: -1,
		                color: stage.graph.k.upColor
		            }]
		        },
		        grid: [
		            {
		                left: '10%',
		                right: '8%',
		                height: '50%'
		            }, {
		                left: '10%',
		                right: '8%',
		                top: '72%',
		                height: '16%'
		            }
		        ],
		        xAxis: [
		            {
		                type: 'category',
		                data: dates,
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }, {
		                type: 'category',
		                gridIndex: 1,
		                data: dates,
		                axisLine: {onZero: false},
		                axisTick: {show: false},
		                splitLine: {show: false},
		                axisLabel: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }
		        ],
		        yAxis: [
		            {
		            	scale: true,
		                splitArea: {
		                    show: true
		                },
		                axisTick: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }, {
		            	scale: true,
		                gridIndex: 1,
		                splitNumber: 2,
		                axisLabel: {show: false},
		                axisLine: {show: false},
		                axisTick: {show: false},
		                splitLine: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }
		        ],
		        dataZoom: [
			        {
				        textStyle: {
				            color: '#8392A5'
				        },
                		xAxisIndex: [0, 1],
				        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				        handleSize: '80%',
				        dataBackground: {
				            areaStyle: {
				                color: '#8392A5'
				            },
				            lineStyle: {
				                opacity: 0.8,
				                color: '#8392A5'
				            }
				        },
				        handleStyle: {
				            color: '#fff',
				            shadowBlur: 3,
				            shadowColor: 'rgba(0, 0, 0, 0.6)',
				            shadowOffsetX: 2,
				            shadowOffsetY: 2
				        }
				    }, {
                		xAxisIndex: [0, 1],
				        type: 'inside'
				    }
				],
		        series: [
		            {
		                name: type,
		                type: 'candlestick',
		                data: data,
		                itemStyle: {
		                    normal: {
		                        color: stage.graph.k.upColor,
		                        color0: stage.graph.k.downColor,
		                        borderColor: null,
		                        borderColor0: null
		                    }
		                }		            }, {
		                name: 'MA5',
		                type: 'line',
		                data: calculateMA(5, data),
		                smooth: true,
		                lineStyle: {
		                    normal: {opacity: 0.5}
		                }
		            }, {
		                name: 'MA10',
		                type: 'line',
		                data: calculateMA(10, data),
		                smooth: true,
		                lineStyle: {
		                    normal: {opacity: 0.5}
		                }
		            }, {
		                name: 'MA20',
		                type: 'line',
		                data: calculateMA(20, data),
		                smooth: true,
		                lineStyle: {
		                    normal: {opacity: 0.5}
		                }
		            }, {
		                name: 'MA30',
		                type: 'line',
		                data: calculateMA(30, data),
		                smooth: true,
		                lineStyle: {
		                    normal: {opacity: 0.5}
		                }
		            }, {
		                name: 'Volume',
		                type: 'bar',
		                xAxisIndex: 1,
		                yAxisIndex: 1,
		                data: volumn
		            }
		        ]
		    };
			setEcharts(stage.graph.k.element, option);
		};

		return {
			create: function (type, name, begin) {
				$.get(stage.graph.k.dataSource, {code: code, time: type, beginDay: begin, showapi_appid: stage.graph.k.appid, showapi_sign: stage.graph.k.sign}, function (data) {
					if(data.showapi_res_code === 0) {
						var set = data.showapi_res_body.dataList, index=0;
						set.reverse();
						createK(set.map(item => stage.getSplitDateStr(item.time)), set.map(item => [item.open, item.close, item.min, item.max]), set.map(item => [index++,item.volumn,item.open>item.close? 1: -1]), name);
					} else alert("K线图数据获取失败");
				});
			}
		};
	};

	// 创建分时图
	var createGraphTime = function (code, special) {
		var info = {data:[]}, pulse = 0;
		// 创建图标
		var createTime = function (data) {
			var option = {
		        backgroundColor: '#fff',
		        legend: {
			        data: ['价格', '均价', '涨幅'],
			        inactiveColor: '#777',
			        textStyle: {
			            color: '#21202D'
			        }
			    },
		        tooltip: {
					trigger: 'axis',
					axisPointer: {
						animation: false,
						type: 'cross',
						lineStyle: {
							color: '#376df4',
							width: 2,
							opacity: 1
						}
					},
					formatter: function (param) {
						var dataSource = [];
						for(var index in param)
							dataSource[param[index].seriesIndex] = param[index];
						var color = dataSource[3].data[2] == 1 ?
							 stage.graph.time.upColor: stage.graph.time.downColor;
                        return [
                            '时间: ' + dataSource[0].name + '</br>',
                            '价格: <span style="color:' + color + ';">' + dataSource[0].data + '</span><br/>',
                            '均价: <span style="color:' + color + ';">' + dataSource[1].data + '</span><br/>',
                            '涨幅: <span style="color:' + color + ';">' + dataSource[2].data + ' %</span><br/>',
                            '成交量: <span style="color:' + color + ';">' + dataSource[3].data[1] + '</span>'
                        ].join('');
                    }
				},
		        axisPointer: {
		            link: {xAxisIndex: 'all'},
		            label: {
		                backgroundColor: '#777'
		            }
		        },
		        toolbox: {
		            feature: {
		                brush: {
		                    type: ['lineX', 'clear']
		                }
		            }
		        },
		        brush: {
		            xAxisIndex: 'all',
		            brushLink: 'all',
		            outOfBrush: {
		                colorAlpha: 0.1
		            }
		        },
		        visualMap: {
		            show: false,
		            seriesIndex: 3,
		            dimension: 2,
		            pieces: [{
		                value: 1,
		                color: stage.graph.time.upColor
		            }, {
		                value: -1,
		                color: stage.graph.time.downColor
		            }]
		        },
		        grid: [
		            {
		                left: '10%',
		                right: '8%',
		                height: '50%'
		            }, {
		                left: '10%',
		                right: '8%',
		                top: '72%',
		                height: '16%'
		            }
		        ],
		        xAxis: [
		            {
		                type: 'category',
		                data: data.data.time,
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                },
		                axisLabel: {
			                formatter: param => param.substr(5)
			            }
		            }, {
		                type: 'category',
		                gridIndex: 1,
		                data: data.data.time,
		                axisLine: {onZero: false},
		                axisTick: {show: false},
		                splitLine: {show: false},
		                axisLabel: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }
		        ],
		        yAxis: [
		            {
		            	scale: true,
		                splitArea: {
		                    show: true
		                },
		                axisTick: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }, {
		            	type: 'value',
		            	scale: true,
		                splitArea: {
		                    show: true
		                },
		                axisTick: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                },
		                axisLabel: {
			                formatter: '{value} %'
			            }
		            }, {
		            	scale: true,
		                gridIndex: 1,
		                splitNumber: 2,
		                axisLabel: {show: false},
		                axisLine: {show: false},
		                axisTick: {show: false},
		                splitLine: {show: false},
		                axisLine: { 
		                	lineStyle: { 
		                		color: '#8392A5' 
		                	}
		                }
		            }
		        ],
		        dataZoom: [
			        {
				        textStyle: {
				            color: '#8392A5'
				        },
                		xAxisIndex: [0, 1],
				        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
				        handleSize: '80%',
				        dataBackground: {
				            areaStyle: {
				                color: '#8392A5'
				            },
				            lineStyle: {
				                opacity: 0.8,
				                color: '#8392A5'
				            }
				        },
				        handleStyle: {
				            color: '#fff',
				            shadowBlur: 3,
				            shadowColor: 'rgba(0, 0, 0, 0.6)',
				            shadowOffsetX: 2,
				            shadowOffsetY: 2
				        }
				    }, {
                		xAxisIndex: [0, 1],
				        type: 'inside'
				    }
				],
		        series: [
		            {
		                name: "价格",
		                type: 'line',
		                data: data.data.price,
		                smooth: true,
		                lineStyle: {
		                    normal: {
		                    	opacity: 0.5
		                    }
		                },
            			symbol: 'none'
		            }, {
		                name: '均价',
		                type: 'line',
		                data: data.data.svg,
		                smooth: true,
		                itemStyle: {
		                    normal: {
		                    	opacity: 0.5,
		                    	color: "#fc3",
		                    	lineStyle: {
		                    		color: "#fc3"
		                    	}
		                    }
		                },
            			symbol: 'none'
		            }, {
		                name: '涨幅',
		                type: 'line',
		                itemStyle: {
		                    normal: {
		                    	opacity: 0.5,
		                    	color: "#3385ff",
		                    	lineStyle: {
		                    		color: "#3385ff"
		                    	}

		                    }
		                },
		                yAxisIndex: 1,
		                data: data.data.rose.map(item => item.toFixed(2))
		            }, {
		                name: '成交量',
		                type: 'bar',
		                xAxisIndex: 1,
		                yAxisIndex: 2,
		                data: data.data.volume
		            }
		        ]
		    };
			setEcharts(stage.graph.time.element, option);
		};

		// 获取serveral天数的数据
		var getServeralDaysData = function (serveral) {
			var temp = [];
			for(var index in info.data) 
				temp.push(info.data[index]);
			temp.reverse();

			var set = {
				name: info.name, 
				symbol: info.symbol,
				data: {
					time: [],
					price: [],
					svg: [],
					volume: [],
					rose: []
				}
			};
			// 解析原始数据
			for(var i=temp.length - serveral; i<temp.length; i++) {
				set.data.time = set.data.time.concat(temp[i].data.map(item => temp[i].date + " " + stage.getSplitDateStr(item[0])));
				set.data.price = set.data.price.concat(temp[i].data.map(item => item[1]));
				set.data.svg = set.data.svg.concat(temp[i].data.map(item => item[2]));
				set.data.volume = set.data.volume.concat(temp[i].data.map(item => [0, item[3]]));
				set.data.rose = set.data.rose.concat(temp[i].data.map(item => ((item[1] - temp[i].yestclose)*100/temp[i].yestclose)));
			}
			$(set.data.volume).each(function (index, item) {
				item[0] = index;
				item.push( (index==0 || set.data.rose[index] >= set.data.rose[index-1]) ? 1 : -1);
			});
			return set;
		};

		// 获取请求数据股票代码前缀
		var getPrefix = function (code) {
			return [600, 601, 603].indexOf(code.substr(0, 3)) > 0 ? 0 : 1;
		};

		// 修正info信息中date(当今天为周六或者周日, 修改为周五)
		var correctInfoDate = function () {
			if(stage.today.getDay() != 0 && stage.today.getDay() != 6)
				return;  
			var max = info.data[0].date, sec = info.data[1].date, maxIndex = 0, secIndex = 1;
			for(var index in info.data) {
				var temp = info.data[index].date;
				if(temp >= max) {
					max = temp;
					maxIndex = index;
				} else if(temp >= sec) {
					sec = temp;
					secIndex = index;
				}
			}
			info.data[maxIndex].date = stage.getDateNumber(new Date(new Date(sec.split("-")[0],sec.split("-")[1]-1,sec.split("-")[2]).getTime()+86400000));
		};

		// 等待数据全部接收
		var waitFor = function (callback) {
	        var timer = setInterval(function () {
	        	if(pulse == 2){
	        		callback();
		        	clearInterval(timer);
		        	timer = null;
	        	}
	        }, 10);
		};

		(function () {
			// 获取今天数据
			$.ajax({
	            type: "GET",
	            url: "http://img1.money.126.net/data/hs/time/today/" + (special? "0000001" : getPrefix(code) + code) + ".json",
	            dataType: "jsonp",
	            async: false,
	　　　　　　success: function(result){
					info.data.push({
						count: result.count,
						data: result.data,
						yestclose: result.yestclose, 
						lastVolume: result.lastVolume, 
						date: stage.getDateNumber(stage.today)
					});
					pulse ++;
	            },
	            error: function (){
	            	alert("分时图数据获取失败！")
	            }
	        });
	        // 获取前四天数据
	        $.ajax({
	            type: "GET",
	            url: "http://img1.money.126.net/data/hs/time/4days/" + (special? "0000001" : getPrefix(code) + code) + ".json",
	            dataType: "jsonp",
	            async: false,
	　　　　　　success: function(result){
					info.symbol = result.symbol;
					info.name = result.name;
					for(var index in result.data){
						result.data[index].date = stage.getSplitDateStr(result.data[index].date);
						info.data.push(result.data[index]);
					}
					pulse ++;
	            },
	            error: function (){
	            	alert("分时图数据获取失败！")
	            }
	        });
		})();

        // 当两次ajax请求完成后, 整合数据
        waitFor(correctInfoDate);

        return {
        	create: function (days) {
	        	waitFor(function () {
					createTime(getServeralDaysData(days || 1));
	        	});
			}
        };
	};

	var createOtherBanner = function (code, personal) {
		var info = {}, banner = $("#" + stage.graph.other.element);

		var initBanner = function () {
			$(banner).html('<p class="text-center text-danger">暂无数据</p>');
		};

		var clearBanner = function () {
			$(banner).empty();
		};

		var createBanner = function (data) {
			console.log("create banner");
			// 获取文字颜色
			var getTextColor = function (price) {
				if(price == 0 ) return "#000";
				return price >= data.last_close? stage.graph.other.upColor: stage.graph.other.downColor;
			};

			// 获取 买十卖十 数组
			var getTmpRows = function (){
				var temp = [];
				for(var index in data.rows)
					temp.push(data.rows[index]);
				temp.reverse();
				return temp;
			};

			// 获取涨幅
			var getRose = function (price, yestclose) {
				return ((price - yestclose) * 100 / yestclose).toFixed(2) + "%";
			};

			// 获取涨跌
			var getDifference = function (price, yestclose){
				return (price - yestclose).toFixed(2);
			};
				
			(function(rows){
				var labels = ["卖十", "卖九", "卖八", "卖七", "卖六", "卖五", "卖四", "卖三", "卖二", "卖一", "买一", "买二", "买三", "买四", "买五", "买六", "买七", "买八", "买九", "买十"];
				$("<div class='row'>"+
					"<label class='table-cell col-xs-4'></label>"+
					"<label class='table-cell col-xs-4'>价格</label>"+
					"<label class='table-cell col-xs-4'>成交</label>"+
				"</div>").appendTo(banner);
				$(rows).each(function (index, item) {
					$("<div class='row'>"+
						"<span class='table-cell col-xs-4'>"+ labels[index] +"</span>"+
						"<span class='table-cell col-xs-4' style='color:"+ getTextColor(item.price) +";'>"+ item.price +"</span>"+
						"<span class='table-cell col-xs-4'>"+ item.amount +"</span>"+
					"</div>").appendTo(banner);
					if(index == 9){
						$("<br/>").appendTo(banner);
					}
				});
				$("<hr/>").appendTo(banner);
			})(getTmpRows());

			(function (opts) {
				$(opts).each(function (index, item) {
					$("<div class='row'>"+
						"<span class='table-cell col-xs-3'>"+ item.name.left +"</span>"+
						"<span class='table-cell col-xs-3' style='color:"+ getTextColor(item.color.left) +";'>"+ item.value.left +"</span>"+
						"<span class='table-cell col-xs-3'>"+ item.name.right +"</span>"+
						"<span class='table-cell col-xs-3' style='color:"+ getTextColor(item.color.right) +";'>"+ item.value.right +"</span>"+
					"</div>").appendTo(banner);
				});
			})([
				{
					name: {
						left: "最新",
						right: ""
					},
					value: {
						left: data.price,
						right: ""
					},
					color: {
						left: data.price,
						right: 0
					}
				}, {
					name: {
						left: "涨幅",
						right: "涨跌"
					},
					value: {
						left: getRose(data.price, data.last_close),
						right: getDifference(data.price, data.last_close)
					},
					color: {
						left: data.price,
						right: data.price
					}
				}, {
					name: {
						left: "最高",
						right: "最低"
					},
					value: {
						left: data.high,
						right: data.low
					},
					color: {
						left: data.high,
						right: data.low
					}
				}, {
					name: {
						left: "昨收",
						right: "今开"
					},
					value: {
						left: data.last_close,
						right: data.open
					},
					color: {
						left: data.open,
						right: 0
					}
				}
			]);
		};

		return {
			create: function () {
				clearBanner();
				if(!personal) initBanner();
				else {
					// 这里为模拟数据
					var result = {
						"state": 0,
						"data": {
							"code": "sz000002",
							"name": "万 科Ａ",
							"last_close": 20.52,
							"open": 20.52,
							"high": 20.59,
							"low": 20.47,
							"price": 20.53,
							"rows": [
							{
								"pos": -10,
								"price": 20.44,
								"amount": 38900
							},
							{
								"pos": -9,
								"price": 20.45,
								"amount": 509300
							},
							{
								"pos": -8,
								"price": 20.46,
								"amount": 245300
							},
							{
								"pos": -7,
								"price": 20.47,
								"amount": 324900
							},
							{
								"pos": -6,
								"price": 20.48,
								"amount": 445800
							},
							{
								"pos": -5,
								"price": 20.49,
								"amount": 220668
							},
							{
								"pos": -4,
								"price": 20.5,
								"amount": 366141
							},
							{
								"pos": -3,
								"price": 20.51,
								"amount": 176290
							},
							{
								"pos": -2,
								"price": 20.52,
								"amount": 64400
							},
							{
								"pos": -1,
								"price": 20.53,
								"amount": 164200
							},
							{
								"pos": 1,
								"price": 20.54,
								"amount": 79400
							},
							{
								"pos": 2,
								"price": 20.55,
								"amount": 122360
							},
							{
								"pos": 3,
								"price": 20.56,
								"amount": 44700
							},
							{
								"pos": 4,
								"price": 20.57,
								"amount": 39000
							},
							{
								"pos": 5,
								"price": 20.58,
								"amount": 91523
							},
							{
								"pos": 6,
								"price": 20.59,
								"amount": 121012
							},
							{
								"pos": 7,
								"price": 20.6,
								"amount": 198400
							},
							{
								"pos": 8,
								"price": 20.61,
								"amount": 22000
							},
							{
								"pos": 9,
								"price": 20.62,
								"amount": 54200
							},
							{
								"pos": 10,
								"price": 20.63,
								"amount": 318000
							}
							]
						}
					};
					stage.setTitle(result.data.name, code);
					createBanner(result.data);
					// 接收实时数据
					// $.get("/level2", {code: ([600, 601, 603].indexOf(code.substr(0, 3)) > 0 ? 'sh': 'sz') + code}, function (result) {
					// 	if(result.state == 0){
					// 		console.log(result.data);
					// 		stage.setTitle(result.data.name);
					// 		createBanner(result.data);
					// 	}
					// });
				}
			}
		};
	};

	$(function (){
		var kCreator, timeCreator, otherCreator, currentK = {name: "日K线", type: "day"}, monthBefore = stage.getDateNumber(new Date(stage.today.getTime()-86400000*30));

		// *****************************************************************
		/* 初始化页面
		 * 000001既为上证指数, 在深市又代表平安
		 * 大盘不需要 买十卖十等信息 banner
		 * @param special true 表示000001为上证指数
		 * @param personal true 表示 当前股为个股, 需要创建买十卖十等信息 banner
		**/ 
		var initPage = function (code, special, personal) {

			(function (){
				// K线类型选项
				$("#kInterval").empty();
				for(var index in stage.graph.k.type) {
					$("<option" + (index == "day"? " selected": "") + ">" + stage.graph.k.type[index] + "</option>")
						.appendTo($("#kInterval"));
				}

				// 分时图天数选项
				$("#timeInterval").empty();
				$(stage.graph.time.type).each(function (index, item) {
					$("<option" + (index == 0? " selected": "") + ">" + item + "</option>")
						.appendTo($("#timeInterval"));
				});

				$("#beginTime").val(monthBefore);
			})();


			kCreator = new createGraphK(code);
			timeCreator = new createGraphTime(code, special);
			otherCreator = new createOtherBanner(code, personal);

			kCreator.create("day", "日K线", monthBefore.replace(/\-/g, ""));
			timeCreator.create(1);
			otherCreator.create();
		}

		// *****************************************************************
		
		$("#kInterval").change(function () {
			var name = this.value;
			for(var idx in stage.graph.k.type) {
				if(stage.graph.k.type[idx] == name) {
					currentK = {name: name, type: idx};
					kCreator.create(idx, name, ($("#beginTime").val() || monthBefore).replace(/\-/g, ""));
				}
			}
		});

		$("#beginTime").change(function () {
			kCreator.create(currentK.type, currentK.name, (this.value || monthBefore).replace(/\-/g, ""));
		});

		$("#timeInterval").change(function () {
			timeCreator.create(stage.graph.time.type.indexOf(this.value)+1);
		});

		// 沪证、深证、中小板、创业板
		$("#hzIndex").click(function () {
			stage.setTitle("上证指数", "000001");
			initPage("000001", true, false);
		});

		$("#szIndex").click(function () {
			stage.setTitle("深证成指", "399001");
			initPage("399001", false, false);
		});

		$("#zxIndex").click(function () {
			stage.setTitle("中小板指", "399005");
			initPage("399005", false, false);
		});

		$("#cyIndex").click(function () {
			stage.setTitle("创业板指", "399006");
			initPage("399006", false, false);
		});

		// 个股
		$("#searchStock").click(function () {
			var code = $("#stockCode").val();
			if(code.length == stage.codeLength && !isNaN(code)) {
				initPage(code, false, true);
				$("#stockCode").val('');
			}
		});

		// *****************************************************************
		
		initPage("000002", false, true);
	});
});