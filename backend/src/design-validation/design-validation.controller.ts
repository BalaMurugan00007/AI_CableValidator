import { Controller, Post, Body } from "@nestjs/common";
import { DesignValidationService } from "./design-validation.service";

@Controller("design")
export class DesignValidationController {
  constructor(
    private readonly designValidationService: DesignValidationService
  ) {}

  @Post("validate")
  async validateDesign(
    @Body() body: { input?: string; recordId?: string }
  ) {
    return this.designValidationService.validateDesign(body);
  }
}
