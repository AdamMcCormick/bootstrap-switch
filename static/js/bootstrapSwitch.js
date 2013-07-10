/* ============================================================
 * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function ($) {
  "use strict";

  $.fn['bootstrapSwitch'] = function (method) {
    var methods = {
      init: function () {
        return this.each(function () {
            var $element = $(this)
              , $div
              , $slider
              , $switchLeft
              , $switchRight
              , $label
              , myClasses = ""
              , classes = $element.attr('class')
              , color
              , moving
              , onLabel = "ON"
              , offLabel = "OFF"
              , icon = false;

            $.each(['switch-mini', 'switch-small', 'switch-large'], function (i, el) {
              if (classes.indexOf(el) >= 0)
                myClasses = el;
            });

            $element.addClass('has-switch');

            if ($element.data('on') !== undefined)
              color = "switch-" + $element.data('on');

            if ($element.data('on-label') !== undefined)
              onLabel = $element.data('on-label');

            if ($element.data('off-label') !== undefined)
              offLabel = $element.data('off-label');

            if ($element.data('icon') !== undefined)
              icon = $element.data('icon');

            $switchLeft = $('<span>')
              .addClass("switch-left")
              .addClass(myClasses)
              .addClass(color)
              .html(onLabel);

            color = '';
            if ($element.data('off') !== undefined)
              color = "switch-" + $element.data('off');

            $switchRight = $('<span>')
              .addClass("switch-right")
              .addClass(myClasses)
              .addClass(color)
              .html(offLabel);

            $label = $('<label>')
              .html("&nbsp;")
              .addClass(myClasses)
              .addClass("switch-off")
              .attr('for', $element.find('input').attr('id'));

            if (icon) {
              $label.html('<i class="icon icon-' + icon + '"></i>');
            }
            $element.prepend($label);

            $slider = $element.find(':checkbox').wrap($('<div>').addClass("slider")).parent().data('animated', false);

            if ($element.data('animated') !== false)
              $slider.addClass('switch-animate').data('animated', true);

            $slider
              .append($switchLeft)
              .append($switchRight);
            
            $div = $slider.wrap($('<div>').addClass("sliderMask"));

            $div.addClass(
              $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
            );

            if ($element.find('input').is(':disabled'))
              $(this).addClass('deactivate');

            var changeStatus = function ($this) {
              $this.closest('.switch').find('label').trigger('mousedown').trigger('mouseup').trigger('click');
            };

            $element.on('keydown', function (e) {
              if (e.keyCode === 32) {
                e.stopImmediatePropagation();
                e.preventDefault();
                changeStatus($(e.target).find('span:first'));
              }
            });

            $switchLeft.on('click', function (e) {
              changeStatus($(this));
            });

            $switchRight.on('click', function (e) {
              changeStatus($(this));
            });

            $element.find('input').on('change', function (e, skipOnChange) {
              var $this = $(this)
                , $element = $this.parent()
                , thisState = $this.is(':checked')
                , state = $element.is('.switch-off')
                , $switch = $element.closest(".switch")
                , $label = $switch.find("label");

              e.preventDefault();

              $element.css('left', '');

              if ($element.data('animated') !== false) {
                $label.addClass("switch-animate");
                $element.addClass("switch-animate");
              }
              
              $label.trigger('switch-change', thisState);

              if (state === thisState) {

                if (thisState) {
                  $element.removeClass('switch-off').addClass('switch-on');
                }
                else {
                  $element.removeClass('switch-on').addClass('switch-off');
                }

                if (typeof skipOnChange === 'boolean' && skipOnChange)
                  return;

                $switch.trigger('switch-change', {'el': $this, 'value': thisState});
              }
            });
            
            $element.find('label').on('switch-change', function (e, value) {
              var $this = $(this)
                , $element = $this.closest('.switch')
                , trackLength = $element.width()
                , sliderWidth = $this.width()
                , sliderOffset = trackLength - sliderWidth;
              
              console.log(value);
              $this.css('left' , value ? sliderOffset + "px": '1px');
              
              if(value) {
                $label.removeClass('switch-off').addClass('switch-on');
              }
              else {
                $label.removeClass('switch-on').addClass('switch-off');
              }
            });

            $element.find('label').on('mousedown touchstart', function (e) {
              var $this = $(this);
              moving = false;
              
              e.preventDefault();
              e.stopImmediatePropagation();

              $this.removeClass('switch-animate');
              $this.siblings().children(".slider").removeClass('switch-animate');

              if ($this.closest('.has-switch').is('.deactivate'))
                $this.unbind('click');
              
              else {
                var $element = $this.closest('.switch')
                  , $slider = $element.find('.slider')
                  , trackLength = $element.width()
                  , labelWidth = $this.width()
                  , sliderOffset = ($slider.width()-trackLength+labelWidth/2)/trackLength
                  , labelOffset = (labelWidth/2)/trackLength
                  , leftLimit = labelOffset
                  , rightLimit = 1 - labelOffset;
                
                $this.on('mousemove touchmove', function (e) {
                  var baseX = (e.pageX || e.originalEvent.targetTouches[0].pageX)
                    , relativeX = baseX - $element.offset().left
                    , percent = (relativeX / trackLength);

                  moving = true;

                  if (percent < leftLimit)
                    percent = leftLimit;
                  else if (percent > rightLimit)
                    percent = rightLimit;
                  
                  console.log(percent + ", " + leftLimit + ", " + rightLimit);
                  console.log(sliderOffset);

                  // Get this using the actual label location instead of 75%
                  $element.find('.slider').css('left', ((percent - sliderOffset) * 100) + "%");
                  $element.find('label').css('left', ((percent - labelOffset) * 100) + "%");
                });

                $this.on('click touchend', function (e) {
                  var $this = $(this)
                    , $myCheckBox = $this.siblings().find('input');

                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $this.unbind('mouseleave');

                  if (moving)
                    $myCheckBox.prop('checked', !(parseInt($myCheckBox.parent().css('left')) < -25));
                  else 
                    $myCheckBox.prop("checked", !$myCheckBox.is(":checked"));

                  moving = false;
                  $myCheckBox.trigger('change');
                });

                $this.on('mouseleave', function (e) {
                  var $this = $(this)
                    , $myCheckBox = $this.siblings().find('input');

                  e.preventDefault();
                  e.stopImmediatePropagation();

                  $this.unbind('mouseleave');
                  $this.trigger('mouseup');

                  $myCheckBox.prop('checked', !(parseInt($myCheckBox.parent().css('left')) < -25)).trigger('change');
                });

                $this.on('mouseup', function (e) {
                  e.stopImmediatePropagation();
                  e.preventDefault();

                  $(this).unbind('mousemove');
                });
              }
            });
          }
        );
      },
      toggleActivation: function () {
        $(this).toggleClass('deactivate');
      },
      isActive: function () {
        return !$(this).hasClass('deactivate');
      },
      setActive: function (active) {
        if (active)
          $(this).removeClass('deactivate');
        else $(this).addClass('deactivate');
      },
      toggleState: function (skipOnChange) {
        var $input = $(this).find('input:checkbox');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      setState: function (value, skipOnChange) {
        $(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
      },
      status: function () {
        return $(this).find('input:checkbox').is(':checked');
      },
      destroy: function () {
        var $div = $(this).find('div')
          , $checkbox;

        $div.find(':not(input:checkbox)').remove();

        $checkbox = $div.children();
        $checkbox.unwrap().unwrap();

        $checkbox.unbind('change');

        return $checkbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);

$(function () {
  $('.switch')['bootstrapSwitch']();
});
