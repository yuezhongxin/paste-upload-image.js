(function ($) {
    var $this;
    var $ajaxUrl = '';
    $.fn.pasteUploadImage = function () {
        $this = $(this);
        $this.on('paste', function (event) {
            var filename, image, pasteEvent, text;
            pasteEvent = event.originalEvent;
            if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
                image = isImage(pasteEvent);
                if (image) {
                    event.preventDefault();
                    filename = getFilename(pasteEvent) || "image.png";
                    text = "{{" + filename + "(uploading...)}}";
                    pasteText(text);
                    return uploadFile(image.getAsFile(), filename);
                }
            }
        });
    };

    pasteText = function (text) {
        var afterSelection, beforeSelection, caretEnd, caretStart, textEnd;
        caretStart = $this[0].selectionStart;
        caretEnd = $this[0].selectionEnd;
        textEnd = $this.val().length;
        beforeSelection = $this.val().substring(0, caretStart);
        afterSelection = $this.val().substring(caretEnd, textEnd);
        $this.val(beforeSelection + text + afterSelection);
        $this.get(0).setSelectionRange(caretStart + text.length, caretEnd + text.length);
        return $this.trigger("input");
    };
    isImage = function (data) {
        var i, item;
        i = 0;
        while (i < data.clipboardData.items.length) {
            item = data.clipboardData.items[i];
            if (item.type.indexOf("image") !== -1) {
                return item;
            }
            i++;
        }
        return false;
    };
    getFilename = function (e) {
        var value;
        if (window.clipboardData && window.clipboardData.getData) {
            value = window.clipboardData.getData("Text");
        } else if (e.clipboardData && e.clipboardData.getData) {
            value = e.clipboardData.getData("text/plain");
        }
        value = value.split("\r");
        return value[0];
    };
    uploadFile = function (file, filename) {
        var formData = new FormData();
        formData.append('imageFile', file);
        formData.append("mimeType", file.type);

        $.ajax({
            url: $ajaxUrl,
            data: formData,
            type: 'post',
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    return insertToTextArea(filename, data.message);
                }
                return replaceLoadingTest(filename);
            },
            error: function (xOptions, textStatus) {
                replaceLoadingTest(filename);
                console.log(xOptions.responseText);
            }
        });
    };
    insertToTextArea = function (filename, url) {
        return $this.val(function (index, val) {
            return val.replace("{{" + filename + "(uploading...)}}", "![" + filename + "](" + url + ")" + "\n");
        });
    };
    replaceLoadingTest = function (filename) {
        return $this.val(function (index, val) {
            return val.replace("{{" + filename + "(uploading...)}}", filename + "\n");
        });
    };
})(jQuery);
