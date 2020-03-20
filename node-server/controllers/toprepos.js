let SuccessResponse = require('../views/response').Success;
let BaseController  = require('./base');
let constants       = require('../constants');
let GitHubApiClient = require('../lib/github-client');


class TopReposController extends BaseController {
    isValidRequest = (request) => {
        return request.params.organization
            && !isNaN(request.query.n)
    };

    process = async (request) => {
        let organization = request.params.organization,
            n            = request.query.n || 10,
            accessToken  = request.get(constants.GITHUB_TOKEN_KEY);

        let topRepos = await new GitHubApiClient(accessToken).getTopRepositories(organization, n);

        // if the rate limit is reached, we send a custom code so that the client can display appropriate message
        return new SuccessResponse({repositories: topRepos.items}, topRepos.limitReached ? 5005 : 0).render();
    }
}


module.exports = TopReposController;
