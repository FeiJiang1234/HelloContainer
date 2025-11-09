using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace HelloContainer.User.API.Fitlers
{
    public class NotFoundResultFilterAttribute : ResultFilterAttribute
    {
        public override void OnResultExecuting(ResultExecutingContext context)
        {
            if (context.Result is ObjectResult objectResult && objectResult.Value == null)
            {
                context.Result = new NotFoundResult();
            }
        }
    }
}
