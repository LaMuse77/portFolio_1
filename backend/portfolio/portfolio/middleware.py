import logging

logger = logging.getLogger("frontend_ops")

class FrontendLoggerMiddleware:
    """
    Middleware pour logger toutes les requêtes venant du front.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Log la méthode, l'URL, le user et les données POST/GET
        user = request.user if request.user.is_authenticated else "Anonymous"
        method = request.method
        path = request.get_full_path()
        data = request.POST.dict() if method == "POST" else request.GET.dict()
        logger.info(f"Front request by {user} | {method} {path} | Data: {data}")

        response = self.get_response(request)

        logger.info(f"Response status: {response.status_code}")
        return response
