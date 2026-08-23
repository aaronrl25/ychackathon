import 'dotenv/config'
import express from 'express'
import {createServer} from'node:http'
import {applicationDefault,cert,getApps,initializeApp}from'firebase-admin/app'
import {FieldValue,getFirestore}from'firebase-admin/firestore'
import {WebSocketServer}from'ws'

type Feedback='accepted'|'rejected'|'edited'|'remembered'
const configured=Boolean(process.env.FIREBASE_PROJECT_ID)
if(!getApps().length)initializeApp({credential:configured?cert({projectId:process.env.FIREBASE_PROJECT_ID,clientEmail:process.env.FIREBASE_CLIENT_EMAIL,privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,'\n')}):applicationDefault()})
const db=getFirestore(),app=express(),server=createServer(app),wss=new WebSocketServer({server,path:'/workspace'})
app.use(express.json({limit:'2mb'}))
const broadcast=(data:unknown)=>wss.clients.forEach(s=>s.readyState===1&&s.send(JSON.stringify(data)))

app.get('/api/preferences',async(req,res)=>{try{const developerId=String(req.query.developerId||''),projectId=String(req.query.projectId||'');const snap=await db.collection('preferences').where('developerId','==',developerId).get();const rows=snap.docs.map(d=>({id:d.id,...d.data()})).filter((p:any)=>!p.projectId||p.projectId===projectId).sort((a:any,b:any)=>Number(b.locked)-Number(a.locked)||b.confidence-a.confidence);res.json(rows)}catch{res.json({mode:'demo',preferences:[]})}})
app.post('/api/context/retrieve',async(req,res)=>{const{developerId,projectId,intent}=req.body;try{const snap=await db.collection('preferences').where('developerId','==',developerId).get();const terms=String(intent||'').toLowerCase().split(/\W+/);const matches=snap.docs.map(d=>({id:d.id,...d.data()}as any)).filter(p=>(!p.projectId||p.projectId===projectId)&&p.enabled!==false).map(p=>({...p,score:terms.filter((t:string)=>`${p.text} ${p.category}`.toLowerCase().includes(t)).length+p.confidence})).sort((a,b)=>b.score-a.score).slice(0,8);res.json({preferences:matches,memoryEnabled:true,provider:'firestore'})}catch{res.json({preferences:[],memoryEnabled:false,provider:'demo'})}})
app.post('/api/feedback',async(req,res)=>{const{developerId,projectId,suggestionId,type,editedContent,explicitPreference}=req.body as{developerId:string;projectId:string;suggestionId:string;type:Feedback;editedContent?:string;explicitPreference?:string};await db.collection('learningEvents').add({developerId,projectId,suggestionId,type,editedContent,createdAt:FieldValue.serverTimestamp()});if(type==='remembered'&&explicitPreference)await db.collection('preferences').add({developerId,projectId,text:explicitPreference,category:'explicit',confidence:1,evidenceCount:1,locked:false,enabled:true,createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});broadcast({type:'profile.updated',developerId,projectId,feedback:type});res.status(202).json({captured:true,profileUpdated:type==='remembered'})})
app.patch('/api/preferences/:id',async(req,res)=>{await db.collection('preferences').doc(req.params.id).update({...req.body,updatedAt:FieldValue.serverTimestamp()});broadcast({type:'profile.updated'});res.sendStatus(204)})
app.delete('/api/preferences/:id',async(req,res)=>{await db.collection('preferences').doc(req.params.id).delete();broadcast({type:'profile.updated'});res.sendStatus(204)})
app.get('/api/health',(_req,res)=>res.json({ok:true,memory:configured,provider:'firebase',realtime:true}))
server.listen(Number(process.env.PORT||8787),()=>console.log(`Temper Firebase API listening on http://localhost:${process.env.PORT||8787}`))
