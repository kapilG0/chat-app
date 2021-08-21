const socket=io()

const $messageform=document.querySelector('#formone')
const $messageforminput=$messageform.querySelector('input')
const $messageformbutton=$messageform.querySelector('button')
const $sendlocationbutton=document.querySelector('#location')
const $messages=document.querySelector('#messages')
const locationuser=document.querySelector('#messagetemplatelocation').innerHTML

//template rendering mthod
const messagetemplate=document.querySelector('#messagetemplate').innerHTML

const sidebartemplate=document.querySelector('#sidebartemplate').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=()=>{
    const $newmessage=$messages.lastElementChild

    const newmessagestyle=getComputedStyle($newmessage)

    const newmessagemargin=parseInt(newmessagestyle.marginBottom)

    const newmessageheight=$newmessage.offsetHeight+newmessagemargin

    const visibleheight=$messages.offsetHeight

    const contentheight=$messages.scrollHeight

    const scrolloffset=$messages.scrollTop + visibleheight

    if(contentheight-newmessageheight <= scrolloffset){
        $messages.scrollTop=$messages.scrollHeight
    }

}

socket.on('message1',(locationmessage)=>{
    console.log(locationmessage,'location')
    const html=Mustache.render(locationuser,{
        username:locationmessage.username,
        locationmessage:locationmessage.text,
        createdAt:moment(locationmessage.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})



socket.on('message',(message)=>{
    console.log(message)
    const html=Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()

})

socket.on('roomdata',({room,users})=>{
    console.log(room,'room')
    console.log(users,'users')
    const html=Mustache.render(sidebartemplate,{
        room:room,
        users:users
    })
    document.querySelector('#sidebar').innerHTML=html
})


$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()
    // const message1= e.target.elements.message.value
    // console.log(message1,'meesage1')


    $messageformbutton.setAttribute('disabled','disabled')
    
    var message=e.target.elements.message.value
    console.log(message,'message')
    socket.emit('sendmessage',message,(error,message1)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value=''
        $messageforminput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message was delive',message1)
    })

})
$sendlocationbutton.addEventListener('click',()=>{
    console.log(navigator.geolocation,'geo')
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $sendlocationbutton.setAttribute('disabled','disabled')
    console.log('before navigaot')
    navigator.geolocation.getCurrentPosition((position)=>{
        console.log('after navigate')
        console.log(position,'position')
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendlocationbutton.removeAttribute('disabled')
            console.log('location shared')
        })
    })
})
// socket.on('message1',(message1)=>{
//     console.log(message1,'message1')
// })
socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})