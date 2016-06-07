# d3by5-transitions
The d3by5-transitions is part of the d3by5 graph tools, this specific package will apply tranitions to the visualisations created by a d3by5 graph

## NOTE
This is an internal project, you are probably better off using somethin like [C3](https://github.com/c3js/c3). That said, just give it a try and contact us back (no capslock please).

## DEPENDENCIES
Two dependencies in package.json
* Underscore
* d3

```
npm install
```
will get you all you need

## API
This class extends the [d3by5-base-graph](https://github.com/kartoteket/d3by5-base-chart) with the following:

* transition  - String: a named transition to apply
                - shared
                - pie
                    + fromSelection - transforms a pie by growing the selected pie segment until it covers the whole of the circle
                - bar
* transitionSpeed - Number: the duration of a transition in ms


## EXAMPLE
The transitions apply a set of new transitions that can be invoked directly using chart.apply() or being set with chart.transition()

### chart.apply()
```javascript
var piechart = piechart()
                    .width(500)
                    .height(400)
                    .data([{label:'coffee', values: 509}, {label:'tea', values: 1}])
                    .on('click', function (d) {
                        piechart.apply({transition: 'fromSelection',
                                        data: [{label: 'beer', values: 2}, {label:'wine', values: 4}],
                                        target: d});
                    })

d3.select('.js-pie-chart')
    .call(piechart.init());

```

### chart.transition()
```javascript
var piechart = piechart()
                    .width(500)
                    .height(400)
                    .transition('fromSelection')
                    .transitionSpeed(500)
                    .data([{label:'coffee', values: 509}, {label:'tea', values:

d3.select('.js-pie-chart')
    .call(piechart.init());

```

## LICENCE
[MIT](https://opensource.org/licenses/MIT)
