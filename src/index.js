const request = require('request-promise');
const q = require('q');
const {API_KEY, API_URL, filters} = require(__dirname + '/../config.json');

request
  .get({
    url: `${API_URL}/server`,
    qs: Object.assign({
      key: API_KEY,
    }, filters),
  })
  .then(result => {
    return q.all(JSON.parse(result).data.data.map(server => {
      return request
        .get(`${API_URL}/server/${server.id}/control?key=${API_KEY}`)
        .then(result => {
          JSON.parse(result).data.data.map(control => {
            console.log([control.server.srv_id, control.ip, control.admin_password].join(','));
          });
        });
    }));
  });
