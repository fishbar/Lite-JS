/**
 * @author fishbar
 * 
 * @overview
 * 	支持以下语法
 * 	#{var}	变量
 * 	#{if(#var>#var)} #{else} #{endif}	if else 条件语句
 * 	#{func(#var)}		全局函数调用
 * 
 * @exsample
 * 
 * 	var tpl = '<div>#{title}<p>#{floor(#price)}</p>#{if(#desc)}<p>#{desc}</p>#{endif}</div>';
 * 	var tt = new Lite.Template(tpl);
 * 	alert(tt.replace({title:"test",price:1.023}));
 * 
 * 注意： repeat 数字索引的数组时，#{-}接受数组索引 #{_}数组本身 #{%} 数组长度
 * 
 * BUG:
 * 	对于表达式中的引号存在问题,需要处理
 */
$include('lite/lite.js');

(function(n){

n.Template = function(tmp,debug){
	this._debug = debug;
	this._tmp = this._compress(tmp);
};

n.Template.prototype={
	_compress:function(tmp){
		//去除引号干扰
		tmp = tmp.replace(/(\"|\')/g,'\\$1');
		//去除没用的空tab
		tmp = tmp.replace(/\t+/g,'');
		// 获得标记位
		var arr_flag = tmp.match(/#\{([^}]*)\}/g);
		var arr_cnt;
		// IE下的split存在问题
		if(window.ActiveXObject){
			if(RegExp.index == 0) tmp = '#!@!#' + tmp;
			tmp = tmp.replace(/(#\{[^}]*\})\s*(?=#\{[^}]*\})/g,'$1#!@!#');
			arr_cnt = tmp.split(/#\{[^}]*\}/);
			for(var i=0;i < arr_cnt.length; i++){
				var t =  arr_cnt[i]
				if(t == '#!@!#') arr_cnt[i] = '';
			}
		}else{
			arr_cnt = tmp.split(/#\{[^}]*\}/);
		}
		var arr_res = ['var t=[];'];
		for(var i=0; i<arr_flag.length;i++){
			arr_res.push("t.push('"+arr_cnt[i]+"');");
			if(arr_flag[i].match(/#\{(if\([^\}]*\))\}/)){				//if scope
				var m = RegExp.$1.replace(/#_/g,"d").replace(/#(\w+)/g,"d['$1']").replace(/#-/g,'_index').replace(/#%/g,'_len').replace(/\\(\"|\')/g,'$1');
				arr_res.push(m + "{");
			}else if(arr_flag[i].match(/#\{elseif(\([^\}]+\))\}/)){ 		//elseif scope
				var m = RegExp.$1.replace(/#_/g,"d").replace(/#(\w+)/g,"d['$1']").replace(/#-/g,'_index').replace(/#%/g,'_len').replace(/\\(\"|\')/g,'$1');
				arr_res.push("}else if" + m + "{");
			}else if(arr_flag[i].match(/#\{else\}/)){					//else scope
				arr_res.push("}else{");
			}else if(arr_flag[i].match(/#\{endif\}/)){					//endif scope
				arr_res.push("}");
			}else if(arr_flag[i].match(/#\{const:(\w+)\}/)){			//const scope
				var constName = RegExp.$1;
				arr_res.push("t.push(ext."+constName+");");
			}else if(arr_flag[i].match(/#\{([\w\.]+)\((.*)?\)\}/)){		//function scope
                                var fname = RegExp.$1;
				var m = RegExp.$2.replace(/#_/g,"d").replace(/#const:(\w+)/,"ext.$1").replace(/#(\w+)/g,"d['$1']").replace(/#-/g,'_index').replace(/#%/g,'_len').replace(/\\(\"|\')/g,'$1');
				arr_res.push("t.push("+fname+"("+m+"));");
			}else if(arr_flag[i].match(/#\{\(([^}]*)\)\}/)){			// simple exp
				var exp = RegExp.$1;
				exp = exp.replace(/#_/g,"d").replace(/#(\w+)/g,"d['$1']").replace(/\#\-/g,'_index').replace(/#%/g,'_len');
				arr_res.push("t.push(" + exp + ');'); 
			}else{
				arr_flag[i].match(/#\{([^\}]+)\}/);
				if(RegExp.$1 == '_'){
					arr_res.push("t.push(d);");
				}else if(RegExp.$1 == '-'){
					arr_res.push("t.push(_index);");
				}else if(RegExp.$1 == '%'){
					arr_res.push("t.push(_len);");
				}else{
					arr_res.push("t.push(d['"+RegExp.$1+"']);");
				}
			}
		}
		if(arr_cnt[i])arr_res.push("t.push('"+arr_cnt[i]+"');");
		if(this._debug){
			alert(arr_flag.length+":"+arr_cnt.length);
			//alert(arr_flag.join('\n'));
			//alert(arr_cnt.join('\n'));
			//alert(arr_res.join('\n'));
		}
		eval("var res=(function(d,_index,_len){"+arr_res.join("")+"return t.join('');})");
		return res;
	},
	replace:function(data,i,len){
		return this._tmp(data,i,len);
	},
	/* 传入普通数组 N_Array */
	repeat:function(data){
		var len = data.length;
		var str=[];
		for(var i = 0; i < len; i++){
			str.push(this.replace(data[i],i,len));
		}
		return str.join("");
	}
}

})(Lite);