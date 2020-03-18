from topcontrib.server import app
import topcontrib.views
from topcontrib.controllers import TopContributorsController, TopReposController


@app.route('/toprepos/<string:organization>', methods=['GET'])
def toprepos_view(organization):
    return TopReposController(organization).process_request()

@app.route('/topcontributors/<string:organization>/<string:repository>', methods=['GET'])
def topcontributors_view(organization, repository):
    return TopContributorsController(organization, repository).process_request()

@app.route('/')
def default_view():
    return topcontrib.views.ResourceNotFoundResponse().render()
