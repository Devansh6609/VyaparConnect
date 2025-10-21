"use strict";(()=>{var t={};t.id=5799,t.ids=[5799],t.modules={20399:t=>{t.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:t=>{t.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},78018:t=>{t.exports=require("puppeteer")},82361:t=>{t.exports=require("events")},57147:t=>{t.exports=require("fs")},22037:t=>{t.exports=require("os")},76224:t=>{t.exports=require("tty")},57310:t=>{t.exports=require("url")},73837:t=>{t.exports=require("util")},21444:(t,e,r)=>{r.r(e),r.d(e,{originalPathname:()=>h,patchFetch:()=>b,requestAsyncStorage:()=>c,routeModule:()=>g,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var i={};r.r(i),r.d(i,{GET:()=>u});var a=r(49303),o=r(88716),n=r(60670),s=r(87070),d=r(20728),l=r(71597),p=r.n(l);async function u(t,{params:e}){try{let t=await d.Z.quotation.findUnique({where:{id:e.id},include:{items:{include:{product:!0}}}});if(!t)return new s.NextResponse("Quotation not found",{status:404});let r=`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background-color: #ffffff;
              color: #1a202c;
            }
            h1 {
              font-size: 32px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 30px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-size: 14px;
              color: #4a5568;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table th, .table td {
              border-bottom: 1px solid #e2e8f0;
              padding: 8px;
              font-size: 14px;
              text-align: left;
            }
            .table th {
              font-weight: bold;
              color: #2d3748;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Quotation</h1>
          <div class="header">
            <div>
              <strong>Billed To:</strong><br/>
              ${t.customerName}<br/>
              ${t.contactNumber}<br/>
              ${t.billingAddress?.replace(/\n/g,"<br/>")||"N/A"}
            </div>
            <div style="text-align: right;">
              <strong>Quotation ID:</strong> ${t.id}<br/>
              <strong>Date:</strong> ${new Date(t.createdAt).toLocaleDateString()}
            </div>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${t.items.map(t=>`
                <tr>
                  <td>${t.product?.name||"Unknown"}</td>
                  <td style="text-align:center;">${t.quantity}</td>
                  <td style="text-align:right;">₹${t.price.toFixed(2)}</td>
                  <td style="text-align:right;">₹${(t.quantity*t.price).toFixed(2)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="total">
            Grand Total: ₹${t.total.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}
          </div>
        </body>
      </html>
    `,i=await p()({html:r,puppeteerArgs:{args:["--no-sandbox"]}});return new s.NextResponse(i,{headers:{"Content-Type":"image/png"}})}catch(t){return console.error("❌ Generate Image Error:",t),new s.NextResponse("Failed to generate quotation image",{status:500})}}let g=new a.AppRouteRouteModule({definition:{kind:o.x.APP_ROUTE,page:"/api/quotations/[id]/generate-image/route",pathname:"/api/quotations/[id]/generate-image",filename:"route",bundlePath:"app/api/quotations/[id]/generate-image/route"},resolvedPagePath:"C:\\vyaparconnect-crm\\src\\app\\api\\quotations\\[id]\\generate-image\\route.ts",nextConfigOutput:"",userland:i}),{requestAsyncStorage:c,staticGenerationAsyncStorage:m,serverHooks:x}=g,h="/api/quotations/[id]/generate-image/route";function b(){return(0,n.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}},20728:(t,e,r)=>{r.d(e,{Z:()=>a});let i=require("@prisma/client"),a=globalThis.prisma||new i.PrismaClient}};var e=require("../../../../../webpack-runtime.js");e.C(t);var r=t=>e(e.s=t),i=e.X(0,[8948,5972,9092,1597],()=>r(21444));module.exports=i})();