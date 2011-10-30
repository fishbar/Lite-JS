/**
 *  broadcast 为一种事件机制，相比于jQuery的事件机制，broadcast不需要事件的宿主，
 *  broadcast 全局的广播一个事件，所有的监听者响应这个事件
 */

(function($$){
	var
	/**
	 * 组合事件 -》 gname:[event,event]
	 * 	每个组合事件都关联着 1到n个其他事件，当这些事件都发生之后，组合事件被触发
	 */
	_g_event={},
	/**
	 * 事件 -》组合事件 event : [groupevt,groupevt];
	 *  当某事件发生时，通知相关的组合事件，如果组合事件所有的event都触发了，则触发组合事件
	 */
	_event_g={},
	/**
	 *  广播事件列表，所有的handerl都在这里
	 */
	_event={},
	
	BroadCast = {
		
		/** 
		 * 组合事件 ,注册组合事件时调用
		 *  $.BroadCast.group('pageInited' , 'comList');
		 **/
		group:function(gEvent,srcEvent){
			if(!_g_event.hasOwnProperty(gEvent)){
				_g_event[gEvent] = [];
			}
			if(!_event_g.hasOwnProperty(srcEvent))
				_event_g[srcEvent] = [];
			var g_e = _g_event[gEvent];
			g_e.push({
				event:srcEvent,
				done:false
			});
			_event_g[srcEvent].push(gEvent);
			return this;
		},
		/**
		 * 取消组合事件
		 */
		ungroup:function(gEvent,srcEvent){
			if(!srcEvent){
				_g_event[gEvent] = {};
			}else{
				//TODO
			}
			return this;
		},
		/*
		 * 监听广播 event事件，可以带入当前环境的args，args传入注意内存泄露
		 */
		watch:function(event,caller,handler){
			var evt_param = {
					caller:caller,
					handler:handler
			};
			if(!_event.hasOwnProperty(event)){
				_event[event] = [];
			}
			_event[event].push(evt_param);
			return this;
		},
		/**
		 * 取消绑定
		 */
		unwatch:function(event,caller,handler){
			if(!_event.hasOwnProperty(event)){
				return;
			}
			var elist = _event[event];
			if(!caller){
				_event = [];
			}else{
				for(var i=0,len=elist.length;i<len;i++){
					if(elist[i].caller === caller){
						if(!handler || (elist[i].handler == handler) ){
							elist.splice(i,1);
							len -= 1;
							i--;
						}
					}
				}
			}
		},
		/** 
		 * 广播事件，可以传入 广播源，以及相应的一些参数
		 * 		注意，这里先触发单一事件，然后检查group事件。
		 **/
		fire:function(event,target,param){
			var i , j , 
				len , len1, flag = true,
				g_list,
				evtobj,
				g_evt;
			// check  single event{}
			var elist = _event[event];
			if(elist){
				len = elist.length;
				if(len){ // 遍历事件的监听者
					for(i=0; i<len ; i++){
						evtobj = {
							event:event,
							caller:elist[i].caller,
							target:target,
							param:param
						};
						elist[i].handler.call(evtobj.caller,evtobj);
					}
				}
			}
			
			var g_elist = _event_g[event];
			if(g_elist){
				len = g_elist.length;
				if(len){
					for(i=0;i < len ; i++){
						g_evt = g_elist[i];
						glist = _g_event[g_evt];
						if(!glist) return;
						for(j=0,len1 = gilst.length; j < len1 ; j++){
							if(glist[j].event === event ) glist[j].done = true;
							flag |= glist[j].done;
						}
						if(flag){	//trigger group event
							this.fire(g_evt,null,null);
						}
					}
				}
			}
			return this;
		}
	};
	
	$$.BroadCast = BroadCast;
})(Lite);
