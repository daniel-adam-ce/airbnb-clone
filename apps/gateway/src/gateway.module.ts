import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: "reservations",
                url: configService.getOrThrow("RESERVATIONS_GRAPHQL_URL")
              }
            ]
          })
        }
      }) as ApolloGatewayDriverConfig
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
  ],
})
export class GatewayModule {}
