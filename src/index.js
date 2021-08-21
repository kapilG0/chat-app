const express=require('express')
const path=require('path')
const http=require('http')
const socketio=require('socket.io')
const Filter=require('bad-words')
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT || 3000
const publicDirectoryPath=path.join(__dirname,'../public')
app.use(express.static(publicDirectoryPath))
const {generatemessage,generatelocation}=require('./utils/messages')
const {adduser,removeuser,getuser,getuserroom}=require('./utils/users')
io.on('connection',(socket)=>{
    console.log('new websocket')

        socket.on('join',({username,room},callback)=>{
            const {error,user}=adduser({
                id:socket.id,
                username:username,
                room:room
            })
            if(error){
                return callback(error)
             }
        socket.join(user.room)
        socket.emit('message',generatemessage(user.username,'welcome'))
        socket.broadcast.to(user.room).emit('message',generatemessage(`${user.username} has joined`))
             io.to(user.room).emit('roomdata',{
                 room:user.room,
                 users:getuserroom(user.room)
             })
        callback()

    })
    socket.on('sendmessage',(newmessage,callback)=>{
        const user=getuser(socket.id)
        const filter=new Filter()
        if(filter.isProfane(newmessage)){
            return callback('Profanity is not allowed')
        }
        io.to(user.room).emit('message',generatemessage(user.username,newmessage))
        callback(undefined,'send')
    })

    socket.on('sendlocation',(sendlocation,callback)=>{

        const user=getuser(socket.id)
        console.log(user,'user')
        io.to(user.room).emit('message1',generatelocation(user.username,`https://google.com/maps?q=${sendlocation.latitude},${sendlocation.longitude}`))
        callback()
    })
    
    
    socket.on('disconnect',()=>{
        const user=removeuser(socket.id)
        if(user){
            io.to(user.room).emit('message',generatemessage(user.username,`A user left ${user.username}`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getuserroom(user.room)
            })
            
        }
    })

})

server.listen(port,()=>{
    console.log('server started ',port)
})