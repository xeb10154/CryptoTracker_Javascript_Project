const PubSub = require('../helpers/pub_sub.js')

const IndividualCoinView = function(container){

  this.container = container;

};

IndividualCoinView.prototype.bindEvents = function () {
  PubSub.subscribe('coin:chosen-coin-price-History', (event) => {
    const priceHistory = event.detail;
    this.render(priceHistory)
  })
};

IndividualCoinView.prototype.render = function (priceHistory) {
  this.chartData = (this.priceHistoryFormat(priceHistory, 20));

  this.container.innerHTML = '';
  const header = document.createElement('h1');
  header.textContent = priceHistory[0].name;
  this.container.appendChild(header)
  this.makeChart(this.chartData);
  this.weeklyGain(priceHistory);
  this.monthlyGain(priceHistory)

};

IndividualCoinView.prototype.monthlyGain = function (priceHistory) {
  const monthlyChange = ((priceHistory[30].close - priceHistory[0].close) / priceHistory[0].close)*100 ;
  console.log(monthlyChange);
};

IndividualCoinView.prototype.weeklyGain = function (priceHistory) {

const weeklyChange = ((priceHistory[7].close - priceHistory[0].close) / priceHistory[0].close)*100 ;
console.log(weeklyChange);

};

IndividualCoinView.prototype.makeChart = function () {
  const chartDiv = document.createElement('div')
  chartDiv.id = "price-history";
  this.container.appendChild(chartDiv)

  const chartFunction = document.createElement('script')
  chartFunction.textContent = google.charts.load('current', {'packages':['corechart']});

  const drawChart = () => {
    var data = google.visualization.arrayToDataTable(this.chartData);

    // Optional; add a title and set the width and height of the chart
    var options = {
      title: 'Coin Price USD',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.LineChart(document.getElementById('price-history'));
    chart.draw(data, options);
  }

  google.charts.setOnLoadCallback(drawChart);
};


IndividualCoinView.prototype.priceHistoryFormat = function (priceHistory,timeFrame = 365) {
  const priceHistoryClone = JSON.parse(JSON.stringify( priceHistory));
  const priceHistoryTime = priceHistoryClone.splice(0, timeFrame)
  let priceHistoryArray = [];
  let priceHistoryArrayHeaders = ["Date","close"];
  priceHistoryArray.push(priceHistoryArrayHeaders);
  priceHistoryTime.forEach((priceEvent) => {
    let dailyPrice = [];
    console.log(priceEvent.date);
    dailyPrice.push(new Date(priceEvent.date))
    dailyPrice.push(parseFloat(priceEvent.close))
    priceHistoryArray.push(dailyPrice)
  })
  priceHistoryArray = priceHistoryArray.sort((a,b) => {
    return a[0]-b[0];
  })
  return priceHistoryArray;
};


module.exports = IndividualCoinView;
