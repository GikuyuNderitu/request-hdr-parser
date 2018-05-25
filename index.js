const Koa = require('koa');
const PORT = process.env.PORT || 1337;

const app = new Koa();

app.proxy =true;

app.use(async (ctx, next) => {

  if(ctx.request.path === '/favicon.ico') {
    return;
  }
  next();
});

app.use(async (ctx, next) => {
  const headers = Object.freeze(ctx.request.header);

  const response = {
    language: languageParse(headers),
    ip: ctx.request.ip,
  }

  try{
    const operating_system = await systemParse(headers);

    response.operating_system = operating_system;
  } catch (e) {
    response.operating_system = '';
  }


  ctx.body = JSON.stringify(response, null, 4);
});

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`The server is running on port: ${PORT}`);
  console.log('====================================');
});

/**
 * 
 * @param {ContextDelegatedRequest.header} headers 
 */
const languageParse = headers => `${headers['accept-language'].split(';')[0]}`

const systemParse = async headers => {
  /** @type {string} */
  const userAgent = headers['user-agent'];
  if(!userAgent || !userAgent.trim()) return '';

  const incrementor = increaseOrThrow(userAgent.length)

  let ptr = 0;
  while(userAgent[ptr] !== '(') ptr ++;
  let buffer = '';
  while (userAgent[ptr + 1] !== ')') buffer += userAgent[ptr = incrementor(ptr)];

  return buffer;
}

/**
 * 
 * @param {number} len 
 * @returns {function(number): number}
 */
const increaseOrThrow = len => num => {
  if(num > len) throw new Error(`You have increased beyond the given length`);
  return num + 1;
}