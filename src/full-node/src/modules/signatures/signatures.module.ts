import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/auth.middleware';
import { Signature, SignatureSchema } from 'src/models/signature.schema';
import { SignaturesController } from './signatures.controller';
import { SignaturesResolver } from './signatures.resolver';
import { SignaturesService } from './signatures.service';

@Module({
  controllers: [SignaturesController],
  imports: [
    MongooseModule.forFeature([
      { name: Signature.name, schema: SignatureSchema },
    ]),
  ],
  providers: [SignaturesService, SignaturesResolver],
})
export class SignaturesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('signatures/update');
    consumer.apply(AuthMiddleware).forRoutes('signatures/delete');
  }
}
