# paste-upload-image.js

[JQuery 复制粘贴上传图片插件（textarea 和 tinyMCE）](http://www.cnblogs.com/xishuai/p/jquery-paste-upload-image.html)

支持 Ctrl+C/Ctrl+V 上传，支持拖拽上传，也支持 QQ/微信截图上传。

`textarea`使用（返回`markdown`格式的图片格式）：

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8" />
    <script src="scripts/jquery.js"></script>
    <script src="scripts/paste-upload-image.js"></script>
</head>
<body>
    <textarea name="txtContent" id="txtContent" style="width:500px;height:200px;"></textarea>
    
    <script>
        $("#txtContent").pasteUploadImage();//bind textarea
    </script>
</body>
</html>
```

`tinyMCE`使用：

```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta charset="utf-8" />
    <script src="scripts/jquery.js"></script>
    <script src="tinymce/tinymce.js"></script>
</head>
<body>
    <textarea name="mceContent" id="mceContent"></textarea>

    <script>
        $("#txtContent").pasteUploadImage();

        tinymce.init({
            selector: '#mceContent',
            height: 500,
            plugins: [
              'pasteUpload', //add pasteUpload plugin
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table contextmenu code'
            ],
            toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
            content_css: [
              '//fast.fonts.net/cssapi/e6dc9b99-64fe-4292-ad98-6974f93cd2a2.css',
              '//www.tinymce.com/css/codepen.min.css'
            ]
        });
    </script>
</body>
</html>
```

后端处理：

```cs
public class ImageUploaderController : Controller
{

    [AllowCors("sub.example.com")]//跨域访问
    [HttpPost]
    public async Task<string> ProcessPasteUpload(HttpPostedFileBase imageFile, string mimeType)
    {
        ///to do...
    }
}

public class AllowCorsAttribute : ActionFilterAttribute
{
    private string[] _domains;

    public AllowCorsAttribute(string domain)
    {
        _domains = new string[] { domain };
    }

    public AllowCorsAttribute(string[] domains)
    {
        _domains = domains;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var context = filterContext.RequestContext.HttpContext;
        var host = context.Request.UrlReferrer?.Host;
        if (host != null && _domains.Contains(host))
        {
            context.Response.AddHeader("Access-Control-Allow-Origin", $"http://{host}");
            context.Response.AddHeader("Access-Control-Allow-Credentials", "true");
        }
        base.OnActionExecuting(filterContext);
    }
}
```

效果展示：

![](http://images2015.cnblogs.com/blog/435188/201606/435188-20160603150528999-774769562.gif)
