import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth.middleware';
import { Signature, SignatureSchema } from 'src/models/signature.schema';
import { Thread, ThreadSchema } from 'src/models/thread.schema';
import { ThreadsController } from './threads.controller';
import { ThreadsResolver } from './threads.resolver';

@Module({
  controllers: [ThreadsController],
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: Signature.name, schema: SignatureSchema },
    ]),
  ],
  providers: [ThreadsResolver],
})
export class ThreadsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('threads/create');
    consumer.apply(AuthMiddleware).forRoutes('threads/update');
    consumer.apply(AuthMiddleware).forRoutes('threads/delete');
  }
}
