'use:strict';
// var d3 = require('d3');
var t = {};
// define d3by5-transitions-chart for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') {
  var d3 = require('d3');
  var _ = require('underscore');
  module.exports = t;

// define d3by5_PieChart as an AMD module
} else if (typeof define === 'function' && define.amd) {
  var d3 = require('d3');
  var _ = require('underscore');
  define(t);

// define the transitions in a global namespace d3By5
} else {
  Window.d3By5 = Window.d3By5 || {};
  Window.d3By5.transitions = t;
}
/**
 * The transitions are an object that applies transitions to different types of visualisation
 * Some transitions are bound to a type, some are common
 * @type {Object}
 *       - pie - Pie Chart transitions
 *
 * Usage:
 * add a transition
 */
t.transition_duration = 1000; // default speed, update using base.transitionSpeed()

t.transition_getMethodName = function (type, value) {
  return 'transition_' + type + '_' + value;
};

    /**
     * Sets the speed a transition should be executed (in MS)
     * @param  {Numver} value - the speed in ms
     * @return {Mixed}        - the value or chart
     */
    t.transitionSpeed = function (value) {
      if (!arguments.length) return this.transition_duration;
      this.transition_duration = value;
      return this;
    };

    /**
     * Sets the type of transition to be used for the next action
     * @param  {String} value - the name of the transition.
     *                          The transitions is found by attempting to get it from the chart type in the form of (bartType.transition, ie pie.fromSelection)
     *                          If the first attempt fails it will look for it in common.transition
     * @return {Mixed}        - the value or chart
     */
    t.transition = function (value, selection) {
      if (!arguments.length) {
        if (this.options.transition) {
          return this.options.transition.name;
        }
        return 'none';
      }
      if (typeof this.transition_getTransition === 'function') {
        this.options.transition = this.transition_getTransition(value, selection);
      } else {
        console.error('no transitions loaded');
      }
      return this;
     };

      /**
       * Builds an object with the 
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      t.transition_getTransition = function (value) {
        var type = 'pie'
          , methodName = this.transition_getMethodName(type, value)
          , sharedMethodName = this.transition_getMethodName('shared', value)
        ;
        if (this[methodName]) {
          return {t: _.bind(this[methodName], this),
                  name: value};
        }
        else if (this[sharedMethodName]) {
          return {t: _.bind(this[sharedMethodName], this),
                  name: value};
        }
        else {
          console.error('no transition with the name ', value, ' found');
          return {t: null,
                  name: value};
        }
      };

t.transition__shared = {

};
  /**
   * Transforms a pie from a segment.
   * The segment is expanded to fill the whole pie, then the new data is applied
   * @return {object} The chart
   */
t.transition_pie_fromSelection = function (data, target) {
  var label = target ? target.data.label : ''
    , outData
    , path
    , tsize
    , that = this
    // apply the tween
    , arcTween = function (a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
              return that.arc(i(t));
            };
          } // redraw the arcs
  ;

  // remove values from all but the clicked node (to enable this to take the whole space)
  outData = _.map(this.options.data, function (d) {
    if (d.label !== label) {
      d.values = 0;
    }
    return d;
  });

  tsize = outData.length;

  //data join
  path = this.svg
            .selectAll("path")
            .data(this.pie(outData), function (d) {
              return d.data.label;
            });

    // update, transition
    path.transition()
        .duration(this.transition_duration)
        .attrTween("d", arcTween)
        .each('end', function (d) {
          tsize -= 1;
          if (tsize === 0) {
            that.data(data); // call the base.data to update
          }
        });
      // remove unused data
    path.exit()
        .transition()
        .attrTween("d", arcTween)
        .remove();


  return this;
};