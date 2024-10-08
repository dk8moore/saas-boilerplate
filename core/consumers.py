import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.group_name = f'user_{self.user.id}'
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data['type']
        message = data['message']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'send_message',
                'message_type': message_type,
                'message': message
            }
        )

    async def send_message(self, event):
        message_type = event['message_type']
        message = event['message']
        await self.send(text_data=json.dumps({
            'type': message_type,
            'message': message
        }))
