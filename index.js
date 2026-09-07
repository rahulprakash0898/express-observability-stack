const express = require('express');
const responseTime = require('response-time');
const client = require('prom-client'); //Metric Collection
const { doSomeHeavyTask } = require("./util");
const { createLogger, transports } = require("winston");
const LokiTransport = require("winston-loki");
const options = {
  transports: [
    new LokiTransport({
      host: "http://127.0.0.1:3100"
    })
  ]
};
const logger = createLogger(options);

const app = express();
const PORT = process.env.PORT || 8000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const reqResTime = new client.Histogram({
  name: "http_express_req_res_time",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.001, 0.05, 0.1, 0.2, 0.4, 0.5, 0.8, 1, 2], // in seconds
});

const totalReqCounter = new client.Counter({
  name: 'total_req',
  help:'Tells total req'
})

// Use response-time middleware
app.use(
  responseTime((req, res, time) => {
    totalReqCounter.inc();
    reqResTime
      .labels({
        method: req.method,
        route: req.route ? req.route.path : req.url, // safer than req.url
        status_code: res.statusCode,
      })
      .observe(time / 1000); // convert ms → seconds
  })
);

app.get("/",(req,res) => {
  logger.info('Req came on / router');
 return res.json({ message:`Hello from Express Server` });
});

app.get("/slow",async(req,res) => {
 try{
  logger.info('Req came on /slow router');
    const timeTaken = await doSomeHeavyTask();
    return res.json({
        status: "Success",
        message: `Heavy task completed in ${timeTaken}ms`,
    });
 }
 catch(error)
 {
  logger.error(error.message);
    return res.status(500).json({ status:"Error", error:"Internal Server Error "});
 }
});

app.get("/metrics", async(req,res) => {
  res.setHeader( 'Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.send(metrics); 
});

app.listen(PORT,() =>{
    console.log(`Express Server Started at http://localhost:${PORT}`)
});