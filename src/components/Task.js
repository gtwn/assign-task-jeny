import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import liff from '@line/liff'
import Loading from './Loading';



function Task() {
  let params = new URLSearchParams(document.location.search.substring(1))
  const liffId = '1654805076-Qbl9zloL'
  let groupid = params.get("gid")
  let userid = params.get("uid")
  const [profile, setProfile] = useState({})
  let id = "C04524879b7343f60a5d49aee099a821b"
  let uuid = "Uae4fc581117126f7ac87e1096ed77ead"
  const [loading,  IsLoading] = useState(true)
  let isDisabled = false
  const [taskDetail, setTaskDetail] = useState({
    order_to: [],
    subject: "",
    detail: "",
    type: "",
    deadline: ""
  })
  console.log("gid",groupid)
  console.log("uid",userid)
  liff.init({ liffId })
  console.log("userId",taskDetail.order_to)
  if (taskDetail.order_to.length === 0) {
    isDisabled = true
  } else {
    isDisabled = false
  }
  
  useEffect(() => {

    const fetchProfile = async () => {
      IsLoading(true)
      await axios.get('http://139.59.113.176:2155/group/'+groupid+'/profile')
      .then((response) => {
        console.log(response.data.UsersProfile)
        setProfile(response.data.UsersProfile)
      })
      .catch((response) => {
        console.log(response)
      }) 
      IsLoading(false)
    }
    fetchProfile()

  }, [groupid])

  const setUser = (uid) => {
    console.log(uid)
    const index = taskDetail.order_to.indexOf(uid)
  

    if (taskDetail.order_to.indexOf(uid) !== -1) {
      let emptyArr = taskDetail.order_to
      emptyArr.splice(index,1)
      setTaskDetail({...taskDetail, order_to: emptyArr})
    } else {
      setTaskDetail({...taskDetail, order_to: [...taskDetail.order_to, uid]})
    }
  }
  
  const handleSubmit = () => {
    console.log(taskDetail)
    axios({
      method: 'POST',
      url: 'https://jeny-bot.herokuapp.com/assign/task',
      data: taskDetail,
      headers: {
        'Content-Type': 'application/json',
        'UserId': userid,
        'GroupId': groupid
      }
    }).then((response) => {
      if (response.status === 201) {

        alert('Success')
        liff.closeWindow()
      } else {
        alert('Failed')
      }
    })
    .catch((response)=> {
      console.log(response)
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
                  ระบุคนที่ต้องการสั่งงาน
                </label>
              </div>
              <div >
                  {profile.map((p, index) => (
                  <div className="flex items-center flex-row space-x-4 space-y-4 max-w-md cursor-pointer"  onClick={ () => setUser(p.userId) }>
                    <input type="checkbox" className="ml-2  form-checkbox text-green-600" id={index} name={p.displayName} value={p.userId}></input>
                    <img src={p.pictureUrl} alt="profile" style={{borderRadius: "50%", width: "50px"}}></img>
                    <span className="text-gray-500">{p.displayName}</span>
                  </div>
                  ))}
                  
              </div>
      
              <div className="mt-3">
                  <label className="text-base mb-3" >ชื่องาน</label>
                  <input className="w-full px-3 py-1 mb-1 border-2 border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" type="text" onChange={event => setTaskDetail({...taskDetail, subject: event.target.value})}></input>
                  <label className="text-base mb-3" >รายละเอียดงาน</label>
                  <textarea className="w-full h-32 max-h-full px-3 py-1 mb-1 border-2 border-gray-200  rounded-md focus:outline-none focus:border-indigo-500 transition-colors" rows="10" style={{ resize: "none"}} onChange={event => setTaskDetail({...taskDetail, detail: event.target.value})}></textarea>
              </div>
              <div className="flex flex-col">
                  <label className="text-base" >ประเภทการสั่งงาน</label>
                  <div className="flex flex-row space-x-4 items-center">
                    <div >
                      <input type="radio" id ="group" name="type" value="group" onChange={event => setTaskDetail({...taskDetail, type: event.target.value})}></input>
                      <label className="mx-2 cursor-pointer" htmlFor="group">งานกลุ่ม</label>
                    </div>
                    <div >
                      <input type="radio" id ="single" name="type" value="single" onChange={event => setTaskDetail({...taskDetail, type: event.target.value})}></input>
                      <label className="mx-2 cursor-pointer" htmlFor="single">งานเดี่ยว</label>
                    </div>
                  </div>
                  
              </div>
              <div className="flex flex-col mb-5">
                  <label className="mb-1">กำหนดวันส่งงาน</label>
                  <DatePicker className="max-w-md px-2  b-1 border-2 border-gray-200  rounded-md focus:outline-none focus:border-indigo-500 transition-colors" selected={taskDetail.deadline} onChange={date => setTaskDetail({...taskDetail, deadline: date})} />
              </div>
              <button className="w-full block bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-3 font-semibold disabled:opacity-50" onClick={handleSubmit} disabled={isDisabled}>Submit</button>
            </div>
            
        </div>
    );
  }
  
  
}


export default Task;
