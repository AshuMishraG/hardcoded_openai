(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[326],{5654:function(e,i,l){Promise.resolve().then(l.bind(l,5822))},5721:function(e,i,l){"use strict";var t=l(7437),a=l(2265),n=l(817),s=l.n(n);let c=()=>(0,t.jsx)("svg",{className:s().fileDeleteIcon,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 12 12",height:"12",width:"12",fill:"#353740",children:(0,t.jsx)("path",{fillRule:"evenodd",clipRule:"evenodd",d:"M5.15736 1.33332C4.8911 1.33332 4.65864 1.51361 4.59238 1.77149L4.4214 2.43693H7.58373L7.41275 1.77149C7.34649 1.51361 7.11402 1.33332 6.84777 1.33332H5.15736ZM8.78829 2.43693L8.54271 1.48115C8.34393 0.707516 7.64653 0.166656 6.84777 0.166656H5.15736C4.35859 0.166656 3.6612 0.707515 3.46241 1.48115L3.21683 2.43693H1.33333C1.01117 2.43693 0.75 2.6981 0.75 3.02026C0.75 3.34243 1.01117 3.6036 1.33333 3.6036H1.39207L2.10068 10.2683C2.19529 11.1582 2.94599 11.8333 3.84087 11.8333H8.15913C9.05401 11.8333 9.80471 11.1582 9.89932 10.2683L10.6079 3.6036H10.6667C10.9888 3.6036 11.25 3.34243 11.25 3.02026C11.25 2.6981 10.9888 2.43693 10.6667 2.43693H8.78829ZM9.43469 3.6036H2.56531L3.2608 10.145C3.29234 10.4416 3.54257 10.6667 3.84087 10.6667H8.15913C8.45743 10.6667 8.70766 10.4416 8.7392 10.145L9.43469 3.6036ZM4.83333 4.83332C5.1555 4.83332 5.41667 5.09449 5.41667 5.41666V8.33332C5.41667 8.65549 5.1555 8.91666 4.83333 8.91666C4.51117 8.91666 4.25 8.65549 4.25 8.33332V5.41666C4.25 5.09449 4.51117 4.83332 4.83333 4.83332ZM7.16667 4.83332C7.48883 4.83332 7.75 5.09449 7.75 5.41666V8.33332C7.75 8.65549 7.48883 8.91666 7.16667 8.91666C6.8445 8.91666 6.58333 8.65549 6.58333 8.33332V5.41666C6.58333 5.09449 6.8445 4.83332 7.16667 4.83332Z"})});i.Z=()=>{let[e,i]=(0,a.useState)([]),l=async()=>{let e=await fetch("/api/assistants/files",{method:"GET"});i(await e.json())};(0,a.useEffect)(()=>{l();let e=setInterval(l,1e3);return()=>clearInterval(e)},[]);let n=async e=>{await fetch("/api/assistants/files",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({fileId:e})}),i(i=>i.filter(i=>i.file_id!==e))},r=async e=>{let i=new FormData;e.target.files&&!(e.target.files.length<1)&&(i.append("file",e.target.files[0]),await fetch("/api/assistants/files",{method:"POST",body:i}),l())};return(0,t.jsxs)("div",{className:s().fileViewer,children:[(0,t.jsx)("div",{className:"".concat(s().filesList," ").concat(0!==e.length?s().grow:""),children:0===e.length?(0,t.jsx)("div",{className:s().title,children:"Attach files to test file search"}):e.map(e=>(0,t.jsxs)("div",{className:s().fileEntry,children:[(0,t.jsxs)("div",{className:s().fileName,children:[(0,t.jsx)("span",{className:s().fileName,children:e.filename}),(0,t.jsx)("span",{className:s().fileStatus,children:e.status})]}),(0,t.jsxs)("span",{onClick:()=>n(e.file_id),children:[(0,t.jsx)(c,{})," "]})]},e.file_id))}),(0,t.jsxs)("div",{className:s().fileUploadContainer,children:[(0,t.jsx)("label",{htmlFor:"file-upload",className:s().fileUploadBtn,children:"Attach files"}),(0,t.jsx)("input",{type:"file",id:"file-upload",name:"file-upload",className:s().fileUploadInput,multiple:!0,onChange:r})]})]})}},5822:function(e,i,l){"use strict";l.r(i);var t=l(7437);l(2265);var a=l(6349),n=l.n(a),s=l(552),c=l(5721);i.default=()=>{let e=async e=>{if(console.log("Handling call:",e),!e||!e.id||!e.function)return"Invalid action call received.";if("user-input"===e.id){var i;let l=(null===(i=e.function)||void 0===i?void 0:i.arguments)?JSON.parse(e.function.arguments):"No input provided";return"Processed call with input: ".concat(l)}return"Unknown function called."};return(0,t.jsx)("main",{className:n().main,children:(0,t.jsxs)("div",{className:n().container,children:[(0,t.jsxs)("div",{className:n().column,children:[(0,t.jsx)(c.Z,{})," "]}),(0,t.jsx)("div",{className:n().chatContainer,children:(0,t.jsxs)("div",{className:n().chat,children:[(0,t.jsx)(s.Z,{functionCallHandler:e})," "]})})]})})}},817:function(e){e.exports={fileViewer:"file-viewer_fileViewer__lfmcU",filesList:"file-viewer_filesList__nejsV",grow:"file-viewer_grow__3JELK",fileEntry:"file-viewer_fileEntry__Q8mtt",fileName:"file-viewer_fileName__5_9kE",fileStatus:"file-viewer_fileStatus__NyqtU",fileDeleteIcon:"file-viewer_fileDeleteIcon__P9tl_",fileUploadContainer:"file-viewer_fileUploadContainer__hcMu3",fileUploadBtn:"file-viewer_fileUploadBtn__7udW9",fileUploadInput:"file-viewer_fileUploadInput__oDqI_",title:"file-viewer_title__G32_W"}},6349:function(e){e.exports={main:"page_main__hiHI_",container:"page_container__7sD9P",column:"page_column__jZ0mu",chatContainer:"page_chatContainer__uVz8m",chat:"page_chat__d6rXN"}}},function(e){e.O(0,[801,815,18,552,971,23,744],function(){return e(e.s=5654)}),_N_E=e.O()}]);