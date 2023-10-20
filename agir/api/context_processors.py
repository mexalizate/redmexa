from django.conf import settings


def basic_information(request):
    return {
        "CAMPAIGN_DOMAIN": settings.CAMPAIGN_DOMAIN,
        "PLATFORM_ADMIN_DOMAIN": settings.PLATFORM_ADMIN_DOMAIN,
        "PLATFORM_FRONT_DOMAIN": settings.PLATFORM_FRONT_DOMAIN,
        "MAP_DOMAIN": settings.MAP_DOMAIN,
    }
