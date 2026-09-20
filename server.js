const http=require("http"),fs=require("fs"),path=require("path");
const port=process.env.PORT||3000,root=__dirname;
const types={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".webmanifest":"application/manifest+json",".png":"image/png"};
http.createServer((req,res)=>{
 let p=decodeURIComponent(new URL(req.url,`http://${req.headers.host||"localhost"}`).pathname);
 if(p==="/")p="/index.html";
 const file=path.join(root,p);
 if(!file.startsWith(root))return res.writeHead(403).end("Forbidden");
 fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end("Not found");res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Cache-Control":"no-cache"});res.end(data)});
}).listen(port,()=>console.log(`expense. running at http://localhost:${port}`));
