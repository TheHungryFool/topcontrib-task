let SuccessResponse     = require('../views/response').Success,
    ServerErrorResponse = require('../views/response').ServerError,
    GitHubApiClient     = require('../lib/github-client');


class TopReposController {
    process = async (request, response) => {
        let organization = request.params.organization,
            n            = request.query.n || 10,
            accessToken  = request.header('X-TOPCONTRIB-ACCESS-TOKEN'),
            result;

        try {
            let topRepos = await new GitHubApiClient(accessToken).getTopRepositories(organization, n);
            result       = new SuccessResponse({repositories: topRepos}).render();
        } catch (e) {
            console.log(e);
            result = new ServerErrorResponse(e).render();
        }

        response.status(result.http_code).json(result.data);
    }
}


module.exports = TopReposController;
