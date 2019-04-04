
  var selectR = document.getElementById("chooseYearR");
  var selectT = document.getElementById("chooseYearT");
  var options = getArrayYear(2010);

  generateSelect(selectR, options)
  generateSelect(selectT, options)

  window.onload = function(){
    $('#chooseYearR').val(selectR.options[options.length-1].value).trigger('change');
    $('#chooseYearT').val(selectT.options[options.length-1].value).trigger('change');
  }

  let myChart = null;
  $("#chooseYearR").change(function(){
    let year = selectR.options[selectR.selectedIndex].value;
    $.ajax({
      url: `/admin/statictical-year/${year}`,
      type: "get",
      dataType: 'json',
      success: function(result){
        var ctx = document.getElementById("revenueChart").getContext("2d");
            if(myChart)
              myChart.destroy();
            myChart = new Chart( ctx, {
            type: 'bar',
            data: {
                labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                datasets: [

                    {
                        label: "Tổng tiền trong tháng",
                        data: result.t,
                        borderColor: "rgba(0, 123, 255, 0.9)",
                        borderWidth: "0",
                        backgroundColor: "rgba(0, 123, 255, 0.5)"
                                }
                            ]
            },
            options: {
                scales: {
                    yAxes: [ {
                        ticks: {
                            beginAtZero: true
                        }
                                    } ]
                }
            }
        });

      }});
  })

  var ctx2 = document.getElementById( "transactionChart" );
  let myChart2 = null;
  $("#chooseYearT").change(function(){
    let year = selectT.options[selectT.selectedIndex].value;
    $.ajax({
      url: `/admin/statictical-year/${year}`,
      type: "get",
      dataType: 'json',
      success: function(result){
        if(myChart2)
            myChart2.destroy();
        myChart2 = new Chart( ctx2, {
            type: 'line',
            data: {
                labels: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                type: 'line',
                defaultFontFamily: 'Montserrat',
                datasets: [ {
                    data: result.s,
                    label: "Expense",
                    backgroundColor: 'rgba(0,103,255,.15)',
                    borderColor: 'rgba(0,103,255,0.5)',
                    borderWidth: 3.5,
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointBorderColor: 'transparent',
                    pointBackgroundColor: 'rgba(0,103,255,0.5)',
                        }, ]
            },
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                    titleFontSize: 12,
                    titleFontColor: '#000',
                    bodyFontColor: '#000',
                    backgroundColor: '#fff',
                    titleFontFamily: 'Montserrat',
                    bodyFontFamily: 'Montserrat',
                    cornerRadius: 3,
                    intersect: false,
                },
                legend: {
                    display: false,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        fontFamily: 'Montserrat',
                    },


                },
                scales: {
                    xAxes: [ {
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: false,
                            labelString: 'Month'
                        }
                            } ],
                    yAxes: [ {
                        display: true,
                        gridLines: {
                            display: false,
                            drawBorder: false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Value'
                        }
                            } ]
                },
                title: {
                    display: false,
                }
            }
        });
      }
    });
  })

  function getArrayYear(startYear){
    var currentYear = new Date().getFullYear(), years = [];
    startYear = startYear || 1980;
    while ( startYear <= currentYear ){
        years.push(startYear++);
    }
    return years;
  }

  function generateSelect(select, options){
    for(let item in options){
      var opt = options[item];
      var ele = document.createElement("option");
      ele.textContent = opt;
      ele.value = opt;
      select.append(ele);
    }
  }
