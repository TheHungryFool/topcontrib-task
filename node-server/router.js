let express                   = require('express'),
    NotFoundErrorResponse     = require('./views/response').NotFound,
    Log                       = require('./lib/logger'),
    TopReposController        = require('./controllers/toprepos'),
    TopContributorsController = require('./controllers/topcontributors'),
    router                    = express.Router();


router.get('/toprepos/:organization', async (request, response) => {
    await new TopReposController().process(request, response);
});

router.get('/topcontributors/:organization/:repository', async (request, response) => {
    await new TopContributorsController().process(request, response);
});

router.all('*', (request, response) => {
    let result = new NotFoundErrorResponse().render();
    response.status(result.http_code).json(result.data);
});


module.exports = router;
