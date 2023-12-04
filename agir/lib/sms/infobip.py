import requests
from django.conf import settings


def send_sms(
    message,
    recipients,
    *,
    at=None,
    sender=None,
):
    body = {
        "messages": [
            {
                "destinations": [
                    {
                        "to": recipient.as_e164[1:],
                    }
                    for recipient in recipients
                ],
                "from": sender or settings.INFOBIP_DEFAULT_SENDER,
                "text": message,
            }
        ]
    }

    if at:
        body["messages"][0]["sendAt"] = at.isoformat()

    r = requests.post(
        settings.INFOBIP_BASE_URL,
        json=body,
        headers={"Authorization": f"App {settings.INFOBIP_API_KEY}"},
    )
    status = r.json()["messages"]

    valid = [
        m["to"] for m in status if m["status"]["groupName"] in ["PENDING", "DELIVERED"]
    ]
    invalid = [
        m["to"]
        for m in status
        if m["status"]["groupName"] not in ["PENDING", "DELIVERED"]
    ]

    return valid, invalid
