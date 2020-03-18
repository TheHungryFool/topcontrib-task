let SuccessResponse     = require('../views/response').Success,
    ServerErrorResponse = require('../views/response').ServerError,
    GitHubApiClient     = require('../lib/github-client');


class TopReposController {
    process = async (request, response) => {
        let organization = request.params.organization,
            repository   = request.params.repository,
            m            = request.query.m || 10,
            accessToken  = request.header('X-TOPCONTRIB-TOKEN');

        let result;
        try {
            let topContribs = await new GitHubApiClient(accessToken).getTopContributors(organization, repository, m);
            result          = new SuccessResponse({contributors: topContribs}).render();
        } catch (e) {
            console.log(e);
            result = new ServerErrorResponse().render();
        }

        response.status(result.http_code).json(result.data);
    }
}


module.exports = TopReposController;
