let content = { expires: '2020-12-22T01:38:58.449Z', username: 'admin' };

let current = new Date(Date.now()).getTime();
let test = new Date('2021-12-30 23:59:59').getTime()
let expires = new Date(content.expires).getTime();
if (expires < current) {
    console.log('过期了');
}

console.log(test);
//token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzIjoiMjAyMS0xMi0zMCAyMzo1OTo1OSIsInVzZXJuYW1lIjoiYWRtaW4ifQ.8TjEcucRm_jl-DCAOGrkBDNpENOfkWbXx985q8Rajr8