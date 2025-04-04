def success_response(data="success", message="success", error="success"):
    return {
        "error": error,
        "detail": data if data is not None else message
    }