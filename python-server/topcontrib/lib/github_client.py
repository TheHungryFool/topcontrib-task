from github import Github

class GithubClient:
    def __init__(self, access_token=''):
        self.client = Github(access_token) if access_token else Github()

    def get_top_repositories(self, organization, n=10):
        print('here')
        repositories = self.client.search_repositories(
            'org:{organization}'.format(organization=organization),
            sort='forks',
            order='desc'
        )

        count = 0
        result = []

        # each repository is an object of type
        # https://pygithub.readthedocs.io/en/latest/github_objects/Repository.html#github.Repository.Repository
        for repository in repositories:
            if count >= n:
                break

            result.append({'name': repository.name, 'forks': repository.forks_count})

            count += 1

        return result

    def get_top_contributors(self, organization, repository, m=10):
        repo_full_name = organization + '/' + repository
        contributors = self.client.get_repo(repo_full_name).get_contributors()
        count = 0
        result = []

        # each contributor is an object of type
        # https://pygithub.readthedocs.io/en/latest/github_objects/NamedUser.html#github.NamedUser.NamedUser
        for contributor in contributors:
            if count >= m:
                break

            result.append({'id': contributor.id, 'login': contributor.login, 'commits': contributor.contributions})
            count += 1

        return result
