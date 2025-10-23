"use strict";(()=>{var t={};t.id=3547,t.ids=[3547],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78018:t=>{t.exports=require("puppeteer")},82361:t=>{t.exports=require("events")},57147:t=>{t.exports=require("fs")},22037:t=>{t.exports=require("os")},76224:t=>{t.exports=require("tty")},57310:t=>{t.exports=require("url")},73837:t=>{t.exports=require("util")},54186:(t,e,o)=>{o.r(e),o.d(e,{originalPathname:()=>b,patchFetch:()=>w,requestAsyncStorage:()=>f,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>y});var a={};o.r(a),o.d(a,{POST:()=>h});var r=o(49303),i=o(88716),n=o(60670),s=o(87070),d=o(20728),l=o(60836),c=o(21178),p=o(71597),u=o.n(p);async function g(t){let e=await d.Z.settings.findUnique({where:{userId:t}});return e&&e.whatsappAccessToken&&e.whatsappPhoneNumberId?{token:e.whatsappAccessToken,phoneId:e.whatsappPhoneNumberId}:null}async function h(t,e){let{id:o}=await e.params;try{let t=await d.Z.quotation.findUnique({where:{id:o},include:{contact:!0,items:{include:{product:!0}}}});if(!t||!t.contact)return s.NextResponse.json({error:"Quotation or associated contact not found"},{status:404});let e=await g(t.contact.userId);if(!e)return s.NextResponse.json({error:"WhatsApp is not configured for this user. Please check your settings."},{status:400});let a=`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; width: 600px; background-color: #ffffff; color: #1a202c; }
                h1 { font-size: 32px; font-weight: bold; text-align: center; margin-bottom: 30px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; font-size: 14px; color: #4a5568; }
                .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                .table th, .table td { border-bottom: 1px solid #e2e8f0; padding: 8px; font-size: 14px; text-align: left; }
                .table th { font-weight: bold; color: #2d3748; }
                .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
              </style>
            </head>
            <body>
              <h1>Quotation</h1>
              <div class="header">
                <div>
                  <strong>Billed To:</strong><br/>
                  ${t.customerName}<br/>
                  ${t.contactNumber}<br/>
                  ${t.billingAddress?.replace(/\n/g,"<br/>")||""}
                </div>
                <div style="text-align: right;">
                  <strong>Quotation ID:</strong> ${t.id.substring(0,8)}<br/>
                  <strong>Date:</strong> ${new Date(t.createdAt).toLocaleDateString()}
                </div>
              </div>
              <table class="table">
                <thead><tr><th>Product</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th><th style="text-align:right;">Subtotal</th></tr></thead>
                <tbody>
                  ${t.items.map(t=>`
                    <tr>
                      <td>${t.product?.name||"N/A"}</td>
                      <td style="text-align:center;">${t.quantity}</td>
                      <td style="text-align:right;">₹${t.price.toFixed(2)}</td>
                      <td style="text-align:right;">₹${(t.quantity*t.price).toFixed(2)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <div class="total">Grand Total: ₹${t.total.toLocaleString("en-IN")}</div>
            </body>
          </html>
        `,r=await u()({html:a,puppeteerArgs:{args:["--no-sandbox"]}}),i="ce388deb1931d0d58b9e876d99c2b152";if(!i)throw console.error("ImgBB API key is not configured."),Error("Server configuration error for file uploads.");let n=new FormData;n.append("image",r.toString("base64"));let p=await fetch(`https://api.imgbb.com/1/upload?key=${i}`,{method:"POST",body:n}),h=await p.json();if(!p.ok||!h.data?.url)throw console.error("ImgBB upload failed for quotation:",h),Error("Failed to upload quotation image.");let m=h.data.url,f=`Hi ${t.customerName}, here is the quotation you requested. Let us know if you'd like to proceed!`,y=await (0,l.xN)(t.contact.phone,m,f,e),x=y?.messages?.[0]?.id,b=await d.Z.message.create({data:{from:"business",to:t.contact.phone,type:"image",text:f,mediaUrl:m,contactId:t.contact.id,wamid:x,status:x?"sent":"failed"}});await (0,c.F)("newMessage",b);let w=await d.Z.quotation.update({where:{id:o},data:{status:"SENT"}});return s.NextResponse.json({success:!0,quotation:w})}catch(t){return console.error(`Failed to send quotation image for ${o}:`,t),s.NextResponse.json({error:"Failed to send quotation"},{status:500})}}let m=new r.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/quotations/[id]/send-as-image/route",pathname:"/api/quotations/[id]/send-as-image",filename:"route",bundlePath:"app/api/quotations/[id]/send-as-image/route"},resolvedPagePath:"C:\\vyaparconnect-crm\\src\\app\\api\\quotations\\[id]\\send-as-image\\route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:f,staticGenerationAsyncStorage:y,serverHooks:x}=m,b="/api/quotations/[id]/send-as-image/route";function w(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:y})}},20728:(t,e,o)=>{o.d(e,{Z:()=>r});let a=require("@prisma/client"),r=globalThis.prisma||new a.PrismaClient},21178:(t,e,o)=>{o.d(e,{F:()=>a});async function a(t,e){try{let o="https://e3e2fbab318c.ngrok-free.app/api/socket/emit",a=process.env.SOCKET_EMITTER_SECRET;if(!a){console.error("SOCKET_EMITTER_SECRET is not defined. Cannot emit socket event.");return}fetch(o,{method:"POST",headers:{"Content-Type":"application/json","x-emitter-secret":a},body:JSON.stringify({event:t,data:e})}).catch(e=>{console.error(`Failed to emit socket event '${t}' to ${o}:`,e.message)})}catch(t){console.error("Error preparing socket event emission:",t)}}},60836:(t,e,o)=>{o.d(e,{U3:()=>i,eG:()=>s,xN:()=>n});let a=t=>new Promise(e=>setTimeout(e,t));async function r(t,e,o){let r=`https://graph.facebook.com/v20.0/${o}/messages`,i={method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(t)};for(let t=1;t<=3;t++)try{let e=await fetch(r,i);if(e.ok)return await e.json();let o=await e.json().catch(()=>({}));if(console.error(`Attempt ${t}/3 failed with status ${e.status}:`,JSON.stringify(o)),e.status>=400&&e.status<500)return console.error("Client error, not retrying."),null;if(t<3){let e=1e3*Math.pow(2,t-1);console.log(`Retrying in ${e}ms...`),await a(e)}}catch(e){if(console.error(`Attempt ${t}/3 failed with network error:`,e),t<3){let e=1e3*Math.pow(2,t-1);console.log(`Retrying in ${e}ms...`),await a(e)}}return console.error("Failed to send message after 3 attempts."),null}async function i(t,e,o,a){let i={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"text",text:{body:e}};return a&&(i.context={message_id:a}),r(i,o.token,o.phoneId)}async function n(t,e,o,a,i){let n={link:e};o&&o.trim()&&(n.caption=o);let s={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"image",image:n};return i&&(s.context={message_id:i}),r(s,a.token,a.phoneId)}async function s(t,e,o,a,i,n){let s={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"document",document:{link:e,caption:o,filename:a}};return n&&(s.context={message_id:n}),r(s,i.token,i.phoneId)}}};var e=require("../../../../../webpack-runtime.js");e.C(t);var o=t=>e(e.s=t),a=e.X(0,[8948,5972,9092,1597],()=>o(54186));module.exports=a})();