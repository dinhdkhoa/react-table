import { RHFField, ZodValidation } from "@/core/anotations/hook-form";
import { z } from "zod";

export class LoginEntity {
  @RHFField({
    index: 0,
    label: "Email"
  })
  @ZodValidation(z.string().trim().min(1, "This field is required").transform(value => value.trim()))
  username: string;

  @RHFField({
    index: 1,
    label: "Password"
  })
  @ZodValidation(z.string().trim().min(2, "This field is required").transform(value => value.trim()))
  password: string;

  @RHFField({
    index: 1,
    label: "Your Name",
  })
  @ZodValidation(z.string())
  yourName: string | undefined;

  constructor(username?: string, password?: string) {
    this.username = username || '';
    this.password = password || ''
  }
}
