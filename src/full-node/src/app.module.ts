import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesService } from './files.service';
import { GeneralResolver } from './general.resolver';
import { MessagesModule } from './modules/messages/messages.module';
import { SignaturesModule } from './modules/signatures/signatures.module';
import { ThreadsModule } from './modules/threads/threads.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/salimon'),
    SignaturesModule,
    ThreadsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [FilesService, AppService, GeneralResolver],
})
export class AppModule {}
