using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using SuperUsefulLogin.Models;

namespace SuperUsefulLogin.Controllers
{
    public class LoginController : Controller
    {
        //
        // GET: /Login/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult ValidateCredentials(LoginModel model)
        {
            // In a better world, this would be a more meaningful
            // HttpStatusCode with ReasonPhrase to describe the
            // status a little more succinctly, but the requirements
            // call only for pass/fail 
            model.IsValid = ValidateCredentials(model.UserName, model.Password);

            return this.Json(model);
        }

        private bool ValidateCredentials(string userName, string password)
        {
            // Ideal this kind of validation would be in a library somewhere
            return SystemUserName.Equals(userName, StringComparison.OrdinalIgnoreCase) &&
                SystemPassword.Equals(password, StringComparison.Ordinal);
        }

        /// <summary>
        /// Using the System prefix to disambiguate
        /// </summary>
        private string SystemUserName
        {
            get
            {
                return ConfigurationManager.AppSettings["UserName"] ?? string.Empty;
            }
        }

        /// <summary>
        /// Using the System prefix to disambiguate
        /// </summary>
        private string SystemPassword
        {
            get
            {
                return ConfigurationManager.AppSettings["Password"] ?? string.Empty;
            }
        }
    }
}
