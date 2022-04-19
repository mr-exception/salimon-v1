import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth.middleware';
import { Signature, SignatureSchema } from 'src/models/signature.schema';
import { Message, MessageSchema } from 'src/models/message.schema';
import { MessagesController } from './messages.controller';
import { MessagesResolver } from './messages.resolver';
import { FilesService } from 'src/files.service';

@Module({
  controllers: [MessagesController],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Signature.name, schema: SignatureSchema },
    ]),
  ],
  providers: [FilesService, MessagesResolver],
})
export class MessagesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('messages/create');
    consumer.apply(AuthMiddleware).forRoutes('messages/update');
    consumer.apply(AuthMiddleware).forRoutes('messages/delete');
  }
}
