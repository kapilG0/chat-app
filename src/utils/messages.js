const generatemessage=(username,text)=>{
    return{
        username:username,
        text:text,
        createdAt:new Date().getTime()
    }
}
const generatelocation=(username,text)=>{
    return {
        username:username,
        text:text,
        createdAt:new Date().getTime()
    }
}
module.exports={
    generatemessage:generatemessage,
    generatelocation:generatelocation
}