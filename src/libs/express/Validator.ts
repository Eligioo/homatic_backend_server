import { check } from "express-validator";

export default class ExpressValidator {
  
  /**
   * /portal/user/login
   */
  public static UserLoginRoute = [
    check("username")
      .not().isEmpty().withMessage("Geen gebruiksernaam opgegeven."),

    check("password")
      .not().isEmpty().withMessage("Geen wachtwoord opgegeven.")
  ]

  /**
   * /hub/instance/identify
   */
  public static HubIdentifyRoute = [
    check("mac_address")
      .not().isEmpty().withMessage("MAC address is vereist om te identificeren."),
    
    check("hub_code")
      .not().isEmpty().withMessage("Hub code is vereist om te identificeren"),
    
    check("discovery_info")
      .not().isEmpty().withMessage("Geen discovery informatie meegestuurd")
  ]

}