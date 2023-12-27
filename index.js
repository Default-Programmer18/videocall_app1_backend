const express=require("express");
const app=express();
// const app= require("express")();
const server=require("http").createServer(app);
const cors=require("cors");
const io=require("socket.io")(server,{cors:
                {
                origin:"*",
                methods:["GET","POST"]
                }
            })
            app.use(cors())
            app.get('/', (req, res) => {
                res.send('Running');
            });
// const {Server}=require("socket.io");

const port=8000
//app.listen(port,()=>console.log("Server is running at port",port))
server.listen(port,()=>console.log("Server is running at port",port))
// const io=new Server(port,{cors:true})
io.on("connection",(socket)=>{
        console.log("connection done",socket.id)
    io.to(socket.id).emit("getid",{id:socket.id})
    
    socket.on("usercall",({to,from,offer,name})=>{
        console.log("server e call asche",to,"from",from)
        io.to(to).emit("callrecieved",{from,offer,name})
    })
    socket.on("answercall",({from,to,answer,name})=>{
        io.to(to).emit("callaccepted",{from,to,answer,name})
    })
    socket.on("peerNegoUsercall",({to,from,offer})=>{
        io.to(to).emit("peerNegoCallrecieved",{from,offer})
    })

     socket.on("peerNegofinal",({answer,to})=>{

        io.to(to).emit("peerNegodone",{answer}) 
    })
    socket.on("callRejectedByReciever",({calling,to})=>{
        io.to(to).emit("stopCallingonCallRejected",{calling})

    })
    socket.on("callHangedUp",({to})=>
    {
        io.to(to).emit("callHangedUpMessage")
    })
})

