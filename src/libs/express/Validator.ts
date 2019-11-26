import { check } from "express-validator";

export default class ExpressValidator {
  
  /**
   * /user/login
   */
  public static UserLoginRoute = [
    check("username")
      .not().isEmpty().withMessage("Geen gebruiksernaam opgegeven."),

    check("password")
      .not().isEmpty().withMessage("Geen wachtwoord opgegeven.")
  ]

}