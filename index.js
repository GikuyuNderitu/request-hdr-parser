const Koa = require('koa');
const PORT = process.env.PORT || 1337;

const app = new Koa();

app.proxy =true;

app.use(async (ctx, next) => {
  if(ctx.request.path === '/favicon.ico') {
    return;
  }
  next();
})

app.use(async (ctx, next) => {
  console.log(ctx.request.ip)

  ctx.body =ctx.request.ip

});

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`The server is running on port: ${PORT}`);
  console.log('====================================');
})