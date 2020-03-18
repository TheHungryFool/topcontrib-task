import logging
import time
from flask import request
from topcontrib.views import Response, ServerErrorResponse, ValidationErrorResponse
from topcontrib.lib.github_client import GithubClient

logger = logging.getLogger(__name__)

class TopContributorsController:
    def __init__(self, organization, repository):
        # TODO:  validate request here
        self.organization = organization
        self.repository = repository
        access_token = request.headers.get('X-TOPCONTRIB-TOKEN')
        self.github_client = GithubClient(access_token)
        self.m = int(request.args.get('m'))

    def process_request(self):
        try:
            start = time.time()
            top_contributors = self.github_client.get_top_contributors(
                self.organization,
                self.repository,
                self.m if self.m else 10
            )
            print(str(time.time() - start))
            response = Response(data={'contributors': top_contributors}).render()
        except Exception as e:
            logger.critical(str(e))
            response = ServerErrorResponse().render()

        return response
