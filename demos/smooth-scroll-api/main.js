(function () {
    // VARS
    var scrollByForm = document.querySelector('.scroll-by-form');
    var scrollToForm = document.querySelector('.scroll-to-form');
    var scrollCssCheckbox = document.querySelector('[name="scroll-css"]');
    var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
    if (!isSmoothScrollSupported) {
        document.body.className += ' not-supported';
    }
    document.querySelector('[type="checkbox"]').checked = false;// reset if it was checked

    // METHODS
    function getScrollOptions(formData) {
        return {
            behavior: formData['behavior'],
            top: formData['scroll-y'],
            left: formData['scroll-x']
        };
    }

    function notify(msg, lang) {
        lang = lang || 'JavaScript';
        var separator = '------------ ' + lang + ' ------------';
        $.notify(
            msg +
            '\n' +
            separator +
            '\n' +
            'has been executed',

            "success"
        );
    }

    function _scrollBy(options) {
        if (isSmoothScrollSupported) {
            window.scrollBy(options);
            notify(
                'window.scrollBy(' + JSON.stringify(options) + ')'
            );
        } else if (window.jQuery && jQuery.scrollTo) {
            var leftSign = options.left >= 0 ? '+=' : '-=';
            var left = leftSign + options.left + 'px';
            var topSign = options.top >= 0 ? '+=' : '-=';
            var top = topSign + options.top + 'px';

            $(window).scrollTo(top, left);
            notify(
                '$(window).scrollTo("' + top + '" , "' + left + '")'
            );
        } else {
            window.scrollBy(options.left, options.top);
            notify(
                'window.scrollBy(' + options.left + ' , ' + options.top + ')'
            );
        }
    }

    function _scrollTo(options) {
        if (isSmoothScrollSupported) {
            window.scrollTo(options);
            notify(
                'window.scrollTo(' + JSON.stringify(options) + ')'
            );
        } else if (window.jQuery && jQuery.scrollTo) {
            $(window).scrollTo(options.top, options.left);
            notify(
                '$(window).scrollTo(' + options.top + ' , ' + options.left + ')'
            );
        } else {
            window.scrollTo(options.left, options.top);
            notify(
                'window.scrollTo(' + options.left + ' , ' + options.top + ')'
            );
        }
    }

    // EVENTS
    scrollByForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var formData = serialize(scrollByForm);
        var options = getScrollOptions(formData);
        _scrollBy(options);
    });

    scrollToForm.addEventListener('submit', function (e) {
        e.preventDefault();

        var formData = serialize(scrollToForm);
        var options = getScrollOptions(formData);
        _scrollTo(options);
    });

    scrollCssCheckbox.addEventListener('change', function () {
        if (scrollCssCheckbox.checked) {
            document.body.style.scrollBehavior = 'smooth';
            notify(
                'document.body.style.scrollBehavior = \'smooth\''
            );
        } else {
            document.body.style.scrollBehavior = 'auto';
            notify(
                'document.body.style.scrollBehavior = \'auto\''
            );
        }
    });

    // UTILS
    function serialize(form) {
        if (!form || form.nodeName !== "FORM") {
            return;
        }
        var i, result = {};
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
            if (form.elements[i].name === "") {
                continue;
            }
            switch (form.elements[i].nodeName.toLowerCase()) {
                case 'input':
                    switch (form.elements[i].type) {
                        case 'number':
                            result[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                            break;
                        case 'radio':
                            if (form.elements[i].checked) {
                                result[form.elements[i].name] = encodeURIComponent(form.elements[i].value);
                            }
                            break;
                    }
                    break;
            }
        }
        return result;
    }
}());