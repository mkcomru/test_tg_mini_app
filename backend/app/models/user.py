from tortoise import Tortoise, fields, models, run_async


class User(models.Model):
    id = fields.IntField(primary_key=True)
    telegram_id = fields.IntField(unique=True)
    first_name = fields.CharField(max_length=255)
    last_name = fields.CharField(max_length=255)
    username = fields.CharField(max_length=255)
    birthday = fields.DateField(null=True)

    class Meta:
        table = "users"

