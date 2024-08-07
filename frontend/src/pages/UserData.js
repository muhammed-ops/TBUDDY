import './UserData.css'
import axios from 'axios'
import { useEffect, useState , useRef } from 'react'
import { useNavigate , Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser,faPlus, faX, faPenToSquare , faFaceFrown , faShareFromSquare,faUsers , faMessage , faLocationDot , faTrash , faClock , faPersonWalking , faSpinner ,faBars  } from "@fortawesome/free-solid-svg-icons";
import Footer from '../components/Footer'


const UserData = () =>{
    const [user , setUser] = useState(null)
    const [journey , setJourney] = useState([])
    const [to , setTo] = useState('')
    const [leavingtime , setLeavingTime] = useState('')
    const [note , setNote] = useState('')
    const [error , setError] = useState('')
    const [createJourneyVisible, setCreateJourneyVisible] = useState(false);
    const [showNote , setShowNote] = useState(true)
    const [inputValue , setInputValue] = useState('')
    const [updateButton , setUpdateButton] = useState(true)
    const [isLoading , setIsLoading] = useState(true)
    const [isMenuVisible, setIsMenuVisible] = useState(false);


    const inputRef = useRef(null)

    const navigate = useNavigate()

    const Logout = (e) =>{
        e.preventDefault()
        localStorage.clear('token')
        localStorage.clear('userid')
        navigate('/')

    }


    useEffect(()=>{
        let token = localStorage.getItem('token')

        axios.get('/api/users', {headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setUser(response.data)

        })
        .catch((error)=>{
            console.log(error)
        })
        axios.get('/api/alljourney', {headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setJourney(response.data)
            setIsLoading(false)
            

            
        })
        .catch((error)=>{
            console.log(error)
        })

    },[])
     

    
    


    const createJourney = (e) =>{
        let token = localStorage.getItem('token')

        e.preventDefault()
        axios.post('/api/journey', {to,leavingtime , note},{headers : {
            Authorization : `Bearer ${token}`,
            "Content-Type" : "application/json"
        }})
        .then((response)=>{
            console.log(response.data)
            setJourney(response.data)
            setTo('')
            setLeavingTime('')
            setNote('')
            setError('')
        })
        .catch((error)=>{
            console.log(error.response)
            setError(error.response.data)
        })
    }


    const peoplejoined = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/peoplejoined/${id}`,{} ,{headers : {
            Authorization : `Bearer ${token}`,
        }})
        .then((response)=>{
            setJourney(response.data)

        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data)

        })
        
        
    }

    const leavejourney = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/leavejourney/${id}`,{} ,{headers : {
            Authorization : `Bearer ${token}`,
        }})
        .then((response)=>{
            setJourney(response.data)

        })
        .catch((err)=>{
            console.log(err)
            alert(err.response.data)

        })

    }

    const showjourney = () =>{

        setCreateJourneyVisible(!createJourneyVisible);
    }
    

    const deleteJourney = (id) =>{
        let token = localStorage.getItem('token')


        axios.delete(`/api/journey/${id}`, {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then((response)=>{
            setJourney(response.data)
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    
    const leavesIn = (time) =>{
        let arr = time.split(':')
        let date = new Date()
        let date2 = new Date()
        date2.setHours(arr[0])
        date2.setMinutes(arr[1])
        let diff = (date2 - date) / 60000
        if(diff > 1){
            return `leaves in ${diff} minutes` 
        }else if(diff === 1){
            return 'leaves in 1 minute' 
        }
    }
    const Edit = () =>{
        inputRef.current.focus()
        inputRef.current.value = setInputValue(inputValue.concat(inputRef.current.value))
        setShowNote(false)
        setUpdateButton(false)
    }

    const handleClick = (e) =>{
        setInputValue(e.target.value)
    }

    const Cancel = () =>{
        setUpdateButton(true)
        setShowNote(true)
        setInputValue('')
    }

    const UpdateNote = (id) =>{
        let token = localStorage.getItem('token')

        axios.patch(`/api/updatenote/${id}` , { update : inputValue } , {headers : {
            Authorization : `Bearer ${token}`
        }})
        .then((response)=>{
            setJourney(response.data)
            
        setUpdateButton(true)
        setShowNote(true)
        setInputValue('')
            
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    const showSideBar = () =>{
        setIsMenuVisible(!isMenuVisible)
    }




    return(
        <>
        {user &&
        <div className='top'>
        <div className='top2'>
            <FontAwesomeIcon className='user' icon={faUser}/>
            <p>Hi , {user && user.username[0].toUpperCase() + user.username.slice( 1 , user.username.length)}</p>
        </div>
        <p className='head'>T-Buddy</p>
        <div className='top3'>
        <FontAwesomeIcon icon={faShareFromSquare} className='sharefromsquare' />
        <button onClick={Logout}>Logout</button>
        <FontAwesomeIcon icon={!isMenuVisible ? faBars : faX} onClick={showSideBar} className='bars' />

        </div>
        </div>
        }

        {user && <div className='top4'>
            <div className={`sidebar ${isMenuVisible ? 'show' : ''}`}>
            <div className='slidebarinner1'>
                <div>
                    <Link to = {`/profile/${user._id}`}>Edit Profile</Link>
                </div> <hr></hr>
                <button onClick={Logout} className='logoutsidebar'>Logout</button> <hr></hr>

                <p onClick={showjourney}><FontAwesomeIcon icon={!createJourneyVisible?faPlus : faX} className='plus' /></p>
                <p className='create'>Create Journey</p>
            </div>
            { createJourneyVisible && <div className='form'>
                <div className='formcontainer1'>
                    <p className='formlocationlogo'><FontAwesomeIcon   icon={faLocationDot}/></p>
                    <input type='text' placeholder='To' value={to} onChange={(e)=>{setTo(e.target.value)}} /> <br></br>
                </div>
                <div className='formcontainer2'>
                <p>Leaving time:</p>
                <input type='time' value={leavingtime} onChange={(e)=>{setLeavingTime(e.target.value)}} /> <br></br>
                </div>
                <div className='formcontainer3'>
                <p className='messageicon'><FontAwesomeIcon  icon={faMessage}/></p>
                <textarea value={note} onChange={(e)=>{setNote(e.target.value)}} placeholder='note'>

                </textarea>
                </div> <br></br>
                <p className='error'>{error}</p>
                <div className='formcontainer4'>
                <button onClick={createJourney}>Create Journey</button>
                </div>
            </div>}
        </div>
        
        <div className='top5'>
        {
        !isMenuVisible ? (
    journey.length > 0 && !isLoading ? (
      journey.map((journey, index) => (
        <div key={index} className='top6'>
          <div className='location'>
            <div className='locationfirstcontainer'>
              <FontAwesomeIcon className='locationlogo' icon={faLocationDot} />
              <p>{journey.to}</p>
            </div>
            <div>
              {user._id !== journey.userid && !journey.peoplejoined.includes(user._id) ? (
                <button onClick={() => peoplejoined(journey._id)}>Accept</button>
              ) : (
                user._id !== journey.userid && journey.peoplejoined.includes(user._id) ? (
                  <button onClick={() => leavejourney(journey._id)}>Leave</button>
                ) : (
                  <FontAwesomeIcon className='delete' onClick={() => deleteJourney(journey._id)} icon={faTrash} />
                )
              )}
            </div>
          </div>
          <div className='leavingtime'>
            <FontAwesomeIcon className='clock' icon={faClock} />
            <p>{journey.leavingtime}, <span className='leaves'>{leavesIn(journey.leavingtime)}</span></p>
          </div>
          <div className='info'>
            <FontAwesomeIcon className='personwalking' icon={faPersonWalking} />
            <p>
              {journey.username[0].toUpperCase() + journey.username.slice(1)} - {journey.userage} - {journey.usergender} {user._id !== journey.userid ? <Link to={`/profile/${journey.userid}`}>view profile</Link> : null}
            </p>
          </div>
          <div className='note'>
            <FontAwesomeIcon icon={faMessage} />
            <>
              {user._id === journey.userid ? (
                <p>
                  <input
                    className='noteinput'
                    onChange={handleClick}
                    ref={inputRef}
                    value={showNote ? journey.note[0].toUpperCase() + journey.note.slice(1) : inputValue}
                  />
                  {updateButton ? (
                    <span onClick={() => Edit()} className='pentosquare'><FontAwesomeIcon icon={faPenToSquare} /></span>
                  ) : (
                    <>
                      <button className='noteupdate' onClick={() => UpdateNote(journey._id)}>update</button>
                      <span onClick={Cancel}><FontAwesomeIcon className='notecancel' icon={faX} /></span>
                    </>
                  )}
                </p>
              ) : (
                <p>{journey.note[0].toUpperCase() + journey.note.slice(1)}</p>
              )}
            </>
          </div>
          <div className='peoplejoined'>
            <FontAwesomeIcon icon={faUsers} />
            <p>{journey.numberofpeoplejoined}</p>
          </div>
        </div>
      ))
    ) : !journey.length && isLoading ? (
      <p className='nojourney'><FontAwesomeIcon className='loadingspinner' icon={faSpinner} /></p>
    ) : !journey.length && !isLoading ? (
      <p className='nojourney'>No journey available <FontAwesomeIcon className='sadface' icon={faFaceFrown} /></p>
    ) : null
  ) : null
}

        </div>
        </div>
        }
        {user &&
        <Footer />
        }
        </>
    )
}
export default UserData