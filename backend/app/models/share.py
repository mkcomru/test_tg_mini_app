from tortoise import fields, models
from datetime import datetime, timedelta


class ShareLink(models.Model):
    id = fields.IntField(pk=True)
    share_code = fields.CharField(max_length=50, unique=True)
    user = fields.ForeignKeyField("models.User", related_name="share_links")
    created_at = fields.DatetimeField(auto_now_add=True)
    expires_at = fields.DatetimeField(null=True)

    class Meta:
        table = "share_links"


