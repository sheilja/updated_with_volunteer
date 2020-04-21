const app=require("express");
const express=require("express");
const getdb=require("../db").getdb;
const path=require("path");
const router=app.Router();

router.get("/event_show",(req,res,next)=>
{
    if(req.session.username)
    {

    const db=getdb();
    db.collection('Student').find({"email":req.session.username}).toArray((err,data)=>{
        var count;
        var temp=req.session.allready_applied;
        var temp2=req.session.count_s;
        req.session.allready_applied=0;
        req.session.count_s=0;
             student_status=data[0].stu_status;     
    // db.collection('Main_Event').find().toArray((err,data2)=>{
        db.collection('Main_Event').aggregate([{$unwind:'$Sub_Events'}]).toArray((err,data2)=>{
        res.render('../views/main_side/event_show',{
               Mainevent:data2,
               status:student_status,
               count_status:temp2,
               all1:temp,
               
               message:req.flash("success")
        });
    }) ;
    });

    }
    else{
        return res.redirect("/login");  
    }
});
router.post("/exprience",(req,res,next)=>
{
    const db=getdb();
    const event_exp=req.body.exp_txt;
    const event_name=req.body.e_name;
        var Student_id1;
            const store={
            Event_name:event_name,
            Exprience:event_exp,
            status:"0"
        }
db.collection('Student').find({"email":req.session.username}).toArray((err,data)=>{
            var count;
                 Student_id1=data[0]._id; 
                count=data[0].volunteer_status;
                
        const updateon={_id:Student_id1};
        db.collection('Student').updateOne(updateon,{$push:{
            volunteer_event:store
        }},(err,data)=>{
            if(err)
            {
            console.log("Error Occured during Insertion");
           
        }else{
            console.log(err);
        }
            req.flash("success","Added");
            return res.redirect("/event_show");
        })
    
});
});
router.get("/event_exp",(req,res,next)=>
 { 
    if(req.session.username)
    {
            const db=getdb();
            const event=req.query.Event_name;
            db.collection('Student').find({"email":req.session.username}).toArray((err,data)=>{
                var count;
                     Student_id1=data[0]._id; 
                    count=data[0].volunteer_status;

                    db.collection('Student').find({ _id: Student_id1,volunteer_event: { $elemMatch: { Event_name: event} } } ).toArray((err,data1)=>{
                        console.log(event);

                        if(data1.length!=0)
                        {

                            req.session.allready_applied=1;

                            return res.redirect("/event_show");  
                       
                        }
                        else{
                            if(count>=2)
                            {
                                req.session.count_s=1;
                                return res.redirect("/event_show");  
                                           
                            }
                   
                    else{res.render('../views/main_side/exprience',{
                        e_name:event,
         
                        message:req.flash("success")
                 }); }
                        }
                    });

            /*if()
            {

            }
            else{

            }*/
              
        });
   }
   else
   {
        return res.redirect("/login");
   }
});

router.get("/check_volunterring",(req,res,next)=>
{
    if(req.session.username)
    {

    const db=getdb();
    db.collection('Student').find({"email":req.session.username}).toArray((err,data)=>{
        var count;
        var sid;
             sid=data[0]._id;
             student_status=data[0].stu_status;     
    // db.collection('Main_Event').find().toArray((err,data2)=>{
        db.collection('Student').aggregate([{$unwind:'$volunteer_event'},{$match:{'_id':{$eq:sid}}}]).toArray((err,data2)=>{
        res.render('../views/main_side/check_volunteer_status',{
               s:data2,

               message:req.flash("success")
        });
    }) ;
    });

    }
    else{
        return res.redirect("/login");  
    }
});
module.exports=router;
