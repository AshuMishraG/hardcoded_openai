(()=>{var e={};e.id=931,e.ids=[931],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2317:(e,s,t)=>{"use strict";t.r(s),t.d(s,{GlobalError:()=>i.a,__next_app__:()=>h,originalPathname:()=>p,pages:()=>c,routeModule:()=>u,tree:()=>d}),t(908),t(6619),t(5866);var a=t(3191),r=t(8716),n=t(7922),i=t.n(n),o=t(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);t.d(s,l);let d=["",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,908)),"/Users/ashumishrag/AshuMishraG/hardcoded_openai/app/page.tsx"]}]},{layout:[()=>Promise.resolve().then(t.bind(t,6619)),"/Users/ashumishrag/AshuMishraG/hardcoded_openai/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/ashumishrag/AshuMishraG/hardcoded_openai/app/page.tsx"],p="/page",h={require:t,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/page",pathname:"/",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},5115:(e,s,t)=>{Promise.resolve().then(t.bind(t,6980))},1714:(e,s,t)=>{Promise.resolve().then(t.bind(t,8743))},7798:(e,s,t)=>{Promise.resolve().then(t.t.bind(t,2994,23)),Promise.resolve().then(t.t.bind(t,6114,23)),Promise.resolve().then(t.t.bind(t,9727,23)),Promise.resolve().then(t.t.bind(t,9671,23)),Promise.resolve().then(t.t.bind(t,1868,23)),Promise.resolve().then(t.t.bind(t,4759,23))},6980:(e,s,t)=>{"use strict";t.d(s,{default:()=>l});var a=t(326),r=t(7577),n=t(592),i=t.n(n);let o="asst_RZBTqqUlRwWLfrTLlrNUmVjc";if(""===o){let e=process.env.OPENAI_ASSISTANT_ID;if(void 0!==e)o=e;else throw Error("OPENAI_ASSISTANT_ID is not defined in the environment variables.")}let l=()=>{let[e,s]=(0,r.useState)(!1),[t,n]=(0,r.useState)(""),l=async()=>{s(!0);let e=await fetch("/api/assistants",{method:"POST"});n((await e.json()).assistantId),s(!1)};return a.jsx(a.Fragment,{children:!o&&(0,a.jsxs)("div",{className:i().container,children:[a.jsx("h1",{children:"Start by creating your assistant"}),(0,a.jsxs)("div",{className:i().message,children:["Create an assistant and set its ID in"," ",a.jsx("span",{children:"app/assistant-config.ts"})]}),t?a.jsx("div",{className:i().result,children:t}):a.jsx("button",{onClick:l,disabled:e,className:i().button,children:e?"Loading...":"Create Assistant"})]})})}},8743:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>i});var a=t(326);t(7577);var r=t(9376),n=t.n(r);let i=()=>(0,a.jsxs)("main",{className:n().main,children:[a.jsx("div",{className:n().title,children:"Explore sample apps built with Assistants API"}),a.jsx("div",{className:n().container,children:Object.entries({"Basic chat":"basic-chat","Function calling":"function-calling","File search":"file-search",All:"all"}).map(([e,s])=>a.jsx("a",{className:n().category,href:`/examples/${s}`,children:e},e))})]})},592:e=>{e.exports={container:"warnings_container__xY6e_",empty:"warnings_empty__Qx4Jn",assistantId:"warnings_assistantId__uhEAP",button:"warnings_button__oqV9n",result:"warnings_result__otq4F",message:"warnings_message__2bVYd"}},9376:e=>{e.exports={main:"page_main__nw1Wk",title:"page_title__po7na",container:"page_container__jZF7q",category:"page_category__euQG3"}},3209:(e,s,t)=>{"use strict";t.d(s,{B:()=>a});let a="asst_RZBTqqUlRwWLfrTLlrNUmVjc";if(""===a){let e=process.env.OPENAI_ASSISTANT_ID;if(void 0!==e)a=e;else throw Error("OPENAI_ASSISTANT_ID is not defined in the environment variables.")}},6619:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>d,metadata:()=>l});var a=t(9510),r=t(5384),n=t.n(r);t(7272);let i=(0,t(8570).createProxy)(String.raw`/Users/ashumishrag/AshuMishraG/hardcoded_openai/app/components/warnings.tsx#default`);var o=t(3209);let l={title:"Assistants API Quickstart",description:"A quickstart template using the Assistants API with OpenAI",icons:{icon:"/openai.svg"}};function d({children:e}){return a.jsx("html",{lang:"en",children:(0,a.jsxs)("body",{className:n().className,children:[o.B?e:a.jsx(i,{}),a.jsx("img",{className:"logo",src:"/openai.svg",alt:"OpenAI Logo"})]})})}},908:(e,s,t)=>{"use strict";t.r(s),t.d(s,{default:()=>a});let a=(0,t(8570).createProxy)(String.raw`/Users/ashumishrag/AshuMishraG/hardcoded_openai/app/page.tsx#default`)},7272:()=>{}};var s=require("../webpack-runtime.js");s.C(e);var t=e=>s(s.s=e),a=s.X(0,[948,892],()=>t(2317));module.exports=a})();