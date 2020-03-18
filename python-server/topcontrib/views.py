from flask import jsonify


class Response:
    def __init__(self, http_code=200, data={}, error=0):
        self.http_code = http_code
        self.data = data
        self.error = error

    def render(self):
        response = jsonify({'data': self.data, 'error': self.error})
        response.status_code = self.http_code

        return response


class ValidationErrorResponse(Response):
    def __init__(self, data={'message': 'Request validation failed'}):
        super().__init__(http_code=400, data=data, error=0)


class ResourceNotFoundResponse(Response):
    def __init__(self, data={'message': 'The requested resource is not available'}):
        super().__init__(http_code=404, data=data, error=0)


class ServerErrorResponse(Response):
    def __init__(self, data={'message': 'Server encountered on error while processing request'}, error=5000):
        super().__init__(http_code=500, data=data, error=error)
