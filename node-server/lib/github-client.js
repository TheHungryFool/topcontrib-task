const fetch     = require("node-fetch");
const constants = require("../constants");
const config    = require("../config");


class GitHubClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl     = config.githubApiBaseUrl;
    }

    /**
     * Get top n repositories of an organization (based on the number of forks)
     * limitReached here means the rate limit does not allow for anymore requests
     * @param organization
     * @param n number of repos required
     * @returns {{items: Array, limitReached: (*|boolean)}}
     */
    getTopRepositories = async (organization, n) => {
        const ENDPOINT = "/search/repositories";
        let params     = {
            q    : "org:" + organization,
            sort : "forks",
            order: "desc"
        };

        let data         = await this.paginateAndGetData(ENDPOINT, params, n),
            repositories = {items: [], limitReached: data.limitReached};

        data.responses.forEach((response) => {
            response.items && repositories.items.push(...response.items);
        });

        return repositories;
    };

    /**
     * Get top m contributors of a repository of an organization (based on the number of commits)
     * limitReached here means the rate limit does not allow for anymore requests
     * @param organization
     * @param repository
     * @param m number of contributors required
     * @returns {{items: Array, limitReached: (*|boolean)}}
     */
    getTopContributors = async (organization, repository, m) => {
        const ENDPOINT = "/repos/" + organization + "/" + repository + "/contributors";

        let data         = await this.paginateAndGetData(ENDPOINT, {}, m),
            contributors = {items: [], limitReached: data.limitReached};

        data.responses.forEach((response) => {
            contributors.items.push(...response);
        });

        return contributors;
    };

    /**
     * A common method that fetches multiple pages and returns the response(s) as an array in an object
     * limitReached here means the rate limit does not allow for anymore requests
     * @param endpoint the github api endpoint
     * @param params the github api request params
     * @param limit n or m
     * @returns {{responses: Array, limitReached: boolean}}
     */
    paginateAndGetData = async (endpoint, params, limit) => {
        const RESULTS_PER_PAGE = limit > 100 ? 100 : limit;
        let url                = new URL(this.baseUrl + endpoint);

        params['per_page'] = RESULTS_PER_PAGE;

        Object.keys(params).forEach((key) => {
            url.searchParams.append(key, params[key]);
        });

        let promises = [],
            options  = {method: 'GET'};

        if (this.accessToken) {
            options['headers'] = {
                'Authorization': 'token ' + this.accessToken
            };
        }

        url = String(url);

        // create an array of requests so that we can fetch the responses simultaneously
        for (let i = 0; i < Math.ceil(limit / RESULTS_PER_PAGE); i++) {
            let urlWithPageDetails = url + '&page=' + (i + 1),
                promise            = fetch(urlWithPageDetails, options).then(response => response.json());

            promises.push(promise);
        }

        // wait for all the promises (created using fetch) to be fulfilled
        let responses = await Promise.all(promises),
            result    = {responses: [], limitReached: false};

        responses.forEach((response) => {
            /**
             * Structure of an erroneous response
             *
             *   {
             *       "message": "Not Found",
             *       "documentation_url": "https://developer.github.com/v3/repos/#list-contributors"
             *   }
             *
             */

            if (response.message && response.message == constants.GITHUB_ERROR.BAD_CREDENTIALS) {
                throw new Error(constants.ERRORS.NOT_AUTHORIZED.MESSAGE);
            } else if (response.message
                && response.message == constants.GITHUB_ERROR.NOT_FOUND
                || response.message == constants.GITHUB_ERROR.SEARCH_QUERY_VALIDATION_FAILED) {
                throw new Error(constants.ERRORS.NOT_FOUND_ERROR.MESSAGE);
            } else if (response.documentation_url
                && response.documentation_url == constants.GITHUB_ERROR.RATE_LIMIT) {
                result.limitReached = true;

                return; // process next response
            }

            // why're we sending the responses without extracting the desired items from the response?
            // it's because the response structure differs from endpoint to endpoint, since we're using this
            // method as a common method for all endpoints, we'll just do some error handling and
            // send the response as it is
            result.responses.push(response);
        });

        return result;
    };
}


module.exports = GitHubClient;
