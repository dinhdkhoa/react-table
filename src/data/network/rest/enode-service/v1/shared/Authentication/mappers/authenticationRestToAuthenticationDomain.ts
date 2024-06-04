import { Authentication } from "@/domain/Application/Authentication/models/Authentication";
import { AuthenticationRest } from "../../../Authentication/models/AuthenticationRest";


export const authenticationRestToAuthenticationDomain = ({
  id,
  lastName,
  firstName,
  token,
  email,
}: AuthenticationRest): Authentication => ({
  id,
  fullName: `${firstName} ${lastName}`,
  firstName,
  token,
  email,
});
