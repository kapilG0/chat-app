const users=[]
const adduser=({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    console.log(username,'username')
    console.log(room,'room')
    if(!username || !room){
        console.log(username,'inside if username')
    console.log(room,'inside if room')
        return {
            error:'username and name required'
        }
    }
    const existinguser=users.find((user)=>{
        console.log(user.username,user.room,'user','room')
        return user.room === room && user.username===username
    })
    console.log(existinguser,'existinguser')
    if(existinguser){
        return{
            error:'username is in use'
        }
    }
    const user={id,username,room}
    console.log(user,'user in else')
    users.push(user)
    console.log(users,'users')
    return { user }
}

const removeuser=(id)=>{
    const index=users.findIndex((user)=> user.id===id)
    console.log(index,'index')
    if(index !== -1){
        // console.log(users.splice(index,1),'`')
        // console.log(users.splice(index,1)[0],'.')

        return users.splice(index,1)[0]
    }
}


//using arrow function shorthand property
const getuser=(id)=>{
    return users.find((user)=>user.id===id)
        // console.log(user.id,'user in getuser')
        // user.id===id
    // })
}


//  not using arrow function shorthand property
const getuserroom=(room)=>{
    room=room.trim().toLowerCase()
     const userrroomaaray=users.filter((user)=>{
         return user.room===room
     })
     console.log(userrroomaaray,'userroomarray')
     return userrroomaaray
}

// adduser({
//     id:1,
//     username:'kg',
//     room:'1'
// })
// adduser({
//     id:2,
//     username:'k',
//     room:'1'
// })
// adduser({
//     id:3,
//     username:'1',
//     room:'2'
// })
// const removedata=removeuser(2)
// console.log(removedata,'add')
// const data=getuser(1)
// console.log(data,'res')
// const userroom=getuserroom("    2")
// console.log(userroom,'userrom')
// console.log(users,'users')

module.exports={
    adduser:adduser,
    removeuser:removeuser,
    getuser:getuser,
    getuserroom:getuserroom
}