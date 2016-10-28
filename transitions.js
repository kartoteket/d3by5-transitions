/*!
 * Tranitions
 *
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'd3'] , factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('d3'));
    } else {
        // Browser globals (root is window)
        root.returnExports = factory(root._, root.d3);
    }
}(this, function (_, d3) {

'use:strict';

function transitions() {
/**
 * The transitions are an object that applies transitions to different types of visualisation
 * Some transitions are bound to a type, some are common
 * @type {Object}
 *       - pie - Pie Chart transitions
 *
 * Usage:
 * add a transition
 */
  var transition = {

      transition_duration: 1000, // default speed, update using base.transitionSpeed()

      transition_getMethodName: function (type, value) {
        return 'transition_' + type + '_' + value;
      },

      /**
       * Sets the speed a transition should be executed (in MS)
       * @param  {Numver} value - the speed in ms
       * @return {Mixed}        - the value or chart
       */
      transitionSpeed: function (value) {
        if (!arguments.length) return this.transition_duration;
        this.transition_duration = value;
        return this;
      },

      /**
       * Sets the type of transition to be used for the next action
       * @param  {String} value - the name of the transition.
       *                          The transitions is found by attempting to get it from the chart type in the form of (bartType.transition, ie pie.fromSelection)
       *                          If the first attempt fails it will look for it in common.transition
       * @return {Mixed}        - the value or chart
       */
      transition:  function (value, selection) {
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
       },

      /**
       * Builds an object with the 
       * @param  {[type]} value [description]
       * @return {[type]}       [description]
       */
      transition_getTransition: function (value) {
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
      },

      transition__shared: {

      },

    /**
     * Transforms a pie from a segment.
     * The segment is expanded to fill the whole pie, then the new data is applied
     * @return {object} The chart
     */
    transition_pie_fromSelection: function (data, target) {
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
    }
  };
  return transition;
}

return transitions();
}));