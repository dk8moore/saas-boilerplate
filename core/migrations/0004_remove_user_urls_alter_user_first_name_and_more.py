# Generated by Django 5.0.6 on 2024-07-24 19:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_user_urls_alter_user_first_name_alter_user_last_name_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='urls',
        ),
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='first name'),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, max_length=150, verbose_name='last name'),
        ),
    ]
