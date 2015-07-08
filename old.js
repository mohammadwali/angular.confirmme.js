/**
 * confirMe.js v1.0
 * https://mwa.li
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, The Developer Buzz
 * http://www.thedeveloperbuzz.com
 */
(function($, win, doc) {
    var head = doc.head,
        body = doc.body,
        _doc = $(doc),
        _win = $(win),
        styles = $(head).find("#confirMe-styles"),
        _defaults = {
            message: "",
            onConfirm: function(button) {},
            onCancel: function(button) {},
            onClose: function(button) {}
        };
    error = function(e) {
        throw "error: ConfirMe Cannot Run => " + e;
    };
    warn = function(l) {
        (console.warn == "undefiend") ? console.log("Notify Warning: " + l): console.warn("Notify Warning: " + l);
    };
    initialize = function(set) {
        var main = doc.createElement("div"),
            wrapper = doc.createElement("div"),
            text = doc.createElement("p"),
            btn_list = doc.createElement("ul"),
            list_items = [doc.createElement("li"), doc.createElement("li")],
            confrm_btn = doc.createElement("a"),
            cancel_btn = doc.createElement("a"),
            close_btn = doc.createElement("a");
        //add id
        var len = $(".confirme-popup").length + 1,
            id = "confirme-" + len + (Math.floor(Math.random() * (999999999 - 9999 + 1))),
            _id = "#" + id;
        main.setAttribute("id", id);
        // add Classes
        main.className = "confirme-popup";
        main.setAttribute("role", "alert");
        wrapper.className = "confirme-popup-container";
        btn_list.className = "confirme-buttons list-inline m-n p-b p-l p-r";
        confrm_btn.className = "btn btn-md rounded w-xs pull-right confirme-popup-confirm";
        cancel_btn.className = "btn btn-md rounded w-xs pull-left confirme-popup-cancel";
        close_btn.className = "confirme-popup-close";
        // Append items
        doc.body.appendChild(doc.createComment("confirme-popup starts"))
        doc.body.appendChild(main);
        main.appendChild(wrapper);
        wrapper.appendChild(text);
        wrapper.appendChild(btn_list);
        wrapper.appendChild(close_btn);
        btn_list.appendChild(list_items[0]);
        list_items[0].appendChild(confrm_btn);
        btn_list.appendChild(list_items[1]);
        list_items[1].appendChild(cancel_btn);
        doc.body.appendChild(doc.createComment("confirme-popup ends"));
        //add texts
        confrm_btn.text = "Yes";
        cancel_btn.text = "No";
        text.innerHTML = set.message;
        //add events
        $(_id + " a.confirme-popup-close").click(function(event) {
            event.preventDefault();
            $.confirMe.close($(this));
            //callbacks 
            if (typeof set.onClose == "function") {
                set.onClose();
            }
        });
        $(_id + " a.confirme-popup-cancel").click(function(event) {
            event.preventDefault();
            $.confirMe.close($(this));
            //callbacks 
            if (typeof set.onCancel == "function") {
                set.onCancel()
            }
        });
        $(_id + " a.confirme-popup-confirm").click(function(event) {
            event.preventDefault();
            //callbacks 
            if (typeof set.onCancel == "function") {
                set.onConfirm()
            }
            $.confirMe.close($(this));
        });
        setTimeout(function() {
            $(main).addClass("is-visible");
        }, 100);
    };
    // plugin definition
    $.confirMe = function(options) { 
        var settings = $.extend({}, $.confirMe.defaults, options);
        if (typeof settings.message == "undefined") {
            error("Message is not defiend!");
            return false;
        }
        if (typeof $.trim(settings.message) == "") {
            error("Message is empty!");
            return false;
        }
        if (!styles.length) {
            $(head).append("<style type='text/css' id='confirMe-styles'>.p-b{padding-bottom:15px}.p-r{padding-right:15px}.p-l{padding-left:15px}.m-n{margin:0!important}.list-inline{padding-left:0;margin-left:-5px;list-style:none}.confirme-popup{position:fixed;left:0;top:0;height:100%;width:100%;background-color:rgba(94,110,141,.9);opacity:0;visibility:hidden;-webkit-transition:opacity .3s 0s,visibility 0s .3s;-moz-transition:opacity .3s 0s,visibility 0s .3s;transition:opacity .3s 0s,visibility 0s .3s;z-index:9999999}.confirme-popup.is-visible{opacity:1;visibility:visible;-webkit-transition:opacity .3s 0s,visibility 0s 0s;-moz-transition:opacity .3s 0s,visibility 0s 0s;transition:opacity .3s 0s,visibility 0s 0s}.confirme-popup-container{position:relative;width:90%;max-width:400px;margin:4em auto;background:#FFF;border-radius:.25em .25em .4em .4em;text-align:center;box-shadow:0 0 20px rgba(0,0,0,.2);-webkit-transform:translateY(-40px);-moz-transform:translateY(-40px);-ms-transform:translateY(-40px);-o-transform:translateY(-40px);transform:translateY(-40px);-webkit-backface-visibility:hidden;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;transition-property:transform;-webkit-transition-duration:.3s;-moz-transition-duration:.3s;transition-duration:.3s}.confirme-popup-container p{padding:2em 1em .5em;font-size:1.8em}.confirme-popup-container .confirme-buttons:after{content:'';display:table;clear:both}.confirme-popup-container .confirme-buttons li{float:left;width:50%}.confirme-popup-container .confirme-buttons a{display:block;text-transform:uppercase;color:#FFF;-webkit-transition:background-color .2s;-moz-transition:background-color .2s;transition:background-color .2s}.confirme-popup-container .confirme-buttons li:first-child a{background:#fc7169}.no-touch .confirme-popup-container .confirme-buttons li:first-child a:hover{background-color:#fc8982}.confirme-popup-container .confirme-buttons li:last-child a{background:#b6bece}.no-touch .confirme-popup-container .confirme-buttons li:last-child a:hover{background-color:#c5ccd8}.confirme-popup-container .confirme-popup-close{position:absolute;top:8px;right:8px;width:30px;height:30px}.confirme-popup-container .confirme-popup-close::after,.confirme-popup-container .confirme-popup-close::before{content:'';position:absolute;top:12px;width:14px;height:3px;background-color:#8f9cb5}.confirme-popup-container .confirme-popup-close::before{-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);-ms-transform:rotate(45deg);-o-transform:rotate(45deg);transform:rotate(45deg);left:8px}.confirme-popup-container .confirme-popup-close::after{-webkit-transform:rotate(-45deg);-moz-transform:rotate(-45deg);-ms-transform:rotate(-45deg);-o-transform:rotate(-45deg);transform:rotate(-45deg);right:8px}.is-visible .confirme-popup-container{-webkit-transform:translateY(0);-moz-transform:translateY(0);-ms-transform:translateY(0);-o-transform:translateY(0);transform:translateY(0)}@media only screen and (min-width:1170px){.confirme-popup-container{margin:8em auto}}</style>");
        }
        initialize(settings);
    };
    $.confirMe.defaults = _defaults;
    $.confirMe.close = function(button) {
        var button = button || null,
            elm;
        if (button == null) {
            elm = $($(".confirme-popup.is-visible").get(this.length - 1));
        } else {
            elm = button.parents(".confirme-popup.is-visible");
        }
        elm.removeClass('is-visible');
        setTimeout(function() {
            elm.remove();
        }, 200)
    };
    _doc.keyup(function(event) {
        if (event.which == '27') $.confirMe.close();
    });
})(window.jQuery, window, document);
