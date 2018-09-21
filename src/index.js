const request = require('request-promise');
const q = require('q');
const {API_KEY, filters} = require(__dirname + '/../config.json');

request
  .get({
    url: `https://api.cp.usdedicated.com/server`,
    qs: Object.assign({
      key: API_KEY,
    }, filters),
  })
  .then(result => {
    return q.all(JSON.parse(result).data.data.map(server => {
      return request
        .get(`https://api.cp.usdedicated.com/server/${server.id}/control?key=${API_KEY}`)
        .then(result => {
          JSON.parse(result).data.data.map(control => {
            console.log([control.server.srv_id, control.ip, control.admin_password].join(','));
          });
        });
    }));
  });
