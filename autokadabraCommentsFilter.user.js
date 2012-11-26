// ==UserScript==
// @name autokadabraCommentsFilter
// @description filter comments by rating
// @author Alexander Ivantsov
// @license MIT
// @version 1.1
// @include http://autokadabra.ru/shouts/*
// ==/UserScript==

if ('undefined' == typeof __PAGE_SCOPE_RUN__) {
  (function page_scope_runner(){
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";
    var script = document.createElement('script');

    script.setAttribute("type", "text/javascript");
    script.textContent = "var __PAGE_SCOPE_RUN__ = true;\n" + my_src;

    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 0);
  })();

  return;
};

function filterComments(){
    (function($){
        var inp = "<p style='color: #fff'>Мин рейтинг: <input id='min-comment-rating' style='width: 30px' type='text' value='0' /></p>";
        var btn = "<button id='filter-comments' style='margin-top: 10px'>Отфильтровать камменты</button>";
        var div = "<div class='comments_control' style='opacity: 0.5; position: fixed; top: 50px; right: 0; background-color: #2e2e2e; padding: 10px 30px 10px 10px'><div style='position: relative'>" + inp + btn + "<a id='hidePanel' href='javascript:void(0)' style='color: #fff; position: absolute; right: -25px; top: -5px; text-decoration: none; font-size: 20px; font-weight: bold; text-shadow: 0 1px 0 #FFFFFF'>×</a></div></div>";

        $("body").append(div);

        function filterComments() {
            var minRating = parseInt($("#min-comment-rating").val());
            var rating;

            /* выставляем класс 'cool_comment' для каментав с нужным рейтингом */
            $(".comments .comment").each(function () {
                if ($(this).find(".article .vote").hasClass("has_vote")) rating = parseInt($(this).find(".article .vote .count").html());
                else rating = 0;

                if (rating >= minRating) $(this).addClass("cool_comment");
            });

            /* 
             * скрываем отстойные каменты
             * добавляем кнопку, чтобы показать ответы для данного камента 
             */
            $(".comments .comment").each(function () {
                if (!$(this).hasClass("cool_comment") && $(this).find(".cool_comment").length == 0) $(this).hide();
                else if ($(this).hasClass("cool_comment") && $(this).find(".cool_comment").length == 0 && $(this).find(".reply_link .show_reply").length == 0 && $(this).find(".reply_link").length > 1) $(this).find(".reply_link").eq(0).append("<a class='show_reply' style='float: right' href='javascript:void(0)'>Показать ответы</a>");
            });
        };

        /* сброс фильтров */
        function refreshComments() {
            $(".cool_comment").each(function () {
                $(this).removeClass("cool_comment");
                $(this).find(".show_reply").remove();
            });

            $(".comments .comment").each(function () {
                $(this).show();
            });
        };

        var toggleBtn = 0; // 0 - фильтр, 1 - отменить фильтр

        $("#filter-comments").click(function () {
            /* запуск фильтра */
            if (!toggleBtn) {
                $("#filter-comments").css("margin-top", 0);
                filterComments();
                toggleBtn = 1;
                $("#min-comment-rating").parent().slideUp();
                $(this).html("Сбросить фильтр");
            }
            /* сбросить фильтр */
            else {
                $("#filter-comments").css("margin-top", "10px");
                refreshComments();
                toggleBtn = 0;
                $("#min-comment-rating").parent().slideDown();
                $(this).html("Отфильтровать камменты");
            };
        });

        var togglePanel = 0; // 0 - открыто, 1 - свернуто

        /* скрыть панель */
        $("#hidePanel").click(function (event) {
            event.stopPropagation();

            togglePanel = 1;
            $(".comments_control").animate({
                paddingLeft: "+=20",
                right: -$(".comments_control").width() - 30
            }, 1000);
        });

        /* открыть панель */
        $(".comments_control").click(function () {
            if (togglePanel == 0) return 0;
            togglePanel = 0;
            $(this).animate({
                paddingLeft: "-=20",
                right: 0
            }, 1000);
        });

        /* управление прозрачностью панели */
        $(".comments_control").hover(function () {
            $(this).css("opacity", 1);
        }, function () {
            $(this).css("opacity", 0.5);
        });


        /* показать скрытые ответы */
        $(document).on("click", ".show_reply", function () {
            var parent;

            /* если ответы скрыты */
            if ($(this).html() == "Показать ответы") {
                $(this).html("Скрыть ответы");

                parent = $(this).closest(".comment");

                parent.find(".comment").each(function () {
                    $(this).show();
                });
            }
            /* если ответы открыты */
            else {
                $(this).html("Показать ответы");

                parent = $(this).closest(".comment");

                parent.find(".comment").each(function () {
                    if (!$(this).hasClass("cool_comment") && $(this).find(".cool_comment").length == 0) $(this).hide();
                });
            }
        });
    })(jQuery);
};

filterComments();