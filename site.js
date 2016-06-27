$(document).ready(function() {

  $(window).scroll(function () {
    if ($(window).scrollTop() > 132) {
      $('#grade-box').addClass('grade-box-fixed');
      $('body').addClass('grade-box-fixed');
    }

    if ($(window).scrollTop() < 133) {
      $('#grade-box').removeClass('grade-box-fixed');
      $('body').removeClass('grade-box-fixed');
    }
  });


  $("li > a").click(function() {
    if ($(this).hasClass("selected")) {
      $(this).toggleClass("selected");
    } else {
      $(this).parent().parent().children().each(function() {
        $(this).children().removeClass("selected");
      });
      $(this).addClass("selected");
    }

    if (typeof(window.localStorage) === "object") {
      var json = window.localStorage.hawAiGradeCalculator || "{}";
      var grades = JSON.parse(json);
      var course = $(this).parent().parent().parent().attr("id");
      if ($(this).hasClass("selected")) {
        grades[course] = $(this).html();
      } else {
        delete grades[course];
      }
      window.localStorage.setItem("hawAiGradeCalculator", JSON.stringify(grades));
    }

    calculate();
    return false;
  });

  function calculate() {
    var totalGradeWeight = 0.0;
    var points = 0.0;
    var selected = $(".selected");
    selected.each(function() {
      var parent = $(this).parent().parent().parent();
      points += parseFloat($(this).html()) * parent.data("credit-points");
      totalGradeWeight += parent.data("credit-points");
    });
    if (totalGradeWeight == 0) {
      $("#grade").text(0);
    } else {
      $("#grade").text(Math.round((points/totalGradeWeight)*10)/10);
    }
    $("#calculated-points").text("(" + points + " Punkte)");
  }

  $("#calculated-points").click(function() {
    $("#infobox").toggle();
    return false;
  });

  // pre-select remembered grades
  if (typeof(window.localStorage) === "object") {
    var json = window.localStorage.getItem("hawAiGradeCalculator");
    if (json !== null) {
      var grades = JSON.parse(window.localStorage.getItem("hawAiGradeCalculator"));
      for (var course in grades) {
        if (grades.hasOwnProperty(course)) {
          var grade = parseInt(grades[course], 10);
          $("#" + course + " li:nth-child(" + (15 - grade + 1) + ") a").addClass("selected");
        }
      }
    }
    calculate();
  }
});
