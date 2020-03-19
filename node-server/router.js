let express                   = require('express');
let NotFoundErrorResponse     = require('./views/response').NotFound;
let InvalidMethodResponse     = require('./views/response').InvalidMethod;
let Log                       = require('./lib/logger');
let TopReposController        = require('./controllers/toprepos');
let TopContributorsController = require('./controllers/topcontributors');
let router                    = express.Router();

router.get('/toprepos/:organization', async (request, response) => {
          await new TopReposController().validateAndProcessRequest(request, response);
      })
      .get('/topcontributors/:organization/:repository', async (request, response) => {
          await new TopContributorsController().validateAndProcessRequest(request, response);
      })

      // send error in case of invalid method / endpoint
      .all('/toprepos/:organization', async (request, response) => {
          let result = new InvalidMethodResponse().render();
          response.status(result.http_code).json(result.data);
      })
      .all('/topcontributors/:organization/:repository', async (request, response) => {
          let result = new InvalidMethodResponse().render();
          response.status(result.http_code).json(result.data);
      })
      .all('*', (request, response) => {
          let result = new NotFoundErrorResponse().render();
          response.status(result.http_code).json(result.data);
      });


module.exports = router;
