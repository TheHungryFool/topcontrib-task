const { Octokit } = require("@octokit/rest");


class GitHubClient {
    constructor(accessToken) {
        let options = accessToken ? {auth: accessToken} : {};
        this.client = new Octokit(options);
    }

    getTopRepositories = async (organization, n) => {
        let repositories = await this.paginateAndGetData(
            "GET /search/repositories",
            {q: "org:" + organization, sort: "forks", order: "desc", per_page: 100},
            n
        );

        return repositories.map((repository) => {
            return {
                name : repository.name,
                forks: repository.forks_count
            }
        });
    };

    getTopContributors = async (organization, repository, m) => {
        let contributors = await this.paginateAndGetData(
            "GET /repos/:owner/:repo/contributors",
            {owner: organization, repo: repository, per_page: 100},
            m
        );

        return contributors.map((contributor) => {
            console.log(JSON.stringify(contributor));
            return {
                login  : contributor.login,
                commits: contributor.contributions,
                id     : contributor.id
            }
        });
    };

    paginateAndGetData = async (endpoint, options, limit) => {
        let count = 0;
        return await this.client.paginate(endpoint, options, (response, done) => {
            if (count >= limit) {
                done();
            }

            count += response.data.length;

            return response.data;
        }).then(items => items.slice(0, limit));
    };
}


module.exports = GitHubClient;
