import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import liff from '@line/liff'
import Loading from './Loading';
import addDays from 'date-fns/addDays';
import addYears from 'date-fns/addYears'

function Task() {
  const queryString = decodeURIComponent(window.location.search).replace("?liff.state=", "");
  const params = new URLSearchParams(queryString)
  const liffId = '1654805076-agyLkygK'
  const group = params.get("gid")
  const [profile, setProfile] = useState({})
  const [loading,  IsLoading] = useState(true)
  let isDisabled = false
  const [taskDetail, setTaskDetail] = useState({
    order_to: [],
    subject: "",
    detail: "",
    type: "",
    deadline: "",
    order_by: "",
    member: []
  })
  if (taskDetail.order_to.length === 0) {
    isDisabled = true
  } else {
    isDisabled = false
  }
  const checkLogin = async () => {
    if (!liff.isLoggedIn()) {
      liff.login({ redirectUri: "https://assign-task-jeny.herokuapp.com/?gid="+group});
    } else {
      let getProfile = await liff.getProfile();
      setTaskDetail({...taskDetail, order_by: getProfile.userId})
    }
  }

  useEffect(() => {

    const fetchProfile = async () => {

      IsLoading(true)
      await liff.init({ liffId: liffId })
      .then(() => {
        checkLogin()
      })
      .catch(err => {throw err});

      await axios.get('https://back-jeny.cf/group/'+group+'/profile')
      .then((response) => {
        setProfile(response.data.UsersProfile)
      })
      .catch((response) => {
        console.log(response)
      }) 
      IsLoading(false)
    }
    fetchProfile()

  }, [])

  const setUser = (uid , mem) => {
    const index = taskDetail.order_to.indexOf(uid)

    if (taskDetail.order_to.indexOf(uid) !== -1) {
      let emptyArr = taskDetail.order_to
      let emptyUser = taskDetail.member
      emptyArr.splice(index,1)
      emptyUser.splice(index,1)
      setTaskDetail({...taskDetail, order_to: emptyArr, member: emptyUser})
    } else {
      setTaskDetail({...taskDetail, order_to: [...taskDetail.order_to, uid], member: [...taskDetail.member, mem]})
    }
  }
  
  const handleSubmit = () => {
    IsLoading(true)
    axios({
      method: 'POST',
      url: 'https://jeny-bot.herokuapp.com/assign/task',
      data: taskDetail,
      headers: {
        'Content-Type': 'application/json',
        'UserId': taskDetail.order_by,
        'GroupId': group
      }
    }).then((response) => {
      alert('Success')
      console.log("getOS",liff.getOS)
      console.log("getOS()",liff.getOS())
      if (liff.getOS() === 'web') {
        window.close()
      } else {
        liff.closeWindow()
      }
    })
    .catch((response)=> {
      alert('Please complete the information !')
      console.log(response)
      window.location.reload();
    })
  }

  if (loading) {
    return (
      <Loading></Loading>
    );
  } else {
    return (
        <div className="min-w-screen min-h-screen bg-gray-200 flex items-center justify-center px-5 pb-10 pt-16">
            <div className="max-w-md mx-auto rounded-lg bg-white shadow-lg p-5 text-gray-700" >
              <div>
                <label className="text-base mb-2">
                  ?????????????????????????????????????????????????????????????????????
                </label>
              </div>
              <div >
                  {profile.map((p, index) => p.userId !== "" ? (
                  <div className="flex items-center flex-row space-x-4 space-y-4 max-w-md " >
                    <label className="flex items-center flex-row space-x-4 space-y-4  cursor-pointer md:w-auto" htmlFor={index} > 
                      <input type="checkbox" className="ml-2  form-checkbox text-green-600" id={index} name={p.displayName} value={p.userId} onChange={()=> setUser(p.userId, p.displayName)}></input>
                      <img src={p.pictureUrl} alt="profile" style={{borderRadius: "50%", width: "50px"}} ></img>
                      <span className="text-gray-500">{p.displayName}</span>
                    </label>
                  </div>
                  ): (<div  >
                  {/* <label className="flex items-center flex-row space-x-4 space-y-4  cursor-pointer md:w-auto" htmlFor={index} > 
                    <input type="checkbox" className="ml-2  form-checkbox text-green-600" id={index} disabled></input>
                    <img src={DefaultUser} alt="profile" style={{borderRadius: "50%", width: "50px"}} ></img>
                    <span className="text-gray-500">Mr.Unknown</span>
                  </label> */}
                </div>))}
                  
              </div>
      
              <div className="mt-3">
                  <label className="text-base mb-3" >?????????????????????</label>
                  <input className="w-full px-3 py-1 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors placeholder-red-300" type="text" onChange={event => setTaskDetail({...taskDetail, subject: event.target.value})} maxlength="100" placeholder="*?????????????????????????????? 100 ????????????????????????"></input>
                  <label className="text-base mb-3" >???????????????????????????????????????</label>
                  <textarea className="w-full h-32 max-h-full px-3 py-1 mb-1 border-2 border-gray-200  rounded-md focus:outline-none focus:border-indigo-500 transition-colors placeholder-red-300" rows="10" style={{ resize: "none"}} onChange={event => setTaskDetail({...taskDetail, detail: event.target.value})} maxlength="300" placeholder="*?????????????????????????????? 300 ????????????????????????"></textarea>
              </div>
              <div className="flex flex-col">
                  <label className="text-base" >????????????????????????????????????????????????</label>
                  <div className="flex flex-row space-x-4 items-center">
                    <div >
                      <input type="radio" id ="group" name="type" value="group" onChange={event => setTaskDetail({...taskDetail, type: event.target.value})}></input>
                      <label className="mx-2 cursor-pointer" htmlFor="group">????????????????????????</label>
                    </div>
                    <div >
                      <input type="radio" id ="single" name="type" value="single" onChange={event => setTaskDetail({...taskDetail, type: event.target.value})}></input>
                      <label className="mx-2 cursor-pointer" htmlFor="single">???????????????????????????</label>
                    </div>
                  </div>
                  
              </div>
              <div className="flex flex-col mb-5">
                  <label className="mb-1">??????????????????????????????????????????</label>
                  <DatePicker className="max-w-md px-2  b-1 border-2 border-gray-200  rounded-md focus:outline-none focus:border-indigo-500 transition-colors" 
                    selected={taskDetail.deadline} 
                    onChange={date => setTaskDetail({...taskDetail, deadline: date})} 
                    minDate={addDays(new Date(),1)}
                    maxDate={addYears(new Date(), 1)}
                    placeholderText="??????????????????????????????????????????"
                    showDisabledMonthNavigation 
                  />
              </div>
              <button className="w-full block bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-50" onClick={handleSubmit} disabled={isDisabled}>Submit</button>
            </div>
            
        </div>
    );
  }
  
  
}


export default Task;
