import logging
from github import GithubException
import time
from flask import request
from topcontrib.views import Response, ServerErrorResponse, ValidationErrorResponse
from topcontrib.lib.github_client import GithubClient

logger = logging.getLogger(__name__)

class TopReposController:
    def __init__(self, organization):
        # TODO:  validate request here
        self.organization = organization
        access_token = request.headers.get('X-TOPCONTRIB-TOKEN')
        self.github_client = GithubClient(access_token)
        self.n = int(request.args.get('n'))

    def process_request(self):
        try:
            start = time.time()
            top_repositories = self.github_client.get_top_repositories(
                self.organization,
                self.n if self.n else 10
            )
            print(str(time.time() - start))
            response = Response(data={'repositories': top_repositories}).render()
        except Exception as e:
            logger.critical(str(e))
            response = ServerErrorResponse().render()

        return response
