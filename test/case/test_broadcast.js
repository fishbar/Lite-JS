(function(){
	module("BroadCast 模块");
	test('$.BroadCast:watch & fire & unwatch single event',function(){
		var testObj = {
			name:'',
			target_name:'',
			callback:function(obj){
				this.name = obj.param.name;
				this.target_name = obj.target.name;
			},
			reset:function(){
				this.name = '';
				this.target_name = '';
			}
		}
		$.BroadCast.watch('test_event',testObj,testObj.callback);
		$.BroadCast.fire('test_event',{name:'1'},{name:'2'});
		deepEqual(testObj.name,'2','事件触发ok，事件携带参数出发ok');
		deepEqual(testObj.target_name,'1',"事件触发源传递ok");
		$.BroadCast.fire('test_event_a',{name:'1'},{name:'3'});
		deepEqual(testObj.name,'2','事件触发ok,不受其它事件的干扰');
		testObj.reset();
		$.BroadCast.unwatch('test_event',testObj,testObj.callback);
	});
})();
