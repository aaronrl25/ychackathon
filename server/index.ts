import 'dotenv/config'
import express from 'express'
import { createServer } from 'node:http'
import { MongoClient, ObjectId } from 'mongodb'
import { WebSocketServer } from 'ws'

type Feedback = 'accepted' | 'rejected' | 'edited' | 'remembered'
type Preference = { developerId:string; projectId?:string; text:string; category:string; confidence:number; evidenceCount:number; locked:boolean; embedding?:number[]; createdAt:Date; updatedAt:Date }

const app=express(),server=createServer(app),wss=new WebSocketServer({server,path:'/workspace'})
app.use(express.json({limit:'2mb'}))
const client=process.env.MONGODB_URI?new MongoClient(process.env.MONGODB_URI):null
const db=client?.db(process.env.MONGODB_DATABASE||'temper')
const preferences=db?.collection<Preference>('preferences')
const events=db?.collection('learning_events')
const broadcasts=(payload:unknown)=>wss.clients.forEach(socket=>socket.readyState===1&&socket.send(JSON.stringify(payload)))

app.get('/api/preferences',async(req,res)=>{
 if(!preferences)return res.json({mode:'demo',preferences:[]})
 const developerId=String(req.query.developerId||''),projectId=String(req.query.projectId||'')
 res.json(await preferences.find({developerId,$or:[{projectId:{$exists:false}},{projectId}]}).sort({locked:-1,confidence:-1}).toArray())
})

app.post('/api/context/retrieve',async(req,res)=>{
 const{developerId,projectId,embedding}=req.body as{developerId:string;projectId:string;embedding:number[]}
 if(!preferences||!embedding?.length)return res.json({preferences:[],memoryEnabled:Boolean(preferences)})
 const matches=await preferences.aggregate([{$vectorSearch:{index:'developer_memory',path:'embedding',queryVector:embedding,numCandidates:100,limit:8,filter:{developerId}}},{$match:{$or:[{projectId:{$exists:false}},{projectId}]}},{$project:{text:1,category:1,confidence:1,scope:{$cond:[{$eq:['$projectId',projectId]},'project','global']},score:{$meta:'vectorSearchScore'}}}]).toArray()
 res.json({preferences:matches,memoryEnabled:true})
})

app.post('/api/feedback',async(req,res)=>{
 const{developerId,projectId,suggestionId,type,editedContent,explicitPreference}=req.body as{developerId:string;projectId:string;suggestionId:string;type:Feedback;editedContent?:string;explicitPreference?:string}
 if(events)await events.insertOne({developerId,projectId,suggestionId,type,editedContent,createdAt:new Date()})
 // Only explicit memory is promoted immediately. Accept/edit evidence is accumulated for a later confidence threshold; rejection never becomes a preference.
 if(preferences&&type==='remembered'&&explicitPreference){const now=new Date();await preferences.updateOne({developerId,projectId,text:explicitPreference},{$set:{category:'explicit',confidence:1,locked:false,updatedAt:now},$setOnInsert:{createdAt:now,evidenceCount:1}},{upsert:true})}
 broadcasts({type:'profile.updated',developerId,projectId,feedback:type})
 res.status(202).json({captured:true,profileUpdated:type==='remembered'})
})

app.patch('/api/preferences/:id',async(req,res)=>{if(!preferences)return res.status(503).json({error:'MongoDB is not configured'});await preferences.updateOne({_id:new ObjectId(req.params.id)},{$set:{...req.body,updatedAt:new Date()}});broadcasts({type:'profile.updated'});res.sendStatus(204)})
app.delete('/api/preferences/:id',async(req,res)=>{if(!preferences)return res.status(503).json({error:'MongoDB is not configured'});await preferences.deleteOne({_id:new ObjectId(req.params.id)});broadcasts({type:'profile.updated'});res.sendStatus(204)})
app.get('/api/health',(_req,res)=>res.json({ok:true,memory:Boolean(db),realtime:true}))

const port=Number(process.env.PORT||8787)
async function start(){if(client)await client.connect();server.listen(port,()=>console.log(`Temper API listening on http://localhost:${port}`))}
start().catch(error=>{console.error(error);process.exit(1)})
