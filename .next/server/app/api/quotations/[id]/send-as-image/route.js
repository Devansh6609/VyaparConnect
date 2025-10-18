(()=>{var t={};t.id=3547,t.ids=[3547],t.modules={20399:t=>{"use strict";t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{"use strict";t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},77489:t=>{"use strict";t.exports=require("node-html-to-image")},14300:t=>{"use strict";t.exports=require("buffer")},32081:t=>{"use strict";t.exports=require("child_process")},6113:t=>{"use strict";t.exports=require("crypto")},82361:t=>{"use strict";t.exports=require("events")},57147:t=>{"use strict";t.exports=require("fs")},13685:t=>{"use strict";t.exports=require("http")},95687:t=>{"use strict";t.exports=require("https")},41808:t=>{"use strict";t.exports=require("net")},22037:t=>{"use strict";t.exports=require("os")},12781:t=>{"use strict";t.exports=require("stream")},24404:t=>{"use strict";t.exports=require("tls")},76224:t=>{"use strict";t.exports=require("tty")},57310:t=>{"use strict";t.exports=require("url")},73837:t=>{"use strict";t.exports=require("util")},59796:t=>{"use strict";t.exports=require("zlib")},56804:()=>{},68645:()=>{},54186:(t,e,r)=>{"use strict";r.r(e),r.d(e,{originalPathname:()=>b,patchFetch:()=>w,requestAsyncStorage:()=>f,routeModule:()=>m,serverHooks:()=>y,staticGenerationAsyncStorage:()=>x});var o={};r.r(o),r.d(o,{POST:()=>h});var i=r(49303),s=r(88716),a=r(60670),n=r(87070),u=r(20728),d=r(60836),c=r(64284),l=r(77489),p=r.n(l);async function g(t){let e=await u.Z.settings.findUnique({where:{userId:t}});return e&&e.whatsappAccessToken&&e.whatsappPhoneNumberId?{token:e.whatsappAccessToken,phoneId:e.whatsappPhoneNumberId}:null}async function h(t,e){let{id:r}=await e.params;try{let t=await u.Z.quotation.findUnique({where:{id:r},include:{contact:!0,items:{include:{product:!0}}}});if(!t||!t.contact)return n.NextResponse.json({error:"Quotation or associated contact not found"},{status:404});let e=await g(t.contact.userId);if(!e)return n.NextResponse.json({error:"WhatsApp is not configured for this user. Please check your settings."},{status:400});let o=`
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
        `,i=await p()({html:o,puppeteerArgs:{args:["--no-sandbox"]}}),s="ce388deb1931d0d58b9e876d99c2b152";if(!s)throw console.error("ImgBB API key is not configured."),Error("Server configuration error for file uploads.");let a=new FormData;a.append("image",i.toString("base64"));let l=await fetch(`https://api.imgbb.com/1/upload?key=${s}`,{method:"POST",body:a}),h=await l.json();if(!l.ok||!h.data?.url)throw console.error("ImgBB upload failed for quotation:",h),Error("Failed to upload quotation image.");let m=h.data.url,f=`Hi ${t.customerName}, here is the quotation you requested. Let us know if you'd like to proceed!`,x=await (0,d.xN)(t.contact.phone,m,f,e),y=x?.messages?.[0]?.id,b=await u.Z.message.create({data:{from:"business",to:t.contact.phone,type:"image",text:f,mediaUrl:m,contactId:t.contact.id,wamid:y,status:y?"sent":"failed"}});c.E()?.emit("newMessage",b);let w=await u.Z.quotation.update({where:{id:r},data:{status:"SENT"}});return n.NextResponse.json({success:!0,quotation:w})}catch(t){return console.error(`Failed to send quotation image for ${r}:`,t),n.NextResponse.json({error:"Failed to send quotation"},{status:500})}}let m=new i.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/quotations/[id]/send-as-image/route",pathname:"/api/quotations/[id]/send-as-image",filename:"route",bundlePath:"app/api/quotations/[id]/send-as-image/route"},resolvedPagePath:"C:\\vyaparconnect-crm\\src\\app\\api\\quotations\\[id]\\send-as-image\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:f,staticGenerationAsyncStorage:x,serverHooks:y}=m,b="/api/quotations/[id]/send-as-image/route";function w(){return(0,a.patchFetch)({serverHooks:y,staticGenerationAsyncStorage:x})}},20728:(t,e,r)=>{"use strict";r.d(e,{Z:()=>i});let o=require("@prisma/client"),i=globalThis.prisma||new o.PrismaClient},64284:(t,e,r)=>{"use strict";function o(){return globalThis.io}r.d(e,{E:()=>o}),r(83861)},60836:(t,e,r)=>{"use strict";r.d(e,{U3:()=>s,eG:()=>n,xN:()=>a});let o=t=>new Promise(e=>setTimeout(e,t));async function i(t,e,r){let i=`https://graph.facebook.com/v20.0/${r}/messages`,s={method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify(t)};for(let t=1;t<=3;t++)try{let e=await fetch(i,s);if(e.ok)return await e.json();let r=await e.json().catch(()=>({}));if(console.error(`Attempt ${t}/3 failed with status ${e.status}:`,JSON.stringify(r)),e.status>=400&&e.status<500)return console.error("Client error, not retrying."),null;if(t<3){let e=1e3*Math.pow(2,t-1);console.log(`Retrying in ${e}ms...`),await o(e)}}catch(e){if(console.error(`Attempt ${t}/3 failed with network error:`,e),t<3){let e=1e3*Math.pow(2,t-1);console.log(`Retrying in ${e}ms...`),await o(e)}}return console.error("Failed to send message after 3 attempts."),null}async function s(t,e,r,o){let s={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"text",text:{body:e}};return o&&(s.context={message_id:o}),i(s,r.token,r.phoneId)}async function a(t,e,r,o,s){let a={link:e};r&&r.trim()&&(a.caption=r);let n={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"image",image:a};return s&&(n.context={message_id:s}),i(n,o.token,o.phoneId)}async function n(t,e,r,o,s,a){let n={messaging_product:"whatsapp",recipient_type:"individual",to:t,type:"document",document:{link:e,caption:r,filename:o}};return a&&(n.context={message_id:a}),i(n,s.token,s.phoneId)}}};var e=require("../../../../../webpack-runtime.js");e.C(t);var r=t=>e(e.s=t),o=e.X(0,[8948,5972,3861],()=>r(54186));module.exports=o})();