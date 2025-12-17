import { Module } from '@nestjs/common';
import { DesignValidationController } from './design-validation.controller';
import { DesignValidationService } from './design-validation.service';

@Module({
  controllers: [DesignValidationController],
  providers: [DesignValidationService],
})
export class DesignValidationModule {}
