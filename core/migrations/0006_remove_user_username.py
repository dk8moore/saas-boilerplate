# Generated by Django 5.0.6 on 2024-08-03 10:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_alter_user_username'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='username',
        ),
    ]
