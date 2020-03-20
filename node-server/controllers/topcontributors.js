let SuccessResponse = require('../views/response').Success;
let BaseController  = require('./base');
let constants       = require('../constants');
let GitHubApiClient = require('../lib/github-client');


class TopReposController extends BaseController {
    isValidRequest = (request) => {
        return request.params.organization
            && request.params.repository
            && !isNaN(request.query.m)
    };

    process = async (request) => {
        let organization = request.params.organization,
            repository   = request.params.repository,
            m            = request.query.m || 10,
            accessToken  = request.get(constants.GITHUB_TOKEN_KEY);

        let topContribs = await new GitHubApiClient(accessToken).getTopContributors(organization, repository, m);

        // if the rate limit is reached, we send a custom code so that the client can display appropriate message
        return new SuccessResponse({contributors: topContribs.items}, topContribs.limitReached ? 5005 : 0).render();
    }
}


module.exports = TopReposController;
