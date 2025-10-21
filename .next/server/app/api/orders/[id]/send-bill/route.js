"use strict";(()=>{var e={};e.id=7031,e.ids=[7031],e.modules={67096:e=>{e.exports=require("bcrypt")},72934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},54580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},45869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78018:e=>{e.exports=require("puppeteer")},39491:e=>{e.exports=require("assert")},14300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},82361:e=>{e.exports=require("events")},57147:e=>{e.exports=require("fs")},13685:e=>{e.exports=require("http")},95687:e=>{e.exports=require("https")},22037:e=>{e.exports=require("os")},63477:e=>{e.exports=require("querystring")},76224:e=>{e.exports=require("tty")},57310:e=>{e.exports=require("url")},73837:e=>{e.exports=require("util")},59796:e=>{e.exports=require("zlib")},79464:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>b,patchFetch:()=>w,requestAsyncStorage:()=>f,routeModule:()=>h,serverHooks:()=>y,staticGenerationAsyncStorage:()=>x});var a={};r.r(a),r.d(a,{POST:()=>g});var s=r(49303),i=r(88716),o=r(60670),n=r(87070),d=r(20728),l=r(21178),p=r(60836),c=r(71597),u=r.n(c),m=r(95456);async function g(e,t){let r=await (0,m.P)();if(!r?.user)return n.NextResponse.json({error:"Not authenticated"},{status:401});let{id:a}=await t.params;try{let e=await d.Z.order.findUnique({where:{id:a},include:{contact:!0,items:!0,payments:!0}});if(!e||!e.contact)return n.NextResponse.json({error:"Order not found"},{status:404});if(e.userId!==r.user.id)return n.NextResponse.json({error:"Forbidden"},{status:403});let t=await d.Z.settings.findUnique({where:{userId:e.userId}}),s=t?.whatsappAccessToken&&t?.whatsappPhoneNumberId?{token:t.whatsappAccessToken,phoneId:t.whatsappPhoneNumberId}:null;if(!s)throw Error("WhatsApp API credentials are not configured in settings.");let i=function(e,t){let r=e.items.reduce((e,t)=>e+t.price*Number(t.quantity||1),0),a=r*(e.discountPercentage||0)/100;return`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; width: 600px; background-color: #f9f9f9; color: #333; }
            .container { border: 1px solid #eee; background-color: white; padding: 30px; border-radius: 8px; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .address-section { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 12px; color: #555; }
            .company-details { font-size: 12px; color: #555; }
            .bill-details { text-align: right; font-size: 12px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            .table th { background-color: #f7fafc; font-weight: bold; }
            .totals { float: right; width: 50%; margin-top: 20px; font-size: 14px; }
            .totals div { display: flex; justify-content: space-between; padding: 5px 0; }
            .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div>
                ${t?.companyLogoUrl?`<img src="${t.companyLogoUrl}" alt="logo" style="max-width: 150px; margin-bottom: 10px;"/>`:""}
                <div class="company-details">
                  <strong>${t?.companyName||"Your Company"}</strong><br/>
                  ${t?.companyAddress?.replace(/\n/g,"<br/>")||""}
                </div>
              </div>
              <div class="bill-details">
                <h2>INVOICE</h2>
                <strong>Order ID:</strong> #${e.id.substring(0,6)}<br/>
                <strong>Date:</strong> ${new Date(e.createdAt).toLocaleDateString()}
              </div>
            </div>
             <div class="address-section">
                <div><strong>Billed To:</strong><br/>${e.customerName}<br/>${e.billingAddress?.replace(/\n/g,"<br/>")||""}</div>
                <div><strong>Shipped To:</strong><br/>${e.customerName}<br/>${e.shippingAddress?.replace(/\n/g,"<br/>")||""}</div>
            </div>
            <table class="table">
              <thead><tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>
              <tbody>
                ${e.items.map(e=>`
                  <tr>
                    <td>${e.productName}</td>
                    <td style="text-align:center;">${e.quantity}</td>
                    <td style="text-align:right;">₹${e.price.toFixed(2)}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
            <div class="totals">
              <div><span>Subtotal</span><span>₹${r.toFixed(2)}</span></div>
              ${e.discountPercentage?`<div><span>Discount (${e.discountPercentage}%)</span><span>- ₹${a.toFixed(2)}</span></div>`:""}
              ${e.deliveryCharges?`<div><span>Delivery</span><span>+ ₹${e.deliveryCharges.toFixed(2)}</span></div>`:""}
              <div class="grand-total"><span>Grand Total</span><span>₹${e.total.toFixed(2)}</span></div>
            </div>
          </div>
        </body>
      </html>`}(e,t),o=await u()({html:i,puppeteerArgs:{args:["--no-sandbox"]}}),c="ce388deb1931d0d58b9e876d99c2b152";if(!c)throw console.error("ImgBB API key is not configured."),Error("Server configuration error for file uploads.");let m=new FormData;m.append("image",o.toString("base64"));let g=await fetch(`https://api.imgbb.com/1/upload?key=${c}`,{method:"POST",body:m}),h=await g.json();if(!g.ok||!h.data?.url)throw console.error("ImgBB upload failed for order bill:",h),Error("Failed to upload bill image.");let f=h.data.url,x=`Hi ${e.customerName}, thank you for your order! Please find the bill attached.`,y=await d.Z.message.create({data:{from:"business",to:e.contact.phone,type:"image",text:x,mediaUrl:f,contactId:e.contact.id,status:"pending"},include:{contact:!0}});await (0,l.F)("newMessage",y);let b=await (0,p.xN)(e.contact.phone,f,x,s),w=b?.messages?.[0]?.id,v=w?"sent":"failed",$=await d.Z.message.update({where:{id:y.id},data:{wamid:w,status:v}});if(await (0,l.F)("message-status-update",{id:$.id,status:v,wamid:w}),!w)throw Error("Failed to send message via WhatsApp.");let q=await d.Z.order.update({where:{id:a},data:{status:"CONFIRMED"}});return n.NextResponse.json({success:!0,order:q})}catch(e){return console.error(`Failed to send bill for order ${a}:`,e),n.NextResponse.json({error:e.message||"Failed to send bill"},{status:500})}}let h=new s.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/orders/[id]/send-bill/route",pathname:"/api/orders/[id]/send-bill",filename:"route",bundlePath:"app/api/orders/[id]/send-bill/route"},resolvedPagePath:"C:\\vyaparconnect-crm\\src\\app\\api\\orders\\[id]\\send-bill\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:f,staticGenerationAsyncStorage:x,serverHooks:y}=h,b="/api/orders/[id]/send-bill/route";function w(){return(0,o.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:x})}},95456:(e,t,r)=>{r.d(t,{L:()=>l,P:()=>p});var a=r(45609),s=r(53797),i=r(13539),o=r(20728),n=r(67096),d=r.n(n);let l={adapter:(0,i.N)(o.Z),providers:[(0,s.Z)({name:"Credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(e){if(!e?.email||!e.password)return null;let t=await o.Z.user.findUnique({where:{email:e.email}});return t&&t.password&&await d().compare(e.password,t.password)?{id:t.id,name:t.name,email:t.email}:null}})],session:{strategy:"jwt"},secret:process.env.NEXTAUTH_SECRET,callbacks:{session:async({token:e,session:t})=>(e&&t.user&&(t.user.id=e.id,t.user.name=e.name,t.user.email=e.email,t.user.hasCompletedOnboarding=e.hasCompletedOnboarding,t.user.primaryWorkflow=e.primaryWorkflow),t),async jwt({token:e,user:t}){if(t&&(e.id=t.id),!e.id)return e;let r=await o.Z.user.findUnique({where:{id:e.id},include:{settings:!0}});return r?{...e,id:r.id,name:r.name,email:r.email,hasCompletedOnboarding:r.hasCompletedOnboarding,primaryWorkflow:r.settings?.primaryWorkflow||"HYBRID"}:(e.id=void 0,e)}},pages:{signIn:"/login"}},p=()=>(0,a.getServerSession)(l)},20728:(e,t,r)=>{r.d(t,{Z:()=>s});let a=require("@prisma/client"),s=globalThis.prisma||new a.PrismaClient},21178:(e,t,r)=>{r.d(t,{F:()=>a});async function a(e,t){let r=process.env.SOCKET_SERVER_URL,a=process.env.SOCKET_EMITTER_SECRET;if(!r||!a){console.error("Socket emitter URL or secret is not configured on the server. Real-time events will not be sent.");return}try{fetch(`${r}/emit`,{method:"POST",headers:{"Content-Type":"application/json","x-emitter-secret":a},body:JSON.stringify({event:e,data:t})})}catch(e){console.error("Failed to emit socket event:",e)}}},60836:(e,t,r)=>{r.d(t,{U3:()=>i,eG:()=>n,xN:()=>o});let a=e=>new Promise(t=>setTimeout(t,e));async function s(e,t,r){let s=`https://graph.facebook.com/v20.0/${r}/messages`,i={method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify(e)};for(let e=1;e<=3;e++)try{let t=await fetch(s,i);if(t.ok)return await t.json();let r=await t.json().catch(()=>({}));if(console.error(`Attempt ${e}/3 failed with status ${t.status}:`,JSON.stringify(r)),t.status>=400&&t.status<500)return console.error("Client error, not retrying."),null;if(e<3){let t=1e3*Math.pow(2,e-1);console.log(`Retrying in ${t}ms...`),await a(t)}}catch(t){if(console.error(`Attempt ${e}/3 failed with network error:`,t),e<3){let t=1e3*Math.pow(2,e-1);console.log(`Retrying in ${t}ms...`),await a(t)}}return console.error("Failed to send message after 3 attempts."),null}async function i(e,t,r,a){let i={messaging_product:"whatsapp",recipient_type:"individual",to:e,type:"text",text:{body:t}};return a&&(i.context={message_id:a}),s(i,r.token,r.phoneId)}async function o(e,t,r,a,i){let o={link:t};r&&r.trim()&&(o.caption=r);let n={messaging_product:"whatsapp",recipient_type:"individual",to:e,type:"image",image:o};return i&&(n.context={message_id:i}),s(n,a.token,a.phoneId)}async function n(e,t,r,a,i,o){let n={messaging_product:"whatsapp",recipient_type:"individual",to:e,type:"document",document:{link:t,caption:r,filename:a}};return o&&(n.context={message_id:o}),s(n,i.token,i.phoneId)}}};var t=require("../../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[8948,5972,1184,9092,1597],()=>r(79464));module.exports=a})();