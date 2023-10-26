// ==UserScript==
// @name         478293
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  is 478293
// @author       478293
// @match        http*://zwyy.qdexam.com/www/index.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qdexam.com
// @grant        none
// @license      GPL3.0
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").style="height: 3rem;"
 
    var my_html=`
					<li class="col v-t" style="width:auto; padding-left: 5px;">
						<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" ng-show="buildingReservationType!=1" ng-click="subscribeDay();" onclick="window.extendDay();" href="javaScript:void(0);"><img align="absmiddle" src="img/ion-clock.png">我要预约</a>
						<a class="btn btn-opatiy btn-conner has-icon c-b ng-hide" style="width: 100%;text-align: center" ng-show="buildingReservationType==1" ng-click="reservationShow();" href="javaScript:void(0);"><img align="absmiddle" src="img/ion-clock.png">我要预约</a>
					</li>
					<li class="col t-r v-t" style="padding-left: 5px;">
						<a class="btn btn-opatiy btn-conner has-icon c-b" style="width: 100%;text-align: center" ng-show="buildingReservationType!=0&amp;&amp;campusId!=58" ng-click="SweepCode();" onclick="window.myCheckIn();" href="javaScript:void(0);"><img align="absmiddle" src="img/take-code.png">扫码就坐</a>
					</li>
 
				`
    var dom=document.createElement('ul');
    dom.className="row"
    dom.style="height: 6rem;"
    dom.innerHTML=my_html
    document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head").appendChild(dom)
 
    //删除原有标签
    document.querySelector("body > div.app.has-head.has-banner.ng-scope > div.app-head > ul:nth-child(2)").remove()
 
 
    //签到模块
    window.myCheckIn=function (){
 
        var Reservation=window.Api.selectReservationByUser()
        //alert(JSON.stringify(Reservation))
        //alert('"false"')
        if(Reservation.success==false){
            alert("没有预约请先预约再签到")
        }else{
 
            var frist_reseveation=Reservation.list[0]
 
            if(frist_reseveation.notArrive==1){
                var Reservation_seatId=frist_reseveation.seatId
 
                var result_json=window.Api.checkInSeat(Reservation_seatId)
 
                //location.reload();
 
                var OUT_TEXT=JSON.stringify(result_json.success)+"\t"+
                    JSON.stringify(result_json.message)
                var tag=1
                if(result_json.message=='0') {
                    OUT_TEXT="签到时间未到"
                    alert(OUT_TEXT)
                    //+OUT_TEXT
                }else if(result_json.message=='3') {
                    OUT_TEXT="重复签到"
                    alert(OUT_TEXT)
                    //+OUT_TEXT
                }
                else{
                    alert(OUT_TEXT)
                    location.reload();
                }
 
            }else{
                alert("已经签到不用签到")
            }
        }
    }
 
 
    //续约模块
    window.extendDay =function () {
 
        var tomain = function () {
            var Reservation=window.Api.selectReservationByUser();
            var Reservation_ID=0
            console.log(Reservation)
            var day_num=2
            var date_day=new Date(new Date().getTime()+day_num*24*60*60*1000).Format("yyyy-MM-dd")
            var Frist_time=date_day+' 09:00:00'
            var End_time=date_day+' 22:00:00'
            var go=true
            var target_time=Frist_time.slice(0,-3)+" - "+End_time.slice(0,-3)
            var tmp_time_timeDay=""
            //alert(Reservation.lists.length)
            if(Reservation.success){
                console.log(Reservation.success+"进入")
                var last_reseveation=Reservation.list[Reservation.list.length-1]
                Reservation_ID=last_reseveation.reservationId
                for (let index = 0; index < Reservation.list.length; index++) {
                    tmp_time_timeDay=Reservation.list[index].time
                    //alert(tmp_time_timeDay)
                    if(tmp_time_timeDay==target_time){go=false; break}
                }
            }else{
                Reservation_ID=window.Api.selectReservation(0,1,10).lists[0].id
            }
 
            //alert(go)
            if(go){
                var result_json=window.Api.extendSeatTimeDay(Reservation_ID,End_time,Frist_time)
                // confirm(Reservation_ID+" "+Frist_time+" "+End_time)
                //confirm
                if(result_json.success){
                    //alert("预约成功")
                }
                else{
                    alert(JSON.stringify(result_json.success)+"\t"+
                          JSON.stringify(result_json.message)
                         )
                }
                location.reload();
            }else{
                alert("重复预约 预约已成功")
 
            }
            //刷新
            //location.reload();
        }
//         if (typeof window.myuse === "undefined") {
//             console.log("window.myuse is undefined");
//             window.myuse=true
//             // alert(window.myuse)
//             tomain()
//         }else {
//             console.log(window.myuse);
//             // window.use=true
//         }
        tomain()
 
    };
    //----------自动操作---------
//   window.myalert= function () { }
//   window.myalert=window.alert
//   window.alert=console.log
//     console.log("自动签到开始")
//     window.myCheckIn()
//     console.log("自动签到结束")
//     //八点后自动预约
//     if(new Date().getHours()>20){ //20点以后打开才自动执行
//         console.log("自动预约开始")
//         window.extendDay()
//         console.log("自动预约结束")
//     }
//     window.alert=window.myalert
    //----------自动操作---------
 
})();
