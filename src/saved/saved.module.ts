import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SavedController } from './saved.contoller.js';
import { SavedService } from './saved.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [SavedController],
  providers: [SavedService],
})
export class SavedModule {}